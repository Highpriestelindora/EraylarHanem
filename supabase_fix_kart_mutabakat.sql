-- ============================================================
-- FIX: finans_kart_mutabakat tablosunda family_id NUMERIC → TEXT
-- Hata: invalid input syntax for type numeric: "eraylar-family-shared-id"
-- Supabase Dashboard > SQL Editor'da çalıştırın
-- ============================================================

-- 1. Önce mevcut kısıtlamaları kaldır (UNIQUE constraint ve PRIMARY KEY çakışmalarını önler)
ALTER TABLE finans_kart_mutabakat
  DROP CONSTRAINT IF EXISTS unique_kart_mutabakat_triple;

-- 2. family_id kolonu varsa tipini TEXT yap, yoksa ekle
DO $$
BEGIN
  -- Kolon zaten var mı kontrol et
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'finans_kart_mutabakat' AND column_name = 'family_id'
  ) THEN
    -- Tipi TEXT'e çevir (NUMERIC ise hata verir, bu yüzden USING ile cast ediyoruz)
    ALTER TABLE finans_kart_mutabakat
      ALTER COLUMN family_id TYPE TEXT USING family_id::TEXT;
  ELSE
    -- Hiç yoksa TEXT olarak ekle
    ALTER TABLE finans_kart_mutabakat
      ADD COLUMN family_id TEXT DEFAULT 'ERAYLAR';
  END IF;
END $$;

-- 3. Diğer kolonların da tipi doğru mu kontrol et (kart_id ve ay TEXT olmalı)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'finans_kart_mutabakat' AND column_name = 'kart_id'
      AND data_type != 'text'
  ) THEN
    ALTER TABLE finans_kart_mutabakat
      ALTER COLUMN kart_id TYPE TEXT USING kart_id::TEXT;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'finans_kart_mutabakat' AND column_name = 'ay'
      AND data_type != 'text'
  ) THEN
    ALTER TABLE finans_kart_mutabakat
      ALTER COLUMN ay TYPE TEXT USING ay::TEXT;
  END IF;
END $$;

-- 4. UNIQUE kısıtlamasını geri ekle
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_kart_mutabakat_triple'
  ) THEN
    ALTER TABLE finans_kart_mutabakat
      ADD CONSTRAINT unique_kart_mutabakat_triple UNIQUE (family_id, kart_id, ay);
  END IF;
END $$;

-- 5. RLS'yi kapat (anon yazım için)
ALTER TABLE finans_kart_mutabakat DISABLE ROW LEVEL SECURITY;

-- 6. Tam erişim ver
GRANT ALL ON finans_kart_mutabakat TO anon, authenticated, service_role;

-- Doğrulama: Kolon tiplerini göster
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'finans_kart_mutabakat'
ORDER BY ordinal_position;
