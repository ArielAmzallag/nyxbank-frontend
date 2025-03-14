import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import styles from '../../styles/TransactionDetail.module.css';

interface TransactionData {
  id: string;
  type: string;
  amount: number;
  currency: string;
  sender: string;
  recipient: string;
  date: string;
  status: string;
  description?: string;
  fee?: number;
  blockchainHash?: string;
  notes?: string;
  isDisputed?: boolean;
  disputeReason?: string;
  redactionLevel?: number;
}

const getTransactionById = (id: string): TransactionData | null => {
  // Mock database of transactions
  const transactions: TransactionData[] = [
    { 
      id: 'tx1', 
      type: 'transfer', 
      amount: 250, 
      currency: 'NYX', 
      sender: 'JohnDoe',
      recipient: 'JaneSmith', 
      date: '2023-11-15T14:30:00', 
      status: 'completed',
      description: 'Payment for services',
      fee: 0.5,
      blockchainHash: '0x8a7d56a7eb4b3c7f3c9d72f5a2f2a2d9e5a8a7d5',
      notes: 'Client payment for project'
    },
    { 
      id: 'tx2', 
      type: 'crypto_trade', 
      amount: 50, 
      currency: 'OBL', 
      sender: 'JohnDoe',
      recipient: 'CryptoExchange', 
      date: '2023-11-14T09:45:00', 
      status: 'completed',
      description: 'Exchange NYX to OBL',
      fee: 0.25,
      blockchainHash: '0x7b8a9c5d6e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b',
      notes: 'Rate: 1 NYX = 0.82 OBL'
    },
    { 
      id: 'tx3', 
      type: 'loan_payment', 
      amount: 500, 
      currency: 'NYX', 
      sender: 'JohnDoe',
      recipient: 'NyxBank', 
      date: '2023-11-10T11:20:00', 
      status: 'completed',
      description: 'Monthly loan payment',
      fee: 0,
      blockchainHash: '0x6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d',
      notes: 'Loan ID: NL-7834'
    },
    { 
      id: 'tx4', 
      type: 'black_market', 
      amount: 1200, 
      currency: 'DRM', 
      sender: 'JohnDoe',
      recipient: 'REDACTED', 
      date: '2023-11-05T23:15:00', 
      status: 'redacted',
      redactionLevel: 3,
      blockchainHash: '[DATA EXPUNGED]'
    },
    { 
      id: 'tx5', 
      type: 'transfer', 
      amount: 75, 
      currency: 'SBL', 
      sender: 'JohnDoe',
      recipient: 'GhostUser', 
      date: '2023-11-01T16:40:00', 
      status: 'failed',
      description: 'Payment attempt',
      fee: 0.15,
      blockchainHash: '0x3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e',
      notes: 'Failed due to neural verification error',
      isDisputed: true,
      disputeReason: 'Transaction failed but fee was charged'
    }
  ];

  // Find the transaction by ID
  return transactions.find(tx => tx.id === id) || null;
};

const TransactionDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDispute, setShowDispute] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      // Simulate API call delay
      setTimeout(() => {
        const txData = getTransactionById(id as string);
        if (txData) {
          setTransaction(txData);
        } else {
          setError('Transaction not found');
        }
        setLoading(false);
      }, 800);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTypeDisplay = (type: string) => {
    switch(type) {
      case 'transfer': return 'Transfer';
      case 'crypto_trade': return 'Crypto Trade';
      case 'loan_payment': return 'Loan Payment';
      case 'black_market': return 'REDACTED';
      default: return type;
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'completed': return styles.statusCompleted;
      case 'pending': return styles.statusPending;
      case 'failed': return styles.statusFailed;
      case 'redacted': return styles.statusRedacted;
      default: return '';
    }
  };

  const toggleDisputeForm = () => {
    setShowDispute(!showDispute);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!disputeReason.trim()) {
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setDisputeSubmitted(true);
      setShowDispute(false);
    }, 1000);
  };

  const handleDisputeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDisputeReason(e.target.value);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className={styles.loadingState}>
            <div className={styles.loadingIndicator}></div>
            <p>Loading transaction details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !transaction) {
    return (
      <Layout>
        <div className="container">
          <Card className={styles.errorCard}>
            <h1 className={styles.errorTitle}>Transaction Not Found</h1>
            <p className={styles.errorMessage}>
              {error || 'The requested transaction could not be found.'}
            </p>
            <Link href="/transactions">
              <Button>Return to Transactions</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className={styles.transactionHeader}>
          <h1 className={`${styles.title} neon-text`}>Transaction Details</h1>
          <Link href="/transactions">
            <Button variant="ghost">Back to Transactions</Button>
          </Link>
        </div>
        
        <div className={styles.transactionContainer}>
          <Card className={`${styles.transactionCard} ${transaction.status === 'redacted' ? styles.redactedCard : ''}`}>
            <div className={styles.transactionStatus}>
              <div className={styles.statusHeader}>
                <span className={styles.statusLabel}>Status:</span>
                <span className={`${styles.statusValue} ${getStatusClass(transaction.status)}`}>
                  {transaction.status.toUpperCase()}
                </span>
              </div>
              
              {transaction.status === 'redacted' && (
                <div className={`${styles.redactionNotice} glitch`}>
                  NOTICE: This transaction has been redacted by NyxBank security protocols (Level {transaction.redactionLevel}).
                </div>
              )}
            </div>
            
            <div className={styles.transactionDetails}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Transaction ID:</span>
                  <span className={styles.detailValue}>{transaction.id}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Type:</span>
                  <span className={styles.detailValue}>{getTypeDisplay(transaction.type)}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date & Time:</span>
                  <span className={styles.detailValue}>{formatDate(transaction.date)}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Amount:</span>
                  <span className={styles.detailValue}>
                    <span className={styles.amount}>{transaction.amount.toFixed(2)}</span>
                    <span className={styles.currency}>{transaction.currency}</span>
                  </span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>From:</span>
                  <span className={styles.detailValue}>{transaction.sender}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>To:</span>
                  <span className={styles.detailValue}>{transaction.recipient}</span>
                </div>
                
                {transaction.fee !== undefined && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Fee:</span>
                    <span className={styles.detailValue}>{transaction.fee.toFixed(2)} {transaction.currency}</span>
                  </div>
                )}
                
                {transaction.description && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Description:</span>
                    <span className={styles.detailValue}>{transaction.description}</span>
                  </div>
                )}
                
                {transaction.blockchainHash && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Blockchain Hash:</span>
                    <span className={`${styles.detailValue} ${styles.hash}`}>{transaction.blockchainHash}</span>
                  </div>
                )}
              </div>
              
              {transaction.notes && (
                <div className={styles.notesSection}>
                  <h3 className={styles.sectionTitle}>Transaction Notes</h3>
                  <p className={styles.notes}>{transaction.notes}</p>
                </div>
              )}
              
              {transaction.isDisputed && (
                <div className={styles.disputeSection}>
                  <h3 className={styles.sectionTitle}>Dispute Information</h3>
                  <div className={styles.disputeDetails}>
                    <div className={styles.disputeBadge}>DISPUTED</div>
                    <p className={styles.disputeReason}>{transaction.disputeReason}</p>
                    <p className={styles.disputeStatus}>Status: Under Review</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.transactionActions}>
              {!transaction.isDisputed && transaction.status !== 'redacted' && (
                <>
                  {showDispute ? (
                    <div className={styles.disputeForm}>
                      <h3 className={styles.formTitle}>Submit Dispute</h3>
                      <form onSubmit={handleDisputeSubmit}>
                        <textarea
                          className={styles.disputeTextarea}
                          placeholder="Describe the issue with this transaction..."
                          value={disputeReason}
                          onChange={handleDisputeChange}
                          required
                        />
                        
                        <div className={styles.disputeButtons}>
                          <Button type="button" variant="ghost" onClick={toggleDisputeForm}>
                            Cancel
                          </Button>
                          <Button type="submit" variant="destructive">
                            Submit Dispute
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <>
                      {disputeSubmitted ? (
                        <div className={styles.disputeSuccess}>
                          <p className={styles.successMessage}>
                            Your dispute has been submitted successfully. We will review it shortly.
                          </p>
                        </div>
                      ) : (
                        <Button variant="destructive" onClick={toggleDisputeForm}>
                          Dispute This Transaction
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
              
              <Button variant="outline" onClick={() => window.print()}>
                Print Receipt
              </Button>
            </div>
          </Card>
          
          {transaction.status === 'completed' && (
            <Card className={styles.verificationCard}>
              <h3 className={styles.verificationTitle}>Verification</h3>
              <div className={styles.verificationDetails}>
                <p>This transaction has been verified by the NyxBank financial system.</p>
                <div className={styles.verificationBadge}>
                  <span className={styles.verificationIcon}>✓</span>
                  <span>VERIFIED</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TransactionDetail;
