import React from 'react';
import { Heart, Plus, Image as ImageIcon, ExternalLink } from 'lucide-react';
import useStore from '../../store/useStore';

const IlhamTab = () => {
  const modaring = useStore(state => state.modaring);
  const ilhams = modaring?.ilhamlar || [];

  return (
    <div className="tab-view-content animate-fadeIn">
      <div className="section-header-v2">
        <h3>❤️ İlham Panosu</h3>
        <button className="add-btn-mini"><Plus size={14} /></button>
      </div>

      {ilhams.length === 0 ? (
        <div className="empty-state-card glass">
          <div className="esc-icon">
            <Heart size={40} color="#fb7185" />
          </div>
          <h4>İlham Perisi Yolda!</h4>
          <p>Sana ilham veren görselleri buraya kaydedebilirsin.</p>
          <button className="esc-btn">Görsel Ekle</button>
        </div>
      ) : (
        <div className="ilham-masonry">
          {ilhams.map(ilham => (
            <div key={ilham.id} className="ilham-item glass">
              {ilham.photo ? <img src={ilham.photo} alt={ilham.title} /> : <ImageIcon size={24} />}
              <div className="ilham-overlay">
                <span>{ilham.title}</span>
                <ExternalLink size={14} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IlhamTab;
