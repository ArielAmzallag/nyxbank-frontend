import React, { useState } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from '../../styles/SendMoney.module.css';

const SendMoney: NextPage = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    currency: 'NYX',
    note: '',
    biometricVerification: false
  });
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Mock account balances
  const balances = {
    NYX: 5284.75,
    OBL: 127.34,
    DRM: 842.19,
    SBL: 15.08
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate amount
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount.');
        return;
      }
      
      // Check if user has enough balance
      if (amount > balances[formData.currency as keyof typeof balances]) {
        setError(`Insufficient ${formData.currency} balance.`);
        return;
      }
      
      setStep(2);
      setError('');
      return;
    }
    
    if (step === 2) {
      // Verify biometric data
      if (!formData.biometricVerification) {
        setError('Biometric verification is required for all transfers.');
        return;
      }
      
      setLoading(true);
      setError('');
      
      // Simulate API call
      setTimeout(() => {
        // Random chance for success or failure
        const isSuccessful = Math.random() > 0.3;
        
        if (isSuccessful) {
          setSuccess(true);
          console.log('Transaction successful:', formData);
        } else {
          setError('NEURAL VERIFICATION FAILED: Transfer rejected by R.E.M. security protocols.');
        }
        
        setLoading(false);
      }, 2000);
    }
  };
  
  const resetForm = () => {
    setFormData({
      recipient: '',
      amount: '',
      currency: 'NYX',
      note: '',
      biometricVerification: false
    });
    setStep(1);
    setSuccess(false);
    setError('');
  };

  return (
    <Layout>
      <div className="container">
        <h1 className={`${styles.title} neon-text`}>Send Money</h1>
        
        <Card variant="elevated" className={styles.sendMoneyCard}>
          {success ? (
            <div className={styles.successContainer}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.successTitle}>Transfer Complete</h2>
              <p className={styles.successMessage}>
                You have successfully sent {formData.amount} {formData.currency} to {formData.recipient}.
              </p>
              <p className={styles.transactionId}>
                Transaction ID: {Math.random().toString(36).substring(2, 15)}
              </p>
              <Button onClick={resetForm} fullWidth>
                Send Another Transfer
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {step === 1 ? (
                <>
                  <h2 className={styles.formTitle}>Transfer Details</h2>
                  
                  <Input
                    label="Recipient Username"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="Enter recipient's username"
                    required
                    fullWidth
                  />
                  
                  <div className={styles.amountGroup}>
                    <Input
                      label="Amount"
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                      fullWidth
                    />
                    
                    <div className={styles.currencySelect}>
                      <label htmlFor="currency">Currency</label>
                      <select 
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="NYX">NyxCoin (NYX)</option>
                        <option value="OBL">Obol (OBL)</option>
                        <option value="DRM">DraM (DRM)</option>
                        <option value="SBL">Sabme (SBL)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.balanceInfo}>
                    Available balance: {balances[formData.currency as keyof typeof balances]} {formData.currency}
                  </div>
                  
                  <div className={styles.noteField}>
                    <label htmlFor="note">Note (Optional)</label>
                    <textarea
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Add a message to recipient"
                      className={styles.textarea}
                    />
                  </div>
                </>
              ) : (
                <>
                  <h2 className={styles.formTitle}>Confirm Transfer</h2>
                  
                  <div className={styles.confirmationDetails}>
                    <div className={styles.confirmRow}>
                      <span className={styles.confirmLabel}>Recipient:</span>
                      <span className={styles.confirmValue}>{formData.recipient}</span>
                    </div>
                    <div className={styles.confirmRow}>
                      <span className={styles.confirmLabel}>Amount:</span>
                      <span className={styles.confirmValue}>{formData.amount} {formData.currency}</span>
                    </div>
                    {formData.note && (
                      <div className={styles.confirmRow}>
                        <span className={styles.confirmLabel}>Note:</span>
                        <span className={styles.confirmValue}>{formData.note}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.biometricVerification}>
                    <label htmlFor="biometricVerification" className={styles.verificationLabel}>
                      <Input
                        id="biometricVerification"
                        type="checkbox"
                        name="biometricVerification"
                        checked={formData.biometricVerification}
                        onChange={handleChange}
                        required
                      />
                      I authorize NyxBank to scan my neural signature to verify this transaction.
                    </label>
                  </div>
                  
                  <div className={styles.warning}>
                    WARNING: Fraudulent transfers may result in biometric collateral seizure.
                  </div>
                </>
              )}
              
              {error && (
                <div className={`${styles.errorBox} glitch`}>
                  {error}
                </div>
              )}
              
              <div className={styles.formActions}>
                {step === 2 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                )}
                <Button 
                  type="submit" 
                  fullWidth={step === 1}
                  disabled={loading}
                >
                  {step === 1 ? 'Continue' : loading ? 'Processing...' : 'Confirm Transfer'}
                </Button>
              </div>
            </form>
          )}
          
          <div className={styles.securityNote}>
            <p>All transfers are monitored by R.E.M. security protocols.</p>
            <p>Encrypted with NeuralHash™ technology to protect your financial data.</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
export default SendMoney;

