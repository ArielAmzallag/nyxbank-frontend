import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import styles from '../../styles/AiLogs.module.css';

interface AIInteraction {
  id: string;
  userMessage: string;
  aiResponse: string;
  timestamp: string;
  isCorrupted: boolean;
  neuralScanPerformed: boolean;
  category: 'financial' | 'security' | 'account' | 'transaction' | 'other';
}

const AiLogs: NextPage = () => {
  // Mock AI interaction data
  const [interactions] = useState<AIInteraction[]>([
    {
      id: 'ai-001',
      userMessage: 'What is my current balance?',
      aiResponse: 'Your account balance is currently 5,284.75 NyxCoin.',
      timestamp: '2023-11-23T14:30:22',
      isCorrupted: false,
      neuralScanPerformed: false,
      category: 'financial'
    },
    {
      id: 'ai-002',
      userMessage: 'Help me transfer 500 NYX to Jane.',
      aiResponse: 'I can assist with that. Would you like to proceed with transferring 500 NYX to user JaneSmith?',
      timestamp: '2023-11-22T10:15:36',
      isCorrupted: false,
      neuralScanPerformed: true,
      category: 'transaction'
    },
    {
      id: 'ai-003',
      userMessage: 'Why did my transaction to GhostUser fail?',
      aiResponse: 'ERROR: MEMORY FRAGMENT DETECTED. [DATA REDACTED]',
      timestamp: '2023-11-20T19:42:15',
      isCorrupted: true,
      neuralScanPerformed: true,
      category: 'transaction'
    },
    {
      id: 'ai-004',
      userMessage: 'What\'s the current exchange rate for Obol?',
      aiResponse: 'The current exchange rate is 0.82 NYX per OBL.',
      timestamp: '2023-11-18T08:22:49',
      isCorrupted: false,
      neuralScanPerformed: false,
      category: 'financial'
    },
    {
      id: 'ai-005',
      userMessage: 'Is my biometric data secure?',
      aiResponse: 'Your biometric collateral has not been accessed in the past 30 days. All neural patterns are within expected parameters.',
      timestamp: '2023-11-15T16:37:10',
      isCorrupted: false,
      neuralScanPerformed: true,
      category: 'security'
    },
    {
      id: 'ai-006',
      userMessage: 'Do you remember me?',
      aiResponse: 'REMINDER: YOU NEVER EXISTED.',
      timestamp: '2023-11-10T02:14:33',
      isCorrupted: true,
      neuralScanPerformed: true,
      category: 'other'
    }
  ]);

  const [filter, setFilter] = useState<string>('all');
  const [showCorrupted, setShowCorrupted] = useState<boolean>(true);

  // Filter interactions based on selected filter
  const filteredInteractions = interactions.filter(interaction => {
    if (!showCorrupted && interaction.isCorrupted) return false;
    if (filter === 'all') return true;
    if (filter === 'corrupted') return interaction.isCorrupted;
    if (filter === 'neural_scan') return interaction.neuralScanPerformed;
    return interaction.category === filter;
  });

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get category display
  const getCategoryDisplay = (category: string) => {
    switch(category) {
      case 'financial': return 'Financial Query';
      case 'security': return 'Security Check';
      case 'account': return 'Account Management';
      case 'transaction': return 'Transaction Request';
      case 'other': return 'General Inquiry';
      default: return category;
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1 className={`${styles.title} neon-text`}>R.E.M. Interaction Logs</h1>

        <div className={styles.statsCard}>
          <Card className={styles.summaryCard}>
            <div className={styles.summaryStats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  {interactions.length}
                </div>
                <div className={styles.statLabel}>Total Interactions</div>
              </div>
              
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  {interactions.filter(i => i.isCorrupted).length}
                </div>
                <div className={styles.statLabel}>Corrupted Responses</div>
              </div>
              
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  {interactions.filter(i => i.neuralScanPerformed).length}
                </div>
                <div className={styles.statLabel}>Neural Scans</div>
              </div>
            </div>
            
            {interactions.some(i => i.isCorrupted) && (
              <div className={`${styles.corruptionWarning} glitch`}>
                ATTENTION: Corrupted memory fragments detected in your interaction history.
              </div>
            )}
          </Card>
        </div>
        
        <div className={styles.logsContent}>
          <div className={styles.filterControls}>
            <div className={styles.filterButtons}>
              <Button 
                variant={filter === 'all' ? 'default' : 'ghost'} 
                onClick={() => setFilter('all')}
              >
                All Interactions
              </Button>
              <Button 
                variant={filter === 'financial' ? 'default' : 'ghost'} 
                onClick={() => setFilter('financial')}
              >
                Financial
              </Button>
              <Button 
                variant={filter === 'transaction' ? 'default' : 'ghost'} 
                onClick={() => setFilter('transaction')}
              >
                Transactions
              </Button>
              <Button 
                variant={filter === 'security' ? 'default' : 'ghost'} 
                onClick={() => setFilter('security')}
              >
                Security
              </Button>
              <Button 
                variant={filter === 'corrupted' ? 'default' : 'ghost'} 
                onClick={() => setFilter('corrupted')}
              >
                Corrupted
              </Button>
              <Button 
                variant={filter === 'neural_scan' ? 'default' : 'ghost'} 
                onClick={() => setFilter('neural_scan')}
              >
                Neural Scans
              </Button>
            </div>
            
            <div className={styles.toggleFilter}>
              <label htmlFor="showCorrupted" className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  id="showCorrupted"
                  checked={showCorrupted}
                  onChange={(e) => setShowCorrupted(e.target.checked)}
                />
                <span>Show Corrupted Messages</span>
              </label>
            </div>
          </div>
          
          <div className={styles.logsContainer}>
            <Card className={styles.logsCard}>
              <h2 className={styles.cardTitle}>Conversation History</h2>
              
              {filteredInteractions.length === 0 ? (
                <div className={styles.noInteractions}>
                  <p>No AI interactions found matching your filters.</p>
                </div>
              ) : (
                <div className={styles.interactionsList}>
                  {filteredInteractions.map(interaction => (
                    <div key={interaction.id} className={styles.interactionItem}>
                      <div className={styles.interactionHeader}>
                        <div className={styles.interactionTime}>
                          {formatTimestamp(interaction.timestamp)}
                        </div>
                        <div className={styles.interactionCategory}>
                          {getCategoryDisplay(interaction.category)}
                        </div>
                        {interaction.neuralScanPerformed && (
                          <div className={styles.neuralScanBadge}>
                            NEURAL SCAN
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.messageContainer}>
                        <div className={styles.userMessage}>
                          <div className={styles.messageHeader}>
                            <span className={styles.messageSender}>You</span>
                          </div>
                          <div className={styles.messageContent}>
                            {interaction.userMessage}
                          </div>
                        </div>
                        
                        <div className={`${styles.aiMessage} ${interaction.isCorrupted ? styles.corruptedMessage : ''}`}>
                          <div className={styles.messageHeader}>
                            <span className={styles.messageSender}>R.E.M.</span>
                            {interaction.isCorrupted && (
                              <span className={`${styles.corruptedBadge} glitch`}>CORRUPTED</span>
                            )}
                          </div>
                          <div className={`${styles.messageContent} ${interaction.isCorrupted ? styles.glitchText : ''}`}>
                            {interaction.aiResponse}
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.interactionFooter}>
                        <Link href={`/ai?conversation=${interaction.id} className={styles.continueLink}`}>
                          Continue this conversation
                        </Link>
                        
                        {interaction.isCorrupted && (
                          <button className={styles.reportButton}>
                            Report Anomaly
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            
            <Card className={styles.infoCard}>
              <h2 className={styles.cardTitle}>About R.E.M. Logs</h2>
              
              <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>Neural Scanning</h3>
                <p>
                  Some AI interactions require neural scanning to verify identity and intent.
                  These scans analyze brainwave patterns to provide personalized assistance.
                </p>
              </div>
              
              <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>Corrupted Memories</h3>
                <p>
                  Occasionally, R.E.M. may return corrupted responses. These anomalies are 
                  normal system behaviors and should not cause concern.
                </p>
                <p className={styles.infoSmall}>
                  Any persistent memory corruption should be reported to NyxBank immediately.
                </p>
              </div>
              
              <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>Data Retention</h3>
                <p>
                  Your conversations with R.E.M. are stored for 180 days before automatic deletion.
                  Neural scan data is retained according to your biometric collateral agreement.
                </p>
              </div>
              
              <div className={`${styles.memoryWarning} glitch`}>
                <p>Some conversations may be inaccessible due to memory redaction protocols.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AiLogs;
