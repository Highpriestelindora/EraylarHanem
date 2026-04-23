import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Search, CreditCard, AlertTriangle, Wallet, ShoppingCart, BellRing, X, ArrowRight } from 'lucide-react';
import useStore from '../../store/useStore';
import ActionSheet from '../../components/ActionSheet';
import toast from 'react-hot-toast';

const AlisverisTab = () => {
  const { mutfak, setModuleData, batchConfirmShopping, addCriticalToShopping, finans, currentUser, addKitchenNote } = useStore();
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [checkedIds, setCheckedIds] = useState([]);
  
  const partnerName = currentUser?.name === 'Görkem' ? 'Esra' : 'Görkem';

  const handleNotifyPartner = () => {
    addKitchenNote(`🛒 Mutfağa alınması gereken ürünler eklendi, bir ara bakabilir misin?`, currentUser?.name || 'Görkem');
    toast.success(`${partnerName}'ya haber verildi! 📢`);
  };
  
  // Modal State
  const [showCheckout, setShowCheckout] = useState(false);
  const [totalPrice, setTotalPrice] = useState('');
  const [market, setMarket] = useState('BİM');
  const [cardId, setCardId] = useState('');

  const alisveris = mutfak.alisveris || [];
  
  const filteredList = useMemo(() => {
    return alisveris.filter(item => 
      item.nm.toLowerCase().includes(search.toLowerCase())
    );
  }, [alisveris, search]);

  const toggleCheck = (id) => {
    setCheckedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const allStock = useMemo(() => [
    ...(mutfak.buzdolabi || []).map(i => ({ ...i, loc: 'buz' })),
    ...(mutfak.kiler || []).map(i => ({ ...i, loc: 'kil' })),
    ...(mutfak.dondurucu || []).map(i => ({ ...i, loc: 'don' }))
  ], [mutfak]);

  const uniqueStockNames = useMemo(() => [...new Set(allStock.map(i => i.n))], [allStock]);
  
  const existingStockItem = allStock.find(s => s.n.toLowerCase() === newItem.trim().toLowerCase());

  const addItem = (e) => {
    if (e) e.preventDefault();
    if (!newItem.trim()) return;

    const newItemObj = {
      id: `shop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nm: newItem.trim(),
      dn: false,
      ct: existingStockItem?.ct || 'Diğer',
      mk: existingStockItem?.mk || 'BİM',
      qt: existingStockItem?.mn ? `${existingStockItem.mn} ${existingStockItem.u || 'adet'}` : '1 adet',
      loc: existingStockItem?.loc || 'buz'
    };

    setModuleData('mutfak', { 
      ...mutfak, 
      alisveris: [newItemObj, ...alisveris] 
    });
    setNewItem('');
    toast.success('Listeye eklendi!');
  };

  const deleteItem = (id) => {
    const updated = alisveris.filter(item => item.id !== id);
    setModuleData('mutfak', { ...mutfak, alisveris: updated });
    setCheckedIds(prev => prev.filter(x => x !== id));
  };

  const [editQtyItem, setEditQtyItem] = useState(null); // { id, qt, unit }
  const [checkoutItems, setCheckoutItems] = useState([]);

  const handleOpenCheckout = () => {
    const selected = alisveris.filter(i => checkedIds.includes(i.id));
    setCheckoutItems(selected.map(i => ({ ...i, price: '' }))); // Initialize with empty price
    setShowCheckout(true);
  };

  const handleCheckout = () => {
    batchConfirmShopping(checkoutItems, parseFloat(totalPrice) || 0, market, cardId);
    setShowCheckout(false);
    setCheckedIds([]);
    setTotalPrice('');
    toast.success('Alışveriş tamamlandı, finans ve stoka işlendi! 💰');
  };

  const updateItemQty = (id, newVal, newUnit) => {
    const updated = alisveris.map(item => 
      item.id === id ? { ...item, qt: `${newVal} ${newUnit}` } : item
    );
    setModuleData('mutfak', { ...mutfak, alisveris: updated });
    setEditQtyItem(null);
    toast.success('Miktar güncellendi');
  };

  const updateCheckoutItemQty = (id, newQt) => {
    setCheckoutItems(prev => prev.map(i => i.id === id ? { ...i, qt: newQt } : i));
  };

  const updateCheckoutItemPrice = (id, newPrice) => {
    const updated = checkoutItems.map(i => i.id === id ? { ...i, price: newPrice } : i);
    setCheckoutItems(updated);
    
    // Auto-calculate total
    const total = updated.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    setTotalPrice(total > 0 ? total.toString() : '');
  };

  return (
    <div className="alisveris-tab-compact">
      <button className="btn-notify animate-pulse-soft" onClick={handleNotifyPartner}>
        <BellRing size={20} />
        <span>{partnerName}'ya Haber Ver</span>
      </button>

      <div className="search-and-add">
        <form className="add-bar glass" onSubmit={addItem}>
          <input 
            type="text" 
            placeholder="Ürün ekle..." 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            list="shopping-autocomplete"
          />
          <datalist id="shopping-autocomplete">
            {uniqueStockNames.map(n => <option key={n} value={n} />)}
          </datalist>
          <button type="submit" className="btn-add">
            <Plus size={20} />
          </button>
        </form>
        <button onClick={addCriticalToShopping} className="btn-warn glass" title="Kritikleri Ekle">
          <AlertTriangle size={20} />
        </button>
      </div>

      {existingStockItem && existingStockItem.cr > 0 && (
        <div className="stock-warning animate-fadeIn">
          <span>⚠️ Evde zaten var! Mevcut: </span>
          <strong>%{existingStockItem.cr} ({existingStockItem.loc === 'buz' ? 'Buzdolabı' : 'Kiler'})</strong>
        </div>
      )}

      <div className="search-bar glass">
        <Search size={18} />
        <input 
          type="text" 
          placeholder="Listede ara..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="compact-list">
        {filteredList.length === 0 ? (
          <div className="empty-state">
            <span>🛒</span>
            <p>Liste Boş</p>
          </div>
        ) : (
          filteredList.map(item => (
            <div key={item.id} className={`compact-item glass ${checkedIds.includes(item.id) ? 'checked' : ''}`} onClick={() => toggleCheck(item.id)}>
              <div className="check-box">
                {checkedIds.includes(item.id) ? <CheckCircle2 size={24} color="#10b981" /> : <Circle size={24} color="var(--brd)" />}
              </div>
              <div className="item-info">
                <span className="name">{item.nm}</span>
                <span className="meta">
                  {item.qt} • {item.mk}
                </span>
              </div>
              <div className="item-actions" style={{ display: 'flex', gap: '5px' }}>
                <button className="edit-btn-small" onClick={(e) => { 
                  e.stopPropagation(); 
                  setEditQtyItem({ id: item.id, val: (item.qt || '').split(' ')[0], unit: (item.qt || '').split(' ')[1] || 'adet' }); 
                }} style={{ background: 'var(--bg)', border: '1px solid var(--brd)', color: 'var(--txt-light)', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}>
                  <ArrowRight size={14} style={{ transform: 'rotate(-45deg)' }} />
                </button>
                <button className="del-btn" onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {checkedIds.length > 0 && (
        <div className="checkout-bar animate-slideUp">
          <div className="info">
            <strong>{checkedIds.length}</strong> Ürün Seçildi
          </div>
          <button className="checkout-btn" onClick={handleOpenCheckout}>
            <Wallet size={18} /> Kasaya Git
          </button>
        </div>
      )}

      <ActionSheet
        isOpen={!!editQtyItem}
        onClose={() => setEditQtyItem(null)}
        title="📏 Miktarı Güncelle"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Yeni Miktar</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="number" 
                value={editQtyItem?.val || ''} 
                onChange={(e) => setEditQtyItem({ ...editQtyItem, val: e.target.value })}
                style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)', fontSize: '16px' }}
                autoFocus
              />
              <select 
                value={editQtyItem?.unit || 'adet'} 
                onChange={(e) => setEditQtyItem({ ...editQtyItem, unit: e.target.value })}
                style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)', fontSize: '16px', background: 'var(--bg)' }}
              >
                <option value="adet">adet</option>
                <option value="kg">kg</option>
                <option value="gr">gram</option>
                <option value="paket">paket</option>
                <option value="litre">litre</option>
                <option value="ml">ml</option>
                <option value="kaşık">kaşık</option>
                <option value="bardak">bardak</option>
              </select>
            </div>
          </div>
          <button className="confirm-btn" onClick={() => updateItemQty(editQtyItem.id, editQtyItem.val, editQtyItem.unit)}>
            Güncelle
          </button>
        </div>
      </ActionSheet>

      <ActionSheet
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="🛒 Kasaya Git"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="checkout-items-list" style={{ maxHeight: '35vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '15px', background: 'var(--bg)', borderRadius: '24px', border: '1px solid var(--brd)' }}>
            <label style={{ fontSize: '11px', fontWeight: 900, opacity: 0.5, letterSpacing: '1px', marginBottom: '5px' }}>ÜRÜN BAZLI FİYAT VE MİKTAR</label>
            {checkoutItems.map(item => (
              <div key={item.id} className="checkout-item-row" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.nm}</span>
                <input 
                  type="text" 
                  value={item.qt} 
                  placeholder="Miktar"
                  onChange={(e) => updateCheckoutItemQty(item.id, e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid var(--brd)', fontSize: '12px', textAlign: 'center', background: 'white' }}
                />
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    value={item.price} 
                    placeholder="₺"
                    onChange={(e) => updateCheckoutItemPrice(item.id, e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid var(--brd)', fontSize: '12px', textAlign: 'center', background: 'white' }}
                    inputMode="decimal"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Toplam Tutar (₺)</label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={totalPrice} 
              onChange={e => setTotalPrice(e.target.value)}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)', fontSize: '18px', fontWeight: '800' }}
              inputMode="decimal"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: '800', marginBottom: '6px', display: 'block' }}>Market</label>
              <select value={market} onChange={e => setMarket(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'var(--bg)' }}>
                <option>BİM</option><option>Migros</option><option>A101</option><option>ŞOK</option><option>File</option><option>Pazar</option><option>Kasap</option><option>Diğer</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: '800', marginBottom: '6px', display: 'block' }}>Ödeme Kartı</label>
              <select value={cardId} onChange={e => setCardId(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'var(--bg)' }}>
                <option value="">Nakit / Diğer</option>
                {(finans?.kartlar || []).map(card => (
                  <option key={card.id} value={card.id}>{card.banka} - {card.ad}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            className="confirm-btn" 
            onClick={handleCheckout} 
            style={{ 
              width: '100%', padding: '18px', borderRadius: '20px', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: 'white', border: 'none', fontWeight: '900', fontSize: '16px',
              boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)',
              marginTop: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            Ödemeyi Onayla <ArrowRight size={20} />
          </button>
        </div>
      </ActionSheet>

      <style>{`
        .alisveris-tab-compact { display: flex; flex-direction: column; gap: 12px; padding-bottom: 80px; }
        
        .btn-notify {
          width: 100%;
          padding: 16px;
          border-radius: 24px;
          border: none;
          background: linear-gradient(135deg, #ff9d6c 0%, #ff4d4d 100%);
          color: white;
          font-weight: 900;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 20px rgba(255, 77, 77, 0.3);
        }
        .btn-notify:active { transform: scale(0.96); box-shadow: 0 5px 10px rgba(255, 77, 77, 0.2); }
        .btn-notify svg { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }
        
        .animate-pulse-soft {
          animation: pulse-soft 3s infinite;
        }
        @keyframes pulse-soft {
          0% { box-shadow: 0 10px 20px rgba(255, 77, 77, 0.3); }
          50% { box-shadow: 0 10px 30px rgba(255, 77, 77, 0.5); }
          100% { box-shadow: 0 10px 20px rgba(255, 77, 77, 0.3); }
        }

        .search-and-add { display: flex; gap: 10px; }
        .add-bar { flex: 1; display: flex; padding: 6px 12px; border-radius: 16px; border: 1px solid var(--brd); background: white; }
        .add-bar input { flex: 1; border: none; outline: none; font-size: 14px; }
        .btn-add { background: var(--mutfak); color: white; border: none; border-radius: 10px; padding: 8px; cursor: pointer; display: flex; align-items: center; }
        .btn-warn { padding: 0 12px; border-radius: 16px; border: 1px solid var(--brd); color: var(--warn); background: var(--warn-light); cursor: pointer; }
        
        .compact-list { display: flex; flex-direction: column; gap: 8px; }
        .compact-item { 
          display: flex; align-items: center; gap: 12px; padding: 12px 16px; 
          border-radius: 20px; border: 1px solid var(--brd); cursor: pointer;
          transition: all 0.2s; background: var(--card);
        }
        .compact-item.checked { background: rgba(16, 185, 129, 0.05); border-color: #10b981; }
        .item-info { flex: 1; display: flex; flex-direction: column; }
        .item-info .name { font-size: 15px; font-weight: 700; color: var(--txt); }
        .item-info .meta { font-size: 11px; color: var(--txt-light); cursor: pointer; transition: color 0.2s; }
        .item-info .meta:hover { color: var(--mutfak); text-decoration: underline; }
        .compact-item.checked .name { text-decoration: line-through; opacity: 0.6; }
        .del-btn { background: transparent; border: none; color: var(--danger); padding: 8px; opacity: 0.4; }
        .del-btn:hover { opacity: 1; }

        .confirm-btn {
          background: var(--mutfak);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
        .confirm-btn:active { transform: scale(0.97); }

        .checkout-bar {
          position: fixed; bottom: 85px; left: 20px; right: 20px; 
          background: #1e293b; color: white; padding: 16px 24px;
          border-radius: 24px; display: flex; justify-content: space-between;
          align-items: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3); z-index: 100;
        }
        .checkout-btn { 
          background: #10b981; color: white; border: none; 
          padding: 10px 20px; border-radius: 14px; font-weight: 800;
          display: flex; align-items: center; gap: 8px; cursor: pointer;
        }

        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-group label { font-size: 12px; font-weight: 800; opacity: 0.6; }

        .stock-warning {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          padding: 8px 12px;
          border-radius: 12px;
          margin-top: -4px;
          margin-bottom: 12px;
          font-size: 11px;
          color: #d97706;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .stock-warning strong { font-weight: 900; }
        
        .empty-state { text-align: center; padding: 40px; opacity: 0.5; display: flex; flex-direction: column; gap: 10px; }
        .empty-state span { font-size: 40px; }
      `}</style>
    </div>
  );
};

export default AlisverisTab;
