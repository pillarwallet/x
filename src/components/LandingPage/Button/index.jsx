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

const shapes = {
  round: 'rounded-[10px]',
};
const variants = {
  fill: {
    deep_purple: 'bg-deep_purple-A700 text-blue_gray-100',
  },
};
const sizes = {
  xs: 'h-[48px] px-[35px] text-[15px]',
};

const Button = ({
  children,
  className = '',
  leftIcon,
  rightIcon,
  shape = '',
  variant = 'fill',
  size = 'xs',
  color = 'deep_purple',
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex items-center justify-center text-center cursor-pointer text-blue_gray-100 tracking-[-0.50px] text-[15px] font-bold bg-deep_purple-A700 rounded-[10px] ${(shape && shapes[shape]) || ''} ${(size && sizes[size]) || ''} ${(variant && variants[variant]?.[color]) || ''}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  shape: PropTypes.oneOf(['round']),
  size: PropTypes.oneOf(['xs']),
  variant: PropTypes.oneOf(['fill']),
  color: PropTypes.oneOf(['deep_purple']),
};

export { Button };
