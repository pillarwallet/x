/*
* MIT License

* Copyright (c) 2024 Pillar

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

import { useState } from 'react';
import Plausible from 'plausible-tracker';

const Form = () => {

  // Plausible Custom Event
  const domain = process.env.REACT_APP_PLAUSIBLE_DOMAIN;
  const { trackEvent } = Plausible({
    domain: domain
  })

  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };
  return (
    <div id="mc_embed_shell">
      <div id="mc_embed_signup">
        <form
          onSubmit={event => {
            event.preventDefault();
            trackEvent('Page Signup');
            event.target.submit();
          }}
          action="https://pillarproject.us14.list-manage.com/subscribe/post?u=0056162978ccced9e0e2e2939&amp;id=2b9a9790a3&amp;f_id=0086c2e1f0"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_self"
          noValidate
        >
          <div
            id="mc_embed_signup_scroll"
          >
            <div className="mc-field-group">
              <div>
                <input
                  shape="round"
                  className="required email sm:text-center font-custom"
                  type="email"
                  name="EMAIL"
                  id="mce-EMAIL"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email*"
                />
                <span id="mce-EMAIL-HELPERTEXT" className="helper_text"></span>
              </div>
            </div>
            <div id="mce-responses" className="clear">
              <div className="response display-none" id="mce-error-response"></div>
              <div className="response display-none" id="mce-success-response"></div>
            </div>
            <div className="clear">
              <input
                type="submit"
                name="subscribe"
                id="mc-embedded-subscribe"
                value="I am in!"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export { Form };
