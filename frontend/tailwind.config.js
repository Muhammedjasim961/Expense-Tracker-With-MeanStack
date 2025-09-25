/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js", // Add Flowbite
  ],
  darkMode: "class", // For Flowbite dark mode
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"), // Add Flowbite plugin
  ],
};
