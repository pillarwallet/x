export interface Theme {
  font: {
    primary: string;
  }
  color: {
    background: {
      body: string;
    },
    text: {
      body: string;
    }
  }
}

export const defaultTheme: Theme = {
  font: {
    primary: '"Arial", sans',
  },
  color: {
    background: {
      body: '#6448b3',
    },
    text: {
      body: '#fff',
    }
  },
};
