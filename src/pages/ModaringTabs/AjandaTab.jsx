import React, { useState, useMemo } from 'react';
import { 
  Calendar, Plus, AlertCircle, CheckCircle2, 
  Trash2, X, Save, Clock, Bell, DollarSign, 
  ChevronRight, ArrowRight, Tag, FileText, Filter, CreditCard
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const AjandaTab = () => {
  const { modaring, setModuleData, forceSaveToSupabase } = useStore();
  const ajanda = modaring?.ajanda || [];
  const bankalar = modaring?.bankalar || [];

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('pending'); // pending, done, gecmis
  const [confirmModal, setConfirmModal] = useState({ show: false, onConfirm: null });

  const stats = useMemo(() => {
    const pending = ajanda.filter(i => i.status === 'pending');
    const totalPendingAmount = pending.reduce((acc, i) => acc + Number(i.amount || 0), 0);
    return { pendingCount: pending.length, totalPendingAmount };
  }, [ajanda]);

  const filteredList = useMemo(() => {
    let list = [...ajanda].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    if (filter === 'pending') return list.filter(i => i.status === 'pending');
    if (filter === 'done') return list.filter(i => i.status === 'done');
    if (filter === 'gecmis') return list.filter(i => i.status === 'done' || i.status === 'deleted').reverse();
    return list.filter(i => i.status !== 'deleted');
  }, [ajanda, filter]);

  const handleSave = (item) => {
    let updated;
    if (item.id) {
      updated = ajanda.map(i => i.id === item.id ? item : i);
    } else {
      updated = [{ ...item, id: Date.now().toString() }, ...ajanda];
    }
    setModuleData('modaring', { ajanda: updated });
    setShowModal(false);
    setEditingItem(null);
    toast.success('Ajanda güncellendi');
    setTimeout(() => forceSaveToSupabase(), 500);
  };

  const handleDelete = (id) => {
    setConfirmModal({
      show: true,
      onConfirm: () => {
        const updated = ajanda.map(i => i.id === id ? { ...i, status: 'deleted' } : i);
        setModuleData('modaring', { ajanda: updated });
        setConfirmModal({ show: false });
        setShowModal(false);
        setEditingItem(null);
        toast.error('Kayıt arşive taşındı');
        setTimeout(() => forceSaveToSupabase(), 500);
      }
    });
  };

  const handleHardDelete = (id) => {
    setConfirmModal({
      show: true,
      onConfirm: () => {
        const updated = ajanda.filter(i => i.id !== id);
        setModuleData('modaring', { ajanda: updated });
        setConfirmModal({ show: false });
        setShowModal(false);
        setEditingItem(null);
        toast.error('Kayıt tamamen silindi');
        setTimeout(() => forceSaveToSupabase(), 500);
      }
    });
  };

  const handleRestore = (id) => {
    const updated = ajanda.map(i => i.id === id ? { ...i, status: 'pending' } : i);
    setModuleData('modaring', { ajanda: updated });
    toast.success('Kayıt geri yüklendi');
    setTimeout(() => forceSaveToSupabase(), 500);
  };

  const handleToggleStatus = (id) => {
    const updated = ajanda.map(i => {
      if (i.id === id) {
        const newStatus = i.status === 'done' ? 'pending' : 'done';
        if (newStatus === 'done') toast.success('Görev tamamlandı! 🎉');
        return { ...i, status: newStatus };
      }
      return i;
    });
    setModuleData('modaring', { ajanda: updated });
    setTimeout(() => forceSaveToSupabase(), 500);
  };

  const handlePay = (item, bankId) => {
    // Record in Kasa
    const kasaEntry = {
      id: Date.now().toString() + '_pay',
      date: new Date().toISOString().split('T')[0],
      type: 'out',
      amount: item.amount,
      method: bankalar.find(b => b.id === bankId)?.type === 'Kredi Kartı' ? 'POS' : 'Banka',
      bankId: bankId,
      note: `Ajanda Ödemesi: ${item.title}`
    };
    
    const updatedKasa = [kasaEntry, ...(modaring?.kasa || [])];
    const updatedAjanda = ajanda.map(i => i.id === item.id ? { ...i, status: 'done' } : i);
    
    setModuleData('modaring', { kasa: updatedKasa, ajanda: updatedAjanda });
    toast.success('Ödeme kasaya işlendi ve tamamlandı');
    setTimeout(() => forceSaveToSupabase(), 500);
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Fatura': return <DollarSign size={18} />;
      case 'Ödeme': return <CreditCard size={18} />;
      case 'Hatırlatıcı': return <Bell size={18} />;
      default: return <Tag size={18} />;
    }
  };

  return (
    <div className="tab-view-content animate-fadeIn">
      <div className="section-header-v2">
        <h3>📅 Dükkan Ajandası</h3>
        <button className="pill-btn-primary" onClick={() => { setEditingItem(null); setShowModal(true); }}>
          <Plus size={14} /> <span>Yeni Not</span>
        </button>
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
          filteredList.map((item, idx) => (
            <div 
              key={item.id} 
              className={`ajanda-item-v2 glass animate-slideUp ${item.status === 'done' ? 'done' : ''} ${item.status === 'deleted' ? 'deleted-soft' : ''}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
              onClick={() => { setEditingItem(item); setShowModal(true); }}
            >
              <div className="ai-status-btn" onClick={(e) => { e.stopPropagation(); handleToggleStatus(item.id); }}>
                {item.status === 'done' ? <CheckCircle2 size={22} color="#10b981" /> : 
                 item.status === 'deleted' ? <Trash2 size={20} color="#ef4444" /> :
                 <Clock size={22} color="#f59e0b" />}
              </div>
              <div className="ai-content">
                <div className="hi-top-v2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ opacity: item.status === 'deleted' ? 0.5 : 1 }}>{item.title}</strong>
                  {item.amount > 0 && <span className="ai-val">{Number(item.amount).toLocaleString('tr-TR')} ₺</span>}
                </div>
                <div className="ai-bottom">
                  <span><Calendar size={10} /> {new Date(item.dueDate).toLocaleDateString('tr-TR')}</span>
                  <span className="ai-cat">{getCategoryIcon(item.category)} {item.category}</span>
                  {item.status === 'deleted' && <span className="soft-del-badge">SİLİNDİ</span>}
                </div>
              </div>
              <div className="ai-arrow">
                <ChevronRight size={18} />
              </div>
            </div>
          ))
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

      {confirmModal.show && (
        <ConfirmModal 
          title="Kaydı Sil"
          message="Bu ajanda kaydını silmek istediğine emin misin?"
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ show: false })}
        />
      )}
    </div>
  );
};

const AjandaModal = ({ item, bankalar, onClose, onSave, onDelete, onPay }) => {
  const [form, setForm] = useState(item || {
    title: '',
    category: 'Hatırlatıcı',
    dueDate: new Date().toISOString().split('T')[0],
    amount: '',
    status: 'pending',
    note: ''
  });

  const [showPayOptions, setShowPayOptions] = useState(false);

  return (
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
              <select className="premium-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="Hatırlatıcı">🔔 Hatırlatıcı</option>
                <option value="Ödeme">💳 Ödeme</option>
                <option value="Fatura">📄 Fatura</option>
                <option value="Diğer">📦 Diğer</option>
              </select>
            </div>
            <div className="form-group-v2">
              <label>Tarih</label>
              <input type="date" className="premium-input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
            </div>
          </div>

          <div className="form-group-v2 mt-12">
            <label>Tutar (İsteğe Bağlı)</label>
            <input type="number" className="premium-input" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0 ₺" />
          </div>

          <div className="form-group-v2 mt-12">
            <label>Not</label>
            <textarea className="premium-textarea" value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Ek bilgiler..." rows={2} />
          </div>

          {item && Number(item.amount) > 0 && item.status !== 'done' && (
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

          {item && item.status === 'done' && (
            <div className="status-info-premium mt-16" style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '12px', borderRadius: '12px', color: '#10b981', fontSize: '12px', textAlign: 'center', fontWeight: '700' }}>
              <CheckCircle2 size={16} style={{ marginBottom: '4px' }} />
              <div>Bu görev tamamlandı olarak işaretlendi.</div>
            </div>
          )}

          {item && item.status === 'deleted' && (
            <div className="status-info-premium mt-16" style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '12px', borderRadius: '12px', color: '#ef4444', fontSize: '12px', textAlign: 'center', fontWeight: '700' }}>
              <Trash2 size={16} style={{ marginBottom: '4px' }} />
              <div>Bu kayıt silindi ve arşive taşındı.</div>
              <button className="text-btn-small mt-8" style={{ color: '#3b82f6' }} onClick={() => onRestore(item.id)}>Geri Yükle</button>
            </div>
          )}

          <div className="modal-actions-v2 mt-24">
            {item && (
              <button className="icon-btn-danger" onClick={() => item.status === 'deleted' ? onHardDelete(item.id) : onDelete(item.id)}>
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
  );
};

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="modal-overlay" style={{ zIndex: 2000 }} onClick={onCancel}>
    <div className="modal-content glass animate-pop" style={{ maxWidth: '320px', textAlign: 'center', padding: '24px' }} onClick={e => e.stopPropagation()}>
      <div className="confirm-icon-box mb-16" style={{ background: '#fee2e2', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
        <Calendar size={28} color="#ef4444" />
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: 'var(--txt-light)', lineHeight: '1.5', marginBottom: '24px' }}>{message}</p>
      <div className="modal-actions-v2" style={{ gap: '12px' }}>
        <button className="premium-btn-secondary" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', background: 'transparent' }} onClick={onCancel}>İptal</button>
        <button className="premium-btn-danger" style={{ flex: 1, background: '#ef4444', color: 'white', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 'bold' }} onClick={onConfirm}>Evet, Sil</button>
      </div>
    </div>
  </div>
);

export default AjandaTab;
