import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const QuestionIcon = () => {
  const theme = useContext(ThemeContext);

  return (
    <svg
      width="19"
      height="20"
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="questionIcon"
    >
      <path
        d="M9.49992 17.9168C13.8722 17.9168 17.4166 14.3724 17.4166 10.0002C17.4166 5.62791 13.8722 2.0835 9.49992 2.0835C5.12766 2.0835 1.58325 5.62791 1.58325 10.0002C1.58325 14.3724 5.12766 17.9168 9.49992 17.9168Z"
        fill={theme.addressBlockText}
      />
      <path
        d="M9.49992 11.3772V11.1269C9.49992 10.3161 10.0007 9.88682 10.5015 9.54105C10.9903 9.20719 11.4791 8.77797 11.4791 7.99103C11.4791 6.89408 10.5968 6.01172 9.49992 6.01172C8.40301 6.01172 7.52075 6.89408 7.52075 7.99103"
        stroke={theme.background}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.49536 14.2271H9.50539"
        stroke={theme.background}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default QuestionIcon;
