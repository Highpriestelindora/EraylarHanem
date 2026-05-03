import React, { useState, useMemo } from 'react';
import { 
  Plus, Users, UserPlus, Trash2, 
  Calendar as CalendarIcon, Calculator, 
  Clock, X, Save, ChevronLeft, ChevronRight,
  BarChart3, LayoutGrid, CalendarDays, TrendingUp
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const VardiyaTab = () => {
  const { modaring, setModuleData } = useStore();
  const personel = modaring?.personel || [];
  const shifts = modaring?.vardiya || [];
  
  const [viewMode, setViewMode] = useState('daily'); // 'daily', 'weekly', 'monthly', 'yearly'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  const formattedDateStr = selectedDate.toISOString().split('T')[0];
  const timelineHours = Array.from({ length: 13 }, (_, i) => i + 10);

  // --- PERSPECTIVE HELPERS ---
  
  const getWeekDays = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => new Date(year, month, i + 1));
  };

  // --- DATA CALCULATIONS ---

  const stats = useMemo(() => {
    const filterBy = (s, d) => s.date === d.toISOString().split('T')[0];
    
    if (viewMode === 'daily') {
      const daily = shifts.filter(s => filterBy(s, selectedDate));
      return { totalWage: daily.reduce((acc, s) => acc + s.totalPay, 0), label: 'Günlük Gider' };
    }
    
    if (viewMode === 'weekly') {
      const week = getWeekDays(selectedDate);
      const weekly = shifts.filter(s => week.some(d => filterBy(s, d)));
      return { totalWage: weekly.reduce((acc, s) => acc + s.totalPay, 0), label: 'Haftalık Gider' };
    }
    
    if (viewMode === 'monthly') {
      const month = selectedDate.getMonth();
      const year = selectedDate.getFullYear();
      const monthly = shifts.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });
      return { totalWage: monthly.reduce((acc, s) => acc + s.totalPay, 0), label: 'Aylık Toplam' };
    }

    if (viewMode === 'yearly') {
      const year = selectedDate.getFullYear();
      const yearly = shifts.filter(s => new Date(s.date).getFullYear() === year);
      return { totalWage: yearly.reduce((acc, s) => acc + s.totalPay, 0), label: 'Yıllık Projeksiyon' };
    }
  }, [viewMode, selectedDate, shifts]);

  // --- RENDER HELPERS ---

  const renderDaily = () => (
    <div className="iphone-gantt-container glass animate-fadeIn">
      <div className="gantt-scroll-container">
        <div className="gantt-timeline-header">
          <div className="gt-label-col sticky-left">PERSONEL</div>
          <div className="gt-hours-grid">
            {timelineHours.map(h => <div key={h} className="gt-hour-tick"><span>{h}</span></div>)}
          </div>
        </div>
        <div className="gantt-timeline-body">
          {personel.map(p => {
            const shift = shifts.find(s => s.personelId === p.id && s.date === formattedDateStr);
            return (
              <div key={p.id} className="gt-row">
                <div className="gt-label-col sticky-left">
                  <div className="gt-user">
                    <span className="gt-avatar" style={{ background: p.color }}>{p.emoji}</span>
                    <strong>{p.name.split(' ')[0]}</strong>
                  </div>
                </div>
                <div className="gt-hours-grid relative">
                  {timelineHours.map(h => <div key={h} className="gt-hour-cell" onClick={() => setEditingShift({ personelId: p.id, date: formattedDateStr, startTime: h.toString(), endTime: (h+4).toString() })}></div>)}
                  {shift && (
                    <div className="gt-shift-block animate-pop" style={{ left: `${((parseInt(shift.startTime) - 10) / 12) * 100}%`, width: `${((parseInt(shift.endTime) - parseInt(shift.startTime)) / 12) * 100}%`, background: p.color }} onClick={() => setEditingShift(shift)}>
                      <span className="gt-block-time">{shift.startTime}-{shift.endTime}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );

  const renderWeekly = () => {
    const week = getWeekDays(selectedDate);
    return (
      <div className="weekly-summary-view glass animate-fadeIn">
        <div className="ws-grid">
          <div className="ws-header-row">
            <div className="ws-col-label sticky-left">PERSONEL</div>
            {week.map(d => (
              <div key={d.toISOString()} className="ws-col-day">
                <small>{d.toLocaleDateString('tr-TR', { weekday: 'short' })}</small>
                <strong>{d.getDate()}</strong>
              </div>
            ))}
          </div>
          {personel.map(p => (
            <div key={p.id} className="ws-row">
              <div className="ws-col-label sticky-left">
                <div className="gt-user">
                   <span className="gt-avatar" style={{ background: p.color, width: '20px', height: '20px', fontSize: '12px' }}>{p.emoji}</span>
                   <span style={{ fontSize: '11px', fontWeight: '700' }}>{p.name.split(' ')[0]}</span>
                </div>
              </div>
              {week.map(d => {
                const shift = shifts.find(s => s.personelId === p.id && s.date === d.toISOString().split('T')[0]);
                return (
                  <div key={d.toISOString()} className={`ws-cell ${shift ? 'active' : ''}`} style={{ '--p-color': p.color }}>
                    {shift ? <span className="ws-mini-time">{shift.startTime}-{shift.endTime}</span> : <div className="ws-dot"></div>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthly = () => {
    const report = personel.map(p => {
      const monthShifts = shifts.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear() && s.personelId === p.id;
      });
      return { ...p, totalPay: monthShifts.reduce((acc, s) => acc + s.totalPay, 0), days: monthShifts.length };
    });

    return (
      <div className="monthly-summary-view animate-fadeIn">
        <div className="report-grid">
          {report.map(r => (
            <div key={r.id} className="report-item glass">
              <div className="ri-user">
                <span>{r.emoji}</span>
                <div>
                  <strong>{r.name}</strong>
                  <small>{r.days} Gün Çalıştı</small>
                </div>
              </div>
              <div className="ri-stat highlight">
                <small>AYLIK TOPLAM</small>
                <strong>{r.totalPay.toLocaleString('tr-TR')} ₺</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderYearly = () => {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const currentYear = selectedDate.getFullYear();
    
    return (
      <div className="yearly-summary-view glass animate-fadeIn">
        <div className="yearly-list">
          {months.map((m, idx) => {
            const monthlyTotal = shifts.filter(s => {
              const d = new Date(s.date);
              return d.getMonth() === idx && d.getFullYear() === currentYear;
            }).reduce((acc, s) => acc + s.totalPay, 0);
            
            return (
              <div key={m} className="yearly-row">
                <div className="yr-month">{m}</div>
                <div className="yr-bar-container">
                  <div className="yr-bar" style={{ width: `${Math.min(100, (monthlyTotal / 50000) * 100)}%` }}></div>
                </div>
                <div className="yr-total">{monthlyTotal.toLocaleString('tr-TR')} ₺</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="tab-view-content animate-fadeIn">
      {/* Multi-Perspective Switcher */}
      <div className="view-mode-switcher glass mb-16">
        <button className={viewMode === 'daily' ? 'active' : ''} onClick={() => setViewMode('daily')}><Clock size={16} /></button>
        <button className={viewMode === 'weekly' ? 'active' : ''} onClick={() => setViewMode('weekly')}><LayoutGrid size={16} /></button>
        <button className={viewMode === 'monthly' ? 'active' : ''} onClick={() => setViewMode('monthly')}><CalendarDays size={16} /></button>
        <button className={viewMode === 'yearly' ? 'active' : ''} onClick={() => setViewMode('yearly')}><TrendingUp size={16} /></button>
      </div>

      <div className="day-selector-premium glass">
        <button onClick={() => {
          const d = new Date(selectedDate);
          if (viewMode === 'daily') d.setDate(d.getDate() - 1);
          else if (viewMode === 'weekly') d.setDate(d.getDate() - 7);
          else if (viewMode === 'monthly') d.setMonth(d.getMonth() - 1);
          else d.setFullYear(d.getFullYear() - 1);
          setSelectedDate(d);
        }} className="icon-btn-small"><ChevronLeft size={18} /></button>
        
        <div className="active-day-label">
          <strong>{viewMode === 'daily' ? selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' }) : 
                  viewMode === 'weekly' ? `${getWeekDays(selectedDate)[0].getDate()} - ${getWeekDays(selectedDate)[6].toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}` :
                  viewMode === 'monthly' ? selectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) :
                  selectedDate.getFullYear()}</strong>
        </div>

        <button onClick={() => {
          const d = new Date(selectedDate);
          if (viewMode === 'daily') d.setDate(d.getDate() + 1);
          else if (viewMode === 'weekly') d.setDate(d.getDate() + 7);
          else if (viewMode === 'monthly') d.setMonth(d.getMonth() + 1);
          else d.setFullYear(d.getFullYear() + 1);
          setSelectedDate(d);
        }} className="icon-btn-small"><ChevronRight size={18} /></button>
      </div>

      <div className="shift-summary glass mb-20">
        <div className="ss-item">
          <Calculator size={18} color="#10b981" />
          <div className="ss-text">
            <small>{stats.label}</small>
            <strong>{stats.totalWage.toLocaleString('tr-TR')} TL</strong>
          </div>
        </div>
        <button className="add-btn-mini" onClick={() => setShowStaffModal(true)} style={{ marginLeft: 'auto' }}>
          <UserPlus size={18} />
        </button>
      </div>

      {/* Dynamic View Rendering */}
      {viewMode === 'daily' && renderDaily()}
      {viewMode === 'weekly' && renderWeekly()}
      {viewMode === 'monthly' && renderMonthly()}
      {viewMode === 'yearly' && renderYearly()}

      {/* Reused Modals */}
      {editingShift && (
        <ShiftEditModal 
          shift={editingShift}
          personel={personel.find(p => p.id === editingShift.personelId)}
          dayName={selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
          onClose={() => setEditingShift(null)}
          onSave={(data) => {
            const wage = (parseInt(data.endTime) - parseInt(data.startTime)) * (personel.find(px => px.id === data.personelId)?.hourlyRate || 0);
            const otherShifts = shifts.filter(s => !(s.personelId === data.personelId && s.date === data.date));
            setModuleData('modaring', { vardiya: [...otherShifts, { ...data, id: Date.now().toString(), totalPay: wage }] });
            setEditingShift(null);
            toast.success('Vardiya kaydedildi');
          }}
          onDelete={() => {
            setModuleData('modaring', { vardiya: shifts.filter(s => !(s.personelId === editingShift.personelId && s.date === editingShift.date)) });
            setEditingShift(null);
            toast.error('Vardiya silindi');
          }}
        />
      )}

      {showStaffModal && (
        <StaffAddModal 
          personel={personel}
          onClose={() => setShowStaffModal(false)} 
          onAdd={(p) => setModuleData('modaring', { personel: [...personel, { ...p, id: Date.now().toString(), active: true }] })}
          onRemove={(id) => setModuleData('modaring', { personel: personel.filter(px => px.id !== id) })}
        />
      )}
    </div>
  );
};

// ... Sub-components (ShiftEditModal, StaffAddModal) same as before but adjusted ...
const ShiftEditModal = ({ shift, personel, dayName, onClose, onSave, onDelete }) => {
  const [times, setTimes] = useState({ startTime: shift.startTime || "10", endTime: shift.endTime || "22" });
  const hoursArr = Array.from({ length: 13 }, (_, i) => (i + 10).toString());
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop shift-modal-v2" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <Clock size={20} color={personel.color} />
          <div style={{ textAlign: 'left' }}><h3 style={{ fontSize: '16px' }}>Vardiya Planla</h3><small>{personel.name} • {shift.date}</small></div>
          <button className="icon-btn-small" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body-v2">
          <div className="form-grid-v2">
            <div className="form-group-v2"><label>Giriş</label><select className="premium-select" value={times.startTime} onChange={e => setTimes({...times, startTime: e.target.value})}>{hoursArr.map(h => <option key={h} value={h}>{h}:00</option>)}</select></div>
            <div className="form-group-v2"><label>Çıkış</label><select className="premium-select" value={times.endTime} onChange={e => setTimes({...times, endTime: e.target.value})}>{hoursArr.map(h => <option key={h} value={h}>{h}:00</option>)}</select></div>
          </div>
          <div className="wage-preview glass mt-16"><Calculator size={14} color="#10b981" /><span>Hakediş: <strong>{(parseInt(times.endTime) - parseInt(times.startTime)) * (personel.hourlyRate || 0)} TL</strong></span></div>
          <div className="modal-actions-v2 mt-20">
            <button className="icon-btn-danger" onClick={onDelete}><Trash2 size={18} /></button>
            <button className="submit-btn-premium" style={{ flex: 1 }} onClick={() => onSave({...shift, ...times})}>Kaydet</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffAddModal = ({ personel, onClose, onAdd, onRemove }) => {
  const [form, setForm] = useState({ name: '', hourlyRate: '', emoji: '👤', color: '#fb7185' });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-slideUp staff-modal-v2" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2"><Users size={24} color="#fb7185" /><h3>Personel Yönetimi</h3><button className="icon-btn-small" onClick={onClose}><X size={20} /></button></div>
        <div className="modal-body-v2">
          <div className="staff-current-list mb-24">{personel.map(p => (<div key={p.id} className="staff-current-item"><div className="sci-user"><span style={{ background: p.color }}>{p.emoji}</span><div><strong>{p.name}</strong><small>{p.hourlyRate}₺ / saat</small></div></div><button className="icon-btn-small" onClick={() => onRemove(p.id)}><Trash2 size={14} color="#ef4444" /></button></div>))}</div>
          <div className="divider mb-24"><span>Yeni Ekle</span></div>
          <div className="form-group-v2"><label>Personel Adı</label><input className="premium-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ad Soyad" /></div>
          <div className="form-grid-v2 mt-12"><div className="form-group-v2"><label>Saatlik Ücret</label><input type="number" className="premium-input" value={form.hourlyRate} onChange={e => setForm({...form, hourlyRate: e.target.value})} /></div><div className="form-group-v2"><label>Renk</label><input type="color" className="premium-input-color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} /></div></div>
          <button className="submit-btn-premium mt-24" onClick={() => { if(!form.name || !form.hourlyRate) return toast.error('Eksik bilgi'); onAdd(form); setForm({ name: '', hourlyRate: '', emoji: '👤', color: '#fb7185' }); }}>Personel Kaydet</button>
        </div>
      </div>
    </div>
  );
};

export default VardiyaTab;
