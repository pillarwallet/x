/* eslint-disable jsx-a11y/control-has-associated-label */
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__wrapper">
            <div className="footer__links">
              <Link to="/privacy-policy">Privacy Policy</Link>
            </div>
            <div className="footer__socials">
              <a href="https://x.com/PX_Web3" target="_blank" rel="noreferrer">
                <img src="https://cdn.pillarx.app/home-x.svg" alt="x-image" />
              </a>
              <a
                href="https://t.me/+WmZpena91_dlNDhk"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://cdn.pillarx.app/social-telegram.svg"
                  alt="home-image"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export { Footer };
