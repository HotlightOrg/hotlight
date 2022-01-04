import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from '@rollup/plugin-typescript';

export const plugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
]

const config = [
  {
    input: "src/index.ts",
    plugins: plugins.concat(typescript()),
    output: {
      //file: "dist/hotlight-react.cjs.js",
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true
    },
  },
  {
    input: "src/index.ts",
    plugins: plugins.concat(typescript({ declarationDir: "dist/esm" })),
    output: {
      //file: "dist/hotlight-react.esm.js",
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
    },
  }
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

export default config;


/*
 * https://gist.github.com/kripod/8a01a8a7f5baa1d121dcd07eb8a943b9
import resolve from '@rollup/plugin-node-resolve';
import ts from '@wessberg/rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const minifiedOutputs = [
  {
    file: pkg.exports['.'].import,
    format: 'esm',
  },
  {
    file: pkg.exports['.'].require,
    format: 'cjs',
  },
];

const unminifiedOutputs = minifiedOutputs.map(({ file, ...rest }) => ({
  ...rest,
  file: file.replace('.min.', '.'),
}));

const commonPlugins = [
  ts({
    transpiler: 'babel',
    babelConfig: '../..', // TODO: Use `{ rootMode: 'upward' }` instead
  }),
];

export default [
  {
    input: './src/index.ts',
    output: [...unminifiedOutputs, ...minifiedOutputs],
    plugins: [
      ...commonPlugins,
      resolve(),
      terser({ include: /\.min\.[^.]+$/ }),
    ],
    external: [/^@babel\/runtime\//],
  },
  {
    input: './src/server.ts',
    output: {
      file: pkg.exports['./server'],
      format: 'cjs',
    },
    plugins: commonPlugins,
  },
];
*/
