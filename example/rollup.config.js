import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';

export default {
  input: './example/index.js',
  dest: './example/build/bundle.js',
  format: 'umd',
  moduleName: 'bold-sounds',
  plugins: [
    resolve(), // so Rollup can find `howler`
    commonjs(), // so Rollup can convert `howler` to an ES module
    buble({  // transpile ES2015+ to ES5
      exclude: ['node_modules/**']
    })
  ]
};
