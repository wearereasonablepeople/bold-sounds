import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    dest: pkg.browser,
    format: 'umd',
    moduleName: 'bold-sounds',
    plugins: [
      // so Rollup can find `howler`
      resolve(),
      // so Rollup can convert `howler` to an ES module
      commonjs(),
      // transpile ES2015+ to ES5
      buble({
        exclude: ['node_modules/**']
      })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    input: 'src/index.js',
    external: ['howler'],
    output: [
      {file: pkg.main, format: 'cjs'},
      {file: pkg.module, format: 'es'}
    ],
    plugins: [
      buble({
        exclude: ['node_modules/**']
      })
    ]
  }
];
