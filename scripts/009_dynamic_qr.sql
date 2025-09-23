-- Dynamic QR core fields and indexes
alter table public.qr_codes
  add column if not exists short_code text unique,
  add column if not exists type text not null default 'STATIC',
  add column if not exists scan_count integer not null default 0,
  add column if not exists is_active boolean not null default true,
  add column if not exists qr_code_content_type text not null default 'URL',
  add column if not exists data jsonb,
  add column if not exists color text default '#000000',
  add column if not exists background_color text default '#ffffff',
  add column if not exists logo_url text,
  add column if not exists frame_text text;

create index if not exists idx_qr_codes_short_code on public.qr_codes (short_code);
create index if not exists idx_qr_codes_type on public.qr_codes (type);
create index if not exists idx_qr_codes_content_type on public.qr_codes (qr_code_content_type);


