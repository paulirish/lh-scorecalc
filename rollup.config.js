// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from '@rollup/plugin-buble';
import replace from '@rollup/plugin-replace';

const NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  input: 'script/main.js',
  output: {
    file: 'calc.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    buble({
      jsx: 'h',
      objectAssign: 'Object.assign',
      transforms: {
        asyncAwait: false,
        forOf: false,
      },
    }),
    // Must preceed commonjs
    replace({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    commonjs(),
  ]
};