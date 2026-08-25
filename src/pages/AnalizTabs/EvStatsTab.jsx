import React from 'react';
import useStore from '../../store/useStore';
import { Home as HomeIcon, Tv, Wrench, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const formatMoney = (val) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);
};

export default function EvStatsTab() {
  const { ev } = useStore();

  const abonelikler = ev?.abonelikler || [];
  const odemeler = ev?.odemeler || [];
  const onarim = ev?.onarim || [];
  const demirbaslar = ev?.demirbaslar || [];
  const bakimlar = ev?.bakimlar || [];

  // Toplam Aylık Abonelik
  const aylikAbonelikTotal = abonelikler.reduce((sum, a) => sum + (parseFloat(a.ucret || a.price) || 0), 0);

  // Toplam Fatura Tutarı
  const toplamFatura = odemeler.reduce((sum, o) => sum + (parseFloat(o.fiyat || o.tutar) || 0), 0);

  // Toplam Onarım Maliyeti
  const toplamOnarim = onarim.reduce((sum, o) => sum + (parseFloat(o.maliyet || o.cost) || 0), 0);

  // Toplam Demirbaş Değeri
  const toplamDemirbas = demirbaslar.reduce((sum, d) => sum + (parseFloat(d.fiyat || d.deger) || 0), 0);

  // Abonelik Dağılım Grafiği
  const aboLabels = abonelikler.map(a => a.isim || a.title || 'Servis');
  const aboVals = abonelikler.map(a => parseFloat(a.ucret || a.price) || 0);

  const aboChartData = {
    labels: aboLabels.length ? aboLabels : ['Abonelik Yok'],
    datasets: [{
      data: aboVals.length ? aboVals : [1],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#64748b'],
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
    <div className="ev-stats-tab">
      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-pill">
          <span className="kpi-label">Aylık Abonelikler</span>
          <span className="kpi-value" style={{ color: '#0284c7' }}>{formatMoney(aylikAbonelikTotal)}</span>
          <span className="kpi-sub">{abonelikler.length} Aktif Abonelik</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Kayıtlı Faturalar</span>
          <span className="kpi-value" style={{ color: '#8b5cf6' }}>{formatMoney(toplamFatura)}</span>
          <span className="kpi-sub">{odemeler.length} Fatura Kalemi</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Onarım & Tadilat</span>
          <span className="kpi-value" style={{ color: '#f59e0b' }}>{formatMoney(toplamOnarim)}</span>
          <span className="kpi-sub">{onarim.length} Kayıtlı İşlem</span>
        </div>

        <div className="kpi-pill">
          <span className="kpi-label">Demirbaş Envanteri</span>
          <span className="kpi-value" style={{ color: '#059669' }}>{formatMoney(toplamDemirbas)}</span>
          <span className="kpi-sub">{demirbaslar.length} Ev Eşyası</span>
        </div>
      </div>

      <div className="stats-grid-2">
        {/* Dijital Abonelikler */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Tv size={18} color="#0284c7" />
              Dijital Abonelik Payları
            </span>
            <span className="stat-badge blue">{abonelikler.length} Servis</span>
          </div>
          <div style={{ height: '220px', position: 'relative' }}>
            <Doughnut data={aboChartData} options={donutOptions} />
          </div>
        </div>

        {/* Onarım ve Tadilat Geçmişi */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <Wrench size={18} color="#f59e0b" />
              Onarım & Tadilat Kayıtları
            </span>
            <span className="stat-badge amber">{onarim.length} Kayıt</span>
          </div>
          <div className="progress-list">
            {onarim.length > 0 ? onarim.slice(0, 5).map((o, i) => (
              <div key={o.id || i} className="ranking-item">
                <div>
                  <div style={{ fontWeight: 800 }}>{o.baslik || o.title || 'Onarım'}</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{o.tarih || 'Tarih yok'} · {o.usta || 'Ev İçi'}</span>
                </div>
                <span style={{ fontWeight: 800, color: '#f59e0b' }}>{formatMoney(o.maliyet || o.cost)}</span>
              </div>
            )) : (
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                Kayıtlı onarım veya tadilat işlemi yok 🛠️
              </div>
            )}
          </div>
        </div>

        {/* Demirbaşlar ve Garanti Durumu */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <ShieldCheck size={18} color="#10b981" />
              Demirbaş Eşyalar & Garanti
            </span>
            <span className="stat-badge green">{demirbaslar.length} Eşya</span>
          </div>
          <div className="progress-list">
            {demirbaslar.length > 0 ? demirbaslar.slice(0, 5).map((d, i) => (
              <div key={d.id || i} className="ranking-item">
                <div>
                  <div style={{ fontWeight: 800 }}>{d.isim || d.title}</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Garanti: {d.garantiBitis || 'Süresiz'}</span>
                </div>
                <span style={{ fontWeight: 800, color: '#059669' }}>{formatMoney(d.fiyat || d.deger)}</span>
              </div>
            )) : (
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                Kayıtlı demirbaş eşya bulunamadı.
              </div>
            )}
          </div>
        </div>

        {/* Periyodik Bakım Takvimi */}
        <div className="stat-card-premium">
          <div className="stat-card-header">
            <span className="stat-card-title">
              <CheckCircle2 size={18} color="#8b5cf6" />
              Periyodik Ev Bakımları
            </span>
            <span className="stat-badge purple">{bakimlar.length} Görev</span>
          </div>
          <div className="progress-list">
            {bakimlar.length > 0 ? bakimlar.slice(0, 5).map((b, i) => (
              <div key={b.id || i} className="ranking-item">
                <div>
                  <div style={{ fontWeight: 800 }}>{b.baslik || b.title}</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Periyot: {b.periyot || 'Aylık'}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: b.tamamlandi ? '#10b981' : '#f59e0b' }}>
                  {b.tamamlandi ? '✅ Yapıldı' : '⏳ Bekliyor'}
                </span>
              </div>
            )) : (
              <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                Tüm ev bakımları tamamlanmış! ✨
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
