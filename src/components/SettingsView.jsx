import React from 'react';
import { motion } from 'motion/react';
import {  
  Bell, 
  Shield, 
  Sun, 
  Smartphone, 
  Lock, 
  Eye, 
  BellRing,
} from 'lucide-react';

const SETTINGS_TRANSLATIONS = {
  English: {
    title: "Settings & Preferences",
    subtitle: "Manage your account security, notification triggers, and app behavior.",
    appearance: "Appearance",
    appearanceDesc: "Customize how the application looks to you.",
    darkMode: "Dark Mode",
    darkModeSub: "Optimize the display for low light environments.",
    language: "Interface Language",
    languageSub: "Choose your preferred system language.",
    notifications: "Notifications",
    notificationsDesc: "Keep track of appointments and lab results.",
    push: "Push Notifications",
    pushSub: "Alerts for upcoming visits and reports.",
    email: "Email Summaries",
    emailSub: "Periodic health summaries delivered to inbox.",
    security: "Security & Privacy",
    securityDesc: "Manage authentication and data visibility.",
    changePass: "Change Password",
    activeDev: "Active Devices",
    privacy: "Privacy Policy",
    emergencyLogs: "Emergency Logs",
    privacyData: "Privacy & Data",
    privacyDataDesc: "Control how your health data is used and stored.",
    biometric: "Biometric Lock",
    biometricSub: "Use FaceID/Fingerprint for extra security.",
    dataSharing: "Data Sharing",
    dataSharingSub: "Share anonymous data for medical research.",
    twoFactor: "2FA Authentication",
    twoFactorSub: "Extra layer of security for your account."
  },
  Hindi: {
    title: "सेटिंग्स और प्राथमिकताएं",
    subtitle: "अपने खाते की सुरक्षा, अधिसूचना ट्रिगर और ऐप व्यवहार को प्रबंधित करें।",
    appearance: "दिखावट",
    appearanceDesc: "एप्लिकेशन आपके लिए कैसा दिखता है इसे अनुकूलित करें।",
    darkMode: "डार्क मोड",
    darkModeSub: "कम रोशनी वाले वातावरण के लिए डिस्प्ले को अनुकूलित करें।",
    language: "इंटरफ़ेस भाषा",
    languageSub: "अपनी पसंदीदा सिस्टम भाषा चुनें।",
    notifications: "अधिसूचना",
    notificationsDesc: "अपॉइंटमेंट और लैब परिणामों पर नज़र रखें।",
    push: "पुश नोटिफिकेशन",
    pushSub: "आगामी विज़िट और रिपोर्ट के लिए अलर्ट।",
    email: "ईमेल सारांश",
    emailSub: "इनबॉक्स में वितरित समय-समय पर स्वास्थ्य सारांश।",
    security: "सुरक्षा और गोपनीयता",
    securityDesc: "प्रमाणीकरण और डेटा दृश्यता प्रबंधित करें।",
    changePass: "पासवर्ड बदलें",
    activeDev: "सक्रिय डिवाइस",
    privacy: "गोपनीयता नीति",
    emergencyLogs: "आपातकालीन लॉग",
    privacyData: "गोपनीयता और डेटा",
    privacyDataDesc: "आपका स्वास्थ्य डेटा कैसे उपयोग और संग्रहीत किया जाता है, इसे नियंत्रित करें।",
    biometric: "बायोमेट्रिक लॉक",
    biometricSub: "अतिरिक्त सुरक्षा के लिए FaceID/फ़िंगरप्रिंट का उपयोग करें।",
    dataSharing: "डेटा साझाकरण",
    dataSharingSub: "चिकित्सा अनुसंधान के लिए गुमनाम डेटा साझा करें।",
    twoFactor: "2FA प्रमाणीकरण",
    twoFactorSub: "आपके खाते के लिए सुरक्षा की अतिरिक्त परत।"
  },
  Marathi: {
    title: "सेटिंग्ज आणि प्राधान्ये",
    subtitle: "तुमच्या खात्याची सुरक्षा, अधिसूचना ट्रिगर आणि अ‍ॅप वर्तन व्यवस्थापित करा.",
    appearance: "दिसणे",
    appearanceDesc: "अ‍ॅप्लिकेशन तुमच्यासाठी कसे दिसते ते सानुकूलित करा.",
    darkMode: "डार्क मोड",
    darkModeSub: "कमी उजेडात पाहण्यासाठी डिस्प्ले अनुकूल करा.",
    language: "इंटरफेस भाषा",
    languageSub: "तुमची आवडती सिस्टम भाषा निवडा.",
    notifications: "अधिसूचना",
    notificationsDesc: "अपॉइंटमेंट आणि लॅब रिझल्ट्सचा मागोवा ठेवा.",
    push: "पुश अधिसूचना",
    pushSub: "येणाऱ्या व्हिजिट आणि रिपोर्टसाठी अलर्ट.",
    email: "ईमेल सारांश",
    emailSub: "इनबॉक्समध्ये वितरित केलेले नियतकालिक आरोग्य सारांश.",
    security: "सुरक्षा आणि गोपनीयता",
    securityDesc: "प्रमाणीकरण आणि डेटा दृश्यमानता व्यवस्थापित करा.",
    changePass: "पासवर्ड बदला",
    activeDev: "सक्रिय उपकरणे",
    privacy: "गोपनीयता धोरण",
    emergencyLogs: "आत्त्काळ लॉग",
    privacyData: "गोपनीयता आणि डेटा",
    privacyDataDesc: "तुमचा आरोग्य डेटा कसा वापरला आणि साठवला जातो हे नियंत्रित करा.",
    biometric: "बायोमेट्रिक लॉक",
    biometricSub: "अतिरिक्त सुरक्षेसाठी FaceID/फिंगरप्रिंट वापरा.",
    dataSharing: "डेटा शेअरिंग",
    dataSharingSub: "वैद्यकीय संशोधनासाठी अनामित डेटा शेअर करा.",
    twoFactor: "2FA प्रमाणीकरण",
    twoFactorSub: "तुमच्या खात्यासाठी सुरक्षेचा अतिरिक्त स्तर."
  }
};

