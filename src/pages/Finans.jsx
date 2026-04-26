import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, 
  CreditCard, Landmark, Eye, EyeOff,
  Plus, Receipt, ChevronRight, Wallet, Filter, ArrowLeft, Trash2,
  Check, X, AlertCircle, Sparkles, PieChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import './Finans.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const formatMoney = (val, privacy = false) => {
  if (privacy) return '••••₺';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);
};

export default function Finans() {
  const [activeTab, setActiveTab] = useState('havuz');
  const navigate = useNavigate();
  const { 
    finans, kasa, approveExpense, rejectExpense, deleteExpense, 
    togglePrivacyMode, payLoanInstallment 
  } = useStore();
  
  const [showAddExpense, setShowAddExpense] = useState(false);
  const privacy = kasa?.privacyMode || false;

  const bakiyeler = kasa?.bakiyeler || { gorkem: 0, esra: 0, ortak: 0 };
  const pool = finans?.approvalPool || [];
  const borclar = finans?.borclar || [];
  const kartlar = finans?.kartlar || [];
  const harcamalar = finans?.harcamalar || [];

  const totalBalance = Object.values(bakiyeler).reduce((a, b) => a + b, 0);
  const totalDebt = borclar.reduce((a, b) => a + (b.remaining || 0), 0) + kartlar.reduce((a, b) => a + (b.balance || 0), 0);
  const netWorth = totalBalance - totalDebt;

  const chartData = {
    labels: ['Görkem', 'Esra', 'Ortak'],
    datasets: [{
      data: [bakiyeler.gorkem, bakiyeler.esra, bakiyeler.ortak],
      backgroundColor: ['#7c3aed', '#ec4899', '#10b981'],
      borderWidth: 0
    }]
  };

  return (
    <AnimatedPage className="finans-container">
      <header className="module-header glass" style={{ background: 'var(--finans)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">💰</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Finans</h1>
              <p>Net Varlık: {formatMoney(netWorth, privacy)}</p>
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

        <nav className="tab-nav">
          <button className={`tab-btn ${activeTab === 'havuz' ? 'active' : ''}`} onClick={() => setActiveTab('havuz')}>
            <span style={{ fontSize: '16px', marginBottom: '2px' }}>⌛</span>
            <span>Havuz {pool.length > 0 && `(${pool.length})`}</span>
            {activeTab === 'havuz' && <div className="tab-dot" />}
          </button>
          <button className={`tab-btn ${activeTab === 'borclar' ? 'active' : ''}`} onClick={() => setActiveTab('borclar')}>
            <span style={{ fontSize: '16px', marginBottom: '2px' }}>💳</span>
            <span>Borçlar</span>
            {activeTab === 'borclar' && <div className="tab-dot" />}
          </button>
          <button className={`tab-btn ${activeTab === 'analiz' ? 'active' : ''}`} onClick={() => setActiveTab('analiz')}>
            <span style={{ fontSize: '16px', marginBottom: '2px' }}>📊</span>
            <span>Analiz</span>
            {activeTab === 'analiz' && <div className="tab-dot" />}
          </button>
        </nav>
      </header>

      <div className="finans-scroll-content">
        {activeTab === 'havuz' && (
          <div className="pool-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>⌛ Onay Bekleyen Harcamalar</h3>
              <Sparkles size={16} color="#f59e0b" />
            </div>
            {pool.length === 0 ? (
              <div className="empty-pool glass">
                <Check size={48} opacity={0.2} />
                <p>Onay bekleyen harcama yok. Her şey tertemiz! ✨</p>
              </div>
            ) : (
              pool.map(item => (
                <div key={item.id} className="approval-card glass">
                  <div className="ac-info">
                    <strong>{item.title}</strong>
                    <div className="ac-meta">
                      <span className="source-tag">{item.source}</span>
                      <span className="amount">{formatMoney(item.amount, privacy)}</span>
                    </div>
                  </div>
                  <div className="ac-actions">
                    <button className="ac-btn reject" onClick={() => rejectExpense(item.id)}><X size={18} /></button>
                    <button className="ac-btn approve" onClick={() => approveExpense(item.id)}><Check size={18} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'borclar' && (
          <div className="debts-view animate-fadeIn">
             <div className="section-header-v2">
                <h3>💳 Kredi Kartları</h3>
             </div>
             <div className="cards-scroll-x">
                {kartlar.map(card => (
                  <div key={card.id} className="premium-card-visual" style={{ background: card.color || '#1e293b' }}>
                    <div className="cv-top">
                      <strong>{card.bank}</strong>
                      <Landmark size={20} opacity={0.5} />
                    </div>
                    <div className="cv-mid">
                      <span>{privacy ? '•••• •••• ••••' : '**** **** ****'}</span>
                    </div>
                    <div className="cv-bottom">
                      <div className="cv-stat">
                        <small>BORÇ</small>
                        <strong>{formatMoney(card.balance, privacy)}</strong>
                      </div>
                      <div className="cv-stat">
                        <small>LİMİT</small>
                        <strong>{formatMoney(card.limit, privacy)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
             </div>

             <div className="section-header-v2 mt-24">
                <h3>🏦 Krediler & Taksitler</h3>
             </div>
             {borclar.map(loan => {
                const perc = ((loan.total - loan.remaining) / loan.total) * 100;
                return (
                  <div key={loan.id} className="loan-card-premium glass">
                     <div className="lcp-header">
                        <strong>{loan.title}</strong>
                        <span>%{Math.round(perc)}</span>
                     </div>
                     <div className="lcp-bar-bg"><div className="lcp-bar-fill" style={{ width: `${perc}%` }} /></div>
                     <div className="lcp-footer">
                        <small>Kalan: {formatMoney(loan.remaining, privacy)}</small>
                        <button className="pay-btn-mini" onClick={() => payLoanInstallment(loan.id)}>TAKSİT ÖDE</button>
                     </div>
                  </div>
                );
             })}
          </div>
        )}

        {activeTab === 'analiz' && (
          <div className="analiz-view animate-fadeIn">
             <div className="chart-box glass">
                <h3>Varlık Dağılımı</h3>
                <div style={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
                  <Doughnut data={chartData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                </div>
                <div className="chart-legend">
                   <div className="cl-item"><div className="dot" style={{ background: '#7c3aed' }} /> Görkem</div>
                   <div className="cl-item"><div className="dot" style={{ background: '#ec4899' }} /> Esra</div>
                   <div className="cl-item"><div className="dot" style={{ background: '#10b981' }} /> Ortak</div>
                </div>
             </div>
             
             <div className="cash-flow-stats mt-24">
                <div className="cf-card glass income">
                   <TrendingUp size={20} />
                   <div className="cf-info">
                      <small>AYLIK GELİR</small>
                      <strong>{formatMoney(bakiyeler.gorkem + bakiyeler.esra, privacy)}</strong>
                   </div>
                </div>
                <div className="cf-card glass expense">
                   <TrendingDown size={20} />
                   <div className="cf-info">
                      <small>BEKLEYEN HARCAMA</small>
                      <strong>{formatMoney(pool.reduce((a, b) => a + b.amount, 0), privacy)}</strong>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
