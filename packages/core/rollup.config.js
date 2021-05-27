import { camelCase } from 'lodash';

const pkg = require('./package.json');

const libraryName = 'zeiq-core';

export default {
  input: pkg.main,
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: camelCase(libraryName),
  },
  watch: {
    include: ['src/**', 'node_modules'],
  },
};
