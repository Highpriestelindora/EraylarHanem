-- ==========================================
-- ev_onarim Tablo Düzeltme ve Güncelleme
-- Supabase Dashboard -> SQL Editor'e yapıştırın
-- ==========================================

-- 1. Tablo yoksa oluştur (tüm sütunlarla)
CREATE TABLE IF NOT EXISTS public.ev_onarim (
    id TEXT PRIMARY KEY,
    task TEXT,
    status TEXT DEFAULT 'Pending',
    created_by TEXT,
    created_at TEXT,
    completed_by TEXT,
    completed_at TEXT,
    cleared_by TEXT,
    cleared_at TEXT,
    is_archived BOOLEAN DEFAULT false,
    assigned_to TEXT,
    due_date TEXT,
    family_id TEXT DEFAULT 'ERAYLAR'
);

-- 2. Eğer tablo zaten varsa eksik sütunları ekle
ALTER TABLE public.ev_onarim ADD COLUMN IF NOT EXISTS family_id TEXT DEFAULT 'ERAYLAR';
ALTER TABLE public.ev_onarim ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE public.ev_onarim ADD COLUMN IF NOT EXISTS due_date TEXT;
ALTER TABLE public.ev_onarim ADD COLUMN IF NOT EXISTS cleared_by TEXT;
ALTER TABLE public.ev_onarim ADD COLUMN IF NOT EXISTS cleared_at TEXT;

-- 3. Mevcut kayıtların family_id'sini doldur
UPDATE public.ev_onarim SET family_id = 'ERAYLAR' WHERE family_id IS NULL;

-- 4. RLS kapat
ALTER TABLE public.ev_onarim DISABLE ROW LEVEL SECURITY;

-- 5. Erişim izni ver
GRANT ALL ON public.ev_onarim TO anon, authenticated, service_role;
