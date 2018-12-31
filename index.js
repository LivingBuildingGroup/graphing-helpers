'use strict';

const graphs     = require('./build/graphs');
const dimensions = require('./build/dimensions');
const selectors  = require('./build/selectors');
const styles     = require('./build/styles');
const palettes   = require('./build/palettes');
const layers     = require('./build/layers');
const controls   = require('./build/controls');
const preSetEdit = require('./build/pre-set-edit');
const preSetExtr = require('./build/pre-set-extract');
const preSetSel  = require('./build/pre-set-selectors');

module.exports = Object.assign({},
  graphs,
  dimensions,
  selectors,
  styles,
  palettes,
  layers,
  controls,
  preSetEdit,
  preSetExtr,
  preSetSel
);