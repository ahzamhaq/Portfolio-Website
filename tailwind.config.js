/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#E3C87A',
          light: '#EDD89A',
          dark: '#C8A852',
          edge: '#B89040',
        },
        ink: {
          DEFAULT: '#1a1611',
          soft: '#2b241a',
          muted: '#5a4f3f',
          faded: '#8a7d68',
        },
        accent: {
          burgundy: '#6b1f14',
        },
      },
      fontFamily: {
        display: ['"UnifrakturCook"', '"Playfair Display"', 'Georgia', 'serif'],
        headline: ['"Playfair Display"', '"Old Standard TT"', 'Georgia', 'serif'],
        serif: ['"Lora"', '"Old Standard TT"', 'Georgia', 'serif'],
        meta: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.18em',
      },
    },
  },
  plugins: [],
};
