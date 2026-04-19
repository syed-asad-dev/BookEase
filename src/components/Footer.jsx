import { Link } from 'react-router-dom';
import { CalendarCheck, Instagram, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A0A14] border-t border-bg-surface pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <CalendarCheck className="text-primary w-6 h-6" />
              <span className="font-heading font-bold text-xl text-white tracking-wide">
                Book<span className="text-accent">Ease</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm mb-6">
              Your Time, Perfectly Scheduled. Smart scheduling for clinics, salons, and service businesses.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center text-text-secondary hover:text-primary hover:bg-bg-surface transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center text-text-secondary hover:text-primary hover:bg-bg-surface transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center text-text-secondary hover:text-primary hover:bg-bg-surface transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-text-secondary hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/booking" className="text-text-secondary hover:text-white transition-colors text-sm">Book Appointment</Link></li>
              <li><a href="#services" className="text-text-secondary hover:text-white transition-colors text-sm">Our Services</a></li>
              <li><a href="#team" className="text-text-secondary hover:text-white transition-colors text-sm">Our Specialists</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-text-secondary hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-text-secondary hover:text-white transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-3">
              <li className="text-text-secondary text-sm">hello@bookease.com</li>
              <li className="text-text-secondary text-sm">+1 (555) 123-4567</li>
              <li className="text-text-secondary text-sm">123 Booking Avenue, NY 10012</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-bg-surface pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-text-secondary">
          <p>&copy; {new Date().getFullYear()} BookEase. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
