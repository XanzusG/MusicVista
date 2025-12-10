/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '2rem',
        '2xl': '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        // Primary Brand Color (Green)
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          900: '#14532D',
          DEFAULT: '#22C55E',
          foreground: '#FFFFFF',
        },
        // Neutral Colors
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          500: '#A3A3A3',
          700: '#404040',
          900: '#171717',
        },
        // Semantic Colors
        success: '#16A34A',
        warning: '#CA8A04',
        error: '#DC2626',
        info: '#2563EB',
        // Chart Colors
        chart: {
          1: '#22C55E',
          2: '#14B8A6',
          3: '#A855F7',
          4: '#F97316',
          5: '#EC4899',
        },
        // Background Colors
        background: '#FAFAFA',
        surface: '#FFFFFF',
        elevated: '#FFFFFF',
        // Legacy shadcn/ui compatibility
        border: '#E5E5E5',
        input: '#E5E5E5',
        ring: '#22C55E',
        foreground: '#171717',
        secondary: {
          DEFAULT: '#F5F5F5',
          foreground: '#171717',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#404040',
        },
        accent: {
          DEFAULT: '#F0FDF4',
          foreground: '#14532D',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#171717',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        display: ['56px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h1: ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        h2: ['32px', { lineHeight: '1.3' }],
        h3: ['24px', { lineHeight: '1.4' }],
        'body-large': ['18px', { lineHeight: '1.6' }],
        body: ['16px', { lineHeight: '1.5' }],
        small: ['14px', { lineHeight: '1.5' }],
        caption: ['12px', { lineHeight: '1.4', letterSpacing: '0.01em' }],
      },
      spacing: {
        18: '72px',
        22: '88px',
        26: '104px',
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
        lg: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
        xl: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
      },
      transitionDuration: {
        fast: '200ms',
        normal: '250ms',
        slow: '300ms',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
