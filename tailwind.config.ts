import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Near-black charcoal with a faint cool cast that sits well beside the logo navy
        ink: {
          DEFAULT: "#14161B",
          900: "#14161B",
          800: "#1D2027",
          700: "#2A2E37",
          600: "#3B404B",
        },
        // Warm off-white
        paper: {
          DEFAULT: "#F6F3EE",
          100: "#FBFAF7",
          200: "#EEE9E1",
          300: "#DDD6CA",
        },
        muted: {
          DEFAULT: "#5A5E66", // body copy on paper (6:1)
          dark: "#A9ADB5", // body copy on ink (7.7:1)
        },
        navy: "#21254B",
        // Pulled from the logo. DEFAULT for fills, dark for text on paper, light for text on ink.
        accent: {
          DEFAULT: "#0077B6",
          dark: "#00699F",
          light: "#5CB8EA",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
      },
      maxWidth: {
        site: "90rem",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1.0) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.08) translate3d(-1%,-1%,0)" },
        },
      },
      animation: {
        kenburns: "kenburns 9s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
