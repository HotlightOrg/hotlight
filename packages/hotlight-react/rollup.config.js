import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from '@rollup/plugin-typescript';

export const plugins = [
  peerDepsExternal(),
  typescript(),
  resolve(),
  commonjs(),
]

export default {
  input: "src/index.ts",
  plugins: plugins.concat(),
  output: [
    {
      file: "dist/hotlight-react.cjs.js",
      //dir: "dist/cjs",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/hotlight-react.esm.js",
      //dir: "dist/esm",
      format: "esm",
      sourcemap: true,
    },
    /*
    {
      //file: "dist/hotlight-react.umd.js",
      dir: "dist/umd",
      format: "umd",
      sourcemap: true,
      name: "HotlightReact"
    },
    {
      //file: "dist/hotlight-react.unpkg.js",
      dir: "dist/unpkg",
      format: "iife",
      sourcemap: true,
      name: "HotlightReact"
    }
    */
  ]
};
