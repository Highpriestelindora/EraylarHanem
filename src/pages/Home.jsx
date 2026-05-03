import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, RefreshCcw, Settings, 
  ChevronRight, History as HistoryIcon, Heart
} from 'lucide-react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import logo from '../assets/eraylar-logo.png';
import Portal from '../components/Portal';
import { motion, AnimatePresence } from 'framer-motion';
import { PET_QUOTES } from '../constants/petQuotes';
import toast from 'react-hot-toast';
import './Home.css';

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Mutlu', color: '#fef3c7' },
  { id: 'calm', emoji: '😌', label: 'Huzurlu', color: '#ecfdf5' },
  { id: 'tired', emoji: '😫', label: 'Yorgun', color: '#f8fafc' },
  { id: 'sad', emoji: '😔', label: 'Üzgün', color: '#eff6ff' },
  { id: 'energetic', emoji: '🤩', label: 'Enerjik', color: '#fff7ed' },
  { id: 'sick', emoji: '🤒', label: 'Hasta', color: '#fef2f2' }
];

const Home = () => {
  // Selective Selectors for Performance
  const currentUser = useStore(state => state.currentUser);
  const system = useStore(state => state.system) || { version: '2.31.0', globalScore: 0, weeklyReports: [], achievements: [] };
  const saglik = useStore(state => state.saglik);
  const garaj = useStore(state => state.garaj);
  const logs = useStore(state => state.logs) || [];
  const addMood = useStore(state => state.addMood);
  const selectedVehicleId = useStore(state => state.selectedVehicleId);
  const calculateGlobalScore = useStore(state => state.calculateGlobalScore);
  
  const isOnline = system?.isOnline ?? true;
  const navigate = useNavigate();

  const activeVehicle = useMemo(() => 
    garaj?.find(v => v.id === selectedVehicleId) || garaj?.[0], 
    [garaj, selectedVehicleId]
  );
  
  const [showLogs, setShowLogs] = useState(false);
  const [insights, setInsights] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const carouselRef = React.useRef(null);

  const getSmartInsights = () => {
    const store = useStore.getState();
    const cards = [];
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];
    const tomorrowISO = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const userName = currentUser?.name?.split(' ')[0] || 'Dostum';
    const daysDiff = (dateStr) => {
      if (!dateStr) return 999;
      return Math.ceil((new Date(dateStr) - today) / (1000 * 60 * 60 * 24));
    };

    // ── 1. MUTFAK: Azalan Stok ──
    const allStock = [
      ...(store.mutfak?.buzdolabi || []),
      ...(store.mutfak?.kiler || []),
      ...(store.mutfak?.dondurucu || [])
    ];
    const lowStock = allStock.filter(i => i.cr <= i.mn && i.cr > 0);
    if (lowStock.length > 0) {
      const names = lowStock.slice(0, 3).map(i => i.n).join(', ');
      cards.push({
        id: 'mutfak-low', icon: '🍲', text: `${lowStock.length} ürün azalmış`,
        subtext: names, type: 'warning', color: '#EF4444', module: '/mutfak', priority: 85
      });
    }

    // ── 2. MUTFAK: Bugünün Menüsü ──
    const todayMenu = store.mutfak?.menu?.[todayISO];
    if (todayMenu?.a || todayMenu?.k) {
      const meal = todayMenu.a || todayMenu.k;
      cards.push({
        id: 'mutfak-menu', icon: '🍽️', text: 'Bugünün menüsü hazır!',
        subtext: meal, type: 'info', color: '#F97316', module: '/mutfak', priority: 60
      });
    }

    // ── 3. MUTFAK: Alışveriş Listesi ──
    const shopCount = (store.mutfak?.alisveris || []).filter(i => !i.dn).length;
    if (shopCount > 0) {
      cards.push({
        id: 'mutfak-shop', icon: '🛒', text: `${shopCount} ürün alışverişte`,
        subtext: 'Markete uğramayı unutma!', type: 'info', color: '#F59E0B', module: '/mutfak', priority: 55
      });
    }

    // ── 4. SAĞLIK: Bugün/Yarın Randevu ──
    const todayApp = (store.saglik?.randevular || []).find(r => r.tarih === todayISO);
    const tomorrowApp = (store.saglik?.randevular || []).find(r => r.tarih === tomorrowISO);
    if (todayApp) {
      cards.push({
        id: 'saglik-today', icon: '🏥', text: `Bugün ${todayApp.kisi} randevusu`,
        subtext: `${todayApp.doktor} · ${todayApp.saat}`, type: 'critical', color: '#EF4444', module: '/saglik', priority: 95
      });
    } else if (tomorrowApp) {
      cards.push({
        id: 'saglik-tmrw', icon: '📋', text: `Yarın ${tomorrowApp.kisi} randevusu`,
        subtext: `${tomorrowApp.doktor} · ${tomorrowApp.saat}`, type: 'warning', color: '#F97316', module: '/saglik', priority: 80
      });
    }

    // ── 5. SAĞLIK: İlaç Stoğu ──
    const lowMeds = (store.saglik?.ilaclar || []).filter(i => i.stok <= i.minStok);
    if (lowMeds.length > 0) {
      cards.push({
        id: 'saglik-med', icon: '💊', text: `${lowMeds[0].ad} stoğu azalıyor`,
        subtext: `${lowMeds[0].kisi} · ${lowMeds[0].stok} adet kaldı`, type: 'critical', color: '#DC2626', module: '/saglik', priority: 90
      });
    }

    // ── 6. GARAJ: Belge Süreleri ──
    const vehicle = store.garaj?.find(v => v.id === store.selectedVehicleId) || store.garaj?.[0];
    if (vehicle) {
      const docs = vehicle.documents || [];
      docs.forEach(d => {
        const diff = daysDiff(d.dueDate);
        if (diff >= 0 && diff <= 45) {
          cards.push({
            id: `garaj-doc-${d.id}`, icon: '🚗', text: `${d.name} ${diff} güne bitiyor`,
            subtext: vehicle.model, type: diff <= 15 ? 'critical' : 'warning', color: '#334155', module: '/aracim', priority: diff <= 15 ? 92 : 70
          });
        }
      });

      // ── 7. GARAJ: Bakım Kontrolü ──
      const parts = vehicle.parts || [];
      parts.forEach(p => {
        const kmSince = (vehicle.km || 0) - (p.lastKM || 0);
        if (kmSince >= p.intervalKM * 0.9) {
          cards.push({
            id: `garaj-part-${p.id}`, icon: '🔧', text: `${p.name} bakımı gerekiyor`,
            subtext: `${kmSince.toLocaleString('tr-TR')} km oldu`, type: 'warning', color: '#475569', module: '/aracim', priority: 72
          });
        }
      });
    }

    // ── 8. FİNANS: Onay Bekleyen Harcamalar ──
    const pendingApprovals = (store.finans?.approvalPool || []).length;
    if (pendingApprovals > 0) {
      cards.push({
        id: 'finans-approval', icon: '💰', text: `${pendingApprovals} harcama onay bekliyor`,
        subtext: 'Finans modülünden kontrol et', type: 'info', color: '#7C3AED', module: '/finans', priority: 65
      });
    }

    // ── 9. EV: Yaklaşan Periyodik Bakım ──
    const bakimlar = store.ev?.bakimlar || [];
    bakimlar.forEach(b => {
      const lastDate = new Date(b.lastDate);
      const nextDate = new Date(lastDate.getTime() + b.intervalDays * 86400000);
      const daysLeft = Math.ceil((nextDate - today) / 86400000);
      if (daysLeft >= 0 && daysLeft <= 14) {
        cards.push({
          id: `ev-bakim-${b.id}`, icon: '🏠', text: `${b.name} ${daysLeft} gün içinde`,
          subtext: 'Periyodik bakım zamanı', type: daysLeft <= 3 ? 'critical' : 'warning', color: '#10B981', module: '/ev', priority: daysLeft <= 3 ? 88 : 62
        });
      }
    });

    // ── 10. EV: Aktif Onarım Görevleri ──
    const activeRepairs = (store.ev?.onarimListesi || []).filter(r => r.status === 'Pending' && !r.isArchived).length;
    if (activeRepairs > 0) {
      cards.push({
        id: 'ev-onarim', icon: '🔨', text: `${activeRepairs} onarım bekliyor`,
        subtext: 'Ev bakım listesinde', type: 'info', color: '#059669', module: '/ev', priority: 50
      });
    }

    // ── 11. SOSYAL: Bu Haftaki Aktiviteler ──
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndISO = weekEnd.toISOString().split('T')[0];
    const upcomingActs = (store.sosyal?.aktiviteler || []).filter(a => !a.tamamlandi && a.tarih >= todayISO && a.tarih <= weekEndISO);
    if (upcomingActs.length > 0) {
      cards.push({
        id: 'sosyal-week', icon: '🎯', text: `Bu hafta ${upcomingActs.length} aktivite var`,
        subtext: upcomingActs[0]?.baslik || 'Eğlenceli planlar!', type: 'info', color: '#DB2777', module: '/sosyal', priority: 58
      });
    }

    // ── 12. PET: Yaklaşan Aşılar ──
    if (store.pet?.vaccines) {
      Object.entries(store.pet.vaccines).forEach(([petId, vaccines]) => {
        (vaccines || []).forEach(v => {
          if (v.last && v.freq) {
            const parts = v.last.split('.');
            const lastVax = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            const nextVax = new Date(lastVax);
            nextVax.setMonth(nextVax.getMonth() + (v.freq || 12));
            const daysLeft = Math.ceil((nextVax - today) / 86400000);
            if (daysLeft >= 0 && daysLeft <= 30) {
              const petName = store.pet?.meta?.[petId]?.name || petId;
              cards.push({
                id: `pet-vax-${petId}-${v.n}`, icon: '🐾', text: `${petName} aşısı yaklaşıyor`,
                subtext: `${v.n} · ${daysLeft} gün kaldı`, type: 'warning', color: '#D97706', module: '/pet', priority: 68
              });
            }
          }
        });
      });
    }

    // ── 13. PET: Mama/Kum Durumu ──
    if (store.pet?.supplies) {
      Object.entries(store.pet.supplies).forEach(([petId, supply]) => {
        if (supply?.mama === 'azaldi' || supply?.kum === 'azaldi') {
          const petName = store.pet?.meta?.[petId]?.name || petId;
          const what = supply?.mama === 'azaldi' ? 'maması' : 'kumu';
          cards.push({
            id: `pet-supply-${petId}`, icon: '🐶', text: `${petName}'ın ${what} azalıyor`,
            subtext: 'Pet modülünden kontrol et', type: 'warning', color: '#F59E0B', module: '/pet', priority: 73
          });
        }
      });
    }

    // ── 14. HEDEFLER: Alışkanlık Streak'leri ──
    const habits = store.hedefler?.habits || [];
    const bestHabit = habits.reduce((max, h) => (h.streak > (max?.streak || 0) ? h : max), null);
    if (bestHabit && bestHabit.streak >= 3) {
      cards.push({
        id: 'hedef-streak', icon: '🔥', text: `${bestHabit.name}: ${bestHabit.streak} gün seri!`,
        subtext: 'Harika gidiyorsun, bırakma!', type: 'achievement', color: '#FBBF24', module: '/hedefler', priority: 52
      });
    }

    // ── 15. TATİL: Yaklaşan Gezi ──
    const upcomingTrip = (store.tatil?.trips || []).find(t => {
      const diff = daysDiff(t.startDate);
      return diff >= 0 && diff <= 60;
    });
    if (upcomingTrip) {
      const diff = daysDiff(upcomingTrip.startDate);
      cards.push({
        id: 'tatil-upcoming', icon: '✈️', text: `${upcomingTrip.title} · ${diff} gün kaldı!`,
        subtext: upcomingTrip.destination || 'Macera seni bekliyor', type: 'info', color: '#0891B2', module: '/tatil', priority: 56
      });
    }

    // ── 16. FİNANS: Hedef İlerlemesi ──
    const topGoal = (store.kasa?.kumbaralar || []).reduce((best, g) => {
      const pct = g.target > 0 ? (g.current / g.target) * 100 : 0;
      return pct > (best?.pct || 0) ? { ...g, pct } : best;
    }, null);
    if (topGoal && topGoal.pct > 0 && topGoal.pct < 100) {
      cards.push({
        id: 'kasa-goal', icon: '🎯', text: `${topGoal.name}: %${Math.round(topGoal.pct)}`,
        subtext: 'Hedefe emin adımlarla!', type: 'achievement', color: '#6D28D9', module: '/kasa', priority: 48
      });
    }

    // ── FALLBACK: Eğlenceli & Nazik Kartlar ──
    const funCards = [
      { id: 'fun-1', icon: '💖', text: `Güzel bir gün ${userName}!`, subtext: 'Her şey yolunda görünüyor', type: 'fun', color: '#EC4899', module: null, priority: 10 },
      { id: 'fun-2', icon: '🌟', text: 'Eraylar Hanem hazır!', subtext: 'Sevgiyle yüklendi, merak etme', type: 'fun', color: '#8B5CF6', module: null, priority: 8 },
      { id: 'fun-3', icon: '☕', text: 'Kahve molası zamanı mı?', subtext: 'Biraz mola da hak ediyorsun', type: 'fun', color: '#78350F', module: null, priority: 7 },
      { id: 'fun-4', icon: '🐶', text: 'Waffle kuyruk sallıyor!', subtext: 'Seni görünce çok mutlu', type: 'fun', color: '#D97706', module: '/pet', priority: 6 },
    ];

    // Always keep at least 2 cards
    const sorted = [...cards].sort((a, b) => b.priority - a.priority);
    if (sorted.length < 2) {
      const shuffled = funCards.sort(() => Math.random() - 0.5);
      sorted.push(...shuffled.slice(0, 3 - sorted.length));
    }

    return sorted.slice(0, 8); // Max 8 cards
  };

  // Initial AI analysis
  useEffect(() => {
    setInsights(getSmartInsights());
  }, []);

  // Track active card on scroll
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setActiveCardIdx(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [insights]);

  const handlePetClick = (pet) => {
    const quotes = PET_QUOTES[pet];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    toast(randomQuote, { icon: pet === 'waffle' ? '🐶' : '🐱' });
  };

  useEffect(() => {
    calculateGlobalScore();
  }, [calculateGlobalScore]);

  // Daily Wellness Trigger
  useEffect(() => {
    if (!currentUser) return;
    
    const today = new Date().toDateString();
    const userName = currentUser.name.toLowerCase().includes('esra') ? 'esra' : 'gorkem';
    const moods = saglik?.moods || [];
    
    const hasEnteredToday = moods.some(m => 
      m.user === userName && new Date(m.date).toDateString() === today
    );
    
    if (!hasEnteredToday) {
      const timer = setTimeout(() => setShowMoodCheck(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [saglik?.moods, currentUser]);

  const handleMoodSubmit = () => {
    if (!selectedMood) return;
    const userName = currentUser.name.toLowerCase().includes('esra') ? 'esra' : 'gorkem';
    addMood(userName, selectedMood, '', 'Günlük');
    setShowMoodCheck(false);
    toast.success('Günün ilk wellness kaydı yapıldı! ✨', {
      icon: '💖',
      style: { borderRadius: '15px', background: '#2E1065', color: '#fff' }
    });
  };

  // Memoized Modules - Stabilizes the grid
  const modules = useMemo(() => {
    // 11th Personalized Module
    let personalizedModule = null;
    if (currentUser?.name === 'Esra') {
      personalizedModule = { 
        id: 'modaring', 
        name: 'Eraylar Modaring', 
        sub: 'Esra\'nın Dünyası', 
        icon: '✨', 
        color: 'linear-gradient(180deg, #FB7185 0%, #E11D48 100%)', 
        path: '/modaring' 
      };
    } else if (currentUser?.name === 'Görkem') {
      personalizedModule = { 
        id: 'muhendislik', 
        name: 'Eraylar Mühendislik', 
        sub: 'Görkem\'in Atölyesi', 
        icon: '⚙️', 
        color: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)', 
        path: '/muhendislik' 
      };
    }

    const baseModules = [
      { id: 'mutfak', name: 'Eraylar Mutfak', sub: 'Yemek & Alışveriş', icon: '🍲', color: 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)', path: '/mutfak' },
      { id: 'sosyal', name: 'Eraylar Sosyal', sub: 'Aktivite & Rutin', icon: '🎯', color: 'linear-gradient(180deg, #DB2777 0%, #C026D3 100%)', path: '/sosyal' },
      { id: 'alisveris', name: 'Eraylar Alışveriş', sub: 'Market & Liste', icon: '🛍️', color: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)', path: '/alisveris' },
      { id: 'tatil', name: 'Eraylar Tatil', sub: 'Gezi Planlayıcı', icon: '✈️', color: 'linear-gradient(180deg, #06B6D4 0%, #0891B2 100%)', path: '/tatil' },
      { id: 'pet', name: 'Eraylar Pet', sub: 'Waffle & Mayıs', icon: '🐾', color: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)', path: '/pet' },
      { id: 'health', name: 'Eraylar Sağlık', sub: 'İlaç & Ölçüm', icon: '🏥', color: 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)', path: '/saglik' },
      { id: 'ev', name: 'Eraylar Ev', sub: 'Home Hub', icon: '🏠', color: 'linear-gradient(180deg, #10B981 0%, #059669 100%)', path: '/ev' },
      { id: 'aracim', name: 'Eraylar Garajım', sub: activeVehicle?.model || 'Garaj Yönetimi', icon: '🏢', color: 'linear-gradient(180deg, #334155 0%, #0F172A 100%)', path: '/aracim' },
      { id: 'kasa', name: 'Eraylar Kasa', sub: 'Wealth Vault', icon: '🏦', color: 'linear-gradient(180deg, #7C3AED 0%, #6D28D9 100%)', path: '/kasa' },
      { id: 'finans', name: 'Eraylar Finans', sub: 'Wealth Hub', icon: '💰', color: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)', path: '/finans' },
    ];

    if (personalizedModule) baseModules.push(personalizedModule);
    
    // 12. Modül: Hedefler (Her zaman sağda kalsın diye en sona ekliyoruz)
    baseModules.push({ id: 'hedefler', name: 'Eraylar Hedefler', sub: 'Vision Hub', icon: '🏆', color: 'linear-gradient(180deg, #FBBF24 0%, #D97706 100%)', path: '/hedefler' });

    return baseModules;
  }, [activeVehicle, currentUser]);

  return (
    <AnimatedPage className="home-premium-container">
      {/* Premium Header Banner */}
      <div className="premium-header-banner">
        <div className="phb-content">
          <div className="phb-user-area">
            <div className="phb-avatar" onClick={() => navigate('/profil')}>
              <span className={`supabase-status-dot ${isOnline ? 'online' : 'offline'}`}></span>
              {currentUser?.emoji || '👨‍💻'}
            </div>
            <div className="phb-text">
              <div className="phb-brand">
                <img src={logo} alt="Logo" className="phb-logo-img" />
                <h2>Eraylar Hanem</h2>
                <div className="phb-header-pets">
                  <span className="pet-link" onClick={() => handlePetClick('waffle')}>🐶</span> 
                  <span className="pet-link" onClick={() => handlePetClick('mayis')}>🐈</span>
                </div>
              </div>
            </div>
          </div>
          <div className="phb-actions">
             <button className="phb-icon-btn" onClick={() => setShowLogs(true)}><HistoryIcon size={20} /></button>
             <button className="phb-icon-btn" onClick={() => navigate('/ayarlar')}><Settings size={20} /></button>
          </div>
        </div>
      </div>

      <div className="home-scroll-area">
        {/* AI Assistant Section */}
        <div className="ai-section-premium">
          <div className="ai-header-row">
            <span>✨ AKILLI AİLE ASİSTANI</span>
            <span className="ai-card-counter">{activeCardIdx + 1}/{insights.length}</span>
          </div>
          <div className="ai-carousel" ref={carouselRef}>
            {insights.map((card) => (
              <div 
                key={card.id}
                className={`ai-insight-card ${card.type}`}
                style={{ '--card-accent': card.color, '--card-bg': card.bg || card.color }}
                onClick={() => card.module && navigate(card.module)}
              >
                <div className="aic-left">
                  <div className="aic-icon">{card.icon}</div>
                </div>
                <div className="aic-content">
                  <strong>{card.text}</strong>
                  <span>{card.subtext}</span>
                </div>
                {card.module && <ChevronRight size={18} className="aic-arrow" />}
              </div>
            ))}
          </div>
          {insights.length > 1 && (
            <div className="ai-dots">
              {insights.map((_, i) => (
                <div key={i} className={`ai-dot ${i === activeCardIdx ? 'active' : ''}`} />
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Module Grid */}
        <div className="premium-module-grid">
          {modules.map((module, idx) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
              className={`premium-module-card ${module.fullWidth ? 'full-width' : ''}`}
              onClick={() => navigate(module.path)}
              style={{ background: module.color }}
            >
              <div className="pmc-icon-wrap">
                <span className="pmc-emoji">{module.icon}</span>
              </div>
              <div className="pmc-info">
                <h3>{module.name}</h3>
                <p>{module.sub}</p>
              </div>
              <div className="pmc-arrow">
                <ChevronRight size={18} />
              </div>
            </motion.div>
          ))}
        </div>
        
        <div style={{ height: '80px' }} />
      </div>

      {/* Modals & Portals (Logs, Mood Check etc.) */}
      <AnimatePresence>
        {showLogs && (
          <Portal>
            <div className="modal-overlay" onClick={() => setShowLogs(false)}>
              <div className="logs-modal-v2 glass animate-slideUp" onClick={e => e.stopPropagation()}>
                 <div className="modal-header logs-header">
                   <h3><HistoryIcon size={20} /> Sistem Hareketleri</h3>
                   <button className="modal-close-btn" onClick={() => setShowLogs(false)}><X size={20} /></button>
                 </div>
                 <div className="logs-list-premium">
                    {logs.slice().reverse().slice(0, 50).map((log, i) => (
                      <div key={log.id || i} className="log-row-premium">
                         <div className="log-icon-circle">📝</div>
                         <div className="log-info-main">
                            <strong>{log.action}</strong>
                            <p>{log.detail}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </Portal>
        )}

        {showMoodCheck && (
          <Portal>
            <div className="modal-overlay wellness-check" onClick={() => setShowMoodCheck(false)}>
              <motion.div 
                className="mood-check-card glass animate-slideUp"
                onClick={e => e.stopPropagation()}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
              >
                <div className="mcc-header">
                  <div className="mcc-icon-box">
                    <Heart size={24} color="#EC4899" fill="#EC4899" />
                  </div>
                  <h3>Bugün Nasıl Hissediyorsun?</h3>
                  <p>Eraylar Wellness asistanı gününü merak ediyor ✨</p>
                </div>

                <div className="mcc-grid">
                  {MOODS.map(m => (
                    <button 
                      key={m.id}
                      className={`mcc-btn ${selectedMood?.id === m.id ? 'active' : ''}`}
                      onClick={() => setSelectedMood(m)}
                      style={{ '--mood-color': m.color }}
                    >
                      <span className="mcc-emoji">{m.emoji}</span>
                      <span className="mcc-label">{m.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mcc-actions">
                  <button className="mcc-skip" onClick={() => setShowMoodCheck(false)}>Daha Sonra</button>
                  <button 
                    className="mcc-submit" 
                    disabled={!selectedMood}
                    onClick={handleMoodSubmit}
                  >
                    Harika Görünüyor
                  </button>
                </div>
              </motion.div>
            </div>
          </Portal>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default Home;