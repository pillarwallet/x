import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';

const PendingIcon = ({ isActive }) => {
  const theme = useContext(ThemeContext);

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="8" fill={isActive ? theme.text1 : theme.background1} />
      <path
        d="M8 13C10.75 13 13 10.75 13 8C13 5.25 10.75 3 8 3C5.25 3 3 5.25 3 8C3 10.75 5.25 13 8 13Z"
        stroke={isActive ? theme.activeIconStroke : theme.addressBlockText}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99725 8H10.0017"
        stroke={isActive ? theme.activeIconStroke : theme.addressBlockText}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99725 8H8.00174"
        stroke={isActive ? theme.activeIconStroke : theme.addressBlockText}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.99725 8H6.00174"
        stroke={isActive ? theme.activeIconStroke : theme.addressBlockText}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

PendingIcon.propTypes = {
  isActive: PropTypes.bool,
}

export default PendingIcon;
