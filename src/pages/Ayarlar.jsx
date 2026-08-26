import React, { useState } from 'react';
import { 
  User as UserIcon, Bell, Shield, Moon, LogOut, ChevronRight, 
  History as HistoryIcon, X, VolumeX, BellRing, Archive, Database, 
  CheckCircle2, Sparkles, UserCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import Portal from '../components/Portal';
import ConfirmModal from '../components/ConfirmModal';
import { notificationService } from '../lib/notificationService';
import toast from 'react-hot-toast';
import './Ayarlar.css';

export default function Ayarlar() {
  const navigate = useNavigate();
  const { logs, settings, toggleSilentMode, currentUser, setCurrentUser } = useStore();
  const [darkMode, setDarkMode] = useState(false);
  const [notifPermission, setNotifPermission] = useState(
    'Notification' in window ? Notification.permission : 'default'
  );
  
  // Easter egg Game State
  const [showGame, setShowGame] = useState(false);
  const [gameStep, setGameStep] = useState(3);
  const [dotPos, setDotPos] = useState({ top: '50%', left: '50%' });

  // Logs Modal State
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleToggleDarkMode = (e) => {
    const checked = e.target.checked;
    setDarkMode(checked);
    if (checked) {
      setShowGame(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setNotifPermission('Notification' in window ? Notification.permission : 'default');
    if (granted) {
      toast.success('Bildirimlere izin verildi! 🔔');
    } else {
      toast.error('Bildirim izni reddedildi veya tarayıcı tarafından engellendi.');
    }
  };

  const handleDotClick = () => {
    if (gameStep > 1) {
      setGameStep(prev => prev - 1);
      setDotPos({
        top: Math.floor(Math.random() * 70 + 15) + '%',
        left: Math.floor(Math.random() * 70 + 15) + '%'
      });
    } else {
      setShowGame(false);
      setGameStep(3);
      setDarkMode(false);
      document.documentElement.removeAttribute('data-theme');
      
      toast((t) => (
        <span className="flame-text">
          🔥 "Sen yanmazsan ben yanmazsam nasıl çıkar karanlıklar aydınlığa" 🔥
        </span>
      ), {
        duration: 6000,
        style: {
          background: '#1a1a1a',
          color: '#ff4500',
          borderRadius: '15px',
          border: '2px solid #ff4500',
          fontSize: '16px',
          fontWeight: '900',
          textAlign: 'center'
        },
      });
    }
  };

  const confirmAndLogout = () => {
    setCurrentUser(null);
    navigate('/');
    toast.success('Oturum kapatıldı.');
  };

  const isOnline = useStore(state => state.isOnline !== false);

  return (
    <AnimatedPage className="ayarlar-container">
      <div className="ayarlar-header">
        <div className="ayarlar-title-row">
          <h2>Ayarlar ⚙️</h2>
          <div className={`supabase-live-badge ${isOnline ? 'online' : 'offline'}`}>
            <span className={`live-dot-pulse ${isOnline ? 'online' : 'offline'}`}></span>
            <span>{isOnline ? 'Supabase Canlı ⚡' : 'Çevrimdışı ⚠️'}</span>
          </div>
        </div>
        <p>Uygulama tercihleri ve sistem durumu</p>
      </div>

      {/* Görünüm Ayarları */}
      <div className="settings-group">
        <h4>Görünüm</h4>
        
        <div className="setting-item">
          <div className="setting-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
            <Moon size={20} />
          </div>
          <div className="setting-content">
            <span className="setting-title">Karanlık Mod</span>
            <span className="setting-desc">Göz yormayan koyu renk teması</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={darkMode} onChange={handleToggleDarkMode} />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Bildirim Ayarları */}
      <div className="settings-group">
        <h4>Bildirim Ayarları</h4>
        
        <div className="setting-item clickable" onClick={handleRequestPermission}>
          <div className="setting-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
            <BellRing size={20} />
          </div>
          <div className="setting-content">
            <span className="setting-title">Sistem Bildirimleri</span>
            <span className="setting-desc">
              {notifPermission === 'granted' ? 'İzin Verildi (Aktif) ✅' : 'Bildirim İzni İste 🔔'}
            </span>
          </div>
          <ChevronRight size={18} className="chevron" />
        </div>

        <div className="setting-item">
          <div className="setting-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <VolumeX size={20} />
          </div>
          <div className="setting-content">
            <span className="setting-title">Sessiz Mod</span>
            <span className="setting-desc">Cihaza anlık sesli/titreşimli bildirim gönderilmesin</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={settings.silentMode} onChange={toggleSilentMode} />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Kullanıcı & Hesap */}
      <div className="settings-group">
        <h4>Kullanıcı & Hesap</h4>

        <div className="setting-item clickable" onClick={() => navigate('/profil')}>
          <div className="setting-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <UserCheck size={20} />
          </div>
          <div className="setting-content">
            <span className="setting-title">{currentUser?.name || 'Görkem'} Hesabı</span>
            <span className="setting-desc">Profil bilgileri ve güvenlik ayarları</span>
          </div>
          <ChevronRight size={18} className="chevron" />
        </div>

        <div className="setting-item clickable" onClick={() => setShowLogoutConfirm(true)}>
          <div className="setting-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <LogOut size={20} />
          </div>
          <div className="setting-content">
            <span className="setting-title" style={{ color: '#ef4444' }}>Kullanıcı Değiştir / Çıkış Yap</span>
            <span className="setting-desc">PIN giriş ekranına geri döner</span>
          </div>
          <ChevronRight size={18} className="chevron" />
        </div>
      </div>

      {/* Arşiv & Kayıtlar */}
      <div className="settings-group">
        <h4>Arşiv & Sistem Geçmişi</h4>
        
        <button className="history-btn glass" onClick={() => navigate('/kayitlar')}>
          <Archive size={18} />
          <span>Sistem Arşivi & Silinenler</span>
          <ChevronRight size={18} />
        </button>

        <button className="history-btn glass" onClick={() => setShowLogsModal(true)}>
          <HistoryIcon size={20} />
          <span>Sistem İşlem Günlüğü</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* App Version Info */}
      <div className="app-version-card glass">
        <div className="v-info">
          <strong>Eraylar Hanem v4.10.0</strong>
          <span>Özel Aile Yönetim Sistemi</span>
        </div>
        <div className="v-badge">GÜNCEL 🟢</div>
      </div>

      {/* Easter Egg Game Overlay */}
      {showGame && (
        <div className="dark-game-overlay">
          <div 
            className="game-flame animate-pulse" 
            style={{ 
              top: dotPos.top, 
              left: dotPos.left,
            }}
            onClick={handleDotClick}
          >
            <span className="flame-icon">🔥</span>
            <span className="flame-count">{gameStep}</span>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <ConfirmModal
          title="Çıkış Yapılsın mı?"
          message="Giriş ekranına yönlendirileceksiniz. Devam etmek istiyor musunuz?"
          confirmText="Çıkış Yap"
          cancelText="Vazgeç"
          onConfirm={confirmAndLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {/* Logs Modal */}
      {showLogsModal && (
        <Portal>
          <div className="modal-overlay" onClick={() => setShowLogsModal(false)}>
            <div className="modal-content logs-modal glass animate-pop" onClick={e => e.stopPropagation()}>
              <header className="modal-header">
                <h3><HistoryIcon size={20} /> Sistem Hareketleri</h3>
                <button className="close-btn" onClick={() => setShowLogsModal(false)}><X size={20} /></button>
              </header>
              <div className="logs-mini-list">
                {logs && logs.length > 0 ? (
                  logs.map((log) => (
                    <div key={log.id} className="log-mini-item">
                      <div className="log-mini-main">
                        <span className="log-mini-action">{log.action}</span>
                        <span className="log-mini-detail">{log.detail}</span>
                      </div>
                      <span className="log-mini-time">
                        {new Date(log.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="empty-logs">Henüz bir hareket kaydedilmedi.</p>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </AnimatedPage>
  );
}
