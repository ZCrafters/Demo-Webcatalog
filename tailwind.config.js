/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        salem: {
          black: '#0E1117',
          ink: '#151922',
          gold: '#B99A55',
          'gold-soft': '#D7C18A',
          cream: '#F8F4EA',
          ivory: '#FFFDF7',
          beige: '#E8DDC8',
          nude: '#D9BFA3',
          muted: '#6F6A61',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(21, 25, 34, 0.05)',
        'premium-hover': '0 8px 30px -4px rgba(21, 25, 34, 0.1)',
      }
    },
  },
  plugins: [],
}
