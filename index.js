'use strict';

const graphs     = require('./build/graphs');
const selectors  = require('./build/selectors');
const styles     = require('./build/styles');
const palettes   = require('./build/palettes');

module.exports = Object.assign({},
  graphs,
  selectors,
  styles,
  palettes
);