import { GlobalStyles } from '../components/LandingPage/GlobalStyles';

import '../styles/landing/tailwind.css';

// components
import { Form } from '../components/LandingPage';
import { Footer } from '../components/LandingPage/Footer';
import { Header } from '../components/LandingPage/Header';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <>
      {/* Global Styles */}
      <GlobalStyles />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="home_hero">
        <div className="container">
          <div className="home_hero__wrapper">
            <div className="home_hero__content">
              <h1>PillarX: Smart Choice for Web3 Traders & Users</h1>
              <p>
                Get token insights, manage crypto assets seamlessly across EVM chains, and access secure DeFi — all in one app.
              </p>
              <Link
                            to="/login"
                            className="cta home_hero__cta plausible-event-name=Home+Get+Started"
                          >
                            <span>Get started</span>
                          </Link>
            </div>
            <div className="home_hero__image">
              <img src="/landing-images/home-hero.webp" />
            </div>
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <Footer />
    </>
  );
}
