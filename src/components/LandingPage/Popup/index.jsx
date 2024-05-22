import { useState, useEffect } from 'react';
import { useFormFields, useMailChimpForm } from 'use-mailchimp-form';

const Popup = () => {
  // Signup Popup State
  const [showPopup, setShowPopup] = useState(false);

  //Show Signup Popup
  useEffect(() => {
    const timer = setTimeout(() => {
      const popupState = window.localStorage.getItem('POPUP_STATE');
      if ( popupState !== null ) setShowPopup(JSON.parse(popupState)) 
      else setShowPopup(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Mailchimp Form
  const url = 'https://pillarproject.us14.list-manage.com/subscribe/post?u=0056162978ccced9e0e2e2939&amp;id=2b9a9790a3&amp;f_id=0086c2e1f0';
  const { loading, error, success, message, handleSubmit } = useMailChimpForm(
    url
  );
  const { fields, handleFieldChange } = useFormFields({
    EMAIL: ''
  });

  return (
    <div>
      {
        showPopup && <div className='popup'>
        <div className='popup__wrapper'>
          <button  className='popup__close' onClick={() => {setShowPopup(!showPopup); window.localStorage.setItem('POPUP_STATE', false);}}>
            <p>&#x2715;</p>
          </button>
          <div className='popup__form'>
            <h3>Join the early access list now and be among the first to try PillarX!</h3>
            <form
              onSubmit={event => {
                event.preventDefault();
                handleSubmit(fields);
                window.localStorage.setItem('POPUP_STATE', false);
              }}
            >
              <input
                id='EMAIL'
                autoFocus
                type='email'
                placeholder='Enter your email'
                value={fields.EMAIL}
                onChange={handleFieldChange}
              />
              <button>Join now</button>
            </form>
            {loading && 'submitting'}
            {error && message}
            {success && message}
        </div>
  
        
        </div>
      </div>
      }
    </div>
  );
};

export { Popup };