-- Create QR codes table
CREATE TABLE IF NOT EXISTS public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- RLS policies for qr_codes
CREATE POLICY "qr_codes_select_own" ON public.qr_codes 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "qr_codes_insert_own" ON public.qr_codes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "qr_codes_update_own" ON public.qr_codes 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "qr_codes_delete_own" ON public.qr_codes 
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON public.qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON public.qr_codes(created_at);
