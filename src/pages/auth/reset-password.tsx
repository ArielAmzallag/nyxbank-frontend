import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from '../../styles/Login.module.css';

const ResetPassword: NextPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Step 1: Email verification
    if (step === 1) {
      // Simulating API call to check if email exists
      setTimeout(() => {
        if (Math.random() > 0.8) {
          setError('ERROR: NEURAL SIGNATURE NOT FOUND');
        } else {
          setStep(2);
        }
        setLoading(false);
      }, 1500);
      return;
    }
    
    // Step 2: Verification code
    if (step === 2) {
      if (formData.verificationCode.length !== 6) {
        setError('VERIFICATION CODE MUST BE 6 DIGITS');
        setLoading(false);
        return;
      }
      
      // Simulating API call to verify the code
      setTimeout(() => {
        if (Math.random() > 0.8) {
          setError('ERROR: INVALID VERIFICATION CODE');
        } else {
          setStep(3);
        }
        setLoading(false);
      }, 1500);
      return;
    }
    
    // Step 3: New password
    if (step === 3) {
      // Password validation
      if (formData.newPassword.length < 8) {
        setError('PASSWORD MUST BE AT LEAST 8 CHARACTERS');
        setLoading(false);
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setError('ERROR: PASSWORD MISMATCH DETECTED');
        setLoading(false);
        return;
      }
      
      // Simulating API call to update password
      setTimeout(() => {
        if (Math.random() > 0.9) {
          setError('ERROR: NEURAL VERIFICATION FAILED');
        } else {
          setSuccess(true);
        }
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className={styles.loginContainer}>
          <Card variant="elevated" className={styles.loginCard}>
            <h1 className={`${styles.title} neon-text`}>Reset Password</h1>
            <p className={styles.subtitle}>
              {step === 1 && 'Enter your email to receive a verification code'}
              {step === 2 && 'Enter the verification code sent to your neural interface'}
              {step === 3 && 'Create a new password for your account'}
              {success && 'Your password has been reset successfully'}
            </p>
            
            {error && (
              <div className={`${styles.errorBox} glitch`}>
                {error}
              </div>
            )}
            
            {!success ? (
              <form onSubmit={handleSubmit} className={styles.form}>
                {step === 1 && (
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your registered email"
                    required
                    fullWidth
                  />
                )}
                
                {step === 2 && (
                  <>
                    <div className={styles.verificationMessage}>
                      A verification code has been sent to {formData.email}
                    </div>
                    <Input
                      label="Verification Code"
                      name="verificationCode"
                      value={formData.verificationCode}
                      onChange={handleChange}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      required
                      fullWidth
                    />
                  </>
                )}
                
                {step === 3 && (
                  <>
                    <Input
                      label="New Password"
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Create a new password"
                      required
                      fullWidth
                    />
                    
                    <Input
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your new password"
                      required
                      fullWidth
                    />
                  </>
                )}
                
                <Button 
                  type="submit" 
                  fullWidth 
                  disabled={loading}
                  className={styles.loginButton}
                >
                  {loading ? 'Processing...' : 
                    step === 1 ? 'Send Verification Code' : 
                    step === 2 ? 'Verify Code' : 
                    'Reset Password'}
                </Button>
                
                <div className={styles.register}>
                  <span>Remember your password? </span>
                  <Link href="/auth/login" className={styles.registerLink}>
                    Sign In
                  </Link>
                </div>
              </form>
            ) : (
              <div className={styles.successContainer}>
                <div className={styles.successIcon}>✓</div>
                <p className={styles.successMessage}>
                  Your password has been successfully reset.
                </p>
                <Link href="/auth/login">
                    <Button fullWidth>
                      Return to Login
                    </Button>
                </Link>
              </div>
            )}
            
            <div className={styles.disclaimer}>
              <p>* Password reset requires biometric verification to ensure account security.</p>
              <p className={styles.hiddenText}>* Memory residue analysis may be performed during reset procedure.</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
