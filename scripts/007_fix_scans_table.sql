-- Fix scans table by ensuring all required columns exist
-- This script will add all missing columns that the application needs

-- First, let's drop and recreate the scans table with all required columns
DROP TABLE IF EXISTS public.scans CASCADE;

-- Create the scans table with all required columns
CREATE TABLE public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id UUID NOT NULL REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  city TEXT,
  state TEXT,
  region TEXT,
  timezone TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  device_type TEXT,
  browser TEXT,
  os TEXT,
  accept_language TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for scans table
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- RLS policy for scans - users can only see scans for their own QR codes
CREATE POLICY "scans_select_own_qr_codes" ON public.scans 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.qr_codes 
      WHERE qr_codes.id = scans.qr_code_id 
      AND qr_codes.user_id = auth.uid()
    )
  );

-- Allow public insert for scan tracking (anyone can scan QR codes)
CREATE POLICY "scans_insert_public" ON public.scans 
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scans_qr_code_id ON public.scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON public.scans(scanned_at);
CREATE INDEX IF NOT EXISTS idx_scans_country ON public.scans(country);
CREATE INDEX IF NOT EXISTS idx_scans_device_type ON public.scans(device_type);
CREATE INDEX IF NOT EXISTS idx_scans_browser ON public.scans(browser);
CREATE INDEX IF NOT EXISTS idx_scans_os ON public.scans(os);
CREATE INDEX IF NOT EXISTS idx_scans_state ON public.scans(state);
CREATE INDEX IF NOT EXISTS idx_scans_region ON public.scans(region);
CREATE INDEX IF NOT EXISTS idx_scans_timezone ON public.scans(timezone);
CREATE INDEX IF NOT EXISTS idx_scans_latitude ON public.scans(latitude);
CREATE INDEX IF NOT EXISTS idx_scans_longitude ON public.scans(longitude);
CREATE INDEX IF NOT EXISTS idx_scans_accept_language ON public.scans(accept_language);

-- Add constraints for data validation
ALTER TABLE public.scans 
ADD CONSTRAINT chk_latitude_range CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
ADD CONSTRAINT chk_longitude_range CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));
