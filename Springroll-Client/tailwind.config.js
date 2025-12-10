/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        springOrange: "#f28c28", 
        springRed: "#c02a2a",
        springGreenMedium: "#60a31c",
        springGreenDark: "#3e7a10",
      },
    }
  },
  plugins: [],
}

