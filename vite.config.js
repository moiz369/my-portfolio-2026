import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    /**
     * Proxy /api/* calls to the Vercel dev server (port 3000) during local development.
     *
     * HOW TO RUN LOCALLY:
     *   Instead of `npm run dev`, use:  vercel dev
     *   This starts both Vite (frontend) and the /api serverless functions together.
     *
     * If you prefer npm run dev without vercel dev, install and run a local API server
     * on port 3001 and uncomment the proxy below:
     */

    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3001',
    //     changeOrigin: true,
    //   }
    // }
  },
})
