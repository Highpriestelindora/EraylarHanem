import React, { useState } from 'react';
import { Search, AlertCircle, Plus, ShoppingCart, Edit3, X, Save, Snowflake, Sun, ListChecks, ChefHat, BookOpen } from 'lucide-react';
import useStore from '../../store/useStore';
import { REYON_ORDER, REYON_IC } from '../../constants/data';
import toast from 'react-hot-toast';
import ActionSheet from '../../components/ActionSheet';

const StokTab = () => {
  const { mutfak, setModuleData, setItemFinished, transferStock, bulkFinishItems } = useStore();
  const [subTab, setSubTab] = useState('buzdolabi'); // buzdolabi, kiler, dondurucu
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null); // { isNew: bool, item: {} }
  const [showNeYap, setShowNeYap] = useState(false);
  
  const { getAvailableRecipes } = useStore();
  const availableRecipes = getAvailableRecipes();
  
  const cookable = availableRecipes.filter(r => r.status === 'ready');
  const frozenCookable = availableRecipes.filter(r => r.status === 'frozen');
  const partialCookable = availableRecipes.filter(r => r.status === 'missing' && (r.missing || []).length > 0 && r.missing.length <= 2);

  const items = mutfak[subTab] || [];
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.n.toLowerCase().includes(search.toLowerCase());
    if (search) return matchesSearch;

    const isOutOfStock = item.cr <= 0;
    const lastActive = item.bt ? new Date(item.bt) : new Date();
    const daysInactive = (new Date() - lastActive) / (1000 * 60 * 60 * 24);
    
    // Gizle: Stok bittiyse (0 veya altı) VEYA 5 gündür hiçbir işlem yapılmadıysa
    const isHidden = isOutOfStock || daysInactive > 5;

    return matchesSearch && !isHidden;
  });

  const grouped = filteredItems.reduce((acc, item) => {
    const cat = item.ct || 'Diğer';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const handleFinish = (itemName) => {
    setItemFinished(subTab, itemName);
    toast.success(`${itemName} bitti olarak işaretlendi. Stok sıfırlandı.`);
  };

  const handleManualAddShopping = (item) => {
    addMissingToShopping([item.n]);
    toast.success(`${item.n} alışveriş listesine eklendi! 🛒`);
  };

  const { updateStockQty, addMissingToShopping } = useStore();

  const handleTransfer = (itemName, currentLoc, qty) => {
    if (qty <= 0) return;
    const toLoc = currentLoc === 'buzdolabi' ? 'dondurucu' : 'buzdolabi';
    transferStock(currentLoc, toLoc, itemName, qty);
    toast.success(`${itemName} ${toLoc === 'dondurucu' ? 'donduruldu ❄️' : 'çözüldü ☀️'}`);
  };

  const getStatusColor = (item) => {
    if (item.cr <= 0) return '#ef4444'; // Bitti
    if (item.cr <= item.mn) return '#f59e0b'; // Azaldı
    return '#10b981'; // Tamam
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newItem = {
      n: formData.get('n'),
      ic: formData.get('ic') || '📦',
      u: formData.get('u') || 'adet',
      mn: parseFloat(formData.get('mn')) || 1,
      cr: parseFloat(formData.get('cr')) || 0,
      ct: formData.get('ct') || 'Diğer',
      br: formData.get('br') || '',
      mk: formData.get('mk') || 'BİM',
      pk: formData.get('pk') || '',
      bt: new Date().toISOString()
    };

    let updatedItems = [...items];
    if (editingItem.isNew) {
      // Check if exists
      if (updatedItems.some(i => i.n.toLowerCase() === newItem.n.toLowerCase())) {
         toast.error('Bu malzeme zaten var!');
         return;
      }
      updatedItems.push(newItem);
    } else {
      updatedItems = updatedItems.map(x => x.n === editingItem.item.n ? newItem : x);
    }

    setModuleData('mutfak', { ...mutfak, [subTab]: updatedItems });
    setEditingItem(null);
    toast.success('Stok kartı güncellendi!');
  };

  const openBulkFinishModal = () => {
    setBulkItems({});
    setShowBulkFinish(true);
  };

  const handleBulkFinishSubmit = () => {
    const itemsToFinish = [];
    ['buzdolabi', 'kiler', 'dondurucu'].forEach(loc => {
      mutfak[loc].forEach(item => {
        if (bulkItems[item.n] > 0) {
          itemsToFinish.push({
            moduleKey: loc,
            itemName: item.n,
            qty: bulkItems[item.n]
          });
        }
  return (
    <>
      <div className="stok-tab-container">
        <div className="sub-nav">
          <button className={subTab === 'buzdolabi' ? 'active' : ''} onClick={() => setSubTab('buzdolabi')}>❄️ Buzdolabı</button>
          <button className={subTab === 'kiler' ? 'active' : ''} onClick={() => setSubTab('kiler')}>🧺 Kiler</button>
          <button className={subTab === 'dondurucu' ? 'active' : ''} onClick={() => setSubTab('dondurucu')}>🧊 Dondurucu</button>
        </div>

        <div className="search-bar-row" style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <div className="search-bar glass" style={{ flex: 1, marginBottom: 0 }}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder={`${subTab === 'buzdolabi' ? 'Buzdolabında' : subTab === 'kiler' ? 'Kilerde' : 'Dondurucuda'} ara...`} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="add-item-btn glass" onClick={() => setShowNeYap(true)} title="Ne Yapabilirim?" style={{ color: 'var(--primary)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
            <ChefHat size={20} />
          </button>
          <button className="add-item-btn glass" onClick={() => setEditingItem({ isNew: true, item: {} })}>
            <Plus size={20} />
          </button>
        </div>

        <div className="items-list">
          {[...REYON_ORDER, ...Object.keys(grouped).filter(k => !REYON_ORDER.includes(k))].map(cat => {
            if (!grouped[cat]) return null;
            return (
              <div key={cat} className="category-section">
                <h3 className="category-title">
                  {REYON_IC[cat] || '📋'} {cat}
                </h3>
                <div className="category-items">
                  {grouped[cat].map(item => (
                    <div key={item.n} className="stock-card glass" onClick={() => setEditingItem({ isNew: false, item })}>
                      {item.cr <= item.mn && item.cr > 0 && (
                        <div className="critical-warning">
                          <AlertCircle size={10} /> KRİTİK
                        </div>
                      )}

                      <div className="stock-info">
                        <span className="stock-icon">{item.ic || '📦'}</span>
                        <div className="stock-details">
                          <span className="stock-name">{item.n}</span>
                          <div className="stock-meta">
                            {item.br && <span>{item.br}</span>}
                            {item.mk && <span> · {item.mk}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="stock-right" onClick={e => e.stopPropagation()}>
                        <div className="qty-controls">
                           <button className="qty-btn minus" onClick={() => updateStockQty(subTab, item.n, -1)}>-</button>
                           <div className="amount-container">
                             <span className="current-amount" style={{ color: getStatusColor(item) }}>
                               {item.cr}
                             </span>
                             <span className="unit-label">{item.u}</span>
                           </div>
                           <button className="qty-btn plus" onClick={() => updateStockQty(subTab, item.n, 1)}>+</button>
                        </div>

                        <div className="stock-actions-column">
                          <button 
                            className={`finish-action-btn ${item.cr <= 0 ? 'disabled' : ''}`}
                            onClick={() => item.cr > 0 && handleFinish(item.n)}
                            disabled={item.cr <= 0}
                            title="Bitti Olarak İşaretle"
                          >
                            BİTTİ
                          </button>
                          <button 
                            className="shopping-action-btn"
                            onClick={() => handleManualAddShopping(item)}
                            title="Alışverişe Ekle"
                          >
                            <ShoppingCart size={14} />
                          </button>
                        </div>

                        {(subTab === 'buzdolabi' || subTab === 'dondurucu') && item.cr > 0 && (
                          <button 
                            className="transfer-btn-mini" 
                            onClick={() => handleTransfer(item.n, subTab, 1)}
                            title={subTab === 'buzdolabi' ? 'Dondur' : 'Çöz'}
                          >
                            {subTab === 'buzdolabi' ? <Snowflake size={12} color="#3b82f6" /> : <Sun size={12} color="#f59e0b" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {filteredItems.length === 0 && (
            <div className="empty-results glass" style={{ padding: '60px', borderRadius: '32px', textAlign: 'center' }}>
              <Search size={48} opacity={0.1} style={{ marginBottom: '16px' }} />
              <p style={{ fontWeight: '800', opacity: 0.5 }}>Burada hiç malzeme yok...</p>
              <button className="submit-btn" onClick={() => setEditingItem({ isNew: true, item: {} })} style={{ margin: '20px auto 0', padding: '12px 24px' }}>
                 <Plus size={18} /> Yeni Malzeme Ekle
              </button>
            </div>
          )}
        </div>
      </div>

      <ActionSheet
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={editingItem?.isNew ? '✨ Yeni Malzeme Ekle' : '📝 Stok Kartı'}
      >
        {editingItem && (
          <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Malzeme Adı</label>
                <input name="n" defaultValue={editingItem.item?.n || ''} required placeholder="Örn: Süt" style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }} />
              </div>
              <div className="form-group">
                <label>İkon (Emoji)</label>
                <input name="ic" defaultValue={editingItem.item?.ic || '📦'} placeholder="🥛" style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Birim</label>
                <select name="u" defaultValue={editingItem.item?.u || 'adet'} style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }}>
                  <option value="adet">Adet</option>
                  <option value="kg">KG</option>
                  <option value="gram">Gram</option>
                  <option value="litre">Litre</option>
                  <option value="paket">Paket</option>
                </select>
              </div>
              <div className="form-group">
                <label>Reyon/Kategori</label>
                <select name="ct" defaultValue={editingItem.item?.ct || 'Diğer'} style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }}>
                  {REYON_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Kritik Stok Sınırı (mn)</label>
                <input name="mn" type="number" step="0.1" defaultValue={editingItem.item?.mn || 0} required style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }} />
              </div>
              <div className="form-group">
                <label>Mevcut Miktar (cr)</label>
                <input name="cr" type="number" step="0.1" defaultValue={editingItem.item?.cr || 0} required style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Marka Tercihi</label>
                <input name="mk" defaultValue={editingItem.item?.mk || ''} placeholder="Sütaş, BİM vb." style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }} />
              </div>
              <div className="form-group">
                <label>Paket/Ağırlık Bilgisi</label>
                <input name="pk" defaultValue={editingItem.item?.pk || ''} placeholder="1L, 500g vb." style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }} />
              </div>
            </div>

            <button type="submit" className="submit-btn" style={{ background: 'var(--mutfak)', color: 'white', padding: '18px', borderRadius: '20px', border: 'none', fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              <Save size={20} />
              <span>Kaydet</span>
            </button>
          </form>
        )}
      </ActionSheet>

      <ActionSheet
        isOpen={showNeYap}
        onClose={() => setShowNeYap(false)}
        title="👩‍🍳 Bugün Ne Pişirebiliriz?"
      >
        <div className="ne-yap-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {cookable.length > 0 && (
              <div>
                  <h5 style={{ fontSize: '15px', fontWeight: '900', marginBottom: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ChefHat size={18} /> Hazır Tarifler ({cookable.length})
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {cookable.map(r => (
                      <div key={r.id} className="si glass" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '20px' }}>
                        <span style={{ fontSize: '28px' }}>{r.e}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <span style={{ fontSize: '15px', fontWeight: '800' }}>{r.n}</span>
                          <span style={{ fontSize: '12px', opacity: 0.6 }}>{r.t} dk | {r.c}</span>
                        </div>
                        <BookOpen size={18} opacity={0.3} />
                      </div>
                    ))}
                  </div>
              </div>
            )}

            {frozenCookable.length > 0 && (
              <div>
                  <h5 style={{ fontSize: '15px', fontWeight: '900', marginBottom: '12px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Snowflake size={18} /> Çözülünce Hazır ({frozenCookable.length})
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {frozenCookable.map(r => (
                      <div key={r.id} className="si glass" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '20px', opacity: 0.8 }}>
                        <span style={{ fontSize: '28px' }}>{r.e}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <span style={{ fontSize: '15px', fontWeight: '800' }}>{r.n}</span>
                          <span style={{ fontSize: '12px', opacity: 0.6 }}>Buzlukta malzeme var</span>
                        </div>
                        <Sun size={18} color="#3b82f6" />
                      </div>
                    ))}
                  </div>
              </div>
            )}

            {partialCookable.length > 0 && (
              <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h5 style={{ fontSize: '15px', fontWeight: '900', margin: 0, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={18} /> 1-2 Eksikli ({partialCookable.length})
                    </h5>
                    <button 
                      onClick={() => {
                        const allMissing = [...new Set(partialCookable.flatMap(r => r.missing))];
                        useStore.getState().addMissingToShopping(allMissing);
                        toast.success('Eksik malzemeler alışveriş listesine eklendi! 🛒');
                      }}
                      style={{ fontSize: '11px', background: 'var(--mutfak-light)', color: 'var(--mutfak)', border: '1px solid var(--mutfak)', padding: '6px 12px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                       Tümünü Listeye Ekle
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {partialCookable.slice(0, 5).map(r => (
                      <div key={r.id} className="si glass" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <span style={{ fontSize: '24px' }}>{r.e}</span>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '14px', fontWeight: '800' }}>{r.n}</span>
                            <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>Eksik: {r.missing.join(', ')}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            useStore.getState().addMissingToShopping(r.missing);
                            toast.success(`${r.n} için eksikler eklendi!`);
                          }}
                          style={{ background: 'white', border: '1px solid var(--brd)', borderRadius: '12px', padding: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
                        >
                          <Plus size={18} color="var(--mutfak)" />
                        </button>
                      </div>
                    ))}
                  </div>
              </div>
            )}
        </div>
      </ActionSheet>

      <style>{`
        .stok-tab-container { position: relative; }
        .add-item-btn {
          width: 48px;
          height: 48px;
          border-radius: 18px;
          border: 1px solid var(--brd);
          background: white;
          color: var(--mutfak);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .transfer-btn {
          width: 32px; height: 32px; border-radius: 10px; border: 1px solid var(--brd);
          background: var(--bg); display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .transfer-btn:hover { background: var(--mutfak-light); border-color: var(--mutfak); }
        
        .modal-form { display: flex; flex-direction: column; gap: 16px; margin-top: 10px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 12px; font-weight: 700; color: var(--txt-light); }
        .form-group input, .form-group select {
          padding: 12px; border-radius: 14px; border: 1px solid var(--brd);
          background: var(--bg); font-family: inherit; font-size: 14px;
        }
        .form-row { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 12px; 
        }
        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        .submit-btn {
          padding: 16px; border-radius: 18px; border: none;
          background: var(--mutfak); color: white; font-weight: 800;
          cursor: pointer; margin-top: 8px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .stock-card { cursor: pointer; transition: transform 0.2s; }
        .stock-card:active { transform: scale(0.98); }
      `}</style>
    </>
  );
};

export default StokTab;
