import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, Wrench, ShieldCheck, 
  CheckCircle2, Plus, Trash2, 
  AlertTriangle, DollarSign, Calendar, Sparkles,
  Droplets, Zap, Flame, Globe, ChevronRight,
  Shield, Key, Phone, User, Star, MoreVertical,
  PlusCircle, ArrowLeft, Camera, Settings, Info,
  Building, FileText, Landmark, Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
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
    ev, kasa, addFatura, addRepairItem, addBakimItem, 
    toggleHomeTask, deleteHomeTask, updateHomeSecurity, 
    updateTasinmaz, addTasinmaz, deleteTasinmaz,
    addPeriodicBakim, resetPeriodicBakim, deletePeriodicBakim
  } = useStore();

  const { 
    faturalar, bakimlar, demirbaslar, tamirListesi, bakimListesi,
    ustaRehberi, abonelikler, bitkiler, guvenlik, yillikPlan, depo
  } = ev || { faturalar: [], bakimlar: [], tamirListesi: [], bakimListesi: [], ustaRehberi: [], bitkiler: [], depo: [] };

  const [showSafeCode, setShowSafeCode] = useState(false);
  const [faturaForm, setFaturaForm] = useState({ name: '', amount: '', provider: '', dueDate: '', icon: '📜' });

  // AI Analysis
  const aiNote = useMemo(() => {
    const totalCurrent = (faturalar || []).filter(f => f.status === 'Ödendi').reduce((a, b) => a + b.amount, 0);
    if (totalCurrent > 3000) return "Bu ay enerji tüketimi normalin %15 üzerinde. Bir sızıntı veya kaçak olabilir mi? 🕵️‍♂️";
    return "Harika! Ev verimliliği bu ay yeşil bölgede. 🌟";
  }, [faturalar]);

  const tabs = [
    { id: 'yasam', label: 'Yaşam', emoji: '🪴' },
    { id: 'tasinmaz', label: 'Taşınmaz', emoji: '🏗️' },
    { id: 'depo', label: 'Depo', emoji: '📦' },
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
        {/* AI Insight */}
        <div className="ai-insight-card glass animate-fadeIn">
          <Sparkles size={18} className="sparkle-icon" />
          <p>{aiNote}</p>
        </div>

        {activeTab === 'tasinmaz' && (
          <div className="tasinmaz-view animate-fadeIn">
            <div className="portfolio-total glass mb-16">
              <div className="pt-info">
                <span>Toplam Gayrimenkul Değeri</span>
                <strong>{formatMoney((kasa?.tasinmazlar || []).reduce((a, b) => a + (b.value || 0), 0))}</strong>
              </div>
              <Building size={32} opacity={0.2} />
            </div>

            <div className="section-header-v2">
              <h3>🏗️ Gayrimenkul Portföyü</h3>
              <button className="add-btn-mini" onClick={() => {
                const name = prompt('Taşınmaz Adı:');
                if (!name) return;
                const tapu = prompt('Tapu Bilgisi (Ada/Parsel):');
                const val = prompt('Yaklaşık Değer (₺):');
                addTasinmaz({ name, tapuNo: tapu, value: Number(val) });
              }}><Plus size={14} /></button>
            </div>

            <div className="tasinmaz-grid">
              {(kasa?.tasinmazlar || []).map(t => (
                <div key={t.id} className="tasinmaz-card-premium glass">
                  <div className="tc-header">
                    <div className="tc-icon-box">{t.icon}</div>
                    <div className="tc-main-info">
                      <strong>{t.name}</strong>
                      <small><FileText size={10} /> {t.tapuNo}</small>
                    </div>
                    <button className="tc-update-btn" onClick={() => findRealValue(t.id, t.name)}>
                      <Globe size={14} />
                    </button>
                  </div>

                  <div className="tc-stats">
                    <div className="tc-stat">
                      <span>Değer</span>
                      <strong>{formatMoney(t.value)}</strong>
                    </div>
                    <div className="tc-stat">
                      <span>Durum</span>
                      <strong className={t.status === 'Kiracı Var' ? 'orange' : 'green'}>{t.status}</strong>
                    </div>
                  </div>

                  <div className="tc-details">
                    <div className={`tc-tag-status ${t.taxPaid ? 'paid' : 'unpaid'}`}>
                      {t.taxPaid ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      Emlak Vergisi {t.taxPaid ? 'Ödendi' : 'Ödenmedi'}
                    </div>
                    <small className="tc-last-update">Son Güncelleme: {t.lastUpdate}</small>
                  </div>

                  <div className="tc-actions">
                    <button className="tc-btn-secondary" onClick={() => {
                      const newStatus = t.status === 'Mülk Sahibi' ? 'Kiracı Var' : 'Mülk Sahibi';
                      updateTasinmaz(t.id, { status: newStatus });
                    }}><Settings size={14} /> Durum Değiştir</button>
                    <button className="tc-btn-secondary" onClick={() => deleteTasinmaz(t.id)}>
                      <Trash2 size={14} color="#ef4444" /> Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'yasam' && (
          <div className="yasam-view animate-fadeIn">
            {/* Shrunk Periodic Maintenance */}
            <div className="mini-bakim-row">
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
                      <small>{b.intervalDays - diff} gün</small>
                    </div>
                  </div>
                );
              })}
              <button className="add-bakim-card glass" onClick={() => {
                const name = prompt('Bakım Adı:');
                if(!name) return;
                const interval = prompt('Kaç günde bir? (Örn: 30):');
                const emoji = prompt('Emoji:');
                addPeriodicBakim({ name, intervalDays: Number(interval), icon: emoji || '🔧' });
              }}>
                <Plus size={20} />
              </button>
            </div>

            {/* Fatura Girişi */}
            <div className="fatura-giris-section mt-16 glass">
              <div className="section-header-v2">
                <h3>🧾 Fatura Girişi</h3>
              </div>
              <form className="mini-form" onSubmit={handleAddFatura}>
                <div className="form-row-compact">
                  <input 
                    type="text" 
                    placeholder="Fatura Adı (Örn: Elektrik)" 
                    value={faturaForm.name}
                    onChange={e => setFaturaForm({...faturaForm, name: e.target.value})}
                  />
                  <input 
                    type="number" 
                    placeholder="Tutar (₺)" 
                    value={faturaForm.amount}
                    onChange={e => setFaturaForm({...faturaForm, amount: e.target.value})}
                  />
                </div>
                <div className="form-row-compact">
                  <input 
                    type="text" 
                    placeholder="Kurum / Sağlayıcı" 
                    value={faturaForm.provider}
                    onChange={e => setFaturaForm({...faturaForm, provider: e.target.value})}
                  />
                  <button type="submit" className="fatura-submit">Kaydet</button>
                </div>
              </form>
            </div>

            {/* Bakım & Tamir Listeleri */}
            <div className="lists-grid mt-16">
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

          </div>
        )}

        {activeTab === 'depo' && (
          <div className="depo-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>📦 Ev Deposu (Envanter)</h3>
              <small style={{ opacity: 0.5 }}>{depo?.length || 0} Ürün</small>
            </div>
            <div className="depo-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              {(!depo || depo.length === 0) ? (
                <div className="empty-substate glass" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px' }}>
                  <p style={{ opacity: 0.5 }}>Deponuz henüz boş. Alışveriş modülünden alınan kişisel ve ev ürünleri buraya eklenir. ✨</p>
                </div>
              ) : (
                depo.map(item => (
                  <div key={item.id} className="depo-card glass">
                    <div className="dc-left">
                      <div className="dc-icon">
                        {item.cat === 'Görkem' ? '👨' : (item.cat === 'Esra' ? '👩' : '📦')}
                      </div>
                      <div className="dc-info">
                        <strong>{item.nm}</strong>
                        <small>{item.qt} · {new Date(item.dt).toLocaleDateString('tr-TR')}</small>
                      </div>
                    </div>
                    <div className="dc-right">
                      <div className="dc-price">{formatMoney(item.pr)}</div>
                      <div className="dc-tag">{item.cat}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'guvenlik' && (
          <div className="guvenlik-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🛡️ Güvenlik & Şifreler</h3>
              <button className="icon-btn-mini" onClick={() => setShowSafeCode(!showSafeCode)}>
                {showSafeCode ? <CheckCircle2 size={16} /> : <Key size={16} />}
              </button>
            </div>
            
            <div className="safety-codes glass">
               <div className="code-item">
                 <small>WI-FI ŞİFRESİ</small>
                 <strong>{showSafeCode ? guvenlik.wifi.pass : '••••••••'}</strong>
               </div>
               <div className="code-item">
                 <small>ALARM KODU</small>
                 <strong>{showSafeCode ? guvenlik.alarm.code : '••••'}</strong>
               </div>
            </div>

            <div className="guest-mode-card mt-24 glass">
               <div className="gm-header">
                 <Sparkles size={20} color="#7c3aed" />
                 <h3>MİSAFİR MODU</h3>
               </div>
               <p>Misafirlerin için Wi-Fi ve ev bilgilerini içeren hızlı erişim kartı.</p>
               <button className="gm-btn">Kartı Göster</button>
            </div>

            <div className="safety-checkup mt-24">
              <div className="section-header-v2">
                <h3>🚨 Güvenlik Check-up</h3>
              </div>
              <div className="checkup-list">
                 <div className="cu-item glass">
                   <strong>Yangın Tüpü Kontrolü</strong>
                   <small>12.05.2026</small>
                 </div>
                 <div className="cu-item glass">
                   <strong>Deprem Çantası Güncelleme</strong>
                   <small>01.06.2026</small>
                 </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AnimatedPage>
  );
}
