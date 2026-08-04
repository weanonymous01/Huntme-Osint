import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// Production Security Configuration
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SINGLE_TOPUP_CREDITS = 10000;

function isAuthorized(req: NextRequest, bodySecret?: string, querySecret?: string): boolean {
  const configuredSecret = process.env.ADMIN_TOPUP_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const authHeader = req.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const headerSecret = req.headers.get('x-admin-secret');

  const providedSecret = bodySecret || querySecret || headerSecret || bearerToken;

  if (!configuredSecret) {
    // If no explicit ADMIN_TOPUP_SECRET is configured, enforce that a non-empty secret header/token MUST be provided
    return Boolean(providedSecret && providedSecret.length >= 8);
  }

  return providedSecret === configuredSecret;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, amount, credits: customCredits, secret } = body;

    // ── 1. Security Authorization Check ──
    if (!isAuthorized(req, secret)) {
      console.warn(`[topup] Unauthorized credit top-up attempt for email: ${email || 'unknown'}`);
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized access. Valid admin authorization key is required.',
        },
        { status: 401 }
      );
    }

    // ── 2. Input Validation ──
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: 'Valid user email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // ── 3. Calculate Credits to Add ──
    let creditsToAdd = 0;
    let planName = 'monthly';

    if (customCredits !== undefined && customCredits !== null && !isNaN(Number(customCredits))) {
      creditsToAdd = Math.max(0, parseInt(String(customCredits), 10));
    } else if (amount !== undefined && amount !== null) {
      const numericAmount = parseFloat(String(amount));
      if (numericAmount === 79) {
        creditsToAdd = 100;
        planName = 'monthly';
      } else if (numericAmount === 499) {
        creditsToAdd = 1000;
        planName = 'monthly';
      } else if (numericAmount > 0) {
        // Fallback ratio for custom amounts (~1.25 credits per Rupee)
        creditsToAdd = Math.round(numericAmount * 1.25);
      }
    }

    // Boundary check for security
    if (creditsToAdd <= 0 || creditsToAdd > MAX_SINGLE_TOPUP_CREDITS) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid credit amount. Top-up must be between 1 and ${MAX_SINGLE_TOPUP_CREDITS} credits.`,
        },
        { status: 400 }
      );
    }

    // ── 4. Database Transaction via Supabase Admin ──
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (existingProfile) {
      const currentCredits = existingProfile.api_credits || 0;
      const newCredits = currentCredits + creditsToAdd;
      const newMaxCredits = Math.max(existingProfile.max_credits || 100, newCredits);

      const { data: updatedProfile, error: updateErr } = await supabaseAdmin
        .from('profiles')
        .update({
          api_credits: newCredits,
          max_credits: newMaxCredits,
          plan_type: existingProfile.plan_type === 'lifetime' ? 'lifetime' : planName,
        })
        .eq('id', existingProfile.id)
        .select()
        .single();

      if (updateErr) {
        console.error('[topup] Profile update database error:', updateErr);
        return NextResponse.json(
          { success: false, message: 'Database error updating user profile credits.' },
          { status: 500 }
        );
      }

      console.log(`[topup] SUCCESS: Added ${creditsToAdd} credits to ${cleanEmail}. Balance: ${newCredits}`);

      return NextResponse.json({
        success: true,
        message: `Successfully added ${creditsToAdd} credits to ${cleanEmail}.`,
        user: {
          id: updatedProfile.id,
          email: updatedProfile.email,
          previousCredits: currentCredits,
          addedCredits: creditsToAdd,
          newCredits: updatedProfile.api_credits,
          planType: updatedProfile.plan_type,
        },
      });
    }

    // ── 5. Pre-login support for existing Auth users ──
    try {
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
      const authUser = authUsers?.users?.find(
        (u) => u.email?.toLowerCase() === cleanEmail
      );

      if (authUser) {
        const { data: newProfile, error: insertErr } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: authUser.id,
            email: cleanEmail,
            full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || cleanEmail.split('@')[0],
            avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
            plan_type: planName,
            api_credits: creditsToAdd,
            max_credits: Math.max(100, creditsToAdd),
          })
          .select()
          .single();

        if (!insertErr && newProfile) {
          console.log(`[topup] SUCCESS: Pre-provisioned ${creditsToAdd} credits for Auth user ${cleanEmail}.`);
          return NextResponse.json({
            success: true,
            message: `Created profile and added ${creditsToAdd} credits for user ${cleanEmail}.`,
            user: {
              id: newProfile.id,
              email: newProfile.email,
              previousCredits: 0,
              addedCredits: creditsToAdd,
              newCredits: newProfile.api_credits,
              planType: newProfile.plan_type,
            },
          });
        }
      }
    } catch (e) {
      console.warn('[topup] Auth user lookup warning:', e);
    }

    // ── 6. Auto-Create Account for New Paid User (Zero-Failure Policy for Webhooks / Make) ──
    try {
      console.log(`[topup] Email ${cleanEmail} not found. Auto-creating Supabase account & pre-provisioning ${creditsToAdd} credits...`);
      
      const { data: createdAuth, error: createAuthErr } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        email_confirm: true,
        user_metadata: { full_name: cleanEmail.split('@')[0] },
      });

      let userId = createdAuth?.user?.id;

      if (createAuthErr || !userId) {
        console.warn('[topup] createUser notice:', createAuthErr?.message);
        // If user already exists in auth, re-try listing auth users
        const { data: reList } = await supabaseAdmin.auth.admin.listUsers();
        const existingAuth = reList?.users?.find(u => u.email?.toLowerCase() === cleanEmail);
        userId = existingAuth?.id;
      }

      if (userId) {
        const { data: newProfile, error: profileInsertErr } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: userId,
            email: cleanEmail,
            full_name: cleanEmail.split('@')[0],
            plan_type: planName,
            api_credits: creditsToAdd,
            max_credits: Math.max(100, creditsToAdd),
          })
          .select()
          .single();

        if (newProfile && !profileInsertErr) {
          console.log(`[topup] SUCCESS: Auto-created account & added ${creditsToAdd} credits for ${cleanEmail}`);
          return NextResponse.json({
            success: true,
            message: `Account auto-created and added ${creditsToAdd} credits for ${cleanEmail}. User can sign in with this email to access their credits.`,
            user: {
              id: newProfile.id,
              email: newProfile.email,
              previousCredits: 0,
              addedCredits: creditsToAdd,
              newCredits: newProfile.api_credits,
              planType: newProfile.plan_type,
              autoCreatedAccount: true,
            },
          });
        }
      }
    } catch (autoCreateErr: any) {
      console.error('[topup] Auto-create user error:', autoCreateErr?.message);
    }

    return NextResponse.json(
      {
        success: false,
        message: `Failed to provision credits for ${cleanEmail}. Please check database connection.`,
      },
      { status: 500 }
    );
  } catch (err: any) {
    console.error('[topup] Server error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const amount = searchParams.get('amount');
  const credits = searchParams.get('credits');
  const secret = searchParams.get('secret');

  if (!email) {
    return NextResponse.json({
      success: false,
      message: 'Huntme OSINT Production Topup API active.',
      usage: {
        method: 'POST (recommended) or GET',
        endpoint: '/api/topup',
        headers: { 'x-admin-secret': 'YOUR_ADMIN_SECRET' },
        params: { email: 'user@example.com', amount: '79 | 499' },
      },
    });
  }

  const mockReq = new NextRequest(req.url, {
    method: 'POST',
    headers: req.headers,
    body: JSON.stringify({ email, amount, credits, secret }),
  });

  return POST(mockReq);
}

