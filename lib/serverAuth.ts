import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export interface AuthenticatedUser {
  id: string;
  email: string;
  plan_type: string;
  api_credits: number;
  max_credits: number;
  full_name?: string | null;
}

/**
 * Extracts and verifies the Supabase session token from the Request headers.
 * Returns the authenticated user and profile, or null if unauthenticated / invalid.
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return null;

    // Verify token cryptographically with Supabase Auth
    const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);
    if (authErr || !user) {
      return null;
    }

    const isOwner = user.email === 'adarshverma3655@gmail.com';
    const isVIP = user.email === 'skyboundkrypton@gmail.com';
    const isOwnerOrVIP = isOwner || isVIP;

    // Fetch user profile from database
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileErr) {
      console.warn('[serverAuth] Profile fetch error:', profileErr.message);
    }

    if (profile) {
      if (isOwnerOrVIP && (profile.api_credits < 9999 || profile.plan_type !== 'lifetime')) {
        return {
          id: user.id,
          email: user.email || '',
          plan_type: 'lifetime',
          api_credits: 9999,
          max_credits: 9999,
          full_name: profile.full_name,
        };
      }

      return {
        id: profile.id,
        email: profile.email || user.email || '',
        plan_type: profile.plan_type || 'free',
        api_credits: Number(profile.api_credits) || 0,
        max_credits: Number(profile.max_credits) || 100,
        full_name: profile.full_name,
      };
    }

    // Default fallback if profile is missing in DB
    return {
      id: user.id,
      email: user.email || '',
      plan_type: isOwnerOrVIP ? 'lifetime' : 'free',
      api_credits: isOwnerOrVIP ? 9999 : 0,
      max_credits: isOwnerOrVIP ? 9999 : 100,
    };
  } catch (err: any) {
    console.error('[serverAuth] Error verifying session:', err?.message);
    return null;
  }
}

/**
 * Checks whether the user has sufficient credits to perform a paid search.
 */
export function hasSufficientCredits(user: AuthenticatedUser | null, requiredCredits = 10): boolean {
  if (!user) return false;
  if (user.plan_type === 'lifetime') return true;
  return user.api_credits >= requiredCredits;
}

/**
 * Securely deducts credits from a user's profile on the server side.
 * Returns the updated remaining credits.
 */
export async function deductUserCreditsServer(userId: string, amount = 10): Promise<number> {
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('api_credits, plan_type')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) return 0;
    if (profile.plan_type === 'lifetime') return 9999;

    const currentCredits = Number(profile.api_credits) || 0;
    const newCredits = Math.max(0, currentCredits - amount);

    await supabaseAdmin
      .from('profiles')
      .update({ api_credits: newCredits })
      .eq('id', userId);

    return newCredits;
  } catch (err: any) {
    console.error('[serverAuth] Error deducting credits:', err?.message);
    return 0;
  }
}
