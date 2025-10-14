import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { GlobalStyles } from '../components/LandingPage/GlobalStyles';
import '../styles/landing/tailwind.css';

// components
import { Header } from '../components/LandingPage/Header';
import { Footer } from '../components/LandingPage/Footer';
import { MailChimp } from '../components/LandingPage/MailChimp';

// utils
import { setupPillarWalletMessaging } from '../utils/pillarWalletMessaging';

// Styled components for loading state
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0a0a0a;
  gap: 24px;
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
`;

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  useEffect(() => {
    // Check if we're in React Native webview
    const searchParams = new URLSearchParams(window.location.search);
    const devicePlatform = searchParams.get('devicePlatform');
    const hasDevicePlatformInUrl =
      devicePlatform === 'ios' || devicePlatform === 'android';
    const hasDevicePlatformInStorage =
      !!localStorage.getItem('DEVICE_PLATFORM');

    const isReactNativeApp =
      hasDevicePlatformInUrl || hasDevicePlatformInStorage;

    if (isReactNativeApp) {
      setIsLoadingAuth(true);

      // Store device platform if coming from URL
      if (hasDevicePlatformInUrl) {
        localStorage.setItem('DEVICE_PLATFORM', devicePlatform);
      }

      // Set up messaging to request private key
      const cleanup = setupPillarWalletMessaging(
        (address, pk) => {
          // Success - store account address only (NOT the private key for security)
          localStorage.setItem('ACCOUNT_VIA_PK', address);
          // Private key will be stored in Main.tsx state (in-memory only)
          navigate('/');
        },
        (error) => {
          // Error - still redirect but without auth
          console.error('Failed to get private key:', error);
          navigate('/');
        }
      );

      return cleanup;
    }
    return undefined;
  }, [navigate]);

  // Show loading state if authenticating via React Native
  if (isLoadingAuth) {
    return (
      <>
        <GlobalStyles />
        <LoadingContainer>
          <Spinner />
          <LoadingText>Just a moment</LoadingText>
        </LoadingContainer>
      </>
    );
  }

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
                Get token insights, manage crypto assets seamlessly across EVM
                chains, and access secure DeFi — all in one app.
              </p>
              <Link
                to="/login"
                className="cta home_hero__cta plausible-event-name=Home+Get+Started"
              >
                <span>Get started</span>
              </Link>
            </div>
            <div className="home_hero__image">
              <img src="https://cdn.pillarx.app/home-hero.webp" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="home_feature scroll_margin" id="superpowers">
        <div className="container">
          <div className="home_feature__wrapper">
            {/* Feature Detail */}
            <div className="home_feature__detail home_feature__detail--reverse">
              <div className="home_feature__detail__image home_feature__detail__image--large gradient_border">
                <video
                  width="100%"
                  preload="none"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="https://cdn.pillarx.app/home-superpowers-1.webp"
                >
                  <source
                    src="https://cdn.pillarx.app/home-superpowers-1.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="home_feature__detail__content gradient_border">
                <h4>Superpowers</h4>
                <h2>
                  Token Tiles
                  <br />
                  <span>Stay Ahead of the Curve</span>
                </h2>
                <p>
                  See the hottest tokens from each chain at a glance. With Token
                  Tiles, PillarX brings trending and newly created assets
                  directly to your home screen. No need to dig through endless
                  tabs — just pure alpha, instantly accessible.
                </p>
              </div>
            </div>
            {/* Feature Detail */}
            <div className="home_feature__detail">
              <div className="home_feature__detail__image gradient_border">
                <video
                  width="100%"
                  preload="none"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="https://cdn.pillarx.app/home-superpowers-2.webp"
                >
                  <source
                    src="https://cdn.pillarx.app/home-superpowers-2.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="home_feature__detail__content gradient_border">
                <h2>
                  Token Atlas
                  <br />
                  <span>
                    Everything You <br />
                    Need in One View
                  </span>
                </h2>
                <p>
                  Live prices, charts, stats, token audit links, and a one-tap
                  buy&nbsp;button. Token Atlas delivers all the essential token
                  information in one seamless experience. No more switching apps
                  or dealing with friction.
                </p>
              </div>
            </div>
            {/* Feature Detail */}
            <div className="home_feature__detail home_feature__detail--reverse">
              <div className="home_feature__detail__image gradient_border">
                <video
                  width="100%"
                  preload="none"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="https://cdn.pillarx.app/home-superpowers-3.webp"
                >
                  <source
                    src="https://cdn.pillarx.app/home-superpowers-3.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="home_feature__detail__content gradient_border">
                <h2>
                  Instant Swaps
                  <br />
                  <span>
                    Trade Tokens in
                    <br /> Seconds
                  </span>
                </h2>
                <p>
                  Swap tokens across chains with PillarX’s streamlined
                  <br /> flow. Seamless, lightning-fast, and optimized to save
                  you
                  <br /> time and gas.
                </p>
              </div>
            </div>
            {/* Feature Detail */}
            <div className="home_feature__detail">
              <div className="home_feature__detail__content home_feature__detail__content--column gradient_border">
                <h2>
                  PX Universal Gas Tank
                  <br />
                  <span>Gas Payments Made Easy</span>
                </h2>
                <p>
                  Top up your gas tank with a variety of tokens and pay gas fees
                  across multiple blockchains effortlessly and securely. Always
                  be prepared without worrying about which token to use for each
                  transaction.
                </p>
                <div className="home_feature__detail__content__icon">
                  <div className="home_feature__detail__content__icon__wrapper">
                    <img
                      src="https://cdn.pillarx.app/home-superpowers-icon-1.svg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div className="home_feature__detail__content home_feature__detail__content--column gradient_border">
                <h2>
                  Web3 App Store
                  <br />
                  <span>
                    Access dApps Without
                    <br /> Leaving PillarX
                  </span>
                </h2>
                <p>
                  All your favorite dApps are built directly into PillarX,
                  meaning you don’t have to leave the platform to connect to any
                  of them! Safe, secure, and under your control.
                </p>
                <div className="home_feature__detail__content__icon">
                  <h4>Coming Soon</h4>
                  <div className="home_feature__detail__content__icon__wrapper">
                    <img
                      src="https://cdn.pillarx.app/home-superpowers-icon-2.svg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home_app">
        <div className="container">
          <div className="home_app__wrapper">
            <div className="home_app__subscribe">
              <h2>
                More Exciting Features
                <br /> Coming Soon!
              </h2>
              <p>
                Be the first to know about new features, smart token insights,
                and exclusive announcements!
              </p>
              {/* Form */}
              <MailChimp />
            </div>
            <div className="home_app__download gradient_border">
              <div className="home_app__download__copy">
                <h3>Get started with</h3>
                <img
                  src="https://cdn.pillarx.app/pillarXLogo.png"
                  alt="PillarX logo"
                />
                <h3>on any device</h3>
              </div>
              <div className="home_app__download__cta">
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noreferrer"
                  className="plausible-event-name=Download+App+Store"
                >
                  <img
                    src="https://cdn.pillarx.app/app-store.svg"
                    alt="app-store-logo"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/"
                  target="_blank"
                  rel="noreferrer"
                  className="plausible-event-name=Download+Google+Play"
                >
                  <img
                    src="https://cdn.pillarx.app/google-play.svg"
                    alt="google-play-logo"
                  />
                </a>
                <Link to="/login" className="plausible-event-name=Download+Web">
                  <img src="https://cdn.pillarx.app/web.svg" alt="web-icon" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="home_about scroll_margin" id="about">
        <div className="container">
          <div className="home_about__wrapper">
            <h2>The Story Behind PillarX</h2>
            <p>
              PillarX began with{' '}
              <a
                href="https://pillar.fi/?utm_source=pillarx.app&utm_medium=website&utm_campaign=home_page"
                target="_blank"
                rel="noreferrer"
              >
                Pillar Wallet
              </a>{' '}
              in 2017, one of the first EVM-compatible wallets. The team quickly
              identified the usability challenges faced by EOAs, leading to the
              introduction of Smart Accounts. This evolved into a smart contract
              wallet, unlocking advanced features and setting the stage for
              innovative use cases that would define the future of Web3, even
              before Layer 1s and Layer 2s became mainstream. <br />
              <br />
              But the team didn’t stop there. The goal was to make the Web3
              experience even better and more accessible. Enter PillarX, a
              complete upgrade to the Pillar Wallet, designed to empower users
              with a seamless, intuitive, and cutting-edge platform for all
              things Web3.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
