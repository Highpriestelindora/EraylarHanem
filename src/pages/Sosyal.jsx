import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { 
  Calendar, Activity, Archive, Lightbulb, 
  CheckCircle2, Plus, Trash2, Star, 
  MapPin, Home as HomeIcon, Clock, ArrowRight,
  Layers, CreditCard, Smile, ArrowLeft, X, Sparkles,
  RotateCcw, Edit3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_SOCIAL_POOL, SOCIAL_ROUTINES } from '../constants/data';
import ConfirmModal from '../components/ConfirmModal';
import Portal from '../components/Portal';
import ActionSheet from '../components/ActionSheet';
import './Sosyal.css';

const MOTIVATION_QUOTES = [
  "Birlikte planlanan her gün, paylaşılan yeni bir mutluluktur. ✨",
  "Küçük adımlar, büyük anıların başlangıcıdır. 👫",
  "Bugün yeni bir macera için harika bir gün! 🌟",
  "Hayat paylaştıkça güzel, planladıkça kolaydır. 📋",
  "Birbirinize ayırdığınız her dakika en değerli yatırımdır. ❤️",
  "Mutluluk bir durak değil, beraber gidilen bir yoldur. 🗺️",
  "Bugünün planı: Gülümse, sev ve anı yaşa! 😊",
  "En güzel hikayeler, beraber yazılanlardır. ✍️"
];

const getDailyQuote = () => {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return MOTIVATION_QUOTES[dayOfYear % MOTIVATION_QUOTES.length];
};

export default function Sosyal() {
  const { sosyal: rawSosyal, setModuleData } = useStore();
  
  // Normalize: ensure all array fields are actual arrays (localStorage may store {} instead of [])
  const sosyal = useMemo(() => ({
    ...rawSosyal,
    aktiviteler: Array.isArray(rawSosyal?.aktiviteler) ? rawSosyal.aktiviteler : [],
    havuz: Array.isArray(rawSosyal?.havuz) ? rawSosyal.havuz : [],
    rutinler: Array.isArray(rawSosyal?.rutinler) ? rawSosyal.rutinler : [],
  }), [rawSosyal]);

  const [activeTab, setActiveTab] = useState(sosyal.tab || 'hafta');
  const [showAddActivity, setShowAddActivity] = useState(null); // null or { date, prefilledData }
  const [showAddRutin, setShowAddRutin] = useState(false);
  const [showAddFikir, setShowAddFikir] = useState(false);
  const navigate = useNavigate();

  const updateTab = (tab) => {
    setActiveTab(tab);
    setModuleData('sosyal', { ...sosyal, tab });
  };

  const tabs = [
    { id: 'hafta', emoji: '📅', label: 'Plan' },
    { id: 'rutin', emoji: '🔁', label: 'Rutin' },
    { id: 'havuz', emoji: '💡', label: 'Fikirler' },
    { id: 'ist', emoji: '🌆', label: 'İstanbul' }
  ];

  const [showEditHistory, setShowEditHistory] = useState(null);
  const [deletingHistoryId, setDeletingHistoryId] = useState(null);
  const { cancelSocialActivity } = useStore();

  return (
    <AnimatedPage className="sosyal-container">
      <header className="module-header glass" style={{ background: 'var(--social)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">👫</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Sosyal</h1>
              <p className="motivation-quote animate-fadeIn">{getDailyQuote()}</p>
            </div>
          </div>
          <div className="header-actions">
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
              onClick={() => updateTab(tab.id)}
            >
              <span style={{ fontSize: '16px', marginBottom: '2px' }}>{tab.emoji}</span>
              <span>{tab.label}</span>
              {activeTab === tab.id && <div className="tab-dot" />}
            </button>
          ))}
        </nav>
      </header>

      <div className="tab-content">
        {activeTab === 'hafta' && <HaftaTab sosyal={sosyal} onAdd={(date, data) => setShowAddActivity({ date, prefilledData: data })} />}
        {activeTab === 'rutin' && <RutinTab sosyal={sosyal} onAdd={() => setShowAddRutin(true)} />}
        {activeTab === 'havuz' && <HavuzTab sosyal={sosyal} onAdd={() => setShowAddFikir(true)} />}
        {activeTab === 'ist' && <IstTab onAdd={(date, data) => setShowAddActivity({ date, prefilledData: data })} />}
      </div>

      <ActionSheet
        isOpen={!!showAddActivity}
        onClose={() => setShowAddActivity(null)}
        title="📅 Aktivite Planla"
      >
        <AddActivityModal 
          onClose={() => setShowAddActivity(null)} 
          initialDate={showAddActivity?.date || (typeof showAddActivity === 'string' ? showAddActivity : null)} 
          prefilledData={showAddActivity?.prefilledData}
        />
      </ActionSheet>
      <ActionSheet
        isOpen={showAddRutin}
        onClose={() => setShowAddRutin(false)}
        title="🏋️ Rutin Ekle"
      >
        <AddRutinModal onClose={() => setShowAddRutin(false)} />
      </ActionSheet>
      <ActionSheet
        isOpen={showAddFikir}
        onClose={() => setShowAddFikir(false)}
        title="💡 Fikir Ekle"
      >
        <AddFikirModal onClose={() => setShowAddFikir(false)} />
      </ActionSheet>

      <ActionSheet
        isOpen={!!showEditHistory}
        onClose={() => setShowEditHistory(null)}
        title="📝 Aktiviteyi Düzenle"
      >
        {showEditHistory && (
          <EditHistoryModal 
            activity={showEditHistory} 
            onClose={() => setShowEditHistory(null)} 
          />
        )}
      </ActionSheet>

      {deletingHistoryId && (
        <ConfirmModal 
          title="Aktiviteyi Sil"
          message="Bu geçmiş aktiviteyi silmek istediğine emin misin? Bu işlem geri alınamaz."
          onConfirm={() => {
            cancelSocialActivity(deletingHistoryId);
            setDeletingHistoryId(null);
            toast.success('Aktivite geçmişten silindi 🗑️');
          }}
          onCancel={() => setDeletingHistoryId(null)}
        />
      )}
    </AnimatedPage>
  );
}

function IstTab({ onAdd }) {
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const getDynamicDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const events = [
    { id: 'e1', title: 'Mert Demir Konseri', date: getDynamicDate(2), place: 'Harbiye Cemil Topuzlu', type: 'Konser', price: '₺800', img: '🎸', category: 'music' },
    { id: 'e2', title: 'Zengin Mutfağı', date: getDynamicDate(5), place: 'Maximum UNIQ Hall', type: 'Tiyatro', price: '₺450', img: '🎭', category: 'theater' },
    { id: 'e3', title: 'Dijital Sanat Sergisi', date: getDynamicDate(7), place: 'Tersane İstanbul', type: 'Sergi', price: '₺200', img: '🎨', category: 'art' },
    { id: 'e4', title: 'Boğazda Kahvaltı', date: getDynamicDate(1), place: 'Emirgan Korusu', type: 'Aktivite', price: '₺500', img: '🥨', category: 'outdoor' },
    { id: 'e5', title: 'Melike Şahin', date: getDynamicDate(12), place: 'Zorlu PSM', type: 'Konser', price: '₺1200', img: '🎤', category: 'music' },
    { id: 'e6', title: 'Bir Baba Hamlet', date: getDynamicDate(4), place: 'Moda Sahnesi', type: 'Tiyatro', price: '₺300', img: '🎭', category: 'theater' },
    { id: 'e7', title: 'Dune: Part Two', date: getDynamicDate(3), place: 'Kanyon Cinemaximum', type: 'Sinema', price: '₺180', img: '🎬', category: 'cinema' },
    { id: 'e8', title: 'Sushi Workshop', date: getDynamicDate(6), place: 'MSA Maslak', type: 'Atölye', price: '₺1500', img: '🍣', category: 'workshop' },
    { id: 'e9', title: 'Legoland Gezisi', date: getDynamicDate(8), place: 'Bayrampaşa Forum', type: 'Aile', price: '₺400', img: '🧱', category: 'outdoor' },
    { id: 'e10', title: 'Galata Kulesi Gezisi', date: getDynamicDate(2), place: 'Beyoğlu', type: 'Turist', price: '₺0', img: '🗼', category: 'outdoor' },
    { id: 'e11', title: 'Modern Sanat Sergisi', date: getDynamicDate(15), place: 'İstanbul Modern', type: 'Sergi', price: '₺150', img: '🖼️', category: 'art' },
    { id: 'e12', title: 'Seramik Atölyesi', date: getDynamicDate(9), place: 'Kadıköy Sanat', type: 'Atölye', price: '₺600', img: '🏺', category: 'workshop' },
  ];

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.category === filter);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Etkinlik listesi güncellendi! 🌆');
    }, 1200);
  };

  const planEvent = (e) => {
    onAdd(e.date, {
      baslik: e.title,
      emoji: e.img,
      mekan: e.place,
      harcama: e.price.replace('₺', ''),
      tur: 'disari'
    });
  };

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="section-header" style={{ padding: '0 20px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3>🌆 İstanbul'da Bu Hafta</h3>
          <p style={{ fontSize: '12px', opacity: 0.6 }}>Biletix, Passo ve İBB Kültür'den seçildi.</p>
        </div>
        <button className={`refresh-btn-round ${isLoading ? 'spinning' : ''}`} onClick={handleRefresh} disabled={isLoading}>
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="filter-scroll">
        <button className={`filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tümü</button>
        <button className={`filter-chip ${filter === 'music' ? 'active' : ''}`} onClick={() => setFilter('music')}>🎸 Konser</button>
        <button className={`filter-chip ${filter === 'theater' ? 'active' : ''}`} onClick={() => setFilter('theater')}>🎭 Tiyatro</button>
        <button className={`filter-chip ${filter === 'art' ? 'active' : ''}`} onClick={() => setFilter('art')}>🎨 Sergi</button>
        <button className={`filter-chip ${filter === 'cinema' ? 'active' : ''}`} onClick={() => setFilter('cinema')}>🎬 Sinema</button>
        <button className={`filter-chip ${filter === 'workshop' ? 'active' : ''}`} onClick={() => setFilter('workshop')}>🏺 Atölye</button>
        <button className={`filter-chip ${filter === 'outdoor' ? 'active' : ''}`} onClick={() => setFilter('outdoor')}>🌳 Açık Hava</button>
      </div>

      <div className="ist-event-list">
        {isLoading ? (
          <div className="loading-placeholder glass">
             <div className="spinner-mini" />
             <p>Etkinlikler taranıyor...</p>
          </div>
        ) : (
          filteredEvents.map(e => (
            <div key={e.id} className="event-card glass">
              <div className="e-visual">{e.img}</div>
              <div className="e-details">
                <div className="e-meta">
                  <span className="e-type">{e.type}</span>
                  <span className="e-price">{e.price}</span>
                </div>
                <h4 className="e-title">{e.title}</h4>
                <div className="e-info-row">
                  <MapPin size={12} />
                  <span>{e.place}</span>
                </div>
                <div className="e-info-row">
                  <Calendar size={12} />
                  <span>{new Date(e.date).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              <button className="e-add-btn" onClick={() => planEvent(e)} title="Plana Ekle">
                <Plus size={20} />
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="external-sources glass">
        <p style={{ fontSize: '12px', marginBottom: '10px', fontWeight: '600' }}>Daha Fazla Kaynak:</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
           <a href="https://www.biletix.com" target="_blank" rel="noreferrer" className="src-link">Biletix</a>
           <a href="https://www.passo.com.tr" target="_blank" rel="noreferrer" className="src-link">Passo</a>
           <a href="https://kultur.istanbul" target="_blank" rel="noreferrer" className="src-link">İBB Kültür</a>
        </div>
      </div>
    </div>
  );
}

function HaftaTab({ sosyal, onAdd }) {
  const { saglik, pet, tatil, aracim: vehicle, cancelSocialActivity, addSocialActivity } = useStore();
  const [completeModal, setCompleteModal] = useState(null); 
  const [editingActivity, setEditingActivity] = useState(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [deletingId, setDeletingId] = useState(null); 
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const [showAddNote, setShowAddNote] = useState(false);

  // --- SMART MULTI-MODULE SCANNER ---
  const allEvents = useMemo(() => {
    const events = [];

    // 1. Social Activities & Notes
    (Array.isArray(sosyal.aktiviteler) ? sosyal.aktiviteler : []).filter(a => !a.tamamlandi && a.durum !== 'iptal').forEach(a => {
      events.push({ 
        date: a.tarih, 
        icon: a.emoji || (a.tur === 'not' ? '📝' : '🎭'), 
        title: a.baslik, 
        color: a.tur === 'not' ? '#8b5cf6' : '#f59e0b', 
        type: 'social', 
        isNote: a.tur === 'not',
        originalItem: a 
      });
    });

    // 2. Health Appointments (Mandatory)
    (saglik.randevular || []).forEach(r => {
      events.push({ date: r.tarih, icon: '💊', title: r.brans || 'Doktor Randevusu', color: '#8b5cf6', type: 'health' });
    });

    // 3. Pet Vaccines - REMOVED AUTOMATIC ADDITION (As per user request)
    // Only activities explicitly planned (social module) will show up now.

    // 4. Trips (Only Confirmed) - Show all days
    (tatil?.trips || []).filter(t => t.status === 'kesin').forEach(t => {
      if (t.startDate && t.endDate) {
        const start = new Date(t.startDate);
        const end = new Date(t.endDate);
        const curr = new Date(start);
        
        while (curr <= end) {
          const dStr = curr.toISOString().split('T')[0];
          events.push({ 
            date: dStr, 
            icon: '✈️', 
            title: t.title || t.city, 
            color: '#0ea5e9', 
            type: 'trip' 
          });
          curr.setDate(curr.getDate() + 1);
        }
      } else if (t.startDate) {
        events.push({ date: t.startDate, icon: '✈️', title: t.title || t.city, color: '#0ea5e9', type: 'trip' });
      }
    });

    return events;
  }, [sosyal, saglik, pet, tatil]);

  // Türkiye Resmi Tatilleri 2026
  const TR_HOLIDAYS_2026 = {
    '2026-01-01': 'Yılbaşı',
    '2026-03-19': 'Ramazan Bayramı Arifesi',
    '2026-03-20': 'Ramazan Bayramı 1. Gün',
    '2026-03-21': 'Ramazan Bayramı 2. Gün',
    '2026-03-22': 'Ramazan Bayramı 3. Gün',
    '2026-04-23': 'Ulusal Egemenlik ve Çocuk Bayramı',
    '2026-05-01': 'Emek ve Dayanışma Günü',
    '2026-05-19': 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı',
    '2026-05-26': 'Kurban Bayramı Arifesi',
    '2026-05-27': 'Kurban Bayramı 1. Gün',
    '2026-05-28': 'Kurban Bayramı 2. Gün',
    '2026-05-29': 'Kurban Bayramı 3. Gün',
    '2026-05-30': 'Kurban Bayramı 4. Gün',
    '2026-07-15': 'Demokrasi ve Milli Birlik Günü',
    '2026-08-30': 'Zafer Bayramı',
    '2026-10-28': 'Cumhuriyet Bayramı Arifesi',
    '2026-10-29': 'Cumhuriyet Bayramı'
  };

  // Calendar Helpers (Using viewDate)
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = viewDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  const monthNameLong = viewDate.toLocaleDateString('tr-TR', { month: 'long' });
  
  const changeMonth = (offset) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() + offset);
    setViewDate(newDate);
  };

  const [recommendedIdea, setRecommendedIdea] = useState(null);

  useEffect(() => {
    const monthItems = allEvents.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const monthActivitiesOnly = monthItems.filter(e => !e.isNote);

    if (monthActivitiesOnly.length < 2) {
      let poolMap = new Map();
      
      // 1. Mandatory Routines (High Weight)
      (sosyal.rutinler || []).forEach(r => {
        poolMap.set(r.baslik, { ...r, type: 'rutin', emoji: '🏋️', weight: 10 });
      });
      
      // 2. Ideas Pool (Base weight)
      (sosyal.havuz || []).forEach(h => {
        const existing = poolMap.get(h.baslik);
        poolMap.set(h.baslik, { 
          ...h, 
          type: 'fikir', 
          weight: (existing?.weight || 0) + (h.count ? Math.min(h.count, 10) : 5) 
        });
      });
      
      // 3. Smart Family Checks
      if (vehicle?.muayene?.next) {
        poolMap.set('Araç Muayene Kontrolü', { baslik: 'Araç Muayene Kontrolü', emoji: '🚗', tur: 'disari', type: 'system', weight: 8 });
      }
      poolMap.set('Mutfak Stoklarını Güncelle', { baslik: 'Mutfak Stoklarını Güncelle', emoji: '🛒', tur: 'evde', type: 'system', weight: 8 });

      // 4. Frequent Past Activities (Additional boost to existing or add new)
      const counts = (Array.isArray(sosyal.aktiviteler) ? sosyal.aktiviteler : []).filter(a => a.tamamlandi).reduce((acc, curr) => {
        acc[curr.baslik] = (acc[curr.baslik] || 0) + 1;
        return acc;
      }, {});
      
      Object.keys(counts).forEach(baslik => {
        const count = counts[baslik];
        const existing = poolMap.get(baslik);
        if (existing) {
          existing.weight += count;
        } else {
          const original = (sosyal.aktiviteler || []).find(oa => oa.baslik === baslik);
          poolMap.set(baslik, { 
            baslik, 
            emoji: original?.emoji || '🎭', 
            tur: original?.tur || 'disari', 
            type: 'gecmis', 
            weight: count 
          });
        }
      });

      const pool = Array.from(poolMap.values());

      if (pool.length > 0) {
        const plannedTitles = monthActivitiesOnly.map(a => a.title || a.baslik);
        let available = pool.filter(p => !plannedTitles.includes(p.baslik));
        if (available.length === 0) available = pool; // Fallback

        // Weighted Random Selection
        const totalWeight = available.reduce((sum, item) => sum + (item.weight || 1), 0);
        let randomNum = Math.random() * totalWeight;
        let selected = available[0];
        
        for (let item of available) {
          randomNum -= (item.weight || 1);
          if (randomNum <= 0) {
            selected = item;
            break;
          }
        }
        
        setRecommendedIdea(selected);
      }
    } else {
      setRecommendedIdea(null);
    }
  }, [currentMonth, currentYear, sosyal.aktiviteler, sosyal.havuz, sosyal.rutinler, refreshTrigger, allEvents, vehicle?.muayene?.next]);

  const refreshRecommendation = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const realToday = new Date();
  realToday.setHours(0,0,0,0);

  // Adjust for Monday start
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startOffset + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
      return { day: dayNumber, date: dateStr };
    }
    return null;
  });

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="section-header calendar-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px', marginBottom: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="nav-arrow" onClick={() => changeMonth(-1)}><ArrowRight style={{ transform: 'rotate(180deg)' }} size={20} /></button>
          <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--txt)', minWidth: '140px', textAlign: 'center' }}>{monthName.toUpperCase()}</h3>
          <button className="nav-arrow" onClick={() => changeMonth(1)}><ArrowRight size={20} /></button>
        </div>
        <button className="add-btn-main" onClick={onAdd}>
          <Plus size={18} />
          <span>Aktivite</span>
        </button>
      </div>

      <div className="calendar-wrapper glass">
        <div className="calendar-header-days">
          {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(d => <div key={d} className="ch-day">{d}</div>)}
        </div>
        <div className="calendar-grid">
          {days.map((d, i) => {
            const dayEvents = d ? allEvents.filter(e => e.date === d.date) : [];
            const isToday = d && 
              d.day === realToday.getDate() && 
              currentMonth === realToday.getMonth() && 
              currentYear === realToday.getFullYear();
            const holiday = d ? TR_HOLIDAYS_2026[d.date] : null;
            
            return (
              <div 
                key={i} 
                className={`calendar-cell ${!d ? 'empty' : 'clickable'} ${isToday ? 'is-today' : ''} ${holiday ? 'is-holiday' : ''}`} 
                onClick={() => d && setSelectedDay({ ...d, events: dayEvents, holiday })}
              >
                {d && (
                  <div className="cell-top">
                    <span className="cell-num">{d.day}</span>
                    {holiday && <span className="holiday-icon" title={holiday}>🇹🇷</span>}
                  </div>
                )}
                <div className="cell-events">
                  {dayEvents.map((e, idx) => (
                    <div 
                      key={idx} 
                      className={`mini-event-dot ${e.type}`}
                      title={`${e.icon} ${e.title}`}
                      style={{ background: e.color }}
                    >
                      {e.icon}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="upcoming-list" style={{ padding: '10px 20px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '15px', opacity: 0.6 }}>{monthName.toUpperCase()} PLANI</h4>
        
        {(() => {
          const monthItems = allEvents
            .filter(e => {
              const d = new Date(e.date);
              return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));

          const monthActivities = monthItems.filter(e => !e.isNote);
          const monthNotes = monthItems.filter(e => e.isNote);

          return (
            <>
              {/* ANA AKTİVİTELER */}
              {monthActivities.length > 0 && (
                <div className="section-group">
                  {monthActivities.map((a, idx) => (
                    <div key={idx} className={`tl-content glass ${a.originalItem?.tamamlandi ? 'completed' : ''}`} style={{ marginBottom: '10px' }}>
                      <div className="a-emoji">{a.icon}</div>
                      <div className="a-info">
                        <strong>{a.title}</strong>
                        <span>{new Date(a.date).toLocaleDateString('tr-TR')}</span>
                      </div>
                      {a.type === 'social' && (
                        <div className="tl-actions">
                          {!a.originalItem.tamamlandi && (
                            <button className="tl-btn done prominent" onClick={() => setCompleteModal(a.originalItem)}>
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          <button className="tl-btn cancel" onClick={() => setDeletingId(a.originalItem.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ASİSTAN ÖNERİSİ (Aktivite sayısı azsa) */}
              {recommendedIdea && (
                <div className="recommendation-ghost glass animate-pulse-slow" style={{ marginBottom: '20px' }}>
                  <div className="rg-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={10} color="#f59e0b" />
                      <span className="rg-tag">ASİSTAN ÖNERİSİ</span>
                    </div>
                    <button className="rg-refresh" onClick={refreshRecommendation} title="Farklı Bir Öneri">
                      <RotateCcw size={12} />
                    </button>
                  </div>
                  <div className="rg-body">
                    <div className="rg-emoji">{recommendedIdea.emoji}</div>
                    <div className="rg-info">
                      <strong>{recommendedIdea.baslik}</strong>
                      <span>{recommendedIdea.type === 'system' ? 'Akıllı Aile Asistanı Hatırlatması' : 'Sık tercih ettiğiniz veya havuzdaki bir fikir'}</span>
                    </div>
                    <button className="rg-add" onClick={() => onAdd()} title="Bu Ay İçin Planla">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* NOTLAR LİSTESİ (Kompakt - Geçmiş tabı stili) */}
              {monthNotes.length > 0 && (
                <div className="notes-section" style={{ marginTop: '10px' }}>
                  <div className="history-month-header" style={{ fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>
                    <Layers size={12} /> <span>NOTLAR & HATIRLATICILAR</span>
                  </div>
                  {monthNotes.map((n, idx) => (
                    <div key={idx} className="gecmis-card-compact" style={{ padding: '8px 12px', borderLeft: '3px solid #8b5cf6' }}>
                      <div className="gcc-main">
                        <div className="gcc-emoji" style={{ width: '28px', height: '28px', fontSize: '14px' }}>📝</div>
                        <div className="gcc-info">
                          <div className="gcc-title" style={{ fontSize: '12px' }}>{n.title}</div>
                          <div className="gcc-sub-row">
                             <span className="gcc-date">⏰ {n.originalItem?.saat || '12:00'}</span>
                             <span className="gcc-date" style={{ marginLeft: '5px' }}>{new Date(n.date).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                        <button className="tl-btn cancel" onClick={() => setDeletingId(n.originalItem.id)} style={{ width: '24px', height: '24px' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {monthItems.length === 0 && !recommendedIdea && (
                <p style={{ textAlign: 'center', fontSize: '13px', opacity: 0.5 }}>Bu ay için planlanmış aktivite yok.</p>
              )}
            </>
          );
        })()}
      </div>

      <ActionSheet
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        title={`${selectedDay?.day} ${monthNameLong} Yaprağı`}
        fullHeight
      >
        {selectedDay && (
          <div className="immersive-sheet-content">
            <div className="nostalgic-calendar-page glass" style={{ margin: '10px 0', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
              <div className="calendar-tear-holes">
                 <div className="hole"></div>
                 <div className="hole"></div>
              </div>
              
              <div className="nostalgic-content" style={{ padding: '20px' }}>
                <div className="leaf-date-header" style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px dashed #e2e8f0', paddingBottom: '15px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {new Date(selectedDay.date).toLocaleDateString('tr-TR', { weekday: 'long' })}
                  </div>
                  <div style={{ fontSize: '48px', fontWeight: '900', color: 'var(--txt)', lineHeight: '1' }}>
                    {selectedDay.day}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--social)' }}>
                    {new Date(selectedDay.date).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                  </div>
                </div>

                {selectedDay.holiday && (
                  <div className="nostalgic-event holiday" style={{ marginBottom: '20px', padding: '15px', background: '#fff5f5', borderRadius: '16px', border: '1px solid #fed7d7' }}>
                    <strong style={{ display: 'block', fontSize: '16px', color: '#c53030', textAlign: 'center' }}>🇹🇷 {selectedDay.holiday}</strong>
                    <span style={{ fontSize: '12px', color: '#e53e3e', display: 'block', textAlign: 'center' }}>Resmi Tatil</span>
                  </div>
                )}

                <div className="nostalgic-event-list">
                  {selectedDay.events.length > 0 ? selectedDay.events.map((e, idx) => (
                    <div key={idx} className={`nostalgic-item ${e.type}`} style={{ marginBottom: '12px', padding: '15px', borderRadius: '16px', background: 'white', border: '1px solid var(--brd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="ni-left" onClick={() => e.type === 'social' && setEditingActivity(e.originalItem)} style={{ cursor: e.type === 'social' ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <span className="ni-icon" style={{ fontSize: '24px' }}>{e.icon}</span>
                        <div className="ni-text" style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ fontSize: '14px', color: 'var(--txt)' }}>{e.title}</strong>
                          {e.originalItem?.saat && <span className="ni-time-badge" style={{ fontSize: '11px', color: 'var(--txt-light)' }}>⏰ {e.originalItem.saat}</span>}
                          <span style={{ fontSize: '12px', color: 'var(--txt-light)', marginTop: '2px' }}>{e.originalItem?.detaylar || (e.type === 'social' ? 'Detay eklemek için tıkla...' : 'Randevu/Aktivite')}</span>
                        </div>
                      </div>
                      {e.type === 'social' && !e.originalItem.tamamlandi && (
                        <div className="ni-actions" style={{ display: 'flex', gap: '8px' }}>
                          <button className="ni-done-btn" onClick={() => setCompleteModal(e.originalItem)} style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 size={18} />
                          </button>
                          <button className="ni-cancel-btn" onClick={() => setDeletingId(e.originalItem.id)} style={{ background: '#fff5f5', color: '#dc2626', border: '1px solid #fecaca', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5 }}>
                      <Calendar size={40} style={{ marginBottom: '10px' }} />
                      <p style={{ fontSize: '13px', fontStyle: 'italic' }}>Bugün için bir plan düşülmemiş...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row" style={{ marginTop: '20px', paddingBottom: '20px' }}>
              <button 
                className="leaf-action-btn note-btn" 
                onClick={() => setShowAddNote(true)}
                style={{ padding: '16px', borderRadius: '16px', background: 'var(--bg)', border: '1px solid var(--brd)', color: 'var(--txt)', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Plus size={18} /> Not Ekle
              </button>
              <button 
                className="leaf-action-btn activity-btn" 
                onClick={() => { onAdd(selectedDay.date); setSelectedDay(null); }}
                style={{ padding: '16px', borderRadius: '16px', background: 'var(--social)', color: 'white', border: 'none', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Plus size={18} /> Planla
              </button>
            </div>
            
            {showAddNote && (
              <div className="embedded-note-form glass animate-fadeIn" style={{ marginTop: '0', padding: '20px', borderRadius: '24px', border: '1px solid var(--brd)', marginBottom: '40px' }}>
                <h4 style={{ margin: '0 0 15px', fontSize: '14px', fontWeight: '900' }}>📝 Hızlı Not</h4>
                <AddNoteModal 
                  date={selectedDay.date} 
                  onClose={() => setShowAddNote(false)} 
                  onSave={(noteData) => {
                    addSocialActivity({
                      ...noteData,
                      tarih: selectedDay.date,
                      tur: 'not',
                      emoji: '📝'
                    });
                    setShowAddNote(false);
                    setSelectedDay(null);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </ActionSheet>

      <ActionSheet
        isOpen={!!completeModal}
        onClose={() => setCompleteModal(null)}
        title="🎉 Aktivite Tamamlandı"
      >
        {completeModal && (
          <CompleteActivityModal 
            activity={completeModal} 
            onClose={() => setCompleteModal(null)} 
          />
        )}
      </ActionSheet>

      <ActionSheet
        isOpen={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        title="📝 Aktivite Detayı"
      >
        {editingActivity && (
          <ActivityDetailsModal 
            activity={editingActivity} 
            onClose={() => setEditingActivity(null)} 
            allActivities={sosyal.aktiviteler || []}
          />
        )}
      </ActionSheet>

      {deletingId && (
        <ConfirmModal 
          title="Aktiviteyi Sil"
          message="Bu aktiviteyi silmek istediğine emin misin? Bu işlem geri alınamaz."
          onConfirm={() => {
            cancelSocialActivity(deletingId);
            setDeletingId(null);
            toast.success('Aktivite silindi 🗑️');
          }}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}


function AddNoteModal({ date, onClose, onSave }) {
  const [baslik, setBaslik] = useState('');
  const [saat, setSaat] = useState('12:00');

  const handleSave = async () => {
    if (!baslik) return toast.error('Lütfen bir not girin!');
    onSave({ baslik, saat });
  };

  return (
    <div className="modal-form">
      <div className="form-group">
        <label>Hatırlatılacak Not</label>
        <input 
          type="text" 
          value={baslik} 
          onChange={e => setBaslik(e.target.value)} 
          placeholder="Örn: Market alışverişi" 
          autoFocus
        />
      </div>
      <div className="form-group">
        <label>Saat</label>
        <input 
          type="time" 
          value={saat} 
          onChange={e => setSaat(e.target.value)} 
        />
      </div>
      <button className="submit-btn social" onClick={handleSave}>
        Kaydet
      </button>
    </div>
  );
}

function ActivityDetailsModal({ activity, onClose, allActivities }) {
  const { updateSocialActivity } = useStore();
  const [detay, setDetay] = useState(activity.detaylar || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    const list = allActivities
      .filter(a => a.baslik === activity.baslik && a.detaylar && a.detaylar.length > 0)
      .map(a => a.detaylar);
    return [...new Set(list)]; // Unique
  }, [allActivities, activity.baslik]);

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(detay.toLowerCase()) && s.toLowerCase() !== detay.toLowerCase()
  );

  const handleSave = () => {
    updateSocialActivity(activity.id, { detaylar: detay });
    onClose();
    toast.success('Detaylar kaydedildi! 📝');
  };

  return (
    <div className="modal-form">
      <div className="form-group" style={{ position: 'relative' }}>
        <label>
          {activity.baslik} Detayı (Film, Oyun, Restoran vb.)
        </label>
        <input 
          type="text" 
          value={detay} 
          onChange={e => {
            setDetay(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Hangi film veya oyun?" 
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="autocomplete-dropdown glass" style={{ 
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, 
            maxHeight: '150px', overflowY: 'auto', borderRadius: '12px', marginTop: '5px',
            border: '1px solid var(--brd)', background: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }}>
            {filteredSuggestions.map((s, i) => (
              <div 
                key={i} 
                className="suggestion-item" 
                onClick={() => {
                  setDetay(s);
                  setShowSuggestions(false);
                }}
                style={{ padding: '12px 15px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', fontSize: '14px', color: 'var(--txt)' }}
              >
                ✨ {s}
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="submit-btn social" onClick={handleSave}>
        Kaydet
      </button>
    </div>
  );
}

function CompleteActivityModal({ activity, onClose }) {
  const { completeSocialActivity } = useStore();
  const [pGorkem, setPGorkem] = useState(5);
  const [pEsra, setPEsra] = useState(5);
  const [cost, setCost] = useState(activity.harcama || 0);
  const [comment, setComment] = useState('');

  const handleComplete = () => {
    completeSocialActivity(activity.id, pGorkem, pEsra, Number(cost), comment);
    onClose();
    toast.success('Aktivite tamamlandı! 🎉');
  };

  return (
    <div className="modal-form">
      <div className="form-group">
        <label>Puanlar (1-10)</label>
        <div className="form-row">
          <div className="rate-box glass" style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--brd)', textAlign: 'center' }}>
             <label style={{ marginBottom: '4px' }}>👨 Görkem</label>
             <input 
              type="number" min="1" max="10" value={pGorkem} onChange={e => setPGorkem(e.target.value)}
              style={{ border: 'none', background: 'transparent', textAlign: 'center', fontSize: '18px', fontWeight: '900' }}
             />
          </div>
          <div className="rate-box glass" style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--brd)', textAlign: 'center' }}>
             <label style={{ marginBottom: '4px' }}>👩 Esra</label>
             <input 
              type="number" min="1" max="10" value={pEsra} onChange={e => setPEsra(e.target.value)}
              style={{ border: 'none', background: 'transparent', textAlign: 'center', fontSize: '18px', fontWeight: '900' }}
             />
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>Gerçekleşen Harcama (₺)</label>
        <input 
          type="number" value={cost} onChange={e => setCost(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Yorum / Not</label>
        <textarea 
          value={comment} onChange={e => setComment(e.target.value)} placeholder="Nasıl geçti?" rows={2}
          style={{ resize: 'none' }}
        />
      </div>
      <button className="submit-btn social" onClick={handleComplete}>
        Tamamla & Arşivle
      </button>
    </div>
  );
}

function AddActivityModal({ onClose, initialDate, prefilledData }) {
  const { sosyal, addSocialActivity } = useStore();
  const pool = sosyal.poolItems || [];
  
  const [baslik, setBaslik] = useState(prefilledData?.baslik || '');
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [saat, setSaat] = useState(prefilledData?.saat || '20:00');
  const [emoji, setEmoji] = useState(prefilledData?.emoji || '✨');
  const [mekan, setMekan] = useState(prefilledData?.mekan || '');
  const [harcama, setHarcama] = useState(prefilledData?.harcama || '');
  const [category, setCategory] = useState(prefilledData?.masterCategory || 'Genel');
  const [tur, setTur] = useState(prefilledData?.tur || 'disari');
  const [kisiSayisi, setKisiSayisi] = useState(2);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const routineItems = useMemo(() => {
    const pkgs = sosyal.routinePackages || [];
    const allItems = pkgs.flatMap(p => p.items);
    return [...new Set(allItems)];
  }, [sosyal.routinePackages]);

  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    
    // Pool items
    const poolSugg = pool.filter(p => p.title.toLowerCase().includes(term));
    
    // Routine items (that are not in pool)
    const routineSugg = routineItems
      .filter(item => item.toLowerCase().includes(term))
      .filter(item => !poolSugg.some(p => p.title === item))
      .map(item => ({ title: item, icon: '🔁', category: 'Rutin Ögesi', id: 'routine-' + item }));

    return [...poolSugg, ...routineSugg].slice(0, 5);
  }, [searchTerm, pool, routineItems]);

  const selectSuggestion = (p) => {
    setBaslik(p.title);
    setEmoji(p.icon);
    setCategory(p.category);
    setHarcama(p.cost?.replace(/[^0-9]/g, '') || '');
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (!baslik) {
      toast.error('Lütfen bir başlık girin!');
      return;
    }

    addSocialActivity({
      baslik,
      tarih: date,
      saat,
      emoji,
      mekan,
      harcama: Number(harcama),
      tur,
      masterCategory: category,
      kisiSayisi: Number(kisiSayisi),
      tamamlandi: false
    });
    
    toast.success('Yeni aktivite planlandı! 📅');
    onClose();
  };

  return (
    <div className="modal-form">
      <div className="form-group" style={{ position: 'relative' }}>
        <label>Aktivite Seç veya Yaz</label>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            value={baslik} 
            onChange={e => {
              setBaslik(e.target.value);
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }} 
            placeholder="Fikir havuzunda ara veya yeni yaz..." 
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="glass suggestions-dropdown" style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
              background: 'white', borderRadius: '12px', border: '1px solid var(--brd)',
              marginTop: '5px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden'
            }}>
              {suggestions.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => selectSuggestion(s)}
                  style={{ padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderBottom: '1px solid var(--brd-light)' }}
                >
                  <span>{s.icon}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>{s.title}</span>
                    <span style={{ fontSize: '10px', opacity: 0.6 }}>{s.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Tarih</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} lang="tr-TR" />
      </div>
      <div className="form-group">
        <label>Mekan / Yer</label>
        <input type="text" value={mekan} onChange={e => setMekan(e.target.value)} placeholder="Örn: Emaar AVM" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Saat</label>
          <input type="time" value={saat} onChange={e => setSaat(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Emoji</label>
          <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="✨" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Tahmini Bütçe (₺)</label>
          <input type="number" value={harcama} onChange={e => setHarcama(e.target.value)} placeholder="₺0" />
        </div>
        <div className="form-group">
          <label>Kaç Kişi?</label>
          <input type="number" value={kisiSayisi} onChange={e => setKisiSayisi(e.target.value)} placeholder="2" />
        </div>
      </div>
      <div className="form-group">
        <label>Kategori (İstatistik için)</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
           <option value="Sahil & Açık Alan">🌊 Sahil & Açık Alan</option>
           <option value="Park & Doğa">🌳 Park & Doğa</option>
           <option value="Yakın Lokasyon Keşif">🏙️ Yakın Lokasyon Keşif</option>
           <option value="Sosyal & Eğlence">🎭 Sosyal & Eğlence</option>
           <option value="Deneyim & Kaçamak">✨ Deneyim & Kaçamak</option>
           <option value="Genel">📂 Diğer / Genel</option>
        </select>
      </div>
      <div className="form-group">
        <label>Ortam</label>
        <select value={tur} onChange={e => setTur(e.target.value)}>
          <option value="disari">🌳 Dışarıda</option>
          <option value="evde">🏠 Evde</option>
        </select>
      </div>
      <button className="submit-btn social" onClick={handleSave}>
        Planla
      </button>
    </div>
  );
}

function EditHistoryModal({ activity, onClose }) {
  const { updateSocialActivity } = useStore();
  const [pGorkem, setPGorkem] = useState(activity.puan_gorkem || 5);
  const [pEsra, setPEsra] = useState(activity.puan_esra || 5);
  const [cost, setCost] = useState(activity.harcama || 0);
  const [comment, setComment] = useState(activity.yorum || '');
  const [baslik, setBaslik] = useState(activity.baslik || '');
  const [date, setDate] = useState(activity.doneDate || activity.tarih || '');

  const handleUpdate = () => {
    updateSocialActivity(activity.id, { 
      baslik,
      tarih: date,
      puan_gorkem: Number(pGorkem), 
      puan_esra: Number(pEsra), 
      harcama: Number(cost), 
      yorum: comment 
    });
    onClose();
    toast.success('Aktivite güncellendi! ✅');
  };

  return (
    <div className="modal-form">
      <div className="form-group">
        <label>Aktivite Başlığı</label>
        <input type="text" value={baslik} onChange={e => setBaslik(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Tarih</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Puanlar (1-10)</label>
        <div className="form-row">
          <div className="rate-box glass" style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--brd)', textAlign: 'center' }}>
             <label style={{ marginBottom: '4px' }}>👨 Görkem</label>
             <input 
              type="number" min="1" max="10" value={pGorkem} onChange={e => setPGorkem(e.target.value)}
              style={{ border: 'none', background: 'transparent', textAlign: 'center', fontSize: '18px', fontWeight: '900' }}
             />
          </div>
          <div className="rate-box glass" style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--brd)', textAlign: 'center' }}>
             <label style={{ marginBottom: '4px' }}>👩 Esra</label>
             <input 
              type="number" min="1" max="10" value={pEsra} onChange={e => setPEsra(e.target.value)}
              style={{ border: 'none', background: 'transparent', textAlign: 'center', fontSize: '18px', fontWeight: '900' }}
             />
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>Harcama (₺)</label>
        <input 
          type="number" value={cost} onChange={e => setCost(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Yorum / Not</label>
        <textarea 
          value={comment} onChange={e => setComment(e.target.value)} placeholder="Nasıl geçti?" rows={2}
          style={{ resize: 'none' }}
        />
      </div>
      <button className="submit-btn social" onClick={handleUpdate}>
        Değişiklikleri Kaydet
      </button>
    </div>
  );
}

function GecmisTab({ sosyal, onEdit, onDelete }) {
  const done = (Array.isArray(sosyal.aktiviteler) ? sosyal.aktiviteler : []).filter(a => a.tamamlandi);
  const totalHarcama = done.reduce((sum, a) => sum + (a.harcama || 0), 0);
  const avgPuan = done.length > 0 
    ? (done.reduce((sum, a) => sum + Number(a.puan_gorkem || 0) + Number(a.puan_esra || 0), 0) / (done.length * 2)).toFixed(1)
    : 0;

  const [expandedId, setExpandedId] = useState(null);

  // Group activities by Month/Year
  const grouped = done.reduce((acc, act) => {
    const d = new Date(act.doneDate || act.tarih);
    const key = d.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(act);
    return acc;
  }, {});

  const groupKeys = Object.keys(grouped).sort((a, b) => {
    const dateA = new Date(grouped[a][0].doneDate || grouped[a][0].tarih);
    const dateB = new Date(grouped[b][0].doneDate || grouped[b][0].tarih);
    return dateB - dateA; // Newest months first
  });

  const categoryStats = done.reduce((acc, a) => {
    const cat = a.masterCategory || 'Genel';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="stats-grid compact">
        <div className="stat-card glass">
          <span className="s-val">{done.length}</span>
          <span className="s-lbl">Aktivite</span>
        </div>
        <div className="stat-card glass">
          <span className="s-val">₺{totalHarcama > 1000 ? (totalHarcama/1000).toFixed(1) + 'K' : totalHarcama}</span>
          <span className="s-lbl">Harcama</span>
        </div>
        <div className="stat-card glass">
          <span className="s-val">⭐ {avgPuan}</span>
          <span className="s-lbl">Puan</span>
        </div>
      </div>

      <div className="category-stats-bar glass" style={{ margin: '0 16px 20px', padding: '15px', borderRadius: '20px', border: '1px solid var(--brd)' }}>
        <h4 style={{ fontSize: '12px', fontWeight: '900', marginBottom: '10px', opacity: 0.7 }}>📊 Kategori Dağılımı</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries(categoryStats).map(([cat, count]) => (
            <div key={cat} className="cat-stat-pill" style={{ background: 'var(--bg)', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', border: '1px solid var(--brd)' }}>
              <strong>{cat}:</strong> {count}
            </div>
          ))}
        </div>
      </div>

      <div className="history-archive-container" style={{ padding: '0 16px', paddingBottom: '100px' }}>
        {groupKeys.length > 0 ? groupKeys.map(key => (
          <div key={key} className="history-group">
            <h4 className="history-month-header">
              <span>{key.split(' ')[0]}</span>
              <small>{key.split(' ')[1]}</small>
            </h4>
            <div className="history-list">
              {grouped[key].sort((a,b) => new Date(b.doneDate || b.tarih) - new Date(a.doneDate || a.tarih)).map(a => (
                <div 
                  key={a.id} 
                  className={`gecmis-card-compact glass ${expandedId === a.id ? 'expanded' : ''}`}
                  onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                >
                  <div className="gcc-main">
                    <span className="gcc-emoji">{a.emoji || '🎭'}</span>
                    <div className="gcc-info">
                      <span className="gcc-title">{a.baslik}</span>
                      <div className="gcc-sub-row">
                        <span className="gcc-date">{new Date(a.doneDate || a.tarih).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}</span>
                        <span className="gcc-cost-tag">₺{a.harcama || 0}</span>
                      </div>
                    </div>
                    <div className="gcc-ratings">
                      <div className="gcc-rate-chip gorkem">👨 {a.puan_gorkem}</div>
                      <div className="gcc-rate-chip esra">👩 {a.puan_esra}</div>
                    </div>
                  </div>

                  {expandedId === a.id && (
                    <div className="gcc-expanded animate-fadeIn">
                      <div className="gcc-meta-grid">
                        <div className="gcc-meta-item"><MapPin size={10} /> {a.mekan || 'Evde'}</div>
                        {a.detaylar && <div className="gcc-detay-text">{a.detaylar}</div>}
                      </div>
                      {a.yorum && <div className="gcc-comment-box"><p>"{a.yorum}"</p></div>}
                      
                      <div className="gcc-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button 
                          className="tl-btn edit" 
                          onClick={(e) => { e.stopPropagation(); onEdit(a); }}
                          style={{ flex: 1, height: '36px', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--brd)', color: 'var(--social)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: '800' }}
                        >
                          <Activity size={14} /> Düzenle
                        </button>
                        <button 
                          className="tl-btn delete" 
                          onClick={(e) => { e.stopPropagation(); onDelete(a.id); }}
                          style={{ flex: 1, height: '36px', borderRadius: '12px', background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: '800' }}
                        >
                          <Trash2 size={14} /> Sil
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
            <p>Henüz tamamlanmış aktivite yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RutinTab({ sosyal, onAdd }) {
  const routines = sosyal.routinePackages || [];
  const { applySocialRoutine, addSocialRoutinePackage, updateSocialRoutinePackage, deleteSocialRoutinePackage } = useStore();
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [managingPkg, setManagingPkg] = useState(null); // { mode: 'add' | 'edit', pkg: null | object }

  const handleApply = (routine) => {
    applySocialRoutine(routine, startDate);
    toast.success(`${routine.name} plana eklendi! 📅`);
  };

  const handleSavePkg = (pkgData) => {
    if (managingPkg.mode === 'edit') {
      updateSocialRoutinePackage(managingPkg.pkg.id, pkgData);
      toast.success('Rutin paketi güncellendi! 🔁');
    } else {
      addSocialRoutinePackage(pkgData);
      toast.success('Yeni rutin paketi eklendi! 🔁');
    }
    setManagingPkg(null);
  };

  const handleDeletePkg = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Bu rutin paketini silmek istediğine emin misin?')) {
      deleteSocialRoutinePackage(id);
      toast.success('Rutin paketi silindi.');
    }
  };

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="section-header" style={{ padding: '0 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--txt)', margin: 0 }}>🔁 Hazır Rutinler</h3>
          <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>Gün boyu sürecek hazır aktivite paketleri.</p>
        </div>
        <button 
          onClick={() => setManagingPkg({ mode: 'add', pkg: null })}
          style={{ background: 'var(--social)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <Plus size={14} /> YENİ
        </button>
      </div>

      <div className="routine-date-selector" style={{ padding: '0 20px', marginBottom: '20px' }}>
        <div className="form-group glass" style={{ padding: '15px', borderRadius: '16px', border: '1px solid var(--brd)' }}>
          <label style={{ fontSize: '12px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Uygulama Tarihi</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--brd)', background: 'var(--bg)' }}
          />
        </div>
      </div>

      <div className="routines-grid" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '100px' }}>
        {routines.map(r => (
          <div key={r.id} className="routine-combo-card glass" style={{ padding: '20px', borderRadius: '24px', border: '1px solid var(--brd)', position: 'relative', overflow: 'hidden' }}>
            <div className="rc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }}>{r.icon}</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>{r.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--social)', fontWeight: '800' }}>💰 {r.cost}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setManagingPkg({ mode: 'edit', pkg: r })}
                  style={{ background: 'var(--bg)', color: 'var(--txt-light)', border: 'none', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Activity size={16} />
                </button>
                <button 
                  onClick={(e) => handleDeletePkg(e, r.id)}
                  style={{ background: '#fff5f5', color: '#f87171', border: 'none', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  className="apply-routine-btn"
                  onClick={() => handleApply(r)}
                  style={{ 
                    padding: '8px 16px', borderRadius: '12px', border: 'none', 
                    background: 'var(--social)', color: 'white', fontSize: '11px', fontWeight: '800'
                  }}
                >
                  UYGULA
                </button>
              </div>
            </div>
            
            <div className="rc-items" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {r.items.map((item, idx) => (
                <div key={idx} className="rc-item-mini" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', opacity: 0.8 }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--social)' }} />
                  <span>{idx === 0 ? 'Sabah' : idx === 1 ? 'Öğle' : 'Akşam'}: <strong>{item}</strong></span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ActionSheet
        isOpen={!!managingPkg}
        onClose={() => setManagingPkg(null)}
        title={managingPkg?.mode === 'edit' ? '📝 Rutin Paketini Düzenle' : '🔁 Yeni Rutin Paketi Ekle'}
      >
        {managingPkg && (
          <ManageRoutinePackageModal 
            pkg={managingPkg.pkg} 
            onClose={() => setManagingPkg(null)} 
            onSave={handleSavePkg} 
          />
        )}
      </ActionSheet>
    </div>
  );
}


function HavuzTab({ sosyal, onAdd }) {
  const pool = [...(sosyal.poolItems || []), ...(sosyal.havuz || [])];
  const { deleteSocialPoolItem, addSocialPoolItem, updateSocialPoolItem } = useStore();
  const [planningIdea, setPlanningIdea] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [managingItem, setManagingItem] = useState(null); // { mode: 'add' | 'edit', item: null | object }

  const categories = ['Hepsi', ...new Set(pool.map(p => p.category).filter(Boolean))];

  const filteredPool = selectedCategory === 'Hepsi' 
    ? pool 
    : pool.filter(p => p.category === selectedCategory);

  const startPlanning = (idea) => {
    setPlanningIdea({
      baslik: idea.title || idea.baslik,
      emoji: idea.icon || idea.emoji,
      harcama: idea.cost?.replace(/[^0-9-]/g, '') || '',
      tur: idea.category === 'Park & Doğa' || idea.category === 'Sahil & Açık Alan' ? 'disari' : 'disari',
      masterCategory: idea.category || 'Genel'
    });
  };

  const handleSaveItem = (itemData) => {
    if (managingItem.mode === 'edit') {
      updateSocialPoolItem(managingItem.item.id, itemData);
      toast.success('Aktivite güncellendi! ✨');
    } else {
      addSocialPoolItem(itemData);
      toast.success('Yeni aktivite eklendi! ✨');
    }
    setManagingItem(null);
  };

  const handleDeleteItem = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Bu aktiviteyi havuzdan silmek istediğine emin misin?')) {
      deleteSocialPoolItem(id);
      toast.success('Aktivite silindi.');
    }
  };

  const finishPlanning = (details) => {
    const { addSocialActivity } = useStore.getState();
    addSocialActivity({
      ...details,
      tamamlandi: false
    });
    setPlanningIdea(null);
    toast.success('Aktivite plana eklendi! 📅');
  };

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '15px' }}>
        <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>Fikir havuzundan seçim yap veya yeni ekle.</p>
        <button 
          onClick={() => setManagingItem({ mode: 'add', item: null })}
          className="cute-mini-btn"
          style={{ background: 'var(--social)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 10px rgba(197, 28, 108, 0.2)' }}
        >
          <Sparkles size={10} /> <Plus size={10} /> YENİ
        </button>
      </div>

      <div className="category-filter-scroll" style={{ padding: '0 20px', marginBottom: '20px', display: 'flex', gap: '10px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            style={{ 
              padding: '6px 12px', borderRadius: '14px', border: '1px solid var(--brd)',
              background: selectedCategory === cat ? 'var(--social)' : 'white',
              color: selectedCategory === cat ? 'white' : 'var(--txt)',
              fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            {cat === 'Hepsi' && <Layers size={10} />}
            {cat}
          </button>
        ))}
      </div>

      <div className="pool-list" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '100px' }}>
        {filteredPool.map(item => (
          <div key={item.id} className="pool-card-list glass" style={{ padding: '12px 15px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="pcl-icon" style={{ fontSize: '24px', width: '44px', height: '44px', background: 'var(--bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </div>
            
            <div className="pcl-info" style={{ flex: 1 }}>
              <strong style={{ fontSize: '13px', color: 'var(--txt)', display: 'block' }}>{item.title}</strong>
              <div style={{ fontSize: '10px', opacity: 0.6, display: 'flex', gap: '10px', marginTop: '2px' }}>
                <span>⏱️ {item.duration || '1 saat'}</span>
                <span>💰 {item.cost || '0 TL'}</span>
                <span style={{ color: 'var(--social)', fontWeight: 'bold' }}>#{item.category}</span>
              </div>
            </div>

            <div className="pcl-actions" style={{ display: 'flex', gap: '6px' }}>
              <button 
                onClick={() => setManagingItem({ mode: 'edit', item })}
                style={{ background: '#F1F5F9', color: '#64748B', border: 'none', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Edit3 size={14} />
              </button>
              <button 
                onClick={(e) => handleDeleteItem(e, item.id)}
                style={{ background: '#FFF1F2', color: '#F43F5E', border: 'none', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={14} />
              </button>
              <button 
                onClick={() => startPlanning(item)}
                style={{ background: 'var(--social)', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(197, 28, 108, 0.2)' }}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        ))}
        {filteredPool.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
             <Lightbulb size={40} style={{ marginBottom: '10px' }} />
             <p>Bu kategoride henüz bir fikir yok.</p>
          </div>
        )}
      </div>

      <ActionSheet
        isOpen={!!planningIdea}
        onClose={() => setPlanningIdea(null)}
        title={`📅 Aktivite Planla`}
      >
        {planningIdea && (
          <PlanIdeaModal 
            idea={planningIdea} 
            onClose={() => setPlanningIdea(null)} 
            onConfirm={finishPlanning} 
          />
        )}
      </ActionSheet>

      <ActionSheet
        isOpen={!!managingItem}
        onClose={() => setManagingItem(null)}
        title={managingItem?.mode === 'edit' ? '📝 Aktiviteyi Düzenle' : '✨ Yeni Aktivite Ekle'}
      >
        {managingItem && (
          <ManagePoolItemModal 
            item={managingItem.item} 
            onClose={() => setManagingItem(null)} 
            onSave={handleSaveItem} 
          />
        )}
      </ActionSheet>
    </div>
  );
}



function AddRutinModal({ onClose }) {
  const { addRutin } = useStore();
  const [formData, setFormData] = useState({ aktivite: '', kisi: 'Görkem', gunler: [], saati: '09:00', ucret: 0, sure: 'Belirsiz' });
  const gunler = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const handleSubmit = (e) => {
    e.preventDefault();
    addRutin(formData);
    onClose();
    toast.success('Rutin eklendi! 🏋️');
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Aktivite Adı</label>
        <input type="text" value={formData.aktivite} onChange={e => setFormData({...formData, aktivite: e.target.value})} placeholder="Ör: Spor Salonu" required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Kişi</label>
          <select value={formData.kisi} onChange={e => setFormData({...formData, kisi: e.target.value})}>
            <option value="Görkem">🧔 Görkem</option>
            <option value="Esra">👩‍🦰 Esra</option>
            <option value="İkisi">👫 İkisi</option>
          </select>
        </div>
        <div className="form-group">
          <label>Günün Vakti</label>
          <select value={formData.vakit} onChange={e => setFormData({...formData, vakit: e.target.value})}>
            <option value="sabah">🌅 Sabah</option>
            <option value="öğle">☀️ Öğle</option>
            <option value="akşam">🌙 Akşam</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Hangi Günler?</label>
        <div className="days-selector" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
            <button
              key={day}
              type="button"
              className={`day-tag ${formData.gunler.includes(day) ? 'active' : ''}`}
              onClick={() => {
                const newGunler = formData.gunler.includes(day)
                  ? formData.gunler.filter(d => d !== day)
                  : [...formData.gunler, day];
                setFormData({...formData, gunler: newGunler});
              }}
              style={{ 
                padding: '10px 14px', 
                borderRadius: '12px', 
                border: '1px solid var(--brd)',
                background: formData.gunler.includes(day) ? 'var(--social)' : 'white',
                color: formData.gunler.includes(day) ? 'white' : 'var(--txt)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" className="submit-btn social">
        Rutini Kaydet
      </button>
    </form>
  );
}

function AddFikirModal({ onClose }) {
  const { addSocialPoolItem } = useStore();
  const [formData, setFormData] = useState({ baslik: '', tur: 'disari', siklik: 3, kisi: 'Ortak' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addSocialPoolItem(formData);
    onClose();
    toast.success('Fikir havuza atıldı! 💡');
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Fikir / Yapılacak İş</label>
        <input type="text" value={formData.baslik} onChange={e => setFormData({...formData, baslik: e.target.value})} placeholder="Ne yapalım?" required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Kimin İşi?</label>
          <select value={formData.kisi} onChange={e => setFormData({...formData, kisi: e.target.value})}>
            <option value="Ortak">🏡 Ortak</option>
            <option value="Görkem">👨 Görkem</option>
            <option value="Esra">👩 Esra</option>
          </select>
        </div>
        <div className="form-group">
          <label>Tür</label>
          <select value={formData.tur} onChange={e => setFormData({...formData, tur: e.target.value})}>
            <option value="disari">🌳 Dışarı</option>
            <option value="evde">🏠 Evde</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Önem / Sıklık</label>
        <select value={formData.siklik} onChange={e => setFormData({...formData, siklik: Number(e.target.value)})}>
          <option value="1">⭐ Seyrek / Düşük</option>
          <option value="3">⭐⭐ Normal</option>
          <option value="5">⭐⭐⭐ Sık / Yüksek</option>
        </select>
      </div>
      <button type="submit" className="submit-btn social">
        Kaydet
      </button>
    </form>
  );
}

function PlanIdeaModal({ idea, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    tarih: new Date().toISOString().split('T')[0],
    saat: '20:00',
    mekan: '',
    harcama: idea.tahmini_harcama || ''
  });

  return (
    <div className="modal-form">
      <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '14px', color: 'var(--txt-light)' }}>{idea.emoji} Bu fikri ne zaman gerçekleştirelim?</p>
      
      <div className="form-row">
        <div className="form-group">
          <label>Tarih</label>
          <input type="date" value={formData.tarih} onChange={e => setFormData({...formData, tarih: e.target.value})} lang="tr-TR" required />
        </div>
        <div className="form-group">
          <label>Saat</label>
          <input type="time" value={formData.saat} onChange={e => setFormData({...formData, saat: e.target.value})} />
        </div>
      </div>

      <div className="form-group">
        <label>Mekan (Opsiyonel)</label>
        <input type="text" value={formData.mekan} onChange={e => setFormData({...formData, mekan: e.target.value})} placeholder="Nerede?" />
      </div>

      <div className="form-group">
        <label>Tahmini Bütçe (₺)</label>
        <input type="number" value={formData.harcama} onChange={e => setFormData({...formData, harcama: e.target.value})} placeholder="₺0" />
      </div>

      <button className="submit-btn social" onClick={() => onConfirm(formData)}>
        Aktiviteye Dönüştür
      </button>
    </div>
  );
}

function ManagePoolItemModal({ item, onClose, onSave }) {
  const [formData, setFormData] = useState(item || { title: '', duration: '1 saat', cost: '0 TL', category: 'Genel', icon: '✨' });
  const categories = ['Sahil & Açık Alan', 'Park & Doğa', 'Yakın Lokasyon Keşif', 'Sosyal & Eğlence', 'Deneyim & Kaçamak', 'Genel'];

  return (
    <div className="modal-form">
      <div className="form-group">
        <label>Aktivite Başlığı</label>
        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Örn: Boğaz Turu" required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Süre</label>
          <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="Örn: 2 saat" />
        </div>
        <div className="form-group">
          <label>Maliyet</label>
          <input type="text" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} placeholder="Örn: 100 TL" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Kategori</label>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Emoji</label>
          <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="✨" />
        </div>
      </div>
      <button className="submit-btn social" onClick={() => onSave(formData)}>
        {item ? 'Güncelle' : 'Ekle'}
      </button>
    </div>
  );
}

function ManageRoutinePackageModal({ pkg, onClose, onSave }) {
  const [formData, setFormData] = useState(pkg || { name: '', items: ['', '', ''], cost: '0 TL', icon: '📅' });

  const updateItem = (idx, val) => {
    const newItems = [...formData.items];
    newItems[idx] = val;
    setFormData({...formData, items: newItems});
  };

  return (
    <div className="modal-form">
      <div className="form-group">
        <label>Rutin Adı</label>
        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Örn: Pazar Keyfi" required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Tahmini Maliyet</label>
          <input type="text" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} placeholder="Örn: 200 TL" />
        </div>
        <div className="form-group">
          <label>Emoji</label>
          <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="📅" />
        </div>
      </div>
      <div className="form-group">
        <label>Aktiviteler (Sabah, Öğle, Akşam)</label>
        {formData.items.map((it, idx) => (
          <input 
            key={idx}
            type="text" 
            value={it} 
            onChange={e => updateItem(idx, e.target.value)} 
            placeholder={idx === 0 ? 'Sabah aktivitesi' : idx === 1 ? 'Öğle aktivitesi' : 'Akşam aktivitesi'}
            style={{ marginBottom: '8px' }}
          />
        ))}
      </div>
      <button className="submit-btn social" onClick={() => onSave(formData)}>
        {pkg ? 'Güncelle' : 'Ekle'}
      </button>
    </div>
  );
}
