'use strict';

// const listAllLayersUnPrefixed = (oneUnit, layersRawPrefixCount) => {
//   // I think this is abandoned.  I don't think we are using it anymore.
//   const layersUsed = {};
//   for(let layer in oneUnit){
//     if(layersRawPrefixCount === 0){
//       layersUsed[layer] = true;
//     } else {
//       const unPrefix = layer.split('__');
//       layersUsed[unPrefix[unPrefix.length-1]] = true;
//     }
//   }
//   const layers = [];
//   for(let layer in layersUsed){
//     layers.push(layer);
//   }
//   layers.sort();
//   return layers;
// };

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
  // listAllLayersUnPrefixed,
  createLayerSelectorObject: createLayerSelectorObject
};