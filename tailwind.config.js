/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './components/ui',
    './app/(auth)'
  ],
  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      /* ================= COLORS ================= */

      colors: {
        primary: '#4F46E5',
        secondary: '#9CA3AF',
        accent: '#06B6D4',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',

        background: '#0B0F1A',
        surface: '#121826',

        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
          muted: '#6B7280'
        },

        border: '#1F2937'
      },

      /* ================= TYPOGRAPHY ================= */

      fontFamily: {
        sans: ['Inter'],
        heading: ['Poppins']
      },

      fontSize: {
        xs: ['12px', {lineHeight: '16px'}],
        sm: ['14px', {lineHeight: '20px'}],
        base: ['16px', {lineHeight: '24px'}],
        lg: ['18px', {lineHeight: '26px'}],
        xl: ['20px', {lineHeight: '28px'}],

        /* Production scaling */
        h1: ['32px', {lineHeight: '40px', fontWeight: '700'}],
        h2: ['26px', {lineHeight: '34px', fontWeight: '700'}],
        h3: ['22px', {lineHeight: '30px', fontWeight: '600'}]
      },

      /* ================= SHADOW (iOS looks premium) ================= */

      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.25)',
        soft: '0 4px 12px rgba(0,0,0,0.12)'
      }
    }
  },

  plugins: []
}
