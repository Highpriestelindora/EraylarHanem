import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fwjykrcxalrkyuoeidia.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3anlrcmN4YWxya3l1b2VpZGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTgxMTgsImV4cCI6MjA5MjMzNDExOH0.V93qVHtsKhNlnL-34MY0gjVpUhtDEQluzPOgX2W-_SU";
const supabase = createClient(supabaseUrl, supabaseKey);

const EMOJI_MAP = {
  'süt': '🥛', 'yoğurt': '🥣', 'peynir': '🧀', 'kaşar': '🧀', 'yumurta': '🥚', 'tereyağ': '🧈', 
  'domates': '🍅', 'salatalık': '🥒', 'biber': '🌶️', 'limon': '🍋', 'havuç': '🥕', 
  'soğan': '🧅', 'sarımsak': '🧄', 'patates': '🥔', 'marul': '🥬', 'maydanoz': '🌿', 
  'sucuk': '🥩', 'sosis': '🌭', 'salam': '🥓', 'et': '🥩', 'tavuk': '🍗', 'kıyma': '🥩', 'balık': '🐟',
  'zeytin': '🫒', 'reçel': '🍯', 'bal': '🍯', 'salça': '🥫', 'ketçap': '🍅', 'mayonez': '🥚',
  'su': '💧', 'soda': '🍾', 'meyve suyu': '🧃', 'kahve': '☕', 'çay': '🍵', 
  'un': '🌾', 'şeker': '🧊', 'tuz': '🧂', 'makarna': '🍝', 'pirinç': '🍚', 'bulgur': '🌾', 
  'mercimek': '🧆', 'nohut': '🧆', 'fasulye': '🫘', 'yağ': '🛢️', 'zeytinyağı': '🫒', 
  'ekmek': '🍞', 'mantı': '🥟', 'milföy': '🥐', 'bezelye': '🫛', 'mısır': '🌽',
  'köfte': '🧆', 'pizza': '🍕', 'dondurma': '🍦', 'çikolata': '🍫', 'bisküvi': '🍪',
  'kuruyemiş': '🥜', 'ceviz': '🌰', 'badem': '🌰', 'fındık': '🌰', 'baharat': '🌶️'
};

const KATEGORI_MAP = {
  // Dondurucu
  'mantı': 'dondurucu', 'milföy': 'dondurucu', 'dondurma': 'dondurucu', 'buz': 'dondurucu', 'pizza': 'dondurucu',
  'köfte': 'dondurucu',
  // Kiler
  'un': 'kiler', 'şeker': 'kiler', 'tuz': 'kiler', 'makarna': 'kiler', 'pirinç': 'kiler', 'bulgur': 'kiler',
  'mercimek': 'kiler', 'nohut': 'kiler', 'fasulye': 'kiler', 'sıvı yağ': 'kiler', 'zeytinyağı': 'kiler',
  'salça': 'kiler', 'konserve': 'kiler', 'ton balığı': 'kiler', 'çay': 'kiler', 'kahve': 'kiler', 'nescafe': 'kiler',
  'bisküvi': 'kiler', 'çikolata': 'kiler', 'kraker': 'kiler', 'kuruyemiş': 'kiler', 'ceviz': 'kiler', 'fındık': 'kiler',
  'badem': 'kiler', 'baharat': 'kiler', 'karabiber': 'kiler', 'pul biber': 'kiler', 'kimyon': 'kiler',
  'kekik': 'kiler', 'nane': 'kiler', 'sirke': 'kiler', 'nar ekşisi': 'kiler', 'bal': 'kiler', 'pekmez': 'kiler',
  'tahin': 'kiler', 'su': 'kiler', 'soğan': 'kiler', 'patates': 'kiler', 'sarımsak': 'kiler', 'yağ': 'kiler',
  'şehriye': 'kiler'
};

// Default is 'buzdolabi'

function getMetadata(itemName) {
  const nameLower = itemName.toLowerCase();
  
  let emoji = '📦';
  for (const [key, val] of Object.entries(EMOJI_MAP)) {
    if (nameLower.includes(key)) {
      emoji = val;
      break;
    }
  }

  let kategori = 'buzdolabi'; // varsayılan
  for (const [key, val] of Object.entries(KATEGORI_MAP)) {
    if (nameLower.includes(key)) {
      kategori = val;
      break;
    }
  }

  // Özel İstisnalar
  if (nameLower.includes('taze') && kategori === 'kiler') kategori = 'buzdolabi';
  if (nameLower.includes('dondurulmuş')) kategori = 'dondurucu';

  return { emoji, kategori };
}

async function run() {
  console.log("Supabase'den mevcut mutfak stokları çekiliyor...");
  const { data: allItems, error: fetchErr } = await supabase.from('mutfak_stok').select('*');
  if (fetchErr) {
    console.error("Fetch Hatası:", fetchErr);
    return;
  }

  console.log(`${allItems.length} öğe bulundu. Tekilleştiriliyor...`);
  
  // Tekilleştir ve onar
  const uniqueItemsMap = new Map();
  for (const item of allItems) {
    const ism = item.isim.trim();
    if (!uniqueItemsMap.has(ism)) {
      const { emoji, kategori } = getMetadata(ism);
      
      uniqueItemsMap.set(ism, {
        ...item,
        id: `${kategori}-${ism}`,
        kategori: kategori,
        emoji: emoji
      });
    } else {
      // Eğer mevcutsa, miktarları toplayabiliriz
      const existing = uniqueItemsMap.get(ism);
      existing.miktar += Number(item.miktar || 0);
    }
  }

  const cleanedItems = Array.from(uniqueItemsMap.values());
  console.log(`Tekilleştirilmiş ve onarılmış öğe sayısı: ${cleanedItems.length}`);

  console.log("Mevcut tablo siliniyor...");
  const { error: deleteErr } = await supabase.from('mutfak_stok').delete().neq('id', 'dummy');
  if (deleteErr) {
    console.error("Silme Hatası:", deleteErr);
    return;
  }
  
  console.log("Yeni veriler yükleniyor...");
  const chunkSize = 100;
  for (let i = 0; i < cleanedItems.length; i += chunkSize) {
    const chunk = cleanedItems.slice(i, i + chunkSize);
    const { error: insertErr } = await supabase.from('mutfak_stok').insert(chunk);
    if (insertErr) {
      console.error(`Yükleme hatası (Chunk ${i}):`, insertErr);
    }
  }

  console.log("İşlem başarıyla tamamlandı!");
}

run();
