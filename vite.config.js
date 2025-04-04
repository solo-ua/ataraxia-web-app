import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'], 
  define: {
    'import.meta.env': process.env, // Ensure environment variables are available
  },
})
