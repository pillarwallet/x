import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const SimpleArrowIcon = () => {
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
        d="M9.94493 11.6475L7.30493 9.00004L9.94493 6.35254"
        stroke={theme.addressBlockText}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SimpleArrowIcon;
