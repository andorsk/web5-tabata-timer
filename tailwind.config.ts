import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  safelist: [
    "bg-red-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-violet-500",
    "bg-green-200",
  ],
  plugins: [],
};
export default config;
