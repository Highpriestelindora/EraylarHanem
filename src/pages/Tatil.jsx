import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { 
  Plane, Map, ShieldCheck, Star, 
  Plus, Trash2, Calendar, MapPin, 
  Hotel, Wallet, CheckSquare, Cloud, 
  ArrowRight, AlertCircle, Info, Timer, X, ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Tatil.css';

export default function Tatil() {
  const { tatil, setModuleData, addTrip, setModalOpen } = useStore();
  const [activeTab, setActiveTab] = useState(tatil.ttab || 'trips');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    setModalOpen(!!selectedTrip || showWizard);
    return () => setModalOpen(false);
  }, [selectedTrip, showWizard, setModalOpen]);

  const updateTab = (tab) => {
    setActiveTab(tab);
    setModuleData('tatil', { ...tatil, ttab: tab });
  };

  const tabs = [
    { id: 'trips', emoji: '🌍', label: 'Tatiller' },
    { id: 'harita', emoji: '🗺️', label: 'Harita' },
    { id: 'pasaport', emoji: '🛂', label: 'Pasaport' },
    { id: 'hayal', emoji: '⭐', label: 'Hayaller' }
  ];

  return (
    <AnimatedPage className="tatil-container">
      <div className="module-header tatil-gradient">
        <div className="header-info">
          <h1>Eraylar Tatil</h1>
          <p>Seyahat & Gezi Takibi</p>
        </div>
        <div className="header-icon animate-float">✈️</div>
      </div>

      <div className="tab-nav glass">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => updateTab(tab.id)}
          >
            <span style={{ fontSize: '22px', marginBottom: '2px' }}>{tab.emoji}</span>
            <span>{tab.label}</span>
            {activeTab === tab.id && <div className="tab-dot" />}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'trips' && <TripsTab tatil={tatil} onSelectTrip={setSelectedTrip} onShowWizard={() => setShowWizard(true)} />}
        {activeTab === 'harita' && <HaritaTab tatil={tatil} />}
        {activeTab === 'pasaport' && <PasaportTab tatil={tatil} />}
        {activeTab === 'hayal' && <HayalTab tatil={tatil} />}
      </div>

      {selectedTrip && (
        <TripDetailModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      )}

      {showWizard && (
        <PlanningWizard onClose={() => setShowWizard(false)} onAdd={(trip) => {
          addTrip(trip);
          setShowWizard(false);
          toast.success('Tatil planı oluşturuldu! ✨');
        }} />
      )}
    </AnimatedPage>
  );
}

function TripsTab({ tatil, onSelectTrip, onShowWizard }) {
  const trips = tatil.trips || [];
  const upcoming = trips.filter(t => t.status === 'planlandi');
  const past = trips.filter(t => t.status === 'tamamlandi');

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="trip-sections">
        <div className="trip-group upcoming-group">
          <div className="section-header">
            <h3>📅 Gelecek Tatiller</h3>
            <button className="add-btn-small" onClick={onShowWizard} title="Yeni Plan Ekle"><Plus size={16} /> Planla</button>
          </div>
          {upcoming.length > 0 ? (
            upcoming.map(t => <TripCard key={t.id} trip={t} isUpcoming onClick={() => onSelectTrip(t)} />)
          ) : (
            <div className="empty-substate glass" onClick={onShowWizard} style={{ cursor: 'pointer' }}>
              <p>Henüz planlanmış bir tatil yok. Yeni bir macera planlamaya ne dersin? ✨</p>
            </div>
          )}
        </div>

        <div className="trip-group past-group mt-20">
          <div className="section-header">
            <h3>✅ Geçmiş Tatiller</h3>
          </div>
          {past.length > 0 ? (
            past.map(t => <TripCard key={t.id} trip={t} onClick={() => onSelectTrip(t)} />)
          ) : (
            <div className="empty-substate glass">
              <p>Henüz geçmiş bir tatil kaydı bulunmuyor.</p>
            </div>
          )}
        </div>
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
          <span className="t-type">{trip.type === 'yurtdisi' ? '✈️ Yurtdışı' : '🚗 Yurtiçi'}</span>
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

function PlanningWizard({ onClose, onAdd }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: '', country: 'Türkiye', city: '', type: 'yurtdisi', startDate: '', endDate: '', budget: '' });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="wizard-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <div className="wizard-header">
          <div className="step-dots">
            {[1,2,3].map(i => <div key={i} className={`dot ${step >= i ? 'active' : ''}`} />)}
          </div>
          <h3>Tatil Sihirbazı</h3>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>
        <div className="wizard-body">
          {step === 1 && (
            <div className="wizard-step animate-fadeIn">
              <h4>Nereye Gidiyoruz? 🌍</h4>
              <div className="form-group">
                <label>Tatil Başlığı</label>
                <input type="text" placeholder="Örn: Roma Kaçamağı" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group"><label>Ülke</label><input type="text" value={form.country} onChange={e => setForm({...form, country: e.target.value})} /></div>
                <div className="form-group"><label>Şehir</label><input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
              </div>
              <div className="type-selector">
                 <button className={form.type === 'yurtdisi' ? 'active' : ''} onClick={() => setForm({...form, type: 'yurtdisi'})}>✈️ Yurtdışı</button>
                 <button className={form.type === 'yurticici' ? 'active' : ''} onClick={() => setForm({...form, type: 'yurticici'})}>🚗 Yurtiçi</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="wizard-step animate-fadeIn">
              <h4>Ne Zaman? 📅</h4>
              <div className="form-row">
                <div className="form-group"><label>Başlangıç</label><input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} /></div>
                <div className="form-group"><label>Bitiş</label><input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} /></div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="wizard-step animate-fadeIn">
              <h4>Detaylar 💰</h4>
              <div className="form-group">
                <label>Tahmini Bütçe (₺)</label>
                <input type="number" placeholder="0" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
              </div>
            </div>
          )}
        </div>
        <div className="wizard-footer">
          {step > 1 && <button className="btn-secondary" onClick={() => setStep(s => s - 1)}>Geri</button>}
          {step < 3 ? <button className="btn-primary" onClick={() => setStep(s => s + 1)}>Devam Et</button> : <button className="btn-primary success" onClick={() => onAdd(form)}>Planı Oluştur ✨</button>}
        </div>
      </div>
    </div>
  );
}

