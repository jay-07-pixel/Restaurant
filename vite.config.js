import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Ensures relative paths in the built output
  build: {
    outDir: 'dist',
  }
})
