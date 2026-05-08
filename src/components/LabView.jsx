import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, CheckCircle2, Clock, Activity, ChevronRight, X, FlaskConical, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MetricChart = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return null;

  const data = metrics.map(m => ({
    name: m.name,
    value: m.value,
    min: m.min,
    max: m.max,
    unit: m.unit,
    isNormal: m.value >= m.min && m.value <= m.max
  }));

  return (
    <div className="metric-chart-box">
      <h4 className="box-label mb-16 flex items-center gap-2">
        <Activity size={14} className="color-primary" /> Reference Range Analysis
      </h4>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={90} style={{ fontSize: '11px', fontWeight: 'bold', fill: '#64748b' }} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="chart-custom-tooltip">
                      <p className="tooltip-title">{d.name}</p>
                      <p className="tooltip-val">{d.value} <span className="text-muted">{d.unit}</span></p>
                      <div className="tooltip-meta">
                        <span>Range: {d.min}-{d.max}</span>
                        <span className={d.isNormal ? 'text-success' : 'text-danger'}>
                          {d.isNormal ? 'Normal' : 'Attention'}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isNormal ? '#10b981' : '#f43f5e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {!data.every(d => d.isNormal) && (
        <div className="chart-alert-banner">
          <AlertCircle size={14} />
          <span>One or more values are outside the reference range. Consult your physician.</span>
        </div>
      )}
    </div>
  );
};

export default function LabView({ reports = [] }) {
  const safeReports = reports || [];
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="view-container labs-view"
    >
      <div className="labs-grid">
        {safeReports.map((report) => (
          <div key={report.id} className="lab-report-card">
             <div className="card-badge-abs">
               {report.status === 'Completed' ? (
                 <CheckCircle2 className="color-emerald" size={20} />
               ) : (
                 <Clock className="color-amber" size={20} />
               )}
             </div>
             <div className="report-header">
               <div className="report-icon-bg">
                 <FileText size={18} />
               </div>
               <div>
                 <p className="report-id">{report.id}</p>
                 <h3 className="report-name">{report.testName}</h3>
               </div>
             </div>
             <div className="report-details">
               <div className="report-row">
                 <span className="row-label">Date</span>
                 <span className="row-value">{report.date}</span>
               </div>
               <div className="report-row">
                 <span className="row-label">Status</span>
                 <span className={`status-badge-small ${report.status === 'Completed' ? 'status-solved' : 'status-handover'}`}>
                    {report.status}
                 </span>
               </div>
               {report.result && (
                  <div className="report-summary-box">
                     <p className="box-label">Result Summary</p>
                     <p className="box-value">{report.result}</p>
                  </div>
               )}
             </div>
             <button 
               onClick={() => setSelectedBreakdown(report)}
               className="btn btn-secondary btn-small btn-full-width"
             >
                <Activity size={14} /> Full Technical Breakdown <ChevronRight size={14} />
             </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedBreakdown && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-content lab-breakdown-modal"
            >
              <div className="modal-inner">
                <header className="breakdown-header">
                  <div className="breakdown-title-group">
                    <div className="icon-box-primary">
                      <FlaskConical size={24} />
                    </div>
                    <div>
                      <h3 className="breakdown-test-name">{selectedBreakdown.testName}</h3>
                      <p className="breakdown-id-tag">Report ID: {selectedBreakdown.id}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedBreakdown(null)}
                    className="icon-btn-ghost"
                  >
                    <X size={24} />
                  </button>
                </header>

                <div className="breakdown-scroll-view">
                  {selectedBreakdown.metrics && <MetricChart metrics={selectedBreakdown.metrics} />}
                  <div className="breakdown-content markdown-body">
                    <ReactMarkdown>
                      {selectedBreakdown.breakdown || "### Technical Breakdown\nTechnical details for this report are currently being synthesized. Please check back shortly for a full metabolic analysis."}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="breakdown-footer">
                  <div className="footer-info">
                    <Activity size={14} className="color-primary" />
                    <span>Verified by Nexacare Lab HMS</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBreakdown(null)}
                    className="btn btn-primary"
                  >
                    Close Analysis
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



