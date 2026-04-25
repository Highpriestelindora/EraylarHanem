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
  const { tatil, setModuleData, addTrip } = useStore();
  const [activeTab, setActiveTab] = useState(tatil.ttab || 'trips');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showWizard, setShowWizard] = useState(false);

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

      <ActionSheet
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        title={selectedTrip?.title || selectedTrip?.city || 'Tatil Detayı'}
        fullHeight
      >
        {selectedTrip && (
          <TripDetailContent trip={selectedTrip} />
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

function PlanningWizardContent({ onAdd }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: '', country: 'Türkiye', city: '', type: 'yurtdisi', startDate: '', endDate: '', budget: '' });

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
                className={form.type === 'yurticici' ? 'active' : ''} 
                onClick={() => setForm({...form, type: 'yurticici'})}
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', background: form.type === 'yurticici' ? 'var(--tatil-light)' : 'white', color: form.type === 'yurticici' ? 'var(--tatil)' : 'var(--txt)', fontWeight: '800', cursor: 'pointer' }}
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
              <input type="number" placeholder="0" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
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

function TripDetailContent({ trip }) {
  const { updateTripValiz, addExpense, tatil, setModuleData } = useStore();
  const duration = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 864e5) || 0;
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('valiz'); // valiz, dokuman, butce

  const handleUpdateTrip = (updates) => {
     const trips = tatil.trips.map(t => t.id === trip.id ? { ...t, ...updates } : t);
     setModuleData('tatil', { ...tatil, trips });
  };

  return (
    <div className="trip-detail-premium animate-fadeIn">
      {/* Hero Card */}
      <div className="trip-hero glass" style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>
        <div className="hero-content">
          <div className="hero-emoji animate-float">{trip.type === 'yurtdisi' ? '✈️' : '🚗'}</div>
          <div className="hero-text">
            <h2>{trip.city}, {trip.country}</h2>
            <div className="hero-meta-row">
              <span className="h-meta-pill">📅 {trip.startDate}</span>
              <span className="h-meta-pill">🌙 {duration} Gece</span>
            </div>
          </div>
        </div>
        <div className="weather-widget-mini glass">
          <Cloud size={24} color="white" />
          <div className="w-temp">24°C</div>
          <div className="w-city">Güneşli</div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="detail-sub-nav">
        <button className={activeSubTab === 'valiz' ? 'active' : ''} onClick={() => setActiveSubTab('valiz')}>🧳 Valiz</button>
        <button className={activeSubTab === 'dokuman' ? 'active' : ''} onClick={() => setActiveSubTab('dokuman')}>📑 Belgeler</button>
        <button className={activeSubTab === 'butce' ? 'active' : ''} onClick={() => setActiveSubTab('butce')}>💰 Bütçe</button>
      </div>

      <div className="detail-body">
        {activeSubTab === 'valiz' && (
          <div className="packing-lists-container">
            <div className="packing-section">
              <h4>👨 Görkem'in Valizi</h4>
              <div className="p-list">
                {trip.valiz?.gorkem?.map(item => (
                  <div key={item.id} className={`p-item glass ${item.done ? 'done' : ''}`} onClick={() => updateTripValiz(trip.id, 'gorkem', item.id)}>
                    <div className="p-check">{item.done && <CheckSquare size={14} />}</div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="packing-section mt-20">
              <h4>👩 Esra'nın Valizi</h4>
              <div className="p-list">
                {trip.valiz?.esra?.map(item => (
                  <div key={item.id} className={`p-item glass ${item.done ? 'done' : ''}`} onClick={() => updateTripValiz(trip.id, 'esra', item.id)}>
                    <div className="p-check">{item.done && <CheckSquare size={14} />}</div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'dokuman' && (
          <div className="docs-view animate-fadeIn">
            <div className="doc-card glass">
              <div className="dc-header"><Plane size={18} /> <strong>Uçuş / Rezervasyon</strong></div>
              <div className="dc-body">
                <div className="form-group-mini">
                  <label>PNR Kodu</label>
                  <input 
                    type="text" 
                    value={trip.pnr || ''} 
                    placeholder="Örn: ABC123"
                    onChange={e => handleUpdateTrip({ pnr: e.target.value })} 
                  />
                </div>
              </div>
            </div>
            <div className="doc-card glass mt-15">
              <div className="dc-header"><Hotel size={18} /> <strong>Konaklama</strong></div>
              <div className="dc-body">
                <div className="form-group-mini">
                  <label>Otel Adı / Notlar</label>
                  <textarea 
                    value={trip.otel || ''} 
                    placeholder="Adres, giriş saati vb."
                    onChange={e => handleUpdateTrip({ otel: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'butce' && (
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
            <button className="btn-action-premium tatil mt-20" onClick={() => setShowExpenseModal(true)}>
              <Plus size={18} /> Harcama Ekle
            </button>
          </div>
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
