import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, PlusCircle, 
  X, ArrowRightLeft, CreditCard, Landmark, 
  Plus, Receipt, ChevronRight, Wallet, Filter, ArrowLeft, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import './Finans.css';

const formatMoney = (val) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);

export default function Finans() {
  const [activeTab, setActiveTab] = useState('bakiye');
  const navigate = useNavigate();
  const { finans, kasa, addExpense, updateKasa, transferKasa, payDebt, updateDebt, updateCard, payLoanInstallment } = useStore();
  
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showUpdateKasa, setShowUpdateKasa] = useState(null);
  const [payingDebt, setPayingDebt] = useState(null);

  const bakiyeler = kasa?.bakiyeler || { gorkem: 0, esra: 0, ortak: 0 };
  const harcamalar = finans?.harcamalar || [];
  const borclar = finans?.borclar || [];
  const kartlar = finans?.kartlar || [];
  const history = finans?.history || [];
  const rekurans = finans?.rekurans || [];

  const totalBalance = Object.values(bakiyeler).reduce((a, b) => a + b, 0);
  const totalDebt = borclar.reduce((a, b) => a + (b.remaining || 0), 0) + kartlar.reduce((a, b) => a + (b.balance || 0), 0);

  const categories = [
    { id: 'mutfak', label: 'Mutfak', icon: '🍲', color: '#10B981' },
    { id: 'arac', label: 'Araç', icon: '🚗', color: '#3B82F6' },
    { id: 'sosyal', label: 'Sosyal', icon: '🎭', color: '#8B5CF6' },
    { id: 'pet', label: 'Pet', icon: '🐾', color: '#F59E0B' },
    { id: 'tatil', label: 'Tatil', icon: '✈️', color: '#0ea5e9' },
    { id: 'saglik', label: 'Sağlık', icon: '🏥', color: '#ef4444' },
    { id: 'fatura', label: 'Fatura', icon: '📜', color: '#F59E0B' },
    { id: 'diger', label: 'Diğer', icon: '🏷️', color: '#6B7280' }
  ];

  const confirmPayDebt = () => {
    if (payingDebt) {
      payLoanInstallment(payingDebt.id);
      toast.success('Taksit ödendi! 💸');
      setPayingDebt(null);
    }
  };

  const renderDebtSection = (owner) => {
    const ownerBorclar = borclar.filter(b => (b.owner || 'ortak') === owner);
    const ownerKartlar = kartlar.filter(k => (k.owner || 'ortak') === owner);

    if (ownerBorclar.length === 0 && ownerKartlar.length === 0) return null;

    return (
      <div className="owner-debt-group" key={owner}>
        <h4 className="owner-title">{owner === 'gorkem' ? '👨 Görkem' : owner === 'esra' ? '👩 Esra' : '🏡 Ortak'}</h4>
        
        {ownerBorclar.map(borc => (
          <div key={borc.id} className="debt-card glass">
            <div className="dc-header">
              <Landmark size={20} color="var(--primary)" />
              <div className="dc-title">
                <strong>{borc.name}</strong>
                <small>Kalan: {formatMoney(borc.remaining)} / {formatMoney(borc.total)}</small>
              </div>
            </div>
            <div className="dc-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(1 - borc.remaining / borc.total) * 100}%` }} />
              </div>
              <div className="progress-labels">
                <span>%{Math.round((1 - borc.remaining / borc.total) * 100)} Tamamlandı</span>
                <span>{Math.round(borc.remaining / borc.monthly)} Taksit Kaldı</span>
              </div>
            </div>
            <div className="dc-footer">
              <div className="dc-meta">
                <span>Aylık: <strong>{formatMoney(borc.monthly)}</strong></span>
              </div>
              <button 
                className="pay-btn"
                onClick={() => setPayingDebt(borc)}
              >
                Taksit Öde
              </button>
            </div>
          </div>
        ))}

        <div className="card-grid">
          {ownerKartlar.map(card => (
            <div key={card.id} className="cc-card glass">
              <div className="cc-top">
                <CreditCard size={24} />
                <strong>{card.name}</strong>
              </div>
              <div className="cc-balance">
                <small>Güncel Borç</small>
                <strong>{formatMoney(card.balance)}</strong>
              </div>
              <div className="cc-limit">
                <div className="limit-bar">
                  <div className="limit-fill" style={{ width: `${(card.balance / card.limit) * 100}%` }} />
                </div>
                <div className="limit-labels">
                  <span>Limit: {formatMoney(card.limit)}</span>
                  <span>%{Math.round((card.balance / card.limit) * 100)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'bakiye', label: 'Varlıklar', emoji: '💎' },
    { id: 'borc', label: 'Borçlar', emoji: '🏦' },
    { id: 'gecmis', label: 'Analiz', emoji: '📊' },
    { id: 'abonelik', label: 'Abonelik', emoji: '📺' }
  ];

  return (
    <AnimatedPage className="finans-container">
      <header className="module-header glass" style={{ background: 'var(--money-gradient, linear-gradient(135deg, #10b981, #059669))' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">💰</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Finans</h1>
              <p>{formatMoney(totalBalance)} Birikim · {formatMoney(totalDebt)} Borç</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn white" onClick={() => setShowAddExpense(true)} title="Harcama Ekle">
              <Plus size={20} />
            </button>
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
            >
              <span style={{ fontSize: '16px', marginBottom: '2px' }}>{tab.emoji}</span>
              <span>{tab.label}</span>
              {activeTab === tab.id && <div className="tab-dot" />}
            </button>
          ))}
        </nav>
      </header>

      <div className="finans-content">
        {activeTab === 'bakiye' && (
          <div className="bakiye-view animate-fadeIn">
            <div className="person-grid">
              {Object.entries(bakiyeler).map(([kisi, val]) => (
                <div key={kisi} className={`person-card glass ${kisi}`}>
                  <div className="p-header">
                    <span className="p-emoji">{kisi === 'gorkem' ? '👨' : kisi === 'esra' ? '👩' : '🏡'}</span>
                    <span className="p-name">{kisi.toUpperCase()}</span>
                  </div>
                  <div className="p-val">{formatMoney(val)}</div>
                  <button className="update-btn" onClick={() => setShowUpdateKasa(kisi)}>Güncelle</button>
                </div>
              ))}
            </div>

            <div className="quick-actions mt-20">
              <button className="action-card glass" onClick={() => setShowAddExpense(true)}>
                <div className="ac-icon expense"><Plus size={20} /></div>
                <span>Harcama Gir</span>
              </button>
              <button className="action-card glass" onClick={() => setShowTransfer(true)}>
                <div className="ac-icon transfer"><ArrowRightLeft size={20} /></div>
                <span>Transfer Yap</span>
              </button>
            </div>

            <div className="section-header mt-20">
              <h3>🛍️ Son Harcamalar</h3>
              <button className="text-btn">Tümünü Gör</button>
            </div>
            <div className="expense-list">
              {harcamalar.length === 0 ? (
                <div className="empty-state glass">
                  <span style={{ fontSize: '32px', marginBottom: '10px' }}>💸</span>
                  <p>Henüz harcama girilmemiş.</p>
                </div>
              ) : (
                harcamalar.slice(0, 10).map(exp => (
                  <div key={exp.id} className="expense-item glass">
                    <div className="exp-icon" style={{ background: categories.find(c => c.id === exp.category)?.color + '20' }}>
                      {categories.find(c => c.id === exp.category)?.icon || '🏷️'}
                    </div>
                    <div className="exp-info">
                      <strong>{exp.title}</strong>
                      <span>{new Date(exp.dt).toLocaleDateString('tr-TR')} · {exp.payer?.toUpperCase()}</span>
                    </div>
                    <div className="exp-amt-group">
                      <div className="exp-amt">-{formatMoney(exp.amount)}</div>
                      <button className="delete-exp-btn" onClick={() => setDeletingExpense(exp)} title="Harcamayı Sil">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'borc' && (
          <div className="borc-view animate-fadeIn">
            {['gorkem', 'esra', 'ortak'].map(owner => renderDebtSection(owner))}
          </div>
        )}

        {activeTab === 'gecmis' && (
          <div className="analysis-view animate-fadeIn">
            <div className="stats-grid">
              <div className="stat-box glass">
                <TrendingDown size={20} color="#EF4444" />
                <div className="sb-info">
                  <small>Bu Ay Harcanan</small>
                  <strong>{formatMoney(12450)}</strong>
                </div>
              </div>
              <div className="stat-box glass">
                <TrendingUp size={20} color="#10B981" />
                <div className="sb-info">
                  <small>Bu Ay Tasarruf</small>
                  <strong>{formatMoney(4200)}</strong>
                </div>
              </div>
            </div>
            <div className="history-list mt-20">
              {history.map(h => (
                <div key={h.id} className="history-item glass">
                   <div className="h-icon">{h.tp === 'harcama' ? '🛍️' : h.tp === 'transfer' ? '🔁' : '🔄'}</div>
                    <div className="h-info">
                      <strong>{h.tp === 'harcama' ? h.title : h.tp === 'transfer' ? `${h.from} -> ${h.to}` : `${h.kisi} Güncelleme`}</strong>
                      <span>{new Date(h.dt).toLocaleDateString('tr-TR')}</span>
                    </div>
                   <div className={`h-amt ${h.tp === 'harcama' ? 'neg' : 'pos'}`}>
                     {formatMoney(h.amount || h.fark)}
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'abonelik' && (
          <div className="abonelik-view animate-fadeIn">
            <div className="section-header">
              <h3>📺 Tekrarlayan Ödemeler</h3>
              <span className="badge">{rekurans.length} Aktif</span>
            </div>
            <div className="subscription-list">
              {rekurans.map(sub => (
                <div key={sub.id} className="sub-card glass">
                  <div className="sub-icon">{sub.icon}</div>
                  <div className="sub-info">
                    <strong>{sub.title}</strong>
                    <span>{sub.category} · Ayın {new Date(sub.date).getDate()}. Günü</span>
                  </div>
                  <div className="sub-price">
                    <strong>{formatMoney(sub.amount)}</strong>
                    <button className="pay-btn small">Öde</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="total-assets-summary glass mt-20" style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
               <div className="summary-item">
                 <span style={{ color: 'var(--primary-dark)' }}>Aylık Toplam Sabit Gider:</span>
                 <strong style={{ color: 'var(--primary-dark)' }}>{formatMoney(rekurans.reduce((a,b)=>a+b.amount,0))}</strong>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddExpense && (
        <AddExpenseModal onClose={() => setShowAddExpense(false)} addExpense={addExpense} categories={categories} />
      )}
      {showTransfer && (
        <TransferModal onClose={() => setShowTransfer(false)} transferKasa={transferKasa} bakiyeler={bakiyeler} />
      )}
      {showUpdateKasa && (
        <UpdateKasaModal kisi={showUpdateKasa} currentVal={bakiyeler[showUpdateKasa]} onClose={() => setShowUpdateKasa(null)} updateKasa={updateKasa} />
      )}

      {payingDebt && (
        <ConfirmModal 
          title="Taksit Öde"
          message={`${payingDebt.name} taksitini ödemek istiyor musun?`}
          confirmText="Evet, Öde"
          onConfirm={confirmPayDebt}
          onCancel={() => setPayingDebt(null)}
        />
      )}

      {deletingExpense && (
        <ConfirmModal 
          title="Harcamayı Sil"
          message={`"${deletingExpense.title}" harcamasını silmek istediğine emin misin? Bakiye geri yüklenecektir.`}
          confirmText="Evet, Sil"
          onConfirm={() => {
            deleteExpense(deletingExpense.id);
            setDeletingExpense(null);
            toast.success('Harcama silindi! 🗑️');
          }}
          onCancel={() => setDeletingExpense(null)}
        />
      )}
    </AnimatedPage>
  );
}

function AddExpenseModal({ onClose, addExpense, categories }) {
  const [form, setForm] = useState({ title: '', amount: '', category: 'mutfak', payer: 'gorkem' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    addExpense(form);
    toast.success('Harcama kaydedildi! 💸');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <h3>🛍️ Yeni Harcama</h3>
        <form onSubmit={handleSubmit} className="modal-form mt-10">
          <div className="form-group">
            <label>Başlık</label>
            <input type="text" placeholder="Örn: Market, Kira, Yemek..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tutar (₺)</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Kategori</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Ödeyen</label>
            <div className="payer-select">
              <button type="button" className={form.payer === 'gorkem' ? 'active' : ''} onClick={() => setForm({...form, payer: 'gorkem'})}>Görkem</button>
              <button type="button" className={form.payer === 'esra' ? 'active' : ''} onClick={() => setForm({...form, payer: 'esra'})}>Esra</button>
              <button type="button" className={form.payer === 'ortak' ? 'active' : ''} onClick={() => setForm({...form, payer: 'ortak'})}>Ortak</button>
            </div>
          </div>
          <button type="submit" className="submit-btn money-gradient">Kaydet</button>
        </form>
      </div>
    </div>
  );
}

function TransferModal({ onClose, transferKasa, bakiyeler }) {
  const [form, setForm] = useState({ from: 'gorkem', to: 'esra', amount: '', not: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      transferKasa(form.from, form.to, Number(form.amount), form.not);
      toast.success('Transfer başarılı! 🔁');
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <h3>🔁 Transfer Yap</h3>
        <form onSubmit={handleSubmit} className="modal-form mt-10">
          <div className="form-row">
            <div className="form-group">
              <label>Nereden</label>
              <select value={form.from} onChange={e => setForm({...form, from: e.target.value})}>
                {Object.keys(bakiyeler).map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Nereye</label>
              <select value={form.to} onChange={e => setForm({...form, to: e.target.value})}>
                {Object.keys(bakiyeler).map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Tutar (₺)</label>
            <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
          </div>
          <button type="submit" className="submit-btn money-gradient">Transferi Yap</button>
        </form>
      </div>
    </div>
  );
}

function UpdateKasaModal({ kisi, currentVal, onClose, updateKasa }) {
  const [val, setVal] = useState(currentVal);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <h3>🔄 {kisi.toUpperCase()} Bakiyesi</h3>
        <div className="modal-form mt-10">
          <div className="form-group">
            <label>Yeni Tutar (₺)</label>
            <input type="number" value={val} onChange={e => setVal(e.target.value)} />
          </div>
          <button className="submit-btn money-gradient" onClick={() => { updateKasa(kisi, Number(val)); onClose(); toast.success('Güncellendi'); }}>Güncelle</button>
        </div>
      </div>
    </div>
  );
}
