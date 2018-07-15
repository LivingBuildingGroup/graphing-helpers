'use strict';

const graphs     = require('./build/functions/graphs');
const selectors  = require('./build/functions/selectors');
const styles     = require('./build/functions/styles');
const palettes   = require('./build/functions/palettes');

module.exports = Object.assign({},
  graphs,
  selectors,
  styles,
  palettes
);