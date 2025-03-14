import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import styles from '../../styles/HiddenTransactions.module.css';

// Transaction type definition
interface HiddenTransaction {
  id: string;
  originalId: string;
  sender: {
    id: string;
    username: string;
    status: 'active' | 'erased' | 'suspended';
  };
  recipient: {
    id: string;
    username: string;
    status: 'active' | 'erased' | 'suspended';
  };
  amount: number;
  currency: string;
  type: 'transfer' | 'black_market' | 'crypto_trade' | 'loan_payment';
  timestamp: string;
  redactionDate: string;
  redactionReason: string;
  redactionLevel: 1 | 2 | 3 | 4;
  recoverable: boolean;
  securityFlags: string[];
  accessLog: {
    username: string;
    timestamp: string;
    action: string;
  }[];
}

const HiddenTransactions: NextPage = () => {
  // Mock data for hidden transactions
  const [transactions, setTransactions] = useState<HiddenTransaction[]>([
    {
      id: 'hidden-001',
      originalId: 'tx4-redacted',
      sender: {
        id: 'u1001',
        username: 'JohnDoe',
        status: 'active'
      },
      recipient: {
        id: 'u-erased-291',
        username: 'GhostUser127',
        status: 'erased'
      },
      amount: 1200,
      currency: 'DRM',
      type: 'black_market',
      timestamp: '2023-11-05T23:15:00',
      redactionDate: '2023-11-06T02:30:15',
      redactionReason: 'Illegal transaction with erased entity',
      redactionLevel: 3,
      recoverable: true,
      securityFlags: ['black_market', 'erased_user', 'high_value'],
      accessLog: [
        {
          username: 'SecurityAdmin',
          timestamp: '2023-11-06T02:30:15',
          action: 'REDACT'
        },
        {
          username: 'SystemAudit',
          timestamp: '2023-11-10T14:22:07',
          action: 'VIEW'
        }
      ]
    },
    {
      id: 'hidden-002',
      originalId: 'tx7-redacted',
      sender: {
        id: 'u-erased-173',
        username: 'DeletedUser',
        status: 'erased'
      },
      recipient: {
        id: 'u2042',
        username: 'SarahJohnson',
        status: 'active'
      },
      amount: 500,
      currency: 'NYX',
      type: 'transfer',
      timestamp: '2023-10-28T17:35:22',
      redactionDate: '2023-10-28T18:10:45',
      redactionReason: 'Transaction involving erased user',
      redactionLevel: 2,
      recoverable: true,
      securityFlags: ['erased_user', 'automatic_redaction'],
      accessLog: [
        {
          username: 'System',
          timestamp: '2023-10-28T18:10:45',
          action: 'AUTO_REDACT'
        }
      ]
    },
    {
      id: 'hidden-003',
      originalId: 'tx19-redacted',
      sender: {
        id: 'u4523',
        username: 'RobertChen',
        status: 'active'
      },
      recipient: {
        id: 'system-black-market',
        username: 'BlackMarket',
        status: 'active'
      },
      amount: 3500,
      currency: 'OBL',
      type: 'black_market',
      timestamp: '2023-11-12T02:15:17',
      redactionDate: '2023-11-12T02:16:01',
      redactionReason: 'Class-A prohibited transaction',
      redactionLevel: 4,
      recoverable: false,
      securityFlags: ['black_market', 'extreme_value', 'prohibited', 'neural_signature_mismatch'],
      accessLog: [
        {
          username: 'SecurityAdmin',
          timestamp: '2023-11-12T02:16:01',
          action: 'REDACT'
        },
        {
          username: 'ForensicAuditor',
          timestamp: '2023-11-13T10:05:33',
          action: 'VIEW'
        },
        {
          username: 'R.E.M.',
          timestamp: '2023-11-15T00:00:00',
          action: 'SCAN'
        }
      ]
    },
    {
      id: 'hidden-004',
      originalId: 'tx23-redacted',
      sender: {
        id: 'u3872',
        username: 'AliceSmith',
        status: 'active'
      },
      recipient: {
        id: 'u2042',
        username: 'SarahJohnson',
        status: 'active'
      },
      amount: 250,
      currency: 'NYX',
      type: 'transfer',
      timestamp: '2023-11-18T09:23:45',
      redactionDate: '2023-11-18T15:40:12',
      redactionReason: 'User requested deletion - privacy protocol',
      redactionLevel: 1,
      recoverable: true,
      securityFlags: ['user_requested'],
      accessLog: [
        {
          username: 'PrivacyOfficer',
          timestamp: '2023-11-18T15:40:12',
          action: 'REDACT'
        }
      ]
    },
    {
      id: 'hidden-005',
      originalId: 'tx31-redacted',
      sender: {
        id: 'system-debt',
        username: 'DebtEnforcement',
        status: 'active'
      },
      recipient: {
        id: 'u-biometric-collection',
        username: 'BiometricVault',
        status: 'active'
      },
      amount: 0,
      currency: 'BIO',
      type: 'loan_payment',
      timestamp: '2023-11-20T00:01:00',
      redactionDate: '2023-11-20T00:01:30',
      redactionReason: 'Automatic redaction of biometric collection',
      redactionLevel: 3,
      recoverable: false,
      securityFlags: ['biometric_collection', 'automatic_redaction', 'enforcement_protocol'],
      accessLog: [
        {
          username: 'System',
          timestamp: '2023-11-20T00:01:30',
          action: 'AUTO_REDACT'
        },
        {
          username: 'EnforcementOfficer',
          timestamp: '2023-11-20T09:15:22',
          action: 'VIEW'
        }
      ]
    }
  ]);

  // Filter and search states
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<HiddenTransaction | null>(null);
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'accessLog', 'recovery'
  const [showUnredactWarning, setShowUnredactWarning] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [accessError, setAccessError] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);

  // Apply filters
  const filteredTransactions = transactions.filter(tx => {
    // Filter by type
    const typeMatch = filter === 'all' || 
                     (filter === 'black_market' && tx.type === 'black_market') ||
                     (filter === 'ghost' && (tx.sender.status === 'erased' || tx.recipient.status === 'erased')) ||
                     (filter === 'high_security' && tx.redactionLevel >= 3);
    
    // Filter by search query
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = searchQuery === '' ||
                      tx.sender.username.toLowerCase().includes(searchLower) ||
                      tx.recipient.username.toLowerCase().includes(searchLower) ||
                      tx.originalId.toLowerCase().includes(searchLower);
    
    return typeMatch && searchMatch;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get transaction type display
  const getTypeDisplay = (type: string) => {
    switch(type) {
      case 'black_market': return 'Black Market';
      case 'transfer': return 'Transfer';
      case 'crypto_trade': return 'Crypto Trade';
      case 'loan_payment': return 'Loan Payment';
      default: return type.replace('_', ' ');
    }
  };

  // Get redaction level display
  const getRedactionLevelClass = (level: number) => {
    switch(level) {
      case 1: return styles.levelOne;
      case 2: return styles.levelTwo;
      case 3: return styles.levelThree;
      case 4: return styles.levelFour;
      default: return '';
    }
  };

  // Handle transaction selection
  const handleSelectTransaction = (tx: HiddenTransaction) => {
    setSelectedTransaction(tx);
    setActiveTab('details');
    setShowUnredactWarning(false);
    setAccessCode('');
    setAccessError('');
    
    // Log this access
    if (tx) {
      const updatedTransactions = transactions.map(t => {
        if (t.id === tx.id) {
          return {
            ...t,
            accessLog: [
              ...t.accessLog,
              {
                username: 'AdminUser', // In a real app, this would be the logged-in user
                timestamp: new Date().toISOString(),
                action: 'VIEW'
              }
            ]
          };
        }
        return t;
      });
      
      setTransactions(updatedTransactions);
      
      // Also update the selected transaction
      setSelectedTransaction({
        ...tx,
        accessLog: [
          ...tx.accessLog,
          {
            username: 'AdminUser',
            timestamp: new Date().toISOString(),
            action: 'VIEW'
          }
        ]
      });
    }
  };

  // Handle unredaction attempt
  const handleUnredactAttempt = () => {
    setShowUnredactWarning(true);
  };

  // Handle unredact confirmation
  const handleUnredactConfirm = () => {
    if (accessCode !== 'AUTHORIZE') {
      setAccessError('Invalid authorization code');
      return;
    }
    
    if (!selectedTransaction) return;
    
    setIsRestoring(true);
    setAccessError('');
    
    // Simulate API call
    setTimeout(() => {
      // Update transactions list - removing the unredacted transaction
      const updatedTransactions = transactions.filter(t => t.id !== selectedTransaction.id);
      setTransactions(updatedTransactions);
      
      // Reset UI state
      setSelectedTransaction(null);
      setShowUnredactWarning(false);
      setIsRestoring(false);
    }, 2000);
  };

  // Random glitch effect for UI elements
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.93) { // Occasionally trigger glitch
        const elements = document.querySelectorAll(`.${styles.glitchTarget}`);
        if (elements.length > 0) {
          const randomElement = elements[Math.floor(Math.random() * elements.length)];
          randomElement.classList.add(styles.activeGlitch);
          setTimeout(() => {
            randomElement.classList.remove(styles.activeGlitch);
          }, 200);
        }
      }
    }, 2000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <Layout>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1 className={`${styles.pageTitle} neon-text glitchTarget`}>
            Hidden Transaction Records
          </h1>
          <div className={styles.securityBadge}>
            Clearance Level: Maximum
          </div>
        </div>
        
        <div className={styles.warningBanner}>
          <div className={`${styles.warningContent} glitch`}>
            WARNING: Accessing these records is logged. All actions are monitored.
          </div>
        </div>
        
        <div className={styles.pageContainer}>
          <div className={styles.transactionsPanel}>
            <Card className={styles.filtersCard}>
              <div className={styles.filtersContent}>
                <div className={styles.filtersTabs}>
                  <button 
                    className={`${styles.filterTab} ${filter === 'all' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    All Records
                  </button>
                  <button 
                    className={`${styles.filterTab} ${filter === 'black_market' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('black_market')}
                  >
                    Black Market
                  </button>
                  <button 
                    className={`${styles.filterTab} ${filter === 'ghost' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('ghost')}
                  >
                    Ghost Users
                  </button>
                  <button 
                    className={`${styles.filterTab} ${filter === 'high_security' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('high_security')}
                  >
                    High Security
                  </button>
                </div>
                
                <div className={styles.searchBar}>
                  <Input
                    placeholder="Search by ID, username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                  />
                </div>
              </div>
            </Card>
            
            <Card className={styles.transactionsCard}>
              <div className={styles.transactionsHeader}>
                <h2 className={styles.sectionTitle}>Redacted Records</h2>
                <div className={styles.recordCount}>
                  {filteredTransactions.length} record{filteredTransactions.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className={styles.transactionsList}>
                {filteredTransactions.length === 0 ? (
                  <div className={styles.noRecords}>
                    <p>No hidden records found matching your criteria.</p>
                  </div>
                ) : (
                  filteredTransactions.map(tx => (
                    <div
                      key={tx.id}
                      className={`${styles.transactionItem} ${selectedTransaction?.id === tx.id ? styles.selectedTransaction : ''}`}
                      onClick={() => handleSelectTransaction(tx)}
                    >
                      <div className={styles.transactionHeader}>
                        <span className={styles.transactionId}>{tx.originalId}</span>
                        <span className={`${styles.redactionLevel} ${getRedactionLevelClass(tx.redactionLevel)}`}>
                          Level {tx.redactionLevel}
                        </span>
                      </div>
                      
                      <div className={styles.transactionDetails}>
                        <div className={styles.transactionType}>
                          {getTypeDisplay(tx.type)}
                        </div>
                        
                        <div className={styles.transactionParties}>
                          <div className={styles.transactionSender}>
                            <span className={styles.partyLabel}>From:</span>
                            <span className={`${styles.username} ${tx.sender.status === 'erased' ? styles.erasedUser : ''}`}>
                              {tx.sender.username}
                            </span>
                          </div>
                          
                          <div className={styles.transactionRecipient}>
                            <span className={styles.partyLabel}>To:</span>
                            <span className={`${styles.username} ${tx.recipient.status === 'erased' ? styles.erasedUser : ''}`}>
                              {tx.recipient.username}
                            </span>
                          </div>
                        </div>
                        
                        <div className={styles.transactionAmount}>
                          {tx.amount.toLocaleString()} {tx.currency}
                        </div>
                      </div>
                      
                      <div className={styles.transactionFooter}>
                        <div className={styles.transactionDate}>
                          {formatDate(tx.timestamp)}
                        </div>
                        
                        <div className={styles.transactionFlags}>
                        {tx.securityFlags.slice(0, 2).map((flag) => (
                            <span key={`flag-${flag}`} className={styles.securityFlag}>
                                {flag.replace('_', ' ')}
                            </span>
                            ))}
                          {tx.securityFlags.length > 2 && (
                            <span className={styles.moreFlags}>
                              +{tx.securityFlags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
          
          <div className={styles.detailsPanel}>
            {selectedTransaction ? (
              <Card className={styles.detailsCard}>
                <div className={styles.detailsHeader}>
                  <h2 className={styles.detailsTitle}>
                    {selectedTransaction.originalId}
                  </h2>
                  <div className={styles.detailsTabs}>
                    <button
                      className={`${styles.detailTab} ${activeTab === 'details' ? styles.activeTab : ''}`}
                      onClick={() => setActiveTab('details')}
                    >
                      Details
                    </button>
                    <button
                      className={`${styles.detailTab} ${activeTab === 'accessLog' ? styles.activeTab : ''}`}
                      onClick={() => setActiveTab('accessLog')}
                    >
                      Access Log
                    </button>
                    <button
                      className={`${styles.detailTab} ${activeTab === 'recovery' ? styles.activeTab : ''}`}
                      onClick={() => setActiveTab('recovery')}
                    >
                      Recovery
                    </button>
                  </div>
                </div>
                
                <div className={styles.detailsContent}>
                  {activeTab === 'details' && (
                    <div className={styles.transactionDetails}>
                      <div className={styles.detailSection}>
                        <h3 className={styles.detailSectionTitle}>Transaction Information</h3>
                        
                        <div className={styles.detailGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Original ID:</span>
                            <span className={styles.detailValue}>{selectedTransaction.originalId}</span>
                          </div>
                          
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Type:</span>
                            <span className={styles.detailValue}>
                              {getTypeDisplay(selectedTransaction.type)}
                            </span>
                          </div>
                          
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Amount:</span>
                            <span className={styles.detailValue}>
                              {selectedTransaction.amount.toLocaleString()} {selectedTransaction.currency}
                            </span>
                          </div>
                          
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Transaction Date:</span>
                            <span className={styles.detailValue}>
                              {formatDate(selectedTransaction.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.detailSection}>
                        <h3 className={styles.detailSectionTitle}>Redaction Information</h3>
                        
                        <div className={styles.detailGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Redaction Level:</span>
                            <span className={`${styles.detailValue} ${getRedactionLevelClass(selectedTransaction.redactionLevel)}`}>
                              Level {selectedTransaction.redactionLevel}
                            </span>
                          </div>
                          
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Redaction Date:</span>
                            <span className={styles.detailValue}>
                              {formatDate(selectedTransaction.redactionDate)}
                            </span>
                          </div>
                          
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Recoverable:</span>
                            <span className={styles.detailValue}>
                              {selectedTransaction.recoverable ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                        
                        <div className={styles.reasonBox}>
                          <div className={styles.reasonLabel}>Redaction Reason:</div>
                          <div className={styles.reasonValue}>
                            {selectedTransaction.redactionReason}
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.detailSection}>
                        <h3 className={styles.detailSectionTitle}>Involved Parties</h3>
                        
                        <div className={styles.partiesDetails}>
                          <div className={styles.partyDetail}>
                            <div className={styles.partyHeader}>
                              <span className={styles.partyRole}>Sender</span>
                              {selectedTransaction.sender.status === 'erased' && (
                                <span className={styles.erasedBadge}>ERASED</span>
                              )}
                            </div>
                            
                            <div className={styles.partyInfo}>
                              <div className={styles.partyId}>
                                ID: {selectedTransaction.sender.id}
                              </div>
                              <div className={styles.partyName}>
                                {selectedTransaction.sender.username}
                              </div>
                            </div>
                          </div>
                          
                          <div className={styles.partySeparator}>→</div>
                          
                          <div className={styles.partyDetail}>
                            <div className={styles.partyHeader}>
                              <span className={styles.partyRole}>Recipient</span>
                              {selectedTransaction.recipient.status === 'erased' && (
                                <span className={styles.erasedBadge}>ERASED</span>
                              )}
                            </div>
                            
                            <div className={styles.partyInfo}>
                              <div className={styles.partyId}>
                                ID: {selectedTransaction.recipient.id}
                              </div>
                              <div className={styles.partyName}>
                                {selectedTransaction.recipient.username}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.detailSection}>
                        <h3 className={styles.detailSectionTitle}>Security Flags</h3>
                        
                        <div className={styles.flagsList}>
                        {selectedTransaction.securityFlags.map((flag) => (
                            <div key={`detail-flag-${flag}`} className={styles.flagItem}>
                                {flag.replace('_', ' ')}
                            </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'accessLog' && (
                    <div className={styles.accessLogContent}>
                      <h3 className={styles.accessLogTitle}>Record Access History</h3>
                      
                      <div className={styles.accessLogList}>
                      {selectedTransaction.accessLog.map((log) => (
                        <div key={`${log.timestamp}-${log.username}`} className={styles.accessLogItem}>
                            <div className={styles.accessLogHeader}>
                              <span className={styles.accessAction}>{log.action}</span>
                              <span className={styles.accessTime}>{formatDate(log.timestamp)}</span>
                            </div>
                            <div className={styles.accessUser}>
                              {log.username}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className={styles.accessWarning}>
                        * All access to redacted records is permanently logged and monitored.
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'recovery' && (
                    <div className={styles.recoveryContent}>
                      {!selectedTransaction.recoverable ? (
                        <div className={styles.notRecoverable}>
                          <div className={`${styles.notRecoverableIcon} glitch`}>⚠</div>
                          <h3 className={styles.notRecoverableTitle}>Record Not Recoverable</h3>
                          <p className={styles.notRecoverableText}>
                            This record has been permanently redacted and cannot be recovered.
                            Level {selectedTransaction.redactionLevel} redactions require executive approval for data restoration.
                          </p>
                        </div>
                      ) : showUnredactWarning ? (
                        <div className={styles.unredactWarning}>
                          <h3 className={styles.warningTitle}>Confirm Unredaction</h3>
                          <p className={styles.warningText}>
                            You are about to make this redacted record visible again in the main transaction logs.
                            This action cannot be undone and will be recorded in the security audit log.
                          </p>
                          
                          <div className={styles.authSection}>
                          <label htmlFor="auth-code-input" className={styles.authLabel}>
                              Type "AUTHORIZE" to confirm:
                            </label>
                            <Input
                              value={accessCode}
                              onChange={(e) => setAccessCode(e.target.value)}
                              placeholder="AUTHORIZE"
                              fullWidth
                            />
                            
                            {accessError && (
                              <div className={styles.accessError}>
                                {accessError}
                              </div>
                            )}
                          </div>
                          
                          <div className={styles.warningActions}>
                            <Button
                              variant="ghost"
                              onClick={() => setShowUnredactWarning(false)}
                              disabled={isRestoring}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleUnredactConfirm}
                              disabled={isRestoring}
                            >
                              {isRestoring ? 'Processing...' : 'Confirm Unredaction'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.recoveryOptions}>
                          <h3 className={styles.recoveryTitle}>Recovery Options</h3>
                          <p className={styles.recoveryText}>
                            This record can be unredacted and made visible again in the main transaction logs.
                            Recovery requires admin authentication and will be logged.
                          </p>
                          
                          <div className={styles.recoveryActions}>
                            <Button
                              variant="destructive"
                              onClick={handleUnredactAttempt}
                            >
                              Unredact Record
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className={styles.noSelectionCard}>
                <div className={styles.noSelectionContent}>
                  <div className={styles.noSelectionIcon}>🔍</div>
                  <h3 className={styles.noSelectionTitle}>No Record Selected</h3>
                  <p className={styles.noSelectionText}>
                    Select a hidden transaction record from the list to view details.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HiddenTransactions;
