import React from 'react';
import useStore from '../../store/useStore';
import { Car, Fuel, Wrench, FileText, Gauge, TrendingUp } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const formatMoney = (val) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);
};

export default function GarajStatsTab() {
  const { garaj } = useStore();

  const yakit = garaj?.yakit || [];
  const bakim = garaj?.bakim || [];
  const belgeler = garaj?.belgeler || [];

  // Toplam Yakıt
  const toplamYakitTutar = yakit.reduce((sum, y) => sum + (parseFloat(y.tutar || y.cost) || 0), 0);
  const toplamLitre = yakit.reduce((sum, y) => sum + (parseFloat(y.litre || y.liters) || 0), 0);

  // Toplam Bakım
  const toplamBakim = bakim.reduce((sum, b) => sum + (parseFloat(b.tutar || b.cost) || 0), 0);

  // Yakıt Geçmişi Bar Grafiği
  const yakitLabels = yakit.slice(-6).map(y => {
    const d = new Date(y.tarih || y.date);
    return isNaN(d.getTime()) ? 'Kayıt' : d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  });
  const yakitVals = yakit.slice(-6).map(y => parseFloat(y.tutar || y.cost) || 0);

  const fuelChartData = {
    labels: yakitLabels.length ? yakitLabels : ['Kayıt Yok'],
    datasets: [{
      label: 'Yakıt Tutarı (₺)',
      data: yakitVals.length ? yakitVals : [0],
      backgroundColor: '#3b82f6',
      borderRadius: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="garaj-stats-tab">
      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-pill">
          <span className="kpi-label">Toplam Yakıt</span>
          <span className="kpi-value" style={{ color: '#3b82f6' }}>{formatMoney(toplamYakitTutar)}</span>
          <span className="kpi-sub">{toplamLitre.toFixed(1)} Litre Yakıt</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Bakım & Servis</span>
          <span className="kpi-value" style={{ color: '#f59e0b' }}>{formatMoney(toplamBakim)}</span>
          <span className="kpi-sub">{bakim.length} Servis Kaydı</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Araç Belgeleri</span>
          <span className="kpi-value" style={{ color: '#10b981' }}>{belgeler.length} Belge</span>
          <span className="kpi-sub">Muayene / Sigorta / Kasko</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Yakıt Dolumu</span>
          <span className="kpi-value" style={{ color: '#8b5cf6' }}>{yakit.length} Kez</span>
          <span className="kpi-sub">Kayıtlı Dolum</span>
        </div>
      </div>

      <div className="stats-grid-2">
        {/* Yakıt Dolum Grafiği */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Fuel size={18} color="#3b82f6" />
              Son Yakıt Harcamaları
            </span>
            <span className="stat-badge blue">Son İşlemler</span>
          </div>
          <div style={{ height: '220px' }}>
            <Bar data={fuelChartData} options={chartOptions} />
          </div>
        </div>

        {/* Son Bakım & Servis Kayıtları */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Wrench size={18} color="#f59e0b" />
              Araç Bakım Geçmişi
            </span>
            <span className="stat-badge amber">{bakim.length} Kayıt</span>
          </div>
          <div className="progress-list">
            {bakim.length > 0 ? bakim.slice(0, 5).map((b, i) => (
              <div key={b.id || i} className="ranking-item">
                <div>
                  <div style={{ fontWeight: 800 }}>{b.aciklama || b.title || 'Bakım'}</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {b.tarih || 'Tarih yok'} · {b.km ? `${b.km} KM` : 'KM yok'}
                  </span>
                </div>
                <span style={{ fontWeight: 800, color: '#f59e0b' }}>{formatMoney(b.tutar || b.cost)}</span>
              </div>
            )) : (
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                Kayıtlı bakım işlemi bulunmuyor 🚗
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
