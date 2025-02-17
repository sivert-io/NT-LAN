import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        ntlan_blue: "#A5EAFF",
        ntlan_green: "#91FFC3",
        ntlan_yellow: "#FFCC7C",
        ntlan_purple: "#D7AAFF",
        ntlan_red: "#FF018A",
        ntlan_background: "#1A171F",
        ntlan_white: "#E7E4ED",
        ntlan_gray: "#423E49",
      },
    },
  },
  plugins: [],
};
export default config;
