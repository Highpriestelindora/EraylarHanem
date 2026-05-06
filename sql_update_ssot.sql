-- ==========================================
-- ERAYLAR HANEM - EKSİK TABLOLAR İÇİN SSOT GEÇİŞ SQL KODU
-- ==========================================
-- Lütfen bu kodu Supabase Dashboard -> SQL Editor kısmına yapıştırıp "Run" tuşuna basın.

-- 1. KASA (VARLIK) MODÜLÜ TABLOLARI
CREATE TABLE IF NOT EXISTS kasa_tasinmazlar (
    id TEXT PRIMARY KEY,
    name TEXT,
    city TEXT,
    district TEXT,
    type TEXT,
    value NUMERIC DEFAULT 0,
    income NUMERIC DEFAULT 0,
    expense NUMERIC DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS kasa_varliklar (
    id TEXT PRIMARY KEY,
    name TEXT,
    amount NUMERIC,
    unit TEXT,
    price NUMERIC,
    type TEXT,
    icon TEXT
);

CREATE TABLE IF NOT EXISTS kasa_kumbaralar (
    id TEXT PRIMARY KEY,
    name TEXT,
    target NUMERIC,
    current NUMERIC,
    icon TEXT,
    deadline TEXT,
    owner TEXT,
    category TEXT
);

CREATE TABLE IF NOT EXISTS kasa_bankalar (
    id TEXT PRIMARY KEY,
    name TEXT,
    bank TEXT,
    balance NUMERIC,
    owner TEXT,
    icon TEXT
);

-- 2. EV MODÜLÜ EKSİK TABLOLARI
CREATE TABLE IF NOT EXISTS ev_depo (
    id TEXT PRIMARY KEY,
    name TEXT,
    quantity NUMERIC,
    price NUMERIC,
    date TEXT,
    category TEXT
);

CREATE TABLE IF NOT EXISTS ev_faturalar (
    id TEXT PRIMARY KEY,
    name TEXT,
    provider TEXT,
    amount NUMERIC,
    due_date TEXT,
    status TEXT,
    auto_pay BOOLEAN,
    icon TEXT
);

CREATE TABLE IF NOT EXISTS ev_usta_rehberi (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    category TEXT,
    rating INTEGER
);

CREATE TABLE IF NOT EXISTS ev_bitkiler (
    id TEXT PRIMARY KEY,
    name TEXT,
    last_watered TEXT,
    interval_days INTEGER
);

-- 3. GARAJ VE PET EKSİK TABLOLARI
CREATE TABLE IF NOT EXISTS garaj_parts (
    id TEXT PRIMARY KEY,
    vehicle_id TEXT,
    name TEXT,
    last_km NUMERIC,
    interval_km NUMERIC,
    last_date TEXT,
    interval_days INTEGER,
    icon TEXT
);

CREATE TABLE IF NOT EXISTS pet_supplies (
    id TEXT PRIMARY KEY,
    pet_name TEXT,
    supply_type TEXT,
    status TEXT
);

CREATE TABLE IF NOT EXISTS pet_logs (
    id TEXT PRIMARY KEY,
    pet_name TEXT,
    date TEXT,
    notes TEXT
);

-- 4. MUTFAK EKSİK TABLOLARI
CREATE TABLE IF NOT EXISTS mutfak_siparisler (
    id TEXT PRIMARY KEY,
    tarih TEXT,
    nereden TEXT,
    ne_kadar NUMERIC,
    kim_odedi TEXT,
    notlar TEXT
);

CREATE TABLE IF NOT EXISTS mutfak_restaurantlar (
    id TEXT PRIMARY KEY,
    isim TEXT
);

CREATE TABLE IF NOT EXISTS mutfak_arsiv (
    id TEXT PRIMARY KEY,
    tarih TEXT,
    icerik TEXT,
    kisi TEXT
);

-- 6. ALİŞVERİŞ VE SOSYAL TABLOLARI
CREATE TABLE IF NOT EXISTS alisveris_listesi (
    id TEXT PRIMARY KEY,
    isim TEXT,
    link TEXT,
    fiyat NUMERIC,
    tarih TEXT,
    tamamlandi BOOLEAN DEFAULT false,
    tamamlanma_tarihi TEXT,
    kime TEXT -- 'gorkem', 'esra', 'ev', 'wishlist', 'mutfak'
);

CREATE TABLE IF NOT EXISTS sosyal_etkinlikler (
    id TEXT PRIMARY KEY,
    baslik TEXT,
    tarih TEXT,
    saat TEXT,
    emoji TEXT,
    tur TEXT,
    harcama NUMERIC,
    kisi_sayisi INTEGER,
    puan_gorkem INTEGER,
    puan_esra INTEGER,
    yorum_gorkem TEXT,
    yorum_esra TEXT,
    detaylar TEXT,
    durum TEXT DEFAULT 'planda'
);

CREATE TABLE IF NOT EXISTS sosyal_havuz (
    id TEXT PRIMARY KEY,
    baslik TEXT,
    tur TEXT,
    emoji TEXT,
    count INTEGER DEFAULT 0,
    freq TEXT,
    last_done TEXT
);

CREATE TABLE IF NOT EXISTS sosyal_rutinler (
    id TEXT PRIMARY KEY,
    aktivite TEXT,
    kisi TEXT,
    vakit TEXT,
    gunler TEXT[], -- Array of days
    saati TEXT,
    ucret NUMERIC DEFAULT 0
);

-- 7. MUTFAK EKSİK TABLOLARI
CREATE TABLE IF NOT EXISTS mutfak_stok (
    id TEXT PRIMARY KEY,
    isim TEXT,
    miktar NUMERIC,
    birim TEXT,
    min_stok NUMERIC,
    emoji TEXT,
    kategori TEXT, -- 'buzdolabi', 'kiler', 'dondurucu'
    marka TEXT,
    market TEXT,
    paket TEXT,
    son_kullanma TEXT
);

CREATE TABLE IF NOT EXISTS mutfak_tarifler (
    id TEXT PRIMARY KEY,
    isim TEXT,
    kategori TEXT,
    sure INTEGER,
    zorluk INTEGER,
    emoji TEXT,
    malzemeler TEXT[],
    favori BOOLEAN DEFAULT false,
    puan INTEGER DEFAULT 20
);

CREATE TABLE IF NOT EXISTS mutfak_menu (
    id TEXT PRIMARY KEY, -- 'YYYY-MM-DD-ogun'
    gun TEXT,
    ogun TEXT, -- 'k', 'k2', 'kdis', 'ksp', 'a', 'a2', 'adis', 'asp'
    yemek_adi TEXT,
    tarih TEXT
);

CREATE TABLE IF NOT EXISTS mutfak_su (
    id TEXT PRIMARY KEY, -- 'mutfak_su'
    level1 NUMERIC,
    level2 NUMERIC,
    daily_rate NUMERIC,
    last_checked TEXT,
    last_order TEXT,
    history JSONB DEFAULT '[]'::jsonb
);

-- DISABLE RLS FOR NEW TABLES
ALTER TABLE alisveris_listesi DISABLE ROW LEVEL SECURITY;
ALTER TABLE sosyal_etkinlikler DISABLE ROW LEVEL SECURITY;
ALTER TABLE sosyal_havuz DISABLE ROW LEVEL SECURITY;
ALTER TABLE sosyal_rutinler DISABLE ROW LEVEL SECURITY;
ALTER TABLE mutfak_stok DISABLE ROW LEVEL SECURITY;
ALTER TABLE mutfak_tarifler DISABLE ROW LEVEL SECURITY;
ALTER TABLE mutfak_menu DISABLE ROW LEVEL SECURITY;
ALTER TABLE mutfak_su DISABLE ROW LEVEL SECURITY;

-- 5. SAĞLIK EKSİK TABLOLARI
CREATE TABLE IF NOT EXISTS saglik_sleep (
    id TEXT PRIMARY KEY,
    kisi TEXT,
    tarih TEXT,
    saat NUMERIC,
    kalite TEXT
);

-- DISABLE RLS FOR NEW TABLES (Development/PWA uyumluluğu için)
ALTER TABLE kasa_tasinmazlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE kasa_varliklar DISABLE ROW LEVEL SECURITY;
ALTER TABLE kasa_kumbaralar DISABLE ROW LEVEL SECURITY;
ALTER TABLE kasa_bankalar DISABLE ROW LEVEL SECURITY;
ALTER TABLE ev_depo DISABLE ROW LEVEL SECURITY;
ALTER TABLE ev_faturalar DISABLE ROW LEVEL SECURITY;
ALTER TABLE ev_usta_rehberi DISABLE ROW LEVEL SECURITY;
ALTER TABLE ev_bitkiler DISABLE ROW LEVEL SECURITY;
ALTER TABLE garaj_parts DISABLE ROW LEVEL SECURITY;
ALTER TABLE pet_supplies DISABLE ROW LEVEL SECURITY;
ALTER TABLE pet_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE mutfak_siparisler DISABLE ROW LEVEL SECURITY;
ALTER TABLE mutfak_restaurantlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE mutfak_arsiv DISABLE ROW LEVEL SECURITY;
ALTER TABLE saglik_sleep DISABLE ROW LEVEL SECURITY;

-- 8. FİNANS VE HEDEFLER EKSİK TABLOLARI
CREATE TABLE IF NOT EXISTS finans_kartlar (
    id TEXT PRIMARY KEY,
    name TEXT,
    owner TEXT,
    cutoff_day INTEGER,
    color TEXT,
    min_pct INTEGER
);

CREATE TABLE IF NOT EXISTS finans_krediler (
    id TEXT PRIMARY KEY,
    name TEXT,
    due_day INTEGER,
    total NUMERIC,
    remaining NUMERIC,
    monthly NUMERIC
);

CREATE TABLE IF NOT EXISTS finans_onay_havuzu (
    id TEXT PRIMARY KEY,
    baslik TEXT,
    tutar NUMERIC,
    kaynak TEXT,
    kayit_eden TEXT,
    tarih TEXT,
    default_pay TEXT
);

CREATE TABLE IF NOT EXISTS hedefler_aktif (
    id TEXT PRIMARY KEY,
    title TEXT,
    target NUMERIC,
    current NUMERIC,
    target_date TEXT,
    duration TEXT,
    priority TEXT,
    owner TEXT,
    notes TEXT,
    yearly_plan JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS hedefler_gecmis (
    id TEXT PRIMARY KEY,
    title TEXT,
    owner TEXT,
    notes TEXT,
    status TEXT, -- 'completed', 'failed'
    resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS hedefler_vizyon (
    id TEXT PRIMARY KEY,
    text TEXT,
    owner TEXT
);

-- 9. TATİL, MÜHENDİSLİK VE MODARİNG TABLOLARI
CREATE TABLE IF NOT EXISTS tatil_trips (
    id TEXT PRIMARY KEY,
    family_id TEXT,
    user_id TEXT,
    title TEXT,
    location TEXT,
    start_date TEXT,
    end_date TEXT,
    budget NUMERIC,
    spent NUMERIC,
    notes TEXT,
    status TEXT DEFAULT 'planned'
);

CREATE TABLE IF NOT EXISTS tatil_wishlist (
    id TEXT PRIMARY KEY,
    title TEXT,
    location TEXT,
    est_cost NUMERIC,
    priority TEXT
);

CREATE TABLE IF NOT EXISTS tatil_pasaport (
    id TEXT PRIMARY KEY, -- 'kisi_adi'
    passport_no TEXT,
    expiry_date TEXT,
    issue_date TEXT
);

CREATE TABLE IF NOT EXISTS tatil_vizeler (
    id TEXT PRIMARY KEY,
    country TEXT,
    expiry_date TEXT,
    type TEXT
);

CREATE TABLE IF NOT EXISTS muhendislik_problems (
    id TEXT PRIMARY KEY,
    title TEXT,
    date TEXT,
    status TEXT,
    priority TEXT,
    tags TEXT[]
);

CREATE TABLE IF NOT EXISTS muhendislik_decisions (
    id TEXT PRIMARY KEY,
    title TEXT,
    date TEXT,
    context TEXT,
    outcome TEXT
);

CREATE TABLE IF NOT EXISTS muhendislik_crm_customers (
    id TEXT PRIMARY KEY,
    name TEXT,
    company TEXT,
    email TEXT,
    phone TEXT
);

CREATE TABLE IF NOT EXISTS muhendislik_crm_deals (
    id TEXT PRIMARY KEY,
    customer_id TEXT,
    title TEXT,
    value NUMERIC,
    status TEXT
);

CREATE TABLE IF NOT EXISTS modaring_personel (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    status TEXT
);

CREATE TABLE IF NOT EXISTS modaring_siparisler (
    id TEXT PRIMARY KEY,
    customer TEXT,
    items JSONB,
    total NUMERIC,
    status TEXT,
    created_at TEXT
);

-- DISABLE RLS FOR ALL REMAINING TABLES
ALTER TABLE finans_kartlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE finans_krediler DISABLE ROW LEVEL SECURITY;
ALTER TABLE finans_onay_havuzu DISABLE ROW LEVEL SECURITY;
ALTER TABLE hedefler_aktif DISABLE ROW LEVEL SECURITY;
ALTER TABLE hedefler_gecmis DISABLE ROW LEVEL SECURITY;
ALTER TABLE hedefler_vizyon DISABLE ROW LEVEL SECURITY;
ALTER TABLE tatil_trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE tatil_wishlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE tatil_pasaport DISABLE ROW LEVEL SECURITY;
ALTER TABLE tatil_vizeler DISABLE ROW LEVEL SECURITY;
ALTER TABLE muhendislik_problems DISABLE ROW LEVEL SECURITY;
ALTER TABLE muhendislik_decisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE muhendislik_crm_customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE muhendislik_crm_deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE modaring_personel DISABLE ROW LEVEL SECURITY;
ALTER TABLE modaring_siparisler DISABLE ROW LEVEL SECURITY;

