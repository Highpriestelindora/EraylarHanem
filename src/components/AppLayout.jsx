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

  React.useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) return;

    if (location.pathname === '/') {
      metaThemeColor.setAttribute('content', '#ffffff');
    } else {
      const varName = moduleColors[location.pathname];
      if (varName) {
        const style = getComputedStyle(document.documentElement);
        const cleanVarName = varName.replace('var(', '').replace(')', '').trim();
        const hexColor = style.getPropertyValue(cleanVarName).trim();
        if (hexColor) {
          metaThemeColor.setAttribute('content', hexColor);
        } else {
          const fallbacks = {
            '/mutfak': '#7c3aed',
            '/sosyal': '#db2777',
            '/alisveris': '#0891b2',
            '/tatil': '#0d9488',
            '/pet': '#d97706',
            '/saglik': '#e11d48',
            '/ev': '#2563eb',
            '/aracim': '#4b5563',
            '/kasa': '#059669',
            '/finans': '#0284c7',
            '/modaring': '#4f46e5',
            '/muhendislik': '#0f172a',
            '/hedefler': '#ea580c',
            '/basarilar': '#ca8a04',
            '/guvenlik': '#dc2626',
            '/profil': '#7c3aed',
            '/ayarlar': '#7c3aed',
            '/analiz': '#7c3aed',
          };
          metaThemeColor.setAttribute('content', fallbacks[location.pathname] || '#ffffff');
        }
      } else {
        metaThemeColor.setAttribute('content', '#ffffff');
      }
    }
  }, [location.pathname]);

  return (
    <div className="app-container">
      {/* Header - Shown only on Home if needed, but Home has its own. 
          Hiding on modules to allow immersive module headers. */}
      <header className={`app-header glass ${isColored ? 'colored-header' : ''}`} style={{ background: isColored ? headerBg : '#ffffff' }}>
        <div className="header-left">
          <div className="header-title-row" onClick={() => navigate('/')}>
            <img src={logo} alt="Logo" className="header-logo-mini" />
            <div className="header-title-main">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1>Eraylar Hanem</h1>
                <div 
                  className={`status-dot ${isSaving ? 'syncing' : (isOnline ? 'online' : 'offline')}`} 
                  title={isSaving ? 'Senkronize ediliyor...' : (isOnline ? 'Bulut Bağlantısı Aktif' : 'Çevrimdışı')} 
                />
              </div>
              {!isColored && <small>Hoş geldin, {currentUser?.name || 'Görkem'}</small>}
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="header-action-btn" 
            onClick={() => navigate('/analiz')}
            title="İstatistikler"
          >
            <BarChart2 size={20} />
          </button>
          <button 
            className="header-action-btn" 
            onClick={() => navigate('/ayarlar')}
            title="Ayarlar"
          >
            <Settings size={20} />
          </button>
          <div className="avatar-container clickable" onClick={() => navigate('/profil')} title="Profilim">
            <span className="avatar-emoji">{currentUser?.emoji || '👤'}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-content">
        <Outlet />
      </main>

      {/* Modern Floating Navigation Hub */}
      <FloatingHub />
    </div>
  );
}