export default function SettingsView({ 
  isDarkMode, 
  selectedLang = 'English', 
  languages, 
  onLanguageChange,
  toggleTheme,
  settings,
  onUpdateSettings
}) {
  const t = SETTINGS_TRANSLATIONS[selectedLang] || SETTINGS_TRANSLATIONS.English;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="view-container settings-view"
    >
      <div className="view-header">
        <h2 className="view-title">{t.title}</h2>
        <p className="view-subtitle">{t.subtitle}</p>
      </div>

      <div className="settings-grid">
        {/* Appearance */}
        <div className="settings-card card">
          <div className="settings-header">
            <div className="settings-icon-bg bg-indigo-100">
              <Sun size={20} className="color-primary" />
            </div>
            <div>
              <h3 className="settings-title">{t.appearance}</h3>
              <p className="settings-desc">{t.appearanceDesc}</p>
            </div>
          </div>
          <div className="settings-options">
            <div className="option-item">
              <div className="option-info">
                <span className="option-label">{t.darkMode}</span>
                <span className="option-sub">{t.darkModeSub}</span>
              </div>
              <button 
                onClick={toggleTheme}
                className={`theme-switch ${isDarkMode ? 'active' : ''}`}
              >
                <div className="switch-knob" />
              </button>
            </div>
            <div className="option-item">
              <div className="option-info">
                 <span className="option-label">{t.language}</span>
                 <span className="option-sub">{t.languageSub}</span>
              </div>
              <select 
                value={selectedLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="settings-select"
              >
                {languages.map(lang => (
                  <option key={lang.name} value={lang.name}>{lang.flag} {lang.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card card">
          <div className="settings-header">
            <div className="settings-icon-bg bg-amber-100">
              <Bell size={20} className="text-amber-600" />
            </div>
            <div>
              <h3 className="settings-title">{t.notifications}</h3>
              <p className="settings-desc">{t.notificationsDesc}</p>
            </div>
          </div>
          <div className="settings-options">
            <div className="option-item">
              <div className="option-info">
                <span className="option-label">{t.push}</span>
                <span className="option-sub">{t.pushSub}</span>
              </div>
              <button 
                onClick={() => onUpdateSettings({ notifications: !settings.notifications })}
                className={`theme-switch ${settings.notifications ? 'active' : ''}`}
              >
                <div className="switch-knob" />
              </button>
            </div>
            <div className="option-item">
              <div className="option-info">
                <span className="option-label">{t.email}</span>
                <span className="option-sub">{t.emailSub}</span>
              </div>
              <button 
                onClick={() => onUpdateSettings({ emailSummary: !settings.emailSummary })}
                className={`theme-switch ${settings.emailSummary ? 'active' : ''}`}
              >
                <div className="switch-knob" />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="settings-card card full-width-sm">
          <div className="settings-header">
            <div className="settings-icon-bg bg-emerald-100">
              <Shield size={20} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="settings-title">{t.security}</h3>
              <p className="settings-desc">{t.securityDesc}</p>
            </div>
          </div>
          <div className="settings-links-grid">
            <button className="settings-link-card">
              <Lock size={24} />
              <span>{t.changePass}</span>
            </button>
            <button className="settings-link-card">
              <Smartphone size={24} />
              <span>{t.activeDev}</span>
            </button>
            <button className="settings-link-card">
              <Eye size={24} />
              <span>{t.privacy}</span>
            </button>
            <button className="settings-link-card">
              <BellRing size={24} />
              <span>{t.emergencyLogs}</span>
            </button>
          </div>
        </div>

        {/* Privacy & Data - NEW SECTION */}
        <div className="settings-card card">
          <div className="settings-header">
            <div className="settings-icon-bg bg-rose-100">
              <Eye size={20} className="text-rose-600" />
            </div>
            <div>
              <h3 className="settings-title">{t.privacyData}</h3>
              <p className="settings-desc">{t.privacyDataDesc}</p>
            </div>
          </div>
          <div className="settings-options">
            <div className="option-item">
              <div className="option-info">
                <span className="option-label">{t.biometric}</span>
                <span className="option-sub">{t.biometricSub}</span>
              </div>
              <button 
                onClick={() => onUpdateSettings({ biometric: !settings.biometric })}
                className={`theme-switch ${settings.biometric ? 'active' : ''}`}
              >
                <div className="switch-knob" />
              </button>
            </div>
            <div className="option-item">
              <div className="option-info">
                <span className="option-label">{t.dataSharing}</span>
                <span className="option-sub">{t.dataSharingSub}</span>
              </div>
              <button 
                onClick={() => onUpdateSettings({ dataSharing: !settings.dataSharing })}
                className={`theme-switch ${settings.dataSharing ? 'active' : ''}`}
              >
                <div className="switch-knob" />
              </button>
            </div>
            <div className="option-item">
              <div className="option-info">
                <span className="option-label">{t.twoFactor}</span>
                <span className="option-sub">{t.twoFactorSub}</span>
              </div>
              <button 
                onClick={() => onUpdateSettings({ twoFactor: !settings.twoFactor })}
                className={`theme-switch ${settings.twoFactor ? 'active' : ''}`}
              >
                <div className="switch-knob" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
