/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#faf8f5",
          100: "#f5f0e8",
          200: "#ebe1d1",
          300: "#dccdb4",
          400: "#c9b598",
          500: "#b89d7c",
          600: "#a18760",
          700: "#826b4d",
          800: "#6b5841",
          900: "#5a4a38",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #f5f0e8 0%, #ebe1d1 100%)',
        'gradient-accent': 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
      },
    },
  },
  plugins: [],
};
