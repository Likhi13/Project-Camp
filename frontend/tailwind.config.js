/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: { light: "#F7F8FA", dark: "#12141A" },
        surface: { light: "#FFFFFF", dark: "#1B1E27" },
        text: { light: "#14161C", dark: "#E7E9EE" },
        muted: "#6B7280",
        accent: "#4F5FF0",
        status: {
          todo: "#94A3B8",
          progress: "#F5A623",
          done: "#22C55E",
        },
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
