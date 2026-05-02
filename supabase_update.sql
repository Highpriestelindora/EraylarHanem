-- =============================================
-- Eraylar Hanem - Supabase Schema Patch (Finans RLS & Constraints)
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. RLS Policies for finans_harcamalar
-- Ensures that the 'eraylar-family-shared-id' used in the code is permitted
ALTER TABLE finans_harcamalar ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow family insert" ON finans_harcamalar;
CREATE POLICY "Allow family insert" 
ON finans_harcamalar FOR INSERT 
WITH CHECK (family_id = 'eraylar-family-shared-id');

DROP POLICY IF EXISTS "Allow family select" ON finans_harcamalar;
CREATE POLICY "Allow family select" 
ON finans_harcamalar FOR SELECT 
USING (family_id = 'eraylar-family-shared-id');

DROP POLICY IF EXISTS "Allow family update" ON finans_harcamalar;
CREATE POLICY "Allow family update" 
ON finans_harcamalar FOR UPDATE 
USING (family_id = 'eraylar-family-shared-id');

-- 2. Unique Constraints for Upsert Operations
-- Fixes "no unique or exclusion constraint matching the ON CONFLICT specification" errors

-- For finans_kart_mutabakat (onConflict: 'family_id,kart_id,ay')
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_kart_mutabakat_triple') THEN
        ALTER TABLE finans_kart_mutabakat 
        ADD CONSTRAINT unique_kart_mutabakat_triple UNIQUE (family_id, kart_id, ay);
    END IF;
END $$;

-- For finans_arsiv (onConflict: 'family_id,ay')
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_finans_arsiv_double') THEN
        ALTER TABLE finans_arsiv 
        ADD CONSTRAINT unique_finans_arsiv_double UNIQUE (family_id, ay);
    END IF;
END $$;

-- 4. RLS Policies for Other Finance Tables
-- Fixes "new row violates row-level security policy" for archival operations

-- For finans_arsiv
ALTER TABLE finans_arsiv ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow family select" ON finans_arsiv;
CREATE POLICY "Allow family select" ON finans_arsiv FOR SELECT USING (family_id = 'eraylar-family-shared-id');
DROP POLICY IF EXISTS "Allow family insert" ON finans_arsiv;
CREATE POLICY "Allow family insert" ON finans_arsiv FOR INSERT WITH CHECK (family_id = 'eraylar-family-shared-id');
DROP POLICY IF EXISTS "Allow family update" ON finans_arsiv;
CREATE POLICY "Allow family update" ON finans_arsiv FOR UPDATE USING (family_id = 'eraylar-family-shared-id');

-- For finans_kart_mutabakat
ALTER TABLE finans_kart_mutabakat ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow family select" ON finans_kart_mutabakat;
CREATE POLICY "Allow family select" ON finans_kart_mutabakat FOR SELECT USING (family_id = 'eraylar-family-shared-id');
DROP POLICY IF EXISTS "Allow family insert" ON finans_kart_mutabakat;
CREATE POLICY "Allow family insert" ON finans_kart_mutabakat FOR INSERT WITH CHECK (family_id = 'eraylar-family-shared-id');
DROP POLICY IF EXISTS "Allow family update" ON finans_kart_mutabakat;
CREATE POLICY "Allow family update" ON finans_kart_mutabakat FOR UPDATE USING (family_id = 'eraylar-family-shared-id');
