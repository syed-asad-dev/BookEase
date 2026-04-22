import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import toast from 'react-hot-toast';
import { CheckCircle2, ChevronRight, User, Calendar as CalendarIcon, Clock, MoveLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const steps = ['Service', 'Specialist', 'Date & Time', 'Details'];

const Booking = () => {
  const [cs, setCs] = useState(0);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selSvc, setSelSvc] = useState(null);
  const [selStf, setSelStf] = useState(null);
  const [selDate, setSelDate] = useState(new Date());
  const [selTime, setSelTime] = useState(null);
  const [client, setClient] = useState({ name: '', phone: '', email: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    api.get('/services').then(r => setServices((r.data||[]).filter(s => s.isActive !== false))).catch(() => {});
    api.get('/staff').then(r => setStaff((r.data||[]).filter(s => s.isActive !== false))).catch(() => {});
  }, []);

  useEffect(() => { if (selStf && selDate) fetchSlots(); }, [selStf, selDate]);

  const fetchSlots = async () => {
    setSlotsLoading(true); setSelTime(null);
    try {
      const res = await api.get(`/availability?staffId=${selStf._id}&date=${selDate.toISOString().split('T')[0]}`);
      setSlots(res.data);
    } catch { toast.error('Error fetching availability'); }
    finally { setSlotsLoading(false); }
  };

  const next = () => {
    if (cs === 0 && !selSvc) return toast.error('Please select a service');
    if (cs === 1 && !selStf) return toast.error('Please select a specialist');
    if (cs === 2 && !selTime) return toast.error('Please select a time slot');
    setCs(p => Math.min(p + 1, steps.length - 1));
  };

  const submit = async () => {
    if (!client.name || !client.phone || !client.email) return toast.error('Please fill in all required fields');
    setLoading(true);
    try {
      const res = await api.post('/appointments', { clientName: client.name, clientPhone: client.phone, clientEmail: client.email, service: selSvc._id, staff: selStf._id, appointmentDate: selDate, appointmentTime: selTime, notes: client.notes });
      setConfirmed(res.data); toast.success('Appointment booked successfully!');
    } catch { toast.error('Failed to book appointment'); }
    finally { setLoading(false); }
  };

  if (confirmed) return (
    <div className="min-h-screen bg-bg-section flex flex-col font-body text-text-dark">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-20 px-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-pub max-w-lg w-full p-8 text-center !hover:transform-none">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-24 h-24 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12 text-[#16A34A]" /></motion.div>
          <h2 className="font-heading text-3xl font-bold mb-2">Booking Confirmed! 🎉</h2>
          <p className="text-text-gray mb-6">Your appointment has been successfully scheduled.</p>
          <div className="bg-bg-section p-4 rounded-xl text-left mb-8 border border-border">
            <p className="text-sm text-text-gray mb-1">Reference Number</p>
            <p className="font-bold text-primary font-mono text-lg mb-4">{confirmed.bookingRef}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-text-gray">Service</p><p className="font-medium text-text-dark">{selSvc.serviceName}</p></div>
              <div><p className="text-text-gray">Specialist</p><p className="font-medium text-text-dark">{selStf.name}</p></div>
              <div><p className="text-text-gray">Date</p><p className="font-medium text-text-dark">{new Date(confirmed.appointmentDate).toLocaleDateString()}</p></div>
              <div><p className="text-text-gray">Time</p><p className="font-medium text-text-dark">{confirmed.appointmentTime}</p></div>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="btn-pub w-full py-3">Book Another Appointment</button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );

  const inputCls = "w-full bg-white border border-border rounded-xl px-4 py-3 text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body";

  return (
    <div className="min-h-screen bg-bg-section flex flex-col font-body text-text-dark">
      <Navbar />
      <div className="flex-1 pt-28 pb-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-border -z-10 -translate-y-1/2 rounded-full" />
              <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-300" style={{ width: `${(cs / (steps.length - 1)) * 100}%` }} />
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-4 border-bg-section ${i <= cs ? 'bg-primary text-white shadow-[0_0_12px_rgba(124,58,237,0.3)]' : 'bg-white text-text-gray'}`}>
                    {i < cs ? <CheckCircle2 size={18} /> : i + 1}
                  </div>
                  <span className={`text-xs mt-2 hidden sm:block font-heading font-semibold ${i <= cs ? 'text-primary' : 'text-text-gray'}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-pub p-6 md:p-8 min-h-[400px] flex flex-col !hover:transform-none">
            <AnimatePresence mode="wait">
              <motion.div key={cs} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex-1">
                {cs === 0 && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-6">Select a Service</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {services.map(svc => (
                        <div key={svc._id} onClick={() => setSelSvc(svc)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selSvc?._id === svc._id ? 'border-primary bg-primary-pale/30' : 'border-border bg-white hover:border-primary-light'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-heading font-semibold">{svc.serviceName}</h3>
                            {selSvc?._id === svc._id && <CheckCircle2 className="text-primary w-5 h-5" />}
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-text-gray flex items-center gap-1"><Clock size={14} className="text-primary" /> {svc.duration} min</span>
                            <span className="text-primary font-heading font-bold">Rs. {svc.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {cs === 1 && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-6">Choose a Specialist</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {staff.map(s => (
                        <div key={s._id} onClick={() => setSelStf(s)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selStf?._id === s._id ? 'border-primary bg-primary-pale/30' : 'border-border bg-white hover:border-primary-light'}`}>
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=7C3AED&color=fff`} className="w-12 h-12 rounded-full" alt="" />
                          <div className="flex-1"><h3 className="font-heading font-semibold">{s.name}</h3><p className="text-sm text-text-gray">{s.specialty}</p></div>
                          {selStf?._id === s._id && <CheckCircle2 className="text-primary w-5 h-5" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {cs === 2 && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-6">Select Date & Time</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <Calendar onChange={setSelDate} value={selDate} minDate={new Date()} />
                      <div>
                        <h3 className="font-heading font-semibold mb-4 flex items-center gap-2"><Clock size={18} className="text-primary" /> Available Slots</h3>
                        {slotsLoading ? <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
                         : slots.length === 0 ? <div className="bg-bg-section p-4 rounded-xl text-center text-text-gray border border-border">No slots available.</div>
                         : <div className="grid grid-cols-3 gap-3">{slots.map(t => (
                            <button key={t} onClick={() => setSelTime(t)} className={`py-2.5 text-sm rounded-xl border font-medium transition-all ${selTime === t ? 'bg-primary border-primary text-white' : 'border-border bg-white text-text-gray hover:border-primary hover:text-primary'}`}>{t}</button>
                          ))}</div>}
                      </div>
                    </div>
                  </div>
                )}
                {cs === 3 && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-6">Your Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                      <div className="md:col-span-3 space-y-4">
                        <div><label className="block text-sm text-text-gray mb-1.5 font-medium">Full Name *</label><input type="text" className={inputCls} placeholder="John Doe" value={client.name} onChange={e => setClient({...client, name: e.target.value})} /></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div><label className="block text-sm text-text-gray mb-1.5 font-medium">Phone *</label><input type="tel" className={inputCls} placeholder="+1 234 567 8900" value={client.phone} onChange={e => setClient({...client, phone: e.target.value})} /></div>
                          <div><label className="block text-sm text-text-gray mb-1.5 font-medium">Email *</label><input type="email" className={inputCls} placeholder="john@example.com" value={client.email} onChange={e => setClient({...client, email: e.target.value})} /></div>
                        </div>
                        <div><label className="block text-sm text-text-gray mb-1.5 font-medium">Notes (Optional)</label><textarea className={`${inputCls} min-h-[100px]`} placeholder="Any special requests..." value={client.notes} onChange={e => setClient({...client, notes: e.target.value})} /></div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="bg-bg-section p-6 rounded-2xl border border-border h-full">
                          <h3 className="font-heading font-semibold text-lg mb-4">Booking Summary</h3>
                          <div className="space-y-4">
                            {[[CalendarIcon, 'Service', selSvc?.serviceName, `Rs. ${selSvc?.price}`], [User, 'Specialist', selStf?.name], [Clock, 'Date & Time', selDate?.toLocaleDateString(), selTime]].map(([Icon, lbl, v1, v2], i) => (
                              <div key={i} className="flex items-start gap-3"><Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" /><div><p className="text-sm text-text-gray">{lbl}</p><p className="font-medium text-text-dark">{v1}</p>{v2 && <p className="text-primary text-sm font-semibold">{v2}</p>}</div></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
              {cs > 0 ? <button onClick={() => setCs(p => p - 1)} className="flex items-center gap-2 text-text-gray hover:text-primary transition-colors font-medium"><MoveLeft size={18} /> Back</button> : <div />}
              {cs < steps.length - 1 ? <button onClick={next} className="btn-pub flex items-center gap-2 py-2.5 px-6">Next <ChevronRight size={18} /></button>
               : <button onClick={submit} disabled={loading} className="bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-semibold py-2.5 px-8 rounded-full transition-all shadow-[0_4px_14px_rgba(22,163,74,0.3)] flex items-center gap-2">{loading ? 'Confirming...' : 'Confirm Booking'}</button>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;
