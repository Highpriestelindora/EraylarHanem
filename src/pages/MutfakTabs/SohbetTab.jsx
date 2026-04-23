import React, { useState, useEffect } from 'react';
import { Send, Trash2, X, Plus, Maximize2 } from 'lucide-react';
import useStore from '../../store/useStore';

const FRIDGE_IMG = "https://images.unsplash.com/photo-1571175432230-01c24844c021?auto=format&fit=crop&q=80&w=1000"; // Reliable Modern Refrigerator

export default function SohbetTab() {
  const { mutfak, addKitchenNote, removeNote, currentUser } = useStore();
  const [noteText, setNoteText] = useState('');
  const [zoomedNote, setZoomedNote] = useState(null);
  
  const notes = mutfak.sohbet || [];

  // Generate random positions for notes if not present
  const [positions, setPositions] = useState({});

  useEffect(() => {
    const newPos = { ...positions };
    notes.forEach(n => {
      if (!newPos[n.id]) {
        newPos[n.id] = {
          top: Math.floor(Math.random() * 50) + 10 + "%",
          left: Math.floor(Math.random() * 60) + 10 + "%",
          rotate: (Math.random() * 10 - 5) + "deg"
        };
      }
    });
    setPositions(newPos);
  }, [notes.length]);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addKitchenNote(noteText, currentUser?.name || 'Görkem');
    setNoteText('');
  };

  const getNoteColor = (writer) => {
    if (writer === 'Esra') return '#FFEBEE'; 
    if (writer === 'Görkem') return '#E3F2FD';
    return '#FFF9C4';
  };

  return (
    <div className="sohbet-container">
      <div className="fridge-wrapper glass">
        {/* The Refrigerator Background */}
        <div className="fridge-surface" style={{ background: '#f8fafc' }}>
          <img src={FRIDGE_IMG} alt="Buzdolabı" className="fridge-bg" onError={(e) => e.target.style.display = 'none'} />
          
          {/* Notes Area */}
          <div className="notes-board">
            {notes.map(note => (
              <div 
                key={note.id} 
                className="fridge-note-wrap"
                style={{ 
                  top: positions[note.id]?.top || '20%', 
                  left: positions[note.id]?.left || '20%',
                  transform: positions[note.id]?.rotate || 'rotate(0deg)'
                }}
              >
                <div 
                  className="fridge-note" 
                  style={{ background: getNoteColor(note.w) }}
                  onClick={() => setZoomedNote(note)}
                >
                  <div className="magnet" />
                  <p className="note-preview">{note.t}</p>
                  <span className="note-author">{note.w}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area (Bottom) */}
        <div className="fridge-input glass">
          <textarea 
            placeholder="Mıknatıslı bir not bırak..." 
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <button className="add-note-btn" onClick={handleAddNote}>
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Zoomed Note Modal */}
      {zoomedNote && (
        <div className="note-zoom-overlay" onClick={() => setZoomedNote(null)}>
          <div className="zoomed-note-card animate-pop" 
               style={{ background: getNoteColor(zoomedNote.w) }}
               onClick={e => e.stopPropagation()}>
            <button className="close-zoom" onClick={() => setZoomedNote(null)}><X size={20} /></button>
            
            <div className="zoomed-content">
              <div className="magnet-lg" />
              <p>{zoomedNote.t}</p>
              <div className="zoomed-footer">
                <div className="meta">
                  <strong>{zoomedNote.w}</strong>
                  <span>{new Date(zoomedNote.d).toLocaleDateString('tr-TR')}</span>
                </div>
                <button className="delete-note-btn" onClick={() => { removeNote(zoomedNote.id); setZoomedNote(null); }}>
                  <Trash2 size={18} /> Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sohbet-container { height: 100%; display: flex; flex-direction: column; }
        
        .fridge-wrapper { 
          flex: 1; 
          position: relative; 
          border-radius: 32px; 
          overflow: hidden; 
          display: flex; 
          flex-direction: column;
          background: #f1f5f9;
        }

        .fridge-surface { 
          flex: 1; 
          position: relative; 
          overflow: hidden;
          cursor: crosshair;
        }

        .fridge-bg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
          filter: grayscale(0.2) brightness(1.1);
        }

        .notes-board {
          position: absolute;
          inset: 0;
          z-index: 2;
        }

        .fridge-note-wrap {
          position: absolute;
          width: 100px;
          height: 100px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .fridge-note-wrap:hover {
          z-index: 10;
          transform: scale(1.1) !important;
        }

        .fridge-note {
          width: 100%;
          height: 100%;
          padding: 15px 10px 10px;
          box-shadow: 2px 4px 10px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          border-radius: 2px;
        }

        .magnet {
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 16px;
          background: #333;
          border-radius: 50%;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.3);
        }

        .note-preview {
          font-size: 10px;
          font-weight: 700;
          color: #334155;
          line-height: 1.2;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }

        .note-author {
          font-size: 8px;
          font-weight: 900;
          text-align: right;
          color: rgba(0,0,0,0.4);
          text-transform: uppercase;
        }

        .fridge-input {
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: center;
          background: rgba(255,255,255,0.9);
          border-top: 1px solid var(--brd);
        }

        .fridge-input textarea {
          flex: 1;
          height: 50px;
          background: transparent;
          border: none;
          padding: 8px;
          font-weight: 600;
          font-size: 14px;
          resize: none;
          font-family: inherit;
        }

        .add-note-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: var(--mutfak);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
          transition: all 0.2s;
        }

        .add-note-btn:active { transform: scale(0.9); }

        /* Zoom Modal */
        .note-zoom-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .zoomed-note-card {
          width: 100%;
          max-width: 400px;
          padding: 40px 30px 30px;
          border-radius: 4px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          position: relative;
        }

        .magnet-lg {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 32px;
          background: #222;
          border-radius: 50%;
          box-shadow: inset 0 4px 8px rgba(255,255,255,0.2);
        }

        .zoomed-note-card p {
          font-size: 20px;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.5;
          margin-bottom: 30px;
          min-height: 100px;
        }

        .zoomed-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid rgba(0,0,0,0.1);
          padding-top: 20px;
        }

        .zoomed-footer .meta { display: flex; flex-direction: column; }
        .zoomed-footer .meta strong { font-size: 16px; color: #000; }
        .zoomed-footer .meta span { font-size: 12px; color: rgba(0,0,0,0.5); }

        .delete-note-btn {
          padding: 8px 16px;
          border-radius: 12px;
          border: none;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          font-weight: 800;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .close-zoom {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0,0,0,0.05);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
