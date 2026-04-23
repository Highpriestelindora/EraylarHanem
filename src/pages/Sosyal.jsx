import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { 
  Calendar, Activity, Archive, Lightbulb, 
  CheckCircle2, Plus, Trash2, Star, 
  MapPin, Home as HomeIcon, Clock, ArrowRight,
  Layers, CreditCard, Smile, ArrowLeft, X, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_SOCIAL } from '../constants/data';
import ConfirmModal from '../components/ConfirmModal';
import './Sosyal.css';

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
    { id: 'havuz', emoji: '💡', label: 'Fikirler' },
    { id: 'ist', emoji: '🌆', label: 'İstanbul' },
    { id: 'gecmis', emoji: '📂', label: 'Geçmiş' }
  ];

  return (
    <AnimatedPage className="sosyal-container">
      <header className="module-header glass" style={{ background: 'var(--social)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">👫</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Sosyal</h1>
              <p>Aktivite · İstanbul · Fikirler</p>
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
        {activeTab === 'gecmis' && <GecmisTab sosyal={sosyal} />}
        {activeTab === 'havuz' && <HavuzTab sosyal={sosyal} onAdd={() => setShowAddFikir(true)} onAddRutin={() => setShowAddRutin(true)} />}
        {activeTab === 'ist' && <IstTab onAdd={(date, data) => setShowAddActivity({ date, prefilledData: data })} />}
      </div>

      {showAddActivity && (
        <AddActivityModal 
          onClose={() => setShowAddActivity(null)} 
          initialDate={showAddActivity?.date || (typeof showAddActivity === 'string' ? showAddActivity : null)} 
          prefilledData={showAddActivity?.prefilledData}
        />
      )}
      {showAddRutin && <AddRutinModal onClose={() => setShowAddRutin(false)} />}
      {showAddFikir && <AddFikirModal onClose={() => setShowAddFikir(false)} />}
    </AnimatedPage>
  );
}

function IstTab({ onAdd }) {
  const { sosyal } = useStore();
  const [filter, setFilter] = useState('all');

  const events = [
    { id: 'e1', title: 'Mert Demir Konseri', date: '2024-05-15', place: 'Harbiye Cemil Topuzlu', type: 'Konser', price: '₺800', img: '🎸', category: 'music' },
    { id: 'e2', title: 'Zengin Mutfağı', date: '2024-05-18', place: 'Maximum UNIQ Hall', type: 'Tiyatro', price: '₺450', img: '🎭', category: 'theater' },
    { id: 'e3', title: 'Dijital Sanat Sergisi', date: '2024-05-20', place: 'Tersane İstanbul', type: 'Sergi', price: '₺200', img: '🎨', category: 'art' },
    { id: 'e4', title: 'Boğazda Kahvaltı', date: '2024-05-12', place: 'Emirgan Korusu', type: 'Aktivite', price: '₺500', img: '🥨', category: 'outdoor' },
    { id: 'e5', title: 'Melike Şahin', date: '2024-06-01', place: 'Zorlu PSM', type: 'Konser', price: '₺1200', img: '🎤', category: 'music' },
    { id: 'e6', title: 'Bir Baba Hamlet', date: '2024-05-25', place: 'Moda Sahnesi', type: 'Tiyatro', price: '₺300', img: '🎭', category: 'theater' },
    { id: 'e7', title: 'Dune: Part Two', date: '2024-05-10', place: 'Kanyon Cinemaximum', type: 'Sinema', price: '₺180', img: '🎬', category: 'cinema' },
    { id: 'e8', title: 'Sushi Workshop', date: '2024-05-22', place: 'MSA Maslak', type: 'Atölye', price: '₺1500', img: '🍣', category: 'workshop' },
    { id: 'e9', title: 'Legoland Gezisi', date: '2024-05-19', place: 'Bayrampaşa Forum', type: 'Aile', price: '₺400', img: '🧱', category: 'outdoor' },
    { id: 'e10', title: 'İstanbul Yarı Maratonu', date: '2024-04-28', place: 'Yenikapı Etkinlik Alanı', type: 'Spor', price: '₺0', img: '🏃', category: 'sport' },
    { id: 'e11', title: 'Modern Sanat Sergisi', date: '2024-06-15', place: 'İstanbul Modern', type: 'Sergi', price: '₺150', img: '🖼️', category: 'art' },
    { id: 'e12', title: 'Seramik Atölyesi', date: '2024-05-28', place: 'Kadıköy Sanat', type: 'Atölye', price: '₺600', img: '🏺', category: 'workshop' },
    { id: 'e13', title: 'Büyük Ev Ablukada', date: '2024-05-30', place: 'DasDas', type: 'Konser', price: '₺750', img: '🎸', category: 'music' },
    { id: 'e14', title: 'Küçük Prens', date: '2024-05-11', place: 'Zorlu PSM', type: 'Tiyatro', price: '₺250', img: '🤴', category: 'theater' },
    { id: 'e15', title: 'Akvaryum Gezisi', date: '2024-05-13', place: 'Florya Akvaryum', type: 'Aile', price: '₺650', img: '🐠', category: 'outdoor' },
    { id: 'e16', title: 'Yıldız Tilbe', date: '2024-06-10', place: 'Vodafone Park', type: 'Konser', price: '₺1000', img: '💃', category: 'music' },
  ];

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.category === filter);

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
      <div className="section-header" style={{ padding: '0 20px', marginBottom: '15px' }}>
        <h3>🌆 İstanbul'da Bu Hafta</h3>
        <p style={{ fontSize: '12px', opacity: 0.6 }}>Biletix, Passo ve İBB Kültür'den seçildi.</p>
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
        {filteredEvents.map(e => (
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
        ))}
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
  const { saglik, pet, tatil, vehicle, cancelSocialActivity } = useStore();
  const [completeModal, setCompleteModal] = useState(null); 
  const [editingActivity, setEditingActivity] = useState(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [deletingId, setDeletingId] = useState(null); 
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  // --- SMART MULTI-MODULE SCANNER ---
  const allEvents = useMemo(() => {
    const events = [];

    // 1. Social Activities & Notes
    (sosyal.aktiviteler || []).filter(a => !a.tamamlandi && a.durum !== 'iptal').forEach(a => {
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

    // 4. Trips (Mandatory)
    (tatil?.trips || []).forEach(t => {
      events.push({ date: t.baslangic || t.date || t.startDate, icon: '✈️', title: t.title || t.city, color: '#0ea5e9', type: 'trip' });
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
      let pool = [];
      
      // 1. Mandatory Routines (High Priority)
      (sosyal.rutinler || []).forEach(r => pool.push({ ...r, type: 'rutin', emoji: '🏋️', weight: 5 }));
      
      // 2. Ideas Pool (Weight based on frequency/count)
      (sosyal.havuz || []).forEach(h => pool.push({ ...h, type: 'fikir', weight: h.count ? Math.min(h.count, 20) : 2 }));
      
      // 3. Smart Family Checks
      if (vehicle?.muayene?.next) {
        pool.push({ baslik: 'Araç Muayene Kontrolü', emoji: '🚗', tur: 'disari', type: 'system', weight: 5 });
      }
      pool.push({ baslik: 'Mutfak Stoklarını Güncelle', emoji: '🛒', tur: 'evde', type: 'system', weight: 5 });

      // 4. Frequent Past Activities (Additional boost)
      const counts = (sosyal.aktiviteler || []).filter(a => a.tamamlandi).reduce((acc, curr) => {
        acc[curr.baslik] = (acc[curr.baslik] || 0) + 1;
        return acc;
      }, {});
      const frequent = Object.keys(counts).sort((a,b) => counts[b] - counts[a]).slice(0, 5);
      frequent.forEach(f => {
        const original = (sosyal.aktiviteler || []).find(oa => oa.baslik === f);
        pool.push({ baslik: f, emoji: original?.emoji || '🎭', tur: original?.tur || 'disari', type: 'gecmis', weight: counts[f] });
      });

      if (pool.length > 0) {
        const plannedTitles = monthActivitiesOnly.map(a => a.title || a.baslik);
        let available = pool.filter(p => !plannedTitles.includes(p.baslik));
        if (available.length === 0) available = pool; // Fallback

        // Ağırlıklı rastgele seçim (Weighted Random)
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
      <div className="section-header calendar-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="nav-arrow" onClick={() => changeMonth(-1)}><ArrowRight style={{ transform: 'rotate(180deg)' }} size={20} /></button>
          <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--txt)', minWidth: '140px', textAlign: 'center' }}>{monthName.toUpperCase()}</h3>
          <button className="nav-arrow" onClick={() => changeMonth(1)}><ArrowRight size={20} /></button>
        </div>
        <button className="add-btn-main" onClick={onAdd}>
          <Plus size={18} />
          <span>Aktivite Planla</span>
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

      <div className="upcoming-list" style={{ padding: '20px' }}>
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
                      <X size={12} />
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

      {selectedDay && (
        <DayDetailsModal 
          day={selectedDay} 
          onClose={() => setSelectedDay(null)} 
          onDelete={(id) => {
            setDeletingId(id);
            setSelectedDay(null);
          }}
          onComplete={(act) => {
            setCompleteModal(act);
            setSelectedDay(null);
          }}
          onEdit={(act) => {
            setEditingActivity(act);
            setSelectedDay(null);
          }}
          onAdd={(date, prefilled) => {
            onAdd(date, prefilled);
            setSelectedDay(null);
          }}
        />
      )}

      {completeModal && (
        <CompleteActivityModal 
          activity={completeModal} 
          onClose={() => setCompleteModal(null)} 
        />
      )}

      {editingActivity && (
        <ActivityDetailsModal 
          activity={editingActivity} 
          onClose={() => setEditingActivity(null)} 
          allActivities={sosyal.aktiviteler || []}
        />
      )}

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

function DayDetailsModal({ day, onClose, onComplete, onEdit, onAdd, onDelete }) {
  const { cancelSocialActivity, addSocialActivity } = useStore();
  const [showAddNote, setShowAddNote] = useState(false);
  const dateObj = new Date(day.date);
  const weekDay = dateObj.toLocaleDateString('tr-TR', { weekday: 'long' });
  const monthNameLong = dateObj.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="nostalgic-calendar-page glass animate-pop" onClick={e => e.stopPropagation()}>
        <div className="calendar-tear-holes">
           <div className="hole"></div>
           <div className="hole"></div>
        </div>
        
        <header className="nostalgic-header">
           <div className="weekday-serif">{weekDay}</div>
        </header>

        <div className="nostalgic-body">
           <div className="big-date-serif">{day.day}</div>
           <div className="month-year-serif">{monthNameLong}</div>
        </div>

        <div className="nostalgic-content">
          {day.holiday && (
            <div className="nostalgic-event holiday" style={{ marginBottom: '15px' }}>
              <strong>🇹🇷 {day.holiday}</strong>
              <span>Resmi Tatil</span>
            </div>
          )}

          <div className="nostalgic-event-list">
            {day.events.length > 0 ? day.events.map((e, idx) => (
              <div key={idx} className={`nostalgic-item ${e.type}`}>
                <div className="ni-left" onClick={() => e.type === 'social' && onEdit(e.originalItem)} style={{ cursor: e.type === 'social' ? 'pointer' : 'default' }}>
                  <span className="ni-icon">{e.icon}</span>
                  <div className="ni-text">
                    <strong>{e.title}</strong>
                    {e.originalItem?.saat && <span className="ni-time-badge">⏰ {e.originalItem.saat}</span>}
                    <span>{e.originalItem?.detaylar || (e.type === 'social' ? 'Detay eklemek için tıkla...' : 'Randevu/Aktivite')}</span>
                  </div>
                </div>
                {e.type === 'social' && !e.originalItem.tamamlandi && (
                  <div className="ni-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button className="ni-done-btn" onClick={() => onComplete(e.originalItem)}>
                      <CheckCircle2 size={16} />
                    </button>
                    <button className="ni-cancel-btn" onClick={() => onDelete(e.originalItem.id)} style={{ background: '#fff5f5', color: '#c53030', border: '1px solid #fed7d7', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            )) : (
              <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', fontStyle: 'italic', padding: '10px 0' }}>Bugün için bir plan düşülmemiş...</p>
            )}
          </div>
          
          <div className="ni-leaf-actions" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="leaf-action-btn note-btn" onClick={() => setShowAddNote(true)}>
              <Plus size={14} /> Not Ekle & Hatırlatıcı Kur
            </button>
            <button className="leaf-action-btn activity-btn" onClick={() => onAdd(day.date)}>
              <Plus size={14} /> Aktivite Planla
            </button>
          </div>
        </div>
        
        {showAddNote && (
          <AddNoteModal 
            date={day.date} 
            onClose={() => setShowAddNote(false)} 
            onSave={(noteData) => {
              addSocialActivity({
                ...noteData,
                tarih: day.date,
                tur: 'not',
                emoji: '📝'
              });
              setShowAddNote(false);
              onClose();
            }}
          />
        )}
        <button className="nostalgic-close" onClick={onClose}>Yaprağı Kapat</button>
      </div>
    </div>
  );
}

function AddNoteModal({ date, onClose, onSave }) {
  const [baslik, setBaslik] = useState('');
  const [saat, setSaat] = useState('12:00');

  const handleSave = async () => {
    if (!baslik) return toast.error('Lütfen bir not girin!');
    
    // Notification logic
    const noteTime = new Date(`${date}T${saat}`);
    const now = new Date();
    
    if (noteTime > now) {
      toast.success(`${saat} için bildirim planlandı! 🔔`);
      // Simulating background scheduling via notificationService
      const { notificationService } = await import('../lib/notificationService');
      setTimeout(() => {
        notificationService.sendNotification('📅 Eraylar Hanem Hatırlatıcı', {
          body: baslik,
          icon: '/logo192.png'
        });
      }, 3000); // Test notification after 3s
    }

    onSave({ baslik, saat });
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 4000 }}>
      <div className="modal-content glass animate-pop" style={{ maxWidth: '320px', padding: '25px' }}>
        <header className="modal-header">
          <h4 style={{ fontSize: '16px', fontWeight: '900' }}>📝 Not & Hatırlatıcı</h4>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>
        <div className="modal-form" style={{ marginTop: '15px' }}>
          <div className="form-group">
            <label style={{ fontSize: '11px', fontWeight: '800' }}>Hatırlatılacak Not</label>
            <input 
              type="text" 
              value={baslik} 
              onChange={e => setBaslik(e.target.value)} 
              placeholder="Örn: Market alışverişi" 
              autoFocus
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', background: 'var(--bg)', width: '100%' }}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '11px', fontWeight: '800' }}>Saat</label>
            <input 
              type="time" 
              value={saat} 
              onChange={e => setSaat(e.target.value)} 
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', background: 'var(--bg)', width: '100%' }}
            />
          </div>
          <button className="submit-btn" onClick={handleSave} style={{ background: '#8b5cf6', width: '100%', padding: '14px', borderRadius: '14px', color: 'white', fontWeight: '800', border: 'none', marginTop: '10px', cursor: 'pointer' }}>
            Bildirimle Kaydet
          </button>
        </div>
      </div>
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()} style={{ maxWidth: '340px' }}>
        <header className="modal-header">
          <h3>📝 Aktivite Detayı</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>
        <div className="modal-form" style={{ marginTop: '15px' }}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label>{activity.baslik} Detayı (Film, Oyun, Restoran vb.)</label>
            <input 
              type="text" 
              value={detay} 
              onChange={e => {
                setDetay(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Hangi film veya oyun?" 
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', background: 'var(--bg)', width: '100%' }}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="autocomplete-dropdown glass" style={{ 
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, 
                maxHeight: '150px', overflowY: 'auto', borderRadius: '12px', marginTop: '5px',
                border: '1px solid var(--brd)', background: 'white'
              }}>
                {filteredSuggestions.map((s, i) => (
                  <div 
                    key={i} 
                    className="suggestion-item" 
                    onClick={() => {
                      setDetay(s);
                      setShowSuggestions(false);
                    }}
                    style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}
                  >
                    ✨ {s}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="submit-btn social-gradient" onClick={handleSave} style={{ width: '100%', padding: '14px', borderRadius: '16px', border: 'none', color: 'white', fontWeight: '800', marginTop: '20px', cursor: 'pointer' }}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function CompleteActivityModal({ activity, onClose }) {
  const { completeSocialActivity } = useStore();
  const [cost, setCost] = useState(activity.harcama || activity.tahmini_harcama || '');
  const [comment, setComment] = useState('');
  const [pG, setPG] = useState(5);
  const [pE, setPE] = useState(5);

  const handleFinish = () => {
    completeSocialActivity(activity.id, Number(pG), Number(pE), Number(cost), comment);
    onClose();
    toast.success('Aktivite tamamlandı ve finans modülüne işlendi! 🎉');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h3>🎉 Tamamlandı</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>
        <div className="modal-form">
          <p style={{ textAlign:'center', marginBottom:'15px' }}><strong>{activity.baslik}</strong> nasıl geçti?</p>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={14} /> Toplam Harcama (₺)</label>
            <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="₺0" style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', background: 'var(--bg)' }} />
          </div>

          <div className="form-group">
            <label>Yorumun (Nasıl geçti?)</label>
            <textarea 
              value={comment} 
              onChange={e => setComment(e.target.value)} 
              placeholder="Harika bir gündü..." 
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', background: 'var(--bg)', width: '100%', minHeight: '60px', resize: 'none' }}
            />
          </div>

          <div className="score-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
            <div className="score-box glass" style={{ padding: '12px', borderRadius: '16px', textAlign: 'center' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', display: 'block', marginBottom: '8px' }}>👨 Görkem</label>
              <input type="range" min="1" max="10" value={pG} onChange={e => setPG(e.target.value)} style={{ width: '100%' }} />
              <div style={{ fontSize: '14px', fontWeight: '900', marginTop: '4px' }}>⭐ {pG}</div>
            </div>
            <div className="score-box glass" style={{ padding: '12px', borderRadius: '16px', textAlign: 'center' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', display: 'block', marginBottom: '8px' }}>👩 Esra</label>
              <input type="range" min="1" max="10" value={pE} onChange={e => setPE(e.target.value)} style={{ width: '100%' }} />
              <div style={{ fontSize: '14px', fontWeight: '900', marginTop: '4px' }}>⭐ {pE}</div>
            </div>
          </div>
          
          <button className="submit-btn social-gradient" onClick={handleFinish} style={{ width: '100%', padding: '14px', borderRadius: '16px', border: 'none', color: 'white', fontWeight: '800', marginTop: '20px', cursor: 'pointer' }}>
            Geçmişe Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function AddActivityModal({ onClose, initialDate, prefilledData }) {
  const { addSocialActivity, sosial } = useStore();
  const [baslik, setBaslik] = useState(prefilledData?.baslik || '');
  const [date, setDate] = useState(initialDate || '');
  const [saat, setSaat] = useState(prefilledData?.saat || '20:00');
  const [emoji, setEmoji] = useState(prefilledData?.emoji || '🎭');
  const [mekan, setMekan] = useState(prefilledData?.mekan || '');
  const [harcama, setHarcama] = useState(prefilledData?.harcama || '');
  const [tur, setTur] = useState(prefilledData?.tur || 'disari');
  const [kisiSayisi, setKisiSayisi] = useState('2');

  const handleSave = () => {
    if (!baslik) {
      toast.error('Lütfen bir başlık girin!');
      return;
    }

    // --- CONFLICT CHECK ---
    const existingActivities = sosial.aktiviteler || [];
    const hasConflict = existingActivities.some(a => 
      !a.tamamlandi && 
      a.tarih === date && 
      a.saat === saat
    );

    if (hasConflict) {
      const conflictAct = existingActivities.find(a => !a.tamamlandi && a.tarih === date && a.saat === saat);
      toast.error(`Bu saatte zaten "${conflictAct.baslik}" planlanmış! ⚠️`, {
        style: { borderRadius: '12px', background: '#333', color: '#fff' }
      });
      return;
    }

    addSocialActivity({
      baslik,
      emoji,
      tarih: date,
      saat,
      mekan,
      tur,
      tahmini_harcama: Number(harcama) || 0,
      kisi_sayisi: Number(kisiSayisi) || 2
    });
    onClose();
    toast.success('Aktivite planlandı! 🗓️');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h3>📅 Yeni Aktivite</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>
        <div className="modal-form">
          <div className="form-group">
            <label>Aktivite Başlığı</label>
            <input type="text" value={baslik} onChange={e => setBaslik(e.target.value)} placeholder="Örn: Sinema Gecesi" />
          </div>
          <div className="form-group">
            <label>Tarih</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} lang="tr-TR" />
          </div>
          <div className="form-group">
            <label>Mekan / Yer</label>
            <input type="text" value={mekan} onChange={e => setMekan(e.target.value)} placeholder="Örn: Emaar AVM" />
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Saat</label>
              <input type="time" value={saat} onChange={e => setSaat(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Emoji</label>
              <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🎭" />
            </div>
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
            <label>Tür</label>
            <select value={tur} onChange={e => setTur(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', background: 'var(--bg)', width: '100%' }}>
              <option value="disari">🌆 Dışarıda</option>
              <option value="evde">🏠 Evde</option>
            </select>
          </div>
          <button className="submit-btn social-gradient" onClick={handleSave} style={{ width: '100%', padding: '14px', borderRadius: '16px', border: 'none', color: 'white', fontWeight: '800', marginTop: '20px', cursor: 'pointer' }}>
            Planla
          </button>
        </div>
      </div>
    </div>
  );
}

function GecmisTab({ sosyal }) {
  const done = (sosyal.aktiviteler || []).filter(a => a.tamamlandi);
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

function HavuzTab({ sosyal, onAdd, onAddRutin }) {
  const ideas = sosyal.havuz || [];
  const rutinler = sosyal.rutinler || [];
  const { addSocialActivity, deleteRutin, pet, mutfak, arac } = useStore();
  const [planningIdea, setPlanningIdea] = useState(null);

  // --- SMART SYSTEM SCANNER (Multi-Module) ---
  const smartSuggestions = useMemo(() => {
    const list = [];
    const today = new Date();
    const fifteenDays = new Date(today.getTime() + (15 * 864e5));
    const thirtyDays = new Date(today.getTime() + (30 * 864e5));

    // 1. Pet Vaccines
    const allVaccines = Array.isArray(pet?.vaccines) ? pet.vaccines : Object.values(pet?.vaccines || {}).flat();
    allVaccines.forEach(v => {
      if (!v.last || !v.ev) return;
      const parts = v.last.split('.');
      const lastDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      const nextDate = new Date(lastDate.getTime() + (v.ev * 864e5));
      if (nextDate <= fifteenDays) {
        list.push({
          id: `vax-${v.n}-${v.petName}`,
          baslik: `${v.petName || 'Pet'}: ${v.n} Aşısı`,
          emoji: '🐾',
          tur: 'disari',
          mekan: 'Veteriner Kliniği',
          tahmini_harcama: 800,
          isUrgent: true,
          label: nextDate < today ? 'GÜNÜ GEÇMİŞ!' : `Vakti: ${nextDate.toLocaleDateString('tr-TR')}`,
          btn: 'VET PLANLA'
        });
      }
    });

    // 2. Kitchen -> Shopping
    if ((mutfak?.alisveris?.length || 0) >= 5) {
      list.push({
        id: 'smart-shopping',
        baslik: '🛒 Büyük Alışveriş Planla',
        emoji: '🛒',
        tur: 'disari',
        mekan: 'Market / Özkuruşlar',
        tahmini_harcama: 3000,
        label: `${mutfak.alisveris.length} ürün birikti!`,
        btn: 'PLANLA'
      });
    }

    // 3. Car -> Maintenance / Inspection
    if (arac?.muayene?.next) {
      const nextMuayene = new Date(arac.muayene.next);
      if (nextMuayene <= thirtyDays) {
        list.push({
          id: 'smart-car-insp',
          baslik: '🚗 Araç Muayene Planla',
          emoji: '🚨',
          tur: 'disari',
          mekan: 'TÜVTÜRK İstasyonu',
          tahmini_harcama: 1800,
          isUrgent: true,
          label: `Son Tarih: ${nextMuayene.toLocaleDateString('tr-TR')}`,
          btn: 'RANDEVU AL'
        });
      }
    }

    (arac?.ev || []).forEach(e => {
       if (e.dt) {
         const d = new Date(e.dt);
         if (d <= thirtyDays) {
           list.push({
             id: `smart-car-${e.id}`,
             baslik: `${e.nm} Yenileme`,
             emoji: e.ic || '🚗',
             tur: 'disari',
             mekan: 'Sigorta Acentesi',
             label: `Vade: ${d.toLocaleDateString('tr-TR')}`,
             btn: 'PLANLA'
           });
         }
       }
    });

    return list;
  }, [pet, mutfak, arac]);

  const startPlanning = (idea) => {
    setPlanningIdea(idea);
  };

  const finishPlanning = (details) => {
    addSocialActivity({
      ...planningIdea,
      ...details,
      tahmini_harcama: Number(details.harcama) || planningIdea.tahmini_harcama || 0
    });
    setPlanningIdea(null);
    toast.success(`${planningIdea.baslik} takvime işlendi! 🎯`);
  };

  return (
    <div className="tab-pane animate-fadeIn">
      {smartSuggestions.length > 0 && (
        <div className="smart-suggestions" style={{ marginBottom: '30px' }}>
          <div className="section-header" style={{ padding: '0 20px', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#c53030' }}>✨ Akıllı Öneriler</h3>
          </div>
          <div className="idea-list" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {smartSuggestions.map(v => (
              <div key={v.id} className="idea-list-item glass" style={{ borderColor: v.isUrgent ? '#fed7d7' : 'var(--brd)' }}>
                <span className="ili-emoji">{v.emoji}</span>
                <div className="ili-info">
                  <strong>{v.baslik}</strong>
                  <span style={{ color: v.isUrgent ? '#c53030' : 'var(--txt-light)' }}>
                    {v.label}
                  </span>
                </div>
                <button className="ili-plan-btn" onClick={() => startPlanning(v)} style={{ background: v.isUrgent ? '#c53030' : '#8b5cf6' }}>
                   {v.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--txt)' }}>💡 Fikir Havuzu ({ideas.length})</h3>
        <button className="add-btn-small" onClick={onAdd} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--brd)', background: 'white', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Plus size={20} />
        </button>
      </div>

      <div style={{ padding: '0 20px 16px', fontSize: '13px', fontWeight: '800', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>✨ Senin için seçtiğim sevimli fikirler!</span>
      </div>
      
      {ideas.length === 0 && (
        <div className="curated-ideas-list" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
           <p style={{ fontSize: '11px', opacity: 0.6 }}>Önerilen Fikirler:</p>
           {[
             { id: 'i1', baslik: 'Evde Sinema Gecesi', tur: 'evde', emoji: '🍿', freq: 'Haftalık' },
             { id: 'i2', baslik: 'Sahil Yürüyüşü & Dondurma', tur: 'disari', emoji: '🍦', freq: 'Haftalık' },
             { id: 'i3', baslik: 'Yeni Bir Tarif Deneme', tur: 'evde', emoji: '👨‍🍳', freq: 'Aylık' },
             { id: 'i4', baslik: 'Kutu Oyunları Turnuvası', tur: 'evde', emoji: '🎲', freq: 'Haftalık' },
             { id: 'i5', baslik: 'Piknik Yapma', tur: 'disari', emoji: '🧺', freq: 'Mevsimlik' },
             { id: 'i6', baslik: 'Fotoğraf Günü', tur: 'disari', emoji: '📸', freq: 'Aylık' }
           ].map(i => (
             <div key={i.id} className="idea-list-item glass">
                <span className="ili-emoji">{i.emoji}</span>
                <div className="ili-info">
                   <strong>{i.baslik}</strong>
                   <span>{i.freq}</span>
                </div>
                <button className="ili-plan-btn" onClick={() => startPlanning(i)}>PLANLA</button>
             </div>
           ))}
        </div>
      )}
      
      <div className="idea-list" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ideas.map(i => (
          <div key={i.id} className="idea-list-item glass">
             <span className="ili-emoji">{i.emoji || (i.tur === 'evde' ? '🏠' : '🌆')}</span>
             <div className="ili-info">
                <strong>{i.baslik}</strong>
                <span>{i.freq || 'Haftalık'} · {i.count || 0} Kez</span>
             </div>
             <button className="ili-plan-btn" onClick={() => startPlanning(i)}>PLANLA</button>
          </div>
        ))}
      </div>

      {planningIdea && (
        <PlanIdeaModal 
          idea={planningIdea} 
          onClose={() => setPlanningIdea(null)} 
          onConfirm={finishPlanning} 
        />
      )}

      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginTop: '40px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--txt)' }}>🏋️ Rutinler ({rutinler.length})</h3>
        <button className="add-btn-small" onClick={onAddRutin} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--brd)', background: 'white', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Plus size={20} />
        </button>
      </div>

      <div className="rutin-list" style={{ padding: '0 20px' }}>
        {rutinler.map(r => (
          <div key={r.id} className="tl-content glass" style={{ marginBottom: '12px', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <strong>{r.aktivite}</strong>
              <button onClick={() => deleteRutin(r.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444' }}><Trash2 size={16} /></button>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7, display: 'flex', gap: '10px' }}>
              <span>👤 {r.kisi}</span>
              <span>⏰ {r.saati}</span>
              <span>💰 ₺{r.ucret}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((g, idx) => (
                <div key={g} style={{ 
                  padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: '800',
                  background: (r.gunler || []).includes(idx+1) ? '#8b5cf6' : 'var(--bg)',
                  color: (r.gunler || []).includes(idx+1) ? 'white' : 'var(--txt-light)'
                }}>{g}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Alt Listeler - İzlenen Filmler */}
      <div className="section-header" style={{ padding: '0 20px', marginTop: '40px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--txt)' }}>🎬 İzlenen Filmler</h3>
      </div>
      <div className="movie-list" style={{ padding: '0 20px' }}>
        {(sosyal.aktiviteler || []).filter(a => a.tamamlandi && a.baslik.toLowerCase().includes('film')).length > 0 ? (
          (sosyal.aktiviteler || []).filter(a => a.tamamlandi && a.baslik.toLowerCase().includes('film')).map(m => (
            <div key={m.id} className="tl-content glass" style={{ marginBottom: '8px', padding: '12px' }}>
               <div style={{ fontSize: '20px' }}>🍿</div>
               <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '14px' }}>{m.baslik}</strong>
                  <div style={{ fontSize: '11px', opacity: 0.6 }}>{new Date(m.tarih).toLocaleDateString('tr-TR')} · ⭐ {m.puan_gorkem}/{m.puan_esra}</div>
               </div>
            </div>
          ))
        ) : (
          <div className="glass" style={{ padding: '20px', textAlign: 'center', borderRadius: '20px', opacity: 0.6 }}>
            <p style={{ fontSize: '13px' }}>Henüz izlenen film kaydı yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}



function AddRutinModal({ onClose }) {
  const { addRutin } = useStore();
  const [formData, setFormData] = useState({ aktivite: '', kisi: 'Görkem', gunler: [], saati: '09:00', ucret: 0, sure: 'Belirsiz' });
  const gunler = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const toggleDay = (idx) => {
    const dayVal = idx + 1;
    const next = formData.gunler.includes(dayVal) 
      ? formData.gunler.filter(d => d !== dayVal)
      : [...formData.gunler, dayVal];
    setFormData({ ...formData, gunler: next });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addRutin(formData);
    onClose();
    toast.success('Rutin eklendi! 🏋️');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h3>🏋️ Rutin Ekle</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>
        <form className="modal-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <div className="form-group">
            <label>Aktivite Adı</label>
            <input type="text" value={formData.aktivite} onChange={e => setFormData({...formData, aktivite: e.target.value})} placeholder="ör: Spor Salonu" required />
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Kişi</label>
              <select value={formData.kisi} onChange={e => setFormData({...formData, kisi: e.target.value})}>
                <option value="Görkem">👨 Görkem</option>
                <option value="Esra">👩 Esra</option>
                <option value="İkisi">👫 İkisi</option>
              </select>
            </div>
            <div className="form-group">
              <label>Saat</label>
              <input type="time" value={formData.saati} onChange={e => setFormData({...formData, saati: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Günler</label>
            <div className="day-selector" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {gunler.map((g, idx) => (
                <button 
                  key={g} 
                  type="button"
                  className={`day-btn ${formData.gunler.includes(idx + 1) ? 'active' : ''}`}
                  onClick={() => toggleDay(idx)}
                  style={{ 
                    padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--brd)',
                    background: formData.gunler.includes(idx + 1) ? '#8b5cf6' : 'white',
                    color: formData.gunler.includes(idx + 1) ? 'white' : 'var(--txt-light)',
                    fontSize: '12px', fontWeight: '800', cursor: 'pointer'
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="submit-btn social-gradient" style={{ padding: '14px', borderRadius: '16px', border: 'none', color: 'white', fontWeight: '800', marginTop: '10px', cursor: 'pointer' }}>
            Rutin Oluştur
          </button>
        </form>
      </div>
    </div>
  );
}

function AddFikirModal({ onClose }) {
  const { addSocialPoolItem } = useStore();
  const [formData, setFormData] = useState({ baslik: '', tur: 'disari', tahmini_harcama: '', emoji: '💡', freq: 'Aylık' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addSocialPoolItem(formData);
    onClose();
    toast.success('Fikir havuza atıldı! 💡');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h3>💡 Fikir Ekle</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>
        <form className="modal-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <div className="form-group">
            <label>Fikir</label>
            <input type="text" value={formData.baslik} onChange={e => setFormData({...formData, baslik: e.target.value})} placeholder="Ne yapalım?" required />
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Tür</label>
              <select value={formData.tur} onChange={e => setFormData({...formData, tur: e.target.value})}>
                <option value="disari">🌆 Dışarı</option>
                <option value="evde">🏠 Evde</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sıklık</label>
              <select value={formData.freq} onChange={e => setFormData({...formData, freq: e.target.value})}>
                <option>Haftalık</option>
                <option>Aylık</option>
                <option>Mevsimlik</option>
                <option>Yıllık</option>
              </select>
            </div>
          </div>
          <button type="submit" className="submit-btn social-gradient" style={{ padding: '14px', borderRadius: '16px', border: 'none', color: 'white', fontWeight: '800', marginTop: '10px', cursor: 'pointer' }}>
            Havuza At
          </button>
        </form>
      </div>
    </div>
  );
}

function PlanIdeaModal({ idea, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    tarih: new Date().toISOString().split('T')[0],
    saat: '20:00',
    mekan: '',
    detay: '',
    harcama: idea.tahmini_harcama || ''
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h3>🎯 {idea.baslik} Planla</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </header>
        <div className="modal-form">
          <p style={{ textAlign: 'center', marginBottom: '15px', fontSize: '13px' }}>{idea.emoji} Bu fikri ne zaman gerçekleştirelim?</p>
          
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
            <label>Nerede / Hangi Film / Detay</label>
            <input 
              type="text" 
              value={formData.mekan} 
              onChange={e => setFormData({...formData, mekan: e.target.value})} 
              placeholder={idea.baslik.toLowerCase().includes('film') ? 'Film adı ne?' : 'Mekan neresi?'} 
            />
          </div>

          <div className="form-group">
            <label>Tahmini Bütçe (₺)</label>
            <input type="number" value={formData.harcama} onChange={e => setFormData({...formData, harcama: e.target.value})} placeholder="₺0" />
          </div>

          <button className="submit-btn social-gradient" onClick={() => onConfirm(formData)} style={{ width: '100%', padding: '14px', borderRadius: '16px', border: 'none', color: 'white', fontWeight: '800', marginTop: '10px', cursor: 'pointer' }}>
            Takvime İşle
          </button>
        </div>
      </div>
    </div>
  );
}

