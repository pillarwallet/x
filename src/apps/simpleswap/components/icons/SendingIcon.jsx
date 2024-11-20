import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';

const ConfirmingIcon = ({ isActive }) => {
  const theme = useContext(ThemeContext);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle opacity="0.9" cx="8" cy="8" r="8" fill={isActive ? theme.text1 : theme.background1} />
      <path
        d="M10.8399 10.3L12.2549 6.055C12.8899 4.15 11.8499 3.115 9.94492 3.745L5.69992 5.16C2.84492 6.11 2.84492 7.67 5.69992 8.62L6.95992 9.04L7.37992 10.3C8.32992 13.155 9.88492 13.155 10.8399 10.3Z"
        stroke={isActive ? theme.activeIconStroke : theme.addressBlockText}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.1757 8.94501L8.9707 7.15501"
        stroke={isActive ? theme.activeIconStroke : theme.addressBlockText}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
ConfirmingIcon.propTypes = {
  isActive: PropTypes.bool,
}
export default ConfirmingIcon;
