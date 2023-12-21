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
      input: string;
      info: string;
      error: string;
      success: string;
      warning: string;
    },
    text: {
      body: string;
      bottomMenuItem: string;
      loadingLogo: string;
      buttonPrimary: string;
      input: string;
      info: string;
      error: string;
      success: string;
      warning: string;
    },
    border: {
      input: string;
      bottomMenuItemBottomActive: string;
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
      bottomMenuModal: 'rgba(29, 29, 29, 0.90)',
      loadingLogo: '#fff',
      buttonPrimary: '#D9D9D9',
      input: '#fff',
      info: '#BEF',
      error: '#D8000C',
      success: '#DFF2BF',
      warning: '#FEEFB3',
    },
    text: {
      body: '#fff',
      bottomMenuItem: '#fff',
      loadingLogo: '#997cfa',
      buttonPrimary: '#1D1D1D',
      input: '#000',
      info: '#059',
      error: '#FFBABA',
      success: '#270',
      warning: '#9F6000',
    },
    border: {
      input: '#000',
      bottomMenuItemBottomActive: '#fff',
    }
  },
};

const skeleton = keyframes`
  0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
      background-color: hsl(200, 20%, 95%);
  }
`;


const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(2);
  }
  100% {
    transform: scale(1);
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
    margin: 0;
    padding: 0;
  }
`;

