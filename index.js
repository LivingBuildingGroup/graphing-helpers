'use strict';

const warnings   = require('./build/developer-warnings');
const graphs     = require('./build/graphs');
const styles     = require('./build/styles');
const layers     = require('./build/layers');
const presetExtr = require('./build/preset-extract');
const presetSel  = require('./build/preset-selectors');
const tracking   = require('./build/tracking');

module.exports = Object.assign({},
  warnings,
  graphs,
  styles,
  layers,
  presetExtr,
  presetSel,
  tracking
);