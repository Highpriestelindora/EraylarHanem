import React, { useState, useMemo } from 'react';
import { Send, Trash2, X, StickyNote } from 'lucide-react';
import useStore from '../../store/useStore';

export default function SohbetTab() {
  const { mutfak, addKitchenNote, removeNote, currentUser } = useStore();
  const [noteText, setNoteText] = useState('');
  const [zoomedNote, setZoomedNote] = useState(null);
  
  const notes = mutfak?.sohbet || [];

  // Stable positions using useMemo to avoid re-renders or state loops
  const positions = useMemo(() => {
    const posMap = {};
    notes.forEach(n => {
      // Use id as seed for "random" but stable position
      const seed = typeof n.id === 'number' ? n.id : (n.id || "").length;
      posMap[n.id] = {
        top: ((seed % 70) + 10) + "%",
        left: (((seed * 13) % 70) + 10) + "%",
        rotate: ((seed % 12) - 6) + "deg",
        color: (seed % 3 === 0) ? '#fff9c4' : (seed % 3 === 1 ? '#e3f2fd' : '#fce7f3')
      };
    });
    return posMap;
  }, [notes]);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addKitchenNote(noteText, currentUser?.name || 'Görkem');
    setNoteText('');
  };

  return (
    <div className="sohbet-tab-wrapper">
      <div className="fridge-body">
        {/* Stainless Steel Surface */}
        <div className="fridge-surface">
          <div className="surface-sheen" />
          
          <div className="notes-container">
            {notes.map(note => {
              const pos = positions[note.id] || { top: '20%', left: '20%', rotate: '0deg', color: '#fff9c4' };
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
                    <div className="magnet-cap" />
                    <p className="note-text-mini">{note.t}</p>
                    <div className="note-footer-mini">
                       <span>{note.w}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {notes.length === 0 && (
              <div className="empty-fridge-msg">
                 <StickyNote size={48} opacity={0.2} />
                 <p>Buzdolabı boş, bir not bırakmak ister misin?</p>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="fridge-controls glass">
          <textarea 
            placeholder="Mıknatıslı bir not yapıştır..." 
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
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
            <div className="magnet-cap-lg" />
            <button className="close-paper" onClick={() => setZoomedNote(null)}><X size={20} /></button>
            
            <div className="paper-body">
              <p>{zoomedNote.t}</p>
              <div className="paper-footer">
                <div className="writer-info">
                  <strong>{zoomedNote.w}</strong>
                  <span>{zoomedNote.d ? new Date(zoomedNote.d).toLocaleDateString('tr-TR') : ''}</span>
                </div>
                <button className="trash-btn" onClick={() => { removeNote(zoomedNote.id); setZoomedNote(null); }}>
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
