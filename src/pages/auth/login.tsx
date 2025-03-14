import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from '../../styles/Login.module.css';

const Login: NextPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    
    // Simulating API call
    setTimeout(() => {
      // If we had an API, we'd send the credentials here
      console.log('Login attempt with:', formData);
      
      // Random chance for a simulated error
      if (Math.random() > 0.7) {
        setError('ERROR: UNAUTHENTICATED BIOMETRIC SIGNATURE');
      }
      
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container">
        <div className={styles.loginContainer}>
          <Card variant="elevated" className={styles.loginCard}>
            <h1 className={`${styles.title} neon-text`}>Access NyxBank</h1>
            <p className={styles.subtitle}>Enter your credentials to access your account</p>
            
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
                placeholder="Enter your username"
                required
                fullWidth
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                fullWidth
              />
              
              <div className={styles.forgotPassword}>
                <Link href="/auth/reset-password" className={styles.forgotLink}>
                  Forgot Password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                fullWidth 
                disabled={loading}
                className={styles.loginButton}
              >
                {loading ? 'Authenticating...' : 'Login'}
              </Button>
              
              <div className={styles.register}>
                <span>Don't have an account? </span>
                <Link href="/auth/register" className={styles.registerLink}>
                  Register
                </Link>
              </div>
            </form>
            
            <div className={styles.disclaimer}>
              <p>* By logging in, you authorize NyxBank to collect biometric data as collateral for potential debt enforcement.</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;