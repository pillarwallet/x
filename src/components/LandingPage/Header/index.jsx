import { useState, useEffect } from 'react';
import { Link, NavLink, ScrollRestoration } from 'react-router-dom';


const Header = () => {

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
          setIsVisible(false);
        } else { // if scroll up show the navbar
          setIsVisible(true);
        }
        // remember current page location to use in the next move
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <>
      {/* Browser's scroll restoration  */}
      <ScrollRestoration />

      {/* Header */}
      <header className={`header ${isVisible ? '' : 'header--hidden'}`} id='header'>

        {/* Header Announcement*/}
        <div className='header__announcement'>
          <div className='header__announcement__wrapper'>
            <p>🚀 Secure Your Spot in the PillarX Testing Campaign! <a href='/waitlist'>Join the Waitlist</a></p>
            <a href='/waitlist' className='cta cta--secondary cta--header plausible-event-name=Banner+Click'><span>Join the Waitlist</span></a>
          </div>
        </div>

        <div className='container'>
          
          <Link reloadDocument to='/' className='header__logo'>
            <img src='/landing-images/pillarXLogo.png'/>
          </Link>
          
          <nav className= {showMobileMenu ? 'header__menu header__menu--show' : 'header__menu'}>
            <ul id='menu' onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <li>
                <NavLink to='/developers' className={({ isActive }) => (isActive ? 'active' : '')}>For dApps</NavLink>
              </li>
              <li>
                <NavLink reloadDocument to='/waitlist' className={({ isActive }) => (isActive ? 'active' : '')}>Testing Campaign</NavLink>
              </li>
            </ul>
            
            <a href='https://twitter.com/PX_Web3' target='_blank' rel='noreferrer' className='header__social' onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <img src='/landing-images/home-x.svg'/>
            </a>
          </nav>

          <div className= {showMobileMenu ? 'header__mobile_menu header__mobile_menu--change' : 'header__mobile_menu'} onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <div className='bar1'></div>
            <div className='bar2'></div>
            <div className='bar3'></div>
          </div>
          
        </div>
      </header>
    </>
  );
};

export { Header };
