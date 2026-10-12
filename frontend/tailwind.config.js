/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        syrup: {
          ruby: '#e11d48',
          honey: '#f59e0b',
          emerald: '#10b981',
          tonic: '#06b6d4',
          violet: '#8b5cf6',
        },
        indigoBrand: {
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        }
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'float-fast': 'float 3.5s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'liquid-wave': 'wave 3s ease-in-out infinite',
        'liquid-wave-reverse': 'waveReverse 4.5s ease-in-out infinite',
        'bubble-rise': 'bubbleRise 4s ease-in infinite',
        'bubble-fast': 'bubbleRise 2.2s ease-in infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'fall-tablet': 'fallDown 8s linear infinite',
        'fall-burst': 'fallDownFast 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'tumble-3d': 'tumble3D 4s ease-in-out infinite',
        'fizz': 'fizzVibrate 0.15s linear infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(6deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(16px) rotate(-8deg)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0) scaleY(1)' },
          '50%': { transform: 'translateX(-25%) scaleY(1.08)' },
        },
        waveReverse: {
          '0%, 100%': { transform: 'translateX(0) scaleY(1)' },
          '50%': { transform: 'translateX(25%) scaleY(0.92)' },
        },
        bubbleRise: {
          '0%': { transform: 'translateY(100%) scale(0.6)', opacity: '0.2' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-20%) scale(1.2)', opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 14px rgba(16, 185, 129, 0.8))' },
        },
        fallDown: {
          '0%': { transform: 'translateY(-10%) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
        fallDownFast: {
          '0%': { transform: 'translateY(-80px) rotate(0deg) scale(0.9)', opacity: '0' },
          '8%': { opacity: '0.9' },
          '85%': { opacity: '0.9' },
          '100%': { transform: 'translateY(105vh) rotate(720deg) scale(1)', opacity: '0' },
        },
        tumble3D: {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)' },
          '50%': { transform: 'rotateX(180deg) rotateY(90deg) rotateZ(180deg)' },
          '100%': { transform: 'rotateX(360deg) rotateY(180deg) rotateZ(360deg)' },
        },
        fizzVibrate: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '100%': { transform: 'translate(1px, -1px) rotate(1deg)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
