/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        springOrange: "#f28c28", 
        springRed: "#e63946",
        springGreen: "#60a31c",
      },
    }
  },
  plugins: [],
}

