import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';

const TriangleIcon = ({ isActive }) => {
  const theme = useContext(ThemeContext);

  if (isActive) {
    return (
      <svg
        style={{ position: 'absolute', transform: 'translateX(3px)' }}
        width="34"
        height="48"
        viewBox="0 0 34 48"
        className="triangleIcon"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="17" cy="24" r="12" transform="rotate(-90 17 24)" fill={theme.background1} />
        <mask id="path-2-inside-1" fill="white">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M32 24C32 15.7157 25.2843 9 17 9C8.71573 9 2 15.7157 2 24C2 32.2843 8.71573 39 17 39C25.2843 39 32 32.2843 32 24ZM34 24C34 14.6112 26.3888 7 17 7C7.61116 7 0 14.6112 0 24C0 33.3888 7.61116 41 17 41C26.3888 41 34 33.3888 34 24Z"
          />
        </mask>
        <path
          d="M17 10C24.732 10 31 16.268 31 24H33C33 15.1634 25.8366 8 17 8V10ZM3 24C3 16.268 9.26801 10 17 10V8C8.16344 8 1 15.1634 1 24H3ZM17 38C9.26801 38 3 31.732 3 24H1C1 32.8366 8.16344 40 17 40V38ZM31 24C31 31.732 24.732 38 17 38V40C25.8366 40 33 32.8366 33 24H31ZM17 8C25.8366 8 33 15.1634 33 24H35C35 14.0589 26.9411 6 17 6V8ZM1 24C1 15.1634 8.16344 8 17 8V6C7.05887 6 -1 14.0589 -1 24H1ZM17 40C8.16344 40 1 32.8366 1 24H-1C-1 33.9411 7.05887 42 17 42V40ZM33 24C33 32.8366 25.8366 40 17 40V42C26.9411 42 35 33.9411 35 24H33Z"
          fill={theme.background1}
          mask="url(#path-2-inside-1)"
        />
        <path d="M16 39H18V48H16V39Z" fill={theme.background1} />
        <path d="M16 0H18V9H16V0Z" fill={theme.background1} />
      </svg>
    );
  }

  return (
    <svg
      style={{ position: 'absolute' }}
      width="29"
      height="48"
      viewBox="0 0 29 48"
      fill="none"
      className="triangleIcon"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="17" cy="24" r="12" transform="rotate(-90 17 24)" fill={theme.background1} />
      <mask id="path-2-inside-1" fill="white">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17 7C7.61116 7 0 14.6112 0 24C0 33.3888 7.61116 41 17 41V39C8.71573 39 2 32.2843 2 24C2 15.7157 8.71573 9 17 9V7Z"
        />
      </mask>
      <path
        d="M17 7H18V6H17V7ZM17 41V42H18V41H17ZM17 39H18V38H17V39ZM17 9V10H18V9H17ZM17 6C7.05887 6 -1 14.0589 -1 24H1C1 15.1634 8.16344 8 17 8V6ZM-1 24C-1 33.9411 7.05887 42 17 42V40C8.16344 40 1 32.8366 1 24H-1ZM18 41V39H16V41H18ZM1 24C1 32.8366 8.16344 40 17 40V38C9.26801 38 3 31.732 3 24H1ZM17 8C8.16344 8 1 15.1634 1 24H3C3 16.268 9.26801 10 17 10V8ZM18 9V7H16V9H18Z"
        fill={theme.background1}
        mask="url(#path-2-inside-1)"
      />
      <path d="M16 39H18V48H16V39Z" fill={theme.background1} />
      <path d="M16 0H18V9H16V0Z" fill={theme.background1} />
    </svg>
  );
};

TriangleIcon.propTypes = {
  isActive: PropTypes.bool,
}

export default TriangleIcon;
