import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bot, AlertCircle, Loader2, Send, Stethoscope, Mic, PhoneCall } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`message-row ${isUser ? 'user-row' : 'bot-row'}`}>
      <div className={`message-container ${isUser ? 'flex-reverse' : 'flex-row'}`}>
        <div className={`avatar ${isUser ? 'avatar-user' : 'avatar-bot'}`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-bot'}`}>
          <div className="markdown-body">
            <ReactMarkdown>{message.parts[0].text}</ReactMarkdown>
          </div>
          {message.sentiment === 'urgent' && (
            <div className="urgent-flag">
              <AlertCircle size={14} /> Critical: High Urgency detected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ChatView({ 
  scrollRef, 
  messages, 
  loading, 
  escalated, 
  input, 
  setInput, 
  handleSend, 
  toggleRecording, 
  isRecording,
  suggestions = []
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="view-container chat-view"
    >
      <div 
        ref={scrollRef}
        className="messages-list"
      >
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {loading && (
          <div className="message-row bot-row">
            <div className="message-container flex-row">
              <div className="avatar avatar-bot">
                <Bot size={16} className="avatar-icon-dim animate-pulse" />
              </div>
              <div className="message-bubble bubble-bot typing-bubble">
                <Loader2 size={14} className="animate-spin color-primary" />
                <span className="italic-text">Hospital Assistant is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <AnimatePresence>
          {escalated && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="escalation-card"
            >
              <div className="escalation-icon-bg">
                <PhoneCall size={20} />
              </div>
              <div className="escalation-content">
                <h4 className="escalation-title">Transferring to Human Agent</h4>
                <p className="escalation-desc">
                  Your case has been flagged for prioritized assistance. An on-duty coordinator is being notified of this session.
                </p>
                <div className="escalation-actions">
                  <button className="esc-btn btn-outline">
                    Hold Connection
                  </button>
                  <button className="esc-btn btn-solid">
                    Join Call Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-12 mt-auto">
        <div className="chat-suggestions">
          {suggestions.map((suggestion, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                setInput(suggestion);
                // Optional: trigger handleSend automatically if desired
              }} 
              className="chip"
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        <div className="chat-input-bar">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about reports, doctors, or symptoms..."
            className="chat-input-field"
          />
          <div className="input-actions">
            <button 
              onClick={toggleRecording}
              className={`action-btn-circle ${isRecording ? 'recording-active' : ''}`}
            >
              <Mic size={20} />
              {isRecording && (
                <span className="ping-dot" />
              )}
            </button>
            <button 
              onClick={() => setInput("I'm feeling some symptoms and would like a check-up.")}
              className="action-btn-circle"
              title="Symptom Checker"
            >
              <Stethoscope size={20} />
            </button>
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="send-btn"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

