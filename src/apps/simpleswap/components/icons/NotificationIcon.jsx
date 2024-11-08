import PropTypes from 'prop-types';

const NotificationIcon = ({ color }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4.5C7.875 4.5 4.5 7.875 4.5 12C4.5 16.125 7.875 19.5 12 19.5C16.125 19.5 19.5 16.125 19.5 12C19.5 7.875 16.125 4.5 12 4.5Z"
        fill={color}
      />
      <path
        d="M12 15L12 11.25"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0041 9L11.9974 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

NotificationIcon.propTypes = {
  color: PropTypes.string,
}

export default NotificationIcon;
