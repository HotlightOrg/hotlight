import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from '@rollup/plugin-typescript';

export const plugins = [
  resolve(),
  commonjs(),
  peerDepsExternal()
]

export default [
  {
    input: "src/index.ts",
    plugins: plugins.concat(typescript({ module: "esnext", declarationDir: "dist/cjs" })),
    output: [
      {
        //file: "dist/hotlight.cjs.js",
        dir: "dist/cjs",
        format: "cjs",
        sourcemap: true,

      },
    ]
  },
  {
    input: "src/index.ts",
    plugins: plugins.concat(typescript({ module: "esnext", declarationDir: "dist/esm" })),
    output: [
      {
        //file: "dist/hotlight.cjs.js",
        dir: "dist/esm",
        format: "esm",
        sourcemap: true,

      },
    ]
  }
]

/*
export default {
  input: "src/index.ts",
  plugins,
  output: [
    {
      //file: "dist/hotlight.cjs.js",
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true,

    },
    {
      //file: "dist/hotlight.esm.js",
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/hotlight.umd.js",
      format: "umd",
      sourcemap: true,
      name: "HotlightCore"
    },
    {
      file: "dist/hotlight.unpkg.js",
      format: "iife",
      sourcemap: true,
      name: "HotlightCore"
    }
  ]
};
*/