function TripDetailModal({ trip, onClose }) {
  const { toggleTripChecklist, addExpense } = useStore();
  const duration = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 864e5) || 0;
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  return (
    <div className="full-page-detail animate-slideUp">
      <header className="detail-header glass">
        <button className="back-btn" onClick={onClose}><ArrowLeft size={24} /> <span>Geri</span></button>
        <div className="header-title"><h2>{trip.title || trip.city}</h2><p>{trip.city}, {trip.country}</p></div>
        <div className="header-actions">
           <button className="action-btn-circle money" onClick={() => setShowExpenseModal(true)}><Wallet size={20} /></button>
        </div>
      </header>
      <main className="detail-main">
        <div className="detail-hero-card glass" style={{ background: trip.type === 'yurtdisi' ? 'var(--tatil-dark)' : 'var(--success-dark)' }}>
           <div className="hero-emoji-large">{trip.type === 'yurtdisi' ? '✈️' : '🚗'}</div>
           <div className="hero-meta"><span className="meta-pill">{trip.country}</span><span className="meta-pill">{duration} Gün</span></div>
        </div>
        <section className="detail-section">
          <div className="section-title"><h3>✅ Hazırlık Listesi</h3><div className="badge">{trip.checklists?.filter(c=>c.done).length || 0} / {trip.checklists?.length || 0}</div></div>
          <div className="checklist-grid">
            {(trip.checklists || []).map(item => (
              <div key={item.id} className={`check-item glass ${item.done ? 'done' : ''}`} onClick={() => toggleTripChecklist(trip.id, item.id)}>
                <div className={`check-box ${item.done ? 'checked' : ''}`}>{item.done && <CheckSquare size={16} />}</div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="detail-section mt-20">
           <div className="section-title"><h3>🏨 Konaklama</h3></div>
           {(trip.hotels || []).length > 0 ? trip.hotels.map((h, i) => <div key={i} className="hotel-card glass"><strong>{h.name}</strong><p>{h.address}</p></div>) : <div className="empty-notes glass">Henüz otel bilgisi eklenmemiş.</div>}
        </section>
      </main>
      {showExpenseModal && <AddTripExpenseModal trip={trip} onClose={() => setShowExpenseModal(false)} onAdd={(exp) => { addExpense({ ...exp, category: 'tatil', title: `✈️ ${trip.title || trip.city}: ${exp.title}` }); setShowExpenseModal(false); toast.success('Harcama kaydedildi! 💸'); }} />}
    </div>
  );
}

function AddTripExpenseModal({ trip, onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', amount: '', payer: 'ortak' });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <h3>💸 Tatil Harcaması</h3>
        <form onSubmit={(e) => { e.preventDefault(); onAdd(form); }} className="modal-form mt-10">
          <input type="text" placeholder="Harcama Kalemi" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <input type="number" placeholder="Tutar" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
          <div className="payer-select mt-10">
            <button type="button" className={form.payer === 'gorkem' ? 'active' : ''} onClick={() => setForm({...form, payer: 'gorkem'})}>Görkem</button>
            <button type="button" className={form.payer === 'esra' ? 'active' : ''} onClick={() => setForm({...form, payer: 'esra'})}>Esra</button>
            <button type="button" className={form.payer === 'ortak' ? 'active' : ''} onClick={() => setForm({...form, payer: 'ortak'})}>Ortak</button>
          </div>
          <button type="submit" className="submit-btn tatil-gradient mt-20">Harcamayı Ekle</button>
        </form>
      </div>
    </div>
  );
}

function PasaportTab({ tatil }) {
  const p = tatil.passport || { gorkem: {}, esra: {} };
  const sch = { gorkem: { used: 12, left: 78 }, esra: { used: 5, left: 85 } };
  return (
    <div className="tab-pane animate-fadeIn">
      <div className="passport-grid"><PassportCard pid="gorkem" data={p.gorkem} label="Görkem Eray" /><PassportCard pid="esra" data={p.esra} label="Esra Eray" /></div>
      <div className="schengen-card glass"><div className="s-header"><h3>🇪🇺 Schengen Takibi</h3><Info size={16} /></div><div className="s-progress-row"><div className="p-info"><span>👨 Görkem</span><small>{sch.gorkem.used}/90 gün</small></div><div className="p-bar"><div className="p-fill" style={{ width: `${(sch.gorkem.used/90)*100}%` }} /></div></div><div className="s-progress-row"><div className="p-info"><span>👩 Esra</span><small>{sch.esra.used}/90 gün</small></div><div className="p-bar"><div className="p-fill" style={{ width: `${(sch.esra.used/90)*100}%` }} /></div></div></div>
    </div>
  );
}

function PassportCard({ pid, data, label }) {
  const daysLeft = data.exp ? Math.ceil((new Date(data.exp) - new Date()) / 864e5) : null;
  const isExpired = daysLeft !== null && daysLeft < 0;
  const isWarning = daysLeft !== null && daysLeft < 180;
  return (
    <div className={`p-card glass ${isWarning ? 'warning' : ''}`}>
      <div className="p-header"><strong>🛂 {label}</strong><button className="edit-btn"><Plus size={14} /></button></div>
      <div className="p-body">{data.no ? <><div className="p-row"><span>No:</span> <strong>{data.no}</strong></div><div className="p-row"><span>S.K.T:</span> <strong>{data.exp}</strong></div>{daysLeft !== null && <div className={`p-status ${isExpired ? 'danger' : isWarning ? 'warn' : 'ok'}`}>{isExpired ? 'Süresi Doldu!' : `${daysLeft} gün kaldı`}</div>}</> : <div className="p-empty">Bilgi girilmedi</div>}</div>
    </div>
  );
}

function HaritaTab({ tatil }) {
  const stats = { countries: 14, cities: 32, days: 185 };
  const lastTrip = (tatil.trips || []).filter(t => t.status === 'tamamlandi')[0] || { city: 'Roma', country: 'İtalya', dt: 'Nis 2024' };
  return (
    <div className="tab-pane animate-fadeIn">
      <div className="world-explorer-view">
        <div className="explorer-stats"><div className="ex-stat-item glass animate-pop"><strong>{stats.countries}</strong><span>ÜLKE</span></div><div className="ex-stat-item glass animate-pop" style={{ animationDelay: '0.1s' }}><strong>{stats.cities}</strong><span>ŞEHİR</span></div><div className="ex-stat-item glass animate-pop" style={{ animationDelay: '0.2s' }}><strong>{stats.days}</strong><span>GÜN</span></div></div>
        <div className="stylized-map-container glass"><div className="map-overlay-vignette" /><img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" alt="World Map" className="explorer-map-bg" /><div className="map-pins-layer"><div className="map-pin-pulse" style={{ top: '45%', left: '55%' }} /><div className="map-pin-pulse" style={{ top: '40%', left: '48%' }} /><div className="map-pin-pulse" style={{ top: '42%', left: '51%' }} /></div><div className="map-bottom-info"><div className="last-adventure glass"><div className="la-icon">📍</div><div className="la-text"><small>SON KEŞİF</small><strong>{lastTrip.city}, {lastTrip.country}</strong></div></div></div></div>
        <div className="explorer-footer glass"><div className="ef-content"><div className="ef-text"><h3>Dünya Turu İlerlemesi</h3><p>Şu ana kadar dünyanın %7'sini keşfettiniz!</p></div><div className="ef-progress"><div className="p-bar"><div className="p-fill" style={{ width: '7%' }} /></div></div></div><button className="new-pin-btn money-gradient"><Plus size={20} /> Yeni Yer İşaretle</button></div>
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
