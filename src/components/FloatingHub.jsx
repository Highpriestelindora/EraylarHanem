import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Plus, X, Send, Trash2, Refrigerator, BadgeDollarSign, Archive } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { PET_QUOTES } from '../constants/petQuotes';
import toast from 'react-hot-toast';
import './FloatingHub.css';
import PaymentSelector from './PaymentSelector';
import Portal from './Portal';

function FloatingHub() {
  const navigate = useNavigate();
  const constraintsRef = useRef(null);
  
  // Seçici abonelikler (Sadece değişen kısım render tetikler)
  const mutfak = useStore(state => state.mutfak);
  const currentUser = useStore(state => state.currentUser);
  const ui = useStore(state => state.ui);
  
  const addKitchenNote = useStore(state => state.addKitchenNote);
  const archiveNote = useStore(state => state.archiveNote);
  const restoreNote = useStore(state => state.restoreNote);
  const removeNote = useStore(state => state.removeNote);
  const updateNotePosition = useStore(state => state.updateNotePosition);
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'chat' or 'expense'
  const [fridgeView, setFridgeView] = useState('board'); // 'board' or 'history'
  const historyEndRef = useRef(null);

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (fridgeView === 'history') {
      scrollToBottom();
    }
  }, [fridgeView, mutfak?.history]);

  // Buzdolabı sohbeti bildirimlerini otomatik olarak açma
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);
  
  const [focusedNote, setFocusedNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const notes = mutfak?.sohbet || [];
  const currentUserName = currentUser?.name || 'Görkem';
  const targetUserName = currentUserName.toLowerCase().includes('esra') ? 'Görkem' : 'Esra';

  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Diğer');
  const [expPaymentMethod, setExpPaymentMethod] = useState('');
  const bankaHesaplari = useStore(state => state.kasa?.bankaHesaplari || []);
  const kartlar = useStore(state => state.finans?.kartlar || []);

  if (ui.isModalOpen) return null;

  const categories = [
    { id: 'mutfak', label: 'Mutfak', icon: '🍲' },
    { id: 'arac', label: 'Araç', icon: '🚗' },
    { id: 'sosyal', label: 'Sosyal', icon: '🎭' },
    { id: 'fatura', label: 'Fatura', icon: '📜' },
    { id: 'diger', label: 'Diğer', icon: '🏷️' }
  ];

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addKitchenNote(noteText, currentUserName);
    setNoteText('');
    toast.success('Not buzdolabına yapıştırıldı! 📌');
  };

  const formatNoteDate = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (isToday) return `Bugün ${time}`;
      return `${d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} ${time}`;
    } catch {
      return '';
    }
  };

  const handleAddExpense = async () => {
    if (!expAmount) return toast.error('Lütfen tutar girin');
    
    const finalTitle = expTitle.trim() || `${expCategory} Harcaması`;
    const amount = parseFloat(expAmount.replace(',', '.'));

    // Doğrudan addHarcama yerine addExpense (onay havuzu) kullanıyoruz
    useStore.getState().addExpense({
      title: finalTitle,
      amount: amount,
      category: expCategory,
      payer: currentUser?.name || 'Sistem',
      source: 'Hızlı Ödeme',
      defaultPay: expPaymentMethod
    });

    setExpTitle('');
    setExpAmount('');
    setExpPaymentMethod('');
    setActiveModal(null);
    setIsOpen(false);
    toast.success('Harcama onay havuzuna gönderildi! 📥');
  };

  const handlePetClick = (pet) => {
    const quotes = PET_QUOTES[pet];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    toast(randomQuote, {
      icon: pet === 'waffle' ? '🐶' : '🐱',
      style: {
        borderRadius: '15px',
        background: '#2E1065',
        color: '#fff',
        fontWeight: 'bold'
      }
    });
  };

  return (
    <Portal>
      {(isOpen || activeModal === 'expense') && (
        <div 
          className="hub-overlay" 
          onClick={() => { setIsOpen(false); setActiveModal(null); }} 
        />
      )}

      {activeModal === 'chat' && (
        <div className="hub-full-modal chat-immersive animate-fadeIn">
          <div className="immersive-fridge-surface">
            <div className="fridge-sheen" />
            
            <header className="immersive-header">
              <div className="header-pill">
                <Refrigerator size={18} color="#2563eb" />
                <h3>Buzdolabı Sohbeti</h3>
              </div>
              
              <div className="fridge-view-toggle">
                <button 
                  className={fridgeView === 'board' ? 'active' : ''} 
                  onClick={() => setFridgeView('board')}
                >
                  📌 Kapak ({notes.length})
                </button>
                <button 
                  className={fridgeView === 'history' ? 'active' : ''} 
                  onClick={() => setFridgeView('history')}
                >
                  📜 Sohbet Geçmişi
                </button>
              </div>

              <button className="close-immersive" onClick={() => setActiveModal(null)}><X size={24} /></button>
            </header>

            {fridgeView === 'board' ? (
              <div className="immersive-notes-board" ref={constraintsRef}>
                {notes.map((note, idx) => {
                  if (!note) return null;
                  const text = note.t || note.mesaj || '';
                  const writer = note.w || note.kisi || 'Görkem';
                  const isEsra = writer.toLowerCase().includes('esra');
                  const isFocused = focusedNote === note.id;
                  
                  const noteStyle = isEsra ? {
                    backgroundColor: '#FFF1F2',
                    border: '1.5px solid #FECDD3',
                    magnetBg: 'radial-gradient(circle at 30% 30%, #F43F5E, #9F1239)',
                    tagColor: '#BE123C',
                    emoji: '👩‍🍳'
                  } : {
                    backgroundColor: (idx % 2 === 0) ? '#FEFCE8' : '#F5F3FF',
                    border: (idx % 2 === 0) ? '1.5px solid #FEF08A' : '1.5px solid #DDD6FE',
                    magnetBg: (idx % 2 === 0) ? 'radial-gradient(circle at 30% 30%, #EAB308, #854D0E)' : 'radial-gradient(circle at 30% 30%, #8B5CF6, #5B21B6)',
                    tagColor: (idx % 2 === 0) ? '#854D0E' : '#6D28D9',
                    emoji: '👨‍💻'
                  };

                  return (
                    <motion.div 
                      key={note.id} 
                      drag={!isFocused}
                      dragConstraints={constraintsRef}
                      dragMomentum={false}
                      dragElastic={0}
                      layout
                      initial={false}
                      animate={{
                        left: isFocused ? '50%' : (note.x || (10 + (idx % 3) * 30)) + '%',
                        top: isFocused ? '50%' : (note.y || (15 + (idx % 4) * 20)) + '%',
                        scale: isFocused ? 1.35 : 1,
                        rotate: isFocused ? 0 : (idx % 10 - 5) * 2,
                        x: isFocused ? '-50%' : 0,
                        y: isFocused ? '-50%' : 0
                      }}
                      className={`immersive-note-wrap ${isFocused ? 'focused' : ''}`}
                      onClick={() => setFocusedNote(isFocused ? null : note.id)}
                      style={{ 
                        backgroundColor: noteStyle.backgroundColor,
                        border: noteStyle.border,
                        zIndex: isFocused ? 2000 : 10 + idx,
                        position: isFocused ? 'fixed' : 'absolute',
                        cursor: isFocused ? 'zoom-out' : 'grab',
                        boxShadow: isFocused ? '0 25px 60px rgba(0,0,0,0.4)' : '3px 15px 30px rgba(0,0,0,0.12)'
                      }}
                      whileDrag={{ scale: 1.08, zIndex: 1000, rotate: 0 }}
                      onDragEnd={(event, info) => {
                        if (!constraintsRef.current || isFocused) return;
                        const board = constraintsRef.current.getBoundingClientRect();
                        const newX = ((info.point.x - board.left) / board.width) * 100;
                        const newY = ((info.point.y - board.top) / board.height) * 100;
                        updateNotePosition(note.id, Math.max(5, Math.min(85, newX)), Math.max(5, Math.min(85, newY)));
                      }}
                    >
                      <div className="immersive-magnet-cap" style={{ background: noteStyle.magnetBg }} />
                      <div className="note-header-row">
                        <span className="writer-tag" style={{ color: noteStyle.tagColor, fontWeight: 800 }}>
                          {noteStyle.emoji} {writer}
                        </span>
                        <span className="note-time-mini">{formatNoteDate(note.d || note.tarih)}</span>
                      </div>
                      <p className="note-text-premium" style={{ fontSize: isFocused ? '18px' : '15px' }}>
                        {text || 'Not içeriği'}
                      </p>
                      <div className="note-footer-premium">
                        <span style={{ fontSize: '10px', opacity: 0.5 }}>📌 Kapağa İğneli</span>
                        <div style={{ display: 'flex', gap: '4px', position: 'relative', zIndex: 30 }}>
                          <button 
                            className="delete-btn-mini" 
                            onPointerDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              archiveNote(note.id); 
                              toast.success('Not kapağı temizlemek için kaldırıldı. 📦'); 
                            }} 
                            title="Kapağı Temizle (Arşivle)"
                          >
                            <Archive size={14} />
                          </button>
                          <button 
                            className="delete-btn-mini" 
                            onPointerDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setConfirmDeleteId(note.id);
                            }} 
                            title="Kalıcı Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {notes.length === 0 && (
                  <div className="empty-immersive-msg">
                    <div className="empty-icon-wrap">📝</div>
                    <p>Buzdolabı kapağı tertemiz!<br/>Birbirinize tatlı bir not bırakın ✨</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="immersive-history-list">
                {(mutfak.history || []).length > 0 ? (
                  [...mutfak.history].sort((a, b) => new Date(a.d || a.tarih) - new Date(b.d || b.tarih)).map((log) => {
                    const writer = log.w || log.kisi || 'Görkem';
                    const text = log.t || log.mesaj || '';
                    const isEsra = writer.toLowerCase().includes('esra');
                    const isPinned = notes.some(n => String(n.id) === String(log.id));

                    return (
                      <div key={log.id} className={`history-item ${isEsra ? 'esra' : 'gorkem'}`}>
                        <div className="history-bubble">
                          <div className="history-author-header">
                            <span className="h-avatar">{isEsra ? '👩‍🍳' : '👨‍💻'}</span>
                            <strong>{writer}</strong>
                          </div>
                          <p>{text}</p>
                          <div className="history-meta">
                            <span className="h-date">{formatNoteDate(log.d || log.tarih)}</span>
                            <div className="history-actions-row">
                              {isPinned ? (
                                <span className="h-pinned-badge">📌 Kapakta</span>
                              ) : (
                                <button 
                                  className="h-repin-btn"
                                  onPointerDown={(e) => e.stopPropagation()}
                                  onTouchStart={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    restoreNote(log.id);
                                    toast.success('Not buzdolabı kapağına asıldı! 📌');
                                  }}
                                  title="Buzdolabı kapağına as"
                                >
                                  📌 Kapağa As
                                </button>
                              )}
                              <button 
                                className="h-delete-btn" 
                                onPointerDown={(e) => e.stopPropagation()}
                                touchStart={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDeleteId(log.id);
                                }}
                                title="Kalıcı Sil"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-history">
                    <span>💌</span>
                    <p>Henüz geçmiş not kaydı yok. İlk notu aşağıdan yazabilirsiniz!</p>
                  </div>
                )}
                <div ref={historyEndRef} />
              </div>
            )}

            <div className="immersive-input-wrap">
              <div className="input-glass-premium">
                <input 
                  value={noteText} 
                  onChange={e => setNoteText(e.target.value)} 
                  placeholder={`${targetUserName}'e mıknatıslı bir not yapıştır...`}
                  onKeyPress={e => e.key === 'Enter' && handleAddNote()}
                />
                <button onClick={handleAddNote} className="immersive-send-btn" title="Notu Yapıştır">
                  <Send size={20} />
                </button>
              </div>
            </div>

            {/* Custom Confirmation Dialog */}
            {confirmDeleteId && (
              <div 
                className="hub-confirm-overlay animate-fadeIn" 
                onClick={() => setConfirmDeleteId(null)}
              >
                <div 
                  className="hub-confirm-card" 
                  onClick={e => e.stopPropagation()}
                >
                  <div className="hub-confirm-icon">🗑️</div>
                  <h4>Notu Silmek İstiyor musunuz?</h4>
                  <p>Bu not buzdolabı kapağından ve sohbet geçmişinden kalıcı olarak silinecektir.</p>
                  <div className="hub-confirm-actions">
                    <button 
                      className="hub-btn-cancel" 
                      type="button" 
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      Vazgeç
                    </button>
                    <button 
                      className="hub-btn-danger" 
                      type="button"
                      onClick={() => {
                        removeNote(confirmDeleteId);
                        setConfirmDeleteId(null);
                        toast.success('Not silindi! 🗑️');
                      }}
                    >
                      Evet, Sil
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeModal === 'expense' && (
        <div className="hub-modal expense-modal">
          <div className="hub-modal-header">
            <h4>💸 Hızlı Harcama</h4>
            <button className="hub-modal-close" onClick={() => setActiveModal(null)} aria-label="Kapat">
              <X size={20} />
            </button>
          </div>
          <div className="hub-expense-body">
            <div className="hub-amount-wrapper">
              <input 
                className="hub-input amount" 
                type="number" 
                step="any"
                placeholder="0.00" 
                value={expAmount}
                onChange={e => setExpAmount(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddExpense()}
                autoFocus
              />
              <span className="hub-currency-symbol">₺</span>
            </div>

            <input 
              className="hub-input title" 
              placeholder="Ne harcaması? (Opsiyonel)" 
              value={expTitle}
              onChange={e => setExpTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddExpense()}
            />
            
            <div className="hub-category-grid">
              {categories.map(c => (
                <button 
                  key={c.id} 
                  type="button"
                  className={`hub-cat-btn ${expCategory === c.label ? 'active' : ''}`}
                  onClick={() => setExpCategory(c.label)}
                >
                  <span className="cat-icon">{c.icon}</span>
                  <span className="cat-label">{c.label}</span>
                </button>
              ))}
            </div>

            <div className="hub-payer-select">
              <PaymentSelector value={expPaymentMethod} onChange={setExpPaymentMethod} label="💳 Ödeme Yöntemi" />
            </div>

            <button className="hub-submit-btn" onClick={handleAddExpense}>
              <span>Sisteme İşle</span>
              <span style={{ fontSize: '18px' }}>🚀</span>
            </button>
          </div>
        </div>
      )}

      <div className="floating-hub-container">
        <div className={`hub-options ${isOpen ? 'show' : ''}`}>
          <button className="hub-option-btn chat" onClick={() => { setActiveModal('chat'); setIsOpen(false); }}>
            <Refrigerator size={26} color="#3b82f6" />
            <span className="tiny-label" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Buzdolabı<br/>Sohbeti</span>
          </button>
          {currentUser?.name !== 'Misafir' && (
            <button className="hub-option-btn expense" onClick={() => { setActiveModal('expense'); setIsOpen(false); }}>
              <BadgeDollarSign size={26} color="#10b981" />
              <span className="tiny-label" style={{ color: '#10b981', fontWeight: 'bold' }}>Hızlı<br/>Harcama</span>
            </button>
          )}
        </div>

        {/* Original Arch Design Hub */}
        <div className="hub-capsule-wrapper">
          <div className="hub-capsule-main">
            <div className="hub-buttons-row-original">
              <button 
                className="hub-btn-circle white" 
                onClick={() => { navigate('/'); setIsOpen(false); }}
              >
                <Home size={24} />
              </button>
              
              <button 
                className={`hub-btn-circle purple ${isOpen ? 'active' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={26} /> : <Plus size={26} />}
              </button>
            </div>

            <div className="hub-pets-row-original">
              <div className="pet-group left">
                <span className="hub-pet-emoji" onClick={() => handlePetClick('mayis')}>🐱</span>
                <span className="hub-paws-mini">🐾🐾</span>
              </div>
              <div className="pet-group right">
                <span className="hub-paws-mini">🐾🐾</span>
                <span className="hub-pet-emoji" onClick={() => handlePetClick('waffle')}>🐶</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default React.memo(FloatingHub);