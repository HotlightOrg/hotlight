import html from '@web/rollup-plugin-html';
import serve from 'rollup-plugin-serve';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'index.html',
  output: { dir: 'dist' },
  plugins: [nodeResolve(), html(), serve('dist')],
};
