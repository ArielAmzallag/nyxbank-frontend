import { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import styles from '../styles/Error.module.css';

const NotFound: NextPage = () => {
  return (
    <Layout>
      <div className="container">
        <div className={styles.errorContainer}>
          <h1 className={`${styles.errorCode} neon-text glitch`}>404</h1>
          <h2 className={styles.errorTitle}>ENTITY NOT FOUND</h2>
          <p className={styles.errorMessage}>
            The resource you are trying to access has been REDACTED or does not exist in our database.
          </p>
          <div className={styles.errorActions}>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
          <div className={styles.hiddenMessage}>
            <p>ERROR: USER BIOMETRIC SIGNATURE REJECTED BY R.E.M.</p>
            <p>HAVE YOUR MEMORIES BEEN ALTERED?</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;