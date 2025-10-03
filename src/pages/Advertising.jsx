import { GlobalStyles } from '../components/LandingPage/GlobalStyles';

// components
import { Footer } from '../components/LandingPage/Footer';
import { Header } from '../components/LandingPage/Header';

const Advertising = () => {
  return (
    <>
      {/* Global Styles */}
      <GlobalStyles />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="advertising_hero">
        <div className="container">
          <div className="advertising_hero__wrapper">
            <div className="advertising_hero__content">
              <h1>Collaborate with&nbsp;PillarX</h1>
              <p>
                Connect with 100,000+ Web3-native users <br />
                <br />
                <span>
                  Engage real crypto users through social media campaigns,
                  in-app placements, and community-driven initiatives.
                </span>
              </p>
              <a
                href="https://forms.gle/7FjSUpgHRXgb3TAR6"
                target="_blank"
                rel="noreferrer"
                className="cta plausible-event-name=Advertising+Submit+Request"
              >
                <span>Submit a request</span>
              </a>
            </div>
            <div className="advertising_hero__inapp">
              <div className="advertising_hero__inapp__content">
                <h4>Collaboration options</h4>
                <h2>
                  In-app banners in <br />
                  Pillar Wallet & PillarX
                </h2>
              </div>
              <div className="advertising_hero__inapp__images">
                <div className="advertising_hero__inapp__images__wrapper">
                  <img
                    src="https://cdn.pillarx.app/advertising-pillarx.webp"
                    alt="PillarX in-app banner"
                  />
                  <p>PillarX in-app banner</p>
                </div>
                <div className="advertising_hero__inapp__images__wrapper">
                  <img
                    src="https://cdn.pillarx.app/advertising-pillar.webp"
                    alt="Pillar Wallet in-app banner"
                  />
                  <p>
                    <a
                      href="https://pillar.fi"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Pillar Wallet
                    </a>{' '}
                    in-app banner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="advertising_feature">
        <div className="container">
          <div className="advertising_feature__wrapper">
            <div className="advertising_feature__detail">
              <div className="advertising_feature__detail__content gradient_border">
                <h2>
                  Push notifications <br />
                  via Pillar Wallet
                </h2>
              </div>
              <div className="advertising_feature__detail__content gradient_border">
                <h2>
                  Token competitions
                  <br /> on X <span>(Twitter)</span>
                </h2>
                <div className="advertising_feature__detail__content__icon">
                  <img
                    src="https://cdn.pillarx.app/advertising-icon-1.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="advertising_feature__detail">
              <div className="advertising_feature__detail__content gradient_border">
                <h2>
                  Branded sections in the <br />
                  Pillar & PillarX Newsletter
                </h2>
                <div className="advertising_feature__detail__content__icon">
                  <img
                    src="https://cdn.pillarx.app/advertising-icon-2.svg"
                    alt=""
                  />
                </div>
              </div>
              <div className="advertising_feature__detail__content gradient_border">
                <h2>
                  Pinned dApps in the <br />
                  PillarX Web3 App Store
                </h2>
                <div className="advertising_feature__detail__content__icon">
                  <img
                    src="https://cdn.pillarx.app/advertising-icon-3.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="advertising_contact">
        <div className="container">
          <div className="advertising_contact__wrapper">
            <div className="advertising_contact__content">
              <h2>
                Looking to launch, scale, or strengthen your presence in Web3?
                Let’s grow together!
              </h2>
              <a
                href="https://forms.gle/7FjSUpgHRXgb3TAR6"
                target="_blank"
                rel="noreferrer"
                className="cta plausible-event-name=Advertising+Submit+Request"
              >
                <span>Submit a request</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Advertising;
