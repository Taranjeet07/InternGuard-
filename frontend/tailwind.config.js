/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0B0F17",
          card: "#131C2E",
          border: "#1E293B",
          accent: "#0EA5E9",
          neon: "#00F0FF",
          danger: "#EF4444",
          warning: "#F59E0B",
          success: "#10B981",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(14, 165, 233, 0.25)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.25)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.25)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}
