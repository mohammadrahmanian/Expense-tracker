import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
      },
      fontSize: {
        display: [
          "2.5rem",
          { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.02em" },
        ],
        h1: [
          "1.5rem",
          { lineHeight: "1.25", fontWeight: "600", letterSpacing: "-0.02em" },
        ],
        h2: [
          "1.125rem",
          { lineHeight: "1.35", fontWeight: "600", letterSpacing: "-0.01em" },
        ],
        body: ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }],
        overline: [
          "0.6875rem",
          { lineHeight: "1.45", fontWeight: "600", letterSpacing: "0.1em" },
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        surface: "#FFFDF8",
        neutral: {
          50: "#FAF6F1",
          100: "#F5F0E8",
          200: "#E8E2D8",
          300: "#D7CEC2",
          400: "#B9AEA1",
          500: "#9C958E",
          600: "#6B6560",
          700: "#4B4641",
          800: "#2C2C28",
          900: "#1A1A18",
        },
        gold: {
          50: "#FDF6E8",
          100: "#F0DEB0",
          200: "#E2C878",
          300: "#D4A94E",
          400: "#C9A030",
          500: "#B8860B",
          600: "#996F00",
          700: "#7A5800",
          800: "#624800",
          900: "#4A3500",
        },
        success: {
          50: "#E8F5EC",
          100: "#EAF6EE",
          300: "#A8D7B3",
          500: "#2D8C45",
          700: "#1E5F2F",
        },
        warning: {
          50: "#FFF8E1",
          100: "#FFF5DB",
          300: "#E0C97A",
          500: "#8B7A2B",
          700: "#5E531D",
        },
        danger: {
          50: "#FDEAEA",
          100: "#FDECEC",
          300: "#E79D96",
          500: "#C0392B",
          700: "#8A281E",
        },
        info: {
          100: "#EBF4FF",
          300: "#90CDF4",
          500: "#2B6CB0",
          700: "#1A4971",
        },
      },
      borderRadius: {
        lg: "14px",
        md: "10px",
        sm: "4px",
        xl: "16px",
        icon: "12px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
