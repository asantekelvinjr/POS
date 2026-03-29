import type { Config } from 'tailwindcss'

const config: Config = {
  // Tell Tailwind which files to scan for class names
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // Dark mode via class on <html>
  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
        display: ['Syne', 'Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },

  plugins: [],
}

export default config
