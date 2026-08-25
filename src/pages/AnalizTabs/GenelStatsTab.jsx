import React from 'react';
import useStore from '../../store/useStore';
import { 
  TrendingUp, Wallet, ChefHat, Home as HomeIcon, 
  Activity, Car, Heart, ShieldCheck, PieChart, Sparkles, Award
} from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const formatMoney = (val) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);
};

export default function GenelStatsTab({ onSelectTab }) {
  const { finans, mutfak, ev, sosyal, garaj, pet, saglik, kasa } = useStore();

  // 1. Finans & Giderler
  const harcamalar = finans?.harcamalar || [];
  const buAy = new Date().getMonth();
  const buYil = new Date().getFullYear();
  
  const buAyHarcamalar = harcamalar.filter(h => {
    const d = new Date(h.dt || h.tarih);
    return d.getMonth() === buAy && d.getFullYear() === buYil;
  });

  const toplamAylikGider = buAyHarcamalar.reduce((sum, h) => sum + (parseFloat(h.amount) || 0), 0);

  // Kategoriye göre harcama
  const categoryTotals = {};
  buAyHarcamalar.forEach(h => {
    const cat = h.category || 'Diğer';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (parseFloat(h.amount) || 0);
  });

  const catLabels = Object.keys(categoryTotals);
  const catValues = Object.values(categoryTotals);

  const expenseChartData = {
    labels: catLabels.length ? catLabels : ['Henüz Harcama Yok'],
    datasets: [{
      data: catValues.length ? catValues : [1],
      backgroundColor: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#64748b'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // 2. Mutfak Özeti
  const allStock = [...(mutfak?.buzdolabi || []), ...(mutfak?.kiler || []), ...(mutfak?.dondurucu || [])];
  const kritikStokCount = allStock.filter(i => i.cr <= i.mn).length;
  const atlananOgunCount = (mutfak?.atlananOgunler || []).length;
  const tarifCount = (mutfak?.tarifler || []).length;

  // 3. Sosyal Özeti
  const aktiviteler = sosyal?.aktiviteler || [];
  const buAyAktivite = aktiviteler.filter(a => {
    const d = new Date(a.tarih || a.date);
    return d.getMonth() === buAy && d.getFullYear() === buYil;
  });
  const sosyalHarcama = buAyAktivite.reduce((sum, a) => sum + (parseFloat(a.harcama || a.cost) || 0), 0);

  // 4. Ev & Abonelikler
  const abonelikler = ev?.abonelikler || [];
  const aylikAbonelikTotal = abonelikler.reduce((sum, a) => sum + (parseFloat(a.ucret || a.price) || 0), 0);

  // 5. Garaj / Yakıt
  const yakitKayitlari = garaj?.yakit || [];
  const toplamYakitTutar = yakitKayitlari.reduce((sum, y) => sum + (parseFloat(y.tutar || y.cost) || 0), 0);

  // 6. Net Varlık / Kasa
  const bakiyeler = kasa?.bakiyeler || {};
  const toplamKasa = Object.values(bakiyeler).reduce((a, b) => a + (Number(b) || 0), 0);

  const donutOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'Outfit', size: 11 }, boxWidth: 10 } }
    },
    cutout: '70%',
    maintainAspectRatio: false
  };

  return (
    <div className="genel-stats-tab">
      {/* Top High-level KPIs */}
      <div className="kpi-row">
        <div className="kpi-pill" onClick={() => onSelectTab('finans')} style={{ cursor: 'pointer' }}>
          <span className="kpi-label">Bu Ay Toplam Gider</span>
          <span className="kpi-value" style={{ color: '#6d28d9' }}>{formatMoney(toplamAylikGider)}</span>
          <span className="kpi-sub">{buAyHarcamalar.length} işlem kaydı</span>
        </div>

        <div className="kpi-pill" onClick={() => onSelectTab('mutfak')} style={{ cursor: 'pointer' }}>
          <span className="kpi-label">Mutfak & Stok</span>
          <span className="kpi-value" style={{ color: '#059669' }}>{allStock.length} Ürün</span>
          <span className={`kpi-sub ${kritikStokCount > 0 ? 'warning' : ''}`}>
            {kritikStokCount > 0 ? `⚠️ ${kritikStokCount} ürün azaldı` : '✅ Stoklar tam'}
          </span>
        </div>

        <div className="kpi-pill" onClick={() => onSelectTab('sosyal')} style={{ cursor: 'pointer' }}>
          <span className="kpi-label">Sosyal Etkinlik</span>
          <span className="kpi-value" style={{ color: '#db2777' }}>{aktiviteler.length} Aktivite</span>
          <span className="kpi-sub">Bu ay {formatMoney(sosyalHarcama)}</span>
        </div>

        <div className="kpi-pill" onClick={() => onSelectTab('ev')} style={{ cursor: 'pointer' }}>
          <span className="kpi-label">Aylık Abonelikler</span>
          <span className="kpi-value" style={{ color: '#0284c7' }}>{formatMoney(aylikAbonelikTotal)}</span>
          <span className="kpi-sub">{abonelikler.length} aktif servis</span>
        </div>
      </div>

      <div className="stats-grid-2">
        {/* Aylık Gider Dağılımı Grafiği */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <PieChart size={18} color="#8b5cf6" />
              Bu Ayki Harcama Dağılımı
            </span>
            <span className="stat-badge purple">{catLabels.length} Kategori</span>
          </div>
          <div style={{ height: '220px', position: 'relative' }}>
            <Doughnut data={expenseChartData} options={donutOptions} />
          </div>
        </div>

        {/* Modüller Hızlı Durum Panosu */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Sparkles size={18} color="#f59e0b" />
              Modül Özetleri
            </span>
            <span className="stat-badge green">Canlı Senkron</span>
          </div>

          <div className="progress-list">
            <div className="ranking-item" onClick={() => onSelectTab('mutfak')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🍳</span>
                <div>
                  <div style={{ fontWeight: 800 }}>Mutfak & Yemek</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{tarifCount} tarif, {atlananOgunCount} atlanan öğün</span>
                </div>
              </div>
              <span style={{ color: '#059669', fontWeight: 800, fontSize: '12px' }}>Detay &gt;</span>
            </div>

            <div className="ranking-item" onClick={() => onSelectTab('sosyal')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🎭</span>
                <div>
                  <div style={{ fontWeight: 800 }}>Sosyal & Rutinler</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{aktiviteler.length} etkinlik puanlandı</span>
                </div>
              </div>
              <span style={{ color: '#db2777', fontWeight: 800, fontSize: '12px' }}>Detay &gt;</span>
            </div>

            <div className="ranking-item" onClick={() => onSelectTab('garaj')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🚗</span>
                <div>
                  <div style={{ fontWeight: 800 }}>Garaj & Araç</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Toplam {formatMoney(toplamYakitTutar)} yakıt</span>
                </div>
              </div>
              <span style={{ color: '#3b82f6', fontWeight: 800, fontSize: '12px' }}>Detay &gt;</span>
            </div>

            <div className="ranking-item" onClick={() => onSelectTab('pet')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🐾</span>
                <div>
                  <div style={{ fontWeight: 800 }}>Waffle & Mayıs (Pet)</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Aşılar & Kilo takipleri güncel</span>
                </div>
              </div>
              <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '12px' }}>Detay &gt;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
