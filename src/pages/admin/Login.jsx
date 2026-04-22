import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CalendarCheck, Lock, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/admin/dashboard'); }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error('Please enter all fields');
    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      login(res.data.token, res.data.username);
      toast.success('Logged in successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#0F0E17' }}>
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md p-10 relative z-10 rounded-2xl"
        style={{ background: '#1E1C2A', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 0 60px rgba(124,58,237,0.15)' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', boxShadow: '0 8px 24px rgba(124,58,237,0.4)' }}>
            <CalendarCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white mb-2">Admin Panel Login</h1>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>Welcome back to BookEase</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm mb-1.5 ml-1" style={{ color: '#9CA3AF' }}>Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="w-5 h-5" style={{ color: '#4B5563' }} /></div>
              <input type="text" className="custom-input pl-11" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1.5 ml-1" style={{ color: '#9CA3AF' }}>Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="w-5 h-5" style={{ color: '#4B5563' }} /></div>
              <input type="password" className="custom-input pl-11" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl text-white font-heading font-semibold transition-all flex items-center justify-center gap-2 mt-2" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
