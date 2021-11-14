//import peerDepsExternal from "rollup-plugin-peer-deps-external";
//import serve from 'rollup-plugin-serve';
//import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files

/*
export const plugins = [
  typescript({
    useTsconfigDeclarationDir: true
  }),
  resolve(),
  commonjs(),
]

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "build/cjs",
      format: "cjs",
      sourcemap: true,
    },
    {
      dir: "build/esm/",
      format: "esm",
      sourcemap: true,
    }
  ],
  plugins: plugins.concat(peerDepsExternal())
};
*/
/*
{
    name: 'MyComponent',
    exports: 'named',
  }
  */
import buble from '@rollup/plugin-buble'; // Transpile/polyfill with reasonable browser support

export default {
  input: 'src/wrapper.js', // Path relative to package.json
  output: [
    /*
    {
      dir: "build/cjs",
      format: "cjs",
      sourcemap: true,
    },
    */
    {
      dir: "build/esm/",
      format: "esm",
      sourcemap: true,
    }
  ],
  plugins: [
    commonjs(),
    /*
    typescript({
      useTsconfigDeclarationDir: true
    }),
    */
    //resolve(),
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true, // Explicitly convert template to render function
      template: {
        isProduction: true,
      },
    }),
    buble(), // Transpile to ES5
  ],
};
