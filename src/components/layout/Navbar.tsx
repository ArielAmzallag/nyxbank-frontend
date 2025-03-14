import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';
import Button from '../ui/Button';

// Simple constant to control initial state - change this for testing different states
const DEFAULT_LOGGED_IN = false;

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(DEFAULT_LOGGED_IN);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  // Load login state from localStorage on mount
  useEffect(() => {
    const storedLoginState = localStorage.getItem('nyxbank_logged_in');
    if (storedLoginState !== null) {
      setIsLoggedIn(storedLoginState === 'true');
    } else {
      // Initialize with default value if not set
      localStorage.setItem('nyxbank_logged_in', DEFAULT_LOGGED_IN.toString());
    }
  }, []);
  
  // Update localStorage when login state changes
  useEffect(() => {
    localStorage.setItem('nyxbank_logged_in', isLoggedIn.toString());
  }, [isLoggedIn]);
  
  // const handleLogin = () => {
  //   // In a real app, this would navigate to login page
  //   // For demo purposes, directly toggle the state
  //   setIsLoggedIn(true);
  //   router.push('/dashboard');
  // };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push('/');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Helper to determine if a link is active
  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };
  
  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navbarContainer}`}>
        <div className={styles.logo}>
          <Link href="/" className={`${styles.logoText} neon-text`}>
            NyxBank
          </Link>
          
          {/* Dev mode toggle - can be removed in production */}
          {process.env.NODE_ENV === 'development' && (
            <button 
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className={styles.devModeToggle}
              title="Toggle login state (development only)"
              type="button"
            >
              {isLoggedIn ? '👤' : '👥'}
            </button>
          )}
        </div>
        
        {/* Mobile menu toggle */}
        <button 
          className={styles.mobileMenuToggle} 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          type="button"
        >
          <span className={styles.menuBar}></span>
          <span className={styles.menuBar}></span>
          <span className={styles.menuBar}></span>
        </button>
        
        <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          {isLoggedIn ? (
            <>
              <Link 
                href="/dashboard" 
                className={`${styles.navLink} ${isActive('/dashboard') ? styles.activeLink : ''}`}
              >
                Dashboard
              </Link>
              
              <Link 
                href="/transactions" 
                className={`${styles.navLink} ${isActive('/transactions') ? styles.activeLink : ''}`}
              >
                Transactions
              </Link>
              
              <Link 
                href="/send-money" 
                className={`${styles.navLink} ${isActive('/send-money') ? styles.activeLink : ''}`}
              >
                Send Money
              </Link>
              
              <Link 
                href="/exchange" 
                className={`${styles.navLink} ${isActive('/exchange') ? styles.activeLink : ''}`}
              >
                Exchange
              </Link>
              
              <Link 
                href="/ai" 
                className={`${styles.navLink} ${isActive('/ai') ? styles.activeLink : ''}`}
              >
                R.E.M. Assistant
              </Link>
              
              <div className={styles.navDivider}></div>
              
              <Link 
                href="/profile" 
                className={`${styles.navLink} ${isActive('/profile') ? styles.activeLink : ''}`}
              >
                Profile
              </Link>
              
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className={`${styles.navLink} ${isActive('/auth/login') ? styles.activeLink : ''}`}
              >
                Login
              </Link>
              
              <Link href="/auth/register">
                <Button>
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;