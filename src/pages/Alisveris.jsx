import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, CheckCircle2, Link as LinkIcon, ExternalLink, Clock, X, Save } from 'lucide-react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import './Alisveris.css';

const formatMoney = (val) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);

export default function Alisveris() {
  const [activeTab, setActiveTab] = useState('ev');
  const [showAddModal, setShowAddModal] = useState(false);
  const { alisveris, addShoppingItem, toggleShoppingItem, deleteShoppingItem, setModalOpen, addExpense } = useStore();

  useEffect(() => {
    setModalOpen(showAddModal);
    return () => setModalOpen(false);
  }, [showAddModal, setModalOpen]);

  const currentList = alisveris[activeTab] || [];
  const pendingItems = currentList.filter(i => !i.done);
  const completedItems = currentList.filter(i => i.done);

  const calculateDuration = (start, end) => {
    if (!start || !end) return null;
    const diff = new Date(end) - new Date(start);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} gün`;
    if (hours > 0) return `${hours} saat`;
    return `${minutes} dk`;
  };

  return (
    <AnimatedPage className="shopping-container">
      <div className="module-header shopping-header-grad">
        <div className="header-info">
          <h1>Eraylar Alışveriş</h1>
          <p>Kişisel & Ev İhtiyaçları</p>
        </div>
        <div className="header-actions">
          <button className="add-btn-circle white" onClick={() => setShowAddModal(true)}>
            <Plus size={24} />
          </button>
        </div>
        <div className="header-icon animate-float">🛒</div>
      </div>

      <div className="tab-nav glass">
        <button className={`tab-btn ${activeTab === 'gorkem' ? 'active' : ''}`} onClick={() => setActiveTab('gorkem')}>
          <span style={{ fontSize: '20px' }}>👨</span>
          <span>Görkem</span>
        </button>
        <button className={`tab-btn ${activeTab === 'esra' ? 'active' : ''}`} onClick={() => setActiveTab('esra')}>
          <span style={{ fontSize: '20px' }}>👩</span>
          <span>Esra</span>
        </button>
        <button className={`tab-btn ${activeTab === 'ev' ? 'active' : ''}`} onClick={() => setActiveTab('ev')}>
          <span style={{ fontSize: '20px' }}>🏠</span>
          <span>Ev</span>
        </button>
      </div>

      <div className="shopping-content">
        <div className="list-section">
          <div className="section-header">
            <h3>📝 Alınacaklar</h3>
            <span className="badge">{pendingItems.length} Ürün</span>
          </div>
          
          <div className="items-grid">
            {pendingItems.length === 0 ? (
              <div className="empty-state glass">
                <ShoppingBag size={40} opacity={0.2} />
                <p>Bekleyen ürün yok</p>
              </div>
            ) : (
              pendingItems.map(item => (
                <div key={item.id} className="shopping-card glass">
                  <div className="sc-main">
                    <div className="sc-info">
                      <strong>{item.nm}</strong>
                      <div className="sc-meta">
                        {item.pr > 0 && <span>{formatMoney(item.pr)}</span>}
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer" className="link-badge">
                            <ExternalLink size={12} /> İncele
                          </a>
                        )}
                      </div>
                    </div>
                    <button className="check-btn" onClick={() => toggleShoppingItem(activeTab, item.id)}>
                      <CheckCircle2 size={24} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {completedItems.length > 0 && (
          <div className="list-section mt-20">
            <div className="section-header">
              <h3>✅ Tamamlananlar</h3>
            </div>
            <div className="items-grid completed">
              {completedItems.map(item => (
                <div key={item.id} className="shopping-card glass done">
                  <div className="sc-main">
                    <div className="sc-info">
                      <del>{item.nm}</del>
                      <div className="sc-meta">
                        <Clock size={12} />
                        <span>{calculateDuration(item.dt, item.doneDate)} sürede alındı</span>
                      </div>
                    </div>
                    <div className="sc-actions">
                      {item.pr > 0 && (
                        <button 
                          className="finance-btn" 
                          onClick={() => {
                            addExpense({ title: `🛍️ Alışveriş: ${item.nm}`, amount: Number(item.pr), category: 'mutfak', payer: activeTab === 'ev' ? 'ortak' : activeTab });
                            toast.success('Finans modülüne işlendi! 💰');
                          }}
                          title="Harcama Olarak Kaydet"
                        >
                          💰
                        </button>
                      )}
                      <button className="del-btn" onClick={() => deleteShoppingItem(activeTab, item.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)} 
          onAdd={(item) => addShoppingItem(activeTab, item)}
          owner={activeTab}
        />
      )}
    </AnimatedPage>
  );
}

function AddItemModal({ onClose, onAdd, owner }) {
  const [form, setForm] = useState({ nm: '', link: '', pr: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nm) return;
    onAdd(form);
    toast.success('Listeye eklendi! ✨');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🛒 {owner.toUpperCase()} Listesine Ekle</h3>
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
            <label>Ürün Linki (Opsiyonel)</label>
            <div className="input-with-icon">
              <LinkIcon size={16} />
              <input 
                type="url" 
                placeholder="https://..." 
                value={form.link} 
                onChange={e => setForm({...form, link: e.target.value})} 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Tahmini Fiyat (₺)</label>
            <input 
              type="number" 
              placeholder="0" 
              value={form.pr} 
              onChange={e => setForm({...form, pr: e.target.value})} 
            />
          </div>
          <button type="submit" className="submit-btn shopping-header-grad">
            <Save size={18} /> Listeye Ekle
          </button>
        </form>
      </div>
    </div>
  );
}
