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
  const [currentStep, setCurrentStep] = useState(0);
  
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientDetails, setClientDetails] = useState({
    name: '', phone: '', email: '', notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.filter(s => s.isActive))).catch(() => {});
    api.get('/staff').then(r => setStaff(r.data.filter(s => s.isActive))).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedStaff && selectedDate) {
      fetchSlots();
    }
  }, [selectedStaff, selectedDate]);

  const fetchSlots = async () => {
    setSlotsLoading(true);
    setSelectedTime(null);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await api.get(`/availability?staffId=${selectedStaff._id}&date=${dateStr}`);
      setAvailableSlots(res.data);
    } catch (error) {
      toast.error('Error fetching availability');
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && !selectedService) return toast.error('Please select a service');
    if (currentStep === 1 && !selectedStaff) return toast.error('Please select a specialist');
    if (currentStep === 2 && !selectedTime) return toast.error('Please select a time slot');
    setCurrentStep(p => Math.min(p + 1, steps.length - 1));
  };

  const handleBack = () => setCurrentStep(p => Math.max(p - 1, 0));

  const submitBooking = async () => {
    if (!clientDetails.name || !clientDetails.phone || !clientDetails.email) {
      return toast.error('Please fill in all required fields');
    }
    setLoading(true);
    try {
      const payload = {
        clientName: clientDetails.name,
        clientPhone: clientDetails.phone,
        clientEmail: clientDetails.email,
        service: selectedService._id,
        staff: selectedStaff._id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        notes: clientDetails.notes
      };
      const res = await api.post('/appointments', payload);
      setBookingConfirmed(res.data);
      toast.success('Appointment booked successfully!');
    } catch (error) {
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20 px-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card max-w-lg w-full p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute w-2 h-2 bg-accent rounded-full animate-ping" style={{
                  top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDuration: `${1 + Math.random() * 2}s`
                }} />
              ))}
            </div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </motion.div>
            <h2 className="font-heading text-3xl font-bold mb-2">Booking Confirmed! 🎉</h2>
            <p className="text-text-secondary mb-6">Your appointment has been successfully scheduled.</p>
            <div className="bg-bg-surface p-4 rounded-lg text-left mb-8 border border-gray-800">
              <p className="text-sm text-text-secondary mb-1">Reference Number</p>
              <p className="font-bold text-accent font-mono text-lg mb-4">{bookingConfirmed.bookingRef}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-secondary">Service</p>
                  <p className="font-medium text-white">{selectedService.serviceName}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Specialist</p>
                  <p className="font-medium text-white">{selectedStaff.name}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Date</p>
                  <p className="font-medium text-white">{new Date(bookingConfirmed.appointmentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Time</p>
                  <p className="font-medium text-white">{bookingConfirmed.appointmentTime}</p>
                </div>
              </div>
            </div>
            <button onClick={() => window.location.reload()} className="btn-primary w-full">Book Another Appointment</button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-28 pb-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-bg-surface -z-10 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
              
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-4 border-bg-dark ${i <= currentStep ? 'bg-primary text-white' : 'bg-bg-surface text-text-secondary'}`}>
                    {i < currentStep ? <CheckCircle2 size={18} /> : i + 1}
                  </div>
                  <span className={`text-xs mt-2 hidden sm:block ${i <= currentStep ? 'text-white' : 'text-text-secondary'}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 md:p-8 min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                {/* Step 1: Services */}
                {currentStep === 0 && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-6">Select a Service</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {services.map(svc => (
                        <div 
                          key={svc._id} 
                          onClick={() => setSelectedService(svc)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedService?._id === svc._id ? 'border-primary bg-primary/10' : 'border-bg-surface bg-bg-surface/50 hover:border-primary/50'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{svc.serviceName}</h3>
                            {selectedService?._id === svc._id && <CheckCircle2 className="text-primary w-5 h-5" />}
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-text-secondary flex items-center gap-1"><Clock size={14}/> {svc.duration} min</span>
                            <span className="text-accent font-semibold">Rs. {svc.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Specialist */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-6">Choose a Specialist</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {staff.map(stf => (
                        <div 
                          key={stf._id} 
                          onClick={() => setSelectedStaff(stf)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selectedStaff?._id === stf._id ? 'border-primary bg-primary/10' : 'border-bg-surface bg-bg-surface/50 hover:border-primary/50'}`}
                        >
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(stf.name)}&background=7C3AED&color=fff`} className="w-12 h-12 rounded-full" alt="" />
                          <div className="flex-1">
                            <h3 className="font-semibold">{stf.name}</h3>
                            <p className="text-sm text-text-secondary">{stf.specialty}</p>
                          </div>
                          {selectedStaff?._id === stf._id && <CheckCircle2 className="text-primary w-5 h-5" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Date & Time */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-6">Select Date & Time</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <Calendar 
                          onChange={setSelectedDate} 
                          value={selectedDate} 
                          minDate={new Date()}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Clock size={18} className="text-primary" /> Available Slots
                        </h3>
                        {slotsLoading ? (
                          <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                        ) : availableSlots.length === 0 ? (
                          <div className="bg-bg-surface p-4 rounded-lg text-center text-text-secondary">
                            No slots available for this date.
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
                            {availableSlots.map(time => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`py-2 px-1 text-sm rounded-lg border transition-all ${selectedTime === time ? 'bg-primary border-primary text-white' : 'border-bg-surface bg-bg-surface/50 text-text-secondary hover:border-primary hover:text-white'}`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Details */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-6">Your Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                      <div className="md:col-span-3 space-y-4">
                        <div>
                          <label className="block text-sm text-text-secondary mb-1">Full Name *</label>
                          <input type="text" className="custom-input" placeholder="John Doe" value={clientDetails.name} onChange={e => setClientDetails({...clientDetails, name: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-text-secondary mb-1">Phone *</label>
                            <input type="tel" className="custom-input" placeholder="+1 234 567 8900" value={clientDetails.phone} onChange={e => setClientDetails({...clientDetails, phone: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-sm text-text-secondary mb-1">Email *</label>
                            <input type="email" className="custom-input" placeholder="john@example.com" value={clientDetails.email} onChange={e => setClientDetails({...clientDetails, email: e.target.value})} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-text-secondary mb-1">Notes (Optional)</label>
                          <textarea className="custom-input min-h-[100px]" placeholder="Any special requests..." value={clientDetails.notes} onChange={e => setClientDetails({...clientDetails, notes: e.target.value})}></textarea>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div className="bg-bg-surface p-6 rounded-xl border border-gray-800 h-full">
                          <h3 className="font-heading font-semibold text-lg mb-4 text-white">Booking Summary</h3>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <CalendarIcon className="w-5 h-5 text-primary shrink-0 mt-0.5"/>
                              <div>
                                <p className="text-sm text-text-secondary">Service</p>
                                <p className="font-medium text-white">{selectedService?.serviceName}</p>
                                <p className="text-accent text-sm">Rs. {selectedService?.price}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <User className="w-5 h-5 text-primary shrink-0 mt-0.5"/>
                              <div>
                                <p className="text-sm text-text-secondary">Specialist</p>
                                <p className="font-medium text-white">{selectedStaff?.name}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5"/>
                              <div>
                                <p className="text-sm text-text-secondary">Date & Time</p>
                                <p className="font-medium text-white">{selectedDate?.toLocaleDateString()}</p>
                                <p className="font-medium text-white">{selectedTime}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-bg-surface flex justify-between items-center">
              {currentStep > 0 ? (
                <button onClick={handleBack} className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
                  <MoveLeft size={18} /> Back
                </button>
              ) : <div></div>}
              
              {currentStep < steps.length - 1 ? (
                <button onClick={handleNext} className="btn-primary flex items-center gap-2 py-2 px-6">
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button onClick={submitBooking} disabled={loading} className="btn-primary bg-success hover:bg-success/80 shadow-success/30 hover:shadow-success/50 flex items-center gap-2 py-2 px-8">
                  {loading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
