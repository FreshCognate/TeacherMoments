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
        'lm-1': '#fafafa',
        'lm-2': '#f4f4f5',
        'lm-3': '#e4e4e7',
        'lm-4': '#d4d4d8',
        'dm-0': '#09090b',
        'dm-1': '#18181b',
        'dm-2': '#27272a',
        'dm-3': '#3f3f46',
        'dm-4': '#52525b'
      },
      spacing: {
        micro: '2px',
        "rem": "1rem"
      }
    },
  },
  plugins: [],
}