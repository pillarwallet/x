/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './src/apps/emcd-swap/**/**/*.{js,ts,jsx,tsx,html,mdx}',
    './src/apps/emcd-swap/**/*.{js,ts,jsx,tsx,html,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',

        error: '#F44336',
        attention: '#FF9800',

        success: {
          bg: '#173318',
          icon: '#05d605',
          DEFAULT: '#4DB051',
        },

        brand: {
          DEFAULT: '#8F42FF',
          hover: '#6301CF',
          active: '#2E007C',
          disabled: '#2E007C',
          light: '#C69FFF'
        },

        'color-1': '#FAFAFA',
        'color-2': '#D0D0D0',
        'color-3': '#A3A3A3',
        'color-6': '#7A7A7A',
        'color-7': '#363439',
        'color-8': '#111111',
        'color-9': '#2B2B2C',


        'bg-1': '#0A0A0A',
        'bg-2': '#1A1A1A',
        'bg-35': '#494646',
        'bg-5': '#2d2a2a',
        'bg-6': '#0A0A0A',
        'bg-7': '#120F17',
        'bg-8': '#211C29',

        'bg-success': '#3BAB40',
      },
      borderRadius: {
        '5': '1.25rem',
        sm: '10px',
        full: '9999px',
      },
      fontSize: {
        '2.5': '0.625rem',
        '7': '1.75rem',
      },
      height: {
        '50': '12.5rem',
      },
      width: {
        '120': '30rem',
        '137.5': '34.375rem',
      },
      maxHeight: {
        '61.25': '15.3125rem',
      },
      screens: {
        desktop: { min: '1024px' },
        tablet: { max: '1024px' },
        mobile: { max: '768px' },
        xs: { max: '470px' },
      },
    }
  },
  plugins: [],
};
