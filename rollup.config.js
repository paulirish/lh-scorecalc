// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'script/main.js',
  output: {
    file: 'dist/calc.js',
    format: 'iife',
    name: 'ScoreCalc',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs()
  ]
};