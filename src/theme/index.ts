import { keyframes } from 'styled-components';

export interface Theme {
  font: {
    primary: string;
  }
  color: {
    background: {
      body: string;
      bottomMenu: string;
      bottomMenuItem: string;
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
      bottomMenuItemActive: string;
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
    primary: '"Roboto", sans',
  },
  color: {
    background: {
      body: '#24142f',
      bottomMenu: 'rgba(50,50,66,0.7)',
      bottomMenuItem: '#444d55',
      loadingLogo: '#fff',
      buttonPrimary: '#c63bea',
      input: '#fff',
      info: '#BEF',
      error: '#D8000C',
      success: '#DFF2BF',
      warning: '#FEEFB3',
    },
    text: {
      body: '#fff',
      bottomMenuItem: '#fff',
      bottomMenuItemActive: '#444d55',
      loadingLogo: '#997cfa',
      buttonPrimary: '#fff',
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

export const animation = {
  skeleton,
  pulse,
}
