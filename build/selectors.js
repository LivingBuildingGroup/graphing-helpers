'use strict';

var createLayerSelectors = function createLayerSelectors(input) {
  var dataConvert = input.dataConvert,
      data = input.data,
      units = input.units,
      labels = input.labels,
      abbrevs = input.abbrevs,
      layersArray = input.layersArray,
      dataGroupsArray = input.dataGroupsArray,
      groupsSub = input.groupsSub;


  var layerSelectors = [];
  var layersAll = [];
  var legendObject = {};

  if (dataConvert === 2) {
    // NOT CURRENTLY USING THIS OPTION IN GRAPHWRAPPER!!!
    // I DO NOT REMEMBER WHAT dataGroupsArray IS FOR
    if (Array.isArray(layersArray) && Array.isArray(dataGroupsArray)) {
      layersArray.forEach(function (key) {
        dataGroupsArray.forEach(function (group) {
          if (Array.isArray(groupsSub)) {
            groupsSub.forEach(function (subGroup) {
              var prefixedKey = group + '__' + subGroup + '__' + key;
              if (units[key]) {
                layerSelectors.push(prefixedKey);
                legendObject[prefixedKey] = [group + ' ' + abbrevs[key], group + ' ' + labels[key], units[key]];
              }
              layersAll.push(prefixedKey); // superset of keys with units and without
            });
          } else {
            var prefixedKey = group + '__' + key;
            if (units[key]) {
              layerSelectors.push(prefixedKey);
              legendObject[prefixedKey] = [group + ' ' + abbrevs[key], group + ' ' + labels[key], units[key]];
            }
            layersAll.push(prefixedKey); // superset of keys with units and without
          }
        });
      });
    } else if (data[0]) {
      // THIS IS THE OPTION CURRENTLY IN USE IN GRAPHWRAPPER
      for (var prefixedKey in data[0]) {
        if (Array.isArray(groupsSub)) {
          var unPrefix = prefixedKey.split('__');
          var key = void 0,
              prefix = void 0,
              subGroup = void 0;
          if (unPrefix.length === 1) {
            key = unPrefix[0];
          } else if (unPrefix.length === 2) {
            prefix = unPrefix[0];
            key = unPrefix[1];
          } else if (unPrefix.length === 3) {
            prefix = unPrefix[0];
            subGroup = unPrefix[1];
            key = unPrefix[2];
          }
          var prefixWithSpace = prefix ? prefix + ' ' : '';
          var subGroupWithSpace = subGroup ? subGroup + ' ' : '';
          if (units[key]) {
            layerSelectors.push(prefixedKey);
            legendObject[prefixedKey] = ['' + prefixWithSpace + subGroupWithSpace + abbrevs[key], '' + prefixWithSpace + subGroupWithSpace + labels[key], units[key]];
          }
          layersAll.push(prefixedKey); // superset of keys with units and without
        } else {
          var _unPrefix = prefixedKey.split('__');
          var _prefix = _unPrefix[0];
          var _key = _unPrefix[1];
          if (units[_key]) {
            layerSelectors.push(prefixedKey);
            legendObject[prefixedKey] = [_prefix + ' ' + abbrevs[_key], _prefix + ' ' + labels[_key], units[_key]];
          }
          layersAll.push(prefixedKey); // superset of keys with units and without
        }
      }
    }
  } else if (dataConvert === 0) {
    console.log('WE HAVE NOT WRITTEN THIS YET!');
  } else {
    if (data[0]) {
      for (var _key2 in data[0]) {
        if (units[_key2]) {
          layerSelectors.push(_key2);
          legendObject[_key2] = [abbrevs[_key2], labels[_key2], units[_key2]];
        }
        layersAll.push(_key2); // superset of keys with units and without
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