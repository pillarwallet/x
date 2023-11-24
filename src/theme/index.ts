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
    },
    text: {
      body: string;
      bottomMenuItem: string;
      bottomMenuItemActive: string;
      loadingLogo: string;
      buttonPrimary: string;
    },
    border: {
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
    },
    text: {
      body: '#fff',
      bottomMenuItem: '#fff',
      bottomMenuItemActive: '#444d55',
      loadingLogo: '#997cfa',
      buttonPrimary: '#fff',
    },
    border: {
      bottomMenuItemBottomActive: '#fff',
    }
  },
};
