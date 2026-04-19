import { useContext } from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar as CalendarIcon, Users, Sparkles, LogOut, CalendarCheck } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen bg-bg-dark flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/admin/appointments', icon: CalendarIcon },
    { name: 'Calendar', path: '/admin/calendar', icon: CalendarIcon },
    { name: 'Services', path: '/admin/services', icon: Sparkles },
    { name: 'Staff', path: '/admin/staff', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-bg-dark overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A14] border-r border-bg-surface flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-bg-surface">
          <CalendarCheck className="text-primary w-6 h-6 mr-2" />
          <span className="font-heading font-bold text-xl text-white tracking-wide">
            Book<span className="text-accent">Ease</span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent' 
                  : 'text-text-secondary hover:text-white hover:bg-bg-surface'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
        <div className="p-4 border-t border-bg-surface">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-8 border-b border-bg-surface bg-bg-dark/50 backdrop-blur-sm z-10">
          <h1 className="font-heading font-semibold text-xl text-white hidden md:block">Admin Panel</h1>
          
          {/* Mobile header view */}
          <div className="md:hidden flex items-center gap-2">
            <CalendarCheck className="text-primary w-5 h-5" />
            <span className="font-heading font-bold">BookEase</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-text-secondary hidden sm:block">Admin User</span>
              <img src="https://ui-avatars.com/api/?name=Admin&background=5B21B6&color=fff" alt="Admin" className="w-8 h-8 rounded-full border border-primary/30" />
            </div>
            <button onClick={handleLogout} className="md:hidden text-text-secondary hover:text-white">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto border-b border-bg-surface bg-[#0A0A14] scrollbar-hide py-2 px-2 gap-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-text-secondary'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
