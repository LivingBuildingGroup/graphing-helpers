'use strict';

var _require = require('conjunction-junction'),
    isObjectLiteral = _require.isObjectLiteral;

var createGoogleTagManagerClass = function createGoogleTagManagerClass(state, action) {
  var _action = action ? action : state.graphName;
  var presetName = state.presets && state.presets[state.presetIdActive] && state.presets[state.presetIdActive].name ? state.presets[state.presetIdActive].name : 'no-preset';
  var presetArr = presetName.split(' ');
  var presetIdClass = presetArr.join('-');
  var listOfEventsObj = isObjectLiteral(state.titleText) ? state.titleText : {};
  var listOfEventsArr = [];
  for (var id in listOfEventsObj) {
    listOfEventsArr.push(id);
  }

  var listOfEventsId = listOfEventsArr.length > 0 ? listOfEventsArr.join('-') : 'no-events';
  var googleTagManagerClass = 'gw-graph-catcher ' + _action + ' ' + presetIdClass + ' ' + listOfEventsId;
  return googleTagManagerClass;
};

module.exports = {
  createGoogleTagManagerClass: createGoogleTagManagerClass
};