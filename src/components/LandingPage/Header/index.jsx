/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState, useEffect } from 'react';
import { Link, NavLink, ScrollRestoration } from 'react-router-dom';

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        // if scroll down hide the navbar
        setIsVisible(false);
      } else {
        // if scroll up show the navbar
        setIsVisible(true);
      }
      // remember current page location to use in the next move
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <>
      {/* Browser's scroll restoration  */}
      <ScrollRestoration />

      {/* Header */}
      <header
        className={`header ${isVisible ? '' : 'header--hidden'}`}
        id="header"
      >
        <div className="container">
          <Link to="/" className="header__logo">
            <img src="/landing-images/pillarXLogo.png" alt="pillar-x-logo" />
          </Link>

          <nav
            className={
              showMobileMenu
                ? 'header__menu header__menu--show'
                : 'header__menu'
            }
          >
            <ul id="menu" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <li>
                <NavLink
                  to="/developers"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  For dApps
                </NavLink>
              </li>
              <li>
                <NavLink
                  reloadDocument
                  to="/waitlist"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Testing Campaign
                </NavLink>
              </li>
            </ul>

            <a
              href="https://twitter.com/PX_Web3"
              target="_blank"
              rel="noreferrer"
              className="header__social"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <img src="/landing-images/home-x.svg" alt="home-image" />
            </a>
          </nav>

          <div
            className={
              showMobileMenu
                ? 'header__mobile_menu header__mobile_menu--change'
                : 'header__mobile_menu'
            }
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
        </div>
      </header>
    </>
  );
};

export { Header };
