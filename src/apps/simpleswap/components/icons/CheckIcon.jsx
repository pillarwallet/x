import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const CheckIcon = () => {
  const theme = useContext(ThemeContext);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="#3FBB7D" />
      <path
        d="M4 8L6.99647 11L13 5"
        stroke={theme.checkboxColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckIcon;
