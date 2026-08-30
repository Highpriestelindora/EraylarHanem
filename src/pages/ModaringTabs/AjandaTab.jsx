import React, { useState, useMemo } from 'react';
import { 
  Calendar, Plus, AlertCircle, CheckCircle2, 
  Trash2, X, Save, Clock, Bell, DollarSign, 
  ChevronRight, ArrowRight, Tag, FileText, Filter, CreditCard
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import Portal from '../../components/Portal';
import ConfirmModal from '../../components/ConfirmModal';

const formatDateSafe = (dateStr) => {
  if (!dateStr) return 'Tarih Belirtilmedi';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Tarih Belirtilmedi';
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return 'Tarih Belirtilmedi';
  }
};

const AjandaTab = () => {
  const { 
    modaring, 
    addModaringAjanda, updateModaringAjanda, deleteModaringAjanda,
    addModaringKasaItem, currentUser
  } = useStore();
  const ajanda = modaring?.ajanda || [];
  const bankalar = modaring?.bankalar || [];

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('pending'); // pending, done, gecmis
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const stats = useMemo(() => {
    const pending = ajanda.filter(i => i?.status === 'pending' || i?.status === 'bekliyor' || !i?.status);
    const totalPendingAmount = pending.reduce((acc, i) => acc + Number(i?.amount || 0), 0);
    return { pendingCount: pending.length, totalPendingAmount };
  }, [ajanda]);

  const filteredList = useMemo(() => {
    let list = [...ajanda].sort((a, b) => {
      const timeA = a?.dueDate ? new Date(a.dueDate).getTime() : 0;
      const timeB = b?.dueDate ? new Date(b.dueDate).getTime() : 0;
      return (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
    });
    if (filter === 'pending') return list.filter(i => i?.status === 'pending' || i?.status === 'bekliyor' || !i?.status);
    if (filter === 'done') return list.filter(i => i?.status === 'done' || i?.status === 'tamamlandi');
    if (filter === 'gecmis') return list.filter(i => i?.status === 'done' || i?.status === 'tamamlandi' || i?.status === 'deleted').reverse();
    return list.filter(i => i?.status !== 'deleted');
  }, [ajanda, filter]);

  const handleSave = (item) => {
    if (item.id) {
      updateModaringAjanda(item.id, item);
    } else {
      const { id, ...newTask } = item;
      addModaringAjanda(newTask);
    }
    setShowModal(false);
    setEditingItem(null);
    toast.success('Ajanda güncellendi');
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Kaydı Arşive Taşı',
      message: 'Bu ajanda kaydını arşive taşımak istediğinize emin misiniz?',
      onConfirm: () => {
        updateModaringAjanda(id, { status: 'deleted' });
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
        setShowModal(false);
        setEditingItem(null);
        toast.error('Kayıt arşive taşındı');
      }
    });
  };

  const handleHardDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Kalıcı Olarak Sil',
      message: 'Bu ajanda kaydını tamamen silmek istediğinize emin misiniz?',
      onConfirm: () => {
        deleteModaringAjanda(id);
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
        setShowModal(false);
        setEditingItem(null);
        toast.error('Kayıt tamamen silindi');
      }
    });
  };

  const handleRestore = (id) => {
    updateModaringAjanda(id, { status: 'pending' });
    toast.success('Kayıt geri yüklendi');
  };

  const handleToggleStatus = (id) => {
    const item = ajanda.find(i => String(i.id) === String(id));
    if (!item) return;
    const isDone = item.status === 'done' || item.status === 'tamamlandi';
    const newStatus = isDone ? 'pending' : 'done';
    if (newStatus === 'done') toast.success('Görev tamamlandı! 🎉');
    updateModaringAjanda(id, { status: newStatus });
  };

  const handlePay = (item, bankId) => {
    // Record in Kasa
    const kasaEntry = {
      date: new Date().toISOString().split('T')[0],
      type: 'out',
      amount: Number(item.amount || 0),
      method: bankalar.find(b => String(b.id) === String(bankId))?.type === 'Kredi Kartı' ? 'POS' : 'Banka',
      bankId: bankId,
      note: `Ajanda Ödemesi: ${item.title || 'Dükkan Ödemesi'}`
    };
    
    addModaringKasaItem(kasaEntry);
    updateModaringAjanda(item.id, { status: 'done' });
    
    toast.success('Ödeme kasaya işlendi ve tamamlandı');
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Fatura': return <DollarSign size={18} />;
      case 'Ödeme': return <CreditCard size={18} />;
      case 'Hatırlatıcı': return <Bell size={18} />;
      default: return <Tag size={18} />;
    }
  };

  const isGuest = currentUser?.name === 'Misafir';

  return (
    <div className="tab-view-content animate-fadeIn">
      <div className="section-header-v2">
        <h3>📅 Dükkan Ajandası</h3>
        {!isGuest && (
          <button className="pill-btn-primary" onClick={() => { setEditingItem(null); setShowModal(true); }}>
            <Plus size={14} /> <span>Yeni Not</span>
          </button>
        )}
      </div>

      <div className="ajanda-summary glass mt-12 animate-pop">
        <div className="as-item">
          <small>Bekleyen Görev</small>
          <strong>{stats.pendingCount}</strong>
        </div>
        <div className="as-divider"></div>
        <div className="as-item">
          <small>Planlanan Ödeme</small>
          <strong className="text-red">{stats.totalPendingAmount.toLocaleString('tr-TR')} ₺</strong>
        </div>
      </div>

      <div className="filter-pills mt-20">
        <button className={`filter-pill ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Bekleyenler</button>
        <button className={`filter-pill ${filter === 'done' ? 'active' : ''}`} onClick={() => setFilter('done')}>Bitenler</button>
        <button className={`filter-pill ${filter === 'gecmis' ? 'active' : ''}`} onClick={() => setFilter('gecmis')}>📜 Geçmiş</button>
      </div>

      <div className="ajanda-list mt-16 pb-80">
        {filteredList.length === 0 ? (
          <div className="empty-state-card glass">
            <Calendar size={40} color="#fb7185" style={{ opacity: 0.5 }} />
            <h4>{filter === 'gecmis' ? 'Geçmiş Temiz' : 'Ajanda Boş'}</h4>
            <p>Seçilen kriterde bir kayıt bulunamadı.</p>
          </div>
        ) : (
          filteredList.map((item, idx) => {
            const isDone = item.status === 'done' || item.status === 'tamamlandi';
            const isDeleted = item.status === 'deleted';
            return (
              <div 
                key={item.id} 
                className={`ajanda-item-v2 glass animate-slideUp ${isDone ? 'done' : ''} ${isDeleted ? 'deleted-soft' : ''}`}
                style={{ animationDelay: `${idx * 0.05}s`, cursor: isGuest ? 'default' : 'pointer' }}
                onClick={() => { if (!isGuest) { setEditingItem(item); setShowModal(true); } }}
              >
                <div className="ai-status-btn" style={{ cursor: isGuest ? 'default' : 'pointer' }} onClick={(e) => { e.stopPropagation(); if (!isGuest) handleToggleStatus(item.id); }}>
                  {isDone ? <CheckCircle2 size={22} color="#10b981" /> : 
                   isDeleted ? <Trash2 size={20} color="#ef4444" /> :
                   <Clock size={22} color="#f59e0b" />}
                </div>
                <div className="ai-content">
                  <div className="hi-top-v2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ opacity: isDeleted ? 0.5 : 1 }}>{item.title}</strong>
                    {Number(item.amount) > 0 && <span className="ai-val">{Number(item.amount).toLocaleString('tr-TR')} ₺</span>}
                  </div>
                  <div className="ai-bottom">
                    <span><Calendar size={10} /> {formatDateSafe(item.dueDate)}</span>
                    <span className="ai-cat">{getCategoryIcon(item.category)} {item.category || 'Hatırlatıcı'}</span>
                    {isDeleted && <span className="soft-del-badge">SİLİNDİ</span>}
                  </div>
                </div>
                {!isGuest && (
                  <div className="ai-arrow">
                    <ChevronRight size={18} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <AjandaModal 
          item={editingItem}
          bankalar={bankalar}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          onDelete={handleDelete}
          onHardDelete={handleHardDelete}
          onRestore={handleRestore}
          onPay={handlePay}
        />
      )}

      <ConfirmModal 
        isOpen={confirmModal.isOpen} 
        title={confirmModal.title} 
        message={confirmModal.message} 
        onConfirm={confirmModal.onConfirm} 
        onCancel={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })} 
      />
    </div>
  );
};

const AjandaModal = ({ item, bankalar, onClose, onSave, onDelete, onHardDelete, onRestore, onPay }) => {
  const [form, setForm] = useState(item || {
    title: '',
    category: 'Hatırlatıcı',
    dueDate: new Date().toISOString().split('T')[0],
    amount: '',
    status: 'pending',
    note: ''
  });

  const [showPayOptions, setShowPayOptions] = useState(false);
  const isDone = item && (item.status === 'done' || item.status === 'tamamlandi');
  const isDeleted = item && item.status === 'deleted';

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content glass animate-pop kasa-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header-v2">
            <h3>{item ? 'Detayları Düzenle' : 'Yeni Kayıt'}</h3>
            <button className="icon-btn-small" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="modal-body-v2">
            <div className="form-group-v2">
              <label>Başlık / Konu</label>
              <input className="premium-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Örn: Kira Günü, Mal Alımı..." />
            </div>
            
            <div className="form-grid-v2 mt-12">
              <div className="form-group-v2">
                <label>Kategori</label>
                <select className="premium-select" value={form.category || 'Hatırlatıcı'} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="Hatırlatıcı">🔔 Hatırlatıcı</option>
                  <option value="Ödeme">💳 Ödeme</option>
                  <option value="Fatura">📄 Fatura</option>
                  <option value="Diğer">📦 Diğer</option>
                </select>
              </div>
              <div className="form-group-v2">
                <label>Tarih</label>
                <input type="date" className="premium-input" value={form.dueDate || ''} onChange={e => setForm({...form, dueDate: e.target.value})} />
              </div>
            </div>

            <div className="form-group-v2 mt-12">
              <label>Tutar (İsteğe Bağlı)</label>
              <input type="number" className="premium-input" value={form.amount || ''} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0 ₺" />
            </div>

            <div className="form-group-v2 mt-12">
              <label>Not</label>
              <textarea className="premium-textarea" value={form.note || ''} onChange={e => setForm({...form, note: e.target.value})} placeholder="Ek bilgiler..." rows={2} />
            </div>

            {item && Number(item.amount) > 0 && !isDone && !isDeleted && (
              <div className="pay-section-premium mt-16 animate-slideUp">
                {!showPayOptions ? (
                  <button className="pay-btn-v2" onClick={() => setShowPayOptions(true)}>
                    <DollarSign size={18} /> <span>Ödemeyi Kasadan Yap</span>
                  </button>
                ) : (
                  <div className="pay-options-grid">
                    <small className="w-100 mb-8" style={{ fontSize: '10px', color: 'var(--txt-light)' }}>
                      Bu işlem kasaya Gider olarak işlenecektir:
                    </small>
                    <button className="pay-option-btn nakit" onClick={() => onPay(item, 'nakit')}>💵 Nakit</button>
                    {bankalar.map(b => (
                      <button key={b.id} className="pay-option-btn" style={{ borderColor: b.color }} onClick={() => onPay(item, b.id)}>
                        {b.type === 'Kredi Kartı' ? '💳' : '🏦'} {b.name}
                      </button>
                    ))}
                    <button className="pay-option-btn cancel" onClick={() => setShowPayOptions(false)}>Vazgeç</button>
                  </div>
                )}
              </div>
            )}

            {isDone && (
              <div className="status-info-premium mt-16" style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '12px', borderRadius: '12px', color: '#10b981', fontSize: '12px', textAlign: 'center', fontWeight: '700' }}>
                <CheckCircle2 size={16} style={{ marginBottom: '4px' }} />
                <div>Bu görev tamamlandı olarak işaretlendi.</div>
              </div>
            )}

            {isDeleted && (
              <div className="status-info-premium mt-16" style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '12px', borderRadius: '12px', color: '#ef4444', fontSize: '12px', textAlign: 'center', fontWeight: '700' }}>
                <Trash2 size={16} style={{ marginBottom: '4px' }} />
                <div>Bu kayıt silindi ve arşive taşındı.</div>
                <button className="text-btn-small mt-8" style={{ color: '#3b82f6' }} onClick={() => onRestore(item.id)}>Geri Yükle</button>
              </div>
            )}

            <div className="modal-actions-v2 mt-24">
              {item && (
                <button className="icon-btn-danger" onClick={() => isDeleted ? onHardDelete(item.id) : onDelete(item.id)}>
                  <Trash2 size={20} />
                </button>
              )}
              <button className="submit-btn-premium" style={{ flex: 1 }} onClick={() => { if(!form.title) return toast.error('Başlık girin'); onSave(form); }}>
                <Save size={18} /> <span>Kaydet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AjandaTab;
