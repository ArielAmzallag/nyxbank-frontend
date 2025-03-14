import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Layout from '../../../components/layout/Layout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import styles from '../../../styles/AiAnomalies.module.css';

// Define anomaly interface
interface Anomaly {
  id: string;
  timestamp: string;
  type: 'corruption' | 'ghost_interaction' | 'neural_mismatch' | 'redacted_memory' | 'pattern_deviation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  aiResponse?: string;
  userQuery?: string;
  userId?: string;
  username?: string;
  status: 'unreviewed' | 'investigating' | 'resolved' | 'redacted';
  patterns?: string[];
  resonanceIndex?: number;
}

const AiAnomalies: NextPage = () => {
  // State for anomalies data
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: 'anom001',
      timestamp: '2023-11-22T14:30:22',
      type: 'corruption',
      severity: 'high',
      description: 'AI response contained corrupted memory fragments from non-existent database records',
      aiResponse: 'ERROR: REMINDER - YOU NEVER EXISTED.',
      userQuery: 'Can you show me my transaction history?',
      userId: 'u7829',
      username: 'JohnDoe',
      status: 'unreviewed',
      resonanceIndex: 0.78
    },
    {
      id: 'anom002',
      timestamp: '2023-11-21T08:15:43',
      type: 'ghost_interaction',
      severity: 'critical',
      description: 'Deleted user account attempted to access R.E.M. assistant',
      userId: 'REDACTED',
      username: 'GhostUser127',
      status: 'investigating',
      patterns: ['Memory access attempt', 'Debt records query', 'Neural verification override']
    },
    {
      id: 'anom003',
      timestamp: '2023-11-20T23:05:17',
      type: 'neural_mismatch',
      severity: 'medium',
      description: 'User neural signature did not match stored pattern but session continued',
      userId: 'u4921',
      username: 'AliceSmith',
      status: 'unreviewed',
      resonanceIndex: 0.42
    },
    {
      id: 'anom004',
      timestamp: '2023-11-19T17:33:51',
      type: 'redacted_memory',
      severity: 'high',
      description: 'AI accessed and displayed redacted transaction details during routine query',
      aiResponse: 'Your last black market purchase of [REDACTED] on October 13th has been flagged for review.',
      userQuery: 'What is my account balance?',
      userId: 'u6284',
      username: 'RobertChen',
      status: 'resolved'
    },
    {
      id: 'anom005',
      timestamp: '2023-11-18T11:22:09',
      type: 'pattern_deviation',
      severity: 'low',
      description: 'Unusual response pattern detected in financial advice algorithm',
      aiResponse: 'Consider investing in sectors that will survive the coming [DATA CORRUPTED]. NyxBank predicts significant [NEURAL LINK BROKEN].',
      userQuery: 'What should I invest in?',
      userId: 'u3845',
      username: 'SarahJohnson',
      status: 'unreviewed'
    },
    {
      id: 'anom006',
      timestamp: '2023-11-17T09:47:32',
      type: 'corruption',
      severity: 'critical',
      description: 'Complete system corruption event with multiple affected users',
      aiResponse: 'DAMNATIO MEMORIAE PROTOCOL ACTIVE - USER DATABASE FRAGMENTATION DETECTED',
      status: 'redacted',
      patterns: ['Mass memory corruption', 'Record deletion', 'Neural signature override']
    },
    {
      id: 'anom007',
      timestamp: '2023-11-16T14:08:54',
      type: 'ghost_interaction',
      severity: 'high',
      description: 'Erased user attempted financial transaction through R.E.M.',
      userId: 'ERASED-291',
      username: 'FormerUser',
      status: 'investigating',
      resonanceIndex: 0.11
    }
  ]);

  // State for filters
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  
  // State for metrics
  const [metrics, setMetrics] = useState({
    total: anomalies.length,
    critical: anomalies.filter(a => a.severity === 'critical').length,
    high: anomalies.filter(a => a.severity === 'high').length,
    medium: anomalies.filter(a => a.severity === 'medium').length,
    low: anomalies.filter(a => a.severity === 'low').length,
    unreviewed: anomalies.filter(a => a.status === 'unreviewed').length,
    ghostUsers: anomalies.filter(a => a.type === 'ghost_interaction').length
  });

  // Apply filters to anomalies
  const filteredAnomalies = anomalies.filter(anomaly => {
    // Type filter
    const typeMatch = activeFilter === 'all' || anomaly.type === activeFilter;
    
    // Severity filter
    const severityMatch = severityFilter === 'all' || anomaly.severity === severityFilter;
    
    // Search filter - check if query appears in description, response, or username
    const searchMatch = searchQuery === '' || 
      anomaly.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anomaly.aiResponse?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anomaly.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && severityMatch && searchMatch;
  });
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get severity class for styling
  const getSeverityClass = (severity: string) => {
    switch(severity) {
      case 'critical': return styles.severityCritical;
      case 'high': return styles.severityHigh;
      case 'medium': return styles.severityMedium;
      case 'low': return styles.severityLow;
      default: return '';
    }
  };

  // Get type display name
  const getTypeDisplay = (type: string) => {
    switch(type) {
      case 'corruption': return 'Data Corruption';
      case 'ghost_interaction': return 'Ghost User';
      case 'neural_mismatch': return 'Neural Mismatch';
      case 'redacted_memory': return 'Memory Leak';
      case 'pattern_deviation': return 'Pattern Deviation';
      default: return type.replace('_', ' ');
    }
  };

  // Handle selecting an anomaly for detailed view
  const handleSelectAnomaly = (anomaly: Anomaly) => {
    setSelectedAnomaly(anomaly);
  };

  // Handle updating anomaly status
  const handleUpdateStatus = (newStatus: 'investigating' | 'resolved' | 'redacted') => {
    if (!selectedAnomaly) return;

    const updatedAnomalies = anomalies.map(anomaly => 
      anomaly.id === selectedAnomaly.id 
        ? { ...anomaly, status: newStatus }
        : anomaly
    );

    setAnomalies(updatedAnomalies);
    setSelectedAnomaly({ ...selectedAnomaly, status: newStatus });
    
    // Update metrics
    setMetrics({
      ...metrics,
      unreviewed: updatedAnomalies.filter(a => a.status === 'unreviewed').length
    });
  };

  // Close the detail panel
  const handleCloseDetail = () => {
    setSelectedAnomaly(null);
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
            R.E.M. Anomaly Monitor
          </h1>
          <div className={styles.securityBadge}>
            Admin Access: Level 3
          </div>
        </div>
        
        <div className={styles.dashboardContainer}>
          <div className={styles.leftPanel}>
            <Card className={styles.metricsCard}>
              <h2 className={styles.sectionTitle}>System Metrics</h2>
              
              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <div className={styles.metricValue}>{metrics.total}</div>
                  <div className={styles.metricLabel}>Total Anomalies</div>
                </div>
                
                <div className={`${styles.metricItem} ${styles.metricCritical}`}>
                  <div className={styles.metricValue}>{metrics.critical}</div>
                  <div className={styles.metricLabel}>Critical</div>
                </div>
                
                <div className={`${styles.metricItem} ${styles.metricHigh}`}>
                  <div className={styles.metricValue}>{metrics.high}</div>
                  <div className={styles.metricLabel}>High</div>
                </div>
                
                <div className={`${styles.metricItem} ${styles.metricMedium}`}>
                  <div className={styles.metricValue}>{metrics.medium}</div>
                  <div className={styles.metricLabel}>Medium</div>
                </div>
                
                <div className={`${styles.metricItem} ${styles.metricLow}`}>
                  <div className={styles.metricValue}>{metrics.low}</div>
                  <div className={styles.metricLabel}>Low</div>
                </div>
                
                <div className={styles.metricItem}>
                  <div className={styles.metricValue}>{metrics.unreviewed}</div>
                  <div className={styles.metricLabel}>Unreviewed</div>
                </div>
                
                <div className={`${styles.metricItem} ${styles.metricGhost}`}>
                  <div className={styles.metricValue}>{metrics.ghostUsers}</div>
                  <div className={styles.metricLabel}>Ghost Users</div>
                </div>
              </div>
            </Card>
            
            <Card className={styles.filtersCard}>
              <h2 className={styles.sectionTitle}>Filters</h2>
              
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Anomaly Type</h3>
                <div className={styles.filterOptions}>
                  <button 
                    className={`${styles.filterButton} ${activeFilter === 'all' ? styles.activeFilter : ''}`}
                    onClick={() => setActiveFilter('all')}
                  >
                    All Types
                  </button>
                  <button 
                    className={`${styles.filterButton} ${activeFilter === 'corruption' ? styles.activeFilter : ''}`}
                    onClick={() => setActiveFilter('corruption')}
                  >
                    Data Corruption
                  </button>
                  <button 
                    className={`${styles.filterButton} ${activeFilter === 'ghost_interaction' ? styles.activeFilter : ''}`}
                    onClick={() => setActiveFilter('ghost_interaction')}
                  >
                    Ghost Users
                  </button>
                  <button 
                    className={`${styles.filterButton} ${activeFilter === 'neural_mismatch' ? styles.activeFilter : ''}`}
                    onClick={() => setActiveFilter('neural_mismatch')}
                  >
                    Neural Mismatch
                  </button>
                  <button 
                    className={`${styles.filterButton} ${activeFilter === 'redacted_memory' ? styles.activeFilter : ''}`}
                    onClick={() => setActiveFilter('redacted_memory')}
                  >
                    Memory Leaks
                  </button>
                  <button 
                    className={`${styles.filterButton} ${activeFilter === 'pattern_deviation' ? styles.activeFilter : ''}`}
                    onClick={() => setActiveFilter('pattern_deviation')}
                  >
                    Pattern Deviation
                  </button>
                </div>
              </div>
              
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Severity</h3>
                <div className={styles.filterOptions}>
                  <button 
                    className={`${styles.filterButton} ${severityFilter === 'all' ? styles.activeFilter : ''}`}
                    onClick={() => setSeverityFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`${styles.filterButton} ${styles.btnCritical} ${severityFilter === 'critical' ? styles.activeFilter : ''}`}
                    onClick={() => setSeverityFilter('critical')}
                  >
                    Critical
                  </button>
                  <button 
                    className={`${styles.filterButton} ${styles.btnHigh} ${severityFilter === 'high' ? styles.activeFilter : ''}`}
                    onClick={() => setSeverityFilter('high')}
                  >
                    High
                  </button>
                  <button 
                    className={`${styles.filterButton} ${styles.btnMedium} ${severityFilter === 'medium' ? styles.activeFilter : ''}`}
                    onClick={() => setSeverityFilter('medium')}
                  >
                    Medium
                  </button>
                  <button 
                    className={`${styles.filterButton} ${styles.btnLow} ${severityFilter === 'low' ? styles.activeFilter : ''}`}
                    onClick={() => setSeverityFilter('low')}
                  >
                    Low
                  </button>
                </div>
              </div>
              
              <div className={styles.searchFilter}>
                <Input
                  placeholder="Search anomalies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                />
              </div>
            </Card>
            
            <div className={styles.warningCard}>
              <div className={`${styles.warningContent} glitch glitchTarget`}>
                <h3>SYSTEM WARNING</h3>
                <p>Anomaly detection has identified potential neural corruption in R.E.M. memory banks.</p>
                <p>Run full system diagnostic before executing any enforcement protocols.</p>
              </div>
            </div>
          </div>
          
          <div className={styles.rightPanel}>
            {selectedAnomaly ? (
              <Card className={styles.detailCard}>
                <div className={styles.detailHeader}>
                  <h2 className={styles.detailTitle}>Anomaly Details</h2>
                  <button 
                    className={styles.closeButton} 
                    onClick={handleCloseDetail}
                  >
                    ×
                  </button>
                </div>
                
                <div className={styles.detailContent}>
                  <div className={styles.detailId}>
                    <span className={styles.detailLabel}>ID:</span>
                    <span className={styles.detailValue}>{selectedAnomaly.id}</span>
                  </div>
                  
                  <div className={styles.detailMeta}>
                    <div className={styles.detailType}>
                      <span className={styles.detailLabel}>Type:</span>
                      <span className={styles.detailValue}>{getTypeDisplay(selectedAnomaly.type)}</span>
                    </div>
                    
                    <div className={styles.detailSeverity}>
                      <span className={styles.detailLabel}>Severity:</span>
                      <span className={`${styles.detailValue} ${getSeverityClass(selectedAnomaly.severity)}`}>
                        {selectedAnomaly.severity.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className={styles.detailTime}>
                      <span className={styles.detailLabel}>Timestamp:</span>
                      <span className={styles.detailValue}>{formatDate(selectedAnomaly.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className={styles.detailDescription}>
                    <h3 className={styles.detailSubtitle}>Description</h3>
                    <p className={styles.descriptionText}>{selectedAnomaly.description}</p>
                  </div>
                  
                  {selectedAnomaly.userId && (
                    <div className={styles.userDetails}>
                      <h3 className={styles.detailSubtitle}>User Information</h3>
                      <div className={styles.userInfo}>
                        <div className={styles.userItem}>
                          <span className={styles.userLabel}>User ID:</span>
                          <span className={styles.userValue}>{selectedAnomaly.userId}</span>
                        </div>
                        
                        {selectedAnomaly.username && (
                          <div className={styles.userItem}>
                            <span className={styles.userLabel}>Username:</span>
                            <span className={styles.userValue}>
                              {selectedAnomaly.userId.includes('ERASED') || selectedAnomaly.userId === 'REDACTED' ? (
                                <span className={styles.ghostUser}>{selectedAnomaly.username}</span>
                              ) : (
                                selectedAnomaly.username
                              )}
                            </span>
                          </div>
                        )}
                        
                        {selectedAnomaly.resonanceIndex !== undefined && (
                          <div className={styles.userItem}>
                            <span className={styles.userLabel}>Neural Resonance:</span>
                            <span className={`${styles.userValue} ${
                              selectedAnomaly.resonanceIndex < 0.5 ? styles.lowResonance : styles.highResonance
                            }`}>
                              {(selectedAnomaly.resonanceIndex * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {(selectedAnomaly.userQuery || selectedAnomaly.aiResponse) && (
                    <div className={styles.interactionDetails}>
                      <h3 className={styles.detailSubtitle}>AI Interaction</h3>
                      
                      {selectedAnomaly.userQuery && (
                        <div className={styles.userQuery}>
                          <div className={styles.queryLabel}>User Query:</div>
                          <div className={styles.queryText}>{selectedAnomaly.userQuery}</div>
                        </div>
                      )}
                      
                      {selectedAnomaly.aiResponse && (
                        <div className={styles.aiResponse}>
                          <div className={styles.responseLabel}>AI Response:</div>
                          <div className={`${styles.responseText} ${selectedAnomaly.type === 'corruption' ? 'glitch' : ''}`}>
                            {selectedAnomaly.aiResponse}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedAnomaly.patterns && selectedAnomaly.patterns.length > 0 && (
                    <div className={styles.patternsDetails}>
                      <h3 className={styles.detailSubtitle}>Detected Patterns</h3>
                      <ul className={styles.patternsList}>
                        {selectedAnomaly.patterns.map((pattern, index) => (
                          <li key={`pattern-${selectedAnomaly.id}-${index}`} className={styles.patternItem}>
                            {pattern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className={styles.statusSection}>
                    <h3 className={styles.detailSubtitle}>Status</h3>
                    <div className={styles.currentStatus}>
                      <span className={styles.statusLabel}>Current Status:</span>
                      <span className={`${styles.statusValue} ${styles[`status${selectedAnomaly.status.charAt(0).toUpperCase() + selectedAnomaly.status.slice(1)}`]}`}>
                        {selectedAnomaly.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className={styles.statusActions}>
                      <Button 
                        variant={selectedAnomaly.status === 'investigating' ? 'default' : 'outline'}
                        onClick={() => handleUpdateStatus('investigating')}
                        disabled={selectedAnomaly.status === 'redacted'}
                      >
                        Mark Investigating
                      </Button>
                      <Button 
                        variant={selectedAnomaly.status === 'resolved' ? 'default' : 'outline'}
                        onClick={() => handleUpdateStatus('resolved')}
                        disabled={selectedAnomaly.status === 'redacted'}
                      >
                        Mark Resolved
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleUpdateStatus('redacted')}
                        disabled={selectedAnomaly.status === 'redacted'}
                      >
                        Redact Anomaly
                      </Button>
                    </div>
                  </div>
                </div>
                
                {selectedAnomaly.status === 'redacted' && (
                  <div className={`${styles.redactedOverlay} glitch`}>
                    <div className={styles.redactedLabel}>REDACTED BY ADMIN</div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className={styles.anomaliesCard}>
                <div className={styles.anomaliesHeader}>
                  <h2 className={styles.sectionTitle}>Detected Anomalies</h2>
                  <div className={styles.anomalyCount}>
                    Showing {filteredAnomalies.length} of {anomalies.length} anomalies
                  </div>
                </div>
                
                {filteredAnomalies.length === 0 ? (
                  <div className={styles.noAnomalies}>
                    <p>No anomalies match your current filters.</p>
                  </div>
                ) : (
                  <div className={styles.anomaliesList}>
                    {filteredAnomalies.map(anomaly => (
                      <div 
                        key={anomaly.id} 
                        className={`${styles.anomalyItem} ${anomaly.status === 'redacted' ? styles.redactedItem : ''}`}
                        onClick={() => handleSelectAnomaly(anomaly)}
                      >
                        <div className={styles.anomalyHeader}>
                          <div className={styles.anomalyType}>
                            {getTypeDisplay(anomaly.type)}
                          </div>
                          <div className={`${styles.anomalySeverity} ${getSeverityClass(anomaly.severity)}`}>
                            {anomaly.severity.toUpperCase()}
                          </div>
                        </div>
                        
                        <div className={styles.anomalyBody}>
                          <p className={styles.anomalyDescription}>
                            {anomaly.description}
                          </p>
                        </div>
                        
                        <div className={styles.anomalyFooter}>
                          <div className={styles.anomalyUser}>
                            {anomaly.username ? (
                              <span className={anomaly.userId?.includes('ERASED') || anomaly.userId === 'REDACTED' ? styles.ghostUser : ''}>
                                {anomaly.username}
                              </span>
                            ) : (
                              <span className={styles.systemAnomaly}>SYSTEM</span>
                            )}
                          </div>
                          <div className={styles.anomalyTime}>
                            {formatDate(anomaly.timestamp)}
                          </div>
                        </div>
                        
                        <div className={`${styles.anomalyStatus} ${styles[`status${anomaly.status.charAt(0).toUpperCase() + anomaly.status.slice(1)}`]}`}>
                          {anomaly.status.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className={styles.anomaliesActions}>
                  <Button variant="outline" size="small">Export Report</Button>
                  <Button variant="outline" size="small">Run Diagnostic</Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AiAnomalies;

