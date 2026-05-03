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
  
  const [viewMode, setViewMode] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  const formattedDateStr = selectedDate.toISOString().split('T')[0];

  const changeDate = (days) => {
    const d = new Date(selectedDate);
    if (viewMode === 'daily') d.setDate(d.getDate() + days);
    else if (viewMode === 'weekly') d.setDate(d.getDate() + (days * 7));
    else if (viewMode === 'monthly') d.setMonth(d.getMonth() + days);
    else d.setFullYear(d.getFullYear() + days);
    setSelectedDate(d);
  };

  const stats = useMemo(() => {
    const filterBy = (s, d) => s.date === d.toISOString().split('T')[0];
    if (viewMode === 'daily') {
      const daily = shifts.filter(s => filterBy(s, selectedDate));
      return { totalWage: daily.reduce((acc, s) => acc + s.totalPay, 0), label: 'Günlük Gider' };
    }
    // ... other stats same as before
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const monthly = shifts.filter(s => { const d = new Date(s.date); return d.getMonth() === month && d.getFullYear() === year; });
    return { totalWage: monthly.reduce((acc, s) => acc + s.totalPay, 0), label: 'Aylık Toplam' };
  }, [viewMode, selectedDate, shifts]);

  // --- RENDER DAILY (COMPACT - NO SCROLL) ---
  const renderDaily = () => (
    <div className="compact-gantt-view glass animate-fadeIn">
      <div className="cg-header">
        <div className="cg-label-space"></div>
        <div className="cg-timeline-labels">
          <span>10</span>
          <span>13</span>
          <span>16</span>
          <span>19</span>
          <span>22</span>
        </div>
      </div>
      <div className="cg-body">
        {personel.length === 0 ? <div className="p-20 text-center opacity-50">Personel ekleyin.</div> : personel.map(p => {
          const shift = shifts.find(s => s.personelId === p.id && s.date === formattedDateStr);
          return (
            <div key={p.id} className="cg-row" onClick={() => setEditingShift({ personelId: p.id, date: formattedDateStr, startTime: shift?.startTime || "10", endTime: shift?.endTime || "22" })}>
              <div className="cg-user-col">
                <span className="gt-avatar" style={{ background: p.color }}>{p.emoji}</span>
                <strong>{p.name.split(' ')[0]}</strong>
              </div>
              <div className="cg-track-col">
                <div className="cg-track-bg">
                   <div className="cg-tick"></div><div className="cg-tick"></div><div className="cg-tick"></div>
                </div>
                {shift && (
                  <div 
                    className="cg-shift-bar"
                    style={{
                      left: `${((parseInt(shift.startTime) - 10) / 12) * 100}%`,
                      width: `${((parseInt(shift.endTime) - parseInt(shift.startTime)) / 12) * 100}%`,
                      background: p.color
                    }}
                  >
                    <small>{shift.startTime}-{shift.endTime}</small>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );

  const renderWeekly = () => {
    // Standard weekly view same as before but simplified for mobile
    return (
      <div className="weekly-summary-view glass animate-fadeIn">
        <div className="ws-grid">
           {personel.map(p => (
             <div key={p.id} className="ws-compact-row">
                <div className="wsc-user">
                  <span style={{ background: p.color }}>{p.emoji}</span>
                  <strong>{p.name.split(' ')[0]}</strong>
                </div>
                <div className="wsc-days">
                   {[0,1,2,3,4,5,6].map(i => {
                     const d = new Date(selectedDate);
                     d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1) + i);
                     const shift = shifts.find(s => s.personelId === p.id && s.date === d.toISOString().split('T')[0]);
                     return <div key={i} className={`wsc-dot ${shift ? 'active' : ''}`} style={{ '--p-color': p.color }}></div>
                   })}
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  };

  const renderMonthly = () => (
    <div className="monthly-summary-view animate-fadeIn">
       <div className="report-grid">
          {personel.map(p => {
             const monthShifts = shifts.filter(s => { const d = new Date(s.date); return d.getMonth() === selectedDate.getMonth() && s.personelId === p.id; });
             const total = monthShifts.reduce((acc, s) => acc + s.totalPay, 0);
             return (
               <div key={p.id} className="report-item glass">
                  <div className="ri-user"><span>{p.emoji}</span><strong>{p.name}</strong></div>
                  <div className="ri-stat highlight"><small>HAKEDİŞ</small><strong>{total.toLocaleString('tr-TR')} ₺</strong></div>
               </div>
             )
          })}
       </div>
    </div>
  );

  return (
    <div className="tab-view-content animate-fadeIn">
      <div className="view-mode-switcher glass mb-12">
        <button className={viewMode === 'daily' ? 'active' : ''} onClick={() => setViewMode('daily')}><Clock size={16} /></button>
        <button className={viewMode === 'weekly' ? 'active' : ''} onClick={() => setViewMode('weekly')}><LayoutGrid size={16} /></button>
        <button className={viewMode === 'monthly' ? 'active' : ''} onClick={() => setViewMode('monthly')}><CalendarDays size={16} /></button>
        <button className={viewMode === 'yearly' ? 'active' : ''} onClick={() => setViewMode('yearly')}><TrendingUp size={16} /></button>
      </div>

      <div className="day-selector-premium glass mb-12">
        <button onClick={() => changeDate(-1)} className="icon-btn-small"><ChevronLeft size={18} /></button>
        <div className="active-day-label">
          <strong>{viewMode === 'daily' ? selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' }) : 
                  viewMode === 'monthly' ? selectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) :
                  selectedDate.getFullYear()}</strong>
        </div>
        <button onClick={() => changeDate(1)} className="icon-btn-small"><ChevronRight size={18} /></button>
      </div>

      <div className="shift-summary glass mb-16">
        <div className="ss-item">
          <Calculator size={18} color="#10b981" />
          <div className="ss-text"><small>{stats.label}</small><strong>{stats.totalWage.toLocaleString('tr-TR')} TL</strong></div>
        </div>
        <button className="add-btn-mini" onClick={() => setShowStaffModal(true)} style={{ marginLeft: 'auto' }}><UserPlus size={18} /></button>
      </div>

      {viewMode === 'daily' && renderDaily()}
      {viewMode === 'weekly' && renderWeekly()}
      {viewMode === 'monthly' && renderMonthly()}
      {/* Yearly hidden for mobile compactness or same as before */}

      {editingShift && (
        <ShiftEditModal 
          shift={editingShift}
          personel={personel.find(p => p.id === editingShift.personelId)}
          onClose={() => setEditingShift(null)}
          onSave={(data) => {
            const wage = (parseInt(data.endTime) - parseInt(data.startTime)) * (personel.find(px => px.id === data.personelId)?.hourlyRate || 0);
            const otherShifts = shifts.filter(s => !(s.personelId === data.personelId && s.date === data.date));
            setModuleData('modaring', { vardiya: [...otherShifts, { ...data, id: Date.now().toString(), totalPay: wage }] });
            setEditingShift(null);
            toast.success('Vardiya güncellendi');
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

// ... ShiftEditModal and StaffAddModal remain same ...
const ShiftEditModal = ({ shift, personel, onClose, onSave, onDelete }) => {
  const [times, setTimes] = useState({ startTime: shift.startTime || "10", endTime: shift.endTime || "22" });
  const hoursArr = Array.from({ length: 13 }, (_, i) => (i + 10).toString());
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" style={{ maxWidth: '300px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2"><Clock size={20} color={personel.color} /><div style={{ textAlign: 'left' }}><h3 style={{ fontSize: '16px' }}>Vardiya Ayarla</h3><small>{personel.name}</small></div></div>
        <div className="modal-body-v2">
          <div className="form-grid-v2">
            <div className="form-group-v2"><label>Giriş</label><select className="premium-select" value={times.startTime} onChange={e => setTimes({...times, startTime: e.target.value})}>{hoursArr.map(h => <option key={h} value={h}>{h}:00</option>)}</select></div>
            <div className="form-group-v2"><label>Çıkış</label><select className="premium-select" value={times.endTime} onChange={e => setTimes({...times, endTime: e.target.value})}>{hoursArr.map(h => <option key={h} value={h}>{h}:00</option>)}</select></div>
          </div>
          <div className="wage-preview glass mt-16"><Calculator size={14} color="#10b981" /><span>Hakediş: <strong>{(parseInt(times.endTime) - parseInt(times.startTime)) * (personel.hourlyRate || 0)} TL</strong></span></div>
          <div className="modal-actions-v2 mt-20"><button className="icon-btn-danger" onClick={onDelete}><Trash2 size={18} /></button><button className="submit-btn-premium" style={{ flex: 1 }} onClick={() => onSave({...shift, ...times})}>Kaydet</button></div>
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
