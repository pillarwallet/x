import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';

const TriangleIcon = ({ color }) => {
  const theme = useContext(ThemeContext);

  const fill = color || theme.copyIconHoverBackground;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 12 6"
      fill="none"
    >
      <path
        d="M4.52569 4.39166C5.31836 5.2564 6.68163 5.2564 7.47431 4.39166L11.5 0H0.5L4.52569 4.39166Z"
        fill={fill}
      />
    </svg>
  );
};

TriangleIcon.propTypes = {
  color: PropTypes.string,
}

export default TriangleIcon;
