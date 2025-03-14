import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import styles from '../styles/SystemError.module.css';

const SystemError: NextPage = () => {
  const [errorCode, setErrorCode] = useState('0x000000');
  const [glitchText, setGlitchText] = useState(false);
  const [showHiddenMessage, setShowHiddenMessage] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Generate random error code on load
  useEffect(() => {
    const code = '0x' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
    setErrorCode(code);
    
    // Start glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchText(prev => !prev);
    }, 3000);
    
    // Show hidden message after delay
    const messageTimeout = setTimeout(() => {
      setShowHiddenMessage(true);
    }, 5000);
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(glitchInterval);
      clearTimeout(messageTimeout);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <Layout>
      <div className="container">
        <div className={styles.errorContainer}>
          <div className={styles.errorHeader}>
            <h1 className={`${styles.errorTitle} ${glitchText ? 'glitch' : ''}`}>SYSTEM ERROR</h1>
            <div className={styles.errorCode}>{errorCode}</div>
          </div>
          
          <div className={`${styles.errorTerminal} glass`}>
            <div className={styles.terminalHeader}>
              <span className={styles.terminalTitle}>NyxBank System Terminal</span>
              <span className={styles.terminalStatus}>CRITICAL FAILURE</span>
            </div>
            
            <div className={styles.terminalContent}>
              <div className={styles.terminalLine}>
                <span className={styles.timestamp}>[{new Date().toISOString()}]</span>
                <span className={`${styles.errorLevel} ${styles.errorLevelCritical}`}>CRITICAL:</span>
                <span>Neural signature database corruption detected</span>
              </div>
              
              <div className={styles.terminalLine}>
                <span className={styles.timestamp}>[{new Date().toISOString()}]</span>
                <span className={`${styles.errorLevel} ${styles.errorLevelError}`}>ERROR:</span>
                <span>Memory extraction protocol failure at sector 0x7A3F</span>
              </div>
              
              <div className={styles.terminalLine}>
                <span className={styles.timestamp}>[{new Date().toISOString()}]</span>
                <span className={`${styles.errorLevel} ${styles.errorLevelWarning}`}>WARNING:</span>
                <span>Biometric collateral records compromised</span>
              </div>
              
              <div className={styles.terminalLine}>
                <span className={styles.timestamp}>[{new Date().toISOString()}]</span>
                <span className={`${styles.errorLevel} ${styles.errorLevelAlert}`}>ALERT:</span>
                <span>R.E.M. security breach - unauthorized neural access detected</span>
              </div>
              
              <div className={styles.terminalLine}>
                <span className={styles.timestamp}>[{new Date().toISOString()}]</span>
                <span className={`${styles.errorLevel} ${styles.errorLevelSystem}`}>SYSTEM:</span>
                <span>Initiating emergency containment protocols...</span>
              </div>
              
              {showHiddenMessage && (
                <>
                  <div className={`${styles.terminalLine} ${styles.hiddenMessage}`}>
                    <span className={styles.timestamp}>[REDACTED]</span>
                    <span className={`${styles.errorLevel} ${styles.errorLevelHidden}`}>HIDDEN:</span>
                    <span>Ghost users detected in memory fragments</span>
                  </div>
                  
                  <div className={`${styles.terminalLine} ${styles.hiddenMessage}`}>
                    <span className={styles.timestamp}>[REDACTED]</span>
                    <span className={`${styles.errorLevel} ${styles.errorLevelHidden}`}>HIDDEN:</span>
                    <span>Damnatio Memoriae protocol partially compromised</span>
                  </div>
                  
                  <div className={`${styles.terminalLine} ${styles.hiddenMessage}`}>
                    <span className={styles.timestamp}>[REDACTED]</span>
                    <span className={`${styles.errorLevel} ${styles.errorLevelHidden}`}>HIDDEN:</span>
                    <span>They are coming back. They remember.</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className={styles.errorMessage}>
            <p>A critical system error has occurred in the NyxBank financial network.</p>
            <p>Your neural signature has been logged for security purposes.</p>
            <p>Automatic system recovery in progress: <span className={styles.countdown}>{countdown}</span> seconds</p>
          </div>
          
          <div className={styles.errorActions}>
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
            <Button variant="destructive">Contact System Administrator</Button>
          </div>
          
          <div className={styles.securityNotice}>
            <p>SECURITY NOTICE: This error has been reported to NyxBank security.</p>
            <p className={styles.smallText}>Unauthorized access attempts may result in biometric collateral seizure.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SystemError;