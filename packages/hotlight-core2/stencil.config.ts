import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'hotlight',
  globalStyle: 'src/global/variables.scss',
  plugins: [sass({
    injectGlobalPaths: [
      'src/global/variables.scss'
    ]
  })],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'www'
    }
  ],
};
