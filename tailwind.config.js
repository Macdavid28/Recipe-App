/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "480px",
      },
      colors: {
        primary: "#e6e2e3",
      },
      fontFamily: {
        cookie: "Cookie",
      },
    },
  },
  plugins: [],
};
