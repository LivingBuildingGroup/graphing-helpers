'use strict';

var createLayerSelectors = function createLayerSelectors(input) {
  var dataConvert = input.dataConvert,
      data = input.data,
      units = input.units,
      labels = input.labels,
      abbrevs = input.abbrevs,
      layersArray = input.layersArray,
      arrayOfDataGroups = input.arrayOfDataGroups;


  var layerSelectors = [];
  var layersAll = [];
  var legendObject = {};

  if (dataConvert === 2) {
    if (Array.isArray(layersArray) && Array.isArray(arrayOfDataGroups)) {
      layersArray.forEach(function (key) {
        arrayOfDataGroups.forEach(function (group) {
          var prefixedKey = group + '__' + key;
          if (units[key]) {
            layerSelectors.push(prefixedKey);
            legendObject[prefixedKey] = [group + ' ' + abbrevs[key], group + ' ' + labels[key], units[key]];
          }
          layersAll.push(prefixedKey); // superset of keys with units and without
        });
      });
    } else if (data[0]) {
      for (var prefixedKey in data[0]) {
        var unPrefix = prefixedKey.split('__');
        var prefix = unPrefix[0];
        var key = unPrefix[1];
        if (units[key]) {
          layerSelectors.push(prefixedKey);
          legendObject[prefixedKey] = [prefix + ' ' + abbrevs[key], prefix + ' ' + labels[key], units[key]];
        }
        layersAll.push(prefixedKey); // superset of keys with units and without
      }
    }
  } else if (dataConvert === 0) {
    console.log('WE HAVE NOT WRITTEN THIS YET!');
  } else {
    if (data[0]) {
      for (var _key in data[0]) {
        if (units[_key]) {
          layerSelectors.push(_key);
          legendObject[_key] = [abbrevs[_key], labels[_key], units[_key]];
        }
        layersAll.push(_key); // superset of keys with units and without
      }
    }
  }

  return {
    layerSelectors: layerSelectors,
    layersAll: layersAll,
    legendObject: legendObject
  };
};

module.exports = {
  createLayerSelectors: createLayerSelectors
};