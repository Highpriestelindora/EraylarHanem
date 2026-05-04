import React, { useState, useMemo } from 'react';
import {
  Wallet, Plus, ArrowUpRight, ArrowDownLeft,
  CreditCard, Banknote, X, Trash2, Save,
  Calendar, Tag, FileText, TrendingUp, TrendingDown, ChevronRight
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const KasaTab = () => {
  const { modaring, setModuleData, forceSaveToSupabase } = useStore();
  const kasa = modaring?.kasa || [];
  const bankalar = modaring?.bankalar || [];

  const [showModal, setShowModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [selectedBankId, setSelectedBankId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });

  const stats = useMemo(() => {
    const nakit = kasa
      .filter(item => item.method === 'Nakit')
      .reduce((acc, item) => item.type === 'in' ? acc + Number(item.amount) : acc - Number(item.amount), 0);

    const bankTotals = bankalar.map(bank => {
      const balance = kasa
        .filter(item => item.bankId === bank.id)
        .reduce((acc, item) => item.type === 'in' ? acc + Number(item.amount) : acc - Number(item.amount), 0);
      return { ...bank, balance: Number(bank.initialBalance || 0) + balance };
    });

    const posTotal = bankTotals.filter(b => b.type === 'Kredi Kartı').reduce((acc, b) => acc + b.balance, 0);
    const bankTotal = bankTotals.filter(b => b.type === 'Banka Hesabı').reduce((acc, b) => acc + b.balance, 0);

    const totalIn = kasa.filter(i => i.type === 'in').reduce((acc, i) => acc + Number(i.amount), 0);
    const totalOut = kasa.filter(i => i.type === 'out').reduce((acc, i) => acc + Number(i.amount), 0);

    return { nakit, posTotal, bankTotal, bankTotals, totalIn, totalOut };
  }, [kasa, bankalar]);

  const handleSave = (transaction) => {
    let updatedKasa;
    if (transaction.id) {
      updatedKasa = kasa.map(item => item.id === transaction.id ? transaction : item);
    } else {
      updatedKasa = [{ ...transaction, id: Date.now().toString() }, ...kasa];
    }

    setModuleData('modaring', { kasa: updatedKasa });
    setShowModal(false);
    setEditingItem(null);
    toast.success('İşlem kaydedildi');
    setTimeout(() => forceSaveToSupabase(), 500);
  };

  const handleSaveBank = (bank) => {
    let updatedBanks;
    if (bank.id) {
      updatedBanks = bankalar.map(b => b.id === bank.id ? bank : b);
    } else {
      updatedBanks = [...bankalar, { ...bank, id: Date.now().toString() }];
    }
    setModuleData('modaring', { bankalar: updatedBanks });
    setShowBankModal(false);
    toast.success('Hesap kaydedildi');
    setTimeout(() => forceSaveToSupabase(), 500);
  };

  const handleDeleteBank = (id, name) => {
    setConfirmModal({
      show: true,
      title: 'Hesabı Sil',
      message: `${name} hesabını ve bu hesaba bağlı tüm kayıtları silmek istediğine emin misin?`,
      onConfirm: () => {
        const updatedBanks = bankalar.filter(b => b.id !== id);
        const updatedKasa = kasa.filter(k => k.bankId !== id);
        setModuleData('modaring', { bankalar: updatedBanks, kasa: updatedKasa });
        setConfirmModal({ show: false });
        toast.error('Hesap ve bağlı işlemler silindi');
        setTimeout(() => forceSaveToSupabase(), 500);
      }
    });
  };

  const handleDelete = (id) => {
    setConfirmModal({
      show: true,
      title: 'İşlemi Sil',
      message: 'Bu işlem kaydını silmek istediğine emin misin?',
      onConfirm: () => {
        const updatedKasa = kasa.filter(item => item.id !== id);
        setModuleData('modaring', { kasa: updatedKasa });
        setEditingItem(null);
        setShowModal(false);
        setConfirmModal({ show: false });
        toast.error('İşlem silindi');
        setTimeout(() => forceSaveToSupabase(), 500);
      }
    });
  };

  const filteredKasa = selectedBankId
    ? kasa.filter(item => item.bankId === selectedBankId)
    : (selectedBankId === 'nakit' ? kasa.filter(item => item.method === 'Nakit') : kasa);

  return (
    <div className="tab-view-content animate-fadeIn">
      <div className="section-header-v2">
        <h3>💰 Kasa Defteri</h3>
      </div>

      {/* Accounts Horizontal Scroll */}
      <div className="accounts-horizontal-scroll">
        <div
          className={`account-mini-card glass ${selectedBankId === 'nakit' ? 'active' : ''}`}
          onClick={() => setSelectedBankId(selectedBankId === 'nakit' ? null : 'nakit')}
        >
          <div className="amc-icon nakit"><Banknote size={16} /></div>
          <div className="amc-info">
            <small>Nakit</small>
            <strong>{stats.nakit.toLocaleString('tr-TR')} ₺</strong>
          </div>
        </div>

        {stats.bankTotals.map(bank => (
          <div
            key={bank.id}
            className={`account-mini-card glass ${selectedBankId === bank.id ? 'active' : ''}`}
            onClick={() => setSelectedBankId(selectedBankId === bank.id ? null : bank.id)}
            onContextMenu={(e) => { e.preventDefault(); handleDeleteBank(bank.id, bank.name); }}
          >
            <div className="amc-icon" style={{ background: `${bank.color}20`, color: bank.color }}>
              {bank.type === 'Kredi Kartı' ? <CreditCard size={16} /> : <ArrowUpRight size={16} />}
            </div>
            <div className="amc-info">
              <small>{bank.name}</small>
              <strong style={{ color: bank.balance < 0 ? '#ef4444' : 'inherit' }}>
                {bank.balance.toLocaleString('tr-TR')} ₺
              </strong>
            </div>
          </div>
        ))}
      </div>

      {/* Account Management Pill Buttons */}
      <div className="account-actions-pills mt-8">
        <button className="pill-btn-premium" onClick={() => setShowBankModal(true)}>
          <Plus size={14} /> <span>Banka / Kart Ekle</span>
        </button>
      </div>

      <div className="cash-flow-summary glass mt-16 p-16 animate-fadeIn">
        <div className="cf-item">
          <div className="cf-icon in"><TrendingUp size={14} /></div>
          <div className="cf-text">
            <small>Toplam Giriş</small>
            <strong>{stats.totalIn.toLocaleString('tr-TR')} ₺</strong>
          </div>
        </div>
        <div className="cf-divider"></div>
        <div className="cf-item">
          <div className="cf-icon out"><TrendingDown size={14} /></div>
          <div className="cf-text">
            <small>Toplam Çıkış</small>
            <strong>{stats.totalOut.toLocaleString('tr-TR')} ₺</strong>
          </div>
        </div>
      </div>

      <div className="section-header-v2 mt-24">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h3>📊 {selectedBankId ? (selectedBankId === 'nakit' ? 'Nakit Hareketleri' : bankalar.find(b => b.id === selectedBankId)?.name + ' Hareketleri') : 'Son İşlemler'}</h3>
          <button className="pill-btn-primary animate-pop" onClick={() => setShowModal(true)}>
            <Plus size={16} /> <span>Yeni İşlem</span>
          </button>
        </div>
      </div>
      {selectedBankId && <div className="mt-4"><button className="text-btn-small" onClick={() => setSelectedBankId(null)}>Tümünü Gör</button></div>}

      {filteredKasa.length === 0 ? (
        <div className="empty-state-card glass animate-pop">
          <div className="esc-icon">
            <Wallet size={40} color="#fb7185" />
          </div>
          <h4>Hareket Bulunamadı</h4>
          <p>Seçili hesapta henüz bir işlem kaydı yok.</p>
          <button className="esc-btn" onClick={() => setShowModal(true)}>İşlem Ekle</button>
        </div>
      ) : (
        <div className="kasa-list pb-80">
          {filteredKasa.map((item, idx) => (
            <div
              key={item.id}
              className="kasa-item-v2 glass animate-slideUp"
              style={{ animationDelay: `${idx * 0.05}s` }}
              onClick={() => { setEditingItem(item); setShowModal(true); }}
            >
              <div className={`ki-type-indicator ${item.type === 'in' ? 'in' : 'out'}`}>
                {item.type === 'in' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
              </div>
              <div className="ki-main">
                <div className="ki-top">
                  <strong>{item.note}</strong>
                  <span className={`ki-val ${item.type === 'in' ? 'text-green' : 'text-red'}`}>
                    {item.type === 'in' ? '+' : '-'}{Number(item.amount).toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="ki-bottom">
                  <span><Calendar size={10} /> {new Date(item.date).toLocaleDateString('tr-TR')}</span>
                  <span className="ki-tag"><Tag size={10} /> {item.bankId ? bankalar.find(b => b.id === item.bankId)?.name : item.method}</span>
                </div>
              </div>
              <div className="ki-edit-indicator">
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TransactionModal
          item={editingItem}
          bankalar={bankalar}
          onClose={() => { setShowModal(false); setEditingItem(null); }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {showBankModal && (
        <BankModal
          onClose={() => setShowBankModal(false)}
          onSave={handleSaveBank}
        />
      )}

      {confirmModal.show && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ show: false })}
        />
      )}
    </div>
  );
};

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="modal-overlay" style={{ zIndex: 2000 }} onClick={onCancel}>
    <div className="modal-content glass animate-pop" style={{ maxWidth: '320px', textAlign: 'center', padding: '24px' }} onClick={e => e.stopPropagation()}>
      <div className="confirm-icon-box mb-16" style={{ background: '#fee2e2', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
        <ArrowDownLeft size={28} color="#ef4444" />
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

const BankModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    type: 'Banka Hesabı',
    initialBalance: '',
    color: '#3b82f6'
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop kasa-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <h3>Yeni Hesap / Kart</h3>
          <button className="icon-btn-small" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body-v2">
          <div className="form-group-v2">
            <label>Hesap Adı</label>
            <input className="premium-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Örn: Garanti Bankası, Bonus Kart..." />
          </div>
          <div className="form-grid-v2 mt-12">
            <div className="form-group-v2">
              <label>Tür</label>
              <select className="premium-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="Banka Hesabı">🏦 Banka Hesabı</option>
                <option value="Kredi Kartı">💳 Kredi Kartı</option>
              </select>
            </div>
            <div className="form-group-v2">
              <label>Açılış Bakiyesi</label>
              <input type="number" className="premium-input" value={form.initialBalance} onChange={e => setForm({ ...form, initialBalance: e.target.value })} placeholder="0 ₺" />
            </div>
          </div>
          <div className="form-group-v2 mt-12">
            <label>Renk</label>
            <input type="color" className="premium-input-color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
          </div>
          <button className="submit-btn-premium mt-24" onClick={() => { if (!form.name) return toast.error('Ad girin'); onSave(form); }}>Hesap Ekle</button>
        </div>
      </div>
    </div>
  );
};

const TransactionModal = ({ item, bankalar, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState(item || {
    type: 'in',
    amount: '',
    method: 'Nakit',
    bankId: null,
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop kasa-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <div className="modal-title-with-icon">
            <div className="icon-box-premium" style={{ background: form.type === 'in' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
              {form.type === 'in' ? <TrendingUp size={20} color="#10b981" /> : <TrendingDown size={20} color="#ef4444" />}
            </div>
            <div>
              <h3>{item ? 'İşlemi Düzenle' : 'Yeni İşlem'}</h3>
              <small>{form.type === 'in' ? 'Gelir / Satış Kaydı' : 'Gider / Ödeme Kaydı'}</small>
            </div>
          </div>
          <button className="icon-btn-small" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body-v2">
          <div className="type-switcher-premium mb-16">
            <button
              className={`ts-btn in ${form.type === 'in' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, type: 'in' })}
            >
              Giriş (+)
            </button>
            <button
              className={`ts-btn out ${form.type === 'out' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, type: 'out' })}
            >
              Çıkış (-)
            </button>
          </div>

          <div className="form-group-v2">
            <label>Tutar (₺)</label>
            <div className="amount-input-wrapper">
              <input
                type="number"
                className="premium-input amount-input"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                autoFocus
              />
            </div>
          </div>

          <div className="form-grid-v2 mt-12">
            <div className="form-group-v2">
              <label>Ödeme Yöntemi / Hesap</label>
              <select
                className="premium-select"
                value={form.bankId || form.method}
                onChange={e => {
                  const val = e.target.value;
                  if (val === 'Nakit') setForm({ ...form, method: 'Nakit', bankId: null });
                  else setForm({ ...form, method: bankalar.find(b => b.id === val)?.type === 'Kredi Kartı' ? 'POS' : 'Banka', bankId: val });
                }}
              >
                <option value="Nakit">💵 Nakit Kasa</option>
                {bankalar.map(b => (
                  <option key={b.id} value={b.id}>{b.type === 'Kredi Kartı' ? '💳' : '🏦'} {b.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group-v2">
              <label>Tarih</label>
              <input
                type="date"
                className="premium-input"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group-v2 mt-12">
            <label>Açıklama / Not</label>
            <div className="input-with-icon-v2">
              <FileText size={16} className="input-icon" />
              <input
                className="premium-input has-icon"
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                placeholder="Örn: Günlük Ciro, Kira Ödemesi..."
              />
            </div>
          </div>

          <div className="modal-actions-v2 mt-24">
            {item && (
              <button className="icon-btn-danger" onClick={() => onDelete(item.id)}>
                <Trash2 size={20} />
              </button>
            )}
            <button
              className="submit-btn-premium"
              style={{ flex: 1 }}
              onClick={() => {
                if (!form.amount || !form.note) return toast.error('Lütfen tutar ve açıklama girin');
                onSave(form);
              }}
            >
              <Save size={18} />
              <span>{item ? 'Güncelle' : 'Kaydet'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KasaTab;
