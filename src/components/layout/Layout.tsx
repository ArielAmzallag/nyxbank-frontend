import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <div className="container">
          <p className={styles.copyright}>© {new Date().getFullYear()} NyxBank. All rights reserved.</p>
          <p className={styles.disclaimer}>By using this application, you agree to our terms of service including biometric collateral seizure clauses.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
