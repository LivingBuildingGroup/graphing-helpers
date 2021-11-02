'use strict';

const { isObjectLiteral } = require('conjunction-junction');

const createGoogleTagManagerClass = (state, action) => {
  const _action = action ? action : state.graphName ;
  const presetName = state.presets && state.presets[state.presetIdActive] && state.presets[state.presetIdActive].name ? state.presets[state.presetIdActive].name : 'no-preset';
  const presetArr = presetName.split(' ');
  const presetIdClass = presetArr.join('-');
  const listOfEventsObj = isObjectLiteral(state.titleText) ? state.titleText : {} ;
  const listOfEventsArr = [];
  for(let id in listOfEventsObj){
    listOfEventsArr.push(id);
  }

  const listOfEventsId = listOfEventsArr.length > 0 ? listOfEventsArr.join('-') : 'no-events';
  const googleTagManagerClass = `gw-graph-catcher ${_action} ${presetIdClass} ${listOfEventsId}`;
  return googleTagManagerClass;
};

module.exports = {
  createGoogleTagManagerClass,
};