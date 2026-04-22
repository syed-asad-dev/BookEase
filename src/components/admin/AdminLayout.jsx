import { useContext } from 'react';
import { Outlet, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar as CalIcon, Users, Sparkles, LogOut, CalendarCheck, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', path: '/admin/appointments', icon: CalIcon },
  { name: 'Calendar', path: '/admin/calendar', icon: CalIcon },
  { name: 'Services', path: '/admin/services', icon: Sparkles },
  { name: 'Staff', path: '/admin/staff', icon: Users },
];

const pageTitle = {
  '/admin/dashboard': 'Dashboard',
  '/admin/appointments': 'Appointments',
  '/admin/calendar': 'Calendar',
  '/admin/services': 'Services',
  '/admin/staff': 'Staff',
};

const AdminLayout = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white" style={{ background: '#0F0E17' }}>Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="flex h-screen overflow-hidden admin-scroll" style={{ background: '#0F0E17', color: '#FFFFFF' }}>
      {/* Sidebar */}
      <aside className="w-[260px] hidden md:flex flex-col shrink-0" style={{ background: '#1A1825', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-[64px] flex items-center px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <CalendarCheck className="w-5 h-5 mr-2" style={{ color: '#7C3AED' }} />
          <span className="font-heading font-bold text-lg text-white">Book<span style={{ color: '#7C3AED' }}>Ease</span></span>
        </div>
        <p className="px-6 pt-3 pb-4 text-xs uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Admin Panel</p>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'text-white border-l-[3px]' : 'border-l-[3px] border-transparent'
              }`
            } style={({ isActive }) => isActive ? { background: 'rgba(124,58,237,0.15)', borderLeftColor: '#7C3AED' } : { color: '#9CA3AF' }}>
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-red-500/10" style={{ color: '#EF4444' }}>
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[64px] flex items-center justify-between px-6 md:px-8 shrink-0" style={{ background: '#0F0E17', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 md:hidden">
            <CalendarCheck className="w-5 h-5" style={{ color: '#7C3AED' }} />
            <span className="font-heading font-bold">BookEase</span>
          </div>
          <h1 className="font-heading font-bold text-xl hidden md:block">{pageTitle[location.pathname] || 'Admin'}</h1>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Bell className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            </button>
            <div className="flex items-center gap-3">
              <img src="https://ui-avatars.com/api/?name=Admin&background=7C3AED&color=fff&size=32&bold=true" className="w-8 h-8 rounded-full" alt="" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-tight">Admin</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Administrator</p>
              </div>
            </div>
            <button onClick={handleLogout} className="md:hidden" style={{ color: '#9CA3AF' }}><LogOut className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto py-2 px-2 gap-1.5 shrink-0" style={{ background: '#1A1825', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-colors ${isActive ? 'text-white' : ''}`
            } style={({ isActive }) => isActive ? { background: 'rgba(124,58,237,0.2)', color: '#fff' } : { color: '#9CA3AF' }}>
              <item.icon className="w-4 h-4" />{item.name}
            </NavLink>
          ))}
        </div>

        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll">
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
