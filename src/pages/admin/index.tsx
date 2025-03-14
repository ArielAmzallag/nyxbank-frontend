import React, { useState } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import styles from '../../styles/Admin.module.css';

interface User {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'suspended' | 'erased';
  memberSince: string;
  debtStatus: 'none' | 'active' | 'overdue';
  biometricCollateral: boolean;
}

interface Transaction {
  id: string;
  type: string;
  sender: string;
  recipient: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  flagged: boolean;
}

const AdminDashboard: NextPage = () => {
  // Mock admin data
  const [users, setUsers] = useState<User[]>([
    {
      id: 'usr1',
      username: 'JohnDoe',
      email: 'john.doe@example.com',
      status: 'active',
      memberSince: '2023-08-15',
      debtStatus: 'none',
      biometricCollateral: false
    },
    {
      id: 'usr2',
      username: 'JaneSmith',
      email: 'jane.smith@example.com',
      status: 'active',
      memberSince: '2023-09-22',
      debtStatus: 'active',
      biometricCollateral: false
    },
    {
      id: 'usr3',
      username: 'GhostUser',
      email: 'ghost@redacted.nyc',
      status: 'erased',
      memberSince: '2023-01-10',
      debtStatus: 'overdue',
      biometricCollateral: true
    },
    {
      id: 'usr4',
      username: 'AlexWilson',
      email: 'alex.wilson@example.com',
      status: 'suspended',
      memberSince: '2023-07-05',
      debtStatus: 'overdue',
      biometricCollateral: true
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: 'tx1',
      type: 'transfer',
      sender: 'JohnDoe',
      recipient: 'JaneSmith',
      amount: 250,
      currency: 'NYX',
      status: 'completed',
      date: '2023-11-15',
      flagged: false
    },
    {
      id: 'tx2',
      type: 'crypto_trade',
      sender: 'JaneSmith',
      recipient: 'CryptoExchange',
      amount: 50,
      currency: 'OBL',
      status: 'completed',
      date: '2023-11-14',
      flagged: false
    },
    {
      id: 'tx3',
      type: 'black_market',
      sender: 'AlexWilson',
      recipient: 'UnknownEntity',
      amount: 1200,
      currency: 'DRM',
      status: 'flagged',
      date: '2023-11-10',
      flagged: true
    },
    {
      id: 'tx4',
      type: 'loan_payment',
      sender: 'JaneSmith',
      recipient: 'NyxBank',
      amount: 300,
      currency: 'NYX',
      status: 'failed',
      date: '2023-11-05',
      flagged: true
    }
  ]);

  const [securityLogs] = useState([
    {
      id: 'log1',
      type: 'failed_login',
      user: 'JohnDoe',
      timestamp: '2023-11-22T10:15:22',
      ip: '192.168.1.45',
      details: 'Incorrect password (3rd attempt)'
    },
    {
      id: 'log2',
      type: 'suspicious_transaction',
      user: 'AlexWilson',
      timestamp: '2023-11-20T15:30:45',
      ip: '209.85.147.129',
      details: 'Unusual transaction pattern detected'
    },
    {
      id: 'log3',
      type: 'phantom_transaction',
      user: 'GhostUser',
      timestamp: '2023-11-18T02:12:09',
      ip: 'UNKNOWN',
      details: 'Erased user attempted transaction'
    }
  ]);

  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(tx => 
    tx.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogs = securityLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserStatusClass = (status: string) => {
    switch(status) {
      case 'active': return styles.statusActive;
      case 'suspended': return styles.statusSuspended;
      case 'erased': return styles.statusErased;
      default: return '';
    }
  };

  const getDebtStatusClass = (status: string) => {
    switch(status) {
      case 'none': return styles.debtNone;
      case 'active': return styles.debtActive;
      case 'overdue': return styles.debtOverdue;
      default: return '';
    }
  };

  const getTransactionStatusClass = (status: string) => {
    switch(status) {
      case 'completed': return styles.txCompleted;
      case 'pending': return styles.txPending;
      case 'failed': return styles.txFailed;
      case 'flagged': return styles.txFlagged;
      default: return '';
    }
  };

  const confirmAction = (user: User, action: string) => {
    setSelectedUser(user);
    setActionType(action);
    setShowConfirmation(true);
  };

  const executeAction = () => {
    if (!selectedUser || !actionType) return;
    
    // Update user status based on action
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        switch(actionType) {
          case 'suspend':
            return { ...user, status: 'suspended' as const };
          case 'activate':
            return { ...user, status: 'active' as const };
          case 'erase':
            return { ...user, status: 'erased' as const };
          case 'collect':
            return { ...user, biometricCollateral: true };
          default:
            return user;
        }
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setShowConfirmation(false);
    setSelectedUser(null);
    setActionType('');
  };

  return (
    <Layout>
      <div className="container">
        <h1 className={`${styles.title} neon-text`}>NyxBank Admin Panel</h1>
        
        <div className={styles.adminActions}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'transactions' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'security' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security Logs
            </button>
          </div>
          
          <div className={styles.searchBar}>
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        {activeTab === 'users' && (
          <Card className={styles.contentCard}>
            <h2 className={styles.cardTitle}>User Management</h2>
            
            <div className={styles.userList}>
              <div className={styles.userListHeader}>
                <span className={styles.userUsername}>Username</span>
                <span className={styles.userEmail}>Email</span>
                <span className={styles.userStatus}>Status</span>
                <span className={styles.userDebt}>Debt</span>
                <span className={styles.userActions}>Actions</span>
              </div>
              
              {filteredUsers.length === 0 ? (
                <div className={styles.noResults}>No users found matching your search.</div>
              ) : (
                filteredUsers.map(user => (
                  <div key={user.id} className={`${styles.userItem} ${user.status === 'erased' ? styles.erasedRow : ''}`}>
                    <span className={styles.userUsername}>{user.username}</span>
                    <span className={styles.userEmail}>{user.email}</span>
                    <span className={`${styles.userStatus} ${getUserStatusClass(user.status)}`}>
                      {user.status.toUpperCase()}
                    </span>
                    <span className={`${styles.userDebt} ${getDebtStatusClass(user.debtStatus)}`}>
                      {user.debtStatus === 'none' ? 'NONE' : user.debtStatus.toUpperCase()}
                    </span>
                    <div className={styles.userActions}>
                      {user.status === 'active' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="small"
                            onClick={() => confirmAction(user, 'suspend')}
                          >
                            Suspend
                          </Button>
                          {user.debtStatus === 'overdue' && !user.biometricCollateral && (
                            <Button 
                              variant="destructive" 
                              size="small"
                              onClick={() => confirmAction(user, 'collect')}
                            >
                              Collect
                            </Button>
                          )}
                        </>
                      )}
                      {user.status === 'suspended' && (
                        <Button 
                          variant="ghost" 
                          size="small"
                          onClick={() => confirmAction(user, 'activate')}
                        >
                          Activate
                        </Button>
                      )}
                      {user.status !== 'erased' && (
                        <Button 
                          variant="destructive" 
                          size="small"
                          onClick={() => confirmAction(user, 'erase')}
                        >
                          Erase
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
        
        {activeTab === 'transactions' && (
          <Card className={styles.contentCard}>
            <h2 className={styles.cardTitle}>Transaction Monitoring</h2>
            
            <div className={styles.transactionList}>
              <div className={styles.transactionListHeader}>
                <span className={styles.txId}>ID</span>
                <span className={styles.txType}>Type</span>
                <span className={styles.txUsers}>Parties</span>
                <span className={styles.txAmount}>Amount</span>
                <span className={styles.txDate}>Date</span>
                <span className={styles.txStatus}>Status</span>
                <span className={styles.txActions}>Actions</span>
              </div>
              
              {filteredTransactions.length === 0 ? (
                <div className={styles.noResults}>No transactions found matching your search.</div>
              ) : (
                filteredTransactions.map(tx => (
                  <div key={tx.id} className={`${styles.transactionItem} ${tx.flagged ? styles.flaggedRow : ''}`}>
                    <span className={styles.txId}>{tx.id}</span>
                    <span className={styles.txType}>{tx.type.replace('_', ' ')}</span>
                    <span className={styles.txUsers}>
                      <div className={styles.txSender}>{tx.sender}</div>
                      <div className={styles.txArrow}>→</div>
                      <div className={styles.txRecipient}>{tx.recipient}</div>
                    </span>
                    <span className={styles.txAmount}>
                      {tx.amount.toFixed(2)} {tx.currency}
                    </span>
                    <span className={styles.txDate}>{tx.date}</span>
                    <span className={`${styles.txStatus} ${getTransactionStatusClass(tx.status)}`}>
                      {tx.status.toUpperCase()}
                    </span>
                    <span className={styles.txActions}>
                      <Button 
                        variant="outline" 
                        size="small"
                      >
                        View
                      </Button>
                      {tx.status !== 'completed' && (
                        <Button 
                          variant="destructive" 
                          size="small"
                        >
                          Flag
                        </Button>
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
        
        {activeTab === 'security' && (
          <Card className={styles.contentCard}>
            <h2 className={styles.cardTitle}>Security Logs</h2>
            
            <div className={styles.securityLogList}>
              {filteredLogs.length === 0 ? (
                <div className={styles.noResults}>No security logs found matching your search.</div>
              ) : (
                filteredLogs.map(log => (
                  <div key={log.id} className={styles.logItem}>
                    <div className={styles.logHeader}>
                      <span className={`${styles.logType} ${styles[log.type]}`}>{log.type.replace('_', ' ').toUpperCase()}</span>
                      <span className={styles.logTimestamp}>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div className={styles.logDetails}>
                      <div className={styles.logUser}>
                        <span className={styles.logLabel}>User:</span>
                        <span className={styles.logValue}>{log.user}</span>
                      </div>
                      <div className={styles.logIp}>
                        <span className={styles.logLabel}>IP:</span>
                        <span className={styles.logValue}>{log.ip}</span>
                      </div>
                    </div>
                    <div className={styles.logMessage}>{log.details}</div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
        
        {showConfirmation && selectedUser && (
          <div className={styles.confirmationOverlay}>
            <Card className={styles.confirmationCard}>
              <h3 className={styles.confirmationTitle}>Confirm Action</h3>
              
              <div className={styles.confirmationContent}>
                {actionType === 'suspend' && (
                  <p>Are you sure you want to suspend user {selectedUser.username}?</p>
                )}
                {actionType === 'activate' && (
                  <p>Are you sure you want to reactivate user {selectedUser.username}?</p>
                )}
                {actionType === 'erase' && (
                  <div className={`${styles.eraseWarning} glitch`}>
                    <p>WARNING: You are about to initiate damnatio memoriae protocol for {selectedUser.username}.</p>
                    <p>This will permanently erase the user from all records and cannot be undone.</p>
                  </div>
                )}
                {actionType === 'collect' && (
                  <div className={styles.collectWarning}>
                    <p>Confirm biometric collateral collection from {selectedUser.username}.</p>
                    <p>This will authorize neural scanning and memory fragment extraction as per debt enforcement policy.</p>
                  </div>
                )}
              </div>
              
              <div className={styles.confirmationActions}>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant={actionType === 'erase' || actionType === 'collect' ? 'destructive' : 'default'} 
                  onClick={executeAction}
                >
                  Confirm
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;

