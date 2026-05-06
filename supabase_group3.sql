-- =============================================
-- Eraylar Hanem - Grup 3 SQL Tabloları
-- Tatil, Mühendislik, Modaring
-- Supabase SQL Editor'da çalıştır
-- =============================================

-- ═══════════════════════════════════════════
-- 1. TATİL MODÜLÜ
-- ═══════════════════════════════════════════

-- Tatil Seyahatleri (trips)
CREATE TABLE IF NOT EXISTS tatil_trips (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  city          TEXT,
  country       TEXT,
  start_date    TEXT,
  end_date      TEXT,
  trip_type     TEXT DEFAULT 'tatil',
  travelers     TEXT DEFAULT 'ikimiz',
  transport_type TEXT DEFAULT 'ucak',
  location_type TEXT DEFAULT 'yurtdisi',
  status        TEXT DEFAULT 'planned',
  notes         TEXT,
  schengen      BOOLEAN DEFAULT false,
  budget_est    NUMERIC DEFAULT 0,
  budget_real   NUMERIC DEFAULT 0,
  valiz         JSONB DEFAULT '{}',
  evaluations   JSONB DEFAULT '{}',
  photos        JSONB DEFAULT '[]',
  checklists    JSONB DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Tatil Wishlist (hayal listesi)
CREATE TABLE IF NOT EXISTS tatil_wishlist (
  id            TEXT PRIMARY KEY,
  place         TEXT NOT NULL,
  notes         TEXT,
  "user"        TEXT,
  date          TIMESTAMPTZ DEFAULT NOW()
);

-- Tatil Pasaport bilgileri
CREATE TABLE IF NOT EXISTS tatil_pasaport (
  kisi          TEXT PRIMARY KEY,
  name          TEXT,
  surname       TEXT,
  no            TEXT,
  nationality   TEXT DEFAULT 'TC',
  birth_date    TEXT,
  issue_date    TEXT,
  exp           TEXT,
  birth_place   TEXT
);

-- Tatil Vize bilgileri
CREATE TABLE IF NOT EXISTS tatil_vizeler (
  id            TEXT PRIMARY KEY,
  type          TEXT,
  owner         TEXT,
  start_date    TEXT,
  end_date      TEXT,
  entries       TEXT DEFAULT 'Multi',
  country       TEXT
);

-- ═══════════════════════════════════════════
-- 2. MÜHENDİSLİK MODÜLÜ
-- ═══════════════════════════════════════════

-- Problem Bankası
CREATE TABLE IF NOT EXISTS muhendislik_problems (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT,
  priority      TEXT DEFAULT 'Orta',
  status        TEXT DEFAULT 'Açık',
  solution      TEXT,
  date          TIMESTAMPTZ DEFAULT NOW(),
  extra         JSONB DEFAULT '{}'
);

-- Karar Günlüğü
CREATE TABLE IF NOT EXISTS muhendislik_decisions (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT,
  result        TEXT,
  pros          TEXT,
  cons          TEXT,
  date          TIMESTAMPTZ DEFAULT NOW(),
  extra         JSONB DEFAULT '{}'
);

-- CRM Müşteriler
CREATE TABLE IF NOT EXISTS muhendislik_crm_customers (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  company       TEXT,
  phone         TEXT,
  email         TEXT,
  notes         TEXT,
  status        TEXT DEFAULT 'aktif',
  date          TIMESTAMPTZ DEFAULT NOW(),
  extra         JSONB DEFAULT '{}'
);

-- CRM Anlaşmalar
CREATE TABLE IF NOT EXISTS muhendislik_crm_deals (
  id            TEXT PRIMARY KEY,
  customer_id   TEXT,
  title         TEXT,
  amount        NUMERIC DEFAULT 0,
  status        TEXT DEFAULT 'pipeline',
  notes         TEXT,
  date          TIMESTAMPTZ DEFAULT NOW(),
  extra         JSONB DEFAULT '{}'
);

-- Zihni Sinir Proceleri
CREATE TABLE IF NOT EXISTS muhendislik_proceler (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT,
  completed     BOOLEAN DEFAULT false,
  date          TIMESTAMPTZ DEFAULT NOW(),
  extra         JSONB DEFAULT '{}'
);

-- Life Routines
CREATE TABLE IF NOT EXISTS muhendislik_life_routines (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  category      TEXT,
  frequency     TEXT,
  time_of_day   TEXT,
  completed     BOOLEAN DEFAULT false,
  date          TIMESTAMPTZ DEFAULT NOW(),
  extra         JSONB DEFAULT '{}'
);

-- Life Programs
CREATE TABLE IF NOT EXISTS muhendislik_life_programs (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  status        TEXT DEFAULT 'aktif',
  date          TIMESTAMPTZ DEFAULT NOW(),
  extra         JSONB DEFAULT '{}'
);

-- ═══════════════════════════════════════════
-- 3. MODARİNG MODÜLÜ
-- ═══════════════════════════════════════════

-- Personel
CREATE TABLE IF NOT EXISTS modaring_personel (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  hourly_rate   NUMERIC DEFAULT 0,
  color         TEXT DEFAULT '#6366f1',
  emoji         TEXT DEFAULT '👤',
  active        BOOLEAN DEFAULT true
);

-- Vardiya (shift)
CREATE TABLE IF NOT EXISTS modaring_vardiya (
  id            TEXT PRIMARY KEY,
  personel_id   TEXT,
  date          TEXT,
  start_time    TEXT,
  end_time      TEXT,
  total_pay     NUMERIC DEFAULT 0,
  status        TEXT DEFAULT 'aktif'
);

-- Kasa (cash flow)
CREATE TABLE IF NOT EXISTS modaring_kasa (
  id            TEXT PRIMARY KEY,
  date          TEXT,
  type          TEXT,
  amount        NUMERIC DEFAULT 0,
  method        TEXT,
  note          TEXT,
  bank_id       TEXT
);

-- Bankalar
CREATE TABLE IF NOT EXISTS modaring_bankalar (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  type          TEXT,
  balance       NUMERIC DEFAULT 0,
  color         TEXT DEFAULT '#3b82f6',
  icon          TEXT DEFAULT '🏦'
);

-- Tedarikçiler
CREATE TABLE IF NOT EXISTS modaring_tedarik (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  link          TEXT,
  category      TEXT,
  contact       TEXT,
  note          TEXT
);

-- Siparişler
CREATE TABLE IF NOT EXISTS modaring_siparisler (
  id            TEXT PRIMARY KEY,
  supplier_id   TEXT,
  date          TEXT,
  items         JSONB DEFAULT '[]',
  total         NUMERIC DEFAULT 0,
  paid          BOOLEAN DEFAULT false,
  status        TEXT DEFAULT 'bekliyor',
  bank_id       TEXT
);

-- Ajanda
CREATE TABLE IF NOT EXISTS modaring_ajanda (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  due_date      TEXT,
  amount        NUMERIC DEFAULT 0,
  status        TEXT DEFAULT 'bekliyor'
);

-- Refika Fikirleri
CREATE TABLE IF NOT EXISTS modaring_refika (
  id            TEXT PRIMARY KEY,
  title         TEXT,
  description   TEXT,
  cost          NUMERIC DEFAULT 0,
  price         NUMERIC DEFAULT 0,
  strategy      TEXT,
  context       TEXT,
  date          TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- RLS POLİÇELERİ - Tüm tablolar için
-- ═══════════════════════════════════════════

DO $$ 
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'tatil_trips', 'tatil_wishlist', 'tatil_pasaport', 'tatil_vizeler',
    'muhendislik_problems', 'muhendislik_decisions', 
    'muhendislik_crm_customers', 'muhendislik_crm_deals',
    'muhendislik_proceler', 'muhendislik_life_routines', 'muhendislik_life_programs',
    'modaring_personel', 'modaring_vardiya', 'modaring_kasa', 'modaring_bankalar',
    'modaring_tedarik', 'modaring_siparisler', 'modaring_ajanda', 'modaring_refika'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "allow_all_%s" ON %I', tbl, tbl);
    EXECUTE format('CREATE POLICY "allow_all_%s" ON %I FOR ALL USING (true) WITH CHECK (true)', tbl, tbl);
  END LOOP;
END $$;
