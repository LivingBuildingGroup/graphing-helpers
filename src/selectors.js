'use strict';

const createLayerSelectorObject = input => {

  const {
    data,
    units,
    abbrevs,
    labels,
  } = input;

  // always receiving dataType1Processed
  const oneUnit = data[0] ;

  const legendObject       = {};
  const layersAllTemp      = [];
  const layersThatHaveUnitsTemp= [];

  for(let layer in oneUnit){
    const split = layer.split('__');
    const unPrefix = split[split.length-1];
    layersAllTemp.push({unPrefix, layer});
    if(units[unPrefix]){
      const prefixes = split.length > 1 ? split.slice(0,split.length-1) : [] ;
      const prefixesFormatted = prefixes.length > 0 ? `${prefixes.join(' ')} ` : '' ;
      layersThatHaveUnitsTemp.push({unPrefix, layer});
      legendObject[layer] = [
        `${prefixesFormatted}${abbrevs[unPrefix]}`, 
        `${prefixesFormatted}${labels[unPrefix]}`, 
        units[unPrefix],
      ];
    }
  }

  // sort by unprefixed layers so that like layers (e.g. "rain") are grouped, not like groups (e.g. "test 52")
  layersAllTemp.sort(          (a,b)=>a.unPrefix>b.unPrefix);
  layersThatHaveUnitsTemp.sort((a,b)=>a.unPrefix>b.unPrefix);
  const layersAllPrefixed   = layersAllTemp.map(l=>l.layer);
  const layersThatHaveUnits = layersThatHaveUnitsTemp.map(l=>l.layer);

  return {
    layersThatHaveUnits,
    layersAllPrefixed,
    legendObject,
  };

};

module.exports = {
  createLayerSelectorObject
};