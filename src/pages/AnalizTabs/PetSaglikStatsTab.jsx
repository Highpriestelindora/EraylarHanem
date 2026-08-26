import React from 'react';
import useStore from '../../store/useStore';
import { Heart, Activity, Syringe, Scale, Moon, Calendar } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function PetSaglikStatsTab() {
  const { pet, saglik } = useStore();

  const asilar = pet?.asilar || [];
  const agirlik = pet?.agirlik || [];
  const ilaclar = saglik?.ilaclar || [];
  const randevular = saglik?.randevular || [];
  const sleepGoals = saglik?.sleepGoals || { target: 8, gorkem: 7.5, esra: 8 };

  // Waffle ve Mayıs Ağırlık Verileri
  const waffleWeights = agirlik.filter(a => (a.pet || '').toLowerCase().includes('waffle')).slice(-5);
  const mayisWeights = agirlik.filter(a => (a.pet || '').toLowerCase().includes('mayis') || (a.pet || '').toLowerCase().includes('pamuk')).slice(-5);

  const weightLabels = (waffleWeights.length ? waffleWeights : mayisWeights).map(w => {
    const d = new Date(w.tarih || w.date);
    return isNaN(d.getTime()) ? 'Kayıt' : d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  });

  const petWeightChartData = {
    labels: weightLabels.length ? weightLabels : ['Kayıt 1', 'Kayıt 2', 'Kayıt 3'],
    datasets: [
      {
        label: '🐶 Waffle (kg)',
        data: waffleWeights.length ? waffleWeights.map(w => parseFloat(w.kilo || w.weight) || 0) : [12.5, 12.8, 13.0],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: '🐈 Mayıs (kg)',
        data: mayisWeights.length ? mayisWeights.map(w => parseFloat(w.kilo || w.weight) || 0) : [4.2, 4.3, 4.4],
        borderColor: '#db2777',
        backgroundColor: 'rgba(219, 39, 119, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'Outfit', size: 11 }, boxWidth: 12 } }
    },
    scales: {
      y: { grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="pet-saglik-stats-tab">
      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-pill">
          <span className="kpi-label">Pet Aşıları</span>
          <span className="kpi-value" style={{ color: '#f59e0b' }}>{asilar.length} Aşı</span>
          <span className="kpi-sub">Waffle 🐶 & Mayıs 🐈</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Kilo Takipleri</span>
          <span className="kpi-value" style={{ color: '#db2777' }}>{agirlik.length} Ölçüm</span>
          <span className="kpi-sub">Düzenli Tartım</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Sağlık Randevuları</span>
          <span className="kpi-value" style={{ color: '#059669' }}>{randevular.length} Randevu</span>
          <span className="kpi-sub">Doktor & Kontrol</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Aktif İlaçlar</span>
          <span className="kpi-value" style={{ color: '#3b82f6' }}>{ilaclar.length} İlaç/Vitamin</span>
          <span className="kpi-sub">Düzenli Takip</span>
        </div>
      </div>

      <div className="stats-grid-2">
        {/* Pet Kilo Takip Grafiği */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Scale size={18} color="#f59e0b" />
              Pet Kilo Gelişimi (kg)
            </span>
            <span className="stat-badge amber">Kilo Trendi</span>
          </div>
          <div style={{ height: '220px' }}>
            <Line data={petWeightChartData} options={lineOptions} />
          </div>
        </div>

        {/* Pet Aşı Durumları */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Syringe size={18} color="#db2777" />
              Aşı Takvimi & Kayıtlar
            </span>
            <span className="stat-badge red">{asilar.length} Aşı</span>
          </div>
          <div className="progress-list">
            {asilar.length > 0 ? asilar.slice(0, 5).map((a, i) => (
              <div key={a.id || i} className="ranking-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{(a.pet || '').toLowerCase().includes('waffle') ? '🐶' : '🐈'}</span>
                  <div>
                    <div style={{ fontWeight: 800 }}>{a.asi || a.name || 'Aşı'}</div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {a.pet || 'Pet'} · {a.tarih || 'Tarih belirtilmedi'}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>✅ Yapıldı</span>
              </div>
            )) : (
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                Kayıtlı aşı bilgisi bulunmuyor 🐾
              </div>
            )}
          </div>
        </div>

        {/* Uyku & Sağlık Hedefleri */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Moon size={18} color="#8b5cf6" />
              Uyku & Yaşam Düzeni
            </span>
            <span className="stat-badge purple">Hedef {sleepGoals.target || 8} Saat</span>
          </div>
          <div className="progress-list">
            <div className="progress-item">
              <div className="progress-info">
                <span>👨‍💻 Görkem Ortalama Uyku</span>
                <span>{sleepGoals.gorkem || 7.5} Saat / {sleepGoals.target || 8} Saat</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(100, Math.round(((sleepGoals.gorkem || 7.5) / (sleepGoals.target || 8)) * 100))}%`, background: '#8b5cf6' }} />
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-info">
                <span>👩‍🍳 Esra Ortalama Uyku</span>
                <span>{sleepGoals.esra || 8} Saat / {sleepGoals.target || 8} Saat</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(100, Math.round(((sleepGoals.esra || 8) / (sleepGoals.target || 8)) * 100))}%`, background: '#db2777' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Sağlık Randevuları */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Calendar size={18} color="#059669" />
              Sağlık Randevuları & Takip
            </span>
            <span className="stat-badge green">{randevular.length} Randevu</span>
          </div>
          <div className="progress-list">
            {randevular.length > 0 ? randevular.slice(0, 4).map((r, i) => (
              <div key={r.id || i} className="ranking-item">
                <div>
                  <div style={{ fontWeight: 800 }}>{r.doktor || r.hastane || 'Kontrol'}</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{r.tarih || 'Tarih yok'} · {r.kisi || 'Aile'}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669' }}>Randevu</span>
              </div>
            )) : (
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                Kayıtlı randevu bulunamadı.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
