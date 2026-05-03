import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Users, UserPlus, Trash2, 
  Calculator, Clock, X, Save, ChevronLeft, ChevronRight,
  LayoutGrid, CalendarDays, TrendingUp, DollarSign, MessageCircle, Eraser, Sparkles,
  Eye, EyeOff, FileText, Info, Phone, Calendar as CalendarIcon, Zap, AlertTriangle
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const VardiyaTab = () => {
  const { modaring, setModuleData } = useStore();
  const personel = modaring?.personel || [];
  const shifts = modaring?.vardiya || [];
  
  const [viewMode, setViewMode] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [hideEarnings, setHideEarnings] = useState(true);
  const [selectedPersonDetail, setSelectedPersonDetail] = useState(null);

  const formattedDateStr = selectedDate.toISOString().split('T')[0];

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
      const dayShifts = useStore.getState().modaring.vardiya.filter(s => s?.date === dStr);
      if (dayShifts.length === 0) text += "Plan yok 🏖️\n";
      else dayShifts.forEach(s => {
        const p = personel.find(x => x.id === s.personelId);
        text += `${p?.name?.split(' ')[0] || 'Personel'} ${s.startTime}:00 - ${s.endTime}:00\n`;
      });
    });
    navigator.clipboard.writeText(text);
    toast.success("Kopyalandı!", { icon: '📱' });
  };

  const overtimeThreshold = useMemo(() => {
    if (viewMode === 'daily') return 12;
    if (viewMode === 'weekly') return 50;
    if (viewMode === 'monthly') return 215;
    if (viewMode === 'yearly') return 2600;
    return 50;
  }, [viewMode]);

  const currentViewStats = useMemo(() => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const week = getWeekRange(selectedDate);
    const weekStrs = week.map(d => d.toISOString().split('T')[0]);

    const baseStats = personel.map(p => {
      let filtered = [];
      if (viewMode === 'daily') filtered = shifts.filter(s => s?.date === formattedDateStr && s?.personelId === p.id);
      else if (viewMode === 'weekly') filtered = shifts.filter(s => weekStrs.includes(s?.date) && s?.personelId === p.id);
      else if (viewMode === 'monthly') filtered = shifts.filter(s => { const d = new Date(s?.date); return d.getMonth() === month && d.getFullYear() === year && s?.personelId === p.id; });
      else if (viewMode === 'yearly') filtered = shifts.filter(s => new Date(s?.date).getFullYear() === year && s?.personelId === p.id);

      const hours = filtered.reduce((acc, s) => acc + (parseInt(s.endTime) - parseInt(s.startTime)), 0);
      const earned = filtered.reduce((acc, s) => acc + (s.totalPay || 0), 0);
      return { ...p, hours, earned, count: filtered.length, lastNote: filtered[filtered.length-1]?.note };
    });
    return baseStats.sort((a, b) => b.hours - a.hours);
  }, [viewMode, selectedDate, shifts, personel, formattedDateStr]);

  const totalHours = useMemo(() => currentViewStats.reduce((acc,s)=>acc+s.hours,0), [currentViewStats]);

  const handleSaveShift = (data) => {
    const currentShifts = useStore.getState().modaring.vardiya || [];
    const isOverlap = currentShifts.some(s => s.personelId === data.personelId && s.date === data.date && s.id !== data.id && ((parseInt(data.startTime) < parseInt(s.endTime) && parseInt(data.endTime) > parseInt(s.startTime))));
    if (isOverlap) { toast.error("Vardiya Çakışması!"); return; }
    
    const wage = (parseInt(data.endTime) - parseInt(data.startTime)) * (personel.find(px => px.id === data.personelId)?.hourlyRate || 0);
    const otherShifts = currentShifts.filter(s => !(s?.id === data.id));
    setModuleData('modaring', { vardiya: [...otherShifts, { ...data, id: data.id || Date.now().toString(), totalPay: wage }] });
    setEditingShift(null);
    toast.success('Kaydedildi');
  };

  const handleClearDay = () => {
    if (window.confirm("Bu günün tüm vardiyalarını silmek istediğinize emin misiniz?")) {
      const currentShifts = useStore.getState().modaring.vardiya || [];
      const remainingShifts = currentShifts.filter(s => s?.date !== formattedDateStr);
      setModuleData('modaring', { vardiya: remainingShifts });
      toast.success("Gün temizlendi 🧹");
    }
  };

  const handleDeleteShift = (shiftId) => {
    const currentShifts = useStore.getState().modaring.vardiya || [];
    const updated = currentShifts.filter(s => s?.id !== shiftId);
    setModuleData('modaring', { vardiya: updated });
    setEditingShift(null);
    toast.error('Vardiya silindi');
  };

  const renderDaily = () => (
    <div className="compact-gantt-view glass animate-fadeIn">
      <div className="cg-header"><div className="cg-label-space"></div><div className="cg-timeline-labels"><span>10</span><span>13</span><span>16</span><span>19</span><span>22</span></div></div>
      <div className="cg-body">
        {personel.map(p => {
          const shift = shifts.find(s => s?.personelId === p.id && s?.date === formattedDateStr);
          return (
            <div key={p.id} className="cg-row" onClick={() => setEditingShift({ id: shift?.id || null, personelId: p.id, date: formattedDateStr, startTime: shift?.startTime || "10", endTime: shift?.endTime || "22", note: shift?.note || "" })}>
              <div className="cg-user-col" onClick={(e) => { e.stopPropagation(); setSelectedPersonDetail(p); }}>
                <span className="gt-avatar" style={{ background: p.color }}>{p.emoji}</span>
                <strong>{p.name?.split(' ')[0]}</strong>
              </div>
              <div className="cg-track-col">
                <div className="cg-track-bg"><div className="cg-tick"></div><div className="cg-tick"></div><div className="cg-tick"></div></div>
                {shift && (
                  <div className="cg-shift-bar" style={{ left: `${((parseInt(shift.startTime) - 10) / 12) * 100}%`, width: `${((parseInt(shift.endTime) - parseInt(shift.startTime)) / 12) * 100}%`, background: p.color }}>
                    <small>{shift.startTime}-{shift.endTime}</small>
                    {shift.note && <div className="cg-note-indicator"><FileText size={8} /></div>}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );

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
          <button className="whatsapp-copy-btn glass animate-pop" onClick={copyWeeklyToWhatsApp}>
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
          <button className="ss-action-btn-eye mr-12" onClick={() => setHideEarnings(!hideEarnings)} title="Giderleri Gizle/Göster">{hideEarnings ? <EyeOff size={24} /> : <Eye size={24} />}</button>
          <div className="ss-text"><small>{hideEarnings ? 'Toplam Mesai' : 'Dönem Gideri'}</small><strong>{hideEarnings ? totalHours+' saat' : currentViewStats.reduce((acc,s)=>acc+s.earned,0).toLocaleString('tr-TR')+' TL'}</strong></div>
        </div>
        <div className="ss-actions">
           <button className="ss-action-btn-danger" onClick={handleClearDay} title="Günü Temizle"><Eraser size={20} /></button>
           <button className="ss-action-btn-cute" onClick={() => setShowAddStaffModal(true)} title="Yeni Personel Ekle">
              <Sparkles size={16} />
              <span>Personel</span>
           </button>
        </div>
      </div>

      {(viewMode === 'daily' || viewMode === 'weekly') && (viewMode === 'daily' ? renderDaily() : (
        <div className="weekly-summary-view glass animate-fadeIn">
          <div className="ws-grid">
            {currentViewStats.map(p => (
              <div key={p.id} className="ws-compact-row">
                <div className="wsc-user"><span style={{ background: p.color }}>{p.emoji}</span><strong>{p.name?.split(' ')[0]}</strong></div>
                <div className="wsc-days">{getWeekRange(selectedDate).map((d, i) => { const dStr = d.toISOString().split('T')[0]; const shift = shifts.find(s => s?.personelId === p.id && s?.date === dStr); return <div key={i} className={`wsc-dot ${shift ? 'active' : ''}`} style={{ '--p-color': p.color }}></div> })}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {viewMode === 'yearly' && (
        <div className="yearly-summary-view glass animate-fadeIn">
          <div className="yearly-list">
            {['Ocak','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'].map((m, idx) => {
              const monthlyTotalHours = shifts.filter(s => { const d = new Date(s?.date); return d.getMonth() === idx && d.getFullYear() === selectedDate.getFullYear(); }).reduce((acc, s) => acc + (parseInt(s.endTime) - parseInt(s.startTime)), 0);
              return (
                <div key={m} className="yearly-row">
                  <div className="yr-month">{m}</div>
                  <div className="yr-bar-container"><div className="yr-bar" style={{ width: `${Math.min(100, (monthlyTotalHours / 215) * 100)}%`, background: monthlyTotalHours > 215 ? '#ef4444' : 'var(--modaring-gradient)' }}></div></div>
                  <div className="yr-total">{monthlyTotalHours > 0 ? monthlyTotalHours + ' s' : '-'}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="section-header-v2 mt-20"><h3>👥 Çalışanlar Listesi</h3></div>
      <div className="stats-list pb-80">
         {currentViewStats.map(s => (
           <div key={s.id} className="stat-card-visual glass animate-pop" onClick={() => setSelectedPersonDetail(s)}>
              <div className="scv-header">
                 <div className="scv-user">
                    <span className="scv-emoji" style={{ background: s.color }}>{s.emoji}</span>
                    <div className="scv-info"><strong>{s.name}</strong><small style={{ color: s.hours > overtimeThreshold ? '#ef4444' : 'inherit', fontWeight: s.hours > overtimeThreshold ? 'bold' : 'normal' }}>{s.hours} saat mesai {s.hours > overtimeThreshold && <AlertTriangle size={10} style={{ display: 'inline', marginLeft: 4 }} />}</small></div>
                 </div>
                 {!hideEarnings && <div className="scv-earned"><small>Hakediş</small><strong>{s.earned.toLocaleString()} ₺</strong></div>}
                 {s.hours > overtimeThreshold && <div className="overtime-badge">OVERTIME</div>}
              </div>
              <div className="scv-progress-track"><div className="scv-progress-bar" style={{ width: `${Math.min(100, (s.hours / overtimeThreshold) * 100)}%`, background: s.hours > overtimeThreshold ? '#ef4444' : s.color }}></div></div>
              {s.lastNote && <div className="scv-note"><FileText size={10} /><span>{s.lastNote}</span></div>}
           </div>
         ))}
      </div>

      {editingShift && (
        <ShiftEditModal shift={editingShift} personel={personel.find(p => p.id === editingShift.personelId)} onClose={() => setEditingShift(null)} onSave={handleSaveShift} onDelete={() => handleDeleteShift(editingShift.id)} />
      )}

      {selectedPersonDetail && <PersonDetailModal person={selectedPersonDetail} onClose={() => setSelectedPersonDetail(null)} onUpdate={(updates) => { setModuleData('modaring', { personel: personel.map(p => p.id === selectedPersonDetail.id ? { ...p, ...updates } : p) }); setSelectedPersonDetail(null); toast.success('Güncellendi'); }} onDelete={() => { if(window.confirm("Personeli sil?")) { const curP = useStore.getState().modaring.personel; const curV = useStore.getState().modaring.vardiya; setModuleData('modaring', { personel: curP.filter(p => p.id !== selectedPersonDetail.id), vardiya: curV.filter(s => s.personelId !== selectedPersonDetail.id) }); setSelectedPersonDetail(null); toast.error('Personel silindi'); } }} />}
      
      {showAddStaffModal && <StaffAddOnlyModal onClose={() => setShowAddStaffModal(false)} onAdd={(p) => { setModuleData('modaring', { personel: [...personel, { ...p, id: Date.now().toString(), active: true, role: 'Satış Danışmanı', phone: '', note: '' }] }); setShowAddStaffModal(false); toast.success('Personel eklendi!'); }} />}
    </div>
  );
};

const StaffAddOnlyModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ name: '', hourlyRate: '', emoji: '👤', color: '#fb7185' });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-slideUp staff-modal-v2" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2"><UserPlus size={24} color="#fb7185" /><h3>Yeni Personel</h3><button className="icon-btn-small" onClick={onClose}><X size={20} /></button></div>
        <div className="modal-body-v2">
          <div className="form-group-v2"><label>Ad Soyad</label><input className="premium-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Örn: Ayşe Yılmaz" /></div>
          <div className="form-grid-v2 mt-12"><div className="form-group-v2"><label>Saatlik Ücret</label><input type="number" className="premium-input" value={form.hourlyRate} onChange={e => setForm({...form, hourlyRate: e.target.value})} placeholder="₺" /></div><div className="form-group-v2"><label>Renk</label><input type="color" className="premium-input-color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} /></div></div>
          <button className="submit-btn-premium mt-24" onClick={() => { if(!form.name || !form.hourlyRate) return toast.error('Eksik bilgi'); onAdd(form); }}>Kaydet ve Ekle</button>
        </div>
      </div>
    </div>
  );
};

const ShiftEditModal = ({ shift, personel, onClose, onSave, onDelete }) => {
  const [data, setData] = useState({ id: shift.id, personelId: shift.personelId, date: shift.date, startTime: shift.startTime || "10", endTime: shift.endTime || "22", note: shift.note || "" });
  const hoursArr = Array.from({ length: 13 }, (_, i) => (i + 10).toString());
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" style={{ maxWidth: '320px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2"><Clock size={20} color={personel.color} /><div><h3 style={{ fontSize: '16px' }}>Vardiya Planla</h3><small>{personel.name}</small></div></div>
        <div className="modal-body-v2">
          <div className="template-row mb-12"><button className="template-btn" onClick={() => setData({...data, startTime: "10", endTime: "18"})}>🌅 10-18</button><button className="template-btn" onClick={() => setData({...data, startTime: "14", endTime: "22"})}>🌙 14-22</button><button className="template-btn" onClick={() => setData({...data, startTime: "10", endTime: "22"})}>💎 Tam</button></div>
          <div className="form-grid-v2"><div className="form-group-v2"><label>Giriş</label><select className="premium-select" value={data.startTime} onChange={e => setData({...data, startTime: e.target.value})}>{hoursArr.map(h => <option key={h} value={h}>{h}:00</option>)}</select></div><div className="form-group-v2"><label>Çıkış</label><select className="premium-select" value={data.endTime} onChange={e => setData({...data, endTime: e.target.value})}>{hoursArr.map(h => <option key={h} value={h}>{h}:00</option>)}</select></div></div>
          <div className="form-group-v2 mt-12"><label>Not</label><textarea className="premium-input" style={{ height: '60px', padding: '10px' }} value={data.note} onChange={e => setData({...data, note: e.target.value})} placeholder="Vardiya notu..." /></div>
          <div className="modal-actions-v2 mt-20">{shift.id && <button className="icon-btn-danger" onClick={() => onDelete(shift.id)}><Trash2 size={18} /></button>}<button className="submit-btn-premium" style={{ flex: 1 }} onClick={() => onSave(data)}>Planla</button></div>
        </div>
      </div>
    </div>
  );
};

const PersonDetailModal = ({ person, onClose, onUpdate, onDelete }) => {
  const [form, setForm] = useState({ name: person.name, role: person.role || 'Satış Danışmanı', phone: person.phone || '', hourlyRate: person.hourlyRate || 0, note: person.note || '' });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-slideUp staff-modal-v2" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2"><span style={{ background: person.color, width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{person.emoji}</span><h3>Profil</h3><button className="icon-btn-small" onClick={onClose}><X size={20} /></button></div>
        <div className="modal-body-v2">
          <div className="form-group-v2"><label>Adı Soyadı</label><input className="premium-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div className="form-grid-v2 mt-12"><div className="form-group-v2"><label>Rol</label><input className="premium-input" value={form.role} onChange={e => setForm({...form, role: e.target.value})} /></div><div className="form-group-v2"><label>Ücret</label><input type="number" className="premium-input" value={form.hourlyRate} onChange={e => setForm({...form, hourlyRate: e.target.value})} /></div></div>
          <div className="form-group-v2 mt-12"><label>Telefon</label><div style={{ display: 'flex', gap: 8 }}><input className="premium-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /><a href={`tel:${form.phone}`} className="icon-btn-small" style={{ background: '#10b981', color: 'white' }}><Phone size={16} /></a></div></div>
          <div className="form-group-v2 mt-12"><label>Personel Notu</label><textarea className="premium-input" style={{ height: '80px', padding: '10px' }} value={form.note} onChange={e => setForm({...form, note: e.target.value})} /></div>
          <div className="modal-actions-v2 mt-20"><button className="icon-btn-danger" onClick={onDelete}><Trash2 size={18} /></button><button className="submit-btn-premium" style={{ flex: 1 }} onClick={() => onUpdate(form)}>Güncelle</button></div>
        </div>
      </div>
    </div>
  );
};

export default VardiyaTab;
