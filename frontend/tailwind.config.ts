import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          0: "#FFFFFF",
          5: "#F7F8FA",
          10: "#EFF0F1",
          20: "#D8DADC",
          30: "#B9BCC1",
          40: "#999DA4",
          50: "#7A8088",
          60: "#5D646E",
          70: "#4F555E",
          80: "#42474E",
          90: "#35393F",
          100: "#2A2D31",
        },
      },
    },
  },
  plugins: [],
};
export default config;
