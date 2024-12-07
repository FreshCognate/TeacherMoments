export default {
  content: ['./**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          'light': '#84D7D7',
          'regular': '#41BCBF',
          'dark': '#2D8484'
        },
        'lm-0': '#fff',
        'lm-1': '#f8fafc',
        'lm-2': '#f1f5f9',
        'lm-3': '#e2e8f0',
        'lm-4': '#cbd5e1',
        'dm-0': '#020617',
        'dm-1': '#0f172a',
        'dm-2': '#1e293b',
        'dm-3': '#334155',
        'dm-4': '#475569'
      },
      spacing: {
        micro: '2px'
      }
    },
  },
  plugins: [],
}