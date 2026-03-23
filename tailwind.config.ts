import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      animation: {
        navegation: "color 1s ease-in-out normal",
        arrow: "arrow 1s ease-in-out infinite",
      },
      backgroundColor: {
        primary: "#C98185",
        primaryLight: "#ED989A",
        secondary: "#fff",
        tertiary: "#D98A8C",
      },
      colors: {
        primary: "#C98185",
        primaryLight: "#ED989A",
        secondary: "#fff",
        tertiary: "#D98A8C",
      },
      gradientColorStops: {
        primary: "#D98A8C",
      },
      keyframes: {
        arrow: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(10px)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
