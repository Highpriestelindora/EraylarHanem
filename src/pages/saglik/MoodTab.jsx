import React, { useState } from 'react';
import { Send, Heart, User, Briefcase, Users, Activity, Sparkles, HelpCircle } from 'lucide-react';
import useStore from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Mutlu', color: '#fef3c7' },
  { id: 'calm', emoji: '😌', label: 'Huzurlu', color: '#ecfdf5' },
  { id: 'tired', emoji: '😫', label: 'Yorgun', color: '#f8fafc' },
  { id: 'sad', emoji: '😔', label: 'Üzgün', color: '#eff6ff' },
  { id: 'energetic', emoji: '🤩', label: 'Enerjik', color: '#fff7ed' },
  { id: 'sick', emoji: '🤒', label: 'Hasta', color: '#fef2f2' }
];

const KATEGORILER = [
  { id: 'İş', icon: <Briefcase size={14} />, label: 'İş / Kariyer' },
  { id: 'Aile', icon: <Heart size={14} />, label: 'Aile' },
  { id: 'Sosyal', icon: <Users size={14} />, label: 'Sosyal' },
  { id: 'Sağlık', icon: <Activity size={14} />, label: 'Sağlık' },
  { id: 'Genel', icon: <Sparkles size={14} />, label: 'Genel' },
  { id: 'Diğer', icon: <HelpCircle size={14} />, label: 'Diğer' }
];

export default function MoodTab() {
  const { saglik, addMood, currentUser } = useStore();
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedKat, setSelectedKat] = useState('Genel');
  const [note, setNote] = useState('');
  const [selectedUser, setSelectedUser] = useState(currentUser?.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra');

  const handleShare = () => {
    if (!selectedMood) {
      toast.error('Önce bir ruh hali seçmelisin! ✨');
      return;
    }
    addMood(selectedUser, selectedMood, note, selectedKat);
    setSelectedMood(null);
    setSelectedKat('Genel');
    setNote('');
    toast.success('Ruh halin paylaşıldı! 🎭');
  };

  const moods = saglik?.moods || [];

  return (
    <div className="mood-tab animate-fadeIn">
      <div className="mood-input-card glass" style={{ padding: '20px', borderRadius: '24px' }}>
        <div className="section-header" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '900' }}>🎭 Ruh Halini Paylaş</h3>
          <div className="user-toggle-premium">
             <button className={selectedUser === 'gorkem' ? 'active' : ''} onClick={() => setSelectedUser('gorkem')}>🧔</button>
             <button className={selectedUser === 'esra' ? 'active' : ''} onClick={() => setSelectedUser('esra')}>👩‍🦰</button>
          </div>
        </div>

        <div className="mood-grid-premium">
          {MOODS.map(m => (
            <motion.button 
              key={m.id} 
              whileTap={{ scale: 0.9 }}
              className={`mood-btn-v2 ${selectedMood?.id === m.id ? 'active' : ''}`}
              onClick={() => setSelectedMood(m)}
              style={{ '--mood-bg': m.color }}
            >
              <span className="m-emoji">{m.emoji}</span>
              <span className="m-label">{m.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="reason-section" style={{ marginTop: '25px' }}>
          <label style={{ fontSize: '13px', fontWeight: '800', opacity: 0.6, marginBottom: '10px', display: 'block' }}>Neden böyle hissediyorum?</label>
          <div className="reason-grid">
            {KATEGORILER.map(k => (
              <button 
                key={k.id} 
                className={`reason-tag ${selectedKat === k.id ? 'active' : ''}`}
                onClick={() => setSelectedKat(k.id)}
              >
                {k.icon}
                <span>{k.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <textarea 
            placeholder="Bir şeyler eklemek ister misin? (opsiyonel)" 
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            className="premium-input"
            style={{ minHeight: '80px' }}
          />
        </div>

        <button className="submit-btn-premium wellness" onClick={handleShare}>
          <Send size={18} /> Paylaş
        </button>
      </div>

      <div className="mood-history-premium mt-20">
        <div className="section-title-premium">
          <Heart size={18} color="#EC4899" fill="#EC4899" />
          <span>Haftalık Wellness Takibi</span>
        </div>
        
        {moods.length === 0 ? (
          <div className="empty-state-v2">
             <p>Henüz ruh hali paylaşılmamış. Günün ilk paylaşımını yapmaya ne dersin?</p>
          </div>
        ) : (
          <div className="mood-timeline">
            {moods.map((m, idx) => (
              <motion.div 
                key={m.id} 
                className="mood-card-v2 glass"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="mc-left">
                  <div className="mc-emoji-box" style={{ background: m.mood.color }}>{m.mood.emoji}</div>
                  <div className="mc-info">
                    <div className="mc-top">
                       <strong>{m.user === 'gorkem' ? 'Görkem' : 'Esra'}</strong>
                       <span className="mc-kat-tag">{m.kategori}</span>
                    </div>
                    <p>{m.mood.label} hissediyor</p>
                    {m.note && <span className="mc-note">"{m.note}"</span>}
                  </div>
                </div>
                <div className="mc-right">
                  <span className="mc-time">{new Date(m.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
