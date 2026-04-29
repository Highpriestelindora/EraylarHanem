import React, { useState, useMemo, useEffect } from 'react';
import { 
  Lightbulb, Wrench, ShieldCheck, 
  CheckCircle2, Plus, Trash2, Edit2, 
  AlertTriangle, DollarSign, Calendar, Sparkles, Clock,
  Droplets, Zap, Flame, Globe, ChevronRight, ChevronDown,
  Shield, Key, Phone, User, Star, MoreVertical,
  PlusCircle, ArrowLeft, Camera, Settings, Info,
  Building, FileText, Landmark, Home, MapPin, Package, RotateCcw, Wallet, ArrowRight, Search, AlertCircle, ShoppingCart, ShoppingBasket, ShoppingBag, Eye, EyeOff, QrCode,
  Book, Lock, Unlock, MousePointer2, Stamp as StampIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ActionSheet from '../components/ActionSheet';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import './Ev.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const formatMoney = (val) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);


export default function Ev() {
  const [activeTab, setActiveTab] = useState('yasam');
  const [showWifiMain, setShowWifiMain] = useState(false);
  const navigate = useNavigate();
  const { 
    ev, kasa, users, currentUser, setCurrentUser,
    updateHomeSecurity, 
    updateTasinmaz, addTasinmaz, deleteTasinmaz,
    addPeriodicBakim, updatePeriodicBakim, resetPeriodicBakim, deletePeriodicBakim,
    deleteDepoItem, clearDepo,
    addOnarimItem, toggleOnarimItem, clearCompletedOnarimItems,
    addAbonelik, updateAbonelik, deleteAbonelik,
    addDuzenliOdeme, updateDuzenliOdeme, deleteDuzenliOdeme,
    addFinanceExpense, updateLocationSettings
  } = useStore();

  const { 
    faturalar = [], demirbaslar = [],
    ustaRehberi = [], abonelikler = [], bitkiler = [], guvenlik = {}, yillikPlan = [], depo = []
  } = ev || {};
  
  const onarimListesi = Array.isArray(ev?.onarimListesi) ? ev.onarimListesi : [];
  const bakimlar = Array.isArray(ev?.bakimlar) ? ev.bakimlar : [];

  const [showSafeCode, setShowSafeCode] = useState(false);
  const [faturaForm, setFaturaForm] = useState({ name: '', amount: '', provider: '', dueDate: '', icon: '📜' });
  const [editingTasinmaz, setEditingTasinmaz] = useState(null);
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
  const [faturaInput, setFaturaInput] = useState(null); // For manual amount entry

  // State Migration & Initialization for Abonelik/Fatura/Kartlar
  React.useEffect(() => {
    if (activeTab === 'abonelik') {
      const state = useStore.getState();

      // Ensure Credit Cards are initialized
      if (!ev.finans?.kartlar || ev.finans.kartlar.length === 0) {
        const defaultKartlar = [
          { id: 'gorkem-ziraat', name: 'Ziraat Kart', owner: 'Görkem', type: 'Credit', color: '#e11d48' },
          { id: 'gorkem-ykb', name: 'Yapı Kredi', owner: 'Görkem', type: 'Credit', color: '#2563eb' },
          { id: 'esra-garanti', name: 'Garanti Bonus', owner: 'Esra', type: 'Credit', color: '#16a34a' },
          { id: 'esra-enpara', name: 'Enpara Kart', owner: 'Esra', type: 'Debit/Credit', color: '#10b981' }
        ];
        state.updateHomeSecurity('finans', { ...ev.finans, kartlar: defaultKartlar });
      }

      // Ensure Regular Payments are initialized
      if (!ev.duzenliOdemeler || ev.duzenliOdemeler.length === 0) {
        const defaultDuzenli = [
          { id: 201, name: 'Site Aidatı', amount: 1500, date: 1, linkedCardId: 'esra-garanti', autoPay: true, icon: '🏢' },
          { id: 202, name: 'Bireysel Emeklilik (BES)', amount: 2500, date: 5, linkedCardId: 'gorkem-ziraat', autoPay: true, icon: '🛡️' },
          { id: 203, name: 'Kira Ödemesi', amount: 0, date: 1, linkedCardId: 'gorkem-ykb', autoPay: false, icon: '🔑' }
        ];
        state.updateHomeSecurity('duzenliOdemeler', defaultDuzenli);
      }
    }
  }, [activeTab]);

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

  // Location Tracker Hook
  useEffect(() => {
    const logTimeSlice = useStore.getState().logTimeSlice;
    if (!navigator.geolocation) return;

    let lastLogTime = 0;
    const logInterval = 15 * 60 * 1000; // 15 minutes

    const watchId = navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const { home, work } = ev.tracking || {};
      
      let currentZone = 'other';
      if (home && calculateDistance(latitude, longitude, home.lat, home.lng) * 1000 < (home.radius || 100)) {
        currentZone = 'home';
      } else if (work && calculateDistance(latitude, longitude, work.lat, work.lng) * 1000 < (work.radius || 200)) {
        currentZone = 'work';
      }

      const now = Date.now();
      if (now - lastLogTime > logInterval) {
        logTimeSlice(currentZone, 15);
        lastLogTime = now;
      }
    }, (err) => console.warn(err), { enableHighAccuracy: true });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [ev.tracking]);

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

  const aiNote = useMemo(() => {
    const totalCurrent = (faturalar || []).filter(f => f.status === 'Ödendi').reduce((a, b) => a + b.amount, 0);
    if (totalCurrent > 3000) return "Bu ay enerji tüketimi normalin %15 üzerinde. Bir sızıntı veya kaçak olabilir mi? 🕵️‍♂️";
    return "Harika! Ev verimliliği bu ay yeşil bölgede. 🌟";
  }, [faturalar]);

  const tabs = [
    { id: 'yasam', label: 'Yaşam', emoji: '🪴' },
    { id: 'bakim', label: 'Bakım', emoji: '🔧' },
    { id: 'abonelik', label: 'Abone', emoji: '💳' },
    { id: 'tasinmaz', label: 'Taşınmaz', emoji: '🏗️' },
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

  const getAggregatedData = (daysCount) => {
    const routine = ev.tracking?.routine || {};
    const stats = { home: 0, work: 0, other: 0 };
    const logs = ev.tracking?.logs || [];
    const habits = ev.tracking?.weeklyHabits || {};
    
    for (let d = 0; d < daysCount; d++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - d);
      const dateStr = targetDate.toISOString().split('T')[0];
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][targetDate.getDay()];
      
      for (let i = 0; i < 96; i++) {
        const timeMs = new Date().setHours(0, i * 15, 0, 0);
        const timeStr = new Date(timeMs).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
        const hourStr = timeStr.split(':')[0];
        const habitKey = `${dayName}-${hourStr}`;
        
        const log = logs.find(l => 
          l.date === dateStr && 
          Math.abs(l.timestamp - (new Date(dateStr).setHours(0, i * 15, 0, 0))) < 7.5 * 60 * 1000
        );
        
        if (log) {
          stats[log.type] += 15;
        } else {
          const habit = habits[habitKey];
          if (habit && (habit.home > 0 || habit.work > 0 || habit.other > 0)) {
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
      labels: ['Ev', 'İş', 'Diğer'],
      datasets: [{
        data: [
          Math.round((stats.home / total) * 100),
          Math.round((stats.work / total) * 100),
          Math.round((stats.other / total) * 100)
        ],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    };
  };

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
              id="header-depo-btn"
              className={`icon-btn ${activeTab === 'depo' ? 'active' : ''}`} 
              onClick={() => setActiveTab(prev => prev === 'depo' ? 'yasam' : 'depo')} 
              title="Ev Deposu"
              style={{ 
                background: activeTab === 'depo' ? 'white' : 'rgba(255,255,255,0.2)', 
                color: activeTab === 'depo' ? 'var(--ev)' : 'white', 
                border: '1px solid rgba(255,255,255,0.3)',
                marginRight: '8px'
              }}
            >
              <Package size={20} color={activeTab === 'depo' ? 'var(--ev)' : 'white'} />
            </button>
            <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menüye Dön">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        <nav className="tab-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ fontSize: '16px', marginBottom: '2px' }}>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <div className="ev-scroll-content">
        {activeTab === 'depo' && (
          <DepoView 
            depo={ev.depo} 
            deleteDepoItem={deleteDepoItem} 
            clearDepo={clearDepo} 
            requestConfirm={requestConfirm}
          />
        )}

        {activeTab === 'yasam' && (
          <div className="yasam-view animate-fadeIn">
            {/* 1. Today's Advice Motor (NOW TOP) */}
            <div className="advice-motor-card glass mb-20">
               <div className="am-header">
                 <div className="am-title">
                   <Sparkles size={20} color="var(--ev)" />
                   <h3>Bugün Ne Yapmalıyım?</h3>
                 </div>
                 <div className="active-user-badge">
                   {currentUser?.name === 'Esra' ? '👩‍🍳 Esra' : '👨‍💻 Görkem'}
                 </div>
               </div>
               
               <div className="am-body">
                  <div className="ai-status-pulse"></div>
                  <div className="advice-bubble">
                    {activeWarnings.length > 0 ? (
                      <p>{activeWarnings[0]}</p>
                    ) : (
                      <p>{aiNote}</p>
                    )}
                  </div>
               </div>

               <button className="refresh-advice-btn" onClick={() => toast.success('Yeni tavsiyeler hazırlanıyor... 🤖')}>
                 Başka Bir Tavsiye Al
               </button>
            </div>

            {/* 2. Time Analysis Card (NOW A FULL DASHBOARD) */}
            <div className="time-analysis-module glass mb-20">
               <div className="section-header-v2">
                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                   <h3>📊 Yaşam Dengesi Analizi</h3>
                   <p className="am-sub">Öğrenilen alışkanlıklar ve gerçek logların sentezi</p>
                 </div>
                 <div className="active-user-badge">
                   {currentUser?.name === 'Esra' ? '👩‍🍳 Esra' : '👨‍💻 Görkem'}
                 </div>
               </div>
               
               <div className="analysis-grid">
                  {/* HAFTALIK GRAFİK */}
                  <div className="analysis-chart-item">
                    <div className="chart-title-mini">HAFTALIK</div>
                    <div className="chart-rel-container">
                      <Doughnut 
                        data={getAggregatedData(7)}
                        options={doughnutOptions}
                      />
                      <div className="chart-center-label">
                        <span className="val">7g</span>
                      </div>
                    </div>
                  </div>

                  {/* AYLIK GRAFİK */}
                  <div className="analysis-chart-item">
                    <div className="chart-title-mini">AYLIK</div>
                    <div className="chart-rel-container">
                      <Doughnut 
                        data={getAggregatedData(30)}
                        options={doughnutOptions}
                      />
                      <div className="chart-center-label">
                        <span className="val">30g</span>
                      </div>
                    </div>
                  </div>
               </div>

               {/* Veri Detayları & Açıklamalar */}
               <div className="analysis-metrics mt-12">
                  {['Ev', 'İş', 'Diğer'].map((label, idx) => {
                    const weeklyData = getAggregatedData(7).datasets[0].data;
                    const colors = ['#10b981', '#3b82f6', '#f59e0b'];
                    return (
                      <div key={label} className="metric-tag" style={{ borderLeft: `3px solid ${colors[idx]}` }}>
                        <span className="m-label">{label}</span>
                        <span className="m-val">%{weeklyData[idx]}</span>
                      </div>
                    );
                  })}
               </div>

               <div className="analysis-info-box mt-16">
                 <Info size={14} color="#64748b" />
                 <p>Yüzdeler, son 30 günlük verileriniz ve rutin alışkanlıklarınızın ortalamasını temsil eder. <strong>34-32-35</strong> gibi değerler, toplam zamanınızın hangi kategoriye ne kadar dağıldığını gösterir.</p>
               </div>
               
               <div className="tracking-setup mt-16 pt-16 border-t" style={{ borderTop: '1px solid var(--brd)', display: 'flex', gap: '8px' }}>
                 <button className="setup-btn-compact" onClick={() => {
                   navigator.geolocation.getCurrentPosition(p => {
                     updateLocationSettings('home', { lat: p.coords.latitude, lng: p.coords.longitude });
                   });
                 }}>🏠 Ev Konumu</button>
                 <button className="setup-btn-compact" onClick={() => {
                   navigator.geolocation.getCurrentPosition(p => {
                     updateLocationSettings('work', { lat: p.coords.latitude, lng: p.coords.longitude });
                   });
                 }}>🏢 İş Konumu</button>
               </div>

               <div className="ai-interpretation mt-12">
                 <Sparkles size={14} color="#10b981" />
                 <p>{ev.timeAnalysis[currentUser?.name?.toLowerCase() === 'esra' ? 'esra' : 'gorkem'].interpretation}</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'tasinmaz' && (
          <div className="tasinmaz-view animate-fadeIn">
            <div className="portfolio-total glass mb-16">
              <div className="pt-info">
                <span>Toplam Gayrimenkul Değeri</span>
                <strong>{formatMoney((kasa?.tasinmazlar || []).reduce((a, b) => a + (Number(b.value) || 0), 0))}</strong>
              </div>
              <Building size={32} opacity={0.2} />
            </div>

            <div className="section-header-v2">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3>🏗️ Gayrimenkul Portföyü</h3>
                <small style={{ opacity: 0.5 }}>{kasa?.tasinmazlar?.length || 0} Adet Taşınmaz</small>
              </div>
              <button className="add-btn-mini" onClick={() => setEditingTasinmaz({ isNew: true })}><Plus size={14} /></button>
            </div>

            <div className="tasinmaz-grid">
              {(kasa?.tasinmazlar || []).map(t => {
                const netIncome = (Number(t.income) || 0) - (Number(t.expense) || 0);
                return (
                  <div key={t.id} className="tasinmaz-card-premium glass">
                    <div className="tc-header">
                      <div className="tc-icon-box">{t.icon || '🏠'}</div>
                      <div className="tc-main-info">
                        <strong>{t.name}</strong>
                        <div className="tc-technical">
                          <small><MapPin size={10} /> {t.city} / {t.district}</small>
                          <small><FileText size={10} /> {t.adaParsel}</small>
                        </div>
                      </div>
                      <div className="tc-status-pill" style={{ background: t.status === 'Mülk Sahibi' ? '#dcfce7' : '#fef3c7', color: t.status === 'Mülk Sahibi' ? '#15803d' : '#b45309' }}>
                        {t.status}
                      </div>
                    </div>

                    <div className="tc-tax-reminder mt-12 mb-12">
                       {new Date().getMonth() === 4 || new Date().getMonth() === 10 ? (
                         <div className="tax-alert-badge warn">
                           <AlertTriangle size={14} /> Emlak Vergisi Dönemi!
                         </div>
                       ) : (
                         <div className="tax-alert-badge info">
                           <Info size={14} /> Sonraki Vergi: {new Date().getMonth() < 4 ? 'Mayıs' : 'Kasım'}
                         </div>
                       )}
                    </div>

                    <div className="tc-financial-summary">
                      <div className="tc-fin-item">
                        <span>Piyasa Değeri</span>
                        <strong>{formatMoney(t.value)}</strong>
                      </div>
                      <div className="tc-fin-item">
                        <span>Net Getiri / Ay</span>
                        <strong style={{ color: netIncome > 0 ? '#10b981' : (netIncome < 0 ? '#ef4444' : 'inherit') }}>
                          {netIncome > 0 ? '+' : ''}{formatMoney(netIncome)}
                        </strong>
                      </div>
                    </div>

                    <div className="tc-details-grid">
                      <div className="tc-detail-item">
                        <small>Alan</small>
                        <span>{t.area} m²</span>
                      </div>
                      <div className="tc-detail-item">
                        <small>Vergi Durumu</small>
                        <span className={t.taxPaid ? 'green' : 'red'}>
                          {t.taxPaid ? '✅ Ödendi' : '⚠️ Bekliyor'}
                        </span>
                      </div>
                      <div className="tc-detail-item">
                        <small>Yıllık Vergi</small>
                        <span>{formatMoney(t.tax)}</span>
                      </div>
                    </div>

                    <div className="tc-actions-v2">
                      <button className="tc-manage-btn" onClick={() => setEditingTasinmaz(t)}>
                        <Settings size={14} /> Yönet & Düzenle
                      </button>
                    </div>
                  </div>
                );
              })}
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
                         onClick={() => {
                           const userKey = currentUser?.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra';
                           toggleOnarimItem(item.id, userKey);
                         }}
                       >
                         <div className="tcv2-check">
                           {item.status === 'Completed' ? <CheckCircle2 size={18} color="#22c55e" /> : <div className="circle-check-v2" />}
                         </div>
                         <div className="tcv2-info">
                           <span className="tcv2-task">{item.task}</span>
                           <div className="tcv2-meta">
                             <small>
                               {createdUser.emoji} {createdUser.name.split(' ')[0]} • {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                             </small>
                             {item.status === 'Completed' && item.completedBy && (
                               <small style={{ color: '#22c55e' }}>
                                 • ✅ {users[item.completedBy]?.name.split(' ')[0]} tarafından tamamlandı
                               </small>
                             )}
                           </div>
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
            <div className="section-header-v2">
              <h3>💳 Abonelikler & Düzenli Ödemeler</h3>
              <button className="add-btn-mini" title="Yeni Abonelik Ekle" onClick={() => setEditingAbo({ name: '', amount: 0, date: 1, linkedCardId: '', autoPay: true, icon: '🎬', startDate: '' })}>
                <Plus size={14} />
              </button>
            </div>



            {/* 1. ABONELİKLER LIST */}
            <div className="abo-list-section">
              <h4 className="abo-sub-title">Aktif Abonelikler</h4>
              <div className="vize-style-grid">
                {abonelikler.map(abo => (
                  <div key={abo.id} className="vize-card glass">
                    <div className="vize-flag">{abo.icon || '🎬'}</div>
                    <div className="vize-info">
                      <strong>{abo.name}</strong>
                      <span>{formatMoney(abo.amount)} • Her ayın {abo.date}. günü</span>
                    </div>
                    <div className="vize-badge paid">Aktif</div>
                    <div className="vize-actions">
                      <button className="vize-edit" onClick={() => setEditingAbo(abo)}><Edit2 size={16} /></button>
                      <button className="vize-delete" onClick={() => requestConfirm(`${abo.name} aboneliğini silmek istediğinize emin misiniz?`, () => deleteAbonelik(abo.id))}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. DÜZENLİ ÖDEMELER LIST */}
            <div className="abo-list-section mt-24">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 className="abo-sub-title">Düzenli Ödemeler (Aidat, BES vb.)</h4>
                <button className="fatura-giris-btn" onClick={() => setEditingFatura({ name: '', amount: 0, linkedCardId: '', icon: '🔧' })}>
                   <Wrench size={12} /> Harcama/Fatura Gir
                </button>
              </div>
              <div className="vize-style-grid">
                {(ev.duzenliOdemeler || []).map(d => (
                  <div key={d.id} className="vize-card glass">
                    <div className="vize-flag">{d.icon || '🏢'}</div>
                    <div className="vize-info">
                      <strong>{d.name}</strong>
                      <span>{formatMoney(d.amount)} • Her ayın {d.date}. günü</span>
                    </div>
                    <div className="vize-badge paid">Planlı</div>
                    <div className="vize-actions">
                      <button className="vize-edit" onClick={() => setEditingAbo({...d, _type: 'duzenli'})}><Edit2 size={16} /></button>
                      <button className="vize-delete" onClick={() => requestConfirm(`${d.name} kaydını silmek istediğinize emin misiniz?`, () => deleteDuzenliOdeme(d.id))}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
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
                          <span className="handwriting-pass">MAUMFUFTH74L</span>
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
                       <span className="handwriting-pass">Love2013</span>
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
        title={editingAbo?.id ? 'Abonelik Düzenle' : 'Yeni Abonelik'}
      >
        {editingAbo && (
          <div className="edit-form-v2">
            <div className="form-group-v2">
              <label>Abonelik Adı</label>
              <input 
                type="text" 
                value={editingAbo.name} 
                onChange={(e) => setEditingAbo({...editingAbo, name: e.target.value})}
                placeholder="Örn: Netflix"
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
              <label>Ödeme Yöntemi (Kredi Kartı)</label>
              <select 
                value={editingAbo.linkedCardId} 
                onChange={(e) => setEditingAbo({...editingAbo, linkedCardId: e.target.value})}
              >
                <option value="">Kart Seçin</option>
                {(ev.finans?.kartlar || []).map(k => (
                  <option key={k.id} value={k.id}>{k.name} ({k.owner})</option>
                ))}
              </select>
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
              <label>Ödeme Yöntemi</label>
              <select 
                value={editingFatura.linkedCardId} 
                onChange={(e) => setEditingFatura({...editingFatura, linkedCardId: e.target.value})}
              >
                <option value="">Seçiniz</option>
                <optgroup label="Cüzdan & Nakit">
                  <option value="nakit">💵 Nakit</option>
                  <option value="havale">💸 EFT / Havale</option>
                </optgroup>
                <optgroup label="Kredi Kartları">
                  {(ev.finans?.kartlar || []).map(k => (
                    <option key={k.id} value={k.id}>{k.name} ({k.owner})</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <button className="save-btn-v2" onClick={() => {
              if(!editingFatura.name || !editingFatura.amount) return toast.error('Lütfen isim ve tutar girin');
              addFinanceExpense(editingFatura);
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

      {/* ActionSheet for One-time Maintenance/Repair */}
      <ActionSheet
        isOpen={!!editingOnarim}
        onClose={() => setEditingOnarim(null)}
        title="Yeni Bakım & Onarım Görevi"
      >
        {editingOnarim && (
          <div className="edit-form-v2">
            <div className="form-group-v2">
              <label>Yapılacak İşlem / Alınacak Parça</label>
              <textarea 
                className="form-group-v2 input"
                style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--brd)', background: '#f8fafc', fontSize: '14px', fontWeight: '600', outline: 'none', minHeight: '80px', fontFamily: 'inherit' }}
                placeholder="Örn: Mutfak musluğu contası değişecek"
                value={editingOnarim.task}
                onChange={(e) => setEditingOnarim({...editingOnarim, task: e.target.value})}
              />
            </div>
            <button className="save-btn-v2" onClick={() => {
              if(!editingOnarim.task) return toast.error('Lütfen görev açıklaması girin');
              const userKey = currentUser?.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra';
              addOnarimItem(editingOnarim.task, userKey);
              setEditingOnarim(null);
            }}>Listeye Ekle</button>
          </div>
        )}
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


function ManageTasinmazContent({ data, onClose, requestConfirm }) {
  const { addTasinmaz, updateTasinmaz, deleteTasinmaz } = useStore();
  const [form, setForm] = useState(data.isNew ? {
    name: '', city: '', district: '', neighborhood: '',
    type: '', adaParsel: '', unit: '', floor: '', area: '', share: '',
    nitelik: '', propertyNo: '', icon: '🏢', status: 'Mülk Sahibi',
    income: 0, expense: 0, tax: 0, taxPaid: false, value: 0
  } : data);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.isNew) {
      addTasinmaz(form);
    } else {
      updateTasinmaz(data.id, form);
      toast.success('Değişiklikler kaydedildi! ✨');
    }
    onClose();
  };

  return (
    <form className="modal-form-premium" onSubmit={handleSubmit}>
      <div className="form-section-premium">
        <h4><Info size={16} /> Genel Bilgiler</h4>
        <div className="form-group">
          <label>Taşınmaz Adı</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Örn: Antalya Kepez Daire" required />
        </div>
        <div className="form-row">
          <div className="form-group"><label>Şehir</label><input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="İl" /></div>
          <div className="form-group"><label>İlçe</label><input type="text" value={form.district} onChange={e => setForm({...form, district: e.target.value})} placeholder="İlçe" /></div>
        </div>
        <div className="form-group">
          <label>Nitelik / Tip</label>
          <input type="text" value={form.nitelik} onChange={e => setForm({...form, nitelik: e.target.value})} placeholder="Örn: Mesken, Arsa..." />
        </div>
      </div>

      <div className="form-section-premium mt-24">
        <h4><FileText size={16} /> Tapu & Teknik Detaylar</h4>
        <div className="form-row">
          <div className="form-group"><label>Ada/Parsel</label><input type="text" value={form.adaParsel} onChange={e => setForm({...form, adaParsel: e.target.value})} /></div>
          <div className="form-group"><label>Alan (m²)</label><input type="text" value={form.area} onChange={e => setForm({...form, area: e.target.value})} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Kat</label><input type="text" value={form.floor} onChange={e => setForm({...form, floor: e.target.value})} /></div>
          <div className="form-group"><label>Bağımsız Bölüm</label><input type="text" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Arsa Payı</label><input type="text" value={form.share} onChange={e => setForm({...form, share: e.target.value})} /></div>
          <div className="form-group"><label>Taşınmaz No</label><input type="text" value={form.propertyNo} onChange={e => setForm({...form, propertyNo: e.target.value})} /></div>
        </div>
      </div>

      <div className="form-section-premium mt-24">
        <h4><DollarSign size={16} /> Finansal Durum</h4>
        <div className="form-group">
          <label>Tahmini Piyasa Değeri (₺)</label>
          <input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} />
        </div>
        <div className="form-row">
          <div className="form-group"><label>Aylık Kira (Getiri)</label><input type="number" value={form.income} onChange={e => setForm({...form, income: e.target.value})} /></div>
          <div className="form-group"><label>Aylık Gider (Götürü)</label><input type="number" value={form.expense} onChange={e => setForm({...form, expense: e.target.value})} /></div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Emlak Vergisi (Yıllık)</label>
            <input type="number" value={form.tax} onChange={e => setForm({...form, tax: e.target.value})} />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '20px' }}>
             <input type="checkbox" checked={form.taxPaid} onChange={e => setForm({...form, taxPaid: e.target.checked})} id="taxPaid" style={{ width: '20px', height: '20px' }} />
             <label htmlFor="taxPaid" style={{ margin: 0 }}>Vergi Ödendi</label>
          </div>
        </div>
      </div>

      <div className="form-section-premium mt-24">
        <label>Durum</label>
        <div className="user-select-grid">
           <button type="button" className={form.status === 'Mülk Sahibi' ? 'active' : ''} onClick={() => setForm({...form, status: 'Mülk Sahibi'})}>Mülk Sahibi</button>
           <button type="button" className={form.status === 'Kiracı Var' ? 'active' : ''} onClick={() => setForm({...form, status: 'Kiracı Var'})}>Kiracı Var</button>
        </div>
      </div>

      <div className="modal-actions-premium mt-32">
        {!data.isNew && (
          <button type="button" className="delete-btn-premium" onClick={() => { 
            requestConfirm('Bu taşınmazı silmek istediğinizden emin misiniz?', () => {
              deleteTasinmaz(data.id); 
              onClose(); 
            });
          }}>
            <Trash2 size={18} /> Sil
          </button>
        )}
        <button type="submit" className="submit-btn-premium" style={{ background: 'var(--ev)' }}>
          {data.isNew ? 'Taşınmazı Ekle' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </form>
  );
}

function DepoView({ depo, deleteDepoItem, clearDepo, requestConfirm }) {
  const [expandedItem, setExpandedItem] = useState(null);
  const [depoFilter, setDepoFilter] = useState('Hepsi');
  const categories = ['Hepsi', 'Gardırop', 'Teknoloji', 'Genel'];

  const filteredDepo = (depo || []).filter(item => 
    depoFilter === 'Hepsi' ? true : item.mainCat === depoFilter
  );

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
                <div className="dmc-actions">
                  <button className="dmc-del-btn" onClick={(e) => { 
                    e.stopPropagation(); 
                    requestConfirm('Tüm ürün kaydı silinsin mi?', () => deleteDepoItem(item.id));
                  }}>
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={16} className={`dmc-chevron ${expandedItem === item.id ? 'rotated' : ''}`} />
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
    </div>
  );
}
