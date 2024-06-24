import React from 'react';
import '../styles/landing/styles.css';

// components
import { Form } from '../components/LandingPage';
import { Popup} from '../components/LandingPage/Popup';


export default function LandingPage() {

  const sectionRef = React.useRef(null);
  const scrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
        {/* Header */}
        <header className='home_header'>
          <div className='home_header__announcment'>
            <div className='container'>
              <div className='home_header__announcment__wrapper'>
                <p>🚀 Secure Your Spot in the PillarX Testing Campaign!</p>
                <a href='/waitlist' className='plausible-event-name=Banner+Click'>Join the Waitlist</a>
              </div>
            </div>
          </div>
          <div className='home_header__main'>
            <div className='container'>
              <div className='home_header__main__wrapper'>
                <div className='home_header__main__logo'>
                  <img src='/landing-images/home-logo.svg'></img>
                </div>
                <div className='home_header__main__menu'>
                  <button onClick={scrollToSection}>For developers</button>
                </div>
                <div className='home_header__main__social'>
                  <a href='https://twitter.com/PX_Web3' target='_blank' rel='noreferrer'>
                    <img src='/landing-images/home-x.svg'></img>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className='home_hero'>
          <div className='container container--fluid'>
            <div className='home_hero__wrapper'>
              <div className='home_hero__content'>
                <h1>Introducing PillarX</h1>
                <p>Advancing the way you connect with Web3</p>
                <img src='/landing-images/home-hero.png'></img>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className='home_intro'>
          <div className='container'>
            <div className='home_intro__wrapper'>
              <div className='home_intro__content'>
                <h2>What is PX?</h2>
                <p>PillarX is the next evolution in the Pillar Project story, built on the pillars of controlling your assets and data, PillarX will provide an unparalleled experience in interacting with the Web3 ecosystem.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className='home_feature'>
          <div className='container'>
            <div className='home_feature__wrapper'>
              {/* Feature Detail */}
              <div className='home_feature__detail home_feature__detail--one'>
                <div className='home_feature__detail__copy'>
                  <h2>Stay ahead with&nbsp;the Infinite Information Loop</h2>
                  <p>Scroll seamlessly and receive the latest Web3 news as it happens</p>
                </div>
                <div className='home_feature__detail__image'>
                <video width='100%' preload='none' autoPlay loop muted playsInline poster='/landing-images/home-feature-1.png'>
                    <source src='/landing-images/home-feature-1.mp4' type='video/mp4' />
                  </video>
                </div>
              </div>
              {/* Feature Detail */}
              <div className='home_feature__detail home_feature__detail--two'>
                <div className='home_feature__detail__copy'>
                  <h2>Everything at your fingertips with the PillarX Action Bar</h2>
                  <p>Seamlessly manage transactions, assets, and explore dapps — all in one place!</p>
                </div>
                <div className='home_feature__detail__image'>
                  <video width='100%' preload='none' autoPlay loop muted playsInline poster='/landing-images/home-feature-2.png'>
                    <source src='/landing-images/home-feature-2.mp4' type='video/mp4' />
                  </video>
                </div>
              </div>
              {/* Feature Detail */}
              <div className='home_feature__detail home_feature__detail--flex home_feature__detail--three'>
                <div className='home_feature__detail__copy'>
                  <h2>Simplify your transactions with Mix and Batch</h2>
                  <p>Combine multiple transactions into one efficient batch with PillarX 🚀&nbsp;Hassle-free and super efficient!</p>
                </div>
                <div className='home_feature__detail__image'>
                <video width='100%' preload='none' autoPlay loop muted playsInline poster='/landing-images/home-feature-3.png'>
                    <source src='/landing-images/home-feature-3.mp4' type='video/mp4' />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Signup Section */}
        <section className='home_signup'>
          <div className='container'>
            <div className='home_signup__wrapper'>
              <div className='home_signup__content'>
                <h2>Be One of the First to&nbsp;Experience PX</h2>
                <p>Secure your place as a pioneer – Sign up for early&nbsp;access!</p>
                <div className='home_signup__content__form'>
                  <div className='home_signup__content__form__wrapper'>
                    <Form />
                  </div>
                  <p>Stay tuned! We&apos;ll be unveiling more details as we approach the official launch date. Follow us on <a href='https://twitter.com/PX_Web3' target='_blank' rel='noreferrer'>X</a>.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Build Section */}
        <section className='home_build' ref={sectionRef}>
          <div className='container'>
            <div className='home_build__wrapper'>
              <div className='home_build__content'>
                <div className='home_build__content__left'>
                  <h2>Build with PillarX</h2>
                  <p>This is your chance to spotlight your project, engage with 100k+ Pillar community members, and be part of the journey towards a more trustless future leveraging Account Abstraction.</p>
                </div>
                <div className='home_build__content__right'>
                  <h2>Fill out <a href='https://form.pillarx.app/dapp-application/' target='_blank' rel='noreferrer' className='plausible-event-name=Testing+Form'>the form</a> to join our groundbreaking testing campaign.</h2>
                </div>
              </div>
              <div className='home_build__logo'>
                <img src='/landing-images/home-logo-px.svg'></img>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='home_footer'>
          <div className='container'>
            <div className='home_footer__wrapper'>
              <a href='https://twitter.com/PX_Web3' target='_blank' rel='noreferrer'>
                <img src='/landing-images/home-x.svg'></img>
              </a>
            </div>
          </div>
        </footer>
        {/* Build Section */}

        <Popup />
    </>
  );
}
