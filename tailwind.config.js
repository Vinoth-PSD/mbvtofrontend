/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mindfulWhite: '#ffffff',
        mindfulBlack: '#000000',
        main: '#FF197D',
      },
    },
  },
  plugins: [],
} 