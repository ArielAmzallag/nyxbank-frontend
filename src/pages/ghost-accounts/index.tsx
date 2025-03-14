import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import styles from '../../styles/GhostAccounts.module.css';

interface GhostAccount {
  id: string;
  formerUsername: string;
  erasureDate: string;
  erasureReason: string;
  erasureLevel: 1 | 2 | 3 | 4; // Levels of erasure (4 being complete damnatio memoriae)
  lastTransaction: string;
  lastActivity: string;
  detectionCount: number;
  anomalyTypes: string[];
  linkedAccounts: {
    id: string;
    username: string;
    connectionType: string;
    lastInteraction: string;
  }[];
  biometricStatus: string;
  neuralStatus: string;
  memoryFragments: string[];
  riskLevel: string;
}

const GhostAccounts: NextPage = () => {
  // Mock data for ghost accounts
  const [ghostAccounts, setGhostAccounts] = useState<GhostAccount[]>([
    {
      id: 'ghost-001',
      formerUsername: 'AlexMercer',
      erasureDate: '2023-09-15T10:25:00',
      erasureReason: 'User-requested erasure (Debt evasion suspected)',
      erasureLevel: 3,
      lastTransaction: '2023-09-14T23:59:12',
      lastActivity: '2023-11-21T03:17:45',
      detectionCount: 16,
      anomalyTypes: ['phantom_transaction', 'neural_signature', 'identification_attempt'],
      linkedAccounts: [
        {
          id: 'u2042',
          username: 'SarahJohnson',
          connectionType: 'frequent_transfers',
          lastInteraction: '2023-09-14T20:33:17'
        },
        {
          id: 'u4019',
          username: 'ThomasWright',
          connectionType: 'biometric_similarity',
          lastInteraction: '2023-08-30T15:22:45'
        }
      ],
      biometricStatus: 'fragments_detected',
      neuralStatus: 'degraded_signature',
      memoryFragments: [
        'Account creation details',
        'Initial deposit source',
        'Loan application patterns'
      ],
      riskLevel: 'moderate'
    },
    {
      id: 'ghost-002',
      formerUsername: 'EvelinaChen',
      erasureDate: '2023-10-22T14:30:00',
      erasureReason: 'System-enforced erasure (Debt collection failure)',
      erasureLevel: 4,
      lastTransaction: '2023-10-22T14:28:35',
      lastActivity: '2023-11-22T01:05:22',
      detectionCount: 31,
      anomalyTypes: ['rem_interaction', 'ghost_login', 'phantom_transaction', 'neural_echo'],
      linkedAccounts: [
        {
          id: 'u7823',
          username: 'VictoriaLiu',
          connectionType: 'identical_access_patterns',
          lastInteraction: '2023-10-20T16:45:30'
        }
      ],
      biometricStatus: 'seized',
      neuralStatus: 'fractured',
      memoryFragments: [
        'Debt collection attempts',
        'Biometric verification history',
        'Black market transactions',
        'Account security settings'
      ],
      riskLevel: 'high'
    },
    {
      id: 'ghost-003',
      formerUsername: 'MarcusBlack',
      erasureDate: '2023-06-05T09:15:00',
      erasureReason: 'Legal compliance (Court-ordered removal)',
      erasureLevel: 2,
      lastTransaction: '2023-06-04T23:45:29',
      lastActivity: '2023-11-15T21:33:10',
      detectionCount: 7,
      anomalyTypes: ['phantom_transaction', 'neural_signature'],
      linkedAccounts: [
        {
          id: 'u3320',
          username: 'ElizabethCohen',
          connectionType: 'financial_dependency',
          lastInteraction: '2023-06-04T22:15:08'
        },
        {
          id: 'u8806',
          username: 'TristanPayne',
          connectionType: 'asset_transfer',
          lastInteraction: '2023-06-04T23:45:29'
        }
      ],
      biometricStatus: 'partial_record',
      neuralStatus: 'echo_detected',
      memoryFragments: [
        'Transaction history',
        'Account creation verification'
      ],
      riskLevel: 'low'
    },
    {
      id: 'ghost-004',
      formerUsername: 'JuliaKim',
      erasureDate: '2023-11-01T00:00:00',
      erasureReason: 'Complete damnatio memoriae (Protocol violation)',
      erasureLevel: 4,
      lastTransaction: '2023-10-31T23:58:59',
      lastActivity: '2023-11-20T04:12:07',
      detectionCount: 42,
      anomalyTypes: ['ghost_login', 'phantom_transaction', 'neural_echo', 'rem_interaction', 'biometric_anomaly'],
      linkedAccounts: [
        {
          id: 'u2910',
          username: 'RobertJackson',
          connectionType: 'suspicious_correlation',
          lastInteraction: '2023-10-31T23:58:59'
        },
        {
          id: 'u7703',
          username: 'MichelleZhang',
          connectionType: 'identical_login_locations',
          lastInteraction: '2023-10-30T17:22:15'
        },
        {
          id: 'u4523',
          username: 'RobertChen',
          connectionType: 'neural_similarity',
          lastInteraction: '2023-10-25T09:34:47'
        }
      ],
      biometricStatus: 'active_fragments',
      neuralStatus: 'resonating',
      memoryFragments: [
        'Black market transaction records',
        'Biometric authentication data',
        'Neural response patterns',
        'Financial algorithm access',
        'System security breach attempts'
      ],
      riskLevel: 'critical'
    },
    {
      id: 'ghost-005',
      formerUsername: 'DavidMiller',
      erasureDate: '2023-08-17T11:10:00',
      erasureReason: 'User-requested erasure (Standard protocol)',
      erasureLevel: 1,
      lastTransaction: '2023-08-16T19:22:05',
      lastActivity: '2023-11-10T10:05:33',
      detectionCount: 3,
      anomalyTypes: ['phantom_transaction'],
      linkedAccounts: [
        {
          id: 'u1075',
          username: 'JenniferMiller',
          connectionType: 'family_link',
          lastInteraction: '2023-08-16T19:22:05'
        }
      ],
      biometricStatus: 'archived',
      neuralStatus: 'dormant',
      memoryFragments: [
        'Account preferences'
      ],
      riskLevel: 'minimal'
    }
  ]);

  // Filter and search states
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGhost, setSelectedGhost] = useState<GhostAccount | null>(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'activity', 'connections', 'containment'
  const [showErasureModal, setShowErasureModal] = useState(false);
  const [erasureComplete, setErasureComplete] = useState(false);
  const [erasureConfirm, setErasureConfirm] = useState('');
  const [erasureError, setErasureError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Apply filters
  const filteredGhosts = ghostAccounts.filter(ghost => {
    // Filter by erasure level or risk
    const filterMatch = filter === 'all' || 
                     (filter === 'high_risk' && ghost.riskLevel === 'high' || ghost.riskLevel === 'critical') ||
                     (filter === 'recent' && new Date(ghost.erasureDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                     (filter === 'active' && ghost.detectionCount > 10);
    
    // Filter by search query
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = searchQuery === '' ||
                      ghost.formerUsername.toLowerCase().includes(searchLower) ||
                      ghost.id.toLowerCase().includes(searchLower);
    
    return filterMatch && searchMatch;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get erasure level class
  const getErasureLevelClass = (level: number) => {
    switch(level) {
      case 1: return styles.levelOne;
      case 2: return styles.levelTwo;
      case 3: return styles.levelThree;
      case 4: return styles.levelFour;
      default: return '';
    }
  };

  // Get risk level class
  const getRiskLevelClass = (risk: string) => {
    switch(risk) {
      case 'minimal': return styles.riskMinimal;
      case 'low': return styles.riskLow;
      case 'moderate': return styles.riskModerate;
      case 'high': return styles.riskHigh;
      case 'critical': return styles.riskCritical;
      default: return '';
    }
  };

  // Handle ghost selection
  const handleSelectGhost = (ghost: GhostAccount) => {
    setSelectedGhost(ghost);
    setActiveTab('overview');
    setShowErasureModal(false);
    setErasureComplete(false);
    setErasureConfirm('');
    setErasureError('');
  };

  // Handle complete erasure
  const handleCompleteErasure = () => {
    setShowErasureModal(true);
  };

  // Handle erasure confirmation
  const handleErasureConfirm = () => {
    if (erasureConfirm !== 'DAMNATIO MEMORIAE') {
      setErasureError('Invalid confirmation code');
      return;
    }
    
    if (!selectedGhost) return;
    
    setIsProcessing(true);
    setErasureError('');
    
    // Simulate API call
    setTimeout(() => {
      // Remove the ghost account
      const updatedGhosts = ghostAccounts.filter(g => g.id !== selectedGhost.id);
      setGhostAccounts(updatedGhosts);
      
      // Show success state
      setErasureComplete(true);
      setIsProcessing(false);
    }, 3000);
  };

  // Close modal and reset
  const closeModal = () => {
    setShowErasureModal(false);
    setErasureComplete(false);
    setErasureConfirm('');
    setErasureError('');
  };

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) { // Occasionally trigger glitch
        const elements = document.querySelectorAll(`.${styles.glitchTarget}`);
        if (elements.length > 0) {
          const randomElement = elements[Math.floor(Math.random() * elements.length)];
          randomElement.classList.add(styles.activeGlitch);
          setTimeout(() => {
            randomElement.classList.remove(styles.activeGlitch);
          }, 300);
        }
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <Layout>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1 className={`${styles.pageTitle} neon-text glitchTarget`}>
            Ghost Account Monitoring
          </h1>
          <div className={styles.securityBadge}>
            Clearance: Maximum
          </div>
        </div>
        
        <div className={styles.warningBanner}>
          <div className={`${styles.warningContent} glitch`}>
            WARNING: Accessing these records compromises the integrity of erasure protocols.
          </div>
        </div>
        
        <div className={styles.pageContainer}>
          <div className={styles.ghostsPanel}>
            <Card className={styles.filtersCard}>
              <div className={styles.filtersContent}>
                <div className={styles.filtersTabs}>
                  <button 
                    className={`${styles.filterTab} ${filter === 'all' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    All Ghosts
                  </button>
                  <button 
                    className={`${styles.filterTab} ${filter === 'high_risk' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('high_risk')}
                  >
                    High Risk
                  </button>
                  <button 
                    className={`${styles.filterTab} ${filter === 'recent' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('recent')}
                  >
                    Recently Erased
                  </button>
                  <button 
                    className={`${styles.filterTab} ${filter === 'active' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('active')}
                  >
                    Active Ghosts
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
            
            <Card className={styles.ghostsCard}>
              <div className={styles.ghostsHeader}>
                <h2 className={styles.sectionTitle}>Detected Remnants</h2>
                <div className={styles.recordCount}>
                  {filteredGhosts.length} ghost record{filteredGhosts.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className={styles.ghostsList}>
                {filteredGhosts.length === 0 ? (
                  <div className={styles.noRecords}>
                    <p>No ghost accounts found matching your criteria.</p>
                  </div>
                ) : (
                  filteredGhosts.map(ghost => (
                    <button
                    key={ghost.id}
                    className={`${styles.ghostItem} ${selectedGhost?.id === ghost.id ? styles.selectedGhost : ''}`}
                    onClick={() => handleSelectGhost(ghost)}
                    type="button"
                    aria-pressed={selectedGhost?.id === ghost.id}
                    >
                      <div className={styles.ghostHeader}>
                        <span className={styles.ghostId}>{ghost.id}</span>
                        <span className={`${styles.riskLevel} ${getRiskLevelClass(ghost.riskLevel)}`}>
                          {ghost.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className={styles.ghostName} aria-label="Former username">
                        <span className={`${styles.erasedUsername} glitchTarget`}>{ghost.formerUsername}</span>
                      </div>
                      
                      <div className={styles.ghostDetails}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Erasure:</span>
                          <span className={`${styles.erasureLevel} ${getErasureLevelClass(ghost.erasureLevel)}`}>
                            Level {ghost.erasureLevel}
                          </span>
                        </div>
                        
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Detected:</span>
                          <span className={styles.detailValue}>{ghost.detectionCount} times</span>
                        </div>
                      </div>
                      
                      <div className={styles.ghostFooter}>
                        <div className={styles.lastActivity}>
                          Last activity: {formatDate(ghost.lastActivity)}
                        </div>
                        
                        <div className={styles.anomalyTypes}>
                          {ghost.anomalyTypes.slice(0, 2).map((type) => (
                            <span key={`anomaly-${ghost.id}-${type}`} className={styles.anomalyType}>
                              {type.replace('_', ' ')}
                            </span>
                          ))}
                          {ghost.anomalyTypes.length > 2 && (
                            <span className={styles.moreAnomalies}>
                              +{ghost.anomalyTypes.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>
          
          <div className={styles.detailsPanel}>
            {selectedGhost ? (
              <Card className={styles.detailsCard}>
                {showErasureModal ? (
                  <div className={styles.erasureModal}>
                    {erasureComplete ? (
                      <div className={styles.erasureComplete}>
                        <div className={`${styles.erasureIcon} glitch`}>✓</div>
                        <h3 className={styles.erasureCompleteTitle}>Complete Erasure Successful</h3>
                        <p className={styles.erasureCompleteText}>
                          All traces of ghost account {selectedGhost.formerUsername} have been permanently removed.
                          No neural signature or financial records remain.
                        </p>
                        <Button onClick={closeModal}>
                          Return to Monitoring
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className={`${styles.erasureTitle} glitch`}>Complete Memory Erasure</h3>
                        <div className={styles.erasureWarning}>
                          <p>
                            You are about to execute a complete <span className={styles.highlight}>damnatio memoriae</span> on 
                            ghost record <span className={styles.highlight}>{selectedGhost.id}</span>.
                          </p>
                          <p>
                            This will permanently expunge all remaining traces of{" "}
                            <span className={styles.highlight}>{selectedGhost.formerUsername}</span> from the system.
                            </p>
                          <p className={styles.dangerText}>
                            WARNING: This action cannot be undone and violates records retention protocols.
                          </p>
                        </div>
                        
                        <div className={styles.confirmationBox}>
                          <label htmlFor="erasure-confirm" className={styles.confirmLabel}>
                            Type <span className={styles.confirmCode}>DAMNATIO MEMORIAE</span> to confirm:
                          </label>
                          <Input
                            id="erasure-confirm"
                            value={erasureConfirm}
                            onChange={(e) => setErasureConfirm(e.target.value)}
                            placeholder="DAMNATIO MEMORIAE"
                            fullWidth
                          />
                          
                          {erasureError && (
                            <div className={styles.confirmError}>
                              {erasureError}
                            </div>
                          )}
                        </div>
                        
                        <div className={styles.modalActions}>
                          <Button 
                            variant="ghost" 
                            onClick={closeModal}
                            disabled={isProcessing}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={handleErasureConfirm}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <span className={styles.processing}>
                                <span className={styles.processingDot}></span>
                                <span className={styles.processingDot}></span>
                                <span className={styles.processingDot}></span>
                              </span>
                            ) : (
                              'Execute Damnatio Memoriae'
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className={styles.detailsHeader}>
                      <h2 className={styles.detailsTitle}>
                        <span className={styles.ghostIdBadge}>{selectedGhost.id}</span>
                        <span className={`${styles.formerUsername} glitchTarget`}>{selectedGhost.formerUsername}</span>
                      </h2>
                      
                      <div className={styles.detailBadges}>
                        <span className={`${styles.erasureBadge} ${getErasureLevelClass(selectedGhost.erasureLevel)}`}>
                          Level {selectedGhost.erasureLevel} Erasure
                        </span>
                        <span className={`${styles.riskBadge} ${getRiskLevelClass(selectedGhost.riskLevel)}`}>
                          {selectedGhost.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      
                      <div className={styles.detailsTabs}>
                        <button
                          className={`${styles.detailTab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
                          onClick={() => setActiveTab('overview')}
                        >
                          Overview
                        </button>
                        <button
                          className={`${styles.detailTab} ${activeTab === 'activity' ? styles.activeTab : ''}`}
                          onClick={() => setActiveTab('activity')}
                        >
                          Activity
                        </button>
                        <button
                          className={`${styles.detailTab} ${activeTab === 'connections' ? styles.activeTab : ''}`}
                          onClick={() => setActiveTab('connections')}
                        >
                          Connections
                        </button>
                        <button
                          className={`${styles.detailTab} ${activeTab === 'containment' ? styles.activeTab : ''}`}
                          onClick={() => setActiveTab('containment')}
                        >
                          Containment
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.detailsContent}>
                      {activeTab === 'overview' && (
                        <div className={styles.overviewContent}>
                          <div className={styles.detailSection}>
                            <h3 className={styles.sectionTitle}>Erasure Information</h3>
                            
                            <div className={styles.detailGrid}>
                              <div className={styles.detailItem}>
                                <span className={styles.itemLabel}>Erasure Date:</span>
                                <span className={styles.itemValue}>{formatDate(selectedGhost.erasureDate)}</span>
                              </div>
                              
                              <div className={styles.detailItem}>
                                <span className={styles.itemLabel}>Last Transaction:</span>
                                <span className={styles.itemValue}>{formatDate(selectedGhost.lastTransaction)}</span>
                              </div>
                              
                              <div className={styles.detailItem}>
                                <span className={styles.itemLabel}>Last Detected:</span>
                                <span className={styles.itemValue}>{formatDate(selectedGhost.lastActivity)}</span>
                              </div>
                              
                              <div className={styles.detailItem}>
                                <span className={styles.itemLabel}>Total Detections:</span>
                                <span className={styles.itemValue}>{selectedGhost.detectionCount}</span>
                              </div>
                            </div>
                            
                            <div className={styles.reasonBox}>
                              <span className={styles.reasonLabel}>Erasure Reason:</span>
                              <span className={styles.reasonValue}>{selectedGhost.erasureReason}</span>
                            </div>
                          </div>
                          
                          <div className={styles.detailSection}>
                            <h3 className={styles.sectionTitle}>Biometric Status</h3>
                            
                            <div className={styles.bioStatus}>
                              <div className={styles.bioItem}>
                                <span className={styles.bioLabel}>Biometric Data Status:</span>
                                <span className={styles.bioValue}>{selectedGhost.biometricStatus.replace('_', ' ')}</span>
                              </div>
                              
                              <div className={styles.bioItem}>
                                <span className={styles.bioLabel}>Neural Signature Status:</span>
                                <span className={styles.bioValue}>{selectedGhost.neuralStatus.replace('_', ' ')}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className={styles.detailSection}>
                            <h3 className={styles.sectionTitle}>Memory Fragments</h3>
                            
                            <div className={styles.fragmentsContainer}>
                              {selectedGhost.memoryFragments.map((fragment, index) => (
                                <div key={`memory-${selectedGhost.id}-${index}`} className={styles.memoryFragment}>
                                  <div className={styles.fragmentHeader}>
                                    <span className={styles.fragmentId}>
                                      MEM-{index.toString().padStart(3, '0')}
                                    </span>
                                    <span className={styles.fragmentStatus}>
                                      RECOVERABLE
                                    </span>
                                  </div>
                                  <div className={styles.fragmentContent}>
                                    {fragment}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'activity' && (
                        <div className={styles.activityContent}>
                          <div className={styles.detailSection}>
                            <h3 className={styles.sectionTitle}>Anomaly Types</h3>
                            
                            <div className={styles.anomalyList}>
                              {selectedGhost.anomalyTypes.map((anomaly) => (
                                <div key={`anomaly-detail-${selectedGhost.id}-${anomaly}`} className={styles.anomalyItem}>
                                  <div className={styles.anomalyIcon}>⚠</div>
                                  <div className={styles.anomalyInfo}>
                                    <div className={styles.anomalyName}>
                                      {anomaly.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </div>
                                    <div className={styles.anomalyDescription}>
                                      {getAnomalyDescription(anomaly)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className={styles.detailSection}>
                            <h3 className={styles.sectionTitle}>Detection Timeline</h3>
                            
                            <div className={styles.timelineContainer}>
                              <div className={styles.timelineHeader}>
                                <span className={styles.timelineDate}>Date</span>
                                <span className={styles.timelineType}>Anomaly Type</span>
                                <span className={styles.timelineSystem}>Detecting System</span>
                              </div>
                              
                              {/* Mock timeline data */}
                              <div className={styles.timelineItem}>
                                <span className={styles.timelineDate}>{formatDate(selectedGhost.lastActivity)}</span>
                                <span className={styles.timelineType}>{selectedGhost.anomalyTypes[0].replace('_', ' ')}</span>
                                <span className={styles.timelineSystem}>R.E.M. Neural Interface</span>
                              </div>
                              
                              <div className={styles.timelineItem}>
                                <span className={styles.timelineDate}>
                                  {formatDate(new Date(new Date(selectedGhost.lastActivity).getTime() - 48 * 60 * 60 * 1000).toISOString())}
                                </span>
                                <span className={styles.timelineType}>
                                  {selectedGhost.anomalyTypes.length > 1 ? selectedGhost.anomalyTypes[1].replace('_', ' ') : selectedGhost.anomalyTypes[0].replace('_', ' ')}
                                </span>
                                <span className={styles.timelineSystem}>Transaction Monitoring</span>
                              </div>
                              
                              <div className={styles.timelineItem}>
                                <span className={styles.timelineDate}>
                                  {formatDate(new Date(new Date(selectedGhost.lastActivity).getTime() - 96 * 60 * 60 * 1000).toISOString())}
                                </span>
                                <span className={styles.timelineType}>biometric_echo</span>
                                <span className={styles.timelineSystem}>Security Scanner</span>
                              </div>
                              
                              <div className={styles.timelineItem}>
                                <span className={styles.timelineDate}>
                                  {formatDate(new Date(new Date(selectedGhost.lastActivity).getTime() - 168 * 60 * 60 * 1000).toISOString())}
                                </span>
                                <span className={styles.timelineType}>
                                  {selectedGhost.anomalyTypes[0].replace('_', ' ')}
                                </span>
                                <span className={styles.timelineSystem}>Transaction Monitoring</span>
                              </div>
                              
                              <div className={styles.viewAllTimeline}>
                                <Button variant="ghost" size="small">
                                  View Full Timeline
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'connections' && (
                        <div className={styles.connectionsContent}>
                          <div className={styles.detailSection}>
                            <h3 className={styles.sectionTitle}>Linked Accounts</h3>
                            
                            <div className={styles.linkedAccountsList}>
                              {selectedGhost.linkedAccounts.length === 0 ? (
                                <div className={styles.noLinkedAccounts}>
                                  <p>No linked accounts detected for this ghost.</p>
                                </div>
                              ) : (
                                selectedGhost.linkedAccounts.map((account) => (
                                  <div key={`linked-${account.id}`} className={styles.linkedAccount}>
                                    <div className={styles.accountHeader}>
                                      <span className={styles.accountUsername}>{account.username}</span>
                                      <span className={styles.accountId}>{account.id}</span>
                                    </div>
                                    
                                    <div className={styles.accountDetails}>
                                      <div className={styles.accountDetail}>
                                        <span className={styles.detailLabel}>Connection Type:</span>
                                        <span className={styles.detailValue}>
                                          {account.connectionType.replace('_', ' ')}
                                        </span>
                                      </div>
                                      
                                      <div className={styles.accountDetail}>
                                        <span className={styles.detailLabel}>Last Interaction:</span>
                                        <span className={styles.detailValue}>
                                          {formatDate(account.lastInteraction)}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className={styles.accountActions}>
                                      <Button variant="outline" size="small">
                                        View Account
                                      </Button>
                                      <Button variant="outline" size="small">
                                        Monitor Connection
                                      </Button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                          
                          <div className={styles.detailSection}>
                            <h3 className={styles.sectionTitle}>Connection Map</h3>
                            
                            <div className={styles.connectionMap}>
                              <div className={styles.mapPlaceholder}>
                                Connection graph visualization would be displayed here.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'containment' && (
                        <div className={styles.containmentContent}>
                          <div className={styles.detailSection}>
                            <h3 className={styles.sectionTitle}>Current Containment Status</h3>
                            
                            <div className={styles.containmentStatus}>
                              <div className={styles.statusItem}>
                                <span className={styles.statusLabel}>Transaction Blocking:</span>
                                <span className={`${styles.statusValue} ${styles.statusActive}`}>ACTIVE</span>
                              </div>
                              
                              <div className={styles.statusItem}>
                                <span className={styles.statusLabel}>Neural Firewall:</span>
                                <span className={`${styles.statusValue} ${styles.statusActive}`}>ACTIVE</span>
                              </div>
                              
                              <div className={styles.statusItem}>
                                <span className={styles.statusLabel}>Biometric Blacklist:</span>
                                <span className={`${styles.statusValue} ${styles.statusActive}`}>ACTIVE</span>
                              </div>
                              
                              <div className={styles.statusItem}>
                                <span className={styles.statusLabel}>Memory Suppression:</span>
                                <span className={`${styles.statusValue} ${selectedGhost.erasureLevel >= 3 ? styles.statusActive : styles.statusInactive}`}>
                                  {selectedGhost.erasureLevel >= 3 ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                              </div>
                              
                              <div className={styles.statusItem}>
                                <span className={styles.statusLabel}>REM Integration Block:</span>
                                <span className={`${styles.statusValue} ${selectedGhost.erasureLevel >= 2 ? styles.statusActive : styles.statusInactive}`}>
                                  {selectedGhost.erasureLevel >= 2 ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`${styles.detailSection} ${styles.dangerZone}`}>
                            <h3 className={styles.dangerTitle}>Danger Zone</h3>
                            
                            <div className={styles.dangerActions}>
                              <div className={styles.dangerAction}>
                                <div className={styles.actionInfo}>
                                  <div className={styles.actionTitle}>Complete Neural Erasure</div>
                                  <div className={styles.actionDescription}>
                                    Permanently remove all remaining neural signatures from the system. This completes the damnatio memoriae process.
                                  </div>
                                </div>
                                <Button 
                                  variant="destructive" 
                                  onClick={handleCompleteErasure}
                                >
                                  Execute
                                </Button>
                              </div>
                            </div>
                            
                            <div className={styles.dangerWarning}>
                              WARNING: Complete erasure violates data retention policies and may result in permanent system instability.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </Card>
            ) : (
              <Card className={styles.noSelectionCard}>
                <div className={styles.noSelectionContent}>
                  <div className={styles.noSelectionIcon}>👻</div>
                  <h3 className={styles.noSelectionTitle}>No Ghost Selected</h3>
                  <p className={styles.noSelectionText}>
                    Select a ghost account from the list to view detailed information about system remnants and containment options.
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

// Helper function to get descriptions for anomaly types
const getAnomalyDescription = (anomalyType: string): string => {
  const descriptions: Record<string, string> = {
    'phantom_transaction': 'Unauthorized transaction detected in the system with ghost account fingerprints.',
    'neural_signature': 'Neural pattern matching previous user detected during system scan.',
    'identification_attempt': 'Attempt to use erased credentials or biometric markers.',
    'rem_interaction': 'R.E.M. AI responded to or recognized the ghost user.',
    'ghost_login': 'Login attempt using erased credentials detected.',
    'neural_echo': 'Traces of neural patterns found in system memory.',
    'biometric_anomaly': 'Biometric scanner detected fragments of erased user signature.'
  };
  
  return descriptions[anomalyType] || 'Unknown anomaly type detected in system records.';
};

export default GhostAccounts;


