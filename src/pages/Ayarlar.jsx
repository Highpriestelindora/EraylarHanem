
import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Moon, LogOut, Trophy, ChevronRight, History, Download, X, Save, VolumeX, BellRing } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { notificationService } from '../lib/notificationService';
import toast from 'react-hot-toast';
import './Ayarlar.css';

export default function Ayarlar() {
  const navigate = useNavigate();
  const { logs, settings, toggleSilentMode } = useStore();
  const [darkMode, setDarkMode] = useState(false);
  const [notifPermission, setNotifPermission] = useState(Notification.permission);
  
  // Game State
  const [showGame, setShowGame] = useState(false);
  const [gameStep, setGameStep] = useState(3);
  const [dotPos, setDotPos] = useState({ top: '50%', left: '50%' });

  // Logs Modal State
  const [showLogsModal, setShowLogsModal] = useState(false);

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
    setNotifPermission(Notification.permission);
    if (granted) {
      toast.success('Bildirimlere izin verildi! 🔔');
    } else {
      toast.error('Bildirim izni reddedildi.');
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
      
      // Flaming Toast logic via custom style or separate message
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

  const handleBackup = () => {
    const data = useStore.getState();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eraylar_hanem_yedek_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Yedekleme başarıyla indirildi! 💾');
  };

  return (
    <AnimatedPage className="ayarlar-container">
      <div className="ayarlar-header">
        <h2>Ayarlar ⚙️</h2>
        <p>Uygulamayı kişiselleştir ve sistem durumunu yönet</p>
      </div>

      <div className="settings-group">
        <h4>Genel Ayarlar</h4>
        
        <div className="setting-item">
          <div className="setting-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}><Moon size={20} /></div>
          <div className="setting-content">
            <span className="setting-title">Karanlık Mod</span>
            <span className="setting-desc">Göz yormayan koyu tema</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={darkMode} onChange={handleToggleDarkMode} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item clickable" onClick={handleBackup}>
          <div className="setting-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><Download size={20} /></div>
          <div className="setting-content">
            <span className="setting-title">Veri Yedekleme</span>
            <span className="setting-desc">Tüm verilerini JSON olarak indir</span>
          </div>
          <Download size={18} className="chevron" />
        </div>
      </div>

      <div className="settings-group">
        <h4>Bildirim Ayarları</h4>
        
        <div className="setting-item clickable" onClick={handleRequestPermission}>
          <div className="setting-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}><BellRing size={20} /></div>
          <div className="setting-content">
            <span className="setting-title">Bildirimlere İzin Ver</span>
            <span className="setting-desc">{notifPermission === 'granted' ? 'İzin Verildi ✅' : 'İzin Gerekiyor ⚠️'}</span>
          </div>
          <ChevronRight size={18} className="chevron" />
        </div>

        <div className="setting-item">
          <div className="setting-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><VolumeX size={20} /></div>
          <div className="setting-content">
            <span className="setting-title">Sessiz Mod</span>
            <span className="setting-desc">Telefona bildirim gönderilmesin</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={settings.silentMode} onChange={toggleSilentMode} />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-group">
        <h4>Sistem Geçmişi</h4>
        <button className="history-btn glass" onClick={() => setShowLogsModal(true)}>
          <History size={18} />
          <span>İşlem Geçmişini Gör</span>
          <ChevronRight size={18} />
        </button>
      </div>
      
      <div className="app-version-card glass">
        <div className="v-info">
          <strong>Eraylar Hanem v1.0.0</strong>
          <span>Live Release Edition</span>
        </div>
        <div className="v-badge">GÜNCEL</div>
      </div>

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

      {/* Logs Modal */}
      {showLogsModal && (
        <div className="modal-overlay" onClick={() => setShowLogsModal(false)}>
          <div className="modal-content logs-modal glass animate-pop" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <h3>📜 İşlem Geçmişi</h3>
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
      )}
    </AnimatedPage>
  );
}
