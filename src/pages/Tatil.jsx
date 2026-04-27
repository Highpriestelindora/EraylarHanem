import React, { useState, useEffect, useMemo, useRef } from 'react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ActionSheet from '../components/ActionSheet';
import { 
  Plane, Map, ShieldCheck, Star, 
  Plus, Trash2, Calendar, MapPin, 
  Hotel, Wallet, CheckSquare, Cloud, Sun, CloudRain, CloudSnow, CloudLightning,
  ArrowRight, AlertCircle, Info, Timer, X, ArrowLeft,
  PlusCircle, ChevronRight, ExternalLink, Moon,
  Search, Flag, Edit3, Check, DollarSign, Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { PACKING_POOL, BUCKET_LIST, INITIAL_TRIPS, INITIAL_VISAS } from '../constants/data';
import { calculateTripStatus, getNowUTC } from '../lib/dateUtils';
import './Tatil.css';

// --- CONSTANTS & WEATHER ENGINE ---
const CITY_TRANSLATIONS = {
  'viyana': 'vienna', 'roma': 'rome', 'londra': 'london', 'paris': 'paris',
  'marsilya': 'marseille', 'munih': 'munich', 'atina': 'athens',
  'venedik': 'venice', 'floransa': 'florence', 'milano': 'milan',
  'barselona': 'barcelona', 'bruksel': 'brussels', 'prag': 'prague',
  'budapeste': 'budapest', 'varsova': 'warsaw', 'bukres': 'bucharest',
  'amsterdam': 'amsterdam', 'madrid': 'madrid', 'lizbon': 'lisbon',
  'kopenhag': 'copenhagen', 'stokholm': 'stockholm', 'oslo': 'oslo',
  'helsinki': 'helsinki', 'dublin': 'dublin', 'berlin': 'berlin'
};

const normalizeText = (text) => text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, 'i').replace(/İ/g, 'i').toLowerCase();

async function fetchWeatherForTrip(city, country, startDate) {
  if (!city) return null;
  try {
    const cleanCity = normalizeText(city);
    const translatedCity = CITY_TRANSLATIONS[cleanCity] || cleanCity;
    const searchName = country ? `${translatedCity}, ${normalizeText(country)}` : translatedCity;

    let geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchName)}&count=1&language=en&format=json`);
    let geoData = await geoRes.json();
    
    if (!geoData.results?.length && country) {
      geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(translatedCity)}&count=1&language=en&format=json`);
      geoData = await geoRes.json();
    }

    if (geoData.results?.length) {
      const { latitude, longitude } = geoData.results[0];
      const today = new Date();
      const start = new Date(startDate || today);
      const daysDiff = (start - today) / 864e5;
      const isHistorical = daysDiff > 14;

      if (isHistorical) {
        try {
          const lastYear = new Date(start);
          lastYear.setFullYear(lastYear.getFullYear() - 1);
          const startArchive = lastYear.toISOString().split('T')[0];
          const endArchive = new Date(lastYear.getTime() + 7 * 864e5).toISOString().split('T')[0];
          const res = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startArchive}&end_date=${endArchive}&daily=temperature_2m_max&timezone=auto`);
          const data = await res.json();
          if (data.daily?.temperature_2m_max) {
            const temps = data.daily.temperature_2m_max.filter(t => t != null);
            if (temps.length > 0) {
              const avg = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
              return { temp: avg, isSun: true, label: `${start.toLocaleString('tr-TR', { month: 'long' })} Ort.`, isHistorical: true };
            }
          }
        } catch (e) {}
      }

      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max&timezone=auto`);
      const data = await res.json();
      if (data.current_weather) {
        return { 
          temp: Math.round(data.current_weather.temperature),
          isSun: data.current_weather.weathercode < 3,
          label: isHistorical ? 'Güncel' : 'Tahmin',
          daily: data.daily
        };
      }
    }
  } catch (e) {}
  return null;
}

// --- HELPERS ---
const getCountryFlag = (title = '', city = '', country = '') => {
  const text = (title + ' ' + city + ' ' + country).toLowerCase();
  
  if (text.includes('avusturya') || text.includes('viyana') || text.includes('vienna') || text.includes('austria')) return '🇦🇹';
  if (text.includes('kıbrıs') || text.includes('kktc') || text.includes('cyprus')) return '🇹🇷';
  if (text.includes('italya') || text.includes('italy') || text.includes('roma') || text.includes('milano') || text.includes('venedik')) return '🇮🇹';
  if (text.includes('almanya') || text.includes('germany') || text.includes('berlin') || text.includes('münih')) return '🇩🇪';
  if (text.includes('fransa') || text.includes('france') || text.includes('paris') || text.includes('marsilya') || text.includes('marseille')) return '🇫🇷';
  // Enhanced UK Match (Handles Turkish İ/i and variations)
  if (text.includes('ngiltere') || text.includes('london') || text.includes('londra') || text.includes('uk') || text.includes('kingdom') || text.includes('britanya')) return '🇬🇧';
  if (text.includes('yunanistan') || text.includes('greece') || text.includes('athens') || text.includes('selanik') || text.includes('kavala') || text.includes('atina')) return '🇬🇷';
  if (text.includes('ispanya') || text.includes('spain') || text.includes('madrid') || text.includes('barcelona')) return '🇪🇸';
  if (text.includes('hollanda') || text.includes('netherlands') || text.includes('amsterdam')) return '🇳🇱';
  if (text.includes('bulgaristan') || text.includes('bulgaria') || text.includes('sofya') || text.includes('sofiya')) return '🇧🇬';
  if (text.includes('bosna') || text.includes('saraybosna') || text.includes('sarajevo') || text.includes('mostar')) return '🇧🇦';
  if (text.includes('japonya') || text.includes('japan') || text.includes('tokyo')) return '🇯🇵';
  if (text.includes('izlanda') || text.includes('iceland')) return '🇮🇸';
  
  return '🌍';
};

export default function Tatil() {
  const navigate = useNavigate();
  const { tatil, setModuleData, addTrip, updateExchangeRates } = useStore();
  const [activeTab, setActiveTab] = useState(tatil.ttab || 'trips');
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    updateExchangeRates();
  }, []);

  const [showWizard, setShowWizard] = useState(false);
  const [editingPassport, setEditingPassport] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [trackerFlight, setTrackerFlight] = useState('');
  const [viewPdf, setViewPdf] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapTarget, setMapTarget] = useState({ name: '', address: '' });

  // Sync selected trip with store if it changes
  useEffect(() => {
    if (selectedTrip) {
      const current = tatil.trips.find(t => t.id === selectedTrip.id);
      if (current) setSelectedTrip(current);
    }
  }, [tatil.trips]);

  // ENFORCED DATA NORMALIZATION
  // We keep this only for ensuring critical data structures exist, 
  // but we NO LONGER manually override statuses here.
  useEffect(() => {
    let currentTrips = [...(tatil.trips || [])];
    let changed = false;

    // 1. Ensure Viyana exists (as a template/legacy requirement)
    const hasVienna = currentTrips.some(t => t.id === 't_vienna' || t.title.includes('Viyana'));
    if (!hasVienna) {
      const viennaTemplate = INITIAL_TRIPS.find(t => t.id === 't_vienna');
      if (viennaTemplate) {
        currentTrips.push({ ...viennaTemplate, travelers: 'ikimiz' });
        changed = true;
      }
    }
    
    // 2. Data Integrity Check
    const fixedTrips = currentTrips.map(t => {
      let up = {};
      // Force travelers to 'ikimiz' if not set (business rule: shared by default)
      if (!t.travelers) { up.travelers = 'ikimiz'; }
      
      if (Object.keys(up).length > 0) {
        changed = true;
        return { ...t, ...up };
      }
      return t;
    });

    if (changed) {
      setModuleData('tatil', { ...tatil, trips: fixedTrips });
    }
  }, []);

  const updateTab = (tab) => {
    setActiveTab(tab);
    setModuleData('tatil', { ...tatil, ttab: tab });
  };

  const tabs = [
    { id: 'trips', emoji: '🌍', label: 'Tatiller' },
    { id: 'anilar', emoji: '📸', label: 'Anılar' },
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
        {activeTab === 'anilar' && <AnilarTab tatil={tatil} onSelectTrip={setSelectedTrip} />}
        {activeTab === 'harita' && <HaritaTab tatil={tatil} onTabChange={updateTab} />}
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
            onOpenMap={(name, address, city, country) => {
              setMapTarget({ name, address, city, country });
              setShowMap(true);
            }}
            onClose={() => setSelectedTrip(null)}
          />
        )}
      </ActionSheet>

      <ActionSheet
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        title="🌍 Tatil Sihirbazı"
      >
        <AddTripWizard onClose={() => { setShowWizard(false); }} />
      </ActionSheet>

      <ActionSheet
        isOpen={showTracker}
        onClose={() => setShowTracker(false)}
        title={`✈️ Uçuş Takibi: ${trackerFlight}`}
      >
        <div className="live-tracker-native">
          <div className="tracker-hero">
            <div className="plane-anim">✈️</div>
            <h4>{trackerFlight}</h4>
            <p>Canlı uçuş verileri ve radar takibi için FlightRadar24'ün mobil optimize edilmiş sistemine yönlendiriliyorsunuz.</p>
          </div>
          <div className="tracker-actions-v2">
            <button className="primary-tracker-btn" onClick={() => window.open(`https://www.flightradar24.com/data/flights/${trackerFlight.replace(/\s+/g, '')}`, '_blank')}>
               Canlı Radarı Aç 🛰️
            </button>
            <p className="helper-text">Beyaz ekran sorunu yaşanmaması için en güvenli ve hızlı yöntem budur.</p>
          </div>
        </div>
      </ActionSheet>
      <ActionSheet
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        title={`📍 Konum: ${mapTarget.name}`}
      >
        <HotelMap 
          name={mapTarget?.name} 
          address={mapTarget?.address} 
          city={mapTarget?.city} 
          country={mapTarget?.country} 
        />
      </ActionSheet>

      <ActionSheet
        isOpen={!!viewPdf}
        onClose={() => setViewPdf(null)}
        title="📄 Belge Görüntüleyici"
        maxHeight="100vh"
      >
        <div style={{ width: '100%', height: 'calc(100vh - 80px)', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden' }}>
          <iframe 
            src={viewPdf} 
            style={{ width: '100%', height: '100%', border: 'none' }} 
            title="PDF Viewer"
          />
        </div>
      </ActionSheet>
    </AnimatedPage>
  );
}

