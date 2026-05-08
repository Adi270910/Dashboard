import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Calendar, FileText, TrendingUp, Clock, AlertCircle, Sparkles, Bell, ShoppingBag, ArrowRight, CreditCard, Smartphone, Building2, X, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const DASHBOARD_VITALS = [
  { day: 'Mon', val: 72 },
  { day: 'Tue', val: 75 },
  { day: 'Wed', val: 68 },
  { day: 'Thu', val: 80 },
  { day: 'Fri', val: 74 },
  { day: 'Sat', val: 71 },
  { day: 'Sun', val: 72 },
];

const PaymentModal = ({ pkg, onClose, onPaymentSuccess }) => {
  const [method, setMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPaymentSuccess(pkg);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="modal-content max-w-400"
      >
        <div className="modal-inner p-24">
          <div className="flex justify-between items-center mb-20">
            <h3 className="modal-title m-0 text-xl font-bold">Secure Checkout</h3>
            <button onClick={onClose} className="icon-btn-ghost"><X size={20} /></button>
          </div>
          
          <div className="bg-main p-16 rounded-2xl mb-24 border border-color">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-light font-bold uppercase">Package Selected</span>
            </div>
            <div className="flex justify-between items-end">
              <h4 className="font-bold text-lg">{pkg.name}</h4>
              <span className="text-xl font-black color-primary">{pkg.price}</span>
            </div>
          </div>

          <div className="space-y-12 mb-32">
             <p className="text-xs font-bold text-muted uppercase px-4">Choose Payment Method</p>
             <button 
              onClick={() => setMethod('upi')}
              className={`option-item w-full flex items-center gap-12 p-16 rounded-2xl border transition-all ${method === 'upi' ? 'border-primary bg-primary-light' : 'border-color bg-white'}`}
             >
                <Smartphone className={method === 'upi' ? 'color-primary' : 'text-muted'} size={20} />
                <div className="text-left">
                   <p className={`font-bold text-sm ${method === 'upi' ? 'color-primary' : ''}`}>UPI Payment</p>
                   <p className="text-[10px] text-light">Google Pay, PhonePe, Paytm</p>
                </div>
                {method === 'upi' && <CheckCircle2 size={16} className="color-primary ml-auto" />}
             </button>

             <button 
              onClick={() => setMethod('card')}
              className={`option-item w-full flex items-center gap-12 p-16 rounded-2xl border transition-all ${method === 'card' ? 'border-primary bg-primary-light' : 'border-color bg-white'}`}
             >
                <CreditCard className={method === 'card' ? 'color-primary' : 'text-muted'} size={20} />
                <div className="text-left">
                   <p className={`font-bold text-sm ${method === 'card' ? 'color-primary' : ''}`}>Credit / Debit Card</p>
                   <p className="text-[10px] text-light">Visa, Mastercard, RuPay</p>
                </div>
                {method === 'card' && <CheckCircle2 size={16} className="color-primary ml-auto" />}
             </button>

             <button 
              onClick={() => setMethod('net')}
              className={`option-item w-full flex items-center gap-12 p-16 rounded-2xl border transition-all ${method === 'net' ? 'border-primary bg-primary-light' : 'border-color bg-white'}`}
             >
                <Building2 className={method === 'net' ? 'color-primary' : 'text-muted'} size={20} />
                <div className="text-left">
                   <p className={`font-bold text-sm ${method === 'net' ? 'color-primary' : ''}`}>Net Banking</p>
                   <p className="text-[10px] text-light">Direct Login to Bank</p>
                </div>
                {method === 'net' && <CheckCircle2 size={16} className="color-primary ml-auto" />}
             </button>
          </div>

          <button 
            disabled={processing}
            onClick={handlePay}
            className="btn btn-primary w-full py-16 text-lg shadow-lg"
          >
            {processing ? (
              <span className="flex items-center gap-8 justify-center">
                <Clock className="animate-spin" size={20} /> Processing...
              </span>
            ) : `Pay ${pkg.price}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subtext, colorClass }) => (
  <div className="stat-card">
    <div className="stat-header">
      <div className={`stat-icon-wrapper ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
    <p className="stat-subtext">
      {subtext}
    </p>
  </div>
);

const TRANSLATIONS = {
  English: {
    healthStatus: "Health Status",
    appointments: "Appointments",
    labReports: "Lab Reports",
    activeMeds: "Active Meds",
    trendTitle: "Weekly Heart Rate Trend",
    trendExplain: "This chart shows your heart beats per minute (BPM) over the last 7 days. It helps us monitor your resting heart health.",
    avgRate: "Average weekly heart rate",
    medsTitle: "Medications",
    hotline: "24/7 Active Support Hotline",
    remindersTitle: "Care Reminders",
    packagesTitle: "Nexacare Care Plans",
    upcomingFollowup: "Upcoming Follow-up",
    viewAll: "View All",
    explorePackages: "Explore curated health packages for your longevity."
  },
  Marathi: {
    healthStatus: "आरोग्य स्थिती",
    appointments: "अपॉइंटमेंट",
    labReports: "लॅब रिपोर्ट्स",
    activeMeds: "सक्रिय औषधे",
    trendTitle: "साप्ताहिक हृदयाचे ठोके कल",
    trendExplain: "हा तक्ता गेल्या ७ दिवसांतील तुमच्या हृदयाचे ठोके प्रती मिनिट (BPM) दर्शवतो. हे तुमच्या हृदयाच्या आरोग्यावर लक्ष ठेवण्यास मदत करते.",
    avgRate: "सरासरी साप्ताहिक हृदय गती",
    medsTitle: "औषधे",
    hotline: "२४/७ सक्रिय सपोर्ट हॉटलाइन",
    remindersTitle: "काळजी स्मरणपत्रे",
    packagesTitle: "नेक्साकेअर उपचार योजना",
    upcomingFollowup: "येणारी फॉलो-अप",
    viewAll: "सर्व पहा",
    explorePackages: "तुमच्या दीर्घायुष्यासाठी क्युरेट केलेले आरोग्य पॅकेजेस शोधा."
  },
  Hindi: {
    healthStatus: "स्वास्थ्य स्थिति",
    appointments: "अपॉइंटमेंट",
    labReports: "लैब रिपोर्ट्स",
    activeMeds: "सक्रिय दवाएं",
    trendTitle: "साप्ताहिक हृदय गति रुझान",
    trendExplain: "यह चार्ट पिछले 7 दिनों में आपके हृदय की प्रति मिनट धड़कन (BPM) को दर्शाता है। यह आपके हृदय स्वास्थ्य की निगरानी में मदद करता है।",
    avgRate: "औसत साप्ताहिक हृदय गति",
    medsTitle: "दवाएं",
    hotline: "24/7 सक्रिय सपोर्ट हॉटलाइन",
    remindersTitle: "देखभाल अनुस्मारक",
    packagesTitle: "नेक्साकेयर देखभाल योजनाएं",
    upcomingFollowup: "आगामी फॉलो-अप",
    viewAll: "सभी देखें",
    explorePackages: "अपनी दीर्घायु के लिए क्यूरेटेड हेल्थ पैकेज देखें।"
  }
};

const HEALTH_PACKAGES = [
  { id: 1, name: "Executive Cardiac Checkup", price: "₹2,499", icon: Activity, tag: "Popular", color: "bg-indigo" },
  { id: 2, name: "Advanced Lipid Panel", price: "₹1,200", icon: FileText, tag: "Essential", color: "bg-emerald" },
  { id: 3, name: "Full Body Longevity Scan", price: "₹8,999", icon: Sparkles, tag: "Premium", color: "bg-amber" },
];

export default function DashboardView({ 
  reports = [], 
  bookings = [], 
  meds = [], 
  selectedLang = 'English', 
  vaccines = [], 
  onTabChange,
  onRepeatBooking,
  onPaymentSuccess,
  getAI
}) {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [quickInsight, setQuickInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  React.useEffect(() => {
    const fetchQuickInsight = async () => {
      const ai = getAI?.();
      if (!ai) return;
      setLoadingInsight(true);
      try {
        const prompt = `Provide a one-sentence health summary for John Doe based on: 
        Vitals: ${JSON.stringify(DASHBOARD_VITALS.slice(-1))}, Meds: ${meds.length} active.
        Be professional and brief. Language: ${selectedLang}`;
        
        const result = await ai.models.generateContent({
           model: "gemini-3-flash-preview",
           contents: prompt
        });
        if (result.text) setQuickInsight(result.text);
      } catch (e) {
        console.warn("Quick insight failed:", e);
      } finally {
        setLoadingInsight(false);
      }
    };
    fetchQuickInsight();
  }, [selectedLang, getAI, meds]);
  
  const safeBookings = bookings || [];
  const safeReports = reports || [];
  const safeMeds = meds || [];
  const safeVaccines = vaccines || [];
  
  const nextAppointment = safeBookings && safeBookings.length > 0 ? safeBookings[0] : null;
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.English;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="view-container dashboard-view"
    >
      <AnimatePresence>
        {selectedPkg && (
           <PaymentModal 
             pkg={selectedPkg} 
             onClose={() => setSelectedPkg(null)} 
             onPaymentSuccess={(pkg) => onPaymentSuccess?.({ title: 'Payment Success', desc: `You have successfully purchased ${pkg.name}.` })}
           />
        )}
      </AnimatePresence>
      <div className="stat-grid">
        {quickInsight && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full bg-indigo-50 border border-indigo-100 p-16 rounded-2xl flex items-center gap-12"
          >
            <div className="bg-indigo-500 p-8 rounded-xl text-white">
              <Sparkles size={16} />
            </div>
            <p className="text-sm font-medium text-indigo-900 leading-tight">
               <span className="font-bold">Nexacare Insight:</span> {quickInsight}
            </p>
          </motion.div>
        )}
        <StatCard 
          icon={Activity} 
          label={t.healthStatus} 
          value="Stable" 
          subtext="Based on last vitals" 
          colorClass="bg-emerald"
        />
        <StatCard 
          icon={Calendar} 
          label={t.appointments} 
          value={safeBookings.length} 
          subtext={nextAppointment ? `Next: ${nextAppointment.date}` : 'No upcoming'} 
          colorClass="bg-indigo"
        />
        <StatCard 
          icon={FileText} 
          label={t.labReports} 
          value={safeReports.length} 
          subtext="2 new results" 
          colorClass="bg-amber"
        />
        <StatCard 
          icon={Clock} 
          label={t.activeMeds} 
          value={safeMeds.length} 
          subtext="Dose tracking active" 
          colorClass="bg-rose"
        />
      </div>

      <div className="dashboard-content-grid">
        {/* Recent Activity */}
        <div className="vitals-trend-section">
          <h3 className="section-title">
            <TrendingUp size={20} className="color-primary" /> {t.trendTitle}
          </h3>
          <p className="px-24 text-xs text-light mb-8">{t.trendExplain}</p>
          <div className="vitals-chart-placeholder" style={{ padding: '0', height: '220px' }}>
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={DASHBOARD_VITALS}>
                 <defs>
                   <linearGradient id="dashGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <Tooltip 
                   contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }}
                   itemStyle={{ color: 'var(--primary)' }}
                 />
                 <Area type="monotone" dataKey="val" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#dashGradient)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
          <div className="px-24 pb-20">
             <p className="text-xs text-light mb-12">{t.avgRate}: <span className="font-bold color-primary">73 BPM</span></p>
             <button onClick={() => onTabChange('health')} className="btn btn-dashed btn-small w-full">Detailed Health Insights</button>
          </div>
        </div>

        {/* Reminders Section */}
        <div className="reminders-section card p-24">
          <div className="flex justify-between items-center mb-16">
            <h3 className="section-title-sm m-0">
              <Bell size={18} className="color-primary" /> {t.remindersTitle}
            </h3>
            <button className="link-btn-small">{t.viewAll}</button>
          </div>
          <div className="reminders-list">
            <div className="reminder-item-simple">
               <div className="reminder-dot-active" />
               <div className="reminder-info">
                  <p className="reminder-title">{t.upcomingFollowup}</p>
                  <p className="reminder-meta">Dr. Sarah Johnson • May 12</p>
               </div>
               <button 
                  onClick={() => onRepeatBooking?.({ doctor: 'Dr. Sarah Johnson' })}
                  className="btn btn-dashed btn-small px-8 py-4 text-[10px]"
               >
                  Reschedule
               </button>
            </div>
            {safeVaccines.filter(v => v.status === 'Upcoming').map(v => (
               <div key={v.id} className="reminder-item-simple">
                  <div className="reminder-dot-scheduled" />
                  <div className="reminder-info">
                     <p className="reminder-title">{v.name} Vaccination</p>
                     <p className="reminder-meta">{v.date} • Scheduled</p>
                  </div>
               </div>
            ))}
          </div>
        </div>

        {/* Wellness Packages */}
        <div className="packages-section card p-24 col-span-full">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-20">
              <div>
                 <h3 className="section-title-sm m-0">
                   <ShoppingBag size={18} className="color-primary" /> {t.packagesTitle}
                 </h3>
                 <p className="text-xs text-light">{t.explorePackages}</p>
              </div>
              <button className="btn btn-primary btn-small">View All Offers</button>
           </div>
           <div className="package-grid-row">
              {HEALTH_PACKAGES.map(pkg => (
                 <div key={pkg.id} className="package-card-premium" onClick={() => setSelectedPkg(pkg)}>
                    <div className={`package-icon-cap ${pkg.color}`}>
                       <pkg.icon size={20} className="color-white" />
                    </div>
                    <div className="package-body-p">
                       <span className="package-tag-mini">{pkg.tag}</span>
                       <h4 dangerouslySetInnerHTML={{ __html: pkg.name.replace(' ', '<br/>') }} className="package-name-p" />
                       <div className="package-footer-p">
                          <span className="package-price-p">{pkg.price}</span>
                          <button className="btn-circle-action">
                             <ArrowRight size={16} />
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Medication Progress */}
        <div className="medication-section card p-24 col-span-full">
          <h3 className="section-title mb-20 p-0">
            <AlertCircle size={20} className="color-primary" /> {t.medsTitle}
          </h3>
          <div className="medication-list grid grid-cols-1 md:grid-cols-3 gap-16">
             {safeMeds.slice(0, 3).map(med => (
                <div key={med.id} className="medication-item border-none shadow-none bg-main">
                   <div className="med-header">
                      <h4 className="med-title">{med.name}</h4>
                      <span className="med-frequency">{med.frequency}</span>
                   </div>
                   <div className="progress-bar-bg mb-8">
                      <div className="progress-bar-fill" style={{ width: '75%' }} />
                   </div>
                   <p className="med-footer m-0">Next dose in 4 hours</p>
                </div>
             ))}
          </div>
        </div>
      </div>

      <div className="cta-grid">
         <div className="cta-card cta-dark w-full">
            <div className="cta-blob-dark" />
            <div className="cta-icon-bg-dark">
               <Clock size={32} />
            </div>
            <div className="cta-body">
               <h4 className="cta-title">{t.hotline}</h4>
               <p className="cta-desc">Dedicated medical assistance available round the clock. Connect with our care team instantly.</p>
               <button 
                onClick={() => window.location.href = 'tel:+919876543210'}
                className="cta-btn btn-primary-alt"
               >
                 Call Care Team Now
               </button>
            </div>
         </div>
      </div>
    </motion.div>
  );
}


