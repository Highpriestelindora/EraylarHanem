-- Eraylar Hanem - Alışveriş Listesi Öncelik Sütunu Güncellemesi
-- Bu SQL kodunu Supabase Dashboard -> SQL Editor kısmına yapıştırıp "Run" tuşuna basın.

ALTER TABLE alisveris_listesi ADD COLUMN IF NOT EXISTS oncelik TEXT DEFAULT 'Lazım';
