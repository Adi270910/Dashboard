import React from 'react';
import { Hospital, MessageSquare, Activity, FileText, Calendar, CreditCard, User, LayoutGrid, Shield, Settings } from 'lucide-react';
import { motion } from 'motion/react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`sidebar-item ${active ? 'active' : ''}`}
  >
    <Icon size={20} className={active ? "color-primary" : ""} />
    <span className="sidebar-label">{label}</span>
    {active && <motion.div layoutId="active-nav" className="active-indicator" />}
  </button>
);

const SIDEBAR_TRANSLATIONS = {
  English: {
    dashboard: 'Dashboard',
    chat: 'AI Assistant',
    health: 'Health Track',
    lab: 'Lab Reports',
    appointments: 'Appointments',
    profile: 'Profile',
    settings: 'Settings',
    admin: 'Admin Panel',
    logout: 'Logout'
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
    logout: 'लॉगआउट'
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
    logout: 'बाहेर पडा'
  }
};

export default function Sidebar({ activeTab, setActiveTab, selectedLang = 'English' }) {
  const t = SIDEBAR_TRANSLATIONS[selectedLang] || SIDEBAR_TRANSLATIONS.English;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-container">
        <div className="logo-icon bg-primary">
          <Hospital className="color-white" size={24} />
        </div>
        <h1 className="logo-text">Nexacare<span className="color-primary">360</span></h1>
      </div>

      <nav className="sidebar-nav">
        <SidebarItem icon={LayoutGrid} label={t.dashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarItem icon={MessageSquare} label={t.chat} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        <SidebarItem icon={Activity} label={t.health} active={activeTab === 'health'} onClick={() => setActiveTab('health')} />
        <SidebarItem icon={FileText} label={t.lab} active={activeTab === 'lab'} onClick={() => setActiveTab('lab')} />
        <SidebarItem icon={Calendar} label={t.appointments} active={activeTab === 'appointments'} onClick={() => setActiveTab('calendar')} />
        <SidebarItem icon={User} label={t.profile} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        <SidebarItem icon={Settings} label={t.settings} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        <SidebarItem icon={Shield} label={t.admin} active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-card">
          <div className="user-icon-container">
            <User className="color-slate-400" size={18} />
          </div>
          <div className="user-details">
            <p className="user-label">Current User</p>
            <p className="user-name">John Doe</p>
            <p className="user-id">ID: P101</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

