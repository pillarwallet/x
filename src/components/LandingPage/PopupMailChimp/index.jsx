import Plausible from 'plausible-tracker';
import { useEffect, useState } from 'react';
import { useFormFields, useMailChimpForm } from 'use-mailchimp-form';

const PopupMailChimp = () => {
  // Plausible Custom Event
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  const { trackEvent } = Plausible({
    domain,
  });

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

  // Mailchimp Form
  const url =
    'https://pillarproject.us14.list-manage.com/subscribe/post?u=0056162978ccced9e0e2e2939&amp;id=2b9a9790a3&amp;f_id=0086c2e1f0';
  const { loading, error, success, message, handleSubmit } =
    useMailChimpForm(url);
  const { fields, handleFieldChange } = useFormFields({
    EMAIL: '',
  });

  return (
    <div>
      {showPopup && (
        <div className="popup">
          <div className="popup__wrapper">
            <button
              type="button"
              className="popup__close plausible-event-name=Popup+Close"
              onClick={() => {
                setShowPopup(!showPopup);
                window.localStorage.setItem('POPUP_STATE', false);
              }}
            >
              <p>&#x2715;</p>
            </button>
            <div className="popup__form">
              <h3>
                Join the early access list now and be among the first to try
                PillarX!
              </h3>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit(fields);
                  window.localStorage.setItem('POPUP_STATE', false);
                  trackEvent('Popup Signup');
                }}
              >
                <input
                  id="EMAIL"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  type="email"
                  placeholder="Enter your email"
                  value={fields.EMAIL}
                  onChange={handleFieldChange}
                />
                <button
                  type="button"
                  className="plausible-event-name=Popup+Signup"
                >
                  Join now
                </button>
              </form>
              {loading && 'submitting'}
              {error && message}
              {success && message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { PopupMailChimp };
