import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import styles from '../../styles/Exchange.module.css';

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  change: number; // 24h change percentage
}

interface ExchangeHistory {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

const Exchange: NextPage = () => {
  // Mock exchange rates
  const [rates] = useState<ExchangeRate[]>([
    { from: 'NYX', to: 'OBL', rate: 0.82, change: 3.5 },
    { from: 'NYX', to: 'DRM', rate: 0.15, change: -2.1 },
    { from: 'NYX', to: 'SBL', rate: 1.24, change: 0.8 },
    { from: 'OBL', to: 'NYX', rate: 1.22, change: -3.2 },
    { from: 'DRM', to: 'NYX', rate: 6.67, change: 1.9 },
    { from: 'SBL', to: 'NYX', rate: 0.81, change: -0.7 }
  ]);

  // Mock exchange history
  const [history, setHistory] = useState<ExchangeHistory[]>([
    {
      id: 'ex1',
      fromCurrency: 'NYX',
      toCurrency: 'OBL',
      fromAmount: 100,
      toAmount: 82,
      rate: 0.82,
      timestamp: '2023-11-20T14:30:00',
      status: 'completed'
    },
    {
      id: 'ex2',
      fromCurrency: 'DRM',
      toCurrency: 'NYX',
      fromAmount: 50,
      toAmount: 333.5,
      rate: 6.67,
      timestamp: '2023-11-18T09:15:00',
      status: 'completed'
    },
    {
      id: 'ex3',
      fromCurrency: 'NYX',
      toCurrency: 'SBL',
      fromAmount: 200,
      toAmount: 248,
      rate: 1.24,
      timestamp: '2023-11-15T16:45:00',
      status: 'failed'
    }
  ]);

  // Exchange form state
  const [form, setForm] = useState({
    fromCurrency: 'NYX',
    toCurrency: 'OBL',
    amount: '',
    estimatedReceive: '0.00'
  });

  // Mock user balances
  const balances = {
    NYX: 5284.75,
    OBL: 127.34,
    DRM: 842.19,
    SBL: 15.08
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Update estimated amount when form changes
  useEffect(() => {
    if (form.amount && !isNaN(parseFloat(form.amount))) {
      const rate = rates.find(r => 
        r.from === form.fromCurrency && r.to === form.toCurrency
      )?.rate ?? 0;
      
      const estimatedAmount = (parseFloat(form.amount) * rate).toFixed(2);
      setForm(prev => ({ ...prev, estimatedReceive: estimatedAmount }));
    } else {
      setForm(prev => ({ ...prev, estimatedReceive: '0.00' }));
    }
  }, [form.amount, form.fromCurrency, form.toCurrency, rates]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // If changing currency, reset amount
    if (name === 'fromCurrency' || name === 'toCurrency') {
      if (name === 'fromCurrency' && value === form.toCurrency) {
        // Auto-switch the to currency
        const newToCurrency = value === 'NYX' ? 'OBL' : 'NYX';
        setForm(prev => ({
          ...prev,
          toCurrency: newToCurrency
        }));
      } else if (name === 'toCurrency' && value === form.fromCurrency) {
        // Auto-switch the from currency
        const newFromCurrency = value === 'NYX' ? 'OBL' : 'NYX';
        setForm(prev => ({
          ...prev,
          fromCurrency: newFromCurrency
        }));
      }
    }
  };

  // Handle exchange submission
  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    const amountValue = parseFloat(form.amount);
    
    // Check if user has enough balance
    if (amountValue > balances[form.fromCurrency as keyof typeof balances]) {
      setError(`Insufficient ${form.fromCurrency} balance.`);
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      // Random chance of success (80%) or failure (20%)
      const isSuccessful = Math.random() > 0.2;
      
      if (isSuccessful) {
        // Create new exchange record
        const newExchange: ExchangeHistory = {
          id: `ex${Date.now()}`,
          fromCurrency: form.fromCurrency,
          toCurrency: form.toCurrency,
          fromAmount: amountValue,
          toAmount: parseFloat(form.estimatedReceive),
          rate: parseFloat(form.estimatedReceive) / amountValue,
          timestamp: new Date().toISOString(),
          status: 'completed'
        };

        // Add to history
        setHistory(prev => [newExchange, ...prev]);
        setSuccess(true);
      } else {
        setError('Exchange failed. Neural verification anomaly detected.');
      }

      setIsLoading(false);
    }, 1500);
  };

  // Reset form after successful exchange
  const resetForm = () => {
    setForm({
      fromCurrency: 'NYX',
      toCurrency: 'OBL',
      amount: '',
      estimatedReceive: '0.00'
    });
    setSuccess(false);
  };

  // Helper function to show change indicator
  const getChangeIndicator = (change: number) => {
    if (change > 0) return <span className={styles.positive}>+{change}%</span>;
    if (change < 0) return <span className={styles.negative}>{change}%</span>;
    return <span>{change}%</span>;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status class
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'completed': return styles.statusCompleted;
      case 'pending': return styles.statusPending;
      case 'failed': return styles.statusFailed;
      default: return '';
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1 className={`${styles.title} neon-text`}>Crypto Exchange</h1>
        
        <div className={styles.exchangeContainer}>
          <div className={styles.exchangeRates}>
            <Card className={styles.ratesCard}>
              <h2 className={styles.sectionTitle}>Market Rates</h2>
              <div className={styles.ratesGrid}>
                {rates.map((rate) => (
                  <div key={`${rate.from}-${rate.to}`} className={styles.rateItem}>
                    <div className={styles.ratePair}>
                      {rate.from} → {rate.to}
                    </div>
                    <div className={styles.rateValue}>
                      {rate.rate.toFixed(4)}
                    </div>
                    <div className={styles.rateChange}>
                      {getChangeIndicator(rate.change)}
                    </div>
                  </div>
                ))}              </div>
              <div className={styles.marketWarning}>
                <p>Market fluctuations may occur without warning. Rates refreshed every 60 seconds.</p>
              </div>
            </Card>
            
            <Card variant="elevated" className={styles.exchangeFormCard}>
              {success ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>✓</div>
                  <h2 className={styles.successTitle}>Exchange Complete</h2>
                  <p>
                    You've successfully exchanged {form.amount} {form.fromCurrency} for {form.estimatedReceive} {form.toCurrency}.
                  </p>
                  <Button onClick={resetForm} fullWidth>
                    New Exchange
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleExchange} className={styles.exchangeForm}>
                  <h2 className={styles.sectionTitle}>Exchange Crypto</h2>
                  
                  <div className={styles.formGroup}>

                    <label htmlFor="amount">From</label>
                    <div className={styles.currencyInputGroup}>
                      <Input
                        id="amount"
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                        fullWidth
                      />
                      <select 
                        id="fromCurrency"
                        name="fromCurrency" 
                        value={form.fromCurrency}
                        onChange={handleChange}
                        className={styles.currencySelect}
                      >
                        <option value="NYX">NYX</option>
                        <option value="OBL">OBL</option>
                        <option value="DRM">DRM</option>
                        <option value="SBL">SBL</option>
                      </select>
                    </div>
                    <div className={styles.balanceInfo}>
                      Available: {balances[form.fromCurrency as keyof typeof balances]} {form.fromCurrency}
                    </div>
                  </div>
                  
                  <div className={styles.exchangeArrow}>
                    ↓
                  </div>
                  
                  <div className={styles.formGroup}>

                    <label htmlFor="estimatedReceive">To</label>
                    <div className={styles.currencyInputGroup}>
                      <Input
                        id="estimatedReceive"
                        type="text"
                        value={form.estimatedReceive}
                        readOnly
                        disabled
                        fullWidth
                      />
                      <select 
                        id="toCurrency"
                        name="toCurrency" 
                        value={form.toCurrency}
                        onChange={handleChange}
                        className={styles.currencySelect}
                      >
                        <option value="NYX">NYX</option>
                        <option value="OBL">OBL</option>
                        <option value="DRM">DRM</option>
                        <option value="SBL">SBL</option>
                      </select>
                    </div>
                    <div className={styles.rateInfo}>
                      Rate: 1 {form.fromCurrency} = {
                        rates.find(r => r.from === form.fromCurrency && r.to === form.toCurrency)?.rate.toFixed(4) ?? '0.0000'
                      } {form.toCurrency}
                    </div>
                  </div>
                  
                  {error && (
                    <div className={`${styles.errorMessage} glitch`}>
                      {error}
                    </div>
                  )}
                  
                  <div className={styles.exchangeDisclaimer}>
                    <p>By proceeding, you agree to the market rate at the time of execution. Neural signature verification required.</p>
                  </div>
                  
                  <Button 
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Exchange Now'}
                  </Button>
                </form>
              )}
            </Card>
          </div>
          
          <Card className={styles.historyCard}>
            <h2 className={styles.sectionTitle}>Exchange History</h2>
            
            {history.length === 0 ? (
              <div className={styles.noHistory}>
                No exchange history found.
              </div>
            ) : (
              <div className={styles.historyList}>
                {history.map(item => (
                  <div key={item.id} className={styles.historyItem}>
                    <div className={styles.historyDetails}>
                      <div className={styles.historyHeader}>
                        <span className={styles.historyPair}>
                          {item.fromCurrency} → {item.toCurrency}
                        </span>
                        <span className={`${styles.historyStatus} ${getStatusClass(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <div className={styles.historyValues}>
                        <span>{item.fromAmount} {item.fromCurrency}</span>
                        <span className={styles.historyArrow}>→</span>
                        <span>{item.toAmount} {item.toCurrency}</span>
                      </div>
                      <div className={styles.historyMeta}>
                        <span>Rate: {item.rate.toFixed(4)}</span>
                        <span className={styles.historyDate}>{formatDate(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className={styles.historyActions}>
              <Button variant="ghost" onClick={() => {}} fullWidth>
                View All History
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );

};
export default Exchange;