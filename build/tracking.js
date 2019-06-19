'use strict';

var _require = require('conjunction-junction'),
    isObjectLiteral = _require.isObjectLiteral;

var createGoogleTagManagerClass = function createGoogleTagManagerClass(state, action) {
  var _action = action ? action : state.graphName;
  var preSetName = state.preSets && state.preSets[state.preSetIdActive] && state.preSets[state.preSetIdActive].name ? state.preSets[state.preSetIdActive].name : 'no-pre-set';
  var preSetArr = preSetName.split(' ');
  var preSetIdClass = preSetArr.join('-');
  var listOfEventsObj = isObjectLiteral(state.titleText) ? state.titleText : {};
  var listOfEventsArr = [];
  for (var id in listOfEventsObj) {
    listOfEventsArr.push(id);
  }

  var listOfEventsId = listOfEventsArr.length > 0 ? listOfEventsArr.join('-') : 'no-events';
  var googleTagManagerClass = 'gw-graph-catcher ' + _action + ' ' + preSetIdClass + ' ' + listOfEventsId;
  return googleTagManagerClass;
};

module.exports = {
  createGoogleTagManagerClass: createGoogleTagManagerClass
};