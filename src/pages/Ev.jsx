import React, { useState, useMemo, useEffect } from 'react';
import { 
  Lightbulb, Wrench, ShieldCheck, 
  CheckCircle2, Plus, Trash2, Edit2, 
  AlertTriangle, DollarSign, Calendar, Sparkles, Clock,
  Droplets, Zap, Flame, Globe, ChevronRight, ChevronDown,
  Shield, Key, Phone, User, Star, MoreVertical,
  PlusCircle, ArrowLeft, Camera, Settings, Info,
  Building, FileText, Landmark, Home, MapPin, Map as MapIcon, Package, RotateCcw, Wallet, ArrowRight, Search, AlertCircle, ShoppingCart, ShoppingBasket, ShoppingBag, Eye, EyeOff, QrCode, X,
  Book, Lock, Unlock, MousePointer2, Stamp as StampIcon, Activity, CreditCard
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ActionSheet from '../components/ActionSheet';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { generateYektaAdvice } from '../lib/yektaEngine';
import { synthesizeCharacter } from '../lib/synthesisEngine';
import LocationModal from '../components/LocationModal';
import './Ev.css';
import PaymentSelector from '../components/PaymentSelector';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const formatMoney = (val) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);

const YEKTA_QUOTES = [
  "Ben olmak o kadar zor ki...",
  "Koskoca Yekta Tilmen'i kim bekletebilir ki?",
  "Unutmayın ki Yekta Tilmen'e hiçbir şey olmaz.",
  "Yekta Tilmen sarsılır ama yıkılmaz.",
  "Yekta Tilmen her zaman kazanır!",
  "Benim saniyem para be, saniyem!",
  "Yekta Tilmen'in çıkarları söz konusuysa sınır yoktur.",
  "Yekta Tilmen'in forsunu kimse zedeleyemez.",
  "Yekta Tilmen'den tam puan almak kolay değil.",
  "Yekta Tilmen olmak gayret gerektirir.",
  "Resmen yaşlı kokuyor etraf. Şu hale bak, kuru üzüm gibi.",
  "Ceylin, resmen tahammülümün sonlarındayım bak."
];

