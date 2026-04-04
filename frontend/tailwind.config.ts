import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        "secondary-container": "#f0e0cd",
        "on-secondary-fixed": "#483e30",
        "surface-variant": "#dde4e5",
        "primary-dim": "#535252",
        "outline": "#757c7d",
        "surface-container-low": "#f2f4f4",
        "on-primary-fixed-variant": "#5c5b5b",
        "on-error-container": "#752121",
        "on-background": "#2d3435",
        "background": "#f9f9f9",
        "inverse-primary": "#ffffff",
        "error": "#9f403d",
        "primary-container": "#e5e2e1",
        "surface-bright": "#f9f9f9",
        "secondary-fixed-dim": "#e2d2c0",
        "on-primary-container": "#525151",
        "on-surface": "#2d3435",
        "on-primary": "#faf7f6",
        "primary-fixed-dim": "#d6d4d3",
        "on-tertiary-fixed": "#085244",
        "tertiary": "#2a695b",
        "tertiary-fixed-dim": "#afefdd",
        "surface-container-high": "#e4e9ea",
        "on-tertiary-fixed-variant": "#306f60",
        "outline-variant": "#adb3b4",
        "on-secondary-fixed-variant": "#655a4b",
        "surface-container-lowest": "#ffffff",
        "surface-container-highest": "#dde4e5",
        "on-tertiary": "#e3fff5",
        "surface-container": "#ebeeef",
        "surface": "#f9f9f9",
        "on-tertiary-container": "#246456",
        "tertiary-container": "#bdfeeb",
        "on-surface-variant": "#5a6061",
        "on-secondary-container": "#5b5042",
        "secondary": "#685d4f",
        "tertiary-dim": "#1b5d4f",
        "surface-dim": "#d4dbdd",
        "error-dim": "#4e0309",
        "surface-tint": "#5f5e5e",
        "on-error": "#fff7f6",
        "error-container": "#fe8983",
        "secondary-fixed": "#f0e0cd",
        "primary-fixed": "#e5e2e1",
        "primary": "#5f5e5e",
        "on-secondary": "#fff8f2",
        "inverse-surface": "#0c0f0f",
        "secondary-dim": "#5c5143",
        "on-primary-fixed": "#403f3f",
        "inverse-on-surface": "#9c9d9d",
        "tertiary-fixed": "#bdfeeb"
      },
      borderRadius: {
        "DEFAULT": "0px",
        "lg": "0px",
        "xl": "0px",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Inter", "sans-serif"],
        "body": ["Newsreader", "serif"],
        "label": ["Space Grotesk", "monospace"]
      }
    },
  },
  plugins: [],
}

export default config
