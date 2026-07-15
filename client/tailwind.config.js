/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d4a853',
          light: '#e5b964',
        },
        dark: {
          DEFAULT: '#031124',
          2: '#020b18',
        },
        gray: {
          DEFAULT: '#8892b0',
          concrete: '#b3b3b3',
          steel: '#374151',
        },
        white: '#ffffff',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'dark-glass': 'linear-gradient(135deg, rgba(3, 17, 36, 0.7) 0%, rgba(2, 11, 24, 0.4) 100%)',
      },
      boxShadow: {
        'premium-glow': '0 10px 30px rgba(212, 168, 83, 0.2)',
        'glass-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
