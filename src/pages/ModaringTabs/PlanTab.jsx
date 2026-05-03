import React from 'react';
import { Calendar, Plus, Clock, MapPin } from 'lucide-react';
import useStore from '../../store/useStore';

const PlanTab = () => {
  const modaring = useStore(state => state.modaring);
  const plans = modaring?.planlar || [];

  return (
    <div className="tab-view-content animate-fadeIn">
      <div className="section-header-v2">
        <h3>📅 Etkinlik Planlayıcı</h3>
        <button className="add-btn-mini"><Plus size={14} /></button>
      </div>

      {plans.length === 0 ? (
        <div className="empty-state-card glass">
          <div className="esc-icon">
            <Calendar size={40} color="#fb7185" />
          </div>
          <h4>Henüz Bir Plan Yok</h4>
          <p>Önemli günlerin kombinlerini ve hazırlıklarını buradan yönetebilirsin.</p>
          <button className="esc-btn">Yeni Etkinlik Ekle</button>
        </div>
      ) : (
        <div className="plan-timeline">
          {plans.map(plan => (
            <div key={plan.id} className="plan-item glass">
              <div className="pi-date">
                <strong>{new Date(plan.date).getDate()}</strong>
                <span>{new Date(plan.date).toLocaleString('tr-TR', { month: 'short' })}</span>
              </div>
              <div className="pi-info">
                <strong>{plan.title}</strong>
                <div className="pi-meta">
                  <Clock size={12} /> {plan.time || 'Tüm Gün'}
                  {plan.location && <><MapPin size={12} /> {plan.location}</>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanTab;
