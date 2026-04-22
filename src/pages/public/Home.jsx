import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarCheck, Clock, UserCheck, Sparkles, Star, ChevronLeft, ChevronRight, LayoutGrid, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BgDecorations from '../../components/BgDecorations';
import api from '../../utils/api';

const fadeInLeft = { hidden: { x: -60, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } } };
const fadeInRight = { hidden: { x: 60, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } } };
const fadeInUp = { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
const vp = { once: true, amount: 0.2 };

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
  const [ct, setCt] = useState(0);

  useEffect(() => {
    api.get('/services').then(r => setServices((r.data || []).filter(s => s.isActive !== false))).catch(() => {});
    api.get('/staff').then(r => setStaff((r.data || []).filter(s => s.isActive !== false))).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCt(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-bg font-body text-text-dark">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-white pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="blob-1 -top-40 right-[-100px]" />
        <div className="blob-2 bottom-[-80px] left-[-60px]" />
        <BgDecorations />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 items-center">
            {/* LEFT */}
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={vp}>
              <span className="inline-flex items-center gap-2 bg-primary-pale text-primary text-sm font-heading font-semibold px-4 py-1.5 rounded-full mb-6">✨ Smart Scheduling Platform</span>
              <h1 className="font-heading font-[800] text-[40px] sm:text-[48px] lg:text-[52px] leading-[1.15] mb-6 text-text-dark">
                Redefine Your Client<br/>Experience with<br/><span className="text-primary">Seamless Booking</span>
              </h1>
              <p className="text-text-gray text-[17px] leading-[1.7] max-w-lg mb-8">Unlock efficiency, delight customers, and grow with BookEase's elegant platform.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/booking" className="btn-pub py-3 px-8 text-base">Get Started</Link>
                <a href="#how-it-works" className="btn-pub-outline py-3 px-8 text-base">Request Demo</a>
              </div>
            </motion.div>

            {/* RIGHT — Floating Mockup */}
            <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={vp} className="relative w-full h-[380px] sm:h-[420px] hidden sm:block">
              {/* Calendar Card */}
              <div className="absolute top-0 left-0 w-[230px] card-pub p-4 hero-float z-20 !hover:transform-none">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading font-semibold text-sm text-text-dark">Calendar</span>
                  <CalendarCheck className="w-4 h-4 text-primary" />
                </div>
                <div className="grid grid-cols-7 gap-1 text-[10px] text-text-gray text-center mb-2">
                  {['S','M','T','W','T','F','S'].map((d,i) => <span key={i} className="font-semibold">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1 text-[11px] text-center">
                  {[...Array(28)].map((_,i) => (
                    <span key={i} className={`w-6 h-6 flex items-center justify-center rounded-md ${
                      i === 14 ? 'bg-primary text-white font-bold' : i === 15 || i === 16 ? 'bg-primary-pale text-primary' : 'text-text-dark'
                    }`}>{i+1}</span>
                  ))}
                </div>
              </div>

              {/* Appointment Card */}
              <div className="absolute top-[130px] right-0 w-[240px] card-pub p-4 hero-float-d1 z-30 !hover:transform-none">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-primary-pale rounded-lg flex items-center justify-center"><CalendarCheck className="w-4 h-4 text-primary" /></div>
                  <div><p className="font-heading font-semibold text-xs text-text-dark">Appointment</p><p className="text-[10px] text-text-gray">Today, 2:30 PM</p></div>
                </div>
                <div className="bg-bg-section rounded-xl p-3 mb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <img src="https://ui-avatars.com/api/?name=SK&background=7C3AED&color=fff&size=28&bold=true" className="w-7 h-7 rounded-full" alt="" />
                    <div><p className="text-xs font-semibold text-text-dark">Sarah Khan</p><p className="text-[10px] text-text-gray">Hair Cut & Style</p></div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-primary font-semibold"><Clock className="w-3 h-3" /> 45 min • Rs. 1,200</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-semibold">● Confirmed</span>
                  <span className="text-[10px] text-primary font-semibold">View details</span>
                </div>
              </div>

              {/* Profile Snippet */}
              <div className="absolute bottom-4 left-8 w-[190px] card-pub p-3 hero-float-d2 z-10 !hover:transform-none">
                <div className="flex items-center gap-3">
                  <img src="https://ui-avatars.com/api/?name=AK&background=A78BFA&color=fff&size=36&bold=true" className="w-9 h-9 rounded-full border-2 border-primary-pale" alt="" />
                  <div><p className="text-xs font-heading font-semibold text-text-dark">View profile</p><p className="text-[10px] text-text-gray">Dr. Ahmed Khan</p></div>
                </div>
              </div>

              {/* Decorative elements around widget */}
              <div className="absolute top-[60px] right-[60px] w-2 h-2 rounded-full bg-primary-light/40" />
              <div className="absolute bottom-[80px] right-[40px] w-1.5 h-1.5 rounded-full bg-primary/30" />
              <svg className="absolute top-[10px] right-[120px] w-4 h-4 text-primary/20" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>
            </motion.div>
          </div>

          {/* STATS PILL */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp} className="mt-16 lg:mt-20 flex justify-center">
            <div className="inline-flex flex-wrap justify-center items-center bg-white rounded-full px-6 sm:px-12 py-5 border border-border" style={{ boxShadow: '0 4px 32px rgba(124,58,237,0.10)' }}>
              {[{ icon: '🕐', val: '15%', lbl: 'Time Saved' }, { icon: '👥', val: '1,000+', lbl: 'Clients' }, { icon: '⭐', val: '4.9', lbl: 'Rating' }].map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex items-center gap-3 px-6 sm:px-10">
                    <span className="text-2xl">{s.icon}</span>
                    <div><p className="font-heading font-bold text-xl text-text-dark leading-tight">{s.val}</p><p className="text-xs text-text-gray">{s.lbl}</p></div>
                  </div>
                  {i < 2 && <div className="w-px h-10 bg-border" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="services" className="relative py-20 md:py-28 bg-bg-section overflow-hidden">
        <BgDecorations />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp} className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-[40px] font-bold text-text-dark mb-3">Services</h2>
            <p className="text-text-gray max-w-md mx-auto">Professional services tailored to your needs</p>
          </motion.div>
          {services.length === 0 ? (
            <p className="text-center text-text-gray">No services available yet. Check back soon!</p>
          ) : (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(svc => (
                <motion.div key={svc._id} variants={fadeInUp} className="card-pub p-7">
                  <div className="w-12 h-12 rounded-xl bg-primary-pale flex items-center justify-center mb-4"><Sparkles className="text-primary w-5 h-5" /></div>
                  <h3 className="font-heading font-semibold text-lg text-text-dark">{svc.serviceName}</h3>
                  {svc.description && <p className="text-text-gray text-sm mt-2 leading-relaxed">{svc.description}</p>}
                  <div className="flex items-center mt-4 pt-4 border-t border-border">
                    <span className="bg-primary-pale text-primary text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"><Clock size={12} /> {svc.duration} min</span>
                    <span className="font-heading font-bold text-primary ml-auto text-lg">Rs. {svc.price}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative py-20 md:py-28 bg-white overflow-hidden">
        <BgDecorations />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp} className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-[40px] font-bold text-text-dark mb-3">How It Works</h2>
            <p className="text-text-gray max-w-md mx-auto">Three simple steps to get your appointment booked</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp} className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] border-t-2 border-dashed border-primary-light/40" />
            {[
              { num: '01', title: 'Choose Service', desc: 'Browse and pick the service you need.', icon: LayoutGrid },
              { num: '02', title: 'Pick Date & Time', desc: 'Select your preferred date and available slot.', icon: CalendarCheck },
              { num: '03', title: 'Confirm & Relax', desc: 'Fill in details, confirm, and you\'re set!', icon: CheckCircle2 },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center relative z-10">
                <span className="text-[64px] font-heading font-[800] text-primary-pale leading-none select-none">{s.num}</span>
                <div className="w-16 h-16 mx-auto -mt-6 mb-4 rounded-full bg-primary flex items-center justify-center shadow-[0_4px_20px_rgba(124,58,237,0.3)]">
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-text-dark mb-2">{s.title}</h3>
                <p className="text-text-gray text-sm max-w-xs mx-auto leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ SPECIALISTS ═══ */}
      <section id="specialists" className="relative py-20 md:py-28 bg-bg-section overflow-hidden">
        <BgDecorations />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp} className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-[40px] font-bold text-text-dark mb-3">Specialists</h2>
            <p className="text-text-gray max-w-md mx-auto">Expert professionals ready to serve you</p>
          </motion.div>
          {staff.length === 0 ? (
            <p className="text-center text-text-gray">No specialists added yet.</p>
          ) : (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map(m => (
                <motion.div key={m._id} variants={fadeInUp} className="card-pub p-6 text-center">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=7C3AED&color=fff&size=80&bold=true&format=svg`} alt={m.name} className="w-20 h-20 rounded-full mx-auto mb-3 border-[3px] border-primary-pale" />
                  <h3 className="font-heading font-semibold text-lg text-text-dark">{m.name}</h3>
                  <p className="text-text-gray text-sm mt-1">{m.specialty}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A] font-semibold mt-3">● Available</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="relative py-20 md:py-28 bg-white overflow-hidden">
        <div className="blob-1 top-[-60px] right-[-80px]" />
        <BgDecorations />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={vp} className="font-heading text-3xl md:text-[40px] font-bold text-text-dark text-center mb-14">What Our Clients Say</motion.h2>
          <div className="max-w-[700px] mx-auto text-center relative">
            <span className="text-[80px] font-heading text-primary-pale absolute -top-8 left-4 select-none leading-none">&ldquo;</span>
            <motion.div key={ct} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="card-pub p-10 sm:p-12 !hover:transform-none">
              <div className="flex justify-center gap-1 mb-5">{[...Array(testimonials[ct].rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-accent fill-accent" />)}</div>
              <p className="text-lg md:text-xl font-body italic leading-relaxed text-text-dark/85 mb-6">"{testimonials[ct].text}"</p>
              <p className="font-heading font-bold text-text-dark">{testimonials[ct].author}</p>
              <p className="text-text-gray text-sm">{testimonials[ct].role}</p>
            </motion.div>
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={() => setCt(p => (p - 1 + testimonials.length) % testimonials.length)} className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center text-text-gray hover:text-primary hover:border-primary transition-all"><ChevronLeft size={18} /></button>
              <div className="flex gap-2 items-center">{testimonials.map((_, i) => <button key={i} onClick={() => setCt(i)} className={`rounded-full transition-all ${i === ct ? 'bg-primary w-6 h-2.5' : 'bg-border w-2.5 h-2.5 hover:bg-primary/40'}`} />)}</div>
              <button onClick={() => setCt(p => (p + 1) % testimonials.length)} className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center text-text-gray hover:text-primary hover:border-primary transition-all"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
