/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    './src/**/*.{js,ts,jsx,tsx,html,mdx}',
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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: { xs: '0px 0px  30px 0px #ffffff0c' },
      fontFamily: {
        custom: ['Formular'],
      },
      opacity: { 0.5: 0.5, 0.1: 0.1, 0.2: 0.2, 0.6: 0.6, 0.7: 0.7 },
      backgroundImage: {
        gradient: 'linear-gradient(270deg, #ffffff87,#ffffff87,#ffffff87)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
