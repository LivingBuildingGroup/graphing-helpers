'use strict';

const warnings   = require('./build/developer-warnings');
const graphs     = require('./build/graphs');
const styles     = require('./build/styles');
const layers     = require('./build/layers');
const preSetEdit = require('./build/pre-set-edit');
const preSetExtr = require('./build/pre-set-extract');
const preSetSel  = require('./build/pre-set-selectors');
const tracking   = require('./build/tracking');

module.exports = Object.assign({},
  warnings,
  graphs,
  styles,
  layers,
  preSetEdit,
  preSetExtr,
  preSetSel,
  tracking
);