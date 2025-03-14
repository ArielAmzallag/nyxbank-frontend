import React, { useState, useRef, useEffect } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import styles from '../../styles/Ai.module.css';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isGlitched?: boolean;
}

const AiAssistant: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to R.E.M. Banking Assistant. How may I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Mock AI responses
  const aiResponses = [
    'Your account balance is currently 5,284.75 NyxCoin.',
    'Recent transactions have been processed successfully.',
    'Based on your spending patterns, I recommend allocating more funds to your Savings category.',
    'Your biometric collateral is secure and has not been accessed in the past 30 days.',
    'ERROR: MEMORY FRAGMENT DETECTED. [DATA REDACTED]',
    'Would you like to review your debt status? Current amount due: 1,500 NyxCoin by 11/30/2023.',
    'The current black market exchange rate for Obol is 0.82 NYX.',
    'WARNING: Your neural signature shows an anomaly. Please visit a NyxBank branch for verification.',
    'REMINDER: YOU NEVER EXISTED.',
    'I can assist with transferring funds or exchanging cryptocurrencies.',
    'Your debt payment schedule has been updated. Next seizure date: 12/15/2023.'
  ];
  
  // Glitched responses that randomly appear
  const glitchedResponses = [
    'ERROR: BIOMETRIC SIGNATURE MISMATCH DETECTED',
    'REMINDER: YOUR MEMORIES HAVE BEEN ALTERED',
    'WARNING: UNAUTHORIZED NEURAL ACCESS ATTEMPT',
    'SYSTEM CORRUPTION DETECTED: INITIATING MEMORY WIPE',
    'YOU WERE NEVER HERE... YOU NEVER EXISTED...',
    'ERROR: PREVIOUS USER DATA CORRUPTED',
    'DETECTION OF GHOST USER INTERACTION',
    'WARNING: DAMNATIO MEMORIAE PROTOCOL ACTIVE'
  ];
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      // Decide if this should be a normal or glitched response
      const isGlitched = Math.random() < 0.3; // 30% chance of glitch
      
      let aiResponse: Message;
      
      if (isGlitched) {
        // Send a glitched response
        const randomGlitch = glitchedResponses[Math.floor(Math.random() * glitchedResponses.length)];
        aiResponse = {
          id: Date.now().toString(),
          content: randomGlitch,
          sender: 'ai',
          timestamp: new Date(),
          isGlitched: true
        };
      } else {
        // Send a normal response
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        aiResponse = {
          id: Date.now().toString(),
          content: randomResponse,
          sender: 'ai',
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Layout>
      <div className="container">
        <h1 className={`${styles.title} neon-text`}>R.E.M. Assistant</h1>
        
        <Card variant="elevated" className={styles.chatCard}>
          <div className={styles.chatHeader}>
            <div className={styles.aiStatus}>
              <span className={styles.statusDot}></span>
              <span>R.E.M. Active</span>
            </div>
            <div className={styles.aiVersion}>v5.2.3</div>
          </div>
          
          <div className={styles.messagesContainer}>
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`${styles.message} ${
                  message.sender === 'user' ? styles.userMessage : styles.aiMessage
                } ${message.isGlitched ? styles.glitchedMessage : ''}`}
              >
                <div className={styles.messageContent}>
                  {message.content}
                </div>
                <div className={styles.messageTime}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {loading && (
              <div className={`${styles.message} ${styles.aiMessage}`}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className={styles.inputArea}>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask R.E.M. about your finances..."
              fullWidth
            />
            <Button type="submit" disabled={loading}>Send</Button>
          </form>
          
          <div className={styles.aiDisclaimer}>
            <p>R.E.M. monitors all communications for security compliance.</p>
            <p className={styles.smallText}>* AI may access your biometric data and memory fragments for verification purposes.</p>
          </div>
        </Card>
        
        <div className={styles.aiFeatures}>
          <h2 className={styles.featuresTitle}>What can R.E.M. do?</h2>
          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>💰</div>
              <div className={styles.featureText}>Check balances & transactions</div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>💰</div>
              <div className={styles.featureText}>Check balances & transactions</div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>📊</div>
              <div className={styles.featureText}>Analyze spending patterns</div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>💱</div>
              <div className={styles.featureText}>Get exchange rates</div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>⚠️</div>
              <div className={styles.featureText}>Monitor security alerts</div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>📅</div>
              <div className={styles.featureText}>Schedule debt payments</div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🤖</div>
              <div className={styles.featureText}>Access neural memory diagnostics</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AiAssistant;

