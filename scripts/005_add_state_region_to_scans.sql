-- Add state/region and timezone fields to scans table for enhanced analytics
ALTER TABLE public.scans 
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_scans_state ON public.scans(state);
CREATE INDEX IF NOT EXISTS idx_scans_region ON public.scans(region);
