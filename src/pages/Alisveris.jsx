import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Plus, Trash2, CheckCircle2, Link as LinkIcon, 
  ExternalLink, Clock, X, Save, Search, TrendingUp, Star,
  Store, ShoppingCart, Heart, History, Info
} from 'lucide-react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import './Alisveris.css';

const MARKETS = [
  { id: 'Migros', color: '#ff6b00', icon: '🟠' },
  { id: 'Bim', color: '#0047ba', icon: '🔵' },
  { id: 'Özkuruşlar', color: '#e31e24', icon: '🔴' },
  { id: 'Kasap', color: '#991b1b', icon: '🥩' },
  { id: 'Manav', color: '#166534', icon: '🥬' },
  { id: 'Eczane', color: '#dc2626', icon: '💊' },
  { id: 'Pet', color: '#854d0e', icon: '🐾' },
];

const QUICK_ITEMS = [
  { nm: 'Ekmek', ic: '🥖', loc: 'kil' },
  { nm: 'Süt', ic: '🥛', loc: 'buz' },
  { nm: 'Yumurta', ic: '🥚', loc: 'buz' },
  { nm: 'Damacana Su', ic: '💧', loc: 'kil' },
  { nm: 'Muz', ic: '🍌', loc: 'buz' },
  { nm: 'Tavuk', ic: '🍗', loc: 'buz' },
];

const formatMoney = (val) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);

export default function Alisveris() {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'wish', 'prices'
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const { mutfak, alisveris, confirmShoppingItem, deleteShoppingItem, addShoppingItem } = useStore();

  // Unified Active List
  const unifiedList = useMemo(() => {
    const list = [];
    // Mutfak items
    (mutfak.alisveris || []).forEach(i => list.push({ ...i, origin: 'mutfak', cat: 'Ev' }));
    // Personal items
    (alisveris.gorkem || []).forEach(i => list.push({ ...i, origin: 'gorkem', cat: 'Görkem' }));
    (alisveris.esra || []).forEach(i => list.push({ ...i, origin: 'esra', cat: 'Esra' }));
    (alisveris.ev || []).forEach(i => list.push({ ...i, origin: 'ev', cat: 'Ev' }));
    
    return list.filter(i => !i.dn && i.nm.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [mutfak.alisveris, alisveris, searchQuery]);

  const handleQuickAdd = (item) => {
    addShoppingItem('ev', { nm: item.nm, loc: item.loc, pr: 0 });
    toast.success(`${item.nm} listeye eklendi! ✨`);
  };

  const handleConfirm = (item) => {
    // Premium Apple Watch style confirmation
    confirmShoppingItem(item.id, item.mk || 'Market', item.qt || '1 adet', item.pr || 0, item.loc || 'buz');
    toast.success(`${item.nm} alındı! ✅`);
  };

  return (
    <AnimatedPage className="shopping-container">
      <div className="module-header shopping-header-grad">
        <div className="header-info">
          <h1>Eraylar Alışveriş</h1>
          <p>Akıllı Aile Asistanı</p>
        </div>
        <div className="header-actions">
          <button className="add-btn-circle white" onClick={() => setShowAddModal(true)}>
            <Plus size={24} />
          </button>
        </div>
        <div className="header-icon animate-float">🛒</div>
      </div>

      <div className="shopping-tabs-premium glass">
        <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}>
          <ShoppingCart size={18} />
          <span>Liste</span>
        </button>
        <button className={activeTab === 'wish' ? 'active' : ''} onClick={() => setActiveTab('wish')}>
          <Heart size={18} />
          <span>İstekler</span>
        </button>
        <button className={activeTab === 'prices' ? 'active' : ''} onClick={() => setActiveTab('prices')}>
          <History size={18} />
          <span>Fiyatlar</span>
        </button>
      </div>

      <div className="shopping-content-premium">
        {activeTab === 'list' && (
          <div className="list-view animate-fadeIn">
            {/* Quick Add Bar */}
            <div className="quick-add-bar">
              {QUICK_ITEMS.map(item => (
                <button key={item.nm} className="quick-item-btn glass" onClick={() => handleQuickAdd(item)}>
                  <span>{item.ic}</span>
                  <span>{item.nm}</span>
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="search-box-premium glass">
              <Search size={18} opacity={0.5} />
              <input 
                type="text" 
                placeholder="Listede ara..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Items List */}
            <div className="items-list-premium">
              {unifiedList.length === 0 ? (
                <div className="empty-state-v2">
                  <Store size={60} />
                  <p>{searchQuery ? 'Eşleşen ürün bulunamadı.' : 'Alışveriş listeniz şu an tertemiz!'}</p>
                </div>
              ) : (
                <AnimatePresence>
                  {unifiedList.map((item, idx) => (
                    <motion.div 
                      key={item.id} 
                      className="shopping-item-v2 glass"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="si-left">
                        <div className="si-market-dot" style={{ backgroundColor: MARKETS.find(m => m.id === item.mk)?.color || '#cbd5e1' }} />
                        <div className="si-main-info">
                          <strong>{item.nm}</strong>
                          <div className="si-meta">
                            <span className="si-tag">{item.cat}</span>
                            {item.mk && <span className="si-market">{item.mk}</span>}
                            {item.qt && <span className="si-qty">{item.qt}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="si-right">
                        {item.pr > 0 && <span className="si-price">{formatMoney(item.pr)}</span>}
                        <button className="confirm-btn-apple" onClick={() => handleConfirm(item)}>
                          <CheckCircle2 size={28} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        )}

        {activeTab === 'wish' && (
          <div className="wishlist-view animate-fadeIn">
            <div className="items-list-premium">
              {alisveris.wishlist?.length === 0 ? (
                <div className="empty-state-v2">
                  <Star size={60} style={{ color: '#eab308' }} />
                  <p>İstek listeniz boş. Gelecekte almayı düşündüğünüz şeyleri buraya ekleyin!</p>
                </div>
              ) : (
                alisveris.wishlist.map((item, idx) => (
                  <div key={item.id} className="shopping-item-v2 glass">
                    <div className="si-left">
                      <div className="si-main-info">
                        <strong>{item.nm}</strong>
                        {item.pr > 0 && <span className="si-price" style={{ fontSize: '12px', opacity: 0.7 }}>Tahmini: {formatMoney(item.pr)}</span>}
                      </div>
                    </div>
                    <div className="si-right">
                      <button className="confirm-btn-apple" onClick={() => {
                        addShoppingItem('ev', item);
                        const newWish = alisveris.wishlist.filter(w => w.id !== item.id);
                        useStore.getState().setModuleData('alisveris', { ...alisveris, wishlist: newWish });
                        toast.success('Listeye taşındı! 🛒');
                      }} title="Listeye Taşı">
                        <Plus size={24} />
                      </button>
                      <button className="del-btn" style={{ background: 'transparent' }} onClick={() => {
                        const newWish = alisveris.wishlist.filter(w => w.id !== item.id);
                        useStore.getState().setModuleData('alisveris', { ...alisveris, wishlist: newWish });
                      }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'prices' && (
          <div className="prices-view animate-fadeIn">
             <div className="section-header" style={{ padding: '0 10px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--txt)' }}>📊 Fiyat Geçmişi</h3>
             </div>
             
             {Object.keys(mutfak.priceHistory || {}).length === 0 ? (
               <div className="empty-state-v2">
                 <TrendingUp size={60} />
                 <p>Henüz fiyat verisi toplanmadı. Alışveriş yaptıkça burası dolacak.</p>
               </div>
             ) : (
               <div className="price-history-list">
                 {Object.entries(mutfak.priceHistory).map(([name, history]) => (
                   <div key={name} className="price-history-card glass">
                      <div className="phc-header">
                        <strong>{name}</strong>
                        <span className="phc-last">{formatMoney(history[0].pr)}</span>
                      </div>
                      <div className="phc-graph-mini">
                        {history.map((h, i) => (
                          <div key={i} className="phc-dot-wrap">
                            <div className="phc-dot" style={{ height: `${(h.pr / history[0].pr) * 30}px` }} />
                            <span className="phc-date">{new Date(h.dt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)} 
          onAdd={(item) => addShoppingItem('ev', item)}
        />
      )}
    </AnimatedPage>
  );
}

function AddItemModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ nm: '', mk: 'Market', loc: 'buz', pr: '', qt: '1 adet', isWish: false });
  const { alisveris, setModuleData } = useStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nm) return;
    
    if (form.isWish) {
      const newWish = [{ ...form, id: Date.now() }, ...(alisveris.wishlist || [])];
      setModuleData('alisveris', { ...alisveris, wishlist: newWish });
      toast.success('İstek listesine eklendi! ✨');
    } else {
      onAdd(form);
      toast.success('Listeye eklendi! ✨');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🛒 Yeni Ürün Ekle</h3>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Ürün Adı</label>
            <input 
              type="text" 
              placeholder="Ne lazım?" 
              value={form.nm} 
              onChange={e => setForm({...form, nm: e.target.value})} 
              required 
              autoFocus 
            />
          </div>

          <div className="form-group">
             <label>Hemen Alınacak mı?</label>
             <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className={`toggle-btn ${!form.isWish ? 'active' : ''}`} onClick={() => setForm({...form, isWish: false})} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid var(--brd)', background: !form.isWish ? 'var(--alisveris)' : 'white', color: !form.isWish ? 'white' : 'var(--txt)', fontWeight: '800' }}>ŞİMDİ</button>
                <button type="button" className={`toggle-btn ${form.isWish ? 'active' : ''}`} onClick={() => setForm({...form, isWish: true})} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid var(--brd)', background: form.isWish ? '#eab308' : 'white', color: form.isWish ? 'white' : 'var(--txt)', fontWeight: '800' }}>İSTEK</button>
             </div>
          </div>
          
          {!form.isWish && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Market</label>
                  <select value={form.mk} onChange={e => setForm({...form, mk: e.target.value})}>
                    {MARKETS.map(m => <option key={m.id} value={m.id}>{m.icon} {m.id}</option>)}
                    <option value="Diğer">❔ Diğer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Miktar</label>
                  <input type="text" value={form.qt} onChange={e => setForm({...form, qt: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Konum</label>
                  <select value={form.loc} onChange={e => setForm({...form, loc: e.target.value})}>
                    <option value="buz">❄️ Buzdolabı</option>
                    <option value="kil">🫙 Kiler</option>
                    <option value="don">🧊 Dondurucu</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tahmini Fiyat (₺)</label>
                  <input type="number" value={form.pr} onChange={e => setForm({...form, pr: e.target.value})} />
                </div>
              </div>
            </>
          )}

          {form.isWish && (
             <div className="form-group">
               <label>Tahmini Fiyat (₺)</label>
               <input type="number" value={form.pr} onChange={e => setForm({...form, pr: e.target.value})} />
             </div>
          )}

          <button type="submit" className="submit-btn shopping-header-grad">
            <Save size={18} /> {form.isWish ? 'İsteklere Ekle' : 'Listeye Ekle'}
          </button>
        </form>
      </div>
    </div>
  );
}
