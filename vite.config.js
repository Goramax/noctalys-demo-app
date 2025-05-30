import { defineConfig } from 'vite'
import NoctalysAssetsBuilder from './build/noctalysAssetsBuilder.js'

export default defineConfig({
  root: 'src',
  // Enable CSS source maps in dev mode
  css: {
    devSourcemap: process.env.APP_ENV === 'dev'
  },
  plugins: [ NoctalysAssetsBuilder(),
    {
      name: 'hide-local-urls',
      configureServer(server) {
        server.printUrls = () => {}
      }
    }
   ],
  server: {
    origin: 'http://localhost:5173',
    cors: true
  },
  // Enable JS build source maps in dev mode
  build: {
    sourcemap: process.env.APP_ENV === 'dev'
  }
})
