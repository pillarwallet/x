/* eslint-disable jsx-a11y/control-has-associated-label */
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__wrapper">
            <div className="footer__disclaimer">
              <p>
                The content on this website is for informational purposes only
                and does not constitute financial or investment advice.
                Cryptocurrency assets are volatile and carry market risk. Always
                do your own research and seek professional guidance before
                making investment decisions.
              </p>
            </div>
            <div className="footer__links_wrapper">
              <div className="footer__links">
                <Link to="/privacy-policy">Privacy Policy</Link>
              </div>
              <div className="footer__socials">
                <a
                  href="https://x.com/PX_Web3"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="https://cdn.pillarx.app/social-x.svg"
                    alt="x-image"
                  />
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
                <a
                  href="https://chat.pillar.fi/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="https://cdn.pillarx.app/social-discord.svg"
                    alt="discord-image"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export { Footer };
