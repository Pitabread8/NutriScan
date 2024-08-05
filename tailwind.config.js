/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#EEEEEE",
        orange: "#FF8C42",
        red: "#A23E48",
      },
      keyframes: {
        play: {
          "0%, 100%": {
            scale: "1",
            transform: "translateX(-50%), translateY(-50%)",
          },
          "50%": {
            scale: "0.9",
            transform: "translateX(-50%), translateY(-50%)",
          },
        },
      },
      animation: {
        play: "play 2s infinite",
      },
    },
  },
  plugins: [],
};
