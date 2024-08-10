import { useState } from 'react';
import { Link,  NavLink } from 'react-router-dom';


const Header = () => {

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <>
      
      {/* Header */}
      <header className='header' id='header'>

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
                <NavLink to='/developers' className={({ isActive }) => (isActive ? 'active' : '')}>For Developers</NavLink>
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
