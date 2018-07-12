'use strict';

const createGraph = require('./build/functions/create-graph');
const selectors   = require('./build/functions/selectors');
const styles      = require('./build/functions/styles');

module.exports = Object.assign({},
  createGraph,
  selectors,
  {
    styles: styles,
  }
);