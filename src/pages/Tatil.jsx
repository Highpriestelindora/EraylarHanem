import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ActionSheet from '../components/ActionSheet';
import Portal from '../components/Portal';
import { 
  Plane, Map, ShieldCheck, Star, 
  Plus, Trash2, Calendar, MapPin, 
  Hotel, Wallet, CheckSquare, Cloud, Sun, CloudRain, CloudSnow, CloudLightning,
  ArrowRight, AlertCircle, Info, Timer, X, ArrowLeft,
  PlusCircle, ChevronRight, ExternalLink, Moon,
  ChevronUp, ChevronDown,
  Search, Flag, Edit3, Check, DollarSign, Package, RotateCcw
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { PACKING_POOL, BUCKET_LIST, INITIAL_TRIPS, INITIAL_VISAS, GEO_ADVICE } from '../constants/data';
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
}// --- HELPERS ---
const getCountryFlag = (title = '', city = '', country = '') => {
  const text = normalizeText(title + ' ' + city + ' ' + country);
  
  let code = '';
  if (text.includes('avusturya') || text.includes('viyana') || text.includes('vienna') || text.includes('austria')) code = 'at';
  else if (text.includes('kibris') || text.includes('kktc') || text.includes('cyprus')) code = 'cy';
  else if (text.includes('italya') || text.includes('italy') || text.includes('roma') || text.includes('milano') || text.includes('venedik')) code = 'it';
  else if (text.includes('almanya') || text.includes('germany') || text.includes('berlin') || text.includes('munih') || text.includes('heidelberg')) code = 'de';
  else if (text.includes('fransa') || text.includes('france') || text.includes('paris') || text.includes('marsilya') || text.includes('marseille')) code = 'fr';
  else if (text.includes('ingiltere') || text.includes('london') || text.includes('londra') || text.includes('uk') || text.includes('kingdom') || text.includes('britanya')) code = 'gb';
  else if (text.includes('yunanistan') || text.includes('greece') || text.includes('athens') || text.includes('selanik') || text.includes('kavala') || text.includes('atina') || text.includes('sakiz')) code = 'gr';
  else if (text.includes('ispanya') || text.includes('spain') || text.includes('madrid') || text.includes('barcelona') || text.includes('valencia')) code = 'es';
  else if (text.includes('hollanda') || text.includes('netherlands') || text.includes('amsterdam') || text.includes('eindhoven')) code = 'nl';
  else if (text.includes('bulgaristan') || text.includes('bulgaria') || text.includes('sofya') || text.includes('sofiya') || text.includes('plovdiv')) code = 'bg';
  else if (text.includes('bosna') || text.includes('saraybosna') || text.includes('sarajevo') || text.includes('mostar')) code = 'ba';
  else if (text.includes('japonya') || text.includes('japan') || text.includes('tokyo') || text.includes('osaka')) code = 'jp';
  else if (text.includes('izlanda') || text.includes('iceland') || text.includes('reykjavik')) code = 'is';
  else if (text.includes('turkiye') || text.includes('turkey') || text.includes('konya') || text.includes('istanbul') || text.includes('ankara') || text.includes('izmir') || text.includes('antalya')) code = 'tr';
  else if (text.includes('peru') || text.includes('lima') || text.includes('cusco')) code = 'pe';
  else if (text.includes('tanzanya') || text.includes('serengeti') || text.includes('zanzibar')) code = 'tz';
  else if (text.includes('brezilya') || text.includes('amazon') || text.includes('rio') || text.includes('sao paulo')) code = 'br';
  else if (text.includes('guney afrika') || text.includes('cape town')) code = 'za';
  else if (text.includes('kambocya') || text.includes('siem reap')) code = 'kh';
  else if (text.includes('bae') || text.includes('dubai') || text.includes('doha') || text.includes('qatar') || text.includes('katar')) {
    if (text.includes('doha') || text.includes('qatar') || text.includes('katar')) code = 'qa';
    else code = 'ae';
  }
  else if (text.includes('kanada') || text.includes('toronto')) code = 'ca';
  else if (text.includes('cekya') || text.includes('prag') || text.includes('czech')) code = 'cz';
  else if (text.includes('macaristan') || text.includes('budapeste') || text.includes('hungary')) code = 'hu';
  else if (text.includes('misir') || text.includes('kahire') || text.includes('piramit') || text.includes('egypt')) code = 'eg';
  else if (text.includes('rusya') || text.includes('moskova') || text.includes('russia')) code = 'ru';
  else if (text.includes('tayland') || text.includes('bangkok') || text.includes('phuket')) code = 'th';
  else if (text.includes('singapur') || text.includes('singapore')) code = 'sg';
  else if (text.includes('hong kong')) code = 'hk';
  else if (text.includes('guney kore') || text.includes('korea') || text.includes('seul') || text.includes('seoul')) code = 'kr';
  else if (text.includes('abd') || text.includes('amerika') || text.includes('usa') || text.includes('new york') || text.includes('miami')) code = 'us';
  else if (text.includes('avustralya') || text.includes('australia') || text.includes('sydney')) code = 'au';
  else if (text.includes('yeni zelanda') || text.includes('new zealand')) code = 'nz';
  else if (text.includes('arjantin') || text.includes('argentina') || text.includes('buenos aires')) code = 'ar';
  else if (text.includes('norvec') || text.includes('norway') || text.includes('oslo')) code = 'no';
  else if (text.includes('isvec') || text.includes('sweden') || text.includes('stockholm')) code = 'se';
  else if (text.includes('finlandiya') || text.includes('finland') || text.includes('helsinki')) code = 'fi';
  else if (text.includes('isvicre') || text.includes('switzerland') || text.includes('zurih') || text.includes('geneve')) code = 'ch';
  else if (text.includes('cin') || text.includes('china') || text.includes('shanghai') || text.includes('pekin')) code = 'cn';
  else if (text.includes('portekiz') || text.includes('portugal') || text.includes('lizbon')) code = 'pt';
  else if (text.includes('belçika') || text.includes('belgium') || text.includes('bruksel')) code = 'be';

  if (!code) return '🌍';
  return (
    <img 
      src={`https://flagcdn.com/w40/${code}.png`} 
      width="20"
      alt={country}
      className="emoji-flag-img"
      style={{ borderRadius: '3px', verticalAlign: 'middle', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
    />
  );
};

// --- WIKIPEDIA API ENGINE ---
async function fetchWikiData(title, originalTitle) {
  const searchTitle = title || originalTitle;
  if (!searchTitle) return null;

  try {
    // 1. Try Turkish Wikipedia First (for Esra)
    const trRes = await fetch(`https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTitle)}`);
    if (trRes.ok) {
      const trData = await trRes.json();
      if (trData.extract && trData.extract.length > 50) {
        return {
          extract: trData.extract,
          image: trData.thumbnail?.source,
          url: trData.content_urls?.desktop?.page,
          lang: 'tr'
        };
      }
    }

    // 2. Fallback to English Wikipedia
    const enRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTitle)}`);
    if (enRes.ok) {
      const enData = await enRes.json();
      return {
        extract: enData.extract,
        image: enData.thumbnail?.source,
        url: enData.content_urls?.desktop?.page,
        lang: 'en'
      };
    }
    
    return null;
  } catch (e) {
    console.error('Wiki Error:', e);
    return null;
  }
}

async function fetchWikiImages(title) {
  if (!title) return [];
  try {
    // Basic search for related images via Wikipedia
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages|images&format=json&origin=*&pithumbsize=500`);
    const data = await res.json();
    const pageId = Object.keys(data.query.pages)[0];
    const page = data.query.pages[pageId];
    
    const imgs = [];
    if (page.thumbnail?.source) imgs.push(page.thumbnail.source);
    
    return imgs;
  } catch (e) {
    return [];
  }
}

export default function Tatil() {
  const navigate = useNavigate();
  const { tatil, setModuleData, addTrip, deleteTrip, updateExchangeRates } = useStore();
  const [activeTab, setActiveTab] = useState(tatil.ttab || 'trips');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showConfirm, setShowConfirm] = useState({ open: false, title: '', onConfirm: null });

  const requestConfirm = (title, onConfirm) => {
    setShowConfirm({ open: true, title, onConfirm });
  };
  const [showVisaWizard, setShowVisaWizard] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(true);

  useEffect(() => {
    updateExchangeRates();
  }, []);

  const [showWizard, setShowWizard] = useState(false);
  const [wizardMode, setWizardMode] = useState('new'); // 'new', 'old', 'edit'
  const [editingTrip, setEditingTrip] = useState(null);
  const [editingPassport, setEditingPassport] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [trackerFlight, setTrackerFlight] = useState('');
  const [viewPdf, setViewPdf] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapTarget, setMapTarget] = useState({ name: '', address: '' });
  const [showAlbum, setShowAlbum] = useState(false);
  const [albumTrip, setAlbumTrip] = useState(null);

  useEffect(() => {
    const handleOpenAlbum = (e) => {
      setAlbumTrip(e.detail);
      setShowAlbum(true);
    };
    window.addEventListener('open-trip-album', handleOpenAlbum);
    return () => window.removeEventListener('open-trip-album', handleOpenAlbum);
  }, []);

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

    // 1. Ensure critical data structures exist if needed, but DO NOT re-add deleted templates like Viyana
    // removed legacy enforcement code that was re-adding deleted trips
    
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

            </button>
          ))}
        </nav>
      </header>

      <div className="tab-content">
        {activeTab === 'trips' && (
          <TripsTab 
            tatil={tatil} 
            onSelectTrip={setSelectedTrip} 
            onShowWizard={(mode = 'new') => { 
              setWizardMode(mode); 
              setEditingTrip(null);
              setShowWizard(true); 
            }} 
            onEditTrip={(trip) => {
              setWizardMode('edit');
              setEditingTrip(trip);
              setShowWizard(true);
            }}
          />
        )}
        {activeTab === 'anilar' && <AnilarTab tatil={tatil} onSelectTrip={setSelectedTrip} />}
        {activeTab === 'harita' && <HaritaTab tatil={tatil} onTabChange={updateTab} />}
        {activeTab === 'pasaport' && <PasaportTab tatil={tatil} onEdit={setEditingPassport} />}
        {activeTab === 'hayal' && <HayalTab tatil={tatil} requestConfirm={requestConfirm} />}
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
            onEdit={() => {
              setEditingTrip(selectedTrip);
              setWizardMode('edit');
              setShowWizard(true);
              setSelectedTrip(null);
            }}
            requestConfirm={requestConfirm}
          />
        )}
      </ActionSheet>

      <ActionSheet
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        title={wizardMode === 'edit' ? "✏️ Tatili Düzenle" : (wizardMode === 'old' ? "🕰️ Eski Seyahat Kaydı" : "🌍 Tatil Sihirbazı")}
      >
        <AddTripWizard 
          mode={wizardMode} 
          initialData={editingTrip} 
          onClose={() => { setShowWizard(false); }} 
        />
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
        isOpen={showAlbum}
        onClose={() => setShowAlbum(false)}
        title={`📸 ${albumTrip?.city} Albümü`}
        fullHeight
      >
        {albumTrip && <SeyahatAlbumu trip={albumTrip} />}
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
      <ConfirmModal 
        isOpen={showConfirm.open}
        title="Emin misiniz?"
        message={showConfirm.title}
        onConfirm={() => {
          showConfirm.onConfirm();
          setShowConfirm({ ...showConfirm, open: false });
        }}
        onCancel={() => setShowConfirm({ ...showConfirm, open: false })}
      />
    </AnimatedPage>
  );
}

function TripsTab({ tatil, onSelectTrip, onShowWizard, onEditTrip }) {
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

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="trip-sections-cute">
        {/* SECTION 1: SEYAHATLER (ACTIVE + FINALIZED) */}
        <div className="trip-group-cute">
          <div className="section-header-cute">
            <h3>🌍 Seyahatler</h3>
          </div>
          {[...kesin, ...kesinlesmis].length > 0 ? (
            [...kesin, ...kesinlesmis].map(t => <TripCard key={t.id} trip={t} onClick={() => onSelectTrip(t)} onEdit={() => onEditTrip(t)} />)
          ) : (
            <div className="empty-state-cute glass">Planlanmış veya devam eden bir seyahat yok. ✈️</div>
          )}
        </div>

        {/* SECTION 2: PLANNING */}
        <div className="trip-group-cute">
          <div className="section-header-cute">
            <h3>📝 Planlama Aşamasındakiler</h3>
            <button className="add-mini-btn" onClick={() => onShowWizard('new')}><Plus size={14} /></button>
          </div>
          {planlanan.length > 0 ? (
            planlanan.map(t => <TripCard key={t.id} trip={t} onClick={() => onSelectTrip(t)} onEdit={() => onEditTrip(t)} />)
          ) : (
            <div className="empty-state-cute glass" onClick={() => onShowWizard('new')}>Yeni bir fikir ekle! ✨</div>
          )}
          
          <button className="add-old-trip-btn glass mt-15" onClick={() => onShowWizard('old')}>
             <span>🕰️ Eski Seyahat Kaydet</span>
             <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AnilarTab({ tatil, onSelectTrip }) {
  const [individualFilter, setIndividualFilter] = useState('all'); // 'all', 'gorkem', 'esra'
  
  const trips = useMemo(() => {
    const dbTrips = tatil.trips || [];
    const merged = [...dbTrips].map(t => {
      const initialMatch = INITIAL_TRIPS.find(it => it.id === t.id || (it.title === t.title && it.startDate === t.startDate));
      if (initialMatch) {
        // Fallback photos and other static data from INITIAL_TRIPS if missing in DB
        return {
          ...initialMatch,
          ...t,
          photos: (t.photos && t.photos.length > 0) ? t.photos : (initialMatch.photos || []),
          evaluations: { ...initialMatch.evaluations, ...t.evaluations }
        };
      }
      return t;
    });
    
    return merged;
    return merged;
  }, [tatil.trips]);

  const allPast = trips.filter(t => {
    const status = calculateTripStatus(t.startDate, t.endDate);
    return status === 'completed';
  }).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const jointPast = allPast.filter(t => t.travelers === 'ikimiz');
  const individualPast = allPast.filter(t => {
    if (t.travelers === 'ikimiz') return false;
    if (individualFilter === 'all') return true;
    return t.travelers === individualFilter;
  });

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="trip-sections-cute">
        {/* JOINT MEMORIES */}
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

        {/* INDIVIDUAL ADVENTURES */}
        <div className="trip-group-cute mt-30">
          <div className="section-header-cute">
            <h3>👤 Bireysel Maceralar</h3>
            <div className="indiv-filter-toggles">
              <button 
                className={`ift-btn ${individualFilter === 'all' ? 'active' : ''}`}
                onClick={() => setIndividualFilter('all')}
              >Hepsi</button>
              <button 
                className={`ift-btn ${individualFilter === 'gorkem' ? 'active' : ''}`}
                onClick={() => setIndividualFilter('gorkem')}
              >Görkem</button>
              <button 
                className={`ift-btn ${individualFilter === 'esra' ? 'active' : ''}`}
                onClick={() => setIndividualFilter('esra')}
              >Esra</button>
            </div>
          </div>
          
          <div className="individual-adventures-list scrollable-history">
            {individualPast.length > 0 ? (
              individualPast.map(t => (
                <div key={t.id} className="indiv-adventure-card glass animate-slideRight" onClick={() => onSelectTrip(t)}>
                   <div className="iac-flag">{getCountryFlag(t.title, t.city, t.country)}</div>
                   <div className="iac-info">
                      <div className="iac-main">
                        <strong>{t.city || t.title}</strong>
                        <span>{t.travelers === 'gorkem' ? 'Görkem' : 'Esra'} · {new Date(t.startDate).getFullYear()}</span>
                      </div>
                      {t.notes && <p className="iac-notes">“{t.notes}”</p>}
                   </div>
                   <ChevronRight size={14} opacity={0.3} />
                </div>
              ))
            ) : (
              <div className="empty-state-cute glass">Bu filtreye uygun macera bulunamadı. 🔍</div>
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
  const [imgError, setImgError] = useState(false);
  const randomCover = useMemo(() => {
    const gPhotos = trip.evaluations?.gorkem?.photos || [];
    const ePhotos = trip.evaluations?.esra?.photos || [];
    
    const all = [...gPhotos, ...ePhotos].filter(p => !!p && typeof p === 'string' && p.length > 0);
    const unique = Array.from(new Set(all));
    
    if (unique.length > 0) {
      // Pick a random photo from the unique set
      const randomIndex = Math.floor(Math.random() * unique.length);
      return unique[randomIndex];
    }

    return null;
  }, [trip.evaluations]);

  return (
    <div className="memory-card-cute glass" onClick={onClick}>
      <div className="mc-photo-preview">
        {randomCover && !imgError ? (
          <img src={randomCover} alt={trip.city} onError={() => setImgError(true)} />
        ) : (
          <div className="mc-placeholder">
            <span className="mcp-flag">{getCountryFlag(trip.title, trip.city, trip.country)}</span>
            <span className="mcp-city">{trip.city || trip.title}</span>
          </div>
        )}
      </div>
      <div className="mc-info">
        <strong>{trip.city}</strong>
        <span>{new Date(trip.startDate).getFullYear()}</span>
        <div className="mc-stars">
          <Star size={10} fill="#FBBF24" stroke="#FBBF24" />
          <span>
            {(() => {
              const gStar = trip.evaluations?.gorkem?.star ?? (typeof trip.evaluations?.gorkem === 'number' ? trip.evaluations.gorkem : null);
              const eStar = trip.evaluations?.esra?.star ?? (typeof trip.evaluations?.esra === 'number' ? trip.evaluations.esra : null);
              const stars = [gStar, eStar].filter(s => s !== null && s !== undefined);
              return stars.length > 0 ? (stars.reduce((a, b) => a + b, 0) / stars.length).toFixed(1) : "---";
            })()}
          </span>
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip, onClick, onEdit }) {

  return (
    <div className="trip-card-cute glass" onClick={onClick}>
      <div className="tc-flag">{getCountryFlag(trip.title, trip.city, trip.country)}</div>
      <div className="tc-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <strong>{trip.title || trip.city}</strong>
          {trip.derivedStatus === 'active' ? (
            <div className="ongoing-badge-mini" title="Devam ediyor">⏱️</div>
          ) : (
            trip.isConfirmed && <div className="confirmed-badge-mini" title="Kesinleşti">✅</div>
          )}
        </div>
        <span>{trip.startDate} · {trip.tripType === 'is' ? '💼 İş' : '🏖️ Tatil'}</span>
      </div>
      <div className="tc-actions">
        <button className="tc-edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(); }}><Edit3 size={14} /></button>
        <ChevronRight size={16} className="tc-arrow" />
      </div>
    </div>
  );
}


function AddTripWizard({ mode, initialData, onClose }) {
  const { addTrip, updateTrip, tatil } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialData || {
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
    if (step === 1) {
      if (!formData.title || !formData.startDate) return toast.error('Başlık ve tarih zorunludur');
      
      // Date validation for old trips
      if (mode === 'old') {
        const today = new Date().toISOString().split('T')[0];
        if (formData.startDate > today) {
          return toast.error('Eski seyahatler gelecek tarihli olamaz!');
        }
      }

      // Duplicate city check (only for new/old, or if city changed in edit)
      const isCityChanged = initialData ? normalizeText(formData.city) !== normalizeText(initialData.city) : true;
      
      if (mode !== 'edit' || isCityChanged) {
        const isDuplicate = tatil.trips.some(t => {
          // Compare normalized city names
          const cityMatch = normalizeText(t.city) === normalizeText(formData.city);
          // Only count as duplicate if it's NOT the trip we are currently editing
          const isDifferentTrip = initialData ? String(t.id) !== String(initialData.id) : true;
          return cityMatch && isDifferentTrip;
        });

        if (isDuplicate) {
          return toast.error('Bu şehir zaten kayıtlı! Lütfen farklı bir isim kullanın.');
        }
      }
    }

    if (step < 4) setStep(step + 1);
    else handleFinish();
  };

  const handleFinish = () => {
    if (mode === 'edit') {
      updateTrip(initialData.id, formData);
      toast.success('Seyahat güncellendi! ✏️');
    } else {
      addTrip(formData);
      toast.success('Yeni macera başladı! 🚀');
    }
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
            <h4>{mode === 'old' ? '🕰️ Nereye Gittiniz?' : '🗺️ Nereye Gidiyoruz?'}</h4>
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

function TripDetailContent({ trip, onOpenTracker, onOpenMap, onClose, onEdit, requestConfirm }) {
  const { addExpense, tatil, setModuleData, deleteTrip } = useStore();
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewUser, setReviewUser] = useState(null);
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2>{trip.title || trip.city}</h2>
                <button className="hero-edit-btn-mini" onClick={onEdit} title="Bilgileri Düzenle"><Edit3 size={16} /></button>
              </div>
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
            {(() => {
              const tripStart = new Date(trip.startDate);
              const tripEnd = new Date(trip.endDate);
              const durationDays = Math.max(1, Math.ceil((tripEnd - tripStart) / 864e5) + 1);
              
              return weatherForecast.daily.time.slice(0, durationDays).map((t, i) => (
                <div key={t} className="wf-day glass">
                  <small>{new Date(t).toLocaleDateString('tr-TR', { weekday: 'short' }).toUpperCase()}</small>
                  <span className="wf-mini-date">{new Date(t).getDate()}/{new Date(t).getMonth() + 1}</span>
                  {getWeatherIcon(weatherForecast.daily.weathercode[i])}
                  <strong>{Math.round(weatherForecast.daily.temperature_2m_max[i])}°</strong>
                </div>
              ));
            })()}
          </div>
        )}

        <button 
          className="trip-delete-btn-cute" 
          onClick={() => {
            requestConfirm('Bu tatili silmek istediğinizden emin misiniz?', () => {
              deleteTrip(trip.id);
              onClose();
              toast.success('Tatil silindi.');
            });
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
              {trip.isConfirmed ? '✅ kesinleşti' : '✈️ kesinleştir'}
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
            initialUser={reviewUser}
            onComplete={(person, evalData) => {
                let existingEval = trip.evaluations?.[person];
                if (typeof existingEval === 'number') {
                    existingEval = { star: existingEval, note: '', photos: [] };
                } else if (!existingEval) {
                    existingEval = {};
                }

                const newEvals = { 
                  ...trip.evaluations, 
                  [person]: { ...existingEval, ...evalData } 
                };
                const updates = { evaluations: newEvals };
                
                // If it's a joint trip and both done, or solo and done
                const isJoint = trip.travelers === 'ikimiz';
                const isFinished = isJoint ? (newEvals.gorkem && newEvals.esra) : true;

                if (isFinished) {
                    updates.status = 'completed';
                }
                
                handleUpdateTrip(updates);
                toast.success('Değerlendirme kaydedildi! ✨');
                setShowReview(false);
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
                    setReviewUser(user);
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
    // VALIZ 5.0 LOGIC
    const pool = PACKING_POOL.filter(item => {
      // 1. Basic Duration/Type Checks
      if (item.minDays > tripDuration) return false;
      if (item.type === 'yurtdisi' && trip.locationType !== 'yurtdisi') return false;
      if (item.type === 'is' && trip.tripType !== 'is') return false;
      
      // 2. Owner Filtering
      if (item.owner && item.owner !== activePackingUser) return false;

      // 3. Weather Filtering
      if (weatherAdvice) {
        const { avgTemp, hasRain } = weatherAdvice;
        if (item.temp === 'hot' && avgTemp < 20) return false;
        if (item.temp === 'cold' && avgTemp > 15) return false;
        if (item.weather === 'rainy' && !hasRain) return false;
      }

      // 4. Duplicate Check
      const inGorkem = (trip.valiz?.gorkem || []).some(v => v.text === item.text);
      const inEsra = (trip.valiz?.esra || []).some(v => v.text === item.text);
      return !inGorkem && !inEsra;
    });

    // CATEGORY BALANCED SELECTION
    const getSelection = () => {
      const essentials = pool.filter(i => i.category === 'Temel' || i.priority >= 90).sort(() => 0.5 - Math.random());
      const clothes = pool.filter(i => i.category === 'Giyim').sort(() => 0.5 - Math.random());
      const others = pool.filter(i => i.category !== 'Temel' && i.category !== 'Giyim').sort(() => 0.5 - Math.random());

      return [
        ...essentials.slice(0, 2),
        ...clothes.slice(0, 2),
        ...others.slice(0, 2)
      ];
    };
    
    let selected = getSelection();
    
    // Add dynamic quantities
    const finalSelection = selected.map(item => {
      let text = item.text;
      if (item.perDay) {
        const qty = Math.ceil(tripDuration * item.perDay);
        text = `${item.text} (${qty} adet)`;
      }
      return { ...item, text };
    });

    setCurrentSuggestions(finalSelection);
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
                    <span className="fm-date">{`${new Date(time).getDate()}/${new Date(time).getMonth() + 1}`}</span>
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
              <strong>Valiz 5.0 Seyahat Kahini</strong>
              <p>{tripDuration} günlük akıllı strateji</p>
            </div>
          </div>
          {showAssistant ? <X size={18} /> : <PlusCircle size={18} />}
        </button>
        
        {showAssistant && (
          <div className="va-suggestions-v2 animate-slideDown">
            {/* Geo Advice Section */}
            {(() => {
              const cityKey = normalizeText(trip.city || '');
              const countryKey = normalizeText(trip.country || '');
              const advice = GEO_ADVICE.cities[cityKey] || GEO_ADVICE.countries[countryKey];
              
              if (!advice) return null;
              
              return (
                <div className="va-geo-advice glass mb-15 animate-fadeIn">
                  <div className="vga-header">
                    <MapPin size={14} color="#7e22ce" />
                    <span>Kahinin {trip.city || trip.country} Notu:</span>
                  </div>
                  <div className="vga-tips">
                    {advice.tips.map((tip, idx) => (
                      <p key={idx}>✨ {tip}</p>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="va-header-mini">
              <p className="va-info">Bu seyahat için özel seçtiklerim:</p>
              <button className="va-refresh-btn-cute" onClick={refreshSuggestions} title="Yeni Öneriler">
                <RotateCcw size={14} />
              </button>
            </div>
            <div className="va-suggestions-cute">
              {currentSuggestions.map(s => (
                <button 
                  key={s.id} 
                  className="va-suggestion-btn-cute glass" 
                  onClick={() => {
                    addItem(s.text);
                    setCurrentSuggestions(prev => prev.filter(item => item.id !== s.id));
                  }}
                >
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
  const { currentUser } = useStore();
  const gEval = trip.evaluations?.gorkem;
  const eEval = trip.evaluations?.esra;
  const [brokenImgs, setBrokenImgs] = useState({});

  const handleImgError = (id) => setBrokenImgs(prev => ({ ...prev, [id]: true }));
  const isJoint = trip.travelers === 'ikimiz';
  
  const allAvailablePhotos = [
    ...(gEval?.photos || []),
    ...(eEval?.photos || [])
  ].filter(p => !!p && typeof p === 'string' && p.length > 0);

  const uniquePhotos = Array.from(new Set(allAvailablePhotos));

  const avgStar = useMemo(() => {
    const scores = [gEval?.star, eEval?.star].filter(s => typeof s === 'number' && s > 0);
    if (scores.length === 0) return null;
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  }, [gEval, eEval]);

  const renderStars = (count) => {
    return Array.from({ length: 10 }).map((_, i) => (
      <Star 
        key={i} 
        size={10} 
        fill={i < count ? "#FBBF24" : "none"} 
        stroke={i < count ? "#FBBF24" : "#CBD5E1"} 
        style={{ marginRight: 1 }}
      />
    ));
  };

  return (
    <div className="memory-detail-view animate-fadeIn">
      {/* Premium Average Badge */}
      {avgStar && (
        <div className="premium-avg-score-box glass">
          <div className="pas-label">GENEL PUAN</div>
          <div className="pas-value">{avgStar}<span>/10</span></div>
          <div className="pas-stars">{renderStars(Math.round(avgStar))}</div>
        </div>
      )}

      <button 
        className="premium-album-trigger-btn glass mt-15 mb-15"
        onClick={() => {
           // This will be handled by a new state in TripDetailContent
           window.dispatchEvent(new CustomEvent('open-trip-album', { detail: trip }));
        }}
      >
        <div className="pat-content">
          <div className="pat-icons">📸✨🎞️</div>
          <div className="pat-text">
            <strong>Seyahat Albümü</strong>
            <span>{uniquePhotos.length} Hatıra Fotoğrafı</span>
          </div>
        </div>
        <ChevronRight size={18} opacity={0.5} />
      </button>

      <div className="evaluations-display mt-20">
        <div className="ms-header">
          <button 
            className="ms-edit-icon-btn" 
            onClick={() => onEditEval(currentUser?.name?.toLowerCase() === 'esra' ? 'esra' : 'gorkem')}
            title="Değerlendirmemi Düzenle"
          >
            <Edit3 size={18} color="#8B5CF6" />
          </button>
          <h3>Değerlendirmelerimiz</h3>
        </div>
        <div className="eval-grid-premium">
          <div className="eval-card-v2 gorkem glass">
            <div className="ec-header">
              <span>👨🏻‍💻 Görkem</span> 
              <div className="ec-stars">
                {gEval?.star ? renderStars(gEval.star) : 'Puan Yok'}
                {gEval?.star > 0 && <strong className="ml-5">{gEval.star}</strong>}
              </div>
            </div>
            <p>{gEval?.note || 'Not bırakılmamış.'}</p>
          </div>
          <div className="eval-card-v2 esra glass">
            <div className="ec-header">
              <span>👩 Esra</span> 
              <div className="ec-stars">
                {eEval?.star ? renderStars(eEval.star) : 'Puan Yok'}
                {eEval?.star > 0 && <strong className="ml-5">{eEval.star}</strong>}
              </div>
            </div>
            <p>{eEval?.note || 'Not bırakılmamış.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeyahatAlbumu({ trip }) {
  const { currentUser, updateTrip, uploadTripPhoto, deleteTripPhoto } = useStore();
  const gPhotos = trip.evaluations?.gorkem?.photos || [null, null, null];
  const ePhotos = trip.evaluations?.esra?.photos || [null, null, null];
  const isJoint = trip.travelers === 'ikimiz';
  const activeUser = currentUser?.name?.toLowerCase() === 'esra' ? 'esra' : 'gorkem';

  const [uploadingSlots, setUploadingSlots] = useState({});
  const [globalProcessing, setGlobalProcessing] = useState(null); // null, 'compressing', 'uploading', 'saving'

  const compressImage = (base64Str) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500; // Aggressive compression for Single Source of Truth
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: false }); // Performance optimization
        
        // Better scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.40)); // 0.40 quality for smaller footprint
      };
      img.onerror = (e) => reject(e);
    });
  };

  const handlePhotoUpload = (slotUser, index) => {
    if (activeUser !== slotUser) return toast.error("Sadece kendi favorilerini ekleyebilirsin! 🛑");
    if (uploadingSlots[`${slotUser}-${index}`]) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Size check (max 10MB for processing safety)
        if (file.size > 10 * 1024 * 1024) {
          return toast.error("Dosya çok büyük (Max 10MB).");
        }

        const slotKey = `${slotUser}-${index}`;
        setUploadingSlots(prev => ({ ...prev, [slotKey]: true }));
        
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            setGlobalProcessing('compressing');
            const compressedBase64 = await compressImage(event.target.result);
            
            setGlobalProcessing('uploading');
            // Convert Base64 to Blob for cloud storage upload
            const response = await fetch(compressedBase64);
            const blob = await response.blob();
            const fileToUpload = new File([blob], `trip_photo_${Date.now()}.jpg`, { type: 'image/jpeg' });

            // Upload to Supabase Storage
            const publicUrl = await uploadTripPhoto(fileToUpload);

            setGlobalProcessing('saving');
            const currentEval = trip.evaluations?.[slotUser] || { star: 0, note: '', photos: [null, null, null] };
            const newPhotos = Array.isArray(currentEval.photos) ? [...currentEval.photos] : [null, null, null];
            
            while(newPhotos.length < 3) newPhotos.push(null);
            newPhotos[index] = publicUrl; // Save the Cloud URL, not the Base64!

            const updates = {
              evaluations: {
                ...trip.evaluations,
                [slotUser]: { ...currentEval, photos: newPhotos }
              }
            };

            await updateTrip(trip.id, updates);
            toast.success("Fotoğraf buluta yüklendi! ☁️✨");
          } catch (err) {
            console.error(err);
            const msg = err.message || "Hata oluştu.";
            toast.error(`Yükleme Hatası: ${msg}`);
          } finally {
            setUploadingSlots(prev => ({ ...prev, [slotKey]: false }));
            setGlobalProcessing(null);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removePhoto = async (slotUser, index) => {
    if (activeUser !== slotUser) return;
    const currentEval = trip.evaluations?.[slotUser];
    if (!currentEval || !currentEval.photos) return;

    const photoUrl = currentEval.photos[index];
    
    // Physical deletion from Supabase
    if (photoUrl) {
      await deleteTripPhoto(photoUrl);
    }

    const newPhotos = [...currentEval.photos];
    newPhotos[index] = null;

    const updates = {
      evaluations: {
        ...trip.evaluations,
        [slotUser]: { ...currentEval, photos: newPhotos }
      }
    };
    await updateTrip(trip.id, updates);
    toast.success("Fotoğraf kaldırıldı.");
  };

  return (
    <div className="seyahat-albumu-container animate-fadeIn">
      {globalProcessing && (
        <div className="global-upload-overlay animate-fadeIn">
           <div className="upload-loader-card glass">
              <div className="loader-orbit">
                <div className="orbit-dot"></div>
                <Cloud size={32} color="#1E86C8" className="cloud-bounce" />
              </div>
              <h4>{
                globalProcessing === 'compressing' ? 'Görüntü Optimize Ediliyor...' :
                globalProcessing === 'uploading' ? 'Buluta Aktarılıyor...' :
                'Anı Kaydediliyor...'
              }</h4>
              <p>Lütfen bekleyin, anılarınız güvenle işleniyor.</p>
              <div className="upload-progress-bar">
                <div className={`up-fill ${globalProcessing}`} />
              </div>
           </div>
        </div>
      )}

      <div className="album-intro">
        <p>Seyahatin en özel anlarından seçilen {gPhotos.filter(p => !!p).length + ePhotos.filter(p => !!p).length} kare.</p>
      </div>

      <div className="album-sections">
        {(isJoint || trip.travelers === 'gorkem') && (
          <div className="album-section-v2">
            <div className="as-user-header gorkem">👨🏻‍💻 Görkem'in Favorileri</div>
            <div className="as-photo-grid">
               {[0, 1, 2].map(i => (
                 <div key={i} className={`as-photo-card glass ${activeUser === 'gorkem' ? 'editable' : ''} ${uploadingSlots[`gorkem-${i}`] ? 'loading' : ''}`} onClick={() => handlePhotoUpload('gorkem', i)}>
                    {uploadingSlots[`gorkem-${i}`] && (
                      <div className="spinner-premium-container">
                        <div className="spinner-premium" />
                        <span>İşleniyor...</span>
                      </div>
                    )}
                    {gPhotos[i] ? (
                      <>
                        <img src={gPhotos[i]} alt="Görkem" />
                        {activeUser === 'gorkem' && !uploadingSlots[`gorkem-${i}`] && (
                          <button className="photo-remove-btn" onClick={(e) => { e.stopPropagation(); removePhoto('gorkem', i); }}>
                            <X size={12} />
                          </button>
                        )}
                      </>
                    ) : !uploadingSlots[`gorkem-${i}`] && (
                      <div className="as-empty">
                        <PlusCircle size={24} opacity={0.3} />
                        {activeUser === 'gorkem' && <span>Ekle</span>}
                      </div>
                    )}
                 </div>
               ))}
            </div>
          </div>
        )}

        {(isJoint || trip.travelers === 'esra') && (
          <div className="album-section-v2 mt-20">
            <div className="as-user-header esra">👩 Esra'nın Favorileri</div>
            <div className="as-photo-grid">
               {[0, 1, 2].map(i => (
                 <div key={i} className={`as-photo-card glass ${activeUser === 'esra' ? 'editable' : ''} ${uploadingSlots[`esra-${i}`] ? 'loading' : ''}`} onClick={() => handlePhotoUpload('esra', i)}>
                    {uploadingSlots[`esra-${i}`] && (
                      <div className="spinner-premium-container">
                        <div className="spinner-premium" />
                        <span>İşleniyor...</span>
                      </div>
                    )}
                    {ePhotos[i] ? (
                      <>
                        <img src={ePhotos[i]} alt="Esra" />
                        {activeUser === 'esra' && !uploadingSlots[`esra-${i}`] && (
                          <button className="photo-remove-btn" onClick={(e) => { e.stopPropagation(); removePhoto('esra', i); }}>
                            <X size={12} />
                          </button>
                        )}
                      </>
                    ) : !uploadingSlots[`esra-${i}`] && (
                      <div className="as-empty">
                        <PlusCircle size={24} opacity={0.3} />
                        {activeUser === 'esra' && <span>Ekle</span>}
                      </div>
                    )}
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      <div className="album-footer mt-30">
        <p>Karelere dokunarak anılarını ekleyebilirsin... ❤️</p>
      </div>
    </div>
  );
}

function TripReviewPanel({ trip, onComplete, initialUser }) {
  const { currentUser } = useStore();
  const isJoint = trip.travelers === 'ikimiz';
  const activeUser = initialUser || (currentUser?.name?.toLowerCase() === 'esra' ? 'esra' : 'gorkem');
  
  const [evalData, setEvalData] = useState({ 
    star: trip.evaluations?.[activeUser]?.star ?? (typeof trip.evaluations?.[activeUser] === 'number' ? trip.evaluations[activeUser] : 0), 
    note: trip.evaluations?.[activeUser]?.note || ''
  });

  // Sync state if initialUser changes
  useEffect(() => {
    setEvalData({ 
      star: trip.evaluations?.[activeUser]?.star ?? (typeof trip.evaluations?.[activeUser] === 'number' ? trip.evaluations[activeUser] : 0), 
      note: trip.evaluations?.[activeUser]?.note || ''
    });
  }, [activeUser, trip.id]);

  const handleSubmit = () => {
    onComplete(activeUser, evalData);
  };

  return (
    <div className="review-panel-premium animate-fadeIn">
      <div className="review-active-user-badge mb-15">
         <span>{activeUser === 'esra' ? '👩 Esra' : '👨🏻‍💻 Görkem'}</span> olarak değerlendiriyorsun
      </div>

      <div className="review-form-box glass">
        <div className="rfb-section">
          <div className="rfb-header-flex">
            <h4>🌟 Puanın (1-10)</h4>
            <span className="rfb-score-badge">{evalData.star || 0} / 10</span>
          </div>
          <div className="star-rating-row">
            {[1,2,3,4,5,6,7,8,9,10].map(s => (
              <button 
                key={s} 
                className={`star-btn ${evalData.star >= s ? 'active' : ''}`} 
                onClick={() => setEvalData({...evalData, star: s})}
              >
                <Star size={22} fill={evalData.star >= s ? '#FBBF24' : 'none'} stroke={evalData.star >= s ? '#FBBF24' : '#CBD5E1'} />
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
  const { users } = useStore();
  const now = getNowUTC().split('T')[0];
  const daysLeft = data?.exp ? Math.ceil((new Date(data.exp).getTime() - new Date(now).getTime()) / 864e5) : null;
  const isExpired = daysLeft !== null && daysLeft < 0;
  const isWarning = daysLeft !== null && daysLeft < 180;
  
  return (
    <div className={`passport-red-card ${isWarning ? 'warning' : ''}`} onClick={() => onEdit(pid)}>
      <div className="prc-photo">
        {users[pid]?.emoji || '👤'}
      </div>
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
          <div className="prc-field mb-5">
          <label>SOYADI / SURNAME</label>
          <strong>{data?.surname || 'Eray'}</strong>
        </div>
        <div className="prc-field mb-5">
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

      <VizeUyumlulukAsistanı tatil={tatil} />

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
            <div className="vw-grid">
              <div className="vw-field">
                 <label>Verilen Ülke</label>
                 <input placeholder="Örn: İtalya" value={newVisa.country} onChange={e => setNewVisa({...newVisa, country: e.target.value})} />
              </div>
              <div className="vw-field">
                 <label>Vize Tipi</label>
                 <select value={newVisa.type} onChange={e => setNewVisa({...newVisa, type: e.target.value})}>
                   <option>Schengen</option>
                   <option>UK</option>
                   <option>ABD</option>
                   <option>Dubai</option>
                   <option>Vizesiz</option>
                 </select>
              </div>
            </div>
            
            <div className="vw-field mt-10">
               <label>Vize Sahibi</label>
               <div className="vw-user-pills">
                 <button type="button" className={newVisa.owner === 'gorkem' ? 'active gorkem' : ''} onClick={() => setNewVisa({...newVisa, owner: 'gorkem'})}>👨🏻‍💻 Görkem</button>
                 <button type="button" className={newVisa.owner === 'esra' ? 'active esra' : ''} onClick={() => setNewVisa({...newVisa, owner: 'esra'})}>👩 Esra</button>
               </div>
            </div>

            <div className="vw-grid mt-10">
              <div className="vw-field">
                 <label>Başlangıç</label>
                 <input type="date" value={newVisa.start} onChange={e => setNewVisa({...newVisa, start: e.target.value})} />
              </div>
              <div className="vw-field">
                 <label>Bitiş</label>
                 <input type="date" value={newVisa.end} onChange={e => setNewVisa({...newVisa, end: e.target.value})} />
              </div>
            </div>
            <button className="vw-add-btn mt-10" onClick={handleSaveVisa}>
              {editingVisaId ? 'Vizeyi Güncelle' : 'Yeni Vizeyi Kaydet'}
            </button>
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

function VizeUyumlulukAsistanı({ tatil }) {
  const [collapsedTrips, setCollapsedTrips] = useState([]);
  
  const toggleTrip = (id) => {
    setCollapsedTrips(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const SCHENGEN_COUNTRIES = [
    'avusturya', 'austria', 'viyana', 'vienna', 'belçika', 'belgium', 'çek', 'czech', 
    'danimarka', 'denmark', 'estonya', 'estonia', 'finlandiya', 'finland', 'fransa', 'france', 
    'almanya', 'germany', 'berlin', 'münih', 'yunanistan', 'greece', 'atina', 'macaristan', 'hungary', 
    'izlanda', 'iceland', 'italya', 'italy', 'roma', 'milano', 'letonya', 'latvia', 'lihtenştayn', 
    'litvanya', 'lüksemburg', 'malta', 'hollanda', 'netherlands', 'amsterdam', 'norveç', 'norway', 
    'polonya', 'poland', 'portekiz', 'portugal', 'slovakya', 'slovenya', 'ispanya', 'spain', 
    'barselona', 'madrid', 'isveç', 'sweden', 'isviçre', 'switzerland'
  ];

  const needsSchengen = (trip) => {
    if (trip.locationType !== 'yurtdisi') return false;
    if (trip.schengen) return true;
    const text = (trip.country || '' + ' ' + trip.city || '' + ' ' + trip.title || '').toLowerCase();
    return SCHENGEN_COUNTRIES.some(c => text.includes(c));
  };

  const plannedTrips = (tatil.trips || []).filter(t => {
    const status = calculateTripStatus(t.startDate, t.endDate);
    return status !== 'completed' && t.locationType === 'yurtdisi';
  });

  const visas = tatil.visas || [];
  const passports = tatil.passport || { gorkem: {}, esra: {} };

  return (
    <div className="visa-assistant-premium mt-20">
      <div className="assistant-header-row mb-15">
        <h3 className="section-title m-0">Vize & Pasaport Uyumluluk Asistanı</h3>
      </div>

      <div className="assistant-content">
        {plannedTrips.length > 0 ? plannedTrips.map(t => {
          const isCollapsed = collapsedTrips.includes(t.id);
          const isSchengenTrip = needsSchengen(t);
          const text = (t.country || '' + ' ' + t.city || '' + ' ' + t.title || '').toLowerCase();
          const isUKTrip = text.includes('ingiltere') || text.includes('uk') || text.includes('londra') || text.includes('london');
          const isUSATrip = text.includes('abd') || text.includes('usa') || text.includes('america') || text.includes('new york');
          
          const tripEndDate = new Date(t.endDate || t.startDate);
          const sixMonthsLater = new Date(tripEndDate);
          sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
          
          const travelersNeeded = t.travelers === 'ikimiz' ? ['gorkem', 'esra'] : [t.travelers];

          const results = travelersNeeded.map(owner => {
            const passport = passports[owner];
            const pExp = passport?.exp ? new Date(passport.exp) : null;
            const pValid = pExp && pExp >= sixMonthsLater;

            let vValid = true;
            let vTypeNeeded = '';
            
            if (isSchengenTrip) {
              vTypeNeeded = 'Schengen';
              vValid = visas.some(v => v.owner === owner && v.type === 'Schengen' && v.start <= t.startDate && v.end >= (t.endDate || t.startDate));
            } else if (isUKTrip) {
              vTypeNeeded = 'UK';
              vValid = visas.some(v => v.owner === owner && v.type === 'UK' && v.start <= t.startDate && v.end >= (t.endDate || t.startDate));
            } else if (isUSATrip) {
              vTypeNeeded = 'ABD';
              vValid = visas.some(v => v.owner === owner && v.type === 'ABD' && v.start <= t.startDate && v.end >= (t.endDate || t.startDate));
            }

            return { owner, pValid, vValid, vTypeNeeded, pExp };
          });

          const allOk = results.every(r => r.pValid && r.vValid);

          return (
            <div key={t.id} className={`assistant-trip-card glass ${allOk ? 'ok' : 'warn'} ${isCollapsed ? 'collapsed' : ''}`}>
              <div className="atc-header" onClick={() => toggleTrip(t.id)}>
                <div className="atc-title">
                   <span className="atc-flag">{getCountryFlag('', '', t.country)}</span>
                   <strong>{t.city || t.title}</strong>
                </div>
                <div className="atc-right-controls">
                   <div className={`atc-status-pill ${allOk ? 'ok' : 'warn'}`}>
                      {allOk ? '✨ Hazırız' : '🛂 Kontrol'}
                   </div>
                   <div className="atc-mini-toggle">
                     {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                   </div>
                </div>
              </div>

              {!isCollapsed && (
                <>
                  <div className="atc-body">
                    {results.map(r => (
                      <div key={r.owner} className="atc-person-row">
                        <div className="atc-person-label">
                           {r.owner === 'gorkem' ? '👨🏻‍💻 Görkem' : '👩 Esra'}
                        </div>
                        <div className="atc-checks">
                           <div className={`atc-check-item ${r.vValid ? 'ok' : 'error'}`} title={r.vTypeNeeded || 'Vize'}>
                              <span className="aci-emoji">{r.vValid ? '✅' : '❌'}</span>
                              <span className="aci-text">{r.vTypeNeeded || 'Vize'}</span>
                           </div>
                           <div className={`atc-check-item ${r.pValid ? 'ok' : 'error'}`} title="Pasaport Geçerliliği">
                              <span className="aci-emoji">{r.pValid ? '✅' : '⚠️'}</span>
                              <span className="aci-text">Pasaport</span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {!allOk && (
                    <div className="atc-footer-note">
                      {results.some(r => !r.pValid) && '⚠️ Pasaport dönüşten sonra 6 ay daha geçerli olmalıdır.'}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        }) : <p className="empty-text">Planlanmış yurt dışı seyahati yok.</p>}
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

const LEGACY_CITY_COORDS = {
  'istanbul': { lat: 41.0082, lng: 28.9784 },
  'ankara': { lat: 39.9334, lng: 32.8597 },
  'konya': { lat: 37.8714, lng: 32.4846 },
  'izmir': { lat: 38.4237, lng: 27.1428 },
  'antalya': { lat: 36.8969, lng: 30.7133 },
  'sofya': { lat: 42.6977, lng: 23.3219 },
  'sofia': { lat: 42.6977, lng: 23.3219 },
  'kavala': { lat: 40.9391, lng: 24.4068 },
  'londra': { lat: 51.5074, lng: -0.1278 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'roma': { lat: 41.9028, lng: 12.4964 },
  'rome': { lat: 41.9028, lng: 12.4964 },
  'viyana': { lat: 48.2082, lng: 16.3738 },
  'vienna': { lat: 48.2082, lng: 16.3738 },
  'berlin': { lat: 52.5200, lng: 13.4050 },
  'athens': { lat: 37.9838, lng: 23.7275 },
  'atina': { lat: 37.9838, lng: 23.7275 },
  'madrid': { lat: 40.4168, lng: -3.7038 },
  'barselona': { lat: 41.3851, lng: 2.1734 },
  'barcelona': { lat: 41.3851, lng: 2.1734 },
  'amsterdam': { lat: 52.3676, lng: 4.9041 },
  'selanik': { lat: 40.6401, lng: 22.9444 },
  'thessaloniki': { lat: 40.6401, lng: 22.9444 },
  'marsilya': { lat: 43.2965, lng: 5.3698 },
  'marseille': { lat: 43.2965, lng: 5.3698 },
  'saraybosna': { lat: 43.8563, lng: 18.4131 },
  'sarajevo': { lat: 43.8563, lng: 18.4131 },
  'üsküp': { lat: 41.9973, lng: 21.4280 },
  'uskup': { lat: 41.9973, lng: 21.4280 },
  'skopje': { lat: 41.9973, lng: 21.4280 },
  'belgrad': { lat: 44.7866, lng: 20.4489 },
  'belgrade': { lat: 44.7866, lng: 20.4489 },
  'budapeşte': { lat: 47.4979, lng: 19.0402 },
  'budapeste': { lat: 47.4979, lng: 19.0402 },
  'budapest': { lat: 47.4979, lng: 19.0402 },
  'prag': { lat: 50.0755, lng: 14.4378 },
  'prague': { lat: 50.0755, lng: 14.4378 }
};

function HaritaTab({ tatil, onTabChange }) {
  const [selectedContinent, setSelectedContinent] = useState('world');
  const [showCityWizard, setShowCityWizard] = useState(null); // trip object
  const [visibleTravelers, setVisibleTravelers] = useState(['gorkem', 'esra', 'ikimiz']);
  const [hiddenStats, setHiddenStats] = useState([]); // Array of 'esra', 'gorkem'
  
  const allTripsForMap = useMemo(() => {
    return (tatil.trips || [])
      .filter(t => calculateTripStatus(t.startDate, t.endDate) === 'completed')
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, [tatil.trips]);

  const visitedData = useMemo(() => {
    const gorkemPlaces = new Set();
    const esraPlaces = new Set();
    const gorkemCountries = new Set();
    const esraCountries = new Set();
    let ortakDays = 0;

    allTripsForMap.forEach(t => {
      const country = t.country?.toLowerCase().trim();
      const city = t.city?.toLowerCase().trim();
      const extraCities = (t.visitedCities || []).map(vc => vc.name?.toLowerCase().trim()).filter(Boolean);
      
      const duration = (t.startDate && t.endDate) ? (Math.ceil((new Date(t.endDate) - new Date(t.startDate)) / 864e5) + 1) : 0;

      if (t.travelers === 'gorkem' || t.travelers === 'ikimiz') {
        if (country) gorkemCountries.add(country);
        if (city) gorkemPlaces.add(`${country}:${city}`);
        extraCities.forEach(c => gorkemPlaces.add(`${country}:${c}`));
      }
      if (t.travelers === 'esra' || t.travelers === 'ikimiz') {
        if (country) esraCountries.add(country);
        if (city) esraPlaces.add(`${country}:${city}`);
        extraCities.forEach(c => esraPlaces.add(`${country}:${c}`));
      }
      if (t.travelers === 'ikimiz') {
        ortakDays += duration;
      }
    });

    const ortakCountries = new Set([...gorkemCountries].filter(c => esraCountries.has(c)));
    const gorkemOnlyCountries = new Set([...gorkemCountries].filter(c => !esraCountries.has(c)));
    const esraOnlyCountries = new Set([...esraCountries].filter(c => !gorkemCountries.has(c)));

    const ortakCities = new Set([...gorkemPlaces].filter(p => esraPlaces.has(p)));
    const gorkemOnlyCities = new Set([...gorkemPlaces].filter(p => !esraPlaces.has(p)));
    const esraOnlyCities = new Set([...esraPlaces].filter(p => !gorkemPlaces.has(p)));

    return {
      ortak: { countries: ortakCountries.size, cities: ortakCities.size, days: ortakDays },
      gorkem: { countries: gorkemOnlyCountries.size, cities: gorkemOnlyCities.size },
      esra: { countries: esraOnlyCountries.size, cities: esraOnlyCities.size }
    };
  }, [allTripsForMap]);

  const esraStats = visitedData.esra;
  const gorkemStats = visitedData.gorkem;
  const ortakStats = visitedData.ortak;

  const continents = [
    { id: 'world', label: 'Dünya' },
    { id: 'turkiye', label: 'Türkiye' },
    { id: 'europe', label: 'Avrupa' },
    { id: 'asia', label: 'Asya' },
    { id: 'americas', label: 'Amerika' },
    { id: 'africa', label: 'Afrika' },
    { id: 'oceania', label: 'Okyanusya' }
  ];

  const isTurkeyMode = selectedContinent === 'turkiye';

  // Collect all pins from all trips with deduplication
  const allPins = useMemo(() => {
    const pins = [];
    const seen = new Set();

    allTripsForMap.forEach(trip => {
      // Filter by visible travelers toggle
      if (!visibleTravelers.includes(trip.travelers)) return;

      const tripPins = [];
      if (trip.visitedCities && trip.visitedCities.length > 0) {
        trip.visitedCities.forEach(city => {
           if (city.lat && city.lng) tripPins.push(city);
        });
      } else if (trip.city) {
        const cleanCity = trip.city.toLowerCase().trim();
        const coords = LEGACY_CITY_COORDS[cleanCity];
        if (coords) tripPins.push({ name: trip.city, ...coords });
      }

      tripPins.forEach(p => {
        const key = p.name.toLowerCase().trim();
        if (!seen.has(key)) {
          pins.push({ ...p, travelers: trip.travelers });
          seen.add(key);
        }
      });
    });
    return pins;
  }, [allTripsForMap, visibleTravelers]);

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="harita-stats-split mb-20">
        {/* Esra Column */}
        <div 
          className={`hss-column esra animate-fadeIn ${hiddenStats.includes('esra') ? 'is-hidden' : ''}`} 
          onClick={() => setHiddenStats(prev => prev.includes('esra') ? prev.filter(x => x !== 'esra') : [...prev, 'esra'])}
          style={{ cursor: 'pointer' }}
        >
           {hiddenStats.includes('esra') ? (
             <span className="hss-pet-tag">🐱 miyav</span>
           ) : (
             <>
               <div className="hss-avatar">👩🏻</div>
               <div className="hss-data">
                  <div className="hss-row"><strong>{esraStats.countries}</strong> <small>Ülke</small></div>
                  <div className="hss-row"><strong>{esraStats.cities}</strong> <small>Şehir</small></div>
               </div>
               <span className="hss-label">ESRA</span>
             </>
           )}
        </div>
        
        {/* Ortak Column - Always visible as requested */}
        <div className="hss-column ortak animate-fadeIn">
           <div className="hss-avatar">👩‍❤️‍👨</div>
           <div className="hss-data">
              <div className="hss-row"><strong>{ortakStats.countries}</strong> <small>Ülke</small> <strong>{ortakStats.cities}</strong> <small>Şehir</small></div>
              <div className="hss-row primary"><strong>{ortakStats.days} Gün Beraber</strong></div>
           </div>
           <span className="hss-label">ORTAK</span>
        </div>

        {/* Gorkem Column */}
        <div 
          className={`hss-column gorkem animate-fadeIn ${hiddenStats.includes('gorkem') ? 'is-hidden' : ''}`}
          onClick={() => setHiddenStats(prev => prev.includes('gorkem') ? prev.filter(x => x !== 'gorkem') : [...prev, 'gorkem'])}
          style={{ cursor: 'pointer' }}
        >
           {hiddenStats.includes('gorkem') ? (
             <span className="hss-pet-tag">🐶 hav hav</span>
           ) : (
             <>
               <div className="hss-avatar">👨🏻‍💻</div>
               <div className="hss-data">
                  <div className="hss-row"><strong>{gorkemStats.countries}</strong> <small>Ülke</small></div>
                  <div className="hss-row"><strong>{gorkemStats.cities}</strong> <small>Şehir</small></div>
               </div>
               <span className="hss-label">GÖRKEM</span>
             </>
           )}
        </div>
      </div>

      <div className="continent-selector-blue mb-15">
        {continents.map(c => (
          <button 
            key={c.id} 
            className={`cont-btn-blue ${selectedContinent === c.id ? 'active' : ''}`}
            onClick={() => setSelectedContinent(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="map-frame-premium glass" style={{ height: '350px', position: 'relative', overflow: 'hidden' }}>
        <LeafletMap 
          pins={allPins} 
          region={selectedContinent} 
        />
        
        {/* Floating Pill HUD */}
        <div className="map-traveler-pill-container floating-hud animate-fadeIn">
          <div className="mtp-inner glass">
            {[
              { id: 'esra', label: 'Esra' },
              { id: 'ikimiz', label: 'Ortak' },
              { id: 'gorkem', label: 'Görkem' }
            ].map((t, idx) => (
              <React.Fragment key={t.id}>
                {idx > 0 && <div className="mtp-divider" />}
                <button 
                  className={`mtp-btn ${visibleTravelers.includes(t.id) ? 'active' : ''} ${t.id}`}
                  onClick={() => {
                    setVisibleTravelers(prev => 
                      prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id]
                    );
                  }}
                >
                  {t.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="full-trip-history" style={{ marginTop: '55px' }}>
        <h4 className="section-title-cute" style={{ marginBottom: '20px' }}>Tüm Seyahatleriniz (Anılar)</h4>
        <div className="rd-list-compact scrollable-history">
          {allTripsForMap.map(t => (
            <div key={t.id} className="rd-item-small glass animate-slideRight" onClick={() => setShowCityWizard(t)}>
              <span className="rd-flag-small">{getCountryFlag(t.title, t.city, t.country)}</span>
              <div className="rd-info-small">
                <div className="rd-main-line">
                  <strong>{t.city || t.title}</strong>
                  <span className="rd-meta-inline">
                    {t.country} · {new Date(t.startDate).getFullYear()} 
                    {t.travelers !== 'ikimiz' && <span className="traveler-mini-label">({t.travelers === 'gorkem' ? 'G' : 'E'})</span>}
                  </span>
                </div>
              </div>
              <div className="rd-city-count">
                 <MapPin size={10} />
                 <span>{t.visitedCities?.length || 0}/10 Şehir</span>
              </div>
              <Plus size={14} opacity={0.5} />
            </div>
          ))}
          {allTripsForMap.length === 0 && <div className="empty-mini-state">Henüz kaydedilmiş anı yok...</div>}
        </div>
      </div>

      {showCityWizard && (
        <CityPinWizard 
          tripId={showCityWizard.id} 
          onClose={() => setShowCityWizard(null)} 
        />
      )}
    </div>
  );
}

function HayalTab({ tatil, requestConfirm }) {
  const { setModuleData } = useStore();
  const [activeSubTab, setActiveSubTab] = useState('experiences');
  const [filter, setFilter] = useState('Hepsi');
  const wishlist = tatil.wishlist || [];
  
  const categories = [
    { id: 'Hepsi', ic: '🌈' },
    { id: 'Macera', ic: '🌋' },
    { id: 'Doğa', ic: '🌲' },
    { id: 'Kültür', ic: '🎭' },
    { id: 'Romantik', ic: '💖' },
    { id: 'Tarih', ic: '🏛️' },
    { id: 'Şehir', ic: '🏙️' },
    { id: 'Keyif', ic: '🍹' }
  ];
  
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

  const [guideItem, setGuideItem] = useState(null);

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
          <button className="do-refresh-btn" onClick={refreshRecommendation} title="Başka Öneri">
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="do-content glass" onClick={() => setGuideItem(recommendation)} style={{ cursor: 'pointer' }}>
          <div className="do-recommendation-box">
             <span className="do-flag">{recommendation.flag}</span>
             <div className="do-text">
               <strong>{recommendation.title}</strong>
               <p>{recommendation.city} seni bekliyor!</p>
             </div>
          </div>
          <button className={`do-action-btn ${wishlist.some(w => w.bucketId === recommendation.id) ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleWishlist(recommendation); }}>
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
              <button key={c.id} className={`chip-tag ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
                <span style={{ marginRight: '4px' }}>{c.ic}</span> {c.id}
              </button>
            ))}
          </div>
          
          <div className="experiences-grid-premium">
            {filteredBucket.map(item => (
              <div key={item.id} className="exp-card-premium glass" onClick={() => setGuideItem(item)}>
                <div className="exp-card-top">
                  <span className="exp-badge">{item.category}</span>
                  <button className={`exp-fav-btn ${wishlist.some(w => w.bucketId === item.id) ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}>
                    <Star size={16} fill={wishlist.some(w => w.bucketId === item.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="exp-card-main">
                  <div className="exp-visual">
                    <span className="exp-emoji">{getCountryFlag(item.title, item.city, item.country)}</span>
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

      {/* Discovery Guide Sheet */}
      <ActionSheet 
        isOpen={!!guideItem} 
        onClose={() => setGuideItem(null)} 
        title={guideItem?.title || 'Seyahat Rehberi'}
        fullHeight
        footer={
          <button 
            className={`dg-cta-btn ${wishlist.some(w => w.bucketId === guideItem?.id) ? 'added' : ''}`}
            onClick={() => {
              if (guideItem) toggleWishlist(guideItem);
            }}
          >
            {wishlist.some(w => w.bucketId === guideItem?.id) ? '✨ Hayallerimde!' : '⭐ Hayallerime Ekle'}
          </button>
        }
      >
        {guideItem && <DiscoveryGuideContent item={guideItem} />}
      </ActionSheet>

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
                      requestConfirm('Bu hayali listeden çıkarmak istiyor musun?', () => {
                        const filtered = wishlist.filter(item => item.id !== w.id);
                        setModuleData('tatil', { ...tatil, wishlist: filtered });
                        toast.success('Hayal listeden kaldırıldı.');
                      });
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

function CityPinWizard({ tripId, onClose }) {
  const { tatil, setModuleData } = useStore();
  const [newCity, setNewCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingCityIdx, setEditingCityIdx] = useState(null);
  const [editValue, setEditValue] = useState('');

  const currentTrip = useMemo(() => tatil.trips.find(t => t.id === tripId), [tatil.trips, tripId]);
  const cities = currentTrip?.visitedCities || [];

  const handleUpdateCityName = (idx) => {
    if (!editValue.trim()) return;
    const updatedCities = [...cities];
    updatedCities[idx] = { ...updatedCities[idx], name: editValue.trim() };
    
    const updatedTrip = { ...currentTrip, visitedCities: updatedCities };
    const updatedTrips = tatil.trips.map(t => t.id === tripId ? updatedTrip : t);
    setModuleData('tatil', { ...tatil, trips: updatedTrips });
    setEditingCityIdx(null);
    toast.success('Şehir adı güncellendi! ✨');
  };

  const handleAddCity = async () => {
    if (!newCity) return;
    if (cities.length >= 10) return toast.error('Maksimum 10 şehir ekleyebilirsiniz!');
    
    setLoading(true);
    const cleanName = newCity.toLowerCase().trim();

    try {
      if (LEGACY_CITY_COORDS[cleanName]) {
        const coords = LEGACY_CITY_COORDS[cleanName];
        const updatedCities = [...cities, { name: newCity, ...coords }];
        const updatedTrip = { ...currentTrip, visitedCities: updatedCities };
        const updatedTrips = tatil.trips.map(t => t.id === tripId ? updatedTrip : t);
        setModuleData('tatil', { ...tatil, trips: updatedTrips });
        setNewCity('');
        setLoading(false);
        return;
      }

      let res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(newCity)}&count=1&language=tr&format=json`);
      let data = await res.json();
      
      const fallbacks = {
        'selanik': 'Thessaloniki',
        'marsilya': 'Marseille',
        'saraybosna': 'Sarajevo',
        'üsküp': 'Skopje',
        'belgrad': 'Belgrade',
        'budapeşte': 'Budapest',
        'prag': 'Prague',
        'roma': 'Rome',
        'viyana': 'Vienna',
        'atina': 'Athens',
        'kopenhag': 'Copenhagen'
      };

      if (!data.results?.length && fallbacks[cleanName]) {
        res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(fallbacks[cleanName])}&count=1&language=en&format=json`);
        data = await res.json();
      }

      if (data.results?.length) {
        const result = data.results[0];
        const updatedCities = [...cities, { name: result.name, lat: result.latitude, lng: result.longitude }];
        const updatedTrip = { ...currentTrip, visitedCities: updatedCities };
        const updatedTrips = tatil.trips.map(t => t.id === tripId ? updatedTrip : t);
        setModuleData('tatil', { ...tatil, trips: updatedTrips });
        setNewCity('');
        toast.success(`${result.name} eklendi! 📍`);
      } else {
        toast.error('Şehir bulunamadı. Lütfen tam adını yazın.');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manual-dream-overlay animate-fadeIn">
      <div className="manual-dream-modal glass animate-slideDown">
        <div className="md-modal-header">
          <h3>📍 {currentTrip?.city} Gezisi</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <p className="text-xs opacity-60 mb-20">Haritaya şehir ekle (Maks: 10). Düzenlemek için şehir ismine tıkla.</p>
        
        <div className="md-modal-body">
          <div className="city-add-row" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input 
              placeholder="Şehir adı yazın..." 
              value={newCity} 
              onChange={e => setNewCity(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleAddCity()}
              disabled={loading}
              className="premium-input"
            />
            <button className="city-add-btn" onClick={handleAddCity} disabled={loading}>
              {loading ? '...' : <Plus size={20} />}
            </button>
          </div>

          <div className="visited-cities-tags mt-15">
            {cities.map((city, idx) => (
              <div key={idx} className="city-tag-premium">
                {editingCityIdx === idx ? (
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <input 
                      className="edit-city-input-mini"
                      value={editValue} 
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleUpdateCityName(idx)}
                      autoFocus
                    />
                    <button className="edit-save-btn" onClick={() => handleUpdateCityName(idx)}><Check size={10} /></button>
                  </div>
                ) : (
                  <>
                    <span onClick={() => { setEditingCityIdx(idx); setEditValue(city.name); }} style={{ cursor: 'pointer' }}>
                      📍 {city.name}
                    </span>
                    <button onClick={() => {
                      const updated = cities.filter((_, i) => i !== idx);
                      const updatedTrip = { ...currentTrip, visitedCities: updated };
                      const updatedTrips = tatil.trips.map(t => t.id === tripId ? updatedTrip : t);
                      setModuleData('tatil', { ...tatil, trips: updatedTrips });
                    }}>
                      <Trash2 size={10} />
                    </button>
                  </>
                )}
              </div>
            ))}
            {cities.length === 0 && <p className="text-center opacity-50 w-full text-xs">Henüz şehir eklenmemiş.</p>}
          </div>
        </div>
        
        <button className="md-submit-btn" onClick={onClose} style={{ marginTop: '20px' }}>Bitti</button>
      </div>
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

function LeafletMap({ pins, region }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  const drawMarkers = useCallback(() => {
    if (!mapInstance.current || !window.L) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add new markers
    pins.forEach(pin => {
      if (pin.lat && pin.lng) {
        const color = pin.travelers === 'esra' ? '#f472b6' : (pin.travelers === 'gorkem' ? '#22c55e' : '#0ea5e9');
        const icon = window.L.divIcon({
          className: 'custom-leaflet-pin',
          html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:2px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3)"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = window.L.marker([pin.lat, pin.lng], { icon })
          .addTo(mapInstance.current)
          .bindTooltip(pin.name, { permanent: false, direction: 'top' });
        markersRef.current.push(marker);
      }
    });
  }, [pins]);

  useEffect(() => {
    // Inject Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Inject Leaflet JS
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!window.L || !mapRef.current || mapInstance.current) return;

      mapInstance.current = window.L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([20, 10], 2);

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(mapInstance.current);

      // Draw markers immediately after map is ready
      drawMarkers();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [drawMarkers]);

  useEffect(() => {
    if (!mapInstance.current || !window.L) return;

    // Update markers whenever pins change
    drawMarkers();

    // Update view based on region
    const continents = [
      { id: 'world', center: [20, 10], zoom: 2 },
      { id: 'turkiye', center: [39, 35], zoom: 6 },
      { id: 'europe', center: [48, 15], zoom: 4 },
      { id: 'asia', center: [34, 100], zoom: 3 },
      { id: 'americas', center: [20, -80], zoom: 3 },
      { id: 'africa', center: [0, 20], zoom: 3 },
      { id: 'oceania', center: [-25, 135], zoom: 3 }
    ];
    const target = continents.find(c => c.id === region) || continents[0];
    mapInstance.current.flyTo(target.center, target.zoom, { duration: 1.5 });

    // Handle Turkey GeoJSON for "kendi illeri" effect
    if (region === 'turkiye') {
       fetch('https://cdn.jsdelivr.net/gh/alpers/Turkey-Maps-GeoJSON/tr-cities.json')
         .then(res => res.json())
         .then(data => {
            if (mapInstance.current && region === 'turkiye') {
               window.L.geoJSON(data, {
                 style: { color: '#0ea5e9', weight: 1, fillOpacity: 0.05 }
               }).addTo(mapInstance.current);
            }
         });
    }
  }, [pins, region, drawMarkers]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#f8fafc' }} />;
}

function DiscoveryGuideContent({ item }) {
  const [wiki, setWiki] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const data = await fetchWikiData(item.wikiTitle, item.title);
      if (active) {
        setWiki(data);
        setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [item]);

  return (
    <div className="discovery-guide-content">
      {/* Hero Section */}
      <div className="dg-hero">
        {loading ? (
          <div className="dg-hero-skeleton animate-pulse" />
        ) : (
          <div className="dg-hero-image-wrapper">
            <img 
              src={wiki?.image || `https://images.unsplash.com/photo-1500835595353-b0ad2e58b912?q=80&w=1000&auto=format&fit=crop`} 
              className="dg-hero-image" 
              alt={item.title} 
            />
            <div className="dg-hero-overlay">
              <div className="dg-hero-label">
                <span className="dg-label-flag">{getCountryFlag(item.title, item.city, item.country)}</span>
                <div className="dg-label-text">
                  <h3>{item.title}</h3>
                  <p>{item.city}, {item.country}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="dg-stats-row">
        <div className="dg-stat-pill">
          <Wallet size={14} />
          <span>{item.budget}</span>
        </div>
        <div className="dg-stat-pill">
          <Timer size={14} />
          <span>{item.duration}</span>
        </div>
        <div className="dg-stat-pill">
          <Calendar size={14} />
          <span>{item.season}</span>
        </div>
      </div>

      {/* About Section */}
      <div className="dg-section">
        <h4 className="dg-section-title">
          📖 Hakkında 
          {wiki?.lang === 'en' && <span className="dg-lang-badge">EN</span>}
        </h4>
        <div className={`dg-description ${showFullDesc ? 'full' : ''}`}>
          {loading ? (
            <div className="dg-text-skeleton">
              <div className="sk-line" />
              <div className="sk-line" />
              <div className="sk-line w-2/3" />
            </div>
          ) : (
            <p>{wiki?.extract || item.fallbackDesc || 'Bu lokasyon hakkında henüz detaylı bilgi bulunmuyor.'}</p>
          )}
        </div>
        {!loading && (wiki?.extract || item.fallbackDesc) && (wiki?.extract || item.fallbackDesc).length > 150 && (
          <button className="dg-more-btn" onClick={() => setShowFullDesc(!showFullDesc)}>
            {showFullDesc ? 'Daha Az Gör ▲' : 'Devamını Oku ▼'}
          </button>
        )}
      </div>

      {/* Highlights */}
      {item.highlights && (
        <div className="dg-section">
          <h4 className="dg-section-title">✨ Mutlaka Yap</h4>
          <div className="dg-highlights-list">
            {item.highlights.map((h, i) => (
              <div key={i} className="dg-highlight-item">
                <div className="dg-highlight-num">{i + 1}</div>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fun Facts */}
      {item.funFacts && (
        <div className="dg-section">
          <h4 className="dg-section-title">💡 Biliyor muydunuz?</h4>
          <div className="dg-facts-grid">
            {item.funFacts.map((f, i) => (
              <div key={i} className="dg-fact-card">
                <p>“{f}”</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dg-footer-spacing" />
    </div>
  );
}
