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
  SOCIAL_ROUTINES
} from '../constants/data';
import { notificationService } from '../lib/notificationService';
import toast from 'react-hot-toast';

const DEFAULT_STATE = {
  finans: {
    harcamalar: [], // { id, title, amount, category, date, payer, confirmed, receipt }
    approvalPool: [], // { id, title, amount, category, date, source }
    borclar: [
      { id: 1, name: 'Konut Kredisi', total: 1200000, remaining: 850000, monthly: 15400, due_day: 15, type: 'kredi' },
      { id: 2, name: 'Araç Kredisi', total: 400000, remaining: 120000, monthly: 8500, due_day: 5, type: 'kredi' }
    ],
    kartlar: [
      { id: 1, name: 'Bonus Platinum', limit: 150000, balance: 45000, cutoff_day: 25, owner: 'gorkem', color: '#1e293b' },
      { id: 2, name: 'Axess Free', limit: 80000, balance: 12000, cutoff_day: 10, owner: 'esra', color: '#7c3aed' }
    ],
    rekurans: [
      { id: 1, title: 'Netflix', amount: 229, category: 'Abonelik', date: '2026-04-25', icon: '📺', owner: 'ortak', paid: false },
      { id: 2, title: 'Spotify', amount: 59, category: 'Abonelik', date: '2026-04-20', icon: '🎵', owner: 'ortak', paid: true }
    ],
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
      emoji: '👨‍💻'
    },
    esra: {
      name: 'Esra ERAY',
      birthDate: '05.01.1989',
      birthPlace: 'Antalya',
      phone: '+905394245664',
      email: 'eesra_yldrm@gmail.com',
      bloodType: '0 Rh+',
      job: 'Interior Designer',
      emoji: '👩‍🍳'
    }
  },
  kasa: {
    bakiyeler: { gorkem: 15000, esra: 12000, ortak: 5000 },
    tasinmazlar: [
      { 
        id: 1, name: 'Antalya Kepez Daire', city: 'Antalya', district: 'Kepez', neighborhood: 'Ulus',
        type: 'Kat İrtifakı (Daire)', adaParsel: '1382 / 7', unit: '7', floor: '1', area: '648.51', share: '4/40',
        nitelik: 'Mesken', propertyNo: '16783065', icon: '🏢', status: 'Mülk Sahibi',
        income: 0, expense: 0, tax: 1500, taxPaid: false, value: 5500000
      },
      { 
        id: 2, name: 'Didim Prefabrik Ev', city: 'Aydın', district: 'Didim', neighborhood: 'Akyeniköy',
        type: 'Ana Taşınmaz', adaParsel: '1268 / 20', unit: '-', floor: '0', area: '300', share: 'Tam',
        nitelik: 'Tek Katlı Prefabrik Ev', propertyNo: '14680312', icon: '🏡', status: 'Mülk Sahibi',
        income: 0, expense: 500, tax: 800, taxPaid: true, value: 3200000
      },
      { 
        id: 3, name: 'Eskişehir Tepebaşı Arsa', city: 'Eskişehir', district: 'Tepebaşı', neighborhood: 'Ömerağa',
        type: 'Arsa + Kat İrtifakı', adaParsel: '1012 / 38', unit: '5', floor: '-', area: '232.55', share: '1/8',
        nitelik: 'Arsa', propertyNo: '13738275', icon: '🗺️', status: 'Mülk Sahibi',
        income: 0, expense: 0, tax: 1200, taxPaid: false, value: 4800000
      }
    ],
    varliklar: [
      { id: 1, name: 'Altın Birikimi', amount: 125, unit: 'gr', price: 2500, type: 'gold', icon: '🟡' },
      { id: 2, name: 'Borsa Portföy', amount: 1500, unit: 'lot', price: 45.5, type: 'stock', icon: '📈' },
      { id: 3, name: 'Euro Nakit', amount: 1200, unit: 'EUR', price: 35.2, type: 'currency', icon: '💶' }
    ],
    kumbaralar: [
      { id: 1, name: 'Yeni Araba', target: 1500000, current: 450000, icon: '🚗' },
      { id: 2, name: 'Yaz Tatili', target: 80000, current: 25000, icon: '🌴' }
    ],
    privacyMode: false,
    rates: { EUR: 35.2, USD: 32.5 }
  },
  mutfak: {
    menu: {},          
    buzdolabi: INITIAL_FRIDGE,     
    kiler: INITIAL_PANTRY,
    dondurucu: INITIAL_FROZEN,
    alisveris: [],     
    tarifler: INITIAL_RECIPES,
    siparisler: [],    // { id, dt, fr, wh, pr, u, tm }
    restaurantlar: [], // list of strings for auto-fill
    su: { 
      level1: 80, 
      level2: 60, 
      dailyRate: 20, 
      lastChecked: new Date().toISOString(), 
      lastOrder: new Date().toISOString(), 
      history: [] 
    },
    consumption: {}, 
    sohbet: [],        
    arsiv: [],         
    history: [
      { id: 1714045200000, t: 'Akşama ne yesek? Mantı var dondurucuda.', w: 'Esra', d: '2026-04-25T17:00:00Z' },
      { id: 1714048800000, t: 'Olur, yanına da yoğurt sosu yaparız.', w: 'Görkem', d: '2026-04-25T18:00:00Z' },
      { id: 1714052400000, t: 'Waffle\'ın aşısı yaklaşıyor, hatırlatıcı kurdum.', w: 'Esra', d: '2026-04-25T19:00:00Z' },
      { id: 1713958800000, t: 'Marketten süt ve ekmek aldım.', w: 'Görkem', d: '2026-04-24T18:00:00Z' }
    ],       
    priceHistory: {},  
    ekmeklik: [],      // { id, tip, ic, raf, mk, adet, dt }
  },
  saglik: {
    randevular: [
      { id: 1, kisi: 'Esra', doktor: 'Diş Hekimi (Kontrol)', tarih: '2026-04-30', saat: '14:00', not: 'Alt dolgu kontrolü', rekurans: 'yok' },
      { id: 2, kisi: 'Görkem', doktor: 'Göz Hastalıkları', tarih: '2026-05-15', saat: '10:30', not: 'Numara ölçümü', rekurans: 'Yıllık' }
    ],
    ilaclar: [
      { id: 1, kisi: 'Esra', ad: 'Magnesium', dozaj: '1 Adet', siklik: 'Her Gece', stok: 20, minStok: 5 },
      { id: 2, kisi: 'Görkem', ad: 'Vitamin D', dozaj: '10 Damla', siklik: 'Her Sabah', stok: 15, minStok: 5 }
    ],
    olcumler: [
      { id: 1, kisi: 'Görkem', tur: 'Tansiyon', deger: '12/8', tarih: '2026-04-20' },
      { id: 2, kisi: 'Esra', tur: 'Ateş', deger: '36.5', tarih: '2026-04-25' }
    ],
    moods: [],       
    logs: []
  },
  // ── Global System ──────────────────────────────────
  system: {
    version: '2.29.1',
    globalScore: 85,
    onboardingComplete: false,
    notifications: [],
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
  hedefler: [],        
  sosyal: {
    aktiviteler: INITIAL_SOCIAL || [],   
    rutinler: [
      { id: 'r1', aktivite: 'Spor Salonu', kisi: 'Görkem', vakit: 'sabah', gunler: ['Pzt', 'Çar', 'Cum'], saati: '08:00', ucret: 0 },
      { id: 'r2', aktivite: 'Haftalık Temizlik', kisi: 'İkisi', vakit: 'öğle', gunler: ['Cmt'], saati: '11:00', ucret: 0 }
    ],
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
      brand: 'Volkswagen',
      model: 'Tiguan R-Line',
      plaka: '34 HH 1144',
      km: 45200,
      parts: [
        { id: 'oil', name: 'Motor Yağı', lastKM: 42000, intervalKM: 15000, lastDate: '2025-10-15', intervalDays: 365, icon: '🛢️' },
        { id: 'filter', name: 'Hava Filtresi', lastKM: 42000, intervalKM: 15000, lastDate: '2025-10-15', intervalDays: 365, icon: '🌪️' },
        { id: 'brakes', name: 'Fren Balataları', lastKM: 35000, intervalKM: 30000, lastDate: '2025-05-10', intervalDays: 730, icon: '🛑' }
      ],
      fuelLogs: INITIAL_VEHICLE.yakitlar,
      services: INITIAL_VEHICLE.hs,
      documents: [
        { id: 'muayene', name: 'TÜVTÜRK Muayene', dueDate: '2027-06-15', icon: '🔍' },
        { id: 'kasko', name: 'Kasko Sigortası', dueDate: '2026-11-20', icon: '🛡️' },
        { id: 'trafik', name: 'Trafik Sigortası', dueDate: '2026-11-20', icon: '📋' }
      ],
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
    faturalar: [
      { id: 1, name: 'Elektrik', provider: 'EnerjiSa', amount: 850, dueDate: '2026-04-20', status: 'Ödendi', autoPay: true, icon: '⚡' },
      { id: 2, name: 'İnternet', provider: 'TurkNet', amount: 399, dueDate: '2026-04-25', status: 'Bekliyor', autoPay: true, icon: '🌐' },
      { id: 3, name: 'Doğalgaz', provider: 'İGDAŞ', amount: 1250, dueDate: '2026-04-15', status: 'Ödendi', autoPay: false, icon: '🔥' }
    ],
    bakimlar: [
      { id: 'kombi', name: 'Kombi Bakımı', lastDate: '2025-11-01', intervalDays: 365, icon: '🔥' },
      { id: 'klima', name: 'Klima Temizliği', lastDate: '2025-06-15', intervalDays: 180, icon: '❄️' },
      { id: 'klima-filtre', name: 'Klima Filtresi', lastDate: new Date().toISOString().split('T')[0], intervalDays: 30, icon: '💨' },
      { id: 'hava-temizleme', name: 'Hava Temizleme', lastDate: new Date().toISOString().split('T')[0], intervalDays: 90, icon: '🍃' },
      { id: 'aritma', name: 'Su Arıtma Filtre', lastDate: '2026-01-10', intervalDays: 180, icon: '💧' }
    ],
    demirbaslar: [
      { id: 1, name: 'Buzdolabı', brand: 'Samsung', warrantyDate: '2027-05-10', photo: null },
      { id: 2, name: 'Çamaşır Mak.', brand: 'LG', warrantyDate: '2026-12-15', photo: null }
    ],
    tamirListesi: [
      { id: 1, task: 'Mutfak Musluğu Sızıntı', priority: 'High', status: 'Pending' }
    ],
    bakimListesi: [
      { id: 1, task: 'Bahçe Sulama Sistemi Kontrolü', priority: 'Normal', status: 'Pending' }
    ],
    ustaRehberi: [
      { id: 1, name: 'Tesisatçı Ahmet Usta', phone: '0555 123 4567', category: 'Tesisat', rating: 5 }
    ],
    abonelikler: [
      { id: 1, name: 'Netflix', amount: 189, date: '2026-04-15' },
      { id: 2, name: 'YouTube Prem.', amount: 59, date: '2026-04-10' },
      { id: 3, name: 'Gemini Advanced', amount: 719, date: '2026-04-27' }
    ],
    bitkiler: [
      { id: 1, name: 'Salon Çiçeği', lastWatered: '2026-04-22', interval: 3 }
    ],
    guvenlik: {
      wifi: { ssid: 'Eraylar_5G', pass: '********' },
      alarm: { code: '****', status: 'Armed' },
      fireExt: '2027-01-01'
    },
    yillikPlan: [
      { id: 1, task: 'Boya Badana', date: '2026-06-01', status: 'Planned' }
    ],
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
      deprem: [
        { id: 1, item: "Su (5L)", buyDate: "2026-01-01", expDate: "2027-01-01" },
        { id: 2, item: "Konserve Gıda", buyDate: "2026-02-01", expDate: "2028-02-01" },
        { id: 3, item: "Piller", buyDate: "2026-03-01", expDate: "2030-03-01" }
      ],
      ilkyardim: [
        { id: 1, item: "Ağrı Kesici", buyDate: "2026-01-10", expDate: "2027-01-10" },
        { id: 2, item: "Sargı Bezi", buyDate: "2025-05-15", expDate: "2028-05-15" }
      ]
    },
    personalSafe: {
      locked: true,
      notes: ""
    }
  },
  pet: {
    meta: PET_META,
    vaccines: VACCINES,
    weights: INITIAL_WEIGHTS,
    history: [],
    supplies: { waffle: { mama: 'var', kum: 'var' }, mayis: { mama: 'var', kum: 'var' } },
    gallery: { waffle: [], mayis: [] }
  },
  tatil: {
    trips: INITIAL_TRIPS,       
    wishlist: [
      { id: 1, place: 'Tokyo, Japonya', notes: 'Kiraz çiçekleri zamanı gitmeli 🌸', user: 'Görkem', date: '2026-04-26T10:00:00Z' },
      { id: 2, place: 'İzlanda', notes: 'Kuzey ışıkları ve road trip 🇮🇸', user: 'Esra', date: '2026-04-26T11:00:00Z' }
    ],
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
    visas: [
      { id: 1, type: 'Schengen', owner: 'gorkem', start: '2025-05-01', end: '2026-05-01', entries: 'Multi', country: 'Almanya' },
      { id: 2, type: 'Schengen', owner: 'esra', start: '2025-05-01', end: '2026-05-01', entries: 'Multi', country: 'Almanya' }
    ],
    ttab: 'trips'
  },
  achievements: ACHIEVEMENTS,    
  logs: [],
  ui: {
    isModalOpen: false
  },
  currentUser: null, // { name: 'Görkem', emoji: '👨‍💻' } or { name: 'Esra', emoji: '👩‍🍳' }
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

