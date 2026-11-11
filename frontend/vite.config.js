import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Crucial for Zoho Catalyst Web Client Hosting to resolve relative asset paths
  server: {
    port: 5173,
    host: true,
  },
});
