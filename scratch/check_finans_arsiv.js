import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter(line => line.includes('='))
    .map(line => {
      const [key, ...vals] = line.split('=');
      return [key.trim(), vals.join('=').trim().replace(/^["']|["']$/g, '')];
    })
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const DEFAULT_FID = 'eraylar-family-shared-id';

async function backfill() {
  const { data: allHarcama, error } = await supabase
    .from('finans_harcamalar')
    .select('*')
    .eq('family_id', DEFAULT_FID);

  if (error) {
    console.error('Error fetching harcamalar:', error);
    return;
  }

  console.log(`Fetched ${allHarcama.length} harcamalar.`);

  // Group by month
  const byMonth = {};
  allHarcama.forEach(h => {
    const month = h.ay || (h.tarih ? h.tarih.slice(0, 7) : null);
    if (!month) return;
    if (!byMonth[month]) {
      byMonth[month] = {
        harcamalar: [],
        total: 0,
        kart: 0,
        nakit: 0,
        havale: 0,
        categories: {},
        cards: {}
      };
    }
    const tutar = Number(h.tutar || 0);
    byMonth[month].harcamalar.push(h);
    byMonth[month].total += tutar;

    if (h.odenme_turu === 'kart' || (h.kart_id && h.odenme_turu !== 'nakit' && h.odenme_turu !== 'havale')) {
      byMonth[month].kart += tutar;
    } else if (h.odenme_turu === 'havale') {
      byMonth[month].havale += tutar;
    } else {
      byMonth[month].nakit += tutar;
    }

    if (h.kategori) {
      byMonth[month].categories[h.kategori] = (byMonth[month].categories[h.kategori] || 0) + tutar;
    }
    if (h.kart_id) {
      byMonth[month].cards[h.kart_id] = (byMonth[month].cards[h.kart_id] || 0) + tutar;
    }
  });

  console.log('Months to backfill in finans_arsiv:', Object.keys(byMonth));

  for (const [ay, stats] of Object.entries(byMonth)) {
    const payload = {
      family_id: DEFAULT_FID,
      ay,
      toplam: stats.total,
      ozet: {
        total: stats.total,
        kart: stats.kart,
        nakit: stats.nakit,
        havale: stats.havale,
        categories: stats.categories,
        cards: stats.cards,
        count: stats.harcamalar.length
      }
    };

    const { data, error: upsertErr } = await supabase
      .from('finans_arsiv')
      .upsert(payload, { onConflict: 'family_id,ay' })
      .select();

    if (upsertErr) {
      console.error(`Error backfilling ${ay}:`, upsertErr);
    } else {
      console.log(`✅ Successfully backfilled ${ay}: Total = ₺${stats.total}, Kart = ₺${stats.kart}, Nakit = ₺${stats.nakit}`);
    }
  }

  // Check updated table
  const { data: finalArsiv } = await supabase
    .from('finans_arsiv')
    .select('*')
    .eq('family_id', DEFAULT_FID)
    .order('ay', { ascending: false });

  console.log('Final finans_arsiv contents:');
  console.log(JSON.stringify(finalArsiv, null, 2));
}

backfill();
