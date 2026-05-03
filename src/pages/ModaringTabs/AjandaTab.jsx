import React from 'react';
import { Calendar, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import useStore from '../../store/useStore';

const AjandaTab = () => {
  const modaring = useStore(state => state.modaring);
  const ajanda = modaring?.ajanda || [];

  return (
    <div className="tab-view-content animate-fadeIn">
      <div className="section-header-v2">
        <h3>📅 Dükkan Ajandası</h3>
        <button className="add-btn-mini"><Plus size={14} /></button>
      </div>

      {ajanda.length === 0 ? (
        <div className="empty-state-card glass">
          <div className="esc-icon">
            <Calendar size={40} color="#fb7185" />
          </div>
          <h4>Ajanda Boş</h4>
          <p>Kredi kartı ödeme günleri ve önemli dükkan tarihlerini buraya ekle.</p>
          <button className="esc-btn">Yeni Hatırlatıcı</button>
        </div>
      ) : (
        <div className="ajanda-list">
          {ajanda.map(item => (
            <div key={item.id} className={`ajanda-item glass ${item.status === 'done' ? 'completed' : ''}`}>
              <div className="ai-status">
                {item.status === 'done' ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#f59e0b" />}
              </div>
              <div className="ai-info">
                <strong>{item.title}</strong>
                <small>{item.dueDate}</small>
              </div>
              <div className="ai-amount">{item.amount} TL</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AjandaTab;
