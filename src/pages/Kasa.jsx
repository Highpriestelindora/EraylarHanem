import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, PlusCircle, X, ArrowRightLeft } from 'lucide-react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import './Kasa.css';

const formatMoney = (val) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);

export default function Kasa() {
  const [activeTab, setActiveTab] = useState('bakiye');
  const { kasa, ev, updateKasa, transferKasa } = useStore();

  // Modal states
  const [updateModal, setUpdateModal] = useState(null); 
  const [transferModal, setTransferModal] = useState(false);
  
  const [inputVal, setInputVal] = useState('');
  const [inputNot, setInputNot] = useState('');
  
  const [transferFrom, setTransferFrom] = useState('gorkem');
  const [transferTo, setTransferTo] = useState('esra');
  const [transferAmount, setTransferAmount] = useState('');

  const K = kasa || { bakiyeler: { gorkem: 0, esra: 0, ortak: 0 }, gecmis: [], varliklar: [] };
  const total = (K.bakiyeler?.gorkem || 0) + (K.bakiyeler?.esra || 0) + (K.bakiyeler?.ortak || 0);

  const kisiler = [
    { key: 'gorkem', label: 'Görkem', emoji: '👨', cls: 'gorkem' },
    { key: 'esra',   label: 'Esra',   emoji: '👩', cls: 'esra'   },
    { key: 'ortak',  label: 'Ortak',  emoji: '🏡', cls: 'ortak'  },
  ];

  const handleUpdateSave = async () => {
    const yeniTutar = parseFloat(inputVal.replace(',', '.'));
    if (isNaN(yeniTutar) || yeniTutar < 0) {
      toast.error('Geçerli bir tutar gir!');
      return;
    }
    const kisiInfo = kisiler.find(k => k.key === updateModal);
    try {
      await updateKasa(updateModal, yeniTutar, inputNot);
      toast.success(`${kisiInfo.label} bakiyesi güncellendi ✓`);
      setUpdateModal(null);
    } catch (err) {
      toast.error('Hata oluştu!');
    }
  };

  const handleTransferSave = async () => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Geçerli bir miktar gir!');
      return;
    }
    if (transferFrom === transferTo) {
      toast.error('Aynı hesaplar arası transfer yapılamaz!');
      return;
    }

    try {
      await transferKasa(transferFrom, transferTo, amount, inputNot);
      toast.success('Transfer başarıyla gerçekleşti! 💸');
      setTransferModal(false);
      setTransferAmount('');
      setInputNot('');
    } catch (err) {
      toast.error(err.message || 'Transfer sırasında hata oluştu!');
    }
  };

  return (
    <AnimatedPage className="kasa-container">
      <div className="module-header" style={{ background: 'linear-gradient(135deg,#2C3E50,#1a252f)' }}>
        <div className="header-info">
          <h1>Eraylar Kasa</h1>
          <p>Bakiye, Birikim & Taşınmazlar</p>
        </div>
        <div className="header-icon animate-float">🧾</div>
      </div>

      <div className="tab-nav glass">
        <button className={`tab-btn ${activeTab === 'bakiye' ? 'active' : ''}`} onClick={() => setActiveTab('bakiye')}>
          <ArrowRightLeft size={18} />
          <span>Bakiye</span>
        </button>
        <button className={`tab-btn ${activeTab === 'varliklar' ? 'active' : ''}`} onClick={() => setActiveTab('varliklar')}>
          <PlusCircle size={18} />
          <span>Varlıklar</span>
        </button>
        <button className={`tab-btn ${activeTab === 'gecmis' ? 'active' : ''}`} onClick={() => setActiveTab('gecmis')}>
          <Clock size={18} />
          <span>Geçmiş</span>
        </button>
      </div>

      <div className="kasa-content">
        {activeTab === 'bakiye' && (
          <div className="bakiye-view animate-fadeIn">
            <div className="total-hero glass" style={{ background: 'linear-gradient(135deg,#2C3E50,#1a252f)' }}>
              <div className="total-label" style={{ color: 'rgba(255,255,255,0.6)' }}>TOPLAM BİRİKİM</div>
              <div className="total-value" style={{ color: '#fff' }}>{formatMoney(total)}</div>
              <button className="transfer-trigger" onClick={() => setTransferModal(true)} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                <ArrowRightLeft size={14} /> Hesaplar Arası Transfer
              </button>
            </div>

            <div className="person-grid">
              {kisiler.map(({ key, label, emoji, cls }) => (
                <div key={key} className={`person-card glass ${cls}`}>
                  <div className="p-header">
                    <span className="p-emoji">{emoji}</span>
                    <span className="p-name">{label}</span>
                  </div>
                  <div className="p-val">{formatMoney(K[key] || K.bakiyeler?.[key])}</div>
                  <button className="update-btn" onClick={() => {
                    setUpdateModal(key);
                    setInputVal(String(K[key] || K.bakiyeler?.[key] || 0));
                    setInputNot('');
                  }}>
                    <PlusCircle size={14} /> Güncelle
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'varliklar' && (
          <div className="varliklar-view animate-fadeIn">
            <div className="section-header">
              <h3>🏠 Taşınmazlar & Varlıklar</h3>
            </div>
            
            <div className="assets-grid">
              {/* Taşınmazlar (Home Modülünden) */}
              {(ev.malVarligi || []).map(asset => (
                <div key={asset.id} className="asset-card glass">
                  <div className="asset-icon">{asset.emoji || '🏠'}</div>
                  <div className="asset-info">
                    <strong>{asset.ad}</strong>
                    <span>{asset.il} / {asset.ilce}</span>
                  </div>
                  <div className="asset-value">{formatMoney(asset.deger)}</div>
                </div>
              ))}

              {/* Araç (Araç Modülünden) */}
              <div className="asset-card glass">
                <div className="asset-icon">🚗</div>
                <div className="asset-info">
                  <strong>34 HH 1144</strong>
                  <span>Tiguan 2021 R-Line</span>
                </div>
                <div className="asset-value">{formatMoney(2250000)}</div>
              </div>
              
              {/* Diğer Varlıklar (Manuel Giriş) */}
              {(K.varliklar || []).map(asset => {
                const livePrice = asset.type === 'emtia' ? 3150 : 1; 
                const calculatedValue = asset.amount > 0 ? asset.amount * livePrice : asset.value;

                return (
                  <div key={asset.id} className="asset-card glass secondary">
                    <div className="asset-icon">{asset.icon}</div>
                    <div className="asset-info">
                      <strong>{asset.name}</strong>
                      <span>{asset.amount > 0 ? `${asset.amount} ${asset.unit}` : asset.type.toUpperCase()}</span>
                    </div>
                    <div className="asset-value" onClick={() => {
                      const newVal = prompt(`${asset.name} için yeni ${asset.amount > 0 ? 'miktar' : 'değer'} giriniz:`, asset.amount > 0 ? asset.amount : asset.value);
                      if (newVal) {
                        const num = Number(newVal);
                        if (asset.amount > 0) useStore.getState().updateVarlik(asset.id, asset.value, num);
                        else useStore.getState().updateVarlik(asset.id, num);
                        toast.success('Güncellendi!');
                      }
                    }}>
                      {formatMoney(calculatedValue)}
                      {asset.amount > 0 && <small style={{ display: 'block', fontSize: '9px', opacity: 0.6 }}>Kur: {formatMoney(livePrice)}</small>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="total-assets-summary glass">
              <div className="summary-item">
                <span>Taşınmaz + Araç:</span>
                <strong>{formatMoney((ev.malVarligi?.reduce((a,b)=>a+b.deger,0)||0) + 2250000)}</strong>
              </div>
              <div className="summary-item">
                <span>Birikim Toplamı:</span>
                <strong>{formatMoney(
                  (K.varliklar?.reduce((a,asset) => {
                    const livePrice = asset.type === 'emtia' ? 3150 : 1;
                    return a + (asset.amount > 0 ? asset.amount * livePrice : asset.value);
                  }, 0) || 0)
                )}</strong>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gecmis' && (
          <div className="gecmis-view animate-fadeIn">
            <div className="section-header">
              <h3>📋 Bakiye Geçmişi</h3>
            </div>
            <div className="gecmis-list">
              {K.gecmis && K.gecmis.length > 0 ? K.gecmis.map((item) => {
                const kisiInfo = kisiler.find(k => k.key === item.kisi);
                return (
                  <div key={item.id} className="gecmis-item glass">
                    <div className="g-icon">
                      {item.fark >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <div className="g-info">
                      <strong>{kisiInfo?.emoji} {kisiInfo?.label}</strong>
                      <span>{item.dt}{item.not ? ` · ${item.not}` : ''}</span>
                    </div>
                    <div className={`g-amt ${item.fark >= 0 ? 'pos' : 'neg'}`}>
                      {item.fark >= 0 ? '+' : ''}{formatMoney(item.fark)}
                    </div>
                  </div>
                );
              }) : (
                <div className="empty-state glass">
                  <span className="big-emoji">💸</span>
                  <p>Henüz işlem kaydı yok</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Güncelleme Modalı */}
      {updateModal && (
        <div className="kasa-modal-overlay" onClick={() => setUpdateModal(null)}>
          <div className="kasa-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{kisiler.find(k => k.key === updateModal)?.emoji} {kisiler.find(k => k.key === updateModal)?.label} Bakiyesi</h3>
              <button className="modal-close" onClick={() => setUpdateModal(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <label className="modal-label">Yeni Bakiye (₺)</label>
              <input
                type="number"
                className="modal-input"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                autoFocus
              />
              <label className="modal-label">Not (opsiyonel)</label>
              <input
                type="text"
                className="modal-input"
                value={inputNot}
                onChange={e => setInputNot(e.target.value)}
                placeholder="Maaş, harcama vb."
              />
            </div>
            <div className="modal-footer">
              <button className="btn-save" onClick={handleUpdateSave}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modalı */}
      {transferModal && (
        <div className="kasa-modal-overlay" onClick={() => setTransferModal(false)}>
          <div className="kasa-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hesaplar Arası Transfer</h3>
              <button className="modal-close" onClick={() => setTransferModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="transfer-grid">
                <div>
                  <label className="modal-label">Nereden</label>
                  <select className="modal-input" value={transferFrom} onChange={e => setTransferFrom(e.target.value)}>
                    {kisiler.map(k => <option key={k.key} value={k.key}>{k.emoji} {k.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="modal-label">Nereye</label>
                  <select className="modal-input" value={transferTo} onChange={e => setTransferTo(e.target.value)}>
                    {kisiler.map(k => <option key={k.key} value={k.key}>{k.emoji} {k.label}</option>)}
                  </select>
                </div>
              </div>
              <label className="modal-label">Miktar (₺)</label>
              <input
                type="number"
                className="modal-input"
                value={transferAmount}
                onChange={e => setTransferAmount(e.target.value)}
                placeholder="0"
              />
              <label className="modal-label">Not</label>
              <input
                type="text"
                className="modal-input"
                value={inputNot}
                onChange={e => setInputNot(e.target.value)}
                placeholder="Açıklama"
              />
            </div>
            <div className="modal-footer">
              <button className="btn-save" onClick={handleTransferSave}>Transferi Yap</button>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
