/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cyber: {
          dark: "#080c14",
          card: "#0f172a",
          cardHover: "#1e293b",
          border: "rgba(255, 255, 255, 0.08)",
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#ef4444",
          violet: "#8b5cf6"
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanLine 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.65', transform: 'scale(1.05)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '50%': { top: '95%' },
          '100%': { top: '0%' }
        }
      }
    },
  },
  plugins: [],
};