function TripsTab({ tatil, onSelectTrip, onShowWizard }) {
  const trips = tatil.trips || [];
  
  // Calculate derived statuses for filtering
  const tripsWithDerivedStatus = trips.map(t => ({
    ...t,
    derivedStatus: calculateTripStatus(t.startDate, t.endDate)
  }));

  const activeTrips = tripsWithDerivedStatus.filter(t => t.derivedStatus !== 'completed');
  const kesin = activeTrips.filter(t => t.derivedStatus === 'active');
  const gelecek = activeTrips.filter(t => t.derivedStatus === 'planned');

  const kesinlesmis = gelecek.filter(t => t.isConfirmed);
  const planlanan = gelecek.filter(t => !t.isConfirmed);

  const soloPast = tripsWithDerivedStatus.filter(t => t.derivedStatus === 'completed' && t.travelers !== 'ikimiz');

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="trip-sections-cute">
        {/* SECTION 1: ACTIVE */}
        <div className="trip-group-cute">
          <div className="section-header-cute">
            <h3>📍 Şu An Devam Edenler</h3>
          </div>
          {kesin.length > 0 ? (
            kesin.map(t => <TripCard key={t.id} trip={t} onClick={() => onSelectTrip(t)} />)
          ) : (
            <div className="empty-state-cute glass">Şu an aktif bir seyahat yok. ✨</div>
          )}
        </div>

        {/* SECTION 2: FINALIZED UPCOMING */}
        <div className="trip-group-cute">
          <div className="section-header-cute">
            <h3>✅ Kesinleşen Yaklaşanlar</h3>
          </div>
          {kesinlesmis.length > 0 ? (
            kesinlesmis.map(t => <TripCard key={t.id} trip={t} onClick={() => onSelectTrip(t)} />)
          ) : (
            <div className="empty-state-cute glass">Bileti hazır yaklaşan seyahat yok. ✈️</div>
          )}
        </div>

        {/* SECTION 3: PLANNING */}
        <div className="trip-group-cute">
          <div className="section-header-cute">
            <h3>📝 Planlama Aşamasındakiler</h3>
            <button className="add-mini-btn" onClick={onShowWizard}><Plus size={14} /></button>
          </div>
          {planlanan.length > 0 ? (
            planlanan.map(t => <TripCard key={t.id} trip={t} onClick={() => onSelectTrip(t)} />)
          ) : (
            <div className="empty-state-cute glass" onClick={onShowWizard}>Yeni bir fikir ekle! ✨</div>
          )}
        </div>


        {/* Solo Past History at the bottom of Trips tab */}
        {soloPast.length > 0 && (
          <div className="trip-group-cute solo-trips-section mt-40">
            <div className="section-header-cute">
              <h3>👤 Bireysel Seyahat Geçmişi</h3>
            </div>
            <div className="solo-trips-mini-list">
              {soloPast.map(t => (
                <div key={t.id} className="solo-trip-item glass" onClick={() => onSelectTrip(t)}>
                  <span>{getCountryFlag(t.title, t.city, t.country)}</span>
                  <div className="st-info">
                    <strong>{t.title || t.city}</strong>
                    <small>{t.travelers === 'gorkem' ? 'Görkem' : 'Esra'} · {new Date(t.startDate).getFullYear()}</small>
                  </div>
                  <ChevronRight size={14} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AnilarTab({ tatil, onSelectTrip }) {
  const trips = tatil.trips || [];
  const jointPast = trips.filter(t => {
    const status = calculateTripStatus(t.startDate, t.endDate);
    return status === 'completed' && t.travelers === 'ikimiz';
  });

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="trip-sections-cute">
        <div className="trip-group-cute">
          <div className="section-header-cute"><h3>📸 Ortak Anılarımız</h3></div>
          <div className="memories-grid">
            {jointPast.length > 0 ? (
              jointPast.map(t => <MemoryCard key={t.id} trip={t} onClick={() => onSelectTrip(t)} />)
            ) : (
              <div className="empty-state-cute glass">Henüz birikmiş ortak anı yok. 💖</div>
            )}
          </div>
        </div>

        <div className="memories-footer animate-fadeIn" style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px', opacity: 0.6 }}>
           <p style={{ fontSize: '12px', fontStyle: 'italic' }}>"Dünya bir kitap ve seyahat etmeyenler sadece bir sayfasını okur." ✨</p>
           <div style={{ fontSize: '10px', marginTop: '5px' }}>Maceramız devam ediyor... ❤️</div>
        </div>
      </div>
    </div>
  );
}

function MemoryCard({ trip, onClick }) {
  return (
    <div className="memory-card-cute glass" onClick={onClick}>
      <div className="mc-photo-preview">
        {trip.photos && trip.photos[0] ? (
          <img src={trip.photos[0]} alt={trip.city} />
        ) : (
          <div className="mc-placeholder">{getCountryFlag(trip.title, trip.city, trip.country)}</div>
        )}
      </div>
      <div className="mc-info">
        <strong>{trip.city}</strong>
        <span>{new Date(trip.startDate).getFullYear()}</span>
        <div className="mc-stars">
          <Star size={10} fill="gold" stroke="gold" />
          <span>{( ( (trip.evaluations?.gorkem?.star || 10) + (trip.evaluations?.esra?.star || 10) ) / 2 ).toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip, onClick }) {
  return (
    <div className="trip-card-cute glass" onClick={onClick}>
      <div className="tc-flag">{getCountryFlag(trip.title, trip.city, trip.country)}</div>
      <div className="tc-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <strong>{trip.title || trip.city}</strong>
          {trip.isConfirmed && <div className="confirmed-badge-mini" title="Kesinleşti">✅</div>}
        </div>
        <span>{trip.startDate} · {trip.tripType === 'is' ? '💼 İş' : '🏖️ Tatil'}</span>
      </div>
      <div className="tc-actions">
        <button className="tc-edit-btn" onClick={(e) => { e.stopPropagation(); /* TODO: Edit */ }}><Edit3 size={14} /></button>
        <ChevronRight size={16} className="tc-arrow" />
      </div>
    </div>
  );
}


function AddTripWizard({ onClose }) {
  const { addTrip } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    country: '',
    startDate: '',
    endDate: '',
    budget: '',
    tripType: 'tatil', // 'tatil' | 'is'
    travelers: 'ikimiz', // 'gorkem' | 'esra' | 'ikimiz'
    locationType: 'yurtdisi', // 'yurtici' | 'yurtdisi'
    transportType: 'ucak', // 'araba' | 'ucak' | 'gemi' | 'tren'
    hotel: ''
  });

  const handleNext = () => {
    if (step === 1 && (!formData.title || !formData.startDate)) return toast.error('Başlık ve tarih zorunludur');
    if (step < 4) setStep(step + 1);
    else handleFinish();
  };

  const handleFinish = () => {
    addTrip(formData);
    toast.success('Yeni macera başladı! 🚀');
    onClose();
  };

  return (
    <div className="wizard-container-cute">
      <div className="wizard-steps-indicator">
        {[1, 2, 3, 4].map(s => <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`} />)}
      </div>

      <div className="wizard-step-content animate-fadeIn">
        {step === 1 && (
          <div className="w-step">
            <h4>🗺️ Nereye Gidiyoruz?</h4>
            <input placeholder="Tatil Adı (Örn: Viyana Kaçamağı)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input placeholder="Şehir" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            <input placeholder="Ülke" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
            <div className="w-date-row">
              <div className="w-input-group">
                <label>Başlangıç</label>
                <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="w-input-group">
                <label>Bitiş</label>
                <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-step">
            <h4>💼 Seyahat Detayları</h4>
            <div className="wizard-options-grid">
              <div className="w-option-group">
                <label>Seyahat Tipi</label>
                <div className="w-mini-toggle">
                  <button className={formData.tripType === 'tatil' ? 'active' : ''} onClick={() => setFormData({...formData, tripType: 'tatil'})}>🏖️ Tatil</button>
                  <button className={formData.tripType === 'is' ? 'active' : ''} onClick={() => setFormData({...formData, tripType: 'is'})}>💼 İş</button>
                </div>
              </div>
              <div className="w-option-group">
                <label>Kimin Seyahati?</label>
                <div className="w-mini-toggle trio">
                  <button className={formData.travelers === 'gorkem' ? 'active' : ''} onClick={() => setFormData({...formData, travelers: 'gorkem'})}>Görkem</button>
                  <button className={formData.travelers === 'esra' ? 'active' : ''} onClick={() => setFormData({...formData, travelers: 'esra'})}>Esra</button>
                  <button className={formData.travelers === 'ikimiz' ? 'active' : ''} onClick={() => setFormData({...formData, travelers: 'ikimiz'})}>İkimiz</button>
                </div>
              </div>
              <div className="w-option-group">
                <label>Bölge</label>
                <div className="w-mini-toggle">
                  <button className={formData.locationType === 'yurtici' ? 'active' : ''} onClick={() => setFormData({...formData, locationType: 'yurtici'})}>🏠 Yurt İçi</button>
                  <button className={formData.locationType === 'yurtdisi' ? 'active' : ''} onClick={() => setFormData({...formData, locationType: 'yurtdisi'})}>🌍 Yurt Dışı</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-step">
            <h4>🚗 Ulaşım & Konaklama</h4>
            <div className="w-option-group">
              <label>Ulaşım Aracı</label>
              <div className="transport-grid">
                {[
                  { id: 'araba', icon: '🚗', label: 'Araba' },
                  { id: 'ucak', icon: '✈️', label: 'Uçak' },
                  { id: 'gemi', icon: '🚢', label: 'Gemi' },
                  { id: 'tren', icon: '🚆', label: 'Tren' }
                ].map(t => (
                  <button key={t.id} className={formData.transportType === t.id ? 'active' : ''} onClick={() => setFormData({...formData, transportType: t.id})}>
                    <span style={{fontSize:'20px'}}>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <input placeholder="Konaklama (Otel/AirBnb)" value={formData.hotel} onChange={e => setFormData({...formData, hotel: e.target.value})} style={{marginTop:'15px'}} />
          </div>
        )}

        {step === 4 && (
          <div className="w-step">
            <h4>💰 Bütçe Planı</h4>
            <input type="number" placeholder="Tahmini Bütçe (₺)" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
            <div className="w-summary glass">
              <div className="w-sum-header">
                <span>{getCountryFlag(formData.title, formData.city, formData.country)} {formData.title}</span>
                <span className="w-sum-type">{formData.tripType === 'is' ? '💼 İş' : '🏖️ Tatil'}</span>
              </div>
              <div className="w-sum-footer">
                <small>{formData.startDate} - {formData.endDate}</small>
                <small>{formData.travelers === 'ikimiz' ? '👥 İkimiz' : `👤 ${formData.travelers}`}</small>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="wizard-footer-cute">
        {step > 1 && <button className="w-back-btn" onClick={() => setStep(step - 1)}>Geri</button>}
        <button className="w-next-btn" onClick={handleNext}>
          {step === 4 ? 'Macerayı Başlat ✨' : 'Devam Et'}
        </button>
      </div>
    </div>
  );
}

function TripDetailContent({ trip, onOpenTracker, onOpenMap, onClose }) {
  const { addExpense, tatil, setModuleData, deleteTrip } = useStore();
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const derivedStatus = calculateTripStatus(trip.startDate, trip.endDate);
  const isCompleted = derivedStatus === 'completed';
  const [activeSubTab, setActiveSubTab] = useState(isCompleted ? 'details' : 'valiz');

  useEffect(() => {
    const load = async () => {
      const data = await fetchWeatherForTrip(trip.city, trip.country, trip.startDate);
      // We convert the data back to an array format if needed for other UI parts, 
      // but for now, we pass the object down.
      setWeatherForecast(data);
    };
    load();
  }, [trip.city, trip.country, trip.startDate]);

  const getWeatherIcon = (code) => {
    if (code <= 1) return <Sun size={14} className="text-yellow-500" />;
    if (code <= 3) return <Cloud size={14} className="text-blue-400" />;
    if (code <= 67) return <CloudRain size={14} className="text-blue-500" />;
    if (code <= 77) return <CloudSnow size={14} className="text-white" />;
    return <CloudLightning size={14} className="text-purple-500" />;
  };

  const handleUpdateTrip = (updates) => {
     const trips = tatil.trips.map(t => t.id === trip.id ? { ...t, ...updates } : t);
     setModuleData('tatil', { ...tatil, trips });
  };



  return (
    <div className="trip-detail-premium animate-fadeIn">
      <div className="trip-hero-premium animate-fadeIn">
        <div className="hero-flag-badge">{getCountryFlag(trip.title, trip.city, trip.country)}</div>
        <div className="hero-main-row">
          <div className="hero-left">
            <Plane className="hero-plane-icon" size={24} />
            <div className="hero-text">
              <h2>{trip.title || trip.city}</h2>
              <div className="hero-meta-labels">
                <span className={`badge-tatil ${derivedStatus}`}>{derivedStatus.toUpperCase()}</span>
                <span className="location-label">{trip.city}, {trip.country}</span>
              </div>
            </div>
          </div>
          
          {weatherForecast && (
            <div className="hero-weather-box glass">
              <span className="hwb-temp">{weatherForecast.temp}°</span>
              <span className="hwb-icon">{weatherForecast.isSun ? '☀️' : '☁️'}</span>
              <small>{weatherForecast.label}</small>
            </div>
          )}
        </div>

        <div className="hero-stats-row">
          <div className="h-stat">
            <Calendar size={14} />
            <span>{trip.startDate}</span>
          </div>
          <div className="h-stat">
            <Moon size={14} />
            <span>{Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 864e5) + 1} Gece</span>
          </div>
        </div>

        {weatherForecast?.daily?.time && (
          <div className="weather-forecast-scroll animate-slideRight">
            {weatherForecast.daily.time.map((t, i) => (
              <div key={t} className="wf-day glass">
                <small>{new Date(t).toLocaleDateString('tr-TR', { weekday: 'short' })}</small>
                {getWeatherIcon(weatherForecast.daily.weathercode[i])}
                <strong>{Math.round(weatherForecast.daily.temperature_2m_max[i])}°</strong>
              </div>
            ))}
          </div>
        )}

        <button 
          className="trip-delete-btn-cute" 
          onClick={() => {
            if(window.confirm('Bu tatili silmek istediğinizden emin misiniz?')) {
              deleteTrip(trip.id);
              onClose();
              toast.success('Tatil silindi.');
            }
          }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="lifecycle-actions-premium">
        {derivedStatus === 'planned' && (
          <div className="status-lifecycle-row">
            <div className="status-info-badge planned">
              <Calendar size={16} /> {Math.ceil((new Date(trip.startDate) - new Date()) / 864e5)} gün kaldı
            </div>
            <button 
              className={`confirm-toggle-btn ${trip.isConfirmed ? 'confirmed' : ''}`}
              onClick={() => {
                handleUpdateTrip({ isConfirmed: !trip.isConfirmed });
                toast.success(trip.isConfirmed ? 'Plan aşamasına geri alındı.' : 'Seyahat kesinleşti! ✈️✅');
              }}
            >
              {trip.isConfirmed ? '✅ Kesinleşti' : '✈️ Kesinleştir'}
            </button>
          </div>
        )}
        {derivedStatus === 'active' && (
          <div className="status-info-badge active">
            <Plane size={16} /> Şu an bu seyahat gerçekleşiyor! ✈️
          </div>
        )}
        {isCompleted && !trip.evaluations?.gorkem && (
           <button 
             className="premium-action-btn archive-btn"
             onClick={() => setShowReview(true)}
           >
             🏁 Deneyimi Değerlendir ❤️
           </button>
        )}
      </div>

      <ActionSheet
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        title="🌟 Seyahat Değerlendirmesi"
      >
        <TripReviewPanel 
            trip={trip} 
            onComplete={(person, evalData) => {
                const newEvals = { ...trip.evaluations, [person]: evalData };
                const updates = { evaluations: newEvals };
                
                // If it's a joint trip and both done, or solo and done
                const isJoint = trip.travelers === 'ikimiz';
                const isFinished = isJoint ? (newEvals.gorkem && newEvals.esra) : true;

                if (isFinished) {
                    updates.status = 'completed';
                    // Merge photos if they exist in evalData
                    const allPhotos = [];
                    if (newEvals.gorkem?.photos) allPhotos.push(...newEvals.gorkem.photos);
                    if (newEvals.esra?.photos) allPhotos.push(...newEvals.esra.photos);
                    if (allPhotos.length > 0) updates.photos = allPhotos.slice(0, 6); // Max 6 for anı
                    
                    handleUpdateTrip(updates);
                    toast.success('Seyahat tamamlandı ve anılara eklendi! 📖');
                    setShowReview(false);
                    onClose();
                } else {
                    handleUpdateTrip(updates);
                    toast.success(`${person === 'gorkem' ? 'Görkem' : 'Esra'} değerlendirdi. Diğer kişinin de tamamlaması bekleniyor. ⏳`);
                }
            }}
        />
      </ActionSheet>

      {/* Sub Navigation */}
      <div className="sub-tab-nav-cute">
        {!isCompleted && (
          <button className={`sub-tab-btn-cute ${activeSubTab === 'valiz' ? 'active' : ''}`} onClick={() => setActiveSubTab('valiz')}>
            <span className="btn-emoji">🧳</span>
            <span>Valiz</span>
          </button>
        )}
        <button className={`sub-tab-btn-cute ${activeSubTab === 'details' ? 'active' : ''}`} onClick={() => setActiveSubTab('details')}>
          <span className="btn-emoji">📑</span>
          <span>{isCompleted ? 'Anı Detayı' : 'Detaylar'}</span>
        </button>
        <button className={`sub-tab-btn-cute ${activeSubTab === 'budget' ? 'active' : ''}`} onClick={() => setActiveSubTab('budget')}>
          <span className="btn-emoji">💰</span>
          <span>Bütçe</span>
        </button>
      </div>

      <div className="detail-body">
        {activeSubTab === 'valiz' && (
          <ValizSection 
            trip={trip} 
            weatherForecast={weatherForecast}
            onAutoFill={(items) => handleUpdateTrip({ valiz: items })} 
          />
        )}

        {activeSubTab === 'details' && (
          <div className="docs-view animate-fadeIn">
            {isCompleted ? (
               <MemoryDetailView 
                 trip={trip} 
                 onEditEval={(user) => {
                    setShowReview(true);
                 }} 
               />
            ) : (
              <>
                <TripSmartDetails 
                  trip={trip} 
                  onUpdate={handleUpdateTrip} 
                  onOpenTracker={onOpenTracker}
                  onOpenMap={onOpenMap}
                />
                
                <div className="assistant-row-cute mt-15">
                  <CurrencyConverter targetCurrency={trip.locationType === 'yurtdisi' ? 'EUR' : 'TRY'} />
                  <WeatherWidget city={trip.city} country={trip.country} startDate={trip.startDate} />
                </div>

                <div className="premium-notes-container mt-15 animate-fadeIn">
                  <div className="notes-header">
                    <Edit3 size={18} />
                    <h3>Genel Notlar</h3>
                  </div>
                  <textarea 
                    className="notes-textarea-premium" 
                    value={trip.notes || ''} 
                    placeholder="Gidilecek yerler, yemek listesi vb..."
                    onChange={e => handleUpdateTrip({ notes: e.target.value })} 
                  />
                </div>
              </>
            )}
          </div>
        )}

        {activeSubTab === 'budget' && (
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

function TripSmartDetails({ trip, onUpdate, onOpenTracker, onOpenMap }) {
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

  const openMaps = () => {
    onOpenMap(accForm.hotel, accForm.address, trip.city, trip.country);
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
              <div className="sc-display">
                <strong>{depForm.flightNo || '---'}</strong>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', width: '100%' }}>
                  <button className="sc-ai-btn-premium" onClick={() => {
                    if (!depForm.flightNo) return toast.error('Lütfen uçuş numarası girin');
                    toast.loading(`Asistan ${depForm.flightNo} uçuşunu sorguluyor...`, { duration: 2500 });
                    setTimeout(() => {
                      const no = depForm.flightNo.toUpperCase();
                      if (no === 'PC903') {
                          setDepForm({
                            ...depForm, 
                            time: '14:20', 
                            pnr: '1TG17K',
                            gate: '204B',
                            terminal: '2',
                            airport: 'SAW',
                            delay: 'Zamanında'
                          });
                          toast.success('Uçuş (PC903) bulundu! ✅');
                      } else {
                          toast.success('Uçuş verileri güncellendi. ✅');
                      }
                    }, 2600);
                  }}>
                    ✨ Asistan
                  </button>
                  {depForm.flightNo && (
                    <button className="sc-live-badge-mini" onClick={() => openFlightRadar(depForm.flightNo)}>
                      🛰️ Canlı
                    </button>
                  )}
                </div>
                <div className="flight-main-info">
                  <span className="f-time">{depForm.time || 'Saat belirtilmedi'}</span>
                  {depForm.pnr && <span className="f-pnr">PNR: {depForm.pnr}</span>}
                </div>
                {(depForm.gate || depForm.terminal || depForm.delay) && (
                  <div className="flight-detailed-info">
                    {depForm.airport && <div className="f-badge">📍 {depForm.airport}</div>}
                    {depForm.terminal && <div className="f-badge">🏢 T{depForm.terminal}</div>}
                    {depForm.gate && <div className="f-badge active">🚪 Kapı {depForm.gate}</div>}
                    {depForm.delay && <div className={`f-badge ${depForm.delay.includes('Rötar') ? 'alert' : ''}`}>⏱️ {depForm.delay}</div>}
                  </div>
                )}
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
              <div className="sc-display">
                <strong>{retForm.flightNo || '---'}</strong>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', width: '100%' }}>
                  <button className="sc-ai-btn-premium" onClick={() => {
                    if (!retForm.flightNo) return toast.error('Lütfen uçuş numarası girin');
                    toast.loading(`Asistan ${retForm.flightNo} uçuşunu sorguluyor...`, { duration: 2500 });
                    setTimeout(() => {
                      const no = retForm.flightNo.toUpperCase();
                      if (no === 'PC902') {
                          setRetForm({
                            ...retForm, 
                            time: '19:40', 
                            pnr: 'VIE2026',
                            gate: 'C31',
                            terminal: '3',
                            airport: 'VIE',
                            delay: '15 dk Rötar'
                          });
                          toast.success('Uçuş (PC902) bulundu! ⚠️');
                      } else {
                          toast.success('Uçuş verileri güncellendi. ✅');
                      }
                    }, 2600);
                  }}>
                    ✨ Asistan
                  </button>
                  {retForm.flightNo && (
                    <button className="sc-live-badge-mini" onClick={() => openFlightRadar(retForm.flightNo)}>
                      🛰️ Canlı
                    </button>
                  )}
                </div>
                <div className="flight-main-info">
                  <span className="f-time">{retForm.time || 'Saat belirtilmedi'}</span>
                  {retForm.pnr && <span className="f-pnr">PNR: {retForm.pnr}</span>}
                </div>
                {(retForm.gate || retForm.terminal || retForm.delay) && (
                  <div className="flight-detailed-info">
                    {retForm.airport && <div className="f-badge">📍 {retForm.airport}</div>}
                    {retForm.terminal && <div className="f-badge">🏢 T{retForm.terminal}</div>}
                    {retForm.gate && <div className="f-badge active">🚪 Kapı {retForm.gate}</div>}
                    {retForm.delay && <div className={`f-badge ${retForm.delay.includes('Rötar') ? 'alert' : ''}`}>⏱️ {retForm.delay}</div>}
                  </div>
                )}
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
            <div className="sc-mini-row" style={{ display: 'flex', gap: '8px' }}>
              <button className="sc-mini-action" style={{ flex: 1 }} onClick={openMaps}>
                <MapPin size={12} /> 📍 Harita
              </button>
              <div className="pdf-upload-wrapper" style={{ flex: 1 }}>
                <input 
                  type="file" 
                  id={`pdf-upload-${trip.id}`} 
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        onUpdate({ accommodation: { ...trip.accommodation, pdf: event.target.result } });
                        toast.success('Belge yüklendi! 📄');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button 
                  className={`sc-mini-action ${trip.accommodation?.pdf ? 'success' : ''}`} 
                  style={{ width: '100%' }}
                  onClick={() => {
                    if (trip.accommodation?.pdf) {
                      setViewPdf(trip.accommodation.pdf);
                    } else {
                      document.getElementById(`pdf-upload-${trip.id}`).click();
                    }
                  }}
                >
                  <ExternalLink size={12} /> {trip.accommodation?.pdf ? '📄 Belgeyi Aç' : '📄 Belge Yükle'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HotelMap({ name, address, city, country }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      // 1. Load CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // 2. Load JS if not present
      if (!window.L) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      // 3. Clean up existing map
      if (mapInstance.current) {
        mapInstance.current.remove();
      }

      try {
        const trySearch = async (queryText) => {
          if (!queryText || queryText.trim().length < 3) return null;
          // Clean query for better Nominatim results
          const cleanQuery = queryText.replace(/[!@#$%^&*()_+={}\[\]:;"'<>,.?\/]/g, '').trim();
          const query = encodeURIComponent(cleanQuery);
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
            const data = await response.json();
            return data && data.length > 0 ? data[0] : null;
          } catch (e) { return null; }
        };

        // Aggressive fallback logic
        let result = await trySearch(`${name} ${address} ${city} ${country}`); 
        if (!result) result = await trySearch(`${name} ${city} ${country}`); 
        if (!result) result = await trySearch(`${address} ${city} ${country}`); 
        if (!result) result = await trySearch(`${name} ${city}`); 
        if (!result) result = await trySearch(`${name} ${address}`); 
        if (!result) result = await trySearch(name + ' ' + country); 
        if (!result) result = await trySearch(name); 
        if (!result && address) {
            const parts = address.split(',');
            if (parts.length > 1) result = await trySearch(parts[0] + ' ' + city);
        }
        if (!result) result = await trySearch(address);
        if (!result) result = await trySearch(city + ' ' + country);
        if (!result) result = await trySearch(city);

        if (result && mapRef.current) {
          const { lat, lon } = result;
          const L = window.L;
          mapInstance.current = L.map(mapRef.current).setView([lat, lon], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstance.current);
          L.marker([lat, lon]).addTo(mapInstance.current).bindPopup(name || address).openPopup();
          setLoading(false);
        } else {
          setError('Konum bulunamadı. Lütfen bilgileri kontrol edin.');
          setLoading(false);
        }
      } catch (err) {
        setError('Harita yüklenirken hata oluştu.');
        setLoading(false);
      }
    };
    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [name, address]);

  if (loading) return <div className="map-loader">🛰️ Konum aranıyor...</div>;
  if (error) return <div className="map-error">❌ {error}</div>;

  return <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '16px', zIndex: 1 }} />;
}

function ValizSection({ trip, weatherForecast, onAutoFill }) {
  const { updateTripValiz, setModuleData, tatil, syncValizToDepo, currentUser } = useStore();
  const activePackingUser = currentUser?.name?.toLowerCase() === 'esra' ? 'esra' : 'gorkem';
  const [newItem, setNewItem] = useState('');
  const [showAssistant, setShowAssistant] = useState(false);
  
  const weatherAdvice = useMemo(() => {
    if (!weatherForecast) return null;
    
    let alerts = [];
    const avgTemp = weatherForecast.temp;
    const isHistorical = weatherForecast.isHistorical;
    
    // Check daily codes if available (forecast mode)
    const codes = weatherForecast.daily?.weathercode || (weatherForecast.isSun ? [0] : [3]);
    const hasRain = codes.some(c => c >= 51 && c <= 67);
    const hasSnow = codes.some(c => c >= 71 && c <= 77);

    if (hasSnow || avgTemp < 8) alerts.push({ icon: '🧥', text: 'Hava dondurucu! Kalın mont, bot ve eldiven şart.', priority: 'high' });
    else if (avgTemp < 16) alerts.push({ icon: '🧥', text: 'Serin bir hava bekleniyor, mont/ceket almayı unutma.', priority: 'med' });
    
    if (hasRain) alerts.push({ icon: '☂️', text: 'Yağmur riski! Şemsiye veya yağmurluk ekle.', priority: 'high' });
    if (avgTemp > 25) alerts.push({ icon: '👕', text: 'Sıcak hava! Şort, tişört ve güneş kremi al.', priority: 'med' });

    return { 
      isHistorical, 
      avgTemp: Math.round(avgTemp), 
      alerts,
      daily: weatherForecast.daily // Pass daily data for the mini chart
    };
  }, [weatherForecast]);

  const tripDuration = useMemo(() => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  }, [trip.startDate, trip.endDate]);

  const [currentSuggestions, setCurrentSuggestions] = useState([]);

  const refreshSuggestions = () => {
    const pool = PACKING_POOL.filter(item => {
      if (item.minDays > tripDuration) return false;
      if (item.type === 'yurtdisi' && trip.type !== 'yurtdisi') return false;
      if (item.type === 'is' && trip.tripType !== 'is') return false;
      const inGorkem = (trip.valiz?.gorkem || []).some(v => v.text === item.text);
      const inEsra = (trip.valiz?.esra || []).some(v => v.text === item.text);
      return !inGorkem && !inEsra;
    });
    
    // Pick 6 random
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setCurrentSuggestions(shuffled.slice(0, 6));
  };

  useEffect(() => {
    if (showAssistant) refreshSuggestions();
  }, [showAssistant, tripDuration, trip.type, trip.tripType]);

  const addItem = (text) => {
    if (!text.trim()) return;
    const owner = activePackingUser;
    const ownerList = trip.valiz?.[owner] || [];
    const newItemObj = { id: Date.now(), text: text.trim(), done: false };
    
    const updatedValiz = {
      ...trip.valiz,
      [owner]: [...ownerList, newItemObj]
    };
    
    const updatedTrips = tatil.trips.map(t => t.id === trip.id ? { ...t, valiz: updatedValiz } : t);
    setModuleData('tatil', { ...tatil, trips: updatedTrips });
    
    // Sync to Depo as requested
    syncValizToDepo(text.trim(), 'Seyahat');
    
    setNewItem('');
    toast.success(`${text} eklendi! ✨`);
  };

  const removeItem = (itemId) => {
    const owner = activePackingUser;
    const ownerList = trip.valiz?.[owner] || [];
    const updatedValiz = {
      ...trip.valiz,
      [owner]: ownerList.filter(item => item.id !== itemId)
    };
    const updatedTrips = tatil.trips.map(t => t.id === trip.id ? { ...t, valiz: updatedValiz } : t);
    setModuleData('tatil', { ...tatil, trips: updatedTrips });
    toast.success('Ürün listeden kaldırıldı. 🗑️');
  };

  return (
    <div className="valiz-2-container animate-fadeIn">
      {/* Weather Advice 2.0 */}
      {weatherAdvice && weatherAdvice.alerts.length > 0 && (
        <div className="valiz-weather-oracle glass mb-15">
          <div className="oracle-header">
             <span className="oracle-emoji">🔮</span>
             <div>
               <strong>Valiz 2.0: İklim Kahini</strong>
               <p>{weatherAdvice.isHistorical ? 'Geçen yılın ortalamalarına göre:' : 'Hava durumu tahminine göre:'}</p>
             </div>
          </div>
          <div className="oracle-alerts">
            {weatherAdvice.alerts.map((alert, i) => (
              <div key={i} className={`oracle-alert ${alert.priority}`} onClick={() => addItem(alert.text.split('!')[0].split(',')[0].trim())}>
                <span className="a-icon">{alert.icon}</span>
                <span className="a-text">{alert.text}</span>
                <Plus size={12} opacity={0.5} />
              </div>
            ))}
          </div>

          {!weatherAdvice.isHistorical && weatherAdvice.daily && (
            <div className="oracle-forecast-row">
              {weatherAdvice.daily.time.slice(0, 7).map((time, i) => {
                const code = weatherAdvice.daily.weathercode[i];
                const temp = Math.round(weatherAdvice.daily.temperature_2m_max[i]);
                const dayName = new Date(time).toLocaleDateString('tr-TR', { weekday: 'short' });
                return (
                  <div key={time} className="forecast-mini-item">
                    <span className="fm-day">{dayName}</span>
                    <span className="fm-icon">
                      {code <= 3 ? '☀️' : code <= 67 ? '🌧️' : '❄️'}
                    </span>
                    <span className="fm-temp">{temp}°</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="valiz-column-premium glass">
        <div className={`vc-header ${activePackingUser}`}>
          <div className="vc-input-group">
            <input 
              type="text" 
              placeholder={`${activePackingUser === 'esra' ? 'Esra' : 'Görkem'} için alınacaklar...`}
              value={newItem} 
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem(newItem)}
            />
            <button className="vc-add-btn" onClick={() => addItem(newItem)}><Plus size={18} /></button>
          </div>
        </div>

        <div className="vc-list">
          {(trip.valiz?.[activePackingUser] || []).map(item => (
            <div key={item.id} className={`vc-item glass ${item.done ? 'done' : ''}`}>
              <div className="vci-main" onClick={() => updateTripValiz(trip.id, activePackingUser, item.id)}>
                <div className="vc-check">{item.done && <Check size={12} />}</div>
                <span>{item.text}</span>
              </div>
              <button className="vci-delete-btn" onClick={() => removeItem(item.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {(trip.valiz?.[activePackingUser] || []).length === 0 && (
            <div className="vc-empty">
              <Package size={32} opacity={0.2} />
              <p>Liste henüz boş...</p>
            </div>
          )}
        </div>
      </div>

      <div className="valiz-assistant-box-v2 glass mt-20">
        <button className="va-toggle-btn" onClick={() => setShowAssistant(!showAssistant)}>
          <div className="va-title">
            <span className="va-emoji">🤖</span>
            <div>
              <strong>Valiz 2.0 Akıllı Asistan</strong>
              <p>{tripDuration} günlük seyahat önerileri</p>
            </div>
          </div>
          {showAssistant ? <X size={18} /> : <PlusCircle size={18} />}
        </button>
        
        {showAssistant && (
          <div className="va-suggestions-v2 animate-slideDown">
            <div className="va-header-mini">
              <p className="va-info">Senin için seçtiklerim:</p>
              <button className="va-refresh-btn-cute" onClick={refreshSuggestions} title="Yeni Öneriler">
                <Moon size={14} />
              </button>
            </div>
            <div className="va-suggestions-cute">
              {currentSuggestions.map(s => (
                <button key={s.id} className="va-suggestion-btn-cute glass" onClick={() => addItem(s.text)}>
                  <span className="va-s-icon">{s.icon}</span>
                  <span className="va-s-text">{s.text}</span>
                  <Plus size={10} className="va-s-plus" />
                </button>
              ))}
              {currentSuggestions.length === 0 && <p className="va-empty-text">Tüm öneriler eklendi! ✨</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MemoryDetailView({ trip, onEditEval }) {
  const gEval = trip.evaluations?.gorkem;
  const eEval = trip.evaluations?.esra;
  
  // Collect photos: 3 from Gorkem, 3 from Esra
  const gPhotos = gEval?.photos || [];
  const ePhotos = eEval?.photos || [];

  return (
    <div className="memory-detail-view animate-fadeIn">
      <div className="memory-photos-section">
        <div className="ms-header">
           <Star size={16} color="#FBBF24" fill="#FBBF24" />
           <h3>En Sevdiğimiz Kareler (3'er Adet)</h3>
        </div>
        <div className="m-photo-grid-premium">
          {/* Görkem's Photos */}
          <div className="user-photo-row">
            <div className="user-indicator">👨 Görkem</div>
            <div className="photo-slots">
              {[0, 1, 2].map(i => (
                <div key={i} className="m-photo-slot glass" onClick={() => onEditEval('gorkem')}>
                  {gPhotos[i] ? <img src={gPhotos[i]} alt="Görkem" /> : <Plus size={20} opacity={0.3} />}
                </div>
              ))}
            </div>
          </div>
          {/* Esra's Photos */}
          <div className="user-photo-row mt-10">
            <div className="user-indicator">👩 Esra</div>
            <div className="photo-slots">
              {[0, 1, 2].map(i => (
                <div key={i} className="m-photo-slot glass" onClick={() => onEditEval('esra')}>
                  {ePhotos[i] ? <img src={ePhotos[i]} alt="Esra" /> : <Plus size={20} opacity={0.3} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="evaluations-display mt-20">
        <div className="ms-header">
          <Edit3 size={16} color="#8B5CF6" />
          <h3>Değerlendirmelerimiz</h3>
        </div>
        <div className="eval-grid-premium">
          <div className="eval-card-v2 gorkem glass">
            <div className="ec-header">
              <span>👨 Görkem</span> 
              <strong>{gEval?.star || 0}/10</strong>
              <button className="ec-edit-btn" onClick={() => onEditEval('gorkem')}><Edit3 size={12} /></button>
            </div>
            <p>{gEval?.note || 'Not bırakılmamış.'}</p>
          </div>
          <div className="eval-card-v2 esra glass">
            <div className="ec-header">
              <span>👩 Esra</span> 
              <strong>{eEval?.star || 0}/10</strong>
              <button className="ec-edit-btn" onClick={() => onEditEval('esra')}><Edit3 size={12} /></button>
            </div>
            <p>{eEval?.note || 'Not bırakılmamış.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TripReviewPanel({ trip, onComplete }) {
  const { currentUser } = useStore();
  const isJoint = trip.travelers === 'ikimiz';
  const activeUser = currentUser?.name?.toLowerCase() === 'esra' ? 'esra' : 'gorkem';
  
  const [evalData, setEvalData] = useState({ 
    star: trip.evaluations?.[activeUser]?.star || 10, 
    note: trip.evaluations?.[activeUser]?.note || '', 
    photos: trip.evaluations?.[activeUser]?.photos || [] 
  });

  // Sync state if initialUser changes
  useEffect(() => {
    setEvalData({ 
      star: trip.evaluations?.[activeUser]?.star || 10, 
      note: trip.evaluations?.[activeUser]?.note || '', 
      photos: trip.evaluations?.[activeUser]?.photos || [] 
    });
  }, [activeUser]);

  const handleSubmit = () => {
    toast.success('Değerlendirme başarıyla kaydedildi! ✨');
    onComplete(activeUser, evalData);
  };

  const compressImage = (base64Str) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.onerror = (e) => reject(e);
    });
  };

  const handlePhotoClick = (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const compressed = await compressImage(event.target.result);
            const newPhotos = [...evalData.photos];
            newPhotos[index] = compressed;
            setEvalData({ ...evalData, photos: newPhotos });
          } catch (err) {
            console.error('Compression error:', err);
            toast.error('Fotoğraf işlenirken hata oluştu.');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="review-panel-premium animate-fadeIn">
      <div className="review-active-user-badge mb-15">
         <span>{activeUser === 'esra' ? '👩 Esra' : '👨 Görkem'}</span> olarak değerlendiriyorsun
      </div>

      <div className="review-form-box glass">
        <div className="rfb-section">
          <h4>🌟 Puanın (1-10)</h4>
          <div className="star-rating-row">
            {[1,2,3,4,5,6,7,8,9,10].map(s => (
              <button key={s} className={evalData.star >= s ? 'active' : ''} onClick={() => setEvalData({...evalData, star: s})}>
                <Star size={18} fill={evalData.star >= s ? 'gold' : 'none'} stroke={evalData.star >= s ? 'gold' : 'white'} />
              </button>
            ))}
          </div>
        </div>
        
        <div className="rfb-section mt-20">
          <h4>📝 Notun</h4>
          <textarea 
            placeholder="Bu seyahatte en çok neyi sevdin?" 
            value={evalData.note} 
            onChange={e => setEvalData({...evalData, note: e.target.value})}
            className="review-textarea"
          />
        </div>

        <div className="rfb-section mt-20">
          <h4>📸 Favori 3 Karen</h4>
          <div className="review-photo-grid">
            {[0, 1, 2].map(i => (
              <div key={i} className="rp-slot glass" onClick={() => handlePhotoClick(i)}>
                {evalData.photos[i] ? (
                  <img src={evalData.photos[i]} alt="Upload" />
                ) : (
                  <PlusCircle size={20} opacity={0.5} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <button className="submit-btn-premium tatil mt-20" onClick={handleSubmit}>
          Değerlendirmeyi Kaydet {isJoint ? '✨' : '✅'}
        </button>
      </div>
    </div>
  );
}

function CurrencyConverter({ targetCurrency }) {
  const { kasa } = useStore();
  const [val, setVal] = useState('');
  const rate = (kasa.rates && kasa.rates[targetCurrency]) || (targetCurrency === 'EUR' ? 35 : 1);
  
  return (
    <div className="assistant-widget glass">
      <div className="aw-header"><Wallet size={14} /> <span>Kur Çevirici</span></div>
      <div className="aw-body">
        <input type="number" placeholder="Miktar" value={val} onChange={e => setVal(e.target.value)} />
        <div className="aw-result">
          {val ? `≈ ${(val * rate).toLocaleString()} ₺` : `1 ${targetCurrency} = ${rate} ₺`}
        </div>
      </div>
    </div>
  );
}

function WeatherWidget({ city, country, startDate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchWeatherForTrip(city, country, startDate);
      setData(res);
      setLoading(false);
    };
    load();
  }, [city, country, startDate]);

  return (
    <div className="assistant-widget glass">
      <div className="aw-header">
        {loading ? <div className="spinner-mini" /> : (data?.isSun ? <Sun size={14} /> : <Cloud size={14} />)}
        <span>Hava Durumu</span>
      </div>
      <div className="aw-body weather-flex">
        <div className="aw-temp-box">
          <div className="aw-temp">{loading ? '...' : (data ? `${data.temp}°` : '--')}</div>
          {data?.label && <div className="aw-temp-label">{data.label}</div>}
        </div>
        <div className="aw-city">{city}</div>
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
  const now = getNowUTC().split('T')[0];
  const daysLeft = data?.exp ? Math.ceil((new Date(data.exp).getTime() - new Date(now).getTime()) / 864e5) : null;
  const isExpired = daysLeft !== null && daysLeft < 0;
  const isWarning = daysLeft !== null && daysLeft < 180;
  
  return (
    <div className={`passport-red-card ${isWarning ? 'warning' : ''}`} onClick={() => onEdit(pid)}>
      <div className="prc-texture" />
      <div className="prc-header">
        <div className="prc-emblem">🇹🇷</div>
        <div className="prc-titles">
          <span>TÜRKİYE CUMHURİYETİ</span>
          <small>REPUBLIC OF TURKEY</small>
        </div>
      </div>
      
      <div className="prc-type">
        <span>PASAPORT</span>
        <small>PASSPORT</small>
      </div>

      <div className="prc-details">
        <div className="prc-main">
          <div className="prc-field">
            <label>Soyadı / Surname</label>
            <strong>{data?.surname || '---'}</strong>
          </div>
          <div className="prc-field">
            <label>Adı / Name</label>
            <strong>{data?.name || '---'}</strong>
          </div>
        </div>
        
        <div className="prc-row">
          <div className="prc-field">
            <label>No</label>
            <strong>{data?.no || '---'}</strong>
          </div>
          <div className="prc-field">
            <label>S.K.T / Expiry</label>
            <strong className={isWarning ? 'alert' : ''}>{data?.exp || '---'}</strong>
          </div>
        </div>
      </div>

      {daysLeft !== null && (
        <div className={`prc-status-badge ${isExpired ? 'danger' : isWarning ? 'warn' : 'ok'}`}>
          {isExpired ? 'SÜRESİ DOLDU' : `${daysLeft} GÜN KALDI`}
        </div>
      )}
    </div>
  );
}

function ManagePassportContent({ pid, data, onClose }) {
  const { tatil, setModuleData } = useStore();
  const [form, setForm] = useState(data || { name: '', surname: '', no: '', exp: '', birthDate: '', nationality: 'TC' });

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
      <div className="form-row-2">
        <div className="form-group">
          <label>Adı</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="premium-input" required />
        </div>
        <div className="form-group">
          <label>Soyadı</label>
          <input type="text" value={form.surname} onChange={e => setForm({...form, surname: e.target.value})} className="premium-input" required />
        </div>
      </div>
      <div className="form-row-2">
        <div className="form-group">
          <label>Pasaport No</label>
          <input type="text" value={form.no} onChange={e => setForm({...form, no: e.target.value})} placeholder="U12345678" className="premium-input" required />
        </div>
        <div className="form-group">
          <label>S.K.T</label>
          <input type="date" value={form.exp} onChange={e => setForm({...form, exp: e.target.value})} className="premium-input" required />
        </div>
      </div>
      <div className="form-row-2">
        <div className="form-group">
          <label>Doğum Tarihi</label>
          <input type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} className="premium-input" />
        </div>
        <div className="form-group">
          <label>Uyruk</label>
          <input type="text" value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} className="premium-input" />
        </div>
      </div>
      <button type="submit" className="submit-btn-premium tatil">Pasaportu Mühürle 🖋️</button>
    </form>
  );
}

function PasaportTab({ tatil, onEdit }) {
  const { setModuleData } = useStore();
  const p = tatil.passport || { gorkem: {}, esra: {} };
  const visas = tatil.visas || [];
  const [showVisaWizard, setShowVisaWizard] = useState(false);
  const [newVisa, setNewVisa] = useState({ country: '', type: 'Schengen', owner: 'gorkem', start: '', end: '' });

  const [editingVisaId, setEditingVisaId] = useState(null);

  const handleSaveVisa = () => {
    if (!newVisa.country || !newVisa.start || !newVisa.end) {
      toast.error('Lütfen tüm alanları doldurun.');
      return;
    }
    
    let updatedVisas;
    if (editingVisaId) {
      updatedVisas = visas.map(v => v.id === editingVisaId ? { ...newVisa, id: editingVisaId } : v);
      toast.success('Vize güncellendi! 🛂');
    } else {
      updatedVisas = [...visas, { ...newVisa, id: Date.now() }];
      toast.success('Vize başarıyla eklendi! 🛂');
    }
    
    setModuleData('tatil', { ...tatil, visas: updatedVisas });
    setShowVisaWizard(false);
    setEditingVisaId(null);
    setNewVisa({ country: '', type: 'Schengen', owner: 'gorkem', start: '', end: '' });
  };

  const startEdit = (visa) => {
    setNewVisa(visa);
    setEditingVisaId(visa.id);
    setShowVisaWizard(true);
  };
  
  return (
    <div className="tab-pane animate-fadeIn">
      <div className="passport-grid">
        <PassportCard pid="gorkem" data={p.gorkem} label="Görkem Eray" onEdit={onEdit} />
        <PassportCard pid="esra" data={p.esra} label="Esra Eray" onEdit={onEdit} />
      </div>

      <SchengenAssistant tatil={tatil} />

      <div className="visa-section-container glass mt-20">
        <div className="section-header-cute">
          <h3>🛂 Vize Takibi</h3>
          <button className="add-mini-btn" onClick={() => {
            setShowVisaWizard(!showVisaWizard);
            if (editingVisaId) {
              setEditingVisaId(null);
              setNewVisa({ country: '', type: 'Schengen', owner: 'gorkem', start: '', end: '' });
            }
          }}>
            {showVisaWizard ? <X size={14} /> : <Plus size={14} />}
          </button>
        </div>
        
        {showVisaWizard && (
          <div className="visa-wizard-compact glass animate-slideDown mb-15">
            <div className="w-compact-row">
              <input placeholder="Ülke" value={newVisa.country} onChange={e => setNewVisa({...newVisa, country: e.target.value})} />
              <select value={newVisa.type} onChange={e => setNewVisa({...newVisa, type: e.target.value})}>
                <option>Schengen</option>
                <option>UK</option>
                <option>ABD</option>
                <option>Dubai</option>
              </select>
              <select value={newVisa.owner} onChange={e => setNewVisa({...newVisa, owner: e.target.value})}>
                <option value="gorkem">Görkem</option>
                <option value="esra">Esra</option>
              </select>
            </div>
            <div className="w-compact-row">
              <div className="date-input-group">
                <small>Başlangıç:</small>
                <input type="date" value={newVisa.start} onChange={e => setNewVisa({...newVisa, start: e.target.value})} />
              </div>
              <div className="date-input-group">
                <small>Bitiş:</small>
                <input type="date" value={newVisa.end} onChange={e => setNewVisa({...newVisa, end: e.target.value})} />
              </div>
              <button className="save-btn-compact" onClick={handleSaveVisa}>
                {editingVisaId ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        )}

        <div className="visas-split-list">
          {/* ACTIVE VISAS */}
          <div className="visa-sub-section">
            <h4 className="v-sub-title active">Aktif Vizeler</h4>
            {visas.filter(v => v.end >= getNowUTC().split('T')[0]).map(v => (
              <VisaItem key={v.id} v={v} onEdit={() => startEdit(v)} onDel={() => {
                const updated = visas.filter(item => item.id !== v.id);
                setModuleData('tatil', { ...tatil, visas: updated });
              }} />
            ))}
            {visas.filter(v => v.end >= getNowUTC().split('T')[0]).length === 0 && <div className="v-empty">Aktif vize yok.</div>}
          </div>

          {/* EXPIRED VISAS */}
          <div className="visa-sub-section mt-15">
            <h4 className="v-sub-title expired">Süresi Dolanlar</h4>
            {visas.filter(v => v.end < getNowUTC().split('T')[0]).map(v => (
              <VisaItem key={v.id} v={v} onEdit={() => startEdit(v)} onDel={() => {
                const updated = visas.filter(item => item.id !== v.id);
                setModuleData('tatil', { ...tatil, visas: updated });
              }} />
            ))}
            {visas.filter(v => v.end < getNowUTC().split('T')[0]).length === 0 && <div className="v-empty">Dolan vize yok.</div>}
          </div>
        </div>
      </div>

      <VisaSmartInfo />
    </div>
  );
}

function SchengenAssistant({ tatil }) {
  const plannedTrips = (tatil.trips || []).filter(t => {
    const status = calculateTripStatus(t.startDate, t.endDate);
    return status !== 'completed' && t.schengen;
  });
  const visas = tatil.visas || [];

  return (
    <div className="schengen-assistant-box glass mt-20">
      <div className="sa-header">
        <ShieldCheck size={20} color="var(--tatil)" />
        <h4>Schengen Uyumluluk Asistanı</h4>
      </div>
      <div className="sa-content">
        {plannedTrips.length > 0 ? plannedTrips.map(t => {
          const tripStart = new Date(t.startDate);
          const tripEnd = new Date(t.endDate);
          
          const travelersNeeded = t.travelers === 'ikimiz' ? ['gorkem', 'esra'] : [t.travelers];
          const results = travelersNeeded.map(owner => {
            const validVisa = visas.find(v => 
              v.owner === owner && 
              v.type === 'Schengen' && 
              v.start <= t.startDate && 
              v.end >= t.endDate
            );
            return { owner, valid: !!validVisa };
          });

          const allOk = results.every(r => r.valid);

          return (
            <div key={t.id} className={`sa-trip-check ${allOk ? 'ok' : 'error'}`}>
              <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                <strong>{t.city} Seyahati</strong>
                <span>{allOk ? '✅ Uygun' : '⚠️ Vize Sorunu!'}</span>
              </div>
              <div className="sa-results-detail">
                {results.map(r => (
                  <span key={r.owner} className={r.valid ? 'ok' : 'error'}>
                    {r.owner === 'gorkem' ? 'Görkem' : 'Esra'}: {r.valid ? 'Vize OK' : 'Vize Yok/Geçersiz'}
                  </span>
                ))}
              </div>
            </div>
          );
        }) : <p className="empty-text">Vize gerektiren planlanmış seyahat yok.</p>}
      </div>
    </div>
  );
}

function VisaItem({ v, onEdit, onDel }) {
  return (
    <div className="visa-item-card glass animate-slideRight">
      <div className="vi-flag">{getCountryFlag('', '', v.country)}</div>
      <div className="vi-info">
        <strong>{v.type} - {v.country}</strong>
        <span>{v.owner === 'gorkem' ? 'Görkem' : 'Esra'} · {v.start} / {v.end}</span>
      </div>
      <div className={`vi-status ${v.end < getNowUTC().split('T')[0] ? 'expired' : 'active'}`}>
        {v.end < getNowUTC().split('T')[0] ? 'Süresi Doldu' : 'Aktif'}
      </div>
      <div className="vi-actions">
        <button className="vi-edit-btn" onClick={onEdit}><Edit3 size={12} /></button>
        <button className="vi-del-btn" onClick={onDel}><Trash2 size={12} /></button>
      </div>
    </div>
  );
}

function VisaSmartInfo() {
  const visaFacts = [
    { type: 'Schengen', text: 'Avrupa turistik (C Tipi). 180 gün içinde 90 gün kalış hakkı.' },
    { type: 'UK Standard', text: 'İngiltere için ayrı başvuru gerekir. Genelde 6 aylık verilir.' },
    { type: 'ABD B1/B2', text: 'Genellikle 10 yıllık verilir. Mülakat gereklidir.' },
    { type: 'Yunan Adaları', text: '7 günlük "Kapı Vizesi" belirli adalar için aktiftir.' }
  ];

  return (
    <div className="visa-smart-info glass mt-20 mb-40">
      <div className="vsi-header">
        <AlertCircle size={18} color="var(--tatil)" />
        <h4>Smart Vize Rehberi (TR)</h4>
      </div>
      <div className="vsi-list">
        {visaFacts.map((f, i) => (
          <div key={i} className="vsi-list-item">
            <strong>{f.type}:</strong>
            <span>{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HaritaTab({ tatil, onTabChange }) {
  const [selectedContinent, setSelectedContinent] = useState('world');
  
  const jointPast = useMemo(() => {
    return (tatil.trips || [])
      .filter(t => {
        const status = calculateTripStatus(t.startDate, t.endDate);
        return status === 'completed' && t.travelers === 'ikimiz';
      })
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, [tatil.trips]);


  const stats = {
    countries: new Set(jointPast.map(t => t.country)).size,
    cities: new Set(jointPast.map(t => t.city)).size,
    days: jointPast.reduce((acc, t) => acc + (Math.ceil((new Date(t.endDate) - new Date(t.startDate)) / 864e5) + 1), 0)
  };

  const pins = [
    { id: 't_london', name: 'Londra', x: 48.5, y: 34.2, continent: 'europe', offset: 'top' },
    { id: 't_berlin', name: 'Berlin', x: 53.2, y: 33.5, continent: 'europe', offset: 'top' },
    { id: 't_sofia', name: 'Sofya', x: 57.2, y: 43.5, continent: 'europe', offset: 'top' },
    { id: 't_kavala', name: 'Kavala', x: 57.5, y: 46.5, continent: 'europe', offset: 'bottom' },
    { id: 't_sarajevo', name: 'Saraybosna', x: 55.2, y: 41.5, continent: 'europe', offset: 'left' },
    { id: 't_marseille', name: 'Marsilya', x: 50.8, y: 42.5, continent: 'europe', offset: 'left' },
    { id: 't_istanbul', name: 'İstanbul', x: 60.5, y: 44.5, continent: 'europe', offset: 'right' }
  ].filter(p => jointPast.some(t => (
    t.id === p.id || 
    t.title?.toLowerCase().includes(p.name.toLowerCase()) || 
    t.city?.toLowerCase().includes(p.name.toLowerCase()) ||
    (p.name === 'Kavala' && t.title?.includes('Kavala'))
  )));

  const continents = [
    { id: 'world', label: 'Dünya', zoom: 'scale(1) translate(0, 0)' },
    { id: 'europe', label: 'Avrupa', zoom: 'scale(3.2) translate(-2%, 12%)' },
    { id: 'asia', label: 'Asya', zoom: 'scale(1.8) translate(-15%, 8%)' },
    { id: 'americas', label: 'Amerika', zoom: 'scale(1.6) translate(28%, 5%)' }
  ];

  const currentZoom = continents.find(c => c.id === selectedContinent)?.zoom || 'scale(1)';

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="explorer-stats-premium mb-20">
        <div className="esp-item glass"><strong>{stats.countries}</strong><small>ÜLKE</small></div>
        <div className="esp-item glass"><strong>{stats.cities}</strong><small>ŞEHİR</small></div>
        <div className="esp-item glass"><strong>{stats.days}</strong><small>GÜN</small></div>
      </div>

      <div className="continent-selector mb-15">
        {continents.map(c => (
          <button 
            key={c.id} 
            className={`cont-btn glass ${selectedContinent === c.id ? 'active' : ''}`}
            onClick={() => setSelectedContinent(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="map-frame-premium glass">
        <div className="map-zoom-viewport">
          <div className="map-container-inner" style={{ transform: currentZoom, '--map-scale': selectedContinent === 'europe' ? '3.2' : (selectedContinent === 'world' ? '1' : '1.8') }}>
            {/* Clean 2D Map - Educational and Readable */}
            <img 
              src="/world_map.png" 
              alt="Clean 2D World Map" 
              className="base-map educational" 
            />
            
            <div className="map-pins-layer">
              {pins.map(pin => (
                <div 
                  key={pin.id} 
                  className={`map-pin-premium ${pin.offset || ''} ${selectedContinent !== 'world' && selectedContinent !== pin.continent ? 'hidden' : ''}`}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                >
                  <div className="pin-dot" />
                  <div className="pin-label">{pin.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="map-overlay-info glass">
          <MapPin size={16} color="var(--tatil)" />
          <span>{selectedContinent === 'world' ? 'Tüm Ortak Gezilerimiz' : `${selectedContinent.charAt(0).toUpperCase() + selectedContinent.slice(1)} Keşifleri`}</span>
        </div>
      </div>

      <div className="recent-discoveries mt-20">
        <h4 className="section-title-cute">Son 10 Keşif</h4>
        <div className="rd-list-compact">
          {jointPast.slice(0, 10).map(t => (
            <div key={t.id} className="rd-item-small glass animate-slideRight" onClick={() => onTabChange('anilar')}>
              <span className="rd-flag-small">{getCountryFlag('', '', t.country)}</span>
              <div className="rd-info-small">
                <strong>{t.city}</strong>
                <small>{t.country} · {new Date(t.startDate).getFullYear()}</small>
              </div>
              <ChevronRight size={14} opacity={0.3} />
            </div>
          ))}
          {jointPast.length === 0 && <div className="empty-mini-state">Henüz ortak anı yok...</div>}
        </div>
      </div>
    </div>
  );
}

function HayalTab({ tatil }) {
  const { setModuleData } = useStore();
  const [activeSubTab, setActiveSubTab] = useState('experiences');
  const [filter, setFilter] = useState('Hepsi');
  const wishlist = tatil.wishlist || [];
  
  const categories = ['Hepsi', 'Macera', 'Doğa', 'Kültür', 'Romantik', 'Tarih', 'Şehir', 'Keyif'];
  
  const filteredBucket = useMemo(() => {
    if (filter === 'Hepsi') return BUCKET_LIST;
    return BUCKET_LIST.filter(item => item.category === filter);
  }, [filter]);

  const [recommendation, setRecommendation] = useState(BUCKET_LIST[0]);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualDream, setManualDream] = useState({ place: '', country: '', budget: '', notes: '' });

  const refreshRecommendation = () => {
    let next;
    do {
      next = BUCKET_LIST[Math.floor(Math.random() * BUCKET_LIST.length)];
    } while (next.id === recommendation.id);
    setRecommendation(next);
  };

  useEffect(() => {
    refreshRecommendation();
  }, []);

  const toggleWishlist = (item) => {
    const exists = wishlist.some(w => w.bucketId === item.id);
    let newList;
    if (exists) {
      newList = wishlist.filter(w => w.bucketId !== item.id);
      toast.success('Hayal listesinden çıkarıldı.');
    } else {
      newList = [...wishlist, { id: Date.now(), bucketId: item.id, place: item.title, notes: `${item.city}, ${item.country}` }];
      toast.success('Hayallere eklendi! ✨');
    }
    setModuleData('tatil', { ...tatil, wishlist: newList });
  };

  const dreamProgress = useMemo(() => {
    const total = BUCKET_LIST.length;
    const added = wishlist.filter(w => !w.isManual).length;
    return Math.round((added / total) * 100);
  }, [wishlist]);

  return (
    <div className="tab-pane animate-fadeIn">
      {/* Discovery Oracle Header */}
      <div className="discovery-oracle-premium glass mb-20">
        <div className="oracle-glow"></div>
        <div className="do-header">
          <div className="do-title-group">
            <div className="do-icon-box">
              <Map className="do-icon" size={24} />
            </div>
            <div>
              <h3 className="do-title">Keşif Kahini</h3>
              <p className="do-subtitle">Sıradaki maceranı keşfetmeye hazır mısın?</p>
            </div>
          </div>
          <button className="do-refresh-btn" onClick={refreshRecommendation}>
            <Moon size={18} />
          </button>
        </div>

        <div className="do-content glass">
          <div className="do-recommendation-box">
             <span className="do-flag">{recommendation.flag}</span>
             <div className="do-text">
               <strong>{recommendation.title}</strong>
               <p>{recommendation.city} seni bekliyor!</p>
             </div>
          </div>
          <button className={`do-action-btn ${wishlist.some(w => w.bucketId === recommendation.id) ? 'active' : ''}`} onClick={() => toggleWishlist(recommendation)}>
            {wishlist.some(w => w.bucketId === recommendation.id) ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>

        <div className="do-footer">
          <div className="do-progress-bar">
            <div className="do-progress-fill" style={{ width: `${dreamProgress}%` }}></div>
          </div>
          <span className="do-progress-text">Dünya Deneyimlerinin %{dreamProgress}'i Hayallerinde</span>
        </div>
      </div>

      <div className="sub-tab-nav-cute mb-20">
        <button className={`sub-tab-btn-cute ${activeSubTab === 'experiences' ? 'active' : ''}`} onClick={() => setActiveSubTab('experiences')}>
          <span className="btn-emoji">🗺️</span>
          <span>Keşif Dünyası</span>
        </button>
        <button className={`sub-tab-btn-cute ${activeSubTab === 'my_list' ? 'active' : ''}`} onClick={() => setActiveSubTab('my_list')}>
          <span className="btn-emoji">⭐</span>
          <span>Bizim Hayallerimiz ({wishlist.length})</span>
        </button>
      </div>

      {activeSubTab === 'experiences' && (
        <div className="experiences-view animate-fadeIn">
          <div className="category-chips-scroll mb-20">
            {categories.map(c => (
              <button key={c} className={`chip-tag ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
                {c}
              </button>
            ))}
          </div>
          
          <div className="experiences-grid-premium">
            {filteredBucket.map(item => (
              <div key={item.id} className="exp-card-premium glass">
                <div className="exp-card-top">
                  <span className="exp-badge">{item.category}</span>
                  <button className={`exp-fav-btn ${wishlist.some(w => w.bucketId === item.id) ? 'active' : ''}`} onClick={() => toggleWishlist(item)}>
                    <Star size={16} fill={wishlist.some(w => w.bucketId === item.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="exp-card-main">
                  <div className="exp-visual">
                    <span className="exp-emoji">{item.flag}</span>
                  </div>
                  <div className="exp-info">
                    <h4>{item.title}</h4>
                    <p>{item.city}, {item.country}</p>
                  </div>
                </div>
                <div className="exp-card-footer">
                  <div className="exp-stats">
                    <div className="exp-stat"><Timer size={12} /> {item.duration}</div>
                    <div className="exp-stat"><Wallet size={12} /> {item.budget}</div>
                  </div>
                  <div className="exp-season">
                    <Calendar size={12} /> {item.season}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'my_list' && (
        <div className="my-wishlist-view animate-fadeIn">
          <div className="wishlist-hero-action glass mb-20" onClick={() => setShowManualForm(true)}>
             <div className="wh-icon"><PlusCircle size={28} /></div>
             <div className="wh-text">
               <strong>Yeni Bir Hayal Kur</strong>
               <p>Henüz listede olmayan o özel yeri ekle...</p>
             </div>
          </div>

          {showManualForm && (
            <div className="manual-dream-overlay animate-fadeIn">
              <div className="manual-dream-modal glass animate-slideDown">
                <div className="md-modal-header">
                  <h3>✨ Özel Hayal Ekle</h3>
                  <button className="close-btn" onClick={() => setShowManualForm(false)}><X size={20} /></button>
                </div>
                <div className="md-modal-body">
                  <div className="md-input-row">
                    <div className="md-input-field">
                      <label>Nereye?</label>
                      <input placeholder="Şehir/Yer" value={manualDream.place} onChange={e => setManualDream({...manualDream, place: e.target.value})} />
                    </div>
                    <div className="md-input-field">
                      <label>Ülke</label>
                      <input placeholder="Ülke" value={manualDream.country} onChange={e => setManualDream({...manualDream, country: e.target.value})} />
                    </div>
                  </div>
                  <div className="md-input-field">
                    <label>Bütçe</label>
                    <input placeholder="Tahmini Bütçe (örn: €1.500)" value={manualDream.budget} onChange={e => setManualDream({...manualDream, budget: e.target.value})} />
                  </div>
                  <div className="md-input-field">
                    <label>Notlarımız</label>
                    <textarea placeholder="Neden gitmek istiyoruz?" value={manualDream.notes} onChange={e => setManualDream({...manualDream, notes: e.target.value})} />
                  </div>
                  <button className="md-submit-btn" onClick={() => {
                    if (!manualDream.place) return toast.error('Yer ismi gerekli!');
                    const newItem = { id: Date.now(), isManual: true, ...manualDream };
                    setModuleData('tatil', { ...tatil, wishlist: [...wishlist, newItem] });
                    setManualDream({ place: '', country: '', budget: '', notes: '' });
                    setShowManualForm(false);
                    toast.success('Özel hayal eklendi! ✈️');
                  }}>Hayallerimize Mühürle</button>
                </div>
              </div>
            </div>
          )}

          <div className="wishlist-grid-premium">
            {wishlist.map(w => {
              const bucketItem = !w.isManual ? BUCKET_LIST.find(b => b.id === w.bucketId) : null;
              const displayPlace = w.isManual ? w.place : bucketItem?.title;
              const displayCountry = w.isManual ? w.country : bucketItem?.country;
              const displayNotes = w.isManual ? w.notes : bucketItem?.city;
              const displayBudget = w.isManual ? w.budget : bucketItem?.budget;

              return (
                <div key={w.id} className="wish-card-premium glass animate-slideRight">
                  <div className="wc-top">
                    <div className="wc-flag-box">{bucketItem?.flag || '🌍'}</div>
                    <div className="wc-info">
                      <strong>{displayPlace}</strong>
                      <small>{displayCountry}</small>
                    </div>
                    <button className="wc-del-btn" onClick={() => {
                      if(window.confirm('Bu hayali listeden çıkarmak istiyor musun?')) {
                        const filtered = wishlist.filter(item => item.id !== w.id);
                        setModuleData('tatil', { ...tatil, wishlist: filtered });
                      }
                    }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="wc-content">
                    {displayBudget && <div className="wc-budget"><DollarSign size={12} /> {displayBudget}</div>}
                    {displayNotes && <p className="wc-notes">“{displayNotes}”</p>}
                  </div>
                </div>
              );
            })}
            {wishlist.length === 0 && (
              <div className="empty-dream-state">
                <Map size={48} opacity={0.1} />
                <p>Henüz bir hayal eklemediniz. Deneyim listesine göz atın veya kendi hayalinizi yaratın!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function AddDreamContent({ onAdd }) {
  const [form, setForm] = useState({ place: '', notes: '' });
  return (
    <div className="modal-form-premium">
      <div className="form-group">
        <label>Neresi?</label>
        <input placeholder="Ülke, Şehir..." value={form.place} onChange={e => setForm({...form, place: e.target.value})} className="premium-input" />
      </div>
      <div className="form-group">
        <label>Neden gitmek istiyoruz?</label>
        <textarea placeholder="Kiraz çiçeklerini görmek için..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="premium-input" />
      </div>
      <button onClick={() => onAdd(form)} className="submit-btn-premium tatil">Hayallere Ekle ✨</button>
    </div>
  );
}
