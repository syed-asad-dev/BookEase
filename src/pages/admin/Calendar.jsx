import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { X } from 'lucide-react';

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: { 'en-US': enUS } });
const ac = '#1E1C2A', abr = 'rgba(255,255,255,0.06)', amt = '#9CA3AF';

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await api.get('/appointments');
      setEvents(res.data.map(a => {
        const d = new Date(a.appointmentDate).toISOString().split('T')[0];
        const [h, m] = a.appointmentTime.split(':');
        const start = new Date(d); start.setHours(+h, +m, 0);
        const end = new Date(start.getTime() + (a.service?.duration || 30) * 60000);
        return { id: a._id, title: `${a.clientName} - ${a.service?.serviceName}`, start, end, resource: a };
      }));
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const eventStyle = (e) => {
    const m = { confirmed: '#10B981', pending: '#F59E0B', completed: '#7C3AED', cancelled: '#EF4444' };
    return { style: { backgroundColor: m[e.resource.status] || '#3b82f6', borderRadius: '6px', border: '0', color: '#fff', fontSize: '12px' } };
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="font-heading text-2xl font-bold text-white">Calendar</h2>
        <div className="flex gap-4 text-xs font-medium" style={{ color: amt }}>
          {[['#F59E0B','Pending'],['#10B981','Confirmed'],['#7C3AED','Completed'],['#EF4444','Cancelled']].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: c }} />{l}</div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-4 flex-1 min-h-[600px]" style={{ background: ac, border: `1px solid ${abr}` }}>
        <style>{`
          .rbc-calendar { font-family: 'Nunito', sans-serif; color: #fff; }
          .rbc-header { padding: 10px 0; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; color: ${amt}; border-bottom: 1px solid ${abr}; }
          .rbc-today { background-color: rgba(124,58,237,0.08) !important; }
          .rbc-off-range-bg { background-color: transparent !important; }
          .rbc-month-view, .rbc-time-view, .rbc-agenda-view { border-color: ${abr}; border-radius: 12px; overflow: hidden; }
          .rbc-day-bg + .rbc-day-bg, .rbc-month-row + .rbc-month-row, .rbc-header + .rbc-header, .rbc-time-content > * + * > * { border-color: ${abr} !important; }
          .rbc-time-slot, .rbc-time-header.rbc-overflowing { border-color: ${abr} !important; }
          .rbc-toolbar button { color: #fff; border-color: ${abr}; border-radius: 8px; font-family: 'Sora', sans-serif; font-weight: 600; font-size: 13px; padding: 6px 14px; }
          .rbc-toolbar button:hover { background-color: rgba(124,58,237,0.15) !important; }
          .rbc-toolbar button:active, .rbc-toolbar button.rbc-active { background-color: #7C3AED !important; border-color: transparent; }
          .rbc-event-content { font-size: 11px; font-weight: 600; }
          .rbc-time-header-content { border-left-color: ${abr} !important; }
          .rbc-date-cell { padding: 4px 6px; color: ${amt}; font-size: 13px; }
          .rbc-date-cell.rbc-now { color: #7C3AED; font-weight: 700; }
          .rbc-label { color: ${amt}; font-size: 11px; }
          .rbc-toolbar-label { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 18px; }
          .rbc-show-more { color: #7C3AED; font-weight: 600; font-size: 11px; }
        `}</style>
        <BigCalendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: '100%', minHeight: 600 }} eventPropGetter={eventStyle} onSelectEvent={e => setSel(e.resource)} views={['month','week','day']} />
      </div>

      {sel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden" style={{ background: ac, border: `1px solid ${abr}` }}>
            <div className="h-2" style={{ background: { confirmed: '#10B981', pending: '#F59E0B', completed: '#7C3AED', cancelled: '#EF4444' }[sel.status] || '#3b82f6' }} />
            <div className="p-6 relative">
              <button onClick={() => setSel(null)} className="absolute top-4 right-4" style={{ color: amt }}><X size={20} /></button>
              <h3 className="font-heading text-xl font-bold text-white mb-1">{sel.clientName}</h3>
              <p className="text-sm mb-4" style={{ color: amt }}>{sel.clientPhone} • {sel.clientEmail}</p>
              <div className="space-y-3 text-sm p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${abr}` }}>
                {[['Service', sel.service?.serviceName], ['Staff', sel.staff?.name], ['Date & Time', `${new Date(sel.appointmentDate).toLocaleDateString()} at ${sel.appointmentTime}`], ['Ref No', sel.bookingRef]].map(([l,v], i) => (
                  <div key={i} className="flex justify-between" style={i < 3 ? { borderBottom: `1px solid ${abr}`, paddingBottom: '0.75rem' } : {}}>
                    <span style={{ color: amt }}>{l}</span>
                    <span className={`font-medium ${l === 'Ref No' ? 'font-mono' : ''}`} style={{ color: l === 'Ref No' ? '#F59E0B' : '#fff' }}>{v}</span>
                  </div>
                ))}
              </div>
              {sel.notes && <div className="mt-4"><p className="text-xs mb-1" style={{ color: amt }}>Notes</p><p className="text-sm p-3 rounded-lg text-white" style={{ background: 'rgba(255,255,255,0.03)' }}>{sel.notes}</p></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
