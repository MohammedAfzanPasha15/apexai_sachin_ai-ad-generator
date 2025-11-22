-- Create storage bucket for uploaded product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Create storage bucket for generated ad creatives
INSERT INTO storage.buckets (id, name, public)
VALUES ('ad-creatives', 'ad-creatives', true);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  product_image_url TEXT NOT NULL,
  tagline TEXT,
  custom_prompt TEXT,
  product_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ad_creatives table
CREATE TABLE public.ad_creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  style_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_creatives ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects"
  ON public.projects
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for ad_creatives
CREATE POLICY "Users can view their own ad creatives"
  ON public.ad_creatives
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = ad_creatives.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own ad creatives"
  ON public.ad_creatives
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = ad_creatives.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own ad creatives"
  ON public.ad_creatives
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = ad_creatives.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own ad creatives"
  ON public.ad_creatives
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = ad_creatives.project_id
    AND projects.user_id = auth.uid()
  ));

-- Storage policies for product-images bucket
CREATE POLICY "Users can upload their own product images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Users can update their own product images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own product images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for ad-creatives bucket
CREATE POLICY "Users can upload their own ad creatives"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'ad-creatives' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view ad creatives"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'ad-creatives');

CREATE POLICY "Users can update their own ad creatives"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'ad-creatives' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own ad creatives"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'ad-creatives' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();