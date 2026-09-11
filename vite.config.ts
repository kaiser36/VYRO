import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/brevo': {
        target: 'https://api.brevo.com/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/brevo/, ''),
      },
    },
  },
});
