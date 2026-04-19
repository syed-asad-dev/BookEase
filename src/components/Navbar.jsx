import { Link } from 'react-router-dom';
import { CalendarCheck } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-bg-dark/80 backdrop-blur-md border-b border-bg-surface py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
            <CalendarCheck className="text-primary w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-xl text-white tracking-wide">
            Book<span className="text-accent">Ease</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">How it Works</a>
          <a href="#services" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Services</a>
          <a href="#team" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Specialists</a>
          <Link to="/booking" className="btn-primary py-2 px-5 text-sm">Book Appointment</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
