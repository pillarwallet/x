/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './src/apps/leaderboard/**/**/*.{js,ts,jsx,tsx,html,mdx}',
    './src/apps/leaderboard/**/*.{js,ts,jsx,tsx,html,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      desktop: { min: '1024px' },
      tablet: { max: '1024px' },
      mobile: { max: '768px' },
      xs: { max: '470px' },
      xxs: { max: '368px' },
    },
    extend: {
      colors: {
        deep_purple: { A700: '#5e00ff' },
        container_grey: '#1E1D24',
        medium_grey: '#312F3A',
        purple_light: '#E2DDFF',
        purple_medium: '#8A77FF',
        percentage_green: '#5CFF93',
        percentage_red: '#FF366C',
        dark_blue: '#2E2A4A',
      },
      fontFamily: {
        custom: ['Formular'],
      },
    },
  },
  plugins: [],
};
