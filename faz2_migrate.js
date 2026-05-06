import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fwjykrcxalrkyuoeidia.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3anlrcmN4YWxya3l1b2VpZGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTgxMTgsImV4cCI6MjA5MjMzNDExOH0.V93qVHtsKhNlnL-34MY0gjVpUhtDEQluzPOgX2W-_SU";
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== FAZ 2 - eraylar_store blob'undan veri kurtarma ===\n");

  // 1. Blob'u oku
  const { data: storeData, error } = await supabase
    .from('eraylar_store')
    .select('data')
    .eq('id', 1)
    .single();

  if (error || !storeData?.data) {
    console.error("eraylar_store okunamadı:", error);
    return;
  }

  const blob = storeData.data;

  // ═══════════════════════════════════════════════════
  // SOSYAL KURTARMA
  // ═══════════════════════════════════════════════════
  console.log("\n--- SOSYAL MODÜLÜᐅ ---");
  const sosyal = blob.sosyal || {};
  const aktiviteler = sosyal.aktiviteler || [];
  console.log(`Blob'da ${aktiviteler.length} aktivite bulundu.`);
  
  const tamamlananlar = aktiviteler.filter(a => a.tamamlandi || a.durum === 'tamamlandi');
  const planlanalar = aktiviteler.filter(a => !a.tamamlandi && a.durum !== 'tamamlandi');
  console.log(`  Tamamlanan: ${tamamlananlar.length}`);
  console.log(`  Planlanan:  ${planlanalar.length}`);

  // Tüm aktiviteleri SQL'e aktar (hepsini, durum bilgisiyle birlikte)
  let actSuccess = 0;
  for (const act of aktiviteler) {
    const payload = {
      id: String(act.id),
      baslik: act.baslik || act.title || 'İsimsiz',
      tarih: act.tarih || act.date || null,
      saat: act.saat || act.time || null,
      emoji: act.emoji || act.icon || '🎭',
      tur: act.tur || act.type || 'genel',
      harcama: Number(act.harcama || act.cost || 0),
      kisi_sayisi: Number(act.kisiSayisi || 2),
      puan_gorkem: Number(act.puan_gorkem || 0),
      puan_esra: Number(act.puan_esra || 0),
      yorum_gorkem: act.yorum_gorkem || null,
      yorum_esra: act.yorum_esra || null,
      detaylar: act.detaylar || null,
      durum: act.durum || (act.tamamlandi ? 'tamamlandi' : 'planda'),
      master_category: act.masterCategory || 'Genel'
    };
    const { error: e } = await supabase.from('sosyal_etkinlikler').upsert(payload);
    if (e) console.warn(`  ⚠️ Aktivite ${act.baslik}: ${e.message}`);
    else actSuccess++;
  }
  console.log(`  ✅ ${actSuccess}/${aktiviteler.length} aktivite SQL'e aktarıldı.`);

  // Havuz
  const havuz = sosyal.havuz || [];
  console.log(`\nHavuz: ${havuz.length} öğe`);
  for (const h of havuz) {
    const payload = { id: String(h.id), baslik: h.baslik, tur: h.tur, emoji: h.emoji, count: Number(h.count || 0), freq: h.freq, last_done: h.last };
    await supabase.from('sosyal_havuz').upsert(payload);
  }
  console.log(`  ✅ Havuz aktarıldı.`);

  // Rutinler
  const rutinler = sosyal.rutinler || [];
  console.log(`Rutinler: ${rutinler.length} öğe`);
  for (const r of rutinler) {
    const payload = { id: String(r.id), aktivite: r.aktivite, kisi: r.kisi, vakit: r.vakit, gunler: Array.isArray(r.gunler) ? r.gunler : [], saati: r.saati, ucret: Number(r.ucret || 0) };
    await supabase.from('sosyal_rutinler').upsert(payload);
  }
  console.log(`  ✅ Rutinler aktarıldı.`);

  // ═══════════════════════════════════════════════════
  // HEDEFLER KURTARMA
  // ═══════════════════════════════════════════════════
  console.log("\n--- HEDEFLER MODÜLÜᐅ ---");
  const hedefler = blob.hedefler || {};
  
  const goals = hedefler.goals || [];
  console.log(`Aktif Hedefler: ${goals.length}`);
  for (const g of goals) {
    const payload = {
      id: String(g.id),
      title: g.title,
      owner: g.owner || 'gorkem',
      category: g.category || 'genel',
      current_val: Number(g.current || 0),
      target_val: Number(g.target || 100),
      target_date: g.targetDate || null,
      priority: g.priority || 'Orta',
      milestones: g.milestones || [],
      created_at: g.createdAt || new Date().toISOString()
    };
    const { error: e } = await supabase.from('hedefler_aktif').upsert(payload);
    if (e) console.warn(`  ⚠️ Hedef ${g.title}: ${e.message}`);
    else console.log(`  ✅ ${g.title} aktarıldı.`);
  }

  const completed = hedefler.completedHistory || [];
  console.log(`Tamamlanan Hedefler: ${completed.length}`);
  for (const c of completed) {
    const payload = {
      id: String(c.id),
      title: c.title,
      owner: c.owner || 'gorkem',
      category: c.category || 'genel',
      completed_date: c.completedDate || new Date().toISOString()
    };
    const { error: e } = await supabase.from('hedefler_gecmis').upsert(payload);
    if (e) console.warn(`  ⚠️ ${e.message}`);
  }
  console.log(`  ✅ Tamamlanan hedefler aktarıldı.`);

  const vision = hedefler.longTermVision || [];
  console.log(`Vizyon: ${vision.length} öğe`);
  for (const v of vision) {
    const payload = {
      id: String(v.id),
      text: v.text,
      type: v.type || 'general'
    };
    const { error: e } = await supabase.from('hedefler_vizyon').upsert(payload);
    if (e) console.warn(`  ⚠️ ${e.message}`);
  }
  console.log(`  ✅ Vizyon aktarıldı.`);

  // ═══════════════════════════════════════════════════
  // DONDURUCU STOK KURTARMA
  // ═══════════════════════════════════════════════════
  console.log("\n--- DONDURUCU STOK KURTARMA ---");
  const mutfak = blob.mutfak || {};
  const dondurucu = mutfak.dondurucu || [];
  console.log(`Blob'da ${dondurucu.length} dondurucu ürünü bulundu.`);
  for (const item of dondurucu) {
    const payload = {
      id: `dondurucu-${item.n || item.isim}`,
      kategori: 'dondurucu',
      isim: item.n || item.isim,
      miktar: Number(item.cr || item.miktar || 0),
      birim: item.u || item.birim || 'adet',
      min_stok: Number(item.mn || item.min_stok || 0),
      emoji: item.ic || item.emoji || '🧊',
      reyon: item.ct || item.reyon || 'Genel',
      marka: item.br || item.marka || '',
      market: item.mk || item.market || '',
      paket: item.pk || item.paket || '',
      son_kullanma: item.ex || item.bt || item.son_kullanma || null
    };
    const { error: e } = await supabase.from('mutfak_stok').upsert(payload);
    if (e) console.warn(`  ⚠️ ${item.n}: ${e.message}`);
  }
  console.log(`  ✅ Dondurucu stok aktarıldı.`);

  // ═══════════════════════════════════════════════════
  // SU VERİSİ KURTARMA
  // ═══════════════════════════════════════════════════
  console.log("\n--- SU VERİSİ KURTARMA ---");
  const su = mutfak.su || {};
  console.log(`Blob'daki su verisi: level1=${su.level1}, level2=${su.level2}, dailyRate=${su.dailyRate}`);
  const suPayload = {
    id: 'mutfak_su',
    level1: su.level1 ?? 100,
    level2: su.level2 ?? 100,
    daily_rate: su.dailyRate ?? 20,
    last_checked: su.lastChecked || null,
    last_order: su.lastOrder || null,
    history: su.history || []
  };
  const { error: suErr } = await supabase.from('mutfak_su').upsert(suPayload);
  if (suErr) console.warn(`  ⚠️ Su hatası: ${suErr.message}`);
  else console.log(`  ✅ Su verisi aktarıldı.`);

  console.log("\n=== FAZ 2 AKTARIM TAMAMLANDI ===");
}

run();
