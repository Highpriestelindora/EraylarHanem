-- ==========================================================
-- ERAYLAR HANEM - %100 KALICILIK VE ŞEMA TAMİR BETİĞİ
-- ==========================================================
-- Bu script, alışveriş listesindeki 400 hatalarını (fiyat vb. kolon eksikliği) çözer.

-- 1. ALIŞVERİŞ LİSTESİ KOLON TAMİRİ
DO $$ 
BEGIN 
    -- family_id (Zaten eklemiş olabiliriz ama garantiye alalım)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alisveris_listesi' AND column_name='family_id') THEN
        ALTER TABLE alisveris_listesi ADD COLUMN family_id TEXT DEFAULT 'eraylar-family-shared-id';
    END IF;

    -- fiyat
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alisveris_listesi' AND column_name='fiyat') THEN
        ALTER TABLE alisveris_listesi ADD COLUMN fiyat NUMERIC DEFAULT 0;
    END IF;

    -- tamamlandi
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alisveris_listesi' AND column_name='tamamlandi') THEN
        ALTER TABLE alisveris_listesi ADD COLUMN tamamlandi BOOLEAN DEFAULT false;
    END IF;

    -- tamamlanma_tarihi
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alisveris_listesi' AND column_name='tamamlanma_tarihi') THEN
        ALTER TABLE alisveris_listesi ADD COLUMN tamamlanma_tarihi TEXT;
    END IF;

    -- kime
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alisveris_listesi' AND column_name='kime') THEN
        ALTER TABLE alisveris_listesi ADD COLUMN kime TEXT DEFAULT 'ev';
    END IF;

    -- tarih
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alisveris_listesi' AND column_name='tarih') THEN
        ALTER TABLE alisveris_listesi ADD COLUMN tarih TEXT;
    END IF;

    -- link
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alisveris_listesi' AND column_name='link') THEN
        ALTER TABLE alisveris_listesi ADD COLUMN link TEXT;
    END IF;

    -- isim (Eğer tablo 'n' veya 'nm' kullanıyorsa 'isim' olarak senkronize edelim)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='alisveris_listesi' AND column_name='isim') THEN
        ALTER TABLE alisveris_listesi ADD COLUMN isim TEXT;
    END IF;
END $$;

-- 2. GÜVENLİK AYARLARI (RLS KAPATMA)
ALTER TABLE alisveris_listesi DISABLE ROW LEVEL SECURITY;

-- 3. MEVCUT VERİLERİ MÜHÜRLE
UPDATE alisveris_listesi SET family_id = 'eraylar-family-shared-id' WHERE family_id IS NULL;
UPDATE alisveris_listesi SET kime = 'ev' WHERE kime IS NULL;
UPDATE alisveris_listesi SET tamamlandi = false WHERE tamamlandi IS NULL;
