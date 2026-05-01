import React, { useEffect, useRef } from 'react';
import Portal from './Portal';
import { X, MapPin, Navigation, Home, Building, ExternalLink } from 'lucide-react';
import './LocationModal.css';

const LocationModal = ({ isOpen, onClose, locations }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (isOpen && !mapInstance.current) {
      // Small delay to ensure container is rendered
      const timer = setTimeout(() => {
        initMap();
      }, 100);
      return () => clearTimeout(timer);
    }
    
    // Update markers if locations change
    if (isOpen && mapInstance.current) {
       updateMarkers();
    }

    return () => {
      if (!isOpen && mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isOpen, locations]);

  const initMap = () => {
    if (!window.L || !mapRef.current) return;

    const { home, work } = locations;
    const defaultCenter = [36.8841, 30.7056]; // Fallback to Antalya
    const center = home?.lat && home?.lng ? [home.lat, home.lng] : defaultCenter;

    mapInstance.current = window.L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(center, 13);

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapInstance.current);

    // Add Zoom Control at bottom right
    window.L.control.zoom({
      position: 'bottomright'
    }).addTo(mapInstance.current);

    updateMarkers();
  };

  const updateMarkers = () => {
    if (!mapInstance.current || !window.L) return;

    // Clear existing markers (optional, but cleaner)
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof window.L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    const { home, work } = locations;
    const bounds = [];

    if (home?.lat && home?.lng) {
      const homeIcon = window.L.divIcon({
        html: `<div class="map-marker-pin home">🏠</div>`,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });
      window.L.marker([home.lat, home.lng], { icon: homeIcon })
        .addTo(mapInstance.current)
        .bindPopup('<b>Evim</b><br>' + (home.address || 'Adres belirtilmedi'));
      bounds.push([home.lat, home.lng]);
    }

    if (work?.lat && work?.lng) {
      const workIcon = window.L.divIcon({
        html: `<div class="map-marker-pin work">🏢</div>`,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });
      window.L.marker([work.lat, work.lng], { icon: workIcon })
        .addTo(mapInstance.current)
        .bindPopup('<b>İşyerim</b><br>' + (work.address || 'Adres belirtilmedi'));
      bounds.push([work.lat, work.lng]);
    }

    if (bounds.length > 0) {
      if (bounds.length === 1) {
        mapInstance.current.setView(bounds[0], 15);
      } else {
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="location-modal-overlay">
        <div className="location-modal-container animate-slideUp">
          <div className="location-modal-header">
            <div className="lmh-info">
              <h3>Konum Takibi</h3>
              <p>Ev ve iş yerinizi tek haritada görün</p>
            </div>
            <button className="lmh-close" onClick={onClose}><X size={20} /></button>
          </div>

          <div className="location-modal-body">
             <div className="map-wrapper glass">
                <div id="leaflet-map" ref={mapRef}></div>
                
                <div className="map-overlay-cards">
                   <div className="loc-mini-card home">
                      <div className="lmc-icon"><Home size={18} /></div>
                      <div className="lmc-text">
                         <strong>Evim</strong>
                         <span>{locations.home?.label || 'Belirlenmedi'}</span>
                      </div>
                      <button className="lmc-btn" onClick={() => {
                        if (locations.home?.lat) mapInstance.current.setView([locations.home.lat, locations.home.lng], 16);
                      }}><Navigation size={14} /></button>
                   </div>
                   
                   <div className="loc-mini-card work">
                      <div className="lmc-icon"><Building size={18} /></div>
                      <div className="lmc-text">
                         <strong>İşyerim</strong>
                         <span>{locations.work?.label || 'Belirlenmedi'}</span>
                      </div>
                      <button className="lmc-btn" onClick={() => {
                        if (locations.work?.lat) mapInstance.current.setView([locations.work.lat, locations.work.lng], 16);
                      }}><Navigation size={14} /></button>
                   </div>
                </div>
             </div>

             <div className="location-actions-grid">
                <button className="la-btn glass" onClick={() => {
                  const { home, work } = locations;
                  if (home?.lat && work?.lat) {
                    window.open(`https://www.google.com/maps/dir/${home.lat},${home.lng}/${work.lat},${work.lng}`, '_blank');
                  }
                }}>
                   <ExternalLink size={18} />
                   <span>Yol Tarifi Al</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default LocationModal;
