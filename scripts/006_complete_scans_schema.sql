-- Complete scans table schema with all analytics fields
-- This script ensures all required fields are present for comprehensive analytics

-- First, let's check if the scans table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id UUID NOT NULL REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing fields to scans table if they don't exist
ALTER TABLE public.scans 
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS accept_language TEXT;

-- Create indexes for the new fields for better performance
CREATE INDEX IF NOT EXISTS idx_scans_state ON public.scans(state);
CREATE INDEX IF NOT EXISTS idx_scans_region ON public.scans(region);
CREATE INDEX IF NOT EXISTS idx_scans_timezone ON public.scans(timezone);
CREATE INDEX IF NOT EXISTS idx_scans_latitude ON public.scans(latitude);
CREATE INDEX IF NOT EXISTS idx_scans_longitude ON public.scans(longitude);
CREATE INDEX IF NOT EXISTS idx_scans_accept_language ON public.scans(accept_language);

-- Update the scanned_at column to use created_at for consistency
-- (This is optional, but helps with consistency across the app)
ALTER TABLE public.scans 
ALTER COLUMN scanned_at SET DEFAULT NOW();

-- Ensure the table has proper constraints
ALTER TABLE public.scans 
ADD CONSTRAINT IF NOT EXISTS chk_latitude_range CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
ADD CONSTRAINT IF NOT EXISTS chk_longitude_range CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));
