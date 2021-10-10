import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

const pkg = require("./package.json");

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
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true
    })
  ]
};
