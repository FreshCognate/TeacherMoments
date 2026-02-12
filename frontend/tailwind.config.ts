export default {
  content: [
    './root.tsx',
    './core/**/*.{js,jsx,ts,tsx}',
    './modules/**/*.{js,jsx,ts,tsx}',
    './routes/**/*.{js,jsx,ts,tsx}',
    './uikit/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          'light': '#84D7D7',
          'regular': '#41BCBF',
          'dark': '#2D8484'
        },
        warning: {
          'light': '#fca5a5',
          'regular': '#ef4444',
          'dark': '#b91c1c'
        },
        'lm-0': '#fff',
        'lm-1': '#fafaf9',
        'lm-2': '#f5f5f4',
        'lm-3': '#e7e5e4',
        'lm-4': '#d6d3d1',
        'dm-0': '#18181b',
        'dm-1': '#27272a',
        'dm-2': '#3f3f46',
        'dm-3': '#52525b',
        'dm-4': '#71717a'
      },
      spacing: {
        micro: '2px',
        "rem": "1rem"
      }
    },
  },
  plugins: [],
}