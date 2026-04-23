import React, { useState } from 'react';
import { Search, ChefHat, Timer, Gauge, Heart, Dices, X, Plus, Edit2, Trash2, Save, Info, ShoppingCart } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import { REYON_ORDER } from '../../constants/data';
import ConfirmModal from '../../components/ConfirmModal';

const RecipesTab = () => {
  const { mutfak, getAvailableRecipes, updateRecipe, deleteRecipe, toggleFavorite, addRecipe, addMissingToShopping } = useStore();
  const recipes = getAvailableRecipes();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('hepsi');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingItem] = useState(null); // { isNew: bool, item: {} }
  const [deletingRecipeId, setDeletingRecipeId] = useState(null);

  // Get all unique stock names for autocomplete
  const allStockNames = [...mutfak.buzdolabi, ...mutfak.kiler, ...mutfak.dondurucu].map(i => i.n);
  const uniqueStockNames = [...new Set(allStockNames)];

  const categories = [
    { id: 'hepsi', label: 'Hepsi', icon: '🍽️' },
    { id: 'fav', label: 'Favoriler', icon: '❤️' },
    { id: 'kahvalti', label: 'Kahvaltı', icon: '🍳' },
    { id: 'makarna', label: 'Makarna', icon: '🍝' },
    { id: 'tava', label: 'Tava/Et', icon: '🥩' },
    { id: 'pilav', label: 'Pilav/Baklagil', icon: '🌾' },
    { id: 'corba', label: 'Çorba', icon: '🍲' },
    { id: 'firin', label: 'Fırın', icon: '🥘' },
    { id: 'hamur', label: 'Hamur İşi', icon: '🥟' },
    { id: 'dolma', label: 'Dolma/Sarma', icon: '🫔' },
    { id: 'ozel', label: 'Özel Lezzet', icon: '✨' },
    { id: 'salata', label: 'Salata', icon: '🥗' }
  ];

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.n.toLowerCase().includes(search.toLowerCase());
    
    if (selectedCategory === 'fav') {
      return matchesSearch && r.f;
    }
    
    const matchesCat = selectedCategory === 'hepsi' || r.c === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleRollDice = () => {
    const available = recipes.filter(r => r.status === 'ready');
    if (available.length === 0) {
      toast.error('Tüm malzemeleri tam olan tarif yok!');
      return;
    }
    const random = available[Math.floor(Math.random() * available.length)];
    setSelectedRecipe(random);
    toast.success(`Şansına ${random.n} çıktı! 🎲`);
  };

  const getDifficulty = (d) => {
    if (d <= 1) return 'Kolay';
    if (d <= 3) return 'Orta';
    return 'Zor';
  };

  const getStatusBadge = (r) => {
    if (r.status === 'ready') return <span className="status-badge ready" title="Tüm malzemeler stokta">🟢</span>;
    if (r.status === 'frozen') return <span className="status-badge frozen" title="Bazı malzemeler dondurucuda">❄️</span>;
    return <span className="status-badge missing" title="Malzeme eksik">🔴</span>;
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setDeletingRecipeId(id);
  };

  const confirmDelete = () => {
    if (deletingRecipeId) {
      deleteRecipe(deletingRecipeId);
      setSelectedRecipe(null);
      toast.success('Tarif silindi.');
      setDeletingRecipeId(null);
    }
  };

  const handleSaveRecipe = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Parse ingredients: format "Name: Qty Unit"
    const igRows = Array.from(e.target.querySelectorAll('.ig-row'));
    const ig = igRows.map(row => {
      const name = row.querySelector('.ig-name').value.trim();
      const qty = row.querySelector('.ig-qty').value.trim();
      const unit = row.querySelector('.ig-unit').value;
      if(!name) return null;
      return `${name}${qty || unit ? `:${qty} ${unit}` : ''}`;
    }).filter(Boolean);

    // Parse steps: multi-line text to array
    const stepsText = formData.get('st');
    const st = stepsText.split('\n').map(s => s.trim()).filter(Boolean);

    const newRecipe = {
      n: formData.get('n'),
      e: formData.get('e') || '🍽️',
      c: formData.get('c'),
      t: parseInt(formData.get('t')) || 20,
      d: parseInt(formData.get('d')) || 1,
      ig,
      st
    };

    if (editingRecipe.isNew) {
      addRecipe(newRecipe);
      toast.success('Yeni tarif eklendi!');
    } else {
      updateRecipe(editingRecipe.item.id, newRecipe);
      setSelectedRecipe({ ...editingRecipe.item, ...newRecipe }); // Update modal view if open
      toast.success('Tarif güncellendi!');
    }
    setEditingItem(null);
  };

  const handleAddMissingToShopping = async (missing) => {
    if (!missing || missing.length === 0) return;
    const addedCount = await addMissingToShopping(missing);
    if (addedCount > 0) {
      toast.success(`${addedCount} eksik malzeme alışveriş listesine eklendi! 🛒`);
    } else {
      toast.info('Eksik malzemeler zaten alışveriş listesinde var.');
    }
  };

  const [igFields, setIgFields] = useState([]);
  
  const openAddModal = () => {
    setIgFields([{ id: Date.now(), n: '', qt: '', u: 'adet' }]);
    setEditingItem({ isNew: true, item: {} });
  };

  const openEditModal = (r, e) => {
    if(e) e.stopPropagation();
    const parsedIg = (r.ig || []).map((igLine, i) => {
      const parts = igLine.split(':');
      const n = parts[0]?.trim() || '';
      const rest = (parts[1] || '').trim().split(' ');
      const qt = rest[0] || '';
      const u = rest.slice(1).join(' ') || 'adet';
      return { id: Date.now() + i, n, qt, u };
    });
    setIgFields(parsedIg.length ? parsedIg : [{ id: Date.now(), n: '', qt: '', u: 'adet' }]);
    setEditingItem({ isNew: false, item: r });
  };

  const addIgField = () => {
    setIgFields([...igFields, { id: Date.now(), n: '', qt: '', u: 'adet' }]);
  };

  const removeIgField = (id) => {
    setIgFields(igFields.filter(f => f.id !== id));
  };

  const scrollRef = React.useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="recipes-tab">
      <div className="recipes-actions" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button className="btn-dice" onClick={handleRollDice} style={{ flex: 1 }}>
          <Dices size={20} /> Ne Pişirsem?
        </button>
        <button className="btn-dice" onClick={openAddModal} style={{ background: 'var(--card)', color: 'var(--mutfak)', border: '1px solid var(--brd)', flexShrink: 0, padding: '12px', width: 'auto' }}>
          <Plus size={20} />
        </button>
        <button 
          className="btn-dice" 
          onClick={async () => {
            const count = await useStore.getState().syncRecipesFromData();
            if (count > 0) {
              toast.success(`${count} yeni tarif buluta yüklendi! ☁️`);
            } else {
              toast.success('Bulut senkronizasyonu güncel! ✅');
            }
          }} 
          style={{ background: 'var(--card)', color: '#3b82f6', border: '1px solid var(--brd)', flexShrink: 0, padding: '12px', width: 'auto' }}
          title="Bulutla Senkronize Et"
        >
          <Save size={20} />
        </button>
      </div>

      <div className="category-carousel-wrapper">
        <button className="scroll-arrow left" onClick={() => scroll('left')}>‹</button>
        <div className="category-scroll-grid" ref={scrollRef}>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              className={`cat-btn-compact ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="cat-icon-mini">{cat.icon}</span>
              <span className="cat-label-mini">{cat.label}</span>
            </button>
          ))}
        </div>
        <button className="scroll-arrow right" onClick={() => scroll('right')}>›</button>
      </div>

      <div className="search-bar">
        <Search size={18} />
        <input 
          type="text" 
          placeholder="Tarif ara..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="recipe-grid">
        {filteredRecipes.map(r => (
          <div key={r.id} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
            <div className="recipe-emoji">
              {r.e || '🥘'}
              <div className="status-indicator-wrap">{getStatusBadge(r)}</div>
            </div>
            <div className="recipe-content">
              <h3>{r.n}</h3>
              <div className="recipe-meta">
                <span><Timer size={12} /> {r.t} dk</span>
                <span><Gauge size={12} /> {getDifficulty(r.d)}</span>
              </div>
            </div>
            <button 
              className="fav-btn-absolute" 
              onClick={(e) => { e.stopPropagation(); toggleFavorite(r.id); }}
            >
              {r.f ? <Heart size={16} fill="#ef4444" color="#ef4444" /> : <Heart size={16} color="var(--txt-light)" />}
            </button>
          </div>
        ))}
        {filteredRecipes.length === 0 && (
           <div className="empty-results" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: 'var(--txt-light)' }}>
             Tarif bulunamadı.
           </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRecipe && !editingRecipe && (
        <div className="recipe-modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="recipe-modal animate-pop" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedRecipe(null)}><X size={20} /></button>
            
            <div className="modal-header-hero">
              <div className="modal-header-top">
                <div className="modal-emoji-circle">{selectedRecipe.e}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="icon-btn-round" onClick={(e) => openEditModal(selectedRecipe, e)}><Edit2 size={16} /></button>
                  <button className="icon-btn-round danger" onClick={(e) => handleDelete(selectedRecipe.id, e)}><Trash2 size={16} /></button>
                </div>
              </div>
              
              <h2>{selectedRecipe.n} {getStatusBadge(selectedRecipe)}</h2>
              
              <div className="modal-meta-grid">
                <div className="meta-pill">
                  <span>Hazırlık</span>
                  <strong>{selectedRecipe.t} dk</strong>
                </div>
                <div className="meta-pill">
                  <span>Zorluk</span>
                  <strong>{getDifficulty(selectedRecipe.d)}</strong>
                </div>
                <div className="meta-pill" onClick={() => toggleFavorite(selectedRecipe.id)} style={{ cursor: 'pointer' }}>
                  <span>Favori</span>
                  <strong>{selectedRecipe.f ? 'Evet ❤️' : 'Hayır 🤍'}</strong>
                </div>
              </div>
              
              {selectedRecipe.missing?.length > 0 && (
                <div className="missing-box-premium">
                  <div className="missing-title">
                    <Info size={16} /> EKSİK MALZEMELER
                  </div>
                  <div className="missing-list">
                    {selectedRecipe.missing.join(', ')}
                  </div>
                  <button 
                    className="add-missing-btn"
                    onClick={() => handleAddMissingToShopping(selectedRecipe.missing)}
                  >
                    <ShoppingCart size={14} /> Eksikleri Alışverişe Ekle
                  </button>
                </div>
              )}
            </div>

            <div className="modal-body">
              <section>
                <h4>Malzemeler</h4>
                <ul className="ig-list">
                  {(selectedRecipe.ig || []).map((igLine, i) => {
                    const name = igLine.split(':')[0].trim().toLowerCase();
                    const isMissing = selectedRecipe.missing?.includes(name);
                    return (
                      <li key={i} className={`ig-item ${isMissing ? 'missing' : ''}`}>
                        {isMissing ? '❌' : '✅'} {igLine}
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section>
                <h4>Hazırlanışı</h4>
                <ol className="st-list">
                  {(selectedRecipe.st || []).map((st, i) => <li key={i}>{st}</li>)}
                </ol>
              </section>
            </div>
          </div>
        </div>
      )}

      {editingRecipe && (
        <div className="recipe-modal-overlay" onClick={() => setEditingItem(null)}>
          <form onSubmit={handleSaveRecipe} className="recipe-modal animate-pop" onClick={e => e.stopPropagation()}>
            <button type="button" className="close-btn" onClick={() => setEditingItem(null)}><X size={20} /></button>
            <div className="modal-header" style={{ padding: '24px 24px 10px' }}>
              <h2>{editingRecipe.isNew ? '✨ Yeni Tarif' : '✏️ Tarifi Düzenle'}</h2>
            </div>
            
            <div className="modal-body" style={{ padding: '10px 24px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label>Tarif Adı</label>
                  <input name="n" defaultValue={editingRecipe.item.n} required />
                </div>
                
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Kategori</label>
                    <select name="c" defaultValue={editingRecipe.item.c || 'kahvalti'}>
                      {categories.filter(c => c.id !== 'hepsi' && c.id !== 'neyap').map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Emoji</label>
                    <input name="e" defaultValue={editingRecipe.item.e} maxLength={2} />
                  </div>
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Süre (dk)</label>
                    <input name="t" type="number" defaultValue={editingRecipe.item.t || 20} required />
                  </div>
                  <div className="form-group">
                    <label>Zorluk (1-5)</label>
                    <input name="d" type="number" min="1" max="5" defaultValue={editingRecipe.item.d || 1} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Malzemeler</label>
                  <datalist id="stock-names">
                    {uniqueStockNames.map(n => <option key={n} value={n} />)}
                  </datalist>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {igFields.map((f, i) => (
                      <div key={f.id} className="ig-row" style={{ display: 'flex', gap: '6px' }}>
                        <input className="ig-name" list="stock-names" placeholder="Malzeme adı" defaultValue={f.n} style={{ flex: 2 }} required />
                        <input className="ig-qty" placeholder="Miktar" defaultValue={f.qt} style={{ flex: 1 }} />
                        <select className="ig-unit" defaultValue={f.u} style={{ flex: 1 }}>
                          <option value="adet">adet</option>
                          <option value="kg">kg</option>
                          <option value="gr">gram</option>
                          <option value="lt">litre</option>
                          <option value="ml">ml</option>
                          <option value="kaşık">kaşık</option>
                          <option value="bardak">bardak</option>
                          <option value="paket">paket</option>
                          <option value="diş">diş</option>
                          <option value="tutam">tutam</option>
                        </select>
                        <button type="button" onClick={() => removeIgField(f.id)} style={{ padding: '0 8px', background: 'var(--danger-light)', color: 'var(--danger)', border: 'none', borderRadius: '10px' }}>✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={addIgField} style={{ padding: '8px', border: '1px dashed var(--mutfak)', background: 'transparent', color: 'var(--mutfak)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>+ Malzeme Ekle</button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Yapılışı (Her satır bir adım)</label>
                  <textarea name="st" defaultValue={(editingRecipe.item.st || []).join('\n')} rows={5} required placeholder="1. Adım\n2. Adım" />
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ padding: '16px 24px 24px', background: 'var(--bg)', borderTop: '1px solid var(--brd)' }}>
              <button type="submit" className="submit-btn" style={{ width: '100%', padding: '16px', background: 'var(--mutfak)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <Save size={20} /> {editingRecipe.isNew ? 'Tarifi Kaydet' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}

      {deletingRecipeId && (
        <ConfirmModal 
          title="Tarifi Sil"
          message="Bu tarifi silmek istediğinize emin misiniz?"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingRecipeId(null)}
        />
      )}

      <style>{`
        .recipes-tab { display: flex; flex-direction: column; gap: 16px; }
        
        .btn-dice { 
          background: linear-gradient(135deg, #8B5CF6, #6D28D9); color: white;
          border: none; padding: 12px 24px; border-radius: 16px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer;
          box-shadow: 0 4px 15px rgba(109, 40, 217, 0.3); transition: transform 0.2s;
        }
        .btn-dice:active { transform: scale(0.95); }

        .category-carousel-wrapper { position: relative; display: flex; align-items: center; gap: 4px; margin: 0 -10px; }
        .category-scroll-grid { 
          display: grid; grid-template-rows: repeat(2, 1fr); grid-auto-flow: column;
          gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 4px 10px;
          scroll-behavior: smooth;
        }
        .category-scroll-grid::-webkit-scrollbar { display: none; }
        
        .cat-btn-compact {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 4px; min-width: 70px; height: 70px;
          padding: 8px; border-radius: 18px; background: var(--card);
          border: 1px solid var(--brd); cursor: pointer; transition: all 0.2s;
          text-align: center;
        }
        .cat-btn-compact.active { background: var(--mutfak-light); border-color: var(--mutfak); }
        .cat-icon-mini { font-size: 20px; }
        .cat-label-mini { font-size: 9px; font-weight: 800; color: var(--txt-light); white-space: normal; line-height: 1.1; max-width: 100%; }
        .cat-btn-compact.active .cat-label-mini { color: var(--mutfak); }

        .scroll-arrow {
          width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--brd);
          background: white; color: var(--mutfak); font-size: 20px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          flex-shrink: 0;
        }
        .scroll-arrow:active { transform: scale(0.9); }

        .recipe-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .recipe-card { 
          background: var(--card); border: 1px solid var(--brd); border-radius: 20px;
          padding: 16px; display: flex; flex-direction: column; gap: 10px; cursor: pointer;
          position: relative; transition: border-color 0.2s;
        }
        .recipe-card:hover { border-color: var(--mutfak); }
        .recipe-emoji { font-size: 32px; height: 40px; display: flex; align-items: center; position: relative; }
        .status-indicator-wrap { position: absolute; bottom: -5px; right: -5px; font-size: 14px; }
        .status-badge { background: rgba(255,255,255,0.8); border-radius: 50%; padding: 2px; display: inline-flex; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .recipe-content h3 { font-size: 14px; font-weight: 700; color: var(--txt); }
        .recipe-meta { display: flex; gap: 8px; font-size: 10px; color: var(--txt-light); margin-top: 4px; }
        .recipe-meta span { display: flex; align-items: center; gap: 4px; }
        
        .fav-btn-absolute { position: absolute; top: 12px; right: 12px; background: transparent; border: none; cursor: pointer; padding: 4px; }
        
        .icon-btn-round { width: 36px; height: 36px; border-radius: 50%; border: none; background: var(--bg); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--txt); }
        .icon-btn-round.danger { color: var(--danger); background: var(--danger-light); }

        /* Modal Styles */
        .recipe-modal-overlay { 
          position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1000;
          display: flex; align-items: flex-end; justify-content: center;
          backdrop-filter: blur(4px);
        }
        .recipe-modal { 
          background: var(--bg); width: 100%; max-width: 500px; max-height: 92vh;
          border-radius: 32px 32px 0 0; padding: 0; overflow: hidden; position: relative;
          display: flex; flex-direction: column;
        }
        .recipe-modal .close-btn { position: absolute; top: 16px; right: 16px; border: none; background: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 10; }
        
        .modal-header-hero {
          padding: 40px 24px 24px;
          background: linear-gradient(135deg, #fdf2f8, #fce7f3);
          position: relative;
        }
        
        .modal-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .modal-emoji-circle {
          font-size: 40px;
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        .modal-header-hero h2 { 
          font-size: 28px; 
          font-weight: 900; 
          color: var(--txt); 
          margin: 0 0 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .modal-meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .meta-pill {
          background: white;
          padding: 8px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.02);
        }
        
        .meta-pill span { font-size: 10px; font-weight: 800; color: var(--txt-light); text-transform: uppercase; }
        .meta-pill strong { font-size: 12px; font-weight: 900; color: var(--mutfak); }
        
        .missing-box-premium {
          background: #fee2e2;
          border: 1.5px dashed #ef4444;
          padding: 16px;
          border-radius: 20px;
          margin-top: 8px;
        }
        
        .missing-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #b91c1c;
          font-weight: 900;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .missing-list {
          font-size: 12px;
          color: #ef4444;
          font-weight: 600;
          line-height: 1.4;
        }

        .add-missing-btn {
          width: 100%;
          margin-top: 12px;
          background: #ef4444;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-missing-btn:active { transform: scale(0.97); }

        .modal-body { 
          padding: 24px; 
          overflow-y: auto; 
          flex: 1;
        }
        
        .modal-body h4 { font-size: 16px; font-weight: 900; color: var(--txt); margin: 24px 0 12px; display: flex; align-items: center; gap: 8px; }
        .modal-body h4::before { content: ""; width: 4px; height: 16px; background: var(--mutfak); border-radius: 2px; }
        
        .ig-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .ig-item {
          padding: 12px 16px;
          background: var(--card);
          border-radius: 14px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid var(--brd);
        }
        .ig-item.missing { border-color: #fecaca; background: #fff5f5; color: #ef4444; }

        .st-list { padding: 0 0 0 20px; color: var(--txt); font-size: 14px; line-height: 1.7; font-weight: 500; }
        .st-list li { margin-bottom: 12px; padding-left: 8px; }

        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 12px; font-weight: 700; color: var(--txt-light); }
        .form-group input, .form-group select, .form-group textarea {
          padding: 12px; border-radius: 14px; border: 1px solid var(--brd);
          background: var(--bg); font-family: inherit; font-size: 14px;
        }

        @media (min-width: 768px) {
          .recipe-modal-overlay { align-items: center; }
          .recipe-modal { border-radius: 32px; height: auto; }
        }
      `}</style>
    </div>
  );
};

export default RecipesTab;
