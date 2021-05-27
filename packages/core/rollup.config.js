import { camelCase } from 'lodash';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
// import react from 'react';
// import reactDom from 'react-dom';

const pkg = require('./package.json');

const libraryName = 'zeiq-core';

export default {
  input: 'src/main.js',
  output: {
    file: pkg.main,
    format: 'umd',
    name: camelCase(libraryName),
    sourcemap: true,
  },
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: ['src/**', 'node_modules'],
  },
  plugins: [
    // Allow json resolution
    json(),
    commonjs({
      include: 'node_modules/**',
      // namedExports: {
      //   react: Object.keys(react),
      //   'react-dom': Object.keys(reactDom),
      // },
    }),
    globals(),
    builtins(),
    // Allow node_modules resolution, so you can use 'external' to control
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    resolve({
      browser: true,
      jsnext: true,
    }),
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage

    // Resolve source maps to the original source
    sourceMaps(),
  ],
};
