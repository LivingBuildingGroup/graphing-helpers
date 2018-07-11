'use strict';

const createGraph = require('./functions/create-graph');
const selectors   = require('./functions/selectors');
const styles      = require('./functions/styles');

module.exports = Object.assign({},
  createGraph,
  selectors,
  {
    styles,
  }
);