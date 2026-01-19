// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // table layout
    "w-full",
    "border-collapse",
    "border",
    "border-gray-300",
    "px-2",
    "py-1",
    "text-left",
    "font-semibold",

    // optional if background on rows
    "bg-gray-50",
    "bg-gray-100",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
