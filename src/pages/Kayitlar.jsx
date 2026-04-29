
import React, { useState } from 'react';
import { 
  History, Archive, ChevronRight, Wrench, 
  ShoppingCart, DollarSign, Heart, Search, 
  Filter, Calendar, User, Clock, Trash2, ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import './Kayitlar.css';

export default function Kayitlar() {
  const navigate = useNavigate();
  const { ev, mutfak, pet, finans, users, deleteOnarimItem, deleteAlisverisItem, deleteVaccineHistory } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Ev Bakımı Arşivi
  const archivedOnarim = (ev.onarimListesi || [])
    .filter(item => item.isArchived)
    .map(item => ({
      ...item,
      category: 'Ev Bakımı',
      icon: <Wrench size={18} />,
      title: item.task,
      date: item.clearedAt || item.completedAt || item.createdAt,
      type: 'maintenance',
      onDelete: () => deleteOnarimItem(item.id)
    }));

  // 2. Alışveriş Geçmişi (Tamamlananlar)
  const shoppingLists = ['gorkem', 'esra', 'ev'];
  const archivedAlisveris = [];
  shoppingLists.forEach(listKey => {
    (mutfak.alisveris?.[listKey] || []).filter(i => i.done).forEach(item => {
      archivedAlisveris.push({
        ...item,
        category: 'Alışveriş',
        icon: <ShoppingCart size={18} />,
        title: `${item.nm} (Alındı)`,
        date: item.doneDate || item.dt,
        type: 'shopping',
        listKey,
        onDelete: () => deleteAlisverisItem(item.id, listKey)
      });
    });
  });

  // 3. Pet Aşı Geçmişi
  const archivedPet = [];
  Object.entries(pet.vaccines || {}).forEach(([petName, vaccines]) => {
    vaccines.forEach(v => {
      (v.h || []).forEach(hDate => {
        // hDate is DD.MM.YYYY string, convert to ISO for sorting
        const [d, m, y] = hDate.split('.');
        const isoDate = `${y}-${m}-${d}`;
        archivedPet.push({
          id: `${petName}-${v.n}-${hDate}`,
          category: 'Pet Sağlık',
          icon: <ShieldCheck size={18} />,
          title: `${petName.charAt(0).toUpperCase() + petName.slice(1)}: ${v.n} Aşısı`,
          date: isoDate,
          type: 'pet',
          petName,
          vaccineName: v.n,
          originalDate: hDate,
          onDelete: () => deleteVaccineHistory(petName, v.n, hDate)
        });
      });
    });
  });

  // Combine and sort
  const allRecords = [...archivedOnarim, ...archivedAlisveris, ...archivedPet]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredRecords = allRecords.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'maintenance' && item.type === 'maintenance') ||
                      (activeTab === 'shopping' && item.type === 'shopping') ||
                      (activeTab === 'pet' && item.type === 'pet');
    return matchesSearch && matchesTab;
  });

  const categories = [
    { id: 'all', label: 'Tümü', icon: <Archive size={16} /> },
    { id: 'maintenance', label: 'Ev Bakımı', icon: <Wrench size={16} /> },
    { id: 'shopping', label: 'Alışveriş', icon: <ShoppingCart size={16} /> },
    { id: 'pet', label: 'Pet Sağlık', icon: <Heart size={16} /> }
  ];

  return (
    <AnimatedPage className="kayitlar-container">
      <header className="kayitlar-header glass">
        <div className="kh-top">
          <button className="back-btn" onClick={() => navigate('/ayarlar')}>
            <History size={20} />
          </button>
          <div className="kh-titles">
            <h1>Sistem Kayıtları</h1>
            <p>Arşivlenmiş tüm veriler ve geçmiş işlemler</p>
          </div>
        </div>

        <div className="kh-filters">
          <div className="search-bar-v2">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Kayıtlarda ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="tabs-scroll-v2">
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`tab-btn-v2 ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="records-list">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((item, idx) => {
            const userKey = item.user?.toLowerCase() || item.createdBy || item.completedBy;
            const userData = users[userKey] || { name: item.user || 'Sistem', emoji: '⚙️' };
            
            return (
              <div key={item.id || idx} className="record-card glass animate-fadeIn" style={{ animationDelay: `${idx * 0.05}s` }}>
                <button 
                  className="rc-delete-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm('Bu kaydı arşivden tamamen silmek istiyor musunuz?')) {
                      item.onDelete();
                    }
                  }}
                >
                  <Trash2 size={14} />
                </button>
                <div className="rc-icon" style={{ background: getCatColor(item.category) }}>
                  {item.icon}
                </div>
                <div className="rc-content">
                  <div className="rc-header">
                    <span className="rc-cat">{item.category}</span>
                    <span className="rc-date">
                      <Calendar size={10} /> {new Date(item.date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <strong className="rc-title">{item.title}</strong>
                  <div className="rc-footer">
                    <div className="rc-user">
                      <span>{userData.emoji}</span>
                      <small>{userData.name.split(' ')[0]}</small>
                    </div>
                    <div className="rc-time">
                      <Clock size={10} />
                      <small>{new Date(item.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</small>
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} className="rc-chevron" />
              </div>
            );
          })
        ) : (
          <div className="empty-records">
            <Archive size={48} opacity={0.1} />
            <p>Aranılan kriterlere uygun kayıt bulunamadı.</p>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}

function getCatColor(cat) {
  switch(cat) {
    case 'Ev Bakımı': return '#f5f3ff';
    case 'Alışveriş': return '#ecfdf5';
    case 'Pet Sağlık': return '#fff1f2';
    default: return '#f8fafc';
  }
}
