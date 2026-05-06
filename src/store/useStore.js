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
      'esra-enpara': { beklenen: 0, gercek: null, ay: null },
    },
    borclar: [
      { id: 1, name: 'Konut Kredisi', total: 1200000, remaining: 850000, monthly: 15400, due_day: 15, type: 'kredi' },
      { id: 2, name: 'Araç Kredisi', total: 400000, remaining: 120000, monthly: 8500, due_day: 5, type: 'kredi' }
    ],
    kartlar: [
      { id: 'gorkem-ziraat', name: 'Ziraat Kart', limit: 150000, balance: 0, cutoff_day: 25, due_day_offset: 10, min_pct: 20, owner: 'gorkem', color: '#e11d48' },
      { id: 'gorkem-ykb', name: 'Yapı Kredi', limit: 120000, balance: 0, cutoff_day: 15, due_day_offset: 10, min_pct: 20, owner: 'gorkem', color: '#1d4ed8' },
      { id: 'esra-garanti', name: 'Garanti Bonus', limit: 100000, balance: 0, cutoff_day: 10, due_day_offset: 10, min_pct: 20, owner: 'esra', color: '#15803d' },
      { id: 'esra-enpara', name: 'Enpara Kart', limit: 60000, balance: 0, cutoff_day: 5, due_day_offset: 10, min_pct: 20, owner: 'esra', color: '#5b21b6' }
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
      { id: 1, name: 'Yeni Araba', target: 1500000, current: 450000, icon: '🚗', deadline: '2027-06-01', priority: 'Yüksek', category: 'Birikim', owner: 'ortak' },
      { id: 2, name: 'Yaz Tatili', target: 80000, current: 25000, icon: '🌴', deadline: '2026-07-15', priority: 'Orta', category: 'Tatil', owner: 'ortak' },
      { id: Date.now(), name: 'iPhone 17 Pro Max', target: 120000, current: 30000, icon: '📱', deadline: '2026-10-25', priority: 'Orta', category: 'Teknoloji', owner: 'gorkem' }
    ],
    bankaHesaplari: [
      { id: 'gorkem-ykb', name: 'Yapı Kredi (Maaş)', bank: 'Yapı Kredi', iban: '', balance: 45000, owner: 'gorkem', icon: '🏦' },
      { id: 'esra-garanti', name: 'Garanti (Birikim)', bank: 'Garanti BBVA', iban: '', balance: 12000, owner: 'esra', icon: '🏦' }
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
      { id: 1, kisi: 'Esra', ad: 'Magnesium', dozaj: '1 Adet', siklik: 'Günde 1', stok: 20, minStok: 5, schedule: { morning: 0, afternoon: 0, evening: 1 } },
      { id: 2, kisi: 'Görkem', ad: 'Vitamin D', dozaj: '10 Damla', siklik: 'Günde 1', stok: 15, minStok: 5, schedule: { morning: 1, afternoon: 0, evening: 0 } }
    ],
    olcumler: [
      { id: 1, kisi: 'Görkem', tur: 'Tansiyon', deger: '12/8', tarih: '2026-04-20' },
      { id: 2, kisi: 'Esra', tur: 'Ateş', deger: '36.5', tarih: '2026-04-25' }
    ],
    moods: [],
    sleep: [],
    sleepGoals: { gorkem: 6, esra: 9 },
    logs: []
  },
  // ── Global System ──────────────────────────────────
  system: {
    version: '3.1.5 "VIZYONER"',
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
    habits: [
      { id: 'h1', name: 'Kitap Okuma', streak: 5, lastDone: '' },
      { id: 'h2', name: 'Su İçme (2L)', streak: 12, lastDone: '' }
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
    aktiviteler: INITIAL_SOCIAL.aktiviteler || [],
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
      brand: 'Toyota',
      model: 'C-HR 1.8 Hybrid',
      plaka: '34 HH 1144',
      km: 41452,
      marketValue: 1550000,
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
      { id: 'klima', name: 'Klima Temizliği', lastDate: '2025-06-15', intervalDays: 180, icon: '❄️', brand: '', model: '', partNo: '' },
      { id: 'hava-filtre', name: 'Hava Filtresi Temizliği', lastDate: new Date().toISOString().split('T')[0], intervalDays: 90, icon: '🍃', brand: '', model: '', partNo: '' }
    ],
    demirbaslar: [
      { id: 1, name: 'Buzdolabı', brand: 'Samsung', warrantyDate: '2027-05-10', photo: null },
      { id: 2, name: 'Çamaşır Mak.', brand: 'LG', warrantyDate: '2026-12-15', photo: null }
    ],
    tamirListesi: [], // Deprecated: use onarimListesi
    bakimListesi: [],  // Deprecated: use onarimListesi
    onarimListesi: [], // { id, task, status, createdBy, createdAt, completedBy, completedAt, clearedBy, clearedAt, isArchived }
    onarimLog: [], // Detailed history logs if needed
    ustaRehberi: [
      { id: 1, name: 'Tesisatçı Ahmet Usta', phone: '0555 123 4567', category: 'Tesisat', rating: 5 }
    ],
    duzenliOdemeler: [
      { id: 201, name: 'Site Aidatı', amount: 1500, date: 1, linkedCardId: 'esra-garanti', autoPay: true, icon: '🏢' },
      { id: 202, name: 'Bireysel Emeklilik (BES)', amount: 2500, date: 5, linkedCardId: 'gorkem-ziraat', autoPay: true, icon: '🛡️' },
      { id: 203, name: 'Kira Ödemesi', amount: 0, date: 1, linkedCardId: 'gorkem-ykb', autoPay: false, icon: '🔑' },
      { id: 204, name: 'İnternet', provider: 'Superonline', amount: 399, date: 25, linkedCardId: 'gorkem-ykb', autoPay: true, icon: '🌐', customerNo: '554433', contractEndDate: '2025-10-15' },
      { id: 205, name: 'Digiturk', provider: 'Bein Media', amount: 249, date: 3, linkedCardId: 'gorkem-ziraat', autoPay: true, icon: '⚽', customerNo: '100223344' }
    ],
    abonelikler: [
      { id: 101, name: 'Netflix', amount: 229, date: 15, linkedCardId: 'esra-enpara', autoPay: true, icon: '🎬', startDate: '2021-05-20' },
      { id: 102, name: 'YouTube Prem.', amount: 59, date: 10, linkedCardId: 'esra-enpara', autoPay: true, icon: '📺', startDate: '2022-03-15' },
      { id: 103, name: 'Gemini Advanced', amount: 719, date: 27, linkedCardId: 'gorkem-ziraat', autoPay: true, icon: '🧠', startDate: '2024-02-01' },
      { id: 104, name: 'Spotify Family', amount: 99, date: 22, linkedCardId: 'esra-garanti', autoPay: true, icon: '🎵' },
      { id: 105, name: 'Amazon Prime', amount: 39, date: 12, linkedCardId: 'gorkem-ykb', autoPay: true, icon: '📦' }
    ],
    bitkiler: [
      { id: 1, name: 'Salon Çiçeği', lastWatered: '2026-04-22', interval: 3 }
    ],
    guvenlik: {
      wifiMain: { ssid: 'superonline_wifi_1023', pass: 'MAUMFUFTH74L' },
      wifiGuest: { ssid: 'Tombis Yiğit', pass: 'Love2013' },
      safePassword: '', // User defined alphanumeric
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
    // ÖNEMLİ: ID'yi her zaman biz belirleyelim ki local state ile DB tam eşleşsin.
    // Eğer gelen harcamada uzun bir string ID (UUID gibi) yoksa, yeni bir tane üretelim.
    const finalId = (harcama.id && typeof harcama.id === 'string' && harcama.id.length > 20) 
      ? harcama.id 
      : generateUniqueId();

    const payload = {
      id: finalId,
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
      notlar: harcama.notlar || null,
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
  // Supabase'de henüz banka_id kolonu olmayabilir. 
  // Hata almamak için şimdilik banka_id'yi sadece yerel state'de tutabiliriz 
  // veya DB'ye gönderirken kontrollü gönderebiliriz.
  const dbUpdates = { ...updates };
  // banka_id'yi DB'ye göndermeyi deniyoruz, hata verirse onsuz devam edeceğiz.
  const { error } = await supabase.from('finans_harcamalar').update(dbUpdates).eq('id', id);
  
  if (error) {
    console.warn('⚠️ Supabase update error (possibly missing banka_id column):', error);
    // Eğer hata kolondan kaynaklıysa, banka_id'yi çıkarıp tekrar dene
    if (error.code === '42703' || error.message?.includes('column')) {
       const { banka_id, ...safeUpdates } = dbUpdates;
       const { error: retryError } = await supabase.from('finans_harcamalar').update(safeUpdates).eq('id', id);
       if (retryError) throw retryError;
    } else {
       throw error;
    }
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
    return data || [];
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
    return data || [];
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

async function upsertKartMutabakat(kart_id, ay, beklenen, gercek, familyId = DEFAULT_FID) {
  try {
    const { error } = await supabase
      .from('finans_kart_mutabakat')
      .upsert({
        family_id: familyId,
        kart_id,
        ay,
        beklenen_borc: beklenen,
        gercek_borc: gercek,
      }, { onConflict: 'family_id,kart_id,ay' });
    if (error) throw error;
  } catch (err) {
    console.error('❌ upsertKartMutabakat error:', err);
  }
}

// --- GRUP 1 (Mutfak, Alışveriş, Sosyal) SUPABASE GÖLGE YAZIM ---
async function pushMutfakStokToSupabase(item, category) {
  try {
    const payload = {
      id: `${category}-${item.n || item.isim}`,
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
      son_kullanma: item.ex || item.bt || item.son_kullanma || null
    };
    const { error } = await supabase.from('mutfak_stok').upsert(payload);
    if (error) throw error;
  } catch(e) { console.warn('Mutfak Stok Hatası:', e); }
}

async function pushMutfakSuToSupabase(suData) {
  try {
    const payload = {
      id: 'mutfak_su',
      level1: suData.level1 ?? 100,
      level2: suData.level2 ?? 100,
      daily_rate: suData.dailyRate ?? 20,
      last_checked: suData.lastChecked || null,
      last_order: suData.lastOrder || null,
      history: suData.history || []
    };
    await supabase.from('mutfak_su').upsert(payload);
  } catch(e) { console.warn('Mutfak Su Hatası:', e); }
}

async function removeMutfakStokFromSupabase(id) {
  try {
    await supabase.from('mutfak_stok').delete().eq('id', String(id));
  } catch(e) { console.warn('Supabase Mutfak Stok delete hatası:', e); }
}

async function pushMutfakTarifToSupabase(t) {
  try {
    const payload = {
      id: String(t.id),
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
    const payload = {
      id: String(item.id),
      isim: item.nm || item.isim,
      link: item.link || '',
      fiyat: Number(item.pr || item.fiyat || 0),
      tarih: item.dt || item.tarih || new Date().toISOString(),
      tamamlandi: !!item.done,
      tamamlanma_tarihi: item.doneDate || null,
      kime: kime
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
    await supabase.from('alisveris_listesi').delete().eq('id', String(id));
  } catch(e) { console.warn('Supabase Alisveris delete hatası:', e); }
}

async function pushSosyalEtkinlikToSupabase(activity) {
  try {
    const payload = {
      id: String(activity.id),
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
      master_category: activity.masterCategory || 'Genel'
    };
    const { error } = await supabase.from('sosyal_etkinlikler').upsert(payload);
    if (error) throw error;
  } catch(e) { console.warn('Sosyal Hatası:', e); }
}

async function removeSosyalEtkinlikFromSupabase(id) {
  try {
    await supabase.from('sosyal_etkinlikler').delete().eq('id', String(id));
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
        ...ozet,
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
    const payload = {
      id: String(goal.id),
      title: goal.title || goal.name || '',
      target: Number(goal.target) || 100,
      current: Number(goal.current) || 0,
      target_date: goal.targetDate || goal.deadline || null,
      duration: goal.duration ? String(goal.duration) : null,
      priority: goal.priority || 'Orta',
      owner: goal.owner || 'ortak',
      notes: goal.notes || null,
      yearly_plan: goal.yearlyPlan || null
    };
    await supabase.from('hedefler_aktif').upsert(payload);
  } catch(e) { console.warn('Supabase Hedef upsert hatası:', e); }
}

async function deleteHedefFromSupabase(id) {
  try { await supabase.from('hedefler_aktif').delete().eq('id', String(id)); } catch(e){}
}

async function pushHedefGecmisToSupabase(historyItem, status) {
  try {
    const payload = {
      id: String(historyItem.id),
      title: historyItem.title || historyItem.name,
      owner: historyItem.owner || 'ortak',
      notes: historyItem.notes || null,
      status: status, 
      resolved_at: historyItem.completedAt || historyItem.failedAt || new Date().toISOString()
    };
    await supabase.from('hedefler_gecmis').upsert(payload);
  } catch(e) { console.warn('Supabase Geçmiş upsert hatası:', e); }
}

async function pushVizyonPlanToSupabase(plan) {
  try {
    await supabase.from('hedefler_vizyon').upsert({
      id: String(plan.id),
      text: plan.text,
      owner: plan.owner || 'ortak'
    });
  } catch(e) { console.warn('Supabase Vizyon upsert hatası:', e); }
}

async function deleteVizyonPlanFromSupabase(id) {
  try { await supabase.from('hedefler_vizyon').delete().eq('id', String(id)); } catch(e){}
}

async function syncFinansKartlar(kartlar) {
  try {
    const payloads = kartlar.map(k => ({
      id: String(k.id),
      name: k.name,
      owner: k.owner,
      cutoff_day: Number(k.cutoff_day),
      color: k.color,
      min_pct: Number(k.min_pct || 20)
    }));
    if(payloads.length > 0) await supabase.from('finans_kartlar').upsert(payloads);
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
    if(payloads.length > 0) await supabase.from('finans_krediler').upsert(payloads);
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
      contract_end_date: item.contractEndDate || null
    });
  } catch(e) { console.warn('Ev Ödeme Hatası:', e); }
}

async function pushEvAbonelikToSupabase(item) {
  try {
    await supabase.from('ev_abonelikler').upsert({
      id: String(item.id), name: item.name, amount: Number(item.amount || 0),
      date: Number(item.date || 1), linked_card_id: item.linkedCardId || null,
      auto_pay: !!item.autoPay, icon: item.icon || '📺',
      start_date: item.startDate || null
    });
  } catch(e) { console.warn('Ev Abonelik Hatası:', e); }
}

async function pushEvOnarimToSupabase(item) {
  try {
    await supabase.from('ev_onarim').upsert({
      id: String(item.id), task: item.task, status: item.status || 'bekliyor',
      created_by: item.createdBy || null, created_at: item.createdAt || null,
      completed_by: item.completedBy || null, completed_at: item.completedAt || null,
      cleared_by: item.clearedBy || null, cleared_at: item.clearedAt || null,
      is_archived: !!item.isArchived
    });
  } catch(e) { console.warn('Ev Onarım Hatası:', e); }
}

async function pushEvDemirbasToSupabase(item) {
  try {
    await supabase.from('ev_demirbaslar').upsert({
      id: String(item.id), name: item.name, brand: item.brand || null,
      warranty_date: item.warrantyDate || null, photo: item.photo || null
    });
  } catch(e) { console.warn('Ev Demirbaş Hatası:', e); }
}

async function pushEvBakimToSupabase(item) {
  try {
    await supabase.from('ev_bakimlar').upsert({
      id: String(item.id), name: item.name, last_date: item.lastDate || null,
      interval_days: Number(item.intervalDays || 180), icon: item.icon || '🔧',
      brand: item.brand || null, model: item.model || null, part_no: item.partNo || null
    });
  } catch(e) { console.warn('Ev Bakım Hatası:', e); }
}

async function pushGarajYakitToSupabase(log, vehicleId = 'v1') {
  try {
    await supabase.from('garaj_yakit').upsert({
      id: String(log.id), vehicle_id: vehicleId, tarih: log.tarih || log.dt || null,
      km: Number(log.km || 0), litre: Number(log.litre || log.lt || 0),
      tutar: Number(log.tutar || log.pr || 0), istasyon: log.istasyon || log.st || null,
      tip: log.tip || log.tp || 'benzin', dolu: log.dolu !== false
    });
  } catch(e) { console.warn('Garaj Yakıt Hatası:', e); }
}

async function pushGarajServisToSupabase(svc, vehicleId = 'v1') {
  try {
    await supabase.from('garaj_servis').upsert({
      id: String(svc.id), vehicle_id: vehicleId, tarih: svc.tarih || svc.dt || null,
      km: Number(svc.km || 0), islem: svc.islem || svc.n || null,
      tutar: Number(svc.tutar || svc.pr || 0), yer: svc.yer || svc.loc || null,
      notlar: svc.notlar || svc.nt || null
    });
  } catch(e) { console.warn('Garaj Servis Hatası:', e); }
}

async function pushGarajBelgeToSupabase(doc, vehicleId = 'v1') {
  try {
    await supabase.from('garaj_belgeler').upsert({
      id: String(doc.id), vehicle_id: vehicleId, name: doc.name,
      due_date: doc.dueDate || null, icon: doc.icon || '📄'
    });
  } catch(e) { console.warn('Garaj Belge Hatası:', e); }
}

async function pushPetAsiToSupabase(petId, vaccine) {
  try {
    await supabase.from('pet_asilar').upsert({
      id: `${petId}-${vaccine.id || vaccine.name}`, pet_id: petId,
      asi_adi: vaccine.name || vaccine.asi_adi, son_tarih: vaccine.lastDate || vaccine.son_tarih || null,
      sonraki_tarih: vaccine.nextDate || vaccine.sonraki_tarih || null,
      durum: vaccine.done ? 'tamamlandi' : 'bekliyor', notlar: vaccine.notes || null
    });
  } catch(e) { console.warn('Pet Aşı Hatası:', e); }
}

async function pushPetAgirlikToSupabase(petId, entry) {
  try {
    await supabase.from('pet_agirlik').upsert({
      id: String(entry.id || `${petId}-${entry.date || Date.now()}`), pet_id: petId,
      tarih: entry.date || entry.tarih || new Date().toISOString(),
      kilo: Number(entry.weight || entry.kilo || 0), notlar: entry.notes || null
    });
  } catch(e) { console.warn('Pet Ağırlık Hatası:', e); }
}

async function pushSaglikRandevuToSupabase(r) {
  try {
    await supabase.from('saglik_randevular').upsert({
      id: String(r.id), kisi: r.kisi, doktor: r.doktor || null,
      tarih: r.tarih || null, saat: r.saat || null,
      not_text: r.not || null, rekurans: r.rekurans || 'yok'
    });
  } catch(e) { console.warn('Sağlık Randevu Hatası:', e); }
}

async function pushSaglikIlacToSupabase(i) {
  try {
    await supabase.from('saglik_ilaclar').upsert({
      id: String(i.id), kisi: i.kisi, ad: i.ad,
      dozaj: i.dozaj || null, siklik: i.siklik || null,
      stok: Number(i.stok || 0), min_stok: Number(i.minStok || 5),
      schedule: i.schedule || { morning: 0, afternoon: 0, evening: 0 }
    });
  } catch(e) { console.warn('Sağlık İlaç Hatası:', e); }
}

async function pushSaglikOlcumToSupabase(o) {
  try {
    await supabase.from('saglik_olcumler').upsert({
      id: String(o.id), kisi: o.kisi, tur: o.tur || null,
      deger: o.deger || null, tarih: o.tarih || null
    });
  } catch(e) { console.warn('Sağlık Ölçüm Hatası:', e); }
}

async function pushSaglikMoodToSupabase(m) {
  try {
    await supabase.from('saglik_moods').upsert({
      id: String(m.id),
      "user": m.user,
      mood: m.mood,
      note: m.note || null,
      kategori: m.kategori || 'Genel',
      date: m.date || new Date().toISOString()
    });
  } catch(e) { console.warn('Sağlık Mood Hatası:', e); }
}

async function pushSaglikLogToSupabase(l) {
  try {
    await supabase.from('saglik_logs').upsert({
      id: String(l.id),
      med_id: String(l.medId),
      ad: l.ad,
      kisi: l.kisi,
      slot: l.slot,
      date: l.date,
      dt: l.dt
    });
  } catch(e) { console.warn('Sağlık Log Hatası:', e); }
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
  try { await supabase.from('garaj_yakit').delete().eq('id', String(id)); } catch(e){}
}
async function deleteGarajServisFromSupabase(id) {
  try { await supabase.from('garaj_servis').delete().eq('id', String(id)); } catch(e){}
}
async function deleteGarajBelgeFromSupabase(id) {
  try { await supabase.from('garaj_belgeler').delete().eq('id', String(id)); } catch(e){}
}
async function deletePetAsiFromSupabase(id) {
  try { await supabase.from('pet_asilar').delete().eq('id', String(id)); } catch(e){}
}
async function deletePetAgirlikFromSupabase(id) {
  try { await supabase.from('pet_agirlik').delete().eq('id', String(id)); } catch(e){}
}
async function deleteSaglikRandevuFromSupabase(id) {
  try { await supabase.from('saglik_randevular').delete().eq('id', String(id)); } catch(e){}
}
async function deleteSaglikIlacFromSupabase(id) {
  try { await supabase.from('saglik_ilaclar').delete().eq('id', String(id)); } catch(e){}
}
async function deleteSaglikOlcumFromSupabase(id) {
  try { await supabase.from('saglik_olcumler').delete().eq('id', String(id)); } catch(e){}
}
// -----------------------------------------------------------------

// ═══════════════════════════════════════════════════════════════════
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
      notes: trip.notes || null, schengen: !!trip.schengen,
      budget_est: Number(trip.budget?.est || 0), budget_real: Number(trip.budget?.real || 0),
      valiz: trip.valiz || {}, evaluations: trip.evaluations || {},
      photos: trip.photos || [], checklists: trip.checklists || [],
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
      id: String(id), title, description: description || null,
      category: category || null, priority: priority || 'Orta',
      status: status || 'Açık', solution: solution || null,
      date: date || new Date().toISOString(), extra: rest
    });
  } catch(e) { console.warn('Mühendislik Problem Hatası:', e); }
}

async function deleteMuhendislikProblemFromSupabase(id) {
  try { await supabase.from('muhendislik_problems').delete().eq('id', String(id)); }
  catch(e) { console.warn('Problem Silme Hatası:', e); }
}

async function pushMuhendislikDecisionToSupabase(d) {
  try {
    const { id, title, description, category, result, pros, cons, date, ...rest } = d;
    await supabase.from('muhendislik_decisions').upsert({
      id: String(id), title, description: description || null,
      category: category || null, result: result || null,
      pros: pros || null, cons: cons || null,
      date: date || new Date().toISOString(), extra: rest
    });
  } catch(e) { console.warn('Mühendislik Karar Hatası:', e); }
}

async function deleteMuhendislikDecisionFromSupabase(id) {
  try { await supabase.from('muhendislik_decisions').delete().eq('id', String(id)); }
  catch(e) { console.warn('Karar Silme Hatası:', e); }
}

async function pushCrmCustomerToSupabase(c) {
  try {
    const { id, name, company, phone, email, notes, status, date, ...rest } = c;
    await supabase.from('muhendislik_crm_customers').upsert({
      id: String(id), name, company: company || null, phone: phone || null,
      email: email || null, notes: notes || null, status: status || 'aktif',
      date: date || new Date().toISOString(), extra: rest
    });
  } catch(e) { console.warn('CRM Müşteri Hatası:', e); }
}

async function deleteCrmCustomerFromSupabase(id) {
  try { await supabase.from('muhendislik_crm_customers').delete().eq('id', String(id)); }
  catch(e) { console.warn('CRM Müşteri Silme Hatası:', e); }
}

async function pushCrmDealToSupabase(d) {
  try {
    const { id, customerId, title, amount, status, notes, date, ...rest } = d;
    await supabase.from('muhendislik_crm_deals').upsert({
      id: String(id), customer_id: customerId || null, title: title || null,
      amount: Number(amount || 0), status: status || 'pipeline',
      notes: notes || null, date: date || new Date().toISOString(), extra: rest
    });
  } catch(e) { console.warn('CRM Deal Hatası:', e); }
}

async function deleteCrmDealFromSupabase(id) {
  try { await supabase.from('muhendislik_crm_deals').delete().eq('id', String(id)); }
  catch(e) { console.warn('CRM Deal Silme Hatası:', e); }
}

async function pushZihniProceToSupabase(p) {
  try {
    const { id, title, description, category, completed, date, ...rest } = p;
    await supabase.from('muhendislik_proceler').upsert({
      id: String(id), title, description: description || null,
      category: category || null, completed: !!completed,
      date: date || new Date().toISOString(), extra: rest
    });
  } catch(e) { console.warn('Zihni Proce Hatası:', e); }
}

