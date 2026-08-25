import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, RefreshCcw, Settings, ChevronRight, Heart } from 'lucide-react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import logo from '../assets/eraylar-logo.png';
import Portal from '../components/Portal';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
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

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const getStartMonth = (g) => {
  if (g.yearlyPlan?.startDate) {
    const start = new Date(g.yearlyPlan.startDate);
    if (!isNaN(start.getTime())) {
      const monthName = TURKISH_MONTHS[start.getMonth()];
      const year = start.getFullYear();
      return `${monthName} ${year}`;
    }
  }

  if (!g.targetDate) return null;
  const target = new Date(g.targetDate);
  if (isNaN(target.getTime())) return null;

  const dur = parseInt(g.duration, 10);
  if (isNaN(dur) || dur <= 0) return null;

  const start = new Date(target.getTime());
  start.setMonth(start.getMonth() - dur);

  const monthName = TURKISH_MONTHS[start.getMonth()];
  const year = start.getFullYear();
  return `${monthName} ${year}`;
};

const getRemainingMonths = (g) => {
  if (!g.targetDate) return null;
  const target = new Date(g.targetDate);
  if (isNaN(target.getTime())) return null;

  const now = new Date();
  
  // Determine start date
  let start = null;
  if (g.yearlyPlan?.startDate) {
    start = new Date(g.yearlyPlan.startDate);
  } else if (g.duration) {
    const dur = parseInt(g.duration, 10);
    if (!isNaN(dur) && dur > 0) {
      start = new Date(target.getTime());
      start.setMonth(start.getMonth() - dur);
    }
  }

  const diffTime = target.getTime() - now.getTime();
  if (diffTime <= 0) {
    return {
      text: 'Süresi Doldu! 🚨',
      class: 'urgent'
    };
  }

  // Cap countdown if today is before the start date
  let calculationDate = now;
  if (start && now < start) {
    calculationDate = start;
  }

  const diffYears = target.getFullYear() - calculationDate.getFullYear();
  const diffMonths = target.getMonth() - calculationDate.getMonth();
  const totalMonths = diffYears * 12 + diffMonths;

  if (totalMonths <= 0) {
    const activeDiffTime = target.getTime() - calculationDate.getTime();
    const diffDays = Math.ceil(activeDiffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
      return { text: 'Süresi Doldu! 🚨', class: 'urgent' };
    }
    return {
      text: `${diffDays} Gün Kaldı ⏳`,
      class: 'urgent'
    };
  }

  if (totalMonths === 1) {
    const activeDiffTime = target.getTime() - calculationDate.getTime();
    const diffDays = Math.ceil(activeDiffTime / (1000 * 60 * 60 * 24));
    return {
      text: `${diffDays} Gün Kaldı ⏳`,
      class: 'urgent'
    };
  }

  let colorClass = 'safe';
  if (totalMonths <= 2) {
    colorClass = 'urgent';
  } else if (totalMonths <= 5) {
    colorClass = 'warning';
  }

  return {
    text: `${totalMonths} Ay Kaldı ⏳`,
    class: colorClass
  };
};

const isGoalVisible = (g, currentUser) => {
  const owner = (g.owner || 'ortak').toLowerCase().trim();
  if (owner === 'ortak' || owner === 'aile' || owner === 'hepsi') {
    return true;
  }
  const currentUserName = (currentUser?.name || '').toLowerCase().trim();
  const creator = (g.createdBy || '').toLowerCase().trim();
  
  const matchUser = (nameStr, userStr) => {
    const normalize = (s) => s.replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
    return normalize(nameStr) === normalize(userStr);
  };
  
  if (matchUser(owner, currentUserName)) {
    return true;
  }
  if (matchUser(creator, currentUserName)) {
    return true;
  }
  return false;
};

const getGoalVisualMeta = (title, daysLeft) => {
  const t = title.toLowerCase();
  let icon = '🎯';
  if (t.includes('alman') || t.includes('deutsch') || t.includes('ingilizce') || t.includes('dil') || t.includes('kurs')) {
    icon = '📚';
  } else if (t.includes('ev') || t.includes('villa') || t.includes('arsa') || t.includes('konut') || t.includes('daire') || t.includes('tiny') || t.includes('sile') || t.includes('şile')) {
    icon = '🏡';
  }

  // Choose premium gradients based on urgency
  let color = 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)'; // Amber/Orange warning
  if (daysLeft <= 3) {
    color = 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)'; // Rose/Red urgent
  } else if (daysLeft > 7) {
    color = 'linear-gradient(135deg, #10B981 0%, #059669 100%)'; // Emerald calm
  }

  return { icon, color };
};

const Home = () => {
  // Selective Selectors for Performance
  const currentUser = useStore(state => state.currentUser);
  const system = useStore(state => state.system) || {};
  const { achievements = [], weeklyReports = [], version = '2.31.0', globalScore = 0 } = system;
  const saglik = useStore(state => state.saglik);
  const garaj = useStore(state => state.garaj);
  const logs = useStore(state => state.logs) || [];
  const addMood = useStore(state => state.addMood);
  const selectedVehicleId = useStore(state => state.selectedVehicleId);
  const calculateGlobalScore = useStore(state => state.calculateGlobalScore);
  const hedefler = useStore(state => state.hedefler) || {};
  const kasa = useStore(state => state.kasa) || {};

  const activeVisionAndMoneyGoals = useMemo(() => {
    const goalsList = hedefler.goals || [];
    const moneyList = kasa.kumbaralar || [];
    
    const combined = [
      ...goalsList.map(g => ({ ...g, type: 'vision' })),
      ...moneyList.map(g => ({ 
        ...g, 
        type: 'money', 
        title: g.name, 
        targetDate: g.deadline,
        owner: g.owner || 'ortak'
      }))
    ];
    
    const visible = combined.filter(g => isGoalVisible(g, currentUser));
    
    return visible.filter(g => {
      const current = parseFloat(g.current) || 0;
      const target = parseFloat(g.target) || 1;
      return current < target;
    });
  }, [hedefler.goals, kasa.kumbaralar, currentUser]);
  
  const isOnline = system?.isOnline ?? true;
  const navigate = useNavigate();

  const activeVehicle = useMemo(() => 
    garaj?.find(v => v.id === selectedVehicleId) || garaj?.[0], 
    [garaj, selectedVehicleId]
  );
  
  const [insights, setInsights] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirm, setShowConfirm] = useState({ open: false, message: '', onConfirm: () => {} });
  const [debugClicks, setDebugClicks] = useState(0);
  const [debugMode, setDebugMode] = useState(localStorage.getItem('debug_mode') === 'true');
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const carouselRef = React.useRef(null);

  const handleTitleClick = () => {
    const newClicks = debugClicks + 1;
    setDebugClicks(newClicks);
    if (newClicks >= 5) {
      const newMode = !debugMode;
      setDebugMode(newMode);
      localStorage.setItem('debug_mode', newMode ? 'true' : 'false');
      setDebugClicks(0);
      toast(newMode ? '🐞 Debug Modu Aktif!' : '🐞 Debug Modu Kapatıldı.');
    }
  };

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

    // Aggregate by name to prevent false "low stock" alerts for items in multiple locations
    const aggregatedStock = allStock.reduce((acc, item) => {
      const name = item.n.trim();
      if (!acc[name]) {
        acc[name] = { ...item, cr: 0, mn: item.mn };
      }
      acc[name].cr += item.cr;
      acc[name].mn = Math.max(acc[name].mn, item.mn); // Take the highest min threshold
      return acc;
    }, {});

    const lowStock = Object.values(aggregatedStock).filter(i => i.mn > 0 && i.cr <= i.mn);
    if (lowStock.length > 0) {
      const names = lowStock.slice(0, 3).map(i => i.n).join(', ');
      cards.push({
        id: 'mutfak-low', icon: '🍲', text: `${lowStock.length} ürün azalmış`,
        subtext: names, type: 'warning', color: 'var(--mutfak)', module: '/mutfak', priority: 85
      });
    }

    // ── 2. MUTFAK: Bugünün Menüsü ──
    const todayMenu = store.mutfak?.menu?.[todayISO];
    if (todayMenu?.a || todayMenu?.k) {
      const meal = todayMenu.a || todayMenu.k;
      cards.push({
        id: 'mutfak-menu', icon: '🍽️', text: 'Bugünün menüsü hazır!',
        subtext: meal, type: 'info', color: 'var(--mutfak)', module: '/mutfak', priority: 60
      });
    }

    // ── 3. MUTFAK: Alışveriş Listesi ──
    const shopCount = (store.mutfak?.alisveris || []).filter(i => !i.dn).length;
    if (shopCount > 0) {
      cards.push({
        id: 'mutfak-shop', icon: '🛒', text: `${shopCount} ürün alışverişte`,
        subtext: 'Markete uğramayı unutma!', type: 'info', color: 'var(--alisveris)', module: '/mutfak', priority: 55
      });
    }

    // ── 4. SAĞLIK: Bugün/Yarın Randevu ──
    const todayApp = (store.saglik?.randevular || []).find(r => r.tarih === todayISO);
    const tomorrowApp = (store.saglik?.randevular || []).find(r => r.tarih === tomorrowISO);
    if (todayApp) {
      cards.push({
        id: 'saglik-today', icon: '🏥', text: `Bugün ${todayApp.kisi} randevusu`,
        subtext: `${todayApp.doktor} · ${todayApp.saat}`, type: 'critical', color: 'var(--saglik)', module: '/saglik', priority: 95
      });
    } else if (tomorrowApp) {
      cards.push({
        id: 'saglik-tmrw', icon: '📋', text: `Yarın ${tomorrowApp.kisi} randevusu`,
        subtext: `${tomorrowApp.doktor} · ${tomorrowApp.saat}`, type: 'warning', color: 'var(--saglik)', module: '/saglik', priority: 80
      });
    }

    // ── 5. SAĞLIK: İlaç Stoğu ──
    const lowMeds = (store.saglik?.ilaclar || []).filter(i => i.stok !== -1 && i.stok <= i.minStok);
    if (lowMeds.length > 0) {
      cards.push({
        id: 'saglik-med', icon: '💊', text: `${lowMeds[0].ad} stoğu azalıyor`,
        subtext: `${lowMeds[0].kisi} · ${lowMeds[0].stok} adet kaldı`, type: 'critical', color: 'var(--saglik)', module: '/saglik', priority: 90
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
            subtext: vehicle.model, type: diff <= 15 ? 'critical' : 'warning', color: 'var(--aracim)', module: '/aracim', priority: diff <= 15 ? 92 : 70
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
            subtext: `${kmSince.toLocaleString('tr-TR')} km oldu`, type: 'warning', color: 'var(--aracim)', module: '/aracim', priority: 72
          });
        }
      });
    }

    // ── 8. FİNANS: Onay Bekleyen Harcamalar ──
    const pendingApprovals = (store.finans?.approvalPool || []).length;
    if (pendingApprovals > 0) {
      cards.push({
        id: 'finans-approval', icon: '💰', text: `${pendingApprovals} harcama onay bekliyor`,
        subtext: 'Finans modülünden kontrol et', type: 'info', color: 'var(--finans)', module: '/finans', priority: 65
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
          subtext: 'Periyodik bakım zamanı', type: daysLeft <= 3 ? 'critical' : 'warning', color: 'var(--ev)', module: '/ev', priority: daysLeft <= 3 ? 88 : 62
        });
      }
    });

    // ── 10. EV: Yaklaşan Onarım Görevleri (Akıllı Asistan) ──
    const onarimList = store.ev?.onarimListesi || [];
    let hasSmartOnarim = false;
    
    onarimList.filter(item => item.status === 'Pending' && !item.isArchived && item.dueDate).forEach(item => {
      const created = item.createdAt ? new Date(item.createdAt) : new Date();
      const due = new Date(item.dueDate);
      const now = new Date();
      
      const totalTimeMs = due - created;
      const remainingTimeMs = due - now;
      
      if (totalTimeMs <= 0) return; // invalid dates
      
      const totalDays = totalTimeMs / (1000 * 60 * 60 * 24);
      const remainingHours = remainingTimeMs / (1000 * 60 * 60);
      const remainingDays = remainingHours / 24;
      
      let shouldAlert = false;
      let urgencyText = '';
      let priority = 50;
      let type = 'info';
      
      if (remainingTimeMs <= 0) {
        shouldAlert = true;
        urgencyText = 'Süresi doldu! 🚨';
        priority = 98;
        type = 'critical';
      } else {
        // Warning Tiers based on duration (totalDays)
        if (totalDays >= 15) {
          // Long term (e.g. 1 month): warn if <= 7 days left (1 week)
          if (remainingDays <= 7) {
            shouldAlert = true;
            urgencyText = `${Math.ceil(remainingDays)} gün kaldı`;
            priority = remainingDays <= 2 ? 94 : 80;
            type = remainingDays <= 2 ? 'critical' : 'warning';
          }
        } else if (totalDays >= 7) {
          // Mid term (e.g. 1-2 weeks): warn if <= 3 days left
          if (remainingDays <= 3) {
            shouldAlert = true;
            urgencyText = `${Math.ceil(remainingDays)} gün kaldı`;
            priority = remainingDays <= 1 ? 93 : 78;
            type = remainingDays <= 1 ? 'critical' : 'warning';
          }
        } else if (totalDays >= 1) {
          // Short term (e.g. 1-6 days): warn if <= 24 hours left
          if (remainingDays <= 1) {
            shouldAlert = true;
            const hoursLeft = Math.ceil(remainingHours);
            urgencyText = hoursLeft <= 1 ? `${Math.ceil(remainingHours * 60)} dk kaldı` : `${hoursLeft} saat kaldı`;
            priority = hoursLeft <= 5 ? 95 : 82;
            type = hoursLeft <= 5 ? 'critical' : 'warning';
          }
        } else {
          // Immediate (e.g. < 1 day total): warn if <= 5 hours left
          if (remainingHours <= 5) {
            shouldAlert = true;
            const hoursLeft = Math.ceil(remainingHours);
            urgencyText = hoursLeft <= 1 ? `${Math.ceil(remainingHours * 60)} dk kaldı` : `${hoursLeft} saat kaldı`;
            priority = 96;
            type = 'critical';
          }
        }
      }
      
      if (shouldAlert) {
        hasSmartOnarim = true;
        const assignedName = item.assignedTo ? (store.users?.[item.assignedTo]?.name || item.assignedTo).split(' ')[0] : 'Herkes';
        cards.push({
          id: `ev-onarim-smart-${item.id}`,
          icon: '🔨',
          text: `${item.task.substring(0, 30)}${item.task.length > 30 ? '...' : ''}`,
          subtext: `Sorumlu: ${assignedName} · ${urgencyText}`,
          type,
          color: 'var(--ev)',
          module: '/ev',
          priority
        });
      }
    });

    // Fallback: If no smart alert is active, but there are pending repairs
    const activeRepairs = onarimList.filter(r => r.status === 'Pending' && !r.isArchived).length;
    if (activeRepairs > 0 && !hasSmartOnarim) {
      cards.push({
        id: 'ev-onarim', icon: '🔨', text: `${activeRepairs} onarım bekliyor`,
        subtext: 'Ev bakım listesinde', type: 'info', color: 'var(--ev)', module: '/ev', priority: 50
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
        subtext: upcomingActs[0]?.baslik || 'Eğlenceli planlar!', type: 'info', color: 'var(--social)', module: '/sosyal', priority: 58
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
                subtext: `${v.n} · ${daysLeft} gün kaldı`, type: 'warning', color: 'var(--pet)', module: '/pet', priority: 68
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
            subtext: 'Pet modülünden kontrol et', type: 'warning', color: 'var(--pet)', module: '/pet', priority: 73
          });
        }
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
        subtext: upcomingTrip.destination || 'Macera seni bekliyor', type: 'info', color: 'var(--tatil)', module: '/tatil', priority: 56
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
        subtext: 'Hedefe emin adımlarla!', type: 'achievement', color: 'var(--kasa)', module: '/kasa', priority: 48
      });
    }

    // ── 17. HEDEFLER: Akıllı Asistan Reminders ──
    const goalsList = store.hedefler?.goals || [];
    const moneyList = store.kasa?.kumbaralar || [];
    const combinedGoals = [
      ...goalsList.map(g => ({ ...g, type: 'vision' })),
      ...moneyList.map(g => ({ 
        ...g, 
        type: 'money', 
        title: g.name, 
        targetDate: g.deadline,
        owner: g.owner || 'ortak'
      }))
    ].filter(g => isGoalVisible(g, currentUser));

    combinedGoals.forEach(g => {
      const perc = (g.current / g.target) * 100;
      if (perc >= 100) return;

      if (!g.targetDate) return;
      const target = new Date(g.targetDate);
      if (isNaN(target.getTime())) return;

      // Resolve start date
      let start = null;
      if (g.yearlyPlan?.startDate) {
        start = new Date(g.yearlyPlan.startDate);
      } else if (g.duration) {
        const dur = parseInt(g.duration, 10);
        if (!isNaN(dur) && dur > 0) {
          start = new Date(target.getTime());
          start.setMonth(start.getMonth() - dur);
        }
      }

      if (!start || isNaN(start.getTime())) return;

      const duration = parseInt(g.duration, 10) || 12;
      const isLongTerm = duration > 12;

      // s1 is length of stage 1 in months
      const s1 = Math.ceil(duration / 3);

      // milestoneEndDate = start + s1 months
      const milestoneEndDate = new Date(start.getTime());
      milestoneEndDate.setMonth(milestoneEndDate.getMonth() + s1);

      // Compare milestoneEndDate to today
      const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const milestoneClean = new Date(milestoneEndDate.getFullYear(), milestoneEndDate.getMonth(), milestoneEndDate.getDate());

      const diffTime = milestoneClean.getTime() - todayClean.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Let's check matching conditions
      let shouldShow = false;
      let text = '';
      let subtext = '';
      let priority = 90;
      let type = 'warning';

      const ownerName = g.owner === 'ortak' ? 'Ortak' : (g.owner === 'esra' ? 'Esra' : 'Görkem');
      const daysText = daysLeft === 0 ? 'bugün son gün!' : `${daysLeft} gün kaldı.`;

      if (!isLongTerm) {
        // Short-term goal rules: last 1 week daily
        if (daysLeft >= 0 && daysLeft <= 7) {
          shouldShow = true;
          text = `${g.title} hedefin için 1. aşamanın bitmesine ${daysText}`;
          subtext = `Ne durumdasın? 🎯 · Sorumlu: ${ownerName}`;
          priority = daysLeft <= 3 ? 94 : 91;
          type = daysLeft <= 3 ? 'critical' : 'warning';
        }
      } else {
        // Long-term goal rules: 1 month before (28-30 days left) OR last week daily (0-7 days left)
        if (daysLeft >= 28 && daysLeft <= 30) {
          shouldShow = true;
          text = `${g.title} hedefin için 1. yıl aşamasının bitmesine ${daysLeft} gün kaldı.`;
          subtext = `Yaptın mı? 🏡 · Sorumlu: ${ownerName}`;
          priority = 90;
          type = 'warning';
        } else if (daysLeft >= 0 && daysLeft <= 7) {
          shouldShow = true;
          text = `${g.title} hedefin için 1. yıl aşamasının bitmesine ${daysText}`;
          subtext = `Yaptın mı? 🏡 · Sorumlu: ${ownerName}`;
          priority = daysLeft <= 3 ? 95 : 92;
          type = daysLeft <= 3 ? 'critical' : 'warning';
        }
      }

      if (shouldShow) {
        // Resolve custom visual metadata (icon & color gradient)
        const visual = getGoalVisualMeta(g.title, daysLeft);

        cards.push({
          id: `hedef-smart-${g.id}`,
          icon: visual.icon,
          text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
          subtext: subtext,
          type: type,
          color: visual.color,
          module: '/hedefler',
          priority: priority
        });
      }
    });

    // ── FALLBACK: Eğlenceli & Nazik Kartlar ──
    const funCards = [
      { id: 'fun-1', icon: '💖', text: `Güzel bir gün ${userName}!`, subtext: 'Her şey yolunda görünüyor', type: 'fun', color: 'var(--primary)', module: null, priority: 10 },
      { id: 'fun-2', icon: '🌟', text: 'Eraylar Hanem hazır!', subtext: 'Sevgiyle yüklendi, merak etme', type: 'fun', color: '#8B5CF6', module: null, priority: 8 },
      { id: 'fun-3', icon: '☕', text: 'Kahve molası zamanı mı?', subtext: 'Biraz mola da hak ediyorsun', type: 'fun', color: '#78350F', module: null, priority: 7 },
      { id: 'fun-4', icon: '🐶', text: 'Waffle kuyruk sallıyor!', subtext: 'Seni görünce çok mutlu', type: 'fun', color: 'var(--pet)', module: '/pet', priority: 6 },
    ];

    // Always keep at least 2 cards
    const sorted = [...cards].sort((a, b) => b.priority - a.priority);
    // Guest filters out financial details
    const filtered = currentUser?.name === 'Misafir'
      ? sorted.filter(c => c.module !== '/finans' && c.module !== '/kasa' && c.module !== '/hedefler')
      : sorted;
    if (filtered.length < 2) {
      const shuffled = funCards.sort(() => Math.random() - 0.5);
      filtered.push(...shuffled.slice(0, 3 - filtered.length));
    }

    return filtered.slice(0, 8); // Max 8 cards
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
  const syncing = useStore(state => state.syncing);

  useEffect(() => {
    if (!currentUser || syncing) return;
    
    const today = new Date().toDateString();
    const userName = currentUser.name.toLowerCase().includes('esra') ? 'esra' : 'gorkem';
    const moods = saglik?.moods || [];
    
    const hasEnteredToday = moods.some(m => 
      m.user === userName && new Date(m.date).toDateString() === today
    );
    
    if (!hasEnteredToday) {
      const timer = setTimeout(() => setShowMoodCheck(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowMoodCheck(false);
    }
  }, [saglik?.moods, currentUser, syncing]);

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
    const modaringModule = { 
      id: 'modaring', 
      name: 'Eraylar Modaring', 
      sub: 'Esra\'nın Dünyası', 
      icon: '✨', 
      color: 'linear-gradient(180deg, #FB7185 0%, #E11D48 100%)', 
      path: '/modaring' 
    };

    const muhendislikModule = { 
      id: 'muhendislik', 
      name: 'Eraylar Teknik', 
      sub: 'Görkem\'in Atölyesi', 
      icon: '⚙️', 
      color: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)', 
      path: '/muhendislik' 
    };

    const baseModules = [
      { id: 'mutfak', name: 'Eraylar Mutfak', sub: 'Yemek & Alışveriş', icon: '🍲', color: 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)', path: '/mutfak' },
      { id: 'sosyal', name: 'Eraylar Sosyal', sub: 'Aktivite & Rutin', icon: '🎯', color: 'linear-gradient(180deg, #DB2777 0%, #C026D3 100%)', path: '/sosyal' },
      { id: 'alisveris', name: 'Eraylar Alışveriş', sub: 'Market & Liste', icon: '🛍️', color: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)', path: '/alisveris' },
      { id: 'tatil', name: 'Eraylar Tatil', sub: 'Gezi Planlayıcı', icon: '✈️', color: 'linear-gradient(180deg, #06B6D4 0%, #0891B2 100%)', path: '/tatil' },
      { id: 'pet', name: 'Eraylar Pet', sub: 'Waffle & Mayıs', icon: '🐾', color: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)', path: '/pet' },
      { id: 'health', name: 'Eraylar Sağlık', sub: 'İlaç & Ölçüm', icon: '🏥', color: 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)', path: '/saglik' },
      { id: 'ev', name: 'Eraylar Ev', sub: 'Home Hub', icon: '🏠', color: 'linear-gradient(180deg, #10B981 0%, #059669 100%)', path: '/ev' },
      { id: 'aracim', name: 'Eraylar Garajım', sub: activeVehicle?.model || 'Garaj Yönetimi', icon: '🏢', color: 'linear-gradient(180deg, #334155 0%, #0F172A 100%)', path: '/aracim' },
    ];

    if (currentUser?.name !== 'Misafir') {
      baseModules.push(
        { id: 'kasa', name: 'Eraylar Kasa', sub: 'Wealth Vault', icon: '🏦', color: 'linear-gradient(180deg, #7C3AED 0%, #6D28D9 100%)', path: '/kasa' },
        { id: 'finans', name: 'Eraylar Finans', sub: 'Wealth Hub', icon: '💰', color: 'linear-gradient(180deg, #064e3b 0%, #059669 100%)', path: '/finans' }
      );
    }

    if (currentUser?.name === 'Esra') {
      baseModules.push(modaringModule);
    } else if (currentUser?.name === 'Görkem') {
      baseModules.push(muhendislikModule);
    } else if (currentUser?.name === 'Misafir') {
      baseModules.push(modaringModule, muhendislikModule);
    }
    
    // 12. Modül: Hedefler (Her zaman sağda kalsın diye en sona ekliyoruz)
    if (currentUser?.name !== 'Misafir') {
      baseModules.push({ id: 'hedefler', name: 'Eraylar Hedefler', sub: 'Vision Hub', icon: '🏆', color: 'linear-gradient(180deg, #FBBF24 0%, #D97706 100%)', path: '/hedefler' });
    }

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
              <div className="phb-brand" onClick={handleTitleClick}>
                <div className="phb-brand-main">
                  <img src={logo} alt="Logo" className="phb-logo-img" />
                  <div className="phb-brand-text">
                    <h2>Eraylar Hanem</h2>
                  </div>
                </div>
                <div className="phb-header-pets">
                  <span className="pet-link" onClick={(e) => { e.stopPropagation(); handlePetClick('waffle'); }}>🐶</span> 
                  <span className="pet-link" onClick={(e) => { e.stopPropagation(); handlePetClick('mayis'); }}>🐈</span>
                </div>
              </div>
            </div>
          </div>
          <div className="phb-actions">
            <button className="phb-icon-btn" onClick={() => navigate('/ayarlar')} title="Ayarlar"><Settings size={20} /></button>
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