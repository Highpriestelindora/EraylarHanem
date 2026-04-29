import React, { useState } from 'react';
import { 
  Shield, Fingerprint, Lock, Key, ChevronLeft, Save, 
  AlertCircle, CheckCircle2, ShieldCheck, Eye, EyeOff,
  Stamp, Moon, Flower2, Crown, Palette
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';

const SEAL_ICONS = [
  { name: 'E', type: 'text' },
  { name: 'G', type: 'text' },
  { name: 'Görkem', type: 'text' },
  { name: 'Esra', type: 'text' },
  { name: '🤵', type: 'text' },
  { name: '👩', type: 'text' }
];

const SEAL_COLORS = [
  '#7c3aed', // Violet
  '#ef4444', // Red
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#1e293b', // Slate
  '#06b6d4', // Cyan
  '#f97316'  // Orange
];

export default function Guvenlik() {
  const navigate = useNavigate();
  const { ev, updateSafePassword, currentUser, users, updateUser } = useStore();
  
  const userKey = currentUser?.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra';
  const userProfile = users[userKey] || {};
  
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  
  // Seal State
  const [selectedIcon, setSelectedIcon] = useState(userProfile.seal?.icon || 'E');
  const [selectedColor, setSelectedColor] = useState(userProfile.seal?.color || '#7c3aed');
  
  const isPasswordSet = !!ev.guvenlik?.safePassword;

  const handleUpdatePassword = () => {
    if (!newPass) {
      toast.error('Lütfen bir şifre giriniz.');
      return;
    }
    if (newPass.length < 4) {
      toast.error('Şifre en az 4 karakter olmalıdır.');
      return;
    }
    if (newPass !== confirmPass) {
      toast.error('Şifreler eşleşmiyor!');
      return;
    }
    
    updateSafePassword(newPass);
    toast.success('Güvenlik şifresi güncellendi! 🛡️');
    setNewPass('');
    setConfirmPass('');
  };

  const handleSaveSeal = () => {
    updateUser(userKey, {
      seal: {
        icon: selectedIcon,
        color: selectedColor,
        updatedAt: new Date().toISOString()
      }
    });
    toast.success('Kişisel mührünüz kaydedildi! 🖋️');
  };

  const selectedIconData = SEAL_ICONS.find(i => i.name === selectedIcon);
  const PreviewIcon = selectedIconData?.icon;

  const getFontSize = (text) => {
    if (text.length > 3) return '32px';
    if (text.length > 1) return '38px';
    return '44px';
  };

  const isEmoji = (text) => {
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2702}-\u{27B0}]|[\u{24C2}-\u{1F251}]/u;
    return emojiRegex.test(text);
  };

  return (
    <AnimatedPage className="guvenlik-page">
      <header className="module-header glass" style={{ background: 'var(--txt)', color: 'white', padding: '15px 20px', borderRadius: '0 0 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate('/profil')} 
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800' }}>Güvenlik Ayarları</h1>
            <p style={{ fontSize: '11px', opacity: 0.8 }}>Sistem ve veri güvenliği yönetimi</p>
          </div>
        </div>
      </header>

      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        {/* Status Card */}
        <div className="security-status-card glass" style={{
          background: isPasswordSet ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          padding: '20px',
          borderRadius: '24px',
          marginBottom: '25px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '16px', 
            background: isPasswordSet ? '#22c55e' : '#f59e0b', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            {isPasswordSet ? <ShieldCheck size={28} /> : <AlertCircle size={28} />}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: isPasswordSet ? '#166534' : '#92400e' }}>
              {isPasswordSet ? 'Sistem Koruması Aktif' : 'Şifre Belirlenmemiş'}
            </h3>
            <p style={{ fontSize: '12px', color: isPasswordSet ? '#15803d' : '#b45309', opacity: 0.8 }}>
              {isPasswordSet ? 'Kasa ve hassas veriler ana şifre ile korunuyor.' : 'Hassas alanlara erişim için şifre belirlemeniz önerilir.'}
            </p>
          </div>
        </div>

        {/* SEAL SELECTION SECTION */}
        <div className="seal-selection-container glass" style={{
          background: 'white',
          padding: '24px',
          borderRadius: '24px',
          border: '1px solid var(--brd)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
          marginBottom: '25px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Key size={18} color="#7c3aed" />
            <h4 style={{ fontSize: '14px', fontWeight: '800' }}>Kişisel Mühür Seçimi</h4>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
            {/* Preview */}
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '20px', 
              background: `${selectedColor}15`, 
              border: `2px dashed ${selectedColor}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selectedColor,
              flexShrink: 0
            }}>
              {selectedIconData?.type === 'text' ? (
                <span style={{ 
                  fontFamily: isEmoji(selectedIconData.name) ? 'inherit' : '"Great Vibes", cursive', 
                  fontSize: getFontSize(selectedIconData.name), 
                  lineHeight: 1 
                }}>{selectedIconData.name}</span>
              ) : (
                PreviewIcon && <PreviewIcon size={40} strokeWidth={2.5} />
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>Mühür Önizleme</p>
              <p style={{ fontSize: '11px', opacity: 0.6 }}>Bu mühür, kişisel şifreli defterinizdeki kayıtları onaylamak için kullanılacaktır.</p>
            </div>
          </div>

          <div className="icon-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(6, 1fr)', 
            gap: '10px',
            marginBottom: '20px'
          }}>
            {SEAL_ICONS.map(item => (
              <button
                key={item.name}
                onClick={() => setSelectedIcon(item.name)}
                style={{
                  aspectRatio: '1',
                  borderRadius: '12px',
                  border: selectedIcon === item.name ? `2px solid ${selectedColor}` : '1.5px solid #f1f5f9',
                  background: selectedIcon === item.name ? `${selectedColor}10` : 'white',
                  color: selectedIcon === item.name ? selectedColor : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  padding: 0
                }}
              >
                {item.type === 'text' ? (
                  <span style={{ 
                    fontFamily: isEmoji(item.name) ? 'inherit' : '"Great Vibes", cursive', 
                    fontSize: isEmoji(item.name) ? '20px' : (item.name.length > 3 ? '14px' : '20px') 
                  }}>{item.name}</span>
                ) : (
                  <item.icon size={20} />
                )}
              </button>
            ))}
          </div>

          <div className="color-palette" style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '10px',
            marginBottom: '25px'
          }}>
            {SEAL_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: color,
                  border: selectedColor === color ? '3px solid white' : 'none',
                  boxShadow: selectedColor === color ? `0 0 0 2px ${color}` : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </div>

          <button 
            onClick={handleSaveSeal}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Palette size={16} /> MÜHRÜ KAYDET
          </button>
        </div>

        {/* Password Form */}
        <div className="security-form-container glass" style={{
          background: 'white',
          padding: '24px',
          borderRadius: '24px',
          border: '1px solid var(--brd)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Key size={18} color="#7c3aed" />
            <h4 style={{ fontSize: '14px', fontWeight: '800' }}>Ana Şifre Değiştir</h4>
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px' }}>Yeni Şifre</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPass ? 'text' : 'password'} 
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="Minimum 4 karakter"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '1.5px solid #e2e8f0',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px' }}>Şifre Tekrar</label>
            <input 
              type={showPass ? 'text' : 'password'} 
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              placeholder="Şifreyi doğrulayın"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1.5px solid #e2e8f0',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button 
            onClick={handleUpdatePassword}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              background: 'var(--txt)',
              color: 'white',
              border: 'none',
              fontWeight: '800',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}
          >
            <Save size={18} />
            {isPasswordSet ? 'ŞİFREYİ GÜNCELLE' : 'ŞİFREYİ OLUŞTUR'}
          </button>
        </div>

        {/* Info Section */}
        <div className="security-info" style={{ marginTop: '30px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', marginBottom: '15px', textTransform: 'uppercase', paddingLeft: '10px' }}>Güvenlik Özellikleri</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: <Fingerprint size={18} />, title: 'Uçtan Uca Koruma', desc: 'Verileriniz cihazınızda ve Supabase üzerinde güvenle saklanır.' },
              { icon: <Lock size={18} />, title: 'Hassas Alan Kilidi', desc: 'Kasa, Finans ve bazı Ev ayarları bu şifre ile kilitlenir.' },
              { icon: <Shield size={18} />, title: 'Otomatik Senkronizasyon', desc: 'Güvenlik ayarlarınız tüm cihazlarınızda anında güncellenir.' }
            ].map((item, i) => (
              <div key={i} className="glass" style={{ padding: '16px', borderRadius: '18px', display: 'flex', gap: '15px', alignItems: 'center', border: '1px solid var(--brd)' }}>
                <div style={{ color: '#7c3aed', background: '#f5f3ff', padding: '10px', borderRadius: '12px' }}>{item.icon}</div>
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: '800', margin: 0 }}>{item.title}</h5>
                  <p style={{ fontSize: '11px', opacity: 0.6, margin: '2px 0 0 0' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

