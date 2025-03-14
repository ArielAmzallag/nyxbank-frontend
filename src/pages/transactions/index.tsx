import React, { useState } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import styles from '../../styles/Transactions.module.css';

const Transactions: NextPage = () => {
  // Mock transaction data
  const [transactions] = useState([
    { 
      id: 'tx1', 
      type: 'transfer', 
      amount: 250, 
      currency: 'NYX', 
      recipient: 'JaneSmith', 
      date: '2023-11-15', 
      status: 'completed' 
    },
    { 
      id: 'tx2', 
      type: 'crypto_trade', 
      amount: 50, 
      currency: 'OBL', 
      recipient: 'CryptoExchange', 
      date: '2023-11-14', 
      status: 'completed' 
    },
    { 
      id: 'tx3', 
      type: 'loan_payment', 
      amount: 500, 
      currency: 'NYX', 
      recipient: 'NyxBank', 
      date: '2023-11-10', 
      status: 'completed' 
    },
    { 
      id: 'tx4', 
      type: 'black_market', 
      amount: 1200, 
      currency: 'DRM', 
      recipient: 'REDACTED', 
      date: '2023-11-05', 
      status: 'redacted' 
    },
    { 
      id: 'tx5', 
      type: 'transfer', 
      amount: 75, 
      currency: 'SBL', 
      recipient: 'GhostUser', 
      date: '2023-11-01', 
      status: 'failed' 
    }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'completed': return styles.statusCompleted;
      case 'failed': return styles.statusFailed;
      case 'redacted': return styles.statusRedacted;
      default: return '';
    }
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

  return (
    <Layout>
      <div className="container">
        <h1 className={`${styles.title} neon-text`}>Transaction History</h1>
        
        <div className={styles.filters}>
          <Button 
            variant={filter === 'all' ? 'default' : 'ghost'} 
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'transfer' ? 'default' : 'ghost'} 
            onClick={() => setFilter('transfer')}
          >
            Transfers
          </Button>
          <Button 
            variant={filter === 'crypto_trade' ? 'default' : 'ghost'} 
            onClick={() => setFilter('crypto_trade')}
          >
            Crypto Trades
          </Button>
          <Button 
            variant={filter === 'loan_payment' ? 'default' : 'ghost'} 
            onClick={() => setFilter('loan_payment')}
          >
            Loan Payments
          </Button>
        </div>
        
        <Card className={styles.transactionsCard}>
          <div className={styles.transactionsList}>
            {filteredTransactions.length === 0 ? (
              <div className={styles.noTransactions}>
                No transactions found
              </div>
            ) : (
              filteredTransactions.map(tx => (
                <div key={tx.id} className={`${styles.transactionItem} ${tx.status === 'redacted' ? styles.redactedItem : ''}`}>
                  <div className={styles.transactionDetails}>
                    <div className={styles.transactionHeader}>
                      <span className={styles.transactionType}>{getTypeDisplay(tx.type)}</span>
                      <span className={`${styles.transactionStatus} ${getStatusClass(tx.status)}`}>
                        {tx.status.toUpperCase()}
                      </span>
                    </div>
                    <div className={styles.transactionInfo}>
                      <span className={styles.transactionRecipient}>To: {tx.recipient}</span>
                      <span className={styles.transactionDate}>{tx.date}</span>
                    </div>
                  </div>
                  <div className={styles.transactionAmount}>
                    <span className={tx.status === 'redacted' ? styles.redactedAmount : ''}>
                      {tx.amount.toFixed(2)} {tx.currency}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {filter === 'all' && transactions.some(tx => tx.status === 'redacted') && (
            <div className={`${styles.warningMessage} glitch`}>
              WARNING: Some transactions have been redacted by NyxBank security protocols.
            </div>
          )}
        </Card>
        
        <div className={styles.transactionActions}>
          <Button 
            onClick={() => {}} 
            variant="outline"
          >
            Export Records
          </Button>
          <Button 
            onClick={() => {}} 
            variant="destructive"
          >
            Dispute Transaction
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
