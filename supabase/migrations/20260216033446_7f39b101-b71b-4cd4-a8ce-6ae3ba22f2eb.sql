
-- Add status column to cars table (replacing is_sold boolean)
ALTER TABLE public.cars ADD COLUMN status text NOT NULL DEFAULT 'available';

-- Migrate existing data
UPDATE public.cars SET status = CASE WHEN is_sold = true THEN 'sold' ELSE 'available' END;

-- Create sell_inquiries table for public sell car form
CREATE TABLE public.sell_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  brand text NOT NULL,
  model text NOT NULL,
  year integer,
  km_driven numeric DEFAULT 0,
  fuel_type text DEFAULT 'Petrol',
  transmission text DEFAULT 'Manual',
  expected_price numeric,
  description text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on sell_inquiries
ALTER TABLE public.sell_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry
CREATE POLICY "Anyone can submit sell inquiry"
ON public.sell_inquiries FOR INSERT
WITH CHECK (true);

-- Only admin can view inquiries
CREATE POLICY "Admin can view sell inquiries"
ON public.sell_inquiries FOR SELECT
USING (public.is_admin());

-- Only admin can update inquiries
CREATE POLICY "Admin can update sell inquiries"
ON public.sell_inquiries FOR UPDATE
USING (public.is_admin());

-- Only admin can delete inquiries
CREATE POLICY "Admin can delete sell inquiries"
ON public.sell_inquiries FOR DELETE
USING (public.is_admin());

-- Trigger for updated_at on sell_inquiries
CREATE TRIGGER update_sell_inquiries_updated_at
BEFORE UPDATE ON public.sell_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
