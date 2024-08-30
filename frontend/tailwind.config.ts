import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        mobile: { max: "375px" },
        "except-mobile": { min: "376px" },
        "min-545": { min: "545px" },
        "max-546": { max: "546px" },
      },
      colors: {
        alert: "#F84A4A",
        decrease: "#0A6CFF",
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
        green: {
          10: "#E6FBF0",
          20: "#C3F5DA",
          30: "#94EBDD",
          40: "#62E59E",
          50: "#32DD81",
          60: "#05D665", // Primary
          70: "#04B656",
          80: "#049848",
          90: "#0373A9",
          100: "#02602D",
        },
      },
      fontSize: {
        "body-6xl": ["60px", { lineHeight: "150%" }],
        "body-5xl": ["48px", { lineHeight: "150%" }],
        "body-4xl": ["36px", { lineHeight: "150%" }],
        "body-3xl": ["30px", { lineHeight: "150%" }],
        "body-2xl": ["24px", { lineHeight: "150%" }],
        "body-xl": ["20px", { lineHeight: "150%" }],
        "body-lg": ["18px", { lineHeight: "150%" }],
        "body-md": ["16px", { lineHeight: "150%" }],
        "body-sm": ["14px", { lineHeight: "150%" }],
        "body-xs": ["12px", { lineHeight: "150%" }],
        "heading-1": ["24px", { lineHeight: "24px", fontWeight: 700 }],
        "heading-2": ["20px", { lineHeight: "24px", fontWeight: 700 }],
        "heading-4": ["16px", { lineHeight: "19.2px", fontWeight: 700 }],
        "body-1": ["16px", { lineHeight: "19.2px", fontWeight: 400 }],
        "body-2": ["14px", { lineHeight: "16.8px", fontWeight: 400 }],
        "body-3": ["14px", { lineHeight: "16.8px", fontWeight: 600 }],
        "body-4": ["12px", { lineHeight: "18px", fontWeight: 600 }],
      },
    },
  },
  plugins: [],
};

export default config;
