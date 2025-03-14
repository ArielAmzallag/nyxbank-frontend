import React, { useState } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import styles from '../../styles/Profile.module.css';

const Profile: NextPage = () => {
  // Mock user data
  const [userData, setUserData] = useState({
    username: 'JohnDoe',
    email: 'john.doe@example.com',
    memberSince: '2022-09-15',
    biometricStatus: 'verified',
    collateralStatus: 'none',
    lastLogin: '2023-11-22T09:45:00',
    securityLevel: 'standard',
    twoFactorEnabled: false,
    neuralID: 'ND-7829-4501-A',
    marketingPreferences: {
      emailUpdates: true,
      biometricScanning: false,
      memoryImprints: false
    }
  });

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: userData.username,
    email: userData.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailUpdates: userData.marketingPreferences.emailUpdates,
    biometricScanning: userData.marketingPreferences.biometricScanning,
    memoryImprints: userData.marketingPreferences.memoryImprints
  });

  // Security logs (mock data)
  const securityLogs = [
    {
      id: 'log1',
      action: 'Login',
      ip: '192.168.1.45',
      location: 'New Shanghai, Sector 7',
      timestamp: '2023-11-22T09:45:00',
      status: 'success'
    },
    {
      id: 'log2',
      action: 'Password Change',
      ip: '192.168.1.45',
      location: 'New Shanghai, Sector 7',
      timestamp: '2023-11-15T14:20:00',
      status: 'success'
    },
    {
      id: 'log3',
      action: 'Login',
      ip: '209.85.147.129',
      location: 'Unknown Location',
      timestamp: '2023-11-10T03:17:00',
      status: 'failed'
    }
  ];

  const [activeTab, setActiveTab] = useState('general');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required.');
        return;
      }
      
      if (formData.newPassword.length < 8) {
        setError('New password must be at least 8 characters.');
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
    }
    
    // Simulate API call
    setError('');
    
    setTimeout(() => {
      // Update user data with new values
      setUserData(prev => ({
        ...prev,
        username: formData.username,
        email: formData.email,
        marketingPreferences: {
          emailUpdates: formData.emailUpdates,
          biometricScanning: formData.biometricScanning,
          memoryImprints: formData.memoryImprints
        }
      }));
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setIsEditing(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="container">
        <h1 className={`${styles.title} neon-text`}>Account Profile</h1>
        
        <div className={styles.profileContainer}>
          <div className={styles.profileSidebar}>
            <Card className={styles.profileCard}>
              <div className={styles.profileAvatar}>
                <div className={styles.avatar}>
                  {userData.username[0].toUpperCase()}
                </div>
                
                <div className={styles.userInfo}>
                  <h2 className={styles.username}>{userData.username}</h2>
                  <p className={styles.userDetails}>Member since {new Date(userData.memberSince).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className={styles.userStatus}>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Neural ID:</span>
                  <span className={styles.statusValue}>{userData.neuralID}</span>
                </div>
                
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Biometric Status:</span>
                  <span className={`${styles.statusValue} ${styles.biometricStatus}`}>
                    {userData.biometricStatus.toUpperCase()}
                  </span>
                </div>
                
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Collateral Status:</span>
                  <span className={`${styles.statusValue} ${styles.collateralStatus}`}>
                    {userData.collateralStatus.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className={styles.logoutAction}>
                <Button variant="destructive" onClick={() => {}} fullWidth>
                  Logout
                </Button>
              </div>
            </Card>
            <div className={styles.navigationLinks}>
              <button 
                className={`${styles.navLink} ${activeTab === 'general' ? styles.active : ''}`}
                onClick={() => setActiveTab('general')}
              >
                General Settings
              </button>
              <button 
                className={`${styles.navLink} ${activeTab === 'security' ? styles.active : ''}`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
              <button 
                className={`${styles.navLink} ${activeTab === 'preferences' ? styles.active : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                Preferences
              </button>
              <button 
                className={`${styles.navLink} ${activeTab === 'biometric' ? styles.active : ''}`}
                onClick={() => setActiveTab('biometric')}
              >
                Biometric Data
              </button>
            </div>
          </div>
          
          <div className={styles.profileContent}>
            {saveSuccess && (
              <div className={styles.successMessage}>
                Profile updated successfully!
              </div>
            )}
            
            {activeTab === 'general' && (
              <Card className={styles.contentCard}>
                <h2 className={styles.cardTitle}>General Settings</h2>
                
                {isEditing ? (
                  <form onSubmit={handleSave} className={styles.profileForm}>
                    <div className={styles.formGroup}>
                      <Input
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                      />
                    </div>
                    
                    {saveError && (
                      <div className={`${styles.errorMessage} glitch`}>
                        {saveError}
                      </div>
                    )}
                    
                    <div className={styles.formActions}>
                      <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.profileDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Username:</span>
                      <span className={styles.detailValue}>{userData.username}</span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Email:</span>
                      <span className={styles.detailValue}>{userData.email}</span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Member Since:</span>
                      <span className={styles.detailValue}>{new Date(userData.memberSince).toLocaleDateString()}</span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Last Login:</span>
                      <span className={styles.detailValue}>{formatDate(userData.lastLogin)}</span>
                    </div>
                    
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  </div>
                )}
              </Card>
            )}
            
            {activeTab === 'security' && (
              <Card className={styles.contentCard}>
                <h2 className={styles.cardTitle}>Security Settings</h2>
                
                <div className={styles.securitySection}>
                  <h3 className={styles.sectionTitle}>Password</h3>
                  
                  <form onSubmit={handleSave} className={styles.profileForm}>
                    <div className={styles.formGroup}>
                      <Input
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        fullWidth
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        fullWidth
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        fullWidth
                      />
                    </div>
                    
                    {saveError && (
                      <div className={`${styles.errorMessage} glitch`}>
                        {saveError}
                      </div>
                    )}
                    
                    <Button type="submit">
                      Update Password
                    </Button>
                  </form>
                </div>
                
                <div className={styles.securitySection}>
                  <h3 className={styles.sectionTitle}>Two-Factor Authentication</h3>
                  
                  <div className={styles.twoFactorStatus}>
                    <div className={styles.statusInfo}>
                      <p>Two-factor authentication is currently {userData.twoFactorEnabled ? 'enabled' : 'disabled'}.</p>
                      <p className={styles.securityNote}>Enabling two-factor authentication adds an extra layer of security to your account.</p>
                    </div>
                    
                    <Button variant={userData.twoFactorEnabled ? 'destructive' : 'default'}>
                      {userData.twoFactorEnabled ? 'Disable' : 'Enable'} Two-Factor
                    </Button>
                  </div>
                </div>
                
                <div className={styles.securitySection}>
                  <h3 className={styles.sectionTitle}>Recent Activity</h3>
                  
                  <div className={styles.securityLogs}>
                    {securityLogs.map(log => (
                      <div key={log.id} className={styles.logItem}>
                        <div className={styles.logItemHeader}>
                          <span className={styles.logAction}>{log.action}</span>
                          <span className={`${styles.logStatus} ${log.status === 'success' ? styles.statusSuccess : styles.statusFailed}`}>
                            {log.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className={styles.logItemDetails}>
                          <div className={styles.logDetail}>
                            <span className={styles.logDetailLabel}>IP:</span>
                            <span className={styles.logDetailValue}>{log.ip}</span>
                          </div>
                          
                          <div className={styles.logDetail}>
                            <span className={styles.logDetailLabel}>Location:</span>
                            <span className={styles.logDetailValue}>{log.location}</span>
                          </div>
                          
                          <div className={styles.logDetail}>
                            <span className={styles.logDetailLabel}>Time:</span>
                            <span className={styles.logDetailValue}>{formatDate(log.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.viewAllLogs}>
                    <Button variant="ghost" onClick={() => {}} fullWidth>
                      View All Activity
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            
            {activeTab === 'preferences' && (
              <Card className={styles.contentCard}>
                <h2 className={styles.cardTitle}>Preferences</h2>
                
                <div className={styles.preferencesSection}>
                  <h3 className={styles.sectionTitle}>Marketing Preferences</h3>
                  
                  <form onSubmit={handleSave} className={styles.profileForm}>
                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        id="emailUpdates"
                        name="emailUpdates"
                        checked={formData.emailUpdates}
                        onChange={handleChange}
                      />
                      <label htmlFor="emailUpdates">Receive email updates about NyxBank services</label>
                    </div>
                    
                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        id="biometricScanning"
                        name="biometricScanning"
                        checked={formData.biometricScanning}
                        onChange={handleChange}
                      />
                      <label htmlFor="biometricScanning">Allow biometric scanning for personalized offers</label>
                    </div>
                    
                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        id="memoryImprints"
                        name="memoryImprints"
                        checked={formData.memoryImprints}
                        onChange={handleChange}
                      />
                      <label htmlFor="memoryImprints">Participate in neural memory research program</label>
                    </div>
                    
                    <div className={styles.formActions}>
                      <Button type="submit">
                        Save Preferences
                      </Button>
                    </div>
                  </form>
                </div>
                
                <div className={styles.preferencesNote}>
                  <p className={styles.disclaimer}>* By enabling neural memory research, you agree to allow NyxBank R.E.M. to analyze your transaction patterns for improved AI services.</p>
                </div>
              </Card>
            )}
            
            {activeTab === 'biometric' && (
              <Card className={styles.contentCard}>
                <h2 className={styles.cardTitle}>Biometric Data</h2>
                
                <div className={styles.biometricStatus}>
                  <div className={styles.biometricIcon}>🧬</div>
                  <div className={styles.biometricInfo}>
                    <h3 className={styles.biometricTitle}>Biometric Collateral Status</h3>
                    <p>Your biometric data is currently <span className={styles.emphasize}>not being held as collateral</span>.</p>
                  </div>
                </div>
                
                <div className={styles.biometricItem}>
                  <div className={styles.biometricHeader}>
                    <span className={styles.biometricType}>Fingerprint Scan</span>
                    <span className={styles.biometricVerified}>VERIFIED</span>
                  </div>
                  <p className={styles.biometricDescription}>
                    Last verified: {new Date().toLocaleDateString()}
                  </p>
                </div>
                
                <div className={styles.biometricItem}>
                  <div className={styles.biometricHeader}>
                    <span className={styles.biometricType}>Retinal Pattern</span>
                    <span className={styles.biometricVerified}>VERIFIED</span>
                  </div>
                  <p className={styles.biometricDescription}>
                    Last verified: {new Date().toLocaleDateString()}
                  </p>
                </div>
                
                <div className={styles.biometricItem}>
                  <div className={styles.biometricHeader}>
                    <span className={styles.biometricType}>Neural Signature</span>
                    <span className={styles.biometricVerified}>VERIFIED</span>
                  </div>
                  <p className={styles.biometricDescription}>
                    Last verified: {new Date().toLocaleDateString()}
                  </p>
                </div>
                
                <div className={`${styles.biometricWarning} glitch`}>
                  <p>WARNING: Under NyxBank's debt enforcement policy, failure to meet financial obligations may result in biometric data being seized as collateral.</p>
                </div>
                
                <div className={styles.biometricActions}>
                  <Button onClick={() => {}} variant="outline">
                    Request Data Scan
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
