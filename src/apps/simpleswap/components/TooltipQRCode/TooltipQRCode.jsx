import { useContext, useState } from 'react';
import QRCode from 'qrcode.react';
import { ThemeContext } from 'styled-components';
import * as Styles from './styles';
import { ExchangeContext } from '../../contexts/ExchangeContext';

const TooltipQRCode = () => {
  const {
    state: { exchangeInfo },
  } = useContext(ExchangeContext);
  const theme = useContext(ThemeContext);
  const [isHover, setIsHover] = useState();

  return (
    <Styles.Container onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect
          width="24"
          height="24"
          rx="6"
          fill={isHover ? '#004AD9' : `${theme.copyIconBackground}`}
        />
        <path
          d="M5.33398 10V8.33334C5.33398 6.67334 6.67398 5.33334 8.33398 5.33334H10.0007"
          stroke={isHover ? '#ffffff' : theme.text3}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 5.33334H15.6667C17.3267 5.33334 18.6667 6.67334 18.6667 8.33334V10"
          stroke={isHover ? '#ffffff' : theme.text3}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.666 14.6667V15.6667C18.666 17.3267 17.326 18.6667 15.666 18.6667H14.666"
          stroke={isHover ? '#ffffff' : theme.text3}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.0007 18.6667H8.33398C6.67398 18.6667 5.33398 17.3267 5.33398 15.6667V14"
          stroke={isHover ? '#ffffff' : theme.text3}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 10.4V13.6C16 15.2 15.2 16 13.6 16H10.4C8.8 16 8 15.2 8 13.6V10.4C8 8.8 8.8 8 10.4 8H13.6C15.2 8 16 8.8 16 10.4Z"
          stroke={isHover ? '#ffffff' : theme.text3}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <Styles.Tooltip>
        <QRCode value={exchangeInfo?.addressFrom || ''} size={88} />
      </Styles.Tooltip>
    </Styles.Container>
  );
};

export default TooltipQRCode;
