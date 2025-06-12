/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}", "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"],
  theme: {
    extend: {
      fontFamily: { sans: ["Pretendard"] },
      fontSize: {
        display1: ["48px", { lineHeight: "60px", fontWeight: "700" }],
        display2: ["32px", { lineHeight: "40px", fontWeight: "700" }],
        title: ["22px", { lineHeight: "30px", fontWeight: "700" }],
        heading1: ["20px", { lineHeight: "28px", fontWeight: "700" }],
        heading2: ["18px", { lineHeight: "26px", fontWeight: "700" }],
        heading3: ["16px", { lineHeight: "24px", fontWeight: "700" }],
        headline1: ["15px", { lineHeight: "24px", fontWeight: "700" }],
        headline2: ["13px", { lineHeight: "22px", fontWeight: "700" }],
        body1: ["16px", { lineHeight: "24px", fontWeight: "500" }],
        body2: ["15px", { lineHeight: "24px", fontWeight: "500" }],
        body3: ["14px", { lineHeight: "22px", fontWeight: "500" }],
        body4: ["13px", { lineHeight: "20px", fontWeight: "500" }],
        caption: ["12px", { lineHeight: "20px", fontWeight: "500" }],
      },
      colors: {
        align_blue: {
          500: "#1A75FF",
          300: "#5A9CFF",
          200: "#8BBAFE",
          100: "#DCEBFD",
        },
      },
      boxShadow: {
        card: "0px 2px 16px 0px rgba(0,0,0,0.13)",
        dimmed: "0px 4px 30px 0px rgba(28,29,32,0.25)",
      },
    },
    screens: {
      xxs: "356px",
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
}
