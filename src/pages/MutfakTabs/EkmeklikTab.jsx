import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, Wheat, ShoppingCart, X } from 'lucide-react';
import useStore from '../../store/useStore';
import ActionSheet from '../../components/ActionSheet';
import toast from 'react-hot-toast';


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
  const [shopType, setShopType] = useState('Somun');
  const [shopQty, setShopQty] = useState(1);

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

      <ActionSheet
        isOpen={showShopModal}
        onClose={() => setShowShopModal(false)}
        title="🍞 Ekmek Alışverişi"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', opacity: 0.8, marginBottom: '8px', display: 'block' }}>Ekmek Çeşidi</label>
            <select 
              value={shopType} 
              onChange={e => setShopType(e.target.value)}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'var(--bg)', fontSize: '16px' }}
            >
              {Object.keys(SHELF_LIFE).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', opacity: 0.8, marginBottom: '8px', display: 'block' }}>Kaç Adet?</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', padding: '10px 0' }}>
              <button 
                className="small-btn" 
                onClick={() => setShopQty(Math.max(1, shopQty - 1))} 
                style={{ width: '50px', height: '50px', borderRadius: '16px', fontSize: '20px', background: 'var(--bg)', border: '1px solid var(--brd)' }}
              >
                -
              </button>
              <span style={{ fontSize: '32px', fontWeight: 900 }}>{shopQty}</span>
              <button 
                className="small-btn" 
                onClick={() => setShopQty(shopQty + 1)} 
                style={{ width: '50px', height: '50px', borderRadius: '16px', fontSize: '20px', background: 'var(--bg)', border: '1px solid var(--brd)' }}
              >
                +
              </button>
            </div>
          </div>
          <button 
            className="submit-btn" 
            onClick={() => {
              const state = useStore.getState();
              let newShopping = [...state.mutfak.alisveris];
              newShopping.push({
                id: Date.now(),
                nm: shopType + ' Ekmeği',
                qt: shopQty + ' adet',
                mk: 'BİM',
                dn: false,
                loc: 'kil',
                ct: 'Unlu Mamül'
              });
              state.setModuleData('mutfak', { ...state.mutfak, alisveris: newShopping });
              setShowShopModal(false);
              toast.success(`${shopQty} adet ${shopType} listeye eklendi! 🛒`);
            }}
            style={{ 
              width: '100%', padding: '18px', borderRadius: '20px', 
              background: 'linear-gradient(135deg, #EC4899, #DB2777)', 
              color: 'white', border: 'none', fontWeight: '900', fontSize: '16px',
              boxShadow: '0 10px 20px rgba(219, 39, 119, 0.2)',
              marginTop: '10px'
            }}
          >
            Alışveriş Listesine Ekle
          </button>
        </div>
      </ActionSheet>

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
