import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <Layout>
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={`${styles.heroTitle} neon-text`}>Welcome to NyxBank</h1>
            <p className={styles.heroSubtitle}>
              The future of banking with cryptocurrency integration and advanced financial services.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/auth/login">
                <Button size="large">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="large">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Our Services</h2>
          <div className={styles.features}>
            <Card className={styles.featureCard}>
              <div className={styles.featureIcon}>💱</div>
              <h3 className={styles.featureTitle}>Crypto Exchange</h3>
              <p className={styles.featureDescription}>
                Exchange NyxCoin for Obol, DraM, and Sabme with competitive rates.
              </p>
            </Card>

            <Card className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3 className={styles.featureTitle}>Secure Transactions</h3>
              <p className={styles.featureDescription}>
                Advanced security protocols ensure your assets remain protected.
              </p>
            </Card>

            <Card className={styles.featureCard}>
              <div className={styles.featureIcon}>🤖</div>
              <h3 className={styles.featureTitle}>R.E.M. Assistant</h3>
              <p className={styles.featureDescription}>
                AI-powered financial advisor helps manage your investments.
              </p>
            </Card>
          </div>
        </div>

        <div className={styles.glitchSection}>
          <div className={`${styles.glitchCard} glitch glass`}>
            <h3 className={styles.glitchTitle}>SYSTEM NOTICE</h3>
            <p className={styles.glitchText}>
              REMINDER: All overdue accounts subject to biometric collateral collection.
              <br />
              <span className={styles.glitchHidden}>ERROR: CORRUPTED MEMORY DETECTED--[DATA REDACTED]</span>
            </p>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <Card variant="elevated" className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Ready to get started?</h2>
            <p className={styles.ctaText}>
              Open an account today and receive 50 NyxCoin as a welcome bonus.
            </p>
            <Link href="/auth/register">
            <Button size="large" fullWidth>
              Create Your Account
            </Button>
            </Link>
            <p className={styles.ctaDisclaimer}>
              * Terms and conditions apply. Biometric data collection required for account verification.
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Home;