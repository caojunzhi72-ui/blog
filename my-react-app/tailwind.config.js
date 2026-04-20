/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f8f8',
        foreground: '#2d2d2d',
        primary: '#2d2d2d',
        secondary: '#999999',
        muted: '#f0f0f0',
        card: '#ffffff',
        border: '#eaeaea',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      borderRadius: {
        '4.5': '0.28125rem',
      },
    },
  },
  plugins: [],
}