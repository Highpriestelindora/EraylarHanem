import React, { useState, useEffect, useRef } from 'react';
import Portal from './Portal';
import { X, MapPin, Navigation, Home, Building, ExternalLink, Plus, Save, Trash2, Edit2, Map as MapIcon } from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import './LocationModal.css';

const LocationModal = ({ isOpen, onClose, locations }) => {
  const { updateLocationSettings, addLocation, updateLocation, deleteLocation } = useStore();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, type: 'other', label: '', address: '', lat: null, lng: null });
  const [view, setView] = useState('list'); // 'list' or 'form'

  const { home, work, savedLocations = [] } = locations || {};

  useEffect(() => {
    if (isOpen && !mapInstance.current) {
      const timer = setTimeout(() => initMap(), 100);
      return () => clearTimeout(timer);
    }
    
    if (isOpen && mapInstance.current) {
       updateMarkers();
    }

    return () => {
      if (!isOpen && mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isOpen, locations, isEditing, formData.lat, formData.lng]);

  const initMap = () => {
    if (!window.L || !mapRef.current) return;

    const defaultCenter = [36.8841, 30.7056];
    const center = home?.lat && home?.lng ? [home.lat, home.lng] : defaultCenter;

    mapInstance.current = window.L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(center, 13);

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapInstance.current);

    window.L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

    updateMarkers();
  };

  // Re-bind click listener to avoid closure issues
  useEffect(() => {
    if (!mapInstance.current) return;

    const onClick = (e) => {
      if (isEditing) {
        setFormData(prev => ({ ...prev, lat: e.latlng.lat, lng: e.latlng.lng }));
      }
    };

    mapInstance.current.on('click', onClick);
    return () => {
      if (mapInstance.current) mapInstance.current.off('click', onClick);
    };
  }, [isEditing]);

  const updateMarkers = () => {
    if (!mapInstance.current || !window.L) return;

    // Clear old markers
    markersRef.current.forEach(m => mapInstance.current.removeLayer(m));
    markersRef.current = [];

    const allLocs = [
      { ...home, type: 'home', icon: '🏠' },
      { ...work, type: 'work', icon: '🏢' },
      ...(savedLocations || []).map(l => ({ ...l, type: 'other' }))
    ];

    const bounds = [];

    allLocs.forEach(loc => {
      if (loc?.lat && loc?.lng) {
        const customIcon = window.L.divIcon({
          html: `<div class="map-marker-pin ${loc.type === 'home' ? 'home' : (loc.type === 'work' ? 'work' : 'other')}">${loc.icon || '📍'}</div>`,
          className: 'custom-div-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });

        const marker = window.L.marker([loc.lat, loc.lng], { icon: customIcon })
          .addTo(mapInstance.current)
          .bindPopup(`<b>${loc.label || (loc.type === 'home' ? 'Ev' : 'İş')}</b><br>${loc.address || ''}`);
        
        markersRef.current.push(marker);
        bounds.push([loc.lat, loc.lng]);
      }
    });

    // Add temp marker if editing
    if (isEditing && formData.lat && formData.lng) {
      const tempIcon = window.L.divIcon({
        html: `<div class="map-marker-pin temp">❓</div>`,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });
      const tempMarker = window.L.marker([formData.lat, formData.lng], { icon: tempIcon }).addTo(mapInstance.current);
      markersRef.current.push(tempMarker);
    }

    if (bounds.length > 0 && !isEditing) {
      mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  };

  const handleSave = () => {
    if (!formData.lat || !formData.lng) return toast.error('Lütfen haritadan bir nokta seçin!');
    if (!formData.label) return toast.error('Lütfen bir isim verin!');

    if (formData.type === 'home' || formData.type === 'work') {
      updateLocationSettings(formData.type, { 
        lat: formData.lat, 
        lng: formData.lng, 
        label: formData.label, 
        address: formData.address 
      });
    } else {
      if (formData.id) {
        updateLocation(formData.id, { 
          lat: formData.lat, 
          lng: formData.lng, 
          label: formData.label, 
          address: formData.address 
        });
      } else {
        addLocation({ 
          lat: formData.lat, 
          lng: formData.lng, 
          label: formData.label, 
          address: formData.address,
          type: 'other',
          icon: '📍'
        });
      }
    }

    setIsEditing(false);
    setView('list');
    setFormData({ id: null, type: 'other', label: '', address: '', lat: null, lng: null });
  };

  const handleDirections = (loc) => {
    if (!loc?.lat || !loc?.lng) return;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="location-modal-overlay">
        <div className="location-modal-container animate-slideUp">
          <div className="location-modal-header">
            <div className="lmh-info">
              <h3>{isEditing ? 'Konum Belirle' : 'Konum Yönetimi'}</h3>
              <p>{isEditing ? 'Haritaya tıklayarak iğneyi yerleştirin' : 'Kayıtlı adreslerinizi yönetin'}</p>
            </div>
            <button className="lmh-close" onClick={onClose}><X size={20} /></button>
          </div>

          <div className="location-modal-body">
             <div className={`map-wrapper glass ${isEditing ? 'editing' : ''}`}>
                <div id="leaflet-map" ref={mapRef}></div>
                {isEditing && <div className="map-crosshair"></div>}
             </div>

             {view === 'list' ? (
               <div className="location-list-view">
                 <div className="loc-section-title">Ana Adresler</div>
                 <div className="loc-grid">
                    <LocationCard 
                      icon={<Home size={18} />} 
                      title="Evim" 
                      data={home} 
                      onGo={() => handleDirections(home)}
                      onEdit={() => {
                        setFormData({ type: 'home', label: home?.label || 'Evim', address: home?.address || '', lat: home?.lat, lng: home?.lng });
                        setIsEditing(true);
                        setView('form');
                      }}
                      className="home"
                    />
                    <LocationCard 
                      icon={<Building size={18} />} 
                      title="İşyerim" 
                      data={work} 
                      onGo={() => handleDirections(work)}
                      onEdit={() => {
                        setFormData({ type: 'work', label: work?.label || 'İşyerim', address: work?.address || '', lat: work?.lat, lng: work?.lng });
                        setIsEditing(true);
                        setView('form');
                      }}
                      className="work"
                    />
                 </div>

                 <div className="loc-section-title mt-24">Diğer Yerler</div>
                 <div className="loc-grid">
                    {savedLocations.map(loc => (
                      <LocationCard 
                        key={loc.id}
                        icon={<span>📍</span>} 
                        title={loc.label} 
                        data={loc} 
                        onGo={() => handleDirections(loc)}
                        onEdit={() => {
                          setFormData({ ...loc });
                          setIsEditing(true);
                          setView('form');
                        }}
                        onDelete={() => deleteLocation(loc.id)}
                        className="other"
                      />
                    ))}
                    <button className="add-loc-card" onClick={() => {
                      setFormData({ id: null, type: 'other', label: '', address: '', lat: null, lng: null });
                      setIsEditing(true);
                      setView('form');
                    }}>
                      <Plus size={20} />
                      <span>Yeni Yer Ekle</span>
                    </button>
                 </div>
               </div>
             ) : (
               <div className="location-form-view animate-fadeIn">
                 <div className="form-group">
                   <label>Konum İsmi</label>
                   <input 
                    type="text" 
                    placeholder="Örn: Yazlık, Annemler..." 
                    value={formData.label}
                    onChange={e => setFormData({...formData, label: e.target.value})}
                   />
                 </div>
                 <div className="form-group">
                   <label>Adres Detayı</label>
                   <textarea 
                    placeholder="Mahalle, sokak, bina bilgileri..." 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                   />
                 </div>
                 <div className="form-coords-info glass">
                    <MapPin size={14} />
                    <span>{formData.lat ? `${formData.lat.toFixed(6)}, ${formData.lng.toFixed(6)}` : 'Haritadan bir nokta seçin'}</span>
                 </div>

                 <div className="form-actions">
                   <button className="la-btn cancel" onClick={() => { setIsEditing(false); setView('list'); }}>İptal</button>
                   <button className="la-btn save" onClick={handleSave}>
                     <Save size={18} /> Kaydet
                   </button>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </Portal>
  );
};

const LocationCard = ({ icon, title, data, onGo, onEdit, onDelete, className }) => (
  <div className={`loc-full-card ${className} glass`}>
    <div className="lfc-top">
      <div className="lfc-icon">{icon}</div>
      <div className="lfc-info">
        <strong>{title}</strong>
        <span>{data?.address || 'Adres belirtilmemiş'}</span>
      </div>
    </div>
    <div className="lfc-actions">
      <button className="lfc-btn go" onClick={onGo} title="Yol Tarifi">
        <Navigation size={16} /> <span>Git</span>
      </button>
      <button className="lfc-btn edit" onClick={onEdit} title="Düzenle">
        <Edit2 size={16} />
      </button>
      {onDelete && (
        <button className="lfc-btn delete" onClick={onDelete} title="Sil">
          <Trash2 size={16} />
        </button>
      )}
    </div>
  </div>
);

export default LocationModal;
