import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, Wrench, ShieldCheck, 
  CheckCircle2, Plus, Trash2, 
  AlertTriangle, DollarSign, Calendar, Sparkles,
  Droplets, Zap, Flame, Globe, ChevronRight,
  Shield, Key, Phone, User, Star, MoreVertical,
  PlusCircle, ArrowLeft, Camera, Settings, Info,
  Building, FileText, Landmark, Home, MapPin
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
  const [editingTasinmaz, setEditingTasinmaz] = useState(null);

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
                        <small>Nitelik</small>
                        <span>{t.nitelik}</span>
                      </div>
                      <div className="tc-detail-item">
                        <small>Vergi Durumu</small>
                        <span className={t.taxPaid ? 'green' : 'red'}>{t.taxPaid ? 'Ödendi' : 'Ödenmedi'}</span>
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
            
            {/* Abonelik Takibi */}
            <div className="abonelik-section mt-16 glass">
              <div className="section-header-v2">
                <h3>💳 Abonelik Takibi</h3>
                <small style={{ opacity: 0.5 }}>{abonelikler?.length || 0} Aktif</small>
              </div>
              <div className="abonelik-list mt-8">
                {abonelikler?.map(sub => (
                  <div key={sub.id} className="abonelik-card">
                    <div className="sub-left">
                      <div className="sub-icon">
                        {sub.name.includes('Netflix') ? '🎬' : (sub.name.includes('YouTube') ? '📺' : '✨')}
                      </div>
                      <div className="sub-info">
                        <strong>{sub.name}</strong>
                        <small>{sub.date} Yenileniyor</small>
                      </div>
                    </div>
                    <div className="sub-price">{formatMoney(sub.amount)}</div>
                  </div>
                ))}
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
