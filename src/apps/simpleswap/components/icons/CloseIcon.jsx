import PropTypes from 'prop-types';

const CloseIcon = ({ color = '#EE9500' }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 18L18 6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={color}
      />
      <path
        d="M18 18L6 6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={color}
      />
    </svg>
  );
};

CloseIcon.propTypes = {
  color: PropTypes.string,
}

export default CloseIcon;
