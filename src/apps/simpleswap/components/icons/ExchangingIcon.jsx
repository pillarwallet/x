import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';

const ExchangingIcon = ({ isActive }) => {
  const theme = useContext(ThemeContext);

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle opacity="0.9" cx="8" cy="8" r="8" fill={isActive ? theme.text1 : theme.background1} />
      <path
        d="M12.21 4.57996L5.28995 4.57996C4.45995 4.57996 3.78995 5.24996 3.78995 6.07996L3.78995 7.73996"
        stroke={isActive ? theme.activeIconStroke : theme.addressBlockText}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.63 3L12.21 4.57999L10.63 6.16"
        stroke={isActive ? theme.activeIconStroke : theme.addressBlockText}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.78995 11.42L10.71 11.42C11.54 11.42 12.21 10.75 12.21 9.92001L12.21 8.26001"
        stroke={isActive ? theme.activeIconStroke : theme.addressBlockText}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.36987 13L3.78987 11.42L5.36987 9.83997"
        stroke={isActive ? theme.activeIconStroke : theme.addressBlockText}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

ExchangingIcon.propTypes = {
  isActive: PropTypes.bool,
}

export default ExchangingIcon;
