import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Plus, Trash2, CheckCircle2, Link as LinkIcon, 
  ExternalLink, Clock, X, Edit, Search, TrendingUp, Star,
  Store, ShoppingCart, Heart, History as HistoryIcon, Info, ArrowLeft, RotateCcw, ChevronRight,
  Sparkles, Zap, Package, Laptop, Dumbbell, Watch, Shirt, Scissors,
  Smile, Palette, Heart as HeartIcon, Gem, Briefcase, Camera, Edit3
} from 'lucide-react';
import ActionSheet from '../components/ActionSheet';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AlisverisTab from './MutfakTabs/AlisverisTab';
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
  { nm: 'Halı Kaydırmaz', ic: '🧼', loc: 'depo' },
  { nm: 'Yorgan Kılıfı', ic: '🛏️', loc: 'depo' },
  { nm: 'Pil (AA/AAA)', ic: '🔋', loc: 'depo' },
  { nm: 'Ampul', ic: '💡', loc: 'depo' },
  { nm: 'Sıvı Sabun', ic: '🧴', loc: 'depo' },
  { nm: 'Yüzey Temizleyici', ic: '✨', loc: 'depo' },
];

const HOME_FIXES = [
  {
    cat: 'Yatak Odası', ic: '🛏️', items: [
      'Yatak', 'Yatak bazası', 'Başlık', 'Yorgan', 'Yorgan kılıfı', 'Nevresim takımı', 
      'Yastık', 'Yastık kılıfı', 'Battaniye', 'Pike', 'Çarşaf (lastikli)', 'Çarşaf (düz)', 
      'Gardırop', 'Elbise askısı', 'Komodin', 'Şifonyer', 'Ayna', 'Çamaşır sepeti', 
      'Kirli sepeti', 'Hurç'
    ]
  },
  {
    cat: 'Salon / Oturma Odası', ic: '🛋️', items: [
      'Koltuk takımı', 'Berjer', 'Sehpa (orta)', 'Sehpa (yan)', 'TV ünitesi', 'Televizyon', 
      'Halı', 'Perde', 'Tül perde', 'Fon perde', 'Kitaplık', 'Lambader', 'Avize', 
      'Dekoratif yastık', 'Battaniye (salon)', 'Duvar saati', 'Tablo', 'Mum', 'Mumluk', 'Vazo'
    ]
  },
  {
    cat: 'Mutfak', ic: '🍽️', items: [
      'Buzdolabı', 'Fırın', 'Ocak', 'Mikrodalga', 'Su ısıtıcısı', 'Kahve makinesi', 
      'Tost makinesi', 'Tencere seti', 'Tava', 'Çaydanlık', 'Tabak seti', 'Bardak seti', 
      'Çatal', 'Kaşık', 'Bıçak', 'Kesme tahtası', 'Kepçe', 'Spatula', 'Saklama kabı', 'Baharatlık'
    ]
  },
  {
    cat: 'Banyo', ic: '🚿', items: [
      'Havlu', 'El havlusu', 'Banyo havlusu', 'Paspas', 'Duş perdesi', 'Sabunluk', 
      'Diş fırçalık', 'Çöp kovası', 'Tuvalet fırçası', 'Tuvalet kağıtlığı', 'Şampuan', 
      'Duş jeli', 'Sabun', 'Lif', 'Tırnak makası', 'Tarak', 'Saç kurutma makinesi', 
      'Ayna (banyo)', 'Raf', 'Organizer'
    ]
  },
  {
    cat: 'Temizlik & Genel', ic: '🧹', items: [
      'Süpürge', 'Mop', 'Kova', 'Temizlik bezleri', 'Sünger', 'Deterjan', 'Çamaşır deterjanı', 
      'Yumuşatıcı', 'Çamaşır makinesi', 'Kurutma makinesi', 'Ütü', 'Ütü masası', 
      'Çamaşırlık', 'Mandal', 'Çöp torbası', 'Eldiven', 'Fırça', 'Sprey şişe', 
      'Oda kokusu', 'Hava temizleyici'
    ]
  }
];

