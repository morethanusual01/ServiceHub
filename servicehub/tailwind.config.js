import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    defaultTheme: "light",
    themes: {
      light: {
        extend: "light",
        layout: {
          hoverOpacity: 0.8,
        },
        colors: {
          background: "#FFFFFF",
          foreground: "#11181C",
          primary: {
            foreground: "#FFFFFF",
            DEFAULT: "#12A150",
            50: "#E8F7EE",
            100: "#D1EFDD",
            200: "#A3DFBB",
            300: "#75CF99",
            400: "#47BF77",
            500: "#12A150",
            600: "#0E8140",
            700: "#0B6130",
            800: "#084120",
            900: "#052010"
          }
        }
      }
    }
  })],
}

module.exports = config;