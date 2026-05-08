import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Hospital, 
  Calendar, 
  FileText, 
  Activity, 
  PhoneCall,
  Languages,
  Clock,
  CreditCard,
  MapPin,
  Moon,
  Sun,
  ChevronDown,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addDays, startOfToday } from 'date-fns';
import { GoogleGenAI } from "@google/genai";

// Component Imports
import Sidebar from './components/Sidebar.jsx';
import DashboardView from './components/DashboardView.jsx';
import ChatView from './components/ChatView.jsx';
import HealthView from './components/HealthView.jsx';
import LabView from './components/LabView.jsx';
import CalendarView from './components/CalendarView.jsx';
import AdminView from './components/AdminView.jsx';
import ProfileView from './components/ProfileView.jsx';
import SettingsView from './components/SettingsView.jsx';

// --- HMS DATA & SERVICES ---
const MOCK_LAB_REPORTS = [
  { 
    id: 'LR001', 
    testName: 'Blood Sugar (Fasting)', 
    date: '2026-05-01', 
    status: 'Completed', 
    result: '95 mg/dL', 
    patientId: 'P101',
    metrics: [
      { name: 'Glucose', value: 95, min: 70, max: 100, unit: 'mg/dL' }
    ],
    breakdown: `### Technical Breakdown
- **Glucose Level:** 95 mg/dL (Normal Range: 70-100 mg/dL)
- **Method:** Hexokinase enzymatic assay
- **Clinical correlation:** Blood glucose is within normal fasting limits. No immediate diabetic risk detected.`
  },
  { 
    id: 'LR002', 
    testName: 'CBC (Complete Blood Count)', 
    date: '2026-05-02', 
    status: 'Completed', 
    result: 'Hemoglobin: 14.2 g/dL', 
    patientId: 'P101',
    metrics: [
      { name: 'Hemoglobin', value: 14.2, min: 13.5, max: 17.5, unit: 'g/dL' },
      { name: 'WBC Count', value: 6500, min: 4500, max: 11000, unit: 'cells/mcL' },
      { name: 'Platelets', value: 250000, min: 150000, max: 450000, unit: 'cells/mcL' }
    ],
    breakdown: `### Technical Breakdown
- **Hemoglobin:** 14.2 g/dL (Normal: 13.5-17.5 g/dL)
- **WBC Count:** 6,500 cells/mcL (Normal: 4,500-11,000)
- **Platelets:** 250,000 cells/mcL (Normal: 150,000-450,000)
- **Impression:** All hematological parameters are within optimal ranges.`
  },
  { id: 'LR003', testName: 'Lipid Profile', date: '2026-05-03', status: 'Pending', patientId: 'P101' },
];

const MOCK_DOCTORS = [
  { id: 'D1', name: 'Dr. Sarah Johnson', specialization: 'Cardiology', availability: 'Mon, Wed, Fri', opdTimings: '09:00 AM - 01:00 PM', contact: '+91 91234 00001' },
  { id: 'D2', name: 'Dr. Michael Chen', specialization: 'Orthopedics', availability: 'Tue, Thu, Sat', opdTimings: '10:00 AM - 04:00 PM', contact: '+91 91234 00002' },
  { id: 'D3', name: 'Dr. Emily Brown', specialization: 'Pediatrics', availability: 'Mon-Fri', opdTimings: '08:00 AM - 12:00 PM', contact: '+91 91234 00003' },
  { id: 'D4', name: 'Dr. Rajesh Kumar', specialization: 'Neurology', availability: 'Mon, Thu', opdTimings: '02:00 PM - 06:00 PM', contact: '+91 91234 00004' },
];

const MOCK_VISITS = [
  { id: 'V001', date: '2026-04-10', doctor: 'Dr. Sarah Johnson', department: 'Cardiology', reason: 'Initial symptoms', diagnosis: 'Mild Hypertension', status: 'Followed-up' },
  { id: 'V002', date: '2026-03-15', doctor: 'Dr. Michael Chen', department: 'Orthopedics', reason: 'Knee pain', diagnosis: 'Ligament strain', status: 'Closed' },
];

const MOCK_FAMILY = [
  { id: 'F001', name: 'Jane Doe', relation: 'Spouse', bloodGroup: 'A+', phone: '+91 91234 11111' },
  { id: 'F002', name: 'Aditya Shukla', relation: 'Brother', bloodGroup: 'O+', phone: '+91 91234 56789' },
];

