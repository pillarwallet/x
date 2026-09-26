import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  type?: 'shade' | 'main' | 'monochrome';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  disabled?: boolean | null;
  buttonType?: 'button' | 'submit' | 'reset';
}

const Button = ({ children, type, className, onClick, size = 'sm', disabled, buttonType = 'button' }: ButtonProps) => {

  const getSize = () => {
    const classes = []

    if (size === 'xs') {
      classes.push('p-1')
    }

    if (size === 'sm') {
      classes.push('px-4 py-2')
    }

    if (size === 'md') {
      classes.push('p-4')
    }

    if (size === 'lg') {
      classes.push('px-6 py-3')
    }

    if (size === 'xl') {
      classes.push('px-8 py-4')
    }

    return classes.join(' ')
  }

  const getType = () => {
    const classes = []

    if (disabled) {
      return ''
    }

    if (type === 'shade') {
      classes.push('bg-bg-5')
    }

    if (type === 'main') {
      classes.push('bg-brand')
    }

    if (type === 'monochrome') {
      classes.push('bg-transparent text-color-2 border border-color-3')
    }

    return classes.join(' ')
  }
  return (
    <button onClick={onClick} type={buttonType} className={`w-full text-color-1 rounded-sm text-sm outline-none border font-medium border-transparent ${getSize()} ${getType()} ${className}`}>
      {children}
    </button>
  );
};

export default Button;