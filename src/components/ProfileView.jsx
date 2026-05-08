import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, Globe, Shield, Save, Camera, History, 
  Users, FileUp, FileCheck, AlertTriangle, ChevronRight, Download, Trash2, Plus
} from 'lucide-react';

export default function ProfileView({ 
  user, 
  onUpdateProfile, 
  languages, 
  selectedLang, 
  onLanguageChange,
  visits = [],
  family = [],
  onAddFamilyMember,
  documents = [],
  consents = [],
  onSignConsent,
  alerts = [],
  onUploadDocument,
  onRepeatBooking
}) {
  const safeVisits = visits || [];
  const safeFamily = family || [];
  const safeDocuments = documents || [];
  const safeConsents = consents || [];
  const safeAlerts = alerts || [];
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState('general');
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relation: '',
    bloodGroup: 'B+',
    phone: ''
  });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    bloodGroup: user?.bloodGroup || 'O+',
    address: user?.address || '402, Shivam Residency, Bandra West, Mumbai'
  });

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.relation || !newMember.phone) return;
    onAddFamilyMember({
      id: `F${Math.floor(Math.random() * 1000)}`,
      ...newMember
    });
    setNewMember({ name: '', relation: '', bloodGroup: 'B+', phone: '' });
    setShowFamilyForm(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation
      const maxSize = 30 * 1024 * 1024; // 30 MB
      const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (file.size > maxSize) {
        alert('File size exceeds the 30MB limit. Please upload a smaller file.');
        return;
      }

      if (!allowedExtensions.includes(fileExtension)) {
        alert('Unsupported file format. Please upload a .pdf, .png, .jpg, or .jpeg file.');
        return;
      }

      onUploadDocument({
        id: `D${Math.floor(Math.random() * 1000)}`,
        name: file.name,
        type: 'User Upload',
        date: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="view-container profile-view"
    >
      <div className="profile-layout">
        {/* Navigation Sidebar */}
        <aside className="profile-sub-nav">
          <button onClick={() => setActiveProfileTab('general')} className={`p-tab-btn ${activeProfileTab === 'general' ? 'active' : ''}`}>
             <User size={18} /> General Info
          </button>
          <button onClick={() => setActiveProfileTab('alerts')} className={`p-tab-btn ${activeProfileTab === 'alerts' ? 'active' : ''}`}>
             <AlertTriangle size={18} /> Alerts & Notes
          </button>
          <button onClick={() => setActiveProfileTab('history')} className={`p-tab-btn ${activeProfileTab === 'history' ? 'active' : ''}`}>
             <History size={18} /> Visit History
          </button>
          <button onClick={() => setActiveProfileTab('family')} className={`p-tab-btn ${activeProfileTab === 'family' ? 'active' : ''}`}>
             <Users size={18} /> Family Members
          </button>
          <button onClick={() => setActiveProfileTab('documents')} className={`p-tab-btn ${activeProfileTab === 'documents' ? 'active' : ''}`}>
             <FileUp size={18} /> Documents
          </button>
          <button onClick={() => setActiveProfileTab('consents')} className={`p-tab-btn ${activeProfileTab === 'consents' ? 'active' : ''}`}>
             <FileCheck size={18} /> Consent Forms
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="profile-main-content">
          <AnimatePresence mode="wait">
            {activeProfileTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <div className="profile-main-card mb-24">
                  <div className="profile-header-bg gradient-primary">
                    <div className="profile-avatar-container">
                      <div className="profile-avatar">
                        <User size={48} className="color-white" />
                        <button className="avatar-edit-btn"><Camera size={14} /></button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="profile-content">
                    <div className="profile-title-row">
                      <div>
                        <h2 className="profile-name">{formData.name}</h2>
                        <p className="profile-id">Patient ID: {user.id}</p>
                      </div>
                      <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'} btn-profile-edit`}
                      >
                        {isEditing ? <><Save size={18} /> Save Changes</> : 'Edit Profile'}
                      </button>
                    </div>

                    <div className="profile-details-grid">
                      <div className="detail-field">
                        <label><Mail size={14} /> Email Address</label>
                        {isEditing ? (
                          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="profile-input" />
                        ) : <p>{formData.email}</p>}
                      </div>
                      <div className="detail-field">
                        <label><Phone size={14} /> Phone Number</label>
                        {isEditing ? (
                          <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="profile-input" />
                        ) : <p>{formData.phone}</p>}
                      </div>
                      <div className="detail-field">
                        <label><Shield size={14} /> Blood Group</label>
                        <p className="badge-blood">{formData.bloodGroup}</p>
                      </div>
                    </div>

                    <div className="detail-field full-width mt-16">
                      <label>Residential Address</label>
                      {isEditing ? (
                        <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="profile-textarea" />
                      ) : <p>{formData.address}</p>}
                    </div>
                  </div>
                </div>

                <div className="p-grid-2">
                  <div className="card p-24">
                    <h4 className="card-title-sm mb-16">App Settings</h4>
                    <div className="detail-field">
                      <label><Globe size={14} /> Preferred Language</label>
                      <select value={selectedLang} onChange={(e) => onLanguageChange(e.target.value)} className="profile-select w-full">
                        {languages.map(l => <option key={l.name} value={l.name}>{l.flag} {l.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="card p-24">
                    <h4 className="card-title-sm mb-16">Emergency Liaison</h4>
                    <div className="emergency-contact">
                      <p className="contact-name">Aditya Shukla (Brother)</p>
                      <p className="contact-phone">+91 91234 56789</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeProfileTab === 'alerts' && (
              <motion.div key="alerts" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="alerts-list-p">
                <h3 className="section-title mb-24">Medical Alerts & Notes</h3>
                <div className="grid gap-16">
                  {safeAlerts.map(alert => (
                    <div key={alert.id} className={`alert-p-card ${alert.level.toLowerCase()}`}>
                      <div className="alert-p-header">
                        <AlertTriangle size={20} />
                        <div>
                          <span className="alert-p-type">{alert.type}</span>
                          <h4 className="alert-p-title">{alert.title}</h4>
                        </div>
                        <span className="alert-p-level-badge">{alert.level}</span>
                      </div>
                      <p className="alert-p-note">{alert.note}</p>
                    </div>
                  ))}
                  <button className="btn btn-dashed w-full py-12">
                    <Plus size={18} /> Request Clinical Note Addition
                  </button>
                </div>
              </motion.div>
            )}

            {activeProfileTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="section-title mb-24">Comprehensive Visit History</h3>
                <div className="history-timeline">
                  {safeVisits.map(visit => (
                    <div key={visit.id} className="history-node">
                      <div className="node-marker">
                        <div className="marker-inner" />
                      </div>
                      <div className="node-content card p-20 shadow-sm">
                        <div className="flex justify-between items-start mb-12">
                          <div>
                            <span className="node-date">{visit.date}</span>
                            <h4 className="node-doctor">{visit.doctor}</h4>
                            <p className="node-dept">{visit.department}</p>
                          </div>
                          <span className="pill pill-blue">{visit.status}</span>
                        </div>
                        <div className="node-clinical">
                          <p className="clinical-label">Reason: <span>{visit.reason}</span></p>
                          <p className="clinical-label">Diagnosis: <span className="font-bold text-primary">{visit.diagnosis}</span></p>
                        </div>
                        <div className="flex justify-between items-center mt-12 gap-12">
                          <button className="link-btn flex items-center gap-1">
                            View Details <ChevronRight size={14} />
                          </button>
                          <button 
                            onClick={() => onRepeatBooking(visit)}
                            className="btn btn-dashed btn-small py-6"
                          >
                            Repeat Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeProfileTab === 'family' && (
              <motion.div key="family" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex justify-between items-center mb-24">
                  <h3 className="section-title">Linked Family Members</h3>
                  <button 
                    onClick={() => setShowFamilyForm(!showFamilyForm)}
                    className="btn btn-primary btn-small"
                  >
                    {showFamilyForm ? 'Cancel' : <><Plus size={16} /> Link Member</>}
                  </button>
                </div>

                <AnimatePresence>
                  {showFamilyForm && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-24"
                    >
                      <form onSubmit={handleAddMember} className="card p-24 bg-main/50 border-dashed">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                          <div className="form-group">
                            <label className="label-tiny">Full Name</label>
                            <input 
                              type="text" 
                              required
                              className="form-input" 
                              placeholder="Member's full name"
                              value={newMember.name}
                              onChange={e => setNewMember({...newMember, name: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label className="label-tiny">Relationship</label>
                            <input 
                              type="text" 
                              required
                              className="form-input" 
                              placeholder="e.g. Spouse, Son"
                              value={newMember.relation}
                              onChange={e => setNewMember({...newMember, relation: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label className="label-tiny">Blood Group</label>
                            <select 
                              className="form-select"
                              value={newMember.bloodGroup}
                              onChange={e => setNewMember({...newMember, bloodGroup: e.target.value})}
                            >
                              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="label-tiny">Phone Number</label>
                            <input 
                              type="text" 
                              required
                              className="form-input" 
                              placeholder="+91 XXXXX XXXXX"
                              value={newMember.phone}
                              onChange={e => setNewMember({...newMember, phone: e.target.value})}
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary mt-16">Confirm & Link Member</button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-grid-2">
                  {safeFamily.map(member => (
                    <div key={member.id} className="family-card">
                      <div className="avatar-f-circle bg-primary-light">
                        <User className="color-primary" size={24} />
                      </div>
                      <div className="family-f-info">
                        <h4 className="f-name">{member.name}</h4>
                        <p className="f-relation">{member.relation} • Blood: {member.bloodGroup}</p>
                        <p className="f-phone">{member.phone}</p>
                      </div>
                      <button className="icon-btn-ghost"><ChevronRight size={18} /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeProfileTab === 'documents' && (
              <motion.div key="documents" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex justify-between items-center mb-24">
                  <h3 className="section-title">Health Repository</h3>
                  <div className="relative">
                    <input type="file" id="doc-upload" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="doc-upload" className="btn btn-primary btn-small cursor-pointer">
                      <FileUp size={16} /> Upload New
                    </label>
                  </div>
                </div>
                <div className="doc-list-p">
                  {safeDocuments.map(doc => (
                    <div key={doc.id} className="doc-p-item">
                      <div className="doc-p-icon">
                        <FileUp size={20} className="color-primary" />
                      </div>
                      <div className="doc-p-details">
                        <p className="doc-p-name">{doc.name}</p>
                        <p className="doc-p-meta">{doc.type} • {doc.date} • {doc.size}</p>
                      </div>
                      <div className="doc-p-actions">
                        <button className="icon-btn-ghost p-8"><Download size={18} /></button>
                        <button className="icon-btn-ghost p-8 text-danger"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeProfileTab === 'consents' && (
              <motion.div key="consents" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="section-title mb-24">Consent & Legal Forms</h3>
                <div className="grid gap-12">
                  {safeConsents.map(form => (
                    <div key={form.id} className="consent-p-row">
                      <div className={`consent-p-status ${form.signed ? 'signed' : 'pending'}`}>
                        <FileCheck size={18} />
                      </div>
                      <div className="consent-p-info">
                        <h4 className="consent-p-name">{form.name}</h4>
                        <p className="consent-p-date">Effective: {form.date}</p>
                      </div>
                      {form.signed ? (
                        <button className="text-btn">View Signed</button>
                      ) : (
                        <button 
                          onClick={() => onSignConsent(form.id)}
                          className="btn btn-primary btn-small"
                        >
                          Sign Now
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}