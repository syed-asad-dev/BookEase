import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const ac = '#1E1C2A', abr = 'rgba(255,255,255,0.06)', amt = '#9CA3AF';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ serviceName: '', duration: 30, price: 0, description: '', isActive: true });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setServices((await api.get('/services')).data); } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const openModal = (svc = null) => {
    if (svc) { setEditingId(svc._id); setForm({ serviceName: svc.serviceName, duration: svc.duration, price: svc.price, description: svc.description || '', isActive: svc.isActive }); }
    else { setEditingId(null); setForm({ serviceName: '', duration: 30, price: 0, description: '', isActive: true }); }
    setShowModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) { await api.put(`/services/${editingId}`, form); toast.success('Updated'); }
      else { await api.post('/services', form); toast.success('Created'); }
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try { await api.delete(`/services/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl font-bold text-white">Services</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 text-sm font-heading font-semibold py-2.5 px-5 rounded-xl text-white transition-all" style={{ background: '#7C3AED' }}><Plus size={16} /> Add Service</button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: ac, border: `1px solid ${abr}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['ID','Service Name','Duration','Price','Status','Actions'].map(h => (
                  <th key={h} className="py-3.5 px-6 text-xs font-body font-semibold uppercase tracking-wider" style={{ color: amt }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="py-12 text-center" style={{ color: amt }}><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan="6" className="py-12 text-center text-sm" style={{ color: amt }}>No services found.</td></tr>
              ) : services.map(svc => (
                <tr key={svc._id} style={{ borderBottom: `1px solid ${abr}` }} className="transition-colors" onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="py-4 px-6 text-sm font-mono" style={{ color: amt }}>{svc.serviceId}</td>
                  <td className="py-4 px-6 font-medium text-white text-sm">{svc.serviceName}</td>
                  <td className="py-4 px-6 text-sm text-white">{svc.duration} min</td>
                  <td className="py-4 px-6 text-sm font-semibold" style={{ color: '#7C3AED' }}>Rs. {svc.price}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={svc.isActive ? { background: '#DCFCE7', color: '#16A34A' } : { background: '#374151', color: '#9CA3AF' }}>
                      {svc.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex items-center gap-3">
                    <button onClick={() => openModal(svc)} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: amt }}><Edit2 size={16} /></button>
                    <button onClick={() => del(svc._id)} className="p-2 rounded-lg transition-colors hover:bg-red-500/10"><Trash2 size={16} style={{ color: '#EF4444' }} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl shadow-2xl" style={{ background: ac, border: `1px solid ${abr}` }}>
            <div className="flex justify-between items-center p-6" style={{ borderBottom: `1px solid ${abr}` }}>
              <h3 className="font-heading text-xl font-bold text-white">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={() => setShowModal(false)} style={{ color: amt }}><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div><label className="block text-sm mb-1.5" style={{ color: amt }}>Service Name</label><input type="text" required className="custom-input" value={form.serviceName} onChange={e => setForm({...form, serviceName: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm mb-1.5" style={{ color: amt }}>Duration (mins)</label><input type="number" required min="5" className="custom-input" value={form.duration} onChange={e => setForm({...form, duration: Number(e.target.value)})} /></div>
                <div><label className="block text-sm mb-1.5" style={{ color: amt }}>Price (Rs.)</label><input type="number" required min="0" className="custom-input" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} /></div>
              </div>
              <div><label className="block text-sm mb-1.5" style={{ color: amt }}>Description</label><textarea className="custom-input h-24" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 accent-[#7C3AED]" />
                <label htmlFor="isActive" className="text-sm font-medium text-white">Active</label>
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

export default Services;
