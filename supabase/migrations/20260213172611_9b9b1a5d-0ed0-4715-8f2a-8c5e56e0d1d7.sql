
-- Admin users table (simple approach: store admin user IDs)
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can read admin_users" ON public.admin_users FOR SELECT USING (auth.uid() = user_id);

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Cars table
CREATE TABLE public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  price NUMERIC NOT NULL,
  fuel_type TEXT NOT NULL DEFAULT 'Petrol',
  km_driven NUMERIC NOT NULL DEFAULT 0,
  year INTEGER,
  description TEXT,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  is_sold BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Public can read all cars
CREATE POLICY "Anyone can view cars" ON public.cars FOR SELECT USING (true);
-- Only admin can insert
CREATE POLICY "Admin can insert cars" ON public.cars FOR INSERT WITH CHECK (public.is_admin());
-- Only admin can update
CREATE POLICY "Admin can update cars" ON public.cars FOR UPDATE USING (public.is_admin());
-- Only admin can delete
CREATE POLICY "Admin can delete cars" ON public.cars FOR DELETE USING (public.is_admin());

-- Car images table
CREATE TABLE public.car_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.car_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view car images" ON public.car_images FOR SELECT USING (true);
CREATE POLICY "Admin can insert car images" ON public.car_images FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin can delete car images" ON public.car_images FOR DELETE USING (public.is_admin());

-- Updated_at trigger for cars
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON public.cars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for car images
INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Storage policies
CREATE POLICY "Anyone can view car images in storage" ON storage.objects FOR SELECT USING (bucket_id = 'car-images');
CREATE POLICY "Admin can upload car images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'car-images' AND public.is_admin());
CREATE POLICY "Admin can delete car images in storage" ON storage.objects FOR DELETE USING (bucket_id = 'car-images' AND public.is_admin());

-- Trigger to auto-add first signup as admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- First user becomes admin automatically
  IF NOT EXISTS (SELECT 1 FROM public.admin_users) THEN
    INSERT INTO public.admin_users (user_id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
