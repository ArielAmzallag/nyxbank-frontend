import React from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import styles from '../../styles/Dashboard.module.css';

const Dashboard: NextPage = () => {
  // Mock data for the dashboard
  const accountData = {
    username: 'JohnDoe',
    balances: {
      nyxcoin: 5284.75,
      obol: 127.34,
      dram: 842.19,
      sabme: 15.08
    },
    debtStatus: 'active',
    amountDue: 1500,
    dueDate: '2023-11-30'
  };

  const recentTransactions = [
    { id: 'tx1', type: 'transfer', amount: 250, currency: 'NYX', receiver: 'JaneSmith', date: '2023-10-15' },
    { id: 'tx2', type: 'crypto_trade', amount: 50, currency: 'OBL', receiver: 'CryptoExchange', date: '2023-10-14' },
    { id: 'tx3', type: 'loan_payment', amount: 500, currency: 'NYX', receiver: 'NyxBank', date: '2023-10-10' }
  ];

  return (
    <Layout>
      <div className="container">
        <h1 className={`${styles.title} neon-text`}>Welcome, {accountData.username}</h1>
        
        <div className={styles.userWarning}>
          {accountData.debtStatus === 'active' && (
            <div className={`${styles.debtWarning} glitch`}>
              DEBT WARNING: {accountData.amountDue} NYX due by {accountData.dueDate}
            </div>
          )}
        </div>
        
        <div className={styles.dashboard}>
          <div className={styles.leftPanel}>
            <Card variant="elevated" className={styles.balanceCard}>
              <h2 className={styles.sectionTitle}>Your Balances</h2>
              
              <div className={styles.balanceItem}>
                <span className={styles.currencyName}>NyxCoin</span>
                <span className={`${styles.balanceAmount} neon-text`}>{accountData.balances.nyxcoin.toFixed(2)} NYX</span>
              </div>
              
              <div className={styles.balanceItem}>
                <span className={styles.currencyName}>Obol</span>
                <span className={styles.balanceAmount}>{accountData.balances.obol.toFixed(2)} OBL</span>
              </div>
              
              <div className={styles.balanceItem}>
                <span className={styles.currencyName}>DraM</span>
                <span className={styles.balanceAmount}>{accountData.balances.dram.toFixed(2)} DRM</span>
              </div>
              
              <div className={styles.balanceItem}>
                <span className={styles.currencyName}>Sabme</span>
                <span className={styles.balanceAmount}>{accountData.balances.sabme.toFixed(2)} SBL</span>
              </div>
              
              <div className={styles.balanceActions}>
                <Button onClick={() => {}} variant="outline" size="small">Transfer</Button>
                <Button onClick={() => {}} variant="outline" size="small">Exchange</Button>
              </div>
            </Card>
            
            <Card className={styles.aiCard}>
              <h2 className={styles.sectionTitle}>R.E.M. Assistant</h2>
              <div className={styles.aiMessage}>
                <p>Hello, {accountData.username}. How may I assist your financial operations today?</p>
              </div>
              <Button onClick={() => {}} fullWidth>Consult R.E.M.</Button>
            </Card>
          </div>
          
          <div className={styles.rightPanel}>
            <Card className={styles.transactionsCard}>
              <h2 className={styles.sectionTitle}>Recent Transactions</h2>
              
              {recentTransactions.map(tx => (
                <div key={tx.id} className={styles.transactionItem}>
                  <div className={styles.transactionDetails}>
                    <span className={styles.transactionType}>{tx.type}</span>
                    <span className={styles.transactionReceiver}>To: {tx.receiver}</span>
                    <span className={styles.transactionDate}>{tx.date}</span>
                  </div>
                  <span className={styles.transactionAmount}>
                    {tx.amount.toFixed(2)} {tx.currency}
                  </span>
                </div>
              ))}
              
              <Button onClick={() => {}} variant="ghost" fullWidth className={styles.viewAllButton}>
                View All Transactions
              </Button>
            </Card>
            
            <Card variant="elevated" className={styles.debtCard}>
              <h2 className={styles.sectionTitle}>Debt Status</h2>
              
              <div className={styles.debtDetails}>
                <div className={styles.debtInfo}>
                  <span className={styles.debtLabel}>Status:</span>
                  <span className={`${styles.debtStatus} ${styles[accountData.debtStatus]}`}>
                    {accountData.debtStatus.toUpperCase()}
                  </span>
                </div>
                
                <div className={styles.debtInfo}>
                  <span className={styles.debtLabel}>Amount Due:</span>
                  <span className={styles.debtAmount}>{accountData.amountDue} NYX</span>
                </div>
                
                <div className={styles.debtInfo}>
                  <span className={styles.debtLabel}>Due Date:</span>
                  <span className={styles.debtDate}>{accountData.dueDate}</span>
                </div>
              </div>
              
              <div className={styles.collateralWarning}>
                * Failure to pay may result in biometric collateral seizure.
              </div>
              
              <Button onClick={() => {}} variant="destructive" fullWidth>
                Pay Debt
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
