import React, { useState, useEffect, useMemo } from 'react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ActionSheet from '../components/ActionSheet';
import { 
  Plane, Map, ShieldCheck, Star, 
  Plus, Trash2, Calendar, MapPin, 
  Hotel, Wallet, CheckSquare, Cloud, 
  ArrowRight, AlertCircle, Info, Timer, X, ArrowLeft,
  PlusCircle, ExternalLink, Ticket, Navigation, Check, Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './Tatil.css';

export default function Tatil() {
  const navigate = useNavigate();
  const { tatil, setModuleData, addTrip } = useStore();
  const [activeTab, setActiveTab] = useState(tatil.ttab || 'trips');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [editingPassport, setEditingPassport] = useState(null); // 'gorkem' or 'esra'
  const [showTracker, setShowTracker] = useState(false);
  const [trackerFlight, setTrackerFlight] = useState('');

  const updateTab = (tab) => {
    setActiveTab(tab);
    setModuleData('tatil', { ...tatil, ttab: tab });
  };

  const tabs = [
    { id: 'trips', emoji: '🌍', label: 'Tatiller' },
    { id: 'arsiv', emoji: '✅', label: 'Arşiv' },
    { id: 'harita', emoji: '🗺️', label: 'Harita' },
    { id: 'pasaport', emoji: '🛂', label: 'Pasaport' },
    { id: 'hayal', emoji: '⭐', label: 'Hayaller' }
  ];

  return (
    <AnimatedPage className="tatil-container">
      <header className="module-header glass tatil-gradient">
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">✈️</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Tatil</h1>
              <p>Seyahat & Gezi Takibi</p>
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
              <span style={{ fontSize: '18px', marginBottom: '2px' }}>{tab.emoji}</span>
              <span style={{ fontSize: '10px' }}>{tab.label}</span>
              {activeTab === tab.id && <div className="tab-dot" />}
            </button>
          ))}
        </nav>
      </header>

      <div className="tab-content">
        {activeTab === 'trips' && <TripsTab tatil={tatil} onSelectTrip={setSelectedTrip} onShowWizard={() => setShowWizard(true)} />}
        {activeTab === 'arsiv' && <ArsivTab tatil={tatil} onSelectTrip={setSelectedTrip} />}
        {activeTab === 'harita' && <HaritaTab tatil={tatil} />}
        {activeTab === 'pasaport' && <PasaportTab tatil={tatil} onEdit={setEditingPassport} />}
        {activeTab === 'hayal' && <HayalTab tatil={tatil} />}
      </div>

      <ActionSheet 
        isOpen={!!editingPassport} 
        onClose={() => setEditingPassport(null)} 
        title={`🛂 ${editingPassport === 'gorkem' ? 'Görkem' : 'Esra'} Pasaport Bilgisi`}
      >
        <ManagePassportContent 
          pid={editingPassport} 
          data={tatil.passport?.[editingPassport]} 
          onClose={() => setEditingPassport(null)} 
        />
      </ActionSheet>

      <ActionSheet
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        title={selectedTrip?.title || selectedTrip?.city || 'Tatil Detayı'}
        fullHeight
      >
        {selectedTrip && (
          <TripDetailContent 
            trip={selectedTrip} 
            onOpenTracker={(no) => {
              setTrackerFlight(no);
              setShowTracker(true);
            }}
          />
        )}
      </ActionSheet>

      <ActionSheet
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        title="🌍 Tatil Sihirbazı"
      >
        <PlanningWizardContent onAdd={(trip) => {
          addTrip(trip);
          setShowWizard(false);
          toast.success('Tatil planı oluşturuldu! ✨');
        }} />
      </ActionSheet>

      <ActionSheet
        isOpen={showTracker}
        onClose={() => setShowTracker(false)}
        title={`Canlı Takip: ${trackerFlight}`}
      >
        <div className="live-tracker-container">
          <iframe
            src={`https://www.flightradar24.com/simple_flight_tracker/${trackerFlight.replace(/\s+/g, '')}`}
            width="100%"
            height="500px"
            frameBorder="0"
            title="Flight Tracker"
            className="tracker-iframe"
          />
          <div className="tracker-footer">
            <p>ℹ️ Veriler FlightRadar24 üzerinden canlı sağlanmaktadır.</p>
            <button className="tracker-external-btn" onClick={() => window.open(`https://www.flightradar24.com/data/flights/${trackerFlight.replace(/\s+/g, '')}`, '_blank')}>
              <ExternalLink size={14} /> Detaylı Sitede Aç
            </button>
          </div>
        </div>
      </ActionSheet>
    </AnimatedPage>
  );
}

