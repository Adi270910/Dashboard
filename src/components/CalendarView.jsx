import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Activity, ChevronRight, Stethoscope, User, Calendar, Loader2, CheckCircle2, MessageCircle, Info, Phone, ClipboardList, ChevronLeft } from 'lucide-react';
import { format, addDays, startOfToday, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function CalendarView({ 
  bookings, 
  doctors, 
  setBookingDoctor, 
  bookingDoctor, 
  isConfirming, 
  handleBookAppointment,
  onContactDoctor 
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [currentMonth, setCurrentMonth] = useState(startOfToday());

  // Calendar Logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarDays = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const isDoctorAvailableOnDate = (doctor, date) => {
    const dayOfWeek = format(date, 'eee');
    // Simple check: match day name (Mon, Tue...) or Mon-Fri
    return doctor.availability.includes(dayOfWeek) || 
           (doctor.availability === 'Mon-Fri' && !['Sat', 'Sun'].includes(dayOfWeek));
  };

  const availableDoctors = doctors.filter(doc => isDoctorAvailableOnDate(doc, selectedDate));

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="view-container calendar-view"
    >
      {/* Grid Based Calendar Wrapper */}
      <div className="calendar-full-wrapper">
        <div className="calendar-header-main">
          <h3 className="section-title-icon m-0">
             <Calendar size={20} className="color-primary" /> Book Your Visit
          </h3>
          <div className="month-controls">
            <button onClick={prevMonth} className="icon-btn-ghost"><ChevronLeft size={20} /></button>
            <span className="current-month-display">{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={nextMonth} className="icon-btn-ghost rotate-180"><ChevronLeft size={20} /></button>
          </div>
        </div>

        <div className="calendar-grid-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="calendar-day-label">{d}</div>
          ))}
        </div>

        <div className="calendar-days-grid">
          {/* Pad the start of month */}
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`pad-${i}`} className="calendar-day-empty" />
          ))}

          {calendarDays.map((day, idx) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, startOfToday());
            const isPast = day < startOfToday() && !isToday;

            return (
              <button 
                key={idx}
                disabled={isPast}
                onClick={() => setSelectedDate(day)}
                className={`calendar-day-btn ${isSelected ? 'active' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
              >
                <span className="day-num">{format(day, 'd')}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="calendar-grid">
        {/* Appointments List */}
        <div className="appointments-section">
          <h3 className="section-title-icon">
             <Clock className="color-primary" size={20} /> Your Scheduled Visits
          </h3>
          <div className="appointments-list">
            {bookings.length > 0 ? bookings.map(booking => {
              const isExpanded = expandedId === booking.id;
              const doctor = doctors.find(d => d.id === booking.doctorId);

              return (
                <div key={booking.id} className={`appointment-card-wrapper ${isExpanded ? 'active-expansion' : ''}`}>
                  <div className="appointment-card">
                    <div className="date-badge">
                      <span className="date-month">{booking.date.split('-')[1]}</span>
                      <span className="date-day">{booking.date.split('-')[2]}</span>
                    </div>
                    <div className="appointment-info">
                      <div className="info-row-top">
                        <h4 className="doc-name">{booking.doctorName}</h4>
                        <span className="pill pill-indigo">{booking.status}</span>
                      </div>
                      <p className="info-row-bottom">
                        <span className="info-meta"><Clock size={14} /> {booking.time}</span>
                        <span className="info-meta"><Activity size={14} /> Outpatient (OPD)</span>
                      </p>
                      {booking.status === 'Confirmed' && !isExpanded && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onContactDoctor?.(booking);
                          }}
                          className="contact-doc-btn"
                        >
                          <MessageCircle size={14} /> Contact Doctor
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={() => toggleExpand(booking.id)}
                      className={`icon-btn-ghost ${isExpanded ? 'rotate-90 color-primary' : ''}`}
                    >
                       <ChevronRight size={20} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="expansion-details"
                      >
                        <div className="expansion-inner">
                          <div className="detail-item">
                            <User size={14} className="color-primary" />
                            <div>
                              <p className="detail-label">Patient</p>
                              <p className="detail-val">{booking.patientName} (ID: {booking.patientId})</p>
                            </div>
                          </div>
                          <div className="detail-item">
                            <ClipboardList size={14} className="color-primary" />
                            <div>
                              <p className="detail-label">Reason for Visit</p>
                              <p className="detail-val">{booking.reason || 'General Follow-up'}</p>
                            </div>
                          </div>
                          {doctor && (
                            <div className="detail-item">
                              <Phone size={14} className="color-primary" />
                              <div>
                                <p className="detail-label">Doctor Contact</p>
                                <p className="detail-val">{doctor.contact || 'N/A'}</p>
                              </div>
                            </div>
                          )}
                          <div className="expansion-actions">
                            <button 
                              onClick={() => onContactDoctor?.(booking)}
                              className="btn btn-primary btn-small"
                            >
                              <MessageCircle size={14} /> Message Doctor
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }) : (
              <div className="empty-mini-state">
                <Calendar size={32} className="color-light" style={{ opacity: 0.5 }} />
                <p>No upcoming visits scheduled.</p>
              </div>
            )}
          </div>
        </div>

        {/* Doctor Discovery */}
        <div className="discovery-section">
          <h3 className="section-title-icon">
             <Stethoscope className="color-primary" size={20} /> Specialists Available on {format(selectedDate, 'MMM d')}
          </h3>
          <div className="discovery-list">
            {availableDoctors.length > 0 ? availableDoctors.map(doc => (
              <div key={doc.id} className="doctor-mini-card">
                <div className="doctor-info-basic">
                   <div className="avatar-circle-icon">
                     <User size={20} />
                   </div>
                   <div>
                     <h5 className="doctor-title">{doc.name}</h5>
                     <p className="doctor-specialty">{doc.specialization}</p>
                   </div>
                </div>
                <div className="doctor-card-footer">
                   <span className="timings-label">Timings: {doc.opdTimings.split('-')[0]}</span>
                   <button 
                     onClick={() => setBookingDoctor(doc)}
                     className="btn-text-action"
                   >
                     Quick Book
                   </button>
                </div>
              </div>
            )) : (
              <div className="empty-mini-state">
                <Info size={32} className="color-amber" />
                <p>No specialists matching your selection are available today.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {bookingDoctor && (
          <motion.div 
            key="booking-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="modal-content"
            >
              <div className="modal-inner">
                <div className="modal-icon-header">
                  <Calendar size={32} />
                </div>
                <h3 className="modal-title">Confirm Appointment</h3>
                <p className="modal-subtitle">
                  You are requesting a consultation with <span className="text-bold">{bookingDoctor.name}</span>.
                </p>
                
                <div className="modal-data-box">
                  <div className="data-row">
                    <span className="data-label">Specialization</span>
                    <span className="data-value">{bookingDoctor.specialization}</span>
                  </div>
                  <div className="data-row">
                    <span className="data-label">Proposed Slot</span>
                    <span className="data-value">{format(selectedDate, 'd MMM yyyy')}, 10:30 AM</span>
                  </div>
                  <div className="data-row">
                    <span className="data-label">Consultation Type</span>
                    <span className="data-value data-italic">Standard In-Person (OPD)</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    onClick={() => setBookingDoctor(null)}
                    disabled={isConfirming}
                    className="btn btn-secondary"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={() => handleBookAppointment(format(selectedDate, 'yyyy-MM-dd'))}
                    disabled={isConfirming}
                    className="btn btn-primary"
                  >
                    {isConfirming ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    Confirm Book
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
