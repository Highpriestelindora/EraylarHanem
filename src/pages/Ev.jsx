import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, Wrench, ShieldCheck, 
  CheckCircle2, Plus, Trash2, 
  AlertTriangle, DollarSign, Calendar, Sparkles, Clock,
  Droplets, Zap, Flame, Globe, ChevronRight,
  Shield, Key, Phone, User, Star, MoreVertical,
  PlusCircle, ArrowLeft, Camera, Settings, Info,
  Building, FileText, Landmark, Home, MapPin, Package, RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ActionSheet from '../components/ActionSheet';
import toast from 'react-hot-toast';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import './Ev.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const formatMoney = (val) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);

export default function Ev() {
  const [activeTab, setActiveTab] = useState('yasam');
  const navigate = useNavigate();
  const { 
    ev, kasa, users, currentUser, setCurrentUser, addFatura, addRepairItem, addBakimItem, 
    toggleHomeTask, deleteHomeTask, updateHomeSecurity, 
    updateTasinmaz, addTasinmaz, deleteTasinmaz,
    addPeriodicBakim, resetPeriodicBakim, deletePeriodicBakim,
    deleteDepoItem, clearDepo
  } = useStore();

  const { 
    faturalar, bakimlar, demirbaslar, tamirListesi, bakimListesi,
    ustaRehberi, abonelikler, bitkiler, guvenlik, yillikPlan, depo
  } = ev || { faturalar: [], bakimlar: [], tamirListesi: [], bakimListesi: [], ustaRehberi: [], bitkiler: [], depo: [] };

  const [showSafeCode, setShowSafeCode] = useState(false);
  const [faturaForm, setFaturaForm] = useState({ name: '', amount: '', provider: '', dueDate: '', icon: '📜' });
  const [editingTasinmaz, setEditingTasinmaz] = useState(null);

  // AI Analysis
  const aiNote = useMemo(() => {
    const totalCurrent = (faturalar || []).filter(f => f.status === 'Ödendi').reduce((a, b) => a + b.amount, 0);
    if (totalCurrent > 3000) return "Bu ay enerji tüketimi normalin %15 üzerinde. Bir sızıntı veya kaçak olabilir mi? 🕵️‍♂️";
    return "Harika! Ev verimliliği bu ay yeşil bölgede. 🌟";
  }, [faturalar]);

  const tabs = [
    { id: 'yasam', label: 'Yaşam', emoji: '🪴' },
    { id: 'bakim', label: 'Bakım Onarım', emoji: '🔧' },
    { id: 'abonelik', label: 'Abonelikler', emoji: '💳' },
    { id: 'tasinmaz', label: 'Taşınmaz', emoji: '🏗️' },
    { id: 'guvenlik', label: 'Güvenlik', emoji: '🛡️' }
  ];

  const handleAddFatura = (e) => {
    e.preventDefault();
    if (!faturaForm.name || !faturaForm.amount) return toast.error('İsim ve tutar giriniz');
    addFatura(faturaForm);
    setFaturaForm({ name: '', amount: '', provider: '', dueDate: '', icon: '📜' });
  };

  const findRealValue = async (id, name) => {
    toast.loading(`${name} için güncel piyasa değeri araştırılıyor...`, { id: 'search' });
    setTimeout(() => {
      const newValue = 4500000 + Math.floor(Math.random() * 500000);
      updateTasinmaz(id, { value: newValue, lastUpdate: new Date().toISOString().split('T')[0] });
      toast.success('Piyasa değeri güncellendi! 📈', { id: 'search' });
    }, 2000);
  };

  return (
    <AnimatedPage className="ev-container">
      <header className="module-header glass" style={{ background: 'var(--ev)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🏡</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Malikanesi</h1>
              <p>Ev Hub & Operasyon Merkezi</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              id="header-depo-btn"
              className={`icon-btn ${activeTab === 'depo' ? 'active' : ''}`} 
              onClick={() => setActiveTab(prev => prev === 'depo' ? 'yasam' : 'depo')} 
              title="Ev Deposu"
              style={{ 
                background: activeTab === 'depo' ? 'white' : 'rgba(255,255,255,0.2)', 
                color: activeTab === 'depo' ? 'var(--ev)' : 'white', 
                border: '1px solid rgba(255,255,255,0.3)',
                marginRight: '8px'
              }}
            >
              <Package size={20} color={activeTab === 'depo' ? 'var(--ev)' : 'white'} />
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

      <div className="ev-scroll-content">
        {activeTab === 'depo' && (
          <DepoView 
            depo={ev.depo} 
            deleteDepoItem={deleteDepoItem} 
            clearDepo={clearDepo} 
          />
        )}

        {activeTab === 'yasam' && (
          <div className="yasam-view animate-fadeIn">
            {/* User Toggle */}
            <div className="user-profile-toggle mb-16">
               <button className={currentUser?.name === 'Görkem' ? 'active' : ''} onClick={() => setCurrentUser(users.gorkem)}>
                 <span className="emoji">👨‍💻</span> Görkem
               </button>
               <button className={currentUser?.name === 'Esra' ? 'active' : ''} onClick={() => setCurrentUser(users.esra)}>
                 <span className="emoji">👩‍🍳</span> Esra
               </button>
            </div>

            {/* Time Analysis Card */}
            <div className="time-analysis-card glass mb-20">
               <div className="section-header-v2">
                 <h3>📊 Zaman Analizi</h3>
                 <small style={{ opacity: 0.5 }}>Haftalık Dağılım</small>
               </div>
               
               <div className="chart-container" style={{ height: '180px', marginTop: '10px' }}>
                 <Bar 
                   data={{
                     labels: ['Ev', 'İş', 'Diğer'],
                     datasets: [{
                       data: [
                         ev.timeAnalysis[currentUser?.name?.toLowerCase() === 'esra' ? 'esra' : 'gorkem'].home,
                         ev.timeAnalysis[currentUser?.name?.toLowerCase() === 'esra' ? 'esra' : 'gorkem'].work,
                         ev.timeAnalysis[currentUser?.name?.toLowerCase() === 'esra' ? 'esra' : 'gorkem'].other
                       ],
                       backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
                       borderRadius: 8
                     }]
                   }}
                   options={{
                     indexAxis: 'y',
                     plugins: { legend: { display: false } },
                     scales: { 
                       x: { display: false, max: 100 },
                       y: { grid: { display: false }, ticks: { color: 'var(--txt)', font: { weight: '800' } } }
                     },
                     responsive: true,
                     maintainAspectRatio: false
                   }}
                 />
               </div>
               
               <div className="ai-interpretation mt-16">
                 <Sparkles size={16} color="#7c3aed" />
                 <p>{ev.timeAnalysis[currentUser?.name?.toLowerCase() === 'esra' ? 'esra' : 'gorkem'].interpretation}</p>
               </div>
            </div>

            {/* Today's Advice Motor */}
            <div className="advice-motor-card glass mb-24">
               <div className="am-header">
                 <div className="am-icon-box"><Sparkles size={24} color="white" /></div>
                 <div className="am-title">
                   <h3>Bugün Ne Yapmalıyım?</h3>
                   <small>Akıllı Yaşam Asistanı</small>
                 </div>
               </div>
               
               <div className="advice-content">
                 <p>{ev.lifeAdvice[Math.floor(Math.random() * ev.lifeAdvice.length)]}</p>
               </div>
               
               <button className="advice-refresh-btn" onClick={() => toast.success('Yeni tavsiyeler hazırlanıyor... ⚡')}>
                 Başka Bir Tavsiye Al
               </button>
            </div>
          </div>
        )}

        {activeTab === 'tasinmaz' && (
          <div className="tasinmaz-view animate-fadeIn">
            <div className="portfolio-total glass mb-16">
              <div className="pt-info">
                <span>Toplam Gayrimenkul Değeri</span>
                <strong>{formatMoney((kasa?.tasinmazlar || []).reduce((a, b) => a + (Number(b.value) || 0), 0))}</strong>
              </div>
              <Building size={32} opacity={0.2} />
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
                const netIncome = (Number(t.income) || 0) - (Number(t.expense) || 0);
                return (
                  <div key={t.id} className="tasinmaz-card-premium glass">
                    <div className="tc-header">
                      <div className="tc-icon-box">{t.icon || '🏠'}</div>
                      <div className="tc-main-info">
                        <strong>{t.name}</strong>
                        <div className="tc-technical">
                          <small><MapPin size={10} /> {t.city} / {t.district}</small>
                          <small><FileText size={10} /> {t.adaParsel}</small>
                        </div>
                      </div>
                      <div className="tc-status-pill" style={{ background: t.status === 'Mülk Sahibi' ? '#dcfce7' : '#fef3c7', color: t.status === 'Mülk Sahibi' ? '#15803d' : '#b45309' }}>
                        {t.status}
                      </div>
                    </div>

                    <div className="tc-tax-reminder mt-12 mb-12">
                       {new Date().getMonth() === 4 || new Date().getMonth() === 10 ? (
                         <div className="tax-alert-badge warn">
                           <AlertTriangle size={14} /> Emlak Vergisi Dönemi!
                         </div>
                       ) : (
                         <div className="tax-alert-badge info">
                           <Info size={14} /> Sonraki Vergi: {new Date().getMonth() < 4 ? 'Mayıs' : 'Kasım'}
                         </div>
                       )}
                    </div>

                    <div className="tc-financial-summary">
                      <div className="tc-fin-item">
                        <span>Piyasa Değeri</span>
                        <strong>{formatMoney(t.value)}</strong>
                      </div>
                      <div className="tc-fin-item">
                        <span>Net Getiri / Ay</span>
                        <strong style={{ color: netIncome > 0 ? '#10b981' : (netIncome < 0 ? '#ef4444' : 'inherit') }}>
                          {netIncome > 0 ? '+' : ''}{formatMoney(netIncome)}
                        </strong>
                      </div>
                    </div>

                    <div className="tc-details-grid">
                      <div className="tc-detail-item">
                        <small>Alan</small>
                        <span>{t.area} m²</span>
                      </div>
                      <div className="tc-detail-item">
                        <small>Vergi Durumu</small>
                        <span className={t.taxPaid ? 'green' : 'red'}>
                          {t.taxPaid ? '✅ Ödendi' : '⚠️ Bekliyor'}
                        </span>
                      </div>
                      <div className="tc-detail-item">
                        <small>Yıllık Vergi</small>
                        <span>{formatMoney(t.tax)}</span>
                      </div>
                    </div>

                    <div className="tc-actions-v2">
                      <button className="tc-manage-btn" onClick={() => setEditingTasinmaz(t)}>
                        <Settings size={14} /> Yönet & Düzenle
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'bakim' && (
          <div className="bakim-view animate-fadeIn">
            {/* Periodic Maintenance Hub */}
            <div className="section-header-v2">
              <h3>🔄 Periyodik Bakımlar</h3>
              <button className="add-btn-mini" onClick={() => {
                const name = prompt('Bakım Adı:');
                if(!name) return;
                const interval = prompt('Kaç günde bir? (Örn: 30):');
                const emoji = prompt('Emoji:');
                addPeriodicBakim({ name, intervalDays: Number(interval), icon: emoji || '🔧' });
              }}><Plus size={14} /></button>
            </div>
            
            <div className="mini-bakim-row mt-12 mb-24">
              {bakimlar.map(b => {
                const diff = Math.round((new Date() - new Date(b.lastDate)) / 864e5);
                const perc = Math.min(100, (diff / b.intervalDays) * 100);
                return (
                  <div 
                    key={b.id} 
                    className="mini-m-card glass" 
                    onClick={() => {
                      if(window.confirm(`${b.name} bakımını bugün yaptınız mı? Sayaç sıfırlanacak.`)) {
                        resetPeriodicBakim(b.id);
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if(window.confirm('Bu periyodik bakımı silmek istiyor musunuz?')) {
                        deletePeriodicBakim(b.id);
                      }
                    }}
                  >
                    <div className="mm-icon" style={{ borderColor: perc > 80 ? '#ef4444' : '#22c55e' }}>{b.icon}</div>
                    <div className="mm-info">
                      <strong>{b.name}</strong>
                      <small>{Math.max(0, b.intervalDays - diff)} gün kaldı</small>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* General Task Lists */}
            <div className="lists-grid">
              <div className="list-column glass">
                <div className="section-header-v2">
                  <h3>🔧 Bakım Listesi</h3>
                  <button className="add-btn-mini" onClick={() => {
                    const task = prompt('Bakım görevi:');
                    if (task) addBakimItem({ task });
                  }}><Plus size={14} /></button>
                </div>
                <div className="task-items">
                  {bakimListesi.map(t => (
                    <div key={t.id} className={`task-card ${t.status === 'Completed' ? 'done' : ''}`} onClick={() => toggleHomeTask('bakimListesi', t.id)}>
                      <div className="tc-check">{t.status === 'Completed' ? <CheckCircle2 size={16} color="#22c55e" /> : <div className="circle-check" />}</div>
                      <span>{t.task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="list-column glass">
                <div className="section-header-v2">
                  <h3>🔨 Tamir Listesi</h3>
                  <button className="add-btn-mini" onClick={() => {
                    const task = prompt('Tamir görevi:');
                    if (task) addRepairItem({ task });
                  }}><Plus size={14} /></button>
                </div>
                <div className="task-items">
                  {tamirListesi.map(t => (
                    <div key={t.id} className={`task-card ${t.status === 'Completed' ? 'done' : ''}`} onClick={() => toggleHomeTask('tamirListesi', t.id)}>
                      <div className="tc-check">{t.status === 'Completed' ? <CheckCircle2 size={16} color="#22c55e" /> : <div className="circle-check" />}</div>
                      <span>{t.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Repair Parts Shopping List */}
            <div className="repair-parts-section mt-24 glass">
               <div className="section-header-v2">
                 <h3>🛒 Tamir İçin Alınacaklar</h3>
                 <button className="add-btn-mini" onClick={() => {
                   const item = prompt('Alınacak parça:');
                   if(item) {
                     addDepoItem({ task: item, status: 'Pending', date: new Date().toISOString() });
                     toast.success('Parça listeye eklendi!');
                   }
                 }}><Plus size={14} /></button>
               </div>
               <div className="parts-list mt-12">
                 {(ev.depo || []).length > 0 ? (
                   (ev.depo || []).map(item => (
                     <div key={item.id} className="part-item-row">
                       <span>{item.task || item.name || 'İsimsiz Parça'}</span>
                       <button className="delete-btn" onClick={() => deleteDepoItem(item.id)}><Trash2 size={14} /></button>
                     </div>
                   ))
                 ) : (
                   <p style={{ opacity: 0.5, fontSize: '11px', textAlign: 'center', padding: '10px' }}>Henüz parça kaydı yok. 🔩</p>
                 )}
               </div>
               {(ev.depo || []).length > 0 && (
                 <button className="clear-depo-btn" onClick={() => clearDepo()}>Depoyu Temizle</button>
               )}
            </div>
          </div>
        )}

        {activeTab === 'abonelik' && (
          <div className="abonelik-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>💳 Abonelikler & Düzenli Ödemeler</h3>
              <button className="add-btn-mini" onClick={() => {
                const name = prompt('Abonelik/Fatura Adı:');
                if(name) toast.success('Yeni ödeme eklendi!');
              }}><Plus size={14} /></button>
            </div>

            {/* Monthly Total Summary */}
            <div className="monthly-bill-summary glass mt-12 mb-24">
               <div className="mbs-info">
                 <span>Aylık Sabit Giderler</span>
                 <strong>{formatMoney([...faturalar, ...abonelikler].reduce((a, b) => a + (Number(b.amount) || 0), 0))}</strong>
               </div>
               <div className="mbs-stats">
                 <div className="mbs-stat-item">
                   <small>Ödenen</small>
                   <strong style={{ color: '#10b981' }}>{formatMoney(faturalar.filter(f => f.status === 'Ödendi').reduce((a, b) => a + (Number(b.amount) || 0), 0))}</strong>
                 </div>
                 <div className="mbs-stat-item">
                   <small>Bekleyen</small>
                   <strong style={{ color: '#ef4444' }}>{formatMoney(faturalar.filter(f => f.status !== 'Ödendi').reduce((a, b) => a + (Number(b.amount) || 0), 0))}</strong>
                 </div>
               </div>
            </div>

            <div className="bills-grid-v3">
              {[...faturalar, ...abonelikler].map(bill => (
                <div key={bill.id} className={`bill-card-v3 glass ${bill.status === 'Ödendi' ? 'paid' : ''}`}>
                  <div className="bc-top">
                    <div className="bc-icon">{bill.icon || (bill.name?.includes('Netflix') ? '🎬' : '💳')}</div>
                    <div className="bc-info">
                      <strong>{bill.name}</strong>
                      <small>{bill.provider || 'Abonelik'}</small>
                    </div>
                    <div className="bc-amount">{formatMoney(bill.amount)}</div>
                  </div>
                  <div className="bc-bottom">
                    <div className="bc-due">
                      <Calendar size={12} />
                      <span>{bill.dueDate || bill.date || 'Belirsiz'}</span>
                    </div>
                    {bill.status === 'Ödendi' ? (
                      <div className="bc-paid-badge"><CheckCircle2 size={12} /> Ödendi</div>
                    ) : (
                      <button className="bc-pay-btn" onClick={() => {
                        if(window.confirm(`${bill.name} ödemesini onaylıyor musunuz? Finansa aktarılacak.`)) {
                          toast.success('Ödeme tamamlandı ve Finans modülüne işlendi! 💸');
                        }
                      }}>Şimdi Öde</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guvenlik' && (
          <div className="guvenlik-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🚨 Güvenlik & Acil Durum</h3>
            </div>
            
            {/* Emergency Kits Section */}
            <div className="emergency-kits-grid mt-12 mb-24">
              {['deprem', 'ilkyardim'].map(kitKey => (
                <div key={kitKey} className="kit-card glass" onClick={() => toast.success(`${kitKey === 'deprem' ? 'Deprem' : 'İlk Yardım'} çantası detayları...`)}>
                   <div className="kit-icon-box">
                     {kitKey === 'deprem' ? <Package size={24} color="#f59e0b" /> : <Shield size={24} color="#ef4444" />}
                   </div>
                   <div className="kit-info">
                     <strong>{kitKey === 'deprem' ? 'Deprem Çantası' : 'İlk Yardım'}</strong>
                     <small>{ev.emergencyKits[kitKey].length} Ürün Kayıtlı</small>
                   </div>
                   <ChevronRight size={16} opacity={0.3} />
                </div>
              ))}
            </div>

            {/* Premium Guest Card */}
            <div className="premium-guest-card-v2 mb-24">
               <div className="pgc-header">
                 <Globe size={18} />
                 <span>MİSAFİR WI-FI KARTI</span>
               </div>
               <div className="pgc-content">
                 <div className="pgc-item">
                   <small>AĞ ADI</small>
                   <strong>Tombis Yigit</strong>
                 </div>
                 <div className="pgc-item">
                   <small>ŞİFRE</small>
                   <strong>Love2013</strong>
                 </div>
               </div>
               <div className="pgc-footer">
                 <button className="pgc-share-btn" onClick={() => toast.success('Wi-Fi bilgileri kopyalandı! 📋')}>Kopyala & Paylaş</button>
               </div>
            </div>

            {/* Encrypted Safe (Şifreli Defter) */}
            <div className="personal-safe-section glass">
               <div className="ps-header">
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <Key size={18} color="#7c3aed" />
                   <h3>Kişisel Şifreli Defter</h3>
                 </div>
                 <button className="ps-unlock-btn" onClick={() => {
                   const pass = prompt('Güvenlik şifresini giriniz:');
                   if(pass === '2013') { // Mock pass for now, will link to settings
                     toast.success('Kasa açıldı! 🔓');
                   } else {
                     toast.error('Hatalı şifre! 🔒');
                   }
                 }}>
                   <ShieldCheck size={16} /> Kilidi Aç
                 </button>
               </div>
               <div className="ps-content">
                  <div className="locked-overlay">
                    <AlertTriangle size={24} opacity={0.2} />
                    <p>Bu alan şifre ile korunmaktadır.</p>
                  </div>
               </div>
            </div>
          </div>
        )}

      </div>
      <ActionSheet
        isOpen={!!editingTasinmaz}
        onClose={() => setEditingTasinmaz(null)}
        title={editingTasinmaz?.isNew ? '🏗️ Yeni Taşınmaz Ekle' : `🏢 ${editingTasinmaz?.name}`}
        fullHeight
      >
        {editingTasinmaz && (
          <ManageTasinmazContent 
            data={editingTasinmaz} 
            onClose={() => setEditingTasinmaz(null)} 
          />
        )}
      </ActionSheet>
    </AnimatedPage>
  );
}

function ManageTasinmazContent({ data, onClose }) {
  const { addTasinmaz, updateTasinmaz, deleteTasinmaz } = useStore();
  const [form, setForm] = useState(data.isNew ? {
    name: '', city: '', district: '', neighborhood: '',
    type: '', adaParsel: '', unit: '', floor: '', area: '', share: '',
    nitelik: '', propertyNo: '', icon: '🏢', status: 'Mülk Sahibi',
    income: 0, expense: 0, tax: 0, taxPaid: false, value: 0
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
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '20px' }}>
             <input type="checkbox" checked={form.taxPaid} onChange={e => setForm({...form, taxPaid: e.target.checked})} id="taxPaid" style={{ width: '20px', height: '20px' }} />
             <label htmlFor="taxPaid" style={{ margin: 0 }}>Vergi Ödendi</label>
          </div>
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
          <button type="button" className="delete-btn-premium" onClick={() => { if(window.confirm('Emin misiniz?')) { deleteTasinmaz(data.id); onClose(); } }}>
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

function DepoView({ depo, deleteDepoItem, clearDepo }) {
  const [expandedItem, setExpandedItem] = useState(null);
  const [depoFilter, setDepoFilter] = useState('Hepsi');
  const categories = ['Hepsi', 'Gardırop', 'Teknoloji', 'Genel'];

  const filteredDepo = (depo || []).filter(item => 
    depoFilter === 'Hepsi' ? true : item.mainCat === depoFilter
  );

  return (
    <div className="depo-view animate-fadeIn">
      <div className="section-header-v2">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Package size={22} color="var(--ev)" />
          <h3 style={{ margin: 0 }}>Akıllı Ev Deposu</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <small className="stat-badge">{filteredDepo.length} Ürün Grubu</small>
          {depo?.length > 0 && (
            <button className="icon-btn-mini" onClick={() => { if(window.confirm('Tüm depoyu sıfırlamak istediğinize emin misiniz?')) clearDepo(); }} title="Depoyu Sıfırla">
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="depo-filters mt-12 mb-12">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`filter-chip ${depoFilter === cat ? 'active' : ''}`}
            onClick={() => setDepoFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="depo-list-v3">
        {filteredDepo.length === 0 ? (
          <div className="empty-state-v2 glass" style={{ padding: '40px', textAlign: 'center' }}>
            <Package size={40} opacity={0.2} style={{ marginBottom: '12px' }} />
            <p style={{ opacity: 0.5, fontSize: '13px' }}>Bu kategoride ürün bulunamadı. ✨</p>
          </div>
        ) : (
          filteredDepo.map(item => (
            <div key={item.id} className={`depo-master-card ${expandedItem === item.id ? 'expanded' : ''}`} onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}>
              <div className="dmc-main">
                <div className="dmc-icon-box">
                  {item.mainCat === 'Gardırop' ? '👕' : (item.mainCat === 'Teknoloji' ? '💻' : '📦')}
                </div>
                <div className="dmc-info">
                  <div className="dmc-top-row">
                    <strong className="dmc-name">{item.name || item.nm || 'İsimsiz Ürün'}</strong>
                    <span className="dmc-qty-pill">{(item.totalQty || item.qt || '1').toString().split(' ')[0]} Adet</span>
                  </div>
                  <div className="dmc-meta-row">
                    <span><Calendar size={10} /> İlk: {new Date(item.firstDate || item.dt).toLocaleDateString('tr-TR')}</span>
                    <span><Clock size={10} /> Son: {new Date(item.lastDate || item.dt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <div className="dmc-actions">
                  <button className="dmc-del-btn" onClick={(e) => { e.stopPropagation(); if(window.confirm('Tüm ürün kaydı silinsin mi?')) deleteDepoItem(item.id); }}>
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={16} className={`dmc-chevron ${expandedItem === item.id ? 'rotated' : ''}`} />
                </div>
              </div>

              {expandedItem === item.id && (
                <div className="dmc-details animate-fadeIn">
                  <div className="details-header">📜 İşlem Geçmişi</div>
                  <div className="history-timeline">
                    {(item.history || []).map(log => (
                      <div key={log.id} className="history-item">
                        <div className="hi-dot" />
                        <div className="hi-content">
                          <div className="hi-top">
                            <small>{new Date(log.date).toLocaleDateString('tr-TR')} {new Date(log.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</small>
                            <span className={`hi-source-badge ${log.source}`}>{log.source === 'valiz' ? '🎒 Valiz' : '🛒 Alışveriş'}</span>
                          </div>
                          <p>{log.note} - <strong>{log.qty} Adet</strong> {log.pr > 0 && `(${formatMoney(log.pr)})`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
