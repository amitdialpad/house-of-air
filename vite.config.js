import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: command === 'build' ? '/house-of-air/' : '/',
  server: {
    port: 5180,
    strictPort: false,
    open: false
  }
}))
