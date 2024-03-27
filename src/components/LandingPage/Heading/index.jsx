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
  s: 'text-6xl font-bold leading-[100%]',
  xs: 'text-lg font-bold leading-[120%]',
};

const Heading = ({ children, className = '', size = 's', as, ...restProps }) => {
  const Component = as || 'h6';

  return (
    <Component className={`text-white-A700 font-custom ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

Heading.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  leftIcon: PropTypes.node,
  size: PropTypes.oneOf(['xs']),
  as: PropTypes.string,
};

export { Heading };
