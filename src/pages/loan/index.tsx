import React, { useState } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import styles from '../../styles/Loan.module.css';

interface LoanData {
  id: string;
  amount: number;
  amountDue: number;
  currency: string;
  interestRate: number;
  startDate: string;
  dueDate: string;
  status: 'active' | 'overdue' | 'paid' | 'defaulted';
  collateralStatus: 'none' | 'required' | 'collected';
  collateralType?: 'biometric' | 'memory' | 'organ';
  paymentHistory: PaymentRecord[];
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'failed' | 'pending';
}

const Loan: NextPage = () => {
  // Mock loan data
  const [loanData, setLoanData] = useState<LoanData>({
    id: 'LN-7834-NYX',
    amount: 5000,
    amountDue: 2800,
    currency: 'NYX',
    interestRate: 12.5,
    startDate: '2023-08-15',
    dueDate: '2023-12-15',
    status: 'active',
    collateralStatus: 'required',
    collateralType: 'biometric',
    paymentHistory: [
      {
        id: 'pmt1',
        date: '2023-09-15',
        amount: 1200,
        status: 'completed'
      },
      {
        id: 'pmt2',
        date: '2023-10-15',
        amount: 1000,
        status: 'completed'
      },
      {
        id: 'pmt3',
        date: '2023-11-15',
        amount: 0,
        status: 'failed'
      }
    ]
  });

  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [showCollateralInfo, setShowCollateralInfo] = useState<boolean>(false);
  
  // Calculate remaining time until due date
  const calculateRemainingDays = () => {
    const dueDate = new Date(loanData.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const remainingDays = calculateRemainingDays();
  
  // Handle payment submission
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setPaymentError('Please enter a valid amount');
      return;
    }
    
    if (amount > 5000) { // Mock maximum for demo purposes
      setPaymentError('Amount exceeds your available balance');
      return;
    }
    
    setPaymentLoading(true);
    setPaymentError('');
    
    // Simulate API call
    setTimeout(() => {
      // Update loan data with new payment
      const newPayment = {
        id: `pmt${loanData.paymentHistory.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        amount,
        status: 'completed' as const
      };
      
      // Calculate new amount due
      const newAmountDue = Math.max(0, loanData.amountDue - amount);
      
      // Update loan status if paid off
      let newStatus = loanData.status;
      if (newAmountDue === 0) {
        newStatus = 'paid' as const;
      }
      
      setLoanData(prev => ({
        ...prev,
        amountDue: newAmountDue,
        status: newStatus,
        paymentHistory: [newPayment, ...prev.paymentHistory]
      }));
      
      setPaymentSuccess(true);
      setPaymentLoading(false);
      setPaymentAmount('');
      
      // Reset success message after a few seconds
      setTimeout(() => setPaymentSuccess(false), 5000);
    }, 2000);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ${loanData.currency}`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status class for styling
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'active': return styles.statusActive;
      case 'overdue': return styles.statusOverdue;
      case 'paid': return styles.statusPaid;
      case 'defaulted': return styles.statusDefaulted;
      case 'completed': return styles.statusCompleted;
      case 'failed': return styles.statusFailed;
      case 'pending': return styles.statusPending;
      default: return '';
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1 className={`${styles.title} neon-text`}>Loan Management</h1>
        
        <div className={styles.loanContainer}>
          <div className={styles.loanOverview}>
            <Card variant="elevated" className={styles.loanSummaryCard}>
              <h2 className={styles.cardTitle}>Loan Summary</h2>
              
              <div className={styles.loanStatus}>
                <div className={styles.loanId}>Loan ID: {loanData.id}</div>
                <div className={`${styles.statusBadge} ${getStatusClass(loanData.status)}`}>
                  {loanData.status.toUpperCase()}
                </div>
              </div>
              
              <div className={styles.balanceContainer}>
                <div className={styles.amountDue}>
                  <span className={styles.amountLabel}>Amount Due</span>
                  <span className={styles.amountValue}>{formatCurrency(loanData.amountDue)}</span>
                </div>
                
                <div className={styles.amountDetails}>
                  <div className={styles.amountRow}>
                    <span>Original Amount:</span>
                    <span>{formatCurrency(loanData.amount)}</span>
                  </div>
                  
                  <div className={styles.amountRow}>
                    <span>Interest Rate:</span>
                    <span>{loanData.interestRate}%</span>
                  </div>
                  
                  <div className={styles.amountRow}>
                    <span>Start Date:</span>
                    <span>{formatDate(loanData.startDate)}</span>
                  </div>
                  
                  <div className={styles.amountRow}>
                    <span>Due Date:</span>
                    <span className={remainingDays < 7 ? styles.urgentDate : ''}>
                      {formatDate(loanData.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
              
              {loanData.status === 'overdue' && (
                <div className={`${styles.overdueWarning} glitch`}>
                  WARNING: PAYMENT OVERDUE - BIOMETRIC COLLATERAL COLLECTION IMMINENT
                </div>
              )}
              
              {loanData.status === 'active' && remainingDays < 7 && (
                <div className={styles.dueWarning}>
                  Your payment is due in {remainingDays} day{remainingDays !== 1 ? 's' : ''}. Please make your payment to avoid collateral collection.
                </div>
              )}
              
              <div className={styles.collateralStatus}>
                <div className={styles.collateralHeader}>
                  <span>Collateral Status:</span>
                  <span 
                    className={`${styles.collateralValue} ${
                      loanData.collateralStatus === 'collected' ? styles.collateralCollected : ''
                    }`}
                  >
                    {loanData.collateralStatus.toUpperCase()}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setShowCollateralInfo(!showCollateralInfo)}
                >
                  {showCollateralInfo ? 'Hide Details' : 'View Details'}
                </Button>
                
                {showCollateralInfo && (
                  <div className={styles.collateralDetails}>
                    <p>Collateral Type: <span className={styles.collateralType}>{loanData.collateralType?.toUpperCase()}</span></p>
                    <p>As per your loan agreement, failure to repay by the due date will result in automatic collection of your specified biometric collateral.</p>
                    <p className={styles.collateralWarning}>
                      In case of default, NyxBank reserves the right to extract and retain the neural patterns, memories, or organic material specified in your agreement.
                    </p>
                  </div>
                )}
              </div>
            </Card>
            
            {loanData.status !== 'paid' && (
              <Card className={styles.paymentCard}>
                <h2 className={styles.cardTitle}>Make a Payment</h2>
                
                <form onSubmit={handlePayment} className={styles.paymentForm}>
                  <div className={styles.paymentAmount}>
                    <Input
                      label="Payment Amount"
                      type="number"
                      name="amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0.00"
                      fullWidth
                    />
                    <div className={styles.currencyTag}>{loanData.currency}</div>
                  </div>
                  
                  {paymentError && (
                    <div className={`${styles.paymentError} glitch`}>
                      {paymentError}
                    </div>
                  )}
                  
                  {paymentSuccess && (
                    <div className={styles.paymentSuccess}>
                      Payment successful! Your loan has been updated.
                    </div>
                  )}
                  
                  <div className={styles.paymentActions}>
                    <Button
                      type="submit"
                      disabled={paymentLoading}
                      fullWidth
                    >
                      {paymentLoading ? 'Processing...' : 'Submit Payment'}
                    </Button>
                  </div>
                  
                  <div className={styles.paymentDisclaimer}>
                    * By making a payment, you authorize NyxBank to scan your neural signature for verification.
                  </div>
                </form>
              </Card>
            )}
          </div>
          
          <Card className={styles.paymentHistoryCard}>
            <h2 className={styles.cardTitle}>Payment History</h2>
            
            <div className={styles.paymentList}>
              {loanData.paymentHistory.length === 0 ? (
                <div className={styles.noPayments}>
                  No payment history available.
                </div>
              ) : (
                <>
                  <div className={styles.paymentHeader}>
                    <span className={styles.paymentDate}>Date</span>
                    <span className={styles.paymentAmount}>Amount</span>
                    <span className={styles.paymentStatus}>Status</span>
                  </div>
                  
                  {loanData.paymentHistory.map(payment => (
                    <div key={payment.id} className={styles.paymentItem}>
                      <span className={styles.paymentDate}>{formatDate(payment.date)}</span>
                      <span className={styles.paymentAmount}>{formatCurrency(payment.amount)}</span>
                      <span className={`${styles.paymentStatus} ${getStatusClass(payment.status)}`}>
                        {payment.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </Card>
        </div>
        
        {loanData.status === 'defaulted' && (
          <Card variant="elevated" className={`${styles.collateralCard} glitch`}>
            <div className={styles.collateralHeader}>
              <h2 className={styles.cardTitle}>Collateral Enforcement Active</h2>
            </div>
            
            <div className={styles.collateralContent}>
              <div className={styles.collateralIcon}>⚠️</div>
              <div className={styles.collateralMessage}>
                <p>Your loan has been defaulted. Biometric collateral collection has been initiated.</p>
                <p>Please report to your nearest NyxBank branch for collateral extraction.</p>
                <p className={styles.enforcementWarning}>
                  FAILURE TO COMPLY WILL RESULT IN REMOTE NEURAL EXTRACTION
                </p>
              </div>
            </div>
            
            <Button
              variant="destructive"
              fullWidth
            >
              Acknowledge Enforcement
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Loan;
