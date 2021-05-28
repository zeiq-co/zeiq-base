import { camelCase } from 'lodash';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import react from 'react';
import reactDom from 'react-dom';
import styledComponents from 'styled-components';

const pkg = require('./package.json');

const libraryName = 'zeiq-web';

const globals = {
  lodash: 'lodash',
  graphql: 'graphql',
  sweetalert: 'sweetalert',
  react: 'React',
  'react-dom': 'ReactDom',
  'styled-components': 'styled',
};

export default {
  input: 'src/main.js',
  output: {
    file: pkg.main,
    name: camelCase(libraryName),
    format: 'umd',
    sourcemap: 'inline',
    globals,
  },
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: Object.keys(globals),
  watch: {
    include: ['src/**', 'node_modules'],
  },
  plugins: [
    // Allow json resolution
    json(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react'],
    }),
    // commonjs({ include: 'node_modules/**' }),
    commonjs({
      include: 'node_modules/**',
      // namedExports: {
      //   react: Object.keys(react),
      //   'react-dom': Object.keys(reactDom),
      //   // 'react-is': Object.keys(reactIs),
      //   'styled-components': Object.keys(styledComponents),
      // },
    }),
    builtins(),
    // Allow node_modules resolution, so you can use 'external' to control
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    resolve({
      browser: true,
      jsnext: true,
    }),
    terser(),
    // Resolve source maps to the original source
    sourceMaps(),
  ],
};
