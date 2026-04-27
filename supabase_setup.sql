-- =============================================
-- Eraylar Hanem - Supabase Tablo Kurulumu
-- Supabase Dashboard > SQL Editor'da çalıştır
-- =============================================

-- Ana veri tablosu (tek JSON blob yaklaşımı)
CREATE TABLE IF NOT EXISTS eraylar_store (
  id        INTEGER PRIMARY KEY DEFAULT 1,
  data      JSONB    NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sadece tek satır olacak (id=1), bunu zorunlu kıl
CREATE UNIQUE INDEX IF NOT EXISTS eraylar_store_single_row ON eraylar_store (id);

-- İlk boş kaydı oluştur
INSERT INTO eraylar_store (id, data)
VALUES (1, '{
  "kasa": { "gorkem": 0, "esra": 0, "ortak": 0, "gecmis": [] },
  "mutfak": {
    "menu": {},
    "buzdolabi": [],
    "alisveris": [],
    "tarifler": []
  },
  "saglik": {
    "randevular": [],
    "ilaclar": [],
    "olcumler": []
  },
  "hedefler": [],
  "sosyal": {
    "aktiviteler": [],
    "rutinler": [],
    "havuz": []
  },
  "ev": {
    "faturalar": [],
    "bakim": []
  },
  "pet": [],
  "aracim": {
    "km": 0,
    "bakim": [],
    "yakitlar": []
  },
  "tatil": []
}')
ON CONFLICT (id) DO NOTHING;

-- RLS (Row Level Security) - anon key ile okuma/yazma izni
ALTER TABLE eraylar_store ENABLE ROW LEVEL SECURITY;

-- Herkese (anon dahil) okuma izni
CREATE POLICY "allow_read" ON eraylar_store
  FOR SELECT USING (true);

-- Herkese (anon dahil) yazma izni
CREATE POLICY "allow_write" ON eraylar_store
  FOR ALL USING (true) WITH CHECK (true);
