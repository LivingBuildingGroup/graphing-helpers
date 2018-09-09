'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('conjunction-junction'),
    isObjectLiteral = _require.isObjectLiteral;

var formatControlsWithoutPreSets = function formatControlsWithoutPreSets(state, that) {
  var icons = state.iconsMain;

  var controlNamesTop = [];
  var controlIconsTop = [];
  var controlFuncsTop = [];
  var controlLabelsTop = [];
  var controlNamesBot = [];
  var controlIconsBot = [];
  var controlFuncsBot = [];
  var controlLabelsBot = [];
  if (state.closeAllow && typeof state.handleCloseGraph === 'function') {
    controlNamesTop.push('close');
    controlIconsTop.push(icons.close);
    controlFuncsTop.push(state.handleCloseGraph);
    controlLabelsTop.push('Close the graph');
  }
  if (state.printAllow) {
    controlNamesTop.push('print');
    controlIconsTop.push(icons.print);
    controlFuncsTop.push(that.printGraph);
    controlLabelsTop.push('Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).');
  }
  if (state.backgroundAllow) {
    controlNamesTop.push('background');
    controlIconsTop.push(icons.paper);
    controlFuncsTop.push(that.handleBackgroundChange);
    controlLabelsTop.push('Toggle white graph background');
  }
  if (state.selectorsAllow) {
    controlNamesBot.push('selector');
    controlIconsBot.push(icons.edit);
    controlFuncsBot.push(that.toggleLayerStyleDisplay);
    controlLabelsBot.push('Toggle graph editors');
  }
  return {
    controlNamesTop: controlNamesTop,
    controlIconsTop: controlIconsTop,
    controlFuncsTop: controlFuncsTop,
    controlLabelsTop: controlLabelsTop,
    controlNamesBot: controlNamesBot,
    controlIconsBot: controlIconsBot,
    controlFuncsBot: controlFuncsBot,
    controlLabelsBot: controlLabelsBot
  };
};

var formatPreSetsForControls = function formatPreSetsForControls(preSets, that) {
  if (!isObjectLiteral(preSets)) {
    return {
      preSetIds: [],
      preSetNames: [],
      preSetIcons: [],
      preSetFuncs: []
    };
  }
  var preSetIds = [];
  for (var id in preSets) {
    preSetIds.push(id);
  }
  preSetIds.sort();
  var preSetNames = preSetIds.map(function (id) {
    return preSets[id].name;
  });
  var preSetIcons = preSetIds.map(function (id) {
    return preSets[id].icon;
  });
  var preSetFuncs = preSetIds.map(function (id) {
    return function () {
      return that.handlePreSetChoice(id);
    };
  });
  return {
    preSetIds: preSetIds,
    preSetNames: preSetNames,
    preSetIcons: preSetIcons,
    preSetFuncs: preSetFuncs
  };
};

var formatControls = function formatControls(state, that) {
  var _formatControlsWithou = formatControlsWithoutPreSets(state, that),
      controlNamesTop = _formatControlsWithou.controlNamesTop,
      controlIconsTop = _formatControlsWithou.controlIconsTop,
      controlFuncsTop = _formatControlsWithou.controlFuncsTop,
      controlLabelsTop = _formatControlsWithou.controlLabelsTop,
      controlNamesBot = _formatControlsWithou.controlNamesBot,
      controlIconsBot = _formatControlsWithou.controlIconsBot,
      controlFuncsBot = _formatControlsWithou.controlFuncsBot,
      controlLabelsBot = _formatControlsWithou.controlLabelsBot;

  var _formatPreSetsForCont = formatPreSetsForControls(state.preSets, that),
      preSetIds = _formatPreSetsForCont.preSetIds,
      preSetNames = _formatPreSetsForCont.preSetNames,
      preSetIcons = _formatPreSetsForCont.preSetIcons,
      preSetFuncs = _formatPreSetsForCont.preSetFuncs;

  var controlNames = [].concat(_toConsumableArray(controlNamesTop), _toConsumableArray(preSetNames), _toConsumableArray(controlNamesBot));
  var controlIcons = [].concat(_toConsumableArray(controlIconsTop), _toConsumableArray(preSetIcons), _toConsumableArray(controlIconsBot));
  var controlFuncs = [].concat(_toConsumableArray(controlFuncsTop), _toConsumableArray(preSetFuncs), _toConsumableArray(controlFuncsBot));
  var controlLabels = [].concat(_toConsumableArray(controlLabelsTop), _toConsumableArray(preSetNames), _toConsumableArray(controlLabelsBot));
  return {
    preSetIds: preSetIds,
    controlNames: controlNames,
    controlIcons: controlIcons,
    controlFuncs: controlFuncs,
    controlLabels: controlLabels
  };
};

module.exports = {
  formatControlsWithoutPreSets: formatControlsWithoutPreSets,
  formatPreSetsForControls: formatPreSetsForControls,
  formatControls: formatControls
};