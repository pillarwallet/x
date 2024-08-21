/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./src/apps/token-atlas/**/**/*.{js,ts,jsx,tsx,html,mdx}', './src/apps/token-atlas/**/*.{js,ts,jsx,tsx,html,mdx}'],
  darkMode: 'class',
  theme: {
    screens: { desktop: { min: '1024px' }, tablet: { max: '1024px' }, mobile: { max: '768px' }, xs: { max: '470px' } },
    extend: {
      colors: {
        light_grey: '#979797',
        medium_grey: '#313131',
        dark_grey: '#222222',
        green: '#6CFF00',
        red: '#FF005C',
        white_grey: '#A1A1A1',
        white_light_grey: '#DDDDDD',

      },
      fontFamily: {
        'custom': ['Formular'],
      },
    },
  },
  plugins: [],
};
