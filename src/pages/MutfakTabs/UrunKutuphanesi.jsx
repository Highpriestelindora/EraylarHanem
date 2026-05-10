import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Package, Edit3, Trash2, X, Save, 
  ChevronRight, ArrowLeft, Refrigerator, Warehouse, Snowflake, 
  Scale, Tag, Hash, Sparkles
} from 'lucide-react';
import useStore from '../../store/useStore';
import { REYON_ORDER, REYON_IC, UNITS } from '../../constants/data';
import toast from 'react-hot-toast';
import ActionSheet from '../../components/ActionSheet';
import ConfirmModal from '../../components/ConfirmModal';

const UrunKutuphanesi = ({ onBack }) => {
  const { 
    mutfak, addMutfakStokItem, updateMutfakStokItem, deleteMutfakStokItem 
  } = useStore();

  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null); // { isNew: bool, item: {}, oldLoc: string }
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', onConfirm: null });

  // Tüm stokları birleştirip "Kütüphane" görünümü oluştur
  const allProducts = useMemo(() => {
    const list = [];
    ['buzdolabi', 'kiler', 'dondurucu'].forEach(loc => {
      (mutfak[loc] || []).forEach(item => {
        list.push({ ...item, currentLoc: loc });
      });
    });
    return list.sort((a, b) => a.n.localeCompare(b.n));
  }, [mutfak]);

  const filteredProducts = allProducts.filter(p => 
    p.n.toLowerCase().includes(search.toLowerCase()) || 
    p.ct?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loc = formData.get('loc');
    
    const newItem = {
      id: editingItem.item.id || Date.now(),
      n: formData.get('n').trim(),
      ic: formData.get('ic') || '📦',
      u: formData.get('u') || 'adet',
      mn: formData.get('mn') !== '' ? parseFloat(formData.get('mn')) : 0,
      cr: parseFloat(formData.get('cr')) || 0,
      ct: formData.get('ct') || 'Diğer',
      br: formData.get('br') || '',
      mk: formData.get('mk') || '',
      pk: formData.get('pk') || '',
      bt: new Date().toISOString()
    };

    if (editingItem.isNew) {
      addMutfakStokItem(loc, newItem);
      toast.success(`${newItem.n} kütüphaneye eklendi! ✨`);
    } else {
      // Eğer lokasyon değiştiyse, eskiden silip yeniye ekle
      if (loc !== editingItem.oldLoc) {
        deleteMutfakStokItem(editingItem.oldLoc, editingItem.item.n);
        addMutfakStokItem(loc, newItem);
      } else {
        updateMutfakStokItem(loc, editingItem.item.n, newItem);
      }
      toast.success('Ürün bilgileri güncellendi! 💾');
    }

    setEditingItem(null);
  };

  const handleDelete = (item, loc) => {
    setConfirmModal({
      open: true,
      title: 'Ürünü Kütüphaneden Sil',
      message: `${item.n} ürününü tüm kayıtlarıyla birlikte silmek istediğine emin misin?`,
      onConfirm: () => {
        deleteMutfakStokItem(loc, item.n);
        toast.success('Ürün silindi.');
        setConfirmModal({ ...confirmModal, open: false });
        setEditingItem(null);
      }
    });
  };

  return (
    <div className="library-container animate-fade-in">
      <div className="library-header">
        <button className="back-btn-minimal" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Geri</span>
        </button>
        <h2>Ürün Kütüphanesi</h2>
        <p>Tüm mutfak envanterini buradan yönetebilirsin.</p>
      </div>

      <div className="search-bar-row">
        <div className="search-bar glass">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Ürün adı veya kategori ara..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="add-btn-premium" onClick={() => setEditingItem({ isNew: true, item: { mn: 0, cr: 0, ic: '📦', u: 'adet', ct: 'Diğer' }, oldLoc: 'kiler' })}>
          <Plus size={20} />
          <span>Yeni Ürün</span>
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={`${product.currentLoc}-${product.n}`} className="product-item glass" onClick={() => setEditingItem({ isNew: false, item: product, oldLoc: product.currentLoc })}>
            <div className="p-icon">{product.ic}</div>
            <div className="p-info">
              <span className="p-name">{product.n}</span>
              <span className="p-meta">{product.ct} · {product.currentLoc === 'buzdolabi' ? 'Buzdolabı' : product.currentLoc === 'kiler' ? 'Kiler' : 'Dondurucu'}</span>
            </div>
            <div className="p-stats">
              <div className="stat">
                <span className="stat-label">Min</span>
                <span className="stat-val">{product.mn}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Stok</span>
                <span className="stat-val" style={{ color: product.cr <= product.mn ? 'var(--danger)' : 'var(--success)' }}>{product.cr}</span>
              </div>
              <ChevronRight size={16} opacity={0.3} />
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="empty-state glass">
            <Package size={48} opacity={0.1} />
            <p>Aradığın ürün kütüphanede bulunamadı.</p>
          </div>
        )}
      </div>

      <ActionSheet 
        isOpen={!!editingItem} 
        onClose={() => setEditingItem(null)}
        title={editingItem?.isNew ? '✨ Yeni Ürün Ekle' : '📝 Ürün Bilgilerini Düzenle'}
      >
        {editingItem && (
          <form className="lib-form" onSubmit={handleSave}>
            <div className="form-section">
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Ürün Adı</label>
                  <input name="n" defaultValue={editingItem.item.n} required placeholder="Örn: Zeytinyağı" />
                </div>
                <div className="form-group flex-1">
                  <label>Emoji</label>
                  <input name="ic" defaultValue={editingItem.item.ic} placeholder="🫒" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><Warehouse size={14} /> Lokasyon</label>
                  <select name="loc" defaultValue={editingItem.oldLoc || 'kiler'}>
                    <option value="buzdolabi">Buzdolabı ❄️</option>
                    <option value="kiler">Kiler 🧺</option>
                    <option value="dondurucu">Dondurucu 🧊</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><Tag size={14} /> Kategori</label>
                  <select name="ct" defaultValue={editingItem.item.ct || 'Diğer'}>
                    {REYON_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><Scale size={14} /> Birim</label>
                  <select name="u" defaultValue={editingItem.item.u || 'adet'}>
                    {UNITS.map(u => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label><Hash size={14} /> Min. Stok</label>
                  <input name="mn" type="number" step="0.1" defaultValue={editingItem.item.mn} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><Sparkles size={14} /> Mevcut Stok</label>
                  <input name="cr" type="number" step="0.1" defaultValue={editingItem.item.cr} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Marka / Detay</label>
                  <input name="br" defaultValue={editingItem.item.br} placeholder="Örn: Komili" />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn-premium" style={{ flex: 3 }}>
                <Save size={18} />
                <span>Değişiklikleri Kaydet</span>
              </button>
              {!editingItem.isNew && (
                <button type="button" className="delete-btn-minimal" onClick={() => handleDelete(editingItem.item, editingItem.oldLoc)}>
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </form>
        )}
      </ActionSheet>

      <ConfirmModal 
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, open: false })}
      />

      <style>{`
        .library-container { padding: 10px; }
        .library-header { margin-bottom: 24px; }
        .library-header h2 { font-size: 24px; font-weight: 900; color: var(--mutfak); margin: 8px 0 4px; }
        .library-header p { font-size: 13px; opacity: 0.6; }
        
        .back-btn-minimal {
          display: flex; align-items: center; gap: 6px; background: none; border: none;
          color: var(--mutfak); font-weight: 700; cursor: pointer; padding: 0;
        }

        .products-grid { display: flex; flex-direction: column; gap: 12px; margin-top: 20px; }
        .product-item {
          display: flex; align-items: center; gap: 15px; padding: 16px; border-radius: 20px;
          cursor: pointer; transition: all 0.2s; border: 1px solid rgba(0,0,0,0.05);
          background: white;
        }
        .product-item:hover { transform: translateY(-2px); border-color: var(--mutfak); }
        
        .p-icon { font-size: 28px; }
        .p-info { flex: 1; display: flex; flex-direction: column; }
        .p-name { font-size: 15px; font-weight: 800; }
        .p-meta { font-size: 11px; opacity: 0.5; margin-top: 2px; }
        
        .p-stats { display: flex; align-items: center; gap: 16px; }
        .stat { display: flex; flex-direction: column; align-items: flex-end; }
        .stat-label { font-size: 9px; font-weight: 700; opacity: 0.4; text-transform: uppercase; }
        .stat-val { font-size: 14px; font-weight: 800; }

        .add-btn-premium, .submit-btn-premium {
          display: flex; align-items: center; gap: 8px; padding: 0 20px; height: 52px;
          border-radius: 18px; border: none; background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
          color: white !important; font-weight: 800; font-size: 14px; cursor: pointer;
          box-shadow: 0 10px 20px -5px rgba(234, 88, 12, 0.4);
          transition: all 0.3s ease;
        }

        .add-btn-premium:hover, .submit-btn-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -5px rgba(234, 88, 12, 0.5);
          filter: brightness(1.1);
        }

        .submit-btn-premium:active { transform: scale(0.96); }

        .lib-form { display: flex; flex-direction: column; gap: 20px; padding: 10px 0; }
        .form-row { display: flex; gap: 12px; }
        .flex-2 { flex: 2; }
        .flex-1 { flex: 1; }
        
        .form-actions { display: flex; gap: 10px; margin-top: 10px; }
        .delete-btn-minimal {
          width: 50px; height: 50px; border-radius: 18px; border: 1px solid #fee2e2;
          background: #fff5f5; color: #ef4444; display: flex; align-items: center;
          justify-content: center; cursor: pointer;
        }

        .empty-state { padding: 40px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; opacity: 0.5; }
      `}</style>
    </div>
  );
};

export default UrunKutuphanesi;
