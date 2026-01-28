/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        'primary-light': '#A78BFA',
        accent: '#F97316',
        'bg-light': '#FAF5FF',
        'text-dark': '#4C1D95',
      },
      fontFamily: {
        'fira-code': ['Fira Code', 'monospace'],
        'fira-sans': ['Fira Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
