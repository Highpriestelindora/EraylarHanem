import React, { useState, useMemo } from 'react';
import { Send, Trash2, X, StickyNote } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

export default function SohbetTab() {
  const { mutfak, addKitchenNote, removeNote, currentUser } = useStore();
  const [noteText, setNoteText] = useState('');
  const [noteWriter, setNoteWriter] = useState(currentUser?.name || 'Görkem');
  const [zoomedNote, setZoomedNote] = useState(null);
  
  const notes = mutfak?.sohbet || [];

  // Stable positions using useMemo to avoid re-renders or state loops
  const positions = useMemo(() => {
    const posMap = {};
    notes.forEach((n, idx) => {
      const author = n.w || n.kisi || 'Görkem';
      const isEsra = author.toLowerCase().includes('esra');
      const seed = typeof n.id === 'number' ? n.id : (n.id || "").length;
      posMap[n.id] = {
        top: ((seed % 65) + 12) + "%",
        left: (((seed * 13) % 65) + 12) + "%",
        rotate: ((seed % 10) - 5) + "deg",
        color: isEsra ? '#FFF1F2' : ((idx % 2 === 0) ? '#FEFCE8' : '#F5F3FF'),
        magnetColor: isEsra ? 'radial-gradient(circle at 30% 30%, #F43F5E, #9F1239)' : 'radial-gradient(circle at 30% 30%, #8B5CF6, #5B21B6)'
      };
    });
    return posMap;
  }, [notes]);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addKitchenNote(noteText, noteWriter);
    setNoteText('');
    toast.success('Not buzdolabına yapıştırıldı! 📌');
  };

  return (
    <div className="sohbet-tab-wrapper">
      <div className="fridge-body">
        {/* Stainless Steel Surface */}
        <div className="fridge-surface">
          <div className="surface-sheen" />
          
          <div className="notes-container">
            {notes.map(note => {
              const pos = positions[note.id] || { top: '20%', left: '20%', rotate: '0deg', color: '#fff9c4', magnetColor: 'radial-gradient(circle at 30% 30%, #ef4444, #991b1b)' };
              const text = note.t || note.mesaj || '';
              const writer = note.w || note.kisi || 'Görkem';
              const isEsra = writer.toLowerCase().includes('esra');

              return (
                <div 
                  key={note.id} 
                  className="fridge-magnet-note"
                  style={{ 
                    top: pos.top, 
                    left: pos.left,
                    transform: `rotate(${pos.rotate})`
                  }}
                  onClick={() => setZoomedNote(note)}
                >
                  <div className="note-paper" style={{ backgroundColor: pos.color }}>
                    <div className="magnet-cap" style={{ background: pos.magnetColor }} />
                    <div style={{ fontSize: '10px', fontWeight: 800, color: isEsra ? '#BE123C' : '#6D28D9', marginBottom: '2px' }}>
                      {isEsra ? '👩‍🍳 Esra' : '👨‍💻 Görkem'}
                    </div>
                    <p className="note-text-mini">{text}</p>
                    <div className="note-footer-mini">
                       <span>{note.d || note.tarih ? new Date(note.d || note.tarih).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {notes.length === 0 && (
              <div className="empty-fridge-msg">
                 <StickyNote size={48} opacity={0.2} />
                 <p>Buzdolabı boş, birbirinize bir not bırakmak ister misiniz?</p>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="fridge-controls glass">
          <textarea 
            placeholder={`${(currentUser?.name || 'Görkem').toLowerCase().includes('esra') ? "Görkem'e" : "Esra'ya"} mıknatıslı bir not yapıştır...`} 
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddNote();
              }
            }}
          />
          <button className="post-it-btn" onClick={handleAddNote}>
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {zoomedNote && (
        <div className="note-overlay" onClick={() => setZoomedNote(null)}>
          <div className="zoomed-paper animate-pop" 
               style={{ backgroundColor: positions[zoomedNote.id]?.color || '#fff9c4' }}
               onClick={e => e.stopPropagation()}>
            <div className="magnet-cap-lg" style={{ background: positions[zoomedNote.id]?.magnetColor || 'radial-gradient(circle at 30% 30%, #ef4444, #991b1b)' }} />
            <button className="close-paper" onClick={() => setZoomedNote(null)}><X size={20} /></button>
            
            <div className="paper-body">
              <p>{zoomedNote.t || zoomedNote.mesaj}</p>
              <div className="paper-footer">
                <div className="writer-info">
                  <strong>{zoomedNote.w || zoomedNote.kisi}</strong>
                  <span>{zoomedNote.d || zoomedNote.tarih ? new Date(zoomedNote.d || zoomedNote.tarih).toLocaleString('tr-TR') : ''}</span>
                </div>
                <button className="trash-btn" onClick={() => { removeNote(zoomedNote.id); setZoomedNote(null); toast.success('Not silindi.'); }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sohbet-tab-wrapper {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 10px;
        }

        .fridge-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #cbd5e1;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.1), 0 10px 25px rgba(0,0,0,0.1);
          border: 4px solid #94a3b8;
        }

        .fridge-surface {
          flex: 1;
          position: relative;
          background: linear-gradient(135deg, #e2e8f0 0%, #f8fafc 50%, #cbd5e1 100%);
          overflow: hidden;
        }

        .surface-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.4) 50%, transparent 55%);
          pointer-events: none;
        }

        .notes-container {
          position: absolute;
          inset: 0;
          padding: 20px;
        }

        .fridge-magnet-note {
          position: absolute;
          width: 110px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.15));
        }

        .fridge-magnet-note:hover {
          transform: scale(1.15) !important;
          z-index: 100;
          filter: drop-shadow(4px 8px 12px rgba(0,0,0,0.2));
        }

        .note-paper {
          padding: 15px 10px 10px;
          min-height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 2px;
          position: relative;
        }

        .magnet-cap {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          background: radial-gradient(circle at 30% 30%, #ef4444, #991b1b);
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .note-text-mini {
          font-size: 11px;
          font-weight: 700;
          color: #334155;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 5px 0;
        }

        .note-footer-mini {
          font-size: 9px;
          font-weight: 900;
          text-align: right;
          color: rgba(0,0,0,0.3);
          text-transform: uppercase;
        }

        .empty-fridge-msg {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 15px;
          color: #64748b;
          text-align: center;
          padding: 40px;
        }

        .fridge-controls {
          margin: 15px;
          padding: 12px;
          border-radius: 20px;
          display: flex;
          gap: 12px;
          align-items: center;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.5);
        }

        .fridge-controls textarea {
          flex: 1;
          height: 45px;
          background: transparent;
          border: none;
          outline: none;
          padding: 5px;
          font-weight: 600;
          font-size: 14px;
          resize: none;
          font-family: inherit;
        }

        .post-it-btn {
          width: 45px;
          height: 45px;
          border-radius: 15px;
          border: none;
          background: #475569;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .post-it-btn:active { transform: scale(0.9); }

        /* Detail Modal */
        .note-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(10px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }

        .zoomed-paper {
          width: 100%;
          max-width: 360px;
          padding: 35px 25px 20px;
          border-radius: 4px;
          position: relative;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }

        .magnet-cap-lg {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 35px;
          height: 35px;
          background: radial-gradient(circle at 30% 30%, #ef4444, #991b1b);
          border-radius: 50%;
          box-shadow: 0 5px 15px rgba(0,0,0,0.4);
        }

        .paper-body p {
          font-size: 20px;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.5;
          margin-bottom: 25px;
          min-height: 100px;
        }

        .paper-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 15px;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .writer-info { display: flex; flex-direction: column; }
        .writer-info strong { font-size: 16px; color: #000; }
        .writer-info span { font-size: 12px; color: rgba(0,0,0,0.4); }

        .trash-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: none;
          background: #fee2e2;
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .close-paper {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.05);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
