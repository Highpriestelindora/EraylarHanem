import React from 'react';
import { Droplets, Calendar, Minus, Plus } from 'lucide-react';
import useStore from '../../store/useStore';

export default function SuTakipTab() {
  const { mutfak, updateWaterLevel, addWaterOrder, addExpense } = useStore();
  const water = mutfak.su || {};
  const level1 = water?.level1 ?? 100;
  const level2 = water?.level2 ?? 100;
  const history = water?.history || [];
  const lastOrder = water?.lastOrder ? new Date(water.lastOrder) : null;

  const calculateDaysLeft = () => {
    const totalLevel = level1 + level2; // 0 - 200 range
    const rate = water.dailyRate || 20;
    const days = Math.floor(totalLevel / rate);
    return days > 0 ? days : 0;
  };

  const isOrderAvailable = () => {
    const now = new Date();
    const day = now.getDay(); // 0: Sunday, 1-6: Mon-Sat
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    const start = 9 * 60; // 09:00
    const end = 18 * 60 + 30; // 18:30
    
    return day !== 0 && currentTime >= start && currentTime <= end;
  };

  const handleOrder = () => {
    if (!isOrderAvailable()) return;
    
    addWaterOrder(2);
    addExpense({ title: '2 Damacana Su', amount: 200, category: 'mutfak', payer: 'ortak' });
    
    // Direct phone call
    window.location.href = "tel:02167064550";
  };

  const available = isOrderAvailable();
  const daysLeft = calculateDaysLeft();

  return (
    <div className="su-tab animate-fadeIn">
      <div className="su-hero glass">
        <div className="su-stats">
          <div className="stat-item">
            <small>Son Sipariş</small>
            <strong>{lastOrder ? lastOrder.toLocaleDateString('tr-TR') : '—'}</strong>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <small>Tahmini Kalan</small>
            <strong>{daysLeft} Gün</strong>
          </div>
        </div>

        <div className="water-tanks">
          <WaterTank label="Mutfak" level={level1} onLevelChange={(v) => updateWaterLevel('level1', v)} />
          <WaterTank label="Yedek" level={level2} onLevelChange={(v) => updateWaterLevel('level2', v)} />
        </div>

        <div className="daily-consumption-ctrl glass">
          <div className="dc-label">
            <strong>WAFFLE-MAYIS SU TÜKETİM</strong>
            <span>%{water.dailyRate || 20}</span>
          </div>
          <div className="dc-btns">
            <button onClick={() => useStore.getState().setWaterDailyRate(Math.max(10, (water.dailyRate || 20) - 10))}>-</button>
            <button onClick={() => useStore.getState().setWaterDailyRate(Math.min(100, (water.dailyRate || 20) + 10))}>+</button>
          </div>
        </div>
        
        <div className="su-actions" style={{ marginTop: '25px' }}>
          <button 
            className={`order-btn ${!available ? 'disabled' : ''}`} 
            onClick={handleOrder}
            disabled={!available}
          >
            <Droplets size={20} />
            <span>{available ? '2 Damacana Söyle (📞)' : 'Sipariş Saatleri Dışında'}</span>
          </button>
        </div>
      </div>

      <div className="history-section">
        <div className="section-header">
          <h4>📦 Sipariş Geçmişi</h4>
          <span className="badge">{history.length} Kayıt</span>
        </div>
        <div className="history-list">
          {history.map((h, i) => (
            <div key={i} className="history-item glass">
              <div className="h-date">
                <Calendar size={14} />
                <span>{new Date(h.dt).toLocaleDateString('tr-TR', { day:'numeric', month:'long' })}</span>
              </div>
              <div className="h-qty">
                <strong>{h.q} Damacana</strong>
              </div>
            </div>
          ))}
          {history.length === 0 && <div className="empty-history">Henüz sipariş kaydı yok.</div>}
        </div>
      </div>
    </div>
  );
}

function WaterTank({ label, level, onLevelChange }) {
  return (
    <div className="tank-container">
      <div className="tank-visual">
        <div className="water-level" style={{ height: `${level}%` }} />
        <span className="level-text">%{level}</span>
      </div>
      <span className="tank-label">{label}</span>
      <div className="tank-ctrl">
        <button onClick={() => onLevelChange(Math.max(0, level - 10))}><Minus size={14} /></button>
        <button onClick={() => onLevelChange(Math.min(100, level + 10))}><Plus size={14} /></button>
      </div>
    </div>
  );
}
