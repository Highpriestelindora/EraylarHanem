import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Settings, BarChart2 } from 'lucide-react';
import useStore from '../store/useStore';
import FloatingHub from './FloatingHub';
import logo from '../assets/eraylar-logo.png';
import './AppLayout.css';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useStore(state => state.isOnline ?? true);
  const isSaving = useStore(state => state.isSaving);
  const currentUser = useStore(state => state.currentUser);
  const isHome = location.pathname === '/';
  
  const moduleColors = {
    '/mutfak': 'var(--mutfak)',
    '/sosyal': 'var(--social)',
    '/alisveris': 'var(--alisveris)',
    '/tatil': 'var(--tatil)',
    '/pet': 'var(--pet)',
    '/saglik': 'var(--saglik)',
    '/ev': 'var(--ev)',
    '/aracim': 'var(--aracim)',
    '/kasa': 'var(--kasa)',
    '/finans': 'var(--finans)',
    '/modaring': 'var(--modaring)',
    '/muhendislik': 'var(--muhendislik)',
    '/hedefler': 'var(--hedefler)',
    '/basarilar': 'var(--achievements)',
    '/guvenlik': 'var(--guvenlik)',
    '/profil': 'var(--primary)',
    '/ayarlar': 'var(--primary)',
    '/analiz': 'var(--primary)',
  };

  const headerBg = moduleColors[location.pathname] || 'var(--card)';
  const isColored = !!moduleColors[location.pathname];

  return (
    <div className="app-container">
      {/* Header - Shown only on Home if needed, but Home has its own. 
          Hiding on modules to allow immersive module headers. */}
      {false && (
        <header className={`app-header glass ${isColored ? 'colored-header' : ''}`} style={{ background: headerBg }}>
        <div className="header-left">
          <div className="header-title-row" onClick={() => navigate('/')}>
            <img src={logo} alt="Logo" className="header-logo-mini" />
            <div className="header-title-main">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h1>Eraylar Hanem</h1>
                <div 
                  className={`status-dot ${isSaving ? 'syncing' : (isOnline ? 'online' : 'offline')}`} 
                  title={isSaving ? 'Senkronize ediliyor...' : (isOnline ? 'Bulut Bağlantısı Aktif' : 'Çevrimdışı')} 
                />
              </div>
              <small>Hoş geldin, {currentUser?.name || 'Misafir'}</small>
            </div>
          </div>
        </div>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="icon-btn" 
            style={{ background: 'var(--bg)', border: '1px solid var(--brd)', borderRadius: '12px', padding: '8px', cursor: 'pointer', color: 'var(--txt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => navigate('/analiz')}
            title="İstatistikler ve Analiz"
          >
            <BarChart2 size={20} />
          </button>
          <button 
            className="icon-btn" 
            style={{ background: 'var(--bg)', border: '1px solid var(--brd)', borderRadius: '12px', padding: '8px', cursor: 'pointer', color: 'var(--txt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => navigate('/ayarlar')}
            title="Genel Ayarlar"
          >
            <Settings size={20} />
          </button>
          <div className="avatar clickable" onClick={() => navigate('/profil')} title="Profilim">
            {currentUser?.emoji || '👤'}
          </div>
        </div>
      </header>
      )}

      {/* Main Content Area */}
      <main className="app-content">
        <Outlet />
      </main>

      {/* Modern Floating Navigation Hub */}
      <FloatingHub />
    </div>
  );
}
