/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#FFFFFF',
        foreground: '#000000',
        muted: '#6F6F6F',
        vyro: {
          cyan: '#00f2fe',
          teal: '#4facfe',
          blue: '#0077b6',
          deep: '#03045e',
          dark: '#0b132b',
        }
      },
      keyframes: {
        'fade-rise': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-rise': 'fade-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-rise-delay': 'fade-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
        'fade-rise-delay-2': 'fade-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards',
      },
    },
  },
  plugins: [],
}
