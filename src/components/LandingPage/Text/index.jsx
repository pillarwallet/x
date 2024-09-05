/*
* MIT License

* Copyright (c) 2024 Pillar

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

import PropTypes from 'prop-types';

const sizes = {
  xs: 'text-lg font-normal leading-[130%]',
  s: 'text-2xl font-normal leading-[130%]',
};

const Text = ({ children, className = '', as, size = 'xs', ...restProps }) => {
  const Component = as || 'p';

  return (
    <Component
      className={`text-white-A700 font-custom ${className} ${sizes[size]}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restProps}
    >
      {children}
    </Component>
  );
};

Text.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  size: PropTypes.oneOf(['xs', 's']),
  as: PropTypes.string,
};

export { Text };
