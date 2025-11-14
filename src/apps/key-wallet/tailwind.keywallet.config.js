/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './src/apps/key-wallet/**/**/*.{js,ts,jsx,tsx,html,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      desktop: { min: '1025px' },
      tablet: { max: '1024px' },
      mobile: { max: '768px' },
      xs: { max: '470px' },
    },
    extend: {
      colors: {
        deep_purple: { A700: '#5e00ff' },
        purple_light: '#E2DDFF',
        purple_medium: '#8A77FF',
        container_grey: '#1E1D24',
        medium_grey: '#312F3A',
      },
      fontFamily: {
        custom: ['Formular'],
      },
    },
  },
  plugins: [],
};

