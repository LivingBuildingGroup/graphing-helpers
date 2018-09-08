'use strict';

const graphs     = require('./build/graphs');
const selectors  = require('./build/selectors');
const styles     = require('./build/styles');
const palettes   = require('./build/palettes');
const layers     = require('./build/layers');
const controls   = require('./build/pre-set-controls');
const preSetEdit = require('./build/pre-set-edit');
const preSetLoad = require('./build/pre-set-load');

module.exports = Object.assign({},
  graphs,
  selectors,
  styles,
  palettes,
  layers,
  controls,
  preSetEdit,
  preSetLoad
);