import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import styles from '../../styles/BlackMarket.module.css';

// Define listing types
interface BlackMarketListing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'NYX' | 'OBL' | 'DRM' | 'SBL';
  seller: string;
  sellerRating: number;
  category: 'organ' | 'memory' | 'identity' | 'security' | 'neural';
  risk: 'low' | 'medium' | 'high' | 'extreme';
  timeLeft: string;
  image?: string;
}

const BlackMarket: NextPage = () => {
  // Access verification state
  const [accessVerified, setAccessVerified] = useState<boolean>(false);
  const [verifyingAccess, setVerifyingAccess] = useState<boolean>(false);
  const [accessCode, setAccessCode] = useState<string>('');
  const [accessError, setAccessError] = useState<string>('');
  
  // Black market filter states
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Mock black market listings
  const [listings] = useState<BlackMarketListing[]>([
    {
      id: 'bm001',
      title: 'Grade-A Synthetic Kidney',
      description: 'Lab-grown kidney with enhanced filtration. No questions asked. Delivery in secure container to designated NyxBank safety deposit box.',
      price: 5000,
      currency: 'NYX',
      seller: 'OrganExchange',
      sellerRating: 4.7,
      category: 'organ',
      risk: 'medium',
      timeLeft: '23h 45m'
    },
    {
      id: 'bm002',
      title: 'Childhood Memory Package (Ages 5-8)',
      description: 'Complete memory extraction from donor: childhood beach vacations, birthday parties. 98.5% integrity, no trauma markers, source verified.',
      price: 3500,
      currency: 'DRM',
      seller: 'MemoryCorp',
      sellerRating: 3.9,
      category: 'memory',
      risk: 'high',
      timeLeft: '8h 12m'
    },
    {
      id: 'bm003',
      title: 'Complete Identity Package - A. Thompson',
      description: 'Full identity transfer: credentials, biometric profiles, credit history (720 score). Minimal digital footprint, clean record.',
      price: 12000,
      currency: 'SBL',
      seller: 'GhostProtocol',
      sellerRating: 4.9,
      category: 'identity',
      risk: 'extreme',
      timeLeft: '3d 4h'
    },
    {
      id: 'bm004',
      title: 'NyxBank Security Backdoor',
      description: 'Limited access exploit to bypass standard collateral checks. One-time use. Untraceable for 48 hours post-activation.',
      price: 7800,
      currency: 'OBL',
      seller: 'Shadowkey',
      sellerRating: 4.2,
      category: 'security',
      risk: 'extreme',
      timeLeft: '16h 30m'
    },
    {
      id: 'bm005',
      title: 'Partial Neural Pattern - Mathematician',
      description: 'Segmented neural pattern from PhD Mathematics professor. Enhances calculation abilities, spatial reasoning. 30-day integration window.',
      price: 2200,
      currency: 'NYX',
      seller: 'NeuralHarvest',
      sellerRating: 3.8,
      category: 'neural',
      risk: 'high',
      timeLeft: '1d 12h'
    },
    {
      id: 'bm006',
      title: 'Enhanced Lung Pair (Combat-Ready)',
      description: 'Military-grade synthetic lungs with toxin filters and oxygen efficiency boost. Tested in extreme conditions. Installs at any certified clinic.',
      price: 8500,
      currency: 'NYX',
      seller: 'MilitechMed',
      sellerRating: 4.5,
      category: 'organ',
      risk: 'medium',
      timeLeft: '2d 8h'
    },
    {
      id: 'bm007',
      title: 'Professional Skill Memory: Concert Pianist',
      description: 'Complete motor memory of 15-year concert pianist. Includes finger dexterity patterns and muscle memory. 80% transfer success rate.',
      price: 5800,
      currency: 'DRM',
      seller: 'SkillHarvest',
      sellerRating: 4.1,
      category: 'memory',
      risk: 'high',
      timeLeft: '47m'
    }
  ]);
  
  // For purchase modal
  const [selectedListing, setSelectedListing] = useState<BlackMarketListing | null>(null);
  const [purchaseStep, setPurchaseStep] = useState<number>(1);
  const [confirmationCheck, setConfirmationCheck] = useState<boolean>(false);
  const [purchaseSuccessful, setPurchaseSuccessful] = useState<boolean>(false);
  const [purchaseError, setPurchaseError] = useState<string>('');
  
  // Filter listings based on active category and search query
  const filteredListings = listings.filter(listing => {
    const matchesCategory = activeCategory === 'all' || listing.category === activeCategory;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Get CSS class for risk level
  const getRiskClass = (risk: string) => {
    switch(risk) {
      case 'low': return styles.riskLow;
      case 'medium': return styles.riskMedium;
      case 'high': return styles.riskHigh;
      case 'extreme': return styles.riskExtreme;
      default: return '';
    }
  };
  
  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'organ': return '🫀';
      case 'memory': return '🧠';
      case 'identity': return '👤';
      case 'security': return '🔐';
      case 'neural': return '⚡';
      default: return '🔍';
    }
  };
  
  // Handle access verification
  const handleVerifyAccess = () => {
    setVerifyingAccess(true);
    setAccessError('');
    
    // Simulate verification process
    setTimeout(() => {
      if (accessCode === '1984' || accessCode === 'DREADNOUGHT' || accessCode === '') {
        setAccessVerified(true);
      } else {
        setAccessError('ACCESS DENIED: Invalid entrance code or neural signature mismatch.');
      }
      setVerifyingAccess(false);
    }, 2000);
  };
  
  // Handle listing selection
  const handleSelectListing = (listing: BlackMarketListing) => {
    setSelectedListing(listing);
    setPurchaseStep(1);
    setConfirmationCheck(false);
    setPurchaseSuccessful(false);
    setPurchaseError('');
  };
  
  // Handle purchase process
  const handlePurchase = () => {
    if (purchaseStep === 1) {
      setPurchaseStep(2);
      return;
    }
    
    if (purchaseStep === 2) {
      if (!confirmationCheck) {
        setPurchaseError('You must acknowledge the biometric collateral agreement.');
        return;
      }
      
      setPurchaseStep(3);
      
      // Simulate purchase processing
      setTimeout(() => {
        // Random success or failure
        const success = Math.random() > 0.3;
        
        if (success) {
          setPurchaseSuccessful(true);
        } else {
          setPurchaseError('TRANSACTION FAILED: Insufficient funds or neural verification anomaly detected.');
        }
      }, 3000);
    }
  };
  
  // Close purchase modal
  const handleClosePurchase = () => {
    setSelectedListing(null);
    setPurchaseStep(1);
  };
    useEffect(() => {
        const glitchInterval = setInterval(() => {
        if (Math.random() > 0.9) {
            const glitchElement = document.querySelector(`.${styles.glitchTarget}`);
            if (glitchElement) {
            glitchElement.classList.add(styles.activeGlitch);
            setTimeout(() => {
                glitchElement.classList.remove(styles.activeGlitch);
            }, 300);
            }
        }
        }, 3000);
        
        return () => clearInterval(glitchInterval);
    }, []);
  

  return (
    <Layout>
      <div className={`container ${styles.blackMarketContainer}`}>
        {!accessVerified ? (
          <Card variant="elevated" className={styles.accessCard}>
            <div className={`${styles.accessLogo} glitchTarget`}>
              <span className={styles.accessIcon}>⚠️</span>
              <h1 className={styles.accessTitle}>RESTRICTED ACCESS</h1>
            </div>
            
            <div className={styles.accessWarning}>
              <p>You are attempting to access <span className="neon-text">BLACK MARKET</span> services.</p>
              <p>Trade of organs, memories, and identities is strictly monitored.</p>
              <p className={styles.disclaimer}>All transactions are subject to Biometric Collateral Collection in case of legal action.</p>
            </div>
            
            <div className={styles.accessForm}>
              <Input
                label="Enter Access Code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="ACCESS CODE or leave blank for neural signature verification"
                fullWidth
              />
              
              {accessError && (
                <div className={`${styles.accessError} glitch`}>
                  {accessError}
                </div>
              )}
              
              <Button 
                onClick={handleVerifyAccess} 
                disabled={verifyingAccess}
                fullWidth
              >
                {verifyingAccess ? 'Verifying...' : 'Verify Access'}
              </Button>
            </div>
            
            <div className={styles.accessFooter}>
              <p>By accessing this area, you acknowledge that NyxBank records all market interactions and may share records with authorities as required by law.</p>
            </div>
          </Card>
        ) : (
          <>
            <div className={styles.marketHeader}>
              <h1 className={`${styles.marketTitle} neon-text glitchTarget`}>BLACK MARKET</h1>
              <div className={styles.securityBadge}>
                <span className={styles.securityDot}></span>
                Secure Connection Active
              </div>
            </div>
            
            <div className={styles.marketFilters}>
              <div className={styles.searchBar}>
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                />
              </div>
              
              <div className={styles.categoryTabs}>
                <button 
                  className={`${styles.categoryTab} ${activeCategory === 'all' ? styles.activeTab : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All Items
                </button>
                <button 
                  className={`${styles.categoryTab} ${activeCategory === 'organ' ? styles.activeTab : ''}`}
                  onClick={() => setActiveCategory('organ')}
                >
                  {getCategoryIcon('organ')} Organs
                </button>
                <button 
                  className={`${styles.categoryTab} ${activeCategory === 'memory' ? styles.activeTab : ''}`}
                  onClick={() => setActiveCategory('memory')}
                >
                  {getCategoryIcon('memory')} Memories
                </button>
                <button 
                  className={`${styles.categoryTab} ${activeCategory === 'identity' ? styles.activeTab : ''}`}
                  onClick={() => setActiveCategory('identity')}
                >
                  {getCategoryIcon('identity')} Identities
                </button>
                <button 
                  className={`${styles.categoryTab} ${activeCategory === 'security' ? styles.activeTab : ''}`}
                  onClick={() => setActiveCategory('security')}
                >
                  {getCategoryIcon('security')} Security
                </button>
                <button 
                  className={`${styles.categoryTab} ${activeCategory === 'neural' ? styles.activeTab : ''}`}
                  onClick={() => setActiveCategory('neural')}
                >
                  {getCategoryIcon('neural')} Neural
                </button>
              </div>
            </div>
            
            <div className={styles.marketListings}>
              {filteredListings.length === 0 ? (
                <div className={styles.noListings}>
                  <p>No listings found matching your criteria.</p>
                </div>
              ) : (
                <div className={styles.listingsGrid}>
                  {filteredListings.map(listing => (
                    <Card 
                      key={listing.id} 
                      className={styles.listingCard}
                      onClick={() => handleSelectListing(listing)}
                    >
                      <div className={styles.listingHeader}>
                        <div className={styles.categoryBadge}>
                          <span className={styles.categoryIcon}>{getCategoryIcon(listing.category)}</span>
                          {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                        </div>
                        <div className={`${styles.riskBadge} ${getRiskClass(listing.risk)}`}>
                          {listing.risk.toUpperCase()} RISK
                        </div>
                      </div>
                      
                      <h3 className={styles.listingTitle}>{listing.title}</h3>
                      
                      <div className={styles.listingDescription}>
                        {listing.description}
                      </div>
                      
                      <div className={styles.listingFooter}>
                        <div className={styles.sellerInfo}>
                          <span className={styles.sellerName}>{listing.seller}</span>
                          <span className={styles.sellerRating}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                                key={`star-${listing.id}-${i}`}
                                className={i < Math.floor(listing.sellerRating) ? styles.starFilled : styles.starEmpty}
                            >
                                ★
                            </span>
                            ))}
                          </span>
                        </div>
                        
                        <div className={styles.priceTag}>
                          <span className={styles.priceAmount}>{listing.price.toLocaleString()}</span>
                          <span className={styles.priceCurrency}>{listing.currency}</span>
                        </div>
                      </div>
                      
                      <div className={styles.listingTimer}>
                        <span className={styles.timerIcon}>⏱️</span>
                        <span className={styles.timerText}>{listing.timeLeft}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <div className={styles.marketDisclaimer}>
              <div className={`${styles.disclaimerContent} glitch`}>
                <p>WARNING: All black market transactions are monitored by NyxBank security protocols.</p>
                <p>Biometric collateral seizure will be enforced for illegal transactions.</p>
                <p className={styles.disclaimerSmall}>NyxBank maintains deniability for all user actions in the black market.</p>
              </div>
            </div>
          </>
        )}
        
        {/* Purchase Modal */}
        {selectedListing && (
          <div className={styles.modalOverlay}>
            <Card className={styles.purchaseModal}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {purchaseSuccessful ? 'Purchase Complete' : 'Confirm Purchase'}
                </h2>
                <button 
                  className={styles.closeButton}
                  onClick={handleClosePurchase}
                >
                  ×
                </button>
              </div>
              
              {purchaseSuccessful ? (
                <div className={styles.successContent}>
                  <div className={styles.successIcon}>✓</div>
                  <h3 className={styles.successTitle}>Transaction Confirmed</h3>
                  <p className={styles.successMessage}>
                    Your purchase of <strong>{selectedListing.title}</strong> has been processed.
                  </p>
                  <div className={styles.deliveryInfo}>
                    <h4>Delivery Information</h4>
                    <p>Your item will be delivered via secure neural transfer or designated drop point.</p>
                    <p>Transaction ID: <span className={styles.transactionId}>{Math.random().toString(36).substring(2, 15).toUpperCase()}</span></p>
                  </div>
                  <Button onClick={handleClosePurchase}>Close</Button>
                </div>
              ) : (
                <div className={styles.purchaseContent}>
                  {purchaseStep === 1 && (
                    <>
                      <div className={styles.itemPreview}>
                        <div className={styles.itemCategory}>
                          <span className={styles.categoryIconLarge}>{getCategoryIcon(selectedListing.category)}</span>
                          {selectedListing.category.charAt(0).toUpperCase() + selectedListing.category.slice(1)}
                        </div>
                        
                        <h3 className={styles.itemTitle}>{selectedListing.title}</h3>
                        <p className={styles.itemDesc}>{selectedListing.description}</p>
                        
                        <div className={styles.itemDetails}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Seller:</span>
                            <span className={styles.detailValue}>{selectedListing.seller}</span>
                          </div>
                          
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Risk Level:</span>
                            <span className={`${styles.detailValue} ${getRiskClass(selectedListing.risk)}`}>
                              {selectedListing.risk.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Price:</span>
                            <span className={styles.detailValue}>
                              {selectedListing.price.toLocaleString()} {selectedListing.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.riskWarning}>
                        <div className={styles.warningIcon}>⚠️</div>
                        <div className={styles.warningText}>
                          <p>This is a high-risk transaction. Ensure you understand the legal and health implications.</p>
                          <p className={styles.warningHighlight}>All black market purchases require neural verification and biometric collateral.</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {purchaseStep === 2 && (
                    <div className={styles.confirmationDetails}>
                        <h3 className={styles.confirmationTitle}>Transaction Details</h3>
                        
                        <div className={styles.confirmationItem}>
                          <span className={styles.confirmLabel}>Item:</span>
                          <span className={styles.confirmValue}>{selectedListing.title}</span>
                        </div>
                        
                        <div className={styles.confirmationItem}>
                          <span className={styles.confirmLabel}>Price:</span>
                          <span className={styles.confirmValue}>
                            {selectedListing.price.toLocaleString()} {selectedListing.currency}
                          </span>
                        </div>
                        
                        <div className={styles.confirmationItem}>
                          <span className={styles.confirmLabel}>Seller:</span>
                          <span className={styles.confirmValue}>{selectedListing.seller}</span>
                        </div>
                        
                        <div className={styles.confirmationItem}>
                          <span className={styles.confirmLabel}>Risk:</span>
                          <span className={`${styles.confirmValue} ${getRiskClass(selectedListing.risk)}`}>
                            {selectedListing.risk.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className={styles.biometricConfirmation}>
                          <label className={styles.confirmCheck}>
                            <input
                              type="checkbox"
                              checked={confirmationCheck}
                              onChange={(e) => setConfirmationCheck(e.target.checked)}
                            />
                            <span>I agree to provide biometric data as collateral for this transaction. I understand that illegal use of purchased items may result in biometric seizure, memory alteration, or damnatio memoriae.</span>
                          </label>
                        </div>
                      </div>
                    )}
                  
                  {purchaseStep === 3 && (
                    <div className={styles.processingState}>
                      {!purchaseError ? (
                        <>
                          <div className={styles.loadingIndicator}></div>
                          <h3 className={styles.processingTitle}>Processing Transaction</h3>
                          <p className={styles.processingText}>
                            Please wait while we process your purchase and verify your neural signature...
                          </p>
                          <div className={styles.scanLines}></div>
                        </>
                      ) : (
                        <div className={`${styles.errorState} glitch`}>
                          <div className={styles.errorIcon}>!</div>
                          <h3 className={styles.errorTitle}>Transaction Failed</h3>
                          <p className={styles.errorMessage}>{purchaseError}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {purchaseError && (
                    <div className={styles.modalActions}>
                      <Button variant="ghost" onClick={handleClosePurchase}>Cancel</Button>
                      <Button onClick={() => setPurchaseStep(1)}>Try Again</Button>
                    </div>
                  )}
                  
                  {!purchaseError && purchaseStep < 3 && (
                    <div className={styles.modalActions}>
                      <Button variant="ghost" onClick={handleClosePurchase}>Cancel</Button>
                      <Button onClick={handlePurchase}>
                        {purchaseStep === 1 ? 'Continue' : 'Confirm Purchase'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlackMarket;

