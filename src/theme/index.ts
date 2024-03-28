import { createGlobalStyle, keyframes } from 'styled-components';

// fonts
import formularRegularFont from '../assets/fonts/Formular-Regular.otf';
import formularMediumFont from '../assets/fonts/Formular-Medium.otf';
import formularBoldFont from '../assets/fonts/Formular-Bold.otf';

export interface Theme {
  font: {
    primary: string;
  }
  color: {
    background: {
      body: string;
      bottomMenu: string;
      bottomMenuItemHover: string;
      bottomMenuModal: string;
      loadingLogo: string;
      buttonPrimary: string;
      buttonPrimaryDisabled: string;
      input: string;
      info: string;
      error: string;
      success: string;
      warning: string;
      horizontalDivider: string;
      selectItem: string;
      selectItemHover: string;
      bottomMenuItemNotification: string;
    },
    text: {
      body: string;
      bottomMenuItem: string;
      loadingLogo: string;
      buttonPrimary: string;
      buttonPrimaryDisabled: string;
      input: string;
      info: string;
      error: string;
      success: string;
      warning: string;
      inputPlaceholder: string;
      inputHelper: string;
    },
    border: {
      bottomMenuItemBottomActive: string;
    },
    icon: {
      inputHelper: string;
      delete: string;
    }
  }
}

export const defaultTheme: Theme = {
  font: {
    primary: 'Formular, serif',
  },
  color: {
    background: {
      body: '#101010',
      bottomMenu: 'rgba(16,16,16,0.7)',
      bottomMenuItemHover: 'rgba(216, 232, 255, 0.10)',
      bottomMenuModal: 'rgba(16, 16, 16, 0.70)',
      loadingLogo: '#fff',
      buttonPrimary: '#D9D9D9',
      buttonPrimaryDisabled: '#63626B',
      input: 'rgba(217, 217, 217, 0.05)',
      info: '#BEF',
      error: '#D8000C',
      success: '#DFF2BF',
      warning: '#FEEFB3',
      horizontalDivider: 'linear-gradient(270deg, rgba(217, 217, 217, 0.00) 0%, #D9D9D9 50.52%, rgba(217, 217, 217, 0.00) 100%)',
      selectItem: 'rgba(217, 217, 217, 0.05)',
      selectItemHover: 'rgba(217, 217, 217, 0.2)',
      bottomMenuItemNotification: 'rgb(0,111,255)',
    },
    text: {
      body: '#fff',
      bottomMenuItem: '#fff',
      loadingLogo: '#997cfa',
      buttonPrimary: '#1D1D1D',
      buttonPrimaryDisabled: '#1D1D1D',
      input: '#fff',
      info: '#059',
      error: '#FFBABA',
      success: '#270',
      warning: '#9F6000',
      inputPlaceholder: '#838383',
      inputHelper: 'rgba(255, 255, 255, 0.3)',
    },
    border: {
      bottomMenuItemBottomActive: '#fff',
    },
    icon: {
      inputHelper: '#fff',
      delete: '#ff000080',
    }
  },
};

const skeleton = keyframes`
  0% {
    background-color: hsl(0, 0%, 27%);
  }
  100% {
    background-color: hsl(0, 0%, 53%);
  }
`;


const pulse = (min = 1, max = 2) => keyframes`
  0% {
    transform: scale(${min});
  }
  50% {
    transform: scale(${max});
  }
  100% {
    transform: scale(${min});
  }
`;

const rotateAndPulse = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.5) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
  }
`;

const slideUp = keyframes`
  0% {
    transform: scale(.8) translateY(1000px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0px);
    opacity: 1;
  }
`;

const slideDown = keyframes`
  0% {
    transform: scale(1) translateY(0px);
    opacity: 1;
  }
  100% {
    transform: scale(.8) translateY(1000px);
    opacity: 0;
  }
`;

export const animation = {
  skeleton,
  pulse,
  rotateAndPulse,
  slideUp,
  slideDown,
}

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: Formular;
    font-weight: 400;
    src: url(${formularRegularFont}) format("opentype");
  }

  @font-face {
    font-family: Formular;
    font-weight: 500;
    src: url(${formularMediumFont}) format("opentype");
  }

  @font-face {
    font-family: Formular;
    font-weight: 700;
    src: url(${formularBoldFont}) format("opentype");
  }

  body {
    font-family: ${({ theme }) => theme.font.primary};
    background: ${({ theme }) => theme.color.background.body};
    color: ${({ theme }) => theme.color.text.body};
  }
  
  input, textarea, button, select {
    font-family: ${({ theme }) => theme.font.primary};
  }
  
  * {
    box-sizing: border-box;
    line-height: normal;
    margin: 0;
    padding: 0;
  }
`;

