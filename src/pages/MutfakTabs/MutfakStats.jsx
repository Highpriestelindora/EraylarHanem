import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import useStore from '../../store/useStore';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function MutfakStats() {
  const { mutfak, finans } = useStore();

  // 1. Stok Sağlığı (Normal, Kritik, Bitti)
  const allStock = [...mutfak.buzdolabi, ...mutfak.kiler, ...mutfak.dondurucu];
  let normal = 0, kritik = 0, bitti = 0;
  allStock.forEach(item => {
    if (item.cr <= 0) bitti++;
    else if (item.cr <= item.mn) kritik++;
    else normal++;
  });

  const healthData = {
    labels: ['İyi Durumda', 'Kritik (Azalan)', 'Bitti'],
    datasets: [{
      data: [normal, kritik, bitti],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // 2. Mutfak Harcamaları (Son 5 İşlem)
  // Gider history'den mutfak kategorisini çekelim
  const mutfakHarcamalar = (finans?.harcamalar || []).filter(h => h.category === 'Mutfak').slice(0, 5);
  const harcamaLabels = mutfakHarcamalar.map(h => {
    const d = new Date(h.dt);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  }).reverse();
  const harcamaDataVals = mutfakHarcamalar.map(h => parseFloat(h.amount) || 0).reverse();

  const expenseData = {
    labels: harcamaLabels.length ? harcamaLabels : ['Veri Yok'],
    datasets: [{
      label: 'Harcama (₺)',
      data: harcamaDataVals.length ? harcamaDataVals : [0],
      backgroundColor: 'rgba(239, 68, 68, 0.7)',
      borderRadius: 6,
    }]
  };

  const expenseOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  // 3. Market Dağılımı (Mevcut Stok üzerinden)
  const marketCounts = {};
  allStock.forEach(item => {
    const mk = item.mk || 'BİM';
    marketCounts[mk] = (marketCounts[mk] || 0) + 1;
  });
  const mkLabels = Object.keys(marketCounts);
  const mkVals = Object.values(marketCounts);

  const marketData = {
    labels: mkLabels.length ? mkLabels : ['BİM'],
    datasets: [{
      data: mkVals.length ? mkVals : [1],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const donutOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'Outfit' }, boxWidth: 12 } }
    },
    cutout: '65%'
  };

  return (
    <div className="mutfak-stats-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass" style={{ padding: '20px', borderRadius: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--txt)', marginBottom: '16px', fontSize: '16px' }}>
          <PieChartIcon size={18} color="var(--mutfak)" /> Stok Sağlığı
        </h3>
        <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
          <Doughnut data={healthData} options={donutOptions} />
        </div>
      </div>

      <div className="glass" style={{ padding: '20px', borderRadius: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--txt)', marginBottom: '16px', fontSize: '16px' }}>
          <TrendingUp size={18} color="var(--danger)" /> Son Mutfak Harcamaları
        </h3>
        <div style={{ height: '220px' }}>
          <Bar data={expenseData} options={expenseOptions} />
        </div>
      </div>

      <div className="glass" style={{ padding: '20px', borderRadius: '24px', marginBottom: '40px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--txt)', marginBottom: '16px', fontSize: '16px' }}>
          <PieChartIcon size={18} color="var(--sec)" /> Market Dağılımı
        </h3>
        <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
          <Doughnut data={marketData} options={donutOptions} />
        </div>
      </div>

    </div>
  );
}
