'use strict';

var createSelectors = function createSelectors(input) {
  var measurementsConvert = input.measurementsConvert,
      measurements = input.measurements,
      units = input.units,
      labels = input.labels,
      abbrevs = input.abbrevs,
      arrayOfKeys = input.arrayOfKeys,
      arrayOfDataGroups = input.arrayOfDataGroups;


  var selectors = [];
  var keysAll = [];
  var legendObject = {};

  if (measurementsConvert === 2) {
    if (Array.isArray(arrayOfKeys) && Array.isArray(arrayOfDataGroups)) {
      arrayOfKeys.forEach(function (key) {
        arrayOfDataGroups.forEach(function (group) {
          var prefixedKey = group + '__' + key;
          if (units[key]) {
            selectors.push(prefixedKey);
            legendObject[prefixedKey] = [group + ' ' + abbrevs[key], group + ' ' + labels[key], units[key]];
          }
          keysAll.push(prefixedKey); // superset of keys with units and without
        });
      });
    } else if (measurements[0]) {
      for (var prefixedKey in measurements[0]) {
        var unPrefix = prefixedKey.split('__');
        var prefix = unPrefix[0];
        var key = unPrefix[1];
        if (units[key]) {
          selectors.push(prefixedKey);
          legendObject[prefixedKey] = [prefix + ' ' + abbrevs[key], prefix + ' ' + labels[key], units[key]];
        }
        keysAll.push(prefixedKey); // superset of keys with units and without
      }
    }
  } else if (measurementsConvert === 0) {
    console.log('WE HAVE NOT WRITTEN THIS YET!');
  } else {
    if (measurements[0]) {
      for (var _key in measurements[0]) {
        if (units[_key]) {
          selectors.push(_key);
          legendObject[_key] = [abbrevs[_key], labels[_key], units[_key]];
        }
        keysAll.push(_key); // superset of keys with units and without
      }
    }
  }

  return {
    selectors: selectors,
    keysAll: keysAll,
    legendObject: legendObject
  };
};

module.exports = {
  createSelectors: createSelectors
};