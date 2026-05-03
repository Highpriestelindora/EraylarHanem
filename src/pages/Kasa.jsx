import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, PlusCircle, X, ArrowRightLeft,
  Shield, Landmark, Gem, PieChart, Home, Car, Goal, Eye, EyeOff,
  Plus, ChevronRight, ArrowLeft, MoreVertical, Coins, Wallet, CreditCard,
  Target, Info, Trash2, Edit3, ArrowUpRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ActionSheet from '../components/ActionSheet';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Kasa.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const formatMoney = (val, privacy = false) => {
  if (privacy) return '••••₺';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);
};

export default function Kasa() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'ozet');
  const { 
    kasa, updateVarlik, addVarlik, deleteVarlik,
    updateTasinmaz, addTasinmaz, deleteTasinmaz,
    transferKasa, addGoal, updateGoal, deleteGoal,
    togglePrivacyMode, updateKasaBakiye, updateExchangeRates, finans, garaj 
  } = useStore();

  React.useEffect(() => {
    updateExchangeRates();
  }, []);

  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [showConfirm, setShowConfirm] = useState({ open: false, message: '', onConfirm: null });
  const privacy = kasa?.privacyMode || false;
  const K = kasa || { bakiyeler: {}, varliklar: [], tasinmazlar: [], kumbaralar: [], rates: { EUR: 35, USD: 32, GBP: 40, GA: 2500 } };
  
  const getAssetPrice = (v) => {
    if (v.type === 'tl') return 1;
    if (v.type === 'altin') return K.rates?.GA || v.price || 2500;
    if (v.type === 'doviz') return K.rates?.[v.unit] || v.price || 1;
    if (v.type === 'kripto') return K.rates?.[v.unit] || v.price || 1;
    if (v.type === 'borsa') return v.price || 1;
    return v.price || 0;
  };

  const totalBanka = (K.bankaHesaplari || []).reduce((acc, b) => acc + Number(b.balance || 0), 0);
  const totalCash = Object.values(K.bakiyeler || {}).reduce((a, b) => a + Number(b || 0), 0) + totalBanka;
  const totalVarlik = (K.varliklar || []).reduce((acc, v) => acc + (Number(v.amount) * Number(getAssetPrice(v))), 0);
  const totalTasinmaz = (K.tasinmazlar || []).reduce((acc, t) => acc + Number(t.value || 0), 0);
  const totalTasit = (garaj || []).reduce((acc, v) => acc + Number(v.marketValue || 0), 0);
  
  const totalWealth = totalCash + totalVarlik + totalTasinmaz + totalTasit;
  const totalDebt = (finans?.borclar || []).reduce((a, b) => a + Number(b.remaining || 0), 0) + 
                    (finans?.kartlar || []).reduce((a, b) => a + Number(b.balance || 0), 0);
  const netWorth = totalWealth - totalDebt;

  const requestConfirm = (message, onConfirm) => {
    setShowConfirm({ open: true, message, onConfirm });
  };

  const tabs = [
    { id: 'ozet', label: 'Özet', emoji: '📊' },
    { id: 'birikim', label: 'Birikim', emoji: '🪙' },
    { id: 'banka', label: 'Banka', emoji: '🏦' },
    { id: 'tasinmaz', label: 'Taşınmaz', emoji: '🏠' },
    { id: 'kumbara', label: 'Kumbara', emoji: '🎯' }
  ];

  const portfolioData = {
    labels: ['Nakit', 'Varlıklar', 'Mülkler', 'Taşıtlar'],
    datasets: [{
      data: [totalCash, totalVarlik, totalTasinmaz, totalTasit],
      backgroundColor: ['#10b981', '#f59e0b', '#7c3aed', '#334155'],
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  return (
    <AnimatedPage className="kasa-container">
      <header className="module-header glass" style={{ background: 'var(--kasa)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🏦</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Kasa</h1>
              <p>Servet ve Birikim Yönetimi</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={togglePrivacyMode}>
              {privacy ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button className="icon-btn" onClick={() => navigate('/')}>
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
            </button>
          ))}
        </nav>
      </header>

      <div className="kasa-scroll-content">
        
        {activeTab === 'ozet' && (
          <div className="ozet-view animate-fadeIn">
            {/* Net Wealth Card */}
            <div className="net-worth-card glass-premium">
              <div className="nwc-header">
                <Shield size={16} color="#f59e0b" />
                <span>TOPLAM NET SERVET</span>
              </div>
              <h2 className={netWorth >= 0 ? 'pos' : 'neg'}>
                {formatMoney(netWorth, privacy)}
              </h2>
              <div className="nwc-footer">
                <div className="nwc-stat">
                  <small>VARLIKLAR</small>
                  <strong>{formatMoney(totalWealth, privacy)}</strong>
                </div>
                <div className="nwc-divider" />
                <div className="nwc-stat">
                  <small>BORÇLAR</small>
                  <strong style={{ color: '#fca5a5' }}>-{formatMoney(totalDebt, privacy)}</strong>
                </div>
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="chart-section-v2 glass mt-20">
               <div style={{ width: '140px', height: '140px', position: 'relative' }}>
                  <Doughnut data={portfolioData} options={{ plugins: { legend: { display: false } } }} />
                  <div className="chart-center-info">
                    <PieChart size={18} color="var(--txt-light)" />
                  </div>
               </div>
               <div className="chart-legend-v2">
                  <div className="l-item">
                    <span style={{ background: '#10b981' }} />
                    <div className="l-text">
                      <small>Nakit</small>
                      <strong>{Math.round((totalCash / totalWealth) * 100) || 0}%</strong>
                    </div>
                  </div>
                  <div className="l-item">
                    <span style={{ background: '#f59e0b' }} />
                    <div className="l-text">
                      <small>Likit Varlık</small>
                      <strong>{Math.round((totalVarlik / totalWealth) * 100) || 0}%</strong>
                    </div>
                  </div>
                  <div className="l-item">
                    <span style={{ background: '#7c3aed' }} />
                    <div className="l-text">
                      <small>Taşınmaz</small>
                      <strong>{Math.round((totalTasinmaz / totalWealth) * 100) || 0}%</strong>
                    </div>
                  </div>
                  <div className="l-item">
                    <span style={{ background: '#334155' }} />
                    <div className="l-text">
                      <small>Taşıt</small>
                      <strong>{Math.round((totalTasit / totalWealth) * 100) || 0}%</strong>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        )}

        {activeTab === 'birikim' && (
          <div className="birikim-view animate-fadeIn">
            <div className="asset-sections">
              {['tl', 'doviz', 'altin', 'kripto', 'borsa'].map(type => {
                const items = (K.varliklar || []).filter(v => v.type === type || (!v.type && type === 'tl'));
                
                return (
                  <div key={type} className="asset-group-v2 mt-20">
                    <div className="section-header-v2">
                      <h3 style={{ textTransform: 'capitalize' }}>
                        {type === 'altin' ? '🟡 Altın Birikimi' : 
                         type === 'doviz' ? '💵 Döviz Portföyü' : 
                         type === 'kripto' ? '🪙 Kripto Varlıklar' :
                         type === 'borsa' ? '📈 Borsa Hesabı' :
                         '🇹🇷 Türk Lirası Varlıkları'}
                      </h3>
                      <button className="pill-btn" style={{ background: 'var(--kasa)' }} onClick={() => setModal({ open: true, type: 'addVarlik', data: { type } })}>
                        <Plus size={16} /> Ekle
                      </button>
                    </div>
                    <div className="asset-list-v3">
                      {items.map(v => {
                        const price = getAssetPrice(v);
                        return (
                          <div key={v.id} className="asset-item glass">
                            <div className="ai-icon">{v.icon || (type === 'altin' ? '🟡' : type === 'doviz' ? '💵' : type === 'kripto' ? '🪙' : type === 'borsa' ? '📈' : '💰')}</div>
                            <div className="ai-main">
                              <strong>{v.name}</strong>
                              <small>{v.amount} {v.unit} {v.type !== 'tl' && `· ${price}₺`} {v.location && `· 📍 ${v.location}`}</small>
                            </div>
                            <div className="ai-val">
                              <strong>{formatMoney(v.amount * price, privacy)}</strong>
                              <div className="ai-actions">
                                 <button onClick={() => setModal({ open: true, type: 'editVarlik', data: v })}><Edit3 size={14} /></button>
                                 <button className="del" onClick={(e) => {
                                  e.stopPropagation();
                                  requestConfirm("Bu varlığı silmek istediğinize emin misiniz?", () => deleteVarlik(v.id));
                                }}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {items.length === 0 && <div className="empty-state-mini">Bu kategoride henüz varlık yok.</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'banka' && (
          <div className="banka-view animate-fadeIn">
            <div className="section-header-v2 mt-20">
              <h3>🏦 Banka Hesapları</h3>
              <button className="pill-btn" style={{ background: 'var(--kasa)' }} onClick={() => setModal({ open: true, type: 'addBanka' })}>
                <Plus size={16} /> Hesap Ekle
              </button>
            </div>
            <div className="bank-list-v4">
              {(K.bankaHesaplari || []).map(b => (
                <div key={b.id} className="bank-card glass-premium">
                  <div className="bc-header">
                    <div className="bc-bank-info">
                      <span className="bc-icon">{b.icon || '🏦'}</span>
                      <div className="bc-texts">
                        <strong>{b.name}</strong>
                        <small>
                          {b.bank} · {
                            b.owner === 'gorkem' ? 'Görkem' : 
                            b.owner === 'esra' ? 'Esra' : 
                            b.owner === 'ortak' ? 'Ortak' : 'Bilinmiyor'
                          }
                        </small>
                      </div>
                    </div>
                    <div className="bc-actions">
                      <button onClick={() => setModal({ open: true, type: 'editBanka', data: b })}><Edit3 size={16} /></button>
                    </div>
                  </div>
                  <div className="bc-body">
                    <div className="bc-main-row">
                      <div className="bc-balance">
                        <small>GÜNCEL BAKİYE</small>
                        <h2 className={b.balance < 0 ? 'neg' : ''}>{formatMoney(b.balance, privacy)}</h2>
                      </div>
                      {b.kmh > 0 && (
                        <div className="bc-kmh-info">
                          <small>KMH LİMİTİ</small>
                          <strong>{formatMoney(b.kmh, privacy)}</strong>
                        </div>
                      )}
                    </div>
                    {b.iban && (
                      <div className="bc-iban" onClick={() => { navigator.clipboard.writeText(b.iban); toast.success('IBAN kopyalandı!'); }}>
                        <code>{b.iban}</code>
                      </div>
                    )}
                  </div>
                  <div className="bc-footer">
                    <button className="bc-quick-update" onClick={() => setModal({ open: true, type: 'updateBankaBakiye', data: b })}>
                      <PlusCircle size={14} /> Bakiye Güncelle
                    </button>
                  </div>
                </div>
              ))}
              {(K.bankaHesaplari || []).length === 0 && (
                <div className="empty-state glass">
                  <Landmark size={48} opacity={0.2} />
                  <p>Henüz banka hesabı eklenmemiş.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tasinmaz' && (
          <div className="tasinmaz-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🚗 Taşıt Varlıkları</h3>
            </div>
            <div className="asset-list-v3 mb-32">
              {garaj?.filter(v => v.marketValue > 0).map(v => (
                <div 
                  key={v.id} 
                  className="asset-item glass clickable-card" 
                  style={{ borderLeft: '4px solid #334155' }}
                  onClick={() => navigate('/aracim')}
                >
                  <div className="ai-icon">🚗</div>
                  <div className="ai-main">
                    <strong>{v.model}</strong>
                    <small>{v.plaka} · Piyasa Değeri</small>
                  </div>
                  <div className="ai-val">
                    <strong>{formatMoney(v.marketValue, privacy)}</strong>
                  </div>
                </div>
              ))}
              {garaj?.filter(v => v.marketValue > 0).length === 0 && <div className="empty-state-mini">Garajda değerli araç bulunamadı.</div>}
            </div>

            <div className="section-header-v2">
              <h3>🏠 Taşınmaz Portföyü</h3>
            </div>
            <div className="re-grid-v2">
              {K.tasinmazlar?.map(t => (
                <div 
                  key={t.id} 
                  className="re-card-v2 glass clickable-card"
                  onClick={() => navigate('/ev', { state: { activeTab: 'tasinmaz' } })}
                >
                  <div className="re-card-top">
                    <div className="re-card-icon">{t.icon || '🏠'}</div>
                    <div className="re-card-title">
                      <strong>{t.name}</strong>
                      <small>{t.city} / {t.district}</small>
                    </div>
                  </div>
                  <div className="re-card-val">
                    <h3>{formatMoney(t.value, privacy)}</h3>
                    {t.income > 0 && <span className="income-tag">Kira: {formatMoney(t.income, privacy)}</span>}
                  </div>
                  <div className="re-card-stats">
                     <div className="rs-item">
                        <small>VERGİ</small>
                        <span className={t.taxPaid ? 'done' : 'pending'}>{formatMoney(t.tax, privacy)}</span>
                     </div>
                     <div className="rs-item">
                        <small>DURUM</small>
                        <span>{t.status}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'kumbara' && (
          <div className="kumbara-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🎯 Kumbaralar</h3>
              <button className="pill-btn" style={{ background: 'var(--kasa)' }} onClick={() => setModal({ open: true, type: 'addGoal' })}>
                <Plus size={16} /> Yeni Hedef
              </button>
            </div>
            <div className="goal-list-v3">
              {K.kumbaralar?.map(g => (
                <div key={g.id} className="goal-card-v3 glass">
                   <div className="gc-header">
                      <span className="gc-emoji">{g.icon}</span>
                      <div className="gc-title">
                        <strong>{g.name}</strong>
                        <small>Hedef: {formatMoney(g.target, privacy)}</small>
                      </div>
                      <div className="gc-actions">
                         <button className="gc-edit" onClick={() => setModal({ open: true, type: 'editGoal', data: g })}><MoreVertical size={16} /></button>
                         <button className="gc-delete" onClick={() => requestConfirm("Bu birikim hedefini silmek istediğinize emin misiniz?", () => deleteGoal(g.id))}><Trash2 size={14} /></button>
                       </div>
                   </div>
                   <div className="gc-progress-area">
                      <div className="gc-bar-container">
                        <div className="gc-bar-fill" style={{ width: `${Math.min(100, (g.current / g.target) * 100)}%` }} />
                      </div>
                      <div className="gc-stats">
                        <div className="gs-left">
                          <strong>{formatMoney(g.current, privacy)}</strong>
                          <small>Biriken</small>
                        </div>
                        <div className="gs-right">
                          <strong>%{Math.round((g.current / g.target) * 100)}</strong>
                          <small>Tamamlandı</small>
                        </div>
                      </div>
                   </div>
                   <button className="gc-fill-btn" onClick={() => setModal({ open: true, type: 'fillGoal', data: g })}>
                      <PlusCircle size={14} /> Birikim Ekle
                   </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modals & ActionSheets */}
      <ActionSheet
        isOpen={modal.open}
        onClose={() => setModal({ open: false, type: null, data: null })}
        title={
          modal.type === 'transfer' ? '💸 Para Transferi' :
          modal.type === 'updateBakiye' ? '💵 Bakiye Güncelle' :
          modal.type === 'addVarlik' ? '🪙 Yeni Varlık Ekle' :
          modal.type === 'editVarlik' ? '📝 Varlığı Düzenle' :
          modal.type === 'addTasinmaz' ? '🏠 Yeni Taşınmaz Ekle' :
          modal.type === 'editTasinmaz' ? '🏠 Taşınmazı Düzenle' :
          modal.type === 'addGoal' ? '🎯 Yeni Hedef' :
          modal.type === 'editGoal' ? '🎯 Hedefi Düzenle' :
          modal.type === 'fillGoal' ? '💰 Kumbaraya Ekle' : 
          modal.type === 'addBanka' ? '🏦 Yeni Banka Hesabı' :
          modal.type === 'editBanka' ? '🏦 Hesabı Düzenle' :
          modal.type === 'updateBankaBakiye' ? '💰 Bakiye Güncelle' : ''
        }
      >
        <KasaModals type={modal.type} data={modal.data} onClose={() => setModal({ open: false, type: null, data: null })} />
      </ActionSheet>

      <ConfirmModal 
        isOpen={showConfirm.open}
        onClose={() => setShowConfirm({ ...showConfirm, open: false })}
        onConfirm={() => {
          showConfirm.onConfirm();
          setShowConfirm({ ...showConfirm, open: false });
        }}
        message={showConfirm.message}
      />

    </AnimatedPage>
  );
}

// Sub-component for Modals
function KasaModals({ type, data, onClose }) {
  const { 
    updateKasaBakiye, transferKasa, addVarlik, updateVarlik, deleteVarlik,
    addTasinmaz, updateTasinmaz, deleteTasinmaz,
    addGoal, updateGoal, deleteGoal, kasa 
  } = useStore();

  const [form, setForm] = useState(() => {
    if (data) return { ...data };
    if (type === 'addBanka') return { owner: 'gorkem', balance: '', kmh: '' };
    return {};
  });

  const handleSave = () => {
    try {
      if (type === 'updateBakiye') {
        updateKasaBakiye(data.user, Number(form.val));
      } else if (type === 'transfer') {
        transferKasa(form.from, form.to, Number(form.amount));
      } else if (type === 'addVarlik') {
        addVarlik(form);
      } else if (type === 'editVarlik') {
        updateVarlik(data.id, form);
      } else if (type === 'addTasinmaz') {
        addTasinmaz(form);
      } else if (type === 'editTasinmaz') {
        updateTasinmaz(data.id, form);
      } else if (type === 'addGoal') {
        addGoal(form);
      } else if (type === 'editGoal') {
        updateGoal(data.id, form);
      } else if (type === 'fillGoal') {
        // Simple fill: deduct from common (ortak) by default or selected source
        const source = 'ortak';
        if (kasa.bakiyeler[source] < Number(form.amount)) throw new Error('Ortak hesapta yeterli bakiye yok!');
        updateKasaBakiye(source, kasa.bakiyeler[source] - Number(form.amount));
        updateGoal(data.id, { current: data.current + Number(form.amount) });
        toast.success('Kumbaraya eklendi! 🎯');
      } else if (type === 'addBanka') {
        useStore.getState().addBankaHesabi(form);
      } else if (type === 'editBanka') {
        useStore.getState().updateBankaHesabi(data.id, form);
      } else if (type === 'updateBankaBakiye') {
        useStore.getState().updateBankaBakiye(data.id, form.balance);
        toast.success('Bakiye güncellendi! 💰');
      }
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (type === 'updateBakiye') {
    return (
      <div className="modal-form">
        <div className="form-group">
          <label>{data.user.toUpperCase()} Bakiyesi</label>
          <input type="number" value={form.val} onChange={e => setForm({...form, val: e.target.value})} />
        </div>
        <button className="submit-btn" onClick={handleSave}>GÜNCELLE</button>
      </div>
    );
  }

  if (type === 'transfer') {
    return (
      <div className="modal-form">
        <div className="form-group">
          <label>Nereden</label>
          <select value={form.from} onChange={e => setForm({...form, from: e.target.value})}>
            <option value="">Seçiniz</option>
            {Object.keys(kasa.bakiyeler).map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Nereye</label>
          <select value={form.to} onChange={e => setForm({...form, to: e.target.value})}>
            <option value="">Seçiniz</option>
            {Object.keys(kasa.bakiyeler).map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Tutar</label>
          <input type="number" placeholder="0₺" onChange={e => setForm({...form, amount: e.target.value})} />
        </div>
        <button className="submit-btn" onClick={handleSave}>TRANSFERİ TAMAMLA</button>
      </div>
    );
  }

  if (type === 'addVarlik' || type === 'editVarlik') {
    return (
      <div className="modal-form">
        <div className="form-group">
          <label>📍 Konum / Bulunduğu Yer</label>
          <select value={form.location} onChange={e => setForm({...form, location: e.target.value})}>
            <option value="Banka">Banka Hesabı</option>
            <option value="Kasa">Fiziksel Kasa</option>
            <option value="Yastıkaltı">Yastıkaltı / Nakit</option>
            <option value="Borsa">Borsa / Aracı Kurum</option>
            <option value="Cüzdan">Kripto Cüzdan / Soğuk Cüzdan</option>
          </select>
        </div>
        <div className="form-grid">
           <div className="form-group">
              <label>İsim / Sembol</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Örn: Gram Altın, BTC, THYAO" />
           </div>
           <div className="form-group">
              <label>İkon</label>
              <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="🟡" />
           </div>
        </div>
        <div className="form-grid">
           <div className="form-group">
              <label>Miktar</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
           </div>
           <div className="form-group">
              <label>Birim / Kod</label>
              {form.type === 'doviz' ? (
                <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                  <option value="">Seçiniz</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              ) : form.type === 'kripto' ? (
                <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                   <option value="">Seçiniz</option>
                   <option value="BTC">Bitcoin (BTC)</option>
                   <option value="ETH">Ethereum (ETH)</option>
                   <option value="Diğer">Diğer</option>
                </select>
              ) : (
                <input value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} placeholder="gr, lot, adet, BTC" />
              )}
           </div>
        </div>
        {(form.type === 'tl' || form.type === 'borsa' || (form.type === 'kripto' && form.unit === 'Diğer')) && (
          <div className="form-group">
            <label>Birim Fiyat (₺)</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
        )}
        <button className="submit-btn" onClick={handleSave}>{type === 'addVarlik' ? 'EKLE' : 'GÜNCELLE'}</button>
      </div>
    );
  }

  if (type === 'addTasinmaz' || type === 'editTasinmaz') {
     return (
       <div className="modal-form">
          <div className="form-group">
            <label>Mülk Adı</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Örn: Kepez Daire" />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Şehir</label>
              <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
            </div>
            <div className="form-group">
              <label>İlçe</label>
              <input value={form.district} onChange={e => setForm({...form, district: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Güncel Değer (₺)</label>
            <input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Vergi</label>
              <input type="number" value={form.tax} onChange={e => setForm({...form, tax: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Kira Geliri</label>
              <input type="number" value={form.income} onChange={e => setForm({...form, income: e.target.value})} />
            </div>
          </div>
          <button className="submit-btn" onClick={handleSave}>{type === 'addTasinmaz' ? 'EKLE' : 'GÜNCELLE'}</button>
          {type === 'editTasinmaz' && <button className="del-btn-link" onClick={() => { deleteTasinmaz(data.id); onClose(); }}>Mülkü Sil</button>}
       </div>
     );
  }

  if (type === 'addGoal' || type === 'editGoal') {
    return (
      <div className="modal-form">
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 3fr' }}>
          <div className="form-group">
            <label>İkon</label>
            <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="🎯" />
          </div>
          <div className="form-group">
            <label>Hedef Adı</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Örn: Yaz Tatili" />
          </div>
        </div>
        <div className="form-group">
          <label>Hedef Tutar (₺)</label>
          <input type="number" value={form.target} onChange={e => setForm({...form, target: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Hedef Tarih</label>
          <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
        </div>
        <div className="form-grid">
           <div className="form-group">
             <label>Öncelik</label>
             <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option value="Yüksek">Yüksek 🔥</option>
                <option value="Orta">Orta ⚡</option>
                <option value="Düşük">Düşük 🧊</option>
             </select>
           </div>
           <div className="form-group">
             <label>Kategori</label>
             <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Örn: Tatil, Araç" />
           </div>
        </div>
        <button className="submit-btn" onClick={handleSave}>{type === 'addGoal' ? 'HEDEF OLUŞTUR' : 'GÜNCELLE'}</button>
        {type === 'editGoal' && <button className="del-btn-link" onClick={() => { deleteGoal(data.id); onClose(); }}>Hedefi Sil</button>}
      </div>
    );
  }

  if (type === 'fillGoal') {
    return (
      <div className="modal-form">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <small style={{ color: 'var(--txt-light)' }}>Ortak hesaptan aktarılacaktır.</small>
        </div>
        <div className="form-group">
          <label>Eklenecek Tutar</label>
          <input type="number" placeholder="0₺" onChange={e => setForm({...form, amount: e.target.value})} />
        </div>
        <button className="submit-btn" onClick={handleSave}>KUMBARAYA AT</button>
      </div>
    );
  }

  if (type === 'addBanka' || type === 'editBanka') {
    return (
      <div className="modal-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Hesap Adı</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Örn: YKB Maaş Hesabı" />
          </div>
          <div className="form-group">
            <label>Banka</label>
            <input value={form.bank} onChange={e => setForm({...form, bank: e.target.value})} placeholder="Örn: Yapı Kredi" />
          </div>
        </div>
        <div className="form-group">
          <label>IBAN</label>
          <input value={form.iban} onChange={e => setForm({...form, iban: e.target.value})} placeholder="TR..." />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Başlangıç Bakiyesi</label>
            <input type="number" value={form.balance} onChange={e => setForm({...form, balance: e.target.value})} />
          </div>
          <div className="form-group">
            <label>KMH Limiti (Eksiye Düşebilir)</label>
            <input type="number" value={form.kmh} onChange={e => setForm({...form, kmh: e.target.value})} placeholder="0₺" />
          </div>
        </div>
        <div className="form-group">
          <label>Hesap Sahibi</label>
          <select value={form.owner} onChange={e => setForm({...form, owner: e.target.value})}>
            <option value="gorkem">Görkem</option>
            <option value="esra">Esra</option>
            <option value="ortak">Ortak</option>
          </select>
        </div>
        <button className="submit-btn" onClick={handleSave}>{type === 'addBanka' ? 'HESAP EKLE' : 'GÜNCELLE'}</button>
        {type === 'editBanka' && <button className="del-btn-link" onClick={() => { useStore.getState().deleteBankaHesabi(data.id); onClose(); }}>Hesabı Sil</button>}
      </div>
    );
  }

  if (type === 'updateBankaBakiye') {
    return (
      <div className="modal-form">
        <div className="form-group">
          <label>{data.name} - Güncel Bakiye</label>
          <input type="number" value={form.balance} onChange={e => setForm({...form, balance: e.target.value})} autoFocus />
        </div>
        <button className="submit-btn" onClick={handleSave}>GÜNCELLE</button>
      </div>
    );
  }

  return null;
}