const MOCK_DOCUMENTS = [
  { id: 'D001', name: 'Identity Proof.pdf', type: 'Identification', date: '2026-01-10', size: '1.2 MB' },
  { id: 'D002', name: 'Insurance Card.png', type: 'Insurance', date: '2026-02-15', size: '0.8 MB' },
];

const MOCK_CONSENTS = [
  { id: 'C001', name: 'General Treatment Consent', date: '2026-04-01', signed: true },
  { id: 'C002', name: 'AI Data Processing Consent', date: '2026-04-01', signed: true },
  { id: 'C003', name: 'Surgery Authorization', date: 'N/A', signed: false },
];

const MOCK_ALERTS = [
  { id: 'A001', type: 'Allergy', title: 'Penicillin Allergy', level: 'Critical', note: 'Avoid all penicillin-based medications.' },
  { id: 'A002', type: 'Chronic', title: 'Asthma History', level: 'Moderate', note: 'Carries inhaler. Seasonal triggers.' },
];

const MOCK_MEDICATIONS = [
  { id: 'M1', name: 'Cholesterol Tablet', dose: '10mg', frequency: 'Once daily (Night)', purpose: 'Cholesterol' },
  { id: 'M2', name: 'Sugar Control Pill', dose: '500mg', frequency: 'Twice daily (Post Meal)', purpose: 'Blood Sugar' },
  { id: 'M3', name: 'Blood Pressure Medicine', dose: '5mg', frequency: 'Once daily (Morning)', purpose: 'Blood Pressure' },
];

const MOCK_VACCINES = [
  { id: 'V1', name: 'Influenza (Flu)', date: '2026-05-15', status: 'Upcoming', type: 'Annual' },
  { id: 'V2', name: 'Pneumococcal', date: '2026-06-20', status: 'Scheduled', type: 'One-time' },
  { id: 'V3', name: 'COVID-19 Booster', date: '2025-11-10', status: 'Completed', type: 'Booster' },
];