function TripsTab({ tatil, onSelectTrip, onShowWizard }) {
  const trips = tatil.trips || [];
  const kesin = trips.filter(t => t.status === 'kesin');
  const planlanan = trips.filter(t => t.status === 'planlandi');

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="trip-sections">
        {/* Kesinleşen Tatiller */}
        <div className="trip-group">
          <div className="section-header">
            <h3>📍 Kesinleşen Tatiller</h3>
          </div>
          {kesin.length > 0 ? (
            kesin.map(t => <TripCard key={t.id} trip={t} isUpcoming onClick={() => onSelectTrip(t)} />)
          ) : (
            <div className="empty-substate glass">
              <p>Henüz kesinleşmiş bir tatil yok. Planladığın bir tatili kesinleştirebilirsin! ✈️</p>
            </div>
          )}
        </div>

        {/* Planlanan Tatiller */}
        <div className="trip-group mt-20">
          <div className="section-header">
            <h3>📝 Planlanan Tatiller</h3>
            <button className="btn-premium-action tatil" onClick={onShowWizard}>
              <PlusCircle size={18} />
              <span>Yeni Plan Ekle</span>
            </button>
          </div>
          {planlanan.length > 0 ? (
            planlanan.map(t => <TripCard key={t.id} trip={t} isUpcoming onClick={() => onSelectTrip(t)} />)
          ) : (
            <div className="empty-substate glass" onClick={onShowWizard} style={{ cursor: 'pointer' }}>
              <p>Henüz planlanmış bir tatil yok. Yeni bir macera planlamaya ne dersin? ✨</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArsivTab({ tatil, onSelectTrip }) {
  const trips = tatil.trips || [];
  const past = trips.filter(t => t.status === 'tamamlandi')
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="trip-group">
        <div className="section-header">
          <h3>✅ Geçmiş Tatiller</h3>
        </div>
        {past.length > 0 ? (
          past.map(t => <TripCard key={t.id} trip={t} onClick={() => onSelectTrip(t)} />)
        ) : (
          <div className="empty-substate glass">
            <p>Henüz arşivlenmiş bir tatil bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TripCard({ trip, isUpcoming, onClick }) {
  const daysLeft = trip.startDate ? Math.ceil((new Date(trip.startDate) - new Date()) / 864e5) : null;
  return (
    <div className={`trip-card glass type-${trip.type} ${isUpcoming ? 'upcoming' : ''}`} onClick={onClick}>
      <div className="trip-main">
        <div className="trip-meta-top">
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="t-type">{trip.type === 'yurtdisi' ? '✈️ Yurtdışı' : '🚗 Yurtiçi'}</span>
            {trip.status === 'kesin' && <span className="t-status-badge kesin">📍 Kesinleşti</span>}
            {trip.status === 'planlandi' && <span className="t-status-badge plan">📝 Planlandı</span>}
          </div>
          {isUpcoming && daysLeft !== null && daysLeft > 0 && <span className="t-countdown">⏳ {daysLeft} gün kaldı</span>}
        </div>
        <div className="trip-info">
          <strong>{trip.title || trip.city}</strong>
          <span>{trip.country} {trip.city && `· ${trip.city}`}</span>
        </div>
        <div className="trip-date">
          <Calendar size={12} />
          <span>{trip.startDate} - {trip.endDate}</span>
        </div>
      </div>
      <div className="trip-actions"><ArrowRight size={18} /></div>
    </div>
  );
}

function PlanningWizardContent({ onAdd }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ 
    title: '', country: 'Türkiye', city: '', type: 'yurtdisi', 
    startDate: '', endDate: '', budget: { est: '', real: 0 },
    status: 'planlandi',
    valiz: { gorkem: [], esra: [] },
    hotels: [],
    flights: []
  });

  return (
    <div className="wizard-body-standard">
      <div className="step-dots-row" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ 
            width: '10px', height: '10px', borderRadius: '50%', 
            background: step >= i ? 'var(--tatil)' : 'var(--brd)',
            transition: 'background 0.3s'
          }} />
        ))}
      </div>

      <div className="wizard-step-content">
        {step === 1 && (
          <div className="wizard-step animate-fadeIn">
            <h4 style={{ margin: '0 0 15px', fontSize: '15px', fontWeight: '900' }}>Nereye Gidiyoruz? 🌍</h4>
            <div className="form-group">
              <label>Tatil Başlığı</label>
              <input type="text" placeholder="Örn: Roma Kaçamağı" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ülke</label>
                <input type="text" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Şehir</label>
                <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
              </div>
            </div>
            <div className="form-row type-selector" style={{ marginTop: '12px' }}>
               <button 
                className={form.type === 'yurtdisi' ? 'active' : ''} 
                onClick={() => setForm({...form, type: 'yurtdisi'})}
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', background: form.type === 'yurtdisi' ? 'var(--tatil-light)' : 'white', color: form.type === 'yurtdisi' ? 'var(--tatil)' : 'var(--txt)', fontWeight: '800', cursor: 'pointer' }}
               >✈️ Yurtdışı</button>
               <button 
                className={form.type === 'yurtici' ? 'active' : ''} 
                onClick={() => setForm({...form, type: 'yurtici'})}
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', background: form.type === 'yurtici' ? 'var(--tatil-light)' : 'white', color: form.type === 'yurtici' ? 'var(--tatil)' : 'var(--txt)', fontWeight: '800', cursor: 'pointer' }}
               >🚗 Yurtiçi</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="wizard-step animate-fadeIn">
            <h4 style={{ margin: '0 0 15px', fontSize: '15px', fontWeight: '900' }}>Ne Zaman? 📅</h4>
            <div className="form-row">
              <div className="form-group"><label>Başlangıç</label><input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} /></div>
              <div className="form-group"><label>Bitiş</label><input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} /></div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="wizard-step animate-fadeIn">
            <h4 style={{ margin: '0 0 15px', fontSize: '15px', fontWeight: '900' }}>Detaylar 💰</h4>
            <div className="form-group">
              <label>Tahmini Bütçe (₺)</label>
              <input type="number" placeholder="0" value={form.budget.est} onChange={e => setForm({...form, budget: { ...form.budget, est: e.target.value }})} />
            </div>
          </div>
        )}
      </div>

      <div className="wizard-footer-standard" style={{ display: 'flex', gap: '10px', marginTop: '30px', paddingBottom: '20px' }}>
        {step > 1 && <button className="submit-btn" onClick={() => setStep(s => s - 1)} style={{ flex: 1, background: 'white', border: '1px solid var(--brd)', color: 'var(--txt)' }}>Geri</button>}
        {step < 3 ? (
          <button className="submit-btn tatil" onClick={() => setStep(s => s + 1)} style={{ flex: 2, background: 'var(--tatil)' }}>Devam Et</button>
        ) : (
          <button className="submit-btn tatil" onClick={() => onAdd(form)} style={{ flex: 2, background: 'var(--tatil)' }}>Planı Oluştur ✨</button>
        )}
      </div>
    </div>
  );
}

