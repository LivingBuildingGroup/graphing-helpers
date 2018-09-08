'use strict';

const {
  addAllItemsToArray,
  removeAllItemsFromArray,
} = require('conjunction-junction');

const unPrefixLayers = (layers, prefixesToKeep) => {
  const pre2K = Array.isArray(prefixesToKeep) ? prefixesToKeep : [] ;
  const newLayerObj = {};
  layers.forEach(l=>{
    const lSplit = l.split('__');
    // ADJUST THIS SO IT PICKS UP ANY COMBO OF PREFIXES
    // RIGHT NOW IT IS PICKING UP A__B, BUT NOT A__X__B
    const lSlice = 
      pre2K.includes(lSplit[0]) ?
        lSplit.slice(1,lSplit.length) :
        pre2K.includes(parseInt(lSplit[0],10)) ?
          lSplit.slice(1,lSplit.length) :
          lSplit;
    const lJoin = lSlice.join('__');
    newLayerObj[lJoin] = true;
  });
  const newLayers = [];
  for(let k in newLayerObj){
    newLayers.push(k);
  }
  newLayers.sort(); // for testability
  return newLayers;
};

const formatLayerCheckboxGroups = (layerSelectors, legendObject, indexUnits) => {
  const layerCheckboxGroups = {};
  layerSelectors.forEach(key=>{
    const thisUnit =
      !Array.isArray(legendObject[key]) ?
        'units' :
        legendObject[key][indexUnits];
      
    if(!Array.isArray(layerCheckboxGroups[thisUnit])){
      if(thisUnit !== 'units'){
        layerCheckboxGroups[thisUnit] = [];
      }
    }
    if(thisUnit !== 'units'){
      layerCheckboxGroups[thisUnit].push(key);
    }
  });

  // the array is so units can be sorted in a predictable order
  const layerCheckboxArray = [];
  for(let key in layerCheckboxGroups){
    layerCheckboxArray.push(key);
  }
  layerCheckboxArray.sort();

  return {
    layerCheckboxGroups,
    layerCheckboxArray
  };
};

const calcFirstLayerOnList = state => {
  const { layerCheckboxGroups, layerCheckboxArray, layerSelectors } = state;
  const firstLayerOnList = 
    !Array.isArray(layerCheckboxGroups) ||
    !Array.isArray(layerCheckboxArray) ?
      layerSelectors[0] :
      !Array.isArray(layerCheckboxGroups[0]) ?
        layerSelectors[0] :
        layerCheckboxGroups[layerCheckboxArray[0]] ?
          layerCheckboxGroups[layerCheckboxArray[0]] :
          '' ;
  return firstLayerOnList;
};

const toggleLayerGroup = (state, group) => {

  let action = 
    !Array.isArray(state.layersSelected) ?
      'new' :
      'add' ;

  let index = 0;
  while(action==='add' && index < group.length){
    action = 
      state.layersSelected.includes(group[index]) ?
        'remove' : 
        'add' ;
    index ++;
  }

  const layersSelected =
    action === 'new' ?
      group :
      action === 'add' ?
        addAllItemsToArray(state.layersSelected, group) :
        action === 'remove' ?
          removeAllItemsFromArray(state.layersSelected, group) :
          state.layersSelected ;

  return layersSelected;
};

module.exports = {
  unPrefixLayers,
  formatLayerCheckboxGroups,
  calcFirstLayerOnList,
  toggleLayerGroup,
};