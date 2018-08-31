'use strict';

const createLayerSelectors = input => {

  const {
    dataConvert, // 1 or 2 or 0
    data,
    units,
    labels,
    abbrevs,
    layersArray,
    dataGroupsArray,
    groupsSub,
  } = input;

  const layerSelectors = [];
  const layersAll = [];
  const legendObject = {};
 
  if(dataConvert === 2){
    // NOT CURRENTLY USING THIS OPTION IN GRAPHWRAPPER!!!
    // I DO NOT REMEMBER WHAT dataGroupsArray IS FOR
    if(Array.isArray(layersArray) && Array.isArray(dataGroupsArray)){
      layersArray.forEach(key =>{
        dataGroupsArray.forEach(group=>{
          if(Array.isArray(groupsSub)){
            groupsSub.forEach(subGroup=>{
              const prefixedKey = `${group}__${subGroup}__${key}`;
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
          } else {
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
          }
        });
      });
    } else if(data[0]){
      // THIS IS THE OPTION CURRENTLY IN USE IN GRAPHWRAPPER
      for(let prefixedKey in data[0]){
        if(Array.isArray(groupsSub)){
          const unPrefix = prefixedKey.split('__');
          let key, prefix, subGroup;
          if(unPrefix.length === 1){
            key      = unPrefix[0];
          } else if(unPrefix.length === 2){
            prefix   = unPrefix[0];
            key      = unPrefix[1];
          } else if(unPrefix.length === 3){
            prefix   = unPrefix[0];
            subGroup = unPrefix[1];
            key      = unPrefix[2];
          }
          const prefixWithSpace   = prefix   ? `${prefix} `   : '' ;
          const subGroupWithSpace = subGroup ? `${subGroup} ` : '' ;
          if(units[key]){
            layerSelectors.push(prefixedKey);
            legendObject[prefixedKey] = [
              `${prefixWithSpace}${subGroupWithSpace}${abbrevs[key]}`, 
              `${prefixWithSpace}${subGroupWithSpace}${labels[key]}`, 
              units[key]
            ];
          }
          layersAll.push(prefixedKey); // superset of keys with units and without
        } else {
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