import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Plus, X, Send, Trash2, Refrigerator, BadgeDollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import './FloatingHub.css';

export default function FloatingHub() {
  const navigate = useNavigate();
  const constraintsRef = useRef(null);
  const { mutfak, addKitchenNote, removeNote, currentUser, addExpense, updateNotePosition, ui } = useStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'chat' or 'expense'
  
  const [noteText, setNoteText] = useState('');
  const notes = mutfak?.sohbet || [];

  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Diğer');
  const [expPayer, setExpPayer] = useState(currentUser?.name || 'Görkem');

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

  const handleAddExpense = () => {
    if (!expTitle || !expAmount) return toast.error('Lütfen tutar ve açıklama girin');
    addExpense({
      title: expTitle,
      amount: Number(expAmount),
      category: expCategory,
      payer: expPayer.toLowerCase()
    });
    setExpTitle('');
    setExpAmount('');
    setActiveModal(null);
    setIsOpen(false);
    toast.success('Harcama kaydedildi! 💸');
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
          <div className="immersive-fridge">
            <img src="https://images.unsplash.com/photo-1571175432230-01c24844c021?auto=format&fit=crop&q=80&w=1000" className="fridge-bg" alt="Fridge" />
            <div className="immersive-overlay" />
            
            <header className="immersive-header">
              <h3>📝 Buzdolabı Notları</h3>
              <button className="close-immersive" onClick={() => setActiveModal(null)}><X size={24} /></button>
            </header>

            <div className="immersive-notes-board" ref={constraintsRef}>
              {notes.map((note, idx) => (
                <motion.div 
                  key={note.id} 
                  drag
                  dragConstraints={constraintsRef}
                  dragElastic={0.1}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                  className="immersive-note-wrap"
                  style={{ 
                    background: note.w === 'Esra' ? '#FFEBEE' : '#E3F2FD',
                    left: (note.x || (10 + (idx % 3) * 25)) + '%',
                    top: (note.y || (20 + (idx % 5) * 15)) + '%',
                    transform: `rotate(${Math.sin(idx) * 10}deg)`,
                    zIndex: 5 + idx
                  }}
                  whileDrag={{ scale: 1.1, zIndex: 100, rotate: 0 }}
                  onDragEnd={(event, info) => {
                    if (!constraintsRef.current) return;
                    const board = constraintsRef.current.getBoundingClientRect();
                    const newX = ((info.point.x - board.left) / board.width) * 100;
                    const newY = ((info.point.y - board.top) / board.height) * 100;
                    updateNotePosition(note.id, Math.max(5, Math.min(85, newX)), Math.max(10, Math.min(80, newY)));
                  }}
                >
                  <div className="immersive-magnet" />
                  <p>{note.t}</p>
                  <div className="note-footer">
                    <span>{note.w}</span>
                    <button onClick={() => removeNote(note.id)}><Trash2 size={12} /></button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="immersive-input-area">
              <div className="input-glass">
                <input 
                  value={noteText} 
                  onChange={e => setNoteText(e.target.value)} 
                  placeholder="Buzdolabına bir not bırak..."
                  onKeyPress={e => e.key === 'Enter' && handleAddNote()}
                />
                <button onClick={handleAddNote} className="send-btn"><Send size={20} /></button>
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
              <button className={expPayer === 'gorkem' ? 'active' : ''} onClick={() => setExpPayer('gorkem')}>👨 Görkem</button>
              <button className={expPayer === 'esra' ? 'active' : ''} onClick={() => setExpPayer('esra')}>👩 Esra</button>
              <button className={expPayer === 'ortak' ? 'active' : ''} onClick={() => setExpPayer('ortak')}>🏡 Ortak</button>
            </div>

            <button className="hub-submit-btn" onClick={handleAddExpense}>Kaydet</button>
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

        <div className="hub-main-wrapper">
          <div className="hub-semi-circle" />
          <div className="climbing-pet p1">🐱</div>
          <div className="climbing-pet p2">🐶</div>
          <div className="climbing-pet p3">🐾</div>
          <div className="climbing-pet p4">🐾</div>

          <button className="hub-btn home" onClick={() => { navigate('/'); setIsOpen(false); }}>
            <Home size={24} />
          </button>
          <button className={`hub-btn toggle ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <div className="plus-icon">＋</div>}
          </button>
        </div>
      </div>
    </>
  );
}
