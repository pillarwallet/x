import React, { ReactNode } from 'react';

enum BUTTON_ENUM {
  SHADE = 'shade',
  MAIN = 'main',
}

interface ButtonProps {
  children: ReactNode;
  type?: 'shade' | 'main' | 'monochrome';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  disabled?: boolean | null;
}

const Button = ({ children, type, className, onClick, size = 'sm', disabled }: ButtonProps) => {

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

    return classes.join(' ')
  }

  const getType = () => {
    const classes = []

    if (disabled) {
      return ''
    }

    if (type === BUTTON_ENUM.SHADE) {
      classes.push('bg-bg-5')
    }

    if (type === BUTTON_ENUM.MAIN) {
      classes.push('bg-brand')
    }

    return classes.join(' ')
  }
  return (
    <button onClick={onClick} className={`w-full text-color-1 rounded-sm text-sm outline-none border font-medium border-transparent ${getSize()} ${getType()} ${className}`}>
      {children}
    </button>
  );
};

export default Button;