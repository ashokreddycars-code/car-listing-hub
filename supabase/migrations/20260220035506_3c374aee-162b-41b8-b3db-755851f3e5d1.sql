
-- Allow authenticated users to insert their own cars
DROP POLICY IF EXISTS "Admin can insert cars" ON public.cars;

CREATE POLICY "Authenticated users can insert their own cars"
ON public.cars
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can insert cars"
ON public.cars
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Allow users to update/delete their own cars
CREATE POLICY "Users can update their own cars"
ON public.cars
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cars"
ON public.cars
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to insert images for their own cars
DROP POLICY IF EXISTS "Admin can insert car images" ON public.car_images;

CREATE POLICY "Users can insert images for their own cars"
ON public.car_images
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cars WHERE id = car_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Admin can insert car images"
ON public.car_images
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Allow users to delete images from their own cars
DROP POLICY IF EXISTS "Admin can delete car images" ON public.car_images;

CREATE POLICY "Users can delete their own car images"
ON public.car_images
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cars WHERE id = car_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Admin can delete car images"
ON public.car_images
FOR DELETE
TO authenticated
USING (is_admin());

-- Allow users to update display_order of their own car images
CREATE POLICY "Users can update their own car images"
ON public.car_images
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cars WHERE id = car_id AND user_id = auth.uid()
  )
);

-- Enable pg_cron and pg_net extensions for auto-deletion
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to auto-delete cars that have been sold for 7+ days
CREATE OR REPLACE FUNCTION public.cleanup_sold_cars()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete car images first (FK constraint)
  DELETE FROM public.car_images
  WHERE car_id IN (
    SELECT id FROM public.cars
    WHERE status = 'sold'
    AND updated_at < now() - INTERVAL '7 days'
  );

  -- Delete the sold cars
  DELETE FROM public.cars
  WHERE status = 'sold'
  AND updated_at < now() - INTERVAL '7 days';
END;
$$;
