import peerDepsExternal from "rollup-plugin-peer-deps-external";
import serve from 'rollup-plugin-serve';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

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
