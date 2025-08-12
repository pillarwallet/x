/* eslint-disable react/jsx-props-no-spreading */
import { GlobalStyles } from '../components/LandingPage/GlobalStyles';

// components
import { Footer } from '../components/LandingPage/Footer';
import { Header } from '../components/LandingPage/Header';

const Privacy = () => {
  return (
    <>
      {/* Global Styles */}
      <GlobalStyles />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="privacy">
        <div className="container">
          <div className="privacy__wrapper">
            <h1>Cookies & Privacy Policy – pillarx.app</h1>
            <p>
              Privacy Policy of{' '}
              <a href="https://pillarx.app/" target="_blank" rel="noreferrer">
                https://pillarx.app/
              </a>{' '}
              (‘The Website’, ‘we’, ‘us’, ‘our’) understands that your privacy
              is important to you and that you care about how your personal data
              is used. We respect and value the privacy of everyone who visits
              this website,{' '}
              <a href="https://pillarx.app/" target="_blank" rel="noreferrer">
                https://pillarx.app/
              </a>
              , and protecting your data is important to us. We will only
              collect and use personal data in ways that are described here, and
              in a way that is consistent with our obligations and your rights
              under the law.
            </p>
            <p>
              This privacy policy describes how we collect, use, and share
              personal information when you browse, sign up for, and access our
              services. The services we provide are detailed on our{' '}
              <a href="https://pillarx.app/" target="_blank" rel="noreferrer">
                homepage
              </a>
              . We may update this Privacy Policy from time to time, as outlined
              below. You should not use the website or our services if you have
              any objections to our Privacy Policy, which is binding upon all
              users of the website. If you do not agree with the terms set forth
              in this Privacy Policy, please do not use the website.
            </p>
            <h2>Analytics</h2>
            <p>
              We use{' '}
              <a href="https://plausible.io/" target="_blank" rel="noreferrer">
                Plausible Analytics
              </a>{' '}
              to collect anonymous usage data for statistical and analytical
              purposes. Plausible is a privacy-focused, GDPR-, CCPA-, and
              PECR-compliant analytics tool that does not use cookies and does
              not collect any personal data. It helps us understand overall
              trends in website traffic and user behavior without tracking
              individual users.
            </p>
            <h2>Cookies</h2>
            <p>
              Cookies are data which can be stored in your web browser by
              websites you visit. However, we do not use cookies for analytics
              or behavioral tracking. Our website may use strictly necessary
              cookies for functionality and performance purposes only (e.g., to
              optimize content delivery via services like Cloudflare). You can
              manage your cookie preferences through your browser settings.
            </p>
            <h2>Backup Saving and Management</h2>
            <p>
              Backup on Google Drive – Personal Data: various types of data as
              specified in the privacy policy of the service.
            </p>
            <h2>Contacting the User</h2>
            <p>
              Contact form and mailing list/newsletter – Personal Data: email
              address.
            </p>
            <h2>Interaction with External Social Networks and Platforms</h2>
            <p>
              Twitter: Tweet button and social widgets – Personal Data: Cookies;
              Usage Data.
            </p>
            <h2>Sharing Your Personal Information</h2>
            <p>
              We may disclose the information you provide to us when we believe
              disclosure is appropriate to comply with legal obligations,
              enforce our terms and policies, or protect the rights, property,
              or safety of our company, our users, or others.
            </p>
            <h2>Individual Data Rights</h2>
            <p>
              The website is not intended for use by persons under the age of
              18. If you become aware that someone under the age of 18 has
              unlawfully provided us with data, please contact us at{' '}
              <a
                href="mailto:legal@pillarproject.io"
                target="_blank"
                rel="noreferrer"
              >
                legal@pillarproject.io
              </a>
              . We will take necessary steps to remove their data and delete any
              accounts they may hold with us, and we will make reasonable
              efforts to restrict their access to our services.
            </p>
            <h2>Changes</h2>
            <p>
              We may update this Privacy Policy from time to time for
              operational, legal, or regulatory reasons. Any updates will be
              reflected on this page. By continuing to use the website and its
              services, you agree to the terms of the current Privacy Policy.
            </p>
            <h2>Contact Information</h2>
            <p>
              Owner and Data Controller:
              <br />
              Pillar Project A.G.
              <br />
              Bahnhofstrasse 21, 6300 Zug,
              <br />
              Switzerland
            </p>
            <p>
              Owner Contact Email:
              <br />
              <a
                href="mailto:dpo@pillarproject.io"
                target="_blank"
                rel="noreferrer"
              >
                dpo@pillarproject.io
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Privacy;
