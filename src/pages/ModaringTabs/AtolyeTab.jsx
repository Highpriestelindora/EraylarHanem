import React from 'react';
import { Sparkles, Plus, Palette, ArrowRight } from 'lucide-react';
import useStore from '../../store/useStore';

const AtolyeTab = () => {
  const modaring = useStore(state => state.modaring);
  const projects = modaring?.atolye || [];

  return (
    <div className="tab-view-content animate-fadeIn">
      <div className="section-header-v2">
        <h3>✨ Tasarım Atölyesi</h3>
        <button className="add-btn-mini"><Plus size={14} /></button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state-card glass">
          <div className="esc-icon">
            <Palette size={40} color="#fb7185" />
          </div>
          <h4>Henüz Tasarım Yok</h4>
          <p>Yeni bir tasarım projesi başlatmak için "+" butonuna dokun.</p>
          <button className="esc-btn">Yeni Proje Başlat</button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card-premium glass">
              <div className="pc-image-placeholder">
                <Sparkles size={24} opacity={0.3} />
              </div>
              <div className="pc-info">
                <strong>{project.title}</strong>
                <span>{project.status}</span>
              </div>
              <ArrowRight size={18} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AtolyeTab;