async function pushToSupabase(appData) {
  try {
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

function extractAppData(state, forPersist = false) {
  const data = {
    finans:    state.finans,
    users:     state.users,
    kasa:      state.kasa,
    mutfak:    state.mutfak,
    saglik:    state.saglik,
    alisveris: state.alisveris,
    hedefler:  state.hedefler,
    sosyal:    state.sosyal,
    ev:        state.ev,
    pet:       state.pet,
    garaj:     state.garaj,
    selectedVehicleId: state.selectedVehicleId,
    tatil:     state.tatil,
    achievements: state.achievements,
    logs:      state.logs,
  };

  // If for localStorage (5MB limit), strip heavy photos
  if (forPersist && data.tatil?.trips) {
    data.tatil = {
      ...data.tatil,
      trips: data.tatil.trips.map(t => ({
        ...t,
        photos: [], // Omit photos from local storage
        evaluations: t.evaluations ? Object.fromEntries(
          Object.entries(t.evaluations).map(([user, ev]) => [user, { ...ev, photos: [] }])
        ) : t.evaluations
      }))
    };
  }

  return data;
}

const DEFAULT_SETTINGS = {
  silentMode: false,
};

const useStore = create(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      settings: DEFAULT_SETTINGS,
      syncing: false,
      isOnline: true,

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
        get().saveToSupabase();
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
        get().saveToSupabase();
      },

      toggleSilentMode: () => {
        const state = get();
        const newValue = !state.settings.silentMode;
        set({ settings: { ...state.settings, silentMode: newValue } });
        get().addLog('Sistem Ayarı', `Sessiz Mod ${newValue ? 'Açıldı' : 'Kapatıldı'}`);
        get().saveToSupabase();
      },

      updateUser: (userId, updates) => {
        const state = get();
        const updatedUsers = {
          ...state.users,
          [userId]: { ...state.users[userId], ...updates }
        };
        set({ users: updatedUsers });
        get().addLog('Profil Güncelleme', `${state.users[userId].name} bilgilerini güncelledi.`);
        get().saveToSupabase();
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
        get().saveToSupabase();
      },

      takeMedicine: (medId) => {
        const state = get();
        const meds = [...state.saglik.ilaclar];
        const idx = meds.findIndex(m => m.id === medId);
        if (idx === -1) return;

        const med = meds[idx];
        const newStok = Math.max(0, (med.stok || 0) - 1);
        meds[idx] = { ...med, stok: newStok };

        const log = { 
          id: Date.now(), 
          medId: med.id, 
          ad: med.ad, 
          kisi: med.kisi, 
          dt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) 
        };
        const updatedLogs = [log, ...(state.saglik.logs || [])].slice(0, 50);

        set({ saglik: { ...state.saglik, ilaclar: meds, logs: updatedLogs } });
        
        if (newStok <= (med.minStok || 5)) {
          get().addLog('İlaç Azaldı', `${med.ad} stoğu kritik seviyeye düştü (${newStok} adet kaldı). Yenisini almayı unutmayın!`);
        }
        
        get().saveToSupabase();
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
        if (state.ev?.bakim) {
          state.ev.bakim.forEach(b => {
            const diff = new Date(b.nextDate) - now;
            if (diff > 0 && diff < sevenDays) {
              notificationService.send('🏠 Ev Bakımı', `${b.title} zamanı yaklaşıyor!`);
            }
          });
        }
      },

      initSync: async () => {
        await get().loadFromSupabase();
        get().subscribeToSupabase();
        
        // Veri yüklendikten sonra bildirimleri kontrol et
        setTimeout(() => get().checkSystemNotifications(), 2000);

        // Final fallback: if still empty after sync, restore defaults
        const current = get();
        if (!current.mutfak.tarifler || current.mutfak.tarifler.length === 0) {
          console.warn('🔄 Restoring mutfak defaults...');
          set({ mutfak: DEFAULT_STATE.mutfak });
        }
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

          set({
            users:     remote.users || DEFAULT_STATE.users,
            finans:    remote.finans || legacyFinans || DEFAULT_STATE.finans,
            kasa:      remote.kasa || (legacyFinans ? remote.kasa : DEFAULT_STATE.kasa),
            mutfak:    { 
              ...DEFAULT_STATE.mutfak, 
              ...remote.mutfak,
              // Ensure critical arrays exist even if remote is missing them
              tarifler: remote.mutfak?.tarifler || DEFAULT_STATE.mutfak.tarifler,
              buzdolabi: remote.mutfak?.buzdolabi || DEFAULT_STATE.mutfak.buzdolabi,
              kiler: remote.mutfak?.kiler || DEFAULT_STATE.mutfak.kiler,
              dondurucu: remote.mutfak?.dondurucu || DEFAULT_STATE.mutfak.dondurucu,
              alisveris: remote.mutfak?.alisveris || DEFAULT_STATE.mutfak.alisveris,
              sohbet: remote.mutfak?.sohbet || DEFAULT_STATE.mutfak.sohbet,
            },
            saglik:    { ...DEFAULT_STATE.saglik, ...remote.saglik },
            alisveris: remote.alisveris || DEFAULT_STATE.alisveris,
            hedefler:  remote.hedefler  || DEFAULT_STATE.hedefler,
            sosyal:    { ...DEFAULT_STATE.sosyal, ...remote.sosyal },
            ev:        { ...DEFAULT_STATE.ev, ...remote.ev },
            pet:       { ...DEFAULT_STATE.pet, ...remote.pet },
            garaj:     remote.garaj || (remote.aracim ? [{ ...DEFAULT_STATE.garaj[0], ...remote.aracim, id: 'v1' }] : DEFAULT_STATE.garaj),
            selectedVehicleId: remote.selectedVehicleId || 'v1',
            tatil:     { ...DEFAULT_STATE.tatil, ...remote.tatil },
            achievements: remote.achievements || DEFAULT_STATE.achievements,
            logs:      remote.logs || DEFAULT_STATE.logs,
            isOnline:  true
          });
        } else {
          set({ isOnline: false });
        }
        set({ syncing: false });
      },

      subscribed: false,
      subscribeToSupabase: () => {
        if (get().subscribed) return;

        supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'eraylar_store', filter: 'id=eq.1' }, 
          (payload) => {
            const prevState = get();
            const newData = payload.new.data;
            if (!newData) return;

            // Smart Notifications Check
            if (prevState.currentUser && !get().settings.silentMode) {

              // 1. New Sohbet Note
              if (newData.mutfak?.sohbet?.length > (prevState.mutfak.sohbet?.length || 0)) {
                const newNote = newData.mutfak.sohbet[0];
                if (newNote.w !== prevState.currentUser.name) {
                  const title = newNote.t.startsWith('🛒') ? '🛒 Alışveriş Listesi' : '📝 Yeni Not';
                  notificationService.send(title, `${newNote.w} sana bir mesaj bıraktı: ${newNote.t}`);
                }
              }

              // 3. New Expense
              if (newData.finans?.harcamalar?.length > (prevState.finans.harcamalar?.length || 0)) {
                const newExp = newData.finans.harcamalar[0];
                if (newExp.payer !== prevState.currentUser.name) {
                  notificationService.send('💸 Yeni Harcama', `${newExp.payer}, ${newExp.amount}₺ tutarında ${newExp.title} harcaması girdi.`);
                }
              }
            }

            set({ ...newData });
          })
          .subscribe();
        
        set({ subscribed: true });
      },

      saveToSupabase: async () => {
        try {
          await pushToSupabase(extractAppData(get()));
          set({ isOnline: true });
        } catch (err) {
          set({ isOnline: false });
        }
      },

      // ── Eraylar Finans Actions ───────────────────────────
      addExpense: (expense) => {
        const state = get();
        const newPoolItem = {
          id: Date.now(),
          dt: new Date().toISOString().split('T')[0],
          confirmed: false,
          ...expense
        };
        set({ finans: { ...state.finans, approvalPool: [newPoolItem, ...(state.finans.approvalPool || [])] } });
        get().saveToSupabase();
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
        if (yeniBakiyeler[payerKey] !== undefined && !item.cardId) {
          yeniBakiyeler[payerKey] -= Number(item.amount);
        }

        set({ 
          finans: { ...state.finans, harcamalar: updatedHarcamalar, approvalPool: updatedPool },
          kasa: { ...state.kasa, bakiyeler: yeniBakiyeler }
        });
        get().addLog('Harcama Onaylandı', `${item.payer}: ${item.amount}₺ - ${item.title}`);
        get().saveToSupabase();
        toast.success('Harcama onaylandı! ✅');
      },

      rejectExpense: (poolId) => {
        const state = get();
        const updatedPool = state.finans.approvalPool.filter(i => i.id !== poolId);
        set({ finans: { ...state.finans, approvalPool: updatedPool } });
        get().saveToSupabase();
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
        get().saveToSupabase();
      },
      
      togglePrivacyMode: () => {
        const state = get();
        set({ kasa: { ...state.kasa, privacyMode: !state.kasa.privacyMode } });
      },

      updateVarlik: async (id, updates) => {
        const state = get();
        const yeniVarliklar = state.kasa.varliklar.map(v => v.id === id ? { ...v, ...updates } : v);
        set({ kasa: { ...state.kasa, varliklar: yeniVarliklar } });
        get().saveToSupabase();
      },

      updateTasinmaz: async (id, updates) => {
        const state = get();
        const yeniTasinmazlar = state.kasa.tasinmazlar.map(t => t.id === id ? { ...t, ...updates } : t);
        set({ kasa: { ...state.kasa, tasinmazlar: yeniTasinmazlar } });
        get().saveToSupabase();
      },

      transferKasa: async (from, to, amount) => {
        const state = get();
        if (state.kasa.bakiyeler[from] < amount) throw new Error('Yetersiz bakiye!');
        
        set({
          kasa: {
            ...state.kasa,
            bakiyeler: {
              ...state.kasa.bakiyeler,
              [from]: state.kasa.bakiyeler[from] - amount,
              [to]: state.kasa.bakiyeler[to] + amount
            }
          }
        });
        get().addLog('Kasa Transferi', `${from} -> ${to}: ${amount}₺`);
        get().saveToSupabase();
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

      updateKasaBakiye: async (kisi, yeniTutar) => {
        const state = get();
        set({
          kasa: {
            ...state.kasa,
            bakiyeler: { ...state.kasa.bakiyeler, [kisi]: yeniTutar }
          }
        });
        get().saveToSupabase();
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


      addShoppingItem: (owner, item) => {
        const state = get();
        const newItem = {
          id: Date.now(),
          nm: item.nm,
          link: item.link || '',
          pr: Number(item.pr) || 0,
          dt: new Date().toISOString(),
          done: false,
          doneDate: null
        };
        const updatedList = [...(state.alisveris[owner] || []), newItem];
        set({ alisveris: { ...state.alisveris, [owner]: updatedList } });
        get().addLog('Alışveriş Listesi', `${owner} listesine eklendi: ${item.nm}`);
        get().saveToSupabase();
      },

      toggleShoppingItem: (owner, itemId) => {
        const state = get();
        const list = state.alisveris[owner].map(i => {
          if (i.id === itemId) {
            const newDone = !i.done;
            // If marked as done, send to Finans approval pool
            if (newDone && i.pr > 0) {
              get().addExpense({
                title: `Alışveriş: ${i.nm}`,
                amount: Number(i.pr),
                category: 'market',
                source: 'Alışveriş'
              });
            }
            return { ...i, done: newDone, doneDate: newDone ? new Date().toISOString() : null };
          }
          return i;
        });
        set({ alisveris: { ...state.alisveris, [owner]: list } });
        get().saveToSupabase();
      },

      deleteShoppingItem: (owner, itemId) => {
        const state = get();
        const updatedList = state.alisveris[owner].filter(item => item.id !== itemId);
        set({ alisveris: { ...state.alisveris, [owner]: updatedList } });
        get().saveToSupabase();
      },

      addTrip: (trip) => {
        const state = get();
        const newTrip = {
          id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(),
          family_id: state.family_id,
          user_id: state.currentUser?.id,
          status: 'planned', // Normalized status
          tripType: trip.tripType || 'tatil', 
          travelers: trip.travelers || 'ikimiz', 
          locationType: trip.locationType || 'yurtdisi', 
          transportType: trip.transportType || 'ucak', 
          valiz: { 
            gorkem: [
              { id: 1, text: 'Pasaport', done: false },
              { id: 2, text: 'Şarj Cihazları', done: false }
            ],
            esra: [
              { id: 1, text: 'Pasaport', done: false },
              { id: 2, text: 'Kozmetik / Bakım', done: false }
            ]
          },
          budget: { est: Number(trip.budget) || 0, real: 0 },
          ...trip,
          created_at: new Date().toISOString()
        };
        const updatedTrips = [...state.tatil.trips, newTrip];
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        get().addLog('Yeni Seyahat Planı', `${trip.title || trip.city} (${newTrip.travelers}) planlandı! ✈️`);
        get().saveToSupabase();
      },

      deleteTrip: (tripId) => {
        const state = get();
        const updatedTrips = state.tatil.trips.filter(t => t.id !== tripId);
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        get().addLog('Tatil Silindi', 'Bir tatil planı silindi. 🗑️');
        get().saveToSupabase();
      },

      updateTrip: (tripId, updates) => {
        const state = get();
        const updatedTrips = state.tatil.trips.map(t => 
          t.id === tripId ? { ...t, ...updates } : t
        );
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        get().saveToSupabase();
      },

      updateTripValiz: (tripId, person, itemId) => {
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
        get().saveToSupabase();
      },

      addTripExpense: (tripId, expense) => {
        const state = get();
        get().addExpense({
          title: `Seyahat: ${expense.title}`,
          amount: expense.amount,
          category: 'tatil',
          source: 'Tatil Modülü'
        });
        get().saveToSupabase();
      },

      completeTripEvaluation: (tripId, person, evalData) => {
      const state = get();
      const updatedTrips = state.tatil.trips.map(t => {
        if (t.id === tripId) {
          const newEvals = { ...t.evaluations, [person]: evalData };
          // Logic for auto-completion
          let newStatus = t.status;
          if (t.travelers === 'ikimiz') {
            if (newEvals.gorkem && newEvals.esra) newStatus = 'completed';
          } else {
            newStatus = 'completed';
          }
          return { ...t, evaluations: newEvals, status: newStatus };
        }
        return t;
      });
      set({ tatil: { ...state.tatil, trips: updatedTrips } });
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

      addDream: (dream) => {
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
        get().saveToSupabase();
      },

      completeTripEvaluation: (tripId, person, evaluation) => {
        const state = get();
        const updatedTrips = state.tatil.trips.map(t => {
          if (t.id === tripId) {
            const newEvals = { ...t.evaluations, [person]: evaluation };
            let newStatus = t.status;
            // Both must evaluate to complete
            if (newEvals.gorkem && newEvals.esra) {
              newStatus = 'tamamlandi';
            }
            return { ...t, evaluations: newEvals, status: newStatus };
          }
          return t;
        });
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        get().addLog('Seyahat Değerlendirmesi', `${person} seyahati değerlendirdi.`);
        get().saveToSupabase();
      },

      toggleTripChecklist: (tripId, itemId) => {
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
        get().saveToSupabase();
      },

      updateDebt: async (id, remaining) => {
        const state = get();
        const yeniBorclar = state.finans.borclar.map(b => b.id === id ? { ...b, remaining } : b);
        set({ finans: { ...state.finans, borclar: yeniBorclar } });
        get().saveToSupabase();
      },

      updateCard: async (id, balance) => {
        const state = get();
        const yeniKartlar = state.finans.kartlar.map(k => k.id === id ? { ...k, balance } : k);
        set({ finans: { ...state.finans, kartlar: yeniKartlar } });
        get().saveToSupabase();
      },

      // ── Mutfak Actions ───────────────────────────────────
      updateMenu: async (gun, ogun, yemek) => {
        const state = get();
        const mealKey = ogun === 'kahvalti' ? 'k' : 'a';
        const yeniMenu = {
          ...state.mutfak.menu,
          [gun]: { ...(state.mutfak.menu[gun] || {}), [mealKey]: yemek },
        };
        set({ mutfak: { ...state.mutfak, menu: yeniMenu } });
        get().saveToSupabase();
      },

      updateMenuDetail: async (gun, details) => {
        const state = get();
        const yeniMenu = {
          ...state.mutfak.menu,
          [gun]: { ...(state.mutfak.menu[gun] || {}), ...details },
        };
        set({ mutfak: { ...state.mutfak, menu: yeniMenu } });
        get().saveToSupabase();
      },

      syncRecipesFromData: () => {
        const state = get();
        console.log(`Force syncing ${INITIAL_RECIPES.length} recipes from data.js...`);
        
        // Mevcut tarifleri INITIAL_RECIPES ile tamamen değiştiriyoruz (Master liste öncelikli)
        const updatedTarifler = INITIAL_RECIPES.map((r, i) => ({ ...r, id: i + 1 }));
        
        set({ mutfak: { ...state.mutfak, tarifler: updatedTarifler } });
        get().saveToSupabase();
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

      setEatOut: async (dt, ml, info) => {
        const state = get();
        const { fr, pr } = info;
        const prefix = ml === 'k' ? 'k' : 'a';
        
        if (pr > 0) {
          get().addExpense({
            title: 'Dışarıda Yemek (' + (fr || 'Restoran') + ')',
            amount: pr,
            category: 'Mutfak',
            payer: state.currentUser?.name || 'Görkem'
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
      },

      setDelivery: async (dt, ml, info) => {
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
            payer: state.currentUser?.name || 'Görkem'
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
      },

      addRecipe: async (recipe) => {
        const state = get();
        const newRecipe = {
          id: Date.now(),
          f: false,
          p: 0,
          ...recipe
        };
        const yeniTarifler = [newRecipe, ...state.mutfak.tarifler];
        
        // Auto-add ingredients to stock if missing
        let updatedMutfak = { ...state.mutfak, tarifler: yeniTarifler };
        const allStock = [...updatedMutfak.buzdolabi, ...updatedMutfak.kiler, ...updatedMutfak.dondurucu];
        const stockNames = allStock.map(s => s.n.toLowerCase());
        
        (recipe.ig || []).forEach(igLine => {
          const name = igLine.split(':')[0].trim();
          if (name && !stockNames.includes(name.toLowerCase())) {
            updatedMutfak.kiler.push({
              n: name,
              cr: 0,
              mn: 1,
              u: 'adet',
              bt: new Date().toISOString()
            });
            stockNames.push(name.toLowerCase()); // prevent adding same ingredient twice within one recipe save
          }
        });

        set({ mutfak: updatedMutfak });
        get().saveToSupabase();
      },

      updateRecipe: async (id, updates) => {
        const state = get();
        const yeniTarifler = state.mutfak.tarifler.map(r => r.id === id ? { ...r, ...updates } : r);
        
        // Auto-add ingredients to stock if missing
        let updatedMutfak = { ...state.mutfak, tarifler: yeniTarifler };
        const allStock = [...updatedMutfak.buzdolabi, ...updatedMutfak.kiler, ...updatedMutfak.dondurucu];
        const stockNames = allStock.map(s => s.n.toLowerCase());
        
        (updates.ig || []).forEach(igLine => {
          const name = igLine.split(':')[0].trim();
          if (name && !stockNames.includes(name.toLowerCase())) {
            updatedMutfak.kiler.push({
              n: name,
              cr: 0,
              mn: 1,
              u: 'adet',
              bt: new Date().toISOString()
            });
            stockNames.push(name.toLowerCase());
          }
        });

        set({ mutfak: updatedMutfak });
        get().saveToSupabase();
      },

      deleteRecipe: async (id) => {
        const state = get();
        const yeniTarifler = state.mutfak.tarifler.filter(r => r.id !== id);
        set({ mutfak: { ...state.mutfak, tarifler: yeniTarifler } });
        get().saveToSupabase();
      },

      toggleFavorite: async (id) => {
        const state = get();
        const yeniTarifler = state.mutfak.tarifler.map(r => r.id === id ? { ...r, f: !r.f } : r);
        set({ mutfak: { ...state.mutfak, tarifler: yeniTarifler } });
        get().saveToSupabase();
      },

      updateWaterLevel: async (tank, level) => {
        const state = get();
        set({ 
          mutfak: { 
            ...state.mutfak, 
            su: { 
              ...state.mutfak.su, 
              [tank]: level,
              lastChecked: new Date().toISOString() // Reset timer on manual update
            } 
          } 
        });
        get().saveToSupabase();
      },

      setWaterDailyRate: (rate) => {
        const state = get();
        set({ mutfak: { ...state.mutfak, su: { ...state.mutfak.su, dailyRate: rate } } });
        get().saveToSupabase();
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

          set({ 
            mutfak: { 
              ...state.mutfak, 
              su: { 
                ...su, 
                level1: newLevel1, 
                level2: newLevel2,
                lastChecked: now.toISOString() 
              } 
            } 
          });
          get().saveToSupabase();
        }
      },

      addWaterOrder: async (qty = 2) => {
        const state = get();
        const yeniHistory = [{ dt: new Date().toISOString(), q: qty }, ...state.mutfak.su.history].slice(0, 20);
        set({ 
          mutfak: { 
            ...state.mutfak, 
            su: { ...state.mutfak.su, level1: 100, level2: 100, lastOrder: new Date().toISOString(), history: yeniHistory } 
          } 
        });
        get().saveToSupabase();
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
        get().saveToSupabase();
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
        get().saveToSupabase();
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
         get().saveToSupabase();
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
            get().saveToSupabase();
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
          get().saveToSupabase();
        }
        return addedCount;
      },

      addKitchenNote: (text, writer) => {
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
        // Sohbet keeps only 12 for the board view
        const yeniSohbet = [newNote, ...state.mutfak.sohbet].slice(0, 12);
        // History keeps everything (up to 500)
        const yeniHistory = [newNote, ...(state.mutfak.history || [])].slice(0, 500);
        
        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet, history: yeniHistory } });
        get().saveToSupabase();
      },

      updateNotePosition: (noteId, x, y) => {
        const state = get();
        const yeniSohbet = state.mutfak.sohbet.map(n => 
          n.id === noteId ? { ...n, x, y } : n
        );
        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet } });
        get().saveToSupabase();
      },

      markNoteAsRead: (noteId) => {
        const state = get();
        const yeniSohbet = state.mutfak.sohbet.map(n => n.id === noteId ? { ...n, r: true } : n);
        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet } });
        get().saveToSupabase();
      },

      removeNote: (noteId) => {
        const state = get();
        const note = state.mutfak.sohbet.find(n => n.id === noteId);
        const yeniSohbet = state.mutfak.sohbet.filter(n => n.id !== noteId);
        
        // When removed from board, move to archive just in case, but history already has it
        const yeniArsiv = note ? [{ ...note, archDate: new Date().toISOString() }, ...state.mutfak.arsiv].slice(0, 100) : state.mutfak.arsiv;
        
        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet, arsiv: yeniArsiv } });
        get().saveToSupabase();
      },

      archiveNote: (noteId) => {
        const state = get();
        const note = state.mutfak.sohbet.find(n => n.id === noteId);
        if (!note) return;
        const yeniSohbet = state.mutfak.sohbet.filter(n => n.id !== noteId);
        const yeniArsiv = [{ ...note, archDate: new Date().toISOString() }, ...state.mutfak.arsiv].slice(0, 100);
        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet, arsiv: yeniArsiv } });
        get().addLog('Not Arşivlendi', `${note.w} tarafından yazılan not arşive kaldırıldı.`);
        get().saveToSupabase();
      },

      restoreNote: (noteId) => {
        const state = get();
        const note = state.mutfak.arsiv.find(n => n.id === noteId);
        if (!note) return;
        const yeniArsiv = state.mutfak.arsiv.filter(n => n.id !== noteId);
        const yeniSohbet = [{ ...note, d: new Date().toISOString() }, ...state.mutfak.sohbet];
        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet, arsiv: yeniArsiv } });
        get().addLog('Not Geri Yüklendi', `Arşivden bir not geri yüklendi.`);
        get().saveToSupabase();
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
        get().saveToSupabase();
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

        // 3. Add to Stock
        const targetKey = loc === 'buz' ? 'buzdolabi' : loc === 'kil' ? 'kiler' : loc === 'don' ? 'dondurucu' : null;
        let finalMutfak = { ...state.mutfak, alisveris: yeniAlisveris };

        if (targetKey) {
          const items = [...state.mutfak[targetKey]];
          const idx = items.findIndex(x => x.n.toLowerCase() === item.nm.toLowerCase());
          
          const matchNum = (qt || '').match(/[\d.]+/);
          const num = parseFloat(matchNum?.[0]) || 1;
          const uStr = (qt || '').replace(/[\d.\s]/g, '').toLowerCase() || 'adet';

          if (idx !== -1) {
            items[idx] = { ...items[idx], cr: items[idx].cr + num, bt: new Date().toISOString() };
          } else {
            items.push({
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
          finalMutfak[targetKey] = items;
        }

        set({ mutfak: finalMutfak });
        get().saveToSupabase();
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
          get().saveToSupabase();
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
                      const shopMatch = inShopping.qt.match(/[\d.]+/);
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
          get().saveToSupabase();
          return true;
        }
        return false;
      },
      
      // ── Sosyal Actions ──────────────────────────────────
      addSocialActivity: (activity) => {
        const state = get();
        const newActivity = { 
          id: Date.now(), 
          tamamlandi: false, 
          durum: 'planda',
          ...activity 
        };
        const currentAkt = Array.isArray(state.sosyal.aktiviteler) ? state.sosyal.aktiviteler : [];
        set({ sosyal: { ...state.sosyal, aktiviteler: [newActivity, ...currentAkt] } });
        get().saveToSupabase();
      },

      updateSocialActivity: (id, updates) => {
        const state = get();
        const aktList = Array.isArray(state.sosyal.aktiviteler) ? state.sosyal.aktiviteler : [];
        const updatedAktiviteler = aktList.map(a => 
          a.id === id ? { ...a, ...updates } : a
        );
        set({ sosyal: { ...state.sosyal, aktiviteler: updatedAktiviteler } });
        get().saveToSupabase();
      },

      completeSocialActivity: (id, pGorkem, pEsra, cost = 0, comment = '') => {
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
            puan_gorkem: pGorkem, 
            puan_esra: pEsra, 
            harcama: cost,
            yorum: comment,
            doneDate: completionDate
          } : a
        );
        
        // 1. Finance Integration
        if (cost > 0) {
          get().addExpense({ 
            title: `🌟 Aktivite: ${act.baslik}`, 
            amount: Number(cost), 
            category: 'Sosyal Aktivite', 
            payer: 'ortak',
            dt: completionDate.split('T')[0]
          });
        }

        // 2. Pool Stats Update
        const yeniHavuz = (Array.isArray(state.sosyal.havuz) ? state.sosyal.havuz : []).map(p => {
          if (p.baslik.toLowerCase() === act.baslik.toLowerCase()) {
            return {
              ...p,
              count: (p.count || 0) + 1,
              last: `${new Date().toLocaleDateString('tr-TR')} · ${cost}₺`
            };
          }
          return p;
        });

        set({ sosyal: { ...state.sosyal, aktiviteler: yeniAktiviteler, havuz: yeniHavuz } });
        get().saveToSupabase();
      },

      cancelSocialActivity: (id) => {
        const state = get();
        const aktList3 = Array.isArray(state.sosyal.aktiviteler) ? state.sosyal.aktiviteler : [];
        const yeniAktiviteler = aktList3.filter(a => a.id !== id);
        set({ sosyal: { ...state.sosyal, aktiviteler: yeniAktiviteler } });
        get().saveToSupabase();
      },

      addSocialPoolItem: (item) => {
        const state = get();
        const newItem = { 
          id: Date.now(), 
          title: item.baslik || item.title,
          icon: item.emoji || item.icon || '💡',
          category: item.tur === 'disari' ? 'Dışarı' : item.tur === 'evde' ? 'Evde' : (item.category || 'Genel'),
          cost: item.harcama ? `${item.harcama} TL` : (item.cost || '0 TL'),
          duration: '1 saat',
          ...item 
        };
        const currentHavuz = Array.isArray(state.sosyal.havuz) ? state.sosyal.havuz : [];
        set({ sosyal: { ...state.sosyal, havuz: [newItem, ...currentHavuz] } });
        get().saveToSupabase();
      },

      updateSocialPoolItem: (id, updates) => {
        const state = get();
        const havuz = Array.isArray(state.sosyal.havuz) ? state.sosyal.havuz : [];
        const newHavuz = havuz.map(item => item.id === id ? { ...item, ...updates } : item);
        set({ sosyal: { ...state.sosyal, havuz: newHavuz } });
        get().saveToSupabase();
      },

      deleteSocialPoolItem: (id) => {
        const state = get();
        const currentHavuz = Array.isArray(state.sosyal.havuz) ? state.sosyal.havuz : [];
        set({ sosyal: { ...state.sosyal, havuz: currentHavuz.filter(i => i.id !== id) } });
        get().saveToSupabase();
      },

      addSocialRoutinePackage: (pkg) => {
        const state = get();
        const newPkg = { id: 'rp-' + Date.now(), ...pkg };
        const currentPkgs = Array.isArray(state.sosyal.routinePackages) ? state.sosyal.routinePackages : [];
        set({ sosyal: { ...state.sosyal, routinePackages: [newPkg, ...currentPkgs] } });
        get().saveToSupabase();
      },

      updateSocialRoutinePackage: (id, updates) => {
        const state = get();
        const pkgs = Array.isArray(state.sosyal.routinePackages) ? state.sosyal.routinePackages : [];
        const newPkgs = pkgs.map(p => p.id === id ? { ...p, ...updates } : p);
        set({ sosyal: { ...state.sosyal, routinePackages: newPkgs } });
        get().saveToSupabase();
      },

      deleteSocialRoutinePackage: (id) => {
        const state = get();
        const currentPkgs = Array.isArray(state.sosyal.routinePackages) ? state.sosyal.routinePackages : [];
        set({ sosyal: { ...state.sosyal, routinePackages: currentPkgs.filter(p => p.id !== id) } });
        get().saveToSupabase();
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
        const newRutin = { id: Date.now(), ...rutin };
        const currentRut = Array.isArray(state.sosyal.rutinler) ? state.sosyal.rutinler : [];
        set({ sosyal: { ...state.sosyal, rutinler: [newRutin, ...currentRut] } });
        get().saveToSupabase();
      },

      deleteRutin: (id) => {
        const state = get();
        const yeniRutinler = state.sosyal.rutinler.filter(r => r.id !== id);
        set({ sosyal: { ...state.sosyal, rutinler: yeniRutinler } });
        get().saveToSupabase();
      },


      // ── Ev Actions ─────────────────────────────────────
      addFatura: (fatura) => {
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
          source: 'Ev Hub',
          payer: 'ortak'
        });

        get().saveToSupabase();
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
        get().saveToSupabase();
        toast.success(`${fatura.name} faturası ödendi! 💸`);
      },

      addRepairItem: (item) => {
        const state = get();
        const newItem = { id: Date.now(), status: 'Pending', ...item };
        set({ ev: { ...state.ev, tamirListesi: [newItem, ...state.ev.tamirListesi] } });
        get().saveToSupabase();
      },

      addTasinmaz: (item) => {
        const state = get();
        const newItem = { 
          id: Date.now(), 
          value: 0, 
          tax: 0, 
          income: 0,
          expense: 0,
          icon: '🏠', 
          status: 'Mülk Sahibi', 
          taxPaid: false, 
          lastUpdate: new Date().toISOString().split('T')[0],
          ...item 
        };
        set({ kasa: { ...state.kasa, tasinmazlar: [...state.kasa.tasinmazlar, newItem] } });
        get().saveToSupabase();
        toast.success('Yeni taşınmaz portföye eklendi! 🏗️');
      },

      updateTasinmaz: (id, updates) => {
        const state = get();
        const updated = state.kasa.tasinmazlar.map(t => 
          t.id === id ? { ...t, ...updates, lastUpdate: new Date().toISOString().split('T')[0] } : t
        );
        set({ kasa: { ...state.kasa, tasinmazlar: updated } });
        get().saveToSupabase();
      },

      deleteTasinmaz: (id) => {
        const state = get();
        const updated = state.kasa.tasinmazlar.filter(t => t.id !== id);
        set({ kasa: { ...state.kasa, tasinmazlar: updated } });
        get().saveToSupabase();
        toast.success('Taşınmaz kaydı silindi.');
      },

      addBakimItem: (item) => {
        const state = get();
        const newItem = { id: Date.now(), status: 'Pending', ...item };
        set({ ev: { ...state.ev, bakimListesi: [newItem, ...(state.ev.bakimListesi || [])] } });
        get().saveToSupabase();
      },

      toggleHomeTask: (listType, id) => {
        const state = get();
        const list = state.ev[listType].map(item => 
          item.id === id ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' } : item
        );
        set({ ev: { ...state.ev, [listType]: list } });
        get().saveToSupabase();
      },

      deleteHomeTask: (listType, id) => {
        const state = get();
        const list = state.ev[listType].filter(item => item.id !== id);
        set({ ev: { ...state.ev, [listType]: list } });
        get().saveToSupabase();
      },

      updateHomeSecurity: (updates) => {
        const state = get();
        set({ ev: { ...state.ev, guvenlik: { ...state.ev.guvenlik, ...updates } } });
        get().saveToSupabase();
      },

      addPeriodicBakim: (item) => {
        const state = get();
        const newItem = { id: Date.now().toString(), lastDate: new Date().toISOString().split('T')[0], ...item };
        set({ ev: { ...state.ev, bakimlar: [...state.ev.bakimlar, newItem] } });
        get().saveToSupabase();
      },

      resetPeriodicBakim: (id) => {
        const state = get();
        const updated = state.ev.bakimlar.map(b => 
          b.id === id ? { ...b, lastDate: new Date().toISOString().split('T')[0] } : b
        );
        set({ ev: { ...state.ev, bakimlar: updated } });
        get().saveToSupabase();
        toast.success('Bakım zamanlayıcısı sıfırlandı! 🕒');
      },

      deletePeriodicBakim: (id) => {
        const state = get();
        const updated = state.ev.bakimlar.filter(b => b.id !== id);
        set({ ev: { ...state.ev, bakimlar: updated } });
        get().saveToSupabase();
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
        get().saveToSupabase();
      },

      addFuelLog: (log) => {
        const state = get();
        const vehicle = state.garaj.find(v => v.id === state.selectedVehicleId);
        if (!vehicle) return;

        const lastLog = vehicle.fuelLogs[0];
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
          v.id === state.selectedVehicleId 
            ? { 
                ...v, 
                km: Math.max(v.km, Number(log.km)), 
                fuelLogs: [newLog, ...v.fuelLogs].slice(0, 50) 
              } 
            : v
        );

        set({ garaj: updatedGaraj });
        
        get().addExpense({
          title: `Yakıt: ${log.station} (${vehicle.model})`,
          amount: log.amount * log.price,
          category: 'arac',
          source: 'Garaj'
        });

        get().saveToSupabase();
      },

      addServiceRecord: (record) => {
        const state = get();
        const vehicle = state.garaj.find(v => v.id === state.selectedVehicleId);
        if (!vehicle) return;

        const newRecord = { id: Date.now(), ...record };
        const updatedGaraj = state.garaj.map(v => 
          v.id === state.selectedVehicleId 
            ? { 
                ...v, 
                km: Math.max(v.km, Number(record.km)), 
                services: [newRecord, ...v.services] 
              } 
            : v
        );

        set({ garaj: updatedGaraj });
        
        get().addExpense({
          title: `Servis: ${record.title} (${vehicle.model})`,
          amount: record.cost,
          category: 'arac',
          source: 'Garaj'
        });

        get().saveToSupabase();
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
        get().saveToSupabase();
      },

      updateVehicle: (id, updates) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v => String(v.id) === String(id) ? { ...v, ...updates } : v);
        set({ garaj: updatedGaraj });
        get().saveToSupabase();
      },

      deleteVehicle: (id) => {
        const state = get();
        const updatedGaraj = state.garaj.filter(v => v.id !== id);
        const nextId = updatedGaraj.length > 0 ? updatedGaraj[0].id : null;
        set({ garaj: updatedGaraj, selectedVehicleId: nextId });
        get().saveToSupabase();
      },

      addWashRecord: (vehicleId, { price, date }) => {
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
            source: 'Garaj'
          });
        }

        get().saveToSupabase();
      },

      startParking: (vehicleId, parkData) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v => 
          v.id === vehicleId ? { ...v, parkLocation: { ...parkData, active: true } } : v
        );
        set({ garaj: updatedGaraj });
        get().saveToSupabase();
      },

      finishParking: (vehicleId, cost) => {
        const state = get();
        const vehicle = state.garaj.find(v => v.id === vehicleId);
        if (!vehicle) return;

        if (cost > 0) {
          get().addExpense({
            title: `Otopark: ${vehicle.model}`,
            amount: cost,
            category: 'arac',
            source: 'Garaj'
          });
        }

        const updatedGaraj = state.garaj.map(v => 
          v.id === vehicleId ? { ...v, parkLocation: { lat: null, lng: null, note: '', floor: '', spot: '', active: false } } : v
        );

        set({ garaj: updatedGaraj });
        get().saveToSupabase();
      },

      deleteServiceRecord: (vehicleId, serviceId) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v => 
          v.id === vehicleId ? { ...v, services: v.services.filter(s => s.id !== serviceId) } : v
        );
        set({ garaj: updatedGaraj });
        get().saveToSupabase();
      },

      deleteDocument: (vehicleId, docId) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v => 
          v.id === vehicleId ? { ...v, documents: v.documents.filter(d => d.id !== docId) } : v
        );
        set({ garaj: updatedGaraj });
        get().saveToSupabase();
      },

      addDocument: (vehicleId, doc) => {
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
            date: doc.startDate || new Date().toISOString().split('T')[0]
          });
        }

        get().saveToSupabase();
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
        get().saveToSupabase();
      },

      updateSupportContacts: (vehicleId, contacts) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v => 
          v.id === vehicleId ? { ...v, supportContacts: contacts } : v
        );
        set({ garaj: updatedGaraj });
        get().saveToSupabase();
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
        get().saveToSupabase();
      },

      deleteFuelLog: (vehicleId, logId) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v => 
          v.id === vehicleId ? { ...v, fuelLogs: v.fuelLogs.filter(l => l.id !== logId) } : v
        );
        set({ garaj: updatedGaraj });
        get().saveToSupabase();
      },

      // ── Pet Actions ────────────────────────────────────
      addPetVaccine: (petId, vaccine) => {
        const state = get();
        const currentVaccines = state.pet.vaccines[petId] || [];
        const yeniVaccines = [...currentVaccines, { id: Date.now(), ...vaccine }];
        set({ pet: { ...state.pet, vaccines: { ...state.pet.vaccines, [petId]: yeniVaccines } } });
        get().saveToSupabase();
      },

      deletePetVaccine: (petId, id) => {
        const state = get();
        const yeniVaccines = (state.pet.vaccines[petId] || []).filter(v => v.id !== id && v.n !== id);
        set({ pet: { ...state.pet, vaccines: { ...state.pet.vaccines, [petId]: yeniVaccines } } });
        get().saveToSupabase();
      },

      addPetWeight: (petId, weightData) => {
        const state = get();
        const currentWeights = state.pet.weights[petId] || [];
        const yeniWeights = [{ id: Date.now(), ...weightData }, ...currentWeights];
        set({ 
          pet: { 
            ...state.pet, 
            weights: { ...state.pet.weights, [petId]: yeniWeights },
            history: [
              { id: Date.now(), pet: petId, action: `Kilo güncellendi: ${weightData.w} kg`, dt: weightData.dt, type: 'weight' },
              ...(state.pet.history || [])
            ].slice(0, 50)
          } 
        });
        get().saveToSupabase();
      },

      deletePetWeight: (petId, id) => {
        const state = get();
        const yeniWeights = (state.pet.weights[petId] || []).filter(w => w.id !== id);
        set({ pet: { ...state.pet, weights: { ...state.pet.weights, [petId]: yeniWeights } } });
        get().saveToSupabase();
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

        yeniPet.history = (state.pet.history || []).filter(h => h.id !== id);
        
        set({ pet: yeniPet });
        get().saveToSupabase();
      },

      updatePetSupply: (petId, supplyType, status) => {
        const state = get();
        const supplies = { ...state.pet.supplies };
        if (!supplies[petId]) supplies[petId] = { mama: 'var', kum: 'var' };
        supplies[petId] = { ...supplies[petId], [supplyType]: status };
        set({ pet: { ...state.pet, supplies } });
        
        if (status === 'azaldi') {
          get().addLog('Pet Uyarısı', `${state.pet.meta[petId].name} için ${supplyType} azalıyor!`);
        }
        get().saveToSupabase();
      },

      addPetPhoto: (petId, photoUrl) => {
        const state = get();
        const gallery = { ...state.pet.gallery } || { waffle: [], mayis: [] };
        if (!gallery[petId]) gallery[petId] = [];
        gallery[petId] = [photoUrl, ...(gallery[petId] || [])].slice(0, 20);
        set({ pet: { ...state.pet, gallery } });
        get().saveToSupabase();
      },

      // ── Hedefler Actions ───────────────────────────────
      updateGoalProgress: (id, current) => {
        const state = get();
        const goals = state.hedefler.goals.map(g => 
          g.id === id ? { ...g, current } : g
        );
        set({ hedefler: { ...state.hedefler, goals } });
        get().saveToSupabase();
      },

      toggleHabit: (id) => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const habits = state.hedefler.habits.map(h => {
          if (h.id === id) {
            const isDone = h.lastDone === today;
            return { 
              ...h, 
              lastDone: isDone ? '' : today,
              streak: isDone ? Math.max(0, h.streak - 1) : h.streak + 1
            };
          }
          return h;
        });
        set({ hedefler: { ...state.hedefler, habits } });
        get().saveToSupabase();
      },

      completeGoal: (id) => {
        const state = get();
        const goal = state.hedefler.goals.find(g => g.id === id);
        if (!goal) return;

        const updatedGoals = state.hedefler.goals.filter(g => g.id !== id);
        const newHallItem = { ...goal, completedDate: new Date().toISOString().split('T')[0] };
        
        set({ 
          hedefler: { 
            ...state.hedefler, 
            goals: updatedGoals, 
            hallOfFame: [newHallItem, ...state.hedefler.hallOfFame] 
          } 
        });
        get().addLog('Hedef Tamamlandı', `🌟 Tebrikler! "${goal.title}" hedefine ulaşıldı!`);
        get().saveToSupabase();
      },

      // ── Tatil Actions ──────────────────────────────────
      deleteTrip: (id) => {
        const state = get();
        const updatedTrips = state.tatil.trips.filter(t => t.id !== id);
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        get().saveToSupabase();
      },

      // ── Depo v3.5 Foundation (Phase 1) ────────────────
      addDepoItem: (itemData) => {
        const state = get();
        const currentDepo = Array.isArray(state.ev.depo) ? state.ev.depo : [];
        const { name, mainCat, subCat, qty, price, source, note } = itemData;

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
        get().saveToSupabase();
      },

      deleteDepoItem: (id) => {
        const state = get();
        const updatedDepo = (state.ev.depo || []).filter(item => String(item.id) !== String(id));
        set({ ev: { ...state.ev, depo: updatedDepo } });
        get().saveToSupabase();
        toast.success('Ürün depodan silindi.');
      },

      clearDepo: () => {
        const state = get();
        set({ ev: { ...state.ev, depo: [] } });
        get().saveToSupabase();
        toast.success('Depo sıfırlandı. ✨');
      },

      syncValizToDepo: (name, source, qty = 1) => {
        // Wrapper for addDepoItem to maintain compatibility
        get().addDepoItem({
          name: name,
          source: source || 'valiz',
          qty: qty,
          note: 'Valizden aktarıldı'
        });
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
        get().saveToSupabase();
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
        get().saveToSupabase();
      },

      updateStockQty: (moduleKey, itemName, direction) => {
        const state = get();
        const updatedList = state.mutfak[moduleKey].map(item => {
          if (item.n === itemName) {
            const step = item.mn || 1;
            const delta = direction * step;
            const newQty = Math.max(0, (item.cr || 0) + delta);
            return { ...item, cr: Number(newQty.toFixed(2)) };
          }
          return item;
        });
        set({ mutfak: { ...state.mutfak, [moduleKey]: updatedList } });
        get().saveToSupabase();
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

      batchConfirmShopping: async (items, totalPrice, market, cardId) => {
        const state = get();
        let updatedMutfak = { ...state.mutfak };
        const itemIds = items.map(i => i.id);

        // 1. Remove from shopping list
        updatedMutfak.alisveris = updatedMutfak.alisveris.filter(i => !itemIds.includes(i.id));

        // 2. Add to stock
        items.forEach(item => {
          const targetLoc = item.loc === 'buz' ? 'buzdolabi' : (item.loc === 'don' ? 'dondurucu' : 'kiler');
          const stock = [...updatedMutfak[targetLoc]];
          const idx = stock.findIndex(s => s.n.toLowerCase() === item.nm.toLowerCase());

          // Parse quantity (e.g. "2 adet" -> 2)
          const qtyMatch = (item.qt || '').match(/(\d+\.?\d*)/);
          const addedQty = qtyMatch ? parseFloat(qtyMatch[1]) : 1;

          if (idx !== -1) {
            stock[idx] = { ...stock[idx], cr: stock[idx].cr + addedQty, mk: market || stock[idx].mk };
          } else {
            stock.push({
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
          get().addExpense({
            title: `Mutfak Alışverişi (${market || 'Market'})`,
            amount: totalPrice,
            category: 'Mutfak',
            payer: state.currentUser?.name || 'Görkem',
            cardId: cardId || null
          });
        }

        set({ mutfak: updatedMutfak });
        get().saveToSupabase();
      },

      setCurrentUser: (user) => {
        set({ currentUser: user });
      },

      updateExchangeRates: async () => {
        try {
          const res = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
          const data = await res.json();
          if (data && data.rates) {
            const eurRate = 1 / data.rates.EUR;
            const usdRate = 1 / data.rates.USD;
            
            set(state => ({ 
              kasa: { 
                ...state.kasa, 
                rates: { 
                  EUR: Number(eurRate.toFixed(2)), 
                  USD: Number(usdRate.toFixed(2)) 
                } 
              } 
            }));
            console.log('📈 Currency rates updated:', { EUR: eurRate.toFixed(2), USD: usdRate.toFixed(2) });
          }
        } catch (err) {
          console.error('Exchange rate fetch error:', err);
        }
      },

      resetMutfak: () => {
        set({ mutfak: DEFAULT_STATE.mutfak });
        get().saveToSupabase();
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
      }
    }),
    {
      name: 'eraylar-state-v5',
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
        const merged = { ...initialState, ...persistedState };
        // Deeply ensure critical modules have their arrays
        const ensureArray = (obj, key) => {
          if (obj && key in obj && !Array.isArray(obj[key])) {
            obj[key] = initialState[key] && Array.isArray(initialState[key]) ? initialState[key] : [];
          }
        };
        
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
        // Fix Alisveris
        if (merged.alisveris) {
          if (!Array.isArray(merged.alisveris.wishlist)) merged.alisveris.wishlist = [];
        }
        // Fix Kasa
        if (merged.kasa) {
          if (!Array.isArray(merged.kasa.tasinmazlar)) merged.kasa.tasinmazlar = [];
          if (merged.kasa.tasinmazlar.length === 0 && initialState.kasa.tasinmazlar.length > 0) {
            merged.kasa.tasinmazlar = initialState.kasa.tasinmazlar;
          }
        }
        if (merged.ev && !Array.isArray(merged.ev.faturalar)) merged.ev.faturalar = [];
        if (merged.saglik && !Array.isArray(merged.saglik.randevular)) merged.saglik.randevular = [];
        if (merged.tatil) {
          if (!Array.isArray(merged.tatil.trips)) merged.tatil.trips = [];
          // Migration for new trip structure (departure/return)
          merged.tatil.trips = merged.tatil.trips.map(t => {
            const hasNewStructure = t.transportation && t.transportation.departure;
            if (!hasNewStructure) {
              return {
                ...t,
                transportation: { 
                  departure: { flightNo: t.transportation?.flightNo || '', airline: t.transportation?.airline || '', pnr: t.transportation?.pnr || '', time: t.transportation?.time || '', status: 'Planlandı' },
                  return: { flightNo: '', airline: '', pnr: '', time: '', status: 'Planlandı' }
                }
              };
            }
            return t;
          });

          // Specially update Viyana trip if it's the one from the screenshot
          const viennaTrip = merged.tatil.trips.find(t => t.title?.includes('Viyana'));
          if (viennaTrip && !viennaTrip.transportation?.return?.flightNo) {
             viennaTrip.transportation.departure = { flightNo: 'PC903', airline: 'Pegasus', pnr: '1TG17K', time: '10:15 (SAW)', status: 'Planlandı' };
             viennaTrip.transportation.return = { flightNo: 'PC904', airline: 'Pegasus', pnr: '1TG17K', time: '12:20 (VIE)', status: 'Planlandı' };
             viennaTrip.accommodation = { 
               hotel: 'Austria Trend Hotel Europa Wien', 
               address: 'Kärntner Str. 18, 1010 Wien', 
               bookingId: '3824.152.941', 
               link: 'https://www.booking.com/hotel/at/austriatrendhoteleuropa.tr.html' 
             };
          }
        }
        if (merged.pet && !Array.isArray(merged.pet.vaccines)) merged.pet.vaccines = [];
        if (!Array.isArray(merged.logs)) merged.logs = [];
        
        return merged;
      }
    }
  )
);

if (typeof window !== 'undefined') {
  window.useStore = useStore;
}

export default useStore;
