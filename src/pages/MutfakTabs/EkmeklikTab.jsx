import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, Wheat, ShoppingCart } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

function BreadShopModal({ onClose, onConfirm }) {
  const [type, setType] = useState('Somun');
  const [qty, setQty] = useState(1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()} style={{ maxWidth: '350px' }}>
        <div className="modal-header">
          <h4>🍞 Ekmek Alışverişi</h4>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
          <div className="form-group">
            <label style={{ fontSize: '12px', fontWeight: '800', opacity: 0.7 }}>Ekmek Çeşidi</label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', marginTop: '5px' }}
            >
              {Object.keys(SHELF_LIFE).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '12px', fontWeight: '800', opacity: 0.7 }}>Kaç Adet?</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <button className="small-btn" onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '40px', height: '40px', borderRadius: '12px' }}>-</button>
              <span style={{ fontSize: '20px', fontWeight: 900 }}>{qty}</span>
              <button className="small-btn" onClick={() => setQty(qty + 1)} style={{ width: '40px', height: '40px', borderRadius: '12px' }}>+</button>
            </div>
          </div>
          <button 
            className="submit-btn" 
            onClick={() => onConfirm(type, qty)}
            style={{ width: '100%', padding: '15px', borderRadius: '15px', background: 'linear-gradient(135deg, #EC4899, #DB2777)', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer', marginTop: '10px' }}
          >
            Listeye Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

const SHELF_LIFE = {
  'Somun': 2,
  'Tam Buğday': 4,
  'Çavdar': 5,
  'Kepekli': 3,
  'Sandviç': 3,
  'Simit': 1,
  'Lavaş': 7,
  'Bazlama': 5,
  'Mısır Ekmeği': 3,
  'Siyez': 6
};

export default function EkmeklikTab() {
  const { mutfak, updateBreadStock, addMissingToShopping } = useStore();
  const ekmeklik = mutfak.ekmeklik || [];
  const [showShopModal, setShowShopModal] = useState(false);

  const calculateFreshness = (bread) => {
    const life = SHELF_LIFE[bread.tip] || 3;
    const diff = (Date.now() - new Date(bread.dt).getTime()) / 864e5;
    const remaining = Math.max(0, 100 - (diff / life) * 100);
    return remaining;
  };

  const getFreshnessColor = (pct) => {
    if (pct > 60) return '#4ADE80'; // Green
    if (pct > 20) return '#FACC15'; // Yellow
    return '#F87171'; // Red
  };

  const handleAdd = (tip) => {
    updateBreadStock({
      tip,
      adet: 1,
      dt: new Date().toISOString()
    });
  };

  const handleRemove = (id) => {
    const newStock = ekmeklik.filter(e => e.id !== id);
    updateBreadStock(newStock);
  };

  const handleQtyChange = (id, delta) => {
    const newStock = ekmeklik.map(e => {
      if (e.id === id) {
        const newAdet = Math.max(0, e.adet + delta);
        return { ...e, adet: newAdet };
      }
      return e;
    }).filter(e => e.adet > 0);
    updateBreadStock(newStock);
  };

  const BREAD_ICONS = {
    'Somun': '🍞',
    'Tam Buğday': '🌾',
    'Çavdar': '🥖',
    'Kepekli': '🤎',
    'Sandviç': '🥪',
    'Simit': '🥯',
    'Lavaş': '🫓',
    'Bazlama': '🫓',
    'Mısır Ekmeği': '🌽',
    'Siyez': '🥣'
  };

  return (
    <div className="ekmeklik-tab animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: 'var(--mutfak)' }}>🥖 Stok Yönetimi</h3>
        <button 
          onClick={() => setShowShopModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '14px', background: 'var(--mutfak)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(236, 72, 153, 0.2)' }}
        >
          <ShoppingCart size={18} /> Alışverişe Ekle
        </button>
      </div>

      <div className="quick-bread-section">
        <div className="quick-header">
           <span>⚡ Hızlı Stok</span>
           <small>(Aldıklarını İşle)</small>
        </div>
        <div className="bread-grid-compact">
          {Object.keys(SHELF_LIFE).map(type => (
            <button 
              key={type} 
              className="bread-quick-btn"
              onClick={() => handleAdd(type)}
            >
              <span style={{ fontSize: '18px' }}>{BREAD_ICONS[type] || '🍞'}</span>
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>

      {showShopModal && (
        <BreadShopModal 
          onClose={() => setShowShopModal(false)}
          onConfirm={(type, qty) => {
            const state = useStore.getState();
            let newShopping = [...state.mutfak.alisveris];
            newShopping.push({
              id: Date.now(),
              nm: type + ' Ekmeği',
              qt: qty + ' adet',
              mk: 'BİM',
              dn: false,
              loc: 'kil',
              ct: 'Unlu Mamül'
            });
            state.setModuleData('mutfak', { ...state.mutfak, alisveris: newShopping });
            setShowShopModal(false);
            toast.success(`${qty} adet ${type} listeye eklendi! 🛒`);
          }}
        />
      )}

      <div className="ekmek-grid">
        {ekmeklik.map(bread => {
          const freshness = calculateFreshness(bread);
          return (
            <div key={bread.id} className="ekmek-card glass">
              <div className="ekmek-header">
                <span className="ekmek-icon">🥖</span>
                <span className="ekmek-qty">{bread.adet} Adet</span>
              </div>
              <div className="ekmek-info">
                <h4>{bread.tip}</h4>
                <p>{new Date(bread.dt).toLocaleDateString('tr-TR')} tarihinde alındı</p>
                <div className="freshness-bar">
                  <div 
                    className="freshness-fill" 
                    style={{ 
                      width: `${freshness}%`, 
                      background: getFreshnessColor(freshness) 
                    }} 
                  />
                </div>
                <div style={{ fontSize: '9px', marginTop: '4px', fontWeight: 800, color: getFreshnessColor(freshness) }}>
                  {freshness > 0 ? `%${Math.round(freshness)} Taze` : 'BAYAT / TÜKENDİ'}
                </div>
              </div>
              <div className="ekmek-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                   <button className="small-btn" onClick={() => handleQtyChange(bread.id, -1)}>−</button>
                   <button className="small-btn" onClick={() => handleQtyChange(bread.id, 1)}>+</button>
                </div>
                <button className="del-btn" onClick={() => handleRemove(bread.id)}>
                   <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {ekmeklik.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1', padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <p style={{ opacity: 0.6, fontSize: '14px', fontWeight: 600 }}>Ekmeklik şu an boş. 🥖</p>
            <button 
              className="btn-add-shopping" 
              onClick={() => {
                useStore.getState().addMissingToShopping(['Ekmek']);
                toast.success('Ekmek alışveriş listesine eklendi! 🛒');
              }}
              style={{ padding: '12px 20px', borderRadius: '14px', background: 'var(--mutfak-light)', color: 'var(--mutfak)', border: '1px solid var(--mutfak)', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Alışveriş Listesine Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
