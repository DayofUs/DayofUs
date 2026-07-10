import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B07D6E',
          dark: '#8B5E52',
          light: '#F5EAE4',
        },
        gold: {
          DEFAULT: '#D4AF7A',
          light: '#F5E6C8',
        },
        navy: '#2C2C3E',
        sage: '#7A9E8A',
        cream: '#FDFAF7',
        blush: '#F5EAE4',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
