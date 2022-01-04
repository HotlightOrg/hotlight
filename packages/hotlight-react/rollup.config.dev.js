import serve from 'rollup-plugin-serve';
import replace from '@rollup/plugin-replace';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import config, { plugins } from "./rollup.config";
import typescript from '@rollup/plugin-typescript';

const devConfig = {
  input: "dev/index.ts",
  output: config[0].output,
  plugins: [
    commonjs(),
    typescript(),
    resolve()
  ]
    .concat(serve({
      contentBase: ['dev', 'dist'],
      open: true
    }))
    .concat(replace({
      'process.env.NODE_ENV': JSON.stringify("development"),
      preventAssignment: true
    }))
}

export default devConfig;
