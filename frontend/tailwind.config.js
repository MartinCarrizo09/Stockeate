/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primario: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7'
        }
      }
    }
  },
  plugins: []
}

