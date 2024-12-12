/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.{js,ts,jsx,tsx}", // Include App.js
  ],
  theme: {
    extend: {
      fontFamily: {
        josefin: ["JosefinSans_400Regular"],
        "josefin-medium": ["JosefinSans_500Medium"],
        "josefin-semibold": ["JosefinSans_600SemiBold"],
        "josefin-bold": ["JosefinSans_700Bold"],
      },
    },
  },
  plugins: [],
};
