
-- Add is_featured column to cars table
ALTER TABLE public.cars ADD COLUMN is_featured boolean NOT NULL DEFAULT false;
