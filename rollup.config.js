// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'script/main.js',
  output: {
    file: 'calc.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs()
  ]
};