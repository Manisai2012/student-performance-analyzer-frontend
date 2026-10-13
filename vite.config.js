import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist')
        const indexHtml = path.join(distDir, 'index.html')
        const fallbackHtml = path.join(distDir, '404.html')
        if (fs.existsSync(indexHtml)) {
          fs.copyFileSync(indexHtml, fallbackHtml)
        }
      },
    },
  ],
})
