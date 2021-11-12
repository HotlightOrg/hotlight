import serve from 'rollup-plugin-serve';
import replace from '@rollup/plugin-replace';
import config, { plugins } from "./rollup.config";

const devConfig = {
  input: "dev/index.ts",
  output: [config.output.filter(o => o.format === "esm")[0]],
  plugins: plugins
    .concat(serve({
      contentBase: ['dev', 'build'],
      open: true
    }))
    .concat(replace({
      'process.env.NODE_ENV': JSON.stringify("development"),
      preventAssignment: true
    }))
}

export default devConfig;
