/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pm: {
          bg: '#1a1a1a',
          surface: '#212121',
          hover: '#2a2a2a',
          border: '#333333',
          subtle: '#282828',
          text: '#e6e6e6',
          muted: '#8c8c8c',
          blue: '#097bed',
          blueHover: '#0867c8',
          orange: '#ff6c37',
          get: '#0cbb52',
          post: '#ffb400',
          put: '#097bed',
          delete: '#eb2013',
          patch: '#a855f7'
        }
      }
    },
  },
  plugins: [],
}