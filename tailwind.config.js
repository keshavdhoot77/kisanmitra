/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#2D6A4F',
          700: '#1b4332',
          800: '#14532d',
          900: '#052e16'
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#E76F51'
        },
        earth: {
          50: '#FEFAE0',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          800: '#78350f'
        }
      },
      fontFamily: {
        sans: ['"Noto Sans"', '"Noto Sans Devanagari"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
