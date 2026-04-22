import { Link } from 'react-router-dom';
import { CalendarCheck, MessageCircle, Globe, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-white border-t-2 border-primary/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 p-2 rounded-xl">
                <CalendarCheck className="text-primary w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xl text-text-dark tracking-tight">
                Book<span className="text-primary">Ease</span>
              </span>
            </Link>
            <p className="text-text-gray text-sm mb-6 leading-relaxed">
              Your Time, Perfectly Scheduled. Smart scheduling for clinics, salons, and service businesses.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-bg/80 border border-border flex items-center justify-center text-text-gray hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all">
                <MessageCircle size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg/80 border border-border flex items-center justify-center text-text-gray hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all">
                <Globe size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg/80 border border-border flex items-center justify-center text-text-gray hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-text-dark mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-text-gray hover:text-primary transition-colors text-sm">Home</Link></li>
              <li><Link to="/booking" className="text-text-gray hover:text-primary transition-colors text-sm">Book Appointment</Link></li>
              <li><a href="#services" className="text-text-gray hover:text-primary transition-colors text-sm">Our Services</a></li>
              <li><a href="#specialists" className="text-text-gray hover:text-primary transition-colors text-sm">Our Specialists</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold text-text-dark mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-text-gray hover:text-primary transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-text-gray hover:text-primary transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-text-dark mb-6">Contact Us</h4>
            <ul className="space-y-3">
              <li className="text-text-gray text-sm">hello@bookease.com</li>
              <li className="text-text-gray text-sm">+1 (555) 123-4567</li>
              <li className="text-text-gray text-sm">123 Booking Avenue, NY 10012</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-text-gray">
          <p>&copy; {new Date().getFullYear()} BookEase. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link to="/admin/login" className="hover:text-primary transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
