import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        "min-376": {
          min: "376px",
        },
        "mobile-459": {
          min: "459px",
        },
        "min-545": {
          min: "545px",
        },
        tablet: {
          max: "1280px",
        },
        "mobile-545": {
          max: "545px",
        },
        mobile: {
          max: "1024px",
        },
        "except-mobile-545": {
          min: "546px",
        },
        "except-mobile": {
          min: "1024px",
        },
        "except-tablet": {
          min: "1280px",
        },
        "except-web": {
          min: "1400px",
        },
      },
      colors: {
        "badge-sell-background": "rgba(10, 108, 255, 0.2)",
        "badge-sell-midground": "rgba(10, 108, 255, 0.5)",
        "badge-sell-foreground": "rgba(10, 108, 255, 1)",
        "badge-buy-background": "rgba(248, 74, 74, 0.2)",
        "badge-buy-midground": "rgba(248, 74, 74, 0.5)",
        "badge-buy-foreground": "rgba(248, 74, 74, 1)",
        alert: "#F84A4A",
        decrease: "#0A6CFF",
        increaseBackground: "#FFECEC",
        decreaseBackground: "#DCEAFF",
        gray: {
          "0": "#FFFFFF",
          "5": "#F7F8FA",
          "10": "#EFF0F1",
          "20": "#D8DADC",
          "30": "#B9BCC1",
          "40": "#999DA4",
          "50": "#7A8088",
          "60": "#5D646E",
          "70": "#4F555E",
          "80": "#42474E",
          "90": "#35393F",
          "100": "#2A2D31",
        },
        green: {
          "10": "#E6FBF0",
          "20": "#C3F5DA",
          "30": "#94EBDD",
          "40": "#62E59E",
          "50": "#32DD81",
          "60": "#05D665",
          "70": "#04B656",
          "80": "#049848",
          "90": "#0373A9",
          "100": "#02602D",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: "rgba(5, 214, 101, 1)",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontSize: {
        "heading-1": ["24px", { lineHeight: "28.8px", fontWeight: 700 }],
        "heading-2": ["20px", { lineHeight: "24px", fontWeight: 700 }],
        "heading-3": ["18px", { lineHeight: "21.6px", fontWeight: 700 }],
        "heading-3-regular": [
          "18px",
          { lineHeight: "21.6px", fontWeight: 700 },
        ],
        "heading-4": ["16px", { lineHeight: "19.2px", fontWeight: 700 }],
        "body-1": ["16px", { lineHeight: "19.2px", fontWeight: 400 }],
        "body-2": ["14px", { lineHeight: "16.8px", fontWeight: 400 }],
        "body-3": ["14px", { lineHeight: "16.8px", fontWeight: 600 }],
        "body-4": ["12px", { lineHeight: "14.4px", fontWeight: 600 }],
        "body-5": ["12px", { lineHeight: "14.4px", fontWeight: 400 }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        popover: "0px 0px 7px 0px rgba(0, 0, 0, 0.1)",
        deleteRow: "0px 0px 4px 0px rgba(0, 0, 0, 0.2)",
        header: "0px 3px 5px 0px rgba(42, 45, 49, 0.03)",
        "chart-tooltip": "1px 1px 4px 2px #00000033",
      },
      zIndex: {
        "9999": "9999",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
};

export default config;
