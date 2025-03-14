import { NextPage } from 'next';
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from '../styles/DamnatioMemoriae.module.css';

interface UserData {
  id: string;
  username: string;
  debtAmount: number;
  lastLogin: string;
  status: 'active' | 'suspended' | 'pending_erasure';
  collateralType: 'biometric' | 'memory' | 'organ' | 'none';
  neuralID: string;
  violationCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
}

const DamnatioMemoriae: NextPage = () => {
  const [accessCode, setAccessCode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmationPhrase, setConfirmationPhrase] = useState('');
  const [erasureStage, setErasureStage] = useState(0);
  const [erasureProgress, setErasureProgress] = useState(0);
  const [erasureComplete, setErasureComplete] = useState(false);
  const [adminSignature, setAdminSignature] = useState('');
  const [neuralVerification, setNeuralVerification] = useState(false);

  // Mock authentication
  const handleAuthenticate = () => {
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      if (accessCode === 'ADMIN-DAMNATIO-9382') {
        setAuthenticated(true);
        loadMockUsers();
      } else {
        setError('UNAUTHORIZED ACCESS ATTEMPT DETECTED. NEURAL SIGNATURE LOGGED.');
      }
      setLoading(false);
    }, 1500);
  };

  // Load mock user data
  const loadMockUsers = () => {
    const mockUsers: UserData[] = [
      {
        id: 'usr-7829',
        username: 'AlexKovacs',
        debtAmount: 25000,
        lastLogin: '2023-10-15T08:23:45',
        status: 'suspended',
        collateralType: 'biometric',
        neuralID: 'ND-7829-4501-A',
        violationCount: 3,
        riskLevel: 'high'
      },
      {
        id: 'usr-6392',
        username: 'SarahChen',
        debtAmount: 42500,
        lastLogin: '2023-09-28T14:12:30',
        status: 'pending_erasure',
        collateralType: 'memory',
        neuralID: 'ND-6392-7845-B',
        violationCount: 5,
        riskLevel: 'extreme'
      },
      {
        id: 'usr-9183',
        username: 'MarcusWright',
        debtAmount: 18750,
        lastLogin: '2023-10-22T11:05:17',
        status: 'suspended',
        collateralType: 'organ',
        neuralID: 'ND-9183-2056-C',
        violationCount: 2,
        riskLevel: 'medium'
      },
      {
        id: 'usr-5471',
        username: 'ElenaPetrov',
        debtAmount: 67800,
        lastLogin: '2023-10-05T19:37:22',
        status: 'pending_erasure',
        collateralType: 'memory',
        neuralID: 'ND-5471-3298-D',
        violationCount: 7,
        riskLevel: 'extreme'
      },
      {
        id: 'usr-2384',
        username: 'JamalKhan',
        debtAmount: 31200,
        lastLogin: '2023-10-18T15:42:09',
        status: 'suspended',
        collateralType: 'biometric',
        neuralID: 'ND-2384-9017-E',
        violationCount: 4,
        riskLevel: 'high'
      }
    ];
    
    setUsers(mockUsers);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.neuralID.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle user selection
  const handleUserSelect = (user: UserData) => {
    setSelectedUser(user);
    setErasureStage(0);
    setErasureComplete(false);
    setConfirmationPhrase('');
    setAdminSignature('');
    setNeuralVerification(false);
  };

  // Handle erasure process
  const startErasureProcess = () => {
    if (!selectedUser) return;
    
    if (confirmationPhrase !== `ERASE-${selectedUser.username}`) {
      setError('Confirmation phrase does not match. Please try again.');
      return;
    }
    
    if (!neuralVerification) {
      setError('Neural verification is required to proceed.');
      return;
    }
    
    if (!adminSignature.trim()) {
      setError('Admin signature is required to proceed.');
      return;
    }
    
    setError('');
    setErasureStage(1);
    setErasureProgress(0);
    
    // Simulate erasure process
    const interval = setInterval(() => {
      setErasureProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setErasureStage(2);
          setErasureComplete(true);
          
          // Remove user from list after erasure
          setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  // Get status class
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'active': return styles.statusActive;
      case 'suspended': return styles.statusSuspended;
      case 'pending_erasure': return styles.statusPendingErasure;
      default: return '';
    }
  };

  // Get risk level class
  const getRiskClass = (risk: string) => {
    switch(risk) {
      case 'low': return styles.riskLow;
      case 'medium': return styles.riskMedium;
      case 'high': return styles.riskHigh;
      case 'extreme': return styles.riskExtreme;
      default: return '';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="container">
        {!authenticated ? (
          <div className={styles.authContainer}>
            <Card variant="elevated" className={styles.authCard}>
              <div className={styles.authHeader}>
                <h1 className={styles.authTitle}>RESTRICTED ACCESS</h1>
                <div className={styles.securityLevel}>SECURITY LEVEL: MAXIMUM</div>
              </div>
              
              <div className={styles.warningBox}>
                <p className={styles.warningText}>
                  You are attempting to access the Damnatio Memoriae system - NyxBank's user erasure protocol.
                </p>
                <p className={styles.warningText}>
                  Unauthorized access is punishable by immediate neural signature seizure and memory extraction.
                </p>
              </div>
              
              <div className={styles.authForm}>
                <Input
                  label="Administrator Access Code"
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter access code"
                  fullWidth
                />
                
                {error && (
                  <div className={`${styles.errorMessage} glitch`}>
                    {error}
                  </div>
                )}
                
                <Button 
                  onClick={handleAuthenticate} 
                  disabled={loading || !accessCode}
                  variant="destructive"
                  fullWidth
                >
                  {loading ? 'Verifying...' : 'Authenticate'}
                </Button>
              </div>
              
              <div className={styles.authFooter}>
                <p className={styles.footerText}>
                  NOTICE: All access attempts are logged and monitored by R.E.M. security protocols.
                </p>
              </div>
            </Card>
          </div>
        ) : (
          <div className={styles.damnatioContainer}>
            <div className={styles.pageHeader}>
              <h1 className={`${styles.pageTitle} neon-text`}>Damnatio Memoriae</h1>
              <div className={styles.headerSubtitle}>User Erasure Protocol</div>
              <div className={styles.headerWarning}>
                WARNING: Actions performed here cannot be undone. All user data will be permanently erased.
              </div>
            </div>
            
            <div className={styles.contentGrid}>
              <div className={styles.usersPanel}>
                <Card className={styles.usersCard}>
                  <div className={styles.usersHeader}>
                    <h2 className={styles.sectionTitle}>Eligible Users</h2>
                    <div className={styles.searchBox}>
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by username or ID"
                        fullWidth
                      />
                    </div>
                  </div>
                  
                  <div className={styles.usersList}>
                    {filteredUsers.length === 0 ? (
                      <div className={styles.noUsers}>
                        No users found matching your search criteria.
                      </div>
                    ) : (
// Replace the div with role="button" with a proper button element
                    filteredUsers.map(user => (
                        <button
                        key={user.id}
                        className={`${styles.userItem} ${selectedUser?.id === user.id ? styles.selectedUser : ''}`}
                        onClick={() => handleUserSelect(user)}
                        type="button"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleUserSelect(user);
                            }
                        }}
                        >
                        <div className={styles.userHeader}>
                            <span className={styles.userName}>{user.username}</span>
                            <span className={`${styles.userStatus} ${getStatusClass(user.status)}`}>
                            {user.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                        
                        <div className={styles.userDetails}>
                            <div className={styles.userDetail}>
                            <span className={styles.detailLabel}>ID:</span>
                            <span className={styles.detailValue}>{user.id}</span>
                            </div>
                            
                            <div className={styles.userDetail}>
                            <span className={styles.detailLabel}>Debt:</span>
                            <span className={styles.detailValue}>{user.debtAmount.toLocaleString()} NYX</span>
                            </div>
                            
                            <div className={styles.userDetail}>
                            <span className={styles.detailLabel}>Risk Level:</span>
                            <span className={`${styles.detailValue} ${getRiskClass(user.riskLevel)}`}>
                                {user.riskLevel.toUpperCase()}
                            </span>
                            </div>
                        </div>
                        </button>
                    ))
                    
                    )}
                  </div>
                </Card>
              </div>
              
              <div className={styles.detailsPanel}>
                {selectedUser ? (
                  <Card variant="elevated" className={styles.detailsCard}>
                    {erasureComplete ? (
                      <div className={styles.erasureComplete}>
                        <div className={styles.erasureIcon}>✓</div>
                        <h2 className={styles.erasureTitle}>Damnatio Memoriae Complete</h2>
                        <p className={styles.erasureMessage}>
                          User <span className={styles.erasedUser}>{selectedUser.username}</span> has been permanently erased from all NyxBank systems.
                        </p>
                        <p className={styles.erasureSubtext}>
                          Neural signature, biometric data, transaction history, and all associated records have been purged.
                        </p>
                        <div className={styles.erasureActions}>
                          <Button onClick={() => setSelectedUser(null)}>
                            Return to User List
                          </Button>
                        </div>
                        <div className={styles.erasureFooter}>
                          <p className={styles.erasureFooterText}>
                            Erasure authorized by: {adminSignature}
                          </p>
                          <p className={styles.erasureFooterText}>
                            Timestamp: {new Date().toISOString()}
                          </p>
                        </div>
                      </div>
                    ) : erasureStage === 1 ? (
                      <div className={styles.erasureProgress}>
                        <h2 className={styles.erasureTitle}>Erasure In Progress</h2>
                        <p className={styles.erasureSubtext}>
                          Purging all records of {selectedUser.username} from NyxBank systems.
                        </p>
                        
                        <div className={styles.progressContainer}>
                          <div 
                            className={styles.progressBar} 
                            style={{ width: `${erasureProgress}%` }}
                          ></div>
                        </div>
                        
                        <div className={styles.progressSteps}>
                          <div className={`${styles.progressStep} ${erasureProgress >= 20 ? styles.completed : ''}`}>
                            <div className={styles.stepIndicator}>1</div>
                            <div className={styles.stepLabel}>Neural Signature Purge</div>
                          </div>
                          
                          <div className={`${styles.progressStep} ${erasureProgress >= 40 ? styles.completed : ''}`}>
                            <div className={styles.stepIndicator}>2</div>
                            <div className={styles.stepLabel}>Biometric Data Deletion</div>
                          </div>
                          
                          <div className={`${styles.progressStep} ${erasureProgress >= 60 ? styles.completed : ''}`}>
                            <div className={styles.stepIndicator}>3</div>
                            <div className={styles.stepLabel}>Transaction History Removal</div>
                          </div>
                          
                          <div className={`${styles.progressStep} ${erasureProgress >= 80 ? styles.completed : ''}`}>
                            <div className={styles.stepIndicator}>4</div>
                            <div className={styles.stepLabel}>Account Purge</div>
                          </div>
                          
                          <div className={`${styles.progressStep} ${erasureProgress >= 100 ? styles.completed : ''}`}>
                            <div className={styles.stepIndicator}>5</div>
                            <div className={styles.stepLabel}>Memory Trace Elimination</div>
                          </div>
                        </div>
                        
                        <p className={styles.progressWarning}>
                          DO NOT INTERRUPT THIS PROCESS. System instability may result.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className={styles.userProfile}>
                          <h2 className={styles.profileTitle}>{selectedUser.username}</h2>
                          <div className={styles.profileId}>ID: {selectedUser.id}</div>
                          
                          <div className={styles.profileGrid}>
                            <div className={styles.profileItem}>
                              <span className={styles.profileLabel}>Neural ID:</span>
                              <span className={styles.profileValue}>{selectedUser.neuralID}</span>
                            </div>
                            
                            <div className={styles.profileItem}>
                              <span className={styles.profileLabel}>Status:</span>
                              <span className={`${styles.profileValue} ${getStatusClass(selectedUser.status)}`}>
                                {selectedUser.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            
                            <div className={styles.profileItem}>
                              <span className={styles.profileLabel}>Debt Amount:</span>
                              <span className={styles.profileValue}>{selectedUser.debtAmount.toLocaleString()} NYX</span>
                            </div>
                            
                            <div className={styles.profileItem}>
                              <span className={styles.profileLabel}>Last Login:</span>
                              <span className={styles.profileValue}>{formatDate(selectedUser.lastLogin)}</span>
                            </div>
                            
                            <div className={styles.profileItem}>
                              <span className={styles.profileLabel}>Collateral Type:</span>
                              <span className={styles.profileValue}>{selectedUser.collateralType.toUpperCase()}</span>
                            </div>
                            
                            <div className={styles.profileItem}>
                              <span className={styles.profileLabel}>Violation Count:</span>
                              <span className={styles.profileValue}>{selectedUser.violationCount}</span>
                            </div>
                            
                            <div className={styles.profileItem}>
                              <span className={styles.profileLabel}>Risk Level:</span>
                              <span className={`${styles.profileValue} ${getRiskClass(selectedUser.riskLevel)}`}>
                                {selectedUser.riskLevel.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={styles.erasureForm}>
                          <h3 className={styles.erasureFormTitle}>Damnatio Memoriae Authorization</h3>
                          
                          <div className={styles.formGroup}>
                            <label htmlFor="confirmationPhrase" className={styles.formLabel}>
                                To confirm erasure, type: <span className={styles.confirmText}>ERASE-{selectedUser.username}</span>
                            </label>
                            <Input
                                id="confirmationPhrase"
                                type="text"
                                value={confirmationPhrase}
                                onChange={(e) => setConfirmationPhrase(e.target.value)}
                                placeholder={`ERASE-${selectedUser.username}`}
                                fullWidth
                            />
                            </div>

                            <div className={styles.formGroup}>
                            <label htmlFor="adminSignature" className={styles.formLabel}>
                                Administrator Signature
                            </label>
                            <Input
                                id="adminSignature"
                                type="text"
                                value={adminSignature}
                                onChange={(e) => setAdminSignature(e.target.value)}
                                placeholder="Enter your full name"
                                fullWidth
                            />
                            </div>
                          
                          <div className={styles.formGroup}>
                            <div className={styles.checkboxGroup}>
                              <Input
                                type="checkbox"
                                id="neuralVerification"
                                checked={neuralVerification}
                                onChange={() => setNeuralVerification(!neuralVerification)}
                              />
                              <label htmlFor="neuralVerification" className={styles.checkboxLabel}>
                                I authorize neural verification and accept responsibility for this erasure.
                              </label>
                            </div>
                          </div>
                          
                          {error && (
                            <div className={`${styles.errorMessage} glitch`}>
                              {error}
                            </div>
                          )}
                          
                          <div className={styles.warningBox}>
                            <p className={styles.warningText}>
                              WARNING: Damnatio Memoriae is irreversible. The user will be completely erased from all systems and records.
                            </p>
                            <p className={styles.warningText}>
                              This action violates standard data retention policies and should only be used in extreme cases.
                            </p>
                          </div>
                          
                          <div className={styles.formActions}>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedUser(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={startErasureProcess}
                              disabled={!confirmationPhrase || !adminSignature || !neuralVerification}
                            >
                              Execute Damnatio Memoriae
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                ) : (
                  <Card className={styles.noSelectionCard}>
                    <div className={styles.noSelection}>
                      <div className={styles.noSelectionIcon}>⚠️</div>
                      <h2 className={styles.noSelectionTitle}>No User Selected</h2>
                      <p className={styles.noSelectionText}>
                        Select a user from the list to view details and initiate the Damnatio Memoriae protocol.
                      </p>
                    </div>
                    
                    <div className={styles.protocolInfo}>
                      <h3 className={styles.infoTitle}>About Damnatio Memoriae</h3>
                      <p className={styles.infoText}>
                        Damnatio Memoriae is NyxBank's ultimate penalty for severe debt default or terms violation.
                      </p>
                      <p className={styles.infoText}>
                        This protocol completely erases a user from all systems, including neural signature databases, transaction records, and biometric collateral storage.
                      </p>
                      <p className={styles.infoText}>
                        Once executed, the user will have no record of ever existing within NyxBank systems.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DamnatioMemoriae;

