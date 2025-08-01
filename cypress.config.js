import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://class-scheduling.vercel.app',
    supportFile: 'cypress/support/e2e.js',

    experimentalFetchPolyfill: true,    
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    supportFile: 'cypress/support/component.jsx',
  },
});
