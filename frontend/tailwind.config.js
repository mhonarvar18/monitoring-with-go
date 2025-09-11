/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts,tsx,js,jsx}"],
  theme: {
    extend: {
         fontFamily: {
        iransans: ["iransans", "sans-serif"],
      },
      backgroundImage: {
        'header-right': 'linear-gradient(90deg, #FFF 0%, #E8F4FF 100%)',
        'header-left': 'linear-gradient(to left, #FFF 0%, #E8F4FF 100%)',
      },
      backgroundColor: {
        'btn-logout': 'rgba(242, 72, 93, 0.16)',
        'main': '#E7EAEE',
        'btns': "#09A1A4"
      }
    },
  },
  plugins: [],
};
