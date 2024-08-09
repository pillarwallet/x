import { useEffect } from 'react';
import { GlobalStyles } from '../components/LandingPage/GlobalStyles';
import Plausible from 'plausible-tracker';

// components
import { Header } from '../components/LandingPage/Header';
import { Footer } from '../components/LandingPage/Footer';

// Plausible Domain Config
const { trackEvent } = Plausible({
  domain: process.env.REACT_APP_PLAUSIBLE_DOMAIN
});

const Waitlist = () => {
  useEffect(() => {
    // Load the CSS
    const link = document.createElement('link');
    link.href = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);

    // Load the JavaScript
    const script = document.createElement('script');
    script.src = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js';
    script.async = true;
    document.body.appendChild(script);

    // Add event listener for iframe/Waitlist click
    const waitlistContainer = document.getElementById('getWaitlistContainer');
    const handleClick = () => {
      trackEvent('Waitlist Click', { id: 'getWaitlistContainer' });
    };

    if (waitlistContainer) {
      waitlistContainer.addEventListener('click', handleClick);
    }

    // Cleanup
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (waitlistContainer) {
        waitlistContainer.removeEventListener('click', handleClick);
      }
    };
  }, []);

  return (
    <>
      {/* Global Styles */}
      <GlobalStyles />

      {/* Header */}
      <Header />

      {/* Signup Section */}
      <section className='home_signup'>
        <div className='container'>
          <div className='home_signup__wrapper'>
            <div className='home_signup__content'>
              <h1>Be Among the First to Test PillarX</h1>
              <p>Join our exclusive testing campaign and lead the Web3 revolution.<br/> <strong>Share your referral code to get your network to sign up.</strong><br/> The more you share, the higher your ranking.</p>
              <div className='home_signup__content__form home_signup__content__form--waitlist'>
                <div id='getWaitlistContainer' data-waitlist_id='17924' data-widget_type='WIDGET_1'></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Build Section */}
      <section className='home_build'>
        <div className='container'>
          <div className='home_build__wrapper'>
            <div className='home_build__content'>
              <div className='home_build__content__left'>
                <p>PillarX will be rolled out for testing in seasons, rewarding the earliest and most active users. Top referrers will gain exclusive early access and be the first to experience our cutting-edge Web3 technology.</p>
                <p>Each season will introduce new blockchains and projects for testing, offering you the chance to pioneer these innovations.</p>
              </div>
              <div className='home_build__content__right'>
                <h2>Sign up and Share Your Code now to Secure Your Spot!</h2>
              </div>
            </div>
            <div className='home_build__logo'>
              <img src='/landing-images/home-logo-px.svg'></img>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Waitlist;
