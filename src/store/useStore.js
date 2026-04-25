import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  INITIAL_WEIGHTS
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
      emoji: '👨‍💻'
    },
    esra: {
      name: 'Esra ERAY',
      birthDate: '05.01.1989',
      birthPlace: 'Antalya',
      phone: '+905394245664',
      email: 'eesra_yldrm@gmail.com',
      emoji: '👩‍🍳'
    }
  },
  kasa: {
    bakiyeler: { gorkem: 15000, esra: 12000, ortak: 5000 },
    tasinmazlar: [
      { id: 1, name: 'Merkez Ev', value: 4500000, tax: 1200, insurance: 3500, extra: 5000, icon: '🏠' }
    ], 
    varliklar: [
      { id: 1, name: 'Altın Birikimi', amount: 120, unit: 'gr', price: 2500, type: 'gold', icon: '🟡' },
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
    sohbet: [],        // { id, t, w, d, r } - text, writer, date, read
    arsiv: [],         // { id, t, w, d, r, archDate }
    priceHistory: {},  // { itemName: [ { pr, dt, mk } ] }
    ekmeklik: [],      // { id, tip, ic, raf, mk, adet, dt }
  },
  saglik: {
    randevular: [],
    ilaclar: [],     // { id, kisi, ad, dozaj, siklik, stok, minStok }
    olcumler: [],    // { id, kisi, tur, deger, tarih }
    moods: [],       // { id, user, mood, note, kategori, date }
    logs: []
  },
  // ── Global System ──────────────────────────────────
  system: {
    version: '2.6.1',
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
    aktiviteler: INITIAL_SOCIAL,   
    rutinler: [],      
    havuz: [],
    tab: 'hafta'
  },
  aracim: {
    km: 45200,
    parts: [
      { id: 'oil', name: 'Motor Yağı', lastKM: 42000, intervalKM: 15000, lastDate: '2025-10-15', intervalDays: 365, icon: '🛢️' },
      { id: 'filter', name: 'Hava Filtresi', lastKM: 42000, intervalKM: 15000, lastDate: '2025-10-15', intervalDays: 365, icon: '🌪️' },
      { id: 'brakes', name: 'Fren Balataları', lastKM: 35000, intervalKM: 30000, lastDate: '2025-05-10', intervalDays: 730, icon: '🛑' }
    ],
    fuelLogs: [
      { id: 1, date: '2026-04-20', km: 45100, amount: 45.5, price: 42.5, station: 'Shell', consumption: 7.2 },
      { id: 2, date: '2026-04-10', km: 44500, amount: 42.0, price: 41.8, station: 'Opet', consumption: 7.5 }
    ],
    services: [
      { id: 1, date: '2025-10-15', km: 42000, title: 'Periyodik Bakım', detail: 'Yağ ve filtreler değişti', cost: 4500, shop: 'VW Yetkili Servis' }
    ],
    documents: [
      { id: 'muayene', name: 'TÜVTÜRK Muayene', dueDate: '2027-06-15', icon: '🔍' },
      { id: 'kasko', name: 'Kasko Sigortası', dueDate: '2026-11-20', icon: '🛡️' },
      { id: 'trafik', name: 'Trafik Sigortası', dueDate: '2026-11-20', icon: '📋' }
    ],
    trips: [],
    tireStatus: { type: 'Yazlık', changeDate: '2026-04-01', condition: 'İyi' },
    lastCleaned: '2026-04-23',
    parkLocation: { floor: '', spot: '', photo: null }
  },
  ev: {
    faturalar: [
      { id: 1, name: 'Elektrik', provider: 'EnerjiSa', amount: 850, dueDate: '2026-04-20', status: 'Ödendi', autoPay: true, icon: '⚡' },
      { id: 2, name: 'İnternet', provider: 'TurkNet', amount: 399, dueDate: '2026-04-25', status: 'Bekliyor', autoPay: true, icon: '🌐' },
      { id: 3, name: 'Doğalgaz', provider: 'İGDAŞ', amount: 1250, dueDate: '2026-04-15', status: 'Ödendi', autoPay: false, icon: '🔥' }
    ],
    bakimlar: [
      { id: 'kombi', name: 'Kombi Bakımı', lastDate: '2025-11-01', intervalDays: 365, icon: '🔥' },
      { id: 'klima', name: 'Klima Temizliği', lastDate: '2025-06-15', intervalDays: 180, icon: '❄️' },
      { id: 'aritma', name: 'Su Arıtma Filtre', lastDate: '2026-01-10', intervalDays: 180, icon: '💧' }
    ],
    demirbaslar: [
      { id: 1, name: 'Buzdolabı', brand: 'Samsung', warrantyDate: '2027-05-10', photo: null },
      { id: 2, name: 'Çamaşır Mak.', brand: 'LG', warrantyDate: '2026-12-15', photo: null }
    ],
    tamirListesi: [
      { id: 1, task: 'Mutfak Musluğu Sızıntı', priority: 'High', status: 'Pending' }
    ],
    ustaRehberi: [
      { id: 1, name: 'Tesisatçı Ahmet Usta', phone: '0555 123 4567', category: 'Tesisat', rating: 5 }
    ],
    abonelikler: [
      { id: 1, name: 'Netflix', amount: 189, date: '2026-04-15' },
      { id: 2, name: 'YouTube Prem.', amount: 59, date: '2026-04-10' }
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
    ]
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
    trips: [],       // { id, title, country, city, type, startDate, endDate, pnr, otel, valiz: { gorkem: [], esra: [] }, budget: { est, real }, status }
    wishlist: [],    // { id, place, notes }
    passport: { 
      gorkem: { name: 'Görkem Eray', no: '', exp: '' }, 
      esra: { name: 'Esra Eray', no: '', exp: '' } 
    },
    ttab: 'trips'
  },
  achievements: ACHIEVEMENTS,    
  logs: [],
  ui: {
    isModalOpen: false
  },
  currentUser: null, // { name: 'Görkem', emoji: '👨‍💻' } or { name: 'Esra', emoji: '👩‍🍳' }
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

function extractAppData(state) {
  return {
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
    aracim:    state.aracim,
    tatil:     state.tatil,
    achievements: state.achievements,
    logs:      state.logs,
  };
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
        set({ [moduleName]: { ...state[moduleName], ...data } });
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

      initSync: async () => {
        await get().loadFromSupabase();
        get().subscribeToSupabase();
        
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
              ...(remote.mutfak?.tarifler?.length ? { tarifler: remote.mutfak.tarifler } : {}),
              ...(remote.mutfak?.buzdolabi?.length ? { buzdolabi: remote.mutfak.buzdolabi } : {}),
              ...(remote.mutfak?.kiler?.length ? { kiler: remote.mutfak.kiler } : {}),
              ...(remote.mutfak?.dondurucu?.length ? { dondurucu: remote.mutfak.dondurucu } : {}),
              ...(remote.mutfak?.menu ? { menu: remote.mutfak.menu } : {}),
            },
            saglik:    { ...DEFAULT_STATE.saglik, ...remote.saglik },
            alisveris: remote.alisveris || DEFAULT_STATE.alisveris,
            hedefler:  remote.hedefler  || DEFAULT_STATE.hedefler,
            sosyal:    { ...DEFAULT_STATE.sosyal, ...remote.sosyal },
            ev:        { ...DEFAULT_STATE.ev, ...remote.ev },
            pet:       { ...DEFAULT_STATE.pet, ...remote.pet },
            aracim:    { ...DEFAULT_STATE.aracim, ...remote.aracim },
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
          id: Date.now(),
          status: 'planlandi',
          valiz: { 
            gorkem: [
              { id: 1, text: 'Pasaport', done: false },
              { id: 2, text: 'Şarj Cihazları', done: false },
              { id: 3, text: 'Kıyafetler', done: false }
            ],
            esra: [
              { id: 1, text: 'Pasaport', done: false },
              { id: 2, text: 'Kozmetik / Bakım', done: false },
              { id: 3, text: 'Kıyafetler', done: false }
            ]
          },
          budget: { est: trip.budget || 0, real: 0 },
          ...trip
        };
        const updatedTrips = [...state.tatil.trips, newTrip];
        set({ tatil: { ...state.tatil, trips: updatedTrips } });
        get().addLog('Yeni Tatil Planı', `${trip.title || trip.city} seyahati planlandı! ✈️`);
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

      addTripExpense: (tripId, expense) => {
        const state = get();
        get().addExpense({
          title: `Tatil: ${expense.title}`,
          amount: expense.amount,
          category: 'tatil',
          source: 'Tatil Modülü'
        });
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
        const yeniSohbet = [newNote, ...state.mutfak.sohbet].slice(0, 15);
        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet } });
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
        const yeniSohbet = state.mutfak.sohbet.filter(n => n.id !== noteId);
        set({ mutfak: { ...state.mutfak, sohbet: yeniSohbet } });
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
        const yeniAktiviteler = (Array.isArray(state.sosyal.aktiviteler) ? state.sosyal.aktiviteler : []).filter(a => a.id !== id);
        set({ sosyal: { ...state.sosyal, aktiviteler: yeniAktiviteler } });
        get().saveToSupabase();
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

      addSocialPoolItem: (item) => {
        const state = get();
        const newItem = { id: Date.now(), count: 0, ...item };
        set({ sosyal: { ...state.sosyal, havuz: [newItem, ...state.sosyal.havuz] } });
        get().saveToSupabase();
      },

      // ── Ev Actions ─────────────────────────────────────
      payFatura: (id) => {
        const state = get();
        const fatura = state.ev.faturalar.find(f => f.id === id);
        if (!fatura) return;

        const updatedFaturalar = state.ev.faturalar.map(f => 
          f.id === id ? { ...f, status: 'Ödendi' } : f
        );

        set({ ev: { ...state.ev, faturalar: updatedFaturalar } });

        // Sync to Finans
        get().addExpense({
          title: `Fatura: ${fatura.name}`,
          amount: fatura.amount,
          category: 'fatura',
          source: 'Ev Hub'
        });

        get().saveToSupabase();
        toast.success(`${fatura.name} faturası ödendi! 💸`);
      },

      addRepairItem: (item) => {
        const state = get();
        const newItem = { id: Date.now(), status: 'Pending', ...item };
        set({ ev: { ...state.ev, tamirListesi: [newItem, ...state.ev.tamirListesi] } });
        get().saveToSupabase();
      },

      updateHomeSecurity: (updates) => {
        const state = get();
        set({ ev: { ...state.ev, guvenlik: { ...state.ev.guvenlik, ...updates } } });
        get().saveToSupabase();
      },
      updateKM: (newKM) => {
        const state = get();
        set({ aracim: { ...state.aracim, km: newKM } });
        get().addLog('KM Güncelleme', `Araç kilometresi ${newKM} olarak güncellendi.`);
        get().saveToSupabase();
      },

      addFuelLog: (log) => {
        const state = get();
        const lastLog = state.aracim.fuelLogs[0];
        let consumption = 0;
        if (lastLog) {
          const kmDiff = log.km - lastLog.km;
          consumption = (log.amount / kmDiff) * 100;
        }

        const newLog = { 
          id: Date.now(), 
          consumption: consumption.toFixed(1),
          ...log 
        };

        set({ aracim: { ...state.aracim, fuelLogs: [newLog, ...state.aracim.fuelLogs].slice(0, 50) } });
        
        // Also add to Finans approval pool
        get().addExpense({
          title: `Yakıt: ${log.station}`,
          amount: log.amount * log.price,
          category: 'arac',
          source: 'Aracım'
        });

        get().saveToSupabase();
      },

      addServiceRecord: (record) => {
        const state = get();
        const newRecord = { id: Date.now(), ...record };
        set({ aracim: { ...state.aracim, services: [newRecord, ...state.aracim.services] } });
        
        // Add to Finans approval pool
        get().addExpense({
          title: `Servis: ${record.title}`,
          amount: record.cost,
          category: 'arac',
          source: 'Aracım'
        });

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
      // ── System Actions ────────────────────────────────
      calculateGlobalScore: () => {
        const state = get();
        // Weighted logic: 30% Finance, 20% Health, 20% Home, 20% Goals, 10% Vehicle
        let score = 70; // Baseline
        
        const goals = state.hedefler?.goals || [];
        const faturalar = state.ev?.faturalar || [];
        const km = state.aracim?.km || 0;

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
      partialize: (state) => extractAppData(state),
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
        // Fix others
        if (merged.ev && !Array.isArray(merged.ev.faturalar)) merged.ev.faturalar = [];
        if (merged.saglik && !Array.isArray(merged.saglik.randevular)) merged.saglik.randevular = [];
        if (merged.tatil && !Array.isArray(merged.tatil.trips)) merged.tatil.trips = [];
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
