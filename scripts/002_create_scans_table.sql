-- Create scans table
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
