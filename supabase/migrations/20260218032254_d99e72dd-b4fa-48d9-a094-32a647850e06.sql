
-- Fix 1: Add explicit INSERT, UPDATE, DELETE policies on admin_users
CREATE POLICY "Only existing admins can add admins"
ON public.admin_users
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Only existing admins can update admins"
ON public.admin_users
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Only existing admins can delete admins"
ON public.admin_users
FOR DELETE
USING (public.is_admin());

-- Fix 3: Add constraints on sell_inquiries for input validation
ALTER TABLE public.sell_inquiries
ADD CONSTRAINT phone_length CHECK (length(phone) <= 20),
ADD CONSTRAINT name_length CHECK (length(owner_name) <= 100),
ADD CONSTRAINT brand_length CHECK (length(brand) <= 100),
ADD CONSTRAINT model_length CHECK (length(model) <= 100),
ADD CONSTRAINT whatsapp_length CHECK (whatsapp IS NULL OR length(whatsapp) <= 20),
ADD CONSTRAINT description_length CHECK (description IS NULL OR length(description) <= 2000),
ADD CONSTRAINT valid_price CHECK (expected_price IS NULL OR expected_price > 0),
ADD CONSTRAINT valid_km CHECK (km_driven IS NULL OR km_driven >= 0),
ADD CONSTRAINT valid_year CHECK (year IS NULL OR (year >= 1900 AND year <= 2100));
