-- ============================================================
-- FIX v2: finans_kart_mutabakat family_id NUMERIC → TEXT
-- Önce policy'leri kaldır, sonra tip değiştir, sonra RLS kapat
-- ============================================================

-- 1. Tüm policy'leri kaldır (tip değişikliğini blokluyor)
DROP POLICY IF EXISTS "Allow family select" ON finans_kart_mutabakat;
DROP POLICY IF EXISTS "Allow family insert" ON finans_kart_mutabakat;
DROP POLICY IF EXISTS "Allow family update" ON finans_kart_mutabakat;
DROP POLICY IF EXISTS "Allow family delete" ON finans_kart_mutabakat;

-- 2. RLS'yi kapat
ALTER TABLE finans_kart_mutabakat DISABLE ROW LEVEL SECURITY;

-- 3. UNIQUE constraint'i kaldır (varsa)
ALTER TABLE finans_kart_mutabakat
  DROP CONSTRAINT IF EXISTS unique_kart_mutabakat_triple;

-- 4. family_id tipini TEXT'e çevir
ALTER TABLE finans_kart_mutabakat
  ALTER COLUMN family_id TYPE TEXT USING family_id::TEXT;

-- 5. kart_id ve ay da TEXT olmalı
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'finans_kart_mutabakat'
      AND column_name = 'kart_id'
      AND data_type != 'text'
  ) THEN
    ALTER TABLE finans_kart_mutabakat
      ALTER COLUMN kart_id TYPE TEXT USING kart_id::TEXT;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'finans_kart_mutabakat'
      AND column_name = 'ay'
      AND data_type != 'text'
  ) THEN
    ALTER TABLE finans_kart_mutabakat
      ALTER COLUMN ay TYPE TEXT USING ay::TEXT;
  END IF;
END $$;

-- 6. UNIQUE constraint'i geri ekle
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_kart_mutabakat_triple'
  ) THEN
    ALTER TABLE finans_kart_mutabakat
      ADD CONSTRAINT unique_kart_mutabakat_triple UNIQUE (family_id, kart_id, ay);
  END IF;
END $$;

-- 7. Tam erişim ver
GRANT ALL ON finans_kart_mutabakat TO anon, authenticated, service_role;

-- Doğrulama
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'finans_kart_mutabakat'
ORDER BY ordinal_position;
