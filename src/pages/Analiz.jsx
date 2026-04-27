import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { ArrowLeft, ChefHat, Wallet, Home as HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// İstatistik Alt Komponentleri
import MutfakStats from './MutfakTabs/MutfakStats';

export default function Analiz() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mutfak');

  const tabs = [
    { id: 'mutfak', label: 'Mutfak', icon: ChefHat, emoji: '🍳' },
    { id: 'finans', label: 'Finans', icon: Wallet, emoji: '💰' },
    { id: 'ev', label: 'Ev', icon: HomeIcon, emoji: '🏠' }
  ];

  return (
    <AnimatedPage className="analiz-page" style={{ padding: '20px', paddingBottom: '80px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="glass" 
          style={{ padding: '8px', border: 'none', borderRadius: '12px', cursor: 'pointer', color: 'var(--txt)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 İstatistikler ve Analiz
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--txt-light)' }}>
            Eraylar Hanem'in genel durumu
          </span>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="stats-nav" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px', scrollbarWidth: 'none' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 16px',
              borderRadius: '16px',
              border: activeTab === tab.id ? 'none' : '1px solid var(--brd)',
              background: activeTab === tab.id ? 'var(--card)' : 'var(--bg)',
              color: activeTab === tab.id ? 'var(--txt)' : 'var(--txt-light)',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="stats-content">
        {activeTab === 'mutfak' && <MutfakStats />}
        
        {activeTab === 'finans' && (
          <div className="glass" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px', color: 'var(--txt-light)' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🚧</span>
            <h3>Finans İstatistikleri Yakında</h3>
            <p>Bu bölüm henüz hazır değil.</p>
          </div>
        )}

        {activeTab === 'ev' && (
          <div className="glass" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px', color: 'var(--txt-light)' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🚧</span>
            <h3>Ev İstatistikleri Yakında</h3>
            <p>Bu bölüm henüz hazır değil.</p>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
