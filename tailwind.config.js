/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Ogbomoso Ignite Brand Colors
        brand: {
          navy: "#0B1426", // Primary Deep Navy - foundation color
          "navy-light": "#1A2B47", // Lighter navy for subtle variations
          "navy-dark": "#060A15", // Darker navy for deeper contrast
          orange: "#FF6B35", // Ignite Orange - energy and innovation
          "orange-light": "#FF8A5C", // Lighter orange for hover states
          "orange-dark": "#E55A2B", // Darker orange for pressed states
          yellow: "#FFD23F", // Tech Yellow - growth and forward movement
          "yellow-light": "#FFE066", // Lighter yellow for highlights
          "yellow-dark": "#E6BD38", // Darker yellow for depth
          white: "#FFFFFF", // Pure White - clean canvas
        },
        // Semantic color mapping for easier usage
        primary: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#FF6B35", // Main Ignite Orange
          600: "#E55A2B",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        secondary: {
          50: "#FFFEF7",
          100: "#FFFBEB",
          200: "#FEF3C7",
          300: "#FDE68A",
          400: "#FCD34D",
          500: "#FFD23F", // Main Tech Yellow
          600: "#E6BD38",
          700: "#D69E2E",
          800: "#B7791F",
          900: "#975A16",
        },
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0B1426", // Main Deep Navy
          950: "#060A15",
        },
      },
      fontFamily: {
        sans: [
          "Montserrat",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        montserrat: ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        "gradient-ignite": "linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)",
        "gradient-ignite-hover":
          "linear-gradient(135deg, #E55A2B 0%, #E6BD38 100%)",
        "gradient-navy": "linear-gradient(135deg, #0B1426 0%, #1A2B47 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #060A15 0%, #0B1426 50%, #1A2B47 100%)",
      },
      boxShadow: {
        brand: "0 4px 14px 0 rgba(11, 20, 38, 0.15)",
        "brand-lg":
          "0 10px 25px -3px rgba(11, 20, 38, 0.1), 0 4px 6px -2px rgba(11, 20, 38, 0.05)",
        ignite: "0 4px 14px 0 rgba(255, 107, 53, 0.25)",
        "ignite-lg":
          "0 10px 25px -3px rgba(255, 107, 53, 0.15), 0 4px 6px -2px rgba(255, 107, 53, 0.05)",
      },
      animation: {
        "pulse-orange": "pulse-orange 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "pulse-orange": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 0 0 rgba(255, 107, 53, 0.7)",
          },
          "50%": {
            opacity: ".5",
            boxShadow: "0 0 0 10px rgba(255, 107, 53, 0)",
          },
        },
        glow: {
          from: {
            boxShadow: "0 0 20px rgba(255, 107, 53, 0.5)",
          },
          to: {
            boxShadow: "0 0 30px rgba(255, 107, 53, 0.8)",
          },
        },
      },
    },
  },
  plugins: [],
};
