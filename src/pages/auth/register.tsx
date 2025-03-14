import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from '../../styles/Login.module.css';

const Register: NextPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    biometricConsent: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('ERROR: PASSWORD MISMATCH DETECTED');
      setLoading(false);
      return;
    }
    
    if (!formData.biometricConsent) {
      setError('ERROR: BIOMETRIC COLLATERAL CONSENT REQUIRED');
      setLoading(false);
      return;
    }
    
    // Simulating API call
    setTimeout(() => {
      console.log('Registration attempt with:', formData);
      
      // Random chance for a simulated error
      if (Math.random() > 0.7) {
        setError('ERROR: NEURAL SIGNATURE ALREADY EXISTS IN DATABASE');
      } else {
        // Successful registration would redirect to login
        console.log('Registration successful');
        // In a real app, we would redirect to login or dashboard
      }
      
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container">
        <div className={styles.loginContainer}>
          <Card variant="elevated" className={styles.loginCard}>
            <h1 className={`${styles.title} neon-text`}>Create NyxBank Account</h1>
            <p className={styles.subtitle}>Enter your details to join the network</p>
            
            {error && (
              <div className={`${styles.errorBox} glitch`}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                fullWidth
              />
              
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                fullWidth
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                fullWidth
              />
              
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                fullWidth
              />
              
              <div className={styles.consentCheck}>
                <Input
                  type="checkbox"
                  name="biometricConsent"
                  id="biometricConsent"
                  checked={formData.biometricConsent}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="biometricConsent" className={styles.consentLabel}>
                  I consent to provide biometric data as collateral for future transactions and potential debt enforcement.
                </label>
              </div>
              
              <Button 
                type="submit" 
                fullWidth 
                disabled={loading}
                className={styles.loginButton}
              >
                {loading ? 'Processing...' : 'Create Account'}
              </Button>
              
              <div className={styles.register}>
                <span>Already have an account? </span>
                <Link href="/auth/login" className={styles.registerLink}>
                  Sign In
                </Link>
              </div>
            </form>
            
            <div className={styles.disclaimer}>
              <p>* By registering, you authorize NyxBank to scan, store, and potentially seize your biometric data in accordance with our Collateral Terms.</p>
              <p className={styles.hiddenText}>* Memory extraction may occur without notice during severe default scenarios.</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
export default Register;
