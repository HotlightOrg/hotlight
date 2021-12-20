import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from '@rollup/plugin-typescript';

export const plugins = [
  peerDepsExternal(),
  resolve({
    extensions: ["ts", "tsx"]
  }),
  commonjs(),
]

const output = (format, typeDeclarations = false) => ({
  input: "src/index.ts",
  plugins: typeDeclarations ? [typescript()].concat(plugins) : plugins,
  output: {
    dir: format === "iife" ? "dist/unpkg" : `dist/${format}`,
    format,
    sourcemap: true,
    name: ["iife", "umd"].includes(format) ? "HotlightReact" : undefined,
  }
})

const config = [
  output("esm", true),
  output("cjs"),
  output("umd"),
  output("iife")
];

console.log(config)

export default config;
