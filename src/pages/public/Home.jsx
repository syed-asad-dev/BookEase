import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { CalendarCheck, Clock, UserCheck, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../utils/api';

const testimonials = [
  { text: "Booked my appointment in under 2 minutes! Amazing experience.", author: "Sarah K.", rating: 5 },
  { text: "No more phone calls to book. BookEase is a game changer.", author: "Ahmed R.", rating: 5 },
  { text: "The calendar is so intuitive. Love this system!", author: "Fatima N.", rating: 5 },
  { text: "Our clinic's bookings increased 3x after using BookEase.", author: "Dr. Hassan", rating: 5 },
  { text: "Clean, fast, and professional. Highly recommend!", author: "Zara M.", rating: 5 },
];

const Home = () => {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const howRef = useRef(null);
  const servicesRef = useRef(null);
  const teamRef = useRef(null);
  const howInView = useInView(howRef, { once: true, margin: "-100px" });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.filter(s => s.isActive))).catch(() => {});
    api.get('/staff').then(r => setStaff(r.data.filter(s => s.isActive))).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(p => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] via-[#0D0D1A] to-[#0a1628]" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '4s' }} />
          {/* Floating orbs */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/40 rounded-full"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                animation: `float ${6 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Book Your Appointment
            <br />
            <span className="text-accent">In Seconds.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-text-secondary text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          >
            Smart scheduling for clinics, salons, and service businesses.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/booking" className="btn-primary text-lg py-4 px-8">
              Book Now
            </Link>
            <a href="#services" className="btn-outline text-lg py-4 px-8">
              View Services
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 inline-flex flex-wrap justify-center gap-0 glass-card px-2 py-2 sm:px-4 sm:py-3 rounded-full"
          >
            {[
              { label: '500+ Bookings', icon: CalendarCheck },
              { label: '50+ Services', icon: Sparkles },
              { label: '4.9★ Rating', icon: Star },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 px-4 sm:px-6 py-2">
                <stat.icon className="text-accent w-5 h-5" />
                <span className="text-sm font-medium text-white whitespace-nowrap">{stat.label}</span>
                {i < 2 && <div className="hidden sm:block w-px h-6 bg-bg-surface ml-4" />}
              </div>
            ))}
          </motion.div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
            25% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
            50% { transform: translateY(-10px) translateX(-5px); opacity: 0.6; }
            75% { transform: translateY(-25px) translateX(15px); opacity: 0.9; }
          }
        `}</style>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" ref={howRef} className="py-24 bg-[#0A0A14]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={howInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-accent">Works</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">Three simple steps to get your appointment booked</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting dashed line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] border-t-2 border-dashed border-primary/30" />

            {[
              { num: '01', title: 'Choose Your Service', desc: 'Browse through our wide range of services and pick the one you need.', icon: CalendarCheck },
              { num: '02', title: 'Pick a Date & Time', desc: 'Select your preferred date and choose from available time slots.', icon: Clock },
              { num: '03', title: 'Confirm & Relax', desc: 'Fill in your details, confirm the booking, and you\'re all set!', icon: UserCheck },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={howInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="text-center relative z-10"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/30 to-primary-dark/30 flex items-center justify-center border border-primary/40">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <span className="text-5xl font-heading font-bold text-primary/20 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 select-none">{step.num}</span>
                <h3 className="font-heading text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-text-secondary text-sm max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" ref={servicesRef} className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-accent">Services</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">Professional services tailored to your needs</p>
          </motion.div>

          {services.length === 0 ? (
            <p className="text-center text-text-secondary">No services available yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card p-6 group hover:-translate-y-2 hover:shadow-[0_8px_40px_rgba(124,58,237,0.25)] cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-5">
                    <Sparkles className="text-white w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{service.serviceName}</h3>
                  {service.description && (
                    <p className="text-text-secondary text-sm mb-4">{service.description}</p>
                  )}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="bg-bg-surface text-text-secondary text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock size={12} /> {service.duration} min
                    </span>
                    <span className="text-accent font-semibold text-lg">Rs. {service.price}</span>
                  </div>
                  <Link
                    to="/booking"
                    className="w-full inline-block text-center btn-primary py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Book Now
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" ref={teamRef} className="py-24 bg-[#0A0A14]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Meet Our <span className="text-accent">Specialists</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">Expert professionals ready to serve you</p>
          </motion.div>

          {staff.length === 0 ? (
            <p className="text-center text-text-secondary">No team members available yet.</p>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
              {staff.map((member, i) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={teamInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="glass-card p-6 text-center min-w-[280px] snap-center flex-shrink-0 group hover:-translate-y-2 transition-all"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=7C3AED&color=fff&size=128&bold=true&format=svg`}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary/40 group-hover:border-accent transition-colors"
                  />
                  <h3 className="font-heading text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-text-secondary text-sm mb-3">{member.specialty}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-success/10 text-success border border-success/20 mb-4">
                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                    Available
                  </span>
                  <div className="mt-2">
                    <Link to="/booking" className="btn-primary py-2 px-4 text-sm w-full inline-block text-center">
                      Book with {member.name.split(' ')[0]}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/20 to-bg-dark" />
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-16">
            What Our <span className="text-accent">Clients Say</span>
          </h2>

          <div className="max-w-2xl mx-auto text-center relative min-h-[200px]">
            <span className="text-8xl text-primary/20 font-heading absolute -top-8 left-0 select-none">&ldquo;</span>

            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className="pt-8"
            >
              <p className="text-xl md:text-2xl font-body leading-relaxed mb-6 text-white/90">
                {testimonials[currentTestimonial].text}
              </p>
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-text-secondary font-medium">— {testimonials[currentTestimonial].author}</p>
            </motion.div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentTestimonial(p => (p - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-bg-surface flex items-center justify-center text-text-secondary hover:text-white hover:border-primary transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentTestimonial ? 'bg-primary w-6' : 'bg-bg-surface'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentTestimonial(p => (p + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-bg-surface flex items-center justify-center text-text-secondary hover:text-white hover:border-primary transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
