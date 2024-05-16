import React, { useState, useEffect } from 'react';
import { useFormFields, useMailChimpForm } from 'use-mailchimp-form';

const Popup = () => {
  const [show, setShow] = useState(false);
  // Display Popup
  useEffect(() => {
    setTimeout(() => {
      setShow(!show);
    }, 5000);
  }, []);

  // Mailchimp Form
  const url = "https://pillarproject.us14.list-manage.com/subscribe/post?u=0056162978ccced9e0e2e2939&amp;id=2b9a9790a3&amp;f_id=0086c2e1f0";
  const { loading, error, success, message, handleSubmit } = useMailChimpForm(
    url
  );
  const { fields, handleFieldChange } = useFormFields({
    EMAIL: ""
  });

  return (
    <div>
      {
        show && <div className='popup'>
        <div className='popup__wrapper'>
          <button  className='popup__close' onClick={() => setShow(!show)}>
            <p>X</p>
          </button>
          <div className='popup__form'>
            <h3>Join our exclusive early access list!</h3>
            <form
              onSubmit={event => {
                event.preventDefault();
                handleSubmit(fields);
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