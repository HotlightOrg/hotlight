import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    lib:{
      entry: './src/main.ts',
      name: 'Hotlight',
      fileName: (format) => `hotlight-core.${format}.js`
    },
  },
  plugins: [svelte({
    compilerOptions: {
      customElement: true
    }
  })]
})
