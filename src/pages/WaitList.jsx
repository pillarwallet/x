/* eslint-disable react/self-closing-comp */
import Plausible from 'plausible-tracker';
import { useEffect } from 'react';
import { GlobalStyles } from '../components/LandingPage/GlobalStyles';

// components
import { Footer } from '../components/LandingPage/Footer';
import { Header } from '../components/LandingPage/Header';

// Plausible Domain Config
const { trackEvent } = Plausible({
  domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
});

const Waitlist = () => {
  useEffect(() => {
    // Load the CSS
    const link = document.createElement('link');
    link.href =
      'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);

    // Load the JavaScript
    const script = document.createElement('script');
    script.src =
      'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js';
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
      <section className="home_signup home_signup--waitlist">
        <div className="container">
          <div className="home_signup__wrapper">
            <div className="home_signup__content">
              <h1>
                Join the PillarX Soft Launch Campaign – $10,000 Prize Pool!
              </h1>
              <p>
                Test the upgraded PillarX experience and collect PX points.
                <br /> Top participants get a chance to win a share of{' '}
                <a
                  href="https://blog.pillarx.app/pillarx-soft-launch-join-unlock-exclusive-rewards/"
                  target="_blank"
                  rel="noreferrer"
                >
                  the prize pool
                </a>
                !
                <br /> Join the waitlist and keep an eye on your inbox for the
                access link
              </p>
              <div className="home_signup__content__form home_signup__content__form--waitlist">
                <div
                  id="getWaitlistContainer"
                  data-waitlist_id="17924"
                  data-widget_type="WIDGET_1"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Build Section */}
      <section className="home_build">
        <div className="container">
          <div className="home_build__wrapper">
            <div className="home_build__content">
              <div className="home_build__content__left">
                <p>
                  PillarX will be rolled out for testing in seasons, rewarding
                  the earliest and most active users. Top referrers will gain
                  exclusive early access and be the first to experience our
                  cutting-edge Web3 technology.
                </p>
                <p>
                  Each season will introduce new blockchains and projects for
                  testing, offering you the chance to pioneer these innovations.
                </p>
              </div>
              <div className="home_build__content__right">
                <h2>Sign up and Share Your Code now to Secure Your Spot!</h2>
              </div>
            </div>
            <div className="home_build__logo">
              <img
                src="https://cdn.pillarx.app/home-logo-px.svg"
                alt="home-logo"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="home_signup_tnc">
        <div className="container">
          <div className="home_signup_tnc__content">
            <p>
              Participation in the PillarX Soft Launch Campaign is subject to
              the official campaign rules and eligibility requirements. Rewards
              may vary depending on participant activity, task completion, or
              other criteria outlined in the{' '}
              <a
                href="https://blog.pillarx.app/pillarx-soft-launch-10000-allocated-for-migrating/"
                target="_blank"
                rel="noreferrer"
              >
                campaign terms
              </a>
              . PillarX reserves the right to modify, suspend, or terminate the
              campaign at any time without prior notice.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Waitlist;
