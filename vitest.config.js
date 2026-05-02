import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        resolve: {
          tsconfigPaths: true
        },
        test: {
          name: 'frontend',
          environment: 'jsdom',
          globals: true,
          include: ['frontend/**/*.test.{js,jsx,ts,tsx}'],
          setupFiles: ['./tests/setup-frontend.js']
        }
      },
      {
        test: {
          name: 'backend',
          environment: 'node',
          globals: true,
          include: [
            'backend/**/*.test.js',
            'workers/**/*.test.js'
          ],
          testTimeout: 30000,
          hookTimeout: 60000
        }
      }
    ]
  }
});
