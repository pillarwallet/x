/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect } from 'react';

const EmailOctopus = () => {
  // Email Octopus Subscriber Form
  useEffect(() => {
    const container = document.getElementById('octopusForm');
    if (container) {
      container.innerHTML = '';

      const script = document.createElement('script');
      script.src =
        'https://eomail5.com/form/6b7992da-c46a-11f0-9bf4-5919083e820b.js';
      script.async = true;
      script.setAttribute('data-form', '6b7992da-c46a-11f0-9bf4-5919083e820b');

      container.appendChild(script);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, []);

  return <div id="octopusForm" />;
};

export { EmailOctopus };
