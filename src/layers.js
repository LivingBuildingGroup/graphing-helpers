'use strict';

const {
  addAllItemsToArray,
  removeAllItemsFromArray,
  isObjectLiteral,
} = require('conjunction-junction');

const unPrefixLayers = (layers, prefixesToKeep) => {
  const pre2K = Array.isArray(prefixesToKeep) ? prefixesToKeep : [] ;
  const newLayerObj = {};
  layers.forEach(l=>{
    const lSplit = l.split('__');
    const lFiltered = lSplit.filter((l,i)=>{
      return pre2K.includes(l) ||
        pre2K.includes(`${l}`) ||
        pre2K.includes(parseInt(l,10)) ||
        i === lSplit.length-1; // always return the last segment
    });
    const lJoin = lFiltered.join('__');
    newLayerObj[lJoin] = true;
  });
  const newLayers = [];
  for(let k in newLayerObj){
    newLayers.push(k);
  }
  newLayers.sort(); // this sorts by prefix, which is preferred in the UI
  return newLayers;
};

const groupLayersByUnit = (layersThatHaveUnits, legendObject, indexUnits) => {
  const layersGroupedByUnits = {};
  layersThatHaveUnits.forEach(key=>{
    const thisUnit =
      !Array.isArray(legendObject[key]) ?
        'units' :
        legendObject[key][indexUnits];
      
    if(!Array.isArray(layersGroupedByUnits[thisUnit])){
      if(thisUnit !== 'units'){
        layersGroupedByUnits[thisUnit] = [];
      }
    }
    if(thisUnit !== 'units'){
      layersGroupedByUnits[thisUnit].push(key);
    }
  });

  // the array is so units can be sorted in a predictable order
  const layerUnitsArray = [];
  for(let unit in layersGroupedByUnits){
    layerUnitsArray.push(unit);
    layersGroupedByUnits[unit].sort();
  }
  layerUnitsArray.sort();

  return {
    layersGroupedByUnits,
    layerUnitsArray
  };
};

const calcFirstLayerOnList = state => {
  // find the first layer listed, which is used to toggle a single layer on as a default condition if there is no preSet
  // if layers are supplied, just read the first one
  // if layers are not supplied (something else is wrong), but at least try to find a layer
  const { layersGroupedByUnits, layerUnitsArray, layersThatHaveUnits } = state;
  const firstLayerOnList = 
    Array.isArray(layersThatHaveUnits) ?
      layersThatHaveUnits[0] :
      !Array.isArray(layerUnitsArray) ?
        '' :
        !isObjectLiteral(layersGroupedByUnits) ?
          '' :
          !Array.isArray(layersGroupedByUnits[layerUnitsArray[0]]) ?
            '' :
            layersGroupedByUnits[layerUnitsArray[0]][0];
  return firstLayerOnList;
};

const toggleLayerGroup = (state, groupOfLayers) => {
  // add or remove an entire group of layer from the layers selected
  let action = 
    !Array.isArray(state.layersSelected) ?
      'new' :
      'add' ;

  if(!Array.isArray(groupOfLayers)){
    if(!Array.isArray(state.layersSelected)){
      return [];
    } else {
      return state.layersSelected;
    } 
  }

  let index = 0;
  while(action==='add' && index < groupOfLayers.length){
    action = 
      state.layersSelected.includes(groupOfLayers[index]) ?
        'remove' : 
        'add' ;
    index ++;
  }

  const layersSelected =
    action === 'new' ?
      groupOfLayers :
      action === 'add' ?
        addAllItemsToArray(state.layersSelected, groupOfLayers) :
        action === 'remove' ?
          removeAllItemsFromArray(state.layersSelected, groupOfLayers) :
          state.layersSelected ;

  return layersSelected;
};

module.exports = {
  unPrefixLayers,
  groupLayersByUnit,
  calcFirstLayerOnList,
  toggleLayerGroup,
};