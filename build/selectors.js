'use strict';

var createLayerSelectorObject = function createLayerSelectorObject(input) {
  var data = input.data,
      units = input.units,
      abbrevs = input.abbrevs,
      labels = input.labels;

  // always receiving dataType1Processed

  var oneUnit = data[0];

  var legendObject = {};
  var layersAllTemp = [];
  var layersThatHaveUnitsTemp = [];

  for (var layer in oneUnit) {
    var split = layer.split('__');
    var unPrefix = split[split.length - 1];
    layersAllTemp.push({ unPrefix: unPrefix, layer: layer });
    if (units[unPrefix]) {
      var prefixes = split.length > 1 ? split.slice(0, split.length - 1) : [];
      var prefixesFormatted = prefixes.length > 0 ? prefixes.join(' ') + ' ' : '';
      layersThatHaveUnitsTemp.push({ unPrefix: unPrefix, layer: layer });
      legendObject[layer] = ['' + prefixesFormatted + abbrevs[unPrefix], '' + prefixesFormatted + labels[unPrefix], units[unPrefix]];
    }
  }

  // sort by unprefixed layers so that like layers (e.g. "rain") are grouped, not like groups (e.g. "test 52")
  layersAllTemp.sort(function (a, b) {
    return a.unPrefix > b.unPrefix;
  });
  layersThatHaveUnitsTemp.sort(function (a, b) {
    return a.unPrefix > b.unPrefix;
  });
  var layersAllPrefixed = layersAllTemp.map(function (l) {
    return l.layer;
  });
  var layersThatHaveUnits = layersThatHaveUnitsTemp.map(function (l) {
    return l.layer;
  });

  return {
    layersThatHaveUnits: layersThatHaveUnits,
    layersAllPrefixed: layersAllPrefixed,
    legendObject: legendObject
  };
};

module.exports = {
  createLayerSelectorObject: createLayerSelectorObject
};