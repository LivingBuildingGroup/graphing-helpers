'use strict';

const createLayerSelectors = input => {

  const {
    dataConvert, // 1 or 2 or 0
    data,
    units,
    labels,
    abbrevs,
    layersArray,
    arrayOfDataGroups,
  } = input;

  const layerSelectors = [];
  const layersAll = [];
  const legendObject = {};
 
  if(dataConvert === 2){
    if(Array.isArray(layersArray) && Array.isArray(arrayOfDataGroups)){
      layersArray.forEach(key =>{
        arrayOfDataGroups.forEach(group=>{
          const prefixedKey = `${group}__${key}`;
          if(units[key]){
            layerSelectors.push(prefixedKey);
            legendObject[prefixedKey] = [
              `${group} ${abbrevs[key]}`, 
              `${group} ${labels[key]}`, 
              units[key],
            ];
          }
          layersAll.push(prefixedKey); // superset of keys with units and without
        });
      });
    } else if(data[0]){
      for(let prefixedKey in data[0]){
        const unPrefix = prefixedKey.split('__');
        const prefix   = unPrefix[0];
        const key      = unPrefix[1];
        if(units[key]){
          layerSelectors.push(prefixedKey);
          legendObject[prefixedKey] = [
            `${prefix} ${abbrevs[key]}`, 
            `${prefix} ${labels[key]}`, 
            units[key]
          ];
        }
        layersAll.push(prefixedKey); // superset of keys with units and without
      }
    }
  } else if(dataConvert === 0 ){
    console.log('WE HAVE NOT WRITTEN THIS YET!');
  } else {
    if(data[0]){
      for(let key in data[0]){
        if(units[key]){
          layerSelectors.push(key);
          legendObject[key] = [
            abbrevs[key],
            labels[key],
            units[key]  
          ];
        }
        layersAll.push(key);  // superset of keys with units and without
      }
    }
  }

  return {
    layerSelectors,
    layersAll,
    legendObject,
  };
};

module.exports = {
  createLayerSelectors,
};