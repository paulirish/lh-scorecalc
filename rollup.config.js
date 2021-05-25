// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from '@rollup/plugin-buble';
import { visualizer } from 'rollup-plugin-visualizer';


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
    commonjs(),
    visualizer(), // build and view stats.html
  ]
};