module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aero: {
          DEFAULT: '#27437E',
          light: '#365087',
          dark: '#1a2c55',
          accent: '#4a90e2',
        },
        black: {
          DEFAULT: '#0a0a0f',
          matte: '#15151a',
        },
        gray: {
          tactical: '#2a2a3a',
          light: '#a0a0b0',
        }
      },
      fontFamily: {
        stencil: ['"Black Ops One"', 'system-ui', 'cursive'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'tactical-grid': 'linear-gradient(rgba(39, 67, 126, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(39, 67, 126, 0.1) 1px, transparent 1px)',
        'blue-glow': 'radial-gradient(circle at 50% 50%, #27437E 0%, #1a2c55 50%, #0a0a0f 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}