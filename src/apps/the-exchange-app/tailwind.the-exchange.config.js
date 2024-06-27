/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./src/apps/the-exchange-app/**/**/*.{js,ts,jsx,tsx,html,mdx,svg}', './src/apps/the-exchange-app/**/*.{js,ts,jsx,tsx,html,mdx,svg}'],
  darkMode: 'class',
  theme: {
    screens: { desktop: { min: '1024px' }, tablet: { max: '1024px' }, mobile: { max: '800px' }, xs: { max: '360px' } },
    extend: {
      colors: {
        black_grey: '#343434',
        light_grey: '#999999',
        green: '#C7FFD4',
        purple: '#E2DDFF'
      },
      fontFamily: {
        'custom': ['Formular'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