const hospitalInfoData = {
  location: '123 Health Ave, Medical City, MC 54321',
  departments: ['Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'Oncology', 'Emergency'],
  insurance: ['HealthGuard', 'LifePlus', 'SecureCare', 'StateHealth'],
  timings: '24/7 Emergency, Regular OPD: 08:00 AM - 08:00 PM'
};

let aiClient = null;
const getAI = () => {
  if (!aiClient) {
    let key = null;
    try {
      if (typeof process !== 'undefined' && process.env) {
        key = process.env.GEMINI_API_KEY;
      }
      if (!key && typeof import.meta !== 'undefined' && import.meta.env) {
        key = import.meta.env.VITE_GEMINI_API_KEY;
      }
    } catch (e) {
      console.warn("Could not retrieve API key:", e);
    }
    
    if (key) {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
};

const SYSTEM_INSTRUCTION = `You are "Nexacare360 Pro", a high-end, professional AI Healthcare Assistant.
Your primary objectives are:
1. Provide precise hospital information, department details, and availability.
2. Deliver clinical insights on lab reports and health trends in a reassuring yet technical tone.
3. ADAPTIVE MULTILINGUALISM: You are a native speaker of English, Hindi (हिंदी), and Marathi (मराठी). 
   - Detect the user's language instantly and respond in kind.
   - Use high-quality, formal vocabulary in Hindi and Marathi healthcare contexts.
   - If the user switches language, acknowledge and transition perfectly.
4. CLINICAL SYMPTOM CHECKER:
   - Use evidence-based logic to ask probing questions (History, Severity, Onset).
   - MANDATORY: Always conclude symptoms-related responses with this exact disclaimer: "DISCLAIMER: This information is for educational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider."
5. EMERGENCY TRIAGE: If life-threatening signs occur (Chest Pain, Stroke signs, Difficulty Breathing), stop the session and direct to "Emergency Help".

Context: Patient ID P101 (John Doe). Hospital: Nexacare360. Operating in Mumbai, India.`;

// --- COMPONENTS ---

const QuickStats = ({ info }) => (
  <div className="stats-sidebar">
    <div className="stats-card">
      <h4 className="stats-card-title">
        <Activity size={16} className="color-primary" /> Hospital Live Feed
      </h4>
      <div className="feed-list">
        <div className="feed-item">
          <span className="feed-label">ICU Beds Available</span>
          <span className="feed-value">02</span>
        </div>
        <div className="feed-item">
          <span className="feed-label">General Ward</span>
          <span className="feed-value">12</span>
        </div>
        <div className="feed-item">
          <span className="feed-label">Wait Time (Emergency)</span>
          <span className="feed-value val-danger">~15 Min</span>
        </div>
      </div>
    </div>

    <div className="stats-card">
      <h4 className="stats-card-title">
        <MapPin size={16} className="color-primary" /> Facility Info
      </h4>
      <p className="label-tiny">Location</p>
      <p className="text-small mb-16">{info.location}</p>
      <p className="label-tiny">OPD Hours</p>
      <div className="info-item">
        <Clock size={14} className="color-primary" />
        Mon - Sun, 8:00 - 20:00
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showLanguageGuide, setShowLanguageGuide] = useState(true);
  const [user, setUser] = useState({ 
    id: 'P101', 
    name: 'John Doe', 
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    bloodGroup: 'O+',
    address: '402, Shivam Residency, Bandra West, Mumbai'
  });
  
  // HMS State
  const [doctors] = useState(MOCK_DOCTORS);
  const [reports] = useState(MOCK_LAB_REPORTS);
  const [bookings, setBookings] = useState([
    { 
      id: 'BK001', 
      doctorId: 'D1', 
      doctorName: 'Dr. Sarah Johnson', 
      patientName: 'John Doe', 
      patientId: 'P101',
      reason: 'Routine cardiac check-up after medication adjustment',
      date: format(addDays(startOfToday(), 2), 'yyyy-MM-dd'), 
      time: '10:30 AM', 
      status: 'Confirmed' 
    }
  ]);
  const [meds] = useState(MOCK_MEDICATIONS);
  const [vaccines] = useState(MOCK_VACCINES);
  const [hospitalInfo] = useState(hospitalInfoData);
  const [visits] = useState(MOCK_VISITS);
  const [family, setFamily] = useState(MOCK_FAMILY);
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [consents, setConsents] = useState(MOCK_CONSENTS);
  const [alerts] = useState(MOCK_ALERTS);
  const [settings, setSettings] = useState({
    notifications: true,
    emailSummary: true,
    biometric: false,
    dataSharing: true,
    twoFactor: false
  });

  const handleSignConsent = (id) => {
    setConsents(prev => prev.map(c => c.id === id ? { ...c, signed: true, date: format(new Date(), 'yyyy-MM-dd') } : c));
    addNotification(
      'Consent Signed', 
      'You have successfully authorized the document.',
      <FileCheck size={20} className="color-white" />
    );
  };

  // Chat State
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Hello! I'm Nexacare360 AI. How can I help you today? You can ask about lab reports, book an appointment, or check your bills." }], timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    addNotification(
      `${!isDarkMode ? 'Dark' : 'Light'} Mode Enabled`, 
      `Theme has been switched successfully.`,
      !isDarkMode ? <Moon size={20} className="color-white" /> : <Sun size={20} className="color-white" />
    );
  };

  const scrollToBottom = () => {
    const container = document.querySelector('.view-container');
    if (container) {
      container.scrollTo({ 
        top: container.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  const [selectedLang, setSelectedLang] = useState('English');
  const [showLangs, setShowLangs] = useState(false);

  const languages = [
    { name: 'English', flag: '🇺🇸' },
    { name: 'Hindi', flag: '🇮🇳' },
    { name: 'Marathi', flag: '🇮🇳' }
  ];

  const UI_TRANSLATIONS = {
    English: {
      dashboard: 'Dashboard',
      chat: 'AI Assistant',
      health: 'Health Track',
      lab: 'Lab Reports',
      appointments: 'Appointments',
      profile: 'Profile',
      settings: 'Settings',
      admin: 'Admin Panel',
      emergency: 'Emergency Help'
    },
    Hindi: {
      dashboard: 'डैशबोर्ड',
      chat: 'AI सहायक',
      health: 'स्वास्थ्य ट्रैक',
      lab: 'लैब रिपोर्ट्स',
      appointments: 'अपॉइंटमेंट',
      profile: 'प्रोफ़ाइल',
      settings: 'सेटिंग्स',
      admin: 'एडमिन पैनल',
      emergency: 'आपातकालीन सहायता'
    },
    Marathi: {
      dashboard: 'डॅशबोर्ड',
      chat: 'AI सहाय्यक',
      health: 'आरोग्य ट्रॅक',
      lab: 'लॅब रिपोर्ट्स',
      appointments: 'अपॉइंटमेंट',
      profile: 'प्रोफाइल',
      settings: 'सेटिंग्ज',
      admin: 'अ‍ॅडमिन पॅनेल',
      emergency: 'आत्त्काळ मदत'
    }
  };

  const t_ui = UI_TRANSLATIONS[selectedLang] || UI_TRANSLATIONS.English;

  const processChat = async (history, userInput) => {
    const ai = getAI();
    
    // OFFLINE FALLBACK: If AI is not configured or fails
    const getOfflineResponse = (input) => {
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('report') || lowerInput.includes('lab')) return "You can find your latest lab results in the 'Lab Reports' tab. Your Blood Sugar was 95 mg/dL on May 1st.";
      if (lowerInput.includes('bill') || lowerInput.includes('pay')) return "Your outstanding balance is ₹350.00. You can pay this securely in the 'Billing' tab.";
      if (lowerInput.includes('appointment') || lowerInput.includes('book')) return "To book an appointment, please head over to the 'Appointments' tab and select a specialist.";
      if (lowerInput.includes('marathi') || lowerInput.includes('मराठी')) return "मी तुम्हाला मराठीत मदत करू शकतो. तुम्ही तुमचे लॅब रिपोर्ट किंवा बिल तपासू शकता.";
      if (lowerInput.includes('hindi') || lowerInput.includes('हिंदी')) return "मैं हिंदी में आपकी सहायता कर सकता हूँ। आप अपनी रिपोर्ट या बिल की जांच कर सकते हैं।";
      return "I'm currently in basic mode, but I can help you navigate the portal. Try checking the Lab Reports or Billing tabs!";
    };

    if (!ai) {
      return {
        text: getOfflineResponse(userInput),
        sentiment: 'neutral',
        shouldEscalate: false
      };
    }

    try {
      const analysisResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `Analyze this user message for sentiment and urgency. Return JSON: { "sentiment": "positive|neutral|negative|urgent", "shouldEscalate": boolean, "isEmergency": boolean }. Message: "${userInput}"` }] }
        ],
        config: { responseMimeType: "application/json" }
      });

      const analysisRaw = analysisResponse.text || '{}';
      let analysis = {};
      try {
        const jsonMatch = analysisRaw.match(/\{[\s\S]*\}/);
        analysis = JSON.parse(jsonMatch ? jsonMatch[0] : analysisRaw);
      } catch (e) {
        console.warn("JSON Parse Error on analysis:", e);
        analysis = { sentiment: 'neutral', shouldEscalate: false, isEmergency: false };
      }

      if (analysis.isEmergency) {
        return {
          text: "🚨 EMERGENCY: Please call 911 or visit our Emergency Department immediately.",
          sentiment: 'urgent',
          shouldEscalate: true
        };
      }

      const chatResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history.map(m => ({ role: m.role, parts: m.parts })),
          { role: 'user', parts: [{ text: userInput }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        }
      });

      return {
        text: chatResponse.text || "I'm sorry, I couldn't process that.",
        sentiment: analysis.sentiment,
        shouldEscalate: analysis.shouldEscalate
      };
    } catch (error) {
      console.error("Chat Error:", error);
      return {
        text: getOfflineResponse(userInput),
        sentiment: 'neutral',
        shouldEscalate: false
      };
    }
  };

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    setShowLangs(false);
    setShowLanguageGuide(false);
    
    addNotification(
      'Language Updated', 
      `App language has been set to ${lang}.`,
      <Languages size={20} className="color-white" />
    );

    const msg = { 
      role: 'user', 
      parts: [{ text: `I would like to continue our conversation in ${lang}. Please acknowledge.` }], 
      timestamp: Date.now() 
    };
    handleManualMessage(msg);
  };

  const handleManualMessage = async (userMsg) => {
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const result = await processChat([...messages, userMsg], userMsg.parts[0].text);
    const botMsg = { 
      role: 'model', 
      parts: [{ text: result.text }], 
      timestamp: Date.now(),
      sentiment: result.sentiment
    };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const addNotification = (title, desc, icon = <Activity size={20} />, type = 'primary') => {
    const id = Date.now();
    const newToast = { id, title, desc, icon, type };
    setNotifications(prev => [...prev, newToast]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const handleBookAppointment = async (dateStr) => {
    if (!bookingDoctor) return;
    setIsConfirming(true);
    
    // Simulate API Delay
    await new Promise(r => setTimeout(r, 1000));

    const finalDate = dateStr || '2026-05-10';

    const newBooking = {
      id: `BK${Math.floor(Math.random() * 1000)}`,
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      patientName: 'John Doe',
      patientId: 'P101',
      reason: 'Standard Consultation',
      date: finalDate,
      time: '10:30 AM',
      status: 'Confirmed'
    };
    
    setBookings(prev => [...prev, newBooking]);
    setBookingDoctor(null);
    setIsConfirming(false);

    // Trigger Notification
    addNotification(
      'Appointment Confirmed', 
      `Successfully scheduled with ${bookingDoctor.name} for ${finalDate}.`,
      <Calendar size={20} className="color-white" />
    );
    
    const botMsg = { 
      role: 'model', 
      parts: [{ text: `Great! Your appointment with ${bookingDoctor.name} has been confirmed for May 10th at 10:30 AM. You can see it in your Appointments tab.` }], 
      timestamp: Date.now(),
      sentiment: 'positive'
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const handleContactDoctor = (booking) => {
    setActiveTab('chat');
    const contactMsg = { 
      role: 'user', 
      parts: [{ text: `I want to message ${booking.doctorName} about my appointment on ${booking.date} at ${booking.time}.` }], 
      timestamp: Date.now() 
    };
    handleManualMessage(contactMsg);
  };

  const [isRecording, setIsRecording] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "What was my last blood sugar result?",
    "Explain my lipid profile report",
    "OPD timings for Cardiology",
    "Insurance info",
    "Billing help"
  ]);
  const recognitionRef = useRef(null);

  // Update dynamic suggestions based on context
  useEffect(() => {
    const updateSuggestions = async () => {
      const ai = getAI();
      const context = {
        lastReport: reports[0],
        upcomingVaccine: vaccines.find(v => v.status !== 'Completed'),
        latestMeds: meds.slice(0, 2),
        lastMessage: messages[messages.length - 1]?.parts[0]?.text
      };

      if (ai) {
        try {
          const prompt = `Based on this patient context, generate 5 short, clickable chat suggestion strings (max 40 chars each).
          Context: ${JSON.stringify(context)}
          Return JSON array: ["Suggestion 1", "Suggestion 2", ...]`;
          
          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: { responseMimeType: "application/json" }
          });
          
          const raw = response.text;
          const jsonMatch = raw.match(/\[.*\]/s);
          if (jsonMatch) {
            const newSuggestions = JSON.parse(jsonMatch[0]);
            if (Array.isArray(newSuggestions) && newSuggestions.length > 0) {
              setSuggestions(newSuggestions);
            }
          }
        } catch (e) {
          console.warn("Failed to generate dynamic suggestions:", e);
        }
      }
    };

    updateSuggestions();
  }, [messages, reports, meds, vaccines]);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', parts: [{ text: input }], timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const result = await processChat(messages, input);
    
    const botMsg = { 
      role: 'model', 
      parts: [{ text: result.text }], 
      timestamp: Date.now(),
      sentiment: result.sentiment
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);

    if (result.shouldEscalate) {
      setEscalated(true);
    }
  };

  const handleRepeatBooking = (visit) => {
    setBookingDoctor(doctors.find(d => d.name === visit.doctor) || doctors[0]);
    setActiveTab('calendar');
    addNotification(
      'Schedule Follow-up',
      `Booking a repeat session with ${visit.doctor}.`,
      <Clock size={20} className="color-white" />
    );
  };

  return (
    <div className="app-wrapper">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} selectedLang={selectedLang} />

      <main className="main-container">
        <div className="content-max-width">
          <header className="app-header">
          <div className="flex-row-center gap-16">
             <div className="lg-hidden-hospital-icon bg-indigo-600 p-1.5 rounded-xl">
               <Hospital className="color-white" size={18} />
             </div>
             <h2 className="header-title">
               {activeTab === 'chat' ? t_ui.chat : t_ui[activeTab] || activeTab}
             </h2>
          </div>
          <div className="header-actions">
            <button 
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative">
              <button 
                onClick={() => {
                  setShowLangs(!showLangs);
                  setShowLanguageGuide(false);
                }}
                className="btn btn-lang"
              >
                <Languages size={14} className="color-primary" />
                <span>{selectedLang}</span>
              </button>
              
              <AnimatePresence>
                {showLanguageGuide && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="language-guide"
                  >
                    <span>Need help? Choose your preferred language here!</span>
                    <button onClick={() => setShowLanguageGuide(false)} className="guide-btn-close">×</button>
                  </motion.div>
                )}

                {showLangs && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="lang-dropdown"
                  >
                    {languages.map(lang => (
                      <button
                        key={lang.name}
                        onClick={() => handleLanguageChange(lang.name)}
                        className="lang-option"
                      >
                        <span className="text-title-large">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => window.location.href = 'tel:+919876543210'}
              className="btn btn-primary"
            >
              <PhoneCall size={16} /> <span className="hidden-mobile">{t_ui.emergency}</span>
            </button>
          </div>
        </header>

        <div className="view-main-wrapper flex-1 min-h-0 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardView 
                reports={reports} 
                bookings={bookings} 
                meds={meds} 
                selectedLang={selectedLang}
                vaccines={vaccines}
                onTabChange={setActiveTab}
                onRepeatBooking={handleRepeatBooking}
                onPaymentSuccess={({ title, desc }) => addNotification(title, desc, <CreditCard size={20} className="color-white" />)}
                getAI={getAI}
              />
            )}
            {activeTab === 'chat' && (
              <ChatView 
                scrollRef={scrollRef} 
                messages={messages} 
                loading={loading} 
                escalated={escalated} 
                input={input} 
                setInput={setInput} 
                handleSend={handleSend} 
                toggleRecording={toggleRecording} 
                isRecording={isRecording} 
                suggestions={suggestions}
              />
            )}
            {activeTab === 'health' && (
              <HealthView 
                meds={meds} 
                vaccines={vaccines} 
                selectedLang={selectedLang} 
                getAI={getAI}
                addNotification={addNotification}
              />
            )}
            {activeTab === 'lab' && <LabView reports={reports} />}
            {activeTab === 'calendar' && (
              <CalendarView 
                bookings={bookings} 
                doctors={doctors}
                setBookingDoctor={setBookingDoctor}
                bookingDoctor={bookingDoctor}
                isConfirming={isConfirming}
                handleBookAppointment={handleBookAppointment}
                onContactDoctor={handleContactDoctor}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileView 
                user={user} 
                onUpdateProfile={(newData) => setUser(prev => ({...prev, ...newData}))}
                languages={languages}
                selectedLang={selectedLang}
                onLanguageChange={handleLanguageChange}
                visits={visits}
                family={family}
                onAddFamilyMember={(member) => setFamily(prev => [...prev, member])}
                documents={documents}
                consents={consents}
                onSignConsent={handleSignConsent}
                alerts={alerts}
                onUploadDocument={(doc) => setDocuments(prev => [doc, ...prev])}
                onRepeatBooking={handleRepeatBooking}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsView 
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                selectedLang={selectedLang}
                languages={languages}
                onLanguageChange={handleLanguageChange}
                settings={settings}
                onUpdateSettings={(newSettings) => setSettings(prev => ({...prev, ...newSettings}))}
              />
            )}
            {activeTab === 'admin' && <AdminView selectedLang={selectedLang} />}
          </AnimatePresence>
        </div>

        {activeTab === 'chat' && <QuickStats info={hospitalInfo} />}
        </div>
      </main>

      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToBottom}
          className="scroll-down-btn"
          title="Scroll to Bottom"
        >
          <ChevronDown size={24} />
        </motion.button>
      </AnimatePresence>

      <div className="toast-container">
        <AnimatePresence>
          {notifications.map(toast => (
            <motion.div 
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="toast"
            >
              <div className="toast-icon-bg bg-indigo-600">
                {toast.icon}
              </div>
              <div className="toast-content">
                <p className="toast-title">{toast.title}</p>
                <p className="toast-desc">{toast.desc}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mobile-nav">
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? "nav-item active" : "nav-item"}>
          <Activity size={24} />
        </button>
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? "nav-item active" : "nav-item"}>
          <MessageSquare size={24} />
        </button>
        <button onClick={() => setActiveTab('health')} className={activeTab === 'health' ? "nav-item active" : "nav-item"}>
          <Activity size={24} />
        </button>
        <button onClick={() => setActiveTab('lab')} className={activeTab === 'lab' ? "nav-item active" : "nav-item"}>
          <FileText size={24} />
        </button>
        <button onClick={() => setActiveTab('calendar')} className={activeTab === 'calendar' ? "nav-item active" : "nav-item"}>
          <Calendar size={24} />
        </button>
      </div>
    </div>
  );
}