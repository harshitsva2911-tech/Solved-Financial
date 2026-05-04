/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#001B2F',
          50: '#E6EDF3',
          100: '#CCDBE7',
          200: '#99B7CF',
          300: '#6693B7',
          400: '#336F9F',
          500: '#001B2F',
          600: '#001726',
          700: '#00131E',
          800: '#000F15',
          900: '#000B0D',
        },
        gold: {
          DEFAULT: '#D4B684',
          50: '#FAF5EC',
          100: '#F5EBD9',
          200: '#EBD7B3',
          300: '#E1C38D',
          400: '#D4B684',
          500: '#C9A55A',
          600: '#B88E3A',
          700: '#8A6A2B',
          800: '#5C471D',
          900: '#2E230E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
