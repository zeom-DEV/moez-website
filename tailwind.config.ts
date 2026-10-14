import type { Config } from "tailwindcss";

export default {
  content: ["./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        background: "#101010",
        foreground: "#f6f6f4",
        muted: "#292929",
        border: "#505050",
        "muted-foreground": "#b7b7b7"
      },
      borderRadius: { lg: "0.375rem" }
    }
  },
  // The original static website already has a complete CSS reset.
  corePlugins: { preflight: false },
  plugins: []
} satisfies Config;
