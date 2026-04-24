import React, { useState, useEffect } from 'react';
import { User, Shield, LogOut, Trophy, ChevronRight, X, Save, CreditCard, Award, Fingerprint, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import './Ayarlar.css'; // Reusing common styles, will add profile specific ones

export default function Profil() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, users, updateUser } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const userKey = currentUser?.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra';
  const profile = users[userKey] || {};
  const [formData, setFormData] = useState({ ...profile });

  // Sync formData with profile when profile changes (e.g. switching users)
  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handleSaveProfile = () => {
    updateUser(userKey, formData);
    setIsEditing(false);
    toast.success('Profil güncellendi! ✨');
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmAndLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <AnimatedPage className="ayarlar-container" style={{ paddingTop: '20px' }}>
      {/* ID CARD DESIGN */}
      <div className="id-card-wrapper" style={{ marginBottom: '15px' }}>
        <div className="id-card glass">
          <div className="id-card-header">
            <div className="id-card-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/eraylar-logo.png" alt="Logo" style={{ height: '20px', filter: 'brightness(0) invert(0)' }} />
              ERAYLAR HANEM
            </div>
            <div className="id-card-type">KİMLİK KARTI</div>
          </div>
          
          <div className="id-card-body">
            <div className="id-card-photo-section">
              <div className="id-card-photo">
                {profile.emoji || currentUser?.emoji || '👤'}
              </div>
              <div className="id-card-barcode"></div>
            </div>
            
            <div className="id-card-info">
              <div className="id-field">
                <label>AD SOYAD</label>
                <div className="value">{profile.name || currentUser?.name}</div>
              </div>
              <div className="id-field">
                <label>ROL / STATÜ</label>
                <div className="value">{profile.role || 'Aile Üyesi'}</div>
              </div>
              <div className="id-row">
                <div className="id-field">
                  <label>DOĞUM TARİHİ</label>
                  <div className="value">{profile.birthDate || '01.01.1990'}</div>
                </div>
                <div className="id-field">
                  <label>KAN GRUBU</label>
                  <div className="value">{profile.bloodType || '0 RH+'}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="id-card-footer">
            <div className="id-number">NO: {userKey.toUpperCase()}-2024-EH</div>
            <button className="btn-edit-id" onClick={() => setIsEditing(true)}>DÜZENLE</button>
          </div>
        </div>
      </div>

      {/* İletişim Bilgileri Alt Panel */}
      <div className="contact-info-panel glass" style={{ marginBottom: '20px', padding: '10px 16px', gap: '10px' }}>
        <div className="contact-item">
          <div className="contact-icon"><Phone size={16} /></div>
          <div className="contact-text">
            <label>Telefon</label>
            <span>{profile.phone || 'Girilmedi'}</span>
          </div>
        </div>
        <div className="contact-divider"></div>
        <div className="contact-item">
          <div className="contact-icon"><Mail size={16} /></div>
          <div className="contact-text">
            <label>E-posta</label>
            <span>{profile.email || 'Girilmedi'}</span>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h4>Başarılar & Kazanımlar</h4>
        
        <div className="setting-item clickable" onClick={() => navigate('/basarilar')}>
          <div className="setting-icon" style={{ background: '#fff7ed', color: '#f59e0b' }}><Trophy size={20} /></div>
          <div className="setting-content">
            <span className="setting-title">Başarılar ve Rozetler</span>
            <span className="setting-desc">Tüm aile içi kazanımların</span>
          </div>
          <Award size={18} className="chevron" />
        </div>
      </div>

      <div className="settings-group">
        <h4>Güvenlik & Hesap</h4>
        
        <div className="setting-item clickable">
          <div className="setting-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}><Fingerprint size={20} /></div>
          <div className="setting-content">
            <span className="setting-title">Güvenlik Ayarları</span>
            <span className="setting-desc">Şifre ve erişim yönetimi</span>
          </div>
          <ChevronRight size={18} className="chevron" />
        </div>

        <div className="setting-item clickable text-danger" onClick={handleLogout}>
          <div className="setting-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><LogOut size={20} /></div>
          <div className="setting-content">
            <span className="setting-title">Kullanıcı Değiştir</span>
            <span className="setting-desc">Çıkış yap ve başkasını seç</span>
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <ConfirmModal 
          title="Kullanıcı Değiştir"
          message="Kullanıcı seçim ekranına dönmek istiyor musun?"
          confirmText="Evet, Çıkış Yap"
          onConfirm={confirmAndLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content profile-edit-modal glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Kimlik Bilgilerini Düzenle</h3>
              <button onClick={() => setIsEditing(false)}><X /></button>
            </div>
            
            <div className="form-group">
              <label><User size={14} /> Ad Soyad</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><Fingerprint size={14} /> Rol / Statü</label>
                <input 
                  type="text" 
                  value={formData.role} 
                  placeholder="Örn: Aile Reisi, Şef..."
                  onChange={e => setFormData({...formData, role: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label><CreditCard size={14} /> Kan Grubu</label>
                <input 
                  type="text" 
                  value={formData.bloodType} 
                  placeholder="Örn: 0 RH+"
                  onChange={e => setFormData({...formData, bloodType: e.target.value})} 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><Calendar size={14} /> Doğum Tarihi</label>
                <input 
                  type="text" 
                  value={formData.birthDate} 
                  onChange={e => setFormData({...formData, birthDate: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label><MapPin size={14} /> Doğum Yeri</label>
                <input 
                  type="text" 
                  value={formData.birthPlace} 
                  onChange={e => setFormData({...formData, birthPlace: e.target.value})} 
                />
              </div>
            </div>

            <div className="form-group">
              <label><Phone size={14} /> Telefon Numarası</label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <label><Mail size={14} /> E-posta Adresi</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            <button className="btn-primary" onClick={handleSaveProfile} style={{ marginTop: '20px', width: '100%', background: 'var(--txt)', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Save size={18} style={{ marginRight: '8px' }} /> KİMLİĞİ GÜNCELLE
            </button>
          </div>
        </div>
      )}

      <style>{`
        .id-card-wrapper {
          perspective: 1000px;
          margin-bottom: 30px;
        }
        
        .id-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 24px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          color: #1e293b;
          position: relative;
          overflow: hidden;
        }
        
        .id-card::before {
          content: 'EH';
          position: absolute;
          right: -20px;
          bottom: -20px;
          font-size: 150px;
          font-weight: 900;
          opacity: 0.03;
          pointer-events: none;
        }

        .id-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding-bottom: 12px;
        }
        
        .id-card-logo {
          font-weight: 900;
          letter-spacing: 1px;
          font-size: 12px;
          color: #64748b;
        }
        
        .id-card-type {
          background: #1e293b;
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 800;
        }

        .id-card-body {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
        }
        
        .id-card-photo-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }
        
        .id-card-photo {
          width: 100px;
          height: 120px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
          border: 4px solid white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        
        .id-card-barcode {
          width: 100px;
          height: 30px;
          background: repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 4px);
          opacity: 0.7;
        }

        .id-card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .id-field label {
          font-size: 9px;
          font-weight: 800;
          color: #94a3b8;
          display: block;
          margin-bottom: 2px;
        }
        
        .id-field .value {
          font-size: 15px;
          font-weight: 800;
          color: #1e293b;
        }
        
        .id-row {
          display: flex;
          gap: 20px;
        }

        .id-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(0,0,0,0.05);
          padding-top: 16px;
        }
        
        .id-number {
          font-family: monospace;
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }
        
        .btn-edit-id {
          background: transparent;
          border: 1px solid #cbd5e1;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-edit-id:hover { background: #1e293b; color: white; border-color: #1e293b; }

        .contact-info-panel {
          background: white;
          border-radius: 20px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 15px;
          margin-bottom: 30px;
          border: 1px solid var(--brd);
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          flex-wrap: wrap;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 140px;
        }
        
        .contact-icon {
          width: 36px;
          height: 36px;
          background: var(--bg);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--txt-light);
          flex-shrink: 0;
        }
        
        .contact-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }
        
        .contact-text label {
          font-size: 10px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
        }
        
        .contact-text span {
          font-size: 13px;
          font-weight: 700;
          color: var(--txt);
          word-break: break-all;
          overflow-wrap: break-word;
          display: block;
          min-width: 0;
        }
        
        .contact-divider {
          width: 1px;
          height: 30px;
          background: var(--brd);
        }

        @media (max-width: 480px) {
          .contact-divider { display: none; }
          .contact-item { width: 100%; }
        }

        .form-group label { display: flex; align-items: center; gap: 6px; }
      `}</style>
    </AnimatedPage>
  );
}
