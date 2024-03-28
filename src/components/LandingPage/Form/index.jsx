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

const Form = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };
  return (
    <div id="mc_embed_shell">
      <div id="mc_embed_signup">
        <form
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
            className="flex flex-row items-center justify-center sm:gap-1 md:gap-3 gap-5"
          >
            <div className="mc-field-group">
              <div className="flex items-center justify-center text-black-900_87 text-[15px] bg-blue_gray-100 rounded-[10px] h-12 p-2  sm:w-full md:w-[150px] w-[350px]">
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
                className="button h-12 sm:px-5 min-w-[159px] font-custom flex items-center justify-center text-center cursor-pointer text-blue_gray-100 tracking-[-0.50px] text-[15px] font-bold bg-deep_purple-A700 rounded-[10px] font-custom"
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
