'use strict';

var _require = require('conjunction-junction'),
    addAllItemsToArray = _require.addAllItemsToArray,
    removeAllItemsFromArray = _require.removeAllItemsFromArray;

var unPrefixLayers = function unPrefixLayers(layers, prefixesToKeep) {
  var pre2K = Array.isArray(prefixesToKeep) ? prefixesToKeep : [];
  var newLayerObj = {};
  layers.forEach(function (l) {
    var lSplit = l.split('__');
    // ADJUST THIS SO IT PICKS UP ANY COMBO OF PREFIXES
    // RIGHT NOW IT IS PICKING UP A__B, BUT NOT A__X__B
    var lSlice = pre2K.includes(lSplit[0]) ? lSplit.slice(1, lSplit.length) : pre2K.includes(parseInt(lSplit[0], 10)) ? lSplit.slice(1, lSplit.length) : lSplit;
    var lJoin = lSlice.join('__');
    newLayerObj[lJoin] = true;
  });
  var newLayers = [];
  for (var k in newLayerObj) {
    newLayers.push(k);
  }
  newLayers.sort(); // for testability
  return newLayers;
};

var formatLayerCheckboxGroups = function formatLayerCheckboxGroups(layerSelectors, legendObject, indexUnits) {
  var layerCheckboxGroups = {};
  layerSelectors.forEach(function (key) {
    var thisUnit = !Array.isArray(legendObject[key]) ? 'units' : legendObject[key][indexUnits];

    if (!Array.isArray(layerCheckboxGroups[thisUnit])) {
      if (thisUnit !== 'units') {
        layerCheckboxGroups[thisUnit] = [];
      }
    }
    if (thisUnit !== 'units') {
      layerCheckboxGroups[thisUnit].push(key);
    }
  });

  // the array is so units can be sorted in a predictable order
  var layerCheckboxArray = [];
  for (var key in layerCheckboxGroups) {
    layerCheckboxArray.push(key);
  }
  layerCheckboxArray.sort();

  return {
    layerCheckboxGroups: layerCheckboxGroups,
    layerCheckboxArray: layerCheckboxArray
  };
};

var calcFirstLayerOnList = function calcFirstLayerOnList(state) {
  var layerCheckboxGroups = state.layerCheckboxGroups,
      layerCheckboxArray = state.layerCheckboxArray,
      layerSelectors = state.layerSelectors;

  var firstLayerOnList = !Array.isArray(layerCheckboxGroups) || !Array.isArray(layerCheckboxArray) ? layerSelectors[0] : !Array.isArray(layerCheckboxGroups[0]) ? layerSelectors[0] : layerCheckboxGroups[layerCheckboxArray[0]] ? layerCheckboxGroups[layerCheckboxArray[0]] : '';
  return firstLayerOnList;
};

var toggleLayerGroup = function toggleLayerGroup(state, group) {

  var action = !Array.isArray(state.layersSelected) ? 'new' : 'add';

  var index = 0;
  while (action === 'add' && index < group.length) {
    action = state.layersSelected.includes(group[index]) ? 'remove' : 'add';
    index++;
  }

  var layersSelected = action === 'new' ? group : action === 'add' ? addAllItemsToArray(state.layersSelected, group) : action === 'remove' ? removeAllItemsFromArray(state.layersSelected, group) : state.layersSelected;

  return layersSelected;
};

module.exports = {
  unPrefixLayers: unPrefixLayers,
  formatLayerCheckboxGroups: formatLayerCheckboxGroups,
  calcFirstLayerOnList: calcFirstLayerOnList,
  toggleLayerGroup: toggleLayerGroup
};