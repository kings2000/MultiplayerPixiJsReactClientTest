import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    outDir: "build"
  },
  base: process.env.VITE_BASE_PATH || "/MultiplayerPixiJsReactClientTest",
  server:{
    proxy:{
      "/login": {
        target: "http://92.205.187.214:8080",
        changeOrigin: true
      },
    },
  },
});
