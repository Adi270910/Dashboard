import React, { useState } from 'react';
import { 
  BarChart3, 
  MessageCircleOff, 
  BookOpen, 
  Headset, 
  History, 
  TrendingUp, 
  Clock,
  AlertCircle,
  Activity as LucideActivity,
  Plus,
  Users,
  Search,
  UserPlus,
  Save,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const analyticsData = [
  { name: 'Mon', queries: 145, solved: 130 },
  { name: 'Tue', queries: 232, solved: 210 },
  { name: 'Wed', queries: 301, solved: 280 },
  { name: 'Thu', queries: 256, solved: 240 },
  { name: 'Fri', queries: 420, solved: 390 },
  { name: 'Sat', queries: 180, solved: 170 },
  { name: 'Sun', queries: 120, solved: 115 },
];

const sentimentData = [
  { name: 'Positive', value: 65, color: '#10b981' },
  { name: 'Neutral', value: 25, color: '#6366f1' },
  { name: 'Negative', value: 10, color: '#f43f5e' },
];

const mockUnanswered = [
  { id: 1, query: "Can I get a bypass surgery estimate in Marathi?", timestamp: "10 mins ago", category: "Billing" },
  { id: 2, query: "What is the success rate of Dr. Kumar for neurology?", timestamp: "1 hour ago", category: "Medical" },
  { id: 3, query: "Do you accept international insurance from Germany?", timestamp: "2 hours ago", category: "Insurance" },
];

const mockHistory = [
  { id: 101, user: "John Doe", lastMsg: "See you on Monday.", status: "Solved", time: "09:12 AM" },
  { id: 102, user: "Sarah Smith", lastMsg: "My bill is incorrect.", status: "Handover", time: "10:05 AM" },
  { id: 103, user: "Rahul J.", lastMsg: "Does Dr. Chen speak Hindi?", status: "Solved", time: "Yesterday" },
];

const mockPatients = [
  { id: 'P101', name: 'John Doe', age: 34, gender: 'Male', phone: '+91 98765 43210', status: 'Active' },
  { id: 'P102', name: 'Sarah Smith', age: 29, gender: 'Female', phone: '+91 91234 56789', status: 'Active' },
  { id: 'P103', name: 'Rahul Jain', age: 45, gender: 'Male', phone: '+91 88888 77777', status: 'Inactive' },
];

const AdminTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'unanswered', label: 'Unanswered', icon: MessageCircleOff },
    { id: 'train', label: 'Train Knowledge', icon: BookOpen },
    { id: 'handover', label: 'Live Handover', icon: Headset },
    { id: 'history', label: 'Chat History', icon: History },
  ];

  return (
    <div className="admin-tabs-container">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default function AdminView() {
  const [activeSubTab, setActiveSubTab] = useState('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegModal, setShowRegModal] = useState(false);
  const [patients, setPatients] = useState(mockPatients);
  const [trainingQuestion, setTrainingQuestion] = useState('');
  const [trainingResponse, setTrainingResponse] = useState('');
  const [isTraining, setIsTraining] = useState(false);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    countryCode: '+91',
    phone: '',
    email: ''
  });

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegister = () => {
    if (!regForm.firstName || !regForm.phone) return;

    const newPatient = {
      id: `P${Math.floor(100 + Math.random() * 900)}`,
      name: `${regForm.firstName} ${regForm.lastName}`,
      age: calculateAge(regForm.dob),
      gender: regForm.gender,
      phone: `${regForm.countryCode} ${regForm.phone}`,
      status: 'Active'
    };

    setPatients([newPatient, ...patients]);
    setShowRegModal(false);
    
    // Reset form
    setRegForm({
      firstName: '',
      lastName: '',
      dob: '',
      gender: 'Male',
      countryCode: '+91',
      phone: '',
      email: ''
    });
  };

  function calculateAge(birthday) {
    if (!birthday) return 0;
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const countryCodes = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA/Canada' },
    { code: '+44', name: 'UK' },
    { code: '+971', name: 'UAE' },
    { code: '+61', name: 'Australia' },
  ];

  const handleTrainAI = () => {
    if (!trainingQuestion || !trainingResponse) return;
    
    setIsTraining(true);
    // Simulate AI training lag
    setTimeout(() => {
      setIsTraining(false);
      setTrainingQuestion('');
      setTrainingResponse('');
      alert('Knowledge base updated successfully! The AI will now use this pattern for future queries.');
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="view-container admin-view"
    >
      <div className="view-header">
        <h2 className="view-title">Hospital Command Center</h2>
        <p className="view-subtitle">Manage AI intelligence and live patient care.</p>
      </div>

      <AdminTabs activeTab={activeSubTab} setActiveTab={setActiveSubTab} />

      <AnimatePresence mode="wait">
        {activeSubTab === 'analytics' && (
          <motion.div 
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="analytics-grid"
          >
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="card-title">Weekly Query Volume</h3>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="dot dot-indigo" />
                    <span>Total</span>
                  </div>
                  <div className="legend-item">
                    <div className="dot dot-emerald" />
                    <span>Solved</span>
                  </div>
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="queries" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                    <Bar dataKey="solved" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="analytics-sidebar">
              <div className="mini-stats-card gradient-indigo">
                <div className="stats-header">
                  <div className="stats-icon-bg">
                    <TrendingUp size={24} />
                  </div>
                  <span className="stats-badge">+12%</span>
                </div>
                <h4 className="stats-label">Total AI Resolved</h4>
                <p className="stats-value-large">12,482</p>
                <div className="progress-mini">
                  <div className="progress-mini-fill" style={{ width: '80%' }} />
                </div>
              </div>

              <div className="sentiment-card">
                <h3 className="card-title">Patient Sentiment</h3>
                <div className="sentiment-list">
                  {sentimentData.map((item) => (
                    <div key={item.name} className="sentiment-item">
                      <div className="sent-header">
                        <span className="sent-label">{item.name}</span>
                        <span className="sent-percent" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      <div className="sent-bar-bg">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }} 
                          className="sent-bar-fill" 
                          style={{ backgroundColor: item.color }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'patients' && (
          <motion.div 
            key="patients"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="data-table-card"
          >
            <div className="table-header">
              <div className="flex-row-center gap-16 search-container-p">
                <div className="relative flex-1">
                  <Search className="search-icon-p" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search Patient Name, ID or Phone..." 
                    className="search-input-p w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button onClick={() => setShowRegModal(true)} className="btn btn-primary">
                  <UserPlus size={18} /> New Registration
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient Detail</th>
                    <th>Age/Gender</th>
                    <th>Contact</th>
                    <th>Health Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="patient-p-info">
                          <div className="avatar-f-circle bg-slate-100">
                            <span className="text-primary font-bold">{p.name[0]}</span>
                          </div>
                          <div>
                            <p className="p-name font-bold">{p.name}</p>
                            <p className="p-id text-xs text-muted">ID: {p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td>{p.age} Y / {p.gender}</td>
                      <td>{p.phone}</td>
                      <td>
                        <span className={`pill ${p.status === 'Active' ? 'pill-green' : 'pill-red'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <button className="text-btn">View Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'unanswered' && (
          <motion.div 
            key="unanswered"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="data-table-card"
          >
            <div className="table-header">
              <div>
                <h3 className="table-title">Unaddressed Queries</h3>
                <p className="table-subtitle">Patient requests where AI confidence was below thresholds.</p>
              </div>
              <button className="text-btn">Batch Clear</button>
            </div>
            <div className="unanswered-list">
              {mockUnanswered.map((item) => (
                <div key={item.id} className="unanswered-row">
                  <div className="unanswered-content">
                    <div className="unanswered-icon-bg">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <p className="unanswered-query">"{item.query}"</p>
                      <div className="unanswered-meta">
                        <span className="meta-category">{item.category}</span>
                        <span className="meta-dot">•</span>
                        <span className="meta-time"><Clock size={12} /> {item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <button className="row-action-btn">
                    Draft Response
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'train' && (
          <motion.div 
            key="train"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="training-grid"
          >
            <div className="training-form-card">
              <h3 className="card-title">Add FAQ Intelligence</h3>
              <div className="form-group">
                <label>Sample Question</label>
                <input 
                  type="text" 
                  placeholder="e.g. Do you provide oncology second opinions?" 
                  className="form-input" 
                  value={trainingQuestion}
                  onChange={(e) => setTrainingQuestion(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>AI Response</label>
                <textarea 
                  rows={4} 
                  placeholder="Write the correct factual response here..." 
                  className="form-textarea" 
                  value={trainingResponse}
                  onChange={(e) => setTrainingResponse(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-primary btn-full"
                onClick={handleTrainAI}
                disabled={isTraining || !trainingQuestion || !trainingResponse}
              >
                {isTraining ? (
                  <span className="flex-row-center gap-8"><Clock size={20} className="animate-spin" /> Processing...</span>
                ) : (
                  <><Plus size={20} /> Train Knowledge Base</>
                )}
              </button>
            </div>

            <div className="training-summary-card">
              <div className="summary-header">
                <div className="summary-icon-bg">
                  <BookOpen size={20} />
                </div>
                <h3 className="card-title-white">Training Dashboard</h3>
              </div>
              <div className="summary-list">
                <div className="summary-item-box">
                  <p className="summary-label">Current Version</p>
                  <p className="summary-value">V2.4.1 (Stable)</p>
                </div>
                <div className="summary-row">
                  <span>Total Knowledge Nodes</span>
                  <span className="val-bold">1,240</span>
                </div>
                <div className="summary-row">
                  <span>Language Coverage</span>
                  <span className="val-bold">Hindi, Marathi, English</span>
                </div>
                <div className="summary-highlight">
                  <p className="highlight-title"><LucideActivity size={16} /> Latest Lesson</p>
                  <p className="highlight-text">"Processed Marathi blood test queries for fasting norms."</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ... (Other tabs remain the same) */}
        {activeSubTab === 'handover' && (
          <motion.div 
            key="handover"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="empty-state-card"
          >
            <div className="table-header">
              <div>
                <h3 className="table-title">Live Support Queue</h3>
                <p className="table-subtitle">Patients waiting for human assistance.</p>
              </div>
              <div className="online-badge">
                02 Agents Online
              </div>
            </div>
            <div className="empty-content">
              <div className="empty-icon-bg">
                <Headset size={40} />
              </div>
              <h4 className="empty-title">Queue Clear</h4>
              <p className="empty-desc">All active sessions are being handled flawlessly by the AI Assistant.</p>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'history' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="data-table-card"
          >
            <div className="table-header header-light">
              <h3 className="table-title">Past Interactions</h3>
              <div className="table-search">
                <input type="text" placeholder="Search ID or name..." className="search-input" />
              </div>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Last Message</th>
                    <th>Resolution</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockHistory.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="patient-info">
                          <div className="avatar-square">
                            {item.user[0]}
                          </div>
                          <span className="patient-name">{item.user}</span>
                        </div>
                      </td>
                      <td className="table-cell-truncate">{item.lastMsg}</td>
                      <td>
                        <span className={`status-badge ${item.status === 'Solved' ? 'status-solved' : 'status-handover'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="time-cell">{item.time}</td>
                      <td>
                        <button className="link-btn">View Log</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="modal-content max-w-lg"
            >
              <div className="modal-header-p">
                <h3 className="modal-title">New Patient Onboarding</h3>
                <button onClick={() => setShowRegModal(false)} className="icon-btn-ghost"><X size={20} /></button>
              </div>
              <div className="modal-body-p grid gap-16 py-24">
                <div className="grid grid-cols-2 gap-12">
                   <div className="form-group">
                     <label>First Name</label>
                     <input 
                       type="text" 
                       className="form-input" 
                       placeholder="e.g. Rahul" 
                       value={regForm.firstName}
                       onChange={e => setRegForm({...regForm, firstName: e.target.value})}
                     />
                   </div>
                   <div className="form-group">
                     <label>Last Name</label>
                     <input 
                       type="text" 
                       className="form-input" 
                       placeholder="e.g. Jain" 
                       value={regForm.lastName}
                       onChange={e => setRegForm({...regForm, lastName: e.target.value})}
                     />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-12">
                   <div className="form-group">
                     <label>Date of Birth</label>
                     <input 
                       type="date" 
                       className="form-input" 
                       value={regForm.dob}
                       onChange={e => setRegForm({...regForm, dob: e.target.value})}
                     />
                   </div>
                   <div className="form-group">
                     <label>Gender</label>
                     <select 
                       className="form-input"
                       value={regForm.gender}
                       onChange={e => setRegForm({...regForm, gender: e.target.value})}
                     >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                     </select>
                   </div>
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <div className="flex gap-8">
                    <select 
                      className="form-input w-32"
                      value={regForm.countryCode}
                      onChange={e => setRegForm({...regForm, countryCode: e.target.value})}
                    >
                      {countryCodes.map(c => (
                        <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
                      ))}
                    </select>
                    <input 
                      type="text" 
                      className="form-input flex-1" 
                      placeholder="00000 00000" 
                      value={regForm.phone}
                      onChange={e => setRegForm({...regForm, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="patient@example.com" 
                    value={regForm.email}
                    onChange={e => setRegForm({...regForm, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-actions pt-0">
                <button onClick={() => setShowRegModal(false)} className="btn btn-secondary">Cancel</button>
                <button onClick={handleRegister} className="btn btn-primary"><Save size={18} /> Register Patient</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}



