import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Users, UserPlus, Trash2, 
  Calculator, Clock, X, Save, ChevronLeft, ChevronRight,
  LayoutGrid, CalendarDays, TrendingUp, DollarSign, MessageCircle
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const VardiyaTab = () => {
  const { modaring, setModuleData, forceSaveToSupabase } = useStore();
  const personel = modaring?.personel || [];
  const shifts = modaring?.vardiya || [];
  
  const [viewMode, setViewMode] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  const formattedDateStr = selectedDate.toISOString().split('T')[0];

  // --- MOCK DATA INJECTION (FIXED & SAFE) ---
  useEffect(() => {
    const nextWeekDate = "2026-05-11";
    // Added safety check with ?. to prevent 'startsWith' error
    const hasNextWeek = shifts.some(s => s?.date?.startsWith?.("2026-05-11"));
    
    if (!hasNextWeek && personel.length >= 2) {
      const azraId = personel.find(p => p.name.includes("Azra"))?.id || personel[0].id;
      const gozdeId = personel.find(p => p.name.includes("Gözde"))?.id || personel[1].id;
      const zeynepId = personel.find(p => p.name.includes("Zeynep"))?.id || (personel[2]?.id || personel[0].id);

      const mockNextWeek = [
        { id: 'm1', date: '2026-05-11', personelId: azraId, startTime: "10", endTime: "18", totalPay: 1200 },
        { id: 'm2', date: '2026-05-11', personelId: gozdeId, startTime: "16", endTime: "22", totalPay: 900 },
        { id: 'm3', date: '2026-05-12', personelId: gozdeId, startTime: "10", endTime: "16", totalPay: 900 },
        { id: 'm4', date: '2026-05-12', personelId: azraId, startTime: "14", endTime: "22", totalPay: 1200 },
        { id: 'm5', date: '2026-05-13', personelId: azraId, startTime: "10", endTime: "18", totalPay: 1200 },
        { id: 'm6', date: '2026-05-14', personelId: zeynepId, startTime: "16", endTime: "22", totalPay: 900 },
        { id: 'm7', date: '2026-05-15', personelId: gozdeId, startTime: "10", endTime: "17", totalPay: 1050 },
        { id: 'm8', date: '2026-05-16', personelId: zeynepId, startTime: "16", endTime: "22", totalPay: 900 },
        { id: 'm9', date: '2026-05-17', personelId: zeynepId, startTime: "10", endTime: "16", totalPay: 900 },
        { id: 'm10', date: '2026-05-17', personelId: azraId, startTime: "14", endTime: "22", totalPay: 1200 },
      ];
      setModuleData('modaring', { vardiya: [...shifts, ...mockNextWeek] });
    }
  }, [personel.length]);

  const changeDate = (days) => {
    const d = new Date(selectedDate);
    if (viewMode === 'daily') d.setDate(d.getDate() + days);
    else if (viewMode === 'weekly') d.setDate(d.getDate() + (days * 7));
    else if (viewMode === 'monthly') d.setMonth(d.getMonth() + days);
    else d.setFullYear(d.getFullYear() + days);
    setSelectedDate(d);
  };

  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const copyWeeklyToWhatsApp = () => {
    const week = getWeekRange(selectedDate);
    const emojis = ['💫', '🎀', '💜', '👀', '🍓', '🌼', '🌺'];
    let text = `💫 ${week[0].getDate()} - ${week[6].toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} ✨✨✨\n`;
    
    week.forEach((d, i) => {
      const dStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('tr-TR', { weekday: 'long' });
      text += `\n${emojis[i]}${dayName}\n`;
      
      const dayShifts = shifts.filter(s => s?.date === dStr);
      if (dayShifts.length === 0) {
        text += "Plan yok veya izinli 🏖️\n";
      } else {
        dayShifts.forEach(s => {
          const p = personel.find(x => x.id === s.personelId);
          text += `${p?.name?.split(' ')[0] || 'Personel'} ${s.startTime}:00 - ${s.endTime}:00\n`;
        });
      }
    });

    navigator.clipboard.writeText(text);
    toast.success("WhatsApp planı kopyalandı!", { icon: '📱' });
  };

  const currentViewStats = useMemo(() => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const week = getWeekRange(selectedDate);
    const weekStrs = week.map(d => d.toISOString().split('T')[0]);

    return personel.map(p => {
      let filtered = [];
      if (viewMode === 'daily') filtered = shifts.filter(s => s?.date === formattedDateStr && s?.personelId === p.id);
      else if (viewMode === 'weekly') filtered = shifts.filter(s => weekStrs.includes(s?.date) && s?.personelId === p.id);
      else if (viewMode === 'monthly') filtered = shifts.filter(s => { const d = new Date(s?.date); return d.getMonth() === month && d.getFullYear() === year && s?.personelId === p.id; });
      else if (viewMode === 'yearly') filtered = shifts.filter(s => new Date(s?.date).getFullYear() === year && s?.personelId === p.id);

      const hours = filtered.reduce((acc, s) => acc + (parseInt(s.endTime) - parseInt(s.startTime)), 0);
      const earned = filtered.reduce((acc, s) => acc + (s.totalPay || 0), 0);
      return { ...p, hours, earned, count: filtered.length };
    });
  }, [viewMode, selectedDate, shifts, personel, formattedDateStr]);

  const totalGider = useMemo(() => currentViewStats.reduce((acc, s) => acc + s.earned, 0), [currentViewStats]);

  const handleManualSave = async () => {
    if (!forceSaveToSupabase) return toast.error("Kayıt fonksiyonu bulunamadı");
    try {
      await forceSaveToSupabase();
      toast.success("Buluta kaydedildi! ☁️");
    } catch (err) {
      toast.error("Kayıt sırasında hata");
    }
  };

  const renderDaily = () => (
    <div className="compact-gantt-view glass animate-fadeIn">
      <div className="cg-header"><div className="cg-label-space"></div><div className="cg-timeline-labels"><span>10</span><span>13</span><span>16</span><span>19</span><span>22</span></div></div>
      <div className="cg-body">
        {personel.map(p => {
          const shift = shifts.find(s => s?.personelId === p.id && s?.date === formattedDateStr);
          return (
            <div key={p.id} className="cg-row" onClick={() => setEditingShift({ personelId: p.id, date: formattedDateStr, startTime: shift?.startTime || "10", endTime: shift?.endTime || "22" })}>
              <div className="cg-user-col"><span className="gt-avatar" style={{ background: p.color }}>{p.emoji}</span><strong>{p.name?.split(' ')[0]}</strong></div>
              <div className="cg-track-col">
                <div className="cg-track-bg"><div className="cg-tick"></div><div className="cg-tick"></div><div className="cg-tick"></div></div>
                {shift && <div className="cg-shift-bar" style={{ left: `${((parseInt(shift.startTime) - 10) / 12) * 100}%`, width: `${((parseInt(shift.endTime) - parseInt(shift.startTime)) / 12) * 100}%`, background: p.color }}><small>{shift.startTime}-{shift.endTime}</small></div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );

  const renderWeekly = () => (
    <div className="weekly-summary-view glass animate-fadeIn">
       <div className="ws-grid">
          {personel.map(p => (
            <div key={p.id} className="ws-compact-row">
               <div className="wsc-user"><span style={{ background: p.color }}>{p.emoji}</span><strong>{p.name?.split(' ')[0]}</strong></div>
               <div className="wsc-days">
                  {getWeekRange(selectedDate).map((d, i) => {
                    const dStr = d.toISOString().split('T')[0];
                    const shift = shifts.find(s => s?.personelId === p.id && s?.date === dStr);
                    return <div key={i} className={`wsc-dot ${shift ? 'active' : ''}`} style={{ '--p-color': p.color }}></div>
                  })}
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  const renderYearly = () => {
    const months = ['Ocak','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
    return (
      <div className="yearly-summary-view glass animate-fadeIn">
        <div className="yearly-list">
          {months.map((m, idx) => {
            const monthlyTotal = shifts.filter(s => { const d = new Date(s?.date); return d.getMonth() === idx && d.getFullYear() === selectedDate.getFullYear(); }).reduce((acc, s) => acc + (s.totalPay || 0), 0);
            return (
              <div key={m} className="yearly-row">
                <div className="yr-month">{m}</div>
                <div className="yr-bar-container"><div className="yr-bar" style={{ width: `${Math.min(100, (monthlyTotal / 50000) * 100)}%` }}></div></div>
                <div className="yr-total">{monthlyTotal > 0 ? monthlyTotal.toLocaleString() + ' ₺' : '-'}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="tab-view-content animate-fadeIn">
      <div className="view-mode-header mb-12">
        <div className="view-mode-switcher glass">
          <button className={viewMode === 'daily' ? 'active' : ''} onClick={() => setViewMode('daily')}><Clock size={16} /></button>
          <button className={viewMode === 'weekly' ? 'active' : ''} onClick={() => setViewMode('weekly')}><LayoutGrid size={16} /></button>
          <button className={viewMode === 'monthly' ? 'active' : ''} onClick={() => setViewMode('monthly')}><CalendarDays size={16} /></button>
          <button className={viewMode === 'yearly' ? 'active' : ''} onClick={() => setViewMode('yearly')}><TrendingUp size={16} /></button>
        </div>
        {viewMode === 'weekly' && (
          <button className="whatsapp-copy-btn glass animate-pop" onClick={copyWeeklyToWhatsApp} title="WhatsApp Kopyala">
            <MessageCircle size={18} />
          </button>
        )}
      </div>

      <div className="day-selector-premium glass mb-12">
        <button onClick={() => changeDate(-1)} className="icon-btn-small"><ChevronLeft size={18} /></button>
        <div className="active-day-label">
          <strong>
            {viewMode === 'daily' ? selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' }) : 
             viewMode === 'weekly' ? `Hafta ${getWeekNumber(selectedDate)}: ${getWeekRange(selectedDate)[0].getDate()} - ${getWeekRange(selectedDate)[6].toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}` : 
             viewMode === 'monthly' ? selectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) :
             selectedDate.getFullYear() + ' Yılı'}
          </strong>
        </div>
        <button onClick={() => changeDate(1)} className="icon-btn-small"><ChevronRight size={18} /></button>
      </div>

      <div className="shift-summary glass mb-16">
        <div className="ss-item">
          <Calculator size={18} color="#10b981" />
          <div className="ss-text"><small>Toplam Gider</small><strong>{totalGider.toLocaleString('tr-TR')} TL</strong></div>
        </div>
        <div className="ss-actions">
           <button className="ss-action-btn-primary" onClick={handleManualSave}><Save size={18} /></button>
           <button className="ss-action-btn" onClick={() => setShowStaffModal(true)}><UserPlus size={18} /></button>
        </div>
      </div>

      {viewMode === 'daily' && renderDaily()}
      {viewMode === 'weekly' && renderWeekly()}
      {viewMode === 'yearly' && renderYearly()}

      <div className="section-header-v2 mt-20"><h3>📊 Personel İstatistikleri</h3></div>
      <div className="stats-list pb-80">
         {currentViewStats.map(s => (
           <div key={s.id} className="stat-card-premium glass animate-pop">
              <div className="scp-user"><span style={{ background: s.color }}>{s.emoji}</span><strong>{s.name}</strong></div>
              <div className="scp-metrics">
                 <div className="scp-metric"><Clock size={12} /><span>{s.hours}s</span></div>
                 <div className="scp-metric highlight"><DollarSign size={12} /><span>{s.earned.toLocaleString()} ₺</span></div>
              </div>
           </div>
         ))}
      </div>

      {editingShift && (
        <ShiftEditModal 
          shift={editingShift}
          personel={personel.find(p => p.id === editingShift.personelId)}
          onClose={() => setEditingShift(null)}
          onSave={(data) => {
            const wage = (parseInt(data.endTime) - parseInt(data.startTime)) * (personel.find(px => px.id === data.personelId)?.hourlyRate || 0);
            const otherShifts = shifts.filter(s => !(s?.personelId === data.personelId && s?.date === data.date));
            setModuleData('modaring', { vardiya: [...otherShifts, { ...data, id: Date.now().toString(), totalPay: wage }] });
            setEditingShift(null);
            toast.success('Kaydedildi');
          }}
          onDelete={() => {
            setModuleData('modaring', { vardiya: shifts.filter(s => !(s?.personelId === editingShift.personelId && s?.date === editingShift.date)) });
            setEditingShift(null);
            toast.error('Silindi');
          }}
        />
      )}
      {showStaffModal && <StaffAddModal personel={personel} onClose={() => setShowStaffModal(false)} onAdd={(p) => setModuleData('modaring', { personel: [...personel, { ...p, id: Date.now().toString(), active: true }] })} onRemove={(id) => setModuleData('modaring', { personel: personel.filter(px => px.id !== id) })} />}
    </div>
  );
};

// ... ShiftEditModal and StaffAddModal ...
const ShiftEditModal = ({ shift, personel, onClose, onSave, onDelete }) => {
  const [times, setTimes] = useState({ startTime: shift.startTime || "10", endTime: shift.endTime || "22" });
  const hoursArr = Array.from({ length: 13 }, (_, i) => (i + 10).toString());
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" style={{ maxWidth: '300px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2"><Clock size={20} color={personel.color} /><div><h3 style={{ fontSize: '16px' }}>Vardiya Planla</h3><small>{personel.name}</small></div></div>
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
        <div className="modal-header-v2"><Users size={24} color="#fb7185" /><h3>Personel</h3><button className="icon-btn-small" onClick={onClose}><X size={20} /></button></div>
        <div className="modal-body-v2">
          <div className="staff-current-list mb-24">{personel.map(p => (<div key={p.id} className="staff-current-item"><div className="sci-user"><span style={{ background: p.color }}>{p.emoji}</span><div><strong>{p.name}</strong><small>{p.hourlyRate}₺/s</small></div></div><button className="icon-btn-small" onClick={() => onRemove(p.id)}><Trash2 size={14} color="#ef4444" /></button></div>))}</div>
          <div className="divider mb-12"><span>Yeni Ekle</span></div>
          <div className="form-group-v2"><input className="premium-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ad Soyad" /></div>
          <div className="form-grid-v2 mt-12"><input type="number" className="premium-input" value={form.hourlyRate} onChange={e => setForm({...form, hourlyRate: e.target.value})} placeholder="Ücret" /><input type="color" className="premium-input-color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} /></div>
          <button className="submit-btn-premium mt-16" onClick={() => { if(!form.name || !form.hourlyRate) return toast.error('Eksik'); onAdd(form); setForm({ name: '', hourlyRate: '', emoji: '👤', color: '#fb7185' }); }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
};

export default VardiyaTab;
