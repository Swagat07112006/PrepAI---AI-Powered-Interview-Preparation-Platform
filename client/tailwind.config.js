/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        cyan: {
          50: 'hsl(38, 100%, 97%)',
          100: 'hsl(38, 100%, 92%)',
          200: 'hsl(38, 98%, 80%)',
          300: 'hsl(38, 97%, 69%)',
          400: 'hsl(38, 94%, 61%)',
          DEFAULT: 'hsl(38, 92%, 50%)',
          500: 'hsl(38, 92%, 50%)',
          600: 'hsl(35, 92%, 46%)',
          700: 'hsl(31, 91%, 38%)',
          800: 'hsl(26, 90%, 31%)',
          900: 'hsl(20, 88%, 26%)',
          950: 'hsl(16, 82%, 13%)',
        },
        blue: {
          50: 'hsl(45, 100%, 96%)',
          100: 'hsl(45, 96%, 89%)',
          200: 'hsl(45, 95%, 76%)',
          300: 'hsl(45, 96%, 62%)',
          400: 'hsl(45, 95%, 52%)',
          DEFAULT: 'hsl(43, 93%, 47%)',
          500: 'hsl(43, 93%, 47%)',
          600: 'hsl(40, 96%, 40%)',
          700: 'hsl(35, 92%, 33%)',
          800: 'hsl(29, 93%, 26%)',
          900: 'hsl(22, 92%, 21%)',
          950: 'hsl(16, 92%, 11%)',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px hsl(var(--border)), 0 18px 70px rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '0.85' },
        },
        sheen: {
          '0%': { transform: 'translateX(-50%) rotate(12deg)' },
          '100%': { transform: 'translateX(120%) rotate(12deg)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        pulseSoft: 'pulseSoft 6s ease-in-out infinite',
        sheen: 'sheen 8s linear infinite',
      },
      backgroundImage: {
        grid: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};