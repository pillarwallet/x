import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';

const LockIcon = ({ isDisabled, isActive, isHover }) => {
  const theme = useContext(ThemeContext);
  let fill = theme.text3;
  if (isHover) fill = theme.rateTextHover;
  if (isActive) fill = theme.rateTextHover;
  if (isDisabled) fill = theme.background;

  if (!!isActive !== !!isHover) {
    return (
      <svg
        style={{ zIndex: '1', marginLeft: '5px' }}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="lockIcon"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.5 7V5C9.5 4.17157 8.82843 3.5 8 3.5C7.17157 3.5 6.5 4.17157 6.5 5V7H5V5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5V7H9.5Z"
          fill={fill}
        />
        <path
          d="M3 9C3 7.89543 3.89543 7 5 7H11C12.1046 7 13 7.89543 13 9V13C13 14.1046 12.1046 15 11 15H5C3.89543 15 3 14.1046 3 13V9Z"
          fill={fill}
        />
      </svg>
    );
  }

  return (
    <svg
      style={{ zIndex: '1', marginLeft: '5px' }}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="lockIcon"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 5H11C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5V7H6.5V5C6.5 4.17157 7.17157 3.5 8 3.5C8.82843 3.5 9.5 4.17157 9.5 5Z"
        fill={fill}
      />
      <path
        d="M3 9C3 7.89543 3.89543 7 5 7H11C12.1046 7 13 7.89543 13 9V13C13 14.1046 12.1046 15 11 15H5C3.89543 15 3 14.1046 3 13V9Z"
        fill={fill}
      />
    </svg>
  );
};

LockIcon.propTypes = {
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isHover: PropTypes.bool,
}

export default LockIcon;
