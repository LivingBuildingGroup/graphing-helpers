'use strict';

const createSelectors = input => {

  const {
    measurementsConvert, // 1 or 2 or 0
    measurements,
    units,
    labels,
    arrayOfKeys,
    arrayOfDataGroups,

  } = input;

  const selectors = [];
  const keysAll = [];
  const legendObject = {};
 
  if(measurementsConvert === 2){
    if(Array.isArray(arrayOfKeys) && Array.isArray(arrayOfDataGroups)){
      arrayOfKeys.forEach(key =>{
        arrayOfDataGroups.forEach(group=>{
          const prefixedKey = `${group}__${key}`;
          if(units[key]){
            selectors.push(prefixedKey);
            legendObject[prefixedKey] = [
              `${group} ${labels[key]}`, // 0 = label, do not change
              units[key]   // 1 = units, do not change
            ];
          }
          keysAll.push(prefixedKey); // superset of keys with units and without
        });
      });
    } else if(measurements[0]){
      for(let prefixedKey in measurements[0]){
        const unPrefix = prefixedKey.split('__');
        const prefix   = unPrefix[0];
        const key      = unPrefix[1];
        if(units[key]){
          selectors.push(prefixedKey);
          legendObject[prefixedKey] = [
            `${prefix} ${labels[key]}`, // 0 = label, do not change
            units[key]   // 1 = units, do not change
          ];
        }
        keysAll.push(prefixedKey); // superset of keys with units and without
      }
    }
  } else if(measurementsConvert === 0 ){
    console.log('WE HAVE NOT WRITTEN THIS YET!');
  } else {
    if(measurements[0]){
      for(let key in measurements[0]){
        if(units[key]){
          selectors.push(key);
          legendObject[key] = [
            labels[key], // 0 = label, do not change
            units[key]   // 1 = units, do not change
          ];
        }
        keysAll.push(key);  // superset of keys with units and without
      }
    }
  }

  return {
    selectors,
    keysAll,
    legendObject,
  };
};

module.exports = {
  createSelectors
};