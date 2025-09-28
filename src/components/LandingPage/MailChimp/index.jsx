import Plausible from 'plausible-tracker';
import { useFormFields, useMailChimpForm } from 'use-mailchimp-form';

const MailChimp = () => {
  // Plausible Custom Event
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  const { trackEvent } = Plausible({
    domain,
  });

  // Mailchimp Form
  const url =
    'https://pillarproject.us14.list-manage.com/subscribe/post?u=0056162978ccced9e0e2e2939&amp;id=2b9a9790a3&amp;f_id=0086c2e1f0';
  const { loading, error, success, message, handleSubmit } =
    useMailChimpForm(url);
  const { fields, handleFieldChange } = useFormFields({
    EMAIL: '',
  });

  return (
    <div className="mailchimp_form">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(fields);
          trackEvent('Email Signup');
        }}
      >
        <input
          id="EMAIL"
          type="email"
          placeholder="Enter your email"
          value={fields.EMAIL}
          onChange={handleFieldChange}
        />
        <button
          type="submit"
          className="cta mailchimp_form__cta plausible-event-name=Email+Signup"
        >
          <span>Subscribe</span>
        </button>
      </form>
      <p className="mailchimp_form__message">
        {loading && 'submitting'}
        {error && message}
        {success && message}
      </p>
    </div>
  );
};

export { MailChimp };
