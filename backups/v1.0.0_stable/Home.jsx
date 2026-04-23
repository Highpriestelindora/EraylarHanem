import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, Plus, Minus, Bell, BellOff, History, Flame, 
  Utensils, Wallet, Home as HomeIcon, 
  Stethoscope, Plane, PawPrint, Settings, Smile, BarChart2
} from 'lucide-react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import './Home.css';

const Home = () => {
  const { 
    mutfak, ev, saglik, finans, tatil, pet, sosyal, logs, settings, toggleSilentMode, currentUser 
  } = useStore();
  
  const navigate = useNavigate();
  const [showLogs, setShowLogs] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString().split('T')[0];

  const [dismissedToday, setDismissedToday] = useState(() => {
    const saved = localStorage.getItem(`dismissed_alerts_${todayIso}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [minimizedAlerts, setMinimizedAlerts] = useState([]);

  const handleDismissAlert = (id) => {
    const newDismissed = [...dismissedToday, id];
    setDismissedToday(newDismissed);
    localStorage.setItem(`dismissed_alerts_${todayIso}`, JSON.stringify(newDismissed));
    toast.success('Hatırlatıcı bugünkü listeden kaldırıldı.');
  };

  const handleRefreshAlerts = () => {
    setDismissedToday([]);
    localStorage.removeItem(`dismissed_alerts_${todayIso}`);
    setMinimizedAlerts([]);
    toast.success('Tüm bildirimler yenilendi! ✨');
  };

  const toggleMinimize = (id) => {
    setMinimizedAlerts(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  // --- AKILLI ASİSTAN MOTORU ---
  const allAlerts = useMemo(() => {
    const alerts = [];

    // 1. Mutfak Kritik Stok
    const categories = ['buzdolabi', 'kiler', 'dondurucu'];
    categories.forEach(cat => {
      const items = mutfak?.[cat] || [];
      items.forEach(item => {
        if (item.min && item.stock <= item.min) {
          alerts.push({
            id: `mutfak_${item.id}`,
            type: 'mutfak',
            icon: '🍎',
            text: `Mutfak: ${item.name} kritik seviyede (${item.stock} ${item.unit || 'adet'})`,
            color: '#f97316'
          });
        }
      });
    });

    // 2. Ödenmemiş Faturalar
    const unpaid = (ev?.faturalar || []).filter(f => !f.odendi);
    unpaid.forEach(f => {
      alerts.push({
        id: `fatura_${f.id}`,
        type: 'ev',
        icon: '📄',
        text: `Fatura: ${f.ad} ödemesi bekliyor!`,
        color: '#ef4444'
      });
    });

    // 3. Sağlık Randevuları (Son 3 gün)
    const appointments = (saglik?.randevular || []);
    appointments.forEach(r => {
      const diff = Math.ceil((new Date(r.tarih) - today) / 864e5);
      if (diff >= 0 && diff <= 3) {
        alerts.push({
          id: `saglik_${r.id}`,
          type: 'saglik',
          icon: '🏥',
          text: `Sağlık: ${r.ad} için randevunuz ${diff === 0 ? 'Bugün!' : diff + ' gün sonra.'}`,
          color: '#06b6d4'
        });
      }
    });

    // 4. Tatil Geri Sayım
    const trips = (tatil?.trips || []);
    trips.forEach(t => {
      const diff = Math.ceil((new Date(t.baslangic || t.date) - today) / 864e5);
      if (diff >= 0 && diff <= 15) {
        alerts.push({
          id: `tatil_${t.id}`,
          type: 'tatil',
          icon: '✈️',
          text: `Tatil: ${t.rota} seyahatine sadece ${diff} gün kaldı!`,
          color: '#8b5cf6'
        });
      }
    });

    // 5. Pet Aşıları (Yaklaşan ve Gecikmişler)
    const petVaccines = Array.isArray(pet?.vaccines) 
      ? pet.vaccines 
      : Object.values(pet?.vaccines || {}).flat();

    petVaccines.forEach(v => {
      if (!v.last || !v.ev) return;
      const parts = v.last.split('.');
      const lastDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      const nextDate = new Date(lastDate.getTime() + (v.ev * 864e5));
      const diff = Math.ceil((nextDate - today) / 864e5);
      
      if (diff <= 7) {
        alerts.push({
          id: `pet_${v.n}_${v.petName}`,
          type: 'pet',
          icon: '🐾',
          text: diff < 0 
            ? `${v.petName || 'Pet'}: ${v.n} aşısı ${Math.abs(diff)} gün gecikti!` 
            : `${v.petName || 'Pet'}: ${v.n} aşısına ${diff} gün kaldı.`,
          color: diff < 0 ? '#ef4444' : '#10b981'
        });
      }
    });

    return alerts.filter(a => !dismissedToday.includes(a.id));
  }, [mutfak, ev, saglik, tatil, pet, dismissedToday, today]);

  // --- UI COUNTS ---
  const unpaidCount = (ev?.faturalar || []).filter(f => !f.odendi).length;
  const appointmentCount = (saglik?.randevular || []).length;
  const tripCount = (tatil?.trips || []).length;
  const vaccineCount = Array.isArray(pet?.vaccines) 
    ? pet.vaccines.length 
    : Object.values(pet?.vaccines || {}).flat().length;

  const activeAlert = allAlerts[0];

  return (
    <AnimatedPage className="home-container">
      {/* Premium Hero Header - Optimized & Cleaned */}
      <div className="home-hero-sweet">
        {/* Left: User Icon */}
        <div className="header-left-avatar" onClick={() => navigate('/profil')} title="Profilim">
          <div className="user-avatar-sweet">{currentUser?.emoji || '👤'}</div>
        </div>

        {/* Center: Brand & Funny Logic */}
        <div className="header-center-brand">
          <h1>Eraylar Hanem</h1>
          <div className="funny-bubble">
            {currentUser?.name === 'Görkem' ? (
              <span title="Esra Süpürge Yapıyor! 😂">🧹👩‍🍳</span>
            ) : currentUser?.name === 'Esra' ? (
              <span title="Görkem Çivi Çakıyor! 😂">🔨👨‍💻</span>
            ) : (
              <span>🏠</span>
            )}
          </div>
        </div>

        {/* Right: Actions & Pets Column */}
        <div className="header-right-actions">
          <div className="action-row-mini">
            <button className="mini-icon-btn" onClick={() => navigate('/analiz')} title="İstatistikler">
              <BarChart2 size={16} />
            </button>
            <button className="mini-icon-btn" onClick={() => navigate('/ayarlar')} title="Ayarlar">
              <Settings size={16} />
            </button>
          </div>
          <div className="pet-row-mini">
            <span className="pet-mini" title="Waffle">🐶</span>
            <span className="pet-mini" title="Mayıs">🐈</span>
          </div>
        </div>
      </div>

      {/* Akıllı Bildirimler - Enhanced Multi-Alert System */}
      <div className="assistant-section-v2">
        <div className="assistant-header">
          <div className="title-group">
            <span className="sparkle">✨</span>
            <h2>Akıllı Aile Asistanı</h2>
          </div>
          <button className="refresh-alerts-btn" onClick={handleRefreshAlerts} title="Bildirimleri Yenile">
            <History size={18} />
          </button>
        </div>
        
        <div className="alerts-container">
          {allAlerts.length > 0 ? (
            allAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`alert-card-v2 ${minimizedAlerts.includes(alert.id) ? 'minimized' : ''}`}
                style={{ '--alert-color': alert.color }}
              >
                <div className="alert-main">
                  <span className="alert-icon">{alert.icon}</span>
                  {!minimizedAlerts.includes(alert.id) && <p className="alert-text">{alert.text}</p>}
                </div>
                <div className="alert-actions">
                  <button onClick={() => toggleMinimize(alert.id)} className="min-btn" title={minimizedAlerts.includes(alert.id) ? "Büyüt" : "Küçült"}>
                    {minimizedAlerts.includes(alert.id) ? <Plus size={14} /> : <Minus size={14} />}
                  </button>
                  <button onClick={() => handleDismissAlert(alert.id)} className="close-btn" title="Bugünlük Kapat">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="all-clear glass">
              <span className="check-icon">💖</span>
              <p>Bugün her şey yolunda, keyfine bak!</p>
            </div>
          )}
        </div>
      </div>

      {/* Module Grid - Premium Cards */}
      <div className="dashboard-grid">
        <Link to="/mutfak" className="nav-card mutfak">
          <div className="card-visual">🍳</div>
          <div className="card-info">
            <h3>Eraylar Mutfak</h3>
            <span>Yemek & Alışveriş</span>
          </div>
        </Link>

        <Link to="/sosyal" className="nav-card sosyal">
          <div className="card-visual">🎯</div>
          <div className="card-info">
            <h3>Eraylar Sosyal</h3>
            <span>Aktivite & Rutin</span>
          </div>
        </Link>

        <Link to="/alisveris" className="nav-card alisveris">
          <div className="card-visual">🛍️</div>
          <div className="card-info">
            <h3>Eraylar Alışveriş</h3>
            <span>Liste & Modaring</span>
          </div>
        </Link>

        <Link to="/tatil" className="nav-card tatil">
          <div className="card-visual">✈️</div>
          <div className="card-info">
            <h3>Eraylar Tatil</h3>
            <span>Plan & Rota</span>
          </div>
        </Link>

        <Link to="/pet" className="nav-card pet">
          <div className="card-visual">🐾</div>
          <div className="card-info">
            <h3>Eraylar Pet</h3>
            <span>Waffle & Mayıs</span>
          </div>
        </Link>

        <Link to="/saglik" className="nav-card saglik">
          <div className="card-visual">🏥</div>
          <div className="card-info">
            <h3>Eraylar Sağlık</h3>
            <span>Randevu & İlaç</span>
          </div>
        </Link>

        <Link to="/ev" className="nav-card ev">
          <div className="card-visual">🏠</div>
          <div className="card-info">
            <h3>Eraylar Ev</h3>
            <span>Fatura & Bakım</span>
          </div>
        </Link>

        <Link to="/aracim" className="nav-card aracim">
          <div className="card-visual">🚗</div>
          <div className="card-info">
            <h3>Eraylar Aracım</h3>
            <span>Toyota C-HR</span>
          </div>
        </Link>

        <Link to="/kasa" className="nav-card kasa">
          <div className="card-visual">🧾</div>
          <div className="card-info">
            <h3>Eraylar Kasa</h3>
            <span>Varlık & Birikim</span>
          </div>
        </Link>

        <Link to="/finans" className="nav-card finans">
          <div className="card-visual">💰</div>
          <div className="card-info">
            <h3>Eraylar Finans</h3>
            <span>Bütçe & Analiz</span>
          </div>
        </Link>

        <Link to="/hedefler" className="nav-card hedefler wide-slim">
          <div className="card-content-horizontal">
            <span className="card-visual-small">🏆</span>
            <h3>Eraylar Hedeflerim</h3>
          </div>
        </Link>
      </div>

      {/* System Logs Modal */}
      {showLogs && (
        <div className="modal-overlay" onClick={() => setShowLogs(false)}>
          <div className="logs-modal animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><History size={18} /> Sistem Hareketleri</h3>
              <button onClick={() => setShowLogs(false)}><X size={20} /></button>
            </div>
            <div className="logs-list">
              {(logs || []).slice(-15).reverse().map((log, idx) => (
                <div key={idx} className="log-item">
                  <span className="log-time">{new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="log-text">{log.text}</span>
                </div>
              ))}
              {(!logs || logs.length === 0) && <p className="no-logs">Henüz hareket kaydı yok.</p>}
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
};

export default Home;