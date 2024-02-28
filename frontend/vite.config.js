import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  rollupOptions: {
    external: ['react', 'react-dom', 'axios', '@tanstack/react-query'],
  },
  plugins: [react()],
  server: {
      port: "5173",
      host: '0.0.0.0',
    },

})

