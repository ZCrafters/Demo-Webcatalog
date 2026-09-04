import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.GITHUB_ACTIONS ? '/Demo-Webcatalog/' : '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  optimizeDeps: { entries: ['index.html'] },
})


