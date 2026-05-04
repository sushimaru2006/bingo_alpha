import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Capacitor は dist ディレクトリを参照する（capacitor.config.ts の webDir と一致させること）
    outDir: 'dist',
  },
})
