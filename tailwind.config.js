/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        tela: '#ffe1adff',
        bronze500: '#db8a44',
        bronze600: '#eca261ff',
        bronze400: '#f7c593ff',
      },
    },
  },
  plugins: [],
}