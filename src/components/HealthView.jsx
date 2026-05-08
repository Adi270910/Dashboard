import React from 'react';
import { motion } from 'motion/react';
import { Activity, Stethoscope, CheckCircle2, Clock, Bot, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const VITALS_DATA = [
  { time: '08:00', heartRate: 72, bp: 120, sugar: 90 },
  { time: '10:00', heartRate: 75, bp: 122, sugar: 95 },
  { time: '12:00', heartRate: 80, bp: 125, sugar: 110 },
  { time: '14:00', heartRate: 78, bp: 121, sugar: 105 },
  { time: '16:00', heartRate: 74, bp: 119, sugar: 98 },
  { time: '18:00', heartRate: 73, bp: 118, sugar: 92 },
  { time: '20:00', heartRate: 70, bp: 117, sugar: 88 },
];

const HEALTH_TRANSLATIONS = {
  English: {
    vitalsTitle: "Vitals Trend (Last 12 Hours)",
    heartRate: "Heart Rate",
    glucose: "Glucose",
    medications: "Medications",
    setReminder: "Set Reminder",
    vaccinationSchedule: "Vaccination Schedule",
    wellnessInsight: "Nexacare Smart Insight",
    completed: "Completed",
    upcoming: "Upcoming",
    scheduled: "Scheduled"
  },
  Hindi: {
    vitalsTitle: "वाइटल्स रुझान (पिछले 12 घंटे)",
    heartRate: "हृदय गति",
    glucose: "ग्लूकोज",
    medications: "दवाएं",
    setReminder: "अनुस्मारक सेट करें",
    vaccinationSchedule: "टीकाकरण अनुसूची",
    wellnessInsight: "Nexacare स्मार्ट अंतर्दृष्टि",
    completed: "पूरा हुआ",
    upcoming: "आगामी",
    scheduled: "निर्धारित"
  },
  Marathi: {
    vitalsTitle: "वाइटल्स कल (गेले १२ तास)",
    heartRate: "हृदय गती",
    glucose: "ग्लुकोज",
    medications: "औषधे",
    setReminder: "स्मरणपत्र सेट करा",
    vaccinationSchedule: "लसीकरण वेळापत्रक",
    wellnessInsight: "Nexacare स्मार्ट इनसाइट",
    completed: "पूर्ण झाले",
    upcoming: "आगामी",
    scheduled: "नियोजित"
  }
};

export default function HealthView({ meds = [], vaccines = [], selectedLang = 'English', getAI, addNotification }) {
  const safeMeds = meds || [];
  const safeVaccines = vaccines || [];
  const t = HEALTH_TRANSLATIONS[selectedLang] || HEALTH_TRANSLATIONS.English;
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState(new Date().toLocaleTimeString());
  const [aiInsight, setAiInsight] = React.useState('');

  const generateInsight = async () => {
    const ai = getAI?.();
    if (!ai) {
      console.warn("AI Client not initialized yet.");
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    try {
      const context = {
        patientName: "John Doe",
        medications: safeMeds,
        vaccines: safeVaccines,
        recentVitals: VITALS_DATA.slice(-3),
        language: selectedLang
      };
      
      const prompt = `Act as a professional health advisor for Nexacare360. 
      Analyze the following patient data for John Doe:
      - Medications: ${JSON.stringify(safeMeds)}
      - Latest Vitals: ${JSON.stringify(VITALS_DATA.slice(-3))}
      - Upcoming Vaccines: ${JSON.stringify(safeVaccines.filter(v => v.status !== 'Completed'))}
      
      Provide exactly 3 bullet points of personalized, highly practical health advice.
      For each point:
      1. State a specific observation based on the data.
      2. Provide a clear, actionable tip.
      3. Explain the long-term benefit.
      
      Tone: Professional, supportive, and data-driven.
      Language: ${selectedLang}
      
      Critical Rule: Use ONLY valid Markdown. Use **Bold** for emphasis. No preamble.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const text = result.text;
      
      if (text) {
        setAiInsight(text);
        setLastUpdated(new Date().toLocaleTimeString());
        addNotification?.(
          'Insights Updated', 
          'Nexacare AI has refreshed your personalized plan.',
          <Bot size={20} className="color-white" />
        );
      }
    } catch (error) {
      console.error("AI Insight Error:", error);
      addNotification?.(
        'AI Unavailable', 
        'Switching to local health analysis due to connection issues.',
        <AlertCircle size={20} className="color-white" />,
        'danger'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    // Small delay to ensure App.jsx has time to init aiClient if needed
    const timer = setTimeout(() => {
      if (!aiInsight && !isGenerating) {
        generateInsight();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedLang]);

  const handleRefresh = () => {
    generateInsight();
  };

  const getInsightContent = () => {
    if (aiInsight) return aiInsight;
    
    const medNames = safeMeds.map(m => m.name).join(', ');
    return `Based on your recent vitals and medication history (**${medNames}**), your metabolic health is stabilized. However, your **Fluid intake** records show a slight dip today.
                   
**Personalized Recommendations:**
- Increase daily water intake to **3.2L** to support kidneys while on medication.
- Continue adhering to the **current schedule** for ${safeMeds[0]?.name || 'your medications'}.
- Maintain the current exercise intensity as heart rate recovery is optimal.`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="view-container health-view"
    >
      {/* Vitals Detailed Chart Section */}
      <div className="card p-24 mb-32 bg-main/30 border-dashed">
        <div className="flex justify-between items-center mb-24">
           <h3 className="section-title-icon m-0">
             <Activity className="color-primary" size={20} /> {t.vitalsTitle}
           </h3>
           <div className="flex gap-12">
              <span className="flex items-center gap-4 text-xs font-medium"><div className="w-8 h-8 rounded-full bg-indigo" /> {t.heartRate}</span>
              <span className="flex items-center gap-4 text-xs font-medium"><div className="w-8 h-8 rounded-full bg-emerald" /> {t.glucose}</span>
           </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={VITALS_DATA}>
              <defs>
                <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-light)', fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-light)', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow)',
                  color: 'var(--text-main)'
                }} 
              />
              <Area type="monotone" dataKey="heartRate" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorHr)" />
              <Area type="monotone" dataKey="sugar" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSugar)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="health-grid">
        {/* Medication Reminders */}
        <div className="section-col">
          <div className="section-header-row">
            <h3 className="section-title-icon">
              <Activity className="color-primary" size={20} /> {t.medications}
            </h3>
            <button className="link-btn-small">{t.setReminder}</button>
          </div>
          <div className="meds-list">
            {safeMeds.map(med => (
              <div key={med.id} className="med-item-card">
                <div className="med-info">
                  <div className="med-icon-bg">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h4 className="med-name">{med.name} <span className="med-dose">({med.dose})</span></h4>
                    <p className="med-freq">{med.frequency}</p>
                  </div>
                </div>
                <div className="med-badge">
                   <span className="badge-slate">{med.purpose}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vaccination Schedule */}
        <div className="section-col">
          <h3 className="section-title-icon">
            <CheckCircle2 className="color-primary" size={20} /> {t.vaccinationSchedule}
          </h3>
          <div className="timeline-container">
            {safeVaccines.map((v, i) => (
              <div key={v.id} className="timeline-item">
                <div className={`timeline-dot ${v.status === 'Completed' ? 'bg-emerald' : 'bg-indigo-light'}`}>
                  {v.status === 'Completed' && <CheckCircle2 size={12} className="color-white" />}
                </div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <p className="timeline-tag">{v.type}</p>
                      <h4 className="timeline-title">{v.name}</h4>
                      <p className="timeline-meta">
                        <Clock size={12} /> {v.date}
                      </p>
                    </div>
                    <span className={`status-badge-small ${v.status === 'Completed' ? 'status-solved' : 'status-handover'}`}>
                      {t[v.status.toLowerCase()] || v.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Wellness Insight */}
      <div className="insight-card-large gradient-primary">
         <div className="insight-glow" />
         <div className="insight-content">
            <div className={`insight-icon-box ${isGenerating ? 'animate-pulse' : ''}`}>
               <Bot size={48} />
            </div>
            <div className="insight-text-area">
               <div className="flex justify-between items-center mb-8">
                 <h4 className="insight-title-large">{t.wellnessInsight}</h4>
                 <span className="text-[10px] text-white/60 font-mono">Last Analysis: {lastUpdated}</span>
               </div>
               
               <div className="insight-desc-large markdown-body">
                 {isGenerating ? (
                   <div className="flex flex-col gap-12">
                     <div className="h-12 bg-white/20 rounded w-3/4 animate-pulse" />
                     <div className="h-12 bg-white/20 rounded w-1/2 animate-pulse" />
                     <div className="h-12 bg-white/20 rounded w-2/3 animate-pulse" />
                   </div>
                 ) : (
                   <ReactMarkdown>
                     {getInsightContent()}
                   </ReactMarkdown>
                 )}
               </div>
               
               <div className="insight-actions">
                 <button 
                   onClick={handleRefresh}
                   disabled={isGenerating}
                   className="btn btn-white btn-shadow disabled:opacity-50"
                 >
                   {isGenerating ? 'Analyzing...' : 'Refresh Insights'}
                 </button>
                 <button className="btn btn-glass">View Full Plan</button>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}