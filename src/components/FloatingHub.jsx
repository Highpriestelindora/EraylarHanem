import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Plus, X, Send, Trash2, Refrigerator, BadgeDollarSign, Archive } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { PET_QUOTES } from '../constants/petQuotes';
import toast from 'react-hot-toast';
import './FloatingHub.css';

function FloatingHub() {
  const navigate = useNavigate();
  const constraintsRef = useRef(null);
  
  // Seçici abonelikler (Sadece değişen kısım render tetikler)
  const mutfak = useStore(state => state.mutfak);
  const currentUser = useStore(state => state.currentUser);
  const ui = useStore(state => state.ui);
  
  const addKitchenNote = useStore(state => state.addKitchenNote);
  const archiveNote = useStore(state => state.archiveNote);
  const updateNotePosition = useStore(state => state.updateNotePosition);
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'chat' or 'expense'
  const [fridgeView, setFridgeView] = useState('board'); // 'board' or 'history'
  
  const [focusedNote, setFocusedNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const notes = mutfak?.sohbet || [];

  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Diğer');
  const [expCard, setExpCard] = useState(''); // '' means cash
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
    addKitchenNote(noteText, currentUser?.name || 'Görkem');
    setNoteText('');
  };

  const handleAddExpense = async () => {
    if (!expTitle || !expAmount) return toast.error('Lütfen tutar ve açıklama girin');
    
    // Hızlı ödeme doğrudan Supabase finans_harcamalar'a işlenir (addHarcama)
    await useStore.getState().addHarcama({
      baslik: expTitle,
      tutar: Number(expAmount),
      kategori: expCategory,
      kart_id: expCard || null,
      odenme_turu: expCard ? 'kart' : 'nakit',
      kayit_eden: currentUser?.name || 'Sistem',
      kaynak: 'Hızlı Ödeme'
    });

    setExpTitle('');
    setExpAmount('');
    setExpCard('');
    setActiveModal(null);
    setIsOpen(false);
    toast.success('Hızlı harcama sisteme işlendi! 💸');
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
    <>
      {(isOpen || activeModal) && (
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
                <Refrigerator size={18} />
                <h3>Buzdolabı Sohbeti</h3>
              </div>
              
              <div className="fridge-view-toggle">
                <button 
                  className={fridgeView === 'board' ? 'active' : ''} 
                  onClick={() => setFridgeView('board')}
                >
                  📌 Kapak
                </button>
                <button 
                  className={fridgeView === 'history' ? 'active' : ''} 
                  onClick={() => setFridgeView('history')}
                >
                  📜 Geçmiş
                </button>
              </div>

              <button className="close-immersive" onClick={() => setActiveModal(null)}><X size={24} /></button>
            </header>

            {fridgeView === 'board' ? (
              <div className="immersive-notes-board" ref={constraintsRef}>
                {notes.map((note, idx) => {
                  if (!note) return null;
                  const posColor = (idx % 3 === 0) ? '#fff9c4' : (idx % 3 === 1 ? '#e3f2fd' : '#fce7f3');
                  const isFocused = focusedNote === note.id;
                  
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
                        scale: isFocused ? 1.4 : 1,
                        rotate: isFocused ? 0 : (idx % 10 - 5) * 2,
                        x: isFocused ? '-50%' : 0,
                        y: isFocused ? '-50%' : 0
                      }}
                      className={`immersive-note-wrap ${isFocused ? 'focused' : ''}`}
                      onClick={() => setFocusedNote(isFocused ? null : note.id)}
                      style={{ 
                        backgroundColor: posColor,
                        zIndex: isFocused ? 2000 : 10 + idx,
                        position: isFocused ? 'fixed' : 'absolute',
                        cursor: isFocused ? 'zoom-out' : 'grab',
                        boxShadow: isFocused ? '0 25px 60px rgba(0,0,0,0.4)' : '3px 15px 30px rgba(0,0,0,0.15)'
                      }}
                      whileDrag={{ scale: 1.1, zIndex: 1000, rotate: 0 }}
                      onDragEnd={(event, info) => {
                        if (!constraintsRef.current || isFocused) return;
                        const board = constraintsRef.current.getBoundingClientRect();
                        const newX = ((info.point.x - board.left) / board.width) * 100;
                        const newY = ((info.point.y - board.top) / board.height) * 100;
                        updateNotePosition(note.id, Math.max(5, Math.min(85, newX)), Math.max(5, Math.min(85, newY)));
                      }}
                    >
                      <div className="immersive-magnet-cap" />
                      <p className="note-text-premium" style={{ fontSize: isFocused ? '18px' : '15px' }}>{note.t}</p>
                      <div className="note-footer-premium">
                        <span className="writer-tag">{note.w}</span>
                        <button className="delete-btn-mini" onClick={(e) => { e.stopPropagation(); archiveNote(note.id); }} title="Arşivle"><Archive size={14} /></button>
                      </div>
                    </motion.div>
                  );
                })}

                {notes.length === 0 && (
                  <div className="empty-immersive-msg">
                    <div className="empty-icon-wrap">📝</div>
                    <p>Buzdolabı kapağı tertemiz!<br/>Bir not bırakmak ister misin?</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="immersive-history-list">
                {(mutfak.history || []).length > 0 ? (
                  mutfak.history.map((log) => (
                    <div key={log.id} className={`history-item ${log.w.toLowerCase()}`}>
                      <div className="history-bubble">
                        <p>{log.t}</p>
                        <div className="history-meta">
                          <span className="h-writer">{log.w}</span>
                          <span className="h-date">{new Date(log.d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(log.d).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-history">Henüz geçmiş kaydı yok. ✨</div>
                )}
              </div>
            )}

            <div className="immersive-input-wrap">
              <div className="input-glass-premium">
                <input 
                  value={noteText} 
                  onChange={e => setNoteText(e.target.value)} 
                  placeholder="Mıknatıslı bir not yapıştır..."
                  onKeyPress={e => e.key === 'Enter' && handleAddNote()}
                />
                <button onClick={handleAddNote} className="immersive-send-btn">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'expense' && (
        <div className="hub-modal expense-modal animate-slideUp">
          <div className="hub-modal-header">
            <h4>💸 Hızlı Harcama</h4>
            <button onClick={() => setActiveModal(null)}><X size={20} /></button>
          </div>
          <div className="hub-expense-body">
            <input 
              className="hub-input amount" 
              type="number" 
              placeholder="0₺" 
              value={expAmount}
              onChange={e => setExpAmount(e.target.value)}
              autoFocus
            />
            <input 
              className="hub-input title" 
              placeholder="Ne harcaması?" 
              value={expTitle}
              onChange={e => setExpTitle(e.target.value)}
            />
            
            <div className="hub-category-grid">
              {categories.map(c => (
                <button 
                  key={c.id} 
                  className={`hub-cat-btn ${expCategory === c.label ? 'active' : ''}`}
                  onClick={() => setExpCategory(c.label)}
                >
                  <span className="cat-icon">{c.icon}</span>
                  <span className="cat-label">{c.label}</span>
                </button>
              ))}
            </div>

            <div className="hub-payer-select">
              <select className="hub-input" style={{ width: '100%', marginBottom: '10px' }} value={expCard} onChange={e => setExpCard(e.target.value)}>
                <option value="">💵 Nakit (Elden / Kasa)</option>
                {kartlar.map(k => (
                  <option key={k.id} value={k.id}>💳 {k.name} ({k.owner === 'gorkem' ? 'Görkem' : 'Esra'})</option>
                ))}
              </select>
            </div>

            <button className="hub-submit-btn" onClick={handleAddExpense}>Sisteme İşle</button>
          </div>
        </div>
      )}

      <div className="floating-hub-container">
        <div className={`hub-options ${isOpen ? 'show' : ''}`}>
          <button className="hub-option-btn chat" onClick={() => { setActiveModal('chat'); setIsOpen(false); }}>
            <Refrigerator size={26} color="#3b82f6" />
            <span className="tiny-label" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Buzdolabı<br/>Sohbeti</span>
          </button>
          <button className="hub-option-btn expense" onClick={() => { setActiveModal('expense'); setIsOpen(false); }}>
            <BadgeDollarSign size={26} color="#10b981" />
            <span className="tiny-label" style={{ color: '#10b981', fontWeight: 'bold' }}>Hızlı<br/>Harcama</span>
          </button>
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
    </>
  );
}

export default React.memo(FloatingHub);