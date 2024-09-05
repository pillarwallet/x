/* eslint-disable react/jsx-props-no-spreading */
import { useRef } from 'react';
import Slider from 'react-slick';
import { GlobalStyles } from '../components/LandingPage/GlobalStyles';

// components
import { Footer } from '../components/LandingPage/Footer';
import { Header } from '../components/LandingPage/Header';

const Developers = () => {
  // Slider Ref
  const slider = useRef(null);

  // Slider Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    centerMode: true,
    arrows: false,
    centerPadding: '50px',
    slidesToShow: 1,
    speed: 500,
  };

  return (
    <>
      {/* Global Styles */}
      <GlobalStyles />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="developers_hero">
        <div className="container">
          <div className="developers_hero__wrapper">
            <div className="developers_hero__content">
              <h1>Effortless Account Abstraction with PillarX</h1>
              <p>
                PillarX offers a complete account abstraction solution,
                eliminating the complexities of setting up your own
                infrastructure and account handling. Our system handles all the
                intricate details, allowing you to focus on what you do best –
                developing exceptional projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="developers_feature">
        <div className="container">
          <div className="developers_feature__wrapper">
            <div className="developers_feature__detail">
              <h3>
                Streamlined
                <br /> Integration
              </h3>
              <p>
                Integrate effortlessly with our SDK, designed to work out of the
                box for quick and efficient implementation.
              </p>
            </div>
            <div className="developers_feature__detail">
              <h3>Automatic Handling of Transactions</h3>
              <p>
                Manage user transactions without requiring them to handle
                signatures, simplifying the user experience.
              </p>
            </div>
            <div className="developers_feature__detail">
              <h3>
                Multi-chain
                <br /> Support
              </h3>
              <p>
                Develop applications that interact with multiple blockchain
                networks, reaching a broader audience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section className="developers_signup">
        <div className="container">
          <div className="developers_signup__wrapper">
            <div className="developers_signup__content">
              <p>
                With PillarX, integrating account abstraction features into your
                dApp is as simple as adding a few lines of code. Get up and
                running quickly with&nbsp;our support.
              </p>
              <div className="developers_signup__content__detail">
                <p>Sing up for the PillarX Testing Campaign&nbsp;for dApps</p>
                <a
                  href="https://form.pillarx.app/dapp-application/"
                  target="_blank"
                  rel="noreferrer"
                  className="cta"
                >
                  <span>Sign up</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UI Section */}
      <section className="developers_ui">
        <div className="container">
          <div className="developers_ui__wrapper">
            <div className="developers_ui__detail">
              <h2>Ready-to-Go User Interface</h2>
              <p>
                PillarX offers a pre-built, ready-to-go account handling UI that
                integrates seamlessly with your application. This intuitive UI
                is designed to enhance user experience and engagement, making it
                easier for you to deliver high-quality applications quickly.
              </p>
            </div>
            <div className="developers_ui__image">
              <div className="developers_ui__image__wrapper">
                <video
                  width="100%"
                  preload="none"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/landing-images/home-feature-2.png"
                >
                  <source
                    src="/landing-images/home-feature-2.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="developers_ui__image__wrapper">
                <video
                  width="100%"
                  preload="none"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/landing-images/home-feature-3.png"
                >
                  <source
                    src="/landing-images/home-feature-3.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ERC-7579 Modules */}
      <section className="developers_module">
        <div className="container">
          <div className="developers_module__wrapper">
            <div className="developers_module__list">
              <div className="developers_module__list__wrapper">
                {/* Slider Starts */}
                <div className="developers_module__list__carousel">
                  <Slider ref={slider} {...sliderSettings}>
                    <div className="developers_module__list__carousel__slide">
                      <div className="developers_module__list__carousel__slide__content">
                        <h3>Session Key Module</h3>
                        <p>
                          Enhance security and user experience with session
                          keys, allowing temporary access without repeated
                          authentication. Ideal for&nbsp;gaming dApps.
                        </p>
                        <img
                          src="/landing-images/developers-module-1.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="developers_module__list__carousel__slide">
                      <div className="developers_module__list__carousel__slide__content">
                        <h3>
                          Payment <br /> Module
                        </h3>
                        <p>
                          Streamline transactions with support for various
                          cryptocurrencies, perfect for decentralized
                          marketplaces.
                        </p>
                        <img
                          src="/landing-images/developers-module-2.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="developers_module__list__carousel__slide">
                      <div className="developers_module__list__carousel__slide__content">
                        <h3>
                          Airdrop Claim
                          <br /> Module
                        </h3>
                        <p>
                          Automate airdrop claims and incentivize participation
                          with a finder&apos;s fee, ensuring efficient
                          distribution of tokens.
                        </p>
                        <img
                          src="/landing-images/developers-module-3.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="developers_module__list__carousel__slide">
                      <a
                        href="https://erc7579.com/modules"
                        target="_blank"
                        rel="noreferrer"
                        className="developers_module__list__carousel__slide__content developers_module__list__carousel__slide__content--last"
                      >
                        <h3>
                          Explore More
                          <br />
                          Modules
                        </h3>
                        <img
                          src="/landing-images/developers-module-icon.svg"
                          alt=""
                        />
                      </a>
                    </div>
                  </Slider>
                  <div className="developers_module__list__carousel__nav">
                    <button
                      type="button"
                      onClick={() => slider?.current?.slickPrev()}
                    >
                      ❮
                    </button>
                    <button
                      type="button"
                      onClick={() => slider?.current?.slickNext()}
                    >
                      ❯
                    </button>
                  </div>
                </div>
                {/* Slider Ends */}
                <p>
                  By integrating these and other ERC-7579 modules, you can
                  create feature-rich dApps that are highly responsive to user
                  needs.
                </p>
              </div>
            </div>
            <div className="developers_module__detail">
              <h2>Harness the Power of ERC-7579 Modules</h2>
              <p>
                PillarX leverages ERC-7579, a versatile standard that empowers
                dApps to provide seamless user experiences through modular
                components.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="developers_benefits">
        <div className="container">
          <div className="developers_benefits__wrapper">
            <div className="developers_benefits__detail">
              <h2>Unlock the Benefits of ERC-4337 Paymaster</h2>
              <p>
                The ERC-4337 Paymaster allows you to sponsor or abstract user
                interactions, making it easier for users to engage with your
                dApp without worrying about transaction mechanics:
              </p>
            </div>
            <div className="developers_benefits__list">
              <div className="developers_benefits__list__detail">
                <h3>Transaction Fee Sponsorship</h3>
                <p>
                  Cover transaction fees for specific actions, reducing friction
                  and boosting accessibility.
                </p>
              </div>
              <div className="developers_benefits__list__detail">
                <h3>Promotional Campaigns</h3>
                <p>
                  Offer free interactions during special events to increase user
                  acquisition and retention.
                </p>
              </div>
              <div className="developers_benefits__list__detail">
                <h3>User Onboarding</h3>
                <p>
                  Sponsor initial transactions for new users, simplifying the
                  onboarding process and increasing adoption rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Section */}
      <section className="developers_revenue">
        <div className="container">
          <div className="developers_revenue__wrapper">
            <h2>Revenue Sharing Opportunities</h2>
            <div className="developers_revenue__detail">
              <p>
                PillarX isn&apos;t just about simplifying integration; it&apos;s
                also about rewarding your efforts. Our revenue-sharing model
                allows you to earn from every transaction users have with your
                integrated projects. As your user base grows, so does your
                potential revenue.
              </p>
              <p>
                Additionally, PillarX will share its revenue earned through
                advertisements with developers. Partner with PillarX to gain a
                dual income stream: earnings from user transactions and a share
                of advertising revenue, ensuring you benefit directly from your
                application&apos;s&nbsp;success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="developers_choose">
        <div className="container">
          <div className="developers_choose__wrapper">
            <h2>Why Choose PillarX?</h2>
            <div className="developers_choose__list__wrapper">
              <div className="developers_choose__list">
                <div className="developers_choose__list__detail">
                  <img src="/landing-images/developers-choose-1.svg" alt="" />
                  <h3>Seamless Integration</h3>
                  <p>
                    Integrate effortlessly with your projects, reducing
                    development time and effort.
                  </p>
                </div>
                <div className="developers_choose__list__detail">
                  <img src="/landing-images/developers-choose-2.svg" alt="" />
                  <h3>Full Account Abstraction</h3>
                  <p>
                    Enjoy the convenience of complete account management without
                    the hassle.
                  </p>
                </div>
                <div className="developers_choose__list__detail">
                  <img src="/landing-images/developers-choose-3.svg" alt="" />
                  <h3>Intuitive User Interface</h3>
                  <p>Implement a pre-built UI that enhances user engagement.</p>
                </div>
                <div className="developers_choose__list__detail">
                  <img src="/landing-images/developers-choose-4.svg" alt="" />
                  <h3>ERC-7579 Modules</h3>
                  <p>
                    Leverage modular components for session keys, payments,
                    airdrop claims, and more.
                  </p>
                </div>
                <div className="developers_choose__list__detail">
                  <img src="/landing-images/developers-choose-5.svg" alt="" />
                  <h3>4337 Paymaster</h3>
                  <p>
                    Sponsor user interactions, covering transaction fees and
                    enhancing user&nbsp;experience.
                  </p>
                </div>
                <div className="developers_choose__list__detail">
                  <img src="/landing-images/developers-choose-6.svg" alt="" />
                  <h3>Revenue Sharing</h3>
                  <p>
                    Earn from every transaction and share in advertising
                    revenue, providing a lucrative opportunity for developers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join PillarX */}
      <section className="developers_join">
        <div className="container">
          <div className="developers_join__wrapper">
            <img src="/landing-images/home-logo-px.svg" alt="" />
            <p>
              Join the growing community of developers who trust PillarX to
              streamline their Account Abstraction processes and maximize their
              revenue potential. Start integrating today and experience the
              difference.
            </p>
            <div className="developers_join__cta">
              <a
                href="https://form.pillarx.app/dapp-application/"
                target="_blank"
                rel="noreferrer"
                className="cta"
              >
                <span>Register for Testing&nbsp;Campaign</span>
              </a>
              <a
                href="https://t.me/pillarxdevelopers"
                target="_blank"
                rel="noreferrer"
                className="cta cta--secondary"
              >
                <span>Join PillarX Developer Group</span>
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

export default Developers;
