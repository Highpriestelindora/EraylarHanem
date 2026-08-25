import React from 'react';
import useStore from '../../store/useStore';
import { ChefHat, PieChart, TrendingUp, Droplets, FastForward, ShoppingBag, Utensils } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const formatMoney = (val) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);
};

export default function MutfakStatsTab() {
  const { mutfak, finans } = useStore();

  // 1. Stok Sağlığı
  const allStock = [...(mutfak?.buzdolabi || []), ...(mutfak?.kiler || []), ...(mutfak?.dondurucu || [])];
  let normal = 0, kritik = 0, bitti = 0;
  allStock.forEach(item => {
    if (item.cr <= 0) bitti++;
    else if (item.cr <= item.mn) kritik++;
    else normal++;
  });

  const stockHealthData = {
    labels: ['İyi Durumda', 'Azalan (Kritik)', 'Bitenler'],
    datasets: [{
      data: [normal, kritik, bitti],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // 2. Öğün Atlama Analizi
  const atlananOgunler = mutfak?.atlananOgunler || [];
  const reasonCounts = {};
  atlananOgunler.forEach(item => {
    const r = item.reason || 'Belirtilmedi';
    reasonCounts[r] = (reasonCounts[r] || 0) + 1;
  });

  const reasonLabels = Object.keys(reasonCounts);
  const reasonVals = Object.values(reasonCounts);

  const skipChartData = {
    labels: reasonLabels.length ? reasonLabels : ['Kayıt Yok'],
    datasets: [{
      data: reasonVals.length ? reasonVals : [1],
      backgroundColor: ['#8b5cf6', '#ec4899', '#3b82f6', '#14b8a6', '#f97316', '#64748b'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // 3. Sipariş & Dışarıda Yemek Analizi
  const siparisler = mutfak?.siparisler || [];
  const toplamSiparisTutar = siparisler.reduce((sum, s) => sum + (parseFloat(s.pr || s.ne_kadar) || 0), 0);

  // Market Dağılımı
  const marketCounts = {};
  allStock.forEach(item => {
    const mk = item.mk || 'BİM';
    marketCounts[mk] = (marketCounts[mk] || 0) + 1;
  });
  const mkLabels = Object.keys(marketCounts);
  const mkVals = Object.values(marketCounts);

  const marketChartData = {
    labels: mkLabels.length ? mkLabels : ['BİM'],
    datasets: [{
      data: mkVals.length ? mkVals : [1],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#64748b'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // Tarif Kategorileri
  const tarifler = mutfak?.tarifler || [];
  const categoryCounts = {};
  tarifler.forEach(t => {
    const cat = t.c || 'Genel';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const donutOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'Outfit', size: 11 }, boxWidth: 10 } }
    },
    cutout: '68%',
    maintainAspectRatio: false
  };

  return (
    <div className="mutfak-stats-tab">
      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-pill">
          <span className="kpi-label">Kayıtlı Tarif</span>
          <span className="kpi-value" style={{ color: '#059669' }}>{tarifler.length}</span>
          <span className="kpi-sub">Favoriler: {tarifler.filter(t => t.f).length}</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Atlanan Öğün</span>
          <span className="kpi-value" style={{ color: '#8b5cf6' }}>{atlananOgunler.length}</span>
          <span className="kpi-sub">Kayıtlı geçmiş</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Dışarı Siparişler</span>
          <span className="kpi-value" style={{ color: '#f59e0b' }}>{formatMoney(toplamSiparisTutar)}</span>
          <span className="kpi-sub">{siparisler.length} sipariş kaydı</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Su Tüketim Hızı</span>
          <span className="kpi-value" style={{ color: '#0284c7' }}>%{mutfak?.su?.dailyRate || 20}/gün</span>
          <span className="kpi-sub">Damacana Seviyesi: %{mutfak?.su?.level1 || 100}</span>
        </div>
      </div>

      <div className="stats-grid-2">
        {/* Stok Sağlığı */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <PieChart size={18} color="#10b981" />
              Stok Sağlık Durumu
            </span>
            <span className="stat-badge green">{allStock.length} Kalem</span>
          </div>
          <div style={{ height: '220px', position: 'relative' }}>
            <Doughnut data={stockHealthData} options={donutOptions} />
          </div>
        </div>

        {/* Öğün Atlama Nedenleri */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <FastForward size={18} color="#8b5cf6" />
              Öğün Atlama Nedenleri
            </span>
            <span className="stat-badge purple">{atlananOgunler.length} Toplam</span>
          </div>
          <div style={{ height: '220px', position: 'relative' }}>
            {atlananOgunler.length > 0 ? (
              <Doughnut data={skipChartData} options={donutOptions} />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '13px' }}>
                Henüz atlanan öğün kaydı yok ✨
              </div>
            )}
          </div>
        </div>

        {/* Market Dağılımı */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <ShoppingBag size={18} color="#3b82f6" />
              Tedarik Edilen Marketler
            </span>
            <span className="stat-badge blue">{mkLabels.length} Market</span>
          </div>
          <div style={{ height: '220px', position: 'relative' }}>
            <Doughnut data={marketChartData} options={donutOptions} />
          </div>
        </div>

        {/* Tarif Kategorileri */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Utensils size={18} color="#ec4899" />
              Tarif Kitaplığı Dağılımı
            </span>
            <span className="stat-badge red">{tarifler.length} Tarif</span>
          </div>
          <div className="progress-list">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / (tarifler.length || 1)) * 100);
              return (
                <div key={cat} className="progress-item">
                  <div className="progress-info">
                    <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    <span>{count} adet ({pct}%)</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: '#ec4899' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
