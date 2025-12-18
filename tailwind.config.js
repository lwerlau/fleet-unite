/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#1f2937', // gray-800 (black)
          700: '#374151', // gray-700 (dark gray for hover)
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}


