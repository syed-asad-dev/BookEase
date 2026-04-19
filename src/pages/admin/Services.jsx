import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    serviceName: '',
    duration: 30,
    price: 0,
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingId(service._id);
      setFormData({
        serviceName: service.serviceName,
        duration: service.duration,
        price: service.price,
        description: service.description || '',
        isActive: service.isActive
      });
    } else {
      setEditingId(null);
      setFormData({ serviceName: '', duration: 30, price: 0, description: '', isActive: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, formData);
        toast.success('Service updated');
      } else {
        await api.post('/services', formData);
        toast.success('Service created');
      }
      setShowModal(false);
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving service');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted');
      fetchServices();
    } catch (error) {
      toast.error('Passed deleting service');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl font-bold">Services</h2>
        <button onClick={() => handleOpenModal()} className="btn-primary py-2 px-4 flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-surface/50 text-text-secondary text-sm">
                <th className="py-4 px-6 font-medium">ID</th>
                <th className="py-4 px-6 font-medium">Service Name</th>
                <th className="py-4 px-6 font-medium">Duration</th>
                <th className="py-4 px-6 font-medium">Price</th>
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
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-text-secondary bg-bg-surface/20">No services found. Add one to get started.</td>
                </tr>
              ) : services.map(svc => (
                <tr key={svc._id} className="border-b border-bg-surface last:border-0 hover:bg-bg-surface/20 transition-colors">
                  <td className="py-4 px-6 text-sm font-mono text-text-secondary">{svc.serviceId}</td>
                  <td className="py-4 px-6 font-medium text-white">{svc.serviceName}</td>
                  <td className="py-4 px-6 text-sm">{svc.duration} min</td>
                  <td className="py-4 px-6 text-sm text-accent font-semibold">Rs. {svc.price}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${svc.isActive ? 'bg-success/10 text-success border border-success/20' : 'bg-text-secondary/10 text-text-secondary border border-text-secondary/20'}`}>
                      {svc.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex items-center gap-3">
                    <button onClick={() => handleOpenModal(svc)} className="text-text-secondary hover:text-white transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(svc._id)} className="text-text-secondary hover:text-danger transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-bg-surface w-full max-w-lg rounded-xl shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-bg-surface">
              <h3 className="font-heading text-xl font-bold">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Service Name</label>
                <input type="text" required className="custom-input" value={formData.serviceName} onChange={e => setFormData({...formData, serviceName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Duration (mins)</label>
                  <input type="number" required min="5" className="custom-input" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Price (Rs.)</label>
                  <input type="number" required min="0" className="custom-input" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Description (Optional)</label>
                <textarea className="custom-input h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 rounded border-gray-700 bg-bg-surface focus:ring-primary accent-primary" />
                <label htmlFor="isActive" className="text-sm font-medium">Service is Active</label>
              </div>
              <div className="pt-4 border-t border-bg-surface flex justify-end gap-3">
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

export default Services;
