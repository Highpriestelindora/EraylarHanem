import React from 'react';
import useStore from '../../store/useStore';
import { Activity, PieChart, Star, Heart, Award, Calendar, Sparkles } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const formatMoney = (val) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);
};

export default function SosyalStatsTab() {
  const { sosyal } = useStore();

  const aktiviteler = sosyal?.aktiviteler || [];
  const rutinler = sosyal?.rutinler || [];
  const paketler = sosyal?.rutinPaketleri || [];

  // Toplam Harcama
  const toplamSosyalHarcama = aktiviteler.reduce((sum, a) => sum + (parseFloat(a.harcama || a.cost) || 0), 0);

  // Ortalama Puanlar
  let gorkemPuanSum = 0, esraPuanSum = 0, ratedCount = 0;
  aktiviteler.forEach(a => {
    const pg = parseFloat(a.puan_gorkem);
    const pe = parseFloat(a.puan_esra);
    if (!isNaN(pg) && pg > 0) gorkemPuanSum += pg;
    if (!isNaN(pe) && pe > 0) esraPuanSum += pe;
    if ((!isNaN(pg) && pg > 0) || (!isNaN(pe) && pe > 0)) ratedCount++;
  });

  const gorkemAvg = ratedCount > 0 ? (gorkemPuanSum / ratedCount).toFixed(1) : '5.0';
  const esraAvg = ratedCount > 0 ? (esraPuanSum / ratedCount).toFixed(1) : '5.0';

  // Tür Dağılımı
  const typeCounts = {};
  aktiviteler.forEach(a => {
    const t = a.tur || a.type || 'Genel';
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });
  const typeLabels = Object.keys(typeCounts);
  const typeVals = Object.values(typeCounts);

  const typeChartData = {
    labels: typeLabels.length ? typeLabels : ['Kayıt Yok'],
    datasets: [{
      data: typeVals.length ? typeVals : [1],
      backgroundColor: ['#db2777', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#64748b'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const donutOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'Outfit', size: 11 }, boxWidth: 10 } }
    },
    cutout: '68%',
    maintainAspectRatio: false
  };

  return (
    <div className="sosyal-stats-tab">
      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-pill">
          <span className="kpi-label">Toplam Etkinlik</span>
          <span className="kpi-value" style={{ color: '#db2777' }}>{aktiviteler.length}</span>
          <span className="kpi-sub">Kayıtlı Anı</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Sosyal Bütçe</span>
          <span className="kpi-value" style={{ color: '#8b5cf6' }}>{formatMoney(toplamSosyalHarcama)}</span>
          <span className="kpi-sub">Toplam Harcama</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Görkem Puanı</span>
          <span className="kpi-value" style={{ color: '#7c3aed' }}>⭐ {gorkemAvg}</span>
          <span className="kpi-sub">Ortalama Memnuniyet</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Esra Puanı</span>
          <span className="kpi-value" style={{ color: '#e11d48' }}>⭐ {esraAvg}</span>
          <span className="kpi-sub">Ortalama Memnuniyet</span>
        </div>
      </div>

      <div className="stats-grid-2">
        {/* Etkinlik Türleri */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <PieChart size={18} color="#db2777" />
              Etkinlik Türü Dağılımı
            </span>
            <span className="stat-badge red">{typeLabels.length} Tür</span>
          </div>
          <div style={{ height: '220px', position: 'relative' }}>
            <Doughnut data={typeChartData} options={donutOptions} />
          </div>
        </div>

        {/* Son Etkinlikler ve Yorumlar */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Sparkles size={18} color="#f59e0b" />
              Son Etkinlikler & Puanlar
            </span>
            <span className="stat-badge amber">Anılar</span>
          </div>
          <div className="progress-list">
            {aktiviteler.length > 0 ? aktiviteler.slice(0, 4).map((a, i) => (
              <div key={a.id || i} className="ranking-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{a.emoji || '🎭'}</span>
                  <div>
                    <div style={{ fontWeight: 800 }}>{a.baslik || a.title}</div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {a.tarih || 'Tarih yok'} · 👨‍💻 {a.puan_gorkem || 5}⭐ / 👩‍🍳 {a.puan_esra || 5}⭐
                    </span>
                  </div>
                </div>
                <span style={{ fontWeight: 800, color: '#db2777' }}>{formatMoney(a.harcama)}</span>
              </div>
            )) : (
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                Henüz sosyal etkinlik kaydedilmedi 🎭
              </div>
            )}
          </div>
        </div>

        {/* Rutinler & Alışkanlıklar */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Calendar size={18} color="#10b981" />
              Sosyal Rutinler
            </span>
            <span className="stat-badge green">{rutinler.length} Rutin</span>
          </div>
          <div className="progress-list">
            {rutinler.length > 0 ? rutinler.map(r => (
              <div key={r.id} className="progress-item">
                <div className="progress-info">
                  <span>{r.emoji || '✨'} {r.baslik || r.title}</span>
                  <span style={{ color: r.tamamlandi ? '#10b981' : '#f59e0b' }}>
                    {r.tamamlandi ? 'Tamamlandı ✅' : 'Devam Ediyor ⏳'}
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: r.tamamlandi ? '100%' : '35%', background: '#10b981' }} />
                </div>
              </div>
            )) : (
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                Kayıtlı rutin bulunmuyor.
              </div>
            )}
          </div>
        </div>

        {/* Rutin Paketleri */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Award size={18} color="#8b5cf6" />
              Rutin Paketleri
            </span>
            <span className="stat-badge purple">{paketler.length} Paket</span>
          </div>
          <div className="progress-list">
            {paketler.length > 0 ? paketler.map(p => (
              <div key={p.id} className="ranking-item">
                <div>
                  <div style={{ fontWeight: 800 }}>{p.baslik || p.title}</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{p.kategori || 'Genel'}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#8b5cf6' }}>{p.seviye || 'Aktif'}</span>
              </div>
            )) : (
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                Kayıtlı paket bulunmuyor.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
