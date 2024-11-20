import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const RefreshIcon = () => {
  const theme = useContext(ThemeContext);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      style={{ marginRight: '8px' }}
    >
      <path
        d="M9.09375 13.5438C11.775 12.8375 13.75 10.4 13.75 7.5C13.75 4.05 10.975 1.25 7.5 1.25C3.33125 1.25 1.25 4.725 1.25 4.725M1.25 4.725V1.875M1.25 4.725H2.50625H4.025"
        stroke={theme.buttonText}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.25 7.5C1.25 10.95 4.05 13.75 7.5 13.75"
        stroke={theme.buttonText}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 3"
      />
    </svg>
  );
};

export default RefreshIcon;
