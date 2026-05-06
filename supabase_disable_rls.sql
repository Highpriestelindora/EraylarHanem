-- =============================================
-- Eraylar Hanem - TÜM TABLOLAR İÇİN RLS KALDIRMA
-- Supabase SQL Editor'da çalıştır
-- =============================================

-- Her satır IF EXISTS kontrolü ile sarılı, olmayan tablo hata vermez
DO $$ 
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    -- Grup 3: Tatil
    'tatil_trips', 'tatil_wishlist', 'tatil_pasaport', 'tatil_vizeler',
    -- Grup 3: Mühendislik
    'muhendislik_problems', 'muhendislik_decisions', 
    'muhendislik_crm_customers', 'muhendislik_crm_deals',
    'muhendislik_proceler', 'muhendislik_life_routines', 'muhendislik_life_programs',
    -- Grup 3: Modaring
    'modaring_personel', 'modaring_vardiya', 'modaring_kasa', 'modaring_bankalar',
    'modaring_tedarik', 'modaring_siparisler', 'modaring_ajanda', 'modaring_refika',
    -- Grup 2: Ev, Garaj, Pet, Sağlık
    'ev_duzenli_odemeler', 'ev_abonelikler', 'ev_onarim', 'ev_demirbaslar', 'ev_bakimlar',
    'garaj_yakit', 'garaj_servis', 'garaj_belgeler',
    'pet_asilar', 'pet_agirlik',
    'saglik_randevular', 'saglik_ilaclar', 'saglik_olcumler',
    -- Grup 1: Mutfak, Sosyal, Alışveriş
    'mutfak_stok', 'mutfak_tarifler', 'mutfak_menu', 'mutfak_su',
    'sosyal_etkinlikler', 'sosyal_havuz', 'sosyal_rutinler',
    'alisveris_listesi',
    -- Faz 1: Finans & Hedefler
    'finans_harcamalar', 'finans_kartlar', 'finans_krediler',
    'finans_onay_havuzu', 'finans_arsiv', 'finans_kart_mutabakat',
    'hedefler_aktif', 'hedefler_gecmis', 'hedefler_vizyon',
    -- Ana Store
    'eraylar_store'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl AND table_schema = 'public') THEN
      EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', tbl);
      RAISE NOTICE 'RLS disabled: %', tbl;
    ELSE
      RAISE NOTICE 'SKIPPED (not found): %', tbl;
    END IF;
  END LOOP;
END $$;
