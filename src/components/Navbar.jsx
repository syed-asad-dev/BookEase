import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarCheck, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scroll = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${
      scrolled ? 'bg-white/90 backdrop-blur-[12px] border-border shadow-[0_2px_20px_rgba(124,58,237,0.06)]' : 'bg-white/60 backdrop-blur-sm border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-[64px]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-primary-pale p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
            <CalendarCheck className="text-primary w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-xl text-text-dark">Book<span className="text-primary">Ease</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            ['how-it-works', 'How it Works'],
            ['services', 'Services'],
            ['specialists', 'Specialists'],
            ['contact', 'Contact'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => scroll(id)} className="text-sm font-body font-medium text-text-gray hover:text-primary transition-colors cursor-pointer">{label}</button>
          ))}
          <Link to="/booking" className="btn-pub py-2.5 px-6 text-sm">Book Now</Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-text-dark">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 space-y-2">
          {[['how-it-works','How it Works'],['services','Services'],['specialists','Specialists'],['contact','Contact']].map(([id,label]) => (
            <button key={id} onClick={() => scroll(id)} className="block w-full text-left text-sm font-medium text-text-gray hover:text-primary py-2">{label}</button>
          ))}
          <Link to="/booking" onClick={() => setMobileOpen(false)} className="block w-full text-center btn-pub py-2.5 mt-2 text-sm">Book Now</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
