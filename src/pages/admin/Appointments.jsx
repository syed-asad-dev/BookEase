import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Loader2, Trash2 } from 'lucide-react';
import api from '../../utils/api';

const ac = '#1E1C2A', abr = 'rgba(255,255,255,0.06)', amt = '#9CA3AF';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    setLoading(true);
    try { const r = await api.get('/appointments'); setAppointments(r.data.sort((a,b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))); }
    catch { toast.error('Failed to load appointments'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try { await api.patch(`/appointments/${id}`, { status }); toast.success('Status updated'); fetch(); }
    catch { toast.error('Failed to update'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try { await api.delete(`/appointments/${id}`); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = appointments.filter(a => a.clientName.toLowerCase().includes(search.toLowerCase()) || a.bookingRef.toLowerCase().includes(search.toLowerCase()));

  const statusStyle = (s) => {
    const m = { confirmed: { bg: '#DCFCE7', c: '#16A34A' }, pending: { bg: '#FEF3C7', c: '#D97706' }, cancelled: { bg: '#FEE2E2', c: '#EF4444' }, completed: { bg: 'rgba(124,58,237,0.2)', c: '#A78BFA' } };
    return m[s] || { bg: '#374151', c: '#9CA3AF' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-heading text-2xl font-bold text-white">Appointments</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: amt }} />
          <input type="text" className="custom-input pl-10 h-10 text-sm" placeholder="Search by name or ref..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: ac, border: `1px solid ${abr}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Ref No','Client','Service & Staff','Date & Time','Status','Actions'].map(h => (
                  <th key={h} className="py-3.5 px-6 text-xs font-body font-semibold uppercase tracking-wider" style={{ color: amt }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="py-12 text-center" style={{ color: amt }}><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="py-12 text-center text-sm" style={{ color: amt }}>No appointments found.</td></tr>
              ) : filtered.map(a => {
                const st = statusStyle(a.status);
                return (
                  <tr key={a._id} className="transition-colors" style={{ borderBottom: `1px solid ${abr}` }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="py-4 px-6 text-sm font-mono" style={{ color: amt }}>{a.bookingRef}</td>
                    <td className="py-4 px-6"><p className="font-medium text-white text-sm">{a.clientName}</p><p className="text-xs" style={{ color: amt }}>{a.clientPhone}</p></td>
                    <td className="py-4 px-6"><p className="text-sm text-white">{a.service?.serviceName || 'N/A'}</p><p className="text-xs" style={{ color: amt }}>By: {a.staff?.name || 'N/A'}</p></td>
                    <td className="py-4 px-6 text-sm"><span className="text-white">{new Date(a.appointmentDate).toLocaleDateString()}</span><br/><span style={{ color: amt }}>{a.appointmentTime}</span></td>
                    <td className="py-4 px-6">
                      <select value={a.status} onChange={e => updateStatus(a._id, e.target.value)}
                        className="text-xs font-semibold rounded-full px-3 py-1.5 outline-none cursor-pointer border-0"
                        style={{ background: st.bg, color: st.c }}>
                        {['pending','confirmed','completed','cancelled'].map(s => <option key={s} value={s} style={{ background: '#0F0E17', color: '#fff' }}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <button onClick={() => del(a._id)} className="p-2 rounded-lg transition-colors hover:bg-red-500/10"><Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
