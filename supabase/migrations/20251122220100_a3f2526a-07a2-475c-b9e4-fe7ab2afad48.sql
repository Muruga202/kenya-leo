-- Create categories enum
CREATE TYPE article_category AS ENUM (
  'breaking',
  'politics',
  'entertainment',
  'sports',
  'technology',
  'business',
  'lifestyle',
  'trending'
);

-- Create articles table
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category article_category NOT NULL,
  image_url TEXT,
  source_url TEXT,
  source_reference TEXT,
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  trending BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published articles
CREATE POLICY "Anyone can read published articles"
ON public.articles
FOR SELECT
USING (published = true);

-- Policy: Authenticated users can read all articles (for admin dashboard)
CREATE POLICY "Authenticated users can read all articles"
ON public.articles
FOR SELECT
TO authenticated
USING (true);

-- Policy: Authenticated users can create articles
CREATE POLICY "Authenticated users can create articles"
ON public.articles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Policy: Authors can update their own articles
CREATE POLICY "Authors can update own articles"
ON public.articles
FOR UPDATE
TO authenticated
USING (auth.uid() = author_id);

-- Policy: Authors can delete their own articles
CREATE POLICY "Authors can delete own articles"
ON public.articles
FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_article_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.handle_article_updated_at();