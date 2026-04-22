import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const ac = '#1E1C2A', abr = 'rgba(255,255,255,0.06)', amt = '#9CA3AF';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', specialty: '', workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'], workingHours: { start: '09:00', end: '17:00' }, slotDuration: 30, isActive: true });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setStaff((await api.get('/staff')).data); } catch { toast.error('Failed to load staff'); }
    finally { setLoading(false); }
  };

  const openModal = (m = null) => {
    if (m) { setEditingId(m._id); setForm({ name: m.name, specialty: m.specialty, workingDays: m.workingDays || [], workingHours: m.workingHours || { start: '09:00', end: '17:00' }, slotDuration: m.slotDuration || 30, isActive: m.isActive }); }
    else { setEditingId(null); setForm({ name: '', specialty: '', workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'], workingHours: { start: '09:00', end: '17:00' }, slotDuration: 30, isActive: true }); }
    setShowModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.workingDays.length === 0) return toast.error('Select at least one working day');
    try {
      if (editingId) { await api.put(`/staff/${editingId}`, form); toast.success('Updated'); }
      else { await api.post('/staff', form); toast.success('Added'); }
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try { await api.delete(`/staff/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const toggleDay = (d) => setForm(p => ({ ...p, workingDays: p.workingDays.includes(d) ? p.workingDays.filter(x => x !== d) : [...p.workingDays, d] }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl font-bold text-white">Staff Members</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 text-sm font-heading font-semibold py-2.5 px-5 rounded-xl text-white transition-all" style={{ background: '#7C3AED' }}><Plus size={16} /> Add Staff</button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: ac, border: `1px solid ${abr}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Profile','Name & Specialty','Working Days','Hours / Slot','Status','Actions'].map(h => (
                  <th key={h} className="py-3.5 px-6 text-xs font-body font-semibold uppercase tracking-wider" style={{ color: amt }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="py-12 text-center" style={{ color: amt }}><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading...</td></tr>
              ) : staff.length === 0 ? (
                <tr><td colSpan="6" className="py-12 text-center text-sm" style={{ color: amt }}>No staff members found.</td></tr>
              ) : staff.map(m => (
                <tr key={m._id} style={{ borderBottom: `1px solid ${abr}` }} className="transition-colors" onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=7C3AED&color=fff`} className="w-10 h-10 rounded-full" alt="" />
                      <span className="text-xs font-mono" style={{ color: amt }}>{m.staffId}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6"><p className="font-medium text-white text-sm">{m.name}</p><p className="text-xs" style={{ color: amt }}>{m.specialty}</p></td>
                  <td className="py-4 px-6 text-xs max-w-[200px]" style={{ color: amt }}>{m.workingDays.join(', ')}</td>
                  <td className="py-4 px-6 text-sm text-white">{m.workingHours.start} - {m.workingHours.end}<br/><span className="text-xs" style={{ color: amt }}>{m.slotDuration} min slots</span></td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={m.isActive ? { background: '#DCFCE7', color: '#16A34A' } : { background: '#374151', color: '#9CA3AF' }}>{m.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="py-4 px-6 flex items-center gap-3">
                    <button onClick={() => openModal(m)} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: amt }}><Edit2 size={16} /></button>
                    <button onClick={() => del(m._id)} className="p-2 rounded-lg transition-colors hover:bg-red-500/10"><Trash2 size={16} style={{ color: '#EF4444' }} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl shadow-2xl my-8" style={{ background: ac, border: `1px solid ${abr}` }}>
            <div className="flex justify-between items-center p-6" style={{ borderBottom: `1px solid ${abr}` }}>
              <h3 className="font-heading text-xl font-bold text-white">{editingId ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
              <button onClick={() => setShowModal(false)} style={{ color: amt }}><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm mb-1.5" style={{ color: amt }}>Full Name</label><input type="text" required className="custom-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div><label className="block text-sm mb-1.5" style={{ color: amt }}>Specialty</label><input type="text" required className="custom-input" value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} /></div>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: amt }}>Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(d => (
                    <button key={d} type="button" onClick={() => toggleDay(d)} className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors" style={form.workingDays.includes(d) ? { background: 'rgba(124,58,237,0.2)', color: '#A78BFA', borderColor: 'rgba(124,58,237,0.5)' } : { background: 'rgba(255,255,255,0.04)', color: amt, borderColor: 'transparent' }}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm mb-1.5" style={{ color: amt }}>Start Time</label><input type="time" required className="custom-input" value={form.workingHours.start} onChange={e => setForm({...form, workingHours: {...form.workingHours, start: e.target.value}})} /></div>
                <div><label className="block text-sm mb-1.5" style={{ color: amt }}>End Time</label><input type="time" required className="custom-input" value={form.workingHours.end} onChange={e => setForm({...form, workingHours: {...form.workingHours, end: e.target.value}})} /></div>
                <div><label className="block text-sm mb-1.5" style={{ color: amt }}>Slot Duration</label>
                  <select className="custom-input" value={form.slotDuration} onChange={e => setForm({...form, slotDuration: Number(e.target.value)})}>
                    {[15,30,45,60,90].map(v => <option key={v} value={v} style={{ background: '#0F0E17' }}>{v} mins</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActiveStaff" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 accent-[#7C3AED]" />
                <label htmlFor="isActiveStaff" className="text-sm font-medium text-white">Active (Bookable)</label>
              </div>
              <div className="pt-4 flex justify-end gap-3" style={{ borderTop: `1px solid ${abr}` }}>
                <button type="button" onClick={() => setShowModal(false)} className="py-2.5 px-5 rounded-xl text-sm font-medium border transition-colors" style={{ borderColor: abr, color: amt }}>Cancel</button>
                <button type="submit" className="py-2.5 px-6 rounded-xl text-sm font-heading font-semibold text-white" style={{ background: '#7C3AED' }}>{editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
