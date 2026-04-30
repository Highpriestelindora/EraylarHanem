import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, PlusCircle, X, ArrowRightLeft,
  Shield, Landmark, Gem, PieChart, Home, Car, Goal, Eye, EyeOff,
  Plus, ChevronRight, ArrowLeft, MoreVertical, Coins
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ActionSheet from '../components/ActionSheet';
import toast from 'react-hot-toast';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Kasa.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const formatMoney = (val, privacy = false) => {
  if (privacy) return '••••₺';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);
};

export default function Kasa() {
  const [activeTab, setActiveTab] = useState('varliklar');
  const navigate = useNavigate();
  const { 
    kasa, updateVarlik, updateTasinmaz, transferKasa, 
    togglePrivacyMode, updateKasaBakiye, finans, garaj 
  } = useStore();

  const privacy = kasa?.privacyMode || false;
  const K = kasa || { bakiyeler: {}, varliklar: [], tasinmazlar: [], kumbaralar: [], rates: { EUR: 35, USD: 32 } };
  
  const totalCash = Object.values(K.bakiyeler || {}).reduce((a, b) => a + b, 0);
  const totalVarlik = (K.varliklar || []).reduce((acc, v) => acc + (v.amount * v.price), 0);
  const totalTasinmaz = (K.tasinmazlar || []).reduce((acc, t) => acc + t.value, 0);
  const totalTasit = (garaj || []).reduce((acc, v) => acc + (v.marketValue || 0), 0);
  const totalWealth = totalCash + totalVarlik + totalTasinmaz + totalTasit;

  const totalDebt = (finans?.borclar || []).reduce((a, b) => a + (b.remaining || 0), 0) + (finans?.kartlar || []).reduce((a, b) => a + (b.balance || 0), 0);
  const netWorth = totalWealth - totalDebt;

  const tabs = [
    { id: 'varliklar', label: 'Birikim', emoji: '🪙' },
    { id: 'tasinmazlar', label: 'Mülkler', emoji: '🏠' },
    { id: 'kumbaralar', label: 'Hedefler', emoji: '🎯' },
    { id: 'bakiyeler', label: 'Nakit', emoji: '💵' }
  ];

  const portfolioData = {
    labels: ['Nakit', 'Varlıklar', 'Mülkler', 'Taşıtlar'],
    datasets: [{
      data: [totalCash, totalVarlik, totalTasinmaz, totalTasit],
      backgroundColor: ['#10b981', '#f59e0b', '#7c3aed', '#334155'],
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  return (
    <AnimatedPage className="kasa-container">
      <header className="module-header glass" style={{ background: 'var(--kasa)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🏛️</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Varlık Kalesi</h1>
              <p>Aile Servet Yönetimi</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={togglePrivacyMode}>
              {privacy ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menüye Dön">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        <div className="wealth-summary-card glass" style={{ margin: '10px 0', padding: '12px' }}>
           <div className="ws-item main">
             <small style={{ fontSize: '9px', fontWeight: '800', opacity: 0.8 }}>TOPLAM NET VARLIK</small>
             <h2 style={{ fontSize: '20px', fontWeight: '900' }}>{formatMoney(netWorth, privacy)}</h2>
           </div>
           <div className="ws-divider" style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
           <div className="ws-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
             <div className="ws-sub">
               <small style={{ fontSize: '9px', fontWeight: '800', opacity: 0.8 }}>BİRİKİM</small>
               <strong style={{ display: 'block', fontSize: '13px' }}>{formatMoney(totalCash + totalVarlik, privacy)}</strong>
             </div>
             <div className="ws-sub">
               <small style={{ fontSize: '9px', fontWeight: '800', opacity: 0.8 }}>BORÇLAR</small>
               <strong className="neg" style={{ display: 'block', fontSize: '13px', color: '#fca5a5' }}>-{formatMoney(totalDebt, privacy)}</strong>
             </div>
           </div>
        </div>

        <nav className="tab-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ fontSize: '16px', marginBottom: '2px' }}>{tab.emoji}</span>
              <span>{tab.label}</span>

            </button>
          ))}
        </nav>
      </header>

      <div className="kasa-scroll-content">
        
        {activeTab === 'varliklar' && (
          <div className="varliklar-view animate-fadeIn">
            <div className="chart-section glass">
              <div className="chart-box">
                <Doughnut data={portfolioData} options={{ plugins: { legend: { display: false } } }} />
                <div className="chart-inner">
                  <PieChart size={20} color="#f59e0b" />
                  <small>Dağılım</small>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item"><span style={{background: '#10b981'}} /> Nakit</div>
                <div className="legend-item"><span style={{background: '#f59e0b'}} /> Altın/Borsa</div>
                <div className="legend-item"><span style={{background: '#7c3aed'}} /> Mülkler</div>
                <div className="legend-item"><span style={{background: '#334155'}} /> Taşıtlar</div>
              </div>
            </div>

            <div className="asset-list-premium mt-24">
              <div className="section-header-v2">
                <h3>🪙 Likit Varlıklar</h3>
                <button className="add-btn-mini"><Plus size={14} /></button>
              </div>
              {K.varliklar?.map(v => (
                <div key={v.id} className="asset-card-premium glass">
                  <div className="acp-left">
                    <div className="acp-icon">{v.icon}</div>
                    <div className="acp-info">
                      <strong>{v.name}</strong>
                      <small>{v.amount} {v.unit} · Kur: {v.price}₺</small>
                    </div>
                  </div>
                  <div className="acp-right">
                    <div className="acp-value">{formatMoney(v.amount * v.price, privacy)}</div>
                    <button className="acp-edit"><MoreVertical size={16} /></button>
                  </div>
                </div>
              ))}
              
              {/* Taşıtlar */}
              {garaj?.filter(v => v.marketValue > 0).map(v => (
                <div key={v.id} className="asset-card-premium glass" style={{ borderLeft: '4px solid #334155' }}>
                  <div className="acp-left">
                    <div className="acp-icon">🚗</div>
                    <div className="acp-info">
                      <strong>{v.model}</strong>
                      <small>{v.plaka} · Güncel Değer</small>
                    </div>
                  </div>
                  <div className="acp-right">
                    <div className="acp-value">{formatMoney(v.marketValue, privacy)}</div>
                    <button className="acp-edit" onClick={() => navigate('/aracim')}><ChevronRight size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasinmazlar' && (
          <div className="tasinmazlar-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🏠 Gayrimenkul Portföyü</h3>
            </div>
            <div className="real-estate-list">
              {K.tasinmazlar?.map(t => (
                <div key={t.id} className="re-card glass">
                  <div className="re-header">
                    <div className="re-icon-box"><Home size={20} /></div>
                    <div className="re-title">
                      <strong>{t.name}</strong>
                      <h3>{formatMoney(t.value, privacy)}</h3>
                    </div>
                  </div>
                  <div className="re-details-grid">
                    <div className="red-item">
                      <small>VERGİ</small>
                      <span>{formatMoney(t.tax, privacy)}</span>
                    </div>
                    <div className="red-item">
                      <small>SİGORTA</small>
                      <span>{formatMoney(t.insurance, privacy)}</span>
                    </div>
                    <div className="red-item">
                      <small>EK MALİYET</small>
                      <span>{formatMoney(t.extra, privacy)}</span>
                    </div>
                  </div>
                  <button className="re-manage-btn">Detayları Yönet</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'kumbaralar' && (
          <div className="goals-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🎯 Birikim Hedefleri</h3>
            </div>
            <div className="goal-list">
              {K.kumbaralar?.map(g => (
                <div key={g.id} className="goal-card-premium glass">
                  <div className="gcp-header">
                    <div className="gcp-icon-box">{g.icon}</div>
                    <div className="gcp-title">
                      <strong>{g.name}</strong>
                      <small>Hedef: {formatMoney(g.target, privacy)}</small>
                    </div>
                    <div className="gcp-perc">%{Math.round((g.current / g.target) * 100)}</div>
                  </div>
                  <div className="gcp-progress-container">
                    <div className="gcp-bar">
                      <div className="gcp-fill" style={{ width: `${(g.current / g.target) * 100}%` }} />
                    </div>
                    <div className="gcp-amounts">
                      <span>{formatMoney(g.current, privacy)}</span>
                      <span>{formatMoney(g.target - g.current, privacy)} kaldı</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bakiyeler' && (
          <div className="bakiyeler-view animate-fadeIn">
             <div className="section-header-v2">
              <h3>💵 Nakit Pozisyonları</h3>
              <button className="transfer-btn-mini"><ArrowRightLeft size={14} /> Transfer</button>
            </div>
            <div className="cash-grid">
              {Object.entries(K.bakiyeler || {}).map(([kisi, val]) => (
                <div key={kisi} className="cash-card glass">
                  <div className="cc-user">
                    <span className="cc-emoji">{kisi === 'gorkem' ? '👨' : kisi === 'esra' ? '👩' : '🏡'}</span>
                    <span className="cc-name">{kisi.toUpperCase()}</span>
                  </div>
                  <div className="cc-val">{formatMoney(val, privacy)}</div>
                  <button className="cc-update-btn">Güncelle</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </AnimatedPage>
  );
}
