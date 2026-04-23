import React, { useState } from 'react';
import { Send, Heart, User } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Mutlu' },
  { id: 'calm', emoji: '😌', label: 'Huzurlu' },
  { id: 'tired', emoji: '😫', label: 'Yorgun' },
  { id: 'sad', emoji: '😔', label: 'Üzgün' },
  { id: 'energetic', emoji: '🤩', label: 'Enerjik' },
  { id: 'sick', emoji: '🤒', label: 'Hasta' }
];

export default function MoodTab() {
  const { saglik, addMood, currentUser } = useStore();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [selectedUser, setSelectedUser] = useState(currentUser?.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra');

  const handleShare = () => {
    if (!selectedMood) {
      toast.error('Önce bir ruh hali seçmelisin! ✨');
      return;
    }
    addMood(selectedUser, selectedMood, note);
    setSelectedMood(null);
    setNote('');
    toast.success('Ruh halin paylaşıldı! 🎭');
  };

  const moods = saglik?.moods || [];

  return (
    <div className="mood-tab animate-fadeIn">
      <div className="mood-input-card">
        <div className="section-header">
          <h3>Nasıl Hissediyorsun?</h3>
          <div className="user-toggle">
             <button className={selectedUser === 'gorkem' ? 'active' : ''} onClick={() => setSelectedUser('gorkem')}>👨 Görkem</button>
             <button className={selectedUser === 'esra' ? 'active' : ''} onClick={() => setSelectedUser('esra')}>👩 Esra</button>
          </div>
        </div>

        <div className="mood-grid">
          {MOODS.map(m => (
            <button 
              key={m.id} 
              className={`mood-btn ${selectedMood?.id === m.id ? 'active' : ''}`}
              onClick={() => setSelectedMood(m)}
            >
              <span className="m-emoji">{m.emoji}</span>
              <span className="m-label">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="form-group">
          <textarea 
            placeholder="Bir şeyler eklemek ister misin? (opsiyonel)" 
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
          />
        </div>

        <button className="btn-action" onClick={handleShare} style={{ background: '#FDF2F8', border: '2px dashed #EC4899', color: '#BE185D' }}>
          <Send size={18} /> Paylaş
        </button>
      </div>

      <div className="mood-history mt-20">
        <div className="section-title">
          <Heart size={18} color="#EC4899" />
          <span>Son Paylaşımlar</span>
        </div>
        {moods.length === 0 ? (
          <div className="empty-state glass">
             <p>Henüz ruh hali paylaşılmamış.</p>
          </div>
        ) : (
          moods.map(m => (
            <div key={m.id} className="mood-item animate-pop">
              <div className="mood-emoji">{m.mood.emoji}</div>
              <div className="mood-info">
                <strong>{m.user === 'gorkem' ? 'Görkem' : 'Esra'} {m.mood.label} hissediyor</strong>
                {m.note && <p>"{m.note}"</p>}
              </div>
              <div className="mood-date">
                {new Date(m.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
