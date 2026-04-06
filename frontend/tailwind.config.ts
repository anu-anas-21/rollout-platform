import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        /* Cafe/Lifestyle Brand Colors */
        "primary-bg": "#EFE7DC",
        "secondary-bg": "#E8DED2", 
        "card-bg": "#FFFFFF",
        "primary-text": "#2B2B2B",
        "secondary-text": "#6B6B6B",
        "accent": "#9C6B3F",
        "accent-dark": "#7A5C3E",
        "accent-light": "#B8845C",
        "border": "#E0D6C8",
        "shadow": "rgba(156, 107, 63, 0.1)",
        
        /* Semantic mapping for existing classes */
        "background": "#EFE7DC",
        "on-background": "#2B2B2B",
        "surface": "#FFFFFF",
        "on-surface": "#2B2B2B",
        "primary": "#9C6B3F",
        "on-primary": "#FFFFFF",
        "secondary": "#6B6B6B",
        "on-secondary": "#FFFFFF",
        "tertiary": "#E8DED2",
        "on-tertiary": "#2B2B2B",
        "outline": "#E0D6C8",
        "on-outline": "#2B2B2B",
        "error": "#CC4B0F",
        "on-error": "#FFFFFF",
        "surface-container": "#FFFFFF",
        "surface-container-highest": "#EFE7DC"
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Montserrat", "Inter", "sans-serif"],
        "body": ["Montserrat", "Inter", "sans-serif"],
        "label": ["Montserrat", "Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}

export default config
