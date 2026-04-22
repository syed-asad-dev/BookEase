import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { CalendarCheck, Clock, UserCheck, Sparkles, Star, ChevronLeft, ChevronRight, LayoutGrid, CheckCircle2, Users } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../utils/api';

const testimonials = [
  { text: "Booked my appointment in under 2 minutes! Amazing experience.", author: "Sarah K.", role: "Client", rating: 5 },
  { text: "No more phone calls to book. BookEase is a game changer.", author: "Ahmed R.", role: "Business Owner", rating: 5 },
  { text: "The calendar is so intuitive. Love this system!", author: "Fatima N.", role: "Client", rating: 5 },
  { text: "Our clinic's bookings increased 3x after using BookEase.", author: "Dr. Hassan", role: "Clinic Admin", rating: 5 },
  { text: "Clean, fast, and professional. Highly recommend!", author: "Zara M.", role: "Salon Owner", rating: 5 },
];

const Home = () => {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const howRef = useRef(null);
  const servicesRef = useRef(null);
  const teamRef = useRef(null);
  const testimonialsRef = useRef(null);
  const howInView = useInView(howRef, { once: true, margin: "-100px" });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });

  useEffect(() => {
    api.get('/services').then(r => {
      const data = r.data || [];
      setServices(data.filter(s => s.isActive !== false));
    }).catch(() => {});
    api.get('/staff').then(r => {
      const data = r.data || [];
      setStaff(data.filter(s => s.isActive !== false));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(p => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg font-body text-text-dark relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-bg-blob rounded-full blur-[80px] opacity-70 blob-animate" />
        <div className="absolute top-[40%] -right-40 w-[450px] h-[450px] bg-bg-blob rounded-full blur-[90px] opacity-60 blob-animate-delayed" />
        <div className="absolute bottom-0 left-[30%] w-[400px] h-[400px] bg-bg-blob rounded-full blur-[100px] opacity-50 blob-animate" />
        {/* Scatter decorations */}
        <div className="absolute top-[15%] left-[8%] w-2 h-2 bg-primary/30 rounded-full" />
        <div className="absolute top-[25%] right-[12%] w-3 h-3 bg-primary/20 rounded-full" />
        <div className="absolute top-[60%] left-[5%] w-1.5 h-1.5 bg-primary/40 rounded-full" />
        <div className="absolute top-[75%] right-[8%] w-2 h-2 bg-primary-light/30 rounded-full" />
        {/* Sparkle shapes */}
        <svg className="absolute top-[20%] right-[20%] w-4 h-4 text-primary/20" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>
        </svg>
        <svg className="absolute top-[50%] left-[15%] w-3 h-3 text-primary/15" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>
        </svg>
        {/* Outline circles */}
        <div className="absolute top-[35%] left-[75%] w-8 h-8 rounded-full border border-primary/10" />
        <div className="absolute top-[80%] left-[60%] w-6 h-6 rounded-full border border-primary/15" />
        {/* Diamonds */}
        <div className="absolute top-[45%] right-[5%] w-3 h-3 bg-primary/10 rotate-45" />
        <div className="absolute top-[10%] left-[50%] w-2 h-2 bg-primary-light/15 rotate-45" />
      </div>

      <Navbar />

      {/* ======= HERO SECTION ======= */}
      <section className="relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* LEFT COLUMN */}
            <div className="flex-[3] text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary/15">
                  ✨ Smart Scheduling Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.15] mb-6 text-text-dark"
              >
                Redefine Your Client
                <br />
                Experience with
                <br />
                <span className="text-primary">Seamless Booking</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-text-gray text-lg max-w-lg mb-8 mx-auto lg:mx-0 leading-relaxed"
              >
                Unlock efficiency, delight customers, and grow with BookEase's elegant platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/booking" className="btn-primary-new text-base">
                  Get Started
                </Link>
                <a href="#how-it-works" className="btn-outline-new text-base">
                  Request Demo
                </a>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Floating UI mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-[2] relative w-full max-w-md lg:max-w-none"
            >
              <div className="relative w-full h-[380px] sm:h-[420px]">
                {/* Mini Calendar Card */}
                <div className="absolute top-0 left-0 sm:left-4 w-[220px] sm:w-[240px] bg-white rounded-2xl p-4 shadow-[0_8px_32px_rgba(124,58,237,0.12)] border border-border hero-float z-20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading font-semibold text-sm text-text-dark">Calendar</span>
                    <CalendarCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[10px] text-text-gray text-center mb-2">
                    {['S','M','T','W','T','F','S'].map((d,i) => <span key={i} className="font-semibold">{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[11px] text-center">
                    {[...Array(31)].map((_, i) => (
                      <span key={i} className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                        i === 14 ? 'bg-primary text-white font-bold' : 
                        i === 15 || i === 16 ? 'bg-primary/10 text-primary' : 'text-text-dark hover:bg-bg'
                      }`}>{i + 1}</span>
                    ))}
                  </div>
                </div>

                {/* Appointment Card */}
                <div className="absolute top-[140px] right-0 sm:right-2 w-[230px] sm:w-[250px] bg-white rounded-2xl p-4 shadow-[0_8px_32px_rgba(124,58,237,0.12)] border border-border hero-float-delayed z-30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CalendarCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-xs text-text-dark">Appointment</p>
                      <p className="text-[10px] text-text-gray">Today, 2:30 PM</p>
                    </div>
                  </div>
                  <div className="bg-bg rounded-xl p-3 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <img src="https://ui-avatars.com/api/?name=SK&background=7C3AED&color=fff&size=28&bold=true" className="w-7 h-7 rounded-full" alt="" />
                      <div>
                        <p className="text-xs font-semibold text-text-dark">Sarah Khan</p>
                        <p className="text-[10px] text-text-gray">Hair Cut & Style</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-primary font-semibold">
                      <Clock className="w-3 h-3" /> 45 min • Rs. 1,200
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-success/10 text-success font-semibold">
                      <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> Confirmed
                    </span>
                    <button className="text-[10px] text-primary font-semibold hover:underline">View details</button>
                  </div>
                </div>

                {/* User Profile Snippet */}
                <div className="absolute bottom-0 left-6 sm:left-10 w-[200px] bg-white rounded-2xl p-3 shadow-[0_8px_32px_rgba(124,58,237,0.12)] border border-border hero-float z-10" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <img src="https://ui-avatars.com/api/?name=AK&background=A78BFA&color=fff&size=36&bold=true" className="w-9 h-9 rounded-full border-2 border-primary/20" alt="" />
                    <div>
                      <p className="text-xs font-heading font-semibold text-text-dark">View profile</p>
                      <p className="text-[10px] text-text-gray">Dr. Ahmed Khan</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* STATS BAR */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 lg:mt-20 flex justify-center"
          >
            <div className="inline-flex flex-wrap justify-center items-center gap-0 bg-white/80 backdrop-blur-sm rounded-full px-6 sm:px-8 py-4 border border-primary/15 shadow-[0_4px_24px_rgba(124,58,237,0.08)]">
              {[
                { icon: '🕐', value: '15%', label: 'Time Saved' },
                { icon: '👥', value: '1,000+', label: 'Clients' },
                { icon: '⭐', value: '4.9', label: 'Rating' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex items-center gap-3 px-5 sm:px-8 py-1">
                    <span className="text-xl">{stat.icon}</span>
                    <div>
                      <p className="font-heading font-bold text-lg text-text-dark leading-tight">{stat.value}</p>
                      <p className="text-xs text-text-gray">{stat.label}</p>
                    </div>
                  </div>
                  {i < 2 && <div className="w-px h-10 bg-border" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======= SERVICES SECTION ======= */}
      <section id="services" ref={servicesRef} className="relative z-10 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-dark mb-4">Services</h2>
            <p className="text-text-gray max-w-lg mx-auto">Professional services tailored to your needs</p>
          </motion.div>

          {services.length === 0 ? (
            <p className="text-center text-text-gray">No services available yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card-white p-6 group hover:-translate-y-1 hover:border-primary/30 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                    <Sparkles className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-text-dark mb-2">{service.serviceName}</h3>
                  {service.description && (
                    <p className="text-text-gray text-sm mb-4 leading-relaxed">{service.description}</p>
                  )}
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <span className="text-text-gray text-xs flex items-center gap-1">
                      <Clock size={12} className="text-primary" /> {service.duration} min
                    </span>
                    <span className="text-primary font-bold text-base ml-auto">Rs. {service.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======= SPECIALISTS SECTION ======= */}
      <section id="specialists" ref={teamRef} className="relative z-10 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-dark mb-4">Specialists</h2>
            <p className="text-text-gray max-w-lg mx-auto">Expert professionals ready to serve you</p>
          </motion.div>

          {staff.length === 0 ? (
            <p className="text-center text-text-gray">No specialists added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member, i) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={teamInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="card-white p-6 text-center group hover:-translate-y-1 hover:border-primary/30"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=7C3AED&color=fff&size=80&bold=true&format=svg`}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary/20 group-hover:border-primary/50 transition-colors"
                  />
                  <h3 className="font-heading text-lg font-bold text-text-dark mb-1">{member.name}</h3>
                  <p className="text-text-gray text-sm mb-3">{member.specialty}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-success/10 text-success border border-success/20 font-semibold">
                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                    Available
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======= HOW IT WORKS SECTION ======= */}
      <section id="how-it-works" ref={howRef} className="relative z-10 py-20 md:py-28 bg-[#F5F0FF]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={howInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-dark mb-4">How It Works</h2>
            <p className="text-text-gray max-w-lg mx-auto">Three simple steps to get your appointment booked</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting dashed line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] border-t-2 border-dashed border-primary/25" />

            {[
              { num: '01', title: 'Choose Service', desc: 'Browse and pick the service you need from our wide range.', icon: LayoutGrid },
              { num: '02', title: 'Pick Date & Time', desc: 'Select your preferred date and choose from available time slots.', icon: CalendarCheck },
              { num: '03', title: 'Confirm & Relax', desc: 'Fill in your details, confirm the booking, and you\'re all set!', icon: CheckCircle2 },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={howInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="text-center relative z-10"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white flex items-center justify-center border-2 border-primary/20 shadow-[0_4px_20px_rgba(124,58,237,0.1)]">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <span className="text-5xl font-heading font-bold text-primary/10 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 select-none">{step.num}</span>
                <h3 className="font-heading text-lg font-bold text-text-dark mb-2">{step.title}</h3>
                <p className="text-text-gray text-sm max-w-xs mx-auto leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= TESTIMONIALS SECTION ======= */}
      <section ref={testimonialsRef} className="relative z-10 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-bold text-text-dark text-center mb-14"
          >
            What Our Clients Say
          </motion.h2>

          <div className="max-w-2xl mx-auto text-center relative min-h-[200px]">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className="card-white p-8 sm:p-10"
            >
              <div className="flex justify-center gap-1 mb-5">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-lg md:text-xl font-body leading-relaxed mb-6 text-text-dark/85">
                "{testimonials[currentTestimonial].text}"
              </p>
              <p className="font-heading font-bold text-text-dark">{testimonials[currentTestimonial].author}</p>
              <p className="text-text-gray text-sm">{testimonials[currentTestimonial].role}</p>
            </motion.div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentTestimonial(p => (p - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center text-text-gray hover:text-primary hover:border-primary transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`rounded-full transition-all ${i === currentTestimonial ? 'bg-primary w-6 h-2.5' : 'bg-border w-2.5 h-2.5 hover:bg-primary/40'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentTestimonial(p => (p + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center text-text-gray hover:text-primary hover:border-primary transition-all"
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
