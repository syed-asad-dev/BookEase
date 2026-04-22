import { useState, useEffect } from 'react';
import { Calendar, Clock, ShoppingBag, Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const ab = '#0F0E17', ac = '#1E1C2A', abr = 'rgba(255,255,255,0.06)', amt = '#9CA3AF';

const Dashboard = () => {
  const [stats, setStats] = useState({ today: 0, week: 0, total: 0, pending: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/appointments');
      const apps = res.data;
      const todayStr = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      setStats({
        today: apps.filter(a => new Date(a.appointmentDate).toISOString().split('T')[0] === todayStr).length,
        week: apps.filter(a => new Date(a.appointmentDate) >= weekAgo).length,
        total: apps.length,
        pending: apps.filter(a => a.status === 'pending').length,
      });
      setRecent([...apps].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const cards = [
    { title: "Today's Appointments", value: stats.today, icon: Calendar, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    { title: 'This Week', value: stats.week, icon: Clock, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
    { title: 'Total Bookings', value: stats.total, icon: ShoppingBag, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { title: 'Pending', value: stats.pending, icon: Users, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  ];

  const badge = (s) => {
    const m = { confirmed: ['#DCFCE7','#16A34A'], pending: ['#FEF3C7','#D97706'], cancelled: ['#FEE2E2','#EF4444'], completed: ['rgba(124,58,237,0.2)','#A78BFA'] };
    const [bg, c] = m[s] || ['#374151','#9CA3AF'];
    return <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: bg, color: c }}>{s?.charAt(0).toUpperCase() + s?.slice(1)}</span>;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#7C3AED', borderTopColor: 'transparent' }} /></div>;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <div key={i} className="p-6 rounded-2xl transition-all hover:border-l-4" style={{ background: ac, border: `1px solid ${abr}`, '--hover-border': c.color }} onMouseEnter={e => e.currentTarget.style.borderLeftColor = c.color} onMouseLeave={e => e.currentTarget.style.borderLeftColor = abr}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl" style={{ background: c.bg }}><c.icon className="w-5 h-5" style={{ color: c.color }} /></div>
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: amt }}>{c.title}</p>
            <p className="text-3xl font-heading font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl overflow-hidden" style={{ background: ac, border: `1px solid ${abr}` }}>
        <div className="p-6 flex justify-between items-center" style={{ borderBottom: `1px solid ${abr}` }}>
          <h3 className="font-heading text-lg font-semibold text-white">Recent Bookings</h3>
          <Link to="/admin/appointments" className="text-sm flex items-center gap-1 hover:underline" style={{ color: '#7C3AED' }}>View All <ArrowUpRight className="w-4 h-4" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Ref No', 'Client', 'Service', 'Date & Time', 'Status'].map(h => (
                  <th key={h} className="py-3.5 px-6 text-xs font-body font-semibold uppercase tracking-wider" style={{ color: amt }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-sm" style={{ color: amt }}>No recent bookings found.</td></tr>
              ) : recent.map(a => (
                <tr key={a._id} className="transition-colors" style={{ borderBottom: `1px solid ${abr}` }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="py-4 px-6 text-sm font-mono" style={{ color: amt }}>{a.bookingRef}</td>
                  <td className="py-4 px-6"><p className="font-medium text-white text-sm">{a.clientName}</p><p className="text-xs" style={{ color: amt }}>{a.clientPhone}</p></td>
                  <td className="py-4 px-6 text-sm text-white">{a.service?.serviceName || 'N/A'}</td>
                  <td className="py-4 px-6 text-sm"><span className="text-white">{new Date(a.appointmentDate).toLocaleDateString()}</span><br /><span style={{ color: amt }}>{a.appointmentTime}</span></td>
                  <td className="py-4 px-6">{badge(a.status)}</td>
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
