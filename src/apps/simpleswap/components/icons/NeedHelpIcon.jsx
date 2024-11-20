import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const NeedHelpIcon = () => {
  const theme = useContext(ThemeContext);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M11.334 12.2867H8.66732L5.70064 14.26C5.26064 14.5533 4.66732 14.24 4.66732 13.7067V12.2867C2.66732 12.2867 1.33398 10.9534 1.33398 8.95337V4.95333C1.33398 2.95333 2.66732 1.62 4.66732 1.62H11.334C13.334 1.62 14.6673 2.95333 14.6673 4.95333V8.95337C14.6673 10.9534 13.334 12.2867 11.334 12.2867Z"
        fill={theme.text3}
      />
      <path
        d="M7.99923 7.5733V7.43333C7.99923 6.98 8.27924 6.73998 8.55924 6.54665C8.83258 6.35998 9.10588 6.11999 9.10588 5.67999C9.10588 5.06666 8.61256 4.5733 7.99923 4.5733C7.38589 4.5733 6.89258 5.06666 6.89258 5.67999"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99609 9.16669H8.00209"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NeedHelpIcon;
