/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './src/apps/blitz/**/**/*.{js,ts,jsx,tsx,html,mdx}',
    './src/apps/blitz/**/*.{js,ts,jsx,tsx,html,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      desktop: { min: '1024px' },
      tablet: { max: '1024px' },
      mobile: { max: '768px' },
      xs: { max: '470px' },
    },
    extend: {
      colors: {
        deep_purple: { A700: '#5e00ff' },
        container_grey: '#27262F',
        medium_grey: '#312F3A',
        purple_light: '#E2DDFF',
        purple_medium: '#8A77FF',
        percentage_green: '#5DC787',
        percentage_red: '#FF366C',
      },
      fontFamily: {
        custom: ['Formular'],
      },
    },
  },
  plugins: [],
};
