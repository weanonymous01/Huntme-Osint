-- ==========================================================
-- HUNTME OSINT PLATFORM - SUPABASE DATABASE SCHEMA
-- ==========================================================

-- 1. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'monthly', 'lifetime')),
  api_credits INTEGER DEFAULT 0,
  max_credits INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Phone Searches Table
CREATE TABLE IF NOT EXISTS public.phone_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL,
  carrier TEXT,
  circle TEXT,
  risk_score INTEGER DEFAULT 12,
  status TEXT DEFAULT 'Completed' CHECK (status IN ('Completed', 'Processing', 'Failed')),
  telemetry_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Vehicle Searches Table
CREATE TABLE IF NOT EXISTS public.vehicle_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plate_number TEXT NOT NULL,
  make_model TEXT,
  rto_location TEXT,
  status TEXT DEFAULT 'Completed' CHECK (status IN ('Completed', 'Processing', 'Failed')),
  vehicle_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Investigation Reports Table
CREATE TABLE IF NOT EXISTS public.investigation_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  report_code TEXT NOT NULL,
  title TEXT NOT NULL,
  query_type TEXT CHECK (query_type IN ('phone', 'vehicle', 'ai_case')),
  summary TEXT,
  confidence_score INTEGER DEFAULT 95,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigation_reports ENABLE ROW LEVEL SECURITY;

-- Profiles Policy: Users can view, insert & update their own profile
CREATE POLICY "Allow individual read on profiles" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow individual insert on profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow individual update on profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Phone Searches Policy: Users can view & insert their own searches
CREATE POLICY "Allow user read on phone_searches" ON public.phone_searches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on phone_searches" ON public.phone_searches FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Vehicle Searches Policy: Users can view & insert their own searches
CREATE POLICY "Allow user read on vehicle_searches" ON public.vehicle_searches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on vehicle_searches" ON public.vehicle_searches FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reports Policy: Users can view & insert their own reports
CREATE POLICY "Allow user read on investigation_reports" ON public.investigation_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on investigation_reports" ON public.investigation_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================================
-- TRIGGER: Automatically Create Profile on Signup
-- ==========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, api_credits, max_credits, plan_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    CASE WHEN NEW.email IN ('adarshverma3655@gmail.com', 'skyboundkrypton@gmail.com') THEN 9999 ELSE 0 END,
    CASE WHEN NEW.email IN ('adarshverma3655@gmail.com', 'skyboundkrypton@gmail.com') THEN 9999 ELSE 100 END,
    CASE WHEN NEW.email IN ('adarshverma3655@gmail.com', 'skyboundkrypton@gmail.com') THEN 'lifetime' ELSE 'free' END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================================
-- RPC FUNCTION: Security Definer Topup (Bypasses RLS safely for webhooks)
-- ==========================================================

CREATE OR REPLACE FUNCTION public.topup_user_credits(
  p_email TEXT,
  p_credits INT,
  p_plan TEXT DEFAULT 'monthly'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile RECORD;
  v_user_id UUID;
  v_new_credits INT;
  v_new_max INT;
BEGIN
  -- 1. Search in public.profiles by email (case-insensitive)
  SELECT * INTO v_profile FROM public.profiles WHERE LOWER(email) = LOWER(p_email) LIMIT 1;

  IF v_profile.id IS NOT NULL THEN
    v_new_credits := COALESCE(v_profile.api_credits, 0) + p_credits;
    v_new_max := GREATEST(COALESCE(v_profile.max_credits, 100), v_new_credits);

    UPDATE public.profiles
    SET api_credits = v_new_credits,
        max_credits = v_new_max,
        plan_type = CASE WHEN plan_type = 'lifetime' THEN 'lifetime' ELSE p_plan END
    WHERE id = v_profile.id;

    RETURN jsonb_build_object(
      'success', true,
      'message', 'Credits added successfully',
      'email', v_profile.email,
      'previousCredits', v_profile.api_credits,
      'addedCredits', p_credits,
      'newCredits', v_new_credits,
      'planType', CASE WHEN v_profile.plan_type = 'lifetime' THEN 'lifetime' ELSE p_plan END
    );
  END IF;

  -- 2. If not found in profiles, search auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(p_email) LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, api_credits, max_credits, plan_type)
    VALUES (v_user_id, LOWER(p_email), p_credits, GREATEST(100, p_credits), p_plan)
    ON CONFLICT (id) DO UPDATE
    SET api_credits = public.profiles.api_credits + EXCLUDED.api_credits,
        max_credits = GREATEST(public.profiles.max_credits, public.profiles.api_credits + EXCLUDED.api_credits);

    RETURN jsonb_build_object(
      'success', true,
      'message', 'Profile created and credits added for Auth user',
      'email', LOWER(p_email),
      'previousCredits', 0,
      'addedCredits', p_credits,
      'newCredits', p_credits,
      'planType', p_plan
    );
  END IF;

  RETURN jsonb_build_object(
    'success', false,
    'message', 'User email not found'
  );
END;
$$;

