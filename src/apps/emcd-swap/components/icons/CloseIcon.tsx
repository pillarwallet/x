import React, { ReactNode } from 'react';

interface CloseIconProps {
  className?: string;
}

const CloseIcon: React.FC<CloseIconProps> = ({ className  }) => {
  return (
    <div className={className}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill='currentColor' xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M13.4115 12.0003L18.6886 17.2822C19.079 17.6729 19.0787 18.306 18.688 18.6964C18.2973 19.0867 17.6641 19.0864 17.2738 18.6957L11.9963 13.4135L6.70658 18.6953C6.31577 19.0856 5.6826 19.0851 5.29237 18.6943C4.90213 18.3035 4.9026 17.6703 5.29342 17.2801L10.5827 11.9986L5.29565 6.70679C4.9053 6.31609 4.90559 5.68292 5.29629 5.29257C5.68699 4.90223 6.32016 4.90251 6.7105 5.29321L11.998 10.5855L17.2739 5.31734C17.6648 4.92711 18.2979 4.92758 18.6881 5.31839C19.0784 5.70921 19.0779 6.34237 18.6871 6.73261L13.4115 12.0003Z" />
      </svg>
    </div>
  );
};

export default CloseIcon;