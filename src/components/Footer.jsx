import { Link } from 'react-router-dom';
import { CalendarCheck, MessageCircle, Globe, Mail } from 'lucide-react';

const Footer = () => (
  <footer id="contact" className="bg-[#1E1B4B] pt-16 pb-8 border-t-[3px] border-primary">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="bg-white/10 p-2 rounded-xl"><CalendarCheck className="text-primary-light w-5 h-5" /></div>
            <span className="font-heading font-bold text-xl text-white">Book<span className="text-primary-light">Ease</span></span>
          </Link>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">Your Time, Perfectly Scheduled. Smart scheduling for clinics, salons, and service businesses.</p>
          <div className="flex gap-3">
            {[MessageCircle, Globe, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary-light hover:bg-white/10 hover:border-primary-light/30 transition-all">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-3">
            <li><Link to="/" className="text-white/50 hover:text-primary-light transition-colors text-sm">Home</Link></li>
            <li><Link to="/booking" className="text-white/50 hover:text-primary-light transition-colors text-sm">Book Appointment</Link></li>
            <li><a href="#services" className="text-white/50 hover:text-primary-light transition-colors text-sm">Our Services</a></li>
            <li><a href="#specialists" className="text-white/50 hover:text-primary-light transition-colors text-sm">Specialists</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-white mb-5 text-sm uppercase tracking-wider">Services</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-white/50 hover:text-primary-light transition-colors text-sm">General Consultation</a></li>
            <li><a href="#" className="text-white/50 hover:text-primary-light transition-colors text-sm">Hair Cut & Style</a></li>
            <li><a href="#" className="text-white/50 hover:text-primary-light transition-colors text-sm">Deep Tissue Massage</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-3">
            <li className="text-white/50 text-sm">hello@bookease.com</li>
            <li className="text-white/50 text-sm">+1 (555) 123-4567</li>
            <li className="text-white/50 text-sm">123 Booking Avenue, NY 10012</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40">
        <p>&copy; {new Date().getFullYear()} BookEase. All rights reserved.</p>
        <Link to="/admin/login" className="mt-3 md:mt-0 hover:text-primary-light transition-colors">Admin Login</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
