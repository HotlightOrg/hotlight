import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  /*
  build:{
    lib:{
      entry: './src/main.ts',
      name: 'MyLibrary',
    }
  },
  */
  //plugins: [svelte()]
  plugins: [svelte({
    compilerOptions: {
      customElement: true
    }
  })]
 /*
  plugins: [
    svelte({
      exclude: ['./src/lib/App.svelte', './src/lib/Input.svelte', './src/lib/Loading.svelte', './src/lib/Debugger.svelte'],
      compilerOptions: {
        customElement: true,
      },
    }),
    svelte({
      exclude: ['./src/lib/Modal.svelte'],
    })
  ]
  */
})
