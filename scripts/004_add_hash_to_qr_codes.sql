-- Add hash column to qr_codes table for better URL structure
ALTER TABLE public.qr_codes ADD COLUMN IF NOT EXISTS hash TEXT UNIQUE;

-- Create index for hash lookups
CREATE INDEX IF NOT EXISTS idx_qr_codes_hash ON public.qr_codes(hash);

-- Update existing QR codes with generated hashes (if any exist)
UPDATE public.qr_codes 
SET hash = encode(digest(id::text || created_at::text, 'sha256'), 'hex')
WHERE hash IS NULL;
