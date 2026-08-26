import React from 'react';
import useStore from '../../store/useStore';
import { Wallet, PieChart, CreditCard, Landmark, Users, TrendingDown } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const formatMoney = (val) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);
};

export default function FinansStatsTab() {
  const { finans, kasa } = useStore();

  const harcamalar = finans?.harcamalar || [];
  const buAy = new Date().getMonth();
  const buYil = new Date().getFullYear();

  const buAyHarcamalar = harcamalar.filter(h => {
    const d = new Date(h.dt || h.tarih);
    return d.getMonth() === buAy && d.getFullYear() === buYil;
  });

  const toplamAylikGider = buAyHarcamalar.reduce((sum, h) => sum + (parseFloat(h.amount) || 0), 0);

  // 1. Kategori Dağılımı
  const categoryTotals = {};
  buAyHarcamalar.forEach(h => {
    const cat = h.category || 'Diğer';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (parseFloat(h.amount) || 0);
  });
  const catLabels = Object.keys(categoryTotals);
  const catValues = Object.values(categoryTotals);

  const categoryChartData = {
    labels: catLabels.length ? catLabels : ['Harcama Yok'],
    datasets: [{
      data: catValues.length ? catValues : [1],
      backgroundColor: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#64748b'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // 2. Görkem vs Esra Ödeme Payı
  let gorkemSpend = 0, esraSpend = 0;
  buAyHarcamalar.forEach(h => {
    const p = (h.payer || '').toLowerCase();
    const amt = parseFloat(h.amount) || 0;
    if (p.includes('esra')) esraSpend += amt;
    else gorkemSpend += amt;
  });

  const totalSpend = gorkemSpend + esraSpend || 1;
  const gorkemPct = Math.round((gorkemSpend / totalSpend) * 100);
  const esraPct = 100 - gorkemPct;

  // 3. Kredi Kartları
  const kartlar = finans?.kartlar || [];
  const toplamKartBorc = kartlar.reduce((sum, k) => sum + (parseFloat(k.balance) || 0), 0);
  const toplamKartLimit = kartlar.reduce((sum, k) => sum + (parseFloat(k.limit) || 0), 0);

  // 4. Kasa & Varlıklar
  const bakiyeler = kasa?.bakiyeler || {};
  const toplamKasa = Object.values(bakiyeler).reduce((a, b) => a + (Number(b) || 0), 0);

  // 5. Borçlar
  const borclar = finans?.borclar || [];
  const toplamKalanBorc = borclar.reduce((sum, b) => sum + (parseFloat(b.remaining) || 0), 0);

  const donutOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'Outfit', size: 11 }, boxWidth: 10 } }
    },
    cutout: '68%',
    maintainAspectRatio: false
  };

  return (
    <div className="finans-stats-tab">
      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-pill">
          <span className="kpi-label">Bu Ay Harcama</span>
          <span className="kpi-value" style={{ color: '#ef4444' }}>{formatMoney(toplamAylikGider)}</span>
          <span className="kpi-sub">{buAyHarcamalar.length} Kalem Harcama</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Kart Borç Toplamı</span>
          <span className="kpi-value" style={{ color: '#f59e0b' }}>{formatMoney(toplamKartBorc)}</span>
          <span className="kpi-sub">{kartlar.length} Kredi Kartı</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Kalan Kredi/Borç</span>
          <span className="kpi-value" style={{ color: '#6d28d9' }}>{formatMoney(toplamKalanBorc)}</span>
          <span className="kpi-sub">{borclar.length} Kredi Hesabı</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Toplam Kasa Varlık</span>
          <span className="kpi-value" style={{ color: '#10b981' }}>{formatMoney(toplamKasa)}</span>
          <span className="kpi-sub">Banka & Birikim</span>
        </div>
      </div>

      <div className="stats-grid-2">
        {/* Kategori Harcamaları */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <PieChart size={18} color="#8b5cf6" />
              Kategori Bazlı Harcamalar
            </span>
            <span className="stat-badge purple">{catLabels.length} Kategori</span>
          </div>
          <div style={{ height: '220px', position: 'relative' }}>
            <Doughnut data={categoryChartData} options={donutOptions} />
          </div>
        </div>

        {/* Görkem vs Esra Ödeme Paylaşımı */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Users size={18} color="#ec4899" />
              Ödeme Paylaşımı
            </span>
            <span className="stat-badge red">Bu Ay</span>
          </div>

          <div style={{ padding: '10px 0' }}>
            <div className="user-split-legend">
              <span style={{ color: '#6d28d9' }}>👨‍💻 Görkem: {formatMoney(gorkemSpend)} (%{gorkemPct})</span>
              <span style={{ color: '#db2777' }}>👩‍🍳 Esra: {formatMoney(esraSpend)} (%{esraPct})</span>
            </div>

            <div className="user-split-bar">
              <div className="user-split-segment gorkem" style={{ width: `${gorkemPct}%` }} />
              <div className="user-split-segment esra" style={{ width: `${esraPct}%` }} />
            </div>
          </div>

          <div className="progress-list" style={{ marginTop: '10px' }}>
            {buAyHarcamalar.slice(0, 4).map((h, i) => (
              <div key={h.id || i} className="ranking-item">
                <div>
                  <div style={{ fontWeight: 800 }}>{h.title || 'Harcama'}</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{h.payer} · {h.category}</span>
                </div>
                <span style={{ fontWeight: 900, color: '#ef4444' }}>{formatMoney(h.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kredi Kartı Limit Kullanımları */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <CreditCard size={18} color="#3b82f6" />
              Kredi Kartı Doluluk Oranları
            </span>
            <span className="stat-badge blue">{kartlar.length} Kart</span>
          </div>
          <div className="progress-list">
            {kartlar.map(k => {
              const balance = parseFloat(k.balance) || 0;
              const limit = parseFloat(k.limit) || 1;
              const ratio = Math.min(100, Math.round((balance / limit) * 100));
              return (
                <div key={k.id} className="progress-item">
                  <div className="progress-info">
                    <span>{k.name} ({k.owner || 'Ortak'})</span>
                    <span>{formatMoney(balance)} / {formatMoney(limit)} (%{ratio})</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${ratio}%`, 
                        background: ratio > 80 ? '#ef4444' : (ratio > 50 ? '#f59e0b' : '#3b82f6') 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kredi / Taksit İlerlemeleri */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <TrendingDown size={18} color="#10b981" />
              Krediler & Taksitler
            </span>
            <span className="stat-badge green">{borclar.length} Hesap</span>
          </div>
          <div className="progress-list">
            {borclar.length > 0 ? borclar.map(b => {
              const remaining = parseFloat(b.remaining) || 0;
              const total = parseFloat(b.total) || 1;
              const paidPct = Math.min(100, Math.round(((total - remaining) / total) * 100));
              return (
                <div key={b.id} className="progress-item">
                  <div className="progress-info">
                    <span>{b.name}</span>
                    <span>Kalan: {formatMoney(remaining)} (%{paidPct} Ödendi)</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${paidPct}%`, background: '#10b981' }} />
                  </div>
                </div>
              );
            }) : (
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                Kayıtlı aktif kredi veya borç bulunmuyor 🎉
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
