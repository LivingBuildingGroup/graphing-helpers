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

const finalizeSelectorObject = input  => {
  const {
    oneUnit, 
    layersAllUnPrefixed, 
    groups, 
    groupsSub, 
    units, 
    labels, 
    abbrevs} = input;
  const legendObject       = {};
  const layersAllPrefixed  = [];
  const layersThatHaveUnits= [];
  const alreadyDone        = {};

  const g1 = Array.isArray(groups   ) ? groups    : [''] ;
  const g2 = Array.isArray(groupsSub) ? groupsSub : [''] ;
  // console.log('g1', g1)
  // console.log('g2', g2)
  // console.log('groups', groups)
  // console.log('groupsSub', groupsSub)
  // console.log('units', units)
  // console.log('oneUnit', oneUnit)

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
        let keyToUse = key;
        let preToUse = '';
        if(oneUnit.hasOwnProperty(key)){
          keyToUse = key;
          preToUse = '';
        } else if (oneUnit.hasOwnProperty(prefixedKeyG)){
          keyToUse = prefixedKeyG;
          preToUse = `${g_}`;
        } else if (oneUnit.hasOwnProperty(prefixedKeyGS)){
          keyToUse = prefixedKeyGS;
          preToUse = `${g_}${s_}`;
        } else if (oneUnit.hasOwnProperty(prefixedKeyS)){
          keyToUse = prefixedKeyS;
          preToUse = `${s_}`;
        }
        if(!alreadyDone[keyToUse]){
          alreadyDone[keyToUse] = true;
          layersAllPrefixed.push(keyToUse);
          if(units[key]){
            layersThatHaveUnits.push(keyToUse);
            legendObject[keyToUse] = [
              `${preToUse}${abbrevs[key]}`, 
              `${preToUse}${labels[key]}`, 
              units[key],
            ];
          }
        }
      });
    });
  });
  // console.log('####### layersThatHaveUnits',layersThatHaveUnits)

  return {
    layersThatHaveUnits,
    layersAllPrefixed,
    legendObject,
  };
};

const createLayerSelectorObject = input => {

  const {
    data,
    layersRawPrefixCount,
    layersAllUnPrefixed,
    groups,
    groupsSub,
    units,
    abbrevs,
    labels,
  } = input;
  // console.log('@@@@@@ layersAllUnPrefixed',layersAllUnPrefixed)
  // 
  // always receiving dataType1Processed
  const oneUnit = data[0] ;
  // console.log('oneUnit',oneUnit)

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

  const selectorObjectNew = finalizeSelectorObject({
    oneUnit,
    layersAllUnPrefixedNew,
    groups, 
    groupsSub,
    units, 
    labels, 
    abbrevs});
  // console.log('**** selectorObjectNew',selectorObjectNew);

  return selectorObjectNew;
};

module.exports = {
  listAllLayers,
  finalizeSelectorObject,
  createLayerSelectorObject
};