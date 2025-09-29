/* eslint-disable react/jsx-props-no-spreading */
import { GlobalStyles } from '../components/LandingPage/GlobalStyles';

// components
import { Footer } from '../components/LandingPage/Footer';
import { Header } from '../components/LandingPage/Header';

const Marketing = () => {

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

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Marketing;
