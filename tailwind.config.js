export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        'primary-light': '#A78BFA',
        'primary-dark': '#5B21B6',
        'primary-pale': '#EDE9FE',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        accent: '#F59E0B',
      },
      fontFamily: {
        heading: ['"Sora"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
