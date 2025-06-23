import { createGlobalStyle, keyframes } from 'styled-components';

export interface Theme {
  font: {
    primary: {
      family: string;
      weight: number;
    };
  };
  color: {
    background: {
      body: string;
      bottomMenu: string;
      bottomMenuItemHover: string;
      bottomMenuModal: string;
      loadingLogo: string;
      buttonPrimary: string;
      buttonPrimaryDisabled: string;
      buttonSecondary: string;
      buttonSecondaryDisabled: string;
      input: string;
      inputActive: string;
      inputButton: string;
      horizontalDivider: string;
      selectItem: string;
      selectItemHover: string;
      contentNotification: string;
      bottomModalHandlebar: string;
      alert: string;
      card: string;
      exploreAppsCard: string;
      exploreAppsCardButton: string;
      transactionStatus: {
        pending: string;
        completed: string;
        failed: string;
      };
    };
    text: {
      body: string;
      bottomMenuItem: string;
      bottomMenuItemActive: string;
      loadingLogo: string;
      buttonPrimary: string;
      buttonPrimaryDisabled: string;
      buttonSecondary: string;
      buttonSecondaryDisabled: string;
      input: string;
      inputButton: string;
      inputInactive: string;
      inputHelper: string;
      formLabel: string;
      contentNotification: string;
      amountInputInsideSymbol: string;
      alert: string;
      cardTitle: string;
      cardContent: string;
      cardContentSecondary: string;
      cardLink: string;
      transactionStatus: {
        pending: string;
        completed: string;
        failed: string;
      };
    };
    border: {
      bottomMenu: string;
      alertOutline: string;
      buttonSecondary: string;
      cardContentVerticalSeparator: string;
      cardContentHorizontalSeparator: string;
      groupedIconsSmaller: string;
    };
    icon: {
      inputHelper: string;
      inputButton: string;
      delete: string;
      cardIcon: string;
    };
  };
}

export const defaultTheme: Theme = {
  font: {
    primary: {
      family: '"Poppins", sans-serif',
      weight: 500,
    },
  },
  color: {
    background: {
      body: '#1F1D23',
      bottomMenu: 'rgba(18, 15, 23, 0.70)',
      bottomMenuItemHover: 'rgba(216, 232, 255, 0.10)',
      bottomMenuModal: 'rgba(16, 16, 16, 0.70)',
      loadingLogo: '#fff',
      buttonPrimary: '#997cfa',
      buttonPrimaryDisabled: 'rgba(153, 124, 250, 0.3)',
      buttonSecondary: 'rgba(16, 16, 16, 0.70)',
      buttonSecondaryDisabled: 'rgba(16, 16, 16, 0.30)',
      input: 'rgba(255, 255, 255, 0.1)',
      inputActive: '#3a3843',
      horizontalDivider:
        'linear-gradient(270deg, rgba(217, 217, 217, 0.00) 0%, #D9D9D9 50.52%, rgba(217, 217, 217, 0.00) 100%)',
      selectItem: 'rgba(217, 217, 217, 0.05)',
      selectItemHover: 'rgba(217, 217, 217, 0.2)',
      contentNotification: '#7654FF',
      bottomModalHandlebar: 'rgba(255, 255, 255, 0.4)',
      inputButton: '#3a3843',
      alert: 'rgba(226, 221, 255, 0.1)',
      card: 'rgba(226, 221, 255, 0.1)',
      exploreAppsCard:
        'transparent linear-gradient(112deg, #8D4BFF 0%, #8A77FF 100%) 0% 0% no-repeat padding-box',
      exploreAppsCardButton: '#27262F',
      transactionStatus: {
        pending: 'rgba(226, 221, 255, 0.1)',
        completed: 'rgba(5, 255, 221, 0.1)',
        failed: 'rgba(255, 5, 113, 0.1)',
      },
    },
    text: {
      body: '#fff',
      bottomMenuItem: '#89888b',
      bottomMenuItemActive: '#fff',
      loadingLogo: '#997cfa',
      buttonPrimary: '#fff',
      buttonPrimaryDisabled: 'rgba(255, 255, 255, 0.3)',
      buttonSecondary: '#fff',
      buttonSecondaryDisabled: 'rgba(255, 255, 255, 0.3)',
      input: '#fff',
      inputButton: '#e2ddff',
      inputInactive: '#838383',
      inputHelper: 'rgba(255, 255, 255, 0.3)',
      formLabel: 'rgba(226, 221, 255, 0.7)',
      contentNotification: '#fff',
      amountInputInsideSymbol: 'rgba(196, 185, 255, 0.9)',
      alert: 'rgba(226, 221, 255, 0.9)',
      cardTitle: '#fff',
      cardContent: '#e2ddff',
      cardContentSecondary: 'rgba(226, 221, 255, 0.3)',
      cardLink: '#8a77ff',
      transactionStatus: {
        pending: '#e2ddff',
        completed: '#05FFDD',
        failed: '#FF0571',
      },
    },
    border: {
      bottomMenu: '#363439',
      alertOutline: 'rgba(226, 221, 255, 0.15)',
      buttonSecondary: '#E2DDFF33',
      cardContentVerticalSeparator: 'rgba(226, 221, 255, 0.5)',
      cardContentHorizontalSeparator: 'rgba(226, 221, 255, 0.1)',
      groupedIconsSmaller: '#27262E',
    },
    icon: {
      inputHelper: '#fff',
      inputButton: '#8A77FF',
      delete: '#ff000080',
      cardIcon: '#8A77FF',
    },
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
};

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${({ theme }) => theme.font.primary.family};
    background: ${({ theme }) => theme.color.background.body};
    color: ${({ theme }) => theme.color.text.body};
    font-weight: ${({ theme }) => theme.font.primary.weight};
  }
  
  input, textarea, button, select {
    font-family: ${({ theme }) => theme.font.primary.family};
  }
  
  * {
    box-sizing: border-box;
    line-height: normal;
    margin: 0;
    padding: 0;
  }
`;
