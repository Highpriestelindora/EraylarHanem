import React from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Banknote } from 'lucide-react';
import useStore from '../../store/useStore';

const KasaTab = () => {
  const modaring = useStore(state => state.modaring);
  const kasa = modaring?.kasa || [];

  return (
    <div className="tab-view-content animate-fadeIn">
      <div className="section-header-v2">
        <h3>💰 Kasa Defteri</h3>
        <button className="add-btn-mini"><Plus size={14} /></button>
      </div>

      <div className="trend-stats-grid">
        <div className="stat-card glass">
          <Banknote size={20} color="#10b981" />
          <div className="stat-info">
            <small>Nakit Kasa</small>
            <strong>0.00 TL</strong>
          </div>
        </div>
        <div className="stat-card glass">
          <CreditCard size={20} color="#3b82f6" />
          <div className="stat-info">
            <small>POS Toplam</small>
            <strong>0.00 TL</strong>
          </div>
        </div>
      </div>

      <div className="section-header-v2 mt-20">
        <h3>📊 Son İşlemler</h3>
      </div>

      {kasa.length === 0 ? (
        <div className="empty-state-card glass">
          <div className="esc-icon">
            <Wallet size={40} color="#fb7185" />
          </div>
          <h4>Kasa Henüz Boş</h4>
          <p>Günlük satış veya harcama girişi yaparak başlayabilirsin.</p>
          <button className="esc-btn">Yeni İşlem Ekle</button>
        </div>
      ) : (
        <div className="kasa-list">
          {kasa.map(item => (
            <div key={item.id} className="kasa-item glass">
              <div className={`ki-icon ${item.type === 'in' ? 'in' : 'out'}`}>
                {item.type === 'in' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
              </div>
              <div className="ki-info">
                <strong>{item.note}</strong>
                <small>{item.date} · {item.method}</small>
              </div>
              <div className={`ki-amount ${item.type === 'in' ? 'text-green' : 'text-red'}`}>
                {item.type === 'in' ? '+' : '-'}{item.amount} TL
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KasaTab;
