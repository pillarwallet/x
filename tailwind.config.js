/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  mode: 'jit',
  content: [
    './src/**/**/*.{js,ts,jsx,tsx,html,mdx}',
    './src/**/*.{js,ts,jsx,tsx,html,mdx}',
    '!./src/apps/**/*',
  ],
  darkMode: 'class',
  theme: {
    screens: { md: { max: '1050px' }, sm: { max: '550px' } },
    extend: {
      colors: {
        black: { 900: '#101010', '900_87': '#10101087' },
        blue_gray: { 100: '#d9d9d9', '100_05': '#d9d9d905' },
        gray: { '900_33': '#1a1a1a33' },
        white: { A700: '#ffffff', A700_90: '#ffffff90', A700_99: '#ffffff99' },
        deep_purple: { A700: '#5e00ff' },
        medium_purple: '#8A77FF',
        light_purple: '#e2ddff',
        transparent_medium_grey: '#e2ddff1a',
        dark_grey: '#120f17',
        medium_grey: '#e2ddff4d',
      },
      boxShadow: { xs: '0px 0px  30px 0px #ffffff0c' },
      fontFamily: {
        custom: ['Formular'],
      },
      opacity: { 0.5: 0.5, 0.1: 0.1, 0.2: 0.2, 0.6: 0.6, 0.7: 0.7 },
      backgroundImage: {
        gradient: 'linear-gradient(270deg, #ffffff87,#ffffff87,#ffffff87)',
      },
    },
  },
  plugins: [],
};
