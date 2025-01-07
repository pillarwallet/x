/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './src/apps/deposit/**/**/*.{js,ts,jsx,tsx,html,mdx}',
    './src/apps/deposit/**/*.{js,ts,jsx,tsx,html,mdx}',
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
      colors: {},
      fontFamily: {
        custom: ['Formular'],
      },
    },
  },
  plugins: [],
};