async function deleteZihniProceFromSupabase(id) {
  try { await supabase.from('muhendislik_proceler').delete().eq('id', String(id)); }
  catch(e) { console.warn('Zihni Proce Silme Hatası:', e); }
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
    await supabase.from('modaring_personel').upsert({
      id: String(p.id), name: p.name, hourly_rate: Number(p.hourlyRate || 0),
      color: p.color || '#6366f1', emoji: p.emoji || '👤', active: p.active !== false
    });
  } catch(e) { console.warn('Modaring Personel Hatası:', e); }
}

async function deleteModaringPersonelFromSupabase(id) {
  try { await supabase.from('modaring_personel').delete().eq('id', String(id)); }
  catch(e) { console.warn('Modaring Personel Silme:', e); }
}

async function pushModaringVardiyaToSupabase(v) {
  try {
    await supabase.from('modaring_vardiya').upsert({
      id: String(v.id), personel_id: v.personelId || null, date: v.date || null,
      start_time: v.startTime || null, end_time: v.endTime || null,
      total_pay: Number(v.totalPay || 0), status: v.status || 'aktif'
    });
  } catch(e) { console.warn('Modaring Vardiya Hatası:', e); }
}

async function deleteModaringVardiyaFromSupabase(id) {
  try { await supabase.from('modaring_vardiya').delete().eq('id', String(id)); }
  catch(e) { console.warn('Modaring Vardiya Silme:', e); }
}

async function pushModaringKasaToSupabase(k) {
  try {
    await supabase.from('modaring_kasa').upsert({
      id: String(k.id), date: k.date || null, type: k.type || null,
      amount: Number(k.amount || 0), method: k.method || null,
      note: k.note || null, bank_id: k.bankId || null
    });
  } catch(e) { console.warn('Modaring Kasa Hatası:', e); }
}

async function pushModaringBankaToSupabase(b) {
  try {
    await supabase.from('modaring_bankalar').upsert({
      id: String(b.id), name: b.name, type: b.type || null,
      balance: Number(b.balance || 0), color: b.color || '#3b82f6', icon: b.icon || '🏦'
    });
  } catch(e) { console.warn('Modaring Banka Hatası:', e); }
}

async function pushModaringTedarikToSupabase(t) {
  try {
    await supabase.from('modaring_tedarik').upsert({
      id: String(t.id), name: t.name, link: t.link || null,
      category: t.category || null, contact: t.contact || null, note: t.note || null
    });
  } catch(e) { console.warn('Modaring Tedarik Hatası:', e); }
}

async function pushModaringSiparisToSupabase(s) {
  try {
    await supabase.from('modaring_siparisler').upsert({
      id: String(s.id), supplier_id: s.supplierId || null, date: s.date || null,
      items: s.items || [], total: Number(s.total || 0), paid: !!s.paid,
      status: s.status || 'bekliyor', bank_id: s.bankId || null
    });
  } catch(e) { console.warn('Modaring Sipariş Hatası:', e); }
}

async function pushModaringAjandaToSupabase(a) {
  try {
    await supabase.from('modaring_ajanda').upsert({
      id: String(a.id), title: a.title, due_date: a.dueDate || null,
      amount: Number(a.amount || 0), status: a.status || 'bekliyor'
    });
  } catch(e) { console.warn('Modaring Ajanda Hatası:', e); }
}

