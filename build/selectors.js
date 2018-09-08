'use strict';

var listAllLayers = function listAllLayers(oneUnit, layersRawPrefixCount) {
  // console.log('layersRawPrefixCount',layersRawPrefixCount)
  var layers = [];
  for (var layer in oneUnit) {
    if (layersRawPrefixCount === 0) {
      layers.push(layer);
    } else {
      var unPrefix = layer.split('__');
      // console.log('layer',layer,'unPrefix', unPrefix)
      // console.log(unPrefix[unPrefix.length-1]);
      layers.push(unPrefix[unPrefix.length - 1]);
    }
  }
  return layers;
};

var finalizeSelectorObject = function finalizeSelectorObject(input) {
  var oneUnit = input.oneUnit,
      layersAllUnPrefixed = input.layersAllUnPrefixed,
      groups = input.groups,
      groupsSub = input.groupsSub,
      units = input.units,
      labels = input.labels,
      abbrevs = input.abbrevs;

  var legendObject = {};
  var layersAllPrefixed = [];
  var layersThatHaveUnits = [];
  var alreadyDone = {};

  var g1 = Array.isArray(groups) ? groups : [''];
  var g2 = Array.isArray(groupsSub) ? groupsSub : [''];
  // console.log('g1', g1)
  // console.log('g2', g2)
  // console.log('groups', groups)
  // console.log('groupsSub', groupsSub)
  // console.log('units', units)
  // console.log('oneUnit', oneUnit)

  layersAllUnPrefixed.forEach(function (key) {
    g1.forEach(function (group) {
      var g = group ? group + '__' : '';
      var g_ = group ? group + ' ' : '';
      g2.forEach(function (subGroup) {
        var s = subGroup ? subGroup + '__' : '';
        var s_ = subGroup ? subGroup + ' ' : '';
        var prefixedKeyG = '' + g + key;
        var prefixedKeyGS = '' + g + s + key;
        var prefixedKeyS = '' + s + key;
        var keyToUse = key;
        var preToUse = '';
        if (oneUnit.hasOwnProperty(key)) {
          keyToUse = key;
          preToUse = '';
        } else if (oneUnit.hasOwnProperty(prefixedKeyG)) {
          keyToUse = prefixedKeyG;
          preToUse = '' + g_;
        } else if (oneUnit.hasOwnProperty(prefixedKeyGS)) {
          keyToUse = prefixedKeyGS;
          preToUse = '' + g_ + s_;
        } else if (oneUnit.hasOwnProperty(prefixedKeyS)) {
          keyToUse = prefixedKeyS;
          preToUse = '' + s_;
        }
        if (!alreadyDone[keyToUse]) {
          alreadyDone[keyToUse] = true;
          layersAllPrefixed.push(keyToUse);
          if (units[key]) {
            layersThatHaveUnits.push(keyToUse);
            legendObject[keyToUse] = ['' + preToUse + abbrevs[key], '' + preToUse + labels[key], units[key]];
          }
        }
      });
    });
  });
  // console.log('####### layersThatHaveUnits',layersThatHaveUnits)

  return {
    layersThatHaveUnits: layersThatHaveUnits,
    layersAllPrefixed: layersAllPrefixed,
    legendObject: legendObject
  };
};

var createLayerSelectorObject = function createLayerSelectorObject(input) {
  var data = input.data,
      layersRawPrefixCount = input.layersRawPrefixCount,
      layersAllUnPrefixed = input.layersAllUnPrefixed,
      groups = input.groups,
      groupsSub = input.groupsSub,
      units = input.units,
      abbrevs = input.abbrevs,
      labels = input.labels;
  // console.log('@@@@@@ layersAllUnPrefixed',layersAllUnPrefixed)
  // 
  // always receiving dataType1Processed

  var oneUnit = data[0];
  // console.log('oneUnit',oneUnit)

  var needToListAllLayers = true;
  if (layersRawPrefixCount > 0) {
    needToListAllLayers = true;
  } else if (Array.isArray(layersAllUnPrefixed)) {
    if (layersAllUnPrefixed.length > 0) {
      needToListAllLayers = false;
    }
  }

  var layersAllUnPrefixedNew = needToListAllLayers ? listAllLayers(oneUnit, layersRawPrefixCount) : layersAllUnPrefixed;
  // console.log('layersAllUnPrefixedNew',layersAllUnPrefixedNew);

  var selectorObjectNew = finalizeSelectorObject({
    oneUnit: oneUnit,
    layersAllUnPrefixedNew: layersAllUnPrefixedNew,
    groups: groups,
    groupsSub: groupsSub,
    units: units,
    labels: labels,
    abbrevs: abbrevs });
  // console.log('**** selectorObjectNew',selectorObjectNew);

  return selectorObjectNew;
};

module.exports = {
  listAllLayers: listAllLayers,
  finalizeSelectorObject: finalizeSelectorObject,
  createLayerSelectorObject: createLayerSelectorObject
};