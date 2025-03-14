import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import styles from '../../styles/Redacted.module.css';

// Mock redacted transaction data
interface RedactedTransaction {
  id: string;
  originalId: string;
  date: string;
  parties: string[];
  amount: number;
  currency: string;
  redactionLevel: number;
  redactionReason: string;
  accessCount: number;
  lastAccessed: string | null;
  containsCriminalActivity: boolean;
  containsBlackMarketData: boolean;
  originalType: string;
  securityClearance: number;
}

// Mock user who accessed the data
interface AccessLog {
  id: string;
  accessorId: string;
  accessorName: string;
  timestamp: string;
  reason: string;
  ipAddress: string;
  securityLevel: number;
}

const Redacted: NextPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState('');
  const [accessWarningAcknowledged, setAccessWarningAcknowledged] = useState(false);
  
  const [transactions, setTransactions] = useState<RedactedTransaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<RedactedTransaction | null>(null);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptionProgress, setDecryptionProgress] = useState(0);
  const [showUnredactedContent, setShowUnredactedContent] = useState(false);
  
  // Mock data loading
  useEffect(() => {
    if (isAuthenticated && accessWarningAcknowledged) {
      // Simulate loading redacted transaction data
      const mockTransactions: RedactedTransaction[] = [
        {
          id: 'RED-78245',
          originalId: 'tx8a7fd89e',
          date: '2023-09-15T14:30:00',
          parties: ['REDACTED', 'REDACTED'],
          amount: 15000,
          currency: 'NYX',
          redactionLevel: 3,
          redactionReason: 'Violation of Protocol 7-C',
          accessCount: 4,
          lastAccessed: '2023-11-01T08:15:00',
          containsCriminalActivity: true,
          containsBlackMarketData: true,
          originalType: 'black_market',
          securityClearance: 4
        },
        {
          id: 'RED-54128',
          originalId: 'tx6c97a23b',
          date: '2023-08-22T09:45:00',
          parties: ['JohnDoe', 'REDACTED'],
          amount: 5000,
          currency: 'DRM',
          redactionLevel: 2,
          redactionReason: 'Corporate Security Directive 12',
          accessCount: 2,
          lastAccessed: '2023-10-15T16:30:00',
          containsCriminalActivity: false,
          containsBlackMarketData: true,
          originalType: 'crypto_trade',
          securityClearance: 3
        },
        {
          id: 'RED-12983',
          originalId: 'tx3d5e78f1',
          date: '2023-10-03T23:05:00',
          parties: ['REDACTED', 'GhostUser'],
          amount: 25000,
          currency: 'OBL',
          redactionLevel: 4,
          redactionReason: 'Damnatio Memoriae Enforcement',
          accessCount: 1,
          lastAccessed: '2023-10-04T01:20:00',
          containsCriminalActivity: true,
          containsBlackMarketData: false,
          originalType: 'memory_extraction',
          securityClearance: 5
        },
        {
          id: 'RED-35792',
          originalId: 'txf4e2a96c',
          date: '2023-07-12T11:15:00',
          parties: ['REDACTED', 'NyxBank'],
          amount: 7500,
          currency: 'NYX',
          redactionLevel: 1,
          redactionReason: 'Internal Audit Restriction',
          accessCount: 7,
          lastAccessed: '2023-11-10T14:05:00',
          containsCriminalActivity: false,
          containsBlackMarketData: false,
          originalType: 'loan_payment',
          securityClearance: 2
        },
        {
          id: 'RED-67234',
          originalId: 'tx2b8d15e7',
          date: '2023-11-05T03:30:00',
          parties: ['SystemAdmin', 'REDACTED'],
          amount: 50000,
          currency: 'SBL',
          redactionLevel: 5,
          redactionReason: 'Executive Order KRONOS',
          accessCount: 0,
          lastAccessed: null,
          containsCriminalActivity: true,
          containsBlackMarketData: true,
          originalType: 'organ_purchase',
          securityClearance: 5
        }
      ];
      
      setTransactions(mockTransactions);
    }
  }, [isAuthenticated, accessWarningAcknowledged]);
  
  // Filter transactions based on search and filter
  const filteredTransactions = transactions.filter(transaction => {
    // Apply search filter
    if (searchQuery && !transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !transaction.originalId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (filter === 'high_security' && transaction.securityClearance < 4) {
      return false;
    }
    if (filter === 'criminal' && !transaction.containsCriminalActivity) {
      return false;
    }
    if (filter === 'black_market' && !transaction.containsBlackMarketData) {
      return false;
    }
    
    return true;
  });
  
  const handleAuthenticate = () => {
    setIsVerifying(true);
    setAuthError('');
    
    // Simulate authentication delay
    setTimeout(() => {
      // Simple mock authentication - in a real app, this would verify against a server
      if (accessCode === 'LEVEL5-ACCESS' || accessCode === 'admin') {
        setIsAuthenticated(true);
      } else {
        setAuthError('ACCESS DENIED: Invalid security credentials');
      }
      setIsVerifying(false);
    }, 2000);
  };
  
  const handleTransactionSelect = (transaction: RedactedTransaction) => {
    setSelectedTransaction(transaction);
    setShowUnredactedContent(false);
    setDecryptionProgress(0);
    
    // Mock access logs for the selected transaction
    const mockLogs: AccessLog[] = [
      {
        id: 'log-a1b2c3',
        accessorId: 'admin-45679',
        accessorName: 'System Administrator',
        timestamp: '2023-11-01T08:15:00',
        reason: 'Security Audit',
        ipAddress: '192.168.1.45',
        securityLevel: 5
      },
      {
        id: 'log-d4e5f6',
        accessorId: 'auditor-78392',
        accessorName: 'Financial Auditor',
        timestamp: '2023-10-15T16:30:00',
        reason: 'Quarterly Review',
        ipAddress: '192.168.1.23',
        securityLevel: 4
      }
    ];
    
    if (transaction.accessCount > 0) {
      setAccessLogs(mockLogs);
    } else {
      setAccessLogs([]);
    }
  };
  
  const handleDecrypt = () => {
    setIsDecrypting(true);
    setDecryptionProgress(0);
    
    // Simulate decryption process
    const interval = setInterval(() => {
      setDecryptionProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowUnredactedContent(true);
            setIsDecrypting(false);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getRedactionLevelClass = (level: number) => {
    switch(level) {
      case 1: return styles.levelOne;
      case 2: return styles.levelTwo;
      case 3: return styles.levelThree;
      case 4: return styles.levelFour;
      case 5: return styles.levelFive;
      default: return '';
    }
  };
  
  const getSecurityClearanceText = (level: number) => {
    switch(level) {
      case 1: return 'MINIMAL';
      case 2: return 'STANDARD';
      case 3: return 'ELEVATED';
      case 4: return 'HIGH';
      case 5: return 'MAXIMUM';
      default: return 'UNKNOWN';
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className={styles.authContainer}>
          <Card variant="elevated" className={styles.authCard}>
            <div className={styles.authHeader}>
              <div className={`${styles.securityBadge} glitch`}>
                CLASSIFIED
              </div>
              <h1 className={`${styles.authTitle} neon-text`}>REDACTED RECORDS</h1>
              <div className={styles.securityWarning}>
                AUTHORIZED PERSONNEL ONLY
              </div>
            </div>
            
            <div className={styles.authForm}>
              <div className={styles.accessCodeInput}>
                <label htmlFor="accessCode" className={styles.inputLabel}>
                  ENTER SECURITY CLEARANCE CODE
                </label>
                <Input
                  id="accessCode"
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="LEVEL5-ACCESS"
                  fullWidth
                  autoComplete="off"
                />
              </div>
              
              {authError && (
                <div className={`${styles.authError} glitch`}>
                  {authError}
                </div>
              )}
              
              <Button
                onClick={handleAuthenticate}
                disabled={isVerifying}
                fullWidth
              >
                {isVerifying ? 'VERIFYING...' : 'ACCESS RESTRICTED DATA'}
              </Button>
              
              <div className={styles.accessDisclaimer}>
                <p>WARNING: Unauthorized access attempts will be logged and may result in immediate biometric enforcement.</p>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }
  
  if (!accessWarningAcknowledged) {
    return (
      <Layout>
        <div className={styles.authContainer}>
          <Card variant="elevated" className={styles.warningCard}>
            <div className={styles.warningHeader}>
              <h2 className={`${styles.warningTitle} glitch`}>SECURITY CLEARANCE NOTICE</h2>
            </div>
            
            <div className={styles.warningContent}>
              <p>You are accessing redacted transaction records that contain sensitive information.</p>
              <p className={styles.highlightWarning}>All access attempts are logged and monitored by R.E.M. security protocols.</p>
              <p>By proceeding, you acknowledge that:</p>
              
              <ul className={styles.warningList}>
                <li>Your neural signature has been recorded for this session</li>
                <li>Disclosure of any information obtained is a violation of Protocol 7-C</li>
                <li>Violations may result in memory extraction and/or damnatio memoriae</li>
                <li>Any anomalies in redacted data may cause system corruption</li>
              </ul>
              
              <div className={styles.acknowledgementCheck}>
                <Input
                  type="checkbox"
                  id="acknowledge"
                  checked={accessWarningAcknowledged}
                  onChange={() => setAccessWarningAcknowledged(prevState => !prevState)}
                />
                <label htmlFor="acknowledge">
                  I ACKNOWLEDGE THE RISKS AND ACCEPT RESPONSIBILITY FOR ANY CONSEQUENCES
                </label>
              </div>
              
              <div className={styles.warningActions}>
                <Button variant="ghost" onClick={() => setIsAuthenticated(false)}>
                  RETURN TO SECURITY CHECK
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setAccessWarningAcknowledged(true)}
                  disabled={accessWarningAcknowledged === false}
                >
                  PROCEED TO CLASSIFIED DATA
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1 className={`${styles.pageTitle} neon-text`}>Redacted Records</h1>
          <div className={styles.securityBadge}>
            SECURITY CLEARANCE: LEVEL 5
          </div>
        </div>
        
        <div className={`${styles.warningBanner} glitch`}>
        <div className={styles.warningContent}>
            NOTICE: Accessing redacted records is being tracked. Your neural signature has been captured for this session.
          </div>
        </div>
        
        <div className={styles.pageContainer}>
          <div className={styles.sidebarPanel}>
            <Card className={styles.filtersCard}>
              <div className={styles.filtersContent}>
                <div className={styles.searchContainer}>
                  <Input
                    type="text"
                    placeholder="Search by ID or reference..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                  />
                </div>
                
                <div className={styles.filtersTabs}>
                  <button 
                    className={`${styles.filterTab} ${filter === 'all' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    All Records
                  </button>
                  <button 
                    className={`${styles.filterTab} ${filter === 'high_security' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('high_security')}
                  >
                    High Security
                  </button>
                  <button 
                    className={`${styles.filterTab} ${filter === 'criminal' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('criminal')}
                  >
                    Criminal Activity
                  </button>
                  <button 
                    className={`${styles.filterTab} ${filter === 'black_market' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('black_market')}
                  >
                    Black Market
                  </button>
                </div>
              </div>
            </Card>
            
            <Card className={styles.transactionsCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Redacted Transactions</h2>
                <div className={styles.recordCount}>
                  {filteredTransactions.length} record(s) found
                </div>
              </div>
              
              <div className={styles.transactionsList}>
                {filteredTransactions.length === 0 ? (
                  <div className={styles.noRecords}>
                    No redacted records match your criteria.
                  </div>
                ) : (
                  filteredTransactions.map(transaction => (
                  <button
                    key={transaction.id}
                    className={`${styles.transactionItem} ${selectedTransaction?.id === transaction.id ? styles.selectedTransaction : ''}`}
                    onClick={() => handleTransactionSelect(transaction)}
                    aria-pressed={selectedTransaction?.id === transaction.id}
                    type="button"
                  >
                      <div className={styles.transactionHeader}>
                        <span className={styles.transactionId}>{transaction.id}</span>
                        <span className={`${styles.redactionLevel} ${getRedactionLevelClass(transaction.redactionLevel)}`}>
                          LEVEL {transaction.redactionLevel}
                        </span>
                      </div>
                      
                      <div className={styles.transactionDate}>
                        {formatDate(transaction.date)}
                      </div>
                      
                      <div className={styles.transactionParties}>
                        <div className={styles.partyNames}>
                        {transaction.parties.map((party, index) => (
                          <span 
                            key={`${transaction.id}-party-${party}-${index}`} 
                            className={party === 'REDACTED' ? styles.redactedText : ''}
                          >
                            {party}
                            {index < transaction.parties.length - 1 && ' → '}
                          </span>
                        ))}
                        </div>
                      </div>
                      
                      <div className={styles.transactionAmount}>
                        <span className={styles.amountValue}>{transaction.amount.toLocaleString()}</span>
                        <span className={styles.amountCurrency}>{transaction.currency}</span>
                      </div>
                      
                      <div className={styles.transactionFlags}>
                        {transaction.containsCriminalActivity && (
                          <span className={styles.flagCriminal}>CRIMINAL</span>
                        )}
                        {transaction.containsBlackMarketData && (
                          <span className={styles.flagBlackMarket}>BLACK MARKET</span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>
          
          <div className={styles.detailsPanel}>
            {selectedTransaction ? (
              <Card className={styles.detailsCard}>
                <div className={styles.detailsHeader}>
                  <div className={styles.headerTop}>
                    <h2 className={styles.detailsTitle}>
                      <span className={styles.idBadge}>{selectedTransaction.id}</span>
                      <span>Redacted Transaction</span>
                    </h2>
                    <div className={`${styles.securityLevel} ${getRedactionLevelClass(selectedTransaction.redactionLevel)}`}>
                      {getSecurityClearanceText(selectedTransaction.securityClearance)} CLEARANCE
                    </div>
                  </div>
                  
                  <div className={styles.headerTags}>
                    <div className={styles.redactionReasonTag}>
                      REDACTION: {selectedTransaction.redactionReason}
                    </div>
                    {selectedTransaction.containsCriminalActivity && (
                      <div className={`${styles.warningTag}`}>
                        CRIMINAL ACTIVITY DETECTED
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.detailsContent}>
                  <div className={styles.redactedDataSection}>
                    <h3 className={styles.sectionTitle}>Transaction Information</h3>
                    
                    <div className={styles.dataGrid}>
                      <div className={styles.dataItem}>
                        <span className={styles.dataLabel}>Original ID:</span>
                        <span className={styles.dataValue}>{selectedTransaction.originalId}</span>
                      </div>
                      
                      <div className={styles.dataItem}>
                        <span className={styles.dataLabel}>Date & Time:</span>
                        <span className={styles.dataValue}>{formatDate(selectedTransaction.date)}</span>
                      </div>
                      
                      <div className={styles.dataItem}>
                        <span className={styles.dataLabel}>Type:</span>
                        <span className={styles.dataValue}>{selectedTransaction.originalType.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      
                      <div className={styles.dataItem}>
                        <span className={styles.dataLabel}>Amount:</span>
                        <span className={styles.dataValue}>
                          <span className={styles.amountValue}>{selectedTransaction.amount.toLocaleString()}</span>
                          <span className={styles.amountCurrency}>{selectedTransaction.currency}</span>
                        </span>
                      </div>
                      
                      <div className={styles.dataItem}>
                        <span className={styles.dataLabel}>Sender:</span>
                        <span className={`${styles.dataValue} ${selectedTransaction.parties[0] === 'REDACTED' ? styles.redactedText : ''}`}>
                          {selectedTransaction.parties[0]}
                        </span>
                      </div>
                      
                      <div className={styles.dataItem}>
                        <span className={styles.dataLabel}>Recipient:</span>
                        <span className={`${styles.dataValue} ${selectedTransaction.parties[1] === 'REDACTED' ? styles.redactedText : ''}`}>
                          {selectedTransaction.parties[1]}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!isDecrypting && !showUnredactedContent && (
                    <div className={styles.accessSection}>
                      <h3 className={styles.sectionTitle}>Classified Content</h3>
                      
                      <div className={styles.redactedContent}>
                        <div className={styles.redactedPreview}>
                          <div className={styles.redactedLine}></div>
                          <div className={styles.redactedLine}></div>
                          <div className={styles.redactedLine}></div>
                          <div className={styles.redactedLine}></div>
                          <div className={styles.redactedLine}></div>
                        </div>
                        
                        <div className={styles.redactedOverlay}>
                          <div className={styles.lockIcon}>🔒</div>
                          <p className={styles.lockText}>CONTENT REDACTED</p>
                          <p className={styles.lockSubtext}>Level {selectedTransaction.redactionLevel} security clearance required</p>
                          
                          <Button
                            onClick={handleDecrypt}
                            variant="destructive"
                          >
                            Decrypt Classified Content
                          </Button>
                          
                          <p className={styles.decryptWarning}>
                            WARNING: Neural signature will be logged for this operation
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {isDecrypting && (
                    <div className={styles.decryptionSection}>
                      <h3 className={styles.sectionTitle}>Decryption In Progress</h3>
                      
                      <div className={styles.decryptionProcess}>
                        <div className={styles.progressBarContainer}>
                          <div 
                            className={styles.progressBar}
                            style={{ width: `${decryptionProgress}%` }}
                          ></div>
                        </div>
                        <div className={styles.progressText}>
                          {Math.round(decryptionProgress)}% Complete
                        </div>
                        
                        <div className={styles.decryptionMessages}>
                          <div className={styles.decryptMessage}>Bypassing security protocols...</div>
                          <div className={styles.decryptMessage}>Decrypting neural signatures...</div>
                          <div className={styles.decryptMessage}>Reconstructing redacted data...</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {showUnredactedContent && (
                    <div className={styles.unredactedSection}>
                      <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Unredacted Content</h3>
                        <div className={styles.accessCounter}>
                          Access Count: {selectedTransaction.accessCount + 1}
                        </div>
                      </div>
                      
                      <div className={`${styles.classifiedContent} glass`}>
                        {selectedTransaction.originalType === 'black_market' && (
                          <>
                            <div className={styles.classifiedHeader}>
                              BLACK MARKET TRANSACTION DETAILS
                            </div>
                            <div className={styles.classifiedBody}>
                              <p>Transaction facilitated illegal exchange of goods through NyxBank secure channels.</p>
                              <p>Buyer: {selectedTransaction.parties[0].includes('REDACTED') ? 'Marcus Chen (DECEASED)' : selectedTransaction.parties[0]}</p>
                              <p>Seller: {selectedTransaction.parties[1] === 'REDACTED' ? 'BlackHarbor Collective' : selectedTransaction.parties[1]}</p>
                              <p>Items: Synthetic neural implants (military grade, banned under Regulation 37-B)</p>
                              <p>Location: Sector 7 Underground, New Shanghai</p>
                              <p className={styles.redFlag}>
                                USER TERMINATION STATUS: Subject terminated through Protocol KRONOS (Neural signature erased)
                              </p>
                            </div>
                          </>
                        )}
                        
                        {selectedTransaction.originalType === 'memory_extraction' && (
                          <>
                            <div className={styles.classifiedHeader}>
                              MEMORY EXTRACTION PROCEDURE LOG
                            </div>
                            <div className={styles.classifiedBody}>
                              <p>Subject underwent mandatory memory extraction as collateral forfeiture.</p>
                              <p>Subject: {selectedTransaction.parties[0] === 'REDACTED' ? 'Elena Nakamura' : selectedTransaction.parties[0]}</p>
                              <p>Debt: {selectedTransaction.amount.toLocaleString()} {selectedTransaction.currency} (Default on NyxBank corporate loan)</p>
                              <p>Memories Targeted: Period covering 2022-2023 (Childhood memories, 2 years)</p>
                              <p>Extraction Outcome: Successful (full removal of targeted memory segments)</p>
                              <p className={styles.redFlag}>
                                AFTERMATH: Subject attempted suicide following procedure. Neural remnants still detected in system.
                              </p>
                            </div>
                          </>
                        )}
                        
                        {selectedTransaction.originalType === 'organ_purchase' && (
                          <>
                            <div className={styles.classifiedHeader}>
                              BIOMETRIC COLLATERAL ACQUISITION
                            </div>
                            <div className={styles.classifiedBody}>
                              <p>Transaction represents enforced biometric collateral collection.</p>
                              <p>Debtor: {selectedTransaction.parties[1] === 'REDACTED' ? 'David Liang (CREDIT ID: NYX-7834-290)' : selectedTransaction.parties[1]}</p>
                              <p>Collateral Collected: Synthetic liver (80% functionality)</p>
                              <p>Outstanding Debt: {(selectedTransaction.amount * 2).toLocaleString()} {selectedTransaction.currency}</p>
                              <p>Resale Value of Asset: {selectedTransaction.amount.toLocaleString()} {selectedTransaction.currency}</p>
                              <p className={styles.redFlag}>
                                NOTE: Subject still indebted to NyxBank for {selectedTransaction.amount.toLocaleString()} {selectedTransaction.currency}. Additional collateral pending.
                              </p>
                            </div>
                          </>
                        )}
                        
                        {selectedTransaction.originalType === 'loan_payment' && (
                          <>
                            <div className={styles.classifiedHeader}>
                              INTERNAL TRANSFER NOTE
                            </div>
                            <div className={styles.classifiedBody}>
                              <p>Transaction redirected to executive compensation account.</p>
                              <p>Original Payment Purpose: Loan payment from {selectedTransaction.parties[0]}</p>
                              <p>Redirected To: Executive Pool Account (#EXEC-7890-23)</p>
                              <p>Authorization: Directive 45-G</p>
                              <p>Customer Notification: NONE</p>
                              <p className={styles.redFlag}>
                                NOTE: Customer account still marked as delinquent despite payment. Enforcement scheduled.
                              </p>
                            </div>
                          </>
                        )}
                        
                        {selectedTransaction.originalType === 'crypto_trade' && (
                          <>
                            <div className={styles.classifiedHeader}>
                              LAUNDERED CRYPTOCURRENCY EXCHANGE
                            </div>
                            <div className={styles.classifiedBody}>
                              <p>Transaction represents laundering operation through crypto exchange.</p>
                              <p>Source: {selectedTransaction.parties[0]}</p>
                              <p>Destination: {selectedTransaction.parties[1] === 'REDACTED' ? 'Anonymous Wallet (SHADOW-NET)' : selectedTransaction.parties[1]}</p>
                              <p>Original Source: Ransomware payment from Medical Database Hack</p>
                              <p>Route: NyxCoin → Obol → NeuralToken → Untraceable</p>
                              <p className={styles.redFlag}>
                                NOTE: AI detected pattern but flagged as false positive by System Admin (suspicious override)
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.accessLogsSection}>
                    <h3 className={styles.sectionTitle}>Access History</h3>
                    
                    {accessLogs.length === 0 ? (
                      <div className={styles.noAccessLogs}>
                        No previous access detected. You are the first to view this record.
                      </div>
                    ) : (
                      <div className={styles.accessLogsList}>
                        {accessLogs.map(log => (
                          <div key={log.id} className={styles.accessLogItem}>
                            <div className={styles.logHeader}>
                              <span className={styles.logUser}>{log.accessorName}</span>
                              <span className={styles.logTime}>{formatDate(log.timestamp)}</span>
                            </div>
                            <div className={styles.logDetails}>
                              <span className={styles.logReason}>Reason: {log.reason}</span>
                              <span className={styles.logIP}>IP: {log.ipAddress}</span>
                              <span className={styles.logSecurityLevel}>
                                Level {log.securityLevel} Clearance
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.detailsFooter}>
                  <div className={styles.footerWarning}>
                    REMINDER: All access is logged and monitored. Your neural signature has been recorded.
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTransaction(null)}
                  >
                    Close Record
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className={styles.noSelectionCard}>
                <div className={styles.noSelectionContent}>
                  <div className={styles.noSelectionIcon}>🔍</div>
                  <h2 className={styles.noSelectionTitle}>Select a Redacted Record</h2>
                  <p className={styles.noSelectionText}>
                    Choose a record from the list to view its details and classified information.
                  </p>
                  <p className={styles.noSelectionWarning}>
                    All access attempts are logged and tied to your neural signature.
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

export default Redacted;


