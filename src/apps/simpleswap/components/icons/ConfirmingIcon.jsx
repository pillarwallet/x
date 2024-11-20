import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';

const ConfirmingIcon = ({ isActive }) => {
  const theme = useContext(ThemeContext);

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle opacity="0.9" cx="8" cy="8" r="8" fill={isActive ? theme.text1 : theme.background1} />
      <path
        d="M12.835 9.275C12.27 11.42 10.32 13 8 13C5.24 13 3 10.78 3 8C3 4.665 5.78 3 5.78 3M5.78 3L3.5 3M5.78 3L5.78 4.005L5.78 5.22"
        stroke={isActive ? theme.activeIconStroke : theme.addressBlockText}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 3C10.76 3 13 5.24 13 8"
        stroke={isActive ? theme.activeIconStroke : theme.addressBlockText}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 2"
      />
    </svg>
  );
};

ConfirmingIcon.propTypes = {
  isActive: PropTypes.bool,
}

export default ConfirmingIcon;
