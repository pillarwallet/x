/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './src/apps/pillarx-app/**/**/*.{js,ts,jsx,tsx,html,mdx}',
    './src/apps/pillarx-app/**/*.{js,ts,jsx,tsx,html,mdx}',
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
        container_grey: '#1E1D24',
        medium_grey: '#312F3A',
        purple_light: '#E2DDFF',
        purple_medium: '#8A77FF',
        percentage_green: '#05FFDD',
        percentage_red: '#FF366C',
        market_row_green: '#5CFF93',
        dark_blue: '#2E2A4A',
        lighter_container_grey: '#25232D',
      },
      fontFamily: {
        custom: ['Formular'],
      },
    },
  },
  plugins: [],
};
