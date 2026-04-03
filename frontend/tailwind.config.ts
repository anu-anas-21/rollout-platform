import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#1a1a1a',
          sand: '#d2b48c',
          white: '#ffffff',
          bg: '#f5f5f5',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Montserrat', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

export default config
