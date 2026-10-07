import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#f4f4f5",
        brand: {
          dark: "#0a0a0c",
          surface: "#121215",
          card: "#17171c",
          border: "#26262e",
          borderLight: "#383844",
        },
        gold: {
          50: '#fbf8ee',
          100: '#f5edd3',
          200: '#ecd9a7',
          300: '#dfc175',
          400: '#d4af37', // Dourado Nobre Principal
          500: '#c5a059', // Dourado Satin
          600: '#a37f37',
          700: '#82602b',
          800: '#674a24',
          900: '#523a1e',
        }
      },
    },
  },
  plugins: [],
};
export default config;
