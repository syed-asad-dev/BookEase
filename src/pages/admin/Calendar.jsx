import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { X } from 'lucide-react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      const formattedEvents = res.data.map(app => {
        const dateStr = new Date(app.appointmentDate).toISOString().split('T')[0];
        const [hours, minutes] = app.appointmentTime.split(':');
        
        const start = new Date(dateStr);
        start.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
        
        // Duration from service, defaulting to 30 mins
        const duration = app.service?.duration || 30;
        const end = new Date(start.getTime() + duration * 60000);

        return {
          id: app._id,
          title: `${app.clientName} - ${app.service?.serviceName}`,
          start,
          end,
          resource: app,
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      toast.error('Failed to load appointments for calendar');
    } finally {
      setLoading(false);
    }
  };

  const getEventPropGetter = (event) => {
    let bgColor = '#3b82f6'; // primary
    const status = event.resource.status;
    if (status === 'confirmed') bgColor = '#10B981'; // success
    if (status === 'pending') bgColor = '#F59E0B'; // warning
    if (status === 'completed') bgColor = '#7C3AED'; // primary-purple
    if (status === 'cancelled') bgColor = '#EF4444'; // danger

    return {
      style: {
        backgroundColor: bgColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl font-bold">Calendar</h2>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-warning"></span> Pending</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-success"></span> Confirmed</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary"></span> Completed</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-danger"></span> Cancelled</div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 flex-1 min-h-[600px] text-white">
        <style>{`
          .rbc-calendar { font-family: 'DM Sans', sans-serif; }
          .rbc-header { padding: 10px 0; font-weight: 600; text-transform: uppercase; border-bottom: 1px border-bg-surface; }
          .rbc-today { background-color: rgba(124, 58, 237, 0.1) !important; }
          .rbc-off-range-bg { background-color: transparent !important; }
          .rbc-month-view, .rbc-time-view, .rbc-agenda-view { border-color: rgba(255,255,255,0.1); border-radius: 8px; }
          .rbc-day-bg + .rbc-day-bg, .rbc-month-row + .rbc-month-row, .rbc-header + .rbc-header, .rbc-time-content > * + * > * { border-color: rgba(255,255,255,0.1) !important; }
          .rbc-time-slot, .rbc-time-header.rbc-overflowing { border-color: rgba(255,255,255,0.1) !important; }
          .rbc-toolbar button { color: white; border-color: rgba(255,255,255,0.2); }
          .rbc-toolbar button:active, .rbc-toolbar button.rbc-active { background-color: rgba(124, 58, 237, 0.8) !important; border-color: transparent; }
          .rbc-event-content { font-size: 12px; }
          .rbc-time-header-content { border-left-color: rgba(255,255,255,0.1) !important; }
          .rbc-date-cell { padding: 4px; }
        `}</style>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', minHeight: 600 }}
          eventPropGetter={getEventPropGetter}
          onSelectEvent={evt => setSelectedEvent(evt.resource)}
          views={['month', 'week', 'day']}
        />
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-bg-surface w-full max-w-sm rounded-xl shadow-2xl relative overflow-hidden">
            <div className={`h-2 ${
                  selectedEvent.status === 'confirmed' ? 'bg-success' :
                  selectedEvent.status === 'pending' ? 'bg-warning' :
                  selectedEvent.status === 'completed' ? 'bg-primary' : 'bg-danger'
                }`} />
            <div className="p-6 relative">
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-text-secondary hover:text-white"><X size={20} /></button>
              <h3 className="font-heading text-xl font-bold mb-1">{selectedEvent.clientName}</h3>
              <p className="text-text-secondary text-sm mb-4">{selectedEvent.clientPhone} • {selectedEvent.clientEmail}</p>
              
              <div className="space-y-3 text-sm bg-bg-surface/50 p-4 rounded-lg border border-bg-surface mb-2">
                <div className="flex justify-between border-b border-bg-surface pb-2">
                  <span className="text-text-secondary">Service</span>
                  <span className="font-medium text-white">{selectedEvent.service?.serviceName}</span>
                </div>
                <div className="flex justify-between border-b border-bg-surface pb-2">
                  <span className="text-text-secondary">Staff</span>
                  <span className="font-medium text-white">{selectedEvent.staff?.name}</span>
                </div>
                <div className="flex justify-between border-b border-bg-surface pb-2">
                  <span className="text-text-secondary">Date & Time</span>
                  <span className="font-medium text-white">{new Date(selectedEvent.appointmentDate).toLocaleDateString()} at {selectedEvent.appointmentTime}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-text-secondary">Ref No</span>
                  <span className="font-mono text-accent">{selectedEvent.bookingRef}</span>
                </div>
              </div>
              {selectedEvent.notes && (
                <div className="mt-4">
                  <p className="text-xs text-text-secondary mb-1">Notes</p>
                  <p className="text-sm p-3 bg-bg-surface rounded-lg">{selectedEvent.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
