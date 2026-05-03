import React from 'react';
import { Package, Plus, ExternalLink, Globe, Phone } from 'lucide-react';
import useStore from '../../store/useStore';

const TedarikTab = () => {
  const modaring = useStore(state => state.modaring);
  const suppliers = modaring?.tedarik || [];

  const initialSuppliers = [
    { id: 1, name: 'Xuping Jewelry', link: 'https://www.xuping.com.cn/', category: 'Vip Seri / Çelik', contact: 'Zekeriya Bey' },
    { id: 2, name: 'İthal Takı Dünyası', link: '#', category: 'Bijuteri', contact: 'Ayşe Hanım' }
  ];

  const list = suppliers.length > 0 ? suppliers : initialSuppliers;

  return (
    <div className="tab-view-content animate-fadeIn">
      <div className="section-header-v2">
        <h3>📦 Tedarikçiler & Toptan</h3>
        <button className="add-btn-mini"><Plus size={14} /></button>
      </div>

      <div className="suppliers-list">
        {list.map(sup => (
          <div key={sup.id} className="supplier-card-premium glass">
            <div className="scp-icon">
              <Globe size={24} color="#fb7185" />
            </div>
            <div className="scp-info">
              <strong>{sup.name}</strong>
              <small>{sup.category}</small>
              {sup.contact && <div className="scp-contact"><Phone size={10} /> {sup.contact}</div>}
            </div>
            <a href={sup.link} target="_blank" rel="noreferrer" className="scp-link">
              <ExternalLink size={18} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TedarikTab;
