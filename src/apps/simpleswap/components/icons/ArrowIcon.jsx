import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const LockIcon = () => {
  const theme = useContext(ThemeContext);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M10.8225 4.44727L15.375 8.99977L10.8225 13.5523"
        stroke={theme.text3}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.625 9H15.2475"
        stroke={theme.text3}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LockIcon;
