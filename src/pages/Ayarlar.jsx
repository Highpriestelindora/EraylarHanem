import React, { useState, useMemo } from 'react';
import { 
  User as UserIcon, Bell, Shield, Moon, LogOut, ChevronRight, 
  History as HistoryIcon, X, VolumeX, BellRing, Archive, Database, 
  CheckCircle2, Sparkles, UserCheck, FileText, Download, ShieldCheck, 
  Search, ExternalLink, BookOpen, Eye, Copy, FileDown, Calendar,
  ZoomIn, ZoomOut, Check, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import Portal from '../components/Portal';
import ConfirmModal from '../components/ConfirmModal';
import { notificationService } from '../lib/notificationService';
import { CHAT_ARCHIVE_MANIFEST } from '../constants/chatArchiveManifest';
import toast from 'react-hot-toast';
import './Ayarlar.css';

export default function Ayarlar() {
  const navigate = useNavigate();
  const { logs, settings, toggleSilentMode, currentUser, setCurrentUser } = useStore();
  const [darkMode, setDarkMode] = useState(false);
  const [notifPermission, setNotifPermission] = useState(
    'Notification' in window ? Notification.permission : 'default'
  );
  
  // Easter egg Game State
  const [showGame, setShowGame] = useState(false);
  const [gameStep, setGameStep] = useState(3);
  const [dotPos, setDotPos] = useState({ top: '50%', left: '50%' });

  // Logs Modal State
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Sohbet Arşivi & Doğrulama Modalı State
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [readerText, setReaderText] = useState('');
  const [readerLoading, setReaderLoading] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState(15);
  const [readerSearchQuery, setReaderSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenReader = async () => {
    setShowReaderModal(true);
    if (!readerText) {
      setReaderLoading(true);
      try {
        const res = await fetch('/sohbet_arsiv/Sohbet_Diyaloglari_Yorumsuz.txt');
        const text = await res.text();
        setReaderText(text);
      } catch (err) {
        toast.error('Metin yüklenirken hata oluştu');
      } finally {
        setReaderLoading(false);
      }
    }
  };

  const handleCopyAllText = () => {
    if (!readerText) return;
    navigator.clipboard.writeText(readerText)
      .then(() => toast.success('Tüm diyalog metni kopyalandı! 📋'))
      .catch(() => toast.error('Kopyalama başarısız oldu'));
  };

  const handleCopySingleItem = (text, id) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedId(id);
        toast.success('Mesaj kopyalandı! 📋');
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => toast.error('Kopyalama başarısız oldu'));
  };

  const handleDownloadMahmutPdf = () => {
    toast.success('📱 199 Görsel Arşiv PDF açılıyor (42 MB)...', {
      duration: 3000,
      icon: '⚖️'
    });
  };

  const handleDownloadTextPdf = () => {
    toast.success('💬 Yorumsuz Sohbet Diyalogları PDF açılıyor...', {
      duration: 3000,
      icon: '📄'
    });
  };

  // Parsed dialogues for in-app reader
  const parsedDialogues = useMemo(() => {
    if (!readerText) return [];
    const lines = readerText.split('\n');
    const items = [];
    let currentItem = null;
    let itemId = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('## 📅 ')) {
        if (currentItem) {
          items.push(currentItem);
          currentItem = null;
        }
        items.push({
          id: `date-${++itemId}`,
          type: 'date_header',
          title: line.replace('## ', '').trim()
        });
        continue;
      }

      if (line.startsWith('**👤 Kullanıcı**')) {
        if (currentItem) items.push(currentItem);
        const timeMatch = line.match(/\*\((.*?)\)\*/);
        currentItem = {
          id: `msg-${++itemId}`,
          type: 'message',
          speaker: 'user',
          time: timeMatch ? timeMatch[1] : '',
          content: []
        };
        continue;
      }

      if (line.startsWith('**🧠')) {
        if (currentItem) items.push(currentItem);
        const timeMatch = line.match(/\*\((.*?)\)\*/);
        currentItem = {
          id: `msg-${++itemId}`,
          type: 'message',
          speaker: 'assistant',
          time: timeMatch ? timeMatch[1] : '',
          content: []
        };
        continue;
      }

      if (line.trim() === '---') {
        if (currentItem) {
          items.push(currentItem);
          currentItem = null;
        }
        continue;
      }

      if (currentItem) {
        currentItem.content.push(line);
      }
    }

    if (currentItem) items.push(currentItem);
    return items;
  }, [readerText]);

  // Filtered dialogues based on date chip & search
  const filteredDialogues = useMemo(() => {
    let currentSectionDate = '';
    const q = readerSearchQuery.toLowerCase().trim();

    return parsedDialogues.filter(item => {
      if (item.type === 'date_header') {
        currentSectionDate = item.title;
        if (selectedDateFilter !== 'all' && !item.title.includes(selectedDateFilter)) {
          return false;
        }
        return true;
      }

      if (selectedDateFilter !== 'all' && !currentSectionDate.includes(selectedDateFilter)) {
        return false;
      }

      if (q) {
        const fullContent = item.content ? item.content.join(' ').toLowerCase() : '';
        return fullContent.includes(q) || (item.time && item.time.toLowerCase().includes(q));
      }

      return true;
    });
  }, [parsedDialogues, readerSearchQuery, selectedDateFilter]);


  const filteredManifest = React.useMemo(() => {
    if (!searchQuery.trim()) return CHAT_ARCHIVE_MANIFEST;
    const q = searchQuery.toLowerCase().trim();
    return CHAT_ARCHIVE_MANIFEST.filter(item => 
      item.index.toString() === q ||
      item.fileName.toLowerCase().includes(q) ||
      item.time.includes(q)
    );
  }, [searchQuery]);

  const handleToggleDarkMode = (e) => {
    const checked = e.target.checked;
    setDarkMode(checked);
    if (checked) {
      setShowGame(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setNotifPermission('Notification' in window ? Notification.permission : 'default');
    if (granted) {
      toast.success('Bildirimlere izin verildi! 🔔');
    } else {
      toast.error('Bildirim izni reddedildi veya tarayıcı tarafından engellendi.');
    }
  };

  const handleDotClick = () => {
    if (gameStep > 1) {
      setGameStep(prev => prev - 1);
      setDotPos({
        top: Math.floor(Math.random() * 70 + 15) + '%',
        left: Math.floor(Math.random() * 70 + 15) + '%'
      });
    } else {
      setShowGame(false);
      setGameStep(3);
      setDarkMode(false);
      document.documentElement.removeAttribute('data-theme');
      
      toast((t) => (
        <span className="flame-text">
          🔥 "Sen yanmazsan ben yanmazsam nasıl çıkar karanlıklar aydınlığa" 🔥
        </span>
      ), {
        duration: 6000,
        style: {
          background: '#1a1a1a',
          color: '#ff4500',
          borderRadius: '15px',
          border: '2px solid #ff4500',
          fontSize: '16px',
          fontWeight: '900',
          textAlign: 'center'
        },
      });
    }
  };

  const confirmAndLogout = () => {
    setCurrentUser(null);
    navigate('/');
    toast.success('Oturum kapatıldı.');
  };

  const isOnline = useStore(state => state.isOnline !== false);

  return (
    <AnimatedPage className="ayarlar-container">
      <div className="ayarlar-header">
        <div className="ayarlar-title-row">
          <h2>Ayarlar ⚙️</h2>
          <div className={`supabase-live-badge ${isOnline ? 'online' : 'offline'}`}>
            <span className={`live-dot-pulse ${isOnline ? 'online' : 'offline'}`}></span>
            <span>{isOnline ? 'Supabase Canlı ⚡' : 'Çevrimdışı ⚠️'}</span>
          </div>
        </div>
        <p>Uygulama tercihleri ve sistem durumu</p>
      </div>

      {/* Görünüm Ayarları */}
      <div className="settings-group">
        <h4>Görünüm</h4>
        
        <div className="setting-item">
          <div className="setting-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
            <Moon size={20} />
          </div>
          <div className="setting-content">
            <span className="setting-title">Karanlık Mod</span>
            <span className="setting-desc">Göz yormayan koyu renk teması</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={darkMode} onChange={handleToggleDarkMode} />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Bildirim Ayarları */}
      <div className="settings-group">
        <h4>Bildirim Ayarları</h4>
        
        <div className="setting-item clickable" onClick={handleRequestPermission}>
          <div className="setting-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
            <BellRing size={20} />
          </div>
          <div className="setting-content">
            <span className="setting-title">Sistem Bildirimleri</span>
            <span className="setting-desc">
              {notifPermission === 'granted' ? 'İzin Verildi (Aktif) ✅' : 'Bildirim İzni İste 🔔'}
            </span>
          </div>
          <ChevronRight size={18} className="chevron" />
        </div>

        <div className="setting-item">
          <div className="setting-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <VolumeX size={20} />
          </div>
          <div className="setting-content">
            <span className="setting-title">Sessiz Mod</span>
            <span className="setting-desc">Cihaza anlık sesli/titreşimli bildirim gönderilmesin</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={settings.silentMode} onChange={toggleSilentMode} />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Kullanıcı & Hesap */}
      <div className="settings-group">
        <h4>Kullanıcı & Hesap</h4>

        <div className="setting-item clickable" onClick={() => navigate('/profil')}>
          <div className="setting-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <UserCheck size={20} />
          </div>
          <div className="setting-content">
            <span className="setting-title">{currentUser?.name || 'Görkem'} Hesabı</span>
            <span className="setting-desc">Profil bilgileri ve güvenlik ayarları</span>
          </div>
          <ChevronRight size={18} className="chevron" />
        </div>

        <div className="setting-item clickable" onClick={() => setShowLogoutConfirm(true)}>
          <div className="setting-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <LogOut size={20} />
          </div>
          <div className="setting-content">
            <span className="setting-title" style={{ color: '#ef4444' }}>Kullanıcı Değiştir / Çıkış Yap</span>
            <span className="setting-desc">PIN giriş ekranına geri döner</span>
          </div>
          <ChevronRight size={18} className="chevron" />
        </div>
      </div>

      {/* Özel İnceleme: Mahmut Haklı mı & %100 Doğrulama */}
      <div className="settings-group mahmut-special-group">
        <div className="group-header-flex">
          <h4>Sohbet Arşivi & Diyalog Kayıtları</h4>
          <span className="mahmut-badge-pill">Yorumsuz Ham Metin • 199 Görsel 🟢</span>
        </div>
        
        {/* Buton 1: Sohbet Diyalogları PDF İndir / Aç */}
        <a 
          href="/sohbet_arsiv/Sohbet_Diyaloglari_Yorumsuz.pdf"
          download="Sohbet_Diyaloglari_Yorumsuz.pdf"
          target="_blank" 
          rel="noopener noreferrer"
          className="mahmut-action-btn primary-btn glass"
          onClick={handleDownloadTextPdf}
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
        >
          <div className="mahmut-btn-icon-wrap primary">
            <BookOpen size={22} />
          </div>
          <div className="mahmut-btn-info">
            <span className="mahmut-btn-title">Sohbet Diyalogları (PDF İndir / Aç)</span>
            <span className="mahmut-btn-desc">199 Görsel ve Ses Kayıtlarının Birebir Kronolojik Dökümü • 90 Sayfa • 270 KB</span>
          </div>
          <div className="mahmut-btn-action-icon">
            <Download size={20} className="download-bounce" />
          </div>
        </a>

        {/* Buton 2: Uygulama İçinde Doğrudan Oku (İndirmeden) */}
        <button 
          type="button" 
          className="mahmut-action-btn reader-action-btn glass"
          onClick={handleOpenReader}
        >
          <div className="mahmut-btn-icon-wrap reader">
            <Eye size={22} />
          </div>
          <div className="mahmut-btn-info">
            <span className="mahmut-btn-title">Uygulama İçinde Doğrudan Oku</span>
            <span className="mahmut-btn-desc">İndirme Yapmadan Tüm Diyalogları Ekranda Oku & İncele</span>
          </div>
          <div className="mahmut-btn-action-icon">
            <ChevronRight size={20} />
          </div>
        </button>

        {/* Buton 3: Hızlı Metin (TXT Dosyası) */}
        <a 
          href="/sohbet_arsiv/Sohbet_Diyaloglari_Yorumsuz.txt"
          download="Sohbet_Diyaloglari_Yorumsuz.txt"
          target="_blank" 
          rel="noopener noreferrer"
          className="mahmut-action-btn txt-action-btn glass"
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
        >
          <div className="mahmut-btn-icon-wrap txt">
            <FileText size={22} />
          </div>
          <div className="mahmut-btn-info">
            <span className="mahmut-btn-title">Hızlı Metin (TXT Dosyası Olarak Aç / İndir)</span>
            <span className="mahmut-btn-desc">Anında Açılır • Hafif Metin Formatı • 144 KB</span>
          </div>
          <div className="mahmut-btn-action-icon">
            <Download size={20} />
          </div>
        </a>

        {/* Buton 4: 199 Orijinal Görsel Dökümü */}
        <a 
          href="/sohbet_arsiv/Mahmut_Hakli_mi_Sohbet_Arsivi.pdf"
          download="Mahmut_Hakli_mi_Sohbet_Arsivi.pdf"
          target="_blank" 
          rel="noopener noreferrer"
          className="mahmut-action-btn image-archive-btn glass"
          onClick={handleDownloadMahmutPdf}
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
        >
          <div className="mahmut-btn-icon-wrap image-archive">
            <FileText size={22} />
          </div>
          <div className="mahmut-btn-info">
            <span className="mahmut-btn-title">199 Orijinal Görsel Arşivi</span>
            <span className="mahmut-btn-desc">200 Sayfa • 1600x1000 HD Orijinal Ekran Görüntüleri • 42 MB</span>
          </div>
          <div className="mahmut-btn-action-icon">
            <Download size={20} />
          </div>
        </a>

        {/* Buton 5: %100 Dosya Doğrulama */}
        <button 
          type="button" 
          className="mahmut-action-btn verify-btn glass"
          onClick={() => setShowVerificationModal(true)}
        >
          <div className="mahmut-btn-icon-wrap verify">
            <ShieldCheck size={22} />
          </div>
          <div className="mahmut-btn-info">
            <span className="mahmut-btn-title">%100 Dosya Doğrulama & Denetim</span>
            <span className="mahmut-btn-desc">199/199 JPEG Eksiksiz Kontrol • 0 Atlanan Satır • Doğrulama Raporu</span>
          </div>
          <div className="mahmut-btn-action-icon">
            <ChevronRight size={20} />
          </div>
        </button>
      </div>

      {/* Arşiv & Kayıtlar */}
      <div className="settings-group">
        <h4>Arşiv & Sistem Geçmişi</h4>
        
        <button className="history-btn glass" onClick={() => navigate('/kayitlar')}>
          <Archive size={18} />
          <span>Sistem Arşivi & Silinenler</span>
          <ChevronRight size={18} />
        </button>

        <button className="history-btn glass" onClick={() => setShowLogsModal(true)}>
          <HistoryIcon size={20} />
          <span>Sistem İşlem Günlüğü</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* App Version Info */}
      <div className="app-version-card glass">
        <div className="v-info">
          <strong>Eraylar Hanem v4.10.0</strong>
          <span>Özel Aile Yönetim Sistemi</span>
        </div>
        <div className="v-badge">GÜNCEL 🟢</div>
      </div>

      {/* Easter Egg Game Overlay */}
      {showGame && (
        <div className="dark-game-overlay">
          <div 
            className="game-flame animate-pulse" 
            style={{ 
              top: dotPos.top, 
              left: dotPos.left,
            }}
            onClick={handleDotClick}
          >
            <span className="flame-icon">🔥</span>
            <span className="flame-count">{gameStep}</span>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <ConfirmModal
          title="Çıkış Yapılsın mı?"
          message="Giriş ekranına yönlendirileceksiniz. Devam etmek istiyor musunuz?"
          confirmText="Çıkış Yap"
          cancelText="Vazgeç"
          onConfirm={confirmAndLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {/* Logs Modal */}
      {showLogsModal && (
        <Portal>
          <div className="modal-overlay" onClick={() => setShowLogsModal(false)}>
            <div className="modal-content logs-modal glass animate-pop" onClick={e => e.stopPropagation()}>
              <header className="modal-header">
                <h3><HistoryIcon size={20} /> Sistem Hareketleri</h3>
                <button className="close-btn" onClick={() => setShowLogsModal(false)}><X size={20} /></button>
              </header>
              <div className="logs-mini-list">
                {logs && logs.length > 0 ? (
                  logs.map((log) => (
                    <div key={log.id} className="log-mini-item">
                      <div className="log-mini-main">
                        <span className="log-mini-action">{log.action}</span>
                        <span className="log-mini-detail">{log.detail}</span>
                      </div>
                      <span className="log-mini-time">
                        {new Date(log.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="empty-logs">Henüz bir hareket kaydedilmedi.</p>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* 199/199 Dosya Doğrulama Modalı */}
      {showVerificationModal && (
        <Portal>
          <div className="modal-overlay" onClick={() => setShowVerificationModal(false)}>
            <div 
              className="modal-content verification-modal glass animate-pop" 
              onClick={e => e.stopPropagation()}
            >
              <header className="modal-header">
                <div className="v-header-text">
                  <h3><ShieldCheck size={22} className="v-shield-icon" /> 199/199 JPEG Dosya Doğrulama</h3>
                  <p className="v-subtitle">New folder içindeki tüm dosyalar satır satır ve piksel piksel doğrulandı</p>
                </div>
                <button className="close-btn" onClick={() => setShowVerificationModal(false)}><X size={20} /></button>
              </header>

              {/* Özet İstatistik Kartları */}
              <div className="v-stats-grid">
                <div className="v-stat-card">
                  <span className="v-stat-num">199 / 199</span>
                  <span className="v-stat-label">Toplam Görsel</span>
                  <span className="v-stat-badge success">✅ %100 Başarı</span>
                </div>
                <div className="v-stat-card">
                  <span className="v-stat-num">0</span>
                  <span className="v-stat-label">Atlanan / Kayıp</span>
                  <span className="v-stat-badge success">Sıfır Kayıp</span>
                </div>
                <div className="v-stat-card">
                  <span className="v-stat-num">1600x1000</span>
                  <span className="v-stat-label">Orijinal HD</span>
                  <span className="v-stat-badge info">HD Piksel</span>
                </div>
                <div className="v-stat-card">
                  <span className="v-stat-num">Kronolojik</span>
                  <span className="v-stat-label">12:35 - 12:41</span>
                  <span className="v-stat-badge purple">Tam Sıralı</span>
                </div>
              </div>

              {/* Arama / Filtreleme Çubuğu */}
              <div className="v-search-bar">
                <Search size={18} className="v-search-icon" />
                <input 
                  type="text" 
                  placeholder="Sayfa no veya dosya adı ara (örn: 42, 12.35)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="v-clear-btn" onClick={() => setSearchQuery('')}><X size={16} /></button>
                )}
              </div>

              {/* 199 Dosya Listesi */}
              <div className="v-list-scroll">
                {filteredManifest.map((item) => (
                  <div key={item.index} className="v-item-row">
                    <div className="v-item-left">
                      <span className="v-index-tag">#{item.index}</span>
                      <div className="v-file-info">
                        <span className="v-file-title">{item.fileName}</span>
                        <span className="v-file-sub">
                          ⏱️ {item.time} • 💾 {item.sizeKB} KB • 📐 {item.width}x{item.height}
                        </span>
                      </div>
                    </div>
                    <div className="v-item-right">
                      <span className="v-check-badge">
                        <CheckCircle2 size={14} /> Doğrulandı
                      </span>
                      <span className="v-integrity-pill">1:1 Satır Korundu</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alt Butonlar */}
              <footer className="v-modal-footer">
                <a 
                  href="/sohbet_arsiv/Sohbet_Diyaloglari_Yorumsuz.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-footer-btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <BookOpen size={18} />
                  <span>Diyaloglar (PDF)</span>
                </a>
                <a 
                  href="/sohbet_arsiv/Sohbet_Diyaloglari_Yorumsuz.txt"
                  download="Sohbet_Diyaloglari_Yorumsuz.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-footer-btn-secondary"
                  style={{ textDecoration: 'none' }}
                >
                  <FileText size={18} />
                  <span>Düz Metin (TXT)</span>
                </a>
                <a 
                  href="/sohbet_arsiv/Mahmut_Hakli_mi_Sohbet_Arsivi.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="v-footer-btn-secondary"
                  style={{ textDecoration: 'none' }}
                >
                  <Download size={18} />
                  <span>Görseller (42 MB)</span>
                </a>
              </footer>
            </div>
          </div>
        </Portal>
      )}

      {/* Sohbet Diyalogları Okuyucu Modalı (In-App Reader - iPhone & PWA Uyumlu) */}
      {showReaderModal && (
        <Portal>
          <div className="modal-overlay" onClick={() => setShowReaderModal(false)}>
            <div 
              className="modal-content reader-modal glass animate-pop" 
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Başlık */}
              <header className="reader-header">
                <div className="reader-header-text">
                  <h3>
                    <BookOpen size={20} className="reader-title-icon" /> 
                    <span>Sohbet Diyalogları</span>
                    <span className="reader-mode-pill">Yorumsuz Ham Metin</span>
                  </h3>
                  <p className="reader-subtitle">
                    1 - 13 Eylül 2026 • 18.000+ Kelime • 100% Kronolojik Gerçek Zaman Sıralaması
                  </p>
                </div>

                <div className="reader-header-actions">
                  {/* Yazı Boyutu Ayarı */}
                  <div className="reader-font-controls" title="Yazı Boyutu">
                    <button 
                      type="button" 
                      className="reader-icon-btn" 
                      onClick={() => setReaderFontSize(prev => Math.max(13, prev - 1))}
                      title="Yazıyı Küçült"
                    >
                      <ZoomOut size={16} />
                    </button>
                    <span className="reader-font-indicator">{readerFontSize}px</span>
                    <button 
                      type="button" 
                      className="reader-icon-btn" 
                      onClick={() => setReaderFontSize(prev => Math.min(22, prev + 1))}
                      title="Yazıyı Büyüt"
                    >
                      <ZoomIn size={16} />
                    </button>
                  </div>

                  <button 
                    type="button" 
                    className="reader-icon-btn copy-all-btn" 
                    onClick={handleCopyAllText}
                    title="Tüm Metni Kopyala"
                  >
                    <Copy size={17} />
                  </button>

                  <button 
                    type="button" 
                    className="close-btn reader-close-btn" 
                    onClick={() => setShowReaderModal(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </header>

              {/* Arama ve Hızlı Filtre Barı */}
              <div className="reader-toolbar">
                <div className="reader-search-box">
                  <Search size={16} className="reader-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Diyaloglarda ara (örn: altın, Marmaris, 1.280.000, duşakabin)..." 
                    value={readerSearchQuery}
                    onChange={(e) => setReaderSearchQuery(e.target.value)}
                  />
                  {readerSearchQuery && (
                    <button 
                      type="button" 
                      className="reader-clear-btn" 
                      onClick={() => setReaderSearchQuery('')}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* Tarih Hızlı Filtre Çipleri */}
                <div className="reader-chips-scroll">
                  {[
                    { key: 'all', label: 'Tüm Konuşmalar' },
                    { key: '1 EYLÜL', label: '1 Eyl (Dürtü Kontrolü)' },
                    { key: '11 EYLÜL', label: '11 Eyl (Altın Krizi)' },
                    { key: '12 EYLÜL', label: '12 Eyl (Borçlar & Veda)' },
                    { key: '13 EYLÜL', label: '13 Eyl (Delil & Arşiv)' },
                  ].map(chip => (
                    <button
                      key={chip.key}
                      type="button"
                      className={`reader-filter-chip ${selectedDateFilter === chip.key ? 'active' : ''}`}
                      onClick={() => setSelectedDateFilter(chip.key)}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Okuma Alanı */}
              <div className="reader-body-scroll" style={{ fontSize: `${readerFontSize}px` }}>
                {readerLoading ? (
                  <div className="reader-loading">
                    <div className="reader-spinner"></div>
                    <span>Diyalog metni yükleniyor (18.000+ kelime)...</span>
                  </div>
                ) : filteredDialogues.length > 0 ? (
                  filteredDialogues.map((item) => {
                    if (item.type === 'date_header') {
                      return (
                        <div key={item.id} className="reader-date-card">
                          <div className="reader-date-badge">
                            <Calendar size={15} />
                            <span>{item.title}</span>
                          </div>
                        </div>
                      );
                    }

                    const isUser = item.speaker === 'user';
                    const fullText = item.content ? item.content.join('\n') : '';

                    return (
                      <div key={item.id} className={`reader-bubble-wrap ${isUser ? 'user-wrap' : 'assistant-wrap'}`}>
                        <div className={`reader-bubble ${isUser ? 'user' : 'assistant'}`}>
                          <div className="reader-bubble-header">
                            <span className={`reader-speaker-tag ${isUser ? 'user-tag' : 'assistant-tag'}`}>
                              {isUser ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)'}
                            </span>
                            {item.time && (
                              <span className="reader-time-pill">
                                {item.time}
                              </span>
                            )}
                            <button 
                              type="button" 
                              className="reader-bubble-copy-btn"
                              onClick={() => handleCopySingleItem(fullText, item.id)}
                              title="Bu mesajı kopyala"
                            >
                              {copiedId === item.id ? <Check size={14} className="copied-check" /> : <Copy size={14} />}
                            </button>
                          </div>
                          <div className="reader-bubble-content">
                            {item.content && item.content.map((paragraph, pIdx) => {
                              if (!paragraph.trim()) return <div key={pIdx} className="reader-p-space" />;
                              return (
                                <p key={pIdx} className="reader-paragraph">
                                  {paragraph}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="reader-empty">
                    <p>Aramanızla eşleşen bir diyalog bulunamadı.</p>
                    <button 
                      type="button" 
                      className="reader-reset-btn" 
                      onClick={() => { setReaderSearchQuery(''); setSelectedDateFilter('all'); }}
                    >
                      Filtreleri Temizle
                    </button>
                  </div>
                )}
              </div>

              {/* Sticky Footer */}
              <footer className="reader-modal-footer">
                <a 
                  href="/sohbet_arsiv/Sohbet_Diyaloglari_Yorumsuz.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="reader-footer-btn primary"
                  onClick={handleDownloadTextPdf}
                >
                  <Download size={18} />
                  <span>PDF İndir / Aç (270 KB)</span>
                </a>
                <a 
                  href="/sohbet_arsiv/Sohbet_Diyaloglari_Yorumsuz.txt" 
                  download="Sohbet_Diyaloglari_Yorumsuz.txt" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="reader-footer-btn txt"
                >
                  <FileText size={18} />
                  <span>TXT Metin (144 KB)</span>
                </a>
                <button 
                  type="button" 
                  className="reader-footer-btn close"
                  onClick={() => setShowReaderModal(false)}
                >
                  Kapat
                </button>
              </footer>
            </div>
          </div>
        </Portal>
      )}
    </AnimatedPage>
  );
}