const GORKEM_CATS = [
  { nm: 'Bakım', ic: '🧴', label: 'Kişisel Bakım' },
  { nm: 'Giyim', ic: '👕', label: 'Giyim' },
  { nm: 'Teknoloji', ic: '🎧', label: 'Elektronik' },
  { nm: 'Spor', ic: '🏋️', label: 'Spor & Outdoor' },
  { nm: 'Parfüm', ic: '💨', label: 'Parfüm' },
  { nm: 'Saat', ic: '⌚', label: 'Aksesuar' }
];

const ESRA_CATS = [
  { nm: 'Bakım', ic: '🧖‍♀️', label: 'Cilt Bakımı' },
  { nm: 'Makyaj', ic: '💄', label: 'Kozmetik' },
  { nm: 'Moda', ic: '👗', label: 'Moda & Giyim' },
  { nm: 'Hobi', ic: '🎨', label: 'Hobi & Sanat' },
  { nm: 'Takı', ic: '💍', label: 'Takı & Mücevher' },
  { nm: 'Çanta', ic: '👜', label: 'Aksesuar' }
];

const formatMoney = (val) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);

export default function Alisveris() {
  const [activeTab, setActiveTab] = useState('market'); // 'gorkem', 'esra', 'ev', 'market'
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmingItem, setConfirmingItem] = useState(null);
  const [activeQuickCat, setActiveQuickCat] = useState(null);
  const [quickProductName, setQuickProductName] = useState('');
  const [showConfirm, setShowConfirm] = useState({ open: false, message: '', onConfirm: null });

  const requestConfirm = (message, onConfirm) => {
    setShowConfirm({ open: true, message, onConfirm });
  };
  
  // Shuffled Categories State
  const [displayGorkem, setDisplayGorkem] = useState(GORKEM_CATS);
  const [displayEsra, setDisplayEsra] = useState(ESRA_CATS);
  const [displayHome, setDisplayHome] = useState(HOME_FIXES);

  const navigate = useNavigate();
  
  const { 
    mutfak, alisveris, confirmShoppingItem, deleteShoppingItem, addShoppingItem, 
    setModuleData, addExpense, addDepoItem 
  } = useStore();

  // Filtered List based on Active Tab
  const filteredList = useMemo(() => {
    let list = [];
    if (activeTab === 'gorkem') {
      list = (alisveris?.gorkem || []).map(i => ({ ...i, origin: 'gorkem', cat: 'Görkem' }));
    } else if (activeTab === 'esra') {
      list = (alisveris?.esra || []).map(i => ({ ...i, origin: 'esra', cat: 'Esra' }));
    } else if (activeTab === 'ev') {
      list = (alisveris?.ev || []).map(i => ({ ...i, origin: 'ev', cat: 'Ev' }));
    } else if (activeTab === 'market') {
      // Market tab specifically shows mutfak shopping list
      list = (mutfak?.alisveris || []).map(i => ({ ...i, origin: 'mutfak', cat: 'Mutfak' }));
    }
    
    return list.filter(i => i && i.nm && !i.dn && i.nm.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [mutfak?.alisveris, alisveris, searchQuery, activeTab]);

  const tabs = [
    { id: 'gorkem', label: 'Görkem', emoji: '👨' },
    { id: 'esra', label: 'Esra', emoji: '👩' },
    { id: 'ev', label: 'Ev', emoji: '🏡' },
    { id: 'market', label: 'Market', emoji: '🛒' }
  ];

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const refreshCategories = () => {
    setDisplayGorkem(shuffleArray(GORKEM_CATS));
    setDisplayEsra(shuffleArray(ESRA_CATS));
    setDisplayHome(shuffleArray(HOME_FIXES));
    toast.success('Kategoriler yenilendi ✨');
  };

  React.useEffect(() => {
    // Initial shuffle
    setDisplayGorkem(shuffleArray(GORKEM_CATS));
    setDisplayEsra(shuffleArray(ESRA_CATS));
    setDisplayHome(shuffleArray(HOME_FIXES));
  }, []);

  const handleQuickAdd = (item, target) => {
    addShoppingItem(target || 'ev', { nm: item.nm, loc: item.loc || 'ev', pr: 0 });
    toast.success(`${item.nm} listeye eklendi! ✨`);
  };

  const handleDelete = (owner, id) => {
    requestConfirm('Bu ürünü silmek istediğinize emin misiniz?', () => {
      deleteShoppingItem(owner, id);
      toast.success('Ürün silindi.');
    });
  };

  const handlePersonalConfirm = (owner, item, purchaseData) => {
    const { amount, market, cardId } = purchaseData;
    
    // 1. Add to Finance
    addExpense({
      title: `${item.cat}: ${item.nm}`,
      amount: Number(amount),
      category: owner === 'ev' ? 'Ev' : 'Kişisel',
      payer: owner === 'gorkem' ? 'Görkem' : (owner === 'esra' ? 'Esra' : 'Ortak'),
      cardId: cardId || null,
      market: market || 'Diğer'
    });

    // 2. Add to Ev Depo (Phase 3: Smart Catalog Integration)
    addDepoItem({
      name: item.nm,
      mainCat: (owner === 'gorkem' || owner === 'esra') ? 'Gardırop' : 'Genel',
      subCat: item.cat || 'Diğer',
      qty: 1,
      price: Number(amount),
      source: 'alisveris',
      note: `${owner === 'gorkem' ? '👨 Görkem' : (owner === 'esra' ? '👩 Esra' : '🏠 Ev')} için alındı.`
    });

    // 3. Remove from shopping list
    deleteShoppingItem(owner, item.id);
    setConfirmingItem(null);
    toast.success('Alışveriş kaydedildi, depoya ve finansa eklendi! ✅');
  };

  return (
    <AnimatedPage className="shopping-container">
      <header className="module-header glass" style={{ background: 'var(--alisveris)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🛒</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Alışveriş</h1>
              <p>Görkem · Esra · Ev · Market</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menüye Dön">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        <nav className="tab-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1 }}
            >
              <span style={{ fontSize: '16px', marginBottom: '2px' }}>{tab.emoji}</span>
              <span style={{ fontSize: '9px', fontWeight: '500', opacity: 0.8 }}>{tab.label}</span>

            </button>
          ))}
        </nav>
      </header>

        <div className="shopping-content-premium">
        {activeTab !== 'market' && (
          <>
            {(activeTab === 'ev') && (
              <div className="quick-add-section">
                <div className="qas-header">
                  <Package size={14} /> <span>Ev Demirbaşları</span>
                  <button className="refresh-mini" onClick={refreshCategories}><RotateCcw size={12} /></button>
                </div>
                <div className="quick-add-bar-compact">
                  {displayHome.map(cat => (
                    <button 
                      key={cat.cat} 
                      className="quick-item-btn-compact" 
                      onClick={() => {
                        setActiveQuickCat(cat);
                        setQuickProductName('');
                      }}
                    >
                      <span>{cat.ic}</span> <span>{cat.cat.split(' / ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {(activeTab === 'gorkem' || activeTab === 'esra') && (
              <div className="quick-add-section">
                <div className="qas-header">
                  <Sparkles size={14} /> <span>{activeTab === 'gorkem' ? 'Görkem için Öneriler' : 'Esra için Öneriler'}</span>
                  <button className="refresh-mini" onClick={refreshCategories}><RotateCcw size={12} /></button>
                </div>
                <div className="quick-add-bar-compact">
                  {(activeTab === 'gorkem' ? displayGorkem : displayEsra).map(cat => (
                    <button 
                      key={cat.nm} 
                      className="quick-item-btn-compact" 
                      onClick={() => {
                        setActiveQuickCat(cat);
                        setQuickProductName('');
                      }}
                    >
                      <span>{cat.ic}</span> <span>{cat.nm}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="search-box-premium glass">
              <Search size={18} opacity={0.5} />
              <input 
                type="text" 
                placeholder={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} listesinde ara...`} 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="items-list-premium">
              {filteredList.length === 0 ? (
                <div className="empty-state-v2">
                  <Store size={60} />
                  <p>{searchQuery ? 'Eşleşen ürün bulunamadı.' : 'Bu liste şu an tertemiz! ✨'}</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredList.map((item, idx) => (
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
                        <button className="icon-btn-small" onClick={() => setEditingItem({ ...item, owner: activeTab })}>
                          <Edit size={16} color="var(--txt-light)" />
                        </button>
                        <button className="icon-btn-small" onClick={() => handleDelete(activeTab, item.id)}>
                          <Trash2 size={16} color="#ef4444" />
                        </button>
                        <button className="confirm-btn-apple" onClick={() => setConfirmingItem({ ...item, owner: activeTab })}>
                          <CheckCircle2 size={28} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </>
        )}

        {activeTab === 'market' && (
          <div className="market-tab-container animate-fadeIn" style={{ padding: '0 20px' }}>
            <AlisverisTab />
          </div>
        )}

        {/* Wishlist and Extras only for personal tabs? 
            Or keep them at the bottom of Market but above/below AlisverisTab? 
            User said "Market tabı mutfaktaki alışveriş listesinin birebir aynısı olacak". 
            So I'll hide extras for now to keep it clean, or show them below.
        */}
        {(activeTab === 'market' && false) && (
          <div className="market-extras animate-fadeIn mt-24">
            {/* ... */}
          </div>
        )}
      </div>

      {activeTab !== 'market' && (
        <button 
          className="fab-add-shopping animate-pop" 
          onClick={() => setShowAddModal(true)}
          style={{ background: activeTab === 'gorkem' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : `var(--${activeTab === 'ev' ? 'alisveris' : 'mutfak'})` }}
        >
          <Plus size={28} />
        </button>
      )}

      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)} 
          initialOwner={activeTab}
          onAdd={(owner, item) => {
            if (owner === 'market') {
              const updatedMutfak = { 
                ...mutfak, 
                alisveris: [{ id: Date.now(), ...item }, ...(mutfak.alisveris || [])] 
              };
              useStore.getState().setModuleData('mutfak', updatedMutfak);
            } else {
              addShoppingItem(owner, item);
            }
          }}
        />
      )}

      {editingItem && (
        <AddItemModal 
          onClose={() => setEditingItem(null)}
          initialData={editingItem}
          initialOwner={editingItem.owner}
          onAdd={(owner, item) => {
            const list = [...(alisveris[owner] || [])];
            const idx = list.findIndex(i => i.id === editingItem.id);
            if (idx !== -1) {
              list[idx] = { ...list[idx], ...item };
              setModuleData('alisveris', { ...alisveris, [owner]: list });
              toast.success('Ürün güncellendi. ✨');
            }
          }}
        />
      )}

      {confirmingItem && (
        <ConfirmPurchaseModal 
          item={confirmingItem}
          onClose={() => setConfirmingItem(null)}
          onConfirm={(data) => handlePersonalConfirm(confirmingItem.owner, confirmingItem, data)}
        />
      )}

      <ActionSheet
        isOpen={!!activeQuickCat}
        onClose={() => setActiveQuickCat(null)}
        title={`${activeQuickCat?.ic} ${activeQuickCat?.label || activeQuickCat?.cat} Ekle`}
      >
        <div className="quick-add-sheet-form">
          <p style={{ fontSize: '12px', color: 'var(--txt-light)', marginBottom: '15px', fontWeight: '400' }}>
            {activeTab === 'ev' ? 'Ev' : (activeTab === 'gorkem' ? 'Görkem' : 'Esra')} için hangi ürünü ekleyelim?
          </p>
          <div className="form-group-v2">
            <input 
              type="text" 
              className="premium-input" 
              placeholder="Ürün adı girin..." 
              value={quickProductName}
              onChange={e => setQuickProductName(e.target.value)}
              autoFocus
            />
          </div>

          {activeQuickCat?.items && (
            <div className="autofill-suggestions mt-12">
              <small style={{ display: 'block', marginBottom: '8px', opacity: 0.6, fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Önerilenler</small>
              <div className="suggestion-tags">
                {activeQuickCat.items.slice(0, 15).map(item => (
                  <button 
                    key={item} 
                    className="suggestion-tag"
                    onClick={() => setQuickProductName(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            className="submit-btn-premium mt-24"
            disabled={!quickProductName.trim()}
            onClick={() => {
              handleQuickAdd({ nm: quickProductName, ic: activeQuickCat.ic }, activeTab);
              setActiveQuickCat(null);
              setQuickProductName('');
            }}
          >
            Listeye Ekle ✨
          </button>
        </div>
      </ActionSheet>

      <ConfirmModal 
        isOpen={showConfirm.open}
        title="Emin misiniz?"
        message={showConfirm.message}
        onConfirm={() => {
          showConfirm.onConfirm();
          setShowConfirm({ ...showConfirm, open: false });
        }}
        onCancel={() => setShowConfirm({ ...showConfirm, open: false })}
      />
    </AnimatedPage>
  );
}

function ConfirmPurchaseModal({ item, onClose, onConfirm }) {
  const [amount, setAmount] = useState(item.pr || '');
  const [market, setMarket] = useState('Diğer');
  const [cardId, setCardId] = useState('');
  const { finans } = useStore();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>💰 Satın Alım Onayı</h3>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="purchase-info" style={{ marginBottom: '20px', textAlign: 'center' }}>
          <strong style={{ fontSize: '18px' }}>{item.nm}</strong>
          <p style={{ opacity: 0.6 }}>Bu ürün için ne kadar ödediniz?</p>
        </div>
        <div className="modal-form">
          <div className="form-group">
            <label>Tutar (₺)</label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              autoFocus 
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Market</label>
              <select value={market} onChange={e => setMarket(e.target.value)}>
                <option>Diğer</option><option>Migros</option><option>BİM</option><option>A101</option><option>ŞOK</option><option>Trendyol</option><option>Hepsiburada</option>
              </select>
            </div>
            <div className="form-group">
              <label>Kart</label>
              <select value={cardId} onChange={e => setCardId(e.target.value)}>
                <option value="">Nakit</option>
                {(finans?.kartlar || []).map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
              </select>
            </div>
          </div>
          <button className="submit-btn" onClick={() => onConfirm({ amount, market, cardId })} style={{ background: '#10b981' }}>
            <CheckCircle2 size={18} /> Satın Alımı Onayla
          </button>
        </div>
      </div>
    </div>
  );
}

function AddItemModal({ onClose, onAdd, initialOwner, initialData }) {
  const [form, setForm] = useState(initialData ? { ...initialData, owner: initialOwner } : { nm: '', mk: 'Market', loc: initialOwner === 'market' ? 'buz' : 'depo', pr: '', qt: '1 adet', isWish: false, owner: initialOwner || 'ev' });
  const { alisveris, setModuleData } = useStore();

  React.useEffect(() => {
    if (form.owner === 'market') {
      if (form.loc === 'depo') setForm(prev => ({ ...prev, loc: 'buz' }));
    } else {
      if (form.loc !== 'depo') setForm(prev => ({ ...prev, loc: 'depo' }));
    }
  }, [form.owner, form.loc]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nm) return;
    
    const targetOwner = form.owner === 'market' ? 'market' : form.owner;
    
    if (form.isWish) {
      const newWish = [{ ...form, id: Date.now() }, ...(alisveris?.wishlist || [])];
      setModuleData('alisveris', { ...alisveris, wishlist: newWish });
      toast.success('İstek listesine eklendi! ✨');
    } else {
      onAdd(targetOwner, { nm: form.nm, mk: form.mk, qt: form.qt, loc: form.loc, pr: Number(form.pr) || 0 });
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
            <label>Liste Seçimi</label>
            <select value={form.owner} onChange={e => setForm({...form, owner: e.target.value})}>
              <option value="gorkem">👨 Görkem</option>
              <option value="esra">👩 Esra</option>
              <option value="ev">🏡 Ev</option>
              <option value="market">🛒 Market (Mutfak)</option>
            </select>
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
                    {form.owner === 'market' ? (
                      <>
                        <option value="buz">❄️ Buzdolabı</option>
                        <option value="kil">🫙 Kiler</option>
                        <option value="don">🧊 Dondurucu</option>
                      </>
                    ) : (
                      <option value="depo">📦 Depo (Envanter)</option>
                    )}
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
            <Plus size={18} /> {form.isWish ? 'İsteklere Ekle' : 'Listeye Ekle'}
          </button>
        </form>
      </div>
    </div>
  );
}
