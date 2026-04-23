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
    harcamalar: [], // { id, title, amount, category, date, payer }
    borclar: [
      { id: 1, name: 'Konut Kredisi', total: 1200000, remaining: 850000, monthly: 15400, due_day: 15, type: 'kredi' },
      { id: 2, name: 'Araç Kredisi', total: 400000, remaining: 120000, monthly: 8500, due_day: 5, type: 'kredi' }
    ],
    kartlar: [
      { id: 1, name: 'Bonus Platinum', limit: 150000, balance: 45000, cutoff_day: 25, owner: 'gorkem' },
      { id: 2, name: 'Axess Free', limit: 80000, balance: 12000, cutoff_day: 10, owner: 'esra' }
    ],
    history: [],
    rekurans: [
      { id: 1, title: 'Netflix', amount: 229, category: 'Abonelik', date: '2026-04-25', icon: '📺', owner: 'ortak' },
      { id: 2, title: 'Spotify', amount: 59, category: 'Abonelik', date: '2026-04-20', icon: '🎵', owner: 'ortak' },
      { id: 3, title: 'Kira', amount: 25000, category: 'Barınma', date: '2026-05-01', icon: '🏠', owner: 'ortak' }
    ]
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
    tasinmazlar: [], 
    varliklar: [
      { id: 1, name: 'Altın Birikimi', value: 450000, type: 'emtia', icon: '🟡', amount: 120, unit: 'gr' },
      { id: 2, name: 'Borsa Portföy', value: 850000, type: 'hisse', icon: '📈', amount: 0, unit: 'lot' }
    ],   
    gecmis: []
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
    ekmeklik: [],      // { id, tip, ic, raf, mk, adet, dt }
  },
  saglik: {
    randevular: [],    
    ilaclar: [],       
    olcumler: [],      
    moods: [], // { date, user, mood, note }
  },
  alisveris: {
    gorkem: [], // { id, nm, link, pr, dt, done, doneDate }
    esra: [],
    ev: [],
  },
  hedefler: [],        
  sosyal: {
    aktiviteler: INITIAL_SOCIAL,   
    rutinler: [],      
    havuz: [],
    tab: 'hafta'
  },
  ev: {
    faturalar: [],     
    bakim: [],
    sigortalar: [],
    tab: 'fatura'
  },
  pet: {
    meta: PET_META,
    vaccines: VACCINES,
    weights: INITIAL_WEIGHTS,
    history: []
  },
  aracim: {
    km: INITIAL_VEHICLE.km,
    bakim: INITIAL_VEHICLE.maintenance,         
    yakitlar: [],
    hs: [],
    ev: INITIAL_VEHICLE.events || []
  },
  tatil: {
    trips: INITIAL_TRIPS,
    visas: [],
    passport: { 
      gorkem: { name: 'Görkem Eray', no: '', exp: '' }, 
      esra: { name: 'Esra Eray', no: '', exp: '' } 
    },
    wishlist: [],
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

      addMood: (userId, mood, note = '') => {
        const state = get();
        const newMood = {
          id: Date.now(),
          date: new Date().toISOString(),
          user: userId,
          mood,
          note
        };
        const updatedMoods = [newMood, ...state.saglik.moods].slice(0, 100);
        set({ saglik: { ...state.saglik, moods: updatedMoods } });
        get().addLog('Ruh Hali', `${state.users[userId].name} ruh halini paylaştı: ${mood.label}`);
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
      addExpense: async (expense) => {
        const state = get();
        const newExpense = { 
          id: Date.now(), 
          dt: new Date().toISOString().split('T')[0],
          ...expense 
        };
        
        // Use kasa.bakiyeler as the unified source
        const yeniBakiyeler = { ...state.kasa.bakiyeler };
        const payerKey = (expense.payer || '').toLowerCase();
        
        if (payerKey && yeniBakiyeler[payerKey] !== undefined && !expense.cardId) {
          yeniBakiyeler[payerKey] -= Number(expense.amount);
        }

        set({
          kasa: {
            ...state.kasa,
            bakiyeler: yeniBakiyeler,
            gecmis: [{ id: Date.now(), tp: 'harcama', ...newExpense }, ...state.kasa.gecmis].slice(0, 200)
          },
          finans: {
            ...state.finans,
            harcamalar: [newExpense, ...state.finans.harcamalar].slice(0, 500),
            history: [{ id: Date.now(), tp: 'harcama', ...newExpense }, ...state.finans.history].slice(0, 100)
          }
        });
        get().addLog('Harcama Girişi', `${newExpense.payer || 'Sistem'}: ${newExpense.amount}₺ - ${newExpense.title}`);
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

      updateKasa: async (kisi, yeniTutar, not = '') => {
        const state = get();
        const eskiTutar = state.kasa.bakiyeler[kisi] || 0;
        const fark = yeniTutar - eskiTutar;
        
        set({
          kasa: {
            ...state.kasa,
            bakiyeler: { ...state.kasa.bakiyeler, [kisi]: yeniTutar },
            gecmis: [{
              id: Date.now(),
              tp: 'guncelleme',
              kisi, fark, not,
              dt: new Date().toLocaleDateString('tr-TR')
            }, ...state.kasa.gecmis].slice(0, 200)
          }
        });
        get().addLog('Kasa Güncelleme', `${kisi} bakiyesi ${yeniTutar}₺ olarak güncellendi.`);
        get().saveToSupabase();
      },

      updateVarlik: async (id, value, amount = null) => {
        const state = get();
        const yeniVarliklar = state.kasa.varliklar.map(v => 
          v.id === id ? { ...v, value, ...(amount !== null ? { amount } : {}) } : v
        );
        set({ kasa: { ...state.kasa, varliklar: yeniVarliklar } });
        const varlik = state.kasa.varliklar.find(v => v.id === id);
        get().addLog('Varlık Güncelleme', `${varlik.name} değeri ${value}₺ olarak güncellendi.`);
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

      transferKasa: async (from, to, amount, not = '') => {
        const state = get();
        if (state.kasa.bakiyeler[from] < amount) throw new Error('Yetersiz bakiye!');
        
        set({
          kasa: {
            ...state.kasa,
            bakiyeler: {
              ...state.kasa.bakiyeler,
              [from]: state.kasa.bakiyeler[from] - amount,
              [to]: state.kasa.bakiyeler[to] + amount
            },
            gecmis: [{
              id: Date.now(),
              tp: 'transfer',
              from, to, amount, not,
              dt: new Date().toLocaleDateString('tr-TR')
            }, ...state.kasa.gecmis].slice(0, 200)
          }
        });
        get().saveToSupabase();
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
        const updatedList = state.alisveris[owner].map(item => 
          item.id === itemId ? { ...item, done: !item.done, doneDate: !item.done ? new Date().toISOString() : null } : item
        );
        set({ alisveris: { ...state.alisveris, [owner]: updatedList } });
        
        const item = state.alisveris[owner].find(i => i.id === itemId);
        if (!item.done) {
          get().addLog('Alışveriş Tamamlandı', `${owner} listesinde alındı: ${item.nm}`);
        }
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
          checklists: [
            { id: 1, text: 'Biletler Alındı mı?', done: false },
            { id: 2, text: 'Konaklama Ayarlandı mı?', done: false },
            { id: 3, text: 'Valiz Hazırlandı mı?', done: false }
          ],
          hotels: [],
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

      // ── Araç Actions ───────────────────────────────────
      updateAracKm: async (newKm) => {
        const state = get();
        const oldKm = state.aracim.km || 0;
        const diff = newKm - oldKm;
        const yeniEv = (state.aracim.ev || []).map(ev => (ev.tp === 'km' && ev.kmL != null) ? { ...ev, kmL: Math.max(0, ev.kmL - diff) } : ev);
        set({ aracim: { ...state.aracim, km: newKm, ev: yeniEv } });
        get().saveToSupabase();
      },

      addAracMaintenance: async (record) => {
        const state = get();
        set({ aracim: { ...state.aracim, hs: [{ id: Date.now(), dt: new Date().toISOString(), ...record }, ...(state.aracim.hs || [])] } });
        get().saveToSupabase();
      },

      addAracLog: async (log) => {
        const state = get();
        if (log.tp === 'yakit') {
          set({ aracim: { ...state.aracim, yakitlar: [{ id: Date.now(), ...log }, ...(state.aracim.yakitlar || [])] } });
        } else {
          set({ aracim: { ...state.aracim, hs: [{ id: Date.now(), ...log }, ...(state.aracim.hs || [])] } });
        }
        get().saveToSupabase();
      },

      // ── Helper Actions ───────────────────────────────────
      setModuleData: (key, data) => {
        set({ [key]: data });
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
