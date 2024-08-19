import { useState, useEffect } from 'react';
import Plausible from 'plausible-tracker';

// Plausible Domain Config
const { trackEvent } = Plausible({
  domain: process.env.REACT_APP_PLAUSIBLE_DOMAIN
});

const Popup = () => {
  // Signup Popup State
  const [showPopup, setShowPopup] = useState(false);

  // Show Signup Popup
  useEffect(() => {
    const timer = setTimeout(() => {
      const popupState = window.localStorage.getItem('POPUP_STATE');
      if (popupState !== null) setShowPopup(JSON.parse(popupState));
      else setShowPopup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Embed Waitlist Widget
  useEffect(() => {
    if (showPopup) {
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
    }
  }, [showPopup]);

  return (
    <div>
      {showPopup && (
        <div className='popup'>
          <div className='popup__wrapper'>
            <button
              className='popup__close plausible-event-name=Popup+Close'
              onClick={() => {
                setShowPopup(!showPopup);
                window.localStorage.setItem('POPUP_STATE', false);
              }}
            >
              <p>&#x2715;</p>
            </button>
            <div className='popup__form'>
              {/* Embedded Code */}
              <div
                id='getWaitlistContainer'
                data-waitlist_id='17924'
                data-widget_type='WIDGET_1'
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Popup };