import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import styles from '../../styles/Disputes.module.css';

interface DisputeData {
  id: string;
  transactionId: string;
  transactionDate: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  dateSubmitted: string;
  dateResolved?: string;
  resolution?: string;
  biometricVerification: boolean;
}

interface Transaction {
  id: string;
  date: string;
  recipient: string;
  amount: number;
  currency: string;
  type: string;
}

const Disputes: NextPage = () => {
  // Mock disputes data
  const [disputes, setDisputes] = useState<DisputeData[]>([
    {
      id: 'DSP-001',
      transactionId: 'tx5',
      transactionDate: '2023-11-01',
      amount: 75,
      currency: 'SBL',
      reason: 'Transaction failed but fee was charged',
      status: 'resolved',
      dateSubmitted: '2023-11-02',
      dateResolved: '2023-11-05',
      resolution: 'Fee refunded to account',
      biometricVerification: true
    },
    {
      id: 'DSP-002',
      transactionId: 'tx3',
      transactionDate: '2023-11-10',
      amount: 500,
      currency: 'NYX',
      reason: 'Unauthorized transaction, neural signature mismatch',
      status: 'reviewing',
      dateSubmitted: '2023-11-11',
      biometricVerification: true
    }
  ]);

  // Mock recent transactions for dispute creation
  const [recentTransactions] = useState<Transaction[]>([
    { 
      id: 'tx1', 
      date: '2023-11-15',
      recipient: 'JaneSmith',
      amount: 250, 
      currency: 'NYX',
      type: 'transfer'
    },
    { 
      id: 'tx2', 
      date: '2023-11-14',
      recipient: 'CryptoExchange',
      amount: 50, 
      currency: 'OBL',
      type: 'crypto_trade'
    },
    { 
      id: 'tx3', 
      date: '2023-11-10',
      recipient: 'NyxBank',
      amount: 500, 
      currency: 'NYX',
      type: 'loan_payment'
    },
    { 
      id: 'tx5', 
      date: '2023-11-01',
      recipient: 'GhostUser',
      amount: 75, 
      currency: 'SBL',
      type: 'transfer'
    }
  ]);

  // Creating a new dispute
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [biometricVerification, setBiometricVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCreateDispute = () => {
    setShowDisputeForm(true);
    setSelectedTransaction(null);
    setDisputeReason('');
    setBiometricVerification(false);
    setError('');
  };

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setError('');
  };

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTransaction) {
      setError('Please select a transaction to dispute');
      return;
    }
    
    if (!disputeReason.trim()) {
      setError('Please provide a reason for the dispute');
      return;
    }
    
    if (!biometricVerification) {
      setError('Biometric verification is required to submit a dispute');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // Create a new dispute record
      const newDispute: DisputeData = {
        id: `DSP-${String(disputes.length + 1).padStart(3, '0')}`,
        transactionId: selectedTransaction.id,
        transactionDate: selectedTransaction.date,
        amount: selectedTransaction.amount,
        currency: selectedTransaction.currency,
        reason: disputeReason,
        status: 'pending',
        dateSubmitted: new Date().toISOString().split('T')[0],
        biometricVerification: true
      };
      
      setDisputes(prev => [newDispute, ...prev]);
      setSuccess(true);
      setLoading(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        setShowDisputeForm(false);
        setSuccess(false);
        setDisputeReason('');
        setBiometricVerification(false);
        setSelectedTransaction(null);
      }, 3000);
    }, 2000);
  };

  const handleCancelDispute = () => {
    setShowDisputeForm(false);
    setDisputeReason('');
    setBiometricVerification(false);
    setSelectedTransaction(null);
    setError('');
  };

  // Get the appropriate status badge class
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending': return styles.statusPending;
      case 'reviewing': return styles.statusReviewing;
      case 'resolved': return styles.statusResolved;
      case 'rejected': return styles.statusRejected;
      default: return '';
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1 className={`${styles.title} neon-text`}>Transaction Disputes</h1>
        
        <div className={styles.disputesContainer}>
          {showDisputeForm ? (
            <Card variant="elevated" className={styles.disputeFormCard}>
              <h2 className={styles.cardTitle}>
                {success ? 'Dispute Submitted' : 'Create New Dispute'}
              </h2>
              
              {success ? (
                <div className={styles.successContainer}>
                  <div className={styles.successIcon}>✓</div>
                  <p className={styles.successMessage}>
                    Your dispute has been submitted successfully. We will review it shortly.
                  </p>
                  <p className={styles.referenceNumber}>
                    Reference Number: {disputes[0].id}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitDispute} className={styles.disputeForm}>
                  <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Select Transaction to Dispute</h3>
                    
                    <div className={styles.transactionSelectionList}>
                      {recentTransactions.length === 0 ? (
                        <p className={styles.noTransactions}>No recent transactions found.</p>
                      ) : (
                        recentTransactions.map(transaction => (
                            <button 
                            key={transaction.id} 
                            className={`${styles.transactionSelectItem} ${
                                selectedTransaction?.id === transaction.id ? styles.selectedTransaction : ''
                            }`}
                            onClick={() => handleSelectTransaction(transaction)}
                            type="button"
                            >
                            <div className={styles.transactionDetails}>
                              <div className={styles.transactionHeader}>
                                <span className={styles.transactionDate}>{transaction.date}</span>
                                <span className={styles.transactionType}>
                                  {transaction.type.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                              <div className={styles.transactionParty}>
                                To: {transaction.recipient}
                              </div>
                            </div>
                            <div className={styles.transactionAmount}>
                              {transaction.amount.toFixed(2)} {transaction.currency}
                            </div>
                            </button>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Dispute Reason</h3>
                    
                    <textarea
                      className={styles.disputeTextarea}
                      placeholder="Explain why you are disputing this transaction..."
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className={styles.formSection}>
                    <div className={styles.verificationCheck}>
                      <input
                        type="checkbox"
                        id="biometricVerification"
                        checked={biometricVerification}
                        onChange={(e) => setBiometricVerification(e.target.checked)}
                        required
                      />
                      <label htmlFor="biometricVerification" className={styles.verificationLabel}>
                        I authorize NyxBank to scan my neural signature to verify this dispute request.
                      </label>
                    </div>
                  </div>
                  
                  {error && (
                    <div className={`${styles.errorBox} glitch`}>
                      {error}
                    </div>
                  )}
                  
                  <div className={styles.formActions}>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={handleCancelDispute}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Submit Dispute'}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          ) : (
            <>
              <div className={styles.disputesHeader}>
                <h2 className={styles.sectionTitle}>Your Disputes</h2>
                <Button onClick={handleCreateDispute}>
                  New Dispute
                </Button>
              </div>
              
              <Card className={styles.disputesListCard}>
                {disputes.length === 0 ? (
                  <div className={styles.noDisputes}>
                    <p>You haven't filed any disputes yet.</p>
                    <Button onClick={handleCreateDispute}>
                      Create Your First Dispute
                    </Button>
                  </div>
                ) : (
                  <div className={styles.disputesList}>
                    {disputes.map(dispute => (
                      <div key={dispute.id} className={styles.disputeItem}>
                        <div className={styles.disputeHeader}>
                          <span className={styles.disputeId}>{dispute.id}</span>
                          <span className={`${styles.disputeStatus} ${getStatusClass(dispute.status)}`}>
                            {dispute.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className={styles.disputeDetails}>
                          <div className={styles.disputeTransaction}>
                            <span className={styles.detailLabel}>Transaction:</span>
                            <Link href={`/transactions/${dispute.transactionId}`} className={styles.transactionLink}>
                              {dispute.transactionId}
                            </Link>
                          </div>
                          
                          <div className={styles.disputeAmount}>
                            <span className={styles.detailLabel}>Amount:</span>
                            <span>{dispute.amount.toFixed(2)} {dispute.currency}</span>
                          </div>
                          
                          <div className={styles.disputeDate}>
                            <span className={styles.detailLabel}>Submitted:</span>
                            <span>{dispute.dateSubmitted}</span>
                          </div>
                        </div>
                        
                        <div className={styles.disputeReason}>
                          <span className={styles.detailLabel}>Reason:</span>
                          <p>{dispute.reason}</p>
                        </div>
                        
                        {dispute.resolution && (
                          <div className={styles.disputeResolution}>
                            <span className={styles.detailLabel}>Resolution:</span>
                            <p>{dispute.resolution}</p>
                            <span className={styles.resolutionDate}>
                              Resolved on {dispute.dateResolved}
                            </span>
                          </div>
                        )}
                        
                        {dispute.status === 'pending' && (
                          <div className={styles.disputeMessage}>
                            Your dispute is being processed. A neural verification may be required.
                          </div>
                        )}
                        
                        {dispute.status === 'reviewing' && (
                          <div className={styles.disputeMessage}>
                            Our agents are currently reviewing your case. We'll notify you of any updates.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
          
          <Card className={styles.infoCard}>
            <h2 className={styles.cardTitle}>Dispute Information</h2>
            
            <div className={styles.infoSection}>
              <h3 className={styles.infoTitle}>What can be disputed?</h3>
              <ul className={styles.infoList}>
                <li>Unauthorized transactions not made by you</li>
                <li>Duplicate charges for the same transaction</li>
                <li>Incorrect transaction amounts</li>
                <li>Failed transactions that were still charged</li>
                <li>Services or goods not received after payment</li>
              </ul>
            </div>
            
            <div className={styles.infoSection}>
              <h3 className={styles.infoTitle}>Dispute Process</h3>
              <ol className={styles.infoList}>
                <li>Submit your dispute with transaction details</li>
                <li>NyxBank verifies your neural signature</li>
                <li>Our agents review your case (1-3 business days)</li>
                <li>You may be required to provide additional evidence</li>
                <li>A resolution will be reached and funds returned if applicable</li>
              </ol>
            </div>
            
            <div className={`${styles.warningSection} glitch`}>
              <h3 className={styles.warningTitle}>Important Notice</h3>
              <p>
                Filing fraudulent disputes may result in account suspension and possible biometric collateral seizure.
              </p>
              <p>
                All dispute submissions are verified against your neural signature pattern to prevent identity theft.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Disputes;
