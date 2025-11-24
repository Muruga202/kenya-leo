-- ============================================================================
-- KENYA LEO MEDIA - COMPLETE BACKEND SCHEMA
-- ============================================================================

-- 1. CREATE ROLE ENUM
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

-- 2. USER ROLES TABLE (SEPARATE FROM PROFILES - CRITICAL FOR SECURITY)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. USER PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. SECURITY DEFINER FUNCTION FOR ROLE CHECKING
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. ADMIN CHECK FUNCTION
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- 6. UPDATE ARTICLES TABLE (Fix security issues)
ALTER TABLE public.articles 
  ALTER COLUMN author_id SET NOT NULL,
  ALTER COLUMN author_id SET DEFAULT auth.uid();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);

-- Drop the problematic RLS policy and replace it
DROP POLICY IF EXISTS "Authenticated users can read all articles" ON public.articles;

CREATE POLICY "Authenticated users can read own drafts and published articles"
ON public.articles
FOR SELECT
TO authenticated
USING (published = true OR auth.uid() = author_id);

-- Add admin override policy
CREATE POLICY "Admins can read all articles"
ON public.articles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Update policies for editors
CREATE POLICY "Editors and admins can create articles"
ON public.articles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'editor')
);

CREATE POLICY "Editors can update own articles, admins can update all"
ON public.articles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = author_id OR 
  public.is_admin(auth.uid())
);

CREATE POLICY "Admins can delete articles"
ON public.articles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 7. ADVERTISEMENTS TABLE
CREATE TABLE public.advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  placement TEXT NOT NULL, -- 'sidebar', 'banner', 'inline'
  active BOOLEAN DEFAULT true NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  impressions INTEGER DEFAULT 0 NOT NULL,
  clicks INTEGER DEFAULT 0 NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_ads_active ON public.advertisements(active);
CREATE INDEX idx_ads_placement ON public.advertisements(placement);

-- Ads RLS Policies
CREATE POLICY "Anyone can view active ads"
ON public.advertisements
FOR SELECT
USING (active = true);

CREATE POLICY "Admins can view all ads"
ON public.advertisements
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can create ads"
ON public.advertisements
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update ads"
ON public.advertisements
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete ads"
ON public.advertisements
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 8. MEDIA/UPLOADS TABLE
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_media_uploaded_by ON public.media(uploaded_by);

-- Media RLS Policies
CREATE POLICY "Authenticated users can view media"
ON public.media
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can upload media"
ON public.media
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete own media, admins can delete all"
ON public.media
FOR DELETE
TO authenticated
USING (auth.uid() = uploaded_by OR public.is_admin(auth.uid()));

-- 9. ANALYTICS - PAGE VIEWS
CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_page_views_article ON public.page_views(article_id);
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);

-- Page views RLS
CREATE POLICY "Admins can view all page views"
ON public.page_views
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert page views"
ON public.page_views
FOR INSERT
WITH CHECK (true);

-- 10. ANALYTICS - AD IMPRESSIONS
CREATE TABLE public.ad_impressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID REFERENCES public.advertisements(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  clicked BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.ad_impressions ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_ad_impressions_ad ON public.ad_impressions(ad_id);
CREATE INDEX idx_ad_impressions_created_at ON public.ad_impressions(created_at DESC);

-- Ad impressions RLS
CREATE POLICY "Admins can view ad impressions"
ON public.ad_impressions
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can track impressions"
ON public.ad_impressions
FOR INSERT
WITH CHECK (true);

-- 11. PROFILES RLS POLICIES
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 12. USER ROLES RLS POLICIES
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can assign roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can remove roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 13. TRIGGER FOR PROFILE CREATION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 14. UPDATE TIMESTAMP TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_advertisements_updated_at
  BEFORE UPDATE ON public.advertisements
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 15. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('article-images', 'article-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('ad-images', 'ad-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('media', 'media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'video/mp4'])
ON CONFLICT (id) DO NOTHING;

-- 16. STORAGE POLICIES
CREATE POLICY "Anyone can view article images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload article images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Users can update own article images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'article-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view ad images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'ad-images');

CREATE POLICY "Admins can upload ad images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ad-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Users can delete own media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 17. ENABLE REALTIME FOR ARTICLES
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.advertisements;

-- 18. HELPER FUNCTION TO INCREMENT AD STATS
CREATE OR REPLACE FUNCTION public.increment_ad_impressions(ad_uuid UUID)
RETURNS VOID
LANGUAGE SQL
AS $$
  UPDATE public.advertisements 
  SET impressions = impressions + 1 
  WHERE id = ad_uuid;
$$;

CREATE OR REPLACE FUNCTION public.increment_ad_clicks(ad_uuid UUID)
RETURNS VOID
LANGUAGE SQL
AS $$
  UPDATE public.advertisements 
  SET clicks = clicks + 1 
  WHERE id = ad_uuid;
$$;