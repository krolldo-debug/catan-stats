/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dominic: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#B45309',
          glow: 'rgba(245,158,11,0.25)',
        },
        dante: {
          DEFAULT: '#EF4444',
          light: '#FCA5A5',
          dark: '#991B1B',
          glow: 'rgba(239,68,68,0.25)',
        },
        carl: {
          DEFAULT: '#14B8A6',
          light: '#5EEAD4',
          dark: '#0F766E',
          glow: 'rgba(20,184,166,0.25)',
        },
        stone: {
          950: '#0C0A08',
          900: '#1A1612',
          850: '#211C17',
          800: '#292319',
          700: '#3D3228',
          600: '#524537',
          500: '#6B5A47',
          400: '#8C7660',
          300: '#B0987E',
          200: '#D4BCA3',
          100: '#EDD9C4',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        body: ['Crimson Pro', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'hex-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zM28 100L0 84V50l28-16 28 16v34L28 100z' fill='none' stroke='rgba(180,130,60,0.06)' stroke-width='1'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'dominic': '0 0 20px rgba(245,158,11,0.3)',
        'dante': '0 0 20px rgba(239,68,68,0.3)',
        'carl': '0 0 20px rgba(20,184,166,0.3)',
        'inner-stone': 'inset 0 2px 8px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
