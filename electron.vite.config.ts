// Configuração do electron-vite para main, preload e renderer.
// Define os aliases compartilhados e compila o preload em CommonJS para o sandbox.
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

const shared = resolve(__dirname, 'src/shared')

export default defineConfig({
  main: {
    // Native modules (better-sqlite3) não podem ser empacotados; mantém o require externo.
    plugins: [externalizeDepsPlugin()],
    resolve: { alias: { '@shared': shared } }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias: { '@shared': shared } },
    build: {
      rollupOptions: {
        output: { format: 'cjs', entryFileNames: '[name].js' }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src'),
        '@shared': shared
      }
    },
    plugins: [vue()]
  }
})
