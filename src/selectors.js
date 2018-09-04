'use strict';

const listAllLayers = (oneUnit, layersRawPrefixCount) => {
  // console.log('layersRawPrefixCount',layersRawPrefixCount)
  const layers = [];
  for(let layer in oneUnit){
    if(layersRawPrefixCount === 0){
      layers.push(layer);
    } else {
      const unPrefix = layer.split('__');
      // console.log('layer',layer,'unPrefix', unPrefix)
      // console.log(unPrefix[unPrefix.length-1]);
      layers.push(unPrefix[unPrefix.length-1]);
    }
  }
  return layers;
};

const whatIsThisFor = (oneUnit, layersAllUnPrefixed, groups, groupsSub, units, labels, abbrevs) => {
  const legendObject      = {};
  const layersAllPrefixed = [];
  const layerSelectors    = [];
  const alreadyDone       = {};

  const g1 = Array.isArray(groups) ? groups : [''] ;
  const g2 = Array.isArray(groupsSub) ? groupsSub : [''] ;
  // console.log('g1', g1)
  // console.log('g2', g2)
  // console.log('groups', groups)
  // console.log('groupsSub', groupsSub)
  // console.log('units', units)

  layersAllUnPrefixed.forEach(key =>{
    g1.forEach(group=>{
      const g  = group ? `${group}__` : '' ;
      const g_ = group ? `${group} `  : '' ;
      g2.forEach(subGroup=>{
        const s  = subGroup ? `${subGroup}__` : '' ;
        const s_ = subGroup ? `${subGroup} `  : '' ;
        const prefixedKeyG  = `${g}${key}`;
        const prefixedKeyGS = `${g}${s}${key}`;
        const prefixedKeyS  = `${s}${key}`;
        const keyToUse = 
          oneUnit.hasOwnProperty(key) ?
            key :
            oneUnit.hasOwnProperty(prefixedKeyG) ?
              prefixedKeyG :
              oneUnit.hasOwnProperty(prefixedKeyGS) ?
                prefixedKeyGS :
                oneUnit.hasOwnProperty(prefixedKeyS) ?
                  prefixedKeyS :
                  key;
        if(!alreadyDone[keyToUse]){
          alreadyDone[keyToUse] = true;
          layersAllPrefixed.push(keyToUse);
          if(units[key]){
            layerSelectors.push(keyToUse);
            legendObject[keyToUse] = [
              `${g_}${s_}${abbrevs[key]}`, 
              `${g_}${s_}${labels[key]}`, 
              units[key],
            ];
          }
        }
      });
    });
  });

  return {
    layerSelectors,
    layersAllPrefixed,
    legendObject,
  };
};

const createLayerSelectors = input => {

  const {
    dataConvertFrom, // 1 or 2 or 0
    data,
    layersAllUnPrefixed,
    groups,
    groupsSub,
    layersRawPrefixCount,
    units,
    abbrevs,
    labels,
  } = input;
  // console.log('@@@@@@ layersAllUnPrefixed',layersAllUnPrefixed)
  // 
  // always receiving dataType1Processed
  const oneUnit = data[0] ;
  // console.log('dataConvertFrom',dataConvertFrom, 'oneUnit',oneUnit)

  let needToListAllLayers = true;
  if(layersRawPrefixCount > 0){
    needToListAllLayers = true;
  } else if(Array.isArray(layersAllUnPrefixed)){
    if(layersAllUnPrefixed.length > 0){
      needToListAllLayers = false;
    }
  }

  const layersAllUnPrefixedNew = 
    needToListAllLayers ? 
      listAllLayers(oneUnit, layersRawPrefixCount) :
      layersAllUnPrefixed;
  // console.log('layersAllUnPrefixedNew',layersAllUnPrefixedNew);

  const selectorObjectNew = whatIsThisFor(
    oneUnit,
    layersAllUnPrefixedNew,
    groups, 
    groupsSub,
    units, 
    labels, 
    abbrevs);
  // console.log('**** selectorObjectNew',selectorObjectNew);

  return selectorObjectNew;
};

module.exports = {
  createLayerSelectors
};