'use strict';

const { isObjectLiteral } = require('conjunction-junction');

const formatControlsWithoutPreSets = (state, that) => {
  const icons = state.iconsMain;
  
  const controlNamesTop = [];
  const controlIconsTop = [];
  const controlFuncsTop = [];
  const controlLabelsTop= [];
  const controlNamesBot = [];
  const controlIconsBot = [];
  const controlFuncsBot = [];
  const controlLabelsBot= [];
  if(state.closeAllow && typeof state.handleCloseGraph === 'function'){
    controlNamesTop.push('close');
    controlIconsTop.push(icons.close);
    controlFuncsTop.push(state.handleCloseGraph);
    controlLabelsTop.push('Close the graph');
  }
  if(state.printAllow){
    controlNamesTop.push('print');
    controlIconsTop.push(icons.print);
    controlFuncsTop.push(that.printGraph);
    controlLabelsTop.push('Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).');
  }
  if(state.backgroundAllow){
    controlNamesTop.push('background');
    controlIconsTop.push(icons.paper);
    controlFuncsTop.push(that.handleBackgroundChange);
    controlLabelsTop.push('Toggle white graph background');
  }
  if(state.selectorsAllow){
    controlNamesBot.push('selector');
    controlIconsBot.push(icons.edit);
    controlFuncsBot.push(that.toggleLayerStyleDisplay);
    controlLabelsBot.push('Toggle graph editors');
  }
  return {
    controlNamesTop,
    controlIconsTop,
    controlFuncsTop,
    controlLabelsTop,
    controlNamesBot,
    controlIconsBot,
    controlFuncsBot,
    controlLabelsBot,
  };
};

const formatPreSetsForControls = (preSets, that) => {
  if(!isObjectLiteral(preSets)) {
    return { 
      preSetIds  : [],
      preSetNames: [],
      preSetIcons: [],
      preSetFuncs: [],
    };
  }
  const preSetIds = [];
  for(let id in preSets){
    preSetIds.push(id);
  }
  preSetIds.sort();
  const preSetNames = preSetIds.map(id=>{
    return preSets[id].name;
  });
  const preSetIcons = preSetIds.map(id=>{
    return preSets[id].icon;
  });
  const preSetFuncs = preSetIds.map(id=>{
    return ()=>that.handlePreSetChoice(id);
  });
  return {
    preSetIds,
    preSetNames,
    preSetIcons,
    preSetFuncs,
  };
};

const formatControls = (state, that) => {
  const {
    controlNamesTop,
    controlIconsTop,
    controlFuncsTop,
    controlLabelsTop,
    controlNamesBot,
    controlIconsBot,
    controlFuncsBot,
    controlLabelsBot,
  } = formatControlsWithoutPreSets(state, that);
  
  const {
    preSetIds,
    preSetNames,
    preSetIcons,
    preSetFuncs,
  } = formatPreSetsForControls(state.preSets, that);

  const controlNames = [
    ...controlNamesTop, 
    ...preSetNames,
    ...controlNamesBot, 
  ];
  const controlIcons = [
    ...controlIconsTop, 
    ...preSetIcons,
    ...controlIconsBot, 
  ];
  const controlFuncs = [
    ...controlFuncsTop, 
    ...preSetFuncs,
    ...controlFuncsBot, 
  ];
  const controlLabels = [
    ...controlLabelsTop, 
    ...preSetNames,
    ...controlLabelsBot, 
  ];
  return {
    preSetIds,
    controlNames,
    controlIcons,
    controlFuncs,
    controlLabels,
  };
};

module.exports = {
  formatControlsWithoutPreSets,
  formatPreSetsForControls,
  formatControls,
};