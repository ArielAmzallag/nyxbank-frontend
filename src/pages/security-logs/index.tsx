import React, { useState } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import styles from '../../styles/SecurityLogs.module.css';

interface SecurityEvent {
  id: string;
  eventType: 'failed_login' | 'rate_limit_exceeded' | 'suspicious_transaction' | 'phantom_transaction' | 'password_changed' | 'device_change' | 'ip_change';
  details: string;
  ip?: string;
  location?: string;
  deviceInfo?: string;
  timestamp: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

const SecurityLogs: NextPage = () => {
  // Mock security events data
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: 'sec-001',
      eventType: 'failed_login',
      details: 'Multiple failed login attempts detected',
      ip: '209.85.147.129',
      location: 'Unknown Location',
      deviceInfo: 'Unknown Device',
      timestamp: '2023-11-23T03:17:00',
      threatLevel: 'medium',
      resolved: true
    },
    {
      id: 'sec-002',
      eventType: 'suspicious_transaction',
      details: 'Unusual transaction pattern detected',
      ip: '192.168.1.45',
      location: 'New Shanghai, Sector 7',
      deviceInfo: 'Recognized Device',
      timestamp: '2023-11-20T14:20:00',
      threatLevel: 'high',
      resolved: false
    },
    {
      id: 'sec-003',
      eventType: 'ip_change',
      details: 'Login from new location',
      ip: '45.67.89.123',
      location: 'Phoenix District, Sector 3',
      deviceInfo: 'Mobile Device',
      timestamp: '2023-11-18T09:15:00',
      threatLevel: 'low',
      resolved: true
    },
    {
      id: 'sec-004',
      eventType: 'password_changed',
      details: 'Password was reset successfully',
      ip: '192.168.1.45',
      location: 'New Shanghai, Sector 7',
      deviceInfo: 'Recognized Device',
      timestamp: '2023-11-15T16:45:00',
      threatLevel: 'low',
      resolved: true
    },
    {
      id: 'sec-005',
      eventType: 'phantom_transaction',
      details: 'Attempted interaction with erased account [DATA REDACTED]',
      ip: '127.0.0.1',
      location: 'LOCATION INDETERMINATE',
      deviceInfo: 'Neural Interface',
      timestamp: '2023-11-10T23:59:00',
      threatLevel: 'critical',
      resolved: false
    }
  ]);

  const [filter, setFilter] = useState<string>('all');
  const [showResolved, setShowResolved] = useState<boolean>(true);

  // Filter security events based on selected filter
  const filteredEvents = securityEvents.filter(event => {
    if (!showResolved && event.resolved) return false;
    if (filter === 'all') return true;
    return event.eventType === filter;
  });

  // Get threat level class for styling
  const getThreatLevelClass = (level: string) => {
    switch(level) {
      case 'low': return styles.threatLow;
      case 'medium': return styles.threatMedium;
      case 'high': return styles.threatHigh;
      case 'critical': return styles.threatCritical;
      default: return '';
    }
  };

  // Get event type display name
  const getEventTypeDisplay = (type: string) => {
    switch(type) {
      case 'failed_login': return 'Failed Login';
      case 'rate_limit_exceeded': return 'Rate Limit Exceeded';
      case 'suspicious_transaction': return 'Suspicious Transaction';
      case 'phantom_transaction': return 'Phantom Transaction';
      case 'password_changed': return 'Password Changed';
      case 'device_change': return 'Device Changed';
      case 'ip_change': return 'IP Address Changed';
      default: return type.replace('_', ' ');
    }
  };

  // Get event icon based on event type
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'failed_login': return '🔒';
      case 'rate_limit_exceeded': return '⚠️';
      case 'suspicious_transaction': return '💰';
      case 'phantom_transaction': return '👻';
      case 'password_changed': return '🔑';
      case 'device_change': return '📱';
      case 'ip_change': return '🌐';
      default: return '🔍';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle resolving security event
  const handleResolveEvent = (id: string) => {
    setSecurityEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, resolved: true } : event
      )
    );
  };

  return (
    <Layout>
      <div className="container">
        <h1 className={`${styles.title} neon-text`}>Security Logs</h1>
        
        <div className={styles.securitySummary}>
          <Card className={styles.summaryCard}>
            <div className={styles.summaryStats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  {securityEvents.filter(e => !e.resolved).length}
                </div>
                <div className={styles.statLabel}>Active Alerts</div>
              </div>
              
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  {securityEvents.filter(e => e.threatLevel === 'critical' || e.threatLevel === 'high').length}
                </div>
                <div className={styles.statLabel}>High Priority</div>
              </div>
              
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  {securityEvents.filter(e => e.resolved).length}
                </div>
                <div className={styles.statLabel}>Resolved</div>
              </div>
            </div>
            
            {securityEvents.some(e => e.threatLevel === 'critical' && !e.resolved) && (
              <div className={`${styles.criticalWarning} glitch`}>
                CRITICAL SECURITY ALERT: Action required immediately.
              </div>
            )}
          </Card>
        </div>
        
        <div className={styles.securityContent}>
          <div className={styles.filterControls}>
            <div className={styles.filterButtons}>
              <Button 
                variant={filter === 'all' ? 'default' : 'ghost'} 
                onClick={() => setFilter('all')}
              >
                All Events
              </Button>
              <Button 
                variant={filter === 'failed_login' ? 'default' : 'ghost'} 
                onClick={() => setFilter('failed_login')}
              >
                Login Attempts
              </Button>
              <Button 
                variant={filter === 'suspicious_transaction' ? 'default' : 'ghost'} 
                onClick={() => setFilter('suspicious_transaction')}
              >
                Suspicious Transactions
              </Button>
              <Button 
                variant={filter === 'phantom_transaction' ? 'default' : 'ghost'} 
                onClick={() => setFilter('phantom_transaction')}
              >
                Phantom Transactions
              </Button>
            </div>
            
            <div className={styles.toggleFilter}>
              <label htmlFor="showResolved" className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  id="showResolved"
                  checked={showResolved}
                  onChange={(e) => setShowResolved(e.target.checked)}
                />
                <span>Show Resolved Events</span>
              </label>
            </div>
          </div>
          
          <Card className={styles.securityLogsCard}>
            {filteredEvents.length === 0 ? (
              <div className={styles.noEvents}>
                <p>No security events found matching your filters.</p>
              </div>
            ) : (
              <div className={styles.eventsList}>
                {filteredEvents.map(event => (
                  <div key={event.id} className={styles.eventItem}>
                    <div className={styles.eventHeader}>
                      <div className={styles.eventIcon}>{getEventIcon(event.eventType)}</div>
                      
                      <div className={styles.eventInfo}>
                        <div className={styles.eventType}>
                          {getEventTypeDisplay(event.eventType)}
                        </div>
                        <div className={styles.eventTime}>
                          {formatTimestamp(event.timestamp)}
                        </div>
                      </div>
                      
                      <div className={`${styles.threatIndicator} ${getThreatLevelClass(event.threatLevel)}`}>
                        {event.threatLevel.toUpperCase()}
                      </div>
                      
                      {event.resolved && (
                        <div className={styles.resolvedBadge}>RESOLVED</div>
                      )}
                    </div>
                    
                    <div className={styles.eventDetails}>
                      <p className={`${styles.eventDescription} ${event.eventType === 'phantom_transaction' ? styles.glitchText : ''}`}>
                        {event.details}
                      </p>
                      
                      <div className={styles.metaInfo}>
                        {event.ip && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>IP:</span>
                            <span className={styles.metaValue}>{event.ip}</span>
                          </div>
                        )}
                        
                        {event.location && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Location:</span>
                            <span className={styles.metaValue}>{event.location}</span>
                          </div>
                        )}
                        
                        {event.deviceInfo && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Device:</span>
                            <span className={styles.metaValue}>{event.deviceInfo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!event.resolved && (
                      <div className={styles.eventActions}>
                        <Button 
                          size="small"
                          onClick={() => handleResolveEvent(event.id)}
                        >
                          Mark as Resolved
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
          
          <Card className={styles.infoCard}>
            <h2 className={styles.cardTitle}>Security Information</h2>
            
            <div className={styles.infoSection}>
              <h3 className={styles.infoTitle}>Threat Levels</h3>
              <ul className={styles.infoList}>
                <li className={styles.threatLow}>
                  <span className={styles.threatDot}></span>
                  <strong>Low</strong>: Informational events that require no action
                </li>
                <li className={styles.threatMedium}>
                  <span className={styles.threatDot}></span>
                  <strong>Medium</strong>: Events that may require your attention
                </li>
                <li className={styles.threatHigh}>
                  <span className={styles.threatDot}></span>
                  <strong>High</strong>: Significant security concerns requiring action
                </li>
                <li className={styles.threatCritical}>
                  <span className={styles.threatDot}></span>
                  <strong>Critical</strong>: Immediate attention required to prevent account compromise
                </li>
              </ul>
            </div>
            
            <div className={styles.infoSection}>
              <h3 className={styles.infoTitle}>Protecting Your Account</h3>
              <ul className={styles.infoList}>
                <li>Enable biometric verification for all transactions</li>
                <li>Monitor your security logs regularly</li>
                <li>Report suspicious activity immediately</li>
                <li>Use unique passwords and change them regularly</li>
                <li>Verify your neural signature monthly at a NyxBank facility</li>
              </ul>
            </div>
            
            <div className={`${styles.neuralWarning} glitch`}>
              <p>Neural monitoring is active on your account. Anomalies in your brainwave patterns will trigger automatic security protocols.</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SecurityLogs;
