import serve from 'rollup-plugin-serve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import config, { plugins } from "./rollup.config";

const esmConfig = config[1].output;

const devConfig = {
  input: "src/index.ts",
  output: esmConfig,
  plugins: plugins
    .concat(serve({
      contentBase: ['dev', 'dist'],
      open: true
    }))
    .concat(replace({
      'process.env.NODE_ENV': JSON.stringify("development"),
      preventAssignment: true
    }))
    .concat(typescript({
      module: "esnext",
      declarationDir: "dist/esm"
    }))
}

export default devConfig;
