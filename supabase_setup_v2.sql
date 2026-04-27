-- =============================================
-- Eraylar Hanem - Supabase Tablo Kurulumu (Production V2)
-- Includes separate tables for Trips & Photos with RLS
-- =============================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TRIPS TABLE
CREATE TABLE IF NOT EXISTS trips (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id   TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id),
  title       TEXT NOT NULL,
  city        TEXT,
  country     TEXT,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  trip_type   TEXT DEFAULT 'tatil',
  travelers   TEXT DEFAULT 'ikimiz',
  notes       TEXT,
  budget_est  DECIMAL DEFAULT 0,
  budget_real DECIMAL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PHOTOS TABLE
CREATE TABLE IF NOT EXISTS trip_photos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id     UUID REFERENCES trips(id) ON DELETE CASCADE,
  family_id   TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id),
  url         TEXT NOT NULL,
  caption     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS POLICIES (TRIPS)
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view shared trips"
ON trips FOR SELECT
USING (family_id = (auth.jwt() ->> 'family_id'));

CREATE POLICY "Family members can insert trips"
ON trips FOR INSERT
WITH CHECK (family_id = (auth.jwt() ->> 'family_id'));

CREATE POLICY "Family members can update trips"
ON trips FOR UPDATE
USING (family_id = (auth.jwt() ->> 'family_id'));

CREATE POLICY "Family members can delete trips"
ON trips FOR DELETE
USING (family_id = (auth.jwt() ->> 'family_id'));

-- 5. RLS POLICIES (PHOTOS)
ALTER TABLE trip_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view shared photos"
ON trip_photos FOR SELECT
USING (family_id = (auth.jwt() ->> 'family_id'));

CREATE POLICY "Family members can upload photos"
ON trip_photos FOR INSERT
WITH CHECK (family_id = (auth.jwt() ->> 'family_id'));

CREATE POLICY "Family members can delete photos"
ON trip_photos FOR DELETE
USING (family_id = (auth.jwt() ->> 'family_id'));

-- 6. STORAGE BUCKET POLICIES
-- Run these in the Supabase Dashboard for the 'tatil-photos' bucket
/*
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'tatil-photos' );

CREATE POLICY "Family Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tatil-photos' AND
  (auth.jwt() ->> 'family_id') IS NOT NULL
);
*/

-- 7. BACKEND FUNCTION FOR STATUS (OPTIONAL BUT RECOMMENDED)
-- Instead of storing status, we can use a view or a computed column
CREATE OR REPLACE VIEW trips_with_status AS
SELECT *,
  CASE
    WHEN CURRENT_DATE < start_date THEN 'planned'
    WHEN CURRENT_DATE BETWEEN start_date AND end_date THEN 'active'
    ELSE 'completed'
  END as derived_status
FROM trips;
