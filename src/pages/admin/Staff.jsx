import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: { start: '09:00', end: '17:00' },
    slotDuration: 30,
    isActive: true
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get('/staff');
      setStaff(res.data);
    } catch (error) {
      toast.error('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingId(member._id);
      setFormData({
        name: member.name,
        specialty: member.specialty,
        workingDays: member.workingDays || [],
        workingHours: member.workingHours || { start: '09:00', end: '17:00' },
        slotDuration: member.slotDuration || 30,
        isActive: member.isActive
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        specialty: '',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: { start: '09:00', end: '17:00' },
        slotDuration: 30,
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.workingDays.length === 0) return toast.error('Select at least one working day');
    try {
      if (editingId) {
        await api.put(`/staff/${editingId}`, formData);
        toast.success('Staff member updated');
      } else {
        await api.post('/staff', formData);
        toast.success('Staff member added');
      }
      setShowModal(false);
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving staff');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await api.delete(`/staff/${id}`);
      toast.success('Staff member deleted');
      fetchStaff();
    } catch (error) {
      toast.error('Error deleting staff member');
    }
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day) 
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl font-bold">Staff Members</h2>
        <button onClick={() => handleOpenModal()} className="btn-primary py-2 px-4 flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-bg-surface/50 text-text-secondary text-sm">
                <th className="py-4 px-6 font-medium">ID / Profile</th>
                <th className="py-4 px-6 font-medium">Name & Specialty</th>
                <th className="py-4 px-6 font-medium">Working Days</th>
                <th className="py-4 px-6 font-medium">Hours / Slot</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-text-secondary">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-text-secondary bg-bg-surface/20">No staff members found.</td>
                </tr>
              ) : staff.map(member => (
                <tr key={member._id} className="border-b border-bg-surface last:border-0 hover:bg-bg-surface/20 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=7C3AED&color=fff`} className="w-10 h-10 rounded-full" alt="" />
                      <span className="text-xs font-mono text-text-secondary">{member.staffId}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-xs text-text-secondary">{member.specialty}</p>
                  </td>
                  <td className="py-4 px-6 text-xs text-text-secondary max-w-[200px] truncate">
                    {member.workingDays.join(', ')}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {member.workingHours.start} - {member.workingHours.end} <br/>
                    <span className="text-xs text-text-secondary">{member.slotDuration} min slots</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${member.isActive ? 'bg-success/10 text-success border border-success/20' : 'bg-text-secondary/10 text-text-secondary border border-text-secondary/20'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex items-center gap-3">
                    <button onClick={() => handleOpenModal(member)} className="text-text-secondary hover:text-white transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(member._id)} className="text-text-secondary hover:text-danger transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-bg-card border border-bg-surface w-full max-w-2xl rounded-xl shadow-2xl relative my-8">
            <div className="flex justify-between items-center p-5 border-b border-bg-surface sticky top-0 bg-bg-card z-10 rounded-t-xl">
              <h3 className="font-heading text-xl font-bold">{editingId ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
              <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Full Name</label>
                  <input type="text" required className="custom-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Specialty</label>
                  <input type="text" required className="custom-input" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        formData.workingDays.includes(day) 
                        ? 'bg-primary/20 text-primary border-primary/50' 
                        : 'bg-bg-surface text-text-secondary border-transparent hover:border-text-secondary/30'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Start Time</label>
                  <input type="time" required className="custom-input py-2" value={formData.workingHours.start} onChange={e => setFormData({...formData, workingHours: {...formData.workingHours, start: e.target.value}})} />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">End Time</label>
                  <input type="time" required className="custom-input py-2" value={formData.workingHours.end} onChange={e => setFormData({...formData, workingHours: {...formData.workingHours, end: e.target.value}})} />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Slot Duration</label>
                  <select className="custom-input py-2" value={formData.slotDuration} onChange={e => setFormData({...formData, slotDuration: Number(e.target.value)})}>
                    <option value="15" className="bg-bg-dark">15 mins</option>
                    <option value="30" className="bg-bg-dark">30 mins</option>
                    <option value="45" className="bg-bg-dark">45 mins</option>
                    <option value="60" className="bg-bg-dark">60 mins</option>
                    <option value="90" className="bg-bg-dark">90 mins</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 rounded border-gray-700 bg-bg-surface focus:ring-primary accent-primary" />
                <label htmlFor="isActive" className="text-sm font-medium">Staff is Active (Bookable)</label>
              </div>

              <div className="pt-4 border-t border-bg-surface flex justify-end gap-3 sticky bottom-0 bg-bg-card -m-5 mt-0 p-5 rounded-b-xl border-t">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-6 text-sm">{editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
