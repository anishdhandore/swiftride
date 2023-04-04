import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      { find: 'crypto', replacement: 'crypto-browserify' },
      { find: 'stream', replacement: 'stream-browserify' },
      { find: 'buffer', replacement: 'buffer' },
    ],
  },
  build: {
    rollupOptions: {
      plugins: [
        // Fixes import issue in ethers
        {
          name: 'fix-ethers-import-issue',
          resolveId(id) {
            if (id === 'readable-stream') {
              return path.resolve(__dirname, 'node_modules/readable-stream');
            }
          },
        },
      ],
    },
  },
});