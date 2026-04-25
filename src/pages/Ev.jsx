import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, Wrench, ShieldCheck, 
  CheckCircle2, Plus, Trash2, 
  AlertTriangle, DollarSign, Calendar, Sparkles,
  Droplets, Zap, Flame, Globe, ChevronRight,
  Shield, Key, Phone, User, Star, MoreVertical,
  PlusCircle, ArrowLeft, Camera, Settings, Info
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
  const [activeTab, setActiveTab] = useState('faturalar');
  const navigate = useNavigate();
  const { ev, payFatura, addRepairItem, updateHomeSecurity } = useStore();

  const { 
    faturalar, bakimlar, demirbaslar, tamirListesi, 
    ustaRehberi, abonelikler, bitkiler, guvenlik, yillikPlan 
  } = ev || { faturalar: [], bakimlar: [], tamirListesi: [], ustaRehberi: [], bitkiler: [] };

  const [showSafeCode, setShowSafeCode] = useState(false);

  // AI Analysis
  const aiNote = useMemo(() => {
    const totalCurrent = faturalar.filter(f => f.status === 'Ödendi').reduce((a, b) => a + b.amount, 0);
    if (totalCurrent > 3000) return "Bu ay enerji tüketimi normalin %15 üzerinde. Bir sızıntı veya kaçak olabilir mi? 🕵️‍♂️";
    return "Harika! Ev verimliliği bu ay yeşil bölgede. 🌟";
  }, [faturalar]);

  const tabs = [
    { id: 'faturalar', label: 'Faturalar', emoji: '🧾' },
    { id: 'bakim', label: 'Bakım', emoji: '🔧' },
    { id: 'yasam', label: 'Yaşam', emoji: '🪴' },
    { id: 'guvenlik', label: 'Güvenlik', emoji: '🛡️' }
  ];

  return (
    <AnimatedPage className="ev-container">
      <header className="module-header glass ev-premium-grad">
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🏡</span>
            <div className="header-text-box">
              <h1>Eraylar Malikanesi</h1>
              <p>Ev Hub & Operasyon Merkezi</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn-v2" onClick={() => navigate('/')}><ArrowLeft size={20} /></button>
          </div>
        </div>

        <nav className="ev-tab-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`e-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="e-tab-emoji">{tab.emoji}</span>
              <span className="e-tab-label">{tab.label}</span>
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

        {activeTab === 'faturalar' && (
          <div className="faturalar-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🧾 Ödeme Takvimi</h3>
              <button className="add-btn-mini"><Plus size={14} /></button>
            </div>
            
            <div className="bill-cards-grid">
              {faturalar.map(f => (
                <div key={f.id} className={`bill-card-premium glass ${f.status === 'Ödendi' ? 'paid' : 'pending'}`}>
                   <div className="bcp-header">
                     <div className="bcp-icon">{f.icon}</div>
                     <div className="bcp-info">
                       <strong>{f.name}</strong>
                       <small>{f.dueDate} · {f.provider}</small>
                     </div>
                   </div>
                   <div className="bcp-footer">
                     <div className="bcp-amount">{formatMoney(f.amount)}</div>
                     {f.status === 'Bekliyor' ? (
                       <button className="bcp-pay-btn" onClick={() => payFatura(f.id)}>Öde</button>
                     ) : (
                       <div className="bcp-status-tag">Ödendi</div>
                     )}
                   </div>
                </div>
              ))}
            </div>

            <div className="energy-chart-section mt-24 glass">
               <div className="section-header-v2">
                <h3>📊 Tüketim Analizi</h3>
              </div>
              <Bar 
                data={{
                  labels: ['Ocak', 'Şubat', 'Mart', 'Nisan'],
                  datasets: [{
                    label: 'Fatura Toplamı',
                    data: [2800, 3100, 2900, 2500],
                    backgroundColor: '#84cc16',
                    borderRadius: 8
                  }]
                }}
                options={{ plugins: { legend: { display: false } } }}
              />
            </div>
          </div>
        )}

        {activeTab === 'bakim' && (
          <div className="bakim-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🔧 Periyodik Bakımlar</h3>
            </div>
            <div className="maintenance-gauges">
               {bakimlar.map(b => {
                 const diff = Math.round((new Date() - new Date(b.lastDate)) / 864e5);
                 const perc = Math.min(100, (diff / b.intervalDays) * 100);
                 return (
                   <div key={b.id} className="m-gauge-card glass">
                      <div className="mg-box">
                        <svg viewBox="0 0 36 36" className="circular-chart">
                          <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="circle" stroke={perc > 80 ? '#f87171' : '#84cc16'} strokeDasharray={`${perc}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div className="mg-icon">{b.icon}</div>
                      </div>
                      <strong>{b.name}</strong>
                      <small>{b.intervalDays - diff} Gün Kaldı</small>
                   </div>
                 );
               })}
            </div>

            <div className="repair-list-section mt-24">
              <div className="section-header-v2">
                <h3>🔨 Ev Tamir Listesi</h3>
                <button className="add-btn-mini"><Plus size={14} /></button>
              </div>
              <div className="repair-items">
                {tamirListesi.map(t => (
                  <div key={t.id} className="repair-card glass">
                    <div className="rc-info">
                      <AlertTriangle size={16} color={t.priority === 'High' ? '#f87171' : '#f59e0b'} />
                      <strong>{t.task}</strong>
                    </div>
                    <button className="rc-done"><CheckCircle2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pro-directory mt-24">
              <div className="section-header-v2">
                <h3>📞 Usta Rehberi</h3>
              </div>
              <div className="pro-list">
                {ustaRehberi.map(u => (
                  <div key={u.id} className="pro-card glass">
                    <div className="pc-left">
                       <div className="pc-avatar"><User size={20} /></div>
                       <div className="pc-info">
                         <strong>{u.name}</strong>
                         <small>{u.category} · {u.rating} <Star size={10} fill="#f59e0b" color="#f59e0b" /></small>
                       </div>
                    </div>
                    <button className="pc-call"><Phone size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'yasam' && (
          <div className="yasam-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🪴 Bitki Bakımı</h3>
            </div>
            <div className="plant-grid">
              {bitkiler.map(p => (
                <div key={p.id} className="plant-card glass">
                  <div className="p-emoji">🌿</div>
                  <strong>{p.name}</strong>
                  <small>3 Gün Sonra Sula</small>
                  <button className="water-btn"><Droplets size={14} /> Sulandı</button>
                </div>
              ))}
            </div>

            <div className="subs-list-section mt-24">
              <div className="section-header-v2">
                <h3>📺 Dijital Abonelikler</h3>
                <strong>{formatMoney(abonelikler.reduce((a, b) => a + b.amount, 0))} / ay</strong>
              </div>
              {abonelikler.map(s => (
                <div key={s.id} className="sub-item-premium glass">
                  <strong>{s.name}</strong>
                  <span>{formatMoney(s.amount)}</span>
                </div>
              ))}
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
