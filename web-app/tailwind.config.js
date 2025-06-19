const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      // CONTEXT: Sophisticated three-theme system embodying the core philosophies of the Founder's Codex
      colors: {
        // Stoic Theme - Roman marble, parchment, timeless wisdom
        stoic: {
          background: 'hsl(var(--stoic-background))',
          foreground: 'hsl(var(--stoic-foreground))',
          card: 'hsl(var(--stoic-card))',
          'card-foreground': 'hsl(var(--stoic-card-foreground))',
          popover: 'hsl(var(--stoic-popover))',
          'popover-foreground': 'hsl(var(--stoic-popover-foreground))',
          primary: 'hsl(var(--stoic-primary))',
          'primary-foreground': 'hsl(var(--stoic-primary-foreground))',
          secondary: 'hsl(var(--stoic-secondary))',
          'secondary-foreground': 'hsl(var(--stoic-secondary-foreground))',
          muted: 'hsl(var(--stoic-muted))',
          'muted-foreground': 'hsl(var(--stoic-muted-foreground))',
          accent: 'hsl(var(--stoic-accent))',
          'accent-foreground': 'hsl(var(--stoic-accent-foreground))',
          destructive: 'hsl(var(--stoic-destructive))',
          'destructive-foreground': 'hsl(var(--stoic-destructive-foreground))',
          border: 'hsl(var(--stoic-border))',
          input: 'hsl(var(--stoic-input))',
          ring: 'hsl(var(--stoic-ring))',
        },
        // Deep Work Theme - Dark mode for intense focus
        'deep-work': {
          background: 'hsl(var(--deep-work-background))',
          foreground: 'hsl(var(--deep-work-foreground))',
          card: 'hsl(var(--deep-work-card))',
          'card-foreground': 'hsl(var(--deep-work-card-foreground))',
          popover: 'hsl(var(--deep-work-popover))',
          'popover-foreground': 'hsl(var(--deep-work-popover-foreground))',
          primary: 'hsl(var(--deep-work-primary))',
          'primary-foreground': 'hsl(var(--deep-work-primary-foreground))',
          secondary: 'hsl(var(--deep-work-secondary))',
          'secondary-foreground': 'hsl(var(--deep-work-secondary-foreground))',
          muted: 'hsl(var(--deep-work-muted))',
          'muted-foreground': 'hsl(var(--deep-work-muted-foreground))',
          accent: 'hsl(var(--deep-work-accent))',
          'accent-foreground': 'hsl(var(--deep-work-accent-foreground))',
          destructive: 'hsl(var(--deep-work-destructive))',
          'destructive-foreground': 'hsl(var(--deep-work-destructive-foreground))',
          border: 'hsl(var(--deep-work-border))',
          input: 'hsl(var(--deep-work-input))',
          ring: 'hsl(var(--deep-work-ring))',
        },
        // Growth Theme - Energetic, optimistic, inspiring action
        growth: {
          background: 'hsl(var(--growth-background))',
          foreground: 'hsl(var(--growth-foreground))',
          card: 'hsl(var(--growth-card))',
          'card-foreground': 'hsl(var(--growth-card-foreground))',
          popover: 'hsl(var(--growth-popover))',
          'popover-foreground': 'hsl(var(--growth-popover-foreground))',
          primary: 'hsl(var(--growth-primary))',
          'primary-foreground': 'hsl(var(--growth-primary-foreground))',
          secondary: 'hsl(var(--growth-secondary))',
          'secondary-foreground': 'hsl(var(--growth-secondary-foreground))',
          muted: 'hsl(var(--growth-muted))',
          'muted-foreground': 'hsl(var(--growth-muted-foreground))',
          accent: 'hsl(var(--growth-accent))',
          'accent-foreground': 'hsl(var(--growth-accent-foreground))',
          destructive: 'hsl(var(--growth-destructive))',
          'destructive-foreground': 'hsl(var(--growth-destructive-foreground))',
          border: 'hsl(var(--growth-border))',
          input: 'hsl(var(--growth-input))',
          ring: 'hsl(var(--growth-ring))',
        },
        // Default theme variables for shadcn/ui compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        radius: 'var(--radius)',
      },
      // Typography scale for wisdom and clarity
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      // Spacing for the 90-year grid and life visualization
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '104': '26rem',
        '128': '32rem',
      },
      // Animation for philosophical transitions
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