// Standing data helper moved outside for better hoisting and scope
 function getAggregatedData(evData, daysCount, tatilData, userId) {
   if (!evData || !evData.tracking) return { labels: [], datasets: [] };
   
   const routine = evData.tracking.routine || {};
   const stats = { home: 0, work: 0, tatil: 0, other: 0 };
   // Filter logs by user if they have user field (legacy logs will be ignored or matched to default)
   const allLogs = evData.tracking.logs || [];
   const logs = allLogs.filter(l => !l.user || l.user === userId);
   
   const userHabits = evData.tracking.userHabits || {};
   const habits = userHabits[userId] || evData.tracking.weeklyHabits || {};
  
  for (let d = 0; d < daysCount; d++) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - d);
    const dateStr = targetDate.toISOString().split('T')[0];
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][targetDate.getDay()];
    
    // Check if whole day was a trip
    const tripForDay = (tatilData?.trips || []).find(t => {
      const start = new Date(t.startDate).getTime();
      const end = new Date(t.endDate).getTime() + (24 * 60 * 60 * 1000);
      const current = new Date(dateStr).getTime();
      return current >= start && current <= end;
    });

    if (tripForDay) {
      stats.tatil += 1440;
      continue;
    }

    for (let i = 0; i < 96; i++) {
      const timeMs = new Date(dateStr).setHours(0, i * 15, 0, 0);
      const timeStr = new Date(timeMs).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
      const hourStr = timeStr.split(':')[0];
      const habitKey = `${dayName}-${hourStr}`;
      
      const log = logs.find(l => 
        l.date === dateStr && 
        Math.abs(l.timestamp - timeMs) < 7.5 * 60 * 1000
      );
      
      if (log && stats[log.type] !== undefined) {
        stats[log.type] += 15;
      } else {
        const habit = habits[habitKey];
        if (habit && (habit.home > 0 || habit.work > 0 || habit.other > 0 || habit.tatil > 0)) {
          const best = Object.entries(habit).reduce((a, b) => b[1] > a[1] ? b : a);
          stats[best[0]] += 15;
        } else {
          if (timeStr >= (routine.sleepStart || '23:30') || timeStr <= (routine.sleepEnd || '07:30')) stats.home += 15;
          else if (timeStr >= (routine.workStart || '09:00') && timeStr <= (routine.workEnd || '18:00')) stats.work += 15;
          else stats.other += 15;
        }
      }
    }
  }

  const total = daysCount * 1440;
  return {
    labels: ['Ev', 'İş', 'Tatil', 'Diğer'],
    datasets: [{
      data: [
        Math.round((stats.home / total) * 100),
        Math.round((stats.work / total) * 100),
        Math.round((stats.tatil / total) * 100),
        Math.round((stats.other / total) * 100)
      ],
      backgroundColor: ['#10b981', '#3b82f6', '#f43f5e', '#f59e0b'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };
}



export default function Ev() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'yasam');
  const { 
    ev, kasa, users, currentUser, setCurrentUser,
    updateHomeSecurity, 
    updateTasinmaz, addTasinmaz, deleteTasinmaz,
    addPeriodicBakim, updatePeriodicBakim, resetPeriodicBakim, deletePeriodicBakim,
    deleteDepoItem, updateDepoItem, clearDepo,
    addOnarimItem, toggleOnarimItem, clearCompletedOnarimItems, updateOnarimItem, deleteOnarimItem,
    addAbonelik, updateAbonelik, deleteAbonelik,
    addDuzenliOdeme, updateDuzenliOdeme, deleteDuzenliOdeme,
    addFinanceExpense, updateLocationSettings, tatil, updateCachedAnalysis,
    savePersonalityResults, saveInvoiceToFinance, saveQuickExpense, finans, addFatura
  } = useStore();

  const { 
    faturalar = [], demirbaslar = [], ustaRehberi = [], abonelikler = [], bitkiler = [], 
    guvenlik = {}, yillikPlan = [], depo = [], timeAnalysis = {}
  } = ev || {};

  const { sosyal, saglik, mutfak: mutfakStore } = useStore();
  
  const onarimListesi = Array.isArray(ev?.onarimListesi) ? ev.onarimListesi : [];
  const bakimlar = Array.isArray(ev?.bakimlar) ? ev.bakimlar : [];

  const [showSafeCode, setShowSafeCode] = useState(false);
  const [faturaForm, setFaturaForm] = useState({ name: '', amount: '', provider: '', dueDate: '', icon: '📜' });
  const [activeDocAction, setActiveDocAction] = useState(null);
  const [showConfirm, setShowConfirm] = useState({ open: false, message: '', onConfirm: null });
  const [activeKit, setActiveKit] = useState(null);
  const [showMainPass, setShowMainPass] = useState(false);
  const [safeInput, setSafeInput] = useState('');
  const [safeError, setSafeError] = useState(false);
  const { 
    unlockSafe, lockSafe, addPersonalSafeStamp, clearPersonalSafeStamps,
    setPersonalSafePage, updatePersonalSafeNote 
  } = useStore();
  const notebookRef = React.useRef(null);
  const [isStamping, setIsStamping] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [editingAbo, setEditingAbo] = useState(null);
  const [editingFatura, setEditingFatura] = useState(null);
  const [editingPeriodic, setEditingPeriodic] = useState(null);
  const [editingPeriodicDetails, setEditingPeriodicDetails] = useState(null);
  const [editingOnarim, setEditingOnarim] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Nakit');
  const [faturaInput, setFaturaInput] = useState(null); 
  const [showWifiPass, setShowWifiPass] = useState(false);
  const [showGuestWifiPass, setShowGuestWifiPass] = useState(false);
  const [showWifiMain, setShowWifiMain] = useState(true);
  const [isChartsReady, setIsChartsReady] = useState(false);
  const [showLocationSettings, setShowLocationSettings] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsChartsReady(true), 600);
    return () => clearTimeout(timer);
  }, []);


  const requestConfirm = (message, onConfirm) => {
    setShowConfirm({ open: true, message, onConfirm });
  };

  // Calculate distance between two points (km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Location Tracker Hook - DEFERRED for performance
  useEffect(() => {
    if (!navigator.geolocation) return;

    let lastLogTime = 0;
    const logInterval = 15 * 60 * 1000; // 15 minutes
    let watchId = null;

    // Wait 2 seconds before starting heavy GPS to let animations finish
    const timer = setTimeout(() => {
      watchId = navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const currentUser = useStore.getState().currentUser;
        const uKey = currentUser?.name?.toLowerCase().includes('esra') ? 'esra' : 'gorkem';
        const currentEv = useStore.getState().ev;
        const { home, work } = currentEv.tracking?.[uKey] || currentEv.tracking || {};
        
        let currentZone = 'other';
        if (home && calculateDistance(latitude, longitude, home.lat, home.lng) * 1000 < (home.radius || 150)) {
          currentZone = 'home';
        } else if (work && calculateDistance(latitude, longitude, work.lat, work.lng) * 1000 < (work.radius || 250)) {
          currentZone = 'work';
        }

        const now = Date.now();
        if (now - lastLogTime > logInterval) {
          useStore.getState().logTimeSlice(currentZone, 15);
          lastLogTime = now;
        }
      }, (err) => console.warn(err), { enableHighAccuracy: false }); // High accuracy turned off for routine tracking
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const activeWarnings = useMemo(() => {
    const warnings = [];
    const now = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    // 1. Emergency Kit Expiry
    Object.keys(ev.emergencyKits || {}).forEach(kitKey => {
      ev.emergencyKits[kitKey].forEach(item => {
        if (!item.expDate) return;
        const diff = new Date(item.expDate) - now;
        if (diff > 0 && diff < thirtyDays) {
          const days = Math.round(diff / (24 * 60 * 60 * 1000));
          warnings.push(`⚠️ ${kitKey === 'deprem' ? 'Deprem' : 'İlk Yardım'} çantasındaki "${item.item}" son kullanımına ${days} gün kaldı!`);
        }
      });
    });

    // 2. Unpaid Bills
    const unpaidCount = (ev.faturalar || []).filter(f => f.status !== 'Ödendi').length;
    if (unpaidCount > 0) {
      warnings.push(`💸 Henüz ödenmemiş ${unpaidCount} adet faturanız bulunuyor. Gecikme bedeli oluşmaması için kontrol edin.`);
    }

    return warnings;
  }, [ev]);

  const [showTahlilSheet, setShowTahlilSheet] = useState(false);
  const userKey = currentUser?.name?.toLowerCase().includes('esra') ? 'esra' : 'gorkem';
  const [activeAnalysisUser, setActiveAnalysisUser] = useState(userKey);
  useEffect(() => {
    setActiveAnalysisUser(userKey);
  }, [userKey]);
  const personalityData = ev.tracking?.personality?.[userKey] || ev.tracking?.personality || { results: {}, history: [] };
  const resultsObj = personalityData.results || {};
  const storeState = useStore();
  const yektaQuote = useMemo(() => YEKTA_QUOTES[Math.floor(Math.random() * YEKTA_QUOTES.length)], []);
  const coachAdvices = useMemo(() => generateYektaAdvice(storeState), [ev, sosyal, saglik, currentUser]);

  const [currentAdviceIdx, setCurrentAdviceIdx] = useState(0);
  const activeAdvice = coachAdvices[currentAdviceIdx % coachAdvices.length];

  const tabs = [
    { id: 'yasam', label: 'Yaşam', emoji: '🪴' },
    { id: 'bakim', label: 'Bakım', emoji: '🔧' },
    { id: 'abonelik', label: 'Abone', emoji: '💳' },
    { id: 'fatura', label: 'Fatura', emoji: '🧾' },
    { id: 'guvenlik', label: 'Güvenlik', emoji: '🛡️' }
  ];

  const handleAddFatura = (e) => {
    e.preventDefault();
    if (!faturaForm.name || !faturaForm.amount) return toast.error('İsim ve tutar giriniz');
    addFatura(faturaForm);
    setFaturaForm({ name: '', amount: '', provider: '', dueDate: '', icon: '📜' });
  };

  const findRealValue = async (id, name) => {
    toast.loading(`${name} için güncel piyasa değeri araştırılıyor...`, { id: 'search' });
    setTimeout(() => {
      const newValue = 4500000 + Math.floor(Math.random() * 500000);
      updateTasinmaz(id, { value: newValue, lastUpdate: new Date().toISOString().split('T')[0] });
      toast.success('Piyasa değeri güncellendi! 📈', { id: 'search' });
    }, 2000);
  };

  const today = new Date().toISOString().slice(0, 10);
  const { weeklyData, monthlyData } = useMemo(() => {
    const userId = activeAnalysisUser;
    
    // Cache per user and per day
    const cacheKey = `cachedAnalysis_${userId}`;
    if (ev.tracking?.lastAnalysisDate === today && ev.tracking?.[cacheKey]) {
      return ev.tracking[cacheKey];
    }
    return {
      weeklyData: getAggregatedData(ev, 7, tatil, userId),
      monthlyData: getAggregatedData(ev, 30, tatil, userId)
    };
  }, [ev.tracking?.logs, ev.tracking?.userHabits, tatil, today, activeAnalysisUser]);

  // Save the calculated analysis once a day per user
  useEffect(() => {
    const userId = activeAnalysisUser;
    const cacheKey = `cachedAnalysis_${userId}`;
    if (ev.tracking?.lastAnalysisDate !== today || !ev.tracking?.[cacheKey]) {
      updateCachedAnalysis({ [cacheKey]: { weeklyData, monthlyData }, lastAnalysisDate: today });
    }
  }, [weeklyData, monthlyData, today, activeAnalysisUser]);

  const doughnutOptions = {
    plugins: { legend: { display: false } },
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <AnimatedPage className="ev-container">
      <header className="module-header glass" style={{ background: 'var(--ev)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🏡</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Malikanesi</h1>
              <p>Ev Hub & Operasyon Merkezi</p>
            </div>
          </div>
          <div className="header-actions">
              <button 
                className="icon-btn" 
                onClick={() => setActiveTab(prev => prev === 'depo' ? 'yasam' : 'depo')}
                style={{ background: activeTab === 'depo' ? 'white' : 'rgba(255,255,255,0.25)', color: activeTab === 'depo' ? '#10b981' : 'white' }}
                title="Depo"
              >
                <Package size={20} />
              </button>
              <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menüye Dön">
                <ArrowLeft size={20} />
              </button>
          </div>
        </div>

        <nav className="tab-nav">
          {tabs.map(t => (
            <button 
              key={t.id} 
              className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span style={{ fontSize: '18px', marginBottom: '2px' }}>{t.emoji}</span>
              <span style={{ fontSize: '10px' }}>{t.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <div className="ev-scroll-content">
        {showLocationSettings && (
        <LocationModal 
          isOpen={showLocationSettings}
          onClose={() => setShowLocationSettings(false)}
          locations={ev.tracking?.[userKey] || ev.tracking || {}}
        />
      )}

      {activeTab === 'depo' && (
          <DepoView 
            depo={ev.depo} 
            deleteDepoItem={deleteDepoItem} 
            updateDepoItem={updateDepoItem}
            clearDepo={clearDepo} 
            requestConfirm={requestConfirm}
          />
        )}

        {activeTab === 'yasam' && (
          <div className="yasam-view animate-fadeIn">
            {/* 1. Today's Advice Coach (NOW TOP) */}
            <div className="coach-module glass mb-32">
               <div className="coach-header">
                 <div className="coach-avatar">
                   <div className="avatar-circle">
                     👔
                   </div>
                   <div className="avatar-status-dot pulse"></div>
                 </div>
                 <div className="coach-meta">
                   <div className="coach-name">Yaşam Stratejisti Yekta Tilmen</div>
                   <div className="coach-greeting">"{yektaQuote}"</div>
                 </div>
               </div>
               
               <div className="coach-content">
                  <div className={`advice-card-v2 ${activeAdvice.type}`}>
                    <div className="a-icon">{activeAdvice.icon}</div>
                    <div className="a-text">{activeAdvice.text}</div>
                  </div>
               </div>

               <div className="coach-actions-v2">
                 <button className="coach-refresh-mini" onClick={() => setCurrentAdviceIdx(prev => prev + 1)}>
                   <RotateCcw size={14} />
                 </button>
                 
                 <button className="coach-archive-btn" onClick={() => navigate('/personality-hub')}>
                   Karakter Arşivi
                 </button>

                 <button className="coach-tahlil-btn" onClick={() => setShowTahlilSheet(true)}>
                   <Sparkles size={14} /> Karakter Tahlili
                 </button>
               </div>
            </div>

            {/* 2. Time Analysis Card (NOW A FULL DASHBOARD) */}
            <div className="time-analysis-module glass mb-32">
                <div className="section-header-v2">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3>📊 Yaşam Dengesi Analizi</h3>
                    <p className="am-sub">Gerçek verilerle {users[activeAnalysisUser]?.name || activeAnalysisUser} analizi</p>
                  </div>
                  <div className="user-selector-mini">
                    {Object.entries(users || {}).map(([id, u]) => (
                      <button 
                        key={id}
                        className={`us-btn ${activeAnalysisUser === id ? 'active' : ''}`}
                        onClick={() => setActiveAnalysisUser(id)}
                      >
                        {u.emoji}
                      </button>
                    ))}
                  </div>
                </div>
               
               <div className="analysis-grid">
                  {/* HAFTALIK GRAFİK */}
                  <div className="analysis-chart-item">
                    <div className="chart-title-mini">HAFTALIK</div>
                      <div className="chart-rel-container">
                        {isChartsReady ? (
                          <Doughnut 
                            data={weeklyData}
                            options={doughnutOptions}
                          />
                        ) : (
                          <div className="chart-placeholder animate-pulse">Analiz Yükleniyor...</div>
                        )}
                      </div>
                    </div>

                    {/* AYLIK GRAFİK */}
                    <div className="analysis-chart-item">
                      <div className="chart-title-mini">AYLIK</div>
                      <div className="chart-rel-container">
                        {isChartsReady ? (
                          <Doughnut 
                            data={monthlyData}
                            options={doughnutOptions}
                          />
                        ) : (
                          <div className="chart-placeholder animate-pulse">Veriler İşleniyor...</div>
                        )}
                      </div>
                    </div>
               </div>

               {/* Veri Detayları & Açıklamalar */}
                <div className="analysis-metrics mt-12">
                   {['Ev', 'İş', 'Tatil', 'Diğer'].map((label, idx) => {
                     const weeklyStats = weeklyData?.datasets?.[0]?.data || [0, 0, 0, 0];
                     const colors = ['#10b981', '#3b82f6', '#f43f5e', '#f59e0b'];
                     return (
                       <div key={label} className="metric-tag" style={{ borderLeft: `3px solid ${colors[idx]}` }}>
                         <span className="m-label">{label}</span>
                         <span className="m-val">%{weeklyStats[idx] || 0}</span>
                       </div>
                     );
                   })}
                </div>

               <div className="analysis-info-box mt-24">
                 <Info size={14} color="#64748b" />
                 <p>Bu sistem; tatil rotalarınızı, ev/iş konumlarınızdaki sürenizi ve günlük rutinlerinizi yapay zeka ile sentezleyerek yaşam dengenizi takip eder.</p>
               </div>
               
                <div className="tracking-setup mt-32 pt-24 mb-24 border-t" style={{ borderTop: '1px solid var(--brd)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button 
                      className={`btn-pill-v2 ${ev.tracking?.[userKey]?.home?.lat ? 'fixed' : ''}`} 
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        const update = () => {
                          toast.loading("Konum alınıyor...", { id: 'loc' });
                          navigator.geolocation.getCurrentPosition(p => {
                            updateLocationSettings('home', { 
                              lat: p.coords.latitude, 
                              lng: p.coords.longitude, 
                              label: 'Evim', 
                              address: 'Otomatik Konum' 
                            });
                            toast.success("Ev konumu güncellendi! 📍", { id: 'loc' });
                          }, (err) => {
                            console.error(err);
                            toast.error("Konum alınamadı. İzinleri kontrol edin.", { id: 'loc' });
                          });
                        };

                        if (ev.tracking?.[userKey]?.home?.lat) {
                          requestConfirm("Mevcut konumunu 'Evim' olarak güncellemek istiyor musun?", update);
                        } else {
                          update();
                        }
                      }}
                    >
                      <Home size={14} />
                      <span>{ev.tracking?.[userKey]?.home?.lat ? 'Evi Güncelle' : 'Evi Set Et'}</span>
                      {ev.tracking?.[userKey]?.home?.lat && <div className="dot-active"></div>}
                    </button>

                    <button 
                      className={`btn-pill-v2 ${ev.tracking?.[userKey]?.work?.lat ? 'fixed' : ''}`} 
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        const update = () => {
                          toast.loading("Konum alınıyor...", { id: 'loc' });
                          navigator.geolocation.getCurrentPosition(p => {
                            updateLocationSettings('work', { 
                              lat: p.coords.latitude, 
                              lng: p.coords.longitude, 
                              label: 'İşyerim', 
                              address: 'Otomatik Konum' 
                            });
                            toast.success("İş konumu güncellendi! 📍", { id: 'loc' });
                          }, (err) => {
                            console.error(err);
                            toast.error("Konum alınamadı. İzinleri kontrol edin.", { id: 'loc' });
                          });
                        };

                        if (ev.tracking?.[userKey]?.work?.lat) {
                          requestConfirm("Mevcut konumunu 'İşyerim' olarak güncellemek istiyor musun?", update);
                        } else {
                          update();
                        }
                      }}
                    >
                      <Building size={14} />
                      <span>{ev.tracking?.[userKey]?.work?.lat ? 'İşi Güncelle' : 'İşi Set Et'}</span>
                      {ev.tracking?.[userKey]?.work?.lat && <div className="dot-active"></div>}
                    </button>
                  </div>

                  <button 
                    className="btn-pill-v2 prominent" 
                    onClick={() => setShowLocationSettings(true)}
                    style={{ background: 'var(--social)', color: 'white', border: 'none', width: '100%', justifyContent: 'center', padding: '14px' }}
                  >
                    <MapIcon size={16} />
                    <span>Gelişmiş Konum Yönetimi</span>
                  </button>
                </div>

                <div className="ai-interpretation mt-32">
                  <Sparkles size={14} color="#10b981" />
                  <p>{ev.timeAnalysis?.[activeAnalysisUser]?.interpretation || "Yaşam verileriniz analiz ediliyor... ✨"}</p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'bakim' && (
          <div className="bakim-view animate-fadeIn">
            {/* Periodic Maintenance Hub */}
            <div className="section-header-v2">
              <h3>🔄 Periyodik Bakımlar</h3>
              <button className="add-btn-mini" onClick={() => setEditingPeriodic({ name: '', intervalDays: 30, icon: '🔧' })}>
                <Plus size={14} />
              </button>
            </div>
            
            <div className="mini-bakim-row mt-12 mb-24 centered">
              {bakimlar.map(b => {
                const diff = Math.round((new Date() - new Date(b.lastDate)) / 864e5);
                const perc = Math.min(100, (diff / b.intervalDays) * 100);
                return (
                  <div 
                    key={b.id} 
                    className="mini-m-card glass" 
                    onClick={() => setEditingPeriodicDetails(b)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      requestConfirm('Bu periyodik bakımı silmek istiyor musunuz?', () => {
                        deletePeriodicBakim(b.id);
                      });
                    }}
                  >
                    <div 
                      className="mm-icon-v2" 
                      style={{ borderColor: perc > 80 ? '#ef4444' : '#22c55e' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        requestConfirm(`${b.name} bakımını bugün yaptınız mı? Sayaç sıfırlanacak.`, () => {
                          resetPeriodicBakim(b.id);
                        });
                      }}
                    >
                      {b.icon}
                      <div className="mm-reset-hint">Sıfırla</div>
                    </div>
                    <div className="mm-info">
                      <strong>{b.name}</strong>
                      <small>{Math.max(0, b.intervalDays - diff)} gün kaldı</small>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Unified Bakım & Onarım Checklist */}
            <div className="onarim-section-v2 mt-24 glass">
               <div className="section-header-v2">
                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                   <h3>🔨 Bakım & Onarım Listesi</h3>
                   <small style={{ opacity: 0.5 }}>{(onarimListesi || []).filter(i => !i.isArchived).length} Aktif Görev</small>
                 </div>
                 <div style={{ display: 'flex', gap: '8px' }}>
                   {(onarimListesi || []).some(i => i.status === 'Completed' && !i.isArchived) && (
                     <button 
                       className="clear-btn-mini" 
                       title="Tamamlananları Temizle"
                       onClick={() => {
                         const userKey = currentUser?.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra';
                         requestConfirm('Tamamlanan görevleri listeden kaldırmak istiyor musunuz? (Kayıtlar arşivlenecektir)', () => clearCompletedOnarimItems(userKey));
                       }}
                     >
                       <RotateCcw size={14} /> Temizle
                     </button>
                   )}
                   <button 
                     className="add-btn-mini" 
                     onClick={() => setEditingOnarim({ task: '' })}
                   >
                     <Plus size={14} />
                   </button>
                 </div>
               </div>

               <div className="onarim-list-v2 mt-12">
                 {(onarimListesi || []).filter(item => !item.isArchived).length > 0 ? (
                   (onarimListesi || []).filter(item => !item.isArchived).map(item => {
                     const createdUser = users[item.createdBy] || { name: item.createdBy, emoji: '👤' };
                     return (
                       <div 
                         key={item.id} 
                         className={`task-card-v2 ${item.status === 'Completed' ? 'done' : ''}`}
                         style={{ cursor: 'default' }}
                       >
                         <div className="tcv2-check" onClick={(e) => {
                           e.stopPropagation();
                           const userKey = currentUser?.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra';
                           toggleOnarimItem(item.id, userKey);
                         }} style={{ cursor: 'pointer' }}>
                           {item.status === 'Completed' ? <CheckCircle2 size={18} color="#22c55e" /> : <div className="circle-check-v2" />}
                         </div>
                         <div className="tcv2-info">
                            <span className="tcv2-task">{item.task}</span>
                            <div className="tcv2-meta" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                              <small style={{ color: 'var(--txt-light)', opacity: 0.8 }}>
                                ✍️ {createdUser.emoji} {(createdUser.name || 'Bilinmiyor').split(' ')[0]} • {item.createdAt ? new Date(item.createdAt).toLocaleDateString('tr-TR') : 'Bilinmeyen Tarih'}
                              </small>
                              {(item.assignedTo || item.dueDate) && (
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                                  {item.assignedTo && (
                                    <small style={{ color: '#6366f1', fontWeight: '800', background: '#e0e7ff', padding: '2px 8px', borderRadius: '6px' }}>
                                      👤 {users[item.assignedTo]?.emoji || '👤'} {(users[item.assignedTo]?.name || item.assignedTo).split(' ')[0]}
                                    </small>
                                  )}
                                  {item.dueDate && (
                                    <small style={{ color: new Date(item.dueDate) < new Date() ? '#ef4444' : '#f59e0b', fontWeight: '800', background: new Date(item.dueDate) < new Date() ? '#fee2e2' : '#fef3c7', padding: '2px 8px', borderRadius: '6px' }}>
                                      📅 {new Date(item.dueDate).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </small>
                                  )}
                                </div>
                              )}
                              {item.status === 'Completed' && item.completedBy && (
                                 <small style={{ color: '#22c55e', fontWeight: '800', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px', width: 'fit-content', marginTop: '2px' }}>
                                   ✅ {(users[item.completedBy]?.name || 'Bilinmiyor').split(' ')[0]}
                                 </small>
                              )}
                            </div>
                         </div>
                         <div className="tcv2-actions" style={{ display: 'flex', gap: '6px', alignSelf: 'center', marginLeft: 'auto' }}>
                            <button 
                              className="icon-btn-mini" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingOnarim(item);
                              }}
                              style={{ border: 'none', background: '#f1f5f9', color: '#64748b', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                              title="Düzenle"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button 
                              className="icon-btn-mini del" 
                              onClick={(e) => {
                                e.stopPropagation();
                                requestConfirm('Bu görevi listeden tamamen silmek istediğinize emin misiniz?', () => deleteOnarimItem(item.id));
                              }}
                              style={{ border: 'none', background: '#fee2e2', color: '#ef4444', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                              title="Sil"
                            >
                              <Trash2 size={12} />
                            </button>
                         </div>
                       </div>
                     );
                   })
                 ) : (
                   <div className="empty-state-v2">
                     <p>Şu an yapılacak bir bakım veya onarım bulunmuyor. ✨</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'abonelik' && (
          <div className="abonelik-view animate-fadeIn">
            {/* V5 FULL SCREEN PREMIUM RECEIPT */}
            <div className="section-header-v2 mt-40">
              <h3>📜 Abonelikler</h3>
              <button className="btn-pill-v2 primary mini narrow" onClick={() => setEditingAbo({ name: '', amount: 0, date: 1, linkedCardId: '', autoPay: true, icon: '🎬', _type: 'abonelik' })}>
                <Plus size={14} /> Abonelik
              </button>
            </div>

            {/* 3. SPLIT LISTS */}
            <div className="abo-split-container mt-24">
               <div className="abo-section">
                  <h4 className="section-mini-title">ABONELİKLER</h4>
                  <div className="vize-style-grid">
                    {abonelikler.map(item => (
                      <div key={item.id} className="vize-card glass abo">
                        <div className="vize-flag">{item.icon}</div>
                        <div className="vize-info">
                          <strong>{item.name}</strong>
                          <span>{formatMoney(item.amount)} • Her ayın {item.date}. günü</span>
                        </div>
                        <div className="vize-badge paid">Aktif</div>
                        <div className="vize-actions">
                          <button className="vize-edit" onClick={() => setEditingAbo({...item, _type: 'abonelik'})}><Edit2 size={16} /></button>
                          <button className="vize-delete" onClick={() => requestConfirm(`${item.name} aboneliğini silmek istediğinize emin misiniz?`, () => deleteAbonelik(item.id))}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="abo-section mt-24">
                  <h4 className="section-mini-title">DÜZENLİ ÖDEMELER</h4>
                  <div className="vize-style-grid">
                    {(ev.duzenliOdemeler || []).map(item => (
                      <div key={item.id} className="vize-card glass duzenli">
                        <div className="vize-flag">{item.icon}</div>
                        <div className="vize-info">
                          <strong>{item.name}</strong>
                          <span>{formatMoney(item.amount)} • Her ayın {item.date}. günü</span>
                        </div>
                        <div className="vize-badge warn">Planlı</div>
                        <div className="vize-actions">
                          <button className="vize-edit" onClick={() => setEditingAbo({...item, _type: 'duzenli'})}><Edit2 size={16} /></button>
                          <button className="vize-delete" onClick={() => requestConfirm(`${item.name} kaydını silmek istediğinize emin misiniz?`, () => deleteDuzenliOdeme(item.id))}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'fatura' && (
          <div className="fatura-view animate-fadeIn">
            <div className="premium-receipt-v5 animate-slideUp">
               <div className="receipt-paper">
                  {/* Top Zig-Zag edge could be CSS pseudo-element */}
                  <div className="receipt-header">
                    <div className="r-logo-box">
                      <div className="r-logo-shield">E</div>
                      <div className="r-logo-text">ERAYLAR</div>
                    </div>
                    <div className="r-meta">
                      <span>NO: {Math.floor(100000 + Math.random() * 900000)}</span>
                      <span>{new Date().toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>

                  <div className="receipt-divider-dots"></div>

                  <div className="receipt-body">
                    <div className="r-field">
                      <label>Harcama Açıklaması</label>
                      <input 
                        className="r-input-text"
                        type="text" 
                        placeholder="Doğalgaz Faturası" 
                        value={faturaForm?.name || ''}
                        onChange={e => setFaturaForm({...faturaForm, name: e.target.value})}
                      />
                    </div>

                    <div className="r-field amount-right">
                      <label>TOPLAM TUTAR</label>
                      <div className="r-amount-box">
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00" 
                          value={faturaInput || ''}
                          onChange={e => setFaturaInput(e.target.value)}
                        />
                        <span className="r-currency">₺</span>
                      </div>
                    </div>

                    <div className="receipt-divider-line"></div>

                    <div className="mt-20">
                      <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
                    </div>
                  </div>

                  <div className="invoice-stamp-v5">ERAYLAR ONAYLI</div>

                  <div className="r-btn-container">
                    <button className="r-complete-btn-rounded" onClick={() => {
                        if(!faturaInput) return toast.error("Lütfen tutar girin.");
                        addFatura({
                          name: faturaForm?.name || 'Fatura',
                          amount: Number(faturaInput),
                          provider: 'Fatura Girişi',
                          dueDate: new Date().toISOString().split('T')[0],
                          icon: '📜',
                          status: 'Bekliyor',
                          user: currentUser?.name || 'ortak'
                        }, paymentMethod);
                        setFaturaInput('');
                        setPaymentMethod('Nakit');
                        setFaturaForm({ name: '', amount: '', provider: '', dueDate: '', icon: '📜' });
                     }}>
                       GİRİŞİ TAMAMLA
                    </button>
                  </div>
               </div>
            </div>

            {/* 2. UNIFIED LIST HEADER */}
            <div className="section-header-v2 mt-24">
              <h3>📜 Fatura Geçmişi</h3>
            </div>
            <div className="history-timeline-premium mt-12">
              {faturalar.length === 0 ? (
                 <div className="gallery-empty" style={{ padding: '20px', fontSize: '11px' }}>Kayıtlı fatura yok.</div>
              ) : faturalar.map(f => (
                <div key={f.id} className="history-card-v2 glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="hc-icon" style={{ fontSize: '20px' }}>{f.icon || '📜'}</div>
                    <div className="hc-info">
                      <p style={{ margin: 0 }}><strong>{f.name}</strong> <span style={{ opacity: 0.6, fontSize: '11px' }}>{f.provider}</span></p>
                      <span className="hc-time" style={{ fontSize: '10px', opacity: 0.5 }}>{f.dueDate ? new Date(f.dueDate).toLocaleDateString('tr-TR') : ''}</span>
                    </div>
                  </div>
                  <div className="hc-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <strong style={{ color: f.status === 'Ödendi' ? '#10b981' : '#f59e0b' }}>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(f.amount || 0)}</strong>
                    <span style={{ fontSize: '10px', background: f.status === 'Ödendi' ? '#dcfce7' : '#fef3c7', padding: '2px 6px', borderRadius: '4px', color: f.status === 'Ödendi' ? '#15803d' : '#b45309' }}>{f.status || 'Bekliyor'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guvenlik' && (
          <div className="guvenlik-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🚨 Güvenlik & Acil Durum</h3>
            </div>
            
            {/* Emergency Kits Section */}
            <div className="emergency-kits-grid mt-12 mb-24">
              {['deprem', 'ilkyardim'].map(kitKey => (
                <div key={kitKey} className={`kit-card glass ${kitKey}`} onClick={() => setActiveKit(kitKey)}>
                   <div className="kit-icon-box">
                     {kitKey === 'deprem' ? <Package size={24} color="#a16207" /> : <Shield size={24} color="#b91c1c" />}
                   </div>
                   <div className="kit-info">
                     <strong>{kitKey === 'deprem' ? 'Deprem Çantası' : 'İlk Yardım Çantası'}</strong>
                     <small>{(ev.emergencyKits?.[kitKey] || []).length} Ürün Kayıtlı</small>
                   </div>
                   <ChevronRight size={16} opacity={0.3} />
                </div>
              ))}
            </div>

            {/* Premium Wi-Fi Section */}
            <div className="wifi-section-container mb-24">
              
              {/* Main Wi-Fi Card (Collapsible) */}
              <div className={`premium-wifi-card main glass animate-fadeIn ${!showWifiMain ? 'collapsed' : ''}`}>
                <div className="wifi-card-header" onClick={() => setShowWifiMain(!showWifiMain)}>
                  <div className="wifi-toggle-btn">
                    {showWifiMain ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </div>
                  <div className="wifi-title-group">
                    <label>AĞ ADI</label>
                    <strong>Superonline_Wi-Fi_1023</strong>
                  </div>
                </div>

                {showWifiMain && (
                  <div className="wifi-card-body animate-fadeIn">
                    <div className="wifi-content-v2">
                      <div className="wifi-info-main">
                        <label>ŞİFRE</label>
                        <div className="wifi-pass-container static">
                          <Key size={14} opacity={0.5} />
                          <span className="handwriting-pass">
                            {showWifiPass ? 'MAUMFUFTH74L' : '••••••••••••'}
                          </span>
                          <button 
                            className="wifi-peek-btn" 
                            onClick={(e) => { e.stopPropagation(); setShowWifiPass(!showWifiPass); }}
                            title={showWifiPass ? "Gizle" : "Göster"}
                          >
                            {showWifiPass ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                      <span className="wifi-badge main side">ANA HAT</span>
                      <div className="wifi-qr-placeholder">
                         <img 
                           src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('WIFI:S:Superonline_Wi-Fi_1023;T:WPA;P:MAUMFUFTH74L;;')}`} 
                           alt="QR Code" 
                           className="real-qr-img"
                         />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Wi-Fi Card (Always visible) */}
              <div className="premium-wifi-card guest glass animate-fadeIn" style={{ marginTop: '16px' }}>
                <div className="wifi-content-v2">
                  <div className="wifi-info-main">
                    <label>HIZLI BAĞLANTI</label>
                    <strong className="guest-ssid">Tombis Yiğit</strong>
                    <div className="wifi-pass-container static guest">
                       <Key size={14} opacity={0.5} />
                       <span className="handwriting-pass">
                         {showGuestWifiPass ? 'Love2013' : '••••••••'}
                       </span>
                       <button 
                         className="wifi-peek-btn" 
                         onClick={(e) => { e.stopPropagation(); setShowGuestWifiPass(!showGuestWifiPass); }}
                         title={showGuestWifiPass ? "Gizle" : "Göster"}
                       >
                         {showGuestWifiPass ? <EyeOff size={14} /> : <Eye size={14} />}
                       </button>
                    </div>
                  </div>
                  <span className="wifi-badge guest side">MİSAFİR</span>
                  <div className="wifi-qr-placeholder" onClick={() => toast.success('QR Kod paylaşıma hazır! 📲')}>
                     <img 
                       src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('WIFI:S:Tombis Yiğit;T:WPA;P:Love2013;;')}`} 
                       alt="QR Code" 
                       className="real-qr-img"
                     />
                  </div>
                </div>
              </div>
            </div>

            {/* Encrypted Safe (Şifreli Defter) - Vintage Edition */}
            <div className="vintage-safe-container glass">
                <div className="vs-header">
                  <div className="vs-title">
                    <Book size={20} color="#10b981" />
                    <h3>Kişisel Şifreli Defter</h3>
                  </div>
                  {!ev.guvenlik?.safePassword ? (
                    <button className="vs-action-btn setup" onClick={() => navigate('/profil')}>
                      <AlertCircle size={16} /> Şifre Belirle
                    </button>
                  ) : ev.personalSafe?.locked ? (
                    <button className="vs-action-btn unlock" onClick={() => {
                      if (unlockSafe(safeInput)) {
                        toast.success('Defter açıldı! 🖋️');
                        setSafeInput('');
                      } else {
                        setSafeError(true);
                        toast.error('Hatalı şifre! 🔒');
                        setTimeout(() => setSafeError(false), 500);
                      }
                    }}>
                      <Lock size={16} /> Kilidi Aç
                    </button>
                  ) : (
                    <button className="vs-action-btn lock" onClick={lockSafe}>
                      <Unlock size={16} /> Defteri Kapat
                    </button>
                  )}
                </div>

                <div className="vs-body">
                  {!ev.guvenlik?.safePassword ? (
                    <div className="vs-setup-hint">
                      <p>Özel notlarınızı saklamak için profilinizden bir şifre belirleyin.</p>
                      <button className="btn-setup-safe" onClick={() => navigate('/profil')}>Ayarlara Git</button>
                    </div>
                  ) : ev.personalSafe?.locked ? (
                    <div className="vs-lock-overlay">
                      <div className="vs-lock-box">
                        <Lock size={40} className={safeError ? 'shake' : ''} />
                        <input 
                          type="password" 
                          className={`vs-pin-input ${safeError ? 'error' : ''}`}
                          placeholder="••••"
                          value={safeInput}
                          onChange={(e) => setSafeInput(e.target.value)}
                          maxLength={10}
                        />
                        <p>Erişim kodunu giriniz</p>
                      </div>
                    </div>
                  ) : (() => {
                    const safe = ev.personalSafe || {};
                    const activeIdx = safe.activePageIndex || 0;
                    const pages = Array.isArray(safe.pages) ? safe.pages : [];
                    const activePage = pages[activeIdx] || { notes: '', stamps: [] };
                    
                    return (
                    <div 
                      ref={notebookRef}
                      className={`vs-notebook-paper animate-fadeIn ${isStamping ? 'stamping-mode' : ''}`}
                      onMouseMove={(e) => {
                        if (!isStamping || !notebookRef.current) return;
                        const rect = notebookRef.current.getBoundingClientRect();
                        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                      }}
                      onClick={(e) => {
                        if (!isStamping || !notebookRef.current) return;
                        const rect = notebookRef.current.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        const userKey = currentUser?.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra';
                        const userSeal = users[userKey]?.seal || { icon: 'E', color: '#10b981' };
                        
                        addPersonalSafeStamp({ x, y, ...userSeal });
                        setIsStamping(false);
                        toast.success('Mühür vuruldu! 🖋️');
                      }}
                    >
                      {/* Stamp Home Base */}
                      <div 
                        className={`stamp-home-base ${isStamping ? 'empty' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsStamping(true);
                        }}
                        title="Mührü Al"
                      >
                        {!isStamping && (
                          <div className="vintage-stamp-handle" style={{ transform: 'scale(0.8)' }}>
                            <div className="handle-top" />
                            <div className="handle-body" />
                            <div className="handle-base" />
                          </div>
                        )}
                        <div className="base-shadow" />
                      </div>

                      <div className="notebook-header" style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '10px' }}>
                         <div className="notebook-pagination">
                            <button onClick={(e) => { e.stopPropagation(); if(activeIdx > 0) setPersonalSafePage(activeIdx - 1); }} disabled={activeIdx === 0}>‹</button>
                            <span>Sayfa {activeIdx + 1} / 5</span>
                            <button onClick={(e) => { e.stopPropagation(); if(activeIdx < 4) setPersonalSafePage(activeIdx + 1); }} disabled={activeIdx === 4}>›</button>
                         </div>
                         
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             requestConfirm('Bu sayfanın mühürlerini temizlemek istediğinize emin misiniz?', clearPersonalSafeStamps);
                           }}
                           className="notebook-clear-btn"
                         >Temizle</button>

                         <span className="notebook-date-v2">{new Date().toLocaleDateString('tr-TR')}</span>
                      </div>
                      
                      <textarea 
                        className="notebook-textarea"
                        placeholder="Yazmaya başlayın..."
                        value={activePage.notes || ''}
                        onChange={(e) => updatePersonalSafeNote(e.target.value)}
                        spellCheck="false"
                      />

                      {/* Render Placed Stamps */}
                      {(activePage.stamps || []).map((s, idx) => {
                        const isEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(s.icon);
                        return (
                          <div 
                            key={idx} 
                            className="placed-seal-stamp animate-popIn"
                            style={{ 
                              position: 'absolute', 
                              left: s.x, 
                              top: s.y, 
                              transform: 'translate(-50%, -50%) rotate(-15deg)',
                              color: s.color,
                              pointerEvents: 'none',
                              opacity: 0.8
                            }}
                          >
                            <div style={{ 
                              width: '60px', 
                              height: '60px', 
                              borderRadius: '50%', 
                              border: `2px double ${s.color}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: `${s.color}08`
                            }}>
                              <span style={{ 
                                fontFamily: isEmoji ? 'inherit' : '"Great Vibes", cursive', 
                                fontSize: isEmoji ? '24px' : (s.icon.length > 3 ? '14px' : '28px'),
                                fontWeight: 'bold'
                              }}>
                                {s.icon}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Floating Stamping Tool */}
                      {isStamping && (
                        <div 
                          className="floating-stamp-tool"
                          style={{ 
                            position: 'absolute', 
                            left: mousePos.x, 
                            top: mousePos.y, 
                            transform: 'translate(-50%, -100%)',
                            pointerEvents: 'none',
                            zIndex: 100
                          }}
                        >
                          <div className="vintage-stamp-handle">
                            <div className="handle-top" />
                            <div className="handle-body" />
                            <div className="handle-base" />
                          </div>
                        </div>
                      )}


                    </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

      </div>
      <ActionSheet
        isOpen={!!activeKit}
        onClose={() => setActiveKit(null)}
        title={activeKit === 'deprem' ? '🚨 Deprem Çantası Yönetimi' : '🩹 İlk Yardım Çantası Yönetimi'}
        fullHeight
      >
        {activeKit && (
          <EmergencyKitModal 
            type={activeKit} 
            items={ev.emergencyKits?.[activeKit] || []} 
            onClose={() => setActiveKit(null)} 
            requestConfirm={requestConfirm}
          />
        )}
      </ActionSheet>

      {/* ActionSheet for Subscription Edit */}
      <ActionSheet
        isOpen={!!editingAbo}
        onClose={() => setEditingAbo(null)}
        title={editingAbo?.id ? (editingAbo._type === 'duzenli' ? 'Düzenli Ödeme Düzenle' : 'Abonelik Düzenle') : (editingAbo?._type === 'duzenli' ? 'Yeni Düzenli Ödeme' : 'Yeni Abonelik')}
      >
        {editingAbo && (
          <div className="edit-form-v2">
            <div className="form-group-v2">
              <label>Kayıt Türü</label>
              <select
                style={{
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1px solid var(--brd)',
                  background: '#f8fafc',
                  fontSize: '14px',
                  fontWeight: '600',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'inherit',
                  color: 'var(--txt)',
                  marginBottom: '12px'
                }}
                value={editingAbo._type || 'abonelik'}
                onChange={(e) => setEditingAbo({...editingAbo, _type: e.target.value, icon: e.target.value === 'duzenli' ? '💸' : '🎬'})}
              >
                <option value="abonelik">🎬 Abonelik (Netflix, Spotify vb.)</option>
                <option value="duzenli">💸 Düzenli Ödeme (Kira, Aidat vb.)</option>
              </select>
            </div>
            <div className="form-group-v2">
              <label>{editingAbo._type === 'duzenli' ? 'Ödeme Adı' : 'Abonelik Adı'}</label>
              <input 
                type="text" 
                value={editingAbo.name} 
                onChange={(e) => setEditingAbo({...editingAbo, name: e.target.value})}
                placeholder={editingAbo._type === 'duzenli' ? 'Örn: Ev Kirası' : 'Örn: Netflix'}
              />
            </div>
            <div className="form-row-v2">
              <div className="form-group-v2">
                <label>Tutar (TL)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  value={editingAbo.amount || ''} 
                  onChange={(e) => setEditingAbo({...editingAbo, amount: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                />
              </div>
              <div className="form-group-v2">
                <label>Ödeme Günü</label>
                <input 
                  type="number" 
                  min="1" max="31"
                  placeholder="1-31"
                  value={editingAbo.date || ''} 
                  onChange={(e) => setEditingAbo({...editingAbo, date: e.target.value === '' ? 0 : parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="form-group-v2">
              <PaymentSelector 
                value={editingAbo.linkedCardId} 
                onChange={(val) => setEditingAbo({...editingAbo, linkedCardId: val})}
              />
            </div>
            <div className="form-group-v2">
              <label>İlk Abonelik Tarihi</label>
              <input 
                type="date" 
                value={editingAbo.startDate || ''} 
                onChange={(e) => setEditingAbo({...editingAbo, startDate: e.target.value})}
              />
            </div>
            <div className="form-toggle-row">
              <label>Otomatik Ödeme Talimatı</label>
              <input 
                type="checkbox" 
                checked={editingAbo.autoPay} 
                onChange={(e) => setEditingAbo({...editingAbo, autoPay: e.target.checked})}
              />
            </div>
            <button className="save-btn-v2" onClick={() => {
              if (editingAbo._type === 'duzenli') {
                if (editingAbo.id) updateDuzenliOdeme(editingAbo.id, editingAbo);
                else addDuzenliOdeme(editingAbo);
              } else {
                if (editingAbo.id) updateAbonelik(editingAbo.id, editingAbo);
                else addAbonelik(editingAbo);
              }
              setEditingAbo(null);
              toast.success('Kaydedildi!');
            }}>Kaydet</button>
          </div>
        )}
      </ActionSheet>

      {/* ActionSheet for Quick Expense Entry (Fatura Girişi) */}
      <ActionSheet
        isOpen={!!editingFatura}
        onClose={() => setEditingFatura(null)}
        title="Harcama / Fatura Kaydı"
      >
        {editingFatura && (
          <div className="edit-form-v2">
            <div className="fatura-entry-hint" style={{ marginBottom: '15px', fontSize: '13px', opacity: 0.7 }}>
              Buraya girdiğiniz harcamalar (Tamir, Bakım vb.) doğrudan <strong>Finans</strong> modülüne işlenir.
            </div>
            <div className="form-group-v2">
              <label>Harcama Adı</label>
              <input 
                type="text" 
                placeholder="Örn: Kombi Tamiri"
                value={editingFatura.name} 
                onChange={(e) => setEditingFatura({...editingFatura, name: e.target.value})}
              />
            </div>
            <div className="form-group-v2">
              <label>Tutar (TL)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                value={editingFatura.amount || ''} 
                onChange={(e) => setEditingFatura({...editingFatura, amount: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
              />
            </div>
            <div className="form-group-v2">
              <PaymentSelector 
                value={editingFatura.linkedCardId} 
                onChange={(val) => setEditingFatura({...editingFatura, linkedCardId: val})}
              />
            </div>
            <button className="save-btn-v2" onClick={() => {
              if(!editingFatura.name || !editingFatura.amount) return toast.error('Lütfen isim ve tutar girin');
              addFinanceExpense(editingFatura, editingFatura.linkedCardId);
              toast.success(`${editingFatura.name} harcaması Finans modülüne işlendi! 💸`);
              setEditingFatura(null);
            }}>Finansa İşle</button>
          </div>
        )}
      </ActionSheet>

      {/* ActionSheet for Periodic Maintenance Edit/Add */}
      <ActionSheet
        isOpen={!!editingPeriodic || !!editingPeriodicDetails}
        onClose={() => { setEditingPeriodic(null); setEditingPeriodicDetails(null); }}
        title={editingPeriodicDetails ? `🔧 ${editingPeriodicDetails.name}` : "Yeni Periyodik Bakım"}
      >
        {(editingPeriodic || editingPeriodicDetails) && (
          <div className="edit-form-v2">
            {editingPeriodicDetails && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <button 
                  className="delete-link-v2"
                  onClick={() => {
                    requestConfirm(`${editingPeriodicDetails.name} kaydını tamamen silmek istiyor musunuz?`, () => {
                      deletePeriodicBakim(editingPeriodicDetails.id);
                      setEditingPeriodicDetails(null);
                    });
                  }}
                >
                  <Trash2 size={14} /> Kaydı Sil
                </button>
              </div>
            )}
            <div className="form-group-v2">
              <label>Bakım Adı</label>
              <input 
                type="text" 
                placeholder="Örn: Su Arıtma Filtresi"
                value={editingPeriodic?.name || editingPeriodicDetails?.name || ''}
                onChange={(e) => {
                  if(editingPeriodic) setEditingPeriodic({...editingPeriodic, name: e.target.value});
                  else setEditingPeriodicDetails({...editingPeriodicDetails, name: e.target.value});
                }}
              />
            </div>
            
            <div className="form-row-v2">
              <div className="form-group-v2">
                <label>Marka</label>
                <input 
                  type="text" 
                  placeholder="Örn: Samsung"
                  value={editingPeriodic?.brand || editingPeriodicDetails?.brand || ''}
                  onChange={(e) => {
                    if(editingPeriodic) setEditingPeriodic({...editingPeriodic, brand: e.target.value});
                    else setEditingPeriodicDetails({...editingPeriodicDetails, brand: e.target.value});
                  }}
                />
              </div>
              <div className="form-group-v2">
                <label>Model</label>
                <input 
                  type="text" 
                  placeholder="Örn: WindFree 2024"
                  value={editingPeriodic?.model || editingPeriodicDetails?.model || ''}
                  onChange={(e) => {
                    if(editingPeriodic) setEditingPeriodic({...editingPeriodic, model: e.target.value});
                    else setEditingPeriodicDetails({...editingPeriodicDetails, model: e.target.value});
                  }}
                />
              </div>
            </div>

            <div className="form-group-v2">
              <label>Yedek Parça Numarası / SKU</label>
              <input 
                type="text" 
                placeholder="Örn: FILTER-V1-99"
                value={editingPeriodic?.partNo || editingPeriodicDetails?.partNo || ''}
                onChange={(e) => {
                  if(editingPeriodic) setEditingPeriodic({...editingPeriodic, partNo: e.target.value});
                  else setEditingPeriodicDetails({...editingPeriodicDetails, partNo: e.target.value});
                }}
              />
            </div>

            <div className="form-row-v2">
              <div className="form-group-v2">
                <label>Periyot (Gün)</label>
                <input 
                  type="number" 
                  value={editingPeriodic?.intervalDays || editingPeriodicDetails?.intervalDays || 30}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if(editingPeriodic) setEditingPeriodic({...editingPeriodic, intervalDays: val});
                    else setEditingPeriodicDetails({...editingPeriodicDetails, intervalDays: val});
                  }}
                />
              </div>
              <div className="form-group-v2">
                <label>Kalan Gün</label>
                <input 
                  type="number" 
                  value={(() => {
                    const data = editingPeriodic || editingPeriodicDetails;
                    if(!data.lastDate) return data.intervalDays || 30;
                    const diff = Math.round((new Date() - new Date(data.lastDate)) / 864e5);
                    return Math.max(0, (data.intervalDays || 30) - diff);
                  })()}
                  onChange={(e) => {
                    const remain = Number(e.target.value);
                    const data = editingPeriodic || editingPeriodicDetails;
                    const interval = data.intervalDays || 30;
                    const diff = interval - remain;
                    const newLastDate = new Date(new Date() - diff * 864e5).toISOString().split('T')[0];
                    
                    if(editingPeriodic) setEditingPeriodic({...editingPeriodic, lastDate: newLastDate});
                    else setEditingPeriodicDetails({...editingPeriodicDetails, lastDate: newLastDate});
                  }}
                />
              </div>
            </div>

            <div className="form-group-v2">
              <label>Emoji</label>
              <input 
                type="text" 
                value={editingPeriodic?.icon || editingPeriodicDetails?.icon || '🔧'}
                onChange={(e) => {
                  if(editingPeriodic) setEditingPeriodic({...editingPeriodic, icon: e.target.value});
                  else setEditingPeriodicDetails({...editingPeriodicDetails, icon: e.target.value});
                }}
              />
            </div>
            <button className="save-btn-v2" onClick={() => {
              const data = editingPeriodic || editingPeriodicDetails;
              if(!data.name) return toast.error('Lütfen isim girin');
              
              if(editingPeriodicDetails) {
                updatePeriodicBakim(data.id, data);
              } else {
                addPeriodicBakim(data);
              }
              setEditingPeriodic(null);
              setEditingPeriodicDetails(null);
            }}>Bilgileri Kaydet</button>
          </div>
        )}
      </ActionSheet>


      <ActionSheet
        isOpen={!!editingOnarim}
        onClose={() => setEditingOnarim(null)}
        title={editingOnarim?.id ? "Bakım & Onarım Görevi Düzenle" : "Yeni Bakım & Onarım Görevi"}
      >
        {editingOnarim && (
          <div className="edit-form-v2">
            <div className="form-group-v2">
              <label>Yapılacak İşlem / Alınacak Parça</label>
              <textarea 
                className="form-group-v2 input"
                style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--brd)', background: '#f8fafc', fontSize: '14px', fontWeight: '600', outline: 'none', minHeight: '80px', fontFamily: 'inherit' }}
                placeholder="Örn: Mutfak musluğu contası değişecek"
                value={editingOnarim.task || ''}
                onChange={(e) => setEditingOnarim({...editingOnarim, task: e.target.value})}
              />
            </div>

            <div className="form-group-v2" style={{ marginTop: '15px' }}>
              <label>Sorumlu Kişi (Kim Yapacak?)</label>
              <select 
                className="form-group-v2 input"
                style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--brd)', background: '#f8fafc', fontSize: '14px', fontWeight: '600', outline: 'none', width: '100%', fontFamily: 'inherit' }}
                value={editingOnarim.assignedTo || ''}
                onChange={(e) => setEditingOnarim({...editingOnarim, assignedTo: e.target.value})}
              >
                <option value="">Seçilmedi (Ortak / Herkes)</option>
                {Object.entries(users || {}).map(([key, u]) => (
                  <option key={key} value={key}>{u.emoji} {u.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group-v2" style={{ marginTop: '15px', marginBottom: '20px' }}>
              <label>Son Yapılma Tarihi (Ne Zamana Kadar?)</label>
              <input 
                type="datetime-local" 
                className="form-group-v2 input"
                style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--brd)', background: '#f8fafc', fontSize: '14px', fontWeight: '600', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' }}
                value={editingOnarim.dueDate ? editingOnarim.dueDate.slice(0, 16) : ''}
                onChange={(e) => setEditingOnarim({...editingOnarim, dueDate: e.target.value ? new Date(e.target.value).toISOString() : ''})}
              />
            </div>

            <button className="save-btn-v2" onClick={() => {
              if(!editingOnarim.task) return toast.error('Lütfen görev açıklaması girin');
              const userKey = currentUser?.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra';
              if (editingOnarim.id) {
                updateOnarimItem(editingOnarim.id, {
                  task: editingOnarim.task,
                  assignedTo: editingOnarim.assignedTo || null,
                  dueDate: editingOnarim.dueDate || null
                });
              } else {
                addOnarimItem({
                  task: editingOnarim.task,
                  assignedTo: editingOnarim.assignedTo || null,
                  dueDate: editingOnarim.dueDate || null
                }, userKey);
              }
              setEditingOnarim(null);
            }}>{editingOnarim.id ? 'Kaydet' : 'Listeye Ekle'}</button>
          </div>
        )}
      </ActionSheet>


      <ActionSheet isOpen={showTahlilSheet} onClose={() => setShowTahlilSheet(false)} title="Yekta Tilmen'den Karakter Tahlili">
        <div className="tahlil-sheet-content">
          <div className="tahlil-header">
            <div className="avatar-circle-large">👔</div>
            <div className="tahlil-summary">
              <h3>{currentUser?.name} Dosyası</h3>
              <p>Yaşam Stratejisti Yekta Tilmen Tarafından Onaylandı</p>
            </div>
          </div>

          <div className="tahlil-main-text glass">
             {personalityData?.results ? synthesizeCharacter(personalityData) : (
               <div style={{ textAlign: 'center', padding: '20px' }}>
                 <p>Henüz karakter tahlili verisi bulunamadı. Yekta Tilmen'in sizi tanıması için testi tamamlamalısınız.</p>
                 <button className="btn-primary-v2 mt-16" onClick={() => navigate('/yekta-test')}>Analizi Başlat 🚀</button>
               </div>
             )}
          </div>

          {personalityData?.results && (
            <div className="tahlil-stats-grid mt-24">
               {Object.keys(resultsObj).map(id => (
                 <div key={id} className="mini-result-pill">
                    <span>{id === 'big5' ? 'Karakter' : (id === 'leader' ? 'Liderlik' : id.toUpperCase())}</span>
                    <strong>{resultsObj[id]?.type || 'Belirsiz'}</strong>
                 </div>
               ))}
            </div>
          )}

          <button className="btn-primary-v2 mt-32" onClick={() => setShowTahlilSheet(false)}>Anlaşıldı, Yekta.</button>
        </div>
      </ActionSheet>

      <ConfirmModal 
        isOpen={showConfirm.open}
        title="Emin misiniz?"
        message={showConfirm.message}
        onConfirm={() => {
          showConfirm.onConfirm();
          setShowConfirm({ ...showConfirm, open: false });
        }}
        onCancel={() => setShowConfirm({ ...showConfirm, open: false })}
      />



    </AnimatedPage>
  );
}

const EMERGENCY_RECOMMENDATIONS = {
  deprem: [
    { item: "Su (Kişi başı 3L)", cat: "Gıda", icon: "💧" },
    { item: "Konserve Gıda", cat: "Gıda", icon: "🥫" },
    { item: "Bisküvi / Kuru Yemiş", cat: "Gıda", icon: "🥜" },
    { item: "Düdük", cat: "Araç", icon: "📢" },
    { item: "El Feneri (Yedek pilli)", cat: "Araç", icon: "🔦" },
    { item: "Pilli Radyo", cat: "İletişim", icon: "📻" },
    { item: "Yedek Anahtarlar", cat: "Belge", icon: "🔑" },
    { item: "Nakit Para", cat: "Belge", icon: "💵" },
    { item: "Yağmurluk", cat: "Giyim", icon: "🧥" }
  ],
  ilkyardim: [
    { item: "Yara Bandı", cat: "Sarf", icon: "🩹" },
    { item: "Sargı Bezi", cat: "Sarf", icon: "🩹" },
    { item: "Antiseptik Solüsyon", cat: "Sağlık", icon: "🧪" },
    { item: "Ağrı Kesici", cat: "Sağlık", icon: "💊" },
    { item: "Makas", cat: "Araç", icon: "✂️" },
    { item: "Dijital Ateş Ölçer", cat: "Araç", icon: "🌡️" },
    { item: "Steril Eldiven", cat: "Sarf", icon: "🧤" }
  ]
};

function EmergencyKitModal({ type, items, onClose, requestConfirm }) {
  const { addEmergencyItem, deleteEmergencyItem, addEmergencyToShopping, currentUser } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ item: '', expDate: '', icon: '📦' });
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const missingRecommendations = useMemo(() => {
    const isMissing = (rec) => !items.some(i => i.item.toLowerCase().includes(rec.item.toLowerCase()));
    return EMERGENCY_RECOMMENDATIONS[type].filter(isMissing);
  }, [type, items]);

  const featuredRec = useMemo(() => {
    if (missingRecommendations.length === 0) return null;
    return missingRecommendations[featuredIndex % missingRecommendations.length];
  }, [missingRecommendations, featuredIndex]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.item) return toast.error('Ürün adı giriniz!');
    addEmergencyItem(type, newItem, currentUser?.name);
    setNewItem({ item: '', expDate: '', icon: '📦' });
    setShowAdd(false);
    toast.success('Ürün eklendi! ✨');
  };

  const isNearExpiry = (date) => {
    if (!date) return false;
    const diff = new Date(date) - new Date();
    return diff > 0 && diff < (30 * 24 * 60 * 60 * 1000); // 30 days safety margin
  };

  const getUserEmoji = (name) => {
    if (name === 'Esra') return '👩‍🍳';
    if (name === 'Görkem') return '👨‍💻';
    return '👤';
  };

  return (
    <div className="ek-modal-content">
      <div className="ek-stats glass mb-16">
        <div className="ek-stat">
          <small>Toplam Ürün</small>
          <strong>{items.length}</strong>
        </div>
        <div className="ek-stat">
          <small>SKT Yaklaşan</small>
          <strong style={{ color: '#f59e0b' }}>{items.filter(i => isNearExpiry(i.expDate)).length}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <button className="pill-btn-ev" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={18} /> {showAdd ? 'Girişi İptal Et' : 'Yeni Manuel Kayıt'}
        </button>
      </div>

      {featuredRec ? (
        <div className="recommendation-ghost glass animate-pulse-slow mb-24">
          <div className="rg-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={12} color="#f59e0b" />
              <span className="rg-tag">{type === 'deprem' ? 'DEPREM ASİSTANI' : 'İLK YARDIM ASİSTANI'}</span>
            </div>
            <button className="rg-refresh" onClick={() => setFeaturedIndex(prev => prev + 1)} title="Farklı Bir Öneri">
              <RotateCcw size={14} />
            </button>
          </div>
          <div className="rg-body">
            <div className="rg-emoji">{featuredRec.icon}</div>
            <div className="rg-info">
              <strong>{featuredRec.item}</strong>
              <span>{type === 'deprem' ? 'Deprem çantanızdaki bu eksiği tamamlamayı unutmayın.' : 'İlk yardım setinizdeki bu eksiği tamamlamayı unutmayın.'}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="rg-shop-btn" onClick={() => addEmergencyToShopping(featuredRec)} title="Alışverişe Ekle">
                <ShoppingBag size={18} />
              </button>
              <button className="rg-add" onClick={() => addEmergencyItem(type, { item: featuredRec.item, icon: featuredRec.icon }, currentUser?.name)} title="Çantaya Ekle">
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="as-complete-msg mb-24">
          <CheckCircle2 size={18} color="#10b981" />
          <span>Tebrikler! Çantanızdaki tüm temel eksikler tamamlandı. ✨</span>
        </div>
      )}



      <div className="ek-list-header mb-8">
        <span className="col-name">Ürün Adı</span>
        <span className="col-date">Eklenme</span>
        <span className="col-skt">SKT</span>
        <span className="col-user">Kişi</span>
        <span className="col-actions"></span>
      </div>

      <div className="ek-items-list">
        {showAdd && (
          <form className="ek-item-card-v2 entry-row glass animate-fadeIn" onSubmit={handleAdd}>
            <div className="ek-col-main">
              <div className="ek-item-icon">📦</div>
              <input 
                type="text" 
                value={newItem.item} 
                onChange={e => setNewItem({ ...newItem, item: e.target.value })} 
                placeholder="Ürün adı girin..."
                autoFocus
              />
            </div>
            <div className="ek-col-date">
              <span style={{ opacity: 0.5 }}>{new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}</span>
            </div>
            <div className="ek-col-skt">
              <input 
                type="date" 
                value={newItem.expDate} 
                onChange={e => setNewItem({ ...newItem, expDate: e.target.value })} 
              />
            </div>
            <div className="ek-col-user">
               <span className="user-badge-mini">{getUserEmoji(currentUser?.name)}</span>
            </div>
            <div className="ek-col-actions">
              <button type="submit" className="ek-save-btn-v2"><CheckCircle2 size={18} /></button>
            </div>
          </form>
        )}
        {items.length > 0 ? items.map(item => (
          <div key={item.id} className={`ek-item-card-v2 glass ${isNearExpiry(item.expDate) ? 'warning' : ''}`}>
            <div className="ek-col-main">
              <div className="ek-item-icon">{item.icon || '📦'}</div>
              <strong>{item.item}</strong>
            </div>
            <div className="ek-col-date">
              {item.buyDate ? new Date(item.buyDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }) : '-'}
            </div>
            <div className={`ek-col-skt ${isNearExpiry(item.expDate) ? 'text-warning' : ''}`}>
              {item.expDate ? new Date(item.expDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '∞'}
            </div>
            <div className="ek-col-user">
               <span className="user-badge-mini" title={item.addedBy}>{getUserEmoji(item.addedBy)}</span>
            </div>
            <div className="ek-col-actions">
              <button className="ek-delete-btn-v2" onClick={() => {
                requestConfirm(`"${item.item}" ürününü çantadan çıkarmak istediğinize emin misiniz?`, () => {
                  deleteEmergencyItem(type, item.id);
                  toast.success('Ürün çıkarıldı.');
                });
              }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )) : (
          <div className="empty-state-v2">
            <AlertCircle size={32} opacity={0.2} />
            <p>Çantada henüz ürün yok. AI asistanı kullanarak hemen doldurabilirsiniz!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DepoView({ depo, deleteDepoItem, updateDepoItem, clearDepo, requestConfirm }) {
  const [expandedItem, setExpandedItem] = useState(null);
  const [depoFilter, setDepoFilter] = useState('Hepsi');
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Genel');
  const [editQty, setEditQty] = useState(1);

  const categories = ['Hepsi', 'Gardırop', 'Teknoloji', 'Genel'];

  const filteredDepo = (depo || []).filter(item => 
    depoFilter === 'Hepsi' ? true : item.mainCat === depoFilter
  );

  const handleSave = () => {
    if (!editName.trim()) return toast.error('Ürün ismi boş olamaz');
    updateDepoItem(editingItem.id, {
      name: editName.trim(),
      mainCat: editCategory,
      totalQty: Number(editQty)
    });
    setEditingItem(null);
  };

  return (
    <div className="depo-view animate-fadeIn">
      <div className="section-header-v2">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Package size={22} color="var(--ev)" />
          <h3 style={{ margin: 0 }}>Akıllı Ev Deposu</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <small className="stat-badge">{filteredDepo.length} Ürün Grubu</small>
          {depo?.length > 0 && (
            <button className="icon-btn-mini" onClick={() => { 
              requestConfirm('Tüm depoyu sıfırlamak istediğinize emin misiniz?', () => clearDepo());
            }} title="Depoyu Sıfırla">
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="depo-filters mt-12 mb-12">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`filter-chip ${depoFilter === cat ? 'active' : ''}`}
            onClick={() => setDepoFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="depo-list-v3">
        {filteredDepo.length === 0 ? (
          <div className="empty-state-v2 glass" style={{ padding: '40px', textAlign: 'center' }}>
            <Package size={40} opacity={0.2} style={{ marginBottom: '12px' }} />
            <p style={{ opacity: 0.5, fontSize: '13px' }}>Bu kategoride ürün bulunamadı. ✨</p>
          </div>
        ) : (
          filteredDepo.map(item => (
            <div key={item.id} className={`depo-master-card ${expandedItem === item.id ? 'expanded' : ''}`} onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}>
              <div className="dmc-main">
                <div className="dmc-icon-box">
                  {item.mainCat === 'Gardırop' ? '👕' : (item.mainCat === 'Teknoloji' ? '💻' : '📦')}
                </div>
                <div className="dmc-info">
                  <div className="dmc-top-row">
                    <strong className="dmc-name">{item.name || item.nm || 'İsimsiz Ürün'}</strong>
                    <span className="dmc-qty-pill">{(item.totalQty || item.qt || '1').toString().split(' ')[0]} Adet</span>
                  </div>
                  <div className="dmc-meta-row">
                    <span><Calendar size={10} /> İlk: {new Date(item.firstDate || item.dt).toLocaleDateString('tr-TR')}</span>
                    <span><Clock size={10} /> Son: {new Date(item.lastDate || item.dt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <div className="dmc-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button className="dmc-edit-btn" onClick={(e) => { 
                    e.stopPropagation(); 
                    setEditingItem(item);
                    setEditName(item.name || item.nm || '');
                    setEditCategory(item.mainCat || 'Genel');
                    setEditQty(item.totalQty || item.qt || 1);
                  }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                    <Edit2 size={14} />
                  </button>
                  <button className="dmc-del-btn" onClick={(e) => { 
                    e.stopPropagation(); 
                    requestConfirm('Tüm ürün kaydı silinsin mi?', () => deleteDepoItem(item.id));
                  }}>
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={16} className={`dmc-chevron ${expandedItem === item.id ? 'rotated' : ''}`} style={{ transition: 'transform 0.2s' }} />
                </div>
              </div>

              {expandedItem === item.id && (
                <div className="dmc-details animate-fadeIn">
                  <div className="details-header">📜 İşlem Geçmişi</div>
                  <div className="history-timeline">
                    {(item.history || []).map(log => (
                      <div key={log.id} className="history-item">
                        <div className="hi-dot" />
                        <div className="hi-content">
                          <div className="hi-top">
                            <small>{new Date(log.date).toLocaleDateString('tr-TR')} {new Date(log.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</small>
                            <span className={`hi-source-badge ${log.source}`}>{log.source === 'valiz' ? '🎒 Valiz' : '🛒 Alışveriş'}</span>
                          </div>
                          <p>{log.note} - <strong>{log.qty} Adet</strong> {log.pr > 0 && `(${formatMoney(log.pr)})`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ActionSheet 
        isOpen={!!editingItem} 
        onClose={() => setEditingItem(null)} 
        title="Depo Ürününü Düzenle"
      >
        <div className="premium-form-container">
          <div className="form-group-premium">
            <label>Ürün İsmi</label>
            <input 
              type="text" 
              value={editName} 
              onChange={e => setEditName(e.target.value)} 
              placeholder="Ürün adı..." 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div className="form-group-premium">
            <label>Kategori</label>
            <div className="category-selector-chips" style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              {['Gardırop', 'Teknoloji', 'Genel'].map(cat => (
                <button
                  type="button"
                  key={cat}
                  className={`filter-chip ${editCategory === cat ? 'active' : ''}`}
                  onClick={() => setEditCategory(cat)}
                  style={{ 
                    flex: 1, 
                    padding: '10px', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    border: '1px solid rgba(0,0,0,0.05)',
                    fontSize: '13px',
                    fontWeight: editCategory === cat ? 'bold' : 'normal'
                  }}
                >
                  {cat === 'Gardırop' ? '👕 Gardırop' : (cat === 'Teknoloji' ? '💻 Teknoloji' : '📦 Genel')}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group-premium">
            <label>Miktar (Adet)</label>
            <div className="qty-stepper" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              <button 
                type="button" 
                onClick={() => setEditQty(q => Math.max(1, q - 1))}
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  border: 'none', 
                  background: 'rgba(0,0,0,0.05)', 
                  fontSize: '18px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                -
              </button>
              <span style={{ fontSize: '16px', fontWeight: 'bold', minWidth: '32px', textAlign: 'center' }}>{editQty}</span>
              <button 
                type="button" 
                onClick={() => setEditQty(q => q + 1)}
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  border: 'none', 
                  background: 'rgba(0,0,0,0.05)', 
                  fontSize: '18px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button 
              type="button" 
              className="submit-btn-premium secondary" 
              onClick={() => setEditingItem(null)}
              style={{ flex: 1, background: 'rgba(0,0,0,0.05)', color: '#64748b', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
            >
              İptal
            </button>
            <button 
              type="button" 
              className="submit-btn-premium" 
              onClick={handleSave}
              style={{ flex: 1, background: 'var(--ev)', color: 'white', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
            >
              Kaydet
            </button>
          </div>
        </div>
      </ActionSheet>
    </div>
  );
}


