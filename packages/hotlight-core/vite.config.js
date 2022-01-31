import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import svelte2tsx from "svelte2tsx";
//import sveld from 'vite-plugin-sveld'
console.log(svelte2tsx);

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    lib:{
      entry: './src/main.ts',
      name: 'Hotlight',
      fileName: (format) => `hotlight-core.${format}.js`
    },
  },
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true
      }
    })
  ]
})
