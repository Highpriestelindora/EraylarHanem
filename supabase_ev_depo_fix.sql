-- ==========================================
-- ev_depo Tablo Tam Düzeltme
-- Supabase Dashboard -> SQL Editor'e yapıştırıp Run'a basın
-- ==========================================

-- 1. Eksik sütunları ekle (varsa hata vermez)
ALTER TABLE public.ev_depo ADD COLUMN IF NOT EXISTS family_id TEXT DEFAULT 'ERAYLAR';
ALTER TABLE public.ev_depo ADD COLUMN IF NOT EXISTS owner TEXT DEFAULT 'ortak';
ALTER TABLE public.ev_depo ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '';
ALTER TABLE public.ev_depo ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT '';
ALTER TABLE public.ev_depo ADD COLUMN IF NOT EXISTS size TEXT DEFAULT '';
ALTER TABLE public.ev_depo ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

-- 2. Mevcut kayıtlarda family_id'yi doldur
UPDATE public.ev_depo SET family_id = 'ERAYLAR' WHERE family_id IS NULL;

-- 3. RLS kapat
ALTER TABLE public.ev_depo DISABLE ROW LEVEL SECURITY;

-- 4. Erişim izni ver
GRANT ALL ON public.ev_depo TO anon, authenticated, service_role;
