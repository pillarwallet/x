import { GlobalStyles } from '../components/LandingPage/GlobalStyles';
import '../styles/landing/tailwind.css';
import { Link } from 'react-router-dom';

// components
import { Header } from '../components/LandingPage/Header';
import { Footer } from '../components/LandingPage/Footer';
import { MailChimp } from '../components/LandingPage/MailChimp';

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
              <img src="/landing-images/home-hero.webp" />
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
                <img src="/landing-images/home-superpowers-1.webp" />
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
                <img src="/landing-images/home-superpowers-2.webp" />
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
                <img src="/landing-images/home-superpowers-3.webp" />
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
                    <img src="/landing-images/home-superpowers-icon-1.svg" />
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
                    <img src="/landing-images/home-superpowers-icon-2.svg" />
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
                  src="/landing-images/pillarXLogo.png"
                  alt="pillar-x-logo"
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
                    src="/landing-images/app-store.svg"
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
                    src="/landing-images/google-play.svg"
                    alt="google-play-logo"
                  />
                </a>
                <Link to="/login" className="plausible-event-name=Download+Web">
                  <img src="/landing-images/web.svg" alt="web-icon" />
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