function TripDetailContent({ trip, onOpenTracker }) {
  const { addExpense, tatil, setModuleData } = useStore();
  const duration = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 864e5) || 0;
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('valiz'); // valiz, dokuman, butce

  const handleUpdateTrip = (updates) => {
     const trips = tatil.trips.map(t => t.id === trip.id ? { ...t, ...updates } : t);
     setModuleData('tatil', { ...tatil, trips });
  };

  const setStatus = (status) => {
    handleUpdateTrip({ status });
    toast.success(status === 'kesin' ? 'Tatil kesinleşti! ✈️' : 'Tatil arşive eklendi! ✅');
  };

  return (
    <div className="trip-detail-premium animate-fadeIn">
      {/* Hero Card */}
      <div className="trip-hero glass" style={{ background: trip.status === 'tamamlandi' ? 'linear-gradient(135deg, #475569, #64748b)' : 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>
        <div className="hero-content">
          <div className="hero-emoji animate-float">{trip.type === 'yurtdisi' ? '✈️' : '🚗'}</div>
          <div className="hero-text">
            <h2>{trip.title || trip.city}, {trip.country}</h2>
            <div className="hero-meta-row">
              <span className="h-meta-pill">📅 {trip.startDate}</span>
              <span className="h-meta-pill">🌙 {duration} Gece</span>
              {trip.status === 'kesin' && <span className="h-meta-pill" style={{ background: '#10b981' }}>✅ Kesinleşti</span>}
            </div>
          </div>
        </div>
        <div className="weather-widget-mini glass">
          <Cloud size={24} color="white" />
          <div className="w-temp">24°C</div>
          <div className="w-city">Güneşli</div>
        </div>
      </div>

      {/* Lifecycle Actions */}
      <div className="lifecycle-actions" style={{ padding: '0 20px', display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {trip.status === 'planlandi' && (
          <button className="btn-action-premium kesin-btn" onClick={() => setStatus('kesin')} style={{ background: '#10b981', color: 'white', flex: 1 }}>
            <ShieldCheck size={18} /> Planı Kesinleştir
          </button>
        )}
        {trip.status === 'kesin' && (
          <button className="btn-action-premium arsiv-btn" onClick={() => setStatus('tamamlandi')} style={{ background: '#64748b', color: 'white', flex: 1 }}>
            <CheckSquare size={18} /> Tatili Tamamla
          </button>
        )}
        {trip.status === 'tamamlandi' && (
           <div className="archive-badge-full">Bu tatil başarıyla tamamlandı. ❤️</div>
        )}
      </div>

      {/* Sub Navigation */}
      <div className="detail-sub-nav">
        <button className={activeSubTab === 'valiz' ? 'active' : ''} onClick={() => setActiveSubTab('valiz')}>🧳 Valiz</button>
        <button className={activeSubTab === 'dokuman' ? 'active' : ''} onClick={() => setActiveSubTab('dokuman')}>📑 Detaylar</button>
        <button className={activeSubTab === 'butce' ? 'active' : ''} onClick={() => setActiveSubTab('butce')}>💰 Bütçe</button>
      </div>

      <div className="detail-body">
        {activeSubTab === 'valiz' && (
          <ValizSection trip={trip} />
        )}

        {activeSubTab === 'dokuman' && (
          <div className="docs-view animate-fadeIn">
            <TripSmartDetails 
              trip={trip} 
              onUpdate={handleUpdateTrip} 
              onOpenTracker={onOpenTracker}
            />

            <div className="doc-card glass mt-15">
              <div className="dc-header"><MapPin size={18} /> <strong>Genel Notlar</strong></div>
              <div className="dc-body">
                <textarea 
                  value={trip.notes || ''} 
                  placeholder="Gidilecek yerler, yemek listesi vb."
                  onChange={e => handleUpdateTrip({ notes: e.target.value })} 
                  style={{ minHeight: '100px' }}
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'butce' && (
          <BudgetSection trip={trip} onShowExpense={() => setShowExpenseModal(true)} />
        )}
      </div>

      <ActionSheet
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="💸 Tatil Harcaması"
      >
        <AddTripExpenseContent trip={trip} onAdd={(exp) => { 
          const amount = Number(exp.amount);
          addExpense({ ...exp, category: 'tatil', title: `✈️ ${trip.city}: ${exp.title}` }); 
          handleUpdateTrip({ 
            budget: { 
              ...trip.budget, 
              real: (trip.budget?.real || 0) + amount 
            } 
          });
          setShowExpenseModal(false); 
          toast.success('Harcama kaydedildi! 💸'); 
        }} />
      </ActionSheet>
    </div>
  );
}

function TripSmartDetails({ trip, onUpdate, onOpenTracker }) {
  const [editingSection, setEditingSection] = useState(null); // 'dep', 'ret', 'acc'
  
  // Local state for forms
  const [depForm, setDepForm] = useState(trip.transportation?.departure || { flightNo: '', airline: '', pnr: '', time: '', status: 'Planlandı' });
  const [retForm, setRetForm] = useState(trip.transportation?.return || { flightNo: '', airline: '', pnr: '', time: '', status: 'Planlandı' });
  const [accForm, setAccForm] = useState(trip.accommodation || { hotel: '', address: '', bookingId: '', link: '' });

  useEffect(() => {
    setDepForm(trip.transportation?.departure || { flightNo: '', airline: '', pnr: '', time: '', status: 'Planlandı' });
    setRetForm(trip.transportation?.return || { flightNo: '', airline: '', pnr: '', time: '', status: 'Planlandı' });
    setAccForm(trip.accommodation || { hotel: '', address: '', bookingId: '', link: '' });
  }, [trip]);

  const handleSave = (section) => {
    const updates = { ...trip };
    if (section === 'dep') updates.transportation.departure = depForm;
    if (section === 'ret') updates.transportation.return = retForm;
    if (section === 'acc') updates.accommodation = accForm;
    
    onUpdate(updates);
    setEditingSection(null);
    toast.success('Bilgiler güncellendi! ✨');
  };

  const openFlightRadar = (no) => {
    if (!no) return toast.error('Uçuş numarası gerekli');
    onOpenTracker(no);
  };

  const openMaps = (query) => {
    if (!query) return toast.error('Otel adı veya adresi gerekli');
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
  };

  const openBooking = () => {
    const link = accForm.link || `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(accForm.hotel || '')}`;
    window.open(link, '_blank');
  };

  return (
    <div className="smart-details-container animate-fadeIn">
      <div className="section-header-compact">
        <h3>✨ Seyahat Asistanı</h3>
        <p className="helper-text">Uçuş numarasını girip düzenle derseniz asistan bilgileri sizin için güncelleyecektir.</p>
      </div>

      <div className="smart-cards-grid compact">
        {/* Departure Flight */}
        <div className={`smart-card mini ${editingSection === 'dep' ? 'editing' : ''}`}>
          <div className="sc-header-row">
            <div className="sc-label">
              <Plane size={14} className="sc-icon blue" />
              <span>Gidiş</span>
            </div>
            <button className="sc-edit-btn" onClick={() => editingSection === 'dep' ? handleSave('dep') : setEditingSection('dep')}>
              {editingSection === 'dep' ? <Check size={14} /> : <Edit3 size={14} />}
            </button>
          </div>
          <div className="sc-content">
            {editingSection === 'dep' ? (
              <div className="sc-inputs">
                <input placeholder="Uçuş No" value={depForm.flightNo} onChange={e => setDepForm({...depForm, flightNo: e.target.value.toUpperCase()})} />
                <input placeholder="Saat / Bilgi" value={depForm.time} onChange={e => setDepForm({...depForm, time: e.target.value})} />
                <input placeholder="PNR" value={depForm.pnr} onChange={e => setDepForm({...depForm, pnr: e.target.value})} />
              </div>
            ) : (
              <div className="sc-view">
                <div className="sc-row-main">
                  <strong>{depForm.flightNo || '---'}</strong>
                  {depForm.flightNo && (
                    <button className="sc-live-badge" onClick={() => openFlightRadar(depForm.flightNo)}>
                      <span className="live-dot"></span> CANLI
                    </button>
                  )}
                </div>
                <small>{depForm.time || 'Saat belirtilmedi'}</small>
                {depForm.pnr && <div className="pnr-mini">PNR: {depForm.pnr}</div>}
              </div>
            )}
          </div>
        </div>

        {/* Return Flight */}
        <div className={`smart-card mini ${editingSection === 'ret' ? 'editing' : ''}`}>
          <div className="sc-header-row">
            <div className="sc-label">
              <Plane size={14} className="sc-icon blue" style={{ transform: 'rotate(180deg)' }} />
              <span>Dönüş</span>
            </div>
            <button className="sc-edit-btn" onClick={() => editingSection === 'ret' ? handleSave('ret') : setEditingSection('ret')}>
              {editingSection === 'ret' ? <Check size={14} /> : <Edit3 size={14} />}
            </button>
          </div>
          <div className="sc-content">
            {editingSection === 'ret' ? (
              <div className="sc-inputs">
                <input placeholder="Uçuş No" value={retForm.flightNo} onChange={e => setRetForm({...retForm, flightNo: e.target.value.toUpperCase()})} />
                <input placeholder="Saat / Bilgi" value={retForm.time} onChange={e => setRetForm({...retForm, time: e.target.value})} />
                <input placeholder="PNR" value={retForm.pnr} onChange={e => setRetForm({...retForm, pnr: e.target.value})} />
              </div>
            ) : (
              <div className="sc-view">
                <div className="sc-row-main">
                  <strong>{retForm.flightNo || '---'}</strong>
                  {retForm.flightNo && (
                    <button className="sc-live-badge" onClick={() => openFlightRadar(retForm.flightNo)}>
                      <span className="live-dot"></span> CANLI
                    </button>
                  )}
                </div>
                <small>{retForm.time || 'Saat belirtilmedi'}</small>
                {retForm.pnr && <div className="pnr-mini">PNR: {retForm.pnr}</div>}
              </div>
            )}
          </div>
        </div>

        {/* Accommodation */}
        <div className={`smart-card mini ${editingSection === 'acc' ? 'editing' : ''}`}>
          <div className="sc-header-row">
            <div className="sc-label">
              <Hotel size={14} className="sc-icon orange" />
              <span>Otel</span>
            </div>
            <button className="sc-edit-btn" onClick={() => editingSection === 'acc' ? handleSave('acc') : setEditingSection('acc')}>
              {editingSection === 'acc' ? <Check size={14} /> : <Edit3 size={14} />}
            </button>
          </div>
          <div className="sc-content">
            {editingSection === 'acc' ? (
              <div className="sc-inputs">
                <input placeholder="Otel Adı" value={accForm.hotel} onChange={e => setAccForm({...accForm, hotel: e.target.value})} />
                <input placeholder="Adres" value={accForm.address} onChange={e => setAccForm({...accForm, address: e.target.value})} />
                <input placeholder="Booking Link" value={accForm.link} onChange={e => setAccForm({...accForm, link: e.target.value})} />
              </div>
            ) : (
              <div className="sc-view">
                <strong>{accForm.hotel || 'Otel Girilmedi'}</strong>
                <small className="truncate">{accForm.address || 'Adres belirtilmedi'}</small>
              </div>
            )}
          </div>
          {editingSection !== 'acc' && (
            <div className="sc-mini-row">
              <button className="sc-mini-action" onClick={() => openMaps(accForm.hotel || accForm.address)}>
                <MapPin size={10} /> Konum
              </button>
              <button className="sc-mini-action" onClick={openBooking}>
                <ExternalLink size={10} /> Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ValizSection({ trip }) {
  const { updateTripValiz } = useStore();
  return (
    <div className="packing-lists-container">
      <div className="packing-section">
        <h4>👨 Görkem'in Valizi</h4>
        <div className="p-list">
          {(trip.valiz?.gorkem || []).length > 0 ? trip.valiz.gorkem.map(item => (
            <div key={item.id} className={`p-item glass ${item.done ? 'done' : ''}`} onClick={() => updateTripValiz(trip.id, 'gorkem', item.id)}>
              <div className="p-check">{item.done && <CheckSquare size={14} />}</div>
              <span>{item.text}</span>
            </div>
          )) : <div className="p-empty">Liste boş</div>}
        </div>
      </div>
      <div className="packing-section mt-20">
        <h4>👩 Esra'nın Valizi</h4>
        <div className="p-list">
          {(trip.valiz?.esra || []).length > 0 ? trip.valiz.esra.map(item => (
            <div key={item.id} className={`p-item glass ${item.done ? 'done' : ''}`} onClick={() => updateTripValiz(trip.id, 'esra', item.id)}>
              <div className="p-check">{item.done && <CheckSquare size={14} />}</div>
              <span>{item.text}</span>
            </div>
          )) : <div className="p-empty">Liste boş</div>}
        </div>
      </div>
    </div>
  );
}

function BudgetSection({ trip, onShowExpense }) {
  return (
    <div className="budget-view animate-fadeIn">
      <div className="budget-stats">
        <div className="bs-item">
          <span>Tahmini</span>
          <strong>{trip.budget?.est || 0}₺</strong>
        </div>
        <div className="bs-item">
          <span>Harcanan</span>
          <strong style={{ color: 'var(--tatil)' }}>{trip.budget?.real || 0}₺</strong>
        </div>
      </div>
      <div className="budget-bar-container">
        <div className="b-bar">
          <div className="b-fill" style={{ width: `${Math.min(100, ((trip.budget?.real || 0) / (trip.budget?.est || 1)) * 100)}%` }} />
        </div>
      </div>
      <button className="btn-action-premium tatil mt-20" onClick={onShowExpense}>
        <Plus size={18} /> Harcama Ekle
      </button>
    </div>
  );
}

function AddTripExpenseContent({ onAdd }) {
  const [form, setForm] = useState({ title: '', amount: '', payer: 'ortak' });
  return (
    <div className="modal-form-premium">
      <div className="form-group">
        <label>Harcama Kalemi</label>
        <input type="text" placeholder="Örn: Akşam Yemeği, Ulaşım..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="premium-input" />
      </div>
      <div className="form-group">
        <label>Tutar (₺)</label>
        <input type="number" placeholder="0₺" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="premium-input" />
      </div>
      <div className="user-select-grid">
        <button type="button" className={form.payer === 'gorkem' ? 'active' : ''} onClick={() => setForm({...form, payer: 'gorkem'})}>Görkem</button>
        <button type="button" className={form.payer === 'esra' ? 'active' : ''} onClick={() => setForm({...form, payer: 'esra'})}>Esra</button>
      </div>
      <button onClick={() => onAdd(form)} className="submit-btn-premium tatil">Harcamayı Ekle</button>
    </div>
  );
}

function PassportCard({ pid, data, label, onEdit }) {
  const daysLeft = data?.exp ? Math.ceil((new Date(data.exp) - new Date()) / 864e5) : null;
  const isExpired = daysLeft !== null && daysLeft < 0;
  const isWarning = daysLeft !== null && daysLeft < 180;
  return (
    <div className={`p-card glass ${isWarning ? 'warning' : ''}`}>
      <div className="p-header">
        <strong>🛂 {label}</strong>
        <button className="edit-btn" onClick={() => onEdit(pid)}><Plus size={14} /></button>
      </div>
      <div className="p-body">
        {data?.no ? (
          <>
            <div className="p-row"><span>No:</span> <strong>{data.no}</strong></div>
            <div className="p-row"><span>S.K.T:</span> <strong>{data.exp}</strong></div>
            {daysLeft !== null && (
              <div className={`p-status ${isExpired ? 'danger' : isWarning ? 'warn' : 'ok'}`}>
                {isExpired ? 'Süresi Doldu!' : `${daysLeft} gün kaldı`}
              </div>
            )}
          </>
        ) : (
          <div className="p-empty">Bilgi girilmedi</div>
        )}
      </div>
    </div>
  );
}

function ManagePassportContent({ pid, data, onClose }) {
  const { tatil, setModuleData } = useStore();
  const [form, setForm] = useState(data || { no: '', exp: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPassport = {
      ...(tatil.passport || {}),
      [pid]: form
    };
    setModuleData('tatil', { ...tatil, passport: updatedPassport });
    toast.success('Pasaport bilgisi güncellendi! 🛂');
    onClose();
  };

  return (
    <form className="modal-form-premium" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Pasaport No</label>
        <input 
          type="text" 
          value={form.no} 
          onChange={e => setForm({...form, no: e.target.value})} 
          placeholder="U12345678" 
          className="premium-input"
          required 
        />
      </div>
      <div className="form-group">
        <label>Son Kullanma Tarihi</label>
        <input 
          type="date" 
          value={form.exp} 
          onChange={e => setForm({...form, exp: e.target.value})} 
          className="premium-input"
          required 
        />
      </div>
      <button type="submit" className="submit-btn-premium tatil">Bilgileri Kaydet</button>
    </form>
  );
}

function PasaportTab({ tatil, onEdit }) {
  const p = tatil.passport || { gorkem: {}, esra: {} };
  const sch = { gorkem: { used: 12, left: 78 }, esra: { used: 5, left: 85 } };
  return (
    <div className="tab-pane animate-fadeIn">
      <div className="passport-grid">
        <PassportCard pid="gorkem" data={p.gorkem} label="Görkem Eray" onEdit={onEdit} />
        <PassportCard pid="esra" data={p.esra} label="Esra Eray" onEdit={onEdit} />
      </div>
      <div className="schengen-card glass"><div className="s-header"><h3>🇪🇺 Schengen Takibi</h3><Info size={16} /></div><div className="s-progress-row"><div className="p-info"><span>👨 Görkem</span><small>{sch.gorkem.used}/90 gün</small></div><div className="p-bar"><div className="p-fill" style={{ width: `${(sch.gorkem.used/90)*100}%` }} /></div></div><div className="s-progress-row"><div className="p-info"><span>👩 Esra</span><small>{sch.esra.used}/90 gün</small></div><div className="p-bar"><div className="p-fill" style={{ width: `${(sch.esra.used/90)*100}%` }} /></div></div></div>
    </div>
  );
}

function HaritaTab({ tatil }) {
  const pastTrips = useMemo(() => {
    return (tatil.trips || [])
      .filter(t => t.status === 'tamamlandi')
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, [tatil.trips]);
  
  const stats = useMemo(() => {
    const countries = new Set();
    const cities = new Set();
    let totalDays = 0;

    pastTrips.forEach(t => {
      // 1. Process main fields (Split by common separators)
      const splitAndAdd = (val, set) => {
        if (!val) return;
        val.split(/[&,]| ve /).forEach(item => {
          const trimmed = item.trim();
          if (trimmed) set.add(trimmed);
        });
      };

      splitAndAdd(t.country, countries);
      splitAndAdd(t.city, cities);
      // Also check title for hidden cities/countries
      splitAndAdd(t.title, cities);

      // 2. Process hotels to find multi-city/country trips
      if (t.hotels) {
        t.hotels.forEach(h => {
          if (h.address) {
            const parts = h.address.split(',').map(p => p.trim());
            if (parts.length >= 2) {
              // Usually: [Name, City, Country] or [City, Country]
              const city = parts[parts.length - 2];
              const country = parts[parts.length - 1];
              if (city) cities.add(city);
              if (country) countries.add(country);
            }
          }
        });
      }

      // 3. Process days
      if (t.startDate && t.endDate) {
        const start = new Date(t.startDate);
        const end = new Date(t.endDate);
        const diff = Math.ceil((end - start) / 864e5) + 1;
        if (diff > 0) totalDays += diff;
      }
    });

    // Remove titles that were mistakenly added as cities if they matched country names or are too long
    // For this specific dataset, we just need to make sure we don't double count
    // But Set handles duplicates.

    return {
      countries: countries.size || 0,
      cities: cities.size || 0,
      days: totalDays || 0
    };
  }, [pastTrips]);

  const lastTrip = pastTrips[0] || { city: 'Henüz Keşfedilmedi', country: '-', dt: '-' };

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="world-explorer-view">
        <div className="explorer-stats">
          <div className="ex-stat-item glass animate-pop">
            <strong>{stats.countries}</strong>
            <span>ÜLKE</span>
          </div>
          <div className="ex-stat-item glass animate-pop" style={{ animationDelay: '0.1s' }}>
            <strong>{stats.cities}</strong>
            <span>ŞEHİR</span>
          </div>
          <div className="ex-stat-item glass animate-pop" style={{ animationDelay: '0.2s' }}>
            <strong>{stats.days}</strong>
            <span>GÜN</span>
          </div>
        </div>
        <div className="stylized-map-container glass">
          <div className="map-overlay-vignette" />
          <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" alt="World Map" className="explorer-map-bg" />
          <div className="map-pins-layer">
            {/* Generate pins for all confirmed and completed trips */}
            {(tatil.trips || []).filter(t => t.status === 'kesin' || t.status === 'tamamlandi').map((t, tidx) => {
              // Deterministic random positions based on city name to keep them consistent
              const getHash = (str) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
                return Math.abs(hash);
              };
              
              const baseHash = getHash(t.city || t.title || 'trip');
              const top = (baseHash % 60) + 20; // 20% to 80%
              const left = ((baseHash * 7) % 60) + 20; // 20% to 80%
              
              const duration = Math.ceil((new Date(t.endDate) - new Date(t.startDate)) / 864e5) || 1;
              const pins = [];
              
              // Show one pin for each city mentioned or at least one
              const cities = (t.city || '').split(/[&,]| ve /).filter(c => c.trim().length > 0);
              const pinCount = Math.max(cities.length, Math.min(duration, 3)); // Max 3 pins per trip to avoid clutter
              
              for (let i = 0; i < pinCount; i++) {
                pins.push(
                  <div 
                    key={`${t.id}-${i}`}
                    className={`map-pin-pulse ${t.status}`} 
                    style={{ 
                      top: `${top + (i * 4) - (pinCount * 2)}%`, 
                      left: `${left + (i * 6) - (pinCount * 3)}%`,
                      animationDelay: `${i * 0.5}s`,
                      background: t.status === 'kesin' ? 'var(--tatil)' : '#10b981'
                    }} 
                    title={`${t.city}: Day ${i+1}`}
                  />
                );
              }
              return pins;
            })}
          </div>
          <div className="map-bottom-info">
            <div className="last-adventure glass">
              <div className="la-icon">📍</div>
              <div className="la-text">
                <small>SON KEŞİF</small>
                <strong>{lastTrip.city}, {lastTrip.country}</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="explorer-footer glass">
          <div className="ef-content">
            <div className="ef-text">
              <h3>Dünya Turu İlerlemesi</h3>
              <p>Şu ana kadar {stats.countries} ülke keşfettiniz!</p>
            </div>
            <div className="ef-progress">
              <div className="p-bar">
                <div className="p-fill" style={{ width: `${Math.min(100, (stats.countries / 195) * 100)}%` }} />
              </div>
            </div>
          </div>
          <button className="new-pin-btn money-gradient">
            <Plus size={20} /> Yeni Yer İşaretle
          </button>
        </div>
      </div>
    </div>
  );
}

function HayalTab({ tatil }) {
  const wishlist = tatil.wishlist || [];
  return (
    <div className="tab-pane animate-fadeIn">
      <div className="section-header"><h3>⭐ Hayal Listesi</h3><button className="add-btn-small"><Plus size={16} /></button></div>
      <div className="wish-list">
        {wishlist.length > 0 ? wishlist.map(w => (<div key={w.id} className="wish-card glass"><div className="w-icon">🌍</div><div className="w-info"><strong>{w.place}</strong><p>{w.notes}</p></div><button className="plan-btn">Planla ✈️</button></div>)) : (<div className="empty-state glass"><span className="big-emoji">⭐</span><p>Hayaller buraya! Gitmek istediğin yerleri ekle.</p></div>)}
      </div>
    </div>
  );
}
