import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, AlertCircle, Search, Plus, Trash2, 
  UtensilsCrossed, Truck, Star, Clock, ChevronLeft, 
  ChevronRight, Calendar, CheckCircle2, Dices, Eye, X, ShoppingCart
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import ActionSheet from '../../components/ActionSheet';

export default function MenuTab() {
  const { mutfak, updateMenuDetail, setEatOut, setDelivery, addRecipe, getAvailableRecipes, currentUser, luckyFill } = useStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const [showPicker, setShowPicker] = useState(null); // { dt, ml, type }
  const [showDelivery, setShowDelivery] = useState(null); // { dt, ml }
  const [showEatOut, setShowEatOut] = useState(null); // { dt, ml }
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [viewRecipe, setViewRecipe] = useState(null); // recipe object to view details
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickShop, setShowQuickShop] = useState(false);

  const { syncMenuToShopping } = useStore();

  const handleQuickShop = async (factor) => {
    const added = await syncMenuToShopping(currentDays, factor);
    setShowQuickShop(false);
    if (added) {
      toast.success('Eksik malzemeler alışveriş listesine eklendi! 🛒');
    } else {
      toast('Tüm malzemeler zaten stokta veya listede! ✨');
    }
  };

  const handleClearDay = (dateIso) => {
    try {
      updateMenuDetail(dateIso, { 
        k: '', k2: '', kdis: false, ksp: false,
        a: '', a2: '', adis: false, asp: false 
      });
      toast.success('Gün temizlendi!');
    } catch (err) {
      toast.error('Hata: ' + err.message);
    }
  };

  // Date Helpers
  const getDays = (offset) => {
    const today = new Date();
    const firstDay = new Date(today);
    const dayOfWeek = today.getDay(); // 0: Sun, 1: Mon...
    const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek; // Adjust to Monday
    firstDay.setDate(today.getDate() + diff + (offset * 7));

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(firstDay);
      d.setDate(firstDay.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      return {
        iso,
        dayName: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][i],
        dayNum: d.getDate(),
        month: d.getMonth() + 1,
        isToday: iso === new Date().toISOString().slice(0, 10)
      };
    });
  };

  const currentDays = useMemo(() => getDays(weekOffset), [weekOffset]);
  const available = getAvailableRecipes();

  const getRecipeStatusColor = (name) => {
    const r = available.find(x => x.n === name);
    if (!r) return 'inherit';
    return r.status === 'ready' ? '#10b981' : r.status === 'frozen' ? '#3b82f6' : '#ef4444';
  };

  const updateWeek = (dir) => setWeekOffset(prev => prev + dir);
  const resetWeek = () => setWeekOffset(0);

  const getMealData = (dateIso, mealKey) => {
    const dayData = mutfak.menu[dateIso] || {};
    return {
      main: dayData[mealKey] || '',
      side: dayData[mealKey + '2'] || '',
      dis: dayData[mealKey + 'dis'] || false,
      sp: dayData[mealKey + 'sp'] || false,
      dt: dayData[mealKey + 'dt'] || null
    };
  };

  const handleRandomize = (complexity, type) => {
    const pool = available.filter(r => {
      if (type === 'ana') {
        if (complexity === 'pratik') return r.d <= 2 && r.status === 'ready';
        if (complexity === 'zor') return r.d > 2 && r.status === 'ready';
        return r.status === 'ready';
      } else {
        return r.c === 'salata' || r.c === 'corba' || r.c === 'meze';
      }
    });

    if (pool.length === 0) {
      toast.error('Uygun hazır tarif bulunamadı!');
      return;
    }

    const random = pool[Math.floor(Math.random() * pool.length)];
    const field = type === 'yan' ? showPicker.ml + '2' : showPicker.ml;
    updateMenuDetail(showPicker.dt, { [field]: random.n, [showPicker.ml + 'dis']: false, [showPicker.ml + 'sp']: false });
    setShowPicker(null);
    toast.success(`${random.n} seçildi! 🎲`);
  };


  const handleLuckyFill = () => {
    try {
      if (!mutfak) return toast.error('Mutfak verileri yüklenemedi.');
      const recipes = mutfak.tarifler || [];
      if (recipes.length === 0) return toast.error('Hiç tarifin yok! 🥗 Önce tarif eklemelisin.');
      const isos = (currentDays || []).map(d => d.iso);
      const count = luckyFill(isos);
      if (count > 0) {
        toast.success(`Haftalık plan başarıyla hazırlandı! ✨`);
      } else {
        toast('Haftanız zaten tamamen dolu! ✅');
      }
    } catch (err) {
      toast.error('Hata: ' + err.message);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState('hepsi');

  const categories = [
    { id: 'hepsi', label: 'Hepsi', icon: '🍽️' },
    { id: 'kahvalti', label: 'Kahvaltı', icon: '🍳' },
    { id: 'makarna', label: 'Makarna', icon: '🍝' },
    { id: 'tava', label: 'Tava/Et', icon: '🥩' },
    { id: 'pilav', label: 'Pilav/Baklagil', icon: '🌾' },
    { id: 'corba', label: 'Çorba', icon: '🍲' },
    { id: 'firin', label: 'Fırın', icon: '🥘' },
    { id: 'hamur', label: 'Hamur İşi', icon: '🥟' },
    { id: 'salata', label: 'Salata', icon: '🥗' }
  ];

  return (
    <div className="menu-tab">
      <div className="week-nav glass">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {weekOffset !== 0 && <button className="today-btn-small" onClick={() => setWeekOffset(0)}>BU HAFTA</button>}
        </div>
        <button className="nav-arrow" onClick={() => setWeekOffset(prev => prev - 1)}><ChevronLeft size={20}/></button>
        <div className="week-info" onClick={() => setWeekOffset(0)} style={{ cursor: 'pointer', position: 'relative' }}>
          <strong>Haftalık Plan</strong>
          <small>{currentDays[0].dayNum}.{currentDays[0].month} - {currentDays[6].dayNum}.{currentDays[6].month}</small>
        </div>
        <button className="nav-arrow" onClick={() => setWeekOffset(prev => prev + 1)}><ChevronRight size={20}/></button>
      </div>

      <div className="menu-grid">
        <div className="grid-header">
          <span>GÜN</span>
          <span>☀️ KAHVALTI</span>
          <span>🌙 AKŞAM</span>
        </div>

        {currentDays.map(day => {
          const k = getMealData(day.iso, 'k');
          const a = getMealData(day.iso, 'a');

          return (
            <div key={day.iso} className={`menu-row ${day.isToday ? 'today' : ''}`}>
              <div className="day-cell">
                <span className="d-name">{day.dayName}</span>
                <span className="d-num">{day.dayNum}</span>
                {(k.main || a.main || k.side || a.side || k.dis || a.dis || k.sp || a.sp) && (
                  <button 
                    type="button"
                    className="clear-day-btn" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      handleClearDay(day.iso); 
                    }} 
                    title="Günü Temizle"
                  >
                    <Trash2 size={14} style={{ pointerEvents: 'none' }} />
                  </button>
                )}
              </div>

              <div className={`meal-cell-container ${k.dis ? 'dis' : ''} ${k.sp ? 'sp' : ''}`}>
                <div className="meal-content-split">
                  <div className={`dish-zone ana ${k.main ? 'filled' : 'empty'}`} onClick={() => { setShowPicker({ dt: day.iso, ml: 'k', type: 'ana' }); setSelectedCategory('kahvalti'); }}>
                    {k.dis ? <div className="status-label out">Dışarıda</div> : k.sp ? <div className="status-label del">Sipariş</div> : (
                      k.main ? <span className="dish-name" style={{ color: getRecipeStatusColor(k.main) }}>{k.main}</span> : <div className="dish-placeholder"><Plus size={12}/> Ana</div>
                    )}
                  </div>
                  {!k.dis && !k.sp && (
                    <div className={`dish-zone yan ${k.side ? 'filled' : 'empty'}`} onClick={() => { setShowPicker({ dt: day.iso, ml: 'k', type: 'yan' }); setSelectedCategory('kahvalti'); }}>
                      {k.side ? <small className="dish-name-side" style={{ color: getRecipeStatusColor(k.side) }}>{k.side}</small> : <div className="dish-placeholder-side"><Plus size={10}/> Yan</div>}
                    </div>
                  )}
                </div>
              </div>

              <div className={`meal-cell-container ${a.dis ? 'dis' : ''} ${a.sp ? 'sp' : ''}`}>
                <div className="meal-content-split">
                  <div className={`dish-zone ana ${a.main ? 'filled' : 'empty'}`} onClick={() => { setShowPicker({ dt: day.iso, ml: 'a', type: 'ana' }); setSelectedCategory('hepsi'); }}>
                    {a.dis ? <div className="status-label out">Dışarıda</div> : a.sp ? <div className="status-label del">Sipariş</div> : (
                      a.main ? <span className="dish-name" style={{ color: getRecipeStatusColor(a.main) }}>{a.main}</span> : <div className="dish-placeholder"><Plus size={12}/> Ana</div>
                    )}
                  </div>
                  {!a.dis && !a.sp && (
                    <div className={`dish-zone yan ${a.side ? 'filled' : 'empty'}`} onClick={() => { setShowPicker({ dt: day.iso, ml: 'a', type: 'yan' }); setSelectedCategory('hepsi'); }}>
                      {a.side ? <small className="dish-name-side" style={{ color: getRecipeStatusColor(a.side) }}>{a.side}</small> : <div className="dish-placeholder-side"><Plus size={10}/> Yan</div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="smart-menu-actions" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
         {(() => {
           let planned = 0;
           currentDays.forEach(d => {
             const data = mutfak.menu[d.iso] || {};
             if (data.k || data.kdis || data.ksp) planned++;
             if (data.a || data.adis || data.asp) planned++;
           });
           const isComplete = planned >= 14;
           return (
             <div className={`smart-pill ${isComplete ? 'complete' : ''}`}>
                <span style={{ fontSize: '24px', pointerEvents: 'none' }}>{isComplete ? '✅' : '📊'}</span>
                <span style={{ pointerEvents: 'none' }}>{planned}/14 Dolu</span>
             </div>
           );
         })()}
         <button className="smart-btn lucky" onClick={handleLuckyFill}>
            <span style={{ fontSize: '24px', pointerEvents: 'none' }}>🎲</span>
            <span style={{ pointerEvents: 'none' }}>Şanslı Hisset</span>
         </button>
         <button className="smart-btn shop" onClick={() => setShowQuickShop(true)}>
            <span style={{ fontSize: '24px', pointerEvents: 'none' }}>🛒</span>
            <span style={{ pointerEvents: 'none' }}>Hızlı Market</span>
         </button>
      </div>

      <ActionSheet
        isOpen={showQuickShop}
        onClose={() => setShowQuickShop(false)}
        title="🛒 Hızlı Alışveriş"
      >
        <p style={{ fontSize: '13px', marginBottom: '20px', opacity: 0.8, color: 'var(--txt-light)' }}>
          Planlanan yemeklerin malzemelerini otomatik olarak listeye ekleyin:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="period-btn" onClick={() => handleQuickShop(1)}>1 Haftalık (Standart)</button>
          <button className="period-btn" onClick={() => handleQuickShop(2)}>2 Haftalık</button>
          <button className="period-btn" onClick={() => handleQuickShop(4)}>1 Aylık (Stokçuluk!)</button>
        </div>
      </ActionSheet>

      <ActionSheet
        isOpen={!!showDelivery}
        onClose={() => setShowDelivery(null)}
        title="🛵 Sipariş Detayı"
      >
        {showDelivery && (
          <DeliveryForm 
            onConfirm={(info) => {
              setDelivery(showDelivery.dt, showDelivery.ml, info);
              setShowDelivery(null);
              toast.success('Sipariş kaydedildi! 🛵');
            }}
            existingRestaurants={mutfak.restaurantlar || []}
          />
        )}
      </ActionSheet>

      <ActionSheet
        isOpen={!!showEatOut}
        onClose={() => setShowEatOut(null)}
        title="🍴 Dışarıda Yemek"
      >
        {showEatOut && (
          <EatOutForm 
            onConfirm={(info) => {
              setEatOut(showEatOut.dt, showEatOut.ml, info);
              setShowEatOut(null);
              toast.success('Dışarıda yemek kaydedildi! 🍴');
            }}
            existingRestaurants={mutfak.restaurantlar || []}
          />
        )}
      </ActionSheet>

      <ActionSheet
        isOpen={!!showPicker}
        onClose={() => { setShowPicker(null); setSearchQuery(''); }}
        title={showPicker?.ml === 'k' ? '☀️ Kahvaltı Seçimi' : '🌙 Akşam Yemeği Seçimi'}
        fullHeight
      >
        {showPicker && (() => {
          const currentData = getMealData(showPicker.dt, showPicker.ml);
          const pickingType = showPicker.type || 'ana';
          
          return (
            <div className="picker-container">
              <div className="selection-summary">
                <div className={pickingType === 'ana' ? 'active' : ''}><strong>Ana:</strong> {currentData.main || '---'}</div>
                <div className={pickingType === 'yan' ? 'active' : ''}><strong>Yan:</strong> {currentData.side || '---'}</div>
              </div>

              {searchQuery.length === 0 && (
                <>
                  <div className="dice-row-compact">
                     <button className="dice-pill green" onClick={() => handleRandomize('pratik', 'ana')}>
                        <Dices size={16} /> ⚡ PRATİK
                     </button>
                     <button className="dice-pill red" onClick={() => handleRandomize('zor', 'ana')}>
                        <Dices size={16} /> 👨‍🍳 ŞEF
                     </button>
                     <button className="dice-pill purple" onClick={() => handleRandomize('any', 'yan')}>
                        <Dices size={16} /> 🥗 YAN
                     </button>
                  </div>

                  <div className="quick-actions-row">
                    <button className="qa-btn del" onClick={() => { setShowDelivery(showPicker); setShowPicker(null); }}><Truck size={16}/> Sipariş</button>
                    <button className="qa-btn out" onClick={() => { setShowEatOut(showPicker); setShowPicker(null); }}><UtensilsCrossed size={16}/> Dışarıda</button>
                  </div>
                </>
              )}

              <div className="picker-categories">
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    className={`p-cat-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span className="p-cat-icon">{cat.icon}</span>
                    <span className="p-cat-label">{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="search-box">
                <Search size={18} />
                <input placeholder="Tarif ara..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                {searchQuery.length > 0 && <button className="clear-search" onClick={() => setSearchQuery('')}><X size={16}/></button>}
              </div>

              <div className="recipe-scroll">
                {mutfak.tarifler
                  .filter(r => {
                    const matchesSearch = r.n.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesCat = selectedCategory === 'hepsi' || r.c === selectedCategory;
                    return matchesSearch && matchesCat;
                  })
                  .map(r => {
                    const av = available.find(x => x.id === r.id);
                    const status = av?.status || 'missing';
                    const missing = av?.missing || [];
                    const statusColor = status === 'ready' ? '#10b981' : status === 'frozen' ? '#3b82f6' : '#ef4444';
                    
                    return (
                      <div key={r.id} className="recipe-item-mini glass" style={{ borderLeft: `4px solid ${statusColor}` }}>
                        <div className="ri-content">
                          <div className="ri-info">
                            <span className="ri-emoji">{r.e}</span>
                            <div className="ri-text">
                              <span className="ri-name">{r.n}</span>
                              {missing.length > 0 && (
                                <span className="ri-missing">Eksik: {missing.join(', ')}</span>
                              )}
                            </div>
                          </div>
                          <div className="ri-btns">
                            <button onClick={() => { updateMenuDetail(showPicker.dt, { [showPicker.ml]: r.n }); setShowPicker(null); setSearchQuery(''); }}>Ana</button>
                            <button onClick={() => { updateMenuDetail(showPicker.dt, { [showPicker.ml + '2']: r.n }); setShowPicker(null); setSearchQuery(''); }}>Yan</button>
                            {missing.length > 0 && (
                              <button 
                                className="add-missing-mini-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  useStore.getState().addMissingToShopping(missing);
                                  toast.success('Eksikler listeye eklendi! 🛒');
                                }}
                                title="Eksikleri Listeye Ekle"
                              >
                                🛒
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {mutfak.tarifler.filter(r => {
                    const matchesSearch = r.n.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesCat = selectedCategory === 'hepsi' || r.c === selectedCategory;
                    return matchesSearch && matchesCat;
                  }).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--txt-light)', fontSize: '13px' }}>
                    Bu kategoride uygun tarif bulunamadı.
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </ActionSheet>

      <style jsx="true">{`
        .menu-tab { padding: 10px; }
        .week-nav { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding: 15px; border-radius: 20px; margin-bottom: 10px; position: relative; }
        .nav-arrow { background: none; border: 1px solid var(--brd); color: var(--txt); width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .today-btn-small { background: white; border: 1px solid var(--mutfak); color: var(--mutfak); font-size: 10px; font-weight: 800; padding: 8px 12px; border-radius: 10px; cursor: pointer; }
        .week-info { text-align: center; }
        .week-info strong { display: block; font-size: 16px; }
        .week-info small { color: var(--mutfak); font-weight: bold; }
        
        .menu-grid { display: flex; flex-direction: column; gap: 10px; }
        .grid-header { display: grid; grid-template-columns: 60px 1fr 1fr; font-size: 11px; font-weight: 800; color: var(--txt-light); margin-bottom: 5px; }
        .grid-header span { text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px; }
        .menu-row { display: grid; grid-template-columns: 60px 1fr 1fr; background: var(--card); border-radius: 20px; border: 1px solid var(--brd); overflow: hidden; min-height: 80px; }
        .menu-row.today { border: 2px solid var(--mutfak); box-shadow: 0 0 15px rgba(236, 72, 153, 0.2); }
        
        .day-cell { display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.02); border-right: 1px solid var(--brd); }
        .d-name { font-size: 10px; font-weight: 800; opacity: 0.6; }
        .d-num { font-size: 18px; font-weight: 900; }

        .meal-cell-container { display: flex; align-items: center; justify-content: center; padding: 5px; border-right: 1px solid var(--brd); }
        .meal-content-split { width: 100%; display: flex; flex-direction: column; gap: 4px; }
        .dish-zone { flex: 1; display: flex; align-items: center; justify-content: center; border-radius: 12px; min-height: 32px; transition: all 0.2s; cursor: pointer; }
        .dish-zone.empty { border: 1px dashed var(--brd); background: rgba(0,0,0,0.01); }
        .dish-zone.empty:hover { background: var(--mutfak-light); border-color: var(--mutfak); }
        .dish-name { font-size: 12px; font-weight: 800; text-align: center; }
        .dish-name-side { font-size: 10px; font-weight: 700; opacity: 0.7; }
        .dish-placeholder { font-size: 10px; color: var(--txt-light); display: flex; align-items: center; gap: 4px; }
        .dish-placeholder-side { font-size: 9px; color: var(--txt-light); opacity: 0.5; }

        .status-label { font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 8px; }
        .status-label.out { background: #EBF5FB; color: #2980B9; }
        .status-label.del { background: #FEF9E7; color: #D4AC0D; }

        .selection-summary { background: var(--bg); padding: 12px; border-radius: 16px; margin-bottom: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .selection-summary div { font-size: 13px; padding: 8px; border-radius: 10px; border: 1px solid transparent; }
        .selection-summary div.active { background: var(--mutfak-light); border-color: var(--mutfak); color: var(--mutfak); }

        .dice-row-compact { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        .dice-pill { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 5px; border-radius: 14px; border: none; cursor: pointer; color: white; font-weight: 800; font-size: 10px; transition: transform 0.1s; }
        .dice-pill:active { transform: scale(0.95); }
        .dice-pill.green { background: linear-gradient(135deg, #10b981, #059669); }
        .dice-pill.red { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .dice-pill.purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

        .search-box { display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--bg); border: 1px solid var(--brd); border-radius: 15px; margin-bottom: 15px; }
        .search-box input { flex: 1; border: none; background: none; outline: none; font-size: 14px; color: var(--txt); }
        .clear-search { background: none; border: none; color: var(--txt-light); cursor: pointer; display: flex; align-items: center; justify-content: center; }

        .recipe-scroll { display: flex; flex-direction: column; gap: 10px; }
        .recipe-item-mini { padding: 12px; border-radius: 16px; transition: all 0.2s; }
        .ri-content { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .ri-info { display: flex; align-items: center; gap: 12px; }
        .ri-emoji { font-size: 24px; }
        .ri-text { display: flex; flex-direction: column; }
        .ri-name { font-size: 14px; font-weight: 800; color: var(--txt); }
        .ri-missing { font-size: 10px; color: #ef4444; font-weight: 700; margin-top: 2px; }
        .ri-btns { display: flex; gap: 6px; }
        .ri-btns button { border: 1px solid var(--brd); background: white; padding: 6px 12px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; color: var(--txt); transition: all 0.2s; }
        .ri-btns button:active { background: var(--bg); transform: scale(0.95); }
        
        .add-missing-btn { align-self: flex-start; margin-top: 8px; font-size: 11px; background: var(--bg); border: 1px solid var(--brd); padding: 6px 12px; border-radius: 10px; cursor: pointer; color: var(--txt-light); font-weight: 600; width: 100%; text-align: center; }

        .quick-actions-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
        .qa-btn { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; border-radius: 12px; border: 1px solid var(--brd); background: var(--bg); font-weight: 700; font-size: 12px; cursor: pointer; }
        .qa-btn.del { color: #D4AC0D; }
        .qa-btn.out { color: #2980B9; }

        .search-box { display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(0,0,0,0.03); border-radius: 15px; margin-bottom: 15px; }
        .search-box input { flex: 1; border: none; background: none; outline: none; font-size: 14px; }

        .picker-categories { display: flex; gap: 10px; overflow-x: auto; padding: 5px 0 15px; margin-bottom: 5px; scrollbar-width: none; }
        .picker-categories::-webkit-scrollbar { display: none; }
        
        .p-cat-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 15px; background: white; border: 1px solid var(--brd); border-radius: 16px; min-width: 80px; cursor: pointer; transition: all 0.2s; }
        .p-cat-btn.active { background: var(--mutfak); border-color: var(--mutfak); color: white; transform: scale(1.05); box-shadow: 0 5px 15px rgba(236, 72, 153, 0.2); }
        .p-cat-btn .p-cat-icon { font-size: 18px; }
        .p-cat-btn .p-cat-label { font-size: 10px; font-weight: 800; white-space: nowrap; }

        .recipe-scroll { max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-bottom: 20px; }
        .recipe-item-mini { display: flex; align-items: center; justify-content: space-between; padding: 10px; border-radius: 14px; }
        .ri-info { display: flex; align-items: center; gap: 10px; }
        .ri-emoji { font-size: 20px; }
        .ri-name { font-size: 13px; font-weight: 700; }
        .ri-btns { display: flex; gap: 4px; }
        .ri-btns button { border: 1px solid var(--brd); background: white; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .add-missing-mini-btn { background: #fffbeb !important; border-color: #fcd34d !important; color: #92400e !important; width: 30px; height: 30px; padding: 0 !important; display: flex !important; align-items: center; justify-content: center; font-size: 14px !important; }
        .add-missing-mini-btn:active { transform: scale(0.9); }

        .smart-pill { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 16px 5px; border-radius: 20px; background: #f8fafc; border: 1px solid var(--brd); color: #64748b; font-size: 11px; font-weight: 800; }
        .smart-pill.complete { background: #f0fdf4; border-color: #10b981; color: #10b981; }

        .smart-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 16px 5px; border-radius: 20px; border: 1px solid var(--brd); background: white; color: var(--txt); font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .smart-btn:active { transform: scale(0.95); }
        .smart-btn.lucky { border-color: #8b5cf6; color: #8b5cf6; background: #f5f3ff; }
        .smart-btn.shop { border-color: #ec4899; color: #ec4899; background: #fdf2f8; }

        .period-btn { width: 100%; padding: 14px; border-radius: 14px; border: 1px solid var(--brd); background: white; font-size: 13px; font-weight: 800; color: var(--txt); cursor: pointer; transition: all 0.2s; text-align: left; }
        .period-btn:hover { background: var(--bg); border-color: var(--mutfak); color: var(--mutfak); }

        .suggestions-box { position: absolute; top: 100%; left: 0; right: 0; z-index: 100; border-radius: 12px; margin-top: 5px; max-height: 150px; overflow-y: auto; background: white; border: 1px solid var(--brd); }
        .suggestion-item { padding: 10px; cursor: pointer; font-size: 13px; font-weight: 700; color: #333; }
        .suggestion-item:hover { background: var(--bg); }
      `}</style>
    </div>
  );
}

function DeliveryForm({ onConfirm, existingRestaurants }) {
  const [fr, setFr] = useState('');
  const [wh, setWh] = useState('');
  const [pr, setPr] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = existingRestaurants.filter(r => r.toLowerCase().includes(fr.toLowerCase()));

  return (
    <div className="modal-body-standard" style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '30px' }}>
      <div className="form-group" style={{ position: 'relative' }}>
        <label style={{ fontSize: '12px', fontWeight: '800', opacity: 0.7 }}>Nereden? (Restaurant)</label>
        <input 
          type="text" 
          placeholder="Örn: Burger King, Köfteci Yusuf..." 
          value={fr} 
          onChange={e => { setFr(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--brd)', marginTop: '5px' }}
        />
        {showSuggestions && filtered.length > 0 && (
          <div className="suggestions-box glass animate-fadeIn" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, border: '1px solid var(--brd)', borderRadius: '12px', background: 'white', maxHeight: '150px', overflowY: 'auto' }}>
            {filtered.map(r => (
              <div key={r} className="suggestion-item" onClick={() => { setFr(r); setShowSuggestions(false); }} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>{r}</div>
            ))}
          </div>
        )}
      </div>
      <div className="form-group">
        <label style={{ fontSize: '12px', fontWeight: '800', opacity: 0.7 }}>Ne Söylüyoruz?</label>
        <input 
          type="text" 
          placeholder="Örn: 2 Adet Whopper Menü" 
          value={wh} 
          onChange={e => setWh(e.target.value)}
          style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--brd)', marginTop: '5px' }}
        />
      </div>
      <div className="form-group">
        <label style={{ fontSize: '12px', fontWeight: '800', opacity: 0.7 }}>Tutar (₺)</label>
        <input 
          type="number" 
          placeholder="0₺" 
          value={pr} 
          onChange={e => setPr(e.target.value)}
          style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--brd)', marginTop: '5px' }}
        />
      </div>
      <button 
        className="submit-btn" 
        onClick={() => onConfirm({ fr, wh, pr: Number(pr) })}
        style={{ padding: '16px', borderRadius: '16px', background: 'linear-gradient(135deg, #F1C40F, #F39C12)', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer', marginTop: '10px' }}
      >
        Siparişi Kaydet & Finansa İşle
      </button>
    </div>
  );
}

function EatOutForm({ onConfirm, existingRestaurants }) {
  const [fr, setFr] = useState('');
  const [pr, setPr] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = existingRestaurants.filter(r => r.toLowerCase().includes(fr.toLowerCase()));

  return (
    <div className="modal-body-standard" style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '30px' }}>
      <div className="form-group" style={{ position: 'relative' }}>
        <label style={{ fontSize: '12px', fontWeight: '800', opacity: 0.7 }}>Neresi? (Restoran)</label>
        <input 
          type="text" 
          placeholder="Örn: Big Chefs, Nusret..." 
          value={fr} 
          onChange={e => { setFr(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--brd)', marginTop: '5px' }}
        />
        {showSuggestions && filtered.length > 0 && (
          <div className="suggestions-box glass animate-fadeIn" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, border: '1px solid var(--brd)', borderRadius: '12px', background: 'white', maxHeight: '150px', overflowY: 'auto' }}>
            {filtered.map(r => (
              <div key={r} className="suggestion-item" onClick={() => { setFr(r); setShowSuggestions(false); }} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>{r}</div>
            ))}
          </div>
        )}
      </div>
      <div className="form-group">
        <label style={{ fontSize: '12px', fontWeight: '800', opacity: 0.7 }}>Tahmini Tutar (₺)</label>
        <input 
          type="number" 
          placeholder="0₺" 
          value={pr} 
          onChange={e => setPr(e.target.value)}
          style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--brd)', marginTop: '5px' }}
        />
      </div>
      <button 
        className="submit-btn" 
        onClick={() => onConfirm({ fr, pr: Number(pr) })}
        style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'linear-gradient(135deg, #3498DB, #2980B9)', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer', marginTop: '10px' }}
      >
        Kaydet & Finansa İşle
      </button>
    </div>
  );
}
