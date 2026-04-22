import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarCheck, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Determine if we're on a public light page or admin/booking dark page
  const isPublicPage = location.pathname === '/' || location.pathname === '/booking';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-[0_2px_16px_rgba(124,58,237,0.06)]' 
        : 'bg-white/70 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <CalendarCheck className="text-primary w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-xl text-text-dark tracking-tight">
            Book<span className="text-primary">Ease</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-text-gray hover:text-primary transition-colors cursor-pointer">How it Works</button>
          <button onClick={() => scrollToSection('services')} className="text-sm font-medium text-text-gray hover:text-primary transition-colors cursor-pointer">Services</button>
          <button onClick={() => scrollToSection('specialists')} className="text-sm font-medium text-text-gray hover:text-primary transition-colors cursor-pointer">Specialists</button>
          <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-text-gray hover:text-primary transition-colors cursor-pointer">Contact</button>
          <Link to="/booking" className="bg-primary hover:bg-primary-dark text-white font-semibold text-sm py-2.5 px-6 rounded-full transition-all duration-300 shadow-[0_2px_10px_rgba(124,58,237,0.25)] hover:shadow-[0_4px_16px_rgba(124,58,237,0.4)]">
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-text-dark">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 space-y-3">
          <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left text-sm font-medium text-text-gray hover:text-primary py-2">How it Works</button>
          <button onClick={() => scrollToSection('services')} className="block w-full text-left text-sm font-medium text-text-gray hover:text-primary py-2">Services</button>
          <button onClick={() => scrollToSection('specialists')} className="block w-full text-left text-sm font-medium text-text-gray hover:text-primary py-2">Specialists</button>
          <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-sm font-medium text-text-gray hover:text-primary py-2">Contact</button>
          <Link to="/booking" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-primary text-white font-semibold text-sm py-2.5 rounded-full mt-2">
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
