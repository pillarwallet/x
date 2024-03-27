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

import React from 'react';
import PropTypes from 'prop-types';

const shapes = {
  round: 'rounded-[10px]',
};
const variants = {
  fill: {
    blue_gray: 'bg-blue_gray-100 text-black-900_87',
  },
};
const sizes = {
  xs: 'h-[48px] pl-[18px] pr-[35px] text-[15px]',
};

const Input = React.forwardRef(function Input(
  {
    className = '',
    name = '',
    placeholder = '',
    type = 'text',
    label = '',
    prefix,
    suffix,
    onChange,
    shape = '',
    variant = 'fill',
    size = 'xs',
    color = 'blue_gray',
    ...restProps
  },
  ref
) {
  const handleChange = (e) => {
    if (onChange) onChange(e?.target?.value);
  };

  return (
    <>
      <div
        className={`${className} flex items-center justify-center text-black-900_87 text-[15px] bg-blue_gray-100 rounded-[10px] ${shapes[shape] || ''} ${variants[variant]?.[color] || variants[variant] || ''} ${sizes[size] || ''}`}
      >
        {!!label && label}
        {!!prefix && prefix}
        <input ref={ref} type={type} name={name} onChange={handleChange} placeholder={placeholder} {...restProps} />
        {!!suffix && suffix}
      </div>
    </>
  );
});

Input.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  shape: PropTypes.oneOf(['round']),
  size: PropTypes.oneOf(['xs']),
  variant: PropTypes.oneOf(['fill']),
  color: PropTypes.oneOf(['blue_gray_100']),
  onChange: PropTypes.func,
};

export { Input };
