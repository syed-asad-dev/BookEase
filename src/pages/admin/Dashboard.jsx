import { useState, useEffect } from 'react';
import { ShoppingBag, Users, Calendar, ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    total: 0,
    pending: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/appointments');
      const apps = res.data;
      
      const todayStr = new Date().toISOString().split('T')[0];
      
      const todayApps = apps.filter(a => new Date(a.appointmentDate).toISOString().split('T')[0] === todayStr);
      const pendingApps = apps.filter(a => a.status === 'pending');
      
      // Rough week calculation
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekApps = apps.filter(a => new Date(a.appointmentDate) >= weekAgo);

      setStats({
        today: todayApps.length,
        week: weekApps.length,
        total: apps.length,
        pending: pendingApps.length
      });

      // Sort by latest created, take 10
      const recent = [...apps].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
      setRecentAppointments(recent);
    } catch (error) {
      console.error('Error fetching dashboard data for admin', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Today's Appointments", value: stats.today, icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "This Week", value: stats.week, icon: Clock, color: "text-primary", bg: "bg-primary/10" },
    { title: "Total Bookings", value: stats.total, icon: ShoppingBag, color: "text-success", bg: "bg-success/10" },
    { title: "Pending Confirmations", value: stats.pending, icon: Users, color: "text-accent", bg: "bg-accent/10" }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return <span className="px-2 py-1 bg-success/20 text-success rounded-full text-xs border border-success/20">Confirmed</span>;
      case 'pending': return <span className="px-2 py-1 bg-warning/20 text-warning rounded-full text-xs border border-warning/20">Pending</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-danger/20 text-danger rounded-full text-xs border border-danger/20">Cancelled</span>;
      case 'completed': return <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs border border-primary/20">Completed</span>;
      default: return null;
    }
  };

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-slate-700 rounded"></div></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="glass-card p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden mt-8">
        <div className="p-6 border-b border-bg-surface flex justify-between items-center">
          <h3 className="font-heading text-lg font-semibold">Recent Bookings</h3>
          <Link to="/admin/appointments" className="text-primary text-sm hover:underline flex items-center">
            View All <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-surface/50 text-text-secondary text-sm">
                <th className="py-4 px-6 font-medium">Ref No</th>
                <th className="py-4 px-6 font-medium">Client</th>
                <th className="py-4 px-6 font-medium">Service</th>
                <th className="py-4 px-6 font-medium">Date & Time</th>
                <th className="py-4 px-6 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-text-secondary">No recent bookings found.</td>
                </tr>
              ) : recentAppointments.map(app => (
                <tr key={app._id} className="border-b border-bg-surface last:border-0 hover:bg-bg-surface/20 transition-colors">
                  <td className="py-4 px-6 text-sm font-mono text-text-secondary">{app.bookingRef}</td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-white">{app.clientName}</p>
                    <p className="text-xs text-text-secondary">{app.clientPhone}</p>
                  </td>
                  <td className="py-4 px-6 text-sm">{app.service?.serviceName || 'N/A'}</td>
                  <td className="py-4 px-6 text-sm">
                    {new Date(app.appointmentDate).toISOString().split('T')[0]} <br/> <span className="text-text-secondary">{app.appointmentTime}</span>
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(app.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
