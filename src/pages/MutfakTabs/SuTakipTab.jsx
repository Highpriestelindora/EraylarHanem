import React, { useEffect, useState } from 'react';
import { Droplets, Calendar, Minus, Plus, Trash2, RefreshCw, Info } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';
import PaymentSelector from '../../components/PaymentSelector';

export default function SuTakipTab() {
  const { 
    mutfak, 
    updateWaterLevel, 
    addWaterOrder, 
    removeWaterOrder, 
    addExpense, 
    setWaterDailyRate, 
    processDailyWaterDeduction,
    setWaterEditing,
    saveWaterSettings,
    currentUser
  } = useStore();
  
  const isGuest = currentUser?.name === 'Misafir';
  const water = mutfak.su || {};
  const isEditing = water.isEditing || false;
  
  // Düzenleme modunda geçici değerleri tutmak için local state
  const [tempLevels, setTempLevels] = useState({
    level1: water.level1 || 0,
    level2: water.level2 || 0,
    dailyRate: water.dailyRate || 20
  });

  const level1 = isEditing ? tempLevels.level1 : (water?.level1 ?? 100);
  const level2 = isEditing ? tempLevels.level2 : (water?.level2 ?? 100);
  const dailyRate = isEditing ? tempLevels.dailyRate : (water?.dailyRate ?? 20);
  
  const history = water?.history || [];
  const lastOrder = water?.lastOrder ? new Date(water.lastOrder) : null;

  const [deleteModal, setDeleteModal] = useState({ open: false, index: null });
  const [paymentMethod, setPaymentMethod] = useState('');

  // Sayfa açıldığında geçen zamana göre günlük düşümü yap
  useEffect(() => {
    processDailyWaterDeduction();
  }, []);

  // Düzenleme modu açıldığında değerleri eşitle
  useEffect(() => {
    if (isEditing) {
      setTempLevels({
        level1: water.level1 || 0,
        level2: water.level2 || 0,
        dailyRate: water.dailyRate || 20
      });
    }
  }, [isEditing, water.level1, water.level2, water.dailyRate]);

  const calculateDaysLeft = () => {
    const totalLevel = level1 + level2; 
    const rate = dailyRate || 20;
    const days = Math.floor(totalLevel / rate);
    return days > 0 ? days : 0;
  };

  const isOrderAvailable = () => {
    const now = new Date();
    const day = now.getDay(); 
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    const start = 9 * 60; // 09:00
    const end = 18 * 60 + 30; // 18:30
    
    return day !== 0 && currentTime >= start && currentTime <= end;
  };

  const handleOrder = () => {
    if (!isOrderAvailable()) return;
    
    addWaterOrder(2);
    addExpense({ 
      title: '2 Damacana Su', 
      amount: 200, 
      category: 'mutfak', 
      payer: 'ortak',
      defaultPay: paymentMethod
    });
    toast.success('Sipariş kaydedildi ve Yedekler doldu! 🚚');
    
    // Direct phone call
    window.location.href = "tel:02167064550";
  };

  const handleSwap = () => {
    if (level2 <= 0) return toast.error('Yedek su kalmadı! 😱');
    if (isEditing) return toast.error('Lütfen önce düzenlemeyi kaydedin!');
    
    updateWaterLevel('level1', 100);
    updateWaterLevel('level2', Math.max(0, level2 - 50)); 
    toast.success('Yeni damacana takıldı! ✨');
  };

  const handleSave = () => {
    saveWaterSettings(tempLevels.level1, tempLevels.level2, tempLevels.dailyRate);
  };

  const handleDelete = () => {
    if (deleteModal.index !== null) {
      removeWaterOrder(deleteModal.index);
      setDeleteModal({ open: false, index: null });
    }
  };

  const available = isOrderAvailable();
  const daysLeft = calculateDaysLeft();

  return (
    <div className={`su-tab animate-fadeIn ${isEditing ? 'editing-active' : ''}`}>
      <div className="su-hero glass">
        <div className="su-header-row">
           <div className="su-logic-info">
            <Info size={14} />
            <span><strong>Mutfak:</strong> Açık. <strong>Yedek:</strong> Stok.</span>
          </div>
          {currentUser?.name !== 'Misafir' && (
            <button 
              className={`su-edit-toggle ${isEditing ? 'active-save' : ''}`}
              onClick={() => isEditing ? handleSave() : setWaterEditing(true)}
            >
              {isEditing ? <RefreshCw size={16} className="animate-spin-slow" /> : <Droplets size={16} />}
              <span>{isEditing ? 'KAYDET VE BAŞLAT' : 'DÜZENLE'}</span>
            </button>
          )}
        </div>

        <div className="su-stats">
          <div className="stat-item">
            <small>Son Sipariş</small>
            <strong>{lastOrder ? lastOrder.toLocaleDateString('tr-TR') : '—'}</strong>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <small>Tahmini Kalan</small>
            <strong>{daysLeft} Gün</strong>
          </div>
        </div>

        <div className="water-tanks-container">
          <div className="water-tanks">
            <WaterTank 
              label="Mutfak" 
              level={level1} 
              isEditing={isEditing}
              isGuest={currentUser?.name === 'Misafir'}
              onLevelChange={(v) => setTempLevels(prev => ({ ...prev, level1: v }))} 
            />
            
            {currentUser?.name !== 'Misafir' && (
              <button className={`swap-btn-premium ${isEditing ? 'disabled' : ''}`} onClick={handleSwap} title="Yedekle Değiştir">
                <RefreshCw size={20} />
                <small>Değiştir</small>
              </button>
            )}

            <WaterTank 
              label="Yedek" 
              level={level2} 
              isEditing={isEditing}
              isGuest={currentUser?.name === 'Misafir'}
              onLevelChange={(v) => setTempLevels(prev => ({ ...prev, level2: v }))} 
            />
          </div>
        </div>

        <div className={`daily-consumption-ctrl glass ${isEditing ? 'editing-pulse' : ''}`}>
          <div className="dc-label">
            <strong>GÜNLÜK TÜKETİM HIZI</strong>
            <small>Günde % kaç azalıyor?</small>
          </div>
          <div className="dc-val">
             <span>%{dailyRate}</span>
             <div className="dc-btns">
              <button 
                className={!isEditing ? 'disabled' : ''}
                onClick={() => isEditing && setTempLevels(prev => ({ ...prev, dailyRate: Math.max(5, prev.dailyRate - 5) }))}
              >-</button>
              <button 
                className={!isEditing ? 'disabled' : ''}
                onClick={() => isEditing && setTempLevels(prev => ({ ...prev, dailyRate: Math.min(100, prev.dailyRate + 5) }))}
              >+</button>
            </div>
          </div>
        </div>
        
        {currentUser?.name !== 'Misafir' && available && (
          <div className="mt-20">
            <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
          </div>
        )}
        
        {currentUser?.name !== 'Misafir' && (
          <div className="su-actions" style={{ marginTop: '20px' }}>
            <button 
              className={`order-btn ${!available || isEditing ? 'disabled' : ''}`} 
              onClick={handleOrder}
              disabled={!available || isEditing}
            >
              <Droplets size={20} />
              <span>{available ? '2 Damacana Söyle (📞)' : 'Sipariş Saatleri Dışında'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="history-section">
        <div className="section-header">
          <h4>📦 Sipariş Geçmişi</h4>
          <span className="badge">{history.length} Kayıt</span>
        </div>
        <div className="history-list">
          {history.map((h, i) => (
            <div key={`${h.dt}-${i}`} className="history-item glass animate-fadeIn" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="h-left">
                <div className="h-date">
                  <Calendar size={14} />
                  <span>{new Date(h.dt).toLocaleDateString('tr-TR', { day:'numeric', month:'long' })}</span>
                </div>
                <div className="h-qty">
                  <strong>{h.q} Damacana</strong>
                </div>
              </div>
              {currentUser?.name !== 'Misafir' && (
                <button 
                  className="h-delete-btn" 
                  onClick={() => setDeleteModal({ open: true, index: i })} 
                  title="Sil"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          {history.length === 0 && <div className="empty-history">Henüz sipariş kaydı yok.</div>}
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteModal.open}
        title="Kaydı Siliyorsun"
        message="Bu su siparişi kaydını silmek istediğine emin misin? Bu işlem geri alınamaz."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, index: null })}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        icon="🗑️"
      />
    </div>
  );
}


function WaterTank({ label, level, isEditing, isGuest, onLevelChange }) {
  return (
    <div className={`tank-container ${isEditing ? 'editing-focus' : ''}`}>
      <div className="tank-visual">
        <div className="water-level" style={{ height: `${level}%` }} />
        <span className="level-text">%{level}</span>
      </div>
      <span className="tank-label">{label}</span>
      {!isGuest && (
        <div className="tank-ctrl">
          <button 
            className={!isEditing ? 'disabled' : ''}
            onClick={() => isEditing && onLevelChange(Math.max(0, level - 5))}
          ><Minus size={14} /></button>
          <button 
            className={!isEditing ? 'disabled' : ''}
            onClick={() => isEditing && onLevelChange(Math.min(100, level + 5))}
          ><Plus size={14} /></button>
        </div>
      )}
    </div>
  );
}
