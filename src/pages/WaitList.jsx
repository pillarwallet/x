import { useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import Plausible from 'plausible-tracker';

const { trackEvent } = Plausible({
  domain: process.env.REACT_APP_PLAUSIBLE_DOMAIN
});

// fonts
import neueBoldFont from '../assets/landing-fonts/NeueHaasDisplayBold.ttf';
import neueRegularFont from '../assets/landing-fonts/NeueHaasDisplayRoman.ttf';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: Neue Haas Grotesk Display Pro;
    font-weight: 400;
    src: url(${neueRegularFont}) format("truetype");
  }
  
  @font-face {
    font-family: Neue Haas Grotesk Display Pro;
    font-weight: 700;
    src: url(${neueBoldFont}) format("truetype");
  }
  
  :root {
    --white: #ffffff;
    --black: #000000;
    --body-bg: #101010;
    --dark-blue: #4327b1;
    --light-blue: #5e00ff;
    --container: 140rem;
    --padding: 1rem;
    --margin: 1rem;
    --border-radius: 1rem;
    --font-neue: "Neue Haas Grotesk Display Pro", Sans-serif;
  }
  
  html {
    height: 100%;
    font-size: 10px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  
  body {
    height: 100%;
    font-family: var(--font-neue);
    font-style: normal;
    font-weight: 400;
    text-align: center;
    color: var(--white);
    background: var(--body-bg);
  }
  
  /* Resets */
  
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  
  a[href^="tel"] {
    color: inherit;
    text-decoration: none;
  }
  
  a:hover,
  a:active,
  a:focus {
    outline: 0;
  }
  
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    margin-bottom: 2rem;
    line-height: 1.15;
    font-weight: 700;
  }
  
  p {
    margin: 0;
    margin-bottom: 2rem;
    line-height: 1.5;
    font-size: 2rem;
    font-weight: 400;
  }
  
  p:last-child {
    margin-bottom: 0;
  }
  
  a {
    line-height: inherit;
    font-size: inherit;
    color: inherit;
  }
  
  ul {
    margin: 0;
  }
  
  ul li {
    line-height: 1.5;
    font-size: 1.6rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  ul li:last-child {
    margin-bottom: 0;
  }
  
  /* Components */
  
  .container {
    width: 100%;
    max-width: var(--container);
    padding: 0 calc(var(--padding) * 4);
    margin: 0 auto;
  }
  
  .container--fluid {
    max-width: 100%;
    padding: 0;
  }
  
  .container--no_padding {
    padding: 0;
  }
  
  @media only screen and (max-width: 1023px) {
    .container {
      padding: 0 calc(var(--padding) * 4);
    }
  }
  
  @media only screen and (max-width: 767px) {
    .container {
      padding: 0 calc(var(--padding) * 2.5);
    }
  }
  
  /* Style */

  @media only screen and (max-width: 767px) {
    #root {
      overflow: hidden;
    }
  }
  
  .home_header__announcment {
    background: rgba(94, 0, 255, 0.5);
  }
  
  .home_header__announcment__wrapper {
    padding: calc(var(--padding) * 1) 0;
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
  }

  @media only screen and (max-width: 767px) {
    .home_header__announcment__wrapper {
      flex-direction: column;
      gap: 1rem;
    }
  }
  
  .home_header__announcment__wrapper p {
    font-size: 1.4rem;
    margin-bottom: 0;
    font-weight: 700;
  }

  @media only screen and (max-width: 767px) {
    .home_header__announcment__wrapper p {
      max-width: 30ch;
    }
  }
  
  .home_header__announcment__wrapper a {
    font-size: 1.4rem;
    margin-bottom: 0;
    font-weight: 700;
    text-decoration: none;
    background: rgba(27, 27, 27, 0.5);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    padding: calc(var(--padding) * 1) calc(var(--padding) * 2);
    transition: all ease 0.3s;
  }
  
  .home_header__announcment__wrapper a:hover {
    background: var(--white);
    color: var(--light-blue);
  }
  
  .home_header__main__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: calc(var(--padding) * 3) 0;
  }

  @media only screen and (max-width: 767px) {
    .home_header__main__wrapper {
      justify-content: center;
    }
  }
  
  .home_header__main__logo,
  .home_header__main__menu,
  .home_header__main__social {
    display: flex;
    justify-content: center;
    width: 177px;
  }

  .home_header__main__menu {
    width: auto;
    flex: 1;
    display: flex;
    gap: 5rem;
  }
  
  .home_header__main__menu button {
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    position: relative;
    color: var(--white);
    transition: all ease 0.3s;
    line-height: 1;
  }
  
  .home_header__main__menu button:hover {
    opacity: 0.8;
  }
  
  .home_header__main__menu button:before {
    position: absolute;
    content: url("/landing-images/home-button-bg.png");
    left: 0;
    right: 0;
    bottom: -15px;
  }

  .home_header__main__menu a {
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    position: relative;
    color: var(--white);
    transition: all ease 0.3s;
    text-decoration: none;
  }
  
  .home_header__main__menu a:hover {
    opacity: 0.8;
  }
  
  .home_header__main__menu a:before {
    position: absolute;
    content: url("/landing-images/home-button-bg.png");
    left: 0;
    right: 0;
    bottom: -15px;
  }
  
  .home_header__main__social {
    justify-content: flex-end;
  }

  @media only screen and (max-width: 767px) {
    .home_header__main__menu, .home_header__main__social {
      display: none;
    }
  }
  
  .home_signup {
    position: relative;
  }
  
  .home_signup__wrapper {
    padding: calc(var(--padding) * 15) 0;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    .home_signup__wrapper {
      padding: calc(var(--padding) * 10) 0;
      position: relative;
    }
  }
  
  .home_signup__wrapper::before {
    content: "";
    position: absolute;
    top: 20%;
    bottom: 10%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    transform: translate(-50%);
    background: var(--dark-blue);
    filter: blur(200px);
  }
  
  .home_signup__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .home_signup__content h1 {
    font-size: 7rem;
    max-width: 15ch;
    line-height: 1;
  }
  
  @media only screen and (max-width: 767px) {
    .home_signup__content h1 {
      font-size: 4rem;
    }
  }
  
  .home_signup__content h2 {
    font-size: 7rem;
    max-width: 18ch;
    line-height: 0.9;
  }

  @media only screen and (max-width: 767px) {
    .home_signup__content h2 {
      font-size: 4rem;
    }
  }  
  
  .home_signup__content p {
    font-size: 2rem;
    opacity: 0.6;
    margin: calc(var(--margin) * 3) 0 calc(var(--margin) * 6) 0;
  }

  @media only screen and (max-width: 767px) {
    .home_signup__content p {
      font-size: 1.8rem;
      margin: calc(var(--margin) * 2) 0 calc(var(--margin) * 4) 0;
      max-width: 24ch;
    }
  }
  
  .home_signup__content__form {
    width: 100%;
    max-width: 95rem;
    background: linear-gradient(180deg, #5e00ff 0%, rgba(94, 0, 255, 0.58) 100%);
    border-radius: calc(var(--border-radius) * 1.6);
    padding: calc(var(--padding) * 3);
    display: flex;
    align-items: center;
    gap: 5rem;
  }

  .home_signup__content__form--waitlist {
    background: #121116;
    max-width: 55rem;
  }
  
  .home_signup__content__form--waitlist .gw-text-2xl {
    font-size: 2.4rem !important;
    margin-bottom: 2rem !important;
    font-family: "Neue Haas Grotesk Display Pro";
  }
  
  .home_signup__content__form--waitlist .gw-mt-2 span {
    display: none !important;
  }
  
  .home_signup__content__form--waitlist input.gw-w-full, .home_signup__content__form--waitlist button.gw-w-full {
    font-size: 1.6rem !important;
  }
  
  .home_signup__content__form--waitlist .gw-text-sm {
    font-size: 1.2rem !important;
  }
  
  .home_signup__content__form--waitlist .gw-text-xs {
    font-size: 1.2rem !important;
  }

  @media only screen and (max-width: 767px) {
    .home_signup__content__form {
      flex-direction: column;
      gap: 2rem;
    }
  }
  
  .home_signup__content__form__wrapper {
    width: 55%;
  }

  @media only screen and (max-width: 767px) {
    .home_signup__content__form__wrapper {
      width: 100%;
    }
  }
  
  
  .home_build {
    position: relative;
  }
  
  .home_build__wrapper {
    position: relative;
    background: rgba(94, 0, 255, 0.2);
    border-radius: calc(var(--border-radius) * 2.4);
  }
  
  .home_build__content {
    position: relative;
    display: flex;
    z-index: 2;
  }

  @media only screen and (max-width: 767px) {
    .home_build__content {
      flex-direction: column
    }
  }
  
  .home_build__content__left {
    width: 53%;
    padding: calc(var(--padding) * 4);
    text-align: left;
  }

  @media only screen and (max-width: 767px) {
    .home_build__content__left {
      width: 100%;
    }
  }
  
  .home_build__content__left h2 {
    font-size: 4.5rem;
    line-height: 0.9;
    max-width: 16ch;
  }

  @media only screen and (max-width: 767px) {
    .home_build__content__left h2 {
      font-size: 3.6rem;
      max-width: none;
    }
  }
  
  .home_build__content__left p {
    font-size: 2rem;
    max-width: 32ch;
  }

  @media only screen and (max-width: 767px) {
    .home_build__content__left p {
      font-size: 1.6rem;
      max-width: none;
      margin-bottom: calc(var(--margin) * 6);
    }
  }
  
  .home_build__content__right {
    width: 47%;
    background: rgba(94, 0, 255, 0.2);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    border-radius: calc(var(--border-radius) * 2.4);
    transform: translatex(2rem) translatey(-5rem);
    padding: calc(var(--padding) * 4);
    text-align: left;
  }

  @media only screen and (max-width: 767px) {
    .home_build__content__right {
      width: 100%;
      transform: translatex(2rem) translatey(-8rem);
    }
  }
  
  .home_build__content__right h2 {
    font-size: 4.5rem;
    line-height: 0.9;
    max-width: 16ch;
    margin-bottom: calc(var(--margin) * 15);
  }

  @media only screen and (max-width: 767px) {
    .home_build__content__right h2 {
      font-size: 3.6rem;
      max-width: none;
      margin-bottom: calc(var(--margin) * 2);
    }
  }
  
  .home_build__content__right h2 a {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    border-radius: calc(var(--border-radius) * 1.2);
    transition: all ease 0.3s;
  }
  
  .home_build__content__right h2 a:hover {
    background: rgba(255, 255, 255, 1);
    color: var(--dark-blue);
  }
  
  .home_build__logo {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10%;
    display: flex;
    justify-content: center;
  }

  @media only screen and (max-width: 767px) {
    .home_build__logo {
      position: absolute;
      left: -20px;
      right: 0;
      bottom: 20px;
      display: flex;
      justify-content: flex-start;
    }
  }
  
  .home_build__logo img {
    width: 100%;
    max-width: 30rem;
  }

  @media only screen and (max-width: 767px) {
    .home_build__logo img {
      max-width: 20rem;
    }
  }
  
  .home_footer {
    position: relative;
  }
  
  .home_footer__wrapper {
    padding: calc(var(--padding) * 10) 0 calc(var(--padding) * 4) 0;
    display: flex;
    justify-content: flex-end;
  }

  @media only screen and (max-width: 767px) {
    .home_footer__wrapper {
      padding: calc(var(--padding) * 4) 0;
      justify-content: center;
    }
  }

`;

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
      <GlobalStyle />
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
                  <a href="/"><img src='/landing-images/home-logo.svg'></img></a>
                </div>
                <div className='home_header__main__menu'>
                  <a href='/#developers'>For Developers</a>
                  <a href='/waitlist'>Testing Campaign</a>
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
    </>
  );
};

export default Waitlist;
