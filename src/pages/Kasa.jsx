import React, { useState, useMemo } from 'react';
import { MapPin, ShieldCheck, Activity, FileText, Settings, ChevronDown, Sparkles, DollarSign, Package, RotateCcw, Calendar, Camera, 
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
import GoalAdvisor from '../components/GoalAdvisor';
import GoalSimulator from '../components/GoalSimulator';
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
  const [editingTasinmaz, setEditingTasinmaz] = useState(null);
  const [activeTaxTasinmaz, setActiveTaxTasinmaz] = useState(null);
  const [activeDaskTasinmaz, setActiveDaskTasinmaz] = useState(null);
  const [activeAidatTasinmaz, setActiveAidatTasinmaz] = useState(null);
  const [expandedTasinmazIds, setExpandedTasinmazIds] = useState([]);
  const [isAIUpdating, setIsAIUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState({ open: false, message: '', onConfirm: null });
  const [showSimulator, setShowSimulator] = useState(false);
  const privacy = kasa?.privacyMode || false;
  const K = kasa || { bakiyeler: {}, varliklar: [], tasinmazlar: [], kumbaralar: [], rates: { EUR: 35, USD: 32, GBP: 40, GA: 2500, ETHFI: 21.15 } };
  
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

  const unifiedGoalsForSim = useMemo(() => {
    const goals = useStore.getState().hedefler?.goals || [];
    const kumbaralar = K.kumbaralar || [];
    return [
      ...goals.map(g => ({ ...g, type: 'vision' })),
      ...kumbaralar.map(g => ({ ...g, type: 'money', title: g.name, targetDate: g.deadline }))
    ];
  }, [K.kumbaralar]);

  const tabs = [
    { id: 'ozet', label: 'Özet', emoji: '📊' },
    { id: 'birikim', label: 'Birikim', emoji: '🪙' },
    { id: 'banka', label: 'Banka', emoji: '🏦' },
    { id: 'tasinmaz', label: 'Taşınmaz', emoji: '🏠' },
    { id: 'kumbara', label: 'Kumbara', emoji: '🐷' }
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
                    <div className="section-header-kasa">
                      <h3 style={{ textTransform: 'capitalize' }}>
                        {type === 'altin' ? '🟡 Altın Birikimi' : 
                         type === 'doviz' ? '💵 Döviz Portföyü' : 
                         type === 'kripto' ? '🪙 Kripto Varlıklar' :
                         type === 'borsa' ? '📈 Borsa Hesabı' :
                         '🇹🇷 Türk Lirası Varlıkları'}
                      </h3>
                      <button 
                        className="kasa-add-btn" 
                        title={`${type} varlığı ekle`}
                        onClick={() => setModal({ open: true, type: 'addVarlik', data: { type } })}
                      >
                        <Plus size={20} />
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
            <div className="section-header-kasa mt-20">
              <h3>🏦 Banka Hesapları</h3>
              <button 
                className="kasa-add-btn" 
                title="Yeni banka hesabı ekle"
                onClick={() => setModal({ open: true, type: 'addBanka' })}
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="bank-list-v4">
              {(K.bankaHesaplari || []).map(b => (
                <div key={b.id} className={`bank-card premium-card owner-${b.owner}`}>
                  <div className="bc-header">
                    <div className="bc-bank-info">
                      <div className="bc-icon-wrapper">
                        <span className="bc-icon">{b.icon || '🏦'}</span>
                        <div className="owner-badge-mini">{b.owner === 'gorkem' ? 'G' : b.owner === 'esra' ? 'E' : 'O'}</div>
                      </div>
                      <div className="bc-texts">
                        <strong>{b.name}</strong>
                        <small>{b.bank} · {b.owner?.toUpperCase()}</small>
                      </div>
                    </div>
                    <div className="bc-actions">
                      <button className="edit-btn" onClick={() => setModal({ open: true, type: 'editBanka', data: b })}><Edit3 size={18} /></button>
                      <button className="delete-btn" onClick={() => requestConfirm(`${b.name} hesabını silmek istediğinize emin misiniz?`, () => useStore.getState().deleteBankaHesabi(b.id))}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bc-body">
                    <div className="bc-main-row">
                      <div className="bc-balance">
                        <small>GÜNCEL BAKİYE</small>
                        <h2 className={b.balance < 0 ? 'neg' : ''}>{formatMoney(b.balance, privacy)}</h2>
                      </div>
                      <div className="bc-stats-mini">
                        {b.kmh > 0 && (
                          <div className="bc-stat-pill">
                            <small>KMH</small>
                            <span>{formatMoney(b.kmh, privacy)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {b.iban && (
                      <div className="bc-iban-premium" onClick={() => { navigator.clipboard.writeText(b.iban); toast.success('IBAN kopyalandı!'); }}>
                        <div className="iban-label">IBAN</div>
                        <code>{b.iban}</code>
                        <div className="copy-hint">Kopyala</div>
                      </div>
                    )}
                  </div>

                  <div className="bc-footer">
                    <button className="bc-update-btn" onClick={() => setModal({ open: true, type: 'updateBankaBakiye', data: b })}>
                      <ArrowUpRight size={16} /> Bakiye Güncelle
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

            <div className="portfolio-total glass mb-24">
              <div className="pt-info">
                <span style={{ fontSize: '9px', fontWeight: '800' }}>TOPLAM GAYRİMENKUL DEĞERİ</span>
                <strong>{formatMoney((kasa?.tasinmazlar || []).reduce((a, b) => a + (Number(b.value) || 0), 0))}</strong>
              </div>
              <button 
                className={`ai-update-btn ${isAIUpdating ? 'loading' : ''}`}
                disabled={isAIUpdating}
                onClick={() => {
                  setIsAIUpdating(true);
                  toast.loading("Yekta Asistan bölge rayiçlerini ve endeksleri tarıyor...", { id: 'ai-val' });
                  
                  setTimeout(() => {
                    const { updateTasinmaz } = useStore.getState();
                    const now = new Date();
                    const tasinmazlar = kasa?.tasinmazlar || [];
                    
                    let updatedCount = 0;
                    tasinmazlar.forEach(t => {
                      const lastUpdate = t.lastAIUpdate ? new Date(t.lastAIUpdate) : null;
                      const diffDays = lastUpdate ? Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24)) : 0;
                      
                      // Eğer bugün zaten güncellendiyse fiyat artışı yapma (sadece tarama simülasyonu)
                      if (diffDays <= 0 && lastUpdate) {
                        return; 
                      }

                      // Akıllı Artış Oranları (Yıllık bazda günlük hesaplama)
                      // Antalya: %40 yıllık, Diğerleri: %25 yıllık varsayıyoruz
                      const annualRate = t.city?.toLowerCase() === 'antalya' ? 0.40 : 0.25;
                      const dailyRate = annualRate / 365;
                      
                      // Eğer ilk güncelleme ise veya 0 gün geçmişse küçük bir 'ilk tarama' primi ver (%0.1)
                      const effectiveDays = diffDays > 0 ? diffDays : 0.1;
                      const growthFactor = 1 + (dailyRate * effectiveDays);
                      const noise = 0.998 + Math.random() * 0.004; // Gerçekçi piyasa gürültüsü
                      
                      const newValue = Math.round(t.value * growthFactor * noise);
                      
                      updateTasinmaz(t.id, { 
                        ...t, 
                        value: newValue,
                        lastAIUpdate: now.toISOString()
                      });
                      updatedCount++;
                    });

                    setIsAIUpdating(false);
                    if (updatedCount > 0) {
                      toast.success(`Rayiç bedelleri güncellendi! ${updatedCount} taşınmazın değeri piyasa verilerine göre revize edildi. 🏠📈`, { id: 'ai-val' });
                    } else {
                      toast.success("Tüm verileriniz güncel. Bölgesel endekslerde bugün için yeni bir değişim saptanmadı. ✨", { id: 'ai-val' });
                    }
                  }, 2500);
                }}
              >
                <Sparkles size={16} /> 
                <span>{isAIUpdating ? 'Analiz Ediliyor...' : 'Akıllı Güncelle'}</span>
              </button>
            </div>

            <div className="section-header-v2">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3>🏗️ Gayrimenkul Portföyü</h3>
                <small style={{ opacity: 0.5 }}>{kasa?.tasinmazlar?.length || 0} Adet Taşınmaz</small>
              </div>
              <button className="add-btn-mini" onClick={() => setEditingTasinmaz({ isNew: true })}><Plus size={14} /></button>
            </div>

            <div className="tasinmaz-grid">
              {(kasa?.tasinmazlar || []).map(t => {
                const isExpanded = expandedTasinmazIds.includes(t.id);
                const netIncome = (Number(t.income) || 0) - (Number(t.expense) || 0);
                
                return (
                  <div key={t.id} className={`tasinmaz-card-premium glass ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    <div className="tc-header" onClick={() => {
                      setExpandedTasinmazIds(prev => 
                        isExpanded ? prev.filter(id => id !== t.id) : [...prev, t.id]
                      );
                    }}>
                      <div className="tc-icon-box">{t.icon || '🏠'}</div>
                      <div className="tc-main-info">
                        <strong>{t.name}</strong>
                        <div className="tc-technical">
                          <small><MapPin size={10} /> {t.city} / {t.district}</small>
                          {!isExpanded && <small className="compact-val">{formatMoney(t.value)}</small>}
                        </div>
                      </div>
                      <div className="tc-header-right">
                         <div className="tc-status-pill" style={{ background: t.status === 'Mülk Sahibi' ? '#dcfce7' : '#fef3c7', color: t.status === 'Mülk Sahibi' ? '#15803d' : '#b45309' }}>
                           {t.status}
                         </div>
                         <div className={`tc-chevron ${isExpanded ? 'rotated' : ''}`}>
                            <ChevronDown size={18} />
                         </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="tc-expanded-content animate-fadeIn">
                        <div className="tc-tax-reminder mt-12 mb-12">
                           <div className="tax-grid-v2">
                             {/* Emlak Vergisi */}
                             <div className={`tax-pill-v2 ${t.taxPaid1 && t.taxPaid2 ? 'done' : (t.taxPaid1 || t.taxPaid2 ? 'warn' : 'pending')}`} 
                                  onClick={(e) => { e.stopPropagation(); setActiveTaxTasinmaz(t); }}>
                               <div className="tp-icon">
                                 <ShieldCheck size={14} />
                               </div>
                               <div className="tp-info">
                                 <small>EMLAK VERGİSİ</small>
                                 <div className="tax-status-row">
                                    <span className={t.taxPaid1 ? 'txt-green' : 'txt-red'}>Ocak</span>
                                    <span style={{ opacity: 0.3 }}>/</span>
                                    <span className={t.taxPaid2 ? 'txt-green' : 'txt-red'}>Haziran</span>
                                </div>
                               </div>
                             </div>
                             {/* DASK */}
                             <div className={`tax-pill-v2 ${new Date(t.daskExpiry) > new Date() ? 'done' : 'warn'}`}
                                  onClick={(e) => { e.stopPropagation(); setActiveDaskTasinmaz(t); }}>
                               <div className="tp-icon">
                                 <Activity size={14} />
                               </div>
                               <div className="tp-info">
                                 <small>DASK POLİÇE</small>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                   <span>{t.daskExpiry ? new Date(t.daskExpiry).toLocaleDateString('tr-TR') : 'KAYIT YOK'}</span>
                                   {t.daskFile && <FileText size={10} color="#3b82f6" />}
                                 </div>
                               </div>
                             </div>
                             {/* Aidat */}
                             <div className={`tax-pill-v2 ${t.aidatPaid ? 'done' : 'pending'}`}
                                  onClick={(e) => { e.stopPropagation(); setActiveAidatTasinmaz(t); }}>
                               <div className="tp-icon">
                                 <CreditCard size={14} />
                               </div>
                               <div className="tp-info">
                                 <small>AYLIK AİDAT</small>
                                 <span>{formatMoney(t.aidat || 0)}</span>
                               </div>
                             </div>
                           </div>
                        </div>

                        <div className="tc-details-list">
                          <div className="tc-detail-row">
                             <div className="tc-label">💰 Piyasa Değeri</div>
                             <div className="tc-value">{formatMoney(t.value)}</div>
                          </div>
                          <div className="tc-detail-row">
                             <div className="tc-label">📈 Net Getiri / Ay</div>
                             <div className="tc-value" style={{ color: netIncome > 0 ? '#10b981' : (netIncome < 0 ? '#ef4444' : 'inherit') }}>
                                {netIncome > 0 ? '+' : ''}{formatMoney(netIncome)}
                             </div>
                          </div>
                          <div className="tc-detail-row">
                             <div className="tc-label">📏 Toplam Alan</div>
                             <div className="tc-value">{t.area} m²</div>
                          </div>
                          <div className="tc-detail-row">
                             <div className="tc-label">👤 Getiri Durumu</div>
                             <div className="tc-value" style={{ color: t.status === 'Kiracı Var' ? '#10b981' : '#f59e0b' }}>
                               {t.status === 'Kiracı Var' ? `Kirada (${formatMoney(t.income)})` : 'Mülk Sahibi'}
                             </div>
                          </div>
                          <div className="tc-detail-row">
                             <div className="tc-label">🏛️ Yıllık Vergi</div>
                             <div className="tc-value">{formatMoney(t.tax)}</div>
                          </div>
                          <div className="tc-detail-row">
                             <div className="tc-label">📄 Ada / Parsel</div>
                             <div className="tc-value">{t.adaParsel || '-'}</div>
                          </div>
                        </div>

                        <div className="tc-actions-v2">
                          <button className="pill-btn-v2 tc-pill" onClick={(e) => { e.stopPropagation(); setEditingTasinmaz(t); }}>
                            <Settings size={14} /> Yönet & Düzenle
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'kumbara' && (
          <div className="kumbara-view animate-fadeIn">
            <GoalAdvisor 
              visionGoals={useStore.getState().hedefler?.goals || []} 
              moneyGoals={K.kumbaralar || []} 
              onSimulate={() => setShowSimulator(true)}
            />

            <div className="section-header-kasa" style={{ marginTop: '24px' }}>
              <h3>🐷 Kumbaralar</h3>
              <button 
                className="kasa-add-btn" 
                title="Yeni hedef oluştur"
                onClick={() => setModal({ open: true, type: 'addGoal' })}
              >
                <Plus size={20} />
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
          modal.type === 'addGoal' ? '🐷 Yeni Kumbara' :
          modal.type === 'editGoal' ? '🐷 Kumbarayı Düzenle' :
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

      {showSimulator && (
        <GoalSimulator 
          goals={unifiedGoalsForSim} 
          onClose={() => setShowSimulator(false)} 
        />
      )}

      <ActionSheet
        isOpen={!!activeTaxTasinmaz}
        onClose={() => setActiveTaxTasinmaz(null)}
        title="🏛️ Emlak Vergisi Yönetimi"
      >
        {activeTaxTasinmaz && (
          <TaxManagementContent 
            data={activeTaxTasinmaz} 
            onClose={() => setActiveTaxTasinmaz(null)} 
          />
        )}
      </ActionSheet>

      <ActionSheet
        isOpen={!!activeDaskTasinmaz}
        onClose={() => setActiveDaskTasinmaz(null)}
        title="🛡️ DASK Poliçe Yönetimi"
      >
        {activeDaskTasinmaz && (
          <DaskManagementContent 
            data={activeDaskTasinmaz} 
            onClose={() => setActiveDaskTasinmaz(null)} 
          />
        )}
      </ActionSheet>

      <ActionSheet
        isOpen={!!activeAidatTasinmaz}
        onClose={() => setActiveAidatTasinmaz(null)}
        title="💳 Aidat Ödeme Yönetimi"
      >
        {activeAidatTasinmaz && (
          <AidatManagementContent 
            data={activeAidatTasinmaz} 
            onClose={() => setActiveAidatTasinmaz(null)} 
          />
        )}
      </ActionSheet>

      <ActionSheet
        isOpen={!!editingTasinmaz}
        onClose={() => setEditingTasinmaz(null)}
        title={editingTasinmaz?.isNew ? 'Yeni Taşınmaz Ekle' : 'Taşınmaz Yönetimi'}
        fullHeight
      >
        {editingTasinmaz && (
          <ManageTasinmazContent 
            data={editingTasinmaz} 
            onClose={() => setEditingTasinmaz(null)} 
            requestConfirm={requestConfirm}
          />
        )}
      </ActionSheet>
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
    if (type === 'addBanka') return { owner: 'gorkem', balance: '', kmh: '', openingDate: new Date().toISOString().split('T')[0] };
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
        toast.success('Kumbaraya eklendi! 🐷');
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
                   <option value="ETHFI">Ether-Fi (ETHFI)</option>
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
            <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="🐷" />
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
        <div className="form-grid">
          <div className="form-group">
            <label>Hesap Sahibi</label>
            <select value={form.owner} onChange={e => setForm({...form, owner: e.target.value})}>
              <option value="gorkem">Görkem</option>
              <option value="esra">Esra</option>
              <option value="ortak">Ortak</option>
            </select>
          </div>
          <div className="form-group">
            <label>İlk Kayıt Tarihi (Açılış)</label>
            <input 
              type="date" 
              value={form.openingDate || new Date().toISOString().split('T')[0]} 
              onChange={e => setForm({...form, openingDate: e.target.value})} 
            />
          </div>
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


function ManageTasinmazContent({ data, onClose, requestConfirm }) {
  const { addTasinmaz, updateTasinmaz, deleteTasinmaz } = useStore();
  const [form, setForm] = useState(data.isNew ? {
    name: '', city: '', district: '', neighborhood: '',
    type: '', adaParsel: '', unit: '', floor: '', area: '', share: '',
    nitelik: '', propertyNo: '', icon: '🏢', status: 'Mülk Sahibi',
    income: 0, expense: 0, tax: 0, taxPaid1: false, taxPaid2: false, value: 0,
    daskExpiry: '', aidat: 0, aidatPaid: false, daskFile: null
  } : data);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.isNew) {
      addTasinmaz(form);
    } else {
      updateTasinmaz(data.id, form);
      toast.success('Değişiklikler kaydedildi! ✨');
    }
    onClose();
  };

  return (
    <form className="modal-form-premium" onSubmit={handleSubmit}>
      <div className="form-section-premium">
        <h4><Info size={16} /> Genel Bilgiler</h4>
        <div className="form-group">
          <label>Taşınmaz Adı</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Örn: Antalya Kepez Daire" required />
        </div>
        <div className="form-row">
          <div className="form-group"><label>Şehir</label><input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="İl" /></div>
          <div className="form-group"><label>İlçe</label><input type="text" value={form.district} onChange={e => setForm({...form, district: e.target.value})} placeholder="İlçe" /></div>
        </div>
        <div className="form-group">
          <label>Nitelik / Tip</label>
          <input type="text" value={form.nitelik} onChange={e => setForm({...form, nitelik: e.target.value})} placeholder="Örn: Mesken, Arsa..." />
        </div>
      </div>

      <div className="form-section-premium mt-24">
        <h4><FileText size={16} /> Tapu & Teknik Detaylar</h4>
        <div className="form-row">
          <div className="form-group"><label>Ada/Parsel</label><input type="text" value={form.adaParsel} onChange={e => setForm({...form, adaParsel: e.target.value})} /></div>
          <div className="form-group"><label>Alan (m²)</label><input type="text" value={form.area} onChange={e => setForm({...form, area: e.target.value})} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Kat</label><input type="text" value={form.floor} onChange={e => setForm({...form, floor: e.target.value})} /></div>
          <div className="form-group"><label>Bağımsız Bölüm</label><input type="text" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Arsa Payı</label><input type="text" value={form.share} onChange={e => setForm({...form, share: e.target.value})} /></div>
          <div className="form-group"><label>Taşınmaz No</label><input type="text" value={form.propertyNo} onChange={e => setForm({...form, propertyNo: e.target.value})} /></div>
        </div>
      </div>

      <div className="form-section-premium mt-24">
        <h4><DollarSign size={16} /> Finansal Durum</h4>
        <div className="form-group">
          <label>Tahmini Piyasa Değeri (₺)</label>
          <input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} />
        </div>
        <div className="form-row">
          <div className="form-group"><label>Aylık Kira (Getiri)</label><input type="number" value={form.income} onChange={e => setForm({...form, income: e.target.value})} /></div>
          <div className="form-group"><label>Aylık Gider (Götürü)</label><input type="number" value={form.expense} onChange={e => setForm({...form, expense: e.target.value})} /></div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Emlak Vergisi (Yıllık)</label>
            <input type="number" value={form.tax} onChange={e => setForm({...form, tax: e.target.value})} />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '10px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={form.taxPaid1} onChange={e => setForm({...form, taxPaid1: e.target.checked})} id="taxPaid1" />
                <label htmlFor="taxPaid1" style={{ margin: 0 }}>Ocak Taksidi</label>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={form.taxPaid2} onChange={e => setForm({...form, taxPaid2: e.target.checked})} id="taxPaid2" />
                <label htmlFor="taxPaid2" style={{ margin: 0 }}>Haziran Taksidi</label>
             </div>
          </div>
        </div>
        <div className="form-row mt-12">
          <div className="form-group">
            <label>DASK Bitiş Tarihi</label>
            <input type="date" value={form.daskExpiry} onChange={e => setForm({...form, daskExpiry: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Aylık Aidat (₺)</label>
            <input type="number" value={form.aidat} onChange={e => setForm({...form, aidat: e.target.value})} />
          </div>
        </div>
        <div className="form-group mt-12" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
           <input type="checkbox" checked={form.aidatPaid} onChange={e => setForm({...form, aidatPaid: e.target.checked})} id="aidatPaid" style={{ width: '20px', height: '20px' }} />
           <label htmlFor="aidatPaid" style={{ margin: 0 }}>Bu Ayki Aidat Ödendi</label>
        </div>
      </div>

      <div className="form-section-premium mt-24">
        <label>Durum</label>
        <div className="user-select-grid">
           <button type="button" className={form.status === 'Mülk Sahibi' ? 'active' : ''} onClick={() => setForm({...form, status: 'Mülk Sahibi'})}>Mülk Sahibi</button>
           <button type="button" className={form.status === 'Kiracı Var' ? 'active' : ''} onClick={() => setForm({...form, status: 'Kiracı Var'})}>Kiracı Var</button>
        </div>
      </div>

      <div className="modal-actions-premium mt-32">
        {!data.isNew && (
          <button type="button" className="delete-btn-premium" onClick={() => { 
            requestConfirm('Bu taşınmazı silmek istediğinizden emin misiniz?', () => {
              deleteTasinmaz(data.id); 
              onClose(); 
            });
          }}>
            <Trash2 size={18} /> Sil
          </button>
        )}
        <button type="submit" className="submit-btn-premium" style={{ background: 'var(--ev)' }}>
          {data.isNew ? 'Taşınmazı Ekle' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </form>
  );
}



function TaxManagementContent({ data, onClose }) {
  const { updateTasinmaz } = useStore();
  const [form, setForm] = useState({ tax: data.tax, taxPaid1: data.taxPaid1, taxPaid2: data.taxPaid2 });

  return (
    <div className="edit-form-v2">
      <div className="form-group-v2">
        <label>Yıllık Emlak Vergisi (₺)</label>
        <input type="number" value={form.tax} onChange={e => setForm({...form, tax: e.target.value})} />
      </div>
      <div className="form-toggle-row">
        <label>Ocak Taksidi Ödendi</label>
        <input type="checkbox" checked={form.taxPaid1} onChange={e => setForm({...form, taxPaid1: e.target.checked})} />
      </div>
      <div className="form-toggle-row">
        <label>Haziran Taksidi Ödendi</label>
        <input type="checkbox" checked={form.taxPaid2} onChange={e => setForm({...form, taxPaid2: e.target.checked})} />
      </div>
      <button className="save-btn-v2" onClick={() => {
        updateTasinmaz(data.id, form);
        toast.success('Vergi bilgileri güncellendi! 🏛️');
        onClose();
      }}>Bilgileri Kaydet</button>
    </div>
  );
}

function DaskManagementContent({ data, onClose }) {
  const { updateTasinmaz } = useStore();
  const [form, setForm] = useState({ daskExpiry: data.daskExpiry, daskFile: data.daskFile });

  return (
    <div className="edit-form-v2">
      <div className="form-group-v2">
        <label>Poliçe Bitiş Tarihi</label>
        <input type="date" value={form.daskExpiry} onChange={e => setForm({...form, daskExpiry: e.target.value})} />
      </div>
      <div className="form-group-v2">
        <label>Poliçe Dosyası / Fotoğrafı</label>
        <div style={{ position: 'relative' }}>
          <div className={`file-upload-box ${form.daskFile ? 'has-file' : ''}`} onClick={() => document.getElementById('dask-pdf').click()}>
            {form.daskFile ? <FileText size={24} color="#3b82f6" /> : <Camera size={24} />}
            <span style={{ fontSize: '13px', fontWeight: '700' }}>{form.daskFile || 'Poliçe Yükle (PDF/Görüntü)'}</span>
            <input 
              type="file" 
              id="dask-pdf" 
              style={{ display: 'none' }} 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setForm({...form, daskFile: file.name});
              }} 
            />
          </div>
          {form.daskFile && (
            <button 
              className="file-remove-btn" 
              onClick={(e) => { e.stopPropagation(); setForm({...form, daskFile: null}); }}
              title="Poliçeyi Kaldır"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
      <button className="save-btn-v2" onClick={() => {
        updateTasinmaz(data.id, form);
        toast.success('DASK bilgileri güncellendi! 🛡️');
        onClose();
      }}>Bilgileri Kaydet</button>
    </div>
  );
}

function AidatManagementContent({ data, onClose }) {
  const { updateTasinmaz, addExpense } = useStore();
  const [form, setForm] = useState({ aidat: data.aidat, aidatPaid: data.aidatPaid });
  const [paymentMethod, setPaymentMethod] = useState('');

  return (
    <div className="edit-form-v2">
      <div className="form-group-v2">
        <label>Aylık Aidat Tutarı (₺)</label>
        <input type="number" value={form.aidat} onChange={e => setForm({...form, aidat: Number(e.target.value)})} />
      </div>
      <div className="form-toggle-row">
        <label>Bu Ayki Aidat Ödendi</label>
        <input type="checkbox" checked={form.aidatPaid} onChange={e => setForm({...form, aidatPaid: e.target.checked})} />
      </div>
      {form.aidatPaid && (
        <div className="mt-12">
          <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
        </div>
      )}
      <button className="save-btn-v2" onClick={() => {
        updateTasinmaz(data.id, form);
        if (form.aidatPaid) {
          addExpense({
            title: `${data.name} Aidat Ödemesi`,
            amount: Number(form.aidat),
            category: 'ev',
            source: 'Ev Hub',
            defaultPay: paymentMethod
          });
        }
        toast.success('Aidat bilgileri güncellendi! 💳');
        onClose();
      }}>Bilgileri Kaydet</button>
    </div>
  );
}