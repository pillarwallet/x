export interface Theme {
  font: {
    primary: string;
  }
  color: {
    background: {
      body: string;
      bottomMenuItem: string;
      loadingLogo: string;
      buttonPrimary: string;
    },
    text: {
      body: string;
      bottomMenuItem: string;
      loadingLogo: string;
      buttonPrimary: string;
    }
  }
}

export const defaultTheme: Theme = {
  font: {
    primary: '"Roboto", sans',
  },
  color: {
    background: {
      body: '#6448b3',
      bottomMenuItem: '#fff',
      loadingLogo: '#fff',
      buttonPrimary: '#c63bea',
    },
    text: {
      body: '#fff',
      bottomMenuItem: '#000',
      loadingLogo: '#997cfa',
      buttonPrimary: '#fff',
    }
  },
};
