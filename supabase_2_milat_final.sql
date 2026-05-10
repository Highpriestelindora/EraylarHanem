-- ==========================================================
-- ERAYLAR HANEM - 2. MİLAT: %100 SQL SSOT TAMAMLAMA SCRIPTI
-- ==========================================================
-- Bu script, JSON'da kalan son verileri SQL'e taşımak için gerekli tabloları oluşturur.

-- 1. KASA DURUM VE BAKİYELER
CREATE TABLE IF NOT EXISTS kasa_bakiyeler (
    id TEXT PRIMARY KEY, -- 'gorkem', 'esra', 'ortak'
    miktar NUMERIC DEFAULT 0,
    son_guncelleme TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kasa_ayarlar (
    id TEXT PRIMARY KEY, -- 'doviz_kurlari', 'gizlilik_modu'
    veri JSONB
);

-- 2. FİNANS AYARLAR VE REKURANSLAR
CREATE TABLE IF NOT EXISTS finans_ayarlar (
    id TEXT PRIMARY KEY, -- 'limitler'
    veri JSONB
);

CREATE TABLE IF NOT EXISTS finans_rekuranslar (
    id TEXT PRIMARY KEY,
    baslik TEXT,
    tutar NUMERIC,
    kategori TEXT,
    periyot TEXT, -- 'aylik', 'haftalik'
    sonraki_tarih TEXT
);

-- 3. SAĞLIK VE SİSTEM AYARLARI
CREATE TABLE IF NOT EXISTS saglik_ayarlar (
    id TEXT PRIMARY KEY, -- 'uyku_hedefleri'
    veri JSONB
);

-- 4. MUTFAK SOHBET
CREATE TABLE IF NOT EXISTS mutfak_sohbet (
    id TEXT PRIMARY KEY,
    kisi TEXT,
    mesaj TEXT,
    tarih TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEVCUT TABLOLARA EKSİK SÜTUN EKLEME (TATİL KESİNLEŞTİRME FİX)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tatil_trips' AND column_name='is_confirmed') THEN
        ALTER TABLE tatil_trips ADD COLUMN is_confirmed BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 6. RLS DEVRE DIŞI BIRAKMA (PWA UYUMLULUĞU İÇİN)
ALTER TABLE kasa_bakiyeler DISABLE ROW LEVEL SECURITY;
ALTER TABLE kasa_ayarlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE finans_ayarlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE finans_rekuranslar DISABLE ROW LEVEL SECURITY;
ALTER TABLE saglik_ayarlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE mutfak_sohbet DISABLE ROW LEVEL SECURITY;

-- BAŞLANGIÇ VERİLERİNİ EKLE (EĞER YOKSA)
INSERT INTO kasa_bakiyeler (id, miktar) VALUES ('gorkem', 15000), ('esra', 12000), ('ortak', 5000) ON CONFLICT DO NOTHING;
INSERT INTO kasa_ayarlar (id, veri) VALUES ('doviz_kurlari', '{"EUR": 35.2, "USD": 32.5}') ON CONFLICT DO NOTHING;
INSERT INTO finans_ayarlar (id, veri) VALUES ('limitler', '{"Mutfak": 15000, "Sosyal": 5000, "Saglik": 3000}') ON CONFLICT DO NOTHING;
INSERT INTO saglik_ayarlar (id, veri) VALUES ('uyku_hedefleri', '{"gorkem": 6, "esra": 9}') ON CONFLICT DO NOTHING;
