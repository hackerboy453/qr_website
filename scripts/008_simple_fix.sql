-- Simple fix for scans table - ensure it has the basic required columns
-- This script will work regardless of the current state

-- First, let's make sure the scans table exists with basic columns
CREATE TABLE IF NOT EXISTS public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id UUID NOT NULL REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add columns one by one if they don't exist
DO $$ 
BEGIN
    -- Add ip_address if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scans' AND column_name = 'ip_address') THEN
        ALTER TABLE public.scans ADD COLUMN ip_address INET;
    END IF;
    
    -- Add user_agent if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scans' AND column_name = 'user_agent') THEN
        ALTER TABLE public.scans ADD COLUMN user_agent TEXT;
    END IF;
    
    -- Add referer if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scans' AND column_name = 'referer') THEN
        ALTER TABLE public.scans ADD COLUMN referer TEXT;
    END IF;
    
    -- Add country if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scans' AND column_name = 'country') THEN
        ALTER TABLE public.scans ADD COLUMN country TEXT;
    END IF;
    
    -- Add city if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scans' AND column_name = 'city') THEN
        ALTER TABLE public.scans ADD COLUMN city TEXT;
    END IF;
    
    -- Add device_type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scans' AND column_name = 'device_type') THEN
        ALTER TABLE public.scans ADD COLUMN device_type TEXT;
    END IF;
    
    -- Add browser if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scans' AND column_name = 'browser') THEN
        ALTER TABLE public.scans ADD COLUMN browser TEXT;
    END IF;
    
    -- Add os if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scans' AND column_name = 'os') THEN
        ALTER TABLE public.scans ADD COLUMN os TEXT;
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "scans_select_own_qr_codes" ON public.scans;
DROP POLICY IF EXISTS "scans_insert_public" ON public.scans;

-- Create RLS policies
CREATE POLICY "scans_select_own_qr_codes" ON public.scans 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.qr_codes 
      WHERE qr_codes.id = scans.qr_code_id 
      AND qr_codes.user_id = auth.uid()
    )
  );

CREATE POLICY "scans_insert_public" ON public.scans 
  FOR INSERT WITH CHECK (true);

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_scans_qr_code_id ON public.scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON public.scans(scanned_at);
