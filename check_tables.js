import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fwjykrcxalrkyuoeidia.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3anlrcmN4YWxya3l1b2VpZGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTgxMTgsImV4cCI6MjA5MjMzNDExOH0.V93qVHtsKhNlnL-34MY0gjVpUhtDEQluzPOgX2W-_SU";
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const tables = [
    'mutfak_stok', 'mutfak_menu', 'mutfak_tarifler', 'mutfak_su',
    'alisveris_listesi',
    'sosyal_etkinlikler', 'sosyal_havuz', 'sosyal_rutinler',
    'finans_harcamalar', 'finans_kartlar', 'finans_krediler', 'finans_arsiv',
    'finans_kart_mutabakat', 'finans_onay_havuzu',
    'hedefler_aktif', 'hedefler_gecmis', 'hedefler_vizyon',
    'eraylar_store'
  ];

  console.log("=== SUPABASE TABLO DURUM RAPORU ===\n");
  for (const table of tables) {
    const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: false }).limit(3);
    if (error) {
      console.log(`❌ ${table}: HATA - ${error.message}`);
    } else {
      console.log(`✅ ${table}: ${data.length} satır (ilk 3)`);
      if (data.length > 0 && table === 'sosyal_etkinlikler') {
        console.log("   Örnek:", JSON.stringify(data[0], null, 2));
      }
      if (data.length > 0 && table === 'mutfak_stok') {
        // Kategorilere göre dağılım
        const allData = await supabase.from(table).select('kategori');
        if (allData.data) {
          const dist = {};
          allData.data.forEach(r => { dist[r.kategori] = (dist[r.kategori] || 0) + 1; });
          console.log("   Kategori Dağılımı:", dist);
        }
      }
    }
  }
}

run();