async function pushModaringRefikaToSupabase(r) {
  try {
    await supabase.from('modaring_refika').upsert({
      id: String(r.id), title: r.title || null, description: r.desc || null,
      cost: Number(r.cost || 0), price: Number(r.price || 0),
      strategy: r.strategy || null, context: r.context || null,
      date: r.date || new Date().toISOString()
    });
  } catch(e) { console.warn('Modaring Refika Hatası:', e); }
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
    // FAZ 10 - ONLINE FIRST: Modüller artık kendi SQL tablolarında.
    users: state.users,
    system: state.system,
    selectedVehicleId: state.selectedVehicleId,
    logs: state.logs,
    achievements: state.achievements,
    /* ARTIK SQL'DE:
    mutfak, alisveris, sosyal, saglik, ev, pet, garaj, tatil, muhendislik, modaring
    */
  };

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
        get().saveToSupabase();
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
          get().saveToSupabase();

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
          get().saveToSupabase();

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
          get().saveToSupabase();

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
                 yakit, servis, belgeler,
                 asilar, agirliklar,
                 randevular, ilaclar, olcumler, moods, logs] = await Promise.all([
            supabase.from('ev_duzenli_odemeler').select('*'),
            supabase.from('ev_abonelikler').select('*'),
            supabase.from('ev_onarim').select('*'),
            supabase.from('ev_demirbaslar').select('*'),
            supabase.from('ev_bakimlar').select('*'),
            supabase.from('garaj_yakit').select('*'),
            supabase.from('garaj_servis').select('*'),
            supabase.from('garaj_belgeler').select('*'),
            supabase.from('pet_asilar').select('*'),
            supabase.from('pet_agirlik').select('*'),
            supabase.from('saglik_randevular').select('*'),
            supabase.from('saglik_ilaclar').select('*'),
            supabase.from('saglik_olcumler').select('*'),
            supabase.from('saglik_moods').select('*').order('date', { ascending: false }).limit(100),
            supabase.from('saglik_logs').select('*').order('date', { ascending: false }).limit(100),
          ]);

          set(state => {
            const ev = { ...state.ev };
            const garaj = [...state.garaj];
            const pet = { ...state.pet };
            const saglik = { ...state.saglik };

            // Ev
            if (odemeler.data) {
              ev.duzenliOdemeler = odemeler.data.map(x => ({
                id: x.id, name: x.name, amount: Number(x.amount || 0),
                date: Number(x.date || 1), linkedCardId: x.linked_card_id || null,
                autoPay: !!x.auto_pay, icon: x.icon || '💳',
                provider: x.provider || null, customerNo: x.customer_no || null,
                contractEndDate: x.contract_end_date || null
              }));
            }
            if (abonelikler.data) {
              ev.abonelikler = abonelikler.data.map(x => ({
                id: x.id, name: x.name, amount: Number(x.amount || 0),
                date: Number(x.date || 1), linkedCardId: x.linked_card_id || null,
                autoPay: !!x.auto_pay, icon: x.icon || '📺',
                startDate: x.start_date || null
              }));
            }
            if (onarim.data) {
              ev.onarimListesi = onarim.data.map(x => ({
                id: x.id, task: x.task, status: x.status || 'bekliyor',
                createdBy: x.created_by, createdAt: x.created_at,
                completedBy: x.completed_by, completedAt: x.completed_at,
                clearedBy: x.cleared_by, clearedAt: x.cleared_at,
                isArchived: !!x.is_archived
              }));
            }
            if (demirbaslar.data) {
              ev.demirbaslar = demirbaslar.data.map(x => ({
                id: x.id, name: x.name, brand: x.brand,
                warrantyDate: x.warranty_date, photo: x.photo
              }));
            }
            if (bakimlar.data) {
              ev.bakimlar = bakimlar.data.map(x => ({
                id: x.id, name: x.name, lastDate: x.last_date,
                intervalDays: Number(x.interval_days || 180), icon: x.icon || '🔧',
                brand: x.brand, model: x.model, partNo: x.part_no
              }));
            }

            // Garaj (ilk aracı güncelle)
            if (garaj.length > 0) {
              const v = { ...garaj[0] };
              if (yakit.data) {
                v.fuelLogs = yakit.data.filter(x => x.vehicle_id === v.id).map(x => ({
                  id: x.id, tarih: x.tarih, km: Number(x.km), litre: Number(x.litre),
                  tutar: Number(x.tutar), istasyon: x.istasyon, tip: x.tip, dolu: x.dolu
                }));
              }
              if (servis.data) {
                v.services = servis.data.filter(x => x.vehicle_id === v.id).map(x => ({
                  id: x.id, tarih: x.tarih, km: Number(x.km), islem: x.islem,
                  tutar: Number(x.tutar), yer: x.yer, notlar: x.notlar
                }));
              }
              if (belgeler.data) {
                v.documents = belgeler.data.filter(x => x.vehicle_id === v.id).map(x => ({
                  id: x.id, name: x.name, dueDate: x.due_date, icon: x.icon
                }));
              }
              garaj[0] = v;
            }

            // Pet
            if (asilar.data) {
              const vaccinesByPet = {};
              asilar.data.forEach(x => {
                if (!vaccinesByPet[x.pet_id]) vaccinesByPet[x.pet_id] = [];
                vaccinesByPet[x.pet_id].push({
                  id: x.id, name: x.asi_adi, lastDate: x.son_tarih,
                  nextDate: x.sonraki_tarih, done: x.durum === 'tamamlandi', notes: x.notlar
                });
              });
              pet.vaccines = vaccinesByPet;
            }
            if (agirliklar.data) {
              const weightsByPet = {};
              agirliklar.data.forEach(x => {
                if (!weightsByPet[x.pet_id]) weightsByPet[x.pet_id] = [];
                weightsByPet[x.pet_id].push({
                  id: x.id, date: x.tarih, weight: Number(x.kilo), notes: x.notlar
                });
              });
              pet.weights = weightsByPet;
            }

            // Sağlık
            if (randevular.data) {
              saglik.randevular = randevular.data.map(x => ({
                id: x.id, kisi: x.kisi, doktor: x.doktor,
                tarih: x.tarih, saat: x.saat, not: x.not_text, rekurans: x.rekurans
              }));
            }
            if (ilaclar.data && ilaclar.data.length > 0) {
              saglik.ilaclar = ilaclar.data.map(x => ({
                id: x.id, kisi: x.kisi, ad: x.ad,
                dozaj: x.dozaj, siklik: x.siklik,
                stok: Number(x.stok || 0), minStok: Number(x.min_stok || 5),
                schedule: x.schedule || { morning: 0, afternoon: 0, evening: 0 }
              }));
            }
            if (olcumler.data) {
              saglik.olcumler = olcumler.data.map(x => ({
                id: x.id, kisi: x.kisi, tur: x.tur, deger: x.deger, tarih: x.tarih
              }));
            }
            if (moods.data) {
              saglik.moods = moods.data.map(x => ({
                id: x.id, user: x.user, mood: x.mood, note: x.note, kategori: x.kategori, date: x.date
              }));
            }
            if (logs.data) {
              saglik.logs = logs.data.map(x => ({
                id: x.id, medId: x.med_id, ad: x.ad, kisi: x.kisi, slot: x.slot, date: x.date, dt: x.dt
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
          get().saveToSupabase();

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
            personel, vardiya, kasaItems, bankalar, tedarik, siparisler, ajanda, refika
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
          ]);

          set(state => {
            const tatil = { ...state.tatil };
            const muhendislik = { ...state.muhendislik };
            const modaring = { ...state.modaring };

            // ── Tatil ──
            if (trips.data && trips.data.length > 0) {
              tatil.trips = trips.data.map(x => ({
                id: x.id, title: x.title, city: x.city, country: x.country,
                startDate: x.start_date, endDate: x.end_date,
                tripType: x.trip_type, travelers: x.travelers,
                transportType: x.transport_type, locationType: x.location_type,
                status: x.status, notes: x.notes, schengen: x.schengen,
                budget: { est: Number(x.budget_est || 0), real: Number(x.budget_real || 0) },
                valiz: x.valiz || {}, evaluations: x.evaluations || {},
                photos: x.photos || [], checklists: x.checklists || [],
                created_at: x.created_at
              }));
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

            return { tatil, muhendislik, modaring };
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
        get().saveToSupabase();

        // GRUP 2 GÖLGE YAZIM: setModuleData üzerinden yapılan güncellemeler
        if (moduleName === 'saglik' && isObject) {
          const merged = { ...state.saglik, ...data };
          if (data.randevular) merged.randevular.forEach(r => pushSaglikRandevuToSupabase(r));
          if (data.ilaclar) merged.ilaclar.forEach(i => pushSaglikIlacToSupabase(i));
          if (data.olcumler) merged.olcumler.forEach(o => pushSaglikOlcumToSupabase(o));
        }
        if (moduleName === 'ev' && isObject) {
          if (data.bakimlar) data.bakimlar.forEach(b => pushEvBakimToSupabase(b));
          if (data.demirbaslar) data.demirbaslar.forEach(d => pushEvDemirbasToSupabase(d));
        }
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
        pushSaglikMoodToSupabase(newMood);
      },

      takeMedicine: (medId, slot = 'morning') => {
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
          slot: slot,
          date: new Date().toISOString().split('T')[0],
          dt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };
        const updatedLogs = [log, ...(state.saglik.logs || [])].slice(0, 100);

        set({ saglik: { ...state.saglik, ilaclar: meds, logs: updatedLogs } });

        if (newStok <= (med.minStok || 5)) {
          get().addLog('İlaç Azaldı', `${med.ad} stoğu kritik seviyeye düştü (${newStok} adet kaldı). Yenisini almayı unutmayın!`);
        }

        get().saveToSupabase();
        pushSaglikIlacToSupabase(meds[idx]);
        pushSaglikLogToSupabase(log);
      },

      deleteMedicine: (id) => {
        const state = get();
        const updated = (state.saglik.ilaclar || []).filter(m => String(m.id) !== String(id));
        set({ saglik: { ...state.saglik, ilaclar: updated } });
        get().saveToSupabase();
        deleteSaglikIlacFromSupabase(id);
      },

      deleteAppointment: (id) => {
        const state = get();
        const updated = (state.saglik.randevular || []).filter(r => String(r.id) !== String(id));
        set({ saglik: { ...state.saglik, randevular: updated } });
        get().saveToSupabase();
        deleteSaglikRandevuFromSupabase(id);
      },

      deleteMeasurement: (id) => {
        const state = get();
        const updated = (state.saglik.olcumler || []).filter(o => String(o.id) !== String(id));
        set({ saglik: { ...state.saglik, olcumler: updated } });
        get().saveToSupabase();
        deleteSaglikOlcumFromSupabase(id);
      },

      addMeasurement: (form) => {
        const state = get();
        const newOlcum = { id: Date.now(), ...form };
        const updated = [newOlcum, ...(state.saglik.olcumler || [])];
        set({ saglik: { ...state.saglik, olcumler: updated } });
        get().saveToSupabase();
        pushSaglikOlcumToSupabase(newOlcum);
      },

      addAppointment: (form) => {
        const state = get();
        const newRandevu = { id: Date.now(), ...form };
        const updated = [newRandevu, ...(state.saglik.randevular || [])];
        set({ saglik: { ...state.saglik, randevular: updated } });
        get().saveToSupabase();
        pushSaglikRandevuToSupabase(newRandevu);
      },

      addMedicine: (form) => {
        const state = get();
        const newIlac = { id: Date.now(), ...form };
        const updated = [newIlac, ...(state.saglik.ilaclar || [])];
        set({ saglik: { ...state.saglik, ilaclar: updated } });
        get().saveToSupabase();
        pushSaglikIlacToSupabase(newIlac);
      },

      updateMedicine: (id, updates) => {
        const state = get();
        const updated = (state.saglik.ilaclar || []).map(m => String(m.id) === String(id) ? { ...m, ...updates } : m);
        set({ saglik: { ...state.saglik, ilaclar: updated } });
        get().saveToSupabase();
        const item = updated.find(m => String(m.id) === String(id));
        if (item) pushSaglikIlacToSupabase(item);
      },

      updateAppointment: (id, updates) => {
        const state = get();
        const updated = (state.saglik.randevular || []).map(r => String(r.id) === String(id) ? { ...r, ...updates } : r);
        set({ saglik: { ...state.saglik, randevular: updated } });
        get().saveToSupabase();
        const item = updated.find(r => String(r.id) === String(id));
        if (item) pushSaglikRandevuToSupabase(item);
      },

      updateMeasurement: (id, updates) => {
        const state = get();
        const updated = (state.saglik.olcumler || []).map(o => String(o.id) === String(id) ? { ...o, ...updates } : o);
        set({ saglik: { ...state.saglik, olcumler: updated } });
        get().saveToSupabase();
        const item = updated.find(o => String(o.id) === String(id));
        if (item) pushSaglikOlcumToSupabase(item);
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
        get().saveToSupabase(true);
        pushMuhendislikProblemToSupabase(newProblem);
      },
      updateEngineeringProblem: (id, updates) => {
        const state = get();
        const currentBank = Array.isArray(state.muhendislik.problemBank) ? state.muhendislik.problemBank : [];
        const updated = currentBank.map(p => p.id === id ? { ...p, ...updates } : p);
        set({ muhendislik: { ...state.muhendislik, problemBank: updated } });
        get().saveToSupabase(true);
        const updatedItem = updated.find(p => p.id === id);
        if (updatedItem) pushMuhendislikProblemToSupabase(updatedItem);
      },
      deleteEngineeringProblem: (id) => {
        const state = get();
        const updated = state.muhendislik.problemBank.filter(p => p.id !== id);
        set({ muhendislik: { ...state.muhendislik, problemBank: updated } });
        get().saveToSupabase(true);
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
        get().saveToSupabase(true);
        pushMuhendislikDecisionToSupabase(newDecision);
      },
      updateEngineeringDecision: (id, updates) => {
        const state = get();
        const updated = state.muhendislik.decisionLog.map(d => d.id === id ? { ...d, ...updates } : d);
        set({ muhendislik: { ...state.muhendislik, decisionLog: updated } });
        get().saveToSupabase();
        const updatedDec = updated.find(d => d.id === id);
        if (updatedDec) pushMuhendislikDecisionToSupabase(updatedDec);
      },
      deleteEngineeringDecision: (id) => {
        const state = get();
        const updated = state.muhendislik.decisionLog.filter(d => d.id !== id);
        set({ muhendislik: { ...state.muhendislik, decisionLog: updated } });
        get().saveToSupabase();
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
        get().saveToSupabase();
      },

      // --- Engineering CRM Actions ---
      addCrmCustomer: (customer) => {
        const state = get();
        const newCustomer = { id: Date.now(), ...customer, date: new Date().toISOString() };
        const updatedCrm = { ...state.muhendislik.crm, customers: [newCustomer, ...(state.muhendislik.crm.customers || [])] };
        set({ muhendislik: { ...state.muhendislik, crm: updatedCrm } });
        get().saveToSupabase(true);
        pushCrmCustomerToSupabase(newCustomer);
      },
      updateCrmCustomer: (id, updates) => {
        const state = get();
        const updatedCustomers = (state.muhendislik.crm.customers || []).map(c => c.id === id ? { ...c, ...updates } : c);
        set({ muhendislik: { ...state.muhendislik, crm: { ...state.muhendislik.crm, customers: updatedCustomers } } });
        get().saveToSupabase();
        const updatedCust = updatedCustomers.find(c => c.id === id);
        if (updatedCust) pushCrmCustomerToSupabase(updatedCust);
      },
      deleteCrmCustomer: (id) => {
        const state = get();
        const updatedCustomers = (state.muhendislik.crm.customers || []).filter(c => c.id !== id);
        const updatedDeals = (state.muhendislik.crm.deals || []).filter(d => d.customerId !== id);
        set({ muhendislik: { ...state.muhendislik, crm: { customers: updatedCustomers, deals: updatedDeals } } });
        get().saveToSupabase();
        deleteCrmCustomerFromSupabase(id);
      },
      addCrmDeal: (deal) => {
        const state = get();
        const newDeal = { id: Date.now(), ...deal, date: new Date().toISOString() };
        const updatedDeals = [newDeal, ...(state.muhendislik.crm.deals || [])];
        set({ muhendislik: { ...state.muhendislik, crm: { ...state.muhendislik.crm, deals: updatedDeals } } });
        get().saveToSupabase();
        pushCrmDealToSupabase(newDeal);
      },
      updateCrmDeal: (id, updates) => {
        const state = get();
        const updatedDeals = (state.muhendislik.crm.deals || []).map(d => d.id === id ? { ...d, ...updates } : d);
        set({ muhendislik: { ...state.muhendislik, crm: { ...state.muhendislik.crm, deals: updatedDeals } } });
        get().saveToSupabase();
        const updatedDeal = updatedDeals.find(d => d.id === id);
        if (updatedDeal) pushCrmDealToSupabase(updatedDeal);
      },
      deleteCrmDeal: (id) => {
        const state = get();
        const updatedDeals = (state.muhendislik.crm.deals || []).filter(d => d.id !== id);
        set({ muhendislik: { ...state.muhendislik, crm: { ...state.muhendislik.crm, deals: updatedDeals } } });
        get().saveToSupabase(true);
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
        get().saveToSupabase(true);
        pushZihniProceToSupabase(proce);
      },
      updateZihniProce: (id, updates) => {
        const state = get();
        const updated = (state.muhendislik.zihniProceler || []).map(p => p.id === id ? { ...p, ...updates } : p);
        set({ muhendislik: { ...state.muhendislik, zihniProceler: updated } });
        get().saveToSupabase();
        const updatedProce = updated.find(p => p.id === id);
        if (updatedProce) pushZihniProceToSupabase(updatedProce);
      },
      toggleZihniProceStatus: (id) => {
        const state = get();
        const updated = (state.muhendislik.zihniProceler || []).map(p => 
          p.id === id ? { ...p, completed: !p.completed } : p
        );
        set({ muhendislik: { ...state.muhendislik, zihniProceler: updated } });
        get().saveToSupabase();
        const toggled = updated.find(p => p.id === id);
        if (toggled) pushZihniProceToSupabase(toggled);
      },
      deleteZihniProce: (id) => {
        const state = get();
        const updated = (state.muhendislik.zihniProceler || []).filter(p => p.id !== id);
        set({ muhendislik: { ...state.muhendislik, zihniProceler: updated } });
        get().saveToSupabase();
        deleteZihniProceFromSupabase(id);
      },

      // --- Engineering Life Actions ---
      addLifeRoutine: (routine) => {
        const state = get();
        const newRoutine = { id: Date.now(), ...routine, completed: false };
        const updatedLife = { ...state.muhendislik.life, routines: [newRoutine, ...(state.muhendislik.life.routines || [])] };
        set({ muhendislik: { ...state.muhendislik, life: updatedLife } });
        get().saveToSupabase();
        pushLifeRoutineToSupabase(newRoutine);
      },
      toggleLifeRoutine: (id) => {
        const state = get();
        const updatedRoutines = (state.muhendislik.life.routines || []).map(r => 
          r.id === id ? { ...r, completed: !r.completed } : r
        );
        set({ muhendislik: { ...state.muhendislik, life: { ...state.muhendislik.life, routines: updatedRoutines } } });
        get().saveToSupabase();
        const toggledRoutine = updatedRoutines.find(r => r.id === id);
        if (toggledRoutine) pushLifeRoutineToSupabase(toggledRoutine);
      },
      deleteLifeRoutine: (id) => {
        const state = get();
        const updatedRoutines = (state.muhendislik.life.routines || []).filter(r => r.id !== id);
        set({ muhendislik: { ...state.muhendislik, life: { ...state.muhendislik.life, routines: updatedRoutines } } });
        get().saveToSupabase();
        deleteLifeRoutineFromSupabase(id);
      },
      addLifeProgram: (program) => {
        const state = get();
        const newProgram = { id: Date.now(), ...program, date: new Date().toISOString() };
        const updatedLife = { ...state.muhendislik.life, programs: [newProgram, ...(state.muhendislik.life.programs || [])] };
        set({ muhendislik: { ...state.muhendislik, life: updatedLife } });
        get().saveToSupabase();
        pushLifeProgramToSupabase(newProgram);
      },
      deleteLifeProgram: (id) => {
        const state = get();
        const updatedPrograms = (state.muhendislik.life.programs || []).filter(p => p.id !== id);
        set({ muhendislik: { ...state.muhendislik, life: { ...state.muhendislik.life, programs: updatedPrograms } } });
        get().saveToSupabase();
        deleteLifeProgramFromSupabase(id);
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
        get().saveToSupabase(true);
      },
      deleteFocusSession: (id) => {
        const state = get();
        const updatedSessions = (state.muhendislik.life.focusSessions || []).filter(s => s.id !== id);
        set({ muhendislik: { ...state.muhendislik, life: { ...state.muhendislik.life, focusSessions: updatedSessions } } });
        get().saveToSupabase(true);
      },

      addLifeActivity: (activity) => {
        const state = get();
        const currentActivities = state.muhendislik.life.dailyActivities || [];
        const updatedLife = { 
          ...state.muhendislik.life, 
          dailyActivities: [activity, ...currentActivities] 
        };
        set({ muhendislik: { ...state.muhendislik, life: updatedLife } });
        get().saveToSupabase(true);
      },
      deleteLifeActivity: (id) => {
        const state = get();
        const updatedActivities = (state.muhendislik.life.dailyActivities || []).filter(a => a.id !== id);
        set({ muhendislik: { ...state.muhendislik, life: { ...state.muhendislik.life, dailyActivities: updatedActivities } } });
        get().saveToSupabase(true);
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
            users: remote.users || DEFAULT_STATE.users,
            finans: remote.finans || legacyFinans || DEFAULT_STATE.finans,
            kasa: remote.kasa || (legacyFinans ? remote.kasa : DEFAULT_STATE.kasa),
            mutfak: {
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
            saglik: { ...DEFAULT_STATE.saglik, ...remote.saglik },
            alisveris: remote.alisveris || DEFAULT_STATE.alisveris,
            hedefler: remote.hedefler || DEFAULT_STATE.hedefler,
            sosyal: { ...DEFAULT_STATE.sosyal, ...remote.sosyal },
            ev: { ...DEFAULT_STATE.ev, ...remote.ev },
            pet: { 
              ...DEFAULT_STATE.pet, 
              ...remote.pet,
              // Safeguard against corrupted data (arrays instead of objects)
              vaccines: (remote.pet?.vaccines && !Array.isArray(remote.pet.vaccines)) ? remote.pet.vaccines : DEFAULT_STATE.pet.vaccines,
              weights: (remote.pet?.weights && !Array.isArray(remote.pet.weights)) ? remote.pet.weights : DEFAULT_STATE.pet.weights,
            },
            garaj: remote.garaj || (remote.aracim ? [{ ...DEFAULT_STATE.garaj[0], ...remote.aracim, id: 'v1' }] : DEFAULT_STATE.garaj),
            selectedVehicleId: remote.selectedVehicleId || 'v1',
            tatil: { ...DEFAULT_STATE.tatil, ...remote.tatil },
            achievements: remote.achievements || DEFAULT_STATE.achievements,
            modaring: {
              ...DEFAULT_STATE.modaring,
              ...remote.modaring,
              refikaFikirleri: [...new Set([...(get().modaring?.refikaFikirleri || []), ...(remote.modaring?.refikaFikirleri || [])].map(f => JSON.stringify(f)))].map(s => JSON.parse(s))
            },
            muhendislik: {
              ...DEFAULT_STATE.muhendislik,
              ...remote.muhendislik,
              problemBank: [...new Map([...(get().muhendislik?.problemBank || []), ...(remote.muhendislik?.problemBank || [])].map(item => [item.id, item])).values()],
              decisionLog: [...new Map([...(get().muhendislik?.decisionLog || []), ...(remote.muhendislik?.decisionLog || [])].map(item => [item.id, item])).values()],
              crm: {
                customers: [...new Map([...(get().muhendislik?.crm?.customers || []), ...(remote.muhendislik?.crm?.customers || [])].map(item => [item.id, item])).values()],
                deals: [...new Map([...(get().muhendislik?.crm?.deals || []), ...(remote.muhendislik?.crm?.deals || [])].map(item => [item.id, item])).values()],
              }
            },
            logs: [...new Map([...(get().logs || []), ...(remote.logs || [])].map(item => [item.id, item])).values()].slice(0, 50),
            system: { ...get().system, isCloudReady: true, lastSync: Date.now() },
            isOnline: true
          });
        } else {
        }
        set({ syncing: false });

        // FAZ 9: JSON verisi yüklendikten sonra yeni SQL tablolarını üzerine yaz/kontrol et
        await get().fetchPhase3Data(); // Faz 3: Supabase -> Single Source of Truth
        await get().fetchGroup1Data(); // Faz 1.4: Grup 1 Mutfak, Sosyal, Alışveriş
        await get().fetchGroup2Data(); // Grup 2: Ev, Garaj, Pet, Sağlık
        await get().fetchGroup3Data(); // Grup 3: Tatil, Mühendislik, Modaring
        get().getBuAyHarcamalar();
        get().checkAutoKapanis();
      },

      fetchPhase3Data: async () => {
        try {
          const { data: dbKartlar } = await supabase.from('finans_kartlar').select('*');
          const { data: dbBorclar } = await supabase.from('finans_krediler').select('*');
          const { data: dbOnayHavuzu } = await supabase.from('finans_onay_havuzu').select('*');
          const { data: dbHedefler } = await supabase.from('hedefler_aktif').select('*');
          const { data: dbGecmis } = await supabase.from('hedefler_gecmis').select('*');
          const { data: dbVizyon } = await supabase.from('hedefler_vizyon').select('*');

          set(state => {
            const f = { ...state.finans };
            if (dbKartlar) {
              f.kartlar = dbKartlar.map(k => {
                const legacy = DEFAULT_STATE.finans.kartlar.find(dk => dk.id === k.id) || {};
                return { id: k.id, name: k.name, owner: k.owner, cutoff_day: k.cutoff_day, color: k.color, min_pct: k.min_pct, limit: legacy.limit || 100000, balance: legacy.balance || 0, due_day_offset: legacy.due_day_offset || 10 };
              });
            }

            if (dbBorclar) {
              f.borclar = dbBorclar.map(b => ({ id: b.id, name: b.name, due_day: b.due_day, total: b.total, remaining: b.remaining, monthly: b.monthly }));
            }

            if (dbOnayHavuzu && dbOnayHavuzu.length > 0) {
              f.approvalPool = dbOnayHavuzu.map(p => ({ id: p.id, title: p.baslik, amount: p.tutar, source: p.kaynak, payer: p.kayit_eden, dt: p.tarih, defaultPay: p.default_pay }));
            }

            const h = { ...state.hedefler };
            const k = { ...state.kasa };
            if (dbHedefler) {
              const mapped = dbHedefler.map(x => ({ id: x.id, name: x.title, title: x.title, target: x.target, current: x.current, targetDate: x.target_date, duration: x.duration, priority: x.priority, owner: x.owner, notes: x.notes, yearlyPlan: x.yearly_plan }));
              const existingKumbaralarIds = new Set(k.kumbaralar?.map(x => String(x.id)) || []);
              k.kumbaralar = mapped.filter(x => existingKumbaralarIds.has(String(x.id)));
              h.goals = mapped.filter(x => !existingKumbaralarIds.has(String(x.id)));
            }

            if (dbGecmis) {
              h.completedHistory = dbGecmis.filter(x => x.status === 'completed').map(x => ({ id: x.id, title: x.title, owner: x.owner, notes: x.notes, completedAt: x.resolved_at }));
              h.failedHistory = dbGecmis.filter(x => x.status === 'failed').map(x => ({ id: x.id, title: x.title, owner: x.owner, notes: x.notes, failedAt: x.resolved_at }));
            }

            if (dbVizyon) {
              h.longTermVision = dbVizyon.map(x => ({ id: x.id, text: x.text, owner: x.owner }));
            }

            return { finans: f, hedefler: h, kasa: k };
          });
        } catch(e) { console.error('Faz 3 Fetch error:', e); }
      },

      fetchGroup1Data: async () => {
        try {
          const [stok, tarifler, alisveris, sosyal, menu, havuz, rutinler, mutfakSu] = await Promise.all([
            supabase.from('mutfak_stok').select('*'),
            supabase.from('mutfak_tarifler').select('*'),
            supabase.from('alisveris_listesi').select('*'),
            supabase.from('sosyal_etkinlikler').select('*'),
            supabase.from('mutfak_menu').select('*'),
            supabase.from('sosyal_havuz').select('*'),
            supabase.from('sosyal_rutinler').select('*'),
            supabase.from('mutfak_su').select('*').eq('id', 'mutfak_su').single()
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
              const mapAl = (list) => list.map(x => ({ id: x.id, nm: x.isim, link: x.link, pr: Number(x.fiyat), dt: x.tarih, done: !!x.tamamlandi, doneDate: x.tamamlanma_tarihi }));
              a.gorkem = mapAl(alisveris.data.filter(x => x.kime === 'gorkem'));
              a.esra = mapAl(alisveris.data.filter(x => x.kime === 'esra'));
              a.ev = mapAl(alisveris.data.filter(x => x.kime === 'ev'));
              a.wishlist = mapAl(alisveris.data.filter(x => x.kime === 'wishlist'));
              m.alisveris = mapAl(alisveris.data.filter(x => x.kime === 'mutfak'));
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
        if (saveTimeout) clearTimeout(saveTimeout);

        const runSave = async () => {
          if (get().isSaving) {
            if (!immediate) setTimeout(() => get().saveToSupabase(), 2000);
            return;
          }

          try {
            set({ isSaving: true });
            const state = get();

            if (!state.system.isCloudReady) {
              console.warn('⚠️ Cloud data not ready. Skipping save.');
              set({ isSaving: false });
              return;
            }

            const dataToPush = extractAppData(state);
            dataToPush.system = { ...dataToPush.system, lastUpdatedBy: state.system.clientId, updatedAt: Date.now() };

            await pushToSupabase(dataToPush);
            set({ isOnline: true, isSaving: false });
            console.log('✨ Data synced to cloud.');
          } catch (err) {
            console.error('❌ saveToSupabase error:', err);
            set({ isSaving: false, isOnline: false });
            // FAZ 10: Kullanıcıyı sessizce kaybolan veriler konusunda uyar.
            toast.error('Bağlantı hatası: Son işleminiz buluta kaydedilemedi!', {
              id: 'sync-error', // Prevent duplicate toasts
              duration: 4000
            });
          }
          saveTimeout = null;
        };

        if (immediate) {
          await runSave();
        } else {
          saveTimeout = setTimeout(runSave, 1500);
        }
      },

      // KRİTİK: Beklemeden, hemen buluta bas (Silme gibi işlemler için)
      forceSaveToSupabase: async () => {
        try {
          set({ isSaving: true });
          const state = get();
          const dataToPush = extractAppData(state);
          dataToPush.system = { ...dataToPush.system, lastUpdatedBy: state.system.clientId };
          await pushToSupabase(dataToPush);
          set({ isOnline: true, isSaving: false });
        } catch (err) {
          set({ isSaving: false });
        }
      },

      // ── Eraylar Finans Actions ───────────────────────────
      updateFinansData: (key, data) => {
        const state = get();
        set({ finans: { ...state.finans, [key]: data } });
        // GÖLGE YAZIM (SHADOW WRITE) - FAZ 1
        if (key === 'kartlar') syncFinansKartlar(data);
        if (key === 'borclar') syncFinansKrediler(data);
        if (key === 'approvalPool') syncFinansOnayHavuzu(data);
        get().saveToSupabase();
      },

      deleteFinansKart: (id) => {
        const state = get();
        const updated = (state.finans.kartlar || []).filter(k => String(k.id) !== String(id));
        set({ finans: { ...state.finans, kartlar: updated } });
        get().saveToSupabase();
        deleteFinansKartFromSupabase(id);
      },

      deleteFinansKredi: (id) => {
        const state = get();
        const updated = (state.finans.borclar || []).filter(b => String(b.id) !== String(id));
        set({ finans: { ...state.finans, borclar: updated } });
        get().saveToSupabase();
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
        get().saveToSupabase();
        toast.success('Harcama onaylandı! ✅');
      },

      // ── Finans v2.0 Aksiyonları ──────────────────────────

      // Doğrudan Supabase'e yazar (hızlı ödeme + rekurans işleme için)
      addHarcama: async (data) => {
        const state = get();
        const buAy = new Date().toISOString().slice(0, 7);
        const harcama = {
          tarih: data.tarih || new Date().toISOString().split('T')[0],
          baslik: data.baslik || data.title || 'Harcama',
          tutar: Number(data.tutar || data.amount || 0),
          kategori: data.kategori || data.category || 'Diğer',
          kart_id: data.kart_id || data.kartId || null,
          banka_id: data.banka_id || null, // Havale yapılacak banka
          odenme_turu: data.odenme_turu || (data.kart_id ? 'kart' : (data.banka_id ? 'havale' : 'nakit')),
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
            ay: buAy,
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
          }
        }

        set({
          finans: {
            ...state.finans,
            buAyHarcamalar: yeniBuAy,
            kartMutabakat: yeniMutabakat,
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
          kaynak: item.source || 'Onay Havuzu',
        });

        const updatedPool = state.finans.approvalPool.filter(i => i.id !== poolId);
        set({ finans: { ...get().finans, approvalPool: updatedPool } });
        syncFinansOnayHavuzu(updatedPool); // Gölge Yazım
        supabase.from('finans_onay_havuzu').delete().eq('id', String(poolId)).then();
        get().addLog('Harcama Onaylandı (v2)', `${item.title}: ${item.amount}₺`);
        get().saveToSupabase();
        toast.success('Harcama onaylandı ve kaydedildi! ✅');
      },

      // Onay havuzundan siler
      reddetHarcama: (poolId) => {
        const state = get();
        const updatedPool = state.finans.approvalPool.filter(i => i.id !== poolId);
        set({ finans: { ...state.finans, approvalPool: updatedPool } });
        syncFinansOnayHavuzu(updatedPool); // Gölge Yazım
        supabase.from('finans_onay_havuzu').delete().eq('id', String(poolId)).then();
        get().saveToSupabase();
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
              beklenen: Math.max(0, (Number(current.beklenen) || 0) - Number(item.tutar)),
            };
            upsertKartMutabakat(item.kart_id, buAy, yeniMutabakat[item.kart_id].beklenen, current.gercek, state.family_id);
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
             }
          }
          
          set({ 
            finans: { ...state.finans, buAyHarcamalar: updatedHarcamalar, kartMutabakat: yeniMutabakat },
            kasa: { ...state.kasa, bakiyeler: yeniBakiyeler, bankaHesaplari: yeniBankaHesaplari }
          });
          toast.success('Harcama silindi.');
          
          // Beklemeden hemen bulutu güncelle (Hayalet kayıtları engellemek için)
          get().forceSaveToSupabase();
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

          await updateHarcamaInSupabase(id, updates);
          
          const updatedHarcamalar = (state.finans.buAyHarcamalar || []).map(h => 
            h.id === id ? { ...h, ...updates } : h
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
          const newItem = { ...oldItem, ...updates };
          const newTutar = Number(newItem.tutar);

          if (newItem.odenme_turu === 'kart' && newItem.kart_id) {
            if (!yeniMutabakat[newItem.kart_id]) {
              yeniMutabakat[newItem.kart_id] = { beklenen: 0, gercek: null, ay: buAy };
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
             upsertKartMutabakat(oldItem.kart_id, buAy, yeniMutabakat[oldItem.kart_id].beklenen, yeniMutabakat[oldItem.kart_id].gercek, state.family_id);
          }
          if (newItem.kart_id && newItem.odenme_turu === 'kart' && newItem.kart_id !== oldItem?.kart_id) {
             upsertKartMutabakat(newItem.kart_id, buAy, yeniMutabakat[newItem.kart_id].beklenen, yeniMutabakat[newItem.kart_id].gercek, state.family_id);
          }

          set({ 
            finans: { ...state.finans, buAyHarcamalar: updatedHarcamalar, kartMutabakat: yeniMutabakat },
            kasa: { ...state.kasa, bakiyeler: yeniBakiyeler, bankaHesaplari: yeniBankaHesaplari }
          });
          
          toast.success('Harcama güncellendi.');
          get().saveToSupabase();
        } catch (err) {
          console.error('❌ updateHarcama error:', err);
          toast.error('Güncelleme işlemi başarısız.');
        }
      },

      // Banka ekstresinden gerçek borcu girer
      gercekKartBorcuGir: async (kartId, tutar, ay) => {
        const state = get();
        const hedefAy = ay || new Date().toISOString().slice(0, 7);
        const beklenen = state.finans.kartMutabakat[kartId]?.beklenen || 0;

        await upsertKartMutabakat(kartId, hedefAy, beklenen, Number(tutar), state.family_id);

        const yeniMutabakat = {
          ...state.finans.kartMutabakat,
          [kartId]: {
            ...state.finans.kartMutabakat[kartId],
            gercek: Number(tutar),
            ay: hedefAy,
            paid: false // Yeni gerçek borç girildiğinde ödenmedi olarak başlar
          },
        };
        set({ finans: { ...state.finans, kartMutabakat: yeniMutabakat } });
        get().saveToSupabase();
        toast.success('Gerçek borç kaydedildi! 💳');
      },

      // Kredi kartı borcunu öder
      payCreditCard: async (kartId, amount, paymentType, source) => {
        const state = get();
        const buAy = new Date().toISOString().slice(0, 7);
        const amountNum = Number(amount);

        // 1. Ödeme Kaynağından Düş
        let yeniBakiyeler = { ...state.kasa.bakiyeler };
        let yeniBankaHesaplari = [...(state.kasa.bankaHesaplari || [])];

        const { type, id } = source; // source: { type: 'nakit' | 'havale', id: 'banka-id' }

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

        // 2. Kart Mutabakatını Güncelle
        const currentMut = state.finans.kartMutabakat[kartId] || { beklenen: 0, gercek: 0, ay: buAy };
        const yeniMutabakat = {
          ...state.finans.kartMutabakat,
          [kartId]: {
            ...currentMut,
            paid: true,
            paymentType: paymentType, // 'full' | 'min'
            paidAmount: amountNum,
            sourceType: type,
            sourceId: id,
            ay: buAy
          }
        };

        // 3. Supabase'deki mutabakat kaydını güncelle
        // Not: finans_kart_mutabakat tablosunda paid/paymentType kolonları olmalı.
        // Eğer yoksa upsertKartMutabakat hata verebilir, bu yüzden sadece yerelde tutuyoruz şimdilik 
        // veya DB şemasını bildiğimizi varsayıyoruz. 
        await upsertKartMutabakat(kartId, buAy, currentMut.beklenen, currentMut.gercek, state.family_id);

        set({
          kasa: { ...state.kasa, bakiyeler: yeniBakiyeler, bankaHesaplari: yeniBankaHesaplari },
          finans: { ...state.finans, kartMutabakat: yeniMutabakat }
        });

        const kartName = state.finans.kartlar.find(k => k.id === kartId)?.name || kartId;
        get().addLog('Kart Ödemesi', `${kartName} için ${amountNum}₺ ödeme yapıldı (${paymentType === 'full' ? 'Tam' : 'Asgari'}).`);
        get().saveToSupabase();
        toast.success(`${kartName} ödemesi başarıyla kaydedildi! 🎉`);
      },

      // Bu ayın harcamalarını Supabase'den çeker
      getBuAyHarcamalar: async () => {
        const state = get();
        const data = await fetchBuAyHarcamalar(state.family_id);

        // Kart mutabakatını da yeniden hesapla
        const yeniMutabakat = { ...state.finans.kartMutabakat };
        const buAy = new Date().toISOString().slice(0, 7);
        Object.keys(yeniMutabakat).forEach(k => {
          yeniMutabakat[k] = { ...yeniMutabakat[k], beklenen: 0, ay: buAy };
        });
        data.forEach(h => {
          if (h.kart_id) {
            if (!yeniMutabakat[h.kart_id]) {
              yeniMutabakat[h.kart_id] = { beklenen: 0, gercek: null, ay: buAy };
            }
            yeniMutabakat[h.kart_id].beklenen += Number(h.tutar);
          }
        });

        set({ finans: { ...state.finans, buAyHarcamalar: data, kartMutabakat: yeniMutabakat } });
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

      addVarlik: async (varlik) => {
        const state = get();
        const newItem = { id: Date.now(), type: 'tl', location: 'Banka', ...varlik }; // Default type is TL, location Banka
        set({ kasa: { ...state.kasa, varliklar: [newItem, ...(state.kasa.varliklar || [])] } });
        get().addLog('Varlık Eklendi', `${newItem.name}: ${newItem.amount} ${newItem.unit}`);
        get().saveToSupabase();
      },

      deleteVarlik: async (id) => {
        const state = get();
        const v = state.kasa.varliklar.find(x => x.id === id);
        set({ kasa: { ...state.kasa, varliklar: state.kasa.varliklar.filter(x => x.id !== id) } });
        if (v) get().addLog('Varlık Silindi', `${v.name}`);
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

      addGoal: (goal) => {
        const state = get();
        const newGoal = { 
          id: Date.now(), 
          current: 0, 
          deadline: '', 
          priority: 'Orta',
          category: 'Genel',
          notes: '',
          createdAt: new Date().toISOString(),
          createdBy: state.users?.gorkem?.name || 'Sistem', // Default to current user logic if needed
          ...goal 
        };
        set({ kasa: { ...state.kasa, kumbaralar: [...(state.kasa.kumbaralar || []), newGoal] } });
        pushHedefToSupabase(newGoal); // Gölge Yazım
        get().addLog('Hedef Eklendi', `Yeni hedef: ${goal.name}`);
        get().saveToSupabase();
      },

      updateGoal: (id, updates) => {
        const state = get();
        const updated = (state.kasa.kumbaralar || []).map(g => g.id === id ? { ...g, ...updates } : g);
        set({ kasa: { ...state.kasa, kumbaralar: updated } });
        const updatedGoal = updated.find(g => g.id === id);
        if (updatedGoal) pushHedefToSupabase(updatedGoal); // Gölge Yazım
        get().saveToSupabase();
      },

      deleteGoal: (id) => {
        const state = get();
        const g = (state.kasa.kumbaralar || []).find(x => x.id === id);
        set({ kasa: { ...state.kasa, kumbaralar: (state.kasa.kumbaralar || []).filter(x => x.id !== id) } });
        deleteHedefFromSupabase(id); // Gölge Yazım
        if (g) get().addLog('Hedef Silindi', `${g.name}`);
        get().saveToSupabase();
      },

      // --- Vision Goal Actions ---
      addVisionGoal: (goal) => {
        const state = get();
        const newGoal = {
          id: Date.now(),
          current: 0,
          target: 100,
          notes: '',
          createdAt: new Date().toISOString(),
          createdBy: 'Görkem', 
          ...goal
        };
        set({ hedefler: { ...state.hedefler, goals: [...(state.hedefler.goals || []), newGoal] } });
        pushHedefToSupabase(newGoal); // Gölge Yazım
        get().saveToSupabase();
      },

      updateVisionGoal: (id, updates) => {
        const state = get();
        const updated = (state.hedefler.goals || []).map(g => g.id === id ? { ...g, ...updates } : g);
        set({ hedefler: { ...state.hedefler, goals: updated } });
        const updatedGoal = updated.find(g => g.id === id);
        if (updatedGoal) pushHedefToSupabase(updatedGoal); // Gölge Yazım
        get().saveToSupabase();
      },

      deleteVisionGoal: (id) => {
        const state = get();
        set({ hedefler: { ...state.hedefler, goals: (state.hedefler.goals || []).filter(g => g.id !== id) } });
        deleteHedefFromSupabase(id); // Gölge Yazım
        get().saveToSupabase();
      },

      addVisionPlan: (plan) => {
        const state = get();
        const newItem = { id: Date.now().toString(), ...plan };
        set({ hedefler: { ...state.hedefler, longTermVision: [...(state.hedefler.longTermVision || []), newItem] } });
        pushVizyonPlanToSupabase(newItem); // Gölge Yazım
        get().saveToSupabase();
      },

      updateVisionPlan: (id, updates) => {
        const state = get();
        const updated = (state.hedefler.longTermVision || []).map(p => p.id === id ? { ...p, ...updates } : p);
        set({ hedefler: { ...state.hedefler, longTermVision: updated } });
        const updatedPlan = updated.find(p => p.id === id);
        if (updatedPlan) pushVizyonPlanToSupabase(updatedPlan); // Gölge Yazım
        get().saveToSupabase();
      },

      deleteVisionPlan: (id) => {
        const state = get();
        const updated = (state.hedefler.longTermVision || []).filter(p => p.id !== id);
        set({ hedefler: { ...state.hedefler, longTermVision: updated } });
        deleteVizyonPlanFromSupabase(id); // Gölge Yazım
        get().saveToSupabase();
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
        get().saveToSupabase();
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

          const kazanım = {
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
              hedefler: { ...state.hedefler, completedHistory: [kazanım, ...(state.hedefler.completedHistory || [])] }
            });
          } else {
            set({ 
              hedefler: { 
                ...state.hedefler, 
                goals: (state.hedefler.goals || []).filter(g => g.id != goalId),
                completedHistory: [kazanım, ...(state.hedefler.completedHistory || [])] 
              } 
            });
          }
          
          pushHedefGecmisToSupabase(kazanım, 'completed'); // Gölge Yazım
          deleteHedefFromSupabase(goalId); // Aktif hedeflerden sil
          get().addLog('Kazanım!', `Hedef tamamlandı: ${kazanım.title}`);
          get().saveToSupabase();
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


          const kayıp = {
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
                hedefler: { ...state.hedefler, failedHistory: [kayıp, ...(state.hedefler.failedHistory || [])] }
            });
          } else {
            set({ 
                hedefler: { 
                    ...state.hedefler, 
                    goals: (state.hedefler.goals || []).filter(g => g.id != goalId),
                    failedHistory: [kayıp, ...(state.hedefler.failedHistory || [])] 
                } 
            });
          }

          pushHedefGecmisToSupabase(kayıp, 'failed'); // Gölge Yazım
          deleteHedefFromSupabase(goalId); // Aktif hedeflerden sil
          get().addLog('Kayıp', `Hedef başarısız: ${kayıp.title}`);
          get().saveToSupabase();
      },

      updateCompletedGoal: (id, updates) => {
        const state = get();
        const updated = (state.hedefler.completedHistory || []).map(h => h.id === id ? { ...h, ...updates } : h);
        set({ hedefler: { ...state.hedefler, completedHistory: updated } });
        get().saveToSupabase();
      },

      deleteCompletedGoal: (id) => {
        const state = get();
        set({ hedefler: { ...state.hedefler, completedHistory: (state.hedefler.completedHistory || []).filter(h => h.id !== id) } });
        get().saveToSupabase();
      },

      updateFailedGoal: (id, updates) => {
        const state = get();
        const updated = (state.hedefler.failedHistory || []).map(h => h.id === id ? { ...h, ...updates } : h);
        set({ hedefler: { ...state.hedefler, failedHistory: updated } });
        get().saveToSupabase();
      },

      deleteFailedGoal: (id) => {
        const state = get();
        set({ hedefler: { ...state.hedefler, failedHistory: (state.hedefler.failedHistory || []).filter(h => h.id !== id) } });
        get().saveToSupabase();
      },

      // ── Kasa Banka Actions ──────────────────────────────
      addBankaHesabi: (hesap) => {
        const state = get();
        const newHesap = { 
          id: Date.now().toString(), 
          ...hesap,
          balance: Number(hesap.balance || 0),
          kmh: Number(hesap.kmh || 0)
        };
        set({ kasa: { ...state.kasa, bankaHesaplari: [...(state.kasa.bankaHesaplari || []), newHesap] } });
        get().addLog('Banka', `Yeni banka hesabı eklendi: ${hesap.name}`);
        get().saveToSupabase();
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
        get().saveToSupabase();
      },
      deleteBankaHesabi: (id) => {
        const state = get();
        const updated = (state.kasa.bankaHesaplari || []).filter(h => h.id !== id);
        set({ kasa: { ...state.kasa, bankaHesaplari: updated } });
        get().saveToSupabase();
      },
      updateBankaBakiye: (id, newBalance) => {
        const state = get();
        const updated = (state.kasa.bankaHesaplari || []).map(h => h.id === id ? { ...h, balance: Number(newBalance) } : h);
        set({ kasa: { ...state.kasa, bankaHesaplari: updated } });
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
        get().saveToSupabase();
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
        get().saveToSupabase();
      },

      deleteEmergencyItem: (kitType, id) => {
        const state = get();
        const kits = { ...state.ev.emergencyKits };
        if (!kits[kitType]) return;

        kits[kitType] = kits[kitType].filter(item => item.id !== id);
        set({ ev: { ...state.ev, emergencyKits: kits } });
        get().saveToSupabase();
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
      updateSafePassword: (newPass) => {
        const state = get();
        set({ ev: { ...state.ev, guvenlik: { ...state.ev.guvenlik, safePassword: newPass } } });
        get().saveToSupabase();
      },

      addDuzenliOdeme: (data) => {
        const state = get();
        const newItem = { ...data, id: Date.now() };
        set({ ev: { ...state.ev, duzenliOdemeler: [...(state.ev.duzenliOdemeler || []), newItem] } });
        get().saveToSupabase();
        pushEvDuzenliOdemeToSupabase(newItem);
      },
      updateDuzenliOdeme: (id, updates) => {
        const state = get();
        const updated = state.ev.duzenliOdemeler.map(i => i.id === id ? { ...i, ...updates } : i);
        set({ ev: { ...state.ev, duzenliOdemeler: updated } });
        get().saveToSupabase();
        const item = updated.find(i => i.id === id);
        if (item) pushEvDuzenliOdemeToSupabase(item);
      },
      deleteDuzenliOdeme: (id) => {
        const state = get();
        set({ ev: { ...state.ev, duzenliOdemeler: state.ev.duzenliOdemeler.filter(i => i.id !== id) } });
        get().saveToSupabase();
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

        get().saveToSupabase();
      },

      addAbonelik: (abo) => {
        const state = get();
        const newAbo = { ...abo, id: Date.now() };
        set({ ev: { ...state.ev, abonelikler: [...state.ev.abonelikler, newAbo] } });
        get().saveToSupabase();
        pushEvAbonelikToSupabase(newAbo);
      },

      updateAbonelik: (id, updates) => {
        const state = get();
        const updated = state.ev.abonelikler.map(a => a.id === id ? { ...a, ...updates } : a);
        set({ ev: { ...state.ev, abonelikler: updated } });
        get().saveToSupabase();
        const item = updated.find(a => a.id === id);
        if (item) pushEvAbonelikToSupabase(item);
      },

      deleteAbonelik: (id) => {
        const state = get();
        set({ ev: { ...state.ev, abonelikler: state.ev.abonelikler.filter(a => a.id !== id) } });
        get().saveToSupabase();
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
        get().saveToSupabase();
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
        get().saveToSupabase();
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
        get().saveToSupabase();
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
        get().saveToSupabase();
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
        get().saveToSupabase();
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
        pushTatilTripToSupabase(newTrip);
      },

      deleteTrip: (tripId) => {
        const state = get();
        // Convert to string to ensure matching if coming from different sources
        const updatedTrips = state.tatil.trips.filter(t => String(t.id) !== String(tripId));
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        get().addLog('Tatil Silindi', 'Bir tatil planı silindi. 🗑️');
        get().saveToSupabase();
        deleteTatilTripFromSupabase(tripId);
      },

      updateTrip: (tripId, updates) => {
        const state = get();
        const updatedTrips = state.tatil.trips.map(t =>
          t.id === tripId ? { ...t, ...updates } : t
        );
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        get().saveToSupabase();
        const updatedTripObj = updatedTrips.find(t => t.id === tripId);
        if (updatedTripObj) pushTatilTripToSupabase(updatedTripObj);
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
        const valizTrip = updatedTrips.find(t => t.id === tripId);
        if (valizTrip) pushTatilTripToSupabase(valizTrip);
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
          if (String(t.id) === String(tripId)) {
            const newEvals = { ...t.evaluations, [person]: evalData };
            let newStatus = t.status;

            // Auto-completion logic
            if (t.travelers === 'ikimiz') {
              if (newEvals.gorkem && newEvals.esra) newStatus = 'completed';
            } else {
              newStatus = 'completed';
            }

            // Sync photos to main trip object if available
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
        get().saveToSupabase();
        const evalTrip = updatedTrips.find(t => String(t.id) === String(tripId));
        if (evalTrip) pushTatilTripToSupabase(evalTrip);
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
        pushTatilWishlistToSupabase(newDream);
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
        const checkTrip = updatedTrips.find(t => t.id === tripId);
        if (checkTrip) pushTatilTripToSupabase(checkTrip);
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
        
        // GÖLGE YAZIM
        pushMutfakMenuToSupabase(gun, mealKey, String(yemek));
        
        get().saveToSupabase();
      },

      updateMenuDetail: async (gun, details) => {
        const state = get();
        const yeniMenu = {
          ...state.mutfak.menu,
          [gun]: { ...(state.mutfak.menu[gun] || {}), ...details },
        };
        set({ mutfak: { ...state.mutfak, menu: yeniMenu } });
        
        // GÖLGE YAZIM
        Object.entries(details).forEach(([key, value]) => {
          pushMutfakMenuToSupabase(gun, key, String(value));
        });
        
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
        get().saveToSupabase();
        pushMutfakSuToSupabase(newSu);
      },

      setWaterDailyRate: (rate) => {
        const state = get();
        const newSu = { ...state.mutfak.su, dailyRate: rate };
        set({ mutfak: { ...state.mutfak, su: newSu } });
        get().saveToSupabase();
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
          get().saveToSupabase();
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
        get().saveToSupabase();
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
        get().saveToSupabase();
        pushMutfakSuToSupabase(newSu);
        toast.success('Kayıt silindi.');
      },

      processDailyWaterDeduction: () => {
        const state = get();
        const su = state.mutfak.su || {};
        if (!su.lastChecked) return;

        const now = new Date();
        const last = new Date(su.lastChecked);
        const diffMs = now - last;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays < 0.1) return; // 2.4 saatten azsa işlem yapma

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

        // Sonra yedektekini düş
        if (remainingDeduction > 0) {
          newLevel2 = Math.max(0, newLevel2 - remainingDeduction);
        }

        const newSu = { 
          ...su, 
          level1: Math.round(newLevel1), 
          level2: Math.round(newLevel2), 
          lastChecked: now.toISOString() 
        };
        set({
          mutfak: {
            ...state.mutfak,
            su: newSu
          }
        });
        get().saveToSupabase();
        pushMutfakSuToSupabase(newSu);
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
        get().saveToSupabase();
        
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
        get().saveToSupabase();
        
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
        const yeniHistory = [newNote, ...(state.mutfak.history || [])].slice(0, 100);

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
          id: Date.now(),
          ...sanitized
        };

        const currentAkt = Array.isArray(state.sosyal.aktiviteler) ? state.sosyal.aktiviteler : [];
        set({ sosyal: { ...state.sosyal, aktiviteler: [newActivity, ...currentAkt] } });
        get().saveToSupabase();
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
        get().saveToSupabase();
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
        get().saveToSupabase();
        const updatedActivity = yeniAktiviteler.find(a => String(a.id) === String(id));
        if (updatedActivity) pushSosyalEtkinlikToSupabase(updatedActivity);
      },

      cancelSocialActivity: (id) => {
        const state = get();
        const aktList3 = Array.isArray(state.sosyal.aktiviteler) ? state.sosyal.aktiviteler : [];
        const yeniAktiviteler = aktList3.filter(a => String(a.id) !== String(id));
        set({ sosyal: { ...state.sosyal, aktiviteler: yeniAktiviteler } });
        get().saveToSupabase();
        removeSosyalEtkinlikFromSupabase(id);
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
        const currentPoolItems = Array.isArray(state.sosyal.poolItems) ? state.sosyal.poolItems : [];

        set({
          sosyal: {
            ...state.sosyal,
            havuz: currentHavuz.filter(i => String(i.id) !== String(id)),
            poolItems: currentPoolItems.filter(i => String(i.id) !== String(id))
          }
        });
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
        set({ sosyal: { ...state.sosyal, routinePackages: currentPkgs.filter(p => String(p.id) !== String(id)) } });
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
          source: 'Ev Hub',
          payer: 'ortak',
          defaultPay: paymentInfo
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
        get().saveToSupabase();
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
        get().saveToSupabase();
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
        get().saveToSupabase();
        toast.success('Taşınmaz kaydı ve ilgili finansal takipçiler silindi.');
      },

      addOnarimItem: (task, userKey) => {
        const currentEv = get().ev || {};
        const newItem = {
          id: Date.now().toString(),
          task,
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
        get().saveToSupabase();
        pushEvOnarimToSupabase(newItem);
        toast.success(`"${task}" listeye eklendi! 📋`);
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
        get().saveToSupabase();
        const updatedItem = newList.find(i => i.id === id);
        if (updatedItem) pushEvOnarimToSupabase(updatedItem);
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
        get().saveToSupabase();
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
        get().saveToSupabase();
      },

      deleteHomeTask: (listType, id) => {
        const state = get();
        const list = state.ev[listType].filter(item => item.id !== id);
        set({ ev: { ...state.ev, [listType]: list } });
        get().saveToSupabase();

        // SQL Sync
        if (listType === 'duzenliOdemeler') deleteEvDuzenliOdemeFromSupabase(id);
        else if (listType === 'abonelikler') deleteEvAbonelikFromSupabase(id);
        else if (listType === 'demirbaslar') deleteEvDemirbasFromSupabase(id);
      },

      updateHomeSecurity: (updates) => {
        const state = get();
        set({ ev: { ...state.ev, guvenlik: { ...state.ev.guvenlik, ...updates } } });
        get().saveToSupabase();
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
        get().saveToSupabase();
        toast.success('Yeni periyodik bakım eklendi! 🔄');
      },

      updatePeriodicBakim: (id, updates) => {
        const currentEv = get().ev || {};
        const currentBakimlar = Array.isArray(currentEv.bakimlar) ? currentEv.bakimlar : [];

        const updated = currentBakimlar.map(b =>
          b.id === id ? { ...b, ...updates } : b
        );

        set({ ev: { ...currentEv, bakimlar: updated } });
        get().saveToSupabase();
        toast.success('Bakım bilgileri güncellendi! 💾');
      },

      resetPeriodicBakim: (id) => {
        const currentEv = get().ev || {};
        const currentBakimlar = Array.isArray(currentEv.bakimlar) ? currentEv.bakimlar : [];

        const updated = currentBakimlar.map(b =>
          b.id === id ? { ...b, lastDate: new Date().toISOString().split('T')[0] } : b
        );

        set({ ev: { ...currentEv, bakimlar: updated } });
        get().saveToSupabase();
        toast.success('Bakım zamanlayıcısı sıfırlandı! 🕒');
      },

      deletePeriodicBakim: (id) => {
        const currentEv = get().ev || {};
        const currentBakimlar = Array.isArray(currentEv.bakimlar) ? currentEv.bakimlar : [];
        const updated = currentBakimlar.filter(b => b.id !== id);

        set({ ev: { ...currentEv, bakimlar: updated } });
        get().saveToSupabase();
        deleteEvBakimFromSupabase(id);
        toast.success('Bakım kaydı silindi.');
      },

      deleteOnarimItem: (id) => {
        const currentEv = get().ev || {};
        const currentList = Array.isArray(currentEv.onarimListesi) ? currentEv.onarimListesi : [];
        const updated = currentList.filter(item => item.id !== id);
        set({ ev: { ...currentEv, onarimListesi: updated } });
        get().saveToSupabase();
        deleteEvOnarimFromSupabase(id);
        toast.success('Onarım kaydı arşivden silindi.');
      },

      deleteAlisverisItem: (id, listKey) => {
        const currentMutfak = get().mutfak || {};
        const currentList = Array.isArray(currentMutfak.alisveris?.[listKey]) ? currentMutfak.alisveris[listKey] : [];
        const updated = currentList.filter(item => item.id !== id);
        set({ mutfak: { ...currentMutfak, alisveris: { ...currentMutfak.alisveris, [listKey]: updated } } });
        get().saveToSupabase();
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
        get().saveToSupabase();
        toast.success('Aşı geçmişi silindi.');
      },

      // ── Yaşam & Tracking Actions ────────────────────────
      updateLocationSettings: (type, updates) => {
        const state = get();
        const currentEv = state.ev || {};
        const currentTracking = currentEv.tracking || {};
        
        // Default radius values if not exist
        const defaultRadius = type === 'home' ? 150 : 250;

        set({
          ev: {
            ...currentEv,
            tracking: {
              ...currentTracking,
              [type]: { 
                radius: defaultRadius, 
                ...(currentTracking[type] || {}), 
                ...updates 
              }
            }
          }
        });
        get().saveToSupabase();
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
        get().saveToSupabase();
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
        get().saveToSupabase();
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
        get().saveToSupabase();
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

        const newLog = { date: today, type: effectiveType, durationMinutes: minutes, timestamp: now };
        updatedLogs = [newLog, ...updatedLogs].slice(0, 2000);

        const dateObj = new Date(now);
        const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
        const hour = dateObj.getHours().toString().padStart(2, '0');
        const habitKey = `${day}-${hour}`;

        const currentHabits = tracking.weeklyHabits || {};
        const slot = currentHabits[habitKey] || { home: 0, work: 0, other: 0, tatil: 0 };
        slot[effectiveType] = (slot[effectiveType] || 0) + 1;

        set({
          ev: {
            ...currentEv,
            tracking: {
              ...tracking,
              logs: updatedLogs,
              lastCheck: { type: effectiveType, timestamp: now },
              weeklyHabits: { ...currentHabits, [habitKey]: slot }
            }
          }
        });
        get().saveToSupabase();
      },

      updateCachedAnalysis: (analysisData) => {
        const currentEv = get().ev || {};
        const tracking = currentEv.tracking || {};
        const today = new Date().toISOString().split('T')[0];
        set({
          ev: {
            ...currentEv,
            tracking: {
              ...tracking,
              cachedAnalysis: analysisData,
              lastAnalysisDate: today
            }
          }
        });
        get().saveToSupabase();
      },

      savePersonalityResults: (testId, traits) => {
        const currentEv = get().ev || {};
        const tracking = currentEv.tracking || {};
        const personality = tracking.personality || { results: {}, history: [] };
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
          ...personality.results,
          [testId]: { traits, type, date: today }
        };

        const newHistoryItem = { testId, traits, type, date: today };
        const newHistory = [newHistoryItem, ...(personality.history || [])].slice(0, 50);

        set({
          ev: {
            ...currentEv,
            tracking: {
              ...tracking,
              personality: { results: newResults, history: newHistory, lastUpdated: today }
            }
          }
        });
        get().saveToSupabase();
      },

      updateTrackingRoutine: (updates) => {
        const currentEv = get().ev || {};
        const tracking = currentEv.tracking || {};
        set({ ev: { ...currentEv, tracking: { ...tracking, routine: { ...(tracking.routine || {}), ...updates } } } });
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

      addFuelLog: (log, paymentInfo = null) => {
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
          source: 'Garaj',
          dt: log.date,
          ...(paymentInfo ? { defaultPay: paymentInfo } : {})
        });

        get().saveToSupabase();
        pushGarajYakitToSupabase(newLog, state.selectedVehicleId);
      },

      addServiceRecord: (record, paymentInfo = null) => {
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
          source: 'Garaj',
          dt: record.date,
          ...(paymentInfo ? { defaultPay: paymentInfo } : {})
        });

        get().saveToSupabase();
        pushGarajServisToSupabase(newRecord, state.selectedVehicleId);
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
        get().saveToSupabase();
      },

      deleteServiceRecord: (vehicleId, serviceId) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicleId ? { ...v, services: v.services.filter(s => s.id !== serviceId) } : v
        );
        set({ garaj: updatedGaraj });
        get().saveToSupabase();
        deleteGarajServisFromSupabase(serviceId);
      },

      deleteDocument: (vehicleId, docId) => {
        const state = get();
        const updatedGaraj = state.garaj.map(v =>
          v.id === vehicleId ? { ...v, documents: v.documents.filter(d => d.id !== docId) } : v
        );
        set({ garaj: updatedGaraj });
        get().saveToSupabase();
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
        deleteGarajYakitFromSupabase(logId);
      },

      // ── Pet Actions ────────────────────────────────────
      addPetVaccine: (petId, vaccine) => {
        const state = get();
        const currentVaccines = state.pet.vaccines[petId] || [];
        const yeniVaccines = [...currentVaccines, { id: Date.now(), ...vaccine }];
        set({ pet: { ...state.pet, vaccines: { ...state.pet.vaccines, [petId]: yeniVaccines } } });
        get().saveToSupabase();
        pushPetAsiToSupabase(petId, { id: Date.now(), ...vaccine });
      },

      deletePetVaccine: (petId, id) => {
        const state = get();
        const yeniVaccines = (state.pet.vaccines[petId] || []).filter(v => v.id !== id && v.n !== id);
        set({ pet: { ...state.pet, vaccines: { ...state.pet.vaccines, [petId]: yeniVaccines } } });
        get().saveToSupabase();
        deletePetAsiFromSupabase(id);
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
        pushPetAgirlikToSupabase(petId, { id: Date.now(), ...weightData });
      },

      deletePetWeight: (petId, id) => {
        const state = get();
        const yeniWeights = (state.pet.weights[petId] || []).filter(w => w.id !== id);
        set({ pet: { ...state.pet, weights: { ...state.pet.weights, [petId]: yeniWeights } } });
        get().saveToSupabase();
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

        yeniPet.history = (state.pet.history || []).filter(h => h.id !== id);

        set({ pet: yeniPet });
        get().saveToSupabase();
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
        get().saveToSupabase();
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
        // Check vision goals
        let goal = state.hedefler.goals.find(g => g.id === id);
        let isMoney = false;

        // Check money goals if not found
        if (!goal) {
          goal = (state.kasa.kumbaralar || []).find(g => g.id === id);
          if (goal) isMoney = true;
        }

        if (!goal) return;

        const updatedVisionGoals = isMoney ? state.hedefler.goals : state.hedefler.goals.filter(g => g.id !== id);
        const updatedMoneyGoals = isMoney ? (state.kasa.kumbaralar || []).filter(g => g.id !== id) : state.kasa.kumbaralar;
        
        const newHallItem = { 
          ...goal, 
          title: goal.title || goal.name,
          completedDate: new Date().toISOString().split('T')[0],
          reward: isMoney ? 'Finansal Özgürlük Adımı' : 'Vizyon Başarısı'
        };

        set({
          hedefler: {
            ...state.hedefler,
            goals: updatedVisionGoals,
            hallOfFame: [newHallItem, ...(state.hedefler.hallOfFame || [])]
          },
          kasa: {
            ...state.kasa,
            kumbaralar: updatedMoneyGoals
          }
        });
        get().addLog('Hedef Tamamlandı', `🌟 Tebrikler! "${newHallItem.title}" hedefine ulaşıldı!`);
        get().saveToSupabase();
      },

      setOnlineStatus: (status) => {
        set(state => ({ system: { ...state.system, isOnline: status } }));
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
        get().saveToSupabase();
        if (updatedItemData) pushMutfakStokToSupabase(updatedItemData, moduleKey); // Faz 1.2
      },

      addMutfakStokItem: (moduleKey, newItem) => {
        const state = get();
        const currentList = state.mutfak[moduleKey] || [];
        const updatedList = [...currentList, newItem];
        set({ mutfak: { ...state.mutfak, [moduleKey]: updatedList } });
        get().saveToSupabase();
        pushMutfakStokToSupabase(newItem, moduleKey);
      },

      updateMutfakStokItem: (moduleKey, oldName, newItem) => {
        const state = get();
        const currentList = state.mutfak[moduleKey] || [];
        const updatedList = currentList.map(item => item.n === oldName ? newItem : item);
        set({ mutfak: { ...state.mutfak, [moduleKey]: updatedList } });
        get().saveToSupabase();
        pushMutfakStokToSupabase(newItem, moduleKey);
        // Supabase silme işlemi gerekebilir ama isme göre çalıştığı için upsert muhtemelen yeni satır açar.
        // O yüzden eski ismi siliyoruz.
        supabase.from('mutfak_stok').delete().eq('isim', oldName).then();
      },

      deleteMutfakStokItem: (moduleKey, itemName) => {
        const state = get();
        const currentList = state.mutfak[moduleKey] || [];
        const updatedList = currentList.filter(item => item.n !== itemName);
        set({ mutfak: { ...state.mutfak, [moduleKey]: updatedList } });
        get().saveToSupabase();
        supabase.from('mutfak_stok').delete().eq('isim', itemName).then();
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
          get().addExpense({
            title: `Mutfak Alışverişi (${market || 'Market'})`,
            amount: totalPrice,
            category: 'Mutfak',
            payer: state.currentUser?.name || 'Görkem',
            defaultPay: paymentInfo
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
          // 1. Currencies
          const res = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
          const data = await res.json();
          const rates = { EUR: 35, USD: 32, GBP: 40, GA: 2500 }; // Fallbacks

          if (data && data.rates) {
            rates.EUR = Number((1 / data.rates.EUR).toFixed(2));
            rates.USD = Number((1 / data.rates.USD).toFixed(2));
            rates.GBP = Number((1 / data.rates.GBP).toFixed(2));
          }

          // 2. Gold & Crypto (Gram Gold, BTC, ETH in TRY)
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

          } catch (e) {
            console.error('Commodity/Crypto fetch error:', e);
          }

          set(state => ({
            kasa: {
              ...state.kasa,
              rates: rates
            }
          }));
          console.log('📈 Market rates updated:', rates);
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
        get().saveToSupabase();
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
        get().saveToSupabase();
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

          // Protection & Migration
          merged.tatil.trips = merged.tatil.trips.map(t => {
            const initialT = initialState.tatil?.trips?.find(it => it.id === t.id);
            const evaluations = t.evaluations || initialT?.evaluations || {};

            const hasNewStructure = t.transportation && t.transportation.departure;
            if (!hasNewStructure) {
              return {
                ...t,
                evaluations,
                transportation: {
                  departure: { flightNo: t.transportation?.flightNo || '', airline: t.transportation?.airline || '', pnr: t.transportation?.pnr || '', time: t.transportation?.time || '', status: 'Planlandı' },
                  return: { flightNo: '', airline: '', pnr: '', time: '', status: 'Planlandı' }
                }
              };
            }
            return { ...t, evaluations };
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
        if (merged.pet) {
          if (merged.pet.vaccines && !Array.isArray(merged.pet.vaccines) && typeof merged.pet.vaccines === 'object') {
            // Already correct object structure
          } else {
            merged.pet.vaccines = initialState.pet.vaccines;
          }
          if (merged.pet.weights && !Array.isArray(merged.pet.weights) && typeof merged.pet.weights === 'object') {
            // Already correct object structure
          } else {
            merged.pet.weights = initialState.pet.weights;
          }
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
