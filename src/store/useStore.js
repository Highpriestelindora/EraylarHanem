import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';
import {
  INITIAL_RECIPES,
  INITIAL_FRIDGE,
  INITIAL_PANTRY,
  INITIAL_FROZEN,
  ACHIEVEMENTS,
  PET_META,
  VACCINES,
  INITIAL_TRIPS,
  INITIAL_VEHICLE,
  INITIAL_SOCIAL,
  INITIAL_WEIGHTS,
  INITIAL_SOCIAL_POOL,
  SOCIAL_ROUTINES,
  ENGINEERING_CONVERSIONS,
  INITIAL_MODARING
} from '../constants/data';
import { ALL_ACHIEVEMENTS } from '../constants/achievements';
import { notificationService } from '../lib/notificationService';
import toast from 'react-hot-toast';

const DEFAULT_STATE = {
  finans: {
    approvalPool: [], // Diğer modüllerden gelen, onay bekleyen harcamalar
    buAyHarcamalar: [], // Bu ayın Supabase'den çekilen harcamaları (UI cache)
    kartMutabakat: {
      'gorkem-ziraat': { beklenen: 0, gercek: null, ay: null },
      'gorkem-ykb': { beklenen: 0, gercek: null, ay: null },
      'esra-garanti': { beklenen: 0, gercek: null, ay: null },
      'esra-enpara': { beklenen: 0, gercek: null, ay: null }
    },
    borclar: [],
    kartlar: [],
    kartOdemeleri: [],
    taksitler: [],
    rekurans: [],
    limits: { Mutfak: 15000, Sosyal: 5000, Saglik: 3000 }
  },
  users: {
    gorkem: {
      name: 'Görkem ERAY',
      birthDate: '31.10.1988',
      birthPlace: 'Eskişehir',
      phone: '+905070222666',
      email: 'gorkemeray@hotmail.com',
      bloodType: 'A Rh+',
      job: 'Software Architect',
      emoji: '👨‍💻',
      achievements: ['f1', 'sys1'] // Başlangıç için birkaç tane
    },
    esra: {
      name: 'Esra ERAY',
      birthDate: '05.01.1989',
      birthPlace: 'Antalya',
      phone: '+905394245664',
      email: 'eesra_yldrm@gmail.com',
      bloodType: '0 Rh+',
      job: 'Interior Designer',
      emoji: '👩‍🍳',
      achievements: ['k1', 'sys1']
    }
  },
  kasa: {
    bakiyeler: { gorkem: 15000, esra: 12000, ortak: 5000 },
    tasinmazlar: [],
    varliklar: [],
    kumbaralar: [],
    bankaHesaplari: [],
    privacyMode: false,
    rates: { EUR: 35.2, USD: 32.5, GBP: 40.0, GA: 2500, ETHFI: 21.15 }
  },
  mutfak: {
    menu: {},
    buzdolabi: [],
    kiler: [],
    dondurucu: [],
    alisveris: [],
    tarifler: [],
    siparisler: [],    // { id, dt, fr, wh, pr, u, tm }
    restaurantlar: [], // list of strings for auto-fill
    su: {
      level1: 80,
      level2: 60,
      dailyRate: 20,
      lastChecked: new Date().toISOString(),
      lastOrder: new Date().toISOString(),
      isEditing: false,
      history: []
    },
    consumption: {},
    sohbet: [],
    arsiv: [],
    history: [],
    priceHistory: {},
    ekmeklik: [],      // { id, tip, ic, raf, mk, adet, dt }
  },
  saglik: {
    randevular: [],
    ilaclar: [],
    olcumler: [],
    moods: [],
    sleep: [],
    sleepGoals: { gorkem: 6, esra: 9 },
    logs: []
  },
  // ── Global System ──────────────────────────────────
  system: {
    version: '4.2.0 "ARISTOTLE"',
    clientId: typeof window !== 'undefined' ? (localStorage.getItem('eraylar_client_id') || Math.random().toString(36).substring(2)) : 'ssr',
    globalScore: 85,
    onboardingComplete: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    notifications: [],
    isCloudReady: false,
    lastUpdatedBy: null,
    achievements: [
      { id: 'saving_king', title: 'Tasarruf Kralı', earned: true, icon: '👑' },
      { id: 'km_hunter', title: 'Kilometre Avcısı', earned: false, icon: '🏎️' },
      { id: 'gourmet', title: 'Gurme Aile', earned: true, icon: '🍳' }
    ],
    weeklyReports: [
      { id: 1, week: '15-21 Nisan', spending: 4500, health: 'İyi', goalsReached: 1 }
    ]
  },
  alisveris: {
    gorkem: [], // { id, nm, link, pr, dt, done, doneDate }
    esra: [],
    ev: [],
    wishlist: [], // { id, nm, link, pr, dt }
  },
  hedefler: {
    goals: [
      { 
        id: 'v1', 
        title: 'Almanca B2 Sertifikası', 
        owner: 'gorkem', 
        category: 'kariyer', 
        current: 40, 
        target: 100, 
        targetDate: '2026-12-30', 
        priority: 'Yüksek',
        milestones: [
          { id: 1, text: 'A1 & A2 Seviyesi Tamamla', done: true },
          { id: 2, text: 'B1 Kursuna Kayıt Ol', done: true },
          { id: 3, text: 'B2 Sınavına Gir', done: false }
        ]
      }
    ],

    hallOfFame: [],
    moodboard: { quote: "Büyük işler, küçük başlangıçlarla olur." },
    longTermVision: [
      { id: 'ltv1', text: 'Yazılım mimarı olarak global bir projede yer al.', type: 'career' },
      { id: 'ltv2', text: 'İlk yatırım evini teslim al.', type: 'finance' }
    ],
    completedHistory: [],
    failedHistory: []
  },
  sosyal: {
    aktiviteler: [],
    rutinler: [],
    havuz: [], // User custom ideas
    poolItems: INITIAL_SOCIAL_POOL || [], // The 50 activities
    routinePackages: SOCIAL_ROUTINES || [], // The 10 routines
    tab: 'hafta'
  },
  selectedVehicleId: 'v1',
  garaj: [
    {
      id: 'v1',
      type: 'car',
      brand: 'Toyota',
      model: 'C-HR 1.8 Hybrid',
      plaka: '34 HH 1144',
      km: 41452,
      marketValue: 1550000,
      parts: [],
      fuelLogs: [],
      services: [],
      documents: [],
      tireStatus: { type: 'Yazlık', changeDate: '2026-04-01', condition: 'İyi' },
      lastCleaned: '2026-04-23',
      parkLocation: { lat: null, lng: null, note: '', floor: '', spot: '', active: false },
      supportContacts: {
        yolYardim: { name: 'Toyota Asistanım', phone: '0212 708 00 55' },
        sigorta: { name: 'Neova Sigorta (Nisa Hanım)', phone: '0533 303 42 35' }
      }
    }
  ],
  ev: {
    depo: [], // { id, nm, qt, dt, pr, cardId, payer }
    faturalar: [],
    bakimlar: [],
    demirbaslar: [],
    tamirListesi: [], // Deprecated: use onarimListesi
    bakimListesi: [],  // Deprecated: use onarimListesi
    onarimListesi: [], // { id, task, status, createdBy, createdAt, completedBy, completedAt, clearedBy, clearedAt, isArchived }
    onarimLog: [], // Detailed history logs if needed
    ustaRehberi: [],
    duzenliOdemeler: [],
    abonelikler: [],
    bitkiler: [],
    guvenlik: {
      wifiMain: { ssid: 'superonline_wifi_1023', pass: 'MAUMFUFTH74L' },
      wifiGuest: { ssid: 'Tombis Yiğit', pass: 'Love2013' },
      safePassword: '', // User defined alphanumeric
      alarm: { code: '****', status: 'Armed' },
      fireExt: '2027-01-01'
    },
    yillikPlan: [],
    timeAnalysis: {
      gorkem: { home: 45, work: 40, other: 15, interpretation: "Bu hafta iş dengen gayet iyi görünüyor Görkem! ⚖️" },
      esra: { home: 60, work: 20, other: 20, interpretation: "Evde verimli bir hafta geçirdin Esra, sanat projelerine odaklanabilirsin. 🎨" }
    },
    lifeAdvice: [
      "Bugün hava çok güzel, 20 dakika yürüyüşe ne dersin? 🌳",
      "Uzun zamandır kitap okumadın, akşam 1 saat okuma saati yapabiliriz. 📖",
      "Evdeki bitkileri kontrol etmeyi unutma, sevgiye ihtiyaçları olabilir. 🪴",
      "Bugün yeni bir yemek tarifi denemek için harika bir gün! 🍲"
    ],
    emergencyKits: {
      deprem: [],
      ilkyardim: []
    },
    tracking: {
      home: { lat: 36.8841, lng: 30.7056, radius: 100, label: 'Evim', address: 'Kepez/Antalya' },
      work: { lat: 36.8969, lng: 30.7133, radius: 200, label: 'İşyerim', address: 'Muratpaşa/Antalya' },
      savedLocations: [], // Array of custom places { id, lat, lng, label, address, type }
      lastAnalysisDate: null,
      cachedAnalysis: null,
      routine: {
        workStart: '09:00',
        workEnd: '18:00',
        sleepStart: '23:30',
        sleepEnd: '07:30'
      },
      personality: { type: null, traits: {}, lastTestDate: null },
      weeklyHabits: {}, // { "Mon-09": { home: 2, work: 15, other: 1 }, ... }
      lastCheck: null,
      logs: []
    },
    personalSafe: {
      locked: true,
      activePageIndex: 0,
      pages: [
        { notes: "", stamps: [] },
        { notes: "", stamps: [] },
        { notes: "", stamps: [] },
        { notes: "", stamps: [] },
        { notes: "", stamps: [] }
      ]
    }
  },
  pet: {
    meta: PET_META,
    vaccines: [],
    weights: [],
    history: [],
    supplies: { waffle: { mama: 'var', kum: 'var' }, mayis: { mama: 'var', kum: 'var' } },
    gallery: { waffle: [], mayis: [] }
  },
  tatil: {
    trips: [],
    wishlist: [],
    passport: {
      gorkem: {
        name: 'Görkem',
        surname: 'ERAY',
        no: 'U28345678',
        nationality: 'TC',
        birthDate: '31.10.1988',
        issueDate: '15.10.2020',
        exp: '2030-10-15',
        birthPlace: 'Eskişehir'
      },
      esra: {
        name: 'Esra',
        surname: 'ERAY',
        no: 'U29456789',
        nationality: 'TC',
        birthDate: '05.01.1989',
        issueDate: '22.03.2021',
        exp: '2031-03-22',
        birthPlace: 'Antalya'
      }
    },
    visas: [],
    ttab: 'trips'
  },
  achievements: ACHIEVEMENTS,
  logs: [],
  ui: {
    isModalOpen: false
  },
  currentUser: null, // { name: 'Görkem', emoji: '👨‍💻' } or { name: 'Esra', emoji: '👩‍🍳' }
    muhendislik: {
      activeTab: 'muhendislik',
      pinnedConversions: ['p_bar_psi', 'f_kg_lb', 'q_lmin_gpm'],
      problemBank: [],
      decisionLog: [],
      crm: {
        customers: [],
        deals: []
      },
      life: {
        routines: [],
        programs: [],
        focusSessions: [],
        dailyActivities: []
      }
    },
  modaring: INITIAL_MODARING,
  family_id: 'eraylar-family-shared-id', // Fixed family ID for production consistency
};

async function fetchFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('eraylar_store')
      .select('data')
      .eq('id', 1)
      .single();

    if (error) return null;
    return data?.data || null;
  } catch (err) {
    return null;
  }
}

let lastSaveTime = 0;
let saveTimeout = null;

async function pushToSupabase(appData) {
  try {
    const now = Date.now();
    // Prevent saving too frequently (min 2 seconds between saves)
    if (now - lastSaveTime < 2000) {
      console.log('⏳ Save throttled, waiting for next window...');
      return;
    }

    lastSaveTime = now;
    console.log('📤 Pushing to Supabase...', { size: JSON.stringify(appData).length });
    const { error, status, statusText } = await supabase
      .from('eraylar_store')
      .upsert({ id: 1, data: appData });

    if (error) {
      console.error('❌ Supabase Upsert Error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        status,
        statusText
      });
      throw error;
    }
    console.log('✅ Supabase Push Successful');
  } catch (err) {
    console.error('❌ Supabase Push Catch:', err);
    throw err;
  }
}

// ── Finans Supabase Helpers ──────────────────────────────────
// Not: RLS politikaları gereği family_id gönderimi zorunludur.
const DEFAULT_FID = 'eraylar-family-shared-id';

// ── Generic Helpers for SSOT Migration ──────────────────────────────────
async function pushGenericToSupabase(tableName, payload) {
  try {
    const finalPayload = { ...payload, family_id: DEFAULT_FID };
    console.log(`📤 [${tableName}] upsert:`, finalPayload);
    const { error } = await supabase.from(tableName).upsert(finalPayload);
    if (error) {
      console.error(`❌ [${tableName}] upsert hatası:`, error);
      // Show toast only for critical tables
      if (tableName === 'ev_depo') {
        const { toast } = await import('react-hot-toast');
        toast.error(`Depo kaydı hatasi: ${error.message}`, { duration: 5000 });
      }
    } else {
      console.log(`✅ [${tableName}] upsert başarılı: ${payload.id}`);
    }
  } catch (e) {
    console.error(`❌ [${tableName}] upsert exception:`, e);
  }
}

async function removeGenericFromSupabase(tableName, id) {
  try {
    const cleanId = String(id);
    console.log(`🗑️ [${tableName}] delete id: ${cleanId}`);
    const { error } = await supabase.from(tableName).delete().eq('id', cleanId);
    if (error) console.error(`❌ [${tableName}] delete hatası:`, error);
    else console.log(`✅ [${tableName}] delete başarılı: ${cleanId}`);
  } catch (e) {
    console.error(`❌ [${tableName}] delete exception:`, e);
  }
}



// Çok daha güvenilir UUID oluşturucu
const generateUniqueId = () => {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (e) {}
  // Fallback: Time + Random string
  return `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

async function pushHarcamaToSupabase(harcama, familyId = DEFAULT_FID) {
  try {
    // ID'yi auto-increment olarak DB belirleyecek

    // banka_id'yi notlar alanına göm ve payload'dan çıkar
    let finalNotlar = harcama.notlar || '';
    // Varsa eski banka_id etiketini temizle
    finalNotlar = finalNotlar.replace(/\n?\[banka_id:[^\]]+\]/g, '').trim();
    if (harcama.banka_id) {
      finalNotlar = finalNotlar ? `${finalNotlar}\n[banka_id: ${harcama.banka_id}]` : `[banka_id: ${harcama.banka_id}]`;
    }

    const payload = {
      family_id: familyId,
      ay: harcama.ay,
      tarih: harcama.tarih,
      baslik: harcama.baslik,
      tutar: Number(harcama.tutar),
      kategori: harcama.kategori || 'Diğer',
      kart_id: harcama.kart_id || null,
      odenme_turu: harcama.odenme_turu || 'kart',
      kayit_eden: harcama.kayit_eden || 'Sistem',
      kaynak: harcama.kaynak || 'Manuel',
      durum: 'onaylı',
      notlar: finalNotlar || null
    };

    const { data, error } = await supabase
      .from('finans_harcamalar')
      .insert(payload)
      .select();

    if (error) {
      // ID çakışması veya başka bir hata durumunda, ID'yi Supabase'e bırakıp tekrar deneyelim
      console.warn('⚠️ Supabase insert retry without custom ID...', error.message);
      const { data: retryData, error: retryError } = await supabase
        .from('finans_harcamalar')
        .insert({ ...payload, id: undefined })
        .select();
      
      if (retryError) throw retryError;
      return retryData && retryData[0] ? retryData[0] : null;
    }
    return data && data[0] ? data[0] : null;
  } catch (err) {
    console.error('❌ finans_harcamalar push error:', err);
    throw err;
  }
}

async function deleteHarcamaFromSupabase(id, familyId = DEFAULT_FID, item = null) {
  try {
    // 1. Serbest ID ile fiziksel silme
    const { count } = await supabase
      .from('finans_harcamalar')
      .delete()
      .eq('id', id);
    
    if (count > 0) return; 

    // 2. Fallback: ID uyuşmazlığı varsa özelliklerle fiziksel silme
    if (item) {
       await supabase
        .from('finans_harcamalar')
        .delete()
        .eq('baslik', item.baslik)
        .eq('tarih', item.tarih)
        .eq('tutar', Number(item.tutar));
    }
  } catch (err) {
    console.error('❌ deleteHarcamaFromSupabase hatası:', err);
  }
}

async function updateHarcamaInSupabase(id, updates) {
  // Sadece veritabanında var olan geçerli sütunları temizleyerek payload oluşturalım
  const dbUpdates = {};
  if (updates.ay !== undefined) dbUpdates.ay = updates.ay;
  if (updates.tarih !== undefined) dbUpdates.tarih = updates.tarih;
  if (updates.baslik !== undefined) dbUpdates.baslik = updates.baslik;
  if (updates.tutar !== undefined) dbUpdates.tutar = Number(updates.tutar);
  if (updates.kategori !== undefined) dbUpdates.kategori = updates.kategori;
  if (updates.kart_id !== undefined) dbUpdates.kart_id = updates.kart_id || null;
  if (updates.odenme_turu !== undefined) dbUpdates.odenme_turu = updates.odenme_turu;
  if (updates.kayit_eden !== undefined) dbUpdates.kayit_eden = updates.kayit_eden;
  if (updates.kaynak !== undefined) dbUpdates.kaynak = updates.kaynak;
  if (updates.durum !== undefined) dbUpdates.durum = updates.durum;

  // banka_id güncelleniyorsa veya notlar güncelleniyorsa, notlar alanını harmanla
  // banka_id kolonunun veritabanında olmadığını bildiğimiz için, notlar alanına gömüyoruz
  if (updates.banka_id !== undefined || updates.notlar !== undefined) {
    let baseNotlar = updates.notlar !== undefined ? (updates.notlar || '') : '';
    // Eğer updates içinde notlar verilmediyse, mevcudu korumak için local state'den notları çekelim
    if (updates.notlar === undefined) {
      const currentItem = get().finans.buAyHarcamalar.find(h => h.id === id);
      baseNotlar = currentItem?.notlar || '';
    }
    
    let cleanNotlar = baseNotlar.replace(/\n?\[banka_id:[^\]]+\]/g, '').trim();
    // updates.banka_id belirtilmişse onu kullan, belirtilmemişse mevcut banka_id'yi koru (odenme_turu 'havale' ise)
    let targetBankaId = null;
    if (updates.banka_id !== undefined) {
      targetBankaId = updates.banka_id;
    } else {
      const currentItem = get().finans.buAyHarcamalar.find(h => h.id === id);
      targetBankaId = currentItem?.banka_id || null;
    }

    if (targetBankaId) {
      cleanNotlar = cleanNotlar ? `${cleanNotlar}\n[banka_id: ${targetBankaId}]` : `[banka_id: ${targetBankaId}]`;
    }
    dbUpdates.notlar = cleanNotlar || null;
  }

  const { error } = await supabase.from('finans_harcamalar').update(dbUpdates).eq('id', id);
  if (error) {
    console.error('❌ updateHarcamaInSupabase error:', error);
    throw error;
  }
}

async function fetchBuAyHarcamalar(familyId = DEFAULT_FID) {
  try {
    const buAy = new Date().toISOString().slice(0, 7);
    const { data, error } = await supabase
      .from('finans_harcamalar')
      .select('*')
      .eq('family_id', familyId)
      .eq('ay', buAy)
      .order('tarih', { ascending: false });
    if (error) throw error;
    
    // notlar alanındaki [banka_id: ...] etiketlerini ayrıştırıp objelere geri yükle
    const parsedData = (data || []).map(item => {
      let banka_id = null;
      let cleanNotlar = item.notlar || '';
      if (cleanNotlar) {
        const match = cleanNotlar.match(/\[banka_id:\s*([^\]]+)\]/);
        if (match) {
          banka_id = match[1].trim();
          cleanNotlar = cleanNotlar.replace(/\n?\[banka_id:[^\]]+\]/g, '').trim();
        }
      }
      return {
        ...item,
        banka_id: banka_id,
        notlar: cleanNotlar || null,
        odenme_turu: banka_id ? 'havale' : item.odenme_turu
      };
    });
    return parsedData;
  } catch (err) {
    console.error('❌ fetchBuAyHarcamalar error:', err);
    return [];
  }
}

async function fetchGecmisAyFromSupabase(ay, familyId = DEFAULT_FID) {
  try {
    const { data, error } = await supabase
      .from('finans_harcamalar')
      .select('*')
      .eq('family_id', familyId)
      .eq('ay', ay)
      .order('tarih', { ascending: false });
    if (error) throw error;
    
    // notlar alanındaki [banka_id: ...] etiketlerini ayrıştırıp objelere geri yükle
    const parsedData = (data || []).map(item => {
      let banka_id = null;
      let cleanNotlar = item.notlar || '';
      if (cleanNotlar) {
        const match = cleanNotlar.match(/\[banka_id:\s*([^\]]+)\]/);
        if (match) {
          banka_id = match[1].trim();
          cleanNotlar = cleanNotlar.replace(/\n?\[banka_id:[^\]]+\]/g, '').trim();
        }
      }
      return {
        ...item,
        banka_id: banka_id,
        notlar: cleanNotlar || null,
        odenme_turu: banka_id ? 'havale' : item.odenme_turu
      };
    });
    return parsedData;
  } catch (err) {
    console.error('❌ fetchGecmisAy error:', err);
    return [];
  }
}

async function fetchArsivFromSupabase(familyId = DEFAULT_FID, limit = 12) {
  try {
    const { data, error } = await supabase
      .from('finans_arsiv')
      .select('*')
      .eq('family_id', familyId)
      .order('ay', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('❌ fetchArsiv error:', err);
    return [];
  }
}

async function upsertKartMutabakat(kart_id, ay, beklenen, gercek, guncel, familyId = DEFAULT_FID) {
  try {
    const { error } = await supabase
      .from('finans_kart_mutabakat')
      .upsert({
        family_id: familyId,
        kart_id,
        ay,
        beklenen_borc: beklenen,
        gercek_borc: gercek,
        guncel_borc: guncel || gercek
    }, { onConflict: 'family_id,kart_id,ay' });
    if (error) throw error;
  } catch (err) {
    console.error('❌ upsertKartMutabakat error:', err);
  }
}

async function pushKartOdeme(odeme, familyId = DEFAULT_FID) {
  try {
    const { error } = await supabase.from('finans_kart_odemeler').upsert({
      id: odeme.id,
      family_id: familyId,
      kart_id: odeme.kart_id,
      ay: odeme.ay,
      tutar: Number(odeme.tutar),
      turu: odeme.turu || 'full',
      kaynak: odeme.kaynak || 'havale',
      banka_id: odeme.banka_id || null,
      tarih: odeme.tarih || new Date().toISOString().split('T')[0],
      ekleyen: odeme.ekleyen || null,
      not_: odeme.not_ || null
    });
    if (error) throw error;
  } catch (err) {
    console.error('❌ pushKartOdeme error:', err);
  }
}

async function fetchKartOdemeler(familyId = DEFAULT_FID) {
  try {
    const { data, error } = await supabase
      .from('finans_kart_odemeler')
      .select('*')
      .eq('family_id', familyId)
      .order('tarih', { ascending: false })
      .limit(60);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('❌ fetchKartOdemeler error:', err);
    return [];
  }
}

async function deleteKartOdemeFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const { error } = await supabase.from('finans_kart_odemeler').delete().eq('id', id).eq('family_id', familyId);
    if (error) throw error;
  } catch (err) {
    console.error('❌ deleteKartOdeme error:', err);
  }
}

async function updateKartOdemeInSupabase(id, updates) {
  try {
    const { error } = await supabase.from('finans_kart_odemeler').update(updates).eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('❌ updateKartOdeme error:', err);
  }
}

async function pushTaksitToSupabase(taksit, familyId = DEFAULT_FID) {
  try {
    const { error } = await supabase.from('finans_taksitler').upsert({
      id: taksit.id || generateUniqueId(),
      family_id: familyId,
      kart_id: taksit.kart_id,
      baslik: taksit.baslik,
      toplam_tutar: Number(taksit.toplam_tutar),
      taksit_sayisi: Number(taksit.taksit_sayisi),
      kalan_taksit: Number(taksit.kalan_taksit !== undefined && taksit.kalan_taksit !== null ? taksit.kalan_taksit : taksit.taksit_sayisi),
      baslangic_tarihi: taksit.baslangic_tarihi || new Date().toISOString().split('T')[0],
      kategori: taksit.kategori || 'Genel'
    });
    if (error) throw error;
  } catch (err) {
    console.error('❌ pushTaksit error:', err);
  }
}

async function fetchTaksitler(familyId = DEFAULT_FID) {
  try {
    const { data, error } = await supabase
      .from('finans_taksitler')
      .select('*')
      .eq('family_id', familyId);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('❌ fetchTaksitler error:', err);
    return [];
  }
}

async function deleteTaksitFromSupabase(id) {
  try {
    const { error } = await supabase.from('finans_taksitler').delete().eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('❌ deleteTaksit error:', err);
  }
}

// --- GRUP 1 (Mutfak, Alışveriş, Sosyal) SUPABASE GÖLGE YAZIM ---
async function pushMutfakStokToSupabase(item, category) {
  try {
    const familyId = 'eraylar-family-shared-id';
    const payload = {
      id: `${category}-${item.n || item.isim}-${familyId}`,
      kategori: category,
      isim: item.n || item.isim,
      miktar: Number(item.cr || item.miktar || 0),
      birim: item.u || item.birim || 'adet',
      min_stok: Number(item.mn || item.min_stok || 0),
      emoji: item.ic || item.emoji || '📦',
      reyon: item.ct || item.reyon || 'Genel',
      marka: item.br || item.marka || '',
      market: item.mk || item.market || '',
      paket: item.pk || item.paket || '',
      son_kullanma: item.ex || item.bt || item.son_kullanma || null,
      family_id: familyId
    };
    const { error } = await supabase.from('mutfak_stok').upsert(payload);
    if (error) throw error;
  } catch(e) { console.warn('Mutfak Stok Hatası:', e); }
}

async function pushMutfakSuToSupabase(suData) {
  try {
    const familyId = 'eraylar-family-shared-id';
    const payload = {
      id: `mutfak_su-${familyId}`,
      level1: suData.level1 ?? 100,
      level2: suData.level2 ?? 100,
      daily_rate: suData.dailyRate ?? 20,
      last_checked: suData.lastChecked || null,
      last_order: suData.lastOrder || null,
      history: suData.history || [],
      family_id: familyId
    };
    await supabase.from('mutfak_su').upsert(payload);
  } catch(e) { console.warn('Mutfak Su Hatası:', e); }
}

async function removeMutfakStokFromSupabase(id) {
  try {
    const familyId = 'eraylar-family-shared-id';
    await supabase.from('mutfak_stok')
      .delete()
      .eq('id', String(id))
      .eq('family_id', familyId);
  } catch(e) { console.warn('Supabase Mutfak Stok delete hatası:', e); }
}

async function pushMutfakTarifToSupabase(t) {
  try {
    const familyId = 'eraylar-family-shared-id';
    const payload = {
      id: `${t.id}-${familyId}`,
      isim: t.n || t.isim,
      kategori: t.c || t.kategori,
      sure: Number(t.t || t.sure || 30),
      zorluk: Number(t.d || t.zorluk || 1),
      emoji: t.e || t.emoji || '🍳',
      malzemeler: Array.isArray(t.ig) ? t.ig : [],
      favori: !!t.f,
      puan: Number(t.p || 20)
    };
    const { error } = await supabase.from('mutfak_tarifler').upsert(payload);
    if (error) throw error;
  } catch(e) { console.warn('Tarif Hatası:', e); }
}

async function removeMutfakTarifFromSupabase(id) {
  try {
    await supabase.from('mutfak_tarifler').delete().eq('id', String(id));
  } catch(e) { console.warn('Supabase Mutfak Tarif delete hatası:', e); }
}

async function pushAlisverisToSupabase(item, kime) {
  try {
    const familyId = useStore.getState().family_id;
    // Map kime to liste_tipi (gorkem -> genel_gorkem, etc.)
    let listeTipi = kime;
    if (['gorkem', 'esra', 'ev'].includes(kime)) {
      listeTipi = `genel_${kime}`;
    }

    const payload = {
      id: String(item.id),
      family_id: familyId,
      isim: item.nm || item.isim,
      link: item.link || '',
      fiyat: Number(item.pr || item.fiyat || 0),
      tarih: item.dt || item.tarih || new Date().toISOString(),
      alindi: !!item.done,
      tamamlanma_tarihi: item.doneDate || null,
      liste_tipi: listeTipi,
      ekleyen: item.doneBy || 'Sistem'
    };
    const { error } = await supabase.from('alisveris_listesi').upsert(payload);
    if (error) throw error;
  } catch(e) { console.warn('Alisveris Hatası:', e); }
}

async function pushMutfakMenuToSupabase(day, type, mealName) {
  try {
    const payload = {
      id: `${day}-${type}`,
      gun: day,
      ogun: type,
      yemek_adi: mealName,
      tarih: new Date().toISOString().split('T')[0]
    };
    await supabase.from('mutfak_menu').upsert(payload);
  } catch(e) { console.warn('Menu Hatası:', e); }
}

async function removeAlisverisFromSupabase(id) {
  try {
    const familyId = useStore.getState().family_id;
    await supabase.from('alisveris_listesi').delete().eq('id', String(id)).eq('family_id', familyId);
  } catch(e) { console.warn('Supabase Alisveris delete hatası:', e); }
}

async function pushSosyalEtkinlikToSupabase(activity) {
  try {
    const familyId = 'eraylar-family-shared-id';
    const payload = {
      id: `${activity.id}-${familyId}`,
      baslik: activity.baslik || activity.title || 'İsimsiz',
      tarih: (activity.tarih && activity.tarih !== '') ? activity.tarih : ((activity.date && activity.date !== '') ? activity.date : null),
      saat: activity.saat || activity.time || null,
      emoji: activity.emoji || activity.icon || '🎭',
      tur: activity.tur || activity.type || 'genel',
      harcama: Number(activity.harcama || activity.cost || 0),
      kisi_sayisi: Number(activity.kisiSayisi || 2),
      puan_gorkem: Number(activity.puan_gorkem || 0),
      puan_esra: Number(activity.puan_esra || 0),
      yorum_gorkem: activity.yorum_gorkem || null,
      yorum_esra: activity.yorum_esra || null,
      detaylar: activity.detaylar || null,
      durum: activity.durum || (activity.tamamlandi ? 'tamamlandi' : 'planda'),
      family_id: familyId
    };
    const { error } = await supabase.from('sosyal_etkinlikler').upsert(payload);
    if (error) throw error;
  } catch(e) { console.warn('Sosyal Hatası:', e); }
}

async function removeSosyalEtkinlikFromSupabase(id) {
  try {
    const familyId = 'eraylar-family-shared-id';
    await supabase.from('sosyal_etkinlikler')
      .delete()
      .eq('id', String(id))
      .eq('family_id', familyId);
  } catch(e) { console.warn('Supabase Sosyal delete hatası:', e); }
}
// ----------------------------------------------------------------

async function upsertArsiv(ay, ozet, familyId = DEFAULT_FID) {
  try {
    const { error } = await supabase
      .from('finans_arsiv')
      .upsert({
        family_id: familyId,
        ay,
        ...ozet
    }, { onConflict: 'family_id,ay' });
    if (error) throw error;
  } catch (err) {
    console.error('❌ upsertArsiv error:', err);
  }
}
// ─────────────────────────────────────────────────────────────


// --- FAZ 1: HEDEFLER VE FINANS GÖLGE YAZIM YARDIMCILARI ---
async function pushHedefToSupabase(goal) {
  try {
    const familyId = DEFAULT_FID;
    const payload = {
      id: String(goal.id).includes(familyId) ? String(goal.id) : `${goal.id}-${familyId}`,
      title: goal.title || goal.name || 'İsimsiz Hedef',
      target: Number(goal.target) || 100,
      current: Number(goal.current) || 0,
      target_date: goal.targetDate || goal.deadline || null,
      duration: goal.duration ? String(goal.duration) : null,
      priority: goal.priority || 'Orta',
      owner: goal.owner || 'ortak',
      category: goal.category || 'genel',
      notes: goal.notes || null,
      milestones: goal.milestones || [],
      yearly_plan: goal.yearlyPlan || null,
      type: goal.type || (goal.name ? 'money' : 'vision'),
      family_id: familyId
    };
    const { error } = await supabase.from('hedefler_aktif').upsert(payload);
    if (error) throw error;
    console.log(`✅ Hedef SQL'e kaydedildi: ${payload.title}`);
  } catch(e) { 
    console.error('❌ Supabase Hedef upsert hatası:', e);
  }
}

async function fetchHedefler(familyId = DEFAULT_FID) {
  try {
    const { data, error } = await supabase.from('hedefler_aktif').select('*').eq('family_id', familyId);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('❌ fetchHedefler error:', err);
    return [];
  }
}

async function fetchHedefGecmis(familyId = DEFAULT_FID) {
  try {
    const { data, error } = await supabase.from('hedefler_gecmis').select('*').eq('family_id', familyId).order('resolved_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('❌ fetchHedefGecmis error:', err);
    return [];
  }
}

async function fetchVizyonPlanlar(familyId = DEFAULT_FID) {
  try {
    const { data, error } = await supabase.from('hedefler_vizyon').select('*').eq('family_id', familyId);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('❌ fetchVizyonPlanlar error:', err);
    return [];
  }
}

async function fetchHabits(familyId = DEFAULT_FID) {
  try {
    const { data, error } = await supabase.from('hedefler_habits').select('*').eq('family_id', familyId);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('❌ fetchHabits error:', err);
    return [];
  }
}

async function deleteHedefFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const finalId = String(id).includes(familyId) ? String(id) : `${id}-${familyId}`;
    await supabase.from('hedefler_aktif').delete().eq('id', finalId).eq('family_id', familyId);
  } catch(e) { console.warn('Hedef Silme Hatası:', e); }
}

async function pushHedefGecmisToSupabase(h, status = 'completed') {
  try {
    const familyId = DEFAULT_FID;
    const payload = {
      id: String(h.id).includes(familyId) ? String(h.id) : `${h.id}-${familyId}`,
      title: h.title || h.name || 'İsimsiz',
      owner: h.owner || 'ortak',
      category: h.category || 'genel',
      notes: h.notes || null,
      status: status, 
      reflection: h.reflection || null,
      resolved_at: h.completedAt || h.failedAt || h.date || new Date().toISOString(),
      family_id: familyId
    };
    await supabase.from('hedefler_gecmis').upsert(payload);
  } catch(e) { console.warn('Supabase Geçmiş upsert hatası:', e); }
}

async function pushHabitToSupabase(habit) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('hedefler_habits').upsert({
      id: String(habit.id).includes(familyId) ? String(habit.id) : `${habit.id}-${familyId}`,
      name: habit.name,
      streak: Number(habit.streak || 0),
      last_done: habit.lastDone || null,
      family_id: familyId
    });
  } catch(e) { console.warn('Habit Hatası:', e); }
}

async function pushVizyonPlanToSupabase(p) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('hedefler_vizyon').upsert({
      id: String(p.id).includes(familyId) ? String(p.id) : `${p.id}-${familyId}`,
      text: p.text || '',
      type: p.type || 'career',
      owner: p.owner || 'ortak',
      family_id: familyId
    });
  } catch(e) { console.warn('Supabase Vizyon upsert hatası:', e); }
}

async function deleteVizyonPlanFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const finalId = String(id).includes(familyId) ? String(id) : `${id}-${familyId}`;
    await supabase.from('hedefler_vizyon').delete().eq('id', finalId).eq('family_id', familyId);
  } catch(e){}
}

async function syncFinansKartlar(kartlar) {
  try {
    const payloads = kartlar.map(k => ({
      id: String(k.id),
      name: k.name,
      owner: k.owner,
      cutoff_day: Number(k.cutoff_day),
      color: k.color,
      min_pct: Number(k.min_pct || 20),
      limit: Number(k.limit || 0),
      balance: Number(k.balance || 0),
      due_day_offset: Number(k.due_day_offset || 10)
    }));
    if(payloads.length > 0) {
      const res = await supabase.from('finans_kartlar').upsert(payloads);
      if(res.error) console.error('❌ Kartlar Sync Error:', res.error);
      else console.log('✅ Kartlar Sync Success (with limit+balance)');
    }
  } catch(e) { console.warn('Supabase Kartlar upsert hatası:', e); }
}

async function syncFinansKrediler(borclar) {
  try {
    const payloads = borclar.map(b => ({
      id: String(b.id),
      name: b.name,
      due_day: Number(b.due_day),
      total: Number(b.total),
      remaining: Number(b.remaining),
      monthly: Number(b.monthly)
    }));
    // NOTE: Upsert only updates/inserts. Explicit delete functions handle removals.
    if(payloads.length > 0) {
      const res = await supabase.from('finans_krediler').upsert(payloads);
      if(res.error) console.error('❌ Krediler Sync Error:', res.error);
      else console.log('✅ Krediler Sync Success');
    }
  } catch(e) { console.warn('Supabase Krediler upsert hatası:', e); }
}

async function deleteFinansKartFromSupabase(id) {
  try { await supabase.from('finans_kartlar').delete().eq('id', String(id)); } catch(e){}
}
async function deleteFinansKrediFromSupabase(id) {
  try { await supabase.from('finans_krediler').delete().eq('id', String(id)); } catch(e){}
}

async function syncFinansOnayHavuzu(pool) {
  try {
    const payloads = pool.map(p => ({
      id: String(p.id),
      baslik: p.title || p.baslik,
      tutar: Number(p.amount || p.tutar),
      kaynak: p.source || p.kaynak,
      kayit_eden: p.payer || p.kayit_eden,
      tarih: p.dt || p.tarih || null,
      default_pay: p.defaultPay || null
    }));
    if(payloads.length > 0) await supabase.from('finans_onay_havuzu').upsert(payloads);
  } catch(e) { console.warn('Supabase Onay Havuzu upsert hatası:', e); }
}
// -----------------------------------------------------------------

// --- GRUP 2: EV, GARAJ, PET, SAĞLIK GÖLGE YAZIM YARDIMCILARI ---

async function pushEvDuzenliOdemeToSupabase(item) {
  try {
    await supabase.from('ev_duzenli_odemeler').upsert({
      id: String(item.id), name: item.name, amount: Number(item.amount || 0),
      date: Number(item.date || 1), linked_card_id: item.linkedCardId || null,
      auto_pay: !!item.autoPay, icon: item.icon || '💳',
      provider: item.provider || null, customer_no: item.customerNo || null,
      contract_end_date: item.contractEndDate || null,
      family_id: DEFAULT_FID
    });
  } catch(e) { console.warn('Ev Ödeme Hatası:', e); }
}

async function pushEvAbonelikToSupabase(item) {
  try {
    await supabase.from('ev_abonelikler').upsert({
      id: String(item.id), name: item.name, amount: Number(item.amount || 0),
      date: Number(item.date || 1), linked_card_id: item.linkedCardId || null,
      auto_pay: !!item.autoPay, icon: item.icon || '📺',
      start_date: item.startDate || null,
      family_id: DEFAULT_FID
    });
  } catch(e) { console.warn('Ev Abonelik Hatası:', e); }
}

async function pushEvOnarimToSupabase(item) {
  try {
    const payload = {
      id: String(item.id),
      task: item.task,
      status: item.status || 'Pending',
      created_by: item.createdBy || null,
      created_at: item.createdAt || null,
      completed_by: item.completedBy || null,
      completed_at: item.completedAt || null,
      cleared_by: item.clearedBy || null,
      cleared_at: item.clearedAt || null,
      is_archived: !!item.isArchived,
      assigned_to: item.assignedTo || null,
      due_date: item.dueDate || null,
      family_id: DEFAULT_FID
    };
    const res = await supabase.from('ev_onarim').upsert(payload);
    if (res.error) {
      // Self-heal: if family_id column missing, retry without it
      if (res.error.code === 'PGRST204' || res.error.message?.includes('family_id')) {
        console.warn('[Self-Healing] ev_onarim missing family_id column, retrying without it');
        const { family_id, ...fallback } = payload;
        const res2 = await supabase.from('ev_onarim').upsert(fallback);
        if (res2.error) console.error('❌ Onarım Sync Error (fallback):', res2.error);
        else console.log('✅ Onarım Sync Success (fallback)');
      } else {
        console.error('❌ Onarım Sync Error:', res.error);
      }
    } else {
      console.log('✅ Onarım Sync Success:', item.id);
    }
  } catch(e) { console.warn('Ev Onarım Hatası:', e); }
}

async function pushEvDemirbasToSupabase(item) {
  try {
    await supabase.from('ev_demirbaslar').upsert({
      id: String(item.id), name: item.name, brand: item.brand || null,
      warranty_date: item.warrantyDate || null, photo: item.photo || null,
      family_id: DEFAULT_FID
    });
  } catch(e) { console.warn('Ev Demirbaş Hatası:', e); }
}

async function pushEvBakimToSupabase(item) {
  try {
    await supabase.from('ev_bakimlar').upsert({
      id: String(item.id), name: item.name, last_date: item.lastDate || null,
      interval_days: Number(item.intervalDays || 180), icon: item.icon || '🔧',
      brand: item.brand || null, model: item.model || null, part_no: item.partNo || null,
      family_id: DEFAULT_FID
    });
  } catch(e) { console.warn('Ev Bakım Hatası:', e); }
}

async function pushGarajYakitToSupabase(log, vehicleId = 'v1') {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('garaj_yakit').upsert({
      id: String(log.id), vehicle_id: vehicleId, tarih: log.tarih || log.dt || log.date || null,
      km: Number(log.km || 0), 
      litre: Number(log.litre || log.lt || log.amount || 0),
      tutar: Number(log.tutar || log.pr || (log.amount && log.price ? log.amount * log.price : 0)), 
      istasyon: log.istasyon || log.st || log.station || null,
      tip: log.tip || log.tp || 'benzin', dolu: log.dolu !== false,
      family_id: familyId
    });
  } catch(e) { console.warn('Garaj Yakıt Hatası:', e); }
}

async function pushGarajServisToSupabase(svc, vehicleId = 'v1') {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('garaj_servis').upsert({
      id: String(svc.id), vehicle_id: vehicleId, 
      tarih: svc.tarih || svc.date || svc.dt || null,
      km: Number(svc.km || 0), 
      islem: svc.islem || svc.title || svc.n || null,
      tutar: Number(svc.tutar || svc.cost || svc.pr || 0), 
      yer: svc.yer || svc.shop || svc.loc || null,
      notlar: svc.notlar || svc.nt || null,
      family_id: familyId
    });
  } catch(e) { console.warn('Garaj Servis Hatası:', e); }
}

async function pushGarajBelgeToSupabase(doc, vehicleId = 'v1') {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('garaj_belgeler').upsert({
      id: String(doc.id), vehicle_id: vehicleId, name: doc.name,
      due_date: doc.dueDate || doc.due_date || null, icon: doc.icon || '📄',
      family_id: familyId
    });
  } catch(e) { console.warn('Garaj Belge Hatası:', e); }
}

async function deleteGarajBelgeFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('garaj_belgeler').delete().eq('id', String(id)).eq('family_id', familyId);
  } catch(e) {}
}

async function pushGarajAracToSupabase(vehicle) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('garaj_araclar').upsert({
      id: vehicle.id,
      family_id: familyId,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      plaka: vehicle.plaka,
      km: Number(vehicle.km || 0),
      market_value: Number(vehicle.marketValue || 0),
      last_cleaned: vehicle.lastCleaned || null
    });
  } catch(e) { console.warn('Garaj Araç Hatası:', e); }
}

async function deleteGarajAracFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('garaj_araclar').delete().eq('id', String(id)).eq('family_id', familyId);
  } catch(e) {}
}

async function pushGarajParkToSupabase(park, vehicleId) {
  try {
    const familyId = DEFAULT_FID;
    const { error } = await supabase.from('garaj_park').upsert({
      id: vehicleId,
      vehicle_id: vehicleId,
      lat: park.lat || null,
      lng: park.lng || null,
      note: park.note || '',
      floor: park.floor || '',
      spot: park.spot || '',
      active: !!park.active,
      family_id: familyId
    });
    if (error) console.error('Garaj Park Upsert Hatası:', error);
  } catch(e) { console.warn('Garaj Park Hatası:', e); }
}

async function pushPetAsiToSupabase(petId, vaccine) {
  try {
    const payloadNotes = JSON.stringify({ notes: vaccine.notes || '', ev: vaccine.ev || 60 });
    await supabase.from('pet_asilar').upsert({
      id: `${petId}-${vaccine.id || vaccine.n || vaccine.name}`, pet_id: petId,
      asi_adi: vaccine.n || vaccine.name || vaccine.asi_adi, 
      son_tarih: vaccine.last || vaccine.lastDate || vaccine.son_tarih || null,
      sonraki_tarih: vaccine.nextDate || vaccine.sonraki_tarih || null,
      durum: vaccine.done ? 'tamamlandi' : 'bekliyor', notlar: payloadNotes,
      family_id: DEFAULT_FID
    });
  } catch(e) { console.warn('Pet Aşı Hatası:', e); }
}

async function pushPetAgirlikToSupabase(petId, entry) {
  try {
    await supabase.from('pet_agirlik').upsert({
      id: String(entry.id || `${petId}-${entry.dt || entry.date || Date.now()}`), pet_id: petId,
      tarih: entry.dt || entry.date || entry.tarih || new Date().toISOString(),
      kilo: Number(entry.w || entry.weight || entry.kilo || 0), notlar: entry.notes || null
    });
  } catch(e) { console.warn('Pet Ağırlık Hatası:', e); }
}

async function pushSaglikIlacToSupabase(i) {
  try {
    const payload = {
      id: String(i.id),
      kisi: i.kisi,
      ad: i.ad,
      dozaj: i.dozaj || null,
      siklik: i.siklik || i.sıklık || null,
      stok: Number(i.stok || 0),
      min_stok: Number(i.minStok || 5),
      schedule: i.schedule || {
        morning: Number(i.morning || 0),
        afternoon: Number(i.afternoon || 0),
        evening: Number(i.evening || 0)
      }
    };

    const { error } = await supabase.from('saglik_ilaclar').upsert(payload);
    if (error) {
      console.error('❌ Supabase İlaç Hatası:', error);
      toast.error('İlaç kaydedilemedi: ' + error.message);
    }
  } catch(e) { 
    console.error('❌ Sağlık İlaç Catch:', e); 
  }
}

async function pushSaglikRandevuToSupabase(r) {
  try {
    const payload = {
      id: String(r.id),
      kisi: r.kisi,
      doktor: r.doktor || null,
      tarih: r.tarih || null,
      saat: r.saat || null,
      not_text: r.not || null,
      rekurans: r.rekurans || 'yok'
    };

    const { error } = await supabase.from('saglik_randevular').upsert(payload);
    if (error) {
      console.error('❌ Supabase Randevu Hatası:', error);
      toast.error('Randevu kaydedilemedi: ' + error.message);
    }
  } catch(e) { 
    console.error('❌ Sağlık Randevu Catch:', e); 
  }
}


async function pushSaglikOlcumToSupabase(o, familyId) {
  try {
    await supabase.from('saglik_olcumler').upsert({
      id: String(o.id), 
      family_id: familyId,
      kisi: o.kisi, tur: o.tur || null,
      deger: o.deger || null, tarih: o.tarih || null
    });
  } catch(e) { console.warn('Sağlık Ölçüm Hatası:', e); }
}

async function pushSaglikMoodToSupabase(m, familyId) {
  try {
    await supabase.from('saglik_moods').upsert({
      id: String(m.id),
      family_id: familyId,
      "user": m.user,
      mood: m.mood,
      note: m.note || null,
      kategori: m.kategori || 'Genel',
      date: m.date || new Date().toISOString()
    });
  } catch(e) { console.warn('Sağlık Mood Hatası:', e); }
}

async function pushSaglikLogToSupabase(l, familyId = DEFAULT_FID) {
  try {
    const { error } = await supabase.from('saglik_logs').upsert({
      id: String(l.id),
      family_id: familyId,
      med_id: String(l.medId),
      ad: l.ad,
      kisi: l.kisi,
      slot: l.slot,
      date: l.date,
      dt: l.dt || null
    });
    if (error) {
      console.error('❌ Supabase İlaç Log Hatası:', error);
      toast.error('İlaç kaydı buluta işlenemedi: ' + error.message);
    }
  } catch(e) { 
    console.error('❌ Sağlık Log Catch:', e); 
  }
}

async function pushSaglikSleepToSupabase(s) {
  try {
    const payload = {
      id: String(s.id),
      kisi: s.kisi,
      tarih: s.tarih,
      saat: Number(s.sure || 0),
      kalite: String(s.kalite || '3')
    };

    const { error } = await supabase.from('saglik_sleep').upsert(payload);
    if (error) {
      console.error('❌ Supabase Uyku Hatası:', error);
      toast.error('Uyku verisi kaydedilemedi: ' + error.message);
    }
  } catch(e) { 
    console.error('❌ Sağlık Uyku Catch:', e); 
  }
}

async function deleteSaglikSleepFromSupabase(id) {
  try {
    await supabase.from('saglik_sleep').delete().eq('id', String(id));
  } catch(e) { console.warn('Sağlık Uyku Silme Hatası:', e); }
}

// --- Deletion Helpers for Group 2 ---
async function deleteEvDuzenliOdemeFromSupabase(id) {
  try { await supabase.from('ev_duzenli_odemeler').delete().eq('id', String(id)); } catch(e){}
}
async function deleteEvAbonelikFromSupabase(id) {
  try { await supabase.from('ev_abonelikler').delete().eq('id', String(id)); } catch(e){}
}
async function deleteEvOnarimFromSupabase(id) {
  try { await supabase.from('ev_onarim').delete().eq('id', String(id)); } catch(e){}
}
async function deleteEvDemirbasFromSupabase(id) {
  try { await supabase.from('ev_demirbaslar').delete().eq('id', String(id)); } catch(e){}
}
async function deleteEvBakimFromSupabase(id) {
  try { await supabase.from('ev_bakimlar').delete().eq('id', String(id)); } catch(e){}
}
async function deleteGarajYakitFromSupabase(id) {
  try { await supabase.from('garaj_yakit').delete().eq('id', String(id)).eq('family_id', DEFAULT_FID); } catch(e){}
}
async function deleteGarajServisFromSupabase(id) {
  try { await supabase.from('garaj_servis').delete().eq('id', String(id)).eq('family_id', DEFAULT_FID); } catch(e){}
}
async function deletePetAsiFromSupabase(id) {
  try { await supabase.from('pet_asilar').delete().eq('id', String(id)).eq('family_id', DEFAULT_FID); } catch(e){}
}
async function deletePetAgirlikFromSupabase(id) {
  try { await supabase.from('pet_agirlik').delete().eq('id', String(id)).eq('family_id', DEFAULT_FID); } catch(e){}
}

async function pushPetLogToSupabase(log) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('pet_logs').upsert({
      id: String(log.id).includes(familyId) ? String(log.id) : `${log.id}-${familyId}`,
      pet_name: log.pet,
      date: log.dt || new Date().toISOString(),
      notes: log.action || log.notes || '',
      family_id: familyId
    });
  } catch(e) { console.warn('Pet Log Hatası:', e); }
}

async function deletePetLogFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const finalId = String(id).includes(familyId) ? String(id) : `${id}-${familyId}`;
    await supabase.from('pet_logs').delete().eq('id', finalId).eq('family_id', familyId);
  } catch(e) { console.warn('Pet Log Delete Hatası:', e); }
}

async function deleteSaglikRandevuFromSupabase(id) {
  try { await supabase.from('saglik_randevular').delete().eq('id', String(id)).eq('family_id', DEFAULT_FID); } catch(e){}
}
async function deleteSaglikIlacFromSupabase(id) {
  try { await supabase.from('saglik_ilaclar').delete().eq('id', String(id)).eq('family_id', DEFAULT_FID); } catch(e){}
}
async function deleteSaglikOlcumFromSupabase(id) {
  try { await supabase.from('saglik_olcumler').delete().eq('id', String(id)).eq('family_id', DEFAULT_FID); } catch(e){}
}
// -----------------------------------------------------------------

// ═══════════════════════════════════════════════════════════════════
// 2. MİLAT: KALINTI VERİ SENKRONİZASYONU (JSON -> SQL)
// ═══════════════════════════════════════════════════════════════════

async function pushKasaBakiyelerToSupabase(bakiyeler) {
  try {
    for (const id of ['gorkem', 'esra', 'ortak']) {
      await supabase.from('kasa_bakiyeler').upsert({
        id, miktar: Number(bakiyeler[id] || 0), son_guncelleme: new Date().toISOString()
      });
    }
  } catch(e) { console.warn('Kasa Bakiyeleri Hatası:', e); }
}

async function pushKasaAyarlarToSupabase(rates, privacyMode) {
  try {
    if (rates) await supabase.from('kasa_ayarlar').upsert({ id: 'doviz_kurlari', veri: rates });
    await supabase.from('kasa_ayarlar').upsert({ id: 'gizlilik_modu', veri: { active: !!privacyMode } });
  } catch(e) { console.warn('Kasa Ayarları Hatası:', e); }
}

async function pushFinansAyarlarToSupabase(limits) {
  try {
    await supabase.from('finans_ayarlar').upsert({ id: 'limitler', veri: limits });
  } catch(e) { console.warn('Finans Ayarları Hatası:', e); }
}

async function pushFinansRekuransToSupabase(r) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('finans_rekuranslar').upsert({
      id: String(r.id).includes(familyId) ? String(r.id) : `${r.id}-${familyId}`,
      baslik: r.baslik || r.title,
      tutar: Number(r.tutar || r.amount),
      kategori: r.kategori || r.category,
      periyot: r.periyot || 'Aylık',
      sonraki_tarih: r.sonraki_tarih || r.date,
      family_id: familyId
    });
  } catch(e) { console.warn('Finans Rekurans Hatası:', e); }
}

async function deleteFinansRekuransFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const finalId = String(id).includes(familyId) ? String(id) : `${id}-${familyId}`;
    await supabase.from('finans_rekuranslar').delete().eq('id', finalId).eq('family_id', familyId);
  } catch(e) { console.warn('Finans Rekurans Delete Hatası:', e); }
}

async function pushSaglikAyarlarToSupabase(sleepGoals) {
  try {
    await supabase.from('saglik_ayarlar').upsert({ id: 'uyku_hedefleri', veri: sleepGoals });
  } catch(e) { console.warn('Sağlık Ayarları Hatası:', e); }
}

async function pushMutfakSohbetToSupabase(msg) {
  try {
    await supabase.from('mutfak_sohbet').upsert({
      id: String(msg.id), kisi: msg.w, mesaj: msg.t, tarih: msg.d || new Date().toISOString()
    });
  } catch(e) { console.warn('Mutfak Sohbet Hatası:', e); }
}

// --- Grup 3 Gölge Yazım Yardımcıları ---

// GRUP 3 GÖLGE YAZIM YARDIMCI FONKSİYONLARI
// Tatil, Mühendislik, Modaring
// ═══════════════════════════════════════════════════════════════════

// --- Tatil ---
async function pushTatilTripToSupabase(trip) {
  try {
    await supabase.from('tatil_trips').upsert({
      id: String(trip.id), title: trip.title || '', city: trip.city || null,
      country: trip.country || null, start_date: trip.startDate || null,
      end_date: trip.endDate || null, trip_type: trip.tripType || 'tatil',
      travelers: trip.travelers || 'ikimiz', transport_type: trip.transportType || 'ucak',
      location_type: trip.locationType || 'yurtdisi', status: trip.status || 'planned',
      notes: trip.notes || null, schengen: !!trip.schengen, is_confirmed: !!trip.isConfirmed,
      budget_est: Number(trip.budget?.est || 0), budget_real: Number(trip.budget?.real || 0),
      valiz: trip.valiz || {}, 
      evaluations: {
        ...(trip.evaluations || {}),
        transportation: trip.transportation || {
          departure: { flightNo: '', airline: '', pnr: '', time: '', status: 'Planlandı' },
          return: { flightNo: '', airline: '', pnr: '', time: '', status: 'Planlandı' }
        },
        accommodation: trip.accommodation || { hotel: '', address: '', bookingId: '', link: '' }
      },
      photos: trip.photos || [], checklists: trip.checklists || [],
      visited_cities: trip.visitedCities || [],
      created_at: trip.created_at || new Date().toISOString()
    });
  } catch(e) { console.warn('Tatil Trip Hatası:', e); }
}

async function deleteTatilTripFromSupabase(tripId) {
  try {
    await supabase.from('tatil_trips').delete().eq('id', String(tripId));
  } catch(e) { console.warn('Tatil Trip Silme Hatası:', e); }
}

async function pushTatilWishlistToSupabase(item) {
  try {
    await supabase.from('tatil_wishlist').upsert({
      id: String(item.id), place: item.place || '', notes: item.notes || null,
      user: item.user || null, date: item.date || new Date().toISOString()
    });
  } catch(e) { console.warn('Tatil Wishlist Hatası:', e); }
}

async function pushTatilPasaportToSupabase(kisi, data) {
  try {
    await supabase.from('tatil_pasaport').upsert({
      kisi, name: data.name, surname: data.surname, no: data.no,
      nationality: data.nationality || 'TC', birth_date: data.birthDate,
      issue_date: data.issueDate, exp: data.exp, birth_place: data.birthPlace
    });
  } catch(e) { console.warn('Tatil Pasaport Hatası:', e); }
}

async function pushTatilVizeToSupabase(visa) {
  try {
    await supabase.from('tatil_vizeler').upsert({
      id: String(visa.id), type: visa.type, owner: visa.owner,
      start_date: visa.start, end_date: visa.end,
      entries: visa.entries || 'Multi', country: visa.country
    });
  } catch(e) { console.warn('Tatil Vize Hatası:', e); }
}

// --- Mühendislik ---
async function pushMuhendislikProblemToSupabase(p) {
  try {
    const { id, title, description, category, priority, status, solution, date, ...rest } = p;
    await supabase.from('muhendislik_problems').upsert({
      id: String(id),
      title, description: description || null,
      category: category || null, priority: priority || 'Orta',
      status: status || 'Açık', solution: solution || null,
      date: date || new Date().toISOString(), extra: rest
    });
  } catch(e) { console.warn('Mühendislik Problem Hatası:', e); }
}

async function deleteMuhendislikProblemFromSupabase(id) {
  try {
    await supabase.from('muhendislik_problems').delete().eq('id', String(id));
  } catch(e) { console.warn('Problem Silme Hatası:', e); }
}

async function pushMuhendislikDecisionToSupabase(d) {
  try {
    const { id, title, description, category, result, pros, cons, date, ...rest } = d;
    await supabase.from('muhendislik_decisions').upsert({
      id: String(id),
      title, description: description || null,
      category: category || null, result: result || null,
      pros: pros || null, cons: cons || null,
      date: date || new Date().toISOString(), extra: rest
    });
  } catch(e) { console.warn('Mühendislik Karar Hatası:', e); }
}

async function deleteMuhendislikDecisionFromSupabase(id) {
  try {
    await supabase.from('muhendislik_decisions').delete().eq('id', String(id));
  } catch(e) { console.warn('Karar Silme Hatası:', e); }
}

async function pushCrmCustomerToSupabase(c) {
  try {
    const { id, name, company, phone, email, notes, status, date, ...rest } = c;
    await supabase.from('muhendislik_crm_customers').upsert({
      id: String(id),
      name, company: company || null, phone: phone || null,
      email: email || null, notes: notes || null, status: status || 'aktif',
      date: date || new Date().toISOString(), extra: rest
    });
  } catch(e) { console.warn('CRM Müşteri Hatası:', e); }
}

async function deleteCrmCustomerFromSupabase(id) {
  try {
    await supabase.from('muhendislik_crm_customers').delete().eq('id', String(id));
  } catch(e) { console.warn('CRM Müşteri Silme Hatası:', e); }
}

async function pushCrmDealToSupabase(d) {
  try {
    const { id, customerId, title, amount, status, notes, date, ...rest } = d;
    await supabase.from('muhendislik_crm_deals').upsert({
      id: String(id),
      customer_id: customerId || null, title: title || null,
      amount: Number(amount || 0), status: status || 'pipeline',
      notes: notes || null, date: date || new Date().toISOString(), extra: rest
    });
  } catch(e) { console.warn('CRM Deal Hatası:', e); }
}

async function deleteCrmDealFromSupabase(id) {
  try {
    await supabase.from('muhendislik_crm_deals').delete().eq('id', String(id));
  } catch(e) { console.warn('CRM Deal Silme Hatası:', e); }
}

async function pushZihniProceToSupabase(p) {
  try {
    const { id, title, description, category, completed, date, ...rest } = p;
    await supabase.from('muhendislik_proceler').upsert({
      id: String(id),
      title, description: description || null,
      category: category || null, completed: !!completed,
      date: date || new Date().toISOString(), extra: rest
    });
  } catch(e) { console.warn('Zihni Proce Hatası:', e); }
}

async function deleteZihniProceFromSupabase(id) {
  try {
    await supabase.from('muhendislik_proceler').delete().eq('id', String(id));
  } catch(e) { console.warn('Zihni Proce Silme Hatası:', e); }
}

async function pushLifeRoutineToSupabase(r) {
  try {
    const { id, title, category, frequency, timeOfDay, completed, date, ...rest } = r;
    await supabase.from('muhendislik_life_routines').upsert({
      id: String(id), title, category: category || null,
      frequency: frequency || null, time_of_day: timeOfDay || null,
      completed: !!completed, date: date || new Date().toISOString(), extra: rest
    });
  } catch(e) { console.warn('Life Routine Hatası:', e); }
}

async function deleteLifeRoutineFromSupabase(id) {
  try { await supabase.from('muhendislik_life_routines').delete().eq('id', String(id)); }
  catch(e) { console.warn('Life Routine Silme Hatası:', e); }
}

async function pushLifeProgramToSupabase(p) {
  try {
    const { id, title, description, status, date, ...rest } = p;
    await supabase.from('muhendislik_life_programs').upsert({
      id: String(id), title, description: description || null,
      status: status || 'aktif', date: date || new Date().toISOString(), extra: rest
    });
  } catch(e) { console.warn('Life Program Hatası:', e); }
}

async function deleteLifeProgramFromSupabase(id) {
  try { await supabase.from('muhendislik_life_programs').delete().eq('id', String(id)); }
  catch(e) { console.warn('Life Program Silme Hatası:', e); }
}

// --- Modaring ---
async function pushModaringPersonelToSupabase(p) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('modaring_personel').upsert({
      id: String(p.id).includes(familyId) ? String(p.id) : `${p.id}-${familyId}`,
      name: p.name,
      hourly_rate: Number(p.hourlyRate || 0),
      color: p.color || '#fb7185',
      emoji: p.emoji || '👤',
      active: p.active !== false,
      family_id: familyId
    });
  } catch(e) { console.warn('Modaring Personel Hatası:', e); }
}

async function deleteModaringPersonelFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const finalId = String(id).includes(familyId) ? String(id) : `${id}-${familyId}`;
    await supabase.from('modaring_personel').delete().eq('id', finalId).eq('family_id', familyId);
  } catch(e) {}
}

async function pushModaringVardiyaToSupabase(v) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('modaring_vardiya').upsert({
      id: String(v.id).includes(familyId) ? String(v.id) : `${v.id}-${familyId}`,
      personel_id: String(v.personelId),
      date: v.date || null,
      start_time: v.startTime,
      end_time: v.endTime,
      total_pay: Number(v.totalPay || 0),
      status: v.status || 'aktif',
      family_id: familyId
    });
  } catch(e) { console.warn('Modaring Vardiya Hatası:', e); }
}

async function deleteModaringVardiyaFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const finalId = String(id).includes(familyId) ? String(id) : `${id}-${familyId}`;
    await supabase.from('modaring_vardiya').delete().eq('id', finalId).eq('family_id', familyId);
  } catch(e) {}
}

async function pushModaringKasaToSupabase(k) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('modaring_kasa').upsert({
      id: String(k.id).includes(familyId) ? String(k.id) : `${k.id}-${familyId}`,
      date: k.date,
      type: k.type,
      amount: Number(k.amount || 0),
      method: k.method,
      note: k.note || null,
      bank_id: k.bankId || null,
      family_id: familyId
    });
  } catch(e) { console.warn('Modaring Kasa Hatası:', e); }
}

async function deleteModaringKasaFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const finalId = String(id).includes(familyId) ? String(id) : `${id}-${familyId}`;
    await supabase.from('modaring_kasa').delete().eq('id', finalId).eq('family_id', familyId);
  } catch(e) {}
}

async function pushModaringBankaToSupabase(b) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('modaring_bankalar').upsert({
      id: String(b.id).includes(familyId) ? String(b.id) : `${b.id}-${familyId}`,
      name: b.name,
      type: b.type,
      balance: Number(b.balance || 0),
      color: b.color || null,
      icon: b.icon || null,
      family_id: familyId
    });
  } catch(e) { console.warn('Modaring Banka Hatası:', e); }
}

async function deleteModaringBankaFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const finalId = String(id).includes(familyId) ? String(id) : `${id}-${familyId}`;
    await supabase.from('modaring_bankalar').delete().eq('id', finalId).eq('family_id', familyId);
  } catch(e) {}
}

async function pushModaringTedarikToSupabase(t) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('modaring_tedarik').upsert({
      id: String(t.id).includes(familyId) ? String(t.id) : `${t.id}-${familyId}`,
      name: t.name,
      link: t.link || null,
      category: t.category || null,
      contact: t.contact || null,
      note: t.note || null,
      family_id: familyId
    });
  } catch(e) { console.warn('Modaring Tedarik Hatası:', e); }
}

async function deleteModaringTedarikFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const finalId = String(id).includes(familyId) ? String(id) : `${id}-${familyId}`;
    await supabase.from('modaring_tedarik').delete().eq('id', finalId).eq('family_id', familyId);
  } catch(e) {}
}

async function pushModaringSiparisToSupabase(s) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('modaring_siparisler').upsert({
      id: String(s.id).includes(familyId) ? String(s.id) : `${s.id}-${familyId}`,
      supplier_id: String(s.supplierId),
      date: s.date,
      items: s.items || [],
      total: Number(s.total || 0),
      paid: !!s.paid,
      status: s.status || 'bekliyor',
      bank_id: s.bankId || null,
      family_id: familyId
    });
  } catch(e) { console.warn('Modaring Sipariş Hatası:', e); }
}

async function deleteModaringSiparisFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const finalId = String(id).includes(familyId) ? String(id) : `${id}-${familyId}`;
    await supabase.from('modaring_siparisler').delete().eq('id', finalId).eq('family_id', familyId);
  } catch(e) {}
}

async function pushModaringAjandaToSupabase(a) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('modaring_ajanda').upsert({
      id: String(a.id).includes(familyId) ? String(a.id) : `${a.id}-${familyId}`,
      title: a.title,
      due_date: a.dueDate || null,
      amount: Number(a.amount || 0),
      status: a.status || 'bekliyor',
      family_id: familyId
    });
  } catch(e) { console.warn('Modaring Ajanda Hatası:', e); }
}

async function deleteModaringAjandaFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const finalId = String(id).includes(familyId) ? String(id) : `${id}-${familyId}`;
    await supabase.from('modaring_ajanda').delete().eq('id', finalId).eq('family_id', familyId);
  } catch(e) {}
}

async function pushModaringRefikaToSupabase(r) {
  try {
    const familyId = DEFAULT_FID;
    await supabase.from('modaring_refika').upsert({
      id: String(r.id).includes(familyId) ? String(r.id) : `${r.id}-${familyId}`,
      title: r.title || null,
      description: r.desc || null,
      cost: Number(r.cost || 0),
      price: Number(r.price || 0),
      strategy: r.strategy || null,
      context: r.context || null,
      date: r.date || new Date().toISOString(),
      family_id: familyId
    });
  } catch(e) { console.warn('Modaring Refika Hatası:', e); }
}

async function deleteModaringRefikaFromSupabase(id) {
  try {
    const familyId = DEFAULT_FID;
    const finalId = String(id).includes(familyId) ? String(id) : `${id}-${familyId}`;
    await supabase.from('modaring_refika').delete().eq('id', finalId).eq('family_id', familyId);
  } catch(e) {}
}

// ═══════════════════════════════════════════════════════════════════

function extractAppData(state, forPersist = false) {
  if (forPersist) {
    // FAZ 10 - ONLINE FIRST MİMARİSİ
    // Asla değişen modül verilerini (finans, hedefler vb.) LocalStorage'a kaydetme.
    // Bu, telefonun eski veriyi yükleyip Supabase ile çakışmasını (mükerrer kayıtları) kesin olarak önler.
    return {
      system: state.system,
      ui: state.ui,
      currentUser: state.currentUser,
      family_id: state.family_id,
      selectedVehicleId: state.selectedVehicleId,
      modaring: { ...state.modaring, activeTab: state.modaring?.activeTab }, // Sadece UI state
      mutfak: { ...state.mutfak, activeTab: state.mutfak?.activeTab },
      sosyal: { ...state.sosyal, tab: state.sosyal?.tab }
    };
  }

  const data = {
    // 🏛️ 2. MİLAT: Modüller %100 SQL'de. 
    // JSON sadece sistem, kullanıcı ve idari bilgileri taşır.
    users: state.users,
    system: state.system,
    selectedVehicleId: state.selectedVehicleId,
    logs: state.logs,
    achievements: state.achievements,
    ui: state.ui
  };

  return data;
}

const DEFAULT_SETTINGS = {
  silentMode: false
    };

const useStore = create(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      settings: DEFAULT_SETTINGS,
      syncing: false,
      isOnline: true,
      isSaving: false,
      system: {
        clientId: Math.random().toString(36).substring(7),
        lastUpdatedBy: null,
        isCloudReady: false
      },

      addLog: (action, detail) => {
        const state = get();
        const newLog = {
          id: Date.now(),
          user: state.currentUser?.name || 'Sistem',
          action,
          detail,
          date: new Date().toISOString()
        };
        const updatedLogs = [newLog, ...state.logs].slice(0, 15);
        set({ logs: updatedLogs });

      },

      runPhase1Migration: async () => {
        const state = get();
        // Geçici olarak kontrolü kaldırıyoruz ki RLS hatası sonrası tekrar çalışabilsin
        // if (state.system.migrationPhase1Done) {
        //   toast.success('Faz 1 taşıması zaten yapılmış. Her şey güncel! 👍');
        //   return;
        // }

        const loadId = toast.loading('Eski veriler Supabase\'e aktarılıyor. Lütfen bekleyin...');
        
        try {
          // Hedefler Aktif
          const goals = state.hedefler?.goals || [];
          const moneyGoals = state.kasa?.kumbaralar || [];
          for (const g of goals) await pushHedefToSupabase(g);
          for (const g of moneyGoals) await pushHedefToSupabase(g);

          // Hedefler Geçmiş
          const compHist = state.hedefler?.completedHistory || [];
          const failHist = state.hedefler?.failedHistory || [];
          for (const h of compHist) await pushHedefGecmisToSupabase(h, 'completed');
          for (const h of failHist) await pushHedefGecmisToSupabase(h, 'failed');

          // Hedefler Vizyon
          const vizyon = state.hedefler?.longTermVision || [];
          for (const p of vizyon) await pushVizyonPlanToSupabase(p);

          // Finans Onay Havuzu
          const pool = state.finans?.approvalPool || [];
          if (pool.length > 0) await syncFinansOnayHavuzu(pool);

          // Finans Kartlar ve Krediler
          const kartlar = state.finans?.kartlar || [];
          if (kartlar.length > 0) await syncFinansKartlar(kartlar);
          const borclar = state.finans?.borclar || [];
          if (borclar.length > 0) await syncFinansKrediler(borclar);

          set({ system: { ...state.system, migrationPhase1Done: true } });


          toast.dismiss(loadId);
          toast.success('Geçmiş verileriniz kayıpsız bir şekilde Supabase\'e aktarıldı! 🎉');
        } catch (error) {
          console.error("Migration Error:", error);
          toast.dismiss(loadId);
          toast.error('Aktarım sırasında bir hata oluştu. Logları kontrol edin.');
        }
      },

      runGroup1Migration: async () => {
        const state = get();
        const loadId = toast.loading('Tüm veriler (Emoji ve Planlar dahil) Supabase\'e aktarılıyor...');
        
        try {
          // 1. Mutfak Stok (GEÇİCİ OLARAK KAPALI - Temiz veritabanını bozmamak için)
          /* 
          const buzdolabi = state.mutfak?.buzdolabi || [];
          for (const item of buzdolabi) await pushMutfakStokToSupabase(item, 'buzdolabi');
          const kiler = state.mutfak?.kiler || [];
          for (const item of kiler) await pushMutfakStokToSupabase(item, 'kiler');
          const dondurucu = state.mutfak?.dondurucu || [];
          for (const item of dondurucu) await pushMutfakStokToSupabase(item, 'dondurucu');
          */

          // 2. Mutfak Tarifler & Menü
          const tarifler = state.mutfak?.tarifler || [];
          for (const t of tarifler) await pushMutfakTarifToSupabase(t);

          const menu = state.mutfak?.menu || {};
          for (const day in menu) {
            const m = menu[day];
            if (m.k) await pushMutfakMenuToSupabase(day, 'k', String(m.k));
            if (m.k2) await pushMutfakMenuToSupabase(day, 'k2', String(m.k2));
            if (m.a) await pushMutfakMenuToSupabase(day, 'a', String(m.a));
            if (m.a2) await pushMutfakMenuToSupabase(day, 'a2', String(m.a2));
            if (m.kdis) await pushMutfakMenuToSupabase(day, 'kdis', String(m.kdis));
            if (m.ksp) await pushMutfakMenuToSupabase(day, 'ksp', String(m.ksp));
            if (m.adis) await pushMutfakMenuToSupabase(day, 'adis', String(m.adis));
            if (m.asp) await pushMutfakMenuToSupabase(day, 'asp', String(m.asp));
          }

          // 3. Alışveriş
          const alisverisMutfak = state.mutfak?.alisveris || [];
          for (const item of (Array.isArray(alisverisMutfak) ? alisverisMutfak : [])) await pushAlisverisToSupabase(item, 'mutfak');

          const alisverisGenel = state.alisveris || {};
          for (const k in alisverisGenel) {
            if (Array.isArray(alisverisGenel[k])) {
              for (const item of alisverisGenel[k]) await pushAlisverisToSupabase(item, k);
            }
          }

          // 4. Sosyal
          const aktiviteler = state.sosyal?.aktiviteler || [];
          for (const act of aktiviteler) await pushSosyalEtkinlikToSupabase(act);

          const havuz = state.sosyal?.havuz || [];
          for (const h of havuz) {
            const payload = { id: String(h.id), baslik: h.baslik, tur: h.tur, emoji: h.emoji, count: Number(h.count || 0), freq: h.freq, last_done: h.last };
            await supabase.from('sosyal_havuz').upsert(payload);
          }

          const rutinler = state.sosyal?.rutinler || [];
          for (const r of rutinler) {
            const payload = { id: String(r.id), aktivite: r.aktivite, kisi: r.kisi, vakit: r.vakit, gunler: Array.isArray(r.gunler) ? r.gunler : [], saati: r.saati, ucret: Number(r.ucret || 0) };
            await supabase.from('sosyal_rutinler').upsert(payload);
          }

          set({ system: { ...state.system, migrationGroup1Done: true } });


          toast.dismiss(loadId);
          toast.success('Mükemmel! Tüm verileriniz eksiksiz aktarıldı. 🎉');
        } catch(e) {
          toast.dismiss(loadId);
          toast.error('Aktarımda bir sorun oluştu: ' + e.message);
        }
      },

      runGroup2Migration: async () => {
        const state = get();
        const loadId = toast.loading('Grup 2 (Ev, Garaj, Pet, Sağlık) Supabase\'e aktarılıyor...');
        
        try {
          // 1. Ev Modülü
          const ev = state.ev || {};
          for (const item of (ev.duzenliOdemeler || [])) await pushEvDuzenliOdemeToSupabase(item);
          for (const item of (ev.abonelikler || [])) await pushEvAbonelikToSupabase(item);
          for (const item of (ev.onarimListesi || [])) await pushEvOnarimToSupabase(item);
          for (const item of (ev.demirbaslar || [])) await pushEvDemirbasToSupabase(item);
          for (const item of (ev.bakimlar || [])) await pushEvBakimToSupabase(item);

          // 2. Garaj Modülü
          const garaj = state.garaj || [];
          for (const vehicle of garaj) {
            const vid = vehicle.id || 'v1';
            for (const log of (vehicle.fuelLogs || [])) await pushGarajYakitToSupabase(log, vid);
            for (const svc of (vehicle.services || [])) await pushGarajServisToSupabase(svc, vid);
            for (const doc of (vehicle.documents || [])) await pushGarajBelgeToSupabase(doc, vid);
          }

          // 3. Pet Modülü
          const pet = state.pet || {};
          const vaccines = pet.vaccines || {};
          for (const petId in vaccines) {
            const petVaccines = vaccines[petId];
            if (Array.isArray(petVaccines)) {
              for (const v of petVaccines) await pushPetAsiToSupabase(petId, v);
            }
          }
          const weights = pet.weights || {};
          for (const petId in weights) {
            const petWeights = weights[petId];
            if (Array.isArray(petWeights)) {
              for (const w of petWeights) await pushPetAgirlikToSupabase(petId, w);
            }
          }

          // 4. Sağlık Modülü
          const saglik = state.saglik || {};
          for (const r of (saglik.randevular || [])) await pushSaglikRandevuToSupabase(r);
          for (const i of (saglik.ilaclar || [])) await pushSaglikIlacToSupabase(i);
          for (const o of (saglik.olcumler || [])) await pushSaglikOlcumToSupabase(o);
          for (const m of (saglik.moods || [])) await pushSaglikMoodToSupabase(m);
          for (const l of (saglik.logs || [])) await pushSaglikLogToSupabase(l);

          set({ system: { ...state.system, migrationGroup2Done: true } });


          toast.dismiss(loadId);
          toast.success('Grup 2 aktarımı tamamlandı! Ev, Garaj, Pet ve Sağlık verileri SQL\'de. 🎉');
        } catch(e) {
          toast.dismiss(loadId);
          toast.error('Grup 2 aktarımında sorun: ' + e.message);
        }
      },

      fetchGroup2Data: async () => {
        try {
          const [odemeler, abonelikler, onarim, demirbaslar, bakimlar,
                 yakit, servis, belgeler, parts,
                 asilar, agirliklar, supplies, petLogs,
                 randevular, ilaclar, olcumler, moods, logs, sleep,
                 depo, faturalar, garajPark, personality,
                 savedLocations, evAyarlar, acilDurum, araclar] = await Promise.all([
            supabase.from('ev_duzenli_odemeler').select('*'),
            supabase.from('ev_abonelikler').select('*'),
            supabase.from('ev_onarim').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('ev_demirbaslar').select('*'),
            supabase.from('ev_bakimlar').select('*'),
            supabase.from('garaj_yakit').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('garaj_servis').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('garaj_belgeler').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('garaj_parts').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('pet_asilar').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('pet_agirlik').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('pet_supplies').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('pet_logs').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('saglik_randevular').select('*'),
            supabase.from('saglik_ilaclar').select('*'),
            supabase.from('saglik_olcumler').select('*'),
            supabase.from('saglik_moods').select('*').or(`family_id.eq.${DEFAULT_FID},family_id.eq.ERAYLAR`).order('date', { ascending: false }).limit(100),
            supabase.from('saglik_logs').select('*').or(`family_id.eq.${DEFAULT_FID},family_id.eq.ERAYLAR`).order('date', { ascending: false }).limit(200),
            supabase.from('saglik_sleep').select('*'),
            supabase.from('ev_depo').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('ev_faturalar').select('*'),
            supabase.from('garaj_park').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('ev_tracking').select('*').eq('id', `personality-${DEFAULT_FID}`).eq('family_id', DEFAULT_FID),
            supabase.from('ev_saved_locations').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('ev_ayarlar').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('ev_acil_durum_cantasi').select('*').eq('family_id', DEFAULT_FID),
            supabase.from('garaj_araclar').select('*').eq('family_id', DEFAULT_FID)
          ]);

          set(state => {
            const ev = { ...state.ev };
             if (odemeler.data) {
              ev.duzenliOdemeler = odemeler.data.map(item => ({
                id: item.id,
                name: item.name,
                amount: Number(item.amount || 0),
                date: Number(item.date || 1),
                linkedCardId: item.linked_card_id,
                autoPay: !!item.auto_pay,
                icon: item.icon || '💳',
                provider: item.provider,
                customerNo: item.customer_no,
                contractEndDate: item.contract_end_date,
                familyId: item.family_id
              }));
            }
            if (abonelikler.data) {
              ev.abonelikler = abonelikler.data.map(item => ({
                id: item.id,
                name: item.name,
                amount: Number(item.amount || 0),
                date: Number(item.date || 1),
                linkedCardId: item.linked_card_id,
                autoPay: !!item.auto_pay,
                icon: item.icon || '📺',
                startDate: item.start_date,
                familyId: item.family_id
              }));
            }
            if (onarim.data) {
              ev.onarimListesi = onarim.data.map(item => ({
                id: item.id,
                task: item.task,
                status: item.status,
                createdBy: item.created_by,
                createdAt: item.created_at,
                completedBy: item.completed_by,
                completedAt: item.completed_at,
                clearedBy: item.cleared_by,
                clearedAt: item.cleared_at,
                isArchived: item.is_archived,
                assignedTo: item.assigned_to,
                dueDate: item.due_date
              }));
            }
            if (demirbaslar.data) {
              ev.demirbaslar = demirbaslar.data.map(item => ({
                id: item.id,
                name: item.name,
                brand: item.brand,
                warrantyDate: item.warranty_date,
                photo: item.photo,
                familyId: item.family_id
              }));
            }
            if (bakimlar.data) {
              ev.bakimlar = bakimlar.data.map(item => ({
                id: item.id,
                name: item.name,
                lastDate: item.last_date,
                intervalDays: Number(item.interval_days || 180),
                icon: item.icon || '🔧',
                brand: item.brand,
                model: item.model,
                partNo: item.part_no,
                familyId: item.family_id
              }));
            }
            if (depo.data) {
              ev.depo = depo.data.map(item => ({
                id: item.id,
                name: item.name,
                mainCat: item.category || 'Genel',
                subCat: 'Diğer',
                totalQty: Number(item.quantity || 1),
                firstDate: item.date || new Date().toISOString().split('T')[0],
                lastDate: item.date || new Date().toISOString().split('T')[0],
                owner: item.owner || 'ortak',
                emoji: item.emoji || '',
                brand: item.brand || '',
                size: item.size || '',
                notes: item.notes || '',
                history: [{
                  id: Date.now(),
                  date: item.date || new Date().toISOString().split('T')[0],
                  qty: Number(item.quantity || 1),
                  pr: Number(item.price || 0),
                  source: 'SQL',
                  note: 'Veritabanından Yüklendi'
                }]
              }));
            }
            if (faturalar.data) ev.faturalar = faturalar.data;
             if (personality.data && personality.data[0]) {
              if (!ev.tracking) ev.tracking = {};
              ev.tracking.personality = personality.data[0].veri;
            }

            if (savedLocations.data) {
              if (!ev.tracking) ev.tracking = {};
              ev.tracking.savedLocations = savedLocations.data;
            }

            if (evAyarlar.data) {
              evAyarlar.data.forEach(item => {
                if (item.id === `guvenlik-${DEFAULT_FID}`) ev.guvenlik = item.veri;
                if (item.id === `tracking_settings-${DEFAULT_FID}`) {
                  if (!ev.tracking) ev.tracking = {};
                  ev.tracking = { ...ev.tracking, ...item.veri };
                }
                if (item.id === `tracking_routine-${DEFAULT_FID}`) {
                  if (!ev.tracking) ev.tracking = {};
                  ev.tracking.routine = item.veri;
                }
              });
            }

            if (acilDurum.data) {
              const ek = { deprem: [], ilkyardim: [] };
              acilDurum.data.forEach(item => {
                const kitItem = {
                  id: item.id,
                  item: item.item,
                  amount: item.amount,
                  expDate: item.exp_date,
                  buyDate: item.buy_date,
                  addedBy: item.added_by,
                  ...(item.details || {})
                };
                if (ek[item.kit_type]) ek[item.kit_type].push(kitItem);
              });
              ev.emergencyKits = ek;
            }

                        const garaj = [...state.garaj];
            // Restore Vehicle Metadata from Supabase
            if (araclar.data && araclar.data.length > 0) {
              araclar.data.forEach(item => {
                const existingIdx = garaj.findIndex(gv => String(gv.id) === String(item.id));
                if (existingIdx !== -1) {
                  garaj[existingIdx] = {
                    ...garaj[existingIdx],
                    type: item.type || garaj[existingIdx].type,
                    brand: item.brand || garaj[existingIdx].brand,
                    model: item.model || garaj[existingIdx].model,
                    plaka: item.plaka || garaj[existingIdx].plaka,
                    km: item.km !== undefined && item.km !== null ? Number(item.km) : garaj[existingIdx].km,
                    marketValue: item.market_value !== undefined && item.market_value !== null ? Number(item.market_value) : garaj[existingIdx].marketValue,
                    lastCleaned: item.last_cleaned || garaj[existingIdx].lastCleaned
                  };
                } else {
                  garaj.push({
                    id: item.id,
                    type: item.type || 'car',
                    brand: item.brand || '',
                    model: item.model || '',
                    plaka: item.plaka || '',
                    km: Number(item.km || 0),
                    marketValue: Number(item.market_value || 0),
                    lastCleaned: item.last_cleaned || null,
                    parts: [],
                    fuelLogs: [],
                    services: [],
                    documents: [],
                    tireStatus: { type: 'Yazlık', changeDate: new Date().toISOString().split('T')[0], condition: 'İyi' },
                    parkLocation: { lat: null, lng: null, note: '', floor: '', spot: '', active: false },
                    supportContacts: {
                      yolYardim: { name: 'Toyota Asistanım', phone: '0212 708 00 55' },
                      sigorta: { name: 'Neova Sigorta (Nisa Hanım)', phone: '0533 303 42 35' }
                    }
                  });
                }
              });
            }
            // Restore Parking Location
            if (garajPark.data) {
              garajPark.data.forEach(p => {
                const vIndex = garaj.findIndex(gv => gv.id === p.vehicle_id);
                if (vIndex !== -1) {
                  garaj[vIndex] = {
                    ...garaj[vIndex],
                    parkLocation: {
                      lat: p.lat,
                      lng: p.lng,
                      note: p.note || '',
                      floor: p.floor || '',
                      spot: p.spot || '',
                      active: p.active === true || p.active === 'true' || p.active === 1
                    }
                  };
                }
              });
            }
            // Match records to vehicles by vehicle_id or default to first vehicle
            if (yakit.data) {
              yakit.data.forEach(y => {
                const v = garaj.find(gv => gv.id === y.vehicle_id) || garaj[0];
                if (v && !v.fuelLogs.some(l => String(l.id) === String(y.id))) {
                  v.fuelLogs.push({
                    id: y.id,
                    km: y.km,
                    amount: y.litre,
                    price: y.litre > 0 ? (y.tutar / y.litre) : 0,
                    totalPrice: y.tutar,
                    station: y.istasyon,
                    date: y.tarih
                  });
                }
              });
            }
            if (servis.data) {
              servis.data.forEach(s => {
                const v = garaj.find(gv => gv.id === s.vehicle_id) || garaj[0];
                if (v && !v.services.some(ls => String(ls.id) === String(s.id))) {
                  v.services.push({
                    id: s.id,
                    title: s.islem,
                    km: s.km,
                    cost: s.tutar,
                    shop: s.yer,
                    date: s.tarih,
                    notes: s.notlar
                  });
                }
              });
            }
            if (belgeler.data) {
              belgeler.data.forEach(b => {
                const v = garaj.find(gv => gv.id === b.vehicle_id) || garaj[0];
                if (v && !v.documents.some(ld => String(ld.id) === String(b.id))) {
                  v.documents.push({
                    id: b.id,
                    name: b.name,
                    dueDate: b.due_date,
                    icon: b.icon
                  });
                }
              });
            }
            if (parts.data) {
              parts.data.forEach(p => {
                const v = garaj.find(gv => gv.id === p.vehicle_id) || garaj[0];
                if (v) {
                  const pIdx = v.parts.findIndex(vp => vp.id === p.id);
                  if (pIdx !== -1) v.parts[pIdx] = { ...v.parts[pIdx], ...p };
                  else v.parts.push(p);
                }
              });
            }

            const pet = { ...state.pet };
            if (asilar.data) {
              asilar.data.forEach(a => {
                const pId = a.pet_id || a.pet_name;
                if (!pId) return;
                if (!pet.vaccines[pId]) pet.vaccines[pId] = [];
                
                let parsedNotlar = {};
                try {
                  parsedNotlar = a.notlar ? JSON.parse(a.notlar) : {};
                } catch(e) {
                  parsedNotlar = { notes: a.notlar };
                }
                
                const mappedVaccine = {
                  id: a.id,
                  n: a.asi_adi,
                  last: a.son_tarih,
                  ev: parsedNotlar.ev || 60, 
                  done: a.durum === 'tamamlandi',
                  notes: parsedNotlar.notes || ''
                };

                const existingIdx = pet.vaccines[pId].findIndex(v => v.id === a.id || v.n === a.asi_adi);
                if (existingIdx !== -1) {
                  pet.vaccines[pId][existingIdx] = { ...pet.vaccines[pId][existingIdx], ...mappedVaccine };
                } else {
                  pet.vaccines[pId].push(mappedVaccine);
                }
              });
            }
            if (agirliklar.data) {
              const parseTurkishDate = (str) => {
                if (!str) return 0;
                const datePart = str.split(' ')[0];
                const parts = datePart.split('.');
                if (parts.length < 3) return 0;
                const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                return isNaN(d.getTime()) ? 0 : d.getTime();
              };

              agirliklar.data.forEach(w => {
                const pId = w.pet_id || w.pet_name;
                if (!pId) return;
                if (!pet.weights[pId]) pet.weights[pId] = [];
                if (!pet.weights[pId].some(lw => lw.id === w.id)) {
                  pet.weights[pId].push({
                    id: w.id,
                    dt: w.tarih,
                    w: Number(w.kilo || 0),
                    notes: w.notlar
                  });
                }
              });

              // Sort all weight arrays descending (newest first)
              Object.keys(pet.weights).forEach(pId => {
                pet.weights[pId].sort((a, b) => parseTurkishDate(b.dt) - parseTurkishDate(a.dt));
              });
            }
            if (supplies.data) {
              supplies.data.forEach(s => {
                const pId = s.pet_name || s.pet_id;
                if (!pId) return;
                if (!pet.supplies[pId]) pet.supplies[pId] = {};
                pet.supplies[pId][s.supply_type] = s.status;
              });
            }
            if (petLogs.data) {
              const parseTurkishDate = (str) => {
                if (!str) return 0;
                const datePart = str.split(' ')[0];
                const parts = datePart.split('.');
                if (parts.length < 3) return 0;
                const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                return isNaN(d.getTime()) ? 0 : d.getTime();
              };

              const mappedLogs = petLogs.data.map(l => {
                const actionText = l.notes || l.action || '';
                return {
                  id: l.id,
                  pet: l.pet_name || l.pet_id,
                  action: actionText,
                  dt: l.date || l.dt,
                  type: actionText.includes('Kilo') ? 'weight' : 'note'
                };
              });
              pet.history = [...mappedLogs].sort((a,b) => parseTurkishDate(b.dt) - parseTurkishDate(a.dt)).slice(0, 100);
            }

            const saglik = { ...state.saglik };
            if (randevular.data) {
              // Sort by date and time descending (newest first)
              const sortedRandevular = [...randevular.data].sort((a, b) => {
                const dateA = a.tarih || '';
                const dateB = b.tarih || '';
                if (dateA !== dateB) return dateB.localeCompare(dateA);
                const timeA = a.saat || '';
                const timeB = b.saat || '';
                return timeB.localeCompare(timeA);
              });

              saglik.randevular = sortedRandevular.map(r => ({
                id: r.id,
                kisi: r.kisi,
                doktor: r.doktor,
                tarih: r.tarih,
                saat: r.saat,
                not: r.not_text,
                rekurans: r.rekurans
              }));
            }
            if (ilaclar.data) {
              saglik.ilaclar = ilaclar.data.map(i => ({
                id: i.id, kisi: i.kisi, ad: i.ad, dozaj: i.dozaj, sıklık: i.siklik,
                stok: i.stok, minStok: i.min_stok, schedule: i.schedule
              }));
            }
            if (olcumler.data) saglik.olcumler = olcumler.data;
            if (moods.data) saglik.moods = moods.data;
            if (logs.data) {
              const sortedLogs = [...logs.data].sort((a, b) => b.id - a.id); // Newest ID first
              saglik.logs = sortedLogs.map(l => ({
                id: l.id, medId: l.med_id, ad: l.ad, kisi: l.kisi, slot: l.slot, date: l.date, dt: l.dt
              }));
            }
            if (sleep.data) {
              const sortedSleep = [...sleep.data].sort((a, b) => {
                const dateA = a.tarih || '';
                const dateB = b.tarih || '';
                return dateB.localeCompare(dateA);
              });
              saglik.sleep = sortedSleep.map(s => ({
                id: s.id,
                kisi: s.kisi,
                tarih: s.tarih,
                saat: s.saat,
                sure: Number(s.saat || 0),
                kalite: s.kalite,
                yatis: '',
                kalkis: '',
                not: ''
              }));
            }

            return { ev, garaj, pet, saglik };
          });
        } catch (error) {
          console.error("❌ fetchGroup2Data error:", error);
        }
      },

      runGroup3Migration: async () => {
        const state = get();
        const loadId = toast.loading('Grup 3 (Tatil, Mühendislik, Modaring) Supabase\'e aktarılıyor...');
        
        try {
          // 1. Tatil Modülü
          const tatil = state.tatil || {};
          for (const trip of (tatil.trips || [])) await pushTatilTripToSupabase(trip);
          for (const w of (tatil.wishlist || [])) await pushTatilWishlistToSupabase(w);
          if (tatil.passport) {
            for (const kisi in tatil.passport) {
              await pushTatilPasaportToSupabase(kisi, tatil.passport[kisi]);
            }
          }
          for (const v of (tatil.visas || [])) await pushTatilVizeToSupabase(v);

          // 2. Mühendislik Modülü
          const muh = state.muhendislik || {};
          for (const p of (muh.problemBank || [])) await pushMuhendislikProblemToSupabase(p);
          for (const d of (muh.decisionLog || [])) await pushMuhendislikDecisionToSupabase(d);
          for (const c of (muh.crm?.customers || [])) await pushCrmCustomerToSupabase(c);
          for (const d of (muh.crm?.deals || [])) await pushCrmDealToSupabase(d);
          for (const p of (muh.zihniProceler || [])) await pushZihniProceToSupabase(p);
          for (const r of (muh.life?.routines || [])) await pushLifeRoutineToSupabase(r);
          for (const p of (muh.life?.programs || [])) await pushLifeProgramToSupabase(p);

          // 3. Modaring Modülü
          const mod = state.modaring || {};
          for (const p of (mod.personel || [])) await pushModaringPersonelToSupabase(p);
          for (const v of (mod.vardiya || [])) await pushModaringVardiyaToSupabase(v);
          for (const k of (mod.kasa || [])) await pushModaringKasaToSupabase(k);
          for (const b of (mod.bankalar || [])) await pushModaringBankaToSupabase(b);
          for (const t of (mod.tedarik || [])) await pushModaringTedarikToSupabase(t);
          for (const s of (mod.siparisler || [])) await pushModaringSiparisToSupabase(s);
          for (const a of (mod.ajanda || [])) await pushModaringAjandaToSupabase(a);
          for (const r of (mod.refikaFikirleri || [])) await pushModaringRefikaToSupabase(r);

          set({ system: { ...state.system, migrationGroup3Done: true } });


          toast.dismiss(loadId);
          toast.success('Grup 3 aktarımı tamamlandı! Tatil, Mühendislik ve Modaring verileri SQL\'de. 🎉');
        } catch(e) {
          toast.dismiss(loadId);
          toast.error('Grup 3 aktarımında sorun: ' + e.message);
        }
      },

      fetchGroup3Data: async () => {
        try {
          const [
            trips, wishlist, pasaport, vizeler,
            problems, decisions, crmCustomers, crmDeals, proceler, lifeRoutines, lifePrograms,
            personel, vardiya, kasaItems, bankalar, tedarik, siparisler, ajanda, refika,
            mutfakSiparisler, mutfakRestaurants, mutfakArsiv
          ] = await Promise.all([
            supabase.from('tatil_trips').select('*'),
            supabase.from('tatil_wishlist').select('*'),
            supabase.from('tatil_pasaport').select('*'),
            supabase.from('tatil_vizeler').select('*'),
            supabase.from('muhendislik_problems').select('*'),
            supabase.from('muhendislik_decisions').select('*'),
            supabase.from('muhendislik_crm_customers').select('*'),
            supabase.from('muhendislik_crm_deals').select('*'),
            supabase.from('muhendislik_proceler').select('*'),
            supabase.from('muhendislik_life_routines').select('*'),
            supabase.from('muhendislik_life_programs').select('*'),
            supabase.from('modaring_personel').select('*'),
            supabase.from('modaring_vardiya').select('*'),
            supabase.from('modaring_kasa').select('*'),
            supabase.from('modaring_bankalar').select('*'),
            supabase.from('modaring_tedarik').select('*'),
            supabase.from('modaring_siparisler').select('*'),
            supabase.from('modaring_ajanda').select('*'),
            supabase.from('modaring_refika').select('*'),
            supabase.from('mutfak_siparisler').select('*'),
            supabase.from('mutfak_restaurantlar').select('*'),
            supabase.from('mutfak_arsiv').select('*')
          ]);

          set(state => {
            const tatil = { ...state.tatil };
            const muhendislik = { ...state.muhendislik };
            const modaring = { ...state.modaring };
            const mutfak = { ...state.mutfak };

            // ── Tatil ──
            if (trips.data && trips.data.length > 0) {
              tatil.trips = trips.data.map(x => {
                const evals = x.evaluations || {};
                return {
                  id: x.id, title: x.title, city: x.city, country: x.country,
                  startDate: x.start_date, endDate: x.end_date,
                  tripType: x.trip_type, travelers: x.travelers,
                  transportType: x.transport_type, locationType: x.location_type,
                  status: x.status, notes: x.notes, schengen: x.schengen, isConfirmed: !!x.is_confirmed,
                  budget: { est: Number(x.budget_est || 0), real: Number(x.budget_real || 0) },
                  valiz: x.valiz || {}, 
                  evaluations: evals,
                  transportation: evals.transportation || {
                    departure: { flightNo: '', airline: '', pnr: '', time: '', status: 'Planlandı' },
                    return: { flightNo: '', airline: '', pnr: '', time: '', status: 'Planlandı' }
                  },
                  accommodation: evals.accommodation || { hotel: '', address: '', bookingId: '', link: '' },
                  photos: x.photos || [], checklists: x.checklists || [],
                  visitedCities: x.visited_cities || [],
                  created_at: x.created_at
                };
              });
            }
            if (wishlist.data) {
              tatil.wishlist = wishlist.data.map(x => ({
                id: x.id, place: x.place, notes: x.notes,
                user: x.user, date: x.date
              }));
            }
            if (pasaport.data) {
              const ppObj = {};
              pasaport.data.forEach(x => {
                ppObj[x.kisi] = {
                  name: x.name, surname: x.surname, no: x.no,
                  nationality: x.nationality, birthDate: x.birth_date,
                  issueDate: x.issue_date, exp: x.exp, birthPlace: x.birth_place
                };
              });
              tatil.passport = ppObj;
            }
            if (vizeler.data) {
              tatil.visas = vizeler.data.map(x => ({
                id: x.id, type: x.type, owner: x.owner,
                start: x.start_date, end: x.end_date,
                entries: x.entries, country: x.country
              }));
            }

            // ── Mühendislik ──
            if (problems.data) {
              muhendislik.problemBank = problems.data.map(x => ({
                id: x.id, title: x.title, description: x.description,
                category: x.category, priority: x.priority, status: x.status,
                solution: x.solution, date: x.date, ...(x.extra || {})
              }));
            }
            if (decisions.data) {
              muhendislik.decisionLog = decisions.data.map(x => ({
                id: x.id, title: x.title, description: x.description,
                category: x.category, result: x.result,
                pros: x.pros, cons: x.cons, date: x.date, ...(x.extra || {})
              }));
            }
            if (crmCustomers.data) {
              muhendislik.crm = { ...muhendislik.crm };
              muhendislik.crm.customers = crmCustomers.data.map(x => ({
                id: x.id, name: x.name, company: x.company,
                phone: x.phone, email: x.email, notes: x.notes,
                status: x.status, date: x.date, ...(x.extra || {})
              }));
            }
            if (crmDeals.data) {
              muhendislik.crm = { ...muhendislik.crm };
              muhendislik.crm.deals = crmDeals.data.map(x => ({
                id: x.id, customerId: x.customer_id, title: x.title,
                amount: Number(x.amount || 0), status: x.status,
                notes: x.notes, date: x.date, ...(x.extra || {})
              }));
            }
            if (proceler.data) {
              muhendislik.zihniProceler = proceler.data.map(x => ({
                id: x.id, title: x.title, description: x.description,
                category: x.category, completed: x.completed,
                date: x.date, ...(x.extra || {})
              }));
            }
            if (lifeRoutines.data) {
              muhendislik.life = { ...muhendislik.life };
              muhendislik.life.routines = lifeRoutines.data.map(x => ({
                id: x.id, title: x.title, category: x.category,
                frequency: x.frequency, timeOfDay: x.time_of_day,
                completed: x.completed, date: x.date, ...(x.extra || {})
              }));
            }
            if (lifePrograms.data) {
              muhendislik.life = { ...muhendislik.life };
              muhendislik.life.programs = lifePrograms.data.map(x => ({
                id: x.id, title: x.title, description: x.description,
                status: x.status, date: x.date, ...(x.extra || {})
              }));
            }

            // ── Modaring ──
            if (personel.data) {
              modaring.personel = personel.data.map(x => ({
                id: x.id, name: x.name, hourlyRate: Number(x.hourly_rate || 0),
                color: x.color, emoji: x.emoji, active: x.active
              }));
            }
            if (vardiya.data) {
              modaring.vardiya = vardiya.data.map(x => ({
                id: x.id, personelId: x.personel_id, date: x.date,
                startTime: x.start_time, endTime: x.end_time,
                totalPay: Number(x.total_pay || 0), status: x.status
              }));
            }
            if (kasaItems.data) {
              modaring.kasa = kasaItems.data.map(x => ({
                id: x.id, date: x.date, type: x.type,
                amount: Number(x.amount || 0), method: x.method,
                note: x.note, bankId: x.bank_id
              }));
            }
            if (bankalar.data) {
              modaring.bankalar = bankalar.data.map(x => ({
                id: x.id, name: x.name, type: x.type,
                balance: Number(x.balance || 0), color: x.color, icon: x.icon
              }));
            }
            if (tedarik.data) {
              modaring.tedarik = tedarik.data.map(x => ({
                id: x.id, name: x.name, link: x.link,
                category: x.category, contact: x.contact, note: x.note
              }));
            }
            if (siparisler.data && siparisler.data.length > 0) {
              modaring.siparisler = siparisler.data.map(x => ({
                id: x.id, supplierId: x.supplier_id, date: x.date,
                items: x.items || [], total: Number(x.total || 0),
                paid: x.paid, status: x.status, bankId: x.bank_id
              }));
            }
            if (ajanda.data && ajanda.data.length > 0) {
              modaring.ajanda = ajanda.data.map(x => ({
                id: x.id, title: x.title, dueDate: x.due_date,
                amount: Number(x.amount || 0), status: x.status
              }));
            }
            if (refika.data && refika.data.length > 0) {
              modaring.refikaFikirleri = refika.data.map(x => ({
                id: x.id, title: x.title, desc: x.description,
                cost: Number(x.cost || 0), price: Number(x.price || 0),
                strategy: x.strategy, context: x.context, date: x.date
              }));
            }

            // ── Mutfak ──
            if (mutfakSiparisler.data) mutfak.siparisler = mutfakSiparisler.data;
            if (mutfakRestaurants.data) mutfak.restaurantlar = mutfakRestaurants.data.map(r => r.isim);
            if (mutfakArsiv.data) mutfak.arsiv = mutfakArsiv.data;

            return { tatil, muhendislik, modaring, mutfak };
          });
        } catch (error) {
          console.error("❌ fetchGroup3Data error:", error);
        }
      },


      setModuleData: (moduleName, data) => {
        const state = get();
        // Bug Fix: If data is not an object, just replace it. 
        // If it is an object, merge it.
        const isObject = data !== null && typeof data === 'object' && !Array.isArray(data);

        if (isObject) {
          set({ [moduleName]: { ...state[moduleName], ...data } });
        } else {
          set({ [moduleName]: data });
        }


        // GRUP 2 GÖLGE YAZIM: setModuleData üzerinden yapılan güncellemeler
        if (moduleName === 'saglik' && isObject) {
          const merged = { ...state.saglik, ...data };
          if (data.randevular) merged.randevular.forEach(r => pushSaglikRandevuToSupabase(r, state.family_id));
          if (data.ilaclar) merged.ilaclar.forEach(i => pushSaglikIlacToSupabase(i, state.family_id));
          if (data.olcumler) merged.olcumler.forEach(o => pushSaglikOlcumToSupabase(o, state.family_id));
        }
        if (moduleName === 'mutfak' && isObject && data.alisveris) {
          data.alisveris.forEach(item => pushAlisverisToSupabase(item, 'mutfak'));
        }
        if (moduleName === 'ev' && isObject) {
          if (data.bakimlar) data.bakimlar.forEach(b => pushEvBakimToSupabase(b));
          if (data.demirbaslar) data.demirbaslar.forEach(d => pushEvDemirbasToSupabase(d));
        }
        if (moduleName === 'tatil' && isObject) {
          if (data.trips) {
            const oldTrips = state.tatil?.trips || [];
            data.trips.forEach(newTrip => {
              const oldTrip = oldTrips.find(t => t.id === newTrip.id);
              if (!oldTrip || JSON.stringify(oldTrip) !== JSON.stringify(newTrip)) {
                pushTatilTripToSupabase(newTrip);
              }
            });
          }
          if (data.wishlist) {
            const oldWish = state.tatil?.wishlist || [];
            data.wishlist.forEach(newW => {
              const oldW = oldWish.find(w => w.id === newW.id);
              if (!oldW || JSON.stringify(oldW) !== JSON.stringify(newW)) {
                pushTatilWishlistToSupabase(newW);
              }
            });
          }
          if (data.passport) {
            for (const kisi in data.passport) {
              const oldPass = state.tatil?.passport?.[kisi];
              const newPass = data.passport[kisi];
              if (!oldPass || JSON.stringify(oldPass) !== JSON.stringify(newPass)) {
                pushTatilPasaportToSupabase(kisi, newPass);
              }
            }
          }
          if (data.visas) {
            const oldVisas = state.tatil?.visas || [];
            data.visas.forEach(newV => {
              const oldV = oldVisas.find(v => v.id === newV.id);
              if (!oldV || JSON.stringify(oldV) !== JSON.stringify(newV)) {
                pushTatilVizeToSupabase(newV);
              }
            });
          }
        }
      },

      toggleSilentMode: () => {
        const state = get();
        const newValue = !state.settings.silentMode;
        set({ settings: { ...state.settings, silentMode: newValue } });
        get().addLog('Sistem Ayarı', `Sessiz Mod ${newValue ? 'Açıldı' : 'Kapatıldı'}`);

      },

      updateUser: (userId, updates) => {
        const state = get();
        const updatedUsers = {
          ...state.users,
          [userId]: { ...state.users[userId], ...updates }
        };
        set({ users: updatedUsers });
        get().addLog('Profil Güncelleme', `${state.users[userId].name} bilgilerini güncelledi.`);

      },

      addMood: (user, mood, note, kategori) => {
        const state = get();
        const newMood = {
          id: Date.now(),
          user,
          mood,
          note,
          kategori: kategori || 'Genel',
          date: new Date().toISOString()
        };
        const updatedMoods = [newMood, ...(state.saglik.moods || [])].slice(0, 100);
        set({ saglik: { ...state.saglik, moods: updatedMoods } });

        pushSaglikMoodToSupabase(newMood);
      },

      takeMedicine: async (medId, slot = 'morning') => {
        const state = get();
        const meds = [...state.saglik.ilaclar];
        const idx = meds.findIndex(m => m.id === medId);
        if (idx === -1) return;

        const med = meds[idx];
        const newStok = Math.max(0, (med.stok || 0) - 1);
        meds[idx] = { ...med, stok: newStok };

        const now = new Date();
        let logDate = new Date(now);
        
        // If taking evening dose in the early morning (before 5 AM), attribute it to yesterday
        if (slot === 'evening' && now.getHours() < 5) {
          logDate.setDate(now.getDate() - 1);
        }

        const localDate = logDate.getFullYear() + '-' + String(logDate.getMonth() + 1).padStart(2, '0') + '-' + String(logDate.getDate()).padStart(2, '0');
        const localTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

        const log = {
          id: Date.now(),
          medId: med.id,
          ad: med.ad,
          kisi: med.kisi,
          slot: slot,
          date: localDate,
          dt: localTime
        };
        const updatedLogs = [log, ...(state.saglik.logs || [])].slice(0, 100);

        set({ saglik: { ...state.saglik, ilaclar: meds, logs: updatedLogs } });

        get().addLog('İlaç Takibi', `${med.kisi} - ${med.ad} ilacının ${slot === 'morning' ? 'Sabah' : slot === 'afternoon' ? 'Öğle' : 'Akşam'} dozunu içti. ✅`);

        if (newStok <= (med.minStok || 5)) {
          get().addLog('İlaç Azaldı', `${med.ad} stoğu kritik seviyeye düştü (${newStok} adet kaldı). Yenisini almayı unutmayın!`);
        }

        await Promise.all([
          pushSaglikIlacToSupabase(meds[idx], state.family_id || DEFAULT_FID),
          pushSaglikLogToSupabase(log, state.family_id || DEFAULT_FID)
        ]);
      },

      deleteMedicine: (id) => {
        const state = get();
        const updated = (state.saglik.ilaclar || []).filter(m => String(m.id) !== String(id));
        set({ saglik: { ...state.saglik, ilaclar: updated } });

        deleteSaglikIlacFromSupabase(id);
      },

      archiveMedicine: (id) => {
        const state = get();
        const ilac = (state.saglik.ilaclar || []).find(m => String(m.id) === String(id));
        if(ilac) {
          const updated = { ...ilac, stok: -1 };
          const list = state.saglik.ilaclar.map(m => String(m.id) === String(id) ? updated : m);
          set({ saglik: { ...state.saglik, ilaclar: list } });
          pushSaglikIlacToSupabase(updated);
        }
      },

      deleteAppointment: (id) => {
        const state = get();
        const updated = (state.saglik.randevular || []).filter(r => String(r.id) !== String(id));
        set({ saglik: { ...state.saglik, randevular: updated } });

        deleteSaglikRandevuFromSupabase(id);
      },

      deleteMeasurement: (id) => {
        const state = get();
        const updated = (state.saglik.olcumler || []).filter(o => String(o.id) !== String(id));
        set({ saglik: { ...state.saglik, olcumler: updated } });

        deleteSaglikOlcumFromSupabase(id);
      },

      addSleepData: async (data) => {
        const state = get();
        const updated = [data, ...(state.saglik.sleep || [])];
        set({ saglik: { ...state.saglik, sleep: updated } });

        await pushSaglikSleepToSupabase(data, state.family_id || DEFAULT_FID);
      },

      deleteSleepData: async (id) => {
        const state = get();
        const updated = (state.saglik.sleep || []).filter(s => String(s.id) !== String(id));
        set({ saglik: { ...state.saglik, sleep: updated } });

        await deleteSaglikSleepFromSupabase(id);
      },

      addMeasurement: async (form) => {
        const state = get();
        const newOlcum = { id: Date.now(), ...form };
        const updated = [newOlcum, ...(state.saglik.olcumler || [])];
        set({ saglik: { ...state.saglik, olcumler: updated } });

        await pushSaglikOlcumToSupabase(newOlcum, state.family_id || DEFAULT_FID);
      },

      addAppointment: async (form) => {
        const state = get();
        const newRandevu = { id: Date.now(), ...form };
        const updated = [newRandevu, ...(state.saglik.randevular || [])];
        set({ saglik: { ...state.saglik, randevular: updated } });

        await pushSaglikRandevuToSupabase(newRandevu, state.family_id || DEFAULT_FID);
      },

      addMedicine: async (form) => {
        const state = get();
        const newIlac = { id: Date.now(), ...form };
        const updated = [newIlac, ...(state.saglik.ilaclar || [])];
        set({ saglik: { ...state.saglik, ilaclar: updated } });

        await pushSaglikIlacToSupabase(newIlac, state.family_id || DEFAULT_FID);
      },

      updateMedicine: async (id, updates) => {
        const state = get();
        const updated = (state.saglik.ilaclar || []).map(m => String(m.id) === String(id) ? { ...m, ...updates } : m);
        set({ saglik: { ...state.saglik, ilaclar: updated } });

        const item = updated.find(m => String(m.id) === String(id));
        if (item) await pushSaglikIlacToSupabase(item, state.family_id || DEFAULT_FID);
      },

      updateAppointment: async (id, updates) => {
        const state = get();
        const updated = (state.saglik.randevular || []).map(r => String(r.id) === String(id) ? { ...r, ...updates } : r);
        set({ saglik: { ...state.saglik, randevular: updated } });

        const item = updated.find(r => String(r.id) === String(id));
        if (item) await pushSaglikRandevuToSupabase(item, state.family_id || DEFAULT_FID);
      },

      updateMeasurement: async (id, updates) => {
        const state = get();
        const updated = (state.saglik.olcumler || []).map(o => String(o.id) === String(id) ? { ...o, ...updates } : o);
        set({ saglik: { ...state.saglik, olcumler: updated } });

        const item = updated.find(o => String(o.id) === String(id));
        if (item) await pushSaglikOlcumToSupabase(item, state.family_id || DEFAULT_FID);
      },

      checkSystemNotifications: () => {
        const state = get();
        if (!state.currentUser) return;

        const now = new Date();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        // 1. Araç Belgeleri Kontrolü
        state.garaj.forEach(v => {
          v.documents?.forEach(doc => {
            if (!doc.dueDate) return;
            const diff = new Date(doc.dueDate) - now;
            if (diff > 0 && diff < thirtyDays) {
              const days = Math.round(diff / (24 * 60 * 60 * 1000));
              notificationService.send(
                '🚗 Belge Hatırlatıcı',
                `${v.model} - ${doc.name} bitimine ${days} gün kaldı!`
              );
            }
          });
        });

        // 2. Pet Aşı Kontrolü
        if (state.pet?.pets) {
          state.pet.pets.forEach(p => {
            const vaccines = state.pet.vaccines?.[p.id] || [];
            vaccines.forEach(v => {
              const diff = new Date(v.date) - now;
              if (diff > 0 && diff < sevenDays) {
                notificationService.send('🐾 Pet Aşı Uyarısı', `${p.name} için ${v.type} aşısı yaklaşıyor!`);
              }
            });
          });
        }

        // 3. Ev Bakım Kontrolü
        if (state.ev?.bakimlar) {
          state.ev.bakimlar.forEach(b => {
            const last = new Date(b.lastDate);
            const next = new Date(last.getTime() + (b.intervalDays * 24 * 60 * 60 * 1000));
            const diff = next - now;
            if (diff > 0 && diff < sevenDays) {
              notificationService.send('🏠 Ev Bakımı', `${b.name} zamanı yaklaşıyor!`);
            }
          });
        }

        // 4. Deprem & İlk Yardım Çantası Kontrolü
        const kits = state.ev?.emergencyKits || {};
        Object.keys(kits).forEach(kitType => {
          kits[kitType].forEach(item => {
            if (!item.expDate) return;
            const diff = new Date(item.expDate) - now;
            if (diff > 0 && diff < sevenDays) {
              const days = Math.round(diff / (24 * 60 * 60 * 1000));
              notificationService.send(
                kitType === 'deprem' ? '🚨 Deprem Çantası' : '🩹 İlk Yardım Çantası',
                `${item.item} son kullanma tarihine ${days} gün kaldı! Lütfen yenileyin.`
              );
              get().addLog('Güvenlik Uyarısı', `${item.item} (${kitType === 'deprem' ? 'Deprem' : 'İlk Yardım'}) son kullanma tarihine ${days} gün kaldı!`);
            }
          });
        });
      },

      initSync: async () => {
        if (get().syncing) return; // Zaten çalışıyor
        try {
          // Client ID'yi sabitle
          const cid = localStorage.getItem('eraylar_client_id') || Math.random().toString(36).substring(2);
          localStorage.setItem('eraylar_client_id', cid);

          set({ syncing: true });
          await get().loadFromSupabase();
          
          // Fetch Group 2 (Ev, Garaj, Pet, Saglik) and Group 3 (Tatil, Modaring, Muh) in parallel
          await Promise.all([
            get().fetchGroup2Data(),
            get().fetchGroup3Data()
          ]);

          get().subscribeToSupabase();

          // Veri yüklendikten sonra bildirimleri kontrol et
          setTimeout(() => get().checkSystemNotifications(), 2000);

          // Final fallback: if still empty after sync, restore defaults
          const current = get();
          if (!current.mutfak.tarifler || current.mutfak.tarifler.length === 0) {
            console.warn('🔄 Restoring mutfak defaults...');
            set({ mutfak: DEFAULT_STATE.mutfak });
          }
          return true;
        } catch (e) {
          console.error('InitSync error:', e);
          return false;
        }
      },

      // ── Mühendislik Actions ────────────────────────────────
      addEngineeringProblem: (problem) => {
        const state = get();
        const currentBank = Array.isArray(state.muhendislik.problemBank) ? state.muhendislik.problemBank : [];
        const newProblem = {
          id: Date.now(),
          date: new Date().toISOString(),
          ...problem
        };
        set({ muhendislik: { ...state.muhendislik, problemBank: [newProblem, ...currentBank] } });
        get().addLog('Mühendislik', `Yeni problem kaydedildi: ${problem.title}`);

        pushMuhendislikProblemToSupabase(newProblem);
      },
      updateEngineeringProblem: (id, updates) => {
        const state = get();
        const currentBank = Array.isArray(state.muhendislik.problemBank) ? state.muhendislik.problemBank : [];
        const updated = currentBank.map(p => p.id === id ? { ...p, ...updates } : p);
        set({ muhendislik: { ...state.muhendislik, problemBank: updated } });

        const updatedItem = updated.find(p => p.id === id);
        if (updatedItem) pushMuhendislikProblemToSupabase(updatedItem);
      },
      deleteEngineeringProblem: (id) => {
        const state = get();
        const updated = state.muhendislik.problemBank.filter(p => p.id !== id);
        set({ muhendislik: { ...state.muhendislik, problemBank: updated } });

        deleteMuhendislikProblemFromSupabase(id);
      },
      addEngineeringDecision: (decision) => {
        const state = get();
        const newDecision = {
          id: Date.now(),
          date: new Date().toISOString(),
          ...decision
        };
        set({ muhendislik: { ...state.muhendislik, decisionLog: [newDecision, ...state.muhendislik.decisionLog] } });
        get().addLog('Karar Günlüğü', `Yeni karar alındı: ${decision.title}`);

        pushMuhendislikDecisionToSupabase(newDecision);
      },
      updateEngineeringDecision: (id, updates) => {
        const state = get();
        const updated = state.muhendislik.decisionLog.map(d => d.id === id ? { ...d, ...updates } : d);
        set({ muhendislik: { ...state.muhendislik, decisionLog: updated } });

        const updatedDec = updated.find(d => d.id === id);
        if (updatedDec) pushMuhendislikDecisionToSupabase(updatedDec);
      },
      deleteEngineeringDecision: (id) => {
        const state = get();
        const updated = state.muhendislik.decisionLog.filter(d => d.id !== id);
        set({ muhendislik: { ...state.muhendislik, decisionLog: updated } });

        deleteMuhendislikDecisionFromSupabase(id);
      },
      togglePinnedConversion: (id) => {
        const state = get();
        const current = state.muhendislik.pinnedConversions || [];
        let updated;
        if (current.includes(id)) {
          updated = current.filter(cid => cid !== id);
        } else {
          updated = [id, ...current].slice(0, 3);
        }
        set({ muhendislik: { ...state.muhendislik, pinnedConversions: updated } });

      },

      // --- Engineering CRM Actions ---
      addCrmCustomer: (customer) => {
        const state = get();
        const newCustomer = { id: Date.now(), ...customer, date: new Date().toISOString() };
        const updatedCrm = { ...state.muhendislik.crm, customers: [newCustomer, ...(state.muhendislik.crm.customers || [])] };
        set({ muhendislik: { ...state.muhendislik, crm: updatedCrm } });

        pushCrmCustomerToSupabase(newCustomer);
      },
      updateCrmCustomer: (id, updates) => {
        const state = get();
        const updatedCustomers = (state.muhendislik.crm.customers || []).map(c => c.id === id ? { ...c, ...updates } : c);
        set({ muhendislik: { ...state.muhendislik, crm: { ...state.muhendislik.crm, customers: updatedCustomers } } });

        const updatedCust = updatedCustomers.find(c => c.id === id);
        if (updatedCust) pushCrmCustomerToSupabase(updatedCust);
      },
      deleteCrmCustomer: (id) => {
        const state = get();
        const updatedCustomers = (state.muhendislik.crm.customers || []).filter(c => c.id !== id);
        const updatedDeals = (state.muhendislik.crm.deals || []).filter(d => d.customerId !== id);
        set({ muhendislik: { ...state.muhendislik, crm: { customers: updatedCustomers, deals: updatedDeals } } });

        deleteCrmCustomerFromSupabase(id);
      },
      addCrmDeal: (deal) => {
        const state = get();
        const newDeal = { id: Date.now(), ...deal, date: new Date().toISOString() };
        const updatedDeals = [newDeal, ...(state.muhendislik.crm.deals || [])];
        set({ muhendislik: { ...state.muhendislik, crm: { ...state.muhendislik.crm, deals: updatedDeals } } });

        pushCrmDealToSupabase(newDeal);
      },
      updateCrmDeal: (id, updates) => {
        const state = get();
        const updatedDeals = (state.muhendislik.crm.deals || []).map(d => d.id === id ? { ...d, ...updates } : d);
        set({ muhendislik: { ...state.muhendislik, crm: { ...state.muhendislik.crm, deals: updatedDeals } } });

        const updatedDeal = updatedDeals.find(d => d.id === id);
        if (updatedDeal) pushCrmDealToSupabase(updatedDeal);
      },
      deleteCrmDeal: (id) => {
        const state = get();
        const updatedDeals = (state.muhendislik.crm.deals || []).filter(d => d.id !== id);
        set({ muhendislik: { ...state.muhendislik, crm: { ...state.muhendislik.crm, deals: updatedDeals } } });

        deleteCrmDealFromSupabase(id);
      },

      // --- Zihni Sinir Proce Actions ---
      addZihniProce: (proce) => {
        const state = get();
        const currentProceler = state.muhendislik.zihniProceler || [];
        set({ 
          muhendislik: { 
            ...state.muhendislik, 
            zihniProceler: [proce, ...currentProceler] 
          } 
        });

        pushZihniProceToSupabase(proce);
      },
      updateZihniProce: (id, updates) => {
        const state = get();
        const updated = (state.muhendislik.zihniProceler || []).map(p => p.id === id ? { ...p, ...updates } : p);
        set({ muhendislik: { ...state.muhendislik, zihniProceler: updated } });

        const updatedProce = updated.find(p => p.id === id);
        if (updatedProce) pushZihniProceToSupabase(updatedProce);
      },
      toggleZihniProceStatus: (id) => {
        const state = get();
        const updated = (state.muhendislik.zihniProceler || []).map(p => 
          p.id === id ? { ...p, completed: !p.completed } : p
        );
        set({ muhendislik: { ...state.muhendislik, zihniProceler: updated } });

        const toggled = updated.find(p => p.id === id);
        if (toggled) pushZihniProceToSupabase(toggled);
      },
      deleteZihniProce: (id) => {
        const state = get();
        const updated = (state.muhendislik.zihniProceler || []).filter(p => p.id !== id);
        set({ muhendislik: { ...state.muhendislik, zihniProceler: updated } });

        deleteZihniProceFromSupabase(id);
      },

      // --- Engineering Life Actions ---
      addLifeRoutine: (routine) => {
        const state = get();
        const newRoutine = { id: Date.now(), ...routine, completed: false };
        const updatedLife = { ...state.muhendislik.life, routines: [newRoutine, ...(state.muhendislik.life.routines || [])] };
        set({ muhendislik: { ...state.muhendislik, life: updatedLife } });

        pushLifeRoutineToSupabase(newRoutine);
      },
      toggleLifeRoutine: (id) => {
        const state = get();
        const updatedRoutines = (state.muhendislik.life.routines || []).map(r => 
          r.id === id ? { ...r, completed: !r.completed } : r
        );
        set({ muhendislik: { ...state.muhendislik, life: { ...state.muhendislik.life, routines: updatedRoutines } } });

        const toggledRoutine = updatedRoutines.find(r => r.id === id);
        if (toggledRoutine) pushLifeRoutineToSupabase(toggledRoutine);
      },
      deleteLifeRoutine: (id) => {
        const state = get();
        const updatedRoutines = (state.muhendislik.life.routines || []).filter(r => r.id !== id);
        set({ muhendislik: { ...state.muhendislik, life: { ...state.muhendislik.life, routines: updatedRoutines } } });

        deleteLifeRoutineFromSupabase(id);
      },
      addLifeProgram: (program) => {
        const state = get();
        const newProgram = { id: Date.now(), ...program, date: new Date().toISOString() };
        const updatedLife = { ...state.muhendislik.life, programs: [newProgram, ...(state.muhendislik.life.programs || [])] };
        set({ muhendislik: { ...state.muhendislik, life: updatedLife } });

        pushLifeProgramToSupabase(newProgram);
      },
      deleteLifeProgram: (id) => {
        const state = get();
        const updatedPrograms = (state.muhendislik.life.programs || []).filter(p => p.id !== id);
        set({ muhendislik: { ...state.muhendislik, life: { ...state.muhendislik.life, programs: updatedPrograms } } });

        deleteLifeProgramFromSupabase(id);
      },

      // --- Modaring Actions (SQL-First) ---
      addModaringPersonel: (person) => {
        const state = get();
        const newPerson = { id: Date.now(), ...person, active: true };
        const updated = [...(state.modaring.personel || []), newPerson];
        set({ modaring: { ...state.modaring, personel: updated } });
        pushModaringPersonelToSupabase(newPerson);
      },
      updateModaringPersonel: (id, updates) => {
        const state = get();
        const updated = (state.modaring.personel || []).map(p => p.id === id ? { ...p, ...updates } : p);
        set({ modaring: { ...state.modaring, personel: updated } });
        const item = updated.find(p => p.id === id);
        if (item) pushModaringPersonelToSupabase(item);
      },
      deleteModaringPersonel: (id) => {
        const state = get();
        const updatedP = (state.modaring.personel || []).filter(p => p.id !== id);
        const updatedV = (state.modaring.vardiya || []).filter(v => v.personelId !== id);
        set({ modaring: { ...state.modaring, personel: updatedP, vardiya: updatedV } });
        deleteModaringPersonelFromSupabase(id);
      },
      addModaringVardiya: (shift) => {
        const state = get();
        const newShift = { id: Date.now(), ...shift };
        const updated = [...(state.modaring.vardiya || []), newShift];
        set({ modaring: { ...state.modaring, vardiya: updated } });
        pushModaringVardiyaToSupabase(newShift);
      },
      updateModaringVardiya: (id, updates) => {
        const state = get();
        const updated = (state.modaring.vardiya || []).map(v => v.id === id ? { ...v, ...updates } : v);
        set({ modaring: { ...state.modaring, vardiya: updated } });
        const item = updated.find(v => v.id === id);
        if (item) pushModaringVardiyaToSupabase(item);
      },
      deleteModaringVardiya: (id) => {
        const state = get();
        const updated = (state.modaring.vardiya || []).filter(v => v.id !== id);
        set({ modaring: { ...state.modaring, vardiya: updated } });
        deleteModaringVardiyaFromSupabase(id);
      },
      addModaringKasaItem: (item) => {
        const state = get();
        const newItem = { id: Date.now(), ...item };
        const updated = [...(state.modaring.kasa || []), newItem];
        set({ modaring: { ...state.modaring, kasa: updated } });
        pushModaringKasaToSupabase(newItem);
      },
      updateModaringKasaItem: (id, updates) => {
        const state = get();
        const updated = (state.modaring.kasa || []).map(k => k.id === id ? { ...k, ...updates } : k);
        set({ modaring: { ...state.modaring, kasa: updated } });
        const item = updated.find(k => k.id === id);
        if (item) pushModaringKasaToSupabase(item);
      },
      deleteModaringKasaItem: (id) => {
        const state = get();
        const updated = (state.modaring.kasa || []).filter(k => k.id !== id);
        set({ modaring: { ...state.modaring, kasa: updated } });
        deleteModaringKasaFromSupabase(id);
      },
      addModaringBank: (bank) => {
        const state = get();
        const newBank = { id: Date.now(), ...bank };
        const updated = [...(state.modaring.bankalar || []), newBank];
        set({ modaring: { ...state.modaring, bankalar: updated } });
        pushModaringBankaToSupabase(newBank);
      },
      updateModaringBank: (id, updates) => {
        const state = get();
        const updated = (state.modaring.bankalar || []).map(b => b.id === id ? { ...b, ...updates } : b);
        set({ modaring: { ...state.modaring, bankalar: updated } });
        const item = updated.find(b => b.id === id);
        if (item) pushModaringBankaToSupabase(item);
      },
      deleteModaringBank: (id) => {
        const state = get();
        const updated = (state.modaring.bankalar || []).filter(b => b.id !== id);
        set({ modaring: { ...state.modaring, bankalar: updated } });
        deleteModaringBankaFromSupabase(id);
      },
      addModaringTedarik: (tedarik) => {
        const state = get();
        const newItem = { id: Date.now(), ...tedarik };
        const updated = [...(state.modaring.tedarik || []), newItem];
        set({ modaring: { ...state.modaring, tedarik: updated } });
        pushModaringTedarikToSupabase(newItem);
      },
      updateModaringTedarik: (id, updates) => {
        const state = get();
        const updated = (state.modaring.tedarik || []).map(t => t.id === id ? { ...t, ...updates } : t);
        set({ modaring: { ...state.modaring, tedarik: updated } });
        const item = updated.find(t => t.id === id);
        if (item) pushModaringTedarikToSupabase(item);
      },
      deleteModaringTedarik: (id) => {
        const state = get();
        const updated = (state.modaring.tedarik || []).filter(t => t.id !== id);
        set({ modaring: { ...state.modaring, tedarik: updated } });
        deleteModaringTedarikFromSupabase(id);
      },
      addModaringSiparis: (siparis) => {
        const state = get();
        const newItem = { id: Date.now(), ...siparis };
        const updated = [...(state.modaring.siparisler || []), newItem];
        set({ modaring: { ...state.modaring, siparisler: updated } });
        pushModaringSiparisToSupabase(newItem);
      },
      updateModaringSiparis: (id, updates) => {
        const state = get();
        const updated = (state.modaring.siparisler || []).map(s => s.id === id ? { ...s, ...updates } : s);
        set({ modaring: { ...state.modaring, siparisler: updated } });
        const item = updated.find(s => s.id === id);
        if (item) pushModaringSiparisToSupabase(item);
      },
      deleteModaringSiparis: (id) => {
        const state = get();
        const updated = (state.modaring.siparisler || []).filter(s => s.id !== id);
        set({ modaring: { ...state.modaring, siparisler: updated } });
        deleteModaringSiparisFromSupabase(id);
      },
      addModaringAjanda: (task) => {
        const state = get();
        const newItem = { id: Date.now(), ...task };
        const updated = [...(state.modaring.ajanda || []), newItem];
        set({ modaring: { ...state.modaring, ajanda: updated } });
        pushModaringAjandaToSupabase(newItem);
      },
      updateModaringAjanda: (id, updates) => {
        const state = get();
        const updated = (state.modaring.ajanda || []).map(a => a.id === id ? { ...a, ...updates } : a);
        set({ modaring: { ...state.modaring, ajanda: updated } });
        const item = updated.find(a => a.id === id);
        if (item) pushModaringAjandaToSupabase(item);
      },
      deleteModaringAjanda: (id) => {
        const state = get();
        const updated = (state.modaring.ajanda || []).filter(a => a.id !== id);
        set({ modaring: { ...state.modaring, ajanda: updated } });
        deleteModaringAjandaFromSupabase(id);
      },
      addModaringRefika: (fikir) => {
        const state = get();
        const newItem = { id: Date.now(), ...fikir, date: new Date().toISOString() };
        const updated = [...(state.modaring.refikaFikirleri || []), newItem];
        set({ modaring: { ...state.modaring, refikaFikirleri: updated } });
        pushModaringRefikaToSupabase(newItem);
      },
      updateModaringRefika: (id, updates) => {
        const state = get();
        const updated = (state.modaring.refikaFikirleri || []).map(r => r.id === id ? { ...r, ...updates } : r);
        set({ modaring: { ...state.modaring, refikaFikirleri: updated } });
        const item = updated.find(r => r.id === id);
        if (item) pushModaringRefikaToSupabase(item);
      },
      deleteModaringRefika: (id) => {
        const state = get();
        const updated = (state.modaring.refikaFikirleri || []).filter(r => r.id !== id);
        set({ modaring: { ...state.modaring, refikaFikirleri: updated } });
        deleteModaringRefikaFromSupabase(id);
      },

      // --- Focus Session Actions ---
      addFocusSession: (session) => {
        const state = get();
        const currentSessions = state.muhendislik.life.focusSessions || [];
        const updatedLife = { 
          ...state.muhendislik.life, 
          focusSessions: [session, ...currentSessions] 
        };
        set({ muhendislik: { ...state.muhendislik, life: updatedLife } });

      },
      deleteFocusSession: (id) => {
        const state = get();
        const updatedSessions = (state.muhendislik.life.focusSessions || []).filter(s => s.id !== id);
        set({ muhendislik: { ...state.muhendislik, life: { ...state.muhendislik.life, focusSessions: updatedSessions } } });

      },

      addLifeActivity: (activity) => {
        const state = get();
        const currentActivities = state.muhendislik.life.dailyActivities || [];
        const updatedLife = { 
          ...state.muhendislik.life, 
          dailyActivities: [activity, ...currentActivities] 
        };
        set({ muhendislik: { ...state.muhendislik, life: updatedLife } });

      },
      deleteLifeActivity: (id) => {
        const state = get();
        const updatedActivities = (state.muhendislik.life.dailyActivities || []).filter(a => a.id !== id);
        set({ muhendislik: { ...state.muhendislik, life: { ...state.muhendislik.life, dailyActivities: updatedActivities } } });

      },

      loadFromSupabase: async () => {
        set({ syncing: true });
        const remote = await fetchFromSupabase();
        if (remote) {
          const legacyFinans = remote.kasa ? {
            ...DEFAULT_STATE.finans,
            bakiyeler: { gorkem: remote.kasa.gorkem, esra: remote.kasa.esra, ortak: remote.kasa.ortak },
            history: remote.kasa.gecmis || []
          } : null;

          set(state => ({
            users: remote.users || state.users,
            selectedVehicleId: remote.selectedVehicleId || state.selectedVehicleId,
            achievements: remote.achievements || state.achievements,
            logs: [...new Map([...(state.logs || []), ...(remote.logs || [])].map(item => [item.id, item])).values()].slice(0, 50),
            ui: remote.ui || state.ui,

            // 🏛️ 2. MİLAT: Tüm modüller SQL'den beslenir. 
            // loadFromSupabase sonrası çalışan fetchPhase3, fetchGroup1/2/3 ile güncellenirler.
            finans: state.finans,
            kasa: state.kasa,
            mutfak: state.mutfak,
            saglik: state.saglik,
            alisveris: state.alisveris,
            hedefler: state.hedefler,
            sosyal: state.sosyal,
            ev: state.ev,
            pet: state.pet,
            garaj: state.garaj,
            tatil: state.tatil,
            muhendislik: state.muhendislik,
            modaring: state.modaring,

            system: { ...state.system, isCloudReady: true, lastSync: Date.now() },
            isOnline: true
          }));
        } else {
        }
        set({ syncing: false });

        // FAZ 9: JSON verisi yüklendikten sonra yeni SQL tablolarını üzerine yaz/kontrol et
        await get().fetchPhase3Data(); // Faz 3: Supabase -> Single Source of Truth
        await get().fetchTaksitler(); // Taksitler verisi
        await get().fetchGroup1Data(); // Faz 1.4: Grup 1 Mutfak, Sosyal, Alışveriş
        await get().fetchGroup2Data(); // Grup 2: Ev, Garaj, Pet, Sağlık
        await get().fetchGroup3Data(); // Grup 3: Tatil, Mühendislik, Modaring
        get().getBuAyHarcamalar();
        get().checkAutoKapanis();
      },

      fetchPhase3Data: async () => {
        try {
          const [
            dbKartlar, dbBorclar, dbOnayHavuzu, dbHedefler, dbGecmis, dbVizyon, dbMutabakat,
            dbKasaBakiyeler, dbKasaAyarlar, dbFinansAyarlar, dbFinansRekurans, dbSaglikAyarlar, dbMutfakSohbet,
            dbTasinmazlar, dbBankalar, dbVarliklar, dbKumbaralar
          ] = await Promise.all([
            supabase.from('finans_kartlar').select('*'),
            supabase.from('finans_krediler').select('*'),
            supabase.from('finans_onay_havuzu').select('*'),
            supabase.from('hedefler_aktif').select('*'),
            supabase.from('hedefler_gecmis').select('*'),
            supabase.from('hedefler_vizyon').select('*'),
            supabase.from('finans_kart_mutabakat').select('*'),
            supabase.from('kasa_bakiyeler').select('*'),
            supabase.from('kasa_ayarlar').select('*'),
            supabase.from('finans_ayarlar').select('*'),
            supabase.from('finans_rekuranslar').select('*'),
            supabase.from('saglik_ayarlar').select('*'),
            supabase.from('mutfak_sohbet').select('*').order('tarih', { ascending: false }).limit(50),
            supabase.from('kasa_tasinmazlar').select('*'),
            supabase.from('kasa_bankalar').select('*'),
            supabase.from('kasa_varliklar').select('*'),
            supabase.from('kasa_kumbaralar').select('*')
          ]);

          set(state => {
            const f = { ...state.finans };
            const k = { ...state.kasa };
            const h = { ...state.hedefler };
            const s = { ...state.saglik };
            const m = { ...state.mutfak };

            // ── 2. MİLAT: Kalıntı Yüklemeleri ──
            if (dbKasaBakiyeler.data) {
              dbKasaBakiyeler.data.forEach(b => {
                k.bakiyeler[b.id] = Number(b.miktar || 0);
              });
            }
            if (dbKasaAyarlar.data) {
              const rates = dbKasaAyarlar.data.find(x => x.id === 'doviz_kurlari')?.veri;
              if (rates) k.rates = rates;
              const privacy = dbKasaAyarlar.data.find(x => x.id === 'gizlilik_modu')?.veri;
              if (privacy) k.privacyMode = !!privacy.active;
            }
            if (dbFinansAyarlar.data) {
              const limits = dbFinansAyarlar.data.find(x => x.id === 'limitler')?.veri;
              if (limits) f.limits = limits;
            }
            if (dbFinansRekurans.data) {
              f.rekurans = dbFinansRekurans.data;
            }
            if (dbSaglikAyarlar.data) {
              const sleep = dbSaglikAyarlar.data.find(x => x.id === 'uyku_hedefleri')?.veri;
              if (sleep) s.sleepGoals = sleep;
            }
            if (dbMutfakSohbet.data) {
              m.sohbet = dbMutfakSohbet.data.map(msg => ({ id: msg.id, kisi: msg.kisi, mesaj: msg.mesaj, tarih: msg.tarih })).reverse();
            }
            if (dbKartlar.data && dbKartlar.data.length > 0) {
              f.kartlar = dbKartlar.data.map(k => {
                const legacy = DEFAULT_STATE.finans.kartlar.find(dk => dk.id === k.id) || {};
                return { id: k.id, name: k.name, owner: k.owner, cutoff_day: k.cutoff_day, color: k.color, min_pct: k.min_pct, limit: Number(k.limit ?? legacy.limit ?? 0), balance: Number(k.balance ?? legacy.balance ?? 0), due_day_offset: Number(k.due_day_offset ?? legacy.due_day_offset ?? 10) };
              });
            } else if (dbKartlar.data && dbKartlar.data.length === 0) {
              f.kartlar = DEFAULT_STATE.finans.kartlar;
            }

            if (dbBorclar.data && dbBorclar.data.length > 0) {
              f.borclar = dbBorclar.data.map(b => ({ id: b.id, name: b.name, due_day: b.due_day, total: b.total, remaining: b.remaining, monthly: b.monthly }));
            } else {
              f.borclar = [];
            }

            if (dbMutabakat.data && dbMutabakat.data.length > 0) {
              const newMut = { ...f.kartMutabakat };
              dbMutabakat.data.forEach(m => {
                newMut[m.kart_id] = { 
                  beklenen: Number(m.beklenen_borc || 0), 
                  gercek: m.gercek_borc != null ? Number(m.gercek_borc) : null, 
                  guncel: m.guncel_borc != null ? Number(m.guncel_borc) : null, 
                  ay: m.ay, 
                  paid: !!m.paid, 
                  paymentType: m.payment_type 
                };
              });
              f.kartMutabakat = newMut;
            }

            if (dbOnayHavuzu.data && dbOnayHavuzu.data.length > 0) {
              f.approvalPool = dbOnayHavuzu.data.map(p => ({ id: p.id, title: p.baslik, amount: p.tutar, source: p.kaynak, payer: p.kayit_eden, dt: p.tarih, defaultPay: p.default_pay }));
            }

            if (dbHedefler.data) {
              const mapped = dbHedefler.data.map(x => ({ 
                id: x.id, 
                name: x.title, 
                title: x.title, 
                target: Number(x.target), 
                current: Number(x.current), 
                targetDate: x.target_date, 
                duration: x.duration, 
                priority: x.priority, 
                owner: x.owner, 
                notes: x.notes, 
                yearlyPlan: x.yearly_plan,
                type: x.type || (x.target > 1000 ? 'money' : 'vision')
              }));

              h.goals = mapped.filter(x => x.type === 'vision');
              k.kumbaralar = mapped.filter(x => x.type === 'money');
            }

            // Legacy check: if kasa_kumbaralar still has unique items not in hedefler_aktif, merge them
            if (dbKumbaralar.data) {
              dbKumbaralar.data.forEach(g => {
                const isAlreadyIn = k.kumbaralar.some(ex => String(ex.id) === String(g.id));
                if (!isAlreadyIn) {
                  k.kumbaralar.push({
                    id: g.id,
                    name: g.name,
                    target: Number(g.target || 0),
                    current: Number(g.current || 0),
                    deadline: g.deadline,
                    icon: g.icon,
                    priority: g.priority,
                    category: g.category,
                    type: 'money',
                    ...(g.details || {})
                  });
                }
              });
            }

            if (dbGecmis.data) {
              h.completedHistory = dbGecmis.data.filter(x => x.status === 'completed').map(x => ({ id: x.id, title: x.title, owner: x.owner, notes: x.notes, completedAt: x.resolved_at }));
              h.failedHistory = dbGecmis.data.filter(x => x.status === 'failed').map(x => ({ id: x.id, title: x.title, owner: x.owner, notes: x.notes, failedAt: x.resolved_at }));
            }

            if (dbVizyon.data) {
              h.longTermVision = dbVizyon.data.map(x => ({ id: x.id, text: x.text, owner: x.owner, type: x.type }));
            }

            if (dbTasinmazlar.data) {
              k.tasinmazlar = dbTasinmazlar.data.map(t => ({
                id: t.id,
                name: t.name,
                city: t.city,
                district: t.district,
                type: t.type,
                value: Number(t.value || 0),
                income: Number(t.income || 0),
                expense: Number(t.expense || 0),
                ...(t.details || {})
              }));
            }

            if (dbBankalar.data) {
              k.bankaHesaplari = dbBankalar.data.map(b => ({
                id: b.id,
                name: b.name,
                bank: b.bank,
                iban: b.iban,
                balance: Number(b.balance || 0),
                kmh: Number(b.kmh || 0),
                owner: b.owner,
                icon: b.icon,
                ...(b.details || {})
              }));
            }

            if (dbVarliklar.data) {
              k.varliklar = dbVarliklar.data.map(v => ({
                id: v.id,
                name: v.name,
                amount: Number(v.amount || 0),
                unit: v.unit,
                price: Number(v.price || 0),
                type: v.type,
                location: v.location,
                icon: v.icon,
                ...(v.details || {})
              }));
            }

            if (dbKumbaralar.data && dbKumbaralar.data.length > 0 && k.kumbaralar.length === 0) {
              // Only if still empty (failsafe)
              k.kumbaralar = dbKumbaralar.data.map(g => ({
                id: g.id,
                name: g.name,
                target: Number(g.target || 0),
                current: Number(g.current || 0),
                deadline: g.deadline,
                icon: g.icon,
                priority: g.priority,
                category: g.category,
                type: 'money',
                ...(g.details || {})
              }));
            }

            return { finans: f, hedefler: h, kasa: k, saglik: s, mutfak: m };
          });
        } catch(e) { console.error('Faz 3 Fetch error:', e); }
      },

      fetchGroup1Data: async () => {
        try {
          const familyId = get().family_id;
          const [stok, tarifler, alisveris, sosyal, menu, havuz, rutinler, mutfakSu, paketler] = await Promise.all([
            supabase.from('mutfak_stok').select('*').eq('family_id', familyId),
            supabase.from('mutfak_tarifler').select('*').eq('family_id', familyId),
            supabase.from('alisveris_listesi').select('*').eq('family_id', familyId),
            supabase.from('sosyal_etkinlikler').select('*').eq('family_id', familyId),
            supabase.from('mutfak_menu').select('*').eq('family_id', familyId),
            supabase.from('sosyal_havuz').select('*').eq('family_id', familyId),
            supabase.from('sosyal_rutinler').select('*').eq('family_id', familyId),
            supabase.from('mutfak_su').select('*').eq('family_id', familyId).maybeSingle(),
            supabase.from('sosyal_rutin_paketleri').select('*').eq('family_id', familyId)
          ]);

          set(state => {
            const m = { ...state.mutfak };
            const s = { ...state.sosyal };
            const a = { ...state.alisveris };

            // 1. Mutfak Stok
            if (stok.data) {
              const mapStok = (list) => list.map(x => ({
                n: x.isim, 
                cr: Number(x.miktar), 
                u: x.birim || 'adet', 
                mn: Number(x.min_stok || 0),
                ic: x.emoji || '📦', 
                ct: x.reyon || 'Genel', 
                br: x.marka || '', 
                mk: x.market || '',
                pk: x.paket || '', 
                ex: x.son_kullanma || null
              }));
              m.buzdolabi = mapStok(stok.data.filter(x => x.kategori === 'buzdolabi'));
              m.kiler = mapStok(stok.data.filter(x => x.kategori === 'kiler'));
              m.dondurucu = mapStok(stok.data.filter(x => x.kategori === 'dondurucu'));
            }

            // 2. Mutfak Tarif & Menü
            if (tarifler.data) {
              m.tarifler = tarifler.data.map(t => ({
                id: t.id, n: t.isim, c: t.kategori, t: Number(t.sure), d: Number(t.zorluk),
                e: t.emoji, ig: t.malzemeler || [], f: !!t.favori, p: Number(t.puan || 20)
              }));
            }
            if (menu.data) {
              const newMenu = {};
              menu.data.forEach(item => {
                if (!newMenu[item.gun]) newMenu[item.gun] = {
                  k: '', k2: '', kdis: false, ksp: false,
                  a: '', a2: '', adis: false, asp: false
                };
                const val = item.yemek_adi;
                if (item.ogun.endsWith('dis') || item.ogun.endsWith('sp')) {
                  newMenu[item.gun][item.ogun] = val === 'true';
                } else {
                  newMenu[item.gun][item.ogun] = val;
                }
              });
              m.menu = newMenu;
            }
            if (mutfakSu.data) {
              m.su = {
                level1: mutfakSu.data.level1 ?? 100,
                level2: mutfakSu.data.level2 ?? 100,
                dailyRate: mutfakSu.data.daily_rate ?? 20,
                lastChecked: mutfakSu.data.last_checked || null,
                lastOrder: mutfakSu.data.last_order || null,
                history: mutfakSu.data.history || []
              };
            }

            // 3. Alışveriş
            if (alisveris.data) {
              const mapAl = (list) => list.map(x => ({ 
                id: x.id, 
                nm: x.isim, 
                link: x.link || '', 
                pr: Number(x.fiyat || 0), 
                dt: x.tarih || x.created_at, 
                done: !!x.alindi, 
                doneDate: x.tamamlanma_tarihi 
              }));
              
              a.gorkem = mapAl(alisveris.data.filter(x => x.liste_tipi === 'genel_gorkem' || x.liste_tipi === 'gorkem'));
              a.esra = mapAl(alisveris.data.filter(x => x.liste_tipi === 'genel_esra' || x.liste_tipi === 'esra'));
              a.ev = mapAl(alisveris.data.filter(x => x.liste_tipi === 'genel_ev' || x.liste_tipi === 'ev'));
              a.wishlist = mapAl(alisveris.data.filter(x => x.liste_tipi === 'wishlist'));
              m.alisveris = mapAl(alisveris.data.filter(x => x.liste_tipi === 'mutfak'));
            }

            // 4. Sosyal
            if (sosyal.data) {
              s.aktiviteler = sosyal.data.map(x => ({
                id: x.id, baslik: x.baslik, tarih: x.tarih, saat: x.saat, emoji: x.emoji, tur: x.tur,
                harcama: Number(x.harcama), kisiSayisi: Number(x.kisi_sayisi),
                puan_gorkem: Number(x.puan_gorkem || 0), puan_esra: Number(x.puan_esra || 0),
                yorum_gorkem: x.yorum_gorkem || '', yorum_esra: x.yorum_esra || '',
                detaylar: x.detaylar || '', tamamlandi: x.durum === 'tamamlandi', durum: x.durum || 'planda'
              }));
            }
            if (havuz.data) {
              s.havuz = havuz.data.map(h => ({ id: h.id, baslik: h.baslik, tur: h.tur, emoji: h.emoji, count: Number(h.count || 0), freq: h.freq, last: h.last_done }));
            }
            if (rutinler.data) {
              s.rutinler = rutinler.data.map(r => ({ id: r.id, aktivite: r.aktivite, kisi: r.kisi, vakit: r.vakit, gunler: r.gunler || [], saati: r.saati, ucret: Number(r.ucret || 0) }));
            }
            if (paketler.data && paketler.data.length > 0) {
              const remotePkgs = paketler.data.map(p => ({
                id: p.id, name: p.name, items: p.items || [], cost: p.cost, icon: p.icon
              }));
              const allPkgs = [...remotePkgs, ...(s.routinePackages || [])];
              s.routinePackages = [...new Map(allPkgs.map(item => [item.id, item])).values()];
            }

            return { mutfak: m, sosyal: s, alisveris: a };
          });
        } catch (error) {
          console.error("❌ fetchGroup1Data error:", error);
        }
      },

      recoverFromLocalStorage: async () => {
        const loadId = toast.loading('Tarayıcı hafızası taranıyor (Derin Tarama)...');
        try {
          let foundData = null;
          // LocalStorage'daki tüm anahtarları tara
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
              const val = localStorage.getItem(key);
              if (val && (val.includes('"mutfak"') || val.includes('"sosyal"'))) {
                const parsed = JSON.parse(val);
                const state = parsed.state || parsed;
                if (state.mutfak?.buzdolabi?.length > 0 || state.sosyal?.aktiviteler?.length > 0) {
                  foundData = state;
                  console.log('Bulunan Yedek Anahtarı:', key);
                  break;
                }
              }
            } catch(e) {}
          }

          if (!foundData) {
            toast.dismiss(loadId);
            toast.error('Maalesef tarayıcı hafızasında da eski bir iz bulunamadı. 😔');
            return;
          }

          const updates = {};
          if (foundData.mutfak) updates.mutfak = foundData.mutfak;
          if (foundData.sosyal) updates.sosyal = foundData.sosyal;
          if (foundData.alisveris) updates.alisveris = foundData.alisveris;

          set(updates);
          toast.dismiss(loadId);
          toast.success('BÜYÜK BAŞARI! Tarayıcı hafızasından veriler kurtarıldı. 🎉 Şimdi migrasyonu yapabilirsiniz.');
          await get().runGroup1Migration();
        } catch(e) {
          toast.dismiss(loadId);
          toast.error('Yerel kurtarma hatası: ' + e.message);
        }
      },

      subscribed: false,
      subscribeToSupabase: () => {
        if (get().subscribed) return;

        // Benzersiz bir kanal adı kullanalım (InitSync hatasını önlemek için)
        const channelName = `store-sync-${Math.random().toString(36).substring(7)}`;
        
        const channel = supabase.channel(channelName);
        
        channel
          .on('postgres_changes', { event: '*', schema: 'public' },
            (payload) => {
              const state = get();
              const table = payload.table;

              // 1. Monolitik JSON Güncellemesi
              if (table === 'eraylar_store' && payload.eventType === 'UPDATE') {
                const newData = payload.new?.data;
                if (!newData) return;
                if (state.isSaving) return;
                if (newData.system?.lastUpdatedBy === state.system.clientId) return;
                
                // Faz 4 sonrası JSON'da finans ve hedefler olmadığı için güvenle merge yapabiliriz.
                set({ ...newData });
              }

              // 2. Faz 3 SQL Tabloları Güncellemesi
              const phase3Tables = [
                'finans_kartlar', 'finans_krediler', 'finans_onay_havuzu', 
                'hedefler_aktif', 'hedefler_gecmis', 'hedefler_vizyon'
              ];
              if (phase3Tables.includes(table)) {
                console.log(`🔄 [Realtime] ${table} değişti, veriler eşitleniyor...`);
                get().fetchPhase3Data();
              }

              // 3. Grup 1 Tabloları Güncellemesi
              const group1Tables = [
                'mutfak_stok', 'mutfak_tarifler', 'alisveris_listesi', 'sosyal_etkinlikler'
              ];
              if (group1Tables.includes(table)) {
                console.log(`🔄 [Realtime] ${table} değişti, Grup 1 verileri eşitleniyor...`);
                get().fetchGroup1Data();
              }

              // 4. Harcamalar Güncellemesi
              if (table === 'finans_harcamalar') {
                console.log(`🔄 [Realtime] Harcamalar değişti, bakiye güncelleniyor...`);
                get().getBuAyHarcamalar();
              }

              // 5. Grup 2 Tabloları Güncellemesi
              const group2Tables = [
                'ev_duzenli_odemeler', 'ev_abonelikler', 'ev_onarim', 'ev_demirbaslar', 'ev_bakimlar',
                'garaj_yakit', 'garaj_bakim', 'garaj_belgeler',
                'pet_asilar', 'pet_agirlik',
                'saglik_randevular', 'saglik_ilaclar', 'saglik_olcumler', 'saglik_logs', 'saglik_moods'
              ];
              if (group2Tables.includes(table)) {
                console.log(`🔄 [Realtime] ${table} değişti, Grup 2 verileri eşitleniyor...`);
                get().fetchGroup2Data();
              }

              // 6. Grup 3 Tabloları Güncellemesi
              const group3Tables = [
                'tatil_trips', 'tatil_photos', 'tatil_visited',
                'muhendislik_problems', 'muhendislik_decisions', 'muhendislik_crm_customers', 'muhendislik_crm_deals', 'muhendislik_proceler',
                'modaring_personel', 'modaring_vardiya', 'modaring_kasa', 'modaring_bankalar', 'modaring_tedarik', 'modaring_siparisler', 'modaring_ajanda', 'modaring_refika'
              ];
              if (group3Tables.includes(table)) {
                console.log(`🔄 [Realtime] ${table} değişti, Grup 3 verileri eşitleniyor...`);
                get().fetchGroup3Data();
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              set({ subscribed: true });
            }
          });

        return () => supabase.removeChannel(channel);
      },

      saveToSupabase: async (immediate = false) => {
        // [2. Milat - 2. Ayak: Büyük Temizlik]
        // Monolitik JSON kaydı devre dışı bırakıldı. Artık her veri kendi SQL tablosuna mühürleniyor.
        // Bu fonksiyon artık emekliye ayrıldı.
        return;
      },

      // KRİTİK: Beklemeden, hemen buluta bas (Silme gibi işlemler için)
      forceSaveToSupabase: async () => {
        // [2. Milat - 2. Ayak: Büyük Temizlik]
        // Monolitik JSON kaydı (zorunlu) devre dışı bırakıldı.
        return;
      },

      // ── Eraylar Finans Actions ───────────────────────────
      updateFinansData: async (key, data) => {
        const state = get();
        set({ finans: { ...state.finans, [key]: data } });
        
        // 🏛️ 2. MİLAT: SQL Senkronizasyonu
        if (key === 'kartlar') syncFinansKartlar(data);
        if (key === 'borclar') syncFinansKrediler(data);
        if (key === 'approvalPool') syncFinansOnayHavuzu(data);
        if (key === 'limits') await pushFinansAyarlarToSupabase(data);
        if (key === 'rekurans') {
          // Rekurans bir dizi ise her birini upsert et (veya dizi olarak sakla)
          if (Array.isArray(data)) {
            for (const r of data) await pushFinansRekuransToSupabase(r);
          }
        }
        

      },

      deleteFinansKart: (id) => {
        const state = get();
        const updated = (state.finans.kartlar || []).filter(k => String(k.id) !== String(id));
        set({ finans: { ...state.finans, kartlar: updated } });

        deleteFinansKartFromSupabase(id);
      },

      deleteFinansKredi: (id) => {
        const state = get();
        const updated = (state.finans.borclar || []).filter(b => String(b.id) !== String(id));
        set({ finans: { ...state.finans, borclar: updated } });

        deleteFinansKrediFromSupabase(id);
      },
      addExpense: (expense) => {
        const state = get();
        
        // Find default payment method
        let defaultPay = '';
        const recurring = [
          ...(state.ev?.abonelikler || []),
          ...(state.ev?.duzenliOdemeler || [])
        ].find(r => r.name?.toLowerCase() === expense.title?.toLowerCase());

        if (recurring?.linkedCardId) {
          defaultPay = `kart|${recurring.linkedCardId}`;
        } else {
          const history = state.finans?.buAyHarcamalar || [];
          const lastMatch = history.find(h => h.baslik?.toLowerCase() === expense.title?.toLowerCase());
          if (lastMatch) {
            if (lastMatch.kart_id) defaultPay = `kart|${lastMatch.kart_id}`;
            else if (lastMatch.banka_id) defaultPay = `havale|${lastMatch.banka_id}`;
            else defaultPay = 'nakit';
          }
        }

        const newPoolItem = {
          id: Date.now(),
          dt: new Date().toISOString().split('T')[0],
          confirmed: false,
          defaultPay,
          ...expense
        };
        const newPool = [newPoolItem, ...(state.finans.approvalPool || [])];
        set({ finans: { ...state.finans, approvalPool: newPool } });
        syncFinansOnayHavuzu(newPool); // Gölge Yazım

      },

      approveExpense: (poolId) => {
        const state = get();
        const item = state.finans.approvalPool.find(i => i.id === poolId);
        if (!item) return;

        const newHarcama = { ...item, confirmed: true };
        const updatedPool = state.finans.approvalPool.filter(i => i.id !== poolId);
        const updatedHarcamalar = [newHarcama, ...state.finans.harcamalar].slice(0, 500);

        // Update Balance if not card
        const yeniBakiyeler = { ...state.kasa.bakiyeler };
        const payerKey = (item.payer || 'ortak').toLowerCase();
        
        let updatedBankaHesaplari = [...(state.kasa.bankaHesaplari || [])];

        if (item.odenme_turu === 'havale' && item.banka_id) {
          // Banka Havalesi: Seçilen bankadan düş
          updatedBankaHesaplari = updatedBankaHesaplari.map(b => 
            b.id === item.banka_id ? { ...b, balance: b.balance - Number(item.amount || item.tutar) } : b
          );
        } else if (yeniBakiyeler[payerKey] !== undefined && !item.cardId && !item.kart_id) {
          // Nakit: Kasadan düş
          yeniBakiyeler[payerKey] -= Number(item.amount || item.tutar);
        }

        set({
          finans: { ...state.finans, harcamalar: updatedHarcamalar, approvalPool: updatedPool },
          kasa: { ...state.kasa, bakiyeler: yeniBakiyeler, bankaHesaplari: updatedBankaHesaplari }
        });
        get().addLog('Harcama Onaylandı', `${item.payer || item.kayit_eden}: ${item.amount || item.tutar}₺ - ${item.title || item.baslik}`);

        toast.success('Harcama onaylandı! ✅');
      },

      // ── Finans v2.0 Aksiyonları ──────────────────────────

      // Doğrudan Supabase'e yazar (hızlı ödeme + rekurans işleme için)
      addHarcama: async (data) => {
        const state = get();
        const baslik = data.baslik || data.title || 'Harcama';
        const tutar = Number(data.tutar || data.amount || 0);
        const tarih = data.tarih || new Date().toISOString().split('T')[0];

        // Mükerrer Kontrolü (Aynı gün, aynı başlık, aynı tutar)
        const isDuplicate = (state.finans.buAyHarcamalar || []).some(
          h => h.baslik.toLowerCase().trim() === baslik.toLowerCase().trim() && 
               Number(h.tutar) === tutar && 
               h.tarih === tarih
        );

        if (isDuplicate) {
          toast.error('Bu harcama zaten kayıtlı! ⚠️ (Aynı başlık, tutar ve tarih)');
          return null;
        }

        const buAy = new Date().toISOString().slice(0, 7);
        const rawBankaId = data.banka_id || null;
        const finalBankaId = (rawBankaId && !String(rawBankaId).includes(DEFAULT_FID)) 
          ? `${rawBankaId}-${DEFAULT_FID}` 
          : rawBankaId;

        const harcama = {
          tarih: data.tarih || new Date().toISOString().split('T')[0],
          baslik: data.baslik || data.title || 'Harcama',
          tutar: Number(data.tutar || data.amount || 0),
          kategori: data.kategori || data.category || 'Diğer',
          kart_id: data.kart_id || data.kartId || null,
          banka_id: finalBankaId, // Havale yapılacak banka
          odenme_turu: data.odenme_turu || (data.kart_id ? 'kart' : (finalBankaId ? 'havale' : 'nakit')),
          kayit_eden: data.kayit_eden || state.currentUser?.name || 'Sistem',
          kaynak: data.kaynak || data.source || 'Manuel',
          notlar: data.notlar || null,
          ay: buAy, // Ensure ay is in the object
        };

        // Supabase'e yaz ve gerçek ID'yi al
        const savedItem = await pushHarcamaToSupabase(harcama, state.family_id);
        
        // Eğer savedItem dönmediyse (RLS veya hata), local ID ile devam et ama uyar
        const finalItem = savedItem || { ...harcama, id: generateUniqueId(), ay: buAy };

        // UI cache'ini güncelle (Gerçek ID ile)
        const yeniBuAy = [
          finalItem, 
          ...state.finans.buAyHarcamalar
        ];

        // Kart beklenen borcunu güncelle
        let yeniMutabakat = { ...state.finans.kartMutabakat };
        if (harcama.kart_id) {
          const current = yeniMutabakat[harcama.kart_id] || { beklenen: 0, gercek: null, ay: buAy };
          yeniMutabakat[harcama.kart_id] = {
            ...current,
            beklenen: (current.beklenen || 0) + harcama.tutar,
            ay: buAy
    };
          // Supabase'deki mutabakat kaydını güncelle
          upsertKartMutabakat(
            harcama.kart_id,
            buAy,
            yeniMutabakat[harcama.kart_id].beklenen,
            yeniMutabakat[harcama.kart_id].gercek,
            state.family_id
          );
        }

        // Kasa/Banka bakiyelerini güncelle
        let yeniBakiyeler = { ...state.kasa.bakiyeler };
        let yeniBankaHesaplari = [...(state.kasa.bankaHesaplari || [])];

        if (harcama.odenme_turu === 'havale' && harcama.banka_id) {
          yeniBankaHesaplari = yeniBankaHesaplari.map(b => 
            b.id === harcama.banka_id ? { ...b, balance: b.balance - harcama.tutar } : b
          );
        } else if (harcama.odenme_turu === 'nakit') {
          const payerKey = (state.currentUser?.name || 'ortak').toLowerCase();
          if (yeniBakiyeler[payerKey] !== undefined) {
            yeniBakiyeler[payerKey] -= harcama.tutar;
            pushKasaBakiyelerToSupabase(yeniBakiyeler);
          }
        }

        set({
          finans: {
            ...state.finans,
            buAyHarcamalar: yeniBuAy,
            kartMutabakat: yeniMutabakat
    },
          kasa: {
            ...state.kasa,
            bakiyeler: yeniBakiyeler,
            bankaHesaplari: yeniBankaHesaplari
          }
        });

      },

      // Onay havuzundan alıp Supabase'e yazar
      onaylaHarcama: async (poolId, updates = {}) => {
        const state = get();
        const item = state.finans.approvalPool.find(i => i.id === poolId);
        if (!item) return;

        // updates can contain: kart_id, banka_id, odenme_turu
        await get().addHarcama({
          ...item,
          ...updates,
          kaynak: item.source || 'Onay Havuzu'
    });

        const updatedPool = state.finans.approvalPool.filter(i => i.id !== poolId);
        set({ finans: { ...get().finans, approvalPool: updatedPool } });
        syncFinansOnayHavuzu(updatedPool);
        supabase.from('finans_onay_havuzu').delete().eq('id', String(poolId)).then();
        get().addLog('Harcama Onaylandı (v2)', `${item.title}: ${item.amount}₺`);

        toast.success('Harcama onaylandı ve kaydedildi! ✅');
      },

      // Onay havuzundan siler
      reddetHarcama: (poolId) => {
        const state = get();
        const updatedPool = state.finans.approvalPool.filter(i => i.id !== poolId);
        set({ finans: { ...state.finans, approvalPool: updatedPool } });
        syncFinansOnayHavuzu(updatedPool); // Gölge Yazım
        supabase.from('finans_onay_havuzu').delete().eq('id', String(poolId)).then();

        toast.success('Harcama reddedildi.');
      },

      deleteHarcama: async (id) => {
        try {
          const state = get();
          const list = state.finans.buAyHarcamalar || [];
          const item = list.find(h => h.id === id);
          
          // Önce Supabase'den sil (Aggressive fallback ile)
          await deleteHarcamaFromSupabase(id, state.family_id, item);
          
          // Yerel state'i güncelle (Ultra-Geniş Filtreleme)
          // Sadece ID ile değil, eğer ghost kayıtsa aynı özelliklere sahip her şeyi yerel listeden çıkaralım
          const updatedHarcamalar = list.filter(h => {
            if (h.id === id) return false;
            if (item && h.baslik === item.baslik && Number(h.tutar) === Number(item.tutar) && h.tarih === item.tarih) return false;
            return true;
          });

          let yeniMutabakat = { ...state.finans.kartMutabakat };
          if (item && item.kart_id && yeniMutabakat[item.kart_id]) {
            const buAy = new Date().toISOString().slice(0, 7);
            const current = yeniMutabakat[item.kart_id];
            yeniMutabakat[item.kart_id] = {
              ...current,
              beklenen: Math.max(0, (Number(current.beklenen) || 0) - Number(item.tutar))
            };
            upsertKartMutabakat(item.kart_id, buAy, yeniMutabakat[item.kart_id].beklenen, current.gercek, current.guncel, state.family_id);
          }
          
          let yeniBakiyeler = { ...state.kasa.bakiyeler };
          let yeniBankaHesaplari = [...(state.kasa.bankaHesaplari || [])];

          if (item && item.odenme_turu === 'havale' && item.banka_id) {
             // Havaleyi geri yükle
             yeniBankaHesaplari = yeniBankaHesaplari.map(b => 
               b.id === item.banka_id ? { ...b, balance: b.balance + Number(item.tutar) } : b
             );
          } else if (item && item.odenme_turu === 'nakit') {
             // Nakiti geri yükle
             const payerKey = (item.kayit_eden || '').toLowerCase();
             if (yeniBakiyeler[payerKey] !== undefined) {
               yeniBakiyeler[payerKey] += Number(item.tutar);
               pushKasaBakiyelerToSupabase(yeniBakiyeler);
             }
          }
          
          set({ 
            finans: { ...state.finans, buAyHarcamalar: updatedHarcamalar, kartMutabakat: yeniMutabakat },
            kasa: { ...state.kasa, bakiyeler: yeniBakiyeler, bankaHesaplari: yeniBankaHesaplari }
          });
          toast.success('Harcama silindi.');
          
          // Beklemeden hemen bulutu güncelle (Hayalet kayıtları engellemek için)

        } catch (err) {
          console.error('❌ Harcama silme hatası:', err);
          toast.error('Silme işlemi başarısız.');
        }
      },

      updateHarcama: async (id, updates) => {
        try {
          const state = get();
          const oldItem = state.finans.buAyHarcamalar.find(h => h.id === id);
          if (!oldItem) return;

          // Normalize banka_id suffix
          const cleanUpdates = { ...updates };
          if (cleanUpdates.banka_id && !String(cleanUpdates.banka_id).includes(DEFAULT_FID)) {
            cleanUpdates.banka_id = `${cleanUpdates.banka_id}-${DEFAULT_FID}`;
          }

          await updateHarcamaInSupabase(id, cleanUpdates);
          
          const updatedHarcamalar = (state.finans.buAyHarcamalar || []).map(h => 
            h.id === id ? { ...h, ...cleanUpdates } : h
          );
          
          const buAy = new Date().toISOString().slice(0, 7);
          let yeniMutabakat = { ...state.finans.kartMutabakat };
          let yeniBakiyeler = { ...state.kasa.bakiyeler };
          let yeniBankaHesaplari = [...(state.kasa.bankaHesaplari || [])];

          // 1. ESKİ DURUMU GERİ AL (REVERT)
          if (oldItem.odenme_turu === 'kart' && oldItem.kart_id && yeniMutabakat[oldItem.kart_id]) {
            yeniMutabakat[oldItem.kart_id].beklenen = Math.max(0, (yeniMutabakat[oldItem.kart_id].beklenen || 0) - Number(oldItem.tutar));
          } else if (oldItem.odenme_turu === 'havale' && oldItem.banka_id) {
            yeniBankaHesaplari = yeniBankaHesaplari.map(b => 
              b.id === oldItem.banka_id ? { ...b, balance: b.balance + Number(oldItem.tutar) } : b
            );
          } else if (oldItem.odenme_turu === 'nakit') {
            const payerKey = (oldItem.kayit_eden || 'ortak').toLowerCase();
            if (yeniBakiyeler[payerKey] !== undefined) {
              yeniBakiyeler[payerKey] += Number(oldItem.tutar);
            }
          }

          // 2. YENİ DURUMU UYGULA (APPLY)
          const newItem = { ...oldItem, ...cleanUpdates };
          const newTutar = Number(newItem.tutar);

          if (newItem.odenme_turu === 'kart' && newItem.kart_id) {
            if (!yeniMutabakat[newItem.kart_id]) {
              yeniMutabakat[newItem.kart_id] = { beklenen: 0, gercek: null, guncel: null, ay: buAy };
            }
            yeniMutabakat[newItem.kart_id].beklenen = (yeniMutabakat[newItem.kart_id].beklenen || 0) + newTutar;
          } else if (newItem.odenme_turu === 'havale' && newItem.banka_id) {
            yeniBankaHesaplari = yeniBankaHesaplari.map(b => 
              b.id === newItem.banka_id ? { ...b, balance: b.balance - newTutar } : b
            );
          } else if (newItem.odenme_turu === 'nakit') {
            const payerKey = (newItem.kayit_eden || 'ortak').toLowerCase();
            if (yeniBakiyeler[payerKey] !== undefined) {
              yeniBakiyeler[payerKey] -= newTutar;
            }
          }

          // Supabase mutabakatlarını güncelle (etkilenen kartlar için)
          if (oldItem.kart_id && oldItem.odenme_turu === 'kart') {
             upsertKartMutabakat(oldItem.kart_id, buAy, yeniMutabakat[oldItem.kart_id].beklenen, yeniMutabakat[oldItem.kart_id].gercek, yeniMutabakat[oldItem.kart_id].guncel, state.family_id);
          }
          if (newItem.kart_id && newItem.odenme_turu === 'kart' && newItem.kart_id !== oldItem?.kart_id) {
             upsertKartMutabakat(newItem.kart_id, buAy, yeniMutabakat[newItem.kart_id].beklenen, yeniMutabakat[newItem.kart_id].gercek, yeniMutabakat[newItem.kart_id].guncel, state.family_id);
          }

          set({ 
            finans: { ...state.finans, buAyHarcamalar: updatedHarcamalar, kartMutabakat: yeniMutabakat },
            kasa: { ...state.kasa, bakiyeler: yeniBakiyeler, bankaHesaplari: yeniBankaHesaplari }
          });
          
          toast.success('Harcama güncellendi.');

        } catch (err) {
          console.error('❌ updateHarcama error:', err);
          toast.error('Güncelleme işlemi başarısız.');
        }
      },

      // Banka ekstresinden gerçek borcu girer
      gercekKartBorcuGir: async (kartId, ekstre, guncel, ay) => {
        const state = get();
        const hedefAy = ay || new Date().toISOString().slice(0, 7);
        const ekstreNum = Number(ekstre) || 0;
        const guncelNum = Number(guncel) || 0;
        const beklenen = state.finans.kartMutabakat[kartId]?.beklenen || 0;

        await upsertKartMutabakat(kartId, hedefAy, beklenen, ekstreNum, guncelNum, state.family_id);

        const yeniMutabakat = {
          ...state.finans.kartMutabakat,
          [kartId]: {
            ...state.finans.kartMutabakat[kartId],
            gercek: ekstreNum,
            guncel: guncelNum,
            ay: hedefAy,
            paid: false,
            paymentType: null,
            paidAmount: 0
          }
        };
        set({ finans: { ...state.finans, kartMutabakat: yeniMutabakat } });

        toast.success('Hesap özeti ve güncel borç başarıyla kaydedildi! 💳');
      },

      // Kredi kartı borcunu öder
      payCreditCard: async (kartId, amount, paymentType, source) => {
        const state = get();
        const buAy = new Date().toISOString().slice(0, 7);
        const amountNum = Number(amount);

        // 1. Ödeme Kaynağından Düş
        let yeniBakiyeler = { ...state.kasa.bakiyeler };
        let yeniBankaHesaplari = [...(state.kasa.bankaHesaplari || [])];

        const { type, id } = source;

        if (type === 'havale' && id) {
          yeniBankaHesaplari = yeniBankaHesaplari.map(b =>
            b.id === id ? { ...b, balance: b.balance - amountNum } : b
          );
        } else {
          const payerKey = (state.currentUser?.name || 'ortak').toLowerCase();
          if (yeniBakiyeler[payerKey] !== undefined) {
            yeniBakiyeler[payerKey] -= amountNum;
          }
        }

        // 2. Kart Mutabakatını Güncelle (Dynamic decrement of unpaid statement and total outstanding debt)
        const currentMut = state.finans.kartMutabakat[kartId] || { beklenen: 0, gercek: 0, guncel: 0, ay: buAy };
        
        // Calculate new remaining balances
        const oldGercek = currentMut.gercek !== null ? Number(currentMut.gercek) : (state.finans.buAyHarcamalar?.filter(h => h.odenme_turu === 'kart' && h.kart_id === kartId).reduce((sum, h) => sum + Number(h.tutar), 0) || 0);
        const oldGuncel = currentMut.guncel !== null ? Number(currentMut.guncel) : oldGercek;

        const newGercek = Math.max(0, oldGercek - amountNum);
        const newGuncel = Math.max(0, oldGuncel - amountNum);
        const isFullyPaid = newGercek <= 0;

        const yeniMutabakat = {
          ...state.finans.kartMutabakat,
          [kartId]: {
            ...currentMut,
            paid: isFullyPaid,
            paymentType,
            paidAmount: (currentMut.paidAmount || 0) + amountNum,
            gercek: newGercek,
            guncel: newGuncel,
            sourceType: type,
            sourceId: id,
            ay: buAy
          }
        };

        // 3. Ödeme geçmişine kayıt ekle
        const odemeId = `odeme-${kartId}-${Date.now()}`;
        const odemeKaydi = {
          id: odemeId,
          kart_id: kartId,
          ay: buAy,
          tutar: amountNum,
          turu: paymentType, // 'full' | 'min' | 'kismi'
          kaynak: type,
          banka_id: (type === 'havale') ? id : null,
          tarih: new Date().toISOString().split('T')[0],
          ekleyen: state.currentUser?.name || null
        };
        await pushKartOdeme(odemeKaydi, state.family_id);

        // 4. Mutabakat SQL
        await upsertKartMutabakat(kartId, buAy, currentMut.beklenen, newGercek, newGuncel, state.family_id);

        const kartName = state.finans.kartlar.find(k => k.id === kartId)?.name || kartId;

        set({
          kasa: { ...state.kasa, bakiyeler: yeniBakiyeler, bankaHesaplari: yeniBankaHesaplari },
          finans: {
            ...state.finans,
            kartMutabakat: yeniMutabakat,
            kartOdemeleri: [odemeKaydi, ...(state.finans.kartOdemeleri || [])]
          }
        });

        get().addLog('Kart Ödemesi', `${kartName} için ${amountNum}₺ ödeme yapıldı (${paymentType === 'full' ? 'Tam' : paymentType === 'min' ? 'Asgari' : 'Kısmi'}).`);
        toast.success(`${kartName} ödemesi kaydedildi! 🎉`);
      },

      getKartOdemeleri: async () => {
        const familyId = get().family_id;
        const data = await fetchKartOdemeler(familyId);
        set(s => ({ finans: { ...s.finans, kartOdemeleri: data } }));
      },

      deleteKartOdemesi: async (id) => {
        const state = get();
        const odeme = state.finans.kartOdemeleri?.find(o => o.id === id);
        if (!odeme) return;

        const amountNum = Number(odeme.tutar);
        const kartId = odeme.kart_id;
        const type = odeme.kaynak;
        const banka_id = odeme.banka_id;

        let yeniBakiyeler = { ...state.kasa.bakiyeler };
        let yeniBankaHesaplari = [...(state.kasa.bankaHesaplari || [])];

        if (type === 'havale' && banka_id) {
          yeniBankaHesaplari = yeniBankaHesaplari.map(b =>
            b.id === banka_id ? { ...b, balance: b.balance + amountNum } : b
          );
        } else {
          const payerKey = (state.currentUser?.name || 'ortak').toLowerCase();
          if (yeniBakiyeler[payerKey] !== undefined) {
            yeniBakiyeler[payerKey] += amountNum;
          }
        }

        const currentMut = state.finans.kartMutabakat[kartId];
        let yeniMutabakat = state.finans.kartMutabakat;
        if (currentMut && currentMut.ay === odeme.ay) {
           const oldGercek = Number(currentMut.gercek || 0);
           const oldGuncel = Number(currentMut.guncel || 0);
           const newGercek = oldGercek + amountNum;
           const newGuncel = oldGuncel + amountNum;
           yeniMutabakat = {
             ...state.finans.kartMutabakat,
             [kartId]: {
               ...currentMut,
               paid: false,
               paidAmount: Math.max(0, (currentMut.paidAmount || 0) - amountNum),
               gercek: newGercek,
               guncel: newGuncel
             }
           };
           await upsertKartMutabakat(kartId, odeme.ay, currentMut.beklenen, newGercek, newGuncel, state.family_id);
        }

        await deleteKartOdemeFromSupabase(id);

        set(s => ({
          kasa: { ...s.kasa, bakiyeler: yeniBakiyeler, bankaHesaplari: yeniBankaHesaplari },
          finans: {
            ...s.finans,
            kartMutabakat: yeniMutabakat,
            kartOdemeleri: s.finans.kartOdemeleri.filter(o => o.id !== id)
          }
        }));

        get().addLog('Kart Ödemesi İptali', `${amountNum}₺ ödeme silindi ve iade edildi.`);
        toast.success('Ödeme kaydı silindi ve bakiye iade edildi.');
      },

      updateKartOdemesi: async (id, updates) => {
        const state = get();
        const odeme = state.finans.kartOdemeleri?.find(o => o.id === id);
        if (!odeme) return;

        const oldAmount = Number(odeme.tutar);
        const newAmount = updates.tutar !== undefined ? Number(updates.tutar) : oldAmount;
        
        const oldType = odeme.kaynak;
        const newType = updates.kaynak || oldType;
        
        const oldBankaId = odeme.banka_id;
        const newBankaId = updates.banka_id !== undefined ? updates.banka_id : oldBankaId;

        const kartId = odeme.kart_id;
        
        let yeniBakiyeler = { ...state.kasa.bakiyeler };
        let yeniBankaHesaplari = [...(state.kasa.bankaHesaplari || [])];
        const payerKey = (state.currentUser?.name || 'ortak').toLowerCase();

        // 1. İade Et (Eski kaynağa parayı geri yükle)
        if (oldType === 'havale' && oldBankaId) {
          yeniBankaHesaplari = yeniBankaHesaplari.map(b => b.id === oldBankaId ? { ...b, balance: b.balance + oldAmount } : b);
        } else {
          if (yeniBakiyeler[payerKey] !== undefined) yeniBakiyeler[payerKey] += oldAmount;
        }

        // 2. Yeni Tutarı Düş (Yeni kaynaktan)
        if (newType === 'havale' && newBankaId) {
          yeniBankaHesaplari = yeniBankaHesaplari.map(b => b.id === newBankaId ? { ...b, balance: b.balance - newAmount } : b);
        } else {
          if (yeniBakiyeler[payerKey] !== undefined) yeniBakiyeler[payerKey] -= newAmount;
        }

        // 3. Mutabakatı Güncelle
        const amountDiff = newAmount - oldAmount;
        const currentMut = state.finans.kartMutabakat[kartId];
        let yeniMutabakat = state.finans.kartMutabakat;
        
        if (currentMut && currentMut.ay === odeme.ay) {
           const oldGercek = Number(currentMut.gercek || 0);
           const oldGuncel = Number(currentMut.guncel || 0);
           const newGercek = Math.max(0, oldGercek - amountDiff);
           const newGuncel = Math.max(0, oldGuncel - amountDiff);
           
           yeniMutabakat = {
             ...state.finans.kartMutabakat,
             [kartId]: {
               ...currentMut,
               paidAmount: Math.max(0, (currentMut.paidAmount || 0) + amountDiff),
               gercek: newGercek,
               guncel: newGuncel,
               paid: newGercek <= 0
             }
           };
           await upsertKartMutabakat(kartId, odeme.ay, currentMut.beklenen, newGercek, newGuncel, state.family_id);
        }

        const updatedOdeme = { ...odeme, ...updates };

        await updateKartOdemeInSupabase(id, updates);

        set(s => ({
          kasa: { ...s.kasa, bakiyeler: yeniBakiyeler, bankaHesaplari: yeniBankaHesaplari },
          finans: {
            ...s.finans,
            kartMutabakat: yeniMutabakat,
            kartOdemeleri: s.finans.kartOdemeleri.map(o => o.id === id ? updatedOdeme : o)
          }
        }));

        toast.success('Ödeme kaydı güncellendi.');
      },

      fetchTaksitler: async () => {
        const familyId = get().family_id;
        const data = await fetchTaksitler(familyId);
        set(s => ({ finans: { ...s.finans, taksitler: data || [] } }));
      },

      addTaksit: async (taksit) => {
        const state = get();
        await pushTaksitToSupabase(taksit, state.family_id);
        await get().fetchTaksitler();
        toast.success('Taksit başarıyla eklendi! 🗓️');
      },

      deleteTaksit: async (id) => {
        const state = get();
        await deleteTaksitFromSupabase(id);
        await get().fetchTaksitler();
        toast.success('Taksit planı silindi.');
      },

      // Bu ayın harcamalarını Supabase'den çeker
      getBuAyHarcamalar: async () => {
        const state = get();
        const data = await fetchBuAyHarcamalar(state.family_id);

        const buAy = new Date().toISOString().slice(0, 7);
        
        set(state => {
          // Kart mutabakatını kartlar dizisine göre tazeleyerek oluştur (Stale ID'lerden kurtul)
          const yeniMutabakat = {};
          (state.finans.kartlar || []).forEach(k => {
            const current = state.finans.kartMutabakat?.[k.id] || {};
            yeniMutabakat[k.id] = { ...current, beklenen: 0, ay: buAy };
          });

          data.forEach(h => {
            if (h.kart_id) {
              if (!yeniMutabakat[h.kart_id]) {
                yeniMutabakat[h.kart_id] = { beklenen: 0, gercek: null, ay: buAy };
              }
              yeniMutabakat[h.kart_id].beklenen += Number(h.tutar);
            }
          });

          return { 
            finans: { 
              ...state.finans, 
              buAyHarcamalar: data, 
              kartMutabakat: yeniMutabakat 
            } 
          };
        });
      },

      // Geçmiş bir ayın harcamalarını Supabase'den çeker (lazy)
      getGecmisAy: async (ay) => {
        const state = get();
        return await fetchGecmisAyFromSupabase(ay, state.family_id);
      },

      // Geçmiş arşivi çeker
      getFinansArsiv: async (limit = 12) => {
        const state = get();
        return await fetchArsivFromSupabase(state.family_id, limit);
      },

      // Ayı kapatır: özet oluşturur ve finans_arsiv'e yazar
      ayKapat: async (ay, isAuto = false) => {
        const hedefAy = ay || new Date().toISOString().slice(0, 7);
        const state = get();
        const harcamalar = await fetchGecmisAyFromSupabase(hedefAy, state.family_id);

        if (harcamalar.length === 0) {
          if (!isAuto) toast.error('Bu ay için harcama kaydı bulunamadı.');
          // Otomatik kapanışta sürekli tetiklenmemesi için 0 kayıtlı bir arşiv atıyoruz
          await upsertArsiv(hedefAy, {}, state.family_id);
          return;
        }

        const toplamHarcama = harcamalar.reduce((s, h) => s + Number(h.tutar), 0);
        const toplamKart = harcamalar.filter(h => h.odenme_turu === 'kart').reduce((s, h) => s + Number(h.tutar), 0);
        const toplamNakit = harcamalar.filter(h => h.odenme_turu === 'nakit').reduce((s, h) => s + Number(h.tutar), 0);

        // Kategori dağılımı
        const kategoriOzet = {};
        harcamalar.forEach(h => {
          kategoriOzet[h.kategori] = (kategoriOzet[h.kategori] || 0) + Number(h.tutar);
        });

        // Kart dağılımı
        const kartOzet = {};
        harcamalar.forEach(h => {
          if (h.kart_id) {
            kartOzet[h.kart_id] = (kartOzet[h.kart_id] || 0) + Number(h.tutar);
          }
        });

        await upsertArsiv(hedefAy, {}, state.family_id);

        toast.success(`${hedefAy} ayı başarıyla kapatıldı! 📦`);
      },

      // Otomatik ay kapanışı kontrolü (App.jsx tarafından çağrılır)
      checkAutoKapanis: async () => {
        const d = new Date();
        // Bir önceki ayı bul
        d.setMonth(d.getMonth() - 1);
        const oncekiAy = d.toISOString().slice(0, 7);

        const arsivler = await get().getFinansArsiv(5);
        const zatenKapatilmis = arsivler.some(a => a.ay === oncekiAy);

        if (!zatenKapatilmis) {
          console.log(`🔄 Otomatik kapanış tetikleniyor: ${oncekiAy}`);
          await get().ayKapat(oncekiAy, true);
        }
      },

      // ─────────────────────────────────────────────────────

      rejectExpense: (poolId) => {
        const state = get();
        const updatedPool = state.finans.approvalPool.filter(i => i.id !== poolId);
        set({ finans: { ...state.finans, approvalPool: updatedPool } });

        toast.error('Harcama reddedildi.');
      },

      deleteExpense: async (id) => {
        const state = get();
        const expense = state.finans.harcamalar.find(h => h.id === id);
        if (!expense) return;

        // Use kasa.bakiyeler as the unified source
        const yeniBakiyeler = { ...state.kasa.bakiyeler };
        const payerKey = (expense.payer || '').toLowerCase();

        // Revert balance if it was originally deducted (not card)
        if (payerKey && yeniBakiyeler[payerKey] !== undefined && !expense.cardId) {
          yeniBakiyeler[payerKey] += Number(expense.amount);
        }

        set({
          kasa: {
            ...state.kasa,
            bakiyeler: yeniBakiyeler,
            gecmis: state.kasa.gecmis.filter(g => g.id !== id)
          },
          finans: {
            ...state.finans,
            harcamalar: state.finans.harcamalar.filter(h => h.id !== id),
            history: state.finans.history.filter(h => h.id !== id)
          }
        });
        get().addLog('Harcama Silindi', `${expense.payer || 'Sistem'}: ${expense.amount}₺ - ${expense.title}`);

      },

      togglePrivacyMode: () => {
        const state = get();
        set({ kasa: { ...state.kasa, privacyMode: !state.kasa.privacyMode } });
      },

      updateVarlik: async (id, updates) => {
        const state = get();
        const yeniVarliklar = state.kasa.varliklar.map(v => v.id === id ? { ...v, ...updates } : v);
        set({ kasa: { ...state.kasa, varliklar: yeniVarliklar } });

        const updatedVarlik = yeniVarliklar.find(v => v.id === id);
        if (updatedVarlik) pushGenericToSupabase('kasa_varliklar', updatedVarlik);
      },

      addVarlik: async (varlik) => {
        const state = get();
        const newItem = { id: Date.now(), type: 'tl', location: 'Banka', ...varlik }; // Default type is TL, location Banka
        set({ kasa: { ...state.kasa, varliklar: [newItem, ...(state.kasa.varliklar || [])] } });
        get().addLog('Varlık Eklendi', `${newItem.name}: ${newItem.amount} ${newItem.unit}`);

        pushGenericToSupabase('kasa_varliklar', newItem);
      },

      deleteVarlik: async (id) => {
        const state = get();
        const v = state.kasa.varliklar.find(x => x.id === id);
        set({ kasa: { ...state.kasa, varliklar: state.kasa.varliklar.filter(x => x.id !== id) } });
        if (v) get().addLog('Varlık Silindi', `${v.name}`);

        removeGenericFromSupabase('kasa_varliklar', id);
      },

      updateTasinmaz: async (id, updates) => {
        const state = get();
        const yeniTasinmazlar = state.kasa.tasinmazlar.map(t => t.id === id ? { ...t, ...updates } : t);
        set({ kasa: { ...state.kasa, tasinmazlar: yeniTasinmazlar } });

        const updatedTasinmaz = yeniTasinmazlar.find(t => t.id === id);
        if (updatedTasinmaz) pushGenericToSupabase('kasa_tasinmazlar', updatedTasinmaz);
      },

      transferKasa: async (from, to, amount) => {
        const state = get();
        if (state.kasa.bakiyeler[from] < amount) throw new Error('Yetersiz bakiye!');

        const yeniBakiyeler = {
          ...state.kasa.bakiyeler,
          [from]: state.kasa.bakiyeler[from] - amount,
          [to]: state.kasa.bakiyeler[to] + amount
        };

        set({
          kasa: {
            ...state.kasa,
            bakiyeler: yeniBakiyeler
          }
        });
        
        await pushKasaBakiyelerToSupabase(yeniBakiyeler);
        get().addLog('Kasa Transferi', `${from} -> ${to}: ${amount}₺`);

      },

      syncAllHedefler: async () => {
        const state = get();
        const goals = state.hedefler.goals || [];
        const moneyGoals = state.kasa.kumbaralar || [];
        const visionPlans = state.hedefler.longTermVision || [];
        
        toast.loading('Hedefler senkronize ediliyor...');
        
        try {
          // Push all goals to hedefler_aktif
          for (const g of goals) {
            await pushHedefToSupabase({ ...g, type: 'vision' });
          }
          for (const g of moneyGoals) {
            await pushHedefToSupabase({ ...g, type: 'money' });
          }
          // Push vision plans to hedefler_vizyon
          for (const p of visionPlans) {
            await pushVizyonPlanToSupabase(p);
          }
          
          toast.dismiss();
          toast.success('Tüm hedefler SQL ile senkronize edildi! ✅');
        } catch (err) {
          toast.dismiss();
          toast.error('Senkronizasyon sırasında hata oluştu.');
          console.error(err);
        }
      },

      addGoal: async (goal) => {
        const state = get();
        const name = goal.name || 'Yeni Hedef';
        
        // Mükerrer Kontrolü (State üzerinden)
        const allGoals = [...(state.kasa.kumbaralar || []), ...(state.hedefler.goals || [])];
        const isDuplicate = allGoals.some(
          g => (g.name || g.title || '').toLowerCase().trim() === name.toLowerCase().trim()
        );
        
        if (isDuplicate) {
          toast.error(`"${name}" isimli bir hedef zaten mevcut! ⚠️`);
          return;
        }

        const newGoal = { 
          id: Date.now(), 
          current: 0, 
          deadline: '', 
          priority: 'Orta',
          category: 'Genel',
          notes: '',
          createdAt: new Date().toISOString(),
          createdBy: state.users?.gorkem?.name || 'Sistem', 
          ...goal,
          type: 'money'
        };
        
        set({ kasa: { ...state.kasa, kumbaralar: [newGoal, ...(state.kasa.kumbaralar || [])] } });
        await pushHedefToSupabase(newGoal);
        get().addLog('Hedef Eklendi', `Yeni hedef: ${name}`);

        toast.success('Hedef eklendi! 🎯');
      },

      updateGoal: (id, updates) => {
        const state = get();
        const updated = (state.kasa.kumbaralar || []).map(g => g.id === id ? { ...g, ...updates } : g);
        set({ kasa: { ...state.kasa, kumbaralar: updated } });
        const updatedGoal = updated.find(g => g.id === id);
        if (updatedGoal) {
          pushHedefToSupabase(updatedGoal); // Gölge Yazım
        }

      },

      deleteGoal: (id) => {
        const state = get();
        const g = (state.kasa.kumbaralar || []).find(x => x.id === id);
        set({ kasa: { ...state.kasa, kumbaralar: (state.kasa.kumbaralar || []).filter(x => x.id !== id) } });
        deleteHedefFromSupabase(id); // Gölge Yazım
        if (g) get().addLog('Hedef Silindi', `${g.name}`);
      },

      // --- Vision Goal Actions ---
      addVisionGoal: async (goal) => {
        const state = get();
        const title = goal.title || goal.name || 'Yeni Vizyon Hedefi';

        // Mükerrer Kontrolü
        const isDuplicate = (state.hedefler.goals || []).some(
          g => (g.title || g.name || '').toLowerCase().trim() === title.toLowerCase().trim()
        );

        if (isDuplicate) {
          toast.error(`"${title}" isimli bir vizyon hedefi zaten mevcut! ⚠️`);
          return;
        }

        const newGoal = {
          id: Date.now(),
          current: 0,
          target: 100,
          notes: '',
          createdAt: new Date().toISOString(),
          createdBy: 'Görkem', 
          ...goal,
          type: 'vision'
        };
        set({ hedefler: { ...state.hedefler, goals: [newGoal, ...(state.hedefler.goals || [])] } });
        await pushHedefToSupabase(newGoal);

        toast.success('Vizyon hedefi eklendi! 🌟');
      },

      updateVisionGoal: (id, updates) => {
        const state = get();
        const updated = (state.hedefler.goals || []).map(g => g.id === id ? { ...g, ...updates } : g);
        set({ hedefler: { ...state.hedefler, goals: updated } });
        const updatedGoal = updated.find(g => g.id === id);
        if (updatedGoal) pushHedefToSupabase(updatedGoal); // Gölge Yazım

      },

      deleteVisionGoal: (id) => {
        const state = get();
        set({ hedefler: { ...state.hedefler, goals: (state.hedefler.goals || []).filter(g => g.id !== id) } });
        deleteHedefFromSupabase(id); // Gölge Yazım

      },

      addVisionPlan: (plan) => {
        const state = get();
        const newItem = { id: Date.now().toString(), ...plan };
        set({ hedefler: { ...state.hedefler, longTermVision: [...(state.hedefler.longTermVision || []), newItem] } });
        pushVizyonPlanToSupabase(newItem); // Gölge Yazım

      },

      updateVisionPlan: (id, updates) => {
        const state = get();
        const updated = (state.hedefler.longTermVision || []).map(p => p.id === id ? { ...p, ...updates } : p);
        set({ hedefler: { ...state.hedefler, longTermVision: updated } });
        const updatedPlan = updated.find(p => p.id === id);
        if (updatedPlan) pushVizyonPlanToSupabase(updatedPlan); // Gölge Yazım

      },

      deleteVisionPlan: (id) => {
        const state = get();
        const updated = (state.hedefler.longTermVision || []).filter(p => p.id !== id);
        set({ hedefler: { ...state.hedefler, longTermVision: updated } });
        deleteVizyonPlanFromSupabase(id); // Gölge Yazım

      },

      // ── Achievements ──
      toggleBadge: (userId, badgeId) => {
        set(state => {
          const user = state.users[userId];
          if (!user) return state;
          const currentBadges = user.achievements || [];
          const isEarned = currentBadges.includes(badgeId);
          const newBadges = isEarned 
            ? currentBadges.filter(id => id !== badgeId)
            : [...currentBadges, badgeId];
          
          return {
            users: {
              ...state.users,
              [userId]: { ...user, achievements: newBadges }
            }
          };
        });

      },

      completeGoal: (goalId, type, outcomeNotes) => {
        const state = get();
        let goalToComplete = null;
        
        if (type === 'money') {
          goalToComplete = (state.kasa.kumbaralar || []).find(g => g.id == goalId);
        } else {
          goalToComplete = (state.hedefler.goals || []).find(g => g.id == goalId);
        }

        if (!goalToComplete) {
            toast.error('Hedef bulunamadı! (ID/Type Hatası)');
            return;
        }

          const kazanim = {
            id: Date.now().toString(),
            title: goalToComplete.title || goalToComplete.name,
            originalType: type,
            completedAt: new Date().toISOString(),
            notes: outcomeNotes || goalToComplete.notes || '',
            owner: 'aile' // Başarı aileye aittir
          };
          
          if (type === 'money') {
            set({ 
              kasa: { ...state.kasa, kumbaralar: (state.kasa.kumbaralar || []).filter(g => g.id != goalId) },
              hedefler: { ...state.hedefler, completedHistory: [kazanim, ...(state.hedefler.completedHistory || [])] }
            });
          } else {
            set({ 
              hedefler: { 
                ...state.hedefler, 
                goals: (state.hedefler.goals || []).filter(g => g.id != goalId),
                completedHistory: [kazanim, ...(state.hedefler.completedHistory || [])] 
              } 
            });
          }
          
          pushHedefGecmisToSupabase(kazanim, 'completed'); // Gölge Yazım
          deleteHedefFromSupabase(goalId); // Aktif hedeflerden sil
          get().addLog('Kazanım!', `Hedef tamamlandı: ${kazanim.title}`);

      },

      failGoal: (goalId, type, failureNotes) => {
        const state = get();
        let goalToFail = null;
        
        if (type === 'money') {
          goalToFail = (state.kasa.kumbaralar || []).find(g => g.id == goalId);
        } else {
          goalToFail = (state.hedefler.goals || []).find(g => g.id == goalId);
        }

        if (!goalToFail) {
            toast.error('Hedef bulunamadı! (ID/Type Hatası)');
            return;
        }


          const kayip = {
            id: Date.now().toString(),
            title: goalToFail.title || goalToFail.name,
            originalType: type,
            failedAt: new Date().toISOString(),
            notes: failureNotes || '',
            owner: 'aile' // Başarısızlık aileye aittir
          };

          if (type === 'money') {
            set({ 
                kasa: { ...state.kasa, kumbaralar: (state.kasa.kumbaralar || []).filter(g => g.id != goalId) },
                hedefler: { ...state.hedefler, failedHistory: [kayip, ...(state.hedefler.failedHistory || [])] }
            });
          } else {
            set({ 
                hedefler: { 
                    ...state.hedefler, 
                    goals: (state.hedefler.goals || []).filter(g => g.id != goalId),
                    failedHistory: [kayip, ...(state.hedefler.failedHistory || [])] 
                } 
            });
          }

          pushHedefGecmisToSupabase(kayip, 'failed'); // Gölge Yazım
          deleteHedefFromSupabase(goalId); // Aktif hedeflerden sil
          get().addLog('Kayıp', `Hedef başarısız: ${kayip.title}`);

      },

      updateCompletedGoal: (id, updates) => {
        const state = get();
        const updated = (state.hedefler.completedHistory || []).map(h => h.id === id ? { ...h, ...updates } : h);
        set({ hedefler: { ...state.hedefler, completedHistory: updated } });
        const updatedItem = updated.find(h => h.id === id);
        if (updatedItem) pushHedefGecmisToSupabase(updatedItem, 'completed');
      },

      deleteCompletedGoal: (id) => {
        const state = get();
        set({ hedefler: { ...state.hedefler, completedHistory: (state.hedefler.completedHistory || []).filter(h => h.id !== id) } });
        removeGenericFromSupabase('hedefler_gecmis', id);
      },

      updateFailedGoal: (id, updates) => {
        const state = get();
        const updated = (state.hedefler.failedHistory || []).map(h => h.id === id ? { ...h, ...updates } : h);
        set({ hedefler: { ...state.hedefler, failedHistory: updated } });
        const updatedItem = updated.find(h => h.id === id);
        if (updatedItem) pushHedefGecmisToSupabase(updatedItem, 'failed');
      },

      deleteFailedGoal: (id) => {
        const state = get();
        set({ hedefler: { ...state.hedefler, failedHistory: (state.hedefler.failedHistory || []).filter(h => h.id !== id) } });
        removeGenericFromSupabase('hedefler_gecmis', id);
      },

      // ── Kasa Banka Actions ──────────────────────────────
      addBankaHesabi: (hesap) => {
        const state = get();
        const rawId = Date.now().toString();
        const finalId = `${rawId}-${DEFAULT_FID}`;
        const newHesap = { 
          id: finalId, 
          ...hesap,
          balance: Number(hesap.balance || 0),
          kmh: Number(hesap.kmh || 0),
          openingDate: hesap.openingDate || new Date().toISOString().split('T')[0]
        };
        set({ kasa: { ...state.kasa, bankaHesaplari: [...(state.kasa.bankaHesaplari || []), newHesap] } });
        get().addLog('Banka', `Yeni banka hesabı eklendi: ${hesap.name}`);

        const dbPayload = {
          id: newHesap.id,
          name: newHesap.name,
          bank: newHesap.bank,
          iban: newHesap.iban,
          balance: Number(newHesap.balance),
          kmh: Number(newHesap.kmh),
          owner: newHesap.owner,
          icon: newHesap.icon || '🏦',
          details: {
            openingDate: newHesap.openingDate
          }
        };
        pushGenericToSupabase('kasa_bankalar', dbPayload);
      },
      updateBankaHesabi: (id, updates) => {
        const state = get();
        const updated = (state.kasa.bankaHesaplari || []).map(h => h.id === id ? { 
          ...h, 
          ...updates,
          balance: updates.balance !== undefined ? Number(updates.balance) : h.balance,
          kmh: updates.kmh !== undefined ? Number(updates.kmh) : h.kmh
        } : h);
        set({ kasa: { ...state.kasa, bankaHesaplari: updated } });

        const updatedHesap = updated.find(h => h.id === id);
        if (updatedHesap) {
          const dbPayload = {
            id: updatedHesap.id,
            name: updatedHesap.name,
            bank: updatedHesap.bank,
            iban: updatedHesap.iban,
            balance: Number(updatedHesap.balance),
            kmh: Number(updatedHesap.kmh),
            owner: updatedHesap.owner,
            icon: updatedHesap.icon || '🏦',
            details: {
              openingDate: updatedHesap.openingDate || new Date().toISOString().split('T')[0]
            }
          };
          pushGenericToSupabase('kasa_bankalar', dbPayload);
        }
      },
      deleteBankaHesabi: (id) => {
        const state = get();
        const updated = (state.kasa.bankaHesaplari || []).filter(h => h.id !== id);
        set({ kasa: { ...state.kasa, bankaHesaplari: updated } });

        removeGenericFromSupabase('kasa_bankalar', id);
      },
      updateBankaBakiye: (id, newBalance) => {
        const state = get();
        const updated = (state.kasa.bankaHesaplari || []).map(h => h.id === id ? { ...h, balance: Number(newBalance) } : h);
        set({ kasa: { ...state.kasa, bankaHesaplari: updated } });

        const updatedHesap = updated.find(h => h.id === id);
        if (updatedHesap) {
          const dbPayload = {
            id: updatedHesap.id,
            name: updatedHesap.name,
            bank: updatedHesap.bank,
            iban: updatedHesap.iban,
            balance: Number(updatedHesap.balance),
            kmh: Number(updatedHesap.kmh),
            owner: updatedHesap.owner,
            icon: updatedHesap.icon || '🏦',
            details: {
              openingDate: updatedHesap.openingDate || new Date().toISOString().split('T')[0]
            }
          };
          pushGenericToSupabase('kasa_bankalar', dbPayload);
        }
      },

      payDebt: async (debtId, amount, payer) => {
        const state = get();
        const updatedBorclar = state.finans.borclar.map(d => {
          if (d.id === debtId) {
            return { ...d, remaining: Math.max(0, d.remaining - amount) };
          }
          return d;
        });

        // Also record as expense
        const debt = state.finans.borclar.find(d => d.id === debtId);
        get().addExpense({
          title: `${debt.name} Ödemesi`,
          amount: amount,
          category: 'Borç/Kredi',
          payer: payer
        });

        set({
          finans: { ...state.finans, borclar: updatedBorclar }
        });
      },

      addEmergencyItem: (kitType, itemData, userName) => {
        const state = get();
        const kits = { ...state.ev.emergencyKits };
        if (!kits[kitType]) kits[kitType] = [];

        // Smart Expiry Calculator
        const SHELF_LIFE = {
          "su": 12, "konserve": 24, "bisküvi": 12, "kuruyemiş": 12, "pil": 60,
          "yara": 36, "sargı": 60, "antiseptik": 24, "ağrı": 24, "ateş": 120,
          "düdük": 120, "fener": 60, "radyo": 60, "yağmurluk": 120, "nakit": 120,
          "anahtar": 120, "hijyen": 24, "sabun": 36, "maske": 60
        };

        let calculatedExp = itemData.expDate;
        if (!calculatedExp) {
          const name = itemData.item.toLowerCase();
          const matchKey = Object.keys(SHELF_LIFE).find(key => name.includes(key));
          if (matchKey) {
            const months = SHELF_LIFE[matchKey];
            const date = new Date();
            // Subtract 1 month for safety as requested
            date.setMonth(date.getMonth() + (months - 1));
            calculatedExp = date.toISOString().split('T')[0];
          }
        }

        const newItem = {
          id: Date.now(),
          buyDate: new Date().toISOString().split('T')[0],
          addedBy: userName || 'Sistem',
          ...itemData,
          expDate: calculatedExp
        };

        kits[kitType] = [newItem, ...kits[kitType]];
        set({ ev: { ...state.ev, emergencyKits: kits } });
        get().addLog('Güvenlik', `${newItem.item} ${kitType === 'deprem' ? 'Deprem' : 'İlk Yardım'} çantasına eklendi.`);

        pushGenericToSupabase('ev_acil_durum_cantasi', {
          id: newItem.id,
          kit_type: kitType,
          item: newItem.item,
          amount: newItem.amount || '1',
          exp_date: newItem.expDate,
          buy_date: newItem.buyDate,
          added_by: newItem.addedBy,
          details: { icon: newItem.icon }
        });

      },

      addEmergencyToShopping: (item) => {
        const state = get();
        const alisveris = [...(state.mutfak.alisveris || [])];

        const newItem = {
          id: Date.now(),
          nm: item.item || item,
          qt: 1,
          u: 'Adet',
          st: 'bekliyor',
          cat: 'Güvenlik/Acil Durum',
          dt: new Date().toISOString().split('T')[0],
          note: 'Acil durum çantası için önerildi.'
        };

        set({
          mutfak: { ...state.mutfak, alisveris: [newItem, ...alisveris] }
        });
        toast.success(`"${newItem.nm}" alışveriş listesine eklendi! 🛒`);

      },

      deleteEmergencyItem: (kitType, id) => {
        const state = get();
        const kits = { ...state.ev.emergencyKits };
        if (!kits[kitType]) return;

        kits[kitType] = kits[kitType].filter(item => item.id !== id);
        set({ ev: { ...state.ev, emergencyKits: kits } });
        removeGenericFromSupabase('ev_acil_durum_cantasi', id);

      },

      updateKasaBakiye: async (kisi, yeniTutar) => {
        const state = get();
        const yeniBakiyeler = { ...state.kasa.bakiyeler, [kisi]: yeniTutar };
        set({
          kasa: {
            ...state.kasa,
            bakiyeler: yeniBakiyeler
          }
        });
        await pushKasaBakiyelerToSupabase(yeniBakiyeler);

      },
      updateSafePassword: (newPass) => {
        const state = get();
        set({ ev: { ...state.ev, guvenlik: { ...state.ev.guvenlik, safePassword: newPass } } });

      },

      addDuzenliOdeme: (data) => {
        const state = get();
        const newItem = { ...data, id: Date.now() };
        set({ ev: { ...state.ev, duzenliOdemeler: [...(state.ev.duzenliOdemeler || []), newItem] } });

        pushEvDuzenliOdemeToSupabase(newItem);
      },
      updateDuzenliOdeme: (id, updates) => {
        const state = get();
        const updated = state.ev.duzenliOdemeler.map(i => i.id === id ? { ...i, ...updates } : i);
        set({ ev: { ...state.ev, duzenliOdemeler: updated } });

        const item = updated.find(i => i.id === id);
        if (item) pushEvDuzenliOdemeToSupabase(item);
      },
      deleteDuzenliOdeme: (id) => {
        const state = get();
        set({ ev: { ...state.ev, duzenliOdemeler: state.ev.duzenliOdemeler.filter(i => i.id !== id) } });

        deleteEvDuzenliOdemeFromSupabase(id);
      },
      addFinanceExpense: (expense, paymentInfo) => {
        const state = get();
        const newExpense = { ...expense, id: Date.now(), timestamp: new Date().toISOString() };
        const currentHarcamalar = state.ev.finans?.harcamalar || [];
        set({
          ev: {
            ...state.ev,
            finans: {
              ...state.ev.finans,
              harcamalar: [...currentHarcamalar, newExpense]
            }
          }
        });
        
        // Also send to global finance approval pool
        get().addExpense({
          title: expense.name || 'Ev Harcaması',
          amount: Number(expense.amount),
          category: 'ev',
          source: 'Ev Hub',
          payer: state.currentUser?.name?.toLowerCase() || 'ortak',
          defaultPay: paymentInfo
        });


      },

      addAbonelik: (abo) => {
        const state = get();
        const newAbo = { ...abo, id: Date.now() };
        set({ ev: { ...state.ev, abonelikler: [...state.ev.abonelikler, newAbo] } });

        pushEvAbonelikToSupabase(newAbo);
      },

      updateAbonelik: (id, updates) => {
        const state = get();
        const updated = state.ev.abonelikler.map(a => a.id === id ? { ...a, ...updates } : a);
        set({ ev: { ...state.ev, abonelikler: updated } });

        const item = updated.find(a => a.id === id);
        if (item) pushEvAbonelikToSupabase(item);
      },

      deleteAbonelik: (id) => {
        const state = get();
        set({ ev: { ...state.ev, abonelikler: state.ev.abonelikler.filter(a => a.id !== id) } });

        deleteEvAbonelikFromSupabase(id);
      },

      saveQuickExpense: (data, paymentInfo) => {
        const state = get();
        const { amount, category, user } = data;
        
        get().addExpense({
          title: category || 'Hızlı Harcama',
          amount: Number(amount),
          category: 'ev',
          source: 'Hızlı Giriş',
          payer: user || 'ortak',
          defaultPay: paymentInfo
        });

        get().addLog('Finans', `${user} tarafından ${amount}₺ hızlı harcama girişi yapıldı.`);

      },

      saveInvoiceToFinance: (data) => {
        const state = get();
        const currentEv = state.ev || {};
        const { name, amount, date, linkedCardId, type, user } = data;
        const today = new Date().toISOString();

        const newItem = {
          id: Date.now(),
          name,
          amount: Number(amount),
          date: Number(date),
          linkedCardId,
          icon: type === 'abonelik' ? '🎬' : '🏢',
          autoPay: true,
          createdBy: user,
          createdAt: today
        };

        const updatedEv = { ...currentEv };
        if (type === 'abonelik') {
          updatedEv.abonelikler = [...(currentEv.abonelikler || []), newItem];
        } else {
          updatedEv.duzenliOdemeler = [...(currentEv.duzenliOdemeler || []), newItem];
        }

        set({ ev: updatedEv });
        get().addLog('Sistem', `${user} tarafından yeni ${type === 'abonelik' ? 'abonelik' : 'ödemek'} kaydı oluşturuldu: ${name}`);

      },

      unlockSafe: (pass) => {
        const state = get();
        if (pass === state.ev.guvenlik.safePassword) {
          set({ ev: { ...state.ev, personalSafe: { ...state.ev.personalSafe, locked: false } } });
          return true;
        }
        return false;
      },

      lockSafe: () => {
        const state = get();
        set({ ev: { ...state.ev, personalSafe: { ...state.ev.personalSafe, locked: true } } });
      },

      updatePersonalSafeNote: (note) => {
        const state = get();
        const safe = state.ev.personalSafe || {};
        const activeIdx = safe.activePageIndex || 0;
        let pages = Array.isArray(safe.pages) ? [...safe.pages] : [
          { notes: "", stamps: [] }, { notes: "", stamps: [] }, { notes: "", stamps: [] }, { notes: "", stamps: [] }, { notes: "", stamps: [] }
        ];

        pages[activeIdx] = { ...pages[activeIdx], notes: note };

        set({ ev: { ...state.ev, personalSafe: { ...safe, pages } } });

      },

      addPersonalSafeStamp: (stamp) => {
        const state = get();
        const safe = state.ev.personalSafe || {};
        const activeIdx = safe.activePageIndex || 0;
        let pages = Array.isArray(safe.pages) ? [...safe.pages] : [
          { notes: "", stamps: [] }, { notes: "", stamps: [] }, { notes: "", stamps: [] }, { notes: "", stamps: [] }, { notes: "", stamps: [] }
        ];

        const currentStamps = pages[activeIdx].stamps || [];
        pages[activeIdx] = { ...pages[activeIdx], stamps: [...currentStamps, stamp] };

        set({ ev: { ...state.ev, personalSafe: { ...safe, pages } } });

      },

      clearPersonalSafeStamps: () => {
        const state = get();
        const safe = state.ev.personalSafe || {};
        const activeIdx = safe.activePageIndex || 0;
        let pages = Array.isArray(safe.pages) ? [...safe.pages] : [
          { notes: "", stamps: [] }, { notes: "", stamps: [] }, { notes: "", stamps: [] }, { notes: "", stamps: [] }, { notes: "", stamps: [] }
        ];

        pages[activeIdx] = { ...pages[activeIdx], stamps: [] };

        set({ ev: { ...state.ev, personalSafe: { ...safe, pages } } });

      },

      setPersonalSafePage: (idx) => {
        const state = get();
        set({ ev: { ...state.ev, personalSafe: { ...state.ev.personalSafe, activePageIndex: idx } } });
      },

      resetAllCriticalStocks: async () => {
        const state = get();
        const updatedMutfak = { ...state.mutfak };
        ['buzdolabi', 'kiler', 'dondurucu'].forEach(loc => {
          if (Array.isArray(updatedMutfak[loc])) {
            updatedMutfak[loc] = updatedMutfak[loc].map(item => ({ ...item, mn: 0 }));
          }
        });

        await state.setModuleData('mutfak', updatedMutfak);
        toast.success('Bütün kritik stoklar 0 yapıldı! ✅');
      },

      payLoanInstallment: async (loanId) => {
        const state = get();
        const loan = state.finans.borclar.find(b => b.id === loanId);
        if (!loan) return;

        const monthlyAmount = loan.monthly;
        const newRemaining = Math.max(0, loan.remaining - monthlyAmount);

        const yeniBorclar = state.finans.borclar.map(b =>
          b.id === loanId ? { ...b, remaining: newRemaining } : b
        );

        set({ finans: { ...state.finans, borclar: yeniBorclar } });

        get().addExpense({
          title: `${loan.name} Taksit Ödemesi`,
          amount: monthlyAmount,
          category: 'Borç/Kredi',
          payer: 'ortak'
        });

        get().addLog('Kredi Ödemesi', `${loan.name} taksiti ödendi. Kalan: ${newRemaining}₺`);
      },


      addShoppingItem: async (owner, item) => {
        const state = get();
        const normalizedName = item.nm?.toLowerCase().trim();
        
        // Mükerrer Kontrolü (Aynı isimli ve henüz alınmamış ürün)
        const targetOwner = owner === 'market' ? 'mutfak' : owner;
        const currentList = targetOwner === 'mutfak' ? (state.mutfak.alisveris || []) : (state.alisveris[targetOwner] || []);
        const isDuplicate = currentList.some(i => i.nm?.toLowerCase().trim() === normalizedName && !i.done);

        if (isDuplicate) {
          toast.error(`"${item.nm}" zaten listenizde mevcut! 🛒`);
          return;
        }

        const newItem = {
          id: Date.now(),
          nm: item.nm,
          link: item.link || '',
          pr: Number(item.pr) || 0,
          dt: new Date().toISOString(),
          done: false,
          doneDate: null
        };

        if (targetOwner === 'mutfak') {
          const updatedMutfak = {
            ...state.mutfak,
            alisveris: [newItem, ...(state.mutfak.alisveris || [])]
          };
          set({ mutfak: updatedMutfak });
        } else {
          const updatedAlisveris = {
            ...state.alisveris,
            [targetOwner]: [newItem, ...(state.alisveris[targetOwner] || [])]
          };
          set({ alisveris: updatedAlisveris });
        }

        get().addLog('Alışveriş Listesi', `${targetOwner} listesine eklendi: ${item.nm}`);
        await pushAlisverisToSupabase(newItem, targetOwner);

        toast.success(`"${item.nm}" listeye eklendi! ✨`);
      },

      toggleShoppingItem: async (owner, itemId) => {
        const state = get();
        const targetOwner = owner === 'market' ? 'mutfak' : owner;
        
        const currentUserKey = state.currentUser?.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra';
        let updatedItem = null;
        
        if (targetOwner === 'mutfak') {
          const list = (state.mutfak.alisveris || []).map(i => {
            if (i.id === itemId) {
              const newDone = !i.done;
              updatedItem = { 
                ...i, 
                done: newDone, 
                doneDate: newDone ? new Date().toISOString() : null,
                doneBy: newDone ? currentUserKey : null
              };
              return updatedItem;
            }
            return i;
          });
          set({ mutfak: { ...state.mutfak, alisveris: list } });
        } else {
          const list = (state.alisveris[targetOwner] || []).map(i => {
            if (i.id === itemId) {
              const newDone = !i.done;
              updatedItem = { 
                ...i, 
                done: newDone, 
                doneDate: newDone ? new Date().toISOString() : null,
                doneBy: newDone ? currentUserKey : null
              };
              return updatedItem;
            }
            return i;
          });
          set({ alisveris: { ...state.alisveris, [targetOwner]: list } });
        }

        if (updatedItem) {
          // If marked as done, send to Finans approval pool
          if (updatedItem.done && updatedItem.pr > 0) {
            get().addExpense({
              title: `Alışveriş: ${updatedItem.nm}`,
              amount: Number(updatedItem.pr),
              category: 'market',
              source: 'Alışveriş'
            });
          }
          await pushAlisverisToSupabase(updatedItem, targetOwner);
        }

      },

      deleteShoppingItem: async (owner, itemId) => {
        const state = get();
        const targetOwner = owner === 'market' ? 'mutfak' : owner;

        if (targetOwner === 'mutfak') {
          const updatedList = (state.mutfak.alisveris || []).filter(item => item.id !== itemId);
          set({ mutfak: { ...state.mutfak, alisveris: updatedList } });
        } else {
          const updatedList = (state.alisveris[targetOwner] || []).filter(item => item.id !== itemId);
          set({ alisveris: { ...state.alisveris, [targetOwner]: updatedList } });
        }
        

        await removeAlisverisFromSupabase(itemId);
      },

      addTrip: async (trip) => {
        const state = get();
        const title = trip.title || 'Yeni Seyahat';
        const isDuplicate = (state.tatil.trips || []).some(
          t => t.title?.toLowerCase().trim() === title.toLowerCase().trim()
        );
        if (isDuplicate) {
          toast.error(`"${title}" isimli bir tatil zaten mevcut! ⚠️`);
          return null;
        }
        const locationType = trip.locationType || 'yurtdisi';
        const city = (trip.city || '').toLowerCase().trim();
        const tripTitle = (trip.title || '').toLowerCase().trim();
        const isDomestic = locationType === 'yurtici' || 
                           city.includes('antalya') || 
                           tripTitle.includes('antalya');
        
        const firstItemText = isDomestic ? 'Kimlik' : 'Pasaport';

        const newTrip = {
          id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(),
          family_id: state.family_id,
          user_id: state.currentUser?.id,
          status: 'planned', // Normalized status
          tripType: trip.tripType || 'tatil',
          travelers: trip.travelers || 'ikimiz',
          locationType: trip.locationType || 'yurtdisi',
          transportType: trip.transportType || 'ucak',
          budget: { est: Number(trip.budget) || 0, real: 0 },
          transportation: {
            departure: { flightNo: '', airline: '', pnr: '', time: '', status: 'Planlandı' },
            return: { flightNo: '', airline: '', pnr: '', time: '', status: 'Planlandı' }
          },
          accommodation: { hotel: '', address: '', bookingId: '', link: '' },
          ...trip,
          valiz: trip.valiz || {
            gorkem: [
              { id: 1, text: firstItemText, done: false },
              { id: 2, text: 'Şarj Cihazları', done: false }
            ],
            esra: [
              { id: 1, text: firstItemText, done: false },
              { id: 2, text: 'Kozmetik / Bakım', done: false }
            ]
          },
          created_at: new Date().toISOString()
        };
        const updatedTrips = [newTrip, ...state.tatil.trips];
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        await pushTatilTripToSupabase(newTrip);
        get().addLog('Yeni Seyahat Planı', `${newTrip.title || newTrip.city} (${newTrip.travelers}) planlandı! ✈️`);

      },

      deleteTrip: (tripId) => {
        const state = get();
        // Convert to string to ensure matching if coming from different sources
        const updatedTrips = state.tatil.trips.filter(t => String(t.id) !== String(tripId));
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        get().addLog('Tatil Silindi', 'Bir tatil planı silindi. 🗑️');

        deleteTatilTripFromSupabase(tripId);
      },

      updateTrip: async (tripId, updates) => {
        const state = get();
        const updatedTrips = state.tatil.trips.map(t =>
          t.id === tripId ? { ...t, ...updates } : t
        );
        
        // 1. Önce lokal state'i güncelle (UI tepki versin)
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        
        try {
          // 2. SQL tablosunu güncelle (Asıl kaynak burası)
          const updatedTripObj = updatedTrips.find(t => t.id === tripId);
          if (updatedTripObj) {
            await pushTatilTripToSupabase(updatedTripObj);
          }
          
          // 3. JSON state'i güncelle (Diğer cihazlara haber gitmesi için)
 // immediate save
          
          console.log('✅ Tatil başarıyla güncellendi ve senkronize edildi.');
        } catch (err) {
          console.error('❌ Tatil güncelleme hatası:', err);
          toast.error('Tatil bilgileri kaydedilemedi.');
        }
      },

      updateTripValiz: async (tripId, person, itemId) => {
        const state = get();
        const updatedTrips = state.tatil.trips.map(t => {
          if (t.id === tripId) {
            const newList = t.valiz[person].map(item =>
              item.id === itemId ? { ...item, done: !item.done } : item
            );
            return { ...t, valiz: { ...t.valiz, [person]: newList } };
          }
          return t;
        });
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        
        const valizTrip = updatedTrips.find(t => t.id === tripId);
        if (valizTrip) {
          await pushTatilTripToSupabase(valizTrip);
        }

      },

      addTripExpense: (tripId, expense) => {
        const state = get();
        get().addExpense({
          title: `Seyahat: ${expense.title}`,
          amount: expense.amount,
          category: 'tatil',
          source: 'Tatil Modülü'
        });

      },

      completeTripEvaluation: async (tripId, person, evalData) => {
        const state = get();
        const updatedTrips = state.tatil.trips.map(t => {
          if (String(t.id) === String(tripId)) {
            const newEvals = { ...t.evaluations, [person]: evalData };
            let newStatus = t.status;

            if (t.travelers === 'ikimiz') {
              if (newEvals.gorkem && newEvals.esra) newStatus = 'completed';
            } else {
              newStatus = 'completed';
            }

            const allGalleryPhotos = [];
            if (newEvals.gorkem?.photos) newEvals.gorkem.photos.forEach(p => { if (p) allGalleryPhotos.push(p); });
            if (newEvals.esra?.photos) newEvals.esra.photos.forEach(p => { if (p) allGalleryPhotos.push(p); });

            return {
              ...t,
              evaluations: newEvals,
              status: newStatus,
              photos: allGalleryPhotos.length > 0 ? allGalleryPhotos.slice(0, 6) : t.photos
            };
          }
          return t;
        });
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        get().addLog('Seyahat Değerlendirmesi', `${person} seyahati değerlendirdi.`);
        
        const evalTrip = updatedTrips.find(t => String(t.id) === String(tripId));
        if (evalTrip) {
          await pushTatilTripToSupabase(evalTrip);
        }

      },

      syncValizToDepo: (itemText, category) => {
        const state = get();
        const alreadyInDepo = state.ev.depo.some(i => i.nm.toLowerCase() === itemText.toLowerCase());
        if (!alreadyInDepo) {
          const newItem = {
            id: Date.now(),
            nm: itemText,
            qt: 1,
            dt: new Date().toISOString().split('T')[0],
            category: category || 'Seyahat',
            icon: '🧳'
          };
          set({ ev: { ...state.ev, depo: [...state.ev.depo, newItem] } });
        }
      },

      addDream: async (dream) => {
        const state = get();
        const newDream = {
          id: Date.now(),
          date: new Date().toISOString(),
          user: state.currentUser?.name || 'Sistem',
          ...dream
        };
        const updatedWishlist = [newDream, ...(state.tatil.wishlist || [])];
        set({ tatil: { ...state.tatil, wishlist: updatedWishlist } });
        get().addLog('Yeni Hayal', `${dream.place} hayal listesine eklendi! 🌟`);
        
        await pushTatilWishlistToSupabase(newDream);

      },

      uploadTripPhoto: async (file) => {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `trip_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `public/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('eraylar-storage')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('eraylar-storage')
            .getPublicUrl(filePath);

          return publicUrl;
        } catch (err) {
          console.error('Upload error:', err);
          throw err;
        }
      },

      deleteTripPhoto: async (publicUrl) => {
        try {
          if (!publicUrl || !publicUrl.includes('eraylar-storage')) return;
          
          // Extract file path from URL
          // Format: .../eraylar-storage/public/filename.jpg
          const parts = publicUrl.split('eraylar-storage/');
          if (parts.length < 2) return;
          
          const filePath = parts[1];
          const { error } = await supabase.storage
            .from('eraylar-storage')
            .remove([filePath]);

          if (error) throw error;
        } catch (err) {
          console.error('Photo deletion error:', err);
        }
      },



      toggleTripChecklist: async (tripId, itemId) => {
        const state = get();
        const updatedTrips = state.tatil.trips.map(t => {
          if (t.id === tripId) {
            const updatedChecklist = t.checklists.map(c =>
              c.id === itemId ? { ...c, done: !c.done } : c
            );
            return { ...t, checklists: updatedChecklist };
          }
          return t;
        });
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        
        const checkTrip = updatedTrips.find(t => t.id === tripId);
        if (checkTrip) {
          await pushTatilTripToSupabase(checkTrip);
        }

      },

      updateDebt: async (id, remaining) => {
        const state = get();
        const yeniBorclar = state.finans.borclar.map(b => b.id === id ? { ...b, remaining } : b);
        set({ finans: { ...state.finans, borclar: yeniBorclar } });
        
        // SYNC FIX: Persist changes to Supabase
        await syncFinansKrediler(yeniBorclar);
      },

      updateCard: async (id, balance) => {
        const state = get();
        const yeniKartlar = state.finans.kartlar.map(k => k.id === id ? { ...k, balance } : k);
        set({ finans: { ...state.finans, kartlar: yeniKartlar } });

        // SYNC FIX: Persist changes to Supabase
        await syncFinansKartlar(yeniKartlar);
      },

      // ── Mutfak Actions ───────────────────────────────────
      updateMenu: async (gun, ogun, yemek) => {
        const state = get();
        const mealKey = ogun === 'kahvalti' ? 'k' : 'a';
        const yeniMenu = {
          ...state.mutfak.menu,
          [gun]: { ...(state.mutfak.menu[gun] || {}), [mealKey]: yemek }
    };
        set({ mutfak: { ...state.mutfak, menu: yeniMenu } });
        
        // GÖLGE YAZIM
        pushMutfakMenuToSupabase(gun, mealKey, String(yemek));
        

      },

      updateMenuDetail: async (gun, details) => {
        const state = get();
        const yeniMenu = {
          ...state.mutfak.menu,
          [gun]: { ...(state.mutfak.menu[gun] || {}), ...details }
    };
        set({ mutfak: { ...state.mutfak, menu: yeniMenu } });
        
        // GÖLGE YAZIM
        Object.entries(details).forEach(([key, value]) => {
          pushMutfakMenuToSupabase(gun, key, String(value));
        });
        

      },

      syncRecipesFromData: () => {
        const state = get();
        console.log(`Force syncing ${INITIAL_RECIPES.length} recipes from data.js...`);

        // Mevcut tarifleri INITIAL_RECIPES ile tamamen değiştiriyoruz (Master liste öncelikli)
        const updatedTarifler = INITIAL_RECIPES.map((r, i) => ({ ...r, id: i + 1 }));

        set({ mutfak: { ...state.mutfak, tarifler: updatedTarifler } });

        return updatedTarifler.length;
      },

      luckyFill: (days) => {
        console.log('🎲 luckyFill started for days:', days);
        const state = get();
        const recipes = state.mutfak.tarifler || [];
        console.log('📚 Total recipes found:', recipes.length);
        if (recipes.length === 0) return 0;

        const bPool = recipes.filter(r => r.c === 'kahvalti');
        const dPool = recipes.filter(r => r.c !== 'kahvalti');
        console.log('🍳 Breakfast pool:', bPool.length, '🥘 Dinner pool:', dPool.length);

        let newMenu = { ...(state.mutfak.menu || {}) };
        let count = 0;

        days.forEach(iso => {
          const dayData = { ...(newMenu[iso] || {}) };
          let changed = false;

          console.log(`📅 Checking ${iso}:`, dayData);

          if (!dayData.k && !dayData.kdis && !dayData.ksp) {
            const pool = bPool.length > 0 ? bPool : recipes;
            const chosen = pool[Math.floor(Math.random() * pool.length)];
            dayData.k = chosen.n;
            changed = true;
            console.log(`✅ Filled Breakfast for ${iso}: ${chosen.n}`);
          }
          if (!dayData.a && !dayData.adis && !dayData.asp) {
            const pool = dPool.length > 0 ? dPool : recipes;
            const chosen = pool[Math.floor(Math.random() * pool.length)];
            dayData.a = chosen.n;
            changed = true;
            console.log(`✅ Filled Dinner for ${iso}: ${chosen.n}`);
          }

          if (changed) {
            newMenu[iso] = dayData;
            count++;
          }
        });

        if (count > 0) {
          console.log('🔄 Setting local state with new menu...');
          set({ mutfak: { ...state.mutfak, menu: newMenu } });
          // Temporarily disabled to debug 400 error
          // get().saveToSupabase();
          console.log('✅ Local state set successfully.');
        }
        return count;
      },

      setEatOut: async (dt, ml, info, paymentInfo) => {
        const state = get();
        const { fr, pr } = info;
        const prefix = ml === 'k' ? 'k' : 'a';

        if (pr > 0) {
          get().addExpense({
            title: 'Dışarıda Yemek (' + (fr || 'Restoran') + ')',
            amount: pr,
            category: 'Mutfak',
            payer: state.currentUser?.name || 'Görkem',
            defaultPay: paymentInfo
          });
        }

        // Save restaurant name for auto-fill
        let yeniRestaurants = [...(state.mutfak.restaurantlar || [])];
        if (fr && !yeniRestaurants.includes(fr)) {
          yeniRestaurants = [fr, ...yeniRestaurants].slice(0, 20);
        }

        const details = {
          [prefix + 'dis']: true,
          [prefix]: fr || 'Dışarıda',
          [prefix + '2']: null,
          [prefix + 'sp']: false
        };

        set({ mutfak: { ...state.mutfak, restaurantlar: yeniRestaurants } });
        get().updateMenuDetail(dt, details);


        // Push restaurant to SQL if new
        if (fr) {
          pushGenericToSupabase('mutfak_restaurantlar', { id: fr, isim: fr });
        }
      },

      setDelivery: async (dt, ml, info, paymentInfo) => {
        const state = get();
        const { fr, wh, pr } = info;
        const prefix = ml === 'k' ? 'k' : 'a';

        const newOrder = {
          id: Date.now(),
          dt, fr, wh, pr,
          u: state.currentUser?.name || 'Görkem',
          tm: new Date().toLocaleString('tr-TR')
        };

        if (pr > 0) {
          get().addExpense({
            title: 'Dışarıdan Sipariş (' + (fr || wh) + ')',
            amount: pr,
            category: 'Mutfak',
            payer: state.currentUser?.name || 'Görkem',
            defaultPay: paymentInfo
          });
        }

        const yeniSiparisler = [newOrder, ...(state.mutfak.siparisler || [])].slice(0, 100);

        // Save restaurant name for auto-fill
        let yeniRestaurants = [...(state.mutfak.restaurantlar || [])];
        if (fr && !yeniRestaurants.includes(fr)) {
          yeniRestaurants = [fr, ...yeniRestaurants].slice(0, 20);
        }

        const details = {
          [prefix + 'sp']: true,
          [prefix]: wh || fr,
          [prefix + 'dis']: false
        };

        set({ mutfak: { ...state.mutfak, siparisler: yeniSiparisler, restaurantlar: yeniRestaurants } });
        get().updateMenuDetail(dt, details);


        pushGenericToSupabase('mutfak_siparisler', {
          id: String(newOrder.id),
          tarih: newOrder.dt,
          nereden: newOrder.fr || newOrder.wh,
          ne_kadar: newOrder.pr,
          kim_odedi: newOrder.u,
          notlar: newOrder.tm
        });
      },

      addRecipe: async (recipe) => {
        const state = get();
        const isDuplicate = (state.mutfak.tarifler || []).some(
          r => r.n?.toLowerCase().trim() === recipe.n?.toLowerCase().trim()
        );
        
        if (isDuplicate) {
          toast.error('Bu isimde bir tarif zaten mevcut! 🍲');
          return false;
        }

        const newRecipe = {
          id: Date.now(),
          f: false,
          p: 0,
          ...recipe
        };
        const yeniTarifler = [newRecipe, ...state.mutfak.tarifler];

        let updatedMutfak = { ...state.mutfak, tarifler: yeniTarifler };
        const allStock = [
          ...(updatedMutfak.buzdolabi || []),
          ...(updatedMutfak.kiler || []),
          ...(updatedMutfak.dondurucu || [])
        ];
        const stockNames = allStock.map(s => s.n.toLowerCase());

        (recipe.ig || []).forEach(igLine => {
          const name = igLine.split(':')[0].trim();
          if (name && !stockNames.includes(name.toLowerCase())) {
            updatedMutfak.kiler.push({
              id: Date.now() + Math.floor(Math.random() * 1000000),
              n: name,
              cr: 0,
              mn: 1,
              u: 'adet',
              ic: '📦',
              bt: new Date().toISOString()
            });
            stockNames.push(name.toLowerCase());
          }
        });

        set({ mutfak: updatedMutfak });
        await pushMutfakTarifToSupabase(newRecipe);
        return true;
      },

      updateRecipe: async (id, updates) => {
        const state = get();
        const yeniTarifler = state.mutfak.tarifler.map(r => r.id === id ? { ...r, ...updates } : r);

        // Auto-add ingredients to stock if missing
        let updatedMutfak = { ...state.mutfak, tarifler: yeniTarifler };
        const allStock = [
          ...(updatedMutfak.buzdolabi || []),
          ...(updatedMutfak.kiler || []),
          ...(updatedMutfak.dondurucu || [])
        ];
        const stockNames = allStock.map(s => s.n.toLowerCase());

        (updates.ig || []).forEach(igLine => {
          const name = igLine.split(':')[0].trim();
          if (name && !stockNames.includes(name.toLowerCase())) {
            updatedMutfak.kiler.push({
              id: Date.now() + Math.floor(Math.random() * 1000000),
              n: name,
              cr: 0,
              mn: 1,
              u: 'adet',
              ic: '📦',
              bt: new Date().toISOString()
            });
            stockNames.push(name.toLowerCase());
          }
        });

        set({ mutfak: updatedMutfak });

      },

      deleteRecipe: async (id) => {
        const state = get();
        const yeniTarifler = state.mutfak.tarifler.filter(r => r.id !== id);
        set({ mutfak: { ...state.mutfak, tarifler: yeniTarifler } });
        
        // SQL SYNC
        await removeGenericFromSupabase('mutfak_tarifler', id);
      },

      toggleFavorite: async (id) => {
        const state = get();
        const recipe = state.mutfak.tarifler.find(r => r.id === id);
        if (!recipe) return;
        const updatedRecipe = { ...recipe, f: !recipe.f };
        const yeniTarifler = state.mutfak.tarifler.map(r => r.id === id ? updatedRecipe : r);
        set({ mutfak: { ...state.mutfak, tarifler: yeniTarifler } });
        
        // SQL SYNC
        await pushMutfakTarifToSupabase(updatedRecipe);
      },

      updateWaterLevel: async (tank, level) => {
        const state = get();
        const newSu = {
          ...state.mutfak.su,
          [tank]: level,
          lastChecked: new Date().toISOString() // Reset timer on manual update
        };
        set({
          mutfak: {
            ...state.mutfak,
            su: newSu
          }
        });

        pushMutfakSuToSupabase(newSu);
      },

      setWaterDailyRate: (rate) => {
        const state = get();
        const newSu = { ...state.mutfak.su, dailyRate: rate };
        set({ mutfak: { ...state.mutfak, su: newSu } });

        pushMutfakSuToSupabase(newSu);
      },

      checkWaterDepletion: () => {
        const state = get();
        const { su } = state.mutfak;
        if (!su.lastChecked) return;

        const last = new Date(su.lastChecked);
        const now = new Date();
        const diffMs = now - last;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
          let totalDepletion = diffDays * (su.dailyRate || 20);
          let newLevel1 = su.level1;
          let newLevel2 = su.level2;

          if (newLevel1 >= totalDepletion) {
            newLevel1 -= totalDepletion;
            totalDepletion = 0;
          } else {
            totalDepletion -= newLevel1;
            newLevel1 = 0;
            newLevel2 = Math.max(0, newLevel2 - totalDepletion);
          }

          const newSuObj = {
            ...su,
            level1: newLevel1,
            level2: newLevel2,
            lastChecked: now.toISOString()
          };
          set({
            mutfak: {
              ...state.mutfak,
              su: newSuObj
            }
          });

          pushMutfakSuToSupabase(newSuObj);
        }
      },

      addWaterOrder: async (qty = 2) => {
        const state = get();
        const currentSu = state.mutfak.su || { level1: 100, level2: 100, history: [] };
        const yeniHistory = [{ dt: new Date().toISOString(), q: qty }, ...(currentSu.history || [])].slice(0, 20);
        
        // Mantık: Sipariş verildiğinde Yedek (level2) dolar. 
        // Mutfaktaki (level1) mevcut su seviyesi değişmez.
        const newSu = { 
          ...currentSu, 
          level2: 100, // Yedekler tazelendi
          lastOrder: new Date().toISOString(), 
          history: yeniHistory 
        };
        set({
          mutfak: {
            ...state.mutfak,
            su: newSu
          }
        });
        pushMutfakSuToSupabase(newSu);
      },

      removeWaterOrder: async (index) => {
        const state = get();
        const currentSu = state.mutfak.su || { history: [] };
        const newHistory = (currentSu.history || []).filter((_, i) => i !== index);
        
        const newSu = { ...currentSu, history: newHistory };
        set({
          mutfak: {
            ...state.mutfak,
            su: newSu
          }
        });
        pushMutfakSuToSupabase(newSu);
        toast.success('Kayıt silindi.');
      },

      processDailyWaterDeduction: () => {
        const state = get();
        const su = state.mutfak.su || {};
        // Eğer düzenleme modundaysa veya tarih yoksa işlem yapma
        if (!su.lastChecked || su.isEditing) return;

        const now = new Date();
        const last = new Date(su.lastChecked);
        const diffMs = now - last;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        // En az %1'lik bir düşüş (veya 1 saat) bekleyelim ki sürekli render olmasın
        if (diffMs < 1000 * 60 * 60) return; 

        const rate = su.dailyRate || 20;
        const totalDeduction = diffDays * rate;
        
        let newLevel1 = su.level1 || 0;
        let newLevel2 = su.level2 || 0;
        let remainingDeduction = totalDeduction;

        // Önce mutfaktakini düş
        if (newLevel1 >= remainingDeduction) {
          newLevel1 -= remainingDeduction;
          remainingDeduction = 0;
        } else {
          remainingDeduction -= newLevel1;
          newLevel1 = 0;
        }

        // Sonra yedektekini düş (Yedek su genellikle damacana bazlıdır ama burada yüzde tutuluyor)
        if (remainingDeduction > 0) {
          newLevel2 = Math.max(0, newLevel2 - remainingDeduction);
        }

        // KRİTİK DÜZELTME: Sonucu en yakın %5'in katına yuvarla (%61 -> %60)
        // Eğer %1'den az kaldıysa sıfırla
        const finalL1 = newLevel1 < 1 ? 0 : Math.round(newLevel1 / 5) * 5;
        const finalL2 = newLevel2 < 1 ? 0 : Math.round(newLevel2 / 5) * 5;

        // Eğer yuvarlama sonrası seviye DEĞİŞMEDİYSE lastChecked'ı güncelleme ki birikmeye devam etsin
        if (finalL1 === su.level1 && finalL2 === su.level2) return;

        const newSu = { 
          ...su, 
          level1: finalL1, 
          level2: finalL2, 
          lastChecked: now.toISOString() 
        };
        
        set({
          mutfak: {
            ...state.mutfak,
            su: newSu
          }
        });
        pushMutfakSuToSupabase(newSu);
      },

      setWaterEditing: (val) => {
        const state = get();
        const su = state.mutfak.su || {};
        set({ mutfak: { ...state.mutfak, su: { ...su, isEditing: val } } });
      },

      saveWaterSettings: (l1, l2, rate) => {
        const state = get();
        const su = state.mutfak.su || {};
        const now = new Date().toISOString();
        const newSu = {
          ...su,
          level1: l1,
          level2: l2,
          dailyRate: rate,
          lastChecked: now, // Kaydedildiği an zamanlayıcı sıfırlanır
          isEditing: false
        };
        set({ mutfak: { ...state.mutfak, su: newSu } });
        pushMutfakSuToSupabase(newSu);
        toast.success('Su ayarları kaydedildi ve sayaç başlatıldı! 💧');
      },

      refillPetWater: async () => {
        // Kullanıcı isteğiyle bu fonksiyonun işlevini kaldırdık veya pet-card'ı sildiğimiz için boş bıraktık
        // Ancak store'da kalması zarar vermez, UI'dan çağrılmayacak.
      },

      setItemFinished: async (moduleKey, itemName, qty) => {
        const state = get();
        const items = [...state.mutfak[moduleKey]];
        const idx = items.findIndex(x => x.n === itemName);
        if (idx === -1) return;

        const item = items[idx];
        const deductQty = qty === undefined ? item.cr : qty;
        const newCr = Math.max(0, item.cr - deductQty);
        items[idx] = { ...item, cr: newCr };

        // Coordination: Auto-add to shopping if it hits zero or goes low
        const isAlreadyInShopping = state.mutfak.alisveris.some(s => s.nm.toLowerCase() === itemName.toLowerCase() && !s.dn);
        let newShopping = [...state.mutfak.alisveris];
        if (newCr === 0 && !isAlreadyInShopping) {
          newShopping.push({
            id: Date.now(),
            nm: item.n,
            qt: (item.mn || 1) + ' ' + (item.u || 'adet'),
            mk: item.mk || 'BİM',
            dn: false,
            loc: moduleKey === 'buzdolabi' ? 'buz' : 'kil'
          });
        }

        set({ mutfak: { ...state.mutfak, [moduleKey]: items, alisveris: newShopping } });
        
        // GÖLGE YAZIM
        pushMutfakStokToSupabase(items[idx], moduleKey);
        if (newCr === 0 && !isAlreadyInShopping) {
            pushAlisverisToSupabase(newShopping[newShopping.length - 1], 'mutfak');
        }
      },

      transferStock: async (fromModule, toModule, itemName, qty) => {
        const state = get();
        let fromItems = [...state.mutfak[fromModule]];
        let toItems = [...state.mutfak[toModule]];

        const fromIdx = fromItems.findIndex(x => x.n === itemName);
        if (fromIdx === -1) return;

        const fromItem = fromItems[fromIdx];
        const transferQty = Math.min(fromItem.cr, qty);
        if (transferQty <= 0) return;

        fromItems[fromIdx] = { ...fromItem, cr: fromItem.cr - transferQty };

        const toIdx = toItems.findIndex(x => x.n === itemName);
        if (toIdx !== -1) {
          toItems[toIdx] = { ...toItems[toIdx], cr: toItems[toIdx].cr + transferQty };
        } else {
          toItems.push({ ...fromItem, cr: transferQty, bt: new Date().toISOString() });
        }

        set({ mutfak: { ...state.mutfak, [fromModule]: fromItems, [toModule]: toItems } });
        
        // GÖLGE YAZIM
        pushMutfakStokToSupabase(fromItems[fromIdx], fromModule);
        if (toIdx !== -1) {
            pushMutfakStokToSupabase(toItems[toIdx], toModule);
        } else {
            pushMutfakStokToSupabase(toItems[toItems.length - 1], toModule);
        }
      },

      bulkFinishItems: async (itemsToFinish) => {
        const state = get();
        let finalMutfak = { ...state.mutfak };
        let newShopping = [...finalMutfak.alisveris];

        itemsToFinish.forEach(({ moduleKey, itemName, qty }) => {
          let items = [...finalMutfak[moduleKey]];
          const idx = items.findIndex(x => x.n === itemName);
          if (idx === -1) return;

          const item = items[idx];
          const newCr = Math.max(0, item.cr - qty);
          items[idx] = { ...item, cr: newCr };

          const isAlreadyInShopping = newShopping.some(s => s.nm.toLowerCase() === itemName.toLowerCase() && !s.dn);
          if (newCr === 0 && !isAlreadyInShopping) {
            newShopping.push({
              id: Date.now() + Math.floor(Math.random() * 10000),
              nm: item.n,
              qt: (item.mn || 1) + ' ' + (item.u || 'adet'),
              mk: item.mk || 'BİM',
              dn: false,
              loc: moduleKey === 'buzdolabi' ? 'buz' : 'kil'
            });
          }
          finalMutfak[moduleKey] = items;
        });

        finalMutfak.alisveris = newShopping;
        set({ mutfak: finalMutfak });
      },

      addMissingToShopping: async (missingItems) => {
        const state = get();
        let newShopping = [...state.mutfak.alisveris];
        let addedCount = 0;

        const allStock = [...state.mutfak.buzdolabi, ...state.mutfak.kiler, ...state.mutfak.dondurucu];

        missingItems.forEach(itemName => {
          const isAlreadyInShopping = newShopping.some(s => s.nm.toLowerCase() === itemName.toLowerCase() && !s.dn);
          if (!isAlreadyInShopping) {
            // Find smart defaults
            const stockItem = allStock.find(s => s.n.toLowerCase() === itemName.toLowerCase());
            let loc = 'buz';
            if (stockItem) {
              if (state.mutfak.kiler.some(s => s.n === stockItem.n)) loc = 'kil';
              else if (state.mutfak.dondurucu.some(s => s.n === stockItem.n)) loc = 'don';
            }

            newShopping.push({
              id: Date.now() + Math.floor(Math.random() * 10000),
              nm: itemName,
              qt: (stockItem?.mn || 1) + ' ' + (stockItem?.u || 'adet'),
              mk: stockItem?.mk || 'BİM',
              dn: false,
              loc: loc,
              ct: stockItem?.ct || 'Diğer'
            });
            addedCount++;
          }
        });

        if (addedCount > 0) {
          set({ mutfak: { ...state.mutfak, alisveris: newShopping } });

        }
        return addedCount;
      },

      addCriticalToShopping: async () => {
        const state = get();
        let newShopping = [...state.mutfak.alisveris];
        let addedCount = 0;

        ['buzdolabi', 'kiler', 'dondurucu'].forEach(loc => {
          state.mutfak[loc].forEach(item => {
            if (item.cr <= item.mn) {
              const isAlreadyInShopping = newShopping.some(s => s.nm.toLowerCase() === item.n.toLowerCase() && !s.dn);
              if (!isAlreadyInShopping) {
                newShopping.push({
                  id: Date.now() + Math.floor(Math.random() * 10000),
                  nm: item.n,
                  qt: (item.mn || 1) + ' ' + (item.u || 'adet'),
                  mk: item.mk || 'BİM',
                  dn: false,
                  loc: loc === 'buzdolabi' ? 'buz' : 'kil',
                  ct: item.ct || 'Diğer'
                });
                addedCount++;
              }
            }
          });
        });

        if (addedCount > 0) {
          set({ mutfak: { ...state.mutfak, alisveris: newShopping } });

        }
        return addedCount;
      },

      addKitchenNote: async (text, writer) => {
        const state = get();
        const newNote = {
          id: Date.now(),
          t: text,
          w: writer,
          d: new Date().toISOString(),
          r: false,
          x: Math.floor(Math.random() * 50) + 10,
          y: Math.floor(Math.random() * 50) + 10
        };
        const yeniSohbet = [newNote, ...state.mutfak.sohbet].slice(0, 12);
        const yeniHistory = [newNote, ...(state.mutfak.history || [])].slice(0, 100);

        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet, history: yeniHistory } });
        await pushMutfakSohbetToSupabase(newNote);
      },

      updateNotePosition: (noteId, x, y) => {
        const state = get();
        const yeniSohbet = state.mutfak.sohbet.map(n =>
          n.id === noteId ? { ...n, x, y } : n
        );
        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet } });

      },

      markNoteAsRead: (noteId) => {
        const state = get();
        const yeniSohbet = state.mutfak.sohbet.map(n => n.id === noteId ? { ...n, r: true } : n);
        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet } });

      },

      removeNote: (noteId) => {
        const state = get();
        const note = state.mutfak.sohbet.find(n => n.id === noteId);
        const yeniSohbet = state.mutfak.sohbet.filter(n => n.id !== noteId);

        // When removed from board, move to archive just in case, but history already has it
        const yeniArsiv = note ? [{ ...note, archDate: new Date().toISOString() }, ...state.mutfak.arsiv].slice(0, 100) : state.mutfak.arsiv;

        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet, arsiv: yeniArsiv } });
      },

      archiveNote: (noteId) => {
        const state = get();
        const note = state.mutfak.sohbet.find(n => n.id === noteId);
        if (!note) return;
        const yeniSohbet = state.mutfak.sohbet.filter(n => n.id !== noteId);
        const yeniArsiv = [{ ...note, archDate: new Date().toISOString() }, ...state.mutfak.arsiv].slice(0, 100);
        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet, arsiv: yeniArsiv } });
        get().addLog('Not Arşivlendi', `${note.w} tarafından yazılan not arşive kaldırıldı.`);

      },

      restoreNote: (noteId) => {
        const state = get();
        const note = state.mutfak.arsiv.find(n => n.id === noteId);
        if (!note) return;
        const yeniArsiv = state.mutfak.arsiv.filter(n => n.id !== noteId);
        const yeniSohbet = [{ ...note, d: new Date().toISOString() }, ...state.mutfak.sohbet];
        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet, arsiv: yeniArsiv } });
        get().addLog('Not Geri Yüklendi', `Arşivden bir not geri yüklendi.`);

      },

      updateBreadStock: (breadData) => {
        const state = get();
        // breadData can be an array or a single bread update
        if (Array.isArray(breadData)) {
          set({ mutfak: { ...state.mutfak, ekmeklik: breadData } });
        } else {
          // Add or update logic
          const exists = state.mutfak.ekmeklik.find(e => e.tip === breadData.tip);
          let newEkmeklik = [...state.mutfak.ekmeklik];
          if (exists) {
            newEkmeklik = newEkmeklik.map(e => e.tip === breadData.tip ? { ...e, ...breadData } : e);
          } else {
            newEkmeklik.push({ id: Date.now(), ...breadData });
          }
          set({ mutfak: { ...state.mutfak, ekmeklik: newEkmeklik } });
        }

      },

      confirmShoppingItem: async (id, mk, qt, pr, loc, cardId, ct) => {
        const state = get();
        const item = state.mutfak.alisveris.find(i => i.id === id);
        if (!item) return;

        // 1. Mark as done in shopping
        const yeniAlisveris = state.mutfak.alisveris.map(i =>
          i.id === id ? { ...i, dn: true, mk, qt, pr, loc, cardId, ct } : i
        );

        // 2. Add to Finance as expense if price > 0
        if (pr > 0) {
          get().addExpense({
            title: (mk ? mk + ' · ' : '') + item.nm,
            amount: pr,
            category: 'Mutfak',
            payer: state.currentUser?.name || 'Görkem',
            cardId: cardId || null
          });

          // 2b. Update Price History
          const history = state.mutfak.priceHistory || {};
          const itemHistory = history[item.nm] || [];
          const newHistory = [{ pr: Number(pr), dt: new Date().toISOString(), mk: mk || 'Market' }, ...itemHistory].slice(0, 5);
          set({ mutfak: { ...state.mutfak, priceHistory: { ...history, [item.nm]: newHistory } } });
        }

        // 3. Add to Stock (Check ALL locations to prevent duplicates)
        const allLocs = ['buzdolabi', 'kiler', 'dondurucu'];
        let foundLoc = null;
        let foundIdx = -1;

        for (const locKey of allLocs) {
          const idx = (state.mutfak[locKey] || []).findIndex(x => x.n.toLowerCase() === item.nm.toLowerCase());
          if (idx !== -1) {
            foundLoc = locKey;
            foundIdx = idx;
            break;
          }
        }

        const targetKey = foundLoc || (loc === 'buz' ? 'buzdolabi' : loc === 'kil' ? 'kiler' : loc === 'don' ? 'dondurucu' : 'kiler');
        let finalMutfak = { ...state.mutfak, alisveris: yeniAlisveris };

        const itemsInLoc = [...(state.mutfak[targetKey] || [])];
        const matchNum = (qt || '').match(/[\d.]+/);
        const num = parseFloat(matchNum?.[0]) || 1;
        const uStr = (qt || '').replace(/[\d.\s]/g, '').toLowerCase() || 'adet';

        if (foundIdx !== -1) {
          // Update existing item in its current location
          itemsInLoc[foundIdx] = { ...itemsInLoc[foundIdx], cr: itemsInLoc[foundIdx].cr + num, bt: new Date().toISOString() };
        } else {
          // Add new item to requested location
          itemsInLoc.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            n: item.nm,
            u: uStr,
            mn: 1,
            cr: num,
            ic: '📦',
            ct: ct || 'Diğer',
            mk: mk || 'BİM',
            bt: new Date().toISOString()
          });
        }
        finalMutfak[targetKey] = itemsInLoc;

        set({ mutfak: finalMutfak });

      },

      luckyFillWeek: (days) => {
        const state = get();
        const recipes = state.mutfak.tarifler || [];
        if (recipes.length === 0) return;

        const breakfastPool = recipes.filter(r => r.c === 'kahvalti');
        const dinnerPool = recipes.filter(r => r.c !== 'kahvalti');

        let newMenu = { ...(state.mutfak.menu || {}) };
        let count = 0;

        days.forEach(day => {
          const iso = day.iso;
          if (!newMenu[iso]) newMenu[iso] = {};

          const dayData = { ...newMenu[iso] };
          let changed = false;

          // Fill Breakfast if empty
          if (!dayData.k && !dayData.kdis && !dayData.ksp) {
            const pool = breakfastPool.length > 0 ? breakfastPool : recipes;
            dayData.k = pool[Math.floor(Math.random() * pool.length)].n;
            changed = true;
          }

          // Fill Evening if empty
          if (!dayData.a && !dayData.adis && !dayData.asp) {
            const pool = dinnerPool.length > 0 ? dinnerPool : recipes;
            dayData.a = pool[Math.floor(Math.random() * pool.length)].n;
            changed = true;
          }

          if (changed) {
            newMenu[iso] = dayData;
            count++;
          }
        });

        if (count > 0) {
          set(state => ({
            mutfak: {
              ...state.mutfak,
              menu: newMenu
            }
          }));

        }
      },

      syncMenuToShopping: async (days, factor = 1) => {
        const state = get();
        const { buzdolabi, kiler, dondurucu, alisveris, tarifler } = state.mutfak;
        const currentStock = [...buzdolabi, ...kiler, ...dondurucu];
        let newItems = [...alisveris];
        let addedAny = false;

        days.forEach(day => {
          const dayData = state.mutfak.menu[day.iso] || {};
          ['k', 'a'].forEach(mealKey => {
            const dishName = dayData[mealKey];
            if (!dishName) return;
            const recipe = tarifler.find(r => r.n === dishName);
            if (!recipe || !recipe.ig) return;

            recipe.ig.forEach(line => {
              // Parse "Ingredient:Qty Unit"
              const parts = line.split(':');
              const name = parts[0].trim();
              const qtyStr = parts[1]?.trim() || '';
              const matchNum = qtyStr.match(/[\d.]+/);
              const val = (parseFloat(matchNum?.[0]) || 1) * factor;
              const unit = qtyStr.replace(/[\d.\s]/g, '') || 'adet';

              // Check stock
              const stockItem = currentStock.find(s => s.n.toLowerCase() === name.toLowerCase());
              const inShopping = newItems.find(i => i.nm.toLowerCase() === name.toLowerCase() && !i.dn);

              if (!stockItem || stockItem.cr < val) {
                if (!inShopping) {
                  newItems.push({
                    id: Date.now() + Math.floor(Math.random() * 100000),
                    nm: name,
                    qt: `${val} ${unit}`,
                    mk: 'BİM',
                    dn: false,
                    loc: 'buz'
                  });
                  addedAny = true;
                } else {
                  // Check if existing shopping qty is enough
                  const shopQtStr = String(inShopping.qt || '');
                  const shopMatch = shopQtStr.match(/[\d.]+/);
                  const shopVal = parseFloat(shopMatch?.[0]) || 0;
                  if (shopVal < val) {
                    inShopping.qt = `${val} ${unit}`;
                    addedAny = true;
                  }
                }
              }
            });
          });
        });

        if (addedAny) {
          set({ mutfak: { ...state.mutfak, alisveris: newItems } });

          return true;
        }
        return false;
      },

      // ── Sosyal Actions ──────────────────────────────────
      addSocialActivity: (activity) => {
        const state = get();
        
        // Mükerrer Kontrolü (Aynı gün, aynı başlık)
        const isDuplicate = (state.sosyal.aktiviteler || []).some(
          a => a.tarih === activity.tarih && 
               a.baslik?.toLowerCase().trim() === activity.baslik?.toLowerCase().trim()
        );
        if (isDuplicate) {
          toast.error('Bu aktivite bugün için zaten planlanmış! ⚠️');
          return;
        }

        // Veri Bütünlüğü Koruması: Sadece beklenen alanları al ve tiplerini zorla
        const sanitized = {
          baslik: String(activity.baslik || 'İsimsiz Aktivite'),
          tarih: typeof activity.tarih === 'string' ? activity.tarih : new Date().toISOString().split('T')[0],
          saat: String(activity.saat || '20:00'),
          emoji: String(activity.emoji || '🎭'),
          mekan: String(activity.mekan || ''),
          harcama: Number(activity.harcama || 0),
          tur: String(activity.tur || 'disari'),
          masterCategory: String(activity.masterCategory || 'Genel'),
          kisiSayisi: Number(activity.kisiSayisi || 2),
          tamamlandi: !!activity.tamamlandi,
          durum: activity.tamamlandi ? 'tamamlandi' : 'planda'
        };

        const newActivity = {
          id: 'act-' + Date.now(),
          ...sanitized,
          created_at: new Date().toISOString()
        };

        const currentAkt = Array.isArray(state.sosyal.aktiviteler) ? state.sosyal.aktiviteler : [];
        set({ sosyal: { ...state.sosyal, aktiviteler: [newActivity, ...currentAkt] } });

        pushSosyalEtkinlikToSupabase(newActivity); // Faz 1.2
      },

      updateSocialActivity: (id, updates) => {
        const state = get();
        
        // Sadece izin verilen alanları ve doğru tipleri al
        const cleanUpdates = {};
        const allowedKeys = ['baslik', 'tarih', 'saat', 'emoji', 'mekan', 'harcama', 'tur', 'masterCategory', 'kisiSayisi', 'tamamlandi', 'durum', 'notlar', 'doneDate', 'puan_gorkem', 'puan_esra', 'yorum_gorkem', 'yorum_esra'];
        
        Object.keys(updates).forEach(key => {
          if (allowedKeys.includes(key)) {
            if (['harcama', 'kisiSayisi', 'puan_gorkem', 'puan_esra'].includes(key)) {
              cleanUpdates[key] = Number(updates[key] || 0);
            } else if (key === 'tamamlandi') {
              cleanUpdates[key] = !!updates[key];
            } else {
              cleanUpdates[key] = String(updates[key] || '');
            }
          }
        });

        const aktList = Array.isArray(state.sosyal.aktiviteler) ? state.sosyal.aktiviteler : [];
        let updatedActivity = null;
        const updatedAktiviteler = aktList.map(a => {
          if (a.id === id) {
            updatedActivity = { ...a, ...cleanUpdates };
            return updatedActivity;
          }
          return a;
        });
        
        set({ sosyal: { ...state.sosyal, aktiviteler: updatedAktiviteler } });

        if (updatedActivity) pushSosyalEtkinlikToSupabase(updatedActivity); // Faz 1.2
      },

      completeSocialActivity: (id, pGorkem, pEsra, cost = 0, commentGorkem = '', commentEsra = '', paymentInfo = null) => {
        const state = get();
        const aktList2 = Array.isArray(state.sosyal.aktiviteler) ? state.sosyal.aktiviteler : [];
        const act = aktList2.find(x => x.id === id);
        if (!act) return;

        const completionDate = new Date().toISOString();
        const yeniAktiviteler = aktList2.map(a =>
          a.id === id ? {
            ...a,
            tamamlandi: true,
            durum: 'tamamlandi',
            puan_gorkem: Number(pGorkem),
            puan_esra: Number(pEsra),
            harcama: Number(cost),
            yorum_gorkem: commentGorkem,
            yorum_esra: commentEsra,
            doneDate: completionDate
          } : a
        );

        // 1. Finance Integration
        if (cost > 0) {
          get().addExpense({
            title: `🌟 Aktivite: ${act.baslik || act.title || 'İsimsiz'}`,
            amount: Number(cost),
            category: 'Sosyal Aktivite',
            payer: 'ortak',
            source: 'Sosyal',
            dt: completionDate.split('T')[0],
            ...(paymentInfo ? { defaultPay: paymentInfo } : {})
          });
        }

        // 2. Pool Stats Update
        const yeniHavuz = (Array.isArray(state.sosyal.havuz) ? state.sosyal.havuz : []).map(p => {
          const poolTitle = (p.baslik || p.title || '').toLowerCase();
          const actTitle = (act.baslik || act.title || '').toLowerCase();
          
          if (poolTitle && actTitle && poolTitle === actTitle) {
            return {
              ...p,
              count: (p.count || 0) + 1,
              last: `${new Date().toLocaleDateString('tr-TR')} · ${cost}₺`
            };
          }
          return p;
        });

        set({ sosyal: { ...state.sosyal, aktiviteler: yeniAktiviteler, havuz: yeniHavuz } });

        const updatedActivity = yeniAktiviteler.find(a => String(a.id) === String(id));
        if (updatedActivity) pushSosyalEtkinlikToSupabase(updatedActivity);
      },

      cancelSocialActivity: (id) => {
        const state = get();
        const aktList3 = Array.isArray(state.sosyal.aktiviteler) ? state.sosyal.aktiviteler : [];
        const yeniAktiviteler = aktList3.filter(a => String(a.id) !== String(id));
        set({ sosyal: { ...state.sosyal, aktiviteler: yeniAktiviteler } });

        removeSosyalEtkinlikFromSupabase(id);
      },

      addSocialPoolItem: (item) => {
        const state = get();
        // Mükerrer Kontrolü (Aynı başlık)
        const isDuplicate = (state.sosyal.havuz || []).some(
          h => h.title?.toLowerCase().trim() === (item.baslik || item.title)?.toLowerCase().trim()
        );
        if (isDuplicate) {
          toast.error('Bu fikir havuzda zaten mevcut! ⚠️');
          return;
        }

        const newItem = {
          id: Date.now(),
          title: item.baslik || item.title,
          icon: item.emoji || item.icon || '💡',
          type: item.tur || item.type || 'Eğlence',
          frequency: item.freq || item.frequency || 'Ayda 1',
          count: 0,
          lastDone: null
        };
        const currentHavuz = Array.isArray(state.sosyal.havuz) ? state.sosyal.havuz : [];
        set({ sosyal: { ...state.sosyal, havuz: [newItem, ...currentHavuz] } });

        
        // SQL Sync
        pushGenericToSupabase('sosyal_havuz', {
          id: String(newItem.id),
          baslik: newItem.title,
          tur: newItem.type,
          emoji: newItem.icon,
          freq: newItem.frequency,
          count: 0
        });
      },

      updateSocialPoolItem: (id, updates) => {
        const state = get();
        const havuz = Array.isArray(state.sosyal.havuz) ? state.sosyal.havuz : [];
        const newHavuz = havuz.map(item => item.id === id ? { ...item, ...updates } : item);
        set({ sosyal: { ...state.sosyal, havuz: newHavuz } });


        const updated = newHavuz.find(i => i.id === id);
        if (updated) {
          pushGenericToSupabase('sosyal_havuz', {
            id: String(updated.id),
            baslik: updated.title,
            tur: updated.type,
            emoji: updated.icon,
            freq: updated.frequency,
            count: updated.count,
            last_done: updated.lastDone
          });
        }
      },

      deleteSocialPoolItem: (id) => {
        const state = get();
        const currentHavuz = Array.isArray(state.sosyal.havuz) ? state.sosyal.havuz : [];
        const currentPoolItems = Array.isArray(state.sosyal.poolItems) ? state.sosyal.poolItems : [];

        set({
          sosyal: {
            ...state.sosyal,
            havuz: currentHavuz.filter(i => String(i.id) !== String(id)),
            poolItems: currentPoolItems.filter(i => String(i.id) !== String(id))
          }
        });

        removeGenericFromSupabase('sosyal_havuz', id);
      },

      addSocialRoutinePackage: (pkg) => {
        const state = get();
        // Mükerrer Kontrolü (Aynı isimli paket)
        const isDuplicate = (state.sosyal.routinePackages || []).some(
          p => p.name?.toLowerCase().trim() === pkg.name?.toLowerCase().trim()
        );
        if (isDuplicate) {
          toast.error('Bu isimde bir rutin paketi zaten mevcut! ⚠️');
          return;
        }

        const newPkg = { 
          id: 'rp-' + Date.now(), 
          ...pkg,
          items: Array.isArray(pkg.items) ? pkg.items : [] 
        };
        const currentPkgs = Array.isArray(state.sosyal.routinePackages) ? state.sosyal.routinePackages : [];
        set({ sosyal: { ...state.sosyal, routinePackages: [newPkg, ...currentPkgs] } });

        pushGenericToSupabase('sosyal_rutin_paketleri', newPkg);
      },

      updateSocialRoutinePackage: (id, updates) => {
        const state = get();
        const pkgs = Array.isArray(state.sosyal.routinePackages) ? state.sosyal.routinePackages : [];
        const newPkgs = pkgs.map(p => p.id === id ? { ...p, ...updates } : p);
        set({ sosyal: { ...state.sosyal, routinePackages: newPkgs } });

        
        const updatedPkg = newPkgs.find(p => p.id === id);
        if (updatedPkg) pushGenericToSupabase('sosyal_rutin_paketleri', updatedPkg);
      },

      deleteSocialRoutinePackage: (id) => {
        const state = get();
        const currentPkgs = Array.isArray(state.sosyal.routinePackages) ? state.sosyal.routinePackages : [];
        set({ sosyal: { ...state.sosyal, routinePackages: currentPkgs.filter(p => String(p.id) !== String(id)) } });

        removeGenericFromSupabase('sosyal_rutin_paketleri', id);
      },

      applySocialRoutine: (routine, startDate) => {
        const state = get();
        const { addSocialActivity } = get();

        routine.items.forEach((itemTitle, index) => {
          // Find activity info from pool or use defaults
          const poolItem = (state.sosyal.poolItems || []).find(h => h.title === itemTitle) ||
            (INITIAL_SOCIAL_POOL || []).find(p => p.title === itemTitle);

          addSocialActivity({
            baslik: itemTitle,
            tarih: startDate,
            saat: index === 0 ? '10:00' : index === 1 ? '14:00' : '20:00',
            emoji: poolItem?.icon || '🎭',
            tur: 'disari',
            harcama: 0,
            kisiSayisi: 2,
            masterCategory: poolItem?.category || 'Genel'
          });
        });
      },


      addRutin: (rutin) => {
        const state = get();
        // Mükerrer Kontrolü (Aynı isimli rutin)
        const isDuplicate = (state.sosyal.rutinler || []).some(
          r => r.aktivite?.toLowerCase().trim() === rutin.aktivite?.toLowerCase().trim()
        );
        if (isDuplicate) {
          toast.error('Bu isimde bir rutin zaten mevcut! ⚠️');
          return;
        }

        // SQL tablosuyla uyumlu hale getir (vakit alanını ekle)
        const sanitizedRutin = {
          id: String(Date.now()),
          aktivite: rutin.aktivite,
          kisi: rutin.kisi,
          vakit: rutin.vakit || 'sabah',
          gunler: Array.isArray(rutin.gunler) ? rutin.gunler : [],
          saati: rutin.saati || '09:00',
          ucret: Number(rutin.ucret || 0)
        };
        const currentRut = Array.isArray(state.sosyal.rutinler) ? state.sosyal.rutinler : [];
        set({ sosyal: { ...state.sosyal, rutinler: [sanitizedRutin, ...currentRut] } });

        pushGenericToSupabase('sosyal_rutinler', sanitizedRutin);
      },

      deleteRutin: (id) => {
        const state = get();
        const yeniRutinler = state.sosyal.rutinler.filter(r => r.id !== id);
        set({ sosyal: { ...state.sosyal, rutinler: yeniRutinler } });

        removeGenericFromSupabase('sosyal_rutinler', id);
      },


      // ── Ev Actions ─────────────────────────────────────
      addFatura: (fatura, paymentInfo) => {
        const state = get();
        const newFatura = {
          id: Date.now(),
          status: 'Bekliyor',
          ...fatura
        };

        const updatedFaturalar = [newFatura, ...(state.ev.faturalar || [])];
        set({ ev: { ...state.ev, faturalar: updatedFaturalar } });

        // Finance Integration
        get().addExpense({
          title: `Fatura: ${fatura.name}`,
          amount: Number(fatura.amount),
          category: 'fatura',
          source: 'Fatura Girişi',
          payer: fatura.user || 'ortak',
          defaultPay: paymentInfo
        });

        pushGenericToSupabase('ev_faturalar', newFatura);
        toast.success('Fatura kaydedildi ve Finans\'a aktarıldı! 🧾');
      },

      payFatura: (id) => {
        const state = get();
        const fatura = state.ev.faturalar.find(f => f.id === id);
        if (!fatura) return;

        const updatedFaturalar = state.ev.faturalar.map(f =>
          f.id === id ? { ...f, status: 'Ödendi' } : f
        );

        set({ ev: { ...state.ev, faturalar: updatedFaturalar } });

        const updatedFatura = updatedFaturalar.find(f => f.id === id);
        if (updatedFatura) pushGenericToSupabase('ev_faturalar', updatedFatura);
        toast.success(`${fatura.name} faturası ödendi! 💸`);
      },


      addTasinmaz: (item) => {
        const state = get();
        const newItem = {
          id: Date.now(),
          value: 0,
          tax: 0,
          income: 0,
          expense: 0,
          aidat: 0,
          icon: '🏠',
          status: 'Mülk Sahibi',
          taxPaid1: false,
          taxPaid2: false,
          daskExpiry: '',
          daskFile: null,
          lastUpdate: new Date().toISOString().split('T')[0],
          ...item
        };

        // Auto-sync with Finance
        let updatedDuzenli = [...(state.ev.duzenliOdemeler || [])];
        if (newItem.aidat > 0) {
          updatedDuzenli.push({
            id: `tasinmaz-aidat-${newItem.id}`,
            name: `${newItem.name} Aidatı`,
            amount: Number(newItem.aidat),
            date: 1,
            linkedCardId: '',
            autoPay: false,
            icon: '🏢',
            isTasinmazSync: true
          });
        }

        let updatedRekurans = [...(state.finans.rekurans || [])];
        if (newItem.income > 0 && newItem.status === 'Kiracı Var') {
          updatedRekurans.push({
            id: `tasinmaz-kira-${newItem.id}`,
            title: `${newItem.name} Kirası`,
            amount: Number(newItem.income),
            category: 'Kira Geliri',
            date: new Date().toISOString().split('T')[0],
            icon: '💰',
            owner: 'ortak',
            paid: false,
            isTasinmazSync: true
          });
        }

        set({
          kasa: { ...state.kasa, tasinmazlar: [...state.kasa.tasinmazlar, newItem] },
          ev: { ...state.ev, duzenliOdemeler: updatedDuzenli },
          finans: { ...state.finans, rekurans: updatedRekurans }
        });

        const dbPayload = {
          id: newItem.id,
          name: newItem.name,
          city: newItem.city,
          district: newItem.district,
          type: newItem.type || 'Konut',
          value: Number(newItem.value || 0),
          income: Number(newItem.income || 0),
          expense: Number(newItem.expense || 0),
          details: {
            tax: newItem.tax,
            aidat: newItem.aidat,
            icon: newItem.icon,
            status: newItem.status,
            taxPaid1: newItem.taxPaid1,
            taxPaid2: newItem.taxPaid2,
            daskExpiry: newItem.daskExpiry,
            daskFile: newItem.daskFile,
            lastUpdate: newItem.lastUpdate
          }
        };

        pushGenericToSupabase('kasa_tasinmazlar', dbPayload);
        if (newItem.aidat > 0) pushEvDuzenliOdemeToSupabase(updatedDuzenli[updatedDuzenli.length - 1]);
        if (newItem.income > 0 && newItem.status === 'Kiracı Var') pushFinansRekuransToSupabase(updatedRekurans[updatedRekurans.length - 1]);
        toast.success('Yeni taşınmaz portföye eklendi ve finansal takibe alındı! 🏗️');
      },

      updateTasinmaz: (id, updates) => {
        const state = get();
        const tasinmaz = state.kasa.tasinmazlar.find(t => t.id === id);
        if (!tasinmaz) return;

        const updatedTasinmazlar = state.kasa.tasinmazlar.map(t =>
          t.id === id ? { ...t, ...updates, lastUpdate: new Date().toISOString().split('T')[0] } : t
        );

        // Sync with Finance (Aidat)
        let updatedDuzenli = (state.ev.duzenliOdemeler || []).filter(d => d.id !== `tasinmaz-aidat-${id}`);
        const finalAidat = updates.aidat !== undefined ? updates.aidat : tasinmaz.aidat;
        const finalName = updates.name !== undefined ? updates.name : tasinmaz.name;

        if (Number(finalAidat) > 0) {
          updatedDuzenli.push({
            id: `tasinmaz-aidat-${id}`,
            name: `${finalName} Aidatı`,
            amount: Number(finalAidat),
            date: 1,
            linkedCardId: '',
            autoPay: false,
            icon: '🏢',
            isTasinmazSync: true
          });
        }

        // Sync with Finance (Kira)
        let updatedRekurans = (state.finans.rekurans || []).filter(r => r.id !== `tasinmaz-kira-${id}`);
        const finalIncome = updates.income !== undefined ? updates.income : tasinmaz.income;
        const finalStatus = updates.status !== undefined ? updates.status : tasinmaz.status;

        if (Number(finalIncome) > 0 && finalStatus === 'Kiracı Var') {
          updatedRekurans.push({
            id: `tasinmaz-kira-${id}`,
            title: `${finalName} Kirası`,
            amount: Number(finalIncome),
            category: 'Kira Geliri',
            date: new Date().toISOString().split('T')[0],
            icon: '💰',
            owner: 'ortak',
            paid: false,
            isTasinmazSync: true
          });
        }

        set({
          kasa: { ...state.kasa, tasinmazlar: updatedTasinmazlar },
          ev: { ...state.ev, duzenliOdemeler: updatedDuzenli },
          finans: { ...state.finans, rekurans: updatedRekurans }
        });

        const updatedTasinmaz = updatedTasinmazlar.find(t => t.id === id);
        if (updatedTasinmaz) {
          const dbPayload = {
            id: updatedTasinmaz.id,
            name: updatedTasinmaz.name,
            city: updatedTasinmaz.city,
            district: updatedTasinmaz.district,
            type: updatedTasinmaz.type || 'Konut',
            value: Number(updatedTasinmaz.value || 0),
            income: Number(updatedTasinmaz.income || 0),
            expense: Number(updatedTasinmaz.expense || 0),
            details: {
              tax: updatedTasinmaz.tax,
              aidat: updatedTasinmaz.aidat,
              icon: updatedTasinmaz.icon,
              status: updatedTasinmaz.status,
              taxPaid1: updatedTasinmaz.taxPaid1,
              taxPaid2: updatedTasinmaz.taxPaid2,
              daskExpiry: updatedTasinmaz.daskExpiry,
              daskFile: updatedTasinmaz.daskFile,
              lastUpdate: updatedTasinmaz.lastUpdate
            }
          };
          pushGenericToSupabase('kasa_tasinmazlar', dbPayload);
          
          const aidatItem = updatedDuzenli.find(d => d.id === `tasinmaz-aidat-${id}`);
          if (aidatItem) pushEvDuzenliOdemeToSupabase(aidatItem);
          else deleteEvDuzenliOdemeFromSupabase(`tasinmaz-aidat-${id}`);

          const kiraItem = updatedRekurans.find(r => r.id === `tasinmaz-kira-${id}`);
          if (kiraItem) pushFinansRekuransToSupabase(kiraItem);
          else deleteFinansRekuransFromSupabase(`tasinmaz-kira-${id}`);
        }
      },

      deleteTasinmaz: (id) => {
        const state = get();
        const updatedTasinmazlar = state.kasa.tasinmazlar.filter(t => t.id !== id);
        const updatedDuzenli = (state.ev.duzenliOdemeler || []).filter(d => d.id !== `tasinmaz-aidat-${id}`);
        const updatedRekurans = (state.finans.rekurans || []).filter(r => r.id !== `tasinmaz-kira-${id}`);

        set({
          kasa: { ...state.kasa, tasinmazlar: updatedTasinmazlar },
          ev: { ...state.ev, duzenliOdemeler: updatedDuzenli },
          finans: { ...state.finans, rekurans: updatedRekurans }
        });

        removeGenericFromSupabase('kasa_tasinmazlar', id);
        deleteEvDuzenliOdemeFromSupabase(`tasinmaz-aidat-${id}`);
        deleteFinansRekuransFromSupabase(`tasinmaz-kira-${id}`);
        toast.success('Taşınmaz kaydı ve ilgili finansal takipçiler silindi.');
      },

      addOnarimItem: (itemData, userKey) => {
        const currentEv = get().ev || {};
        const taskText = typeof itemData === 'string' ? itemData : itemData.task;
        const newItem = {
          id: Date.now().toString(),
          task: taskText,
          assignedTo: typeof itemData === 'object' ? itemData.assignedTo : null,
          dueDate: typeof itemData === 'object' ? itemData.dueDate : null,
          status: 'Pending',
          createdBy: userKey || 'gorkem',
          createdAt: new Date().toISOString(),
          completedBy: null,
          completedAt: null,
          clearedBy: null,
          clearedAt: null,
          isArchived: false
        };

        const currentList = Array.isArray(currentEv.onarimListesi) ? currentEv.onarimListesi : [];
        const newList = [newItem, ...currentList];

        set({ ev: { ...currentEv, onarimListesi: newList } });

        pushEvOnarimToSupabase(newItem);
        toast.success(`"${taskText}" listeye eklendi! 📋`);
      },

      toggleOnarimItem: (id, userKey) => {
        const currentEv = get().ev || {};
        const currentList = Array.isArray(currentEv.onarimListesi) ? currentEv.onarimListesi : [];

        const newList = currentList.map(item => {
          if (item.id === id) {
            const isCompleting = item.status !== 'Completed';
            return {
              ...item,
              status: isCompleting ? 'Completed' : 'Pending',
              completedBy: isCompleting ? userKey : null,
              completedAt: isCompleting ? new Date().toISOString() : null
            };
          }
          return item;
        });

        set({ ev: { ...currentEv, onarimListesi: newList } });

        const updatedItem = newList.find(i => i.id === id);
        if (updatedItem) pushEvOnarimToSupabase(updatedItem);
      },

      updateOnarimItem: (id, itemData) => {
        const currentEv = get().ev || {};
        const currentList = Array.isArray(currentEv.onarimListesi) ? currentEv.onarimListesi : [];

        const newList = currentList.map(item => {
          if (item.id === id) {
            return {
              ...item,
              task: typeof itemData === 'string' ? itemData : itemData.task,
              assignedTo: typeof itemData === 'object' ? itemData.assignedTo : item.assignedTo,
              dueDate: typeof itemData === 'object' ? itemData.dueDate : item.dueDate
            };
          }
          return item;
        });

        set({ ev: { ...currentEv, onarimListesi: newList } });

        const updatedItem = newList.find(i => i.id === id);
        if (updatedItem) pushEvOnarimToSupabase(updatedItem);
        toast.success('Görev güncellendi! ✏️');
      },

      clearCompletedOnarimItems: (userKey) => {
        const state = get();
        const currentEv = state.ev || {};
        const currentList = Array.isArray(currentEv.onarimListesi) ? currentEv.onarimListesi : [];

        const newList = currentList.map(item => {
          if (item.status === 'Completed' && !item.isArchived) {
            return {
              ...item,
              isArchived: true,
              clearedBy: userKey,
              clearedAt: new Date().toISOString()
            };
          }
          return item;
        });

        set({ ev: { ...currentEv, onarimListesi: newList } });

        newList.filter(i => i.isArchived).forEach(i => pushEvOnarimToSupabase(i));
        toast.success('Tamamlanan görevler arşivlendi! ✨');
      },

      // Legacy support for toggleHomeTask if needed elsewhere
      toggleHomeTask: (listType, id) => {
        const state = get();
        const list = state.ev[listType].map(item =>
          item.id === id ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' } : item
        );
        set({ ev: { ...state.ev, [listType]: list } });

      },

      deleteHomeTask: (listType, id) => {
        const state = get();
        const list = state.ev[listType].filter(item => item.id !== id);
        set({ ev: { ...state.ev, [listType]: list } });


        // SQL Sync
        if (listType === 'duzenliOdemeler') deleteEvDuzenliOdemeFromSupabase(id);
        else if (listType === 'abonelikler') deleteEvAbonelikFromSupabase(id);
        else if (listType === 'demirbaslar') deleteEvDemirbasFromSupabase(id);
      },

      updateHomeSecurity: (updates) => {
        const state = get();
        const newGuvenlik = { ...state.ev.guvenlik, ...updates };
        set({ ev: { ...state.ev, guvenlik: newGuvenlik } });
        
        pushGenericToSupabase('ev_ayarlar', { id: 'guvenlik', veri: newGuvenlik });
      },

      addPeriodicBakim: (item) => {
        const currentEv = get().ev || {};
        const currentBakimlar = Array.isArray(currentEv.bakimlar) ? currentEv.bakimlar : [];
        const newItem = {
          id: Date.now().toString(),
          lastDate: new Date().toISOString().split('T')[0],
          ...item
        };

        set({ ev: { ...currentEv, bakimlar: [...currentBakimlar, newItem] } });

        pushEvBakimToSupabase(newItem);
        toast.success('Yeni periyodik bakım eklendi! 🔄');
      },

      updatePeriodicBakim: (id, updates) => {
        const currentEv = get().ev || {};
        const currentBakimlar = Array.isArray(currentEv.bakimlar) ? currentEv.bakimlar : [];

        const updated = currentBakimlar.map(b =>
          b.id === id ? { ...b, ...updates } : b
        );

        set({ ev: { ...currentEv, bakimlar: updated } });

        const updatedItem = updated.find(b => b.id === id);
        if (updatedItem) pushEvBakimToSupabase(updatedItem);
        toast.success('Bakım bilgileri güncellendi! 💾');
      },

      resetPeriodicBakim: (id) => {
        const currentEv = get().ev || {};
        const currentBakimlar = Array.isArray(currentEv.bakimlar) ? currentEv.bakimlar : [];

        const updated = currentBakimlar.map(b =>
          b.id === id ? { ...b, lastDate: new Date().toISOString().split('T')[0] } : b
        );

        set({ ev: { ...currentEv, bakimlar: updated } });

        const updatedItem = updated.find(b => b.id === id);
        if (updatedItem) pushEvBakimToSupabase(updatedItem);
        toast.success('Bakım zamanlayıcısı sıfırlandı! 🕒');
      },

      deletePeriodicBakim: (id) => {
        const currentEv = get().ev || {};
        const currentBakimlar = Array.isArray(currentEv.bakimlar) ? currentEv.bakimlar : [];
        const updated = currentBakimlar.filter(b => b.id !== id);

        set({ ev: { ...currentEv, bakimlar: updated } });

        deleteEvBakimFromSupabase(id);
        toast.success('Bakım kaydı silindi.');
      },

      deleteOnarimItem: (id) => {
        const currentEv = get().ev || {};
        const currentList = Array.isArray(currentEv.onarimListesi) ? currentEv.onarimListesi : [];
        const updated = currentList.filter(item => item.id !== id);
        set({ ev: { ...currentEv, onarimListesi: updated } });

        deleteEvOnarimFromSupabase(id);
        toast.success('Onarım kaydı arşivden silindi.');
      },

      deleteAlisverisItem: (id, listKey) => {
        const currentMutfak = get().mutfak || {};
        const currentList = Array.isArray(currentMutfak.alisveris?.[listKey]) ? currentMutfak.alisveris[listKey] : [];
        const updated = currentList.filter(item => item.id !== id);
        set({ mutfak: { ...currentMutfak, alisveris: { ...currentMutfak.alisveris, [listKey]: updated } } });

        toast.success('Alışveriş kaydı silindi.');
      },

      deleteVaccineHistory: (petName, vaccineName, hDate) => {
        const currentPet = get().pet || {};
        const currentVaccines = Array.isArray(currentPet.vaccines?.[petName]) ? currentPet.vaccines[petName] : [];

        const updated = currentVaccines.map(v => {
          if (v.n === vaccineName) {
            return { ...v, h: (v.h || []).filter(date => date !== hDate) };
          }
          return v;
        });

        set({ pet: { ...currentPet, vaccines: { ...currentPet.vaccines, [petName]: updated } } });

        toast.success('Aşı geçmişi silindi.');
      },

      // ── Yaşam & Tracking Actions ────────────────────────
      updateLocationSettings: (type, updates) => {
        const state = get();
        const userKey = state.currentUser?.name?.toLowerCase().includes('esra') ? 'esra' : 'gorkem';
        const currentEv = state.ev || {};
        const globalTracking = currentEv.tracking || {};
        const userTracking = globalTracking[userKey] || {};
        
        // Default radius values if not exist
        const defaultRadius = type === 'home' ? 150 : 250;

        const newUserTracking = {
          ...userTracking,
          [type]: { 
            radius: defaultRadius, 
            ...(userTracking[type] || {}), 
            ...updates 
          }
        };

        const newTracking = {
          ...globalTracking,
          [userKey]: newUserTracking
        };

        set({
          ev: {
            ...currentEv,
            tracking: newTracking
          }
        });

        pushGenericToSupabase('ev_ayarlar', { id: 'tracking_settings', veri: newTracking });
        toast.success(`${type === 'home' ? 'Ev' : 'İş'} konumu güncellendi! 📍`);
      },

      addLocation: (location) => {
        const state = get();
        const tracking = state.ev.tracking || {};
        const saved = Array.isArray(tracking.savedLocations) ? tracking.savedLocations : [];
        const newLoc = { id: Date.now(), ...location };
        
        set({
          ev: {
            ...state.ev,
            tracking: { ...tracking, savedLocations: [newLoc, ...saved] }
          }
        });

        pushGenericToSupabase('ev_saved_locations', newLoc);
        toast.success('Yeni konum kaydedildi! 📍');
      },

      updateLocation: (id, updates) => {
        const state = get();
        const tracking = state.ev.tracking || {};
        const saved = (tracking.savedLocations || []).map(l => 
          l.id === id ? { ...l, ...updates } : l
        );
        
        set({
          ev: {
            ...state.ev,
            tracking: { ...tracking, savedLocations: saved }
          }
        });

        const updated = saved.find(l => l.id === id);
        if (updated) pushGenericToSupabase('ev_saved_locations', updated);
        toast.success('Konum güncellendi! 📍');
      },

      deleteLocation: (id) => {
        const state = get();
        const tracking = state.ev.tracking || {};
        const saved = (tracking.savedLocations || []).filter(l => l.id !== id);
        
        set({
          ev: {
            ...state.ev,
            tracking: { ...tracking, savedLocations: saved }
          }
        });

        removeGenericFromSupabase('ev_saved_locations', id);
        toast.success('Konum silindi.');
      },

      logTimeSlice: (type, minutes = 15) => {
        const state = get();
        const currentEv = state.ev || {};
        const tracking = currentEv.tracking || { logs: [] };
        const now = Date.now();
        const today = new Date().toISOString().split('T')[0];

        // Perform once every 15 mins unless type changed
        if (tracking.lastCheck && (now - tracking.lastCheck.timestamp < 15 * 60 * 1000) && tracking.lastCheck.type === type) {
          return;
        }

        let updatedLogs = [...(tracking.logs || [])];

        // Check if we are on a trip
        const isOnTrip = (state.tatil?.trips || []).some(t => {
          const start = new Date(t.startDate).getTime();
          const end = new Date(t.endDate).getTime() + (24 * 60 * 60 * 1000);
          return now >= start && now <= end;
        });

        const effectiveType = isOnTrip ? 'tatil' : type;

        // Smart Gap Filling: Up to 12 hours
        if (tracking.lastCheck && tracking.lastCheck.type === effectiveType) {
          const gapMs = now - tracking.lastCheck.timestamp;
          const gapMinutes = Math.floor(gapMs / (60 * 1000));

          if (gapMinutes > 15 && gapMinutes < 720) {
            const sliceCount = Math.floor(gapMinutes / 15);
            for (let i = 1; i <= sliceCount; i++) {
              updatedLogs.unshift({
                date: new Date(tracking.lastCheck.timestamp + (i * 15 * 60 * 1000)).toISOString().split('T')[0],
                type: effectiveType,
                durationMinutes: 15,
                timestamp: tracking.lastCheck.timestamp + (i * 15 * 60 * 1000)
              });
            }
          }
        }

        const userId = state.currentUser?.id || (state.currentUser?.name?.toLowerCase().includes('esra') ? 'esra' : 'gorkem');
        const newLog = { date: today, type: effectiveType, durationMinutes: minutes, timestamp: now, user: userId };
        updatedLogs = [newLog, ...updatedLogs].slice(0, 5000);

        const dateObj = new Date(now);
        const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
        const hour = dateObj.getHours().toString().padStart(2, '0');
        const habitKey = `${day}-${hour}`;

        const userHabits = tracking.userHabits || {};
        const currentHabits = userHabits[userId] || {};
        const slot = currentHabits[habitKey] || { home: 0, work: 0, other: 0, tatil: 0 };
        slot[effectiveType] = (slot[effectiveType] || 0) + 1;

        set({
          ev: {
            ...currentEv,
            tracking: {
              ...tracking,
              logs: updatedLogs,
              lastCheck: { type: effectiveType, timestamp: now },
              userHabits: { ...userHabits, [userId]: { ...currentHabits, [habitKey]: slot } }
            }
          }
        });

      },

      updateCachedAnalysis: (analysisData) => {
        const currentEv = get().ev || {};
        const tracking = currentEv.tracking || {};
        set({
          ev: {
            ...currentEv,
            tracking: {
              ...tracking,
              ...analysisData
            }
          }
        });

      },

      savePersonalityResults: (testId, traits) => {
        const state = get();
        const userKey = state.currentUser?.name?.toLowerCase().includes('esra') ? 'esra' : 'gorkem';
        const currentEv = state.ev || {};
        const tracking = currentEv.tracking || {};
        const globalPersonality = tracking.personality || {};
        const userPersonality = globalPersonality[userKey] || { results: {}, history: [] };
        const today = new Date().toISOString();

        // Context-aware type determination
        let type = "Gelişmekte Olan";
        if (testId === 'big5') {
          if (traits.extraversion > 3.5) type = "Sosyal Keşifçi";
          else if (traits.conscientiousness > 4) type = "Planlı Stratejist";
          else if (traits.openness > 4) type = "Yaratıcı Vizyoner";
          else if (traits.agreeableness > 4) type = "Uyumlu Arabulucu";
        } else if (testId === 'leader') {
          if (traits.authority > 4) type = "Otoriter Karar Verici";
          else if (traits.vision > 4) type = "Stratejik Vizyoner";
        } else if (testId === 'eq') {
          if (traits.empathy > 4) type = "Empati Ustası";
        }

        const newResults = {
          ...userPersonality.results,
          [testId]: { traits, type, date: today }
        };

        const newHistoryItem = { testId, traits, type, date: today };
        const newHistory = [newHistoryItem, ...(userPersonality.history || [])].slice(0, 50);

        const newGlobalPersonality = {
          ...globalPersonality,
          [userKey]: { results: newResults, history: newHistory, lastUpdated: today }
        };
        
        set({
          ev: {
            ...currentEv,
            tracking: {
              ...tracking,
              personality: newGlobalPersonality
            }
          }
        });

        // SYNC FIX: Persist personality results to Supabase
        pushGenericToSupabase('ev_tracking', { id: 'personality', veri: newGlobalPersonality });
      },

      updateTrackingRoutine: (updates) => {
        const currentEv = get().ev || {};
        const tracking = currentEv.tracking || {};
        const newRoutine = { ...(tracking.routine || {}), ...updates };
        set({ ev: { ...currentEv, tracking: { ...tracking, routine: newRoutine } } });

        pushGenericToSupabase('ev_ayarlar', { id: 'tracking_routine', veri: newRoutine });
      },

      // ── Eraylar Garaj Actions ──────────────────────────
      updateKM: (newKM) => {
        const state = get();
        const currentGaraj = Array.isArray(state.garaj) ? state.garaj : [];
        const targetId = state.selectedVehicleId || (currentGaraj[0]?.id);

        if (!targetId) {
          toast.error("Güncellenecek araç bulunamadı.");
          return;
        }

        const kmVal = Number(newKM);
        if (isNaN(kmVal)) {
          toast.error("Geçersiz kilometre değeri.");
          return;
        }

        const updatedGaraj = currentGaraj.map(v =>
          String(v.id) === String(targetId) ? { ...v, km: kmVal } : v
        );

        set({ garaj: updatedGaraj });
        get().addLog('Garaj', `Kilometre güncellendi: ${kmVal} KM`);

      },

      addFuelLog: (log, paymentInfo = null) => {
        const state = get();
        const targetId = state.selectedVehicleId || (state.garaj[0]?.id) || 'v1';
        const vehicle = state.garaj.find(v => v.id === targetId) || state.garaj[0];
        if (!vehicle) return;

        const fuelLogsList = vehicle.fuelLogs || [];
        const lastLog = fuelLogsList[0];
        let consumption = 0;
        if (lastLog) {
          const kmDiff = log.km - lastLog.km;
          if (kmDiff > 0) {
            consumption = (log.amount / kmDiff) * 100;
          }
        }

        const newLog = {
          id: Date.now(),
          consumption: consumption > 0 ? consumption.toFixed(1) : "0.0",
          ...log
        };

        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicle.id
            ? {
              ...v,
              km: Math.max(v.km, Number(log.km)),
              fuelLogs: [newLog, ...(v.fuelLogs || [])].slice(0, 50)
            }
            : v
        );

        set({ garaj: updatedGaraj });

        get().addExpense({
          title: `Yakıt: ${log.station} (${vehicle.model})`,
          amount: log.amount * log.price,
          category: 'arac',
          source: 'Garaj',
          dt: log.date,
          ...(paymentInfo ? { defaultPay: paymentInfo } : {})
        });

        pushGarajYakitToSupabase(newLog, vehicle.id);
      },

      addServiceRecord: (record, paymentInfo = null) => {
        const state = get();
        const targetId = state.selectedVehicleId || (state.garaj[0]?.id) || 'v1';
        const vehicle = state.garaj.find(v => v.id === targetId) || state.garaj[0];
        if (!vehicle) return;

        const newRecord = { id: Date.now(), ...record };
        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicle.id
            ? {
              ...v,
              km: Math.max(v.km, Number(record.km)),
              services: [newRecord, ...(v.services || [])]
            }
            : v
        );

        set({ garaj: updatedGaraj });

        get().addExpense({
          title: `Servis: ${record.title} (${vehicle.model})`,
          amount: record.cost,
          category: 'arac',
          source: 'Garaj',
          dt: record.date,
          ...(paymentInfo ? { defaultPay: paymentInfo } : {})
        });

        pushGarajServisToSupabase(newRecord, vehicle.id);
      },

      addVehicle: (vehicle) => {
        const state = get();
        const newVehicle = {
          id: Date.now().toString(),
          km: 0,
          parts: [
            { id: 'oil', name: 'Motor Yağı', lastKM: 0, intervalKM: 15000, lastDate: '', intervalDays: 365, icon: '🛢️' },
            { id: 'filter', name: 'Hava Filtresi', lastKM: 0, intervalKM: 15000, lastDate: '', intervalDays: 365, icon: '🌪️' }
          ],
          fuelLogs: [],
          services: [],
          documents: [],
          parkLocation: { lat: null, lng: null, note: '', floor: '', spot: '', active: false },
          ...vehicle
        };
        set({ garaj: [...state.garaj, newVehicle], selectedVehicleId: newVehicle.id });
        get().addLog('Garaj', `Yeni araç eklendi: ${vehicle.model}`);
        pushGarajAracToSupabase(newVehicle);
      },

      updateVehicle: (id, updates) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v => String(v.id) === String(id) ? { ...v, ...updates } : v);
        set({ garaj: updatedGaraj });
        const vehicle = updatedGaraj.find(v => String(v.id) === String(id));
        if (vehicle) pushGarajAracToSupabase(vehicle);
      },

      deleteVehicle: (id) => {
        const state = get();
        const updatedGaraj = state.garaj.filter(v => v.id !== id);
        const nextId = updatedGaraj.length > 0 ? updatedGaraj[0].id : null;
        set({ garaj: updatedGaraj, selectedVehicleId: nextId });
        deleteGarajAracFromSupabase(id);
      },

      addWashRecord: (vehicleId, { price, date }, paymentInfo = null) => {
        const state = get();
        const vehicle = state.garaj.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicleId ? { ...v, lastCleaned: date } : v
        );

        set({ garaj: updatedGaraj });

        if (price > 0) {
          get().addExpense({
            title: `Yıkama: ${vehicle.model}`,
            amount: price,
            category: 'arac',
            date: date,
            source: 'Garaj',
            ...(paymentInfo ? { defaultPay: paymentInfo } : {})
          });
        }


      },

      startParking: (vehicleId, parkData) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicleId ? { ...v, parkLocation: { ...parkData, active: true } } : v
        );
        set({ garaj: updatedGaraj });
        pushGarajParkToSupabase({ ...parkData, active: true }, vehicleId);
      },

      finishParking: (vehicleId, cost, paymentInfo = null) => {
        const state = get();
        const vehicle = state.garaj.find(v => v.id === vehicleId);
        if (!vehicle) return;

        if (cost > 0) {
          get().addExpense({
            title: `Otopark: ${vehicle.model}`,
            amount: cost,
            category: 'arac',
            source: 'Garaj',
            ...(paymentInfo ? { defaultPay: paymentInfo } : {})
          });
        }

        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicleId ? { ...v, parkLocation: { lat: null, lng: null, note: '', floor: '', spot: '', active: false } } : v
        );

        set({ garaj: updatedGaraj });
        pushGarajParkToSupabase({ lat: null, lng: null, note: '', floor: '', spot: '', active: false }, vehicleId);
      },

      deleteServiceRecord: (vehicleId, serviceId) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicleId ? { ...v, services: v.services.filter(s => s.id !== serviceId) } : v
        );
        set({ garaj: updatedGaraj });

        deleteGarajServisFromSupabase(serviceId);
      },

      deleteDocument: (vehicleId, docId) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicleId ? { ...v, documents: v.documents.filter(d => d.id !== docId) } : v
        );
        set({ garaj: updatedGaraj });

        deleteGarajBelgeFromSupabase(docId);
      },

      addDocument: (vehicleId, doc, paymentInfo = null) => {
        const state = get();
        const vehicle = state.garaj.find(v => v.id === vehicleId);
        const newDoc = { id: Date.now().toString(), ...doc };
        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicleId ? { ...v, documents: [...v.documents, newDoc] } : v
        );
        set({ garaj: updatedGaraj });

        if (doc.cost > 0) {
          get().addExpense({
            title: `${doc.name}: ${vehicle?.model || 'Araç'}`,
            amount: doc.cost,
            category: 'arac',
            source: 'Garaj',
            date: doc.startDate || new Date().toISOString().split('T')[0],
            ...(paymentInfo ? { defaultPay: paymentInfo } : {})
          });
        }


        pushGarajBelgeToSupabase(newDoc, vehicleId);
      },

      updateDocument: (vehicleId, docId, updates) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v => {
          if (v.id === vehicleId) {
            const updatedDocs = v.documents.map(d => d.id === docId ? { ...d, ...updates } : d);
            return { ...v, documents: updatedDocs };
          }
          return v;
        });
        set({ garaj: updatedGaraj });
        const vehicle = updatedGaraj.find(v => v.id === vehicleId);
        const doc = vehicle?.documents.find(d => d.id === docId);
        if (doc) pushGarajBelgeToSupabase(doc, vehicleId);
      },

      updateSupportContacts: (vehicleId, contacts) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicleId ? { ...v, supportContacts: contacts } : v
        );
        set({ garaj: updatedGaraj });

      },

      updatePartMaintenance: (vehicleId, partId, { lastKM, lastDate }) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v => {
          if (v.id === vehicleId) {
            const updatedParts = v.parts.map(p =>
              p.id === partId ? { ...p, lastKM, lastDate } : p
            );
            return { ...v, parts: updatedParts };
          }
          return v;
        });
        set({ garaj: updatedGaraj });


        // Push part update to SQL
        const vehicle = updatedGaraj.find(v => v.id === vehicleId);
        const part = vehicle?.parts.find(p => p.id === partId);
        if (part) {
          pushGenericToSupabase('garaj_parts', { ...part, vehicle_id: vehicleId });
        }
      },

      deleteFuelLog: (vehicleId, logId) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicleId ? { ...v, fuelLogs: v.fuelLogs.filter(l => l.id !== logId) } : v
        );
        set({ garaj: updatedGaraj });

        deleteGarajYakitFromSupabase(logId);
      },

      updateFuelLog: (vehicleId, logId, updatedFields) => {
        const state = get();
        const vehicle = state.garaj.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicleId
            ? {
              ...v,
              fuelLogs: v.fuelLogs.map(l =>
                String(l.id) === String(logId) ? { ...l, ...updatedFields } : l
              )
            }
            : v
        );

        set({ garaj: updatedGaraj });

        const updatedLog = vehicle.fuelLogs.find(l => String(l.id) === String(logId));
        if (updatedLog) {
          const finalLog = { ...updatedLog, ...updatedFields };
          pushGarajYakitToSupabase(finalLog, vehicleId);
        }
      },

      // ── Pet Actions ────────────────────────────────────
      addPetVaccine: (petId, vaccine) => {
        const state = get();
        const currentVaccines = state.pet.vaccines[petId] || [];
        const yeniVaccines = [...currentVaccines, { id: Date.now(), ...vaccine }];
        set({ pet: { ...state.pet, vaccines: { ...state.pet.vaccines, [petId]: yeniVaccines } } });

        pushPetAsiToSupabase(petId, { id: Date.now(), ...vaccine });
      },

      deletePetVaccine: (petId, id) => {
        const state = get();
        const yeniVaccines = (state.pet.vaccines[petId] || []).filter(v => v.id !== id && v.n !== id);
        set({ pet: { ...state.pet, vaccines: { ...state.pet.vaccines, [petId]: yeniVaccines } } });

        deletePetAsiFromSupabase(id);
      },

      updatePetVaccine: (petId, vaccineId, updates) => {
        const state = get();
        const currentVaccines = state.pet.vaccines[petId] || [];
        const yeniVaccines = currentVaccines.map(v => 
          (v.id === vaccineId || v.n === vaccineId) ? { ...v, ...updates } : v
        );
        set({ pet: { ...state.pet, vaccines: { ...state.pet.vaccines, [petId]: yeniVaccines } } });

        const updatedVaccine = yeniVaccines.find(v => v.id === vaccineId || v.n === vaccineId);
        if (updatedVaccine) {
          pushPetAsiToSupabase(petId, updatedVaccine);
        }
      },

      addPetWeight: (petId, weightData) => {
        const state = get();
        const currentWeights = state.pet.weights[petId] || [];
        const newId = Date.now();
        
        const parseTurkishDate = (str) => {
          if (!str) return 0;
          // Handle "14.05.2026 Perşembe" or "14.05.2026"
          const datePart = str.split(' ')[0];
          const parts = datePart.split('.');
          if (parts.length < 3) return 0;
          const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          return isNaN(d.getTime()) ? 0 : d.getTime();
        };

        const yeniWeights = [{ id: newId, ...weightData }, ...currentWeights]
          .sort((a, b) => parseTurkishDate(b.dt) - parseTurkishDate(a.dt));
          
        const log = { id: newId, pet: petId, action: `Kilo güncellendi: ${weightData.w} kg`, dt: weightData.dt, type: 'weight' };
        
        const yeniHistory = [log, ...(state.pet.history || [])]
          .sort((a, b) => parseTurkishDate(b.dt) - parseTurkishDate(a.dt));

        set({
          pet: {
            ...state.pet,
            weights: { ...state.pet.weights, [petId]: yeniWeights },
            history: yeniHistory.slice(0, 100)
          }
        });

        pushPetAgirlikToSupabase(petId, { id: newId, ...weightData });
        pushPetLogToSupabase(log);
      },

      deletePetWeight: (petId, id) => {
        const state = get();
        const yeniWeights = (state.pet.weights[petId] || []).filter(w => w.id !== id);
        set({ pet: { ...state.pet, weights: { ...state.pet.weights, [petId]: yeniWeights } } });

        deletePetAgirlikFromSupabase(id);
      },

      deletePetLog: (id) => {
        const state = get();
        const logToDelete = (state.pet.history || []).find(h => h.id === id);
        let yeniPet = { ...state.pet };

        // If it's a vaccine update log, revert the vaccine date
        if (logToDelete && logToDelete.type === 'vaccine' && logToDelete.vaccineName && logToDelete.prevDate) {
          const petId = logToDelete.pet;
          const vName = logToDelete.vaccineName;
          const pDate = logToDelete.prevDate;

          const updatedVaccines = (state.pet.vaccines[petId] || []).map(v =>
            v.n === vName ? { ...v, last: pDate, h: (v.h || []).filter(date => date !== logToDelete.dt) } : v
          );

          yeniPet.vaccines = { ...state.pet.vaccines, [petId]: updatedVaccines };
        }
        
        // If it's a weight log, remove the corresponding weight record
        if (logToDelete && logToDelete.type === 'weight') {
          const petId = logToDelete.pet;
          // Robust deletion: first try by ID (if we saved it in the log), then fallback to date/weight match
          const wToDelete = (yeniPet.weights[petId] || []).find(w => 
            w.id === logToDelete.id || (w.dt === logToDelete.dt && logToDelete.action.includes(String(w.w)))
          );

          if (wToDelete) {
            yeniPet.weights[petId] = (yeniPet.weights[petId] || []).filter(w => w.id !== wToDelete.id);
            deletePetAgirlikFromSupabase(wToDelete.id);
          }
        }

        yeniPet.history = (state.pet.history || []).filter(h => h.id !== id);

        set({ pet: yeniPet });
        deletePetLogFromSupabase(id);
      },

      updatePetLog: (id, updates) => {
        const state = get();
        let updatedWeights = { ...state.pet.weights };
        const logToUpdate = (state.pet.history || []).find(h => h.id === id);

        // If it's a weight log, update the corresponding weight in the weights array
        if (logToUpdate && logToUpdate.type === 'weight') {
          const petId = logToUpdate.pet;
          const oldWMatch = logToUpdate.action.match(/(\d+\.?\d*)/);
          const newWMatch = updates.action ? updates.action.match(/(\d+\.?\d*)/) : null;
          
          if (newWMatch && oldWMatch) {
            const oldW = parseFloat(oldWMatch[1]);
            const newW = parseFloat(newWMatch[1]);
            
            updatedWeights[petId] = (updatedWeights[petId] || []).map(w => 
              (w.dt === logToUpdate.dt && w.w === oldW) ? { ...w, w: newW, dt: updates.dt || w.dt } : w
            );
            
            // Also push weight update to SQL
            const updatedWeight = updatedWeights[petId].find(w => w.dt === (updates.dt || w.dt) && w.w === newW);
            if (updatedWeight) pushPetAgirlikToSupabase(petId, updatedWeight);
          }
        }

        const updatedHistory = (state.pet.history || []).map(h => 
          h.id === id ? { ...h, ...updates } : h
        );

        set({ 
          pet: { 
            ...state.pet, 
            history: updatedHistory,
            weights: updatedWeights 
          } 
        });

        // Push log update to SQL
        const finalLog = updatedHistory.find(h => h.id === id);
        if (finalLog) pushPetLogToSupabase(finalLog);
      },
      
      addPetLog: (newLog) => {
        const state = get();
        set({
          pet: {
            ...state.pet,
            history: [newLog, ...(state.pet.history || [])]
          }
        });
        pushPetLogToSupabase(newLog);
      },

      completePetVaccine: async (petId, vaccineName, data) => {
        const state = get();
        const vaccines = { ...state.pet.vaccines };
        if (!vaccines[petId]) return;

        const vIdx = vaccines[petId].findIndex(v => v.n === vaccineName);
        if (vIdx === -1) return;

        const v = vaccines[petId][vIdx];
        const newHistory = [data.date, ...(v.h || [])].sort((a, b) => {
          const parse = (dt) => { 
            const p = dt.split('.'); 
            return new Date(`${p[2]}-${p[1]}-${p[0]}`).getTime(); 
          };
          return parse(b) - parse(a);
        });

        vaccines[petId][vIdx] = {
          ...v,
          last: data.date,
          h: newHistory
        };

        set({ 
          pet: { 
            ...state.pet, 
            vaccines
          } 
        });

        // Finans kaydı varsa ekle
        if (data.amount && parseFloat(data.amount) > 0) {
          get().addExpense({
            title: `🐾 ${petId.charAt(0).toUpperCase() + petId.slice(1)}: ${vaccineName} Aşısı`,
            amount: parseFloat(data.amount),
            category: 'Pet',
            payer: state.currentUser?.name || 'Görkem',
            defaultPay: data.paymentInfo
          });
        }


        pushPetAsiToSupabase(petId, vaccines[petId][vIdx]);
      },

      updatePetSupply: (petId, supplyType, status) => {
        const state = get();
        const supplies = { ...state.pet.supplies };
        if (!supplies[petId]) supplies[petId] = { mama: 'var', kum: 'var' };
        supplies[petId] = { ...supplies[petId], [supplyType]: status };
        set({ pet: { ...state.pet, supplies } });


        pushGenericToSupabase('pet_supplies', { 
          id: `${petId}-${supplyType}`, 
          pet_name: petId, 
          supply_type: supplyType, 
          status: status 
        });

        if (status === 'azaldi') {
          get().addLog('Pet Uyarısı', `${state.pet.meta[petId].name} için ${supplyType} azalıyor!`);
        }

      },

      addPetPhoto: (petId, photoUrl) => {
        const state = get();
        const gallery = { ...state.pet.gallery } || { waffle: [], mayis: [] };
        if (!gallery[petId]) gallery[petId] = [];
        gallery[petId] = [photoUrl, ...(gallery[petId] || [])].slice(0, 20);
        set({ pet: { ...state.pet, gallery } });
        pushGenericToSupabase('pet_gallery', { id: `${petId}-${Date.now()}`, pet_name: petId, photo_url: photoUrl });
      },

      // ── Hedefler Actions ───────────────────────────────
      addVisionGoal: (goal) => {
        const state = get();
        const newGoal = {
          id: 'v-' + Date.now(),
          current: 0,
          target: 100,
          milestones: [],
          ...goal
        };
        set({
          hedefler: {
            ...state.hedefler,
            goals: [newGoal, ...(state.hedefler.goals || [])]
          }
        });
        pushHedefToSupabase(newGoal);
        toast.success('Yeni hedef eklendi! 🎯');
      },

      updateVisionGoal: (id, updates) => {
        const state = get();
        const updatedGoals = (state.hedefler.goals || []).map(g =>
          g.id === id ? { ...g, ...updates } : g
        );
        set({
          hedefler: {
            ...state.hedefler,
            goals: updatedGoals
          }
        });
        const updated = updatedGoals.find(g => g.id === id);
        if (updated) pushHedefToSupabase(updated);
      },

      deleteVisionGoal: (id) => {
        const state = get();
        set({
          hedefler: {
            ...state.hedefler,
            goals: (state.hedefler.goals || []).filter(g => g.id !== id)
          }
        });
        deleteHedefFromSupabase(id);
        toast.success('Hedef silindi.');
      },

      addVisionPlan: (plan) => {
        const state = get();
        const newPlan = { id: 'ltv-' + Date.now(), ...plan };
        set({
          hedefler: {
            ...state.hedefler,
            longTermVision: [newPlan, ...(state.hedefler.longTermVision || [])]
          }
        });
        pushVizyonPlanToSupabase(newPlan);
      },

      updateVisionPlan: (id, updates) => {
        const state = get();
        const updated = (state.hedefler.longTermVision || []).map(p =>
          p.id === id ? { ...p, ...updates } : p
        );
        set({ hedefler: { ...state.hedefler, longTermVision: updated } });
        const p = updated.find(x => x.id === id);
        if (p) pushVizyonPlanToSupabase(p);
      },

      deleteVisionPlan: (id) => {
        const state = get();
        set({
          hedefler: {
            ...state.hedefler,
            longTermVision: (state.hedefler.longTermVision || []).filter(p => p.id !== id)
          }
        });
        // Remove from SQL with safe ID check to prevent double appending family ID
        const finalId = String(id).includes(DEFAULT_FID) ? String(id) : `${id}-${DEFAULT_FID}`;
        supabase.from('hedefler_vizyon').delete().eq('id', finalId).then();
      },

      syncAllHedefler: async () => {
        const state = get();
        const loadId = toast.loading('Hedefler SQL\'e senkronize ediliyor...');
        try {
          // 1. Aktif Hedefler (Vision & Money)
          const goals = state.hedefler?.goals || [];
          const moneyGoals = state.kasa?.kumbaralar || [];
          for (const g of goals) await pushHedefToSupabase(g);
          for (const g of moneyGoals) await pushHedefToSupabase(g);

          // 2. Geçmiş
          const compHist = state.hedefler?.completedHistory || [];
          const failHist = state.hedefler?.failedHistory || [];
          for (const h of compHist) await pushHedefGecmisToSupabase(h, 'completed');
          for (const h of failHist) await pushHedefGecmisToSupabase(h, 'failed');

          // 3. Vizyon
          const vizyon = state.hedefler?.longTermVision || [];
          for (const p of vizyon) await pushVizyonPlanToSupabase(p);

          toast.dismiss(loadId);
          toast.success('Tüm hedefler SQL ile senkronize edildi! 🚀');
        } catch (e) {
          toast.dismiss(loadId);
          toast.error('Senkronizasyon hatası: ' + e.message);
        }
      },

      updateGoalProgress: (id, current) => {
        const state = get();
        // Check both vision and money goals
        let found = false;
        const updatedVision = (state.hedefler.goals || []).map(g => {
          if (g.id === id) { found = true; return { ...g, current }; }
          return g;
        });
        
        if (found) {
          set({ hedefler: { ...state.hedefler, goals: updatedVision } });
          pushHedefToSupabase(updatedVision.find(g => g.id === id));
          return;
        }

        const updatedMoney = (state.kasa.kumbaralar || []).map(g => {
          if (g.id === id) { found = true; return { ...g, current }; }
          return g;
        });

        if (found) {
          set({ kasa: { ...state.kasa, kumbaralar: updatedMoney } });
          pushHedefToSupabase(updatedMoney.find(g => g.id === id));
        }
      },

      updateGoal: (id, updates) => {
        const state = get();
        const updated = (state.kasa.kumbaralar || []).map(g =>
          g.id === id ? { ...g, ...updates } : g
        );
        set({ kasa: { ...state.kasa, kumbaralar: updated } });
        const g = updated.find(x => x.id === id);
        if (g) pushHedefToSupabase(g);
      },

      deleteGoal: (id) => {
        const state = get();
        set({
          kasa: {
            ...state.kasa,
            kumbaralar: (state.kasa.kumbaralar || []).filter(g => g.id !== id)
          }
        });
        deleteHedefFromSupabase(id);
      },

      completeGoal: (id, type, reflection) => {
        const state = get();
        let goal = null;
        if (type === 'money') {
          goal = (state.kasa.kumbaralar || []).find(g => g.id === id);
        } else {
          goal = (state.hedefler.goals || []).find(g => g.id === id);
        }

        if (goal) {
          const completedGoal = { ...goal, status: 'completed', reflection, completedAt: new Date().toISOString() };
          
          if (type === 'money') {
            set(current => ({
              kasa: {
                ...current.kasa,
                kumbaralar: (current.kasa.kumbaralar || []).filter(g => g.id !== id)
              },
              hedefler: {
                ...current.hedefler,
                completedHistory: [completedGoal, ...(current.hedefler.completedHistory || [])]
              }
            }));
            deleteHedefFromSupabase(id);
          } else {
            set(current => ({
              hedefler: {
                ...current.hedefler,
                goals: (current.hedefler.goals || []).filter(g => g.id !== id),
                completedHistory: [completedGoal, ...(current.hedefler.completedHistory || [])]
              }
            }));
            deleteHedefFromSupabase(id);
          }
          
          pushHedefGecmisToSupabase(completedGoal, 'completed');
        }
      },

      failGoal: (id, type, reflection) => {
        const state = get();
        let goal = null;
        if (type === 'money') {
          goal = (state.kasa.kumbaralar || []).find(g => g.id === id);
        } else {
          goal = (state.hedefler.goals || []).find(g => g.id === id);
        }

        if (goal) {
          const failedGoal = { ...goal, status: 'failed', reflection, failedAt: new Date().toISOString() };
          
          if (type === 'money') {
            set(current => ({
              kasa: {
                ...current.kasa,
                kumbaralar: (current.kasa.kumbaralar || []).filter(g => g.id !== id)
              },
              hedefler: {
                ...current.hedefler,
                failedHistory: [failedGoal, ...(current.hedefler.failedHistory || [])]
              }
            }));
            deleteHedefFromSupabase(id);
          } else {
            set(current => ({
              hedefler: {
                ...current.hedefler,
                goals: (current.hedefler.goals || []).filter(g => g.id !== id),
                failedHistory: [failedGoal, ...(current.hedefler.failedHistory || [])]
              }
            }));
            deleteHedefFromSupabase(id);
          }
          
          pushHedefGecmisToSupabase(failedGoal, 'failed');
        }
      },

      updateCompletedGoal: (id, updates) => {
        const state = get();
        const updated = (state.hedefler.completedHistory || []).map(h =>
          h.id === id ? { ...h, ...updates } : h
        );
        set({ hedefler: { ...state.hedefler, completedHistory: updated } });
        const h = updated.find(x => x.id === id);
        if (h) pushHedefGecmisToSupabase(h, 'completed');
      },

      deleteCompletedGoal: (id) => {
        const state = get();
        set({
          hedefler: {
            ...state.hedefler,
            completedHistory: (state.hedefler.completedHistory || []).filter(h => h.id !== id)
          }
        });
        // Safe ID check to prevent double appending family ID
        const finalId = String(id).includes(DEFAULT_FID) ? String(id) : `${id}-${DEFAULT_FID}`;
        supabase.from('hedefler_gecmis').delete().eq('id', finalId).then();
      },

      updateFailedGoal: (id, updates) => {
        const state = get();
        const updated = (state.hedefler.failedHistory || []).map(h =>
          h.id === id ? { ...h, ...updates } : h
        );
        set({ hedefler: { ...state.hedefler, failedHistory: updated } });
        const h = updated.find(x => x.id === id);
        if (h) pushHedefGecmisToSupabase(h, 'failed');
      },

      deleteFailedGoal: (id) => {
        const state = get();
        set({
          hedefler: {
            ...state.hedefler,
            failedHistory: (state.hedefler.failedHistory || []).filter(h => h.id !== id)
          }
        });
        // Safe ID check to prevent double appending family ID
        const finalId = String(id).includes(DEFAULT_FID) ? String(id) : `${id}-${DEFAULT_FID}`;
        supabase.from('hedefler_gecmis').delete().eq('id', finalId).then();
      },

      setOnlineStatus: (status) => {
        set(state => ({ system: { ...state.system, isOnline: status } }));
      },



      // ── Depo v3.5 Foundation (Phase 1) ────────────────
      addDepoItem: (itemData) => {
        const state = get();
        const currentDepo = Array.isArray(state.ev.depo) ? state.ev.depo : [];
        const { name, mainCat, subCat, qty, price, source, note, owner, emoji, brand, size, notes } = itemData;

        if (!name) return;

        const now = new Date().toISOString();
        const existingIdx = currentDepo.findIndex(item => {
          const itemName = item.name || item.nm; // Fallback for legacy data
          return itemName && itemName.toLowerCase() === name.toLowerCase();
        });

        let updatedDepo;

        if (existingIdx !== -1) {
          // Smart Merge Logic
          const item = currentDepo[existingIdx];
          updatedDepo = [...currentDepo];
          updatedDepo[existingIdx] = {
            ...item,
            mainCat: mainCat || item.mainCat,
            subCat: subCat || item.subCat,
            totalQty: Number(item.totalQty || 0) + Number(qty || 1),
            lastDate: now,
            owner: owner || item.owner || 'ortak',
            emoji: emoji || item.emoji || '',
            brand: brand || item.brand || '',
            size: size || item.size || '',
            notes: notes || item.notes || '',
            history: [
              {
                id: Date.now(),
                date: now,
                qty: Number(qty || 1),
                pr: price || 0,
                source: source || 'manual',
                note: note || 'Güncelleme'
              },
              ...(item.history || [])
            ].slice(0, 50) // Keep last 50 events
          };
        } else {
          // New Entry
          const newItem = {
            id: Date.now().toString(),
            name: name,
            mainCat: mainCat || 'Genel',
            subCat: subCat || 'Diğer',
            totalQty: Number(qty || 1),
            firstDate: now,
            lastDate: now,
            owner: owner || 'ortak',
            emoji: emoji || '',
            brand: brand || '',
            size: size || '',
            notes: notes || '',
            history: [{
              id: Date.now(),
              date: now,
              qty: Number(qty || 1),
              pr: price || 0,
              source: source || 'manual',
              note: note || 'Kayıt'
            }]
          };
          updatedDepo = [newItem, ...currentDepo];
        }

        set({ ev: { ...state.ev, depo: updatedDepo } });

        
        // Find the newly added or updated item and push to SQL
        const syncedItem = updatedDepo.find(i => 
          (i.name || i.nm || '').toLowerCase() === name.toLowerCase()
        );
        if (syncedItem) {
          const dbPayload = {
            id: syncedItem.id,
            family_id: DEFAULT_FID,
            name: syncedItem.name || syncedItem.nm,
            quantity: Number(syncedItem.totalQty || syncedItem.qty || 1),
            price: Number(syncedItem.price || syncedItem.history?.[0]?.pr || 0),
            date: syncedItem.lastDate || syncedItem.firstDate || syncedItem.dt || new Date().toISOString().split('T')[0],
            category: syncedItem.mainCat || syncedItem.category || 'Genel',
            owner: syncedItem.owner || 'ortak',
            emoji: syncedItem.emoji || '',
            brand: syncedItem.brand || '',
            size: syncedItem.size || '',
            notes: syncedItem.notes || ''
          };
          pushGenericToSupabase('ev_depo', dbPayload);
        }
      },

      deleteDepoItem: (id) => {
        const state = get();
        const updatedDepo = (state.ev.depo || []).filter(item => String(item.id) !== String(id));
        set({ ev: { ...state.ev, depo: updatedDepo } });

        removeGenericFromSupabase('ev_depo', id);
        toast.success('Ürün depodan silindi.');
      },

      updateDepoItem: (id, updates) => {
        const state = get();
        const currentDepo = Array.isArray(state.ev.depo) ? state.ev.depo : [];
        const updatedDepo = currentDepo.map(item => {
          if (String(item.id) === String(id)) {
            const merged = { ...item, ...updates };
            if (updates.name) merged.name = updates.name;
            if (updates.mainCat) merged.mainCat = updates.mainCat;
            if (updates.totalQty !== undefined) merged.totalQty = Number(updates.totalQty);
            return merged;
          }
          return item;
        });

        set({ ev: { ...state.ev, depo: updatedDepo } });

        const syncedItem = updatedDepo.find(i => String(i.id) === String(id));
        if (syncedItem) {
          const dbPayload = {
            id: syncedItem.id,
            family_id: DEFAULT_FID,
            name: syncedItem.name || syncedItem.nm,
            quantity: Number(syncedItem.totalQty || syncedItem.qty || 1),
            price: Number(syncedItem.price || syncedItem.history?.[0]?.pr || 0),
            date: syncedItem.lastDate || syncedItem.firstDate || syncedItem.dt || new Date().toISOString().split('T')[0],
            category: syncedItem.mainCat || syncedItem.category || 'Genel',
            owner: syncedItem.owner || 'ortak',
            emoji: syncedItem.emoji || '',
            brand: syncedItem.brand || '',
            size: syncedItem.size || '',
            notes: syncedItem.notes || ''
          };
          pushGenericToSupabase('ev_depo', dbPayload);
        }
        toast.success('Ürün güncellendi. 📦');
      },

      clearDepo: () => {
        const state = get();
        set({ ev: { ...state.ev, depo: [] } });

        toast.success('Depo sıfırlandı. ✨ (SQL tablosu elle temizlenmeli)');
      },

      syncValizToDepo: (rawName, source, forceQty) => {
        // 1. Strip quantity embedded in name e.g. "Çorap (5 adet)" → name="Çorap", qty=5
        const qtyInNameRegex = /\((\d+)\s*adet\)/i;
        const qtyMatch = rawName.match(qtyInNameRegex);
        const qty = forceQty || (qtyMatch ? parseInt(qtyMatch[1]) : 1);
        let nameWithoutQty = rawName.replace(qtyInNameRegex, '').trim();

        // 2. Extract leading/embedded emoji
        const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F9FF}]/u;
        const emojiMatch = nameWithoutQty.match(emojiRegex);
        const emoji = emojiMatch ? emojiMatch[0] : '';
        if (emoji) {
          nameWithoutQty = nameWithoutQty.replace(emoji, '').trim();
        }
        const cleanName = nameWithoutQty;

        if (!cleanName) return;

        // 3. Smart category detection
        const clothingKeywords = ['tişört', 'pantolon', 'gömlek', 'hırka', 'mont', 'çorap', 'iç çamaşır', 'pijama', 'kazak', 'etek', 'elbise', 'ayakkabı', 'sandalet', 'yürüyüş', 'spor kıyaf', 'şort', 'tayt', 'atlet', 'fanila', 'bere', 'şapka', 'atkı', 'eldiven'];
        const techKeywords = ['şarj', 'laptop', 'powerbank', 'kulaklık', 'telefon', 'tablet', 'adaptör', 'kamera', 'gopro', 'mouse', 'hdmi', 'usb'];
        
        const lowerName = cleanName.toLowerCase();
        let mainCat = 'Genel';
        if (clothingKeywords.some(k => lowerName.includes(k))) mainCat = 'Gardırop';
        else if (techKeywords.some(k => lowerName.includes(k))) mainCat = 'Teknoloji';

        // 4. Check if item already in depo (don't add again, just increment)
        const state = get();
        const existing = (state.ev.depo || []).find(d => 
          (d.name || '').toLowerCase() === cleanName.toLowerCase()
        );

        if (existing) {
          // Already in depo: silently increment quantity
          get().updateDepoItem(existing.id, {
            totalQty: (existing.totalQty || 0) + qty
          });
        } else {
          get().addDepoItem({
            name: cleanName,
            mainCat,
            source: source || 'valiz',
            qty,
            emoji,
            note: 'Valizden aktarıldı'
          });
        }
      },
      // ── System Actions ────────────────────────────────
      calculateGlobalScore: () => {
        const state = get();
        // Weighted logic: 30% Finance, 20% Health, 20% Home, 20% Goals, 10% Vehicle
        let score = 70; // Baseline

        const vehicle = state.garaj?.[0];
        const km = vehicle?.km || 0;
        if (km > 0) score += 5;

        const goals = state.hedefler?.goals || [];
        const faturalar = state.ev?.faturalar || [];

        if (goals.length > 0) score += 5;
        if (faturalar.length > 0 && faturalar.every(f => f.status === 'Ödendi')) score += 10;
        if (km > 0) score += 5;

        set({ system: { ...state.system, globalScore: Math.min(100, score) } });
      },

      addBadge: (badgeId) => {
        const state = get();
        const achievements = state.system.achievements.map(a =>
          a.id === badgeId ? { ...a, earned: true } : a
        );
        set({ system: { ...state.system, achievements } });
        get().addLog('Başarı Kazandın!', `🏆 "${badgeId}" rozeti koleksiyonuna eklendi!`);

      },

      globalSearch: (query) => {
        const state = get();
        const q = query.toLowerCase();
        const results = [];

        // Search in Goals
        const goals = state.hedefler?.goals || [];
        goals.forEach(g => {
          if (g.title.toLowerCase().includes(q)) results.push({ type: 'Hedef', text: g.title, path: '/hedefler' });
        });

        // Search in Expenses
        const pool = state.finans?.approvalPool || [];
        pool.forEach(e => {
          if (e.title.toLowerCase().includes(q)) results.push({ type: 'Harcama', text: `${e.title} - ${e.amount}₺`, path: '/finans' });
        });

        const history = state.kasa?.gecmis || [];
        history.forEach(e => {
          if (e.title.toLowerCase().includes(q)) results.push({ type: 'Harcama', text: `${e.title} - ${e.amount}₺`, path: '/kasa' });
        });

        return results;
      },

      completeOnboarding: () => {
        const state = get();
        set({ system: { ...state.system, onboardingComplete: true } });

      },

      updateStockQty: (moduleKey, itemName, direction) => {
        const state = get();
        let updatedItemData = null;
        const updatedList = state.mutfak[moduleKey].map(item => {
          if (item.n === itemName) {
            const step = item.mn || 1;
            const delta = direction * step;
            const newQty = Math.max(0, (item.cr || 0) + delta);
            const updated = { ...item, cr: Number(newQty.toFixed(2)) };
            updatedItemData = updated;
            return updated;
          }
          return item;
        });
        set({ mutfak: { ...state.mutfak, [moduleKey]: updatedList } });

        if (updatedItemData) pushMutfakStokToSupabase(updatedItemData, moduleKey); // Faz 1.2
      },

      addMutfakStokItem: (moduleKey, newItem) => {
        const state = get();
        // Mükerrer Kontrolü (Tüm mutfak stoklarında tara: buzdolabı, kiler, dondurucu)
        const allStock = [
          ...(state.mutfak.buzdolabi || []),
          ...(state.mutfak.kiler || []),
          ...(state.mutfak.dondurucu || [])
        ];
        const isDuplicate = allStock.some(
          s => s.n?.toLowerCase().trim() === newItem.n?.toLowerCase().trim()
        );

        if (isDuplicate) {
          toast.error(`"${newItem.n}" mutfakta zaten kayıtlı! 🛒`);
          return;
        }

        const currentList = state.mutfak[moduleKey] || [];
        const updatedList = [...currentList, newItem];
        set({ mutfak: { ...state.mutfak, [moduleKey]: updatedList } });

        pushMutfakStokToSupabase(newItem, moduleKey);
      },

      updateMutfakStokItem: (moduleKey, oldName, newItem) => {
        const state = get();
        const currentList = state.mutfak[moduleKey] || [];
        const updatedList = currentList.map(item => item.n === oldName ? newItem : item);
        set({ mutfak: { ...state.mutfak, [moduleKey]: updatedList } });

        pushMutfakStokToSupabase(newItem, moduleKey);
        // Supabase silme işlemi gerekebilir ama isme göre çalıştığı için upsert muhtemelen yeni satır açar.
        // O yüzden eski ismi siliyoruz.
        supabase.from('mutfak_stok')
          .delete()
          .eq('isim', oldName)
          .eq('family_id', 'eraylar-family-shared-id')
          .then();
      },

      deleteMutfakStokItem: (moduleKey, itemName) => {
        const state = get();
        const currentList = state.mutfak[moduleKey] || [];
        const updatedList = currentList.filter(item => item.n !== itemName);
        set({ mutfak: { ...state.mutfak, [moduleKey]: updatedList } });

        supabase.from('mutfak_stok')
          .delete()
          .eq('isim', itemName)
          .eq('family_id', 'eraylar-family-shared-id')
          .then();
      },

      getAvailableRecipes: () => {
        const { mutfak } = get();
        const fridge = mutfak.buzdolabi.filter(i => i.cr > 0).map(i => i.n.toLowerCase());
        const pantry = mutfak.kiler.filter(i => i.cr > 0).map(i => i.n.toLowerCase());
        const frozen = mutfak.dondurucu.filter(i => i.cr > 0).map(i => i.n.toLowerCase());

        const readyStock = [...fridge, ...pantry];

        return mutfak.tarifler.map(recipe => {
          if (!recipe.ig || recipe.ig.length === 0) return { ...recipe, status: 'ready', missing: [] };

          let missingCount = 0;
          let frozenCount = 0;
          let missingItems = [];

          recipe.ig.forEach(igLine => {
            const name = igLine.split(':')[0].trim().toLowerCase();
            const inReady = readyStock.some(s => s === name);
            if (inReady) return;

            const inFrozen = frozen.some(s => s === name);
            if (inFrozen) {
              frozenCount++;
            } else {
              missingCount++;
              missingItems.push(name);
            }
          });

          let status = 'ready'; // 🟢
          if (missingCount > 0) {
            status = 'missing'; // 🔴
          } else if (frozenCount > 0) {
            status = 'frozen'; // ❄️
          }

          return { ...recipe, status, missing: missingItems };
        });
      },

      batchConfirmShopping: async (items, totalPrice, market, paymentInfo) => {
        const state = get();
        let updatedMutfak = { ...state.mutfak };
        const itemIds = items.map(i => i.id);

        // 1. Remove from shopping list
        updatedMutfak.alisveris = updatedMutfak.alisveris.filter(i => !itemIds.includes(i.id));

        // 2. Add to stock (Prevention of duplicates across all locations)
        const allLocs = ['buzdolabi', 'kiler', 'dondurucu'];
        items.forEach(item => {
          let foundLoc = null;
          let foundIdx = -1;

          for (const lKey of allLocs) {
            const idx = (updatedMutfak[lKey] || []).findIndex(s => s.n.toLowerCase() === item.nm.toLowerCase());
            if (idx !== -1) {
              foundLoc = lKey;
              foundIdx = idx;
              break;
            }
          }

          const targetLoc = foundLoc || (item.loc === 'buz' ? 'buzdolabi' : (item.loc === 'don' ? 'dondurucu' : 'kiler'));
          const stock = [...(updatedMutfak[targetLoc] || [])];

          // Parse quantity (e.g. "2 adet" -> 2)
          const qtyMatch = (item.qt || '').match(/(\d+\.?\d*)/);
          const addedQty = qtyMatch ? parseFloat(qtyMatch[1]) : 1;

          if (foundIdx !== -1) {
            stock[foundIdx] = { ...stock[foundIdx], cr: stock[foundIdx].cr + addedQty, mk: market || stock[foundIdx].mk, bt: new Date().toISOString() };
          } else {
            stock.push({
              id: Date.now() + Math.floor(Math.random() * 1000000),
              n: item.nm,
              cr: addedQty,
              mn: 1,
              u: item.qt?.split(' ')[1] || 'adet',
              ic: '📦',
              ct: item.ct || 'Diğer',
              mk: market,
              bt: new Date().toISOString()
            });
          }
          updatedMutfak[targetLoc] = stock;
        });

        // 3. Add Finance Record
        if (totalPrice > 0) {
          const expenseTitle = items.length === 1 
            ? `${items[0].nm} (${market || 'Market'})` 
            : `Mutfak Alışverişi (Diğer)`;

          get().addExpense({
            title: expenseTitle,
            amount: totalPrice,
            category: 'Mutfak',
            payer: state.currentUser?.name || 'Görkem',
            defaultPay: paymentInfo
          });
        }

        set({ mutfak: updatedMutfak });

      },

      setCurrentUser: (user) => {
        set({ currentUser: user });
      },

      updateExchangeRates: async () => {
        try {
          // 1. Currencies
          const res = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
          const data = await res.json();
          const rates = { EUR: 35, USD: 32, GBP: 40, GA: 2500, ETHFI: 21.15 }; // Fallbacks

          if (data && data.rates) {
            rates.EUR = Number((1 / data.rates.EUR).toFixed(2));
            rates.USD = Number((1 / data.rates.USD).toFixed(2));
            rates.GBP = Number((1 / data.rates.GBP).toFixed(2));
          }

          // 2. Gold & Crypto (Gram Gold, BTC, ETH, ETHFI in TRY)
          try {
            const goldRes = await fetch('https://api.coinbase.com/v2/prices/XAU-TRY/spot');
            const goldData = await goldRes.json();
            if (goldData?.data?.amount) {
              rates.GA = Number((Number(goldData.data.amount) / 31.1035).toFixed(2));
            }

            const btcRes = await fetch('https://api.coinbase.com/v2/prices/BTC-TRY/spot');
            const btcData = await btcRes.json();
            if (btcData?.data?.amount) rates.BTC = Number(btcData.data.amount);

            const ethRes = await fetch('https://api.coinbase.com/v2/prices/ETH-TRY/spot');
            const ethData = await ethRes.json();
            if (ethData?.data?.amount) rates.ETH = Number(ethData.data.amount);

            const ethfiRes = await fetch('https://api.coinbase.com/v2/prices/ETHFI-TRY/spot');
            const ethfiData = await ethfiRes.json();
            if (ethfiData?.data?.amount) rates.ETHFI = Number(ethfiData.data.amount);

          } catch (e) {
            console.error('Commodity/Crypto fetch error:', e);
          }

          set(state => ({
            kasa: {
              ...state.kasa,
              rates: rates
            }
          }));
          await pushKasaAyarlarToSupabase(rates, get().kasa.privacyMode);
          console.log('📈 Market rates updated:', rates);

        } catch (err) {
          console.error('Exchange rate fetch error:', err);
        }
      },

      resetMutfak: () => {
        set({ mutfak: DEFAULT_STATE.mutfak });

      },

      addLog: (action, detail) => {
        const state = get();
        const newLog = {
          id: Date.now(),
          action,
          detail,
          date: new Date().toISOString()
        };
        set({ logs: [newLog, ...(state.logs || [])].slice(0, 100) });
      },

      seedExampleGoals: () => {
        const state = get();
        const exampleVisionGoal = { 
          id: 'v-sample-' + Date.now(), 
          title: 'Almanca B2 Sertifikası', 
          owner: 'gorkem', 
          category: 'kariyer', 
          current: 40, 
          target: 100, 
          targetDate: '2026-12-30', 
          priority: 'Yüksek',
          milestones: [
            { id: 1, text: 'A1 & A2 Seviyesi Tamamla', done: true },
            { id: 2, text: 'B1 Kursuna Kayıt Ol', done: true },
            { id: 3, text: 'B2 Sınavına Gir', done: false }
          ]
        };

        const exampleMoneyGoal = { 
          id: 'm-sample-' + Date.now(), 
          name: 'iPhone 17 Pro Max', 
          target: 120000, 
          current: 30000, 
          icon: '📱', 
          deadline: '2026-10-25', 
          priority: 'Orta', 
          category: 'Teknoloji', 
          owner: 'gorkem' 
        };

        set({
          hedefler: {
            ...state.hedefler,
            goals: [...(state.hedefler.goals || []), exampleVisionGoal]
          },
          kasa: {
            ...state.kasa,
            kumbaralar: [...(state.kasa.kumbaralar || []), exampleMoneyGoal]
          }
        });

        toast.success("Örnek hedefler yüklendi! 🎯");
      },

      distributeSavings: (totalAmount) => {
        const state = get();
        const kumbaralar = [...(state.kasa.kumbaralar || [])];
        if (kumbaralar.length === 0) return;

        // Sorting: High Priority First, then closest Deadline
        const activeGoals = kumbaralar
          .filter(g => g.current < g.target)
          .sort((a, b) => {
            const pMap = { 'Yüksek': 3, 'Orta': 2, 'Düşük': 1 };
            if (pMap[b.priority] !== pMap[a.priority]) return pMap[b.priority] - pMap[a.priority];
            if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
            return 0;
          });

        if (activeGoals.length === 0) return;

        let remaining = Number(totalAmount);
        const updatedKumbaralar = kumbaralar.map(g => {
          const isActive = activeGoals.find(ag => ag.id === g.id);
          if (!isActive || remaining <= 0) return g;

          const needed = g.target - g.current;
          const toAdd = Math.min(needed, remaining);
          remaining -= toAdd;
          
          return { ...g, current: g.current + toAdd };
        });

        set({ kasa: { ...state.kasa, kumbaralar: updatedKumbaralar } });
        get().addLog('Akıllı Dağıtım', `${totalAmount}₺ hedeflere öncelik sırasına göre dağıtıldı.`);

        toast.success(`${totalAmount}₺ akıllıca dağıtıldı! 🤖💰`);
      }
    }),
    {
      name: 'eraylar-state-v6-online-first',
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (e) {
            if (e.name === 'QuotaExceededError') {
              console.warn('LocalStorage Full! Data saved to memory/cloud only.', e);
            }
          }
        },
        removeItem: (name) => localStorage.getItem(name)
      })),
      partialize: (state) => extractAppData(state, true),
      merge: (persistedState, initialState) => {
        // SSOT: Persisted state (from Cloud/LocalStorage) is merged into initialState.
        // This ensures actions and default values are preserved.
        const merged = { ...initialState, ...persistedState };

        // Fix Sosyal
        if (merged.sosyal) {
          if (!Array.isArray(merged.sosyal.aktiviteler)) merged.sosyal.aktiviteler = [];
          if (!Array.isArray(merged.sosyal.havuz)) merged.sosyal.havuz = [];
          if (!Array.isArray(merged.sosyal.rutinler)) merged.sosyal.rutinler = [];
        }

        // Fix Mutfak
        if (merged.mutfak) {
          if (!Array.isArray(merged.mutfak.buzdolabi)) merged.mutfak.buzdolabi = [];
          if (!Array.isArray(merged.mutfak.kiler)) merged.mutfak.kiler = [];
          if (!Array.isArray(merged.mutfak.dondurucu)) merged.mutfak.dondurucu = [];
          if (!Array.isArray(merged.mutfak.alisveris)) merged.mutfak.alisveris = [];
          if (!Array.isArray(merged.mutfak.arsiv)) merged.mutfak.arsiv = [];
          if (typeof merged.mutfak.priceHistory !== 'object') merged.mutfak.priceHistory = {};
        }

        // Fix Tatil
        if (merged.tatil) {
          if (!Array.isArray(merged.tatil.trips)) merged.tatil.trips = [];
          if (!Array.isArray(merged.tatil.wishlist)) merged.tatil.wishlist = [];
          if (!Array.isArray(merged.tatil.visas)) merged.tatil.visas = [];
        }

        // Fix Pet
        if (merged.pet) {
          if (typeof merged.pet.vaccines !== 'object' || Array.isArray(merged.pet.vaccines)) merged.pet.vaccines = {};
          if (typeof merged.pet.weights !== 'object' || Array.isArray(merged.pet.weights)) merged.pet.weights = {};
          if (!Array.isArray(merged.pet.history)) merged.pet.history = [];
        }

        // Fix Kasa
        if (merged.kasa) {
          if (!Array.isArray(merged.kasa.tasinmazlar)) merged.kasa.tasinmazlar = [];
        }

        if (!Array.isArray(merged.logs)) merged.logs = [];

        return merged;
      }
    }
  )
);

if (typeof window !== 'undefined') {
  window.useStore = useStore;

  // Connectivity Listeners
  window.addEventListener('online', () => useStore.getState().setOnlineStatus(true));
  window.addEventListener('offline', () => useStore.getState().setOnlineStatus(false));
}

export default useStore;
