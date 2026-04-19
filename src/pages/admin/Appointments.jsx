import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments');
      // Sort newest date first
      const sorted = res.data.sort((a,b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
      setAppointments(sorted);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}`, { status });
      toast.success('Status updated');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment deleted');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to delete appointment');
    }
  };

  const filteredAppointments = appointments.filter(app => 
    app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.bookingRef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-heading text-2xl font-bold">Appointments</h2>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input 
            type="text" 
            className="custom-input pl-10 h-10 py-1 text-sm" 
            placeholder="Search by name or ref..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-bg-surface/50 text-text-secondary text-sm">
                <th className="py-4 px-6 font-medium">Ref No</th>
                <th className="py-4 px-6 font-medium">Client</th>
                <th className="py-4 px-6 font-medium">Service & Staff</th>
                <th className="py-4 px-6 font-medium">Date & Time</th>
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
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-text-secondary bg-bg-surface/20">No appointments found.</td>
                </tr>
              ) : filteredAppointments.map(app => (
                <tr key={app._id} className="border-b border-bg-surface last:border-0 hover:bg-bg-surface/20 transition-colors">
                  <td className="py-4 px-6 text-sm font-mono text-text-secondary">{app.bookingRef}</td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-white">{app.clientName}</p>
                    <p className="text-xs text-text-secondary">{app.clientPhone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium">{app.service?.serviceName || 'N/A'}</p>
                    <p className="text-xs text-text-secondary">By: {app.staff?.name || 'N/A'}</p>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {new Date(app.appointmentDate).toISOString().split('T')[0]} <br/> <span className="text-text-secondary">{app.appointmentTime}</span>
                  </td>
                  <td className="py-4 px-6">
                    <select 
                      className={`text-xs font-semibold rounded-full px-3 py-1 outline-none appearance-none cursor-pointer border ${
                        app.status === 'confirmed' ? 'bg-success/10 text-success border-success/30' :
                        app.status === 'pending' ? 'bg-warning/10 text-warning border-warning/30' :
                        app.status === 'completed' ? 'bg-primary/10 text-primary border-primary/30' :
                        'bg-danger/10 text-danger border-danger/30'
                      }`}
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                    >
                      <option value="pending" className="bg-bg-dark text-white">Pending</option>
                      <option value="confirmed" className="bg-bg-dark text-white">Confirmed</option>
                      <option value="completed" className="bg-bg-dark text-white">Completed</option>
                      <option value="cancelled" className="bg-bg-dark text-white">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <button onClick={() => handleDelete(app._id)} className="text-danger hover:text-danger/80 text-sm font-medium transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
