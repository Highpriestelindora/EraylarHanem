import React, { useState } from 'react';
import {
  Droplets, Refrigerator, BookOpen,
  ShoppingCart, Calendar, MessageSquare, Wheat,
  ArrowLeft, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';

// Tab Components
import MenuTab from './MutfakTabs/MenuTab';
import StokTab from './MutfakTabs/StokTab';
import SuTakipTab from './MutfakTabs/SuTakipTab';
import EkmeklikTab from './MutfakTabs/EkmeklikTab';
import AlisverisTab from './MutfakTabs/AlisverisTab';
import SohbetTab from './MutfakTabs/SohbetTab';
import TariflerTab from './MutfakTabs/TariflerTab';

import './Mutfak.css';

export default function Mutfak() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const mutfak = useStore(state => state.mutfak);

  const tabs = [
    { id: 'menu', label: 'Menü', icon: Calendar, emoji: '📅' },
    { id: 'stok', label: 'Stok', icon: Refrigerator, emoji: '🧊' },
    { id: 'ekmek', label: 'Ekmek', icon: Wheat, emoji: '🥖' },
    { id: 'su', label: 'Su', icon: Droplets, emoji: '💧' },
    { id: 'alisveris', label: 'Alışveriş', icon: ShoppingCart, emoji: '🛒' }
  ];

  return (
    <AnimatedPage className="mutfak-page">
      <header className="module-header-v3" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
        <div className="m-h-content">
          <div className="m-h-top">
            <div className="m-h-info">
              <span className="m-h-emoji animate-float">🍲</span>
              <div className="m-h-text">
                <h1>Eraylar Mutfak</h1>
                <p>
                  {mutfak && (() => {
                    const shoppingListNames = (mutfak.alisveris || []).map(i => i.n?.toLowerCase() || '');
                    const criticalCount = ['buzdolabi', 'kiler', 'dondurucu'].reduce((acc, loc) => 
                      acc + (mutfak[loc] || []).filter(i => 
                        i.mn > 0 && i.cr <= i.mn && !shoppingListNames.includes(i.n?.toLowerCase() || '')
                      ).length, 0);
                    return criticalCount > 0 
                      ? `${criticalCount} kritik eksik ürün var!` 
                      : "Mutfak operasyon merkezi";
                  })()}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                className="m-h-back" 
                onClick={() => setActiveTab(prev => prev === 'tarifler' ? 'menu' : 'tarifler')}
                style={{ background: activeTab === 'tarifler' ? 'white' : 'rgba(255,255,255,0.25)', color: activeTab === 'tarifler' ? '#ea580c' : 'white' }}
                >
                <BookOpen size={20} />
                </button>
                <button className="m-h-back" onClick={() => navigate('/')}>
                <ArrowLeft size={20} />
                </button>
            </div>
          </div>

          <div className="m-h-tabs-v3">
            {tabs.map(t => (
              <button 
                key={t.id} 
                className={`m-h-tab-v3 ${activeTab === t.id ? 'active theme-mutfak' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <div className="t-icon"><t.icon size={16} /></div>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mutfak-content">
        {activeTab === 'menu' && <MenuTab />}
        {activeTab === 'stok' && <StokTab searchTerm={searchTerm} />}
        {activeTab === 'ekmek' && <EkmeklikTab />}
        {activeTab === 'su' && <SuTakipTab />}
        {activeTab === 'alisveris' && <AlisverisTab />}
        {activeTab === 'sohbet' && <SohbetTab />}
        {activeTab === 'tarifler' && <TariflerTab />}
      </main>
    </AnimatedPage>
  );
}