import React, { useState, useMemo } from 'react';
import { 
  Package, Plus, ExternalLink, Globe, Phone, 
  ChevronRight, StickyNote, ShoppingCart, CreditCard, 
  Trash2, X, Save, Calendar, Tag, FileText, CheckCircle2, Clock
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const TedarikTab = () => {
  const { modaring, setModuleData, forceSaveToSupabase } = useStore();
  const suppliers = modaring?.tedarik || [];
  const orders = modaring?.siparisler || [];
  const bankalar = modaring?.bankalar || [];

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, onConfirm: null });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  const handleSaveSupplier = (supplier) => {
    let updated;
    if (supplier.id) {
      updated = suppliers.map(s => s.id === supplier.id ? supplier : s);
    } else {
      updated = [...suppliers, { ...supplier, id: Date.now().toString() }];
    }
    setModuleData('modaring', { tedarik: updated });
    setShowSupplierModal(false);
    setEditingSupplier(null);
    toast.success('Tedarikçi kaydedildi');
    setTimeout(() => forceSaveToSupabase(), 500);
  };

  const handleDeleteSupplier = (id) => {
    setConfirmModal({
      show: true,
      onConfirm: () => {
        const updated = suppliers.filter(s => s.id !== id);
        const updatedOrders = orders.filter(o => o.supplierId !== id);
        setModuleData('modaring', { tedarik: updated, siparisler: updatedOrders });
        setConfirmModal({ show: false });
        setShowSupplierModal(false);
        setSelectedSupplier(null);
        toast.error('Tedarikçi ve tüm siparişleri silindi');
        setTimeout(() => forceSaveToSupabase(), 500);
      }
    });
  };

  const handleSaveOrder = (order) => {
    let updatedOrders;
    if (order.id) {
      updatedOrders = orders.map(o => o.id === order.id ? order : o);
    } else {
      updatedOrders = [{ ...order, id: Date.now().toString() }, ...orders];
    }

    // If it's a payment/expense, sync with Kasa
    if (order.syncWithKasa && order.paid > 0) {
      const kasaEntry = {
        id: Date.now().toString() + '_sync',
        date: order.date,
        type: 'out',
        amount: order.paid,
        method: bankalar.find(b => b.id === order.bankId)?.type === 'Kredi Kartı' ? 'POS' : 'Banka',
        bankId: order.bankId,
        note: `${suppliers.find(s => s.id === order.supplierId)?.name} Ödemesi (${order.items || 'Sipariş'})`
      };
      const updatedKasa = [kasaEntry, ...(modaring?.kasa || [])];
      setModuleData('modaring', { siparisler: updatedOrders, kasa: updatedKasa });
    } else {
      setModuleData('modaring', { siparisler: updatedOrders });
    }

    setShowOrderModal(false);
    toast.success('Sipariş/Ödeme kaydedildi');
    setTimeout(() => forceSaveToSupabase(), 500);
  };

  const handleDeleteOrder = (id) => {
    const updated = orders.filter(o => o.id !== id);
    setModuleData('modaring', { siparisler: updated });
    toast.error('Sipariş silindi');
    setTimeout(() => forceSaveToSupabase(), 500);
  };


  // Sub-render for Detail View
  const renderDetailView = () => {
    if (!selectedSupplier) return null;
    const supplierOrders = orders.filter(o => o.supplierId === selectedSupplier.id);
    const totalDebt = supplierOrders.reduce((acc, o) => acc + (Number(o.total) - Number(o.paid)), 0);

    return (
      <div className="animate-fadeIn">
        <div className="detail-header-v2">
          <button className="back-btn-v2" onClick={() => setSelectedSupplier(null)}>
            <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div className="dh-info">
            <h3>{selectedSupplier.name}</h3>
            <small>{selectedSupplier.category}</small>
          </div>
          <button className="icon-btn-small" onClick={() => { setEditingSupplier(selectedSupplier); setShowSupplierModal(true); }}>
            <FileText size={18} />
          </button>
        </div>

        <div className="debt-card glass mt-12 animate-pop">
          <div className="dc-label">Güncel Borç Durumu</div>
          <div className={`dc-val ${totalDebt > 0 ? 'text-red' : 'text-green'}`}>
            {totalDebt.toLocaleString('tr-TR')} ₺
          </div>
          <div className="dc-footer">
            <small>{supplierOrders.length} Sipariş Toplamı</small>
          </div>
        </div>

        <div className="section-header-v2 mt-20">
          <h3>📦 Sipariş & Ödeme Geçmişi</h3>
          <button className="pill-btn-primary" onClick={() => setShowOrderModal(true)}>
            <Plus size={14} /> <span>Yeni Sipariş</span>
          </button>
        </div>

        <div className="orders-list pb-80">
          {supplierOrders.length === 0 ? (
            <div className="empty-state-card glass">
              <p>Henüz sipariş kaydı bulunmuyor.</p>
            </div>
          ) : (
            supplierOrders.map(order => {
              const remaining = Number(order.total) - Number(order.paid);
              const progress = Math.min(100, (Number(order.paid) / Number(order.total)) * 100);
              
              return (
                <div key={order.id} className="order-item-v3 glass animate-slideUp">
                  <div className="oi-content">
                    <div className="oi-header">
                      <div className="oi-title">
                        <strong>{order.items}</strong>
                        <small><Calendar size={10} /> {new Date(order.date).toLocaleDateString('tr-TR')}</small>
                      </div>
                      <div className="oi-price">
                        <span className="total-val">{Number(order.total).toLocaleString('tr-TR')} ₺</span>
                        {remaining > 0 && <span className="debt-val">-{remaining.toLocaleString('tr-TR')} ₺</span>}
                      </div>
                    </div>

                    <div className="oi-progress-container">
                      <div className="oi-progress-bar">
                        <div className="oi-progress-fill" style={{ width: `${progress}%`, background: progress === 100 ? '#10b981' : 'var(--modaring-accent)' }}></div>
                      </div>
                      <div className="oi-progress-text">
                        <span>%{Math.round(progress)} Ödendi</span>
                        {order.bankId && <span><CreditCard size={10} /> {bankalar.find(b => b.id === order.bankId)?.name}</span>}
                      </div>
                    </div>

                    <div className="oi-status-quick-switch">
                      {[
                        { label: 'Bekliyor', icon: <Clock size={12} />, color: '#f59e0b' },
                        { label: 'Yolda', icon: <Package size={12} />, color: '#3b82f6' },
                        { label: 'Tamamlandı', icon: <CheckCircle2 size={12} />, color: '#10b981' }
                      ].map(s => (
                        <button 
                          key={s.label}
                          className={`qs-btn ${order.status === s.label ? 'active' : ''}`}
                          style={{ '--active-bg': s.color }}
                          onClick={() => {
                            const updated = orders.map(o => o.id === order.id ? { ...o, status: s.label } : o);
                            setModuleData('modaring', { siparisler: updated });
                            toast.success(`Durum: ${s.label}`);
                            setTimeout(() => forceSaveToSupabase(), 500);
                          }}
                        >
                          {s.icon}
                          <span>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="oi-actions">
                    <button className="oi-action-btn delete" onClick={() => handleDeleteOrder(order.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {showOrderModal && (
          <OrderModal 
            supplierId={selectedSupplier.id}
            bankalar={bankalar}
            onClose={() => setShowOrderModal(false)}
            onSave={handleSaveOrder}
          />
        )}
      </div>
    );
  };

  return (
    <div className="tab-view-content animate-fadeIn">
      {selectedSupplier ? renderDetailView() : (
        <>
          <div className="section-header-v2">
            <h3>📦 Tedarikçiler & Toptan</h3>
            <button className="pill-btn-primary" onClick={() => { setEditingSupplier(null); setShowSupplierModal(true); }}>
              <Plus size={14} /> <span>Tedarikçi Ekle</span>
            </button>
          </div>

          <div className="search-bar-premium mt-12 mb-16">
            <input 
              type="text" 
              placeholder="Tedarikçi veya kategori ara..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="premium-input"
            />
          </div>

          <div className="suppliers-grid pb-80">
            {filteredSuppliers.length === 0 ? (
              <div className="empty-state-card glass">
                <Package size={40} color="#fb7185" style={{ opacity: 0.5 }} />
                <h4>{searchTerm ? 'Sonuç Bulunamadı' : 'Tedarikçi Listesi Boş'}</h4>
                <p>{searchTerm ? 'Farklı bir arama yapmayı dene.' : 'Mal alımı yaptığın toptancıları buraya ekleyerek takip yapabilirsin.'}</p>
              </div>
            ) : (
              filteredSuppliers.map(sup => {
                const supOrders = orders.filter(o => o.supplierId === sup.id);
                const debt = supOrders.reduce((acc, o) => acc + (Number(o.total) - Number(o.paid)), 0);
                
                return (
                  <div key={sup.id} className="supplier-card-v2 glass animate-pop" onClick={() => setSelectedSupplier(sup)}>
                    <div className="sc-header">
                      <div className="sc-icon-box">
                        <Package size={20} color="#fb7185" />
                      </div>
                      <div className="sc-titles">
                        <strong>{sup.name}</strong>
                        <small>{sup.category}</small>
                      </div>
                      <ChevronRight size={18} className="sc-arrow" />
                    </div>
                    <div className="sc-stats">
                      <div className="sc-stat">
                        <small>Sipariş</small>
                        <strong>{supOrders.length}</strong>
                      </div>
                      <div className="sc-stat">
                        <small>Borç</small>
                        <strong className={debt > 0 ? 'text-red' : 'text-green'}>{debt.toLocaleString('tr-TR')} ₺</strong>
                      </div>
                    </div>
                    {sup.note && (
                      <div className="sc-note">
                        <StickyNote size={12} /> {sup.note.substring(0, 30)}{sup.note.length > 30 ? '...' : ''}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {showSupplierModal && (
        <SupplierModal 
          item={editingSupplier}
          onClose={() => setShowSupplierModal(false)}
          onSave={handleSaveSupplier}
          onDelete={handleDeleteSupplier}
        />
      )}

      {confirmModal.show && (
        <ConfirmModal 
          title="Tedarikçiyi Sil"
          message="Bu tedarikçiyi ve tüm sipariş geçmişini silmek istediğine emin misin?"
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ show: false })}
        />
      )}
    </div>
  );
};

const SupplierModal = ({ item, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState(item || {
    name: '',
    category: 'Vip Seri / Çelik',
    contact: '',
    link: '',
    note: ''
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop kasa-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <h3>{item ? 'Tedarikçi Düzenle' : 'Yeni Tedarikçi'}</h3>
          <button className="icon-btn-small" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body-v2">
          <div className="form-group-v2">
            <label>Firma Adı</label>
            <input className="premium-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Örn: Xuping Jewelry" />
          </div>
          <div className="form-grid-v2 mt-12">
            <div className="form-group-v2">
              <label>Kategori</label>
              <select className="premium-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="Vip Seri / Çelik">Vip Seri / Çelik</option>
                <option value="Bijuteri">Bijuteri</option>
                <option value="Ambalaj">Ambalaj</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
            <div className="form-group-v2">
              <label>İlgili Kişi</label>
              <input className="premium-input" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} placeholder="Ad Soyad" />
            </div>
          </div>
          <div className="form-group-v2 mt-12">
            <label>Website / Link</label>
            <input className="premium-input" value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="https://..." />
          </div>
          <div className="form-group-v2 mt-12">
            <label>Notlar</label>
            <textarea className="premium-textarea" value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Tedarikçi hakkında özel notlar..." rows={3} />
          </div>
          
          <div className="modal-actions-v2 mt-24">
            {item && (
              <button className="icon-btn-danger" onClick={() => onDelete(item.id)}>
                <Trash2 size={20} />
              </button>
            )}
            <button className="submit-btn-premium" style={{ flex: 1 }} onClick={() => { if(!form.name) return toast.error('İsim girin'); onSave(form); }}>
              <Save size={18} /> <span>Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderModal = ({ supplierId, bankalar, onClose, onSave }) => {
  const [form, setForm] = useState({
    supplierId,
    date: new Date().toISOString().split('T')[0],
    items: '',
    total: '',
    paid: '',
    status: 'Bekliyor',
    bankId: '',
    syncWithKasa: true
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop kasa-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <h3>Yeni Sipariş / Ödeme</h3>
          <button className="icon-btn-small" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body-v2">
          <div className="form-group-v2">
            <label>Sipariş İçeriği</label>
            <input className="premium-input" value={form.items} onChange={e => setForm({...form, items: e.target.value})} placeholder="Örn: 50 Adet Çelik Kolye" />
          </div>
          <div className="form-grid-v2 mt-12">
            <div className="form-group-v2">
              <label>Toplam Tutar (₺)</label>
              <input type="number" className="premium-input" value={form.total} onChange={e => setForm({...form, total: e.target.value})} placeholder="0 ₺" />
            </div>
            <div className="form-group-v2">
              <label>Ödenen Tutar (₺)</label>
              <input type="number" className="premium-input" value={form.paid} onChange={e => setForm({...form, paid: e.target.value})} placeholder="0 ₺" />
            </div>
          </div>
          
          <div className="form-grid-v2 mt-12">
            <div className="form-group-v2">
              <label>Durum</label>
              <select className="premium-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="Bekliyor">⏳ Bekliyor</option>
                <option value="Yolda">🚚 Yolda</option>
                <option value="Tamamlandı">✅ Tamamlandı</option>
              </select>
            </div>
            <div className="form-group-v2">
              <label>Ödeme Hesabı</label>
              <select className="premium-select" value={form.bankId} onChange={e => setForm({...form, bankId: e.target.value})}>
                <option value="">Seçiniz (Borç Olarak Kalsın)</option>
                <option value="Nakit">💵 Nakit Kasa</option>
                {bankalar.map(b => (
                  <option key={b.id} value={b.id}>{b.type === 'Kredi Kartı' ? '💳' : '🏦'} {b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-check-v2 mt-12">
            <input type="checkbox" id="syncKasa" checked={form.syncWithKasa} onChange={e => setForm({...form, syncWithKasa: e.target.checked})} />
            <label htmlFor="syncKasa">Kasaya Gider Olarak İşle</label>
          </div>

          <button className="submit-btn-premium mt-24" onClick={() => { if(!form.items || !form.total) return toast.error('Eksik bilgi'); onSave(form); }}>
            <Save size={18} /> <span>Kaydet</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="modal-overlay" style={{ zIndex: 2000 }} onClick={onCancel}>
    <div className="modal-content glass animate-pop" style={{ maxWidth: '320px', textAlign: 'center', padding: '24px' }} onClick={e => e.stopPropagation()}>
      <div className="confirm-icon-box mb-16" style={{ background: '#fee2e2', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
        <Trash2 size={28} color="#ef4444" />
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

export default TedarikTab;
