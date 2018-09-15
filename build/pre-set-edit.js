'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('conjunction-junction'),
    isObjectLiteral = _require.isObjectLiteral;

var _require2 = require('./layers'),
    unPrefixLayers = _require2.unPrefixLayers;

var applyPreSetGlobalColorToStyles = function applyPreSetGlobalColorToStyles(styles, preSetGlobalPalette) {
  var newStyles = Object.assign({}, styles);
  var layerToTrigger = void 0;
  for (var layer in styles) {
    if (newStyles[layer].style) {
      if (newStyles[layer].style.shade > 0) {
        layerToTrigger = layer;
        var shade = newStyles[layer].style.shade - 1;
        newStyles[layer].color = preSetGlobalPalette[shade];
      }
    }
  }
  return { styles: newStyles, layerToTrigger: layerToTrigger };
};

var prefixStyles = function prefixStyles(exStyles, defaults, layersAllUnPrefixed) {
  // layersAllUnPrefixed MIGHT have prefixes
  // it should ONLY have prefixes we consider minimum, such as platform letters
  // or if saving a "single" specific preSet, it might include full prefixes.
  console.log('layersAllUnPrefixed', layersAllUnPrefixed);
  // layersAllUnPrefixed should be all possible layers, un-prefixed for groups
  // remove styles not included in layersAllUnPrefixed
  var newStyles = {};
  layersAllUnPrefixed.forEach(function (l) {
    console.log('l', l);
    var lSplit = l.includes('__') ? l.split('__') : l;
    var lUnprefixed = Array.isArray(lSplit) ? lSplit[lSplit.length - 1] : l;
    newStyles[l] = isObjectLiteral(exStyles[l]) ? exStyles[l] : isObjectLiteral(defaults[l]) ? defaults[l] : isObjectLiteral(exStyles[lUnprefixed]) ? exStyles[lUnprefixed] : isObjectLiteral(defaults[lUnprefixed]) ? defaults[lUnprefixed] : { color: 'tan' };
  });
  console.log('newStyles', newStyles);
  return newStyles;
};

var parseNameIdIconType = function parseNameIdIconType(state) {
  var id = state.preSetSaveType === 'new' ? null : state.preSetIdActive;
  var name = state.preSetSaveType === 'new' ? state.preSetNameNew : state.preSetNameNew ? state.preSetNameNew : !state.preSets[id] ? 'new preset' : state.preSets[id].name;
  // preSetIconOptions should always be populated in state, but to prevent a type error, we do this:
  var preSetIconOptions = Array.isArray(state.preSetIconOptions) ? state.preSetIconOptions : [''];
  var icon =
  // new icon is whatever is in state if new or editing
  // ideally this will always trigger, if state always assigns preSetIconNew as the existing or requires a default
  state.preSetIconNew ? state.preSetIconNew :
  // nothing in state as new
  // use icon for this preset
  state.preSets[id].icon ? state.preSets[id].icon : preSetIconOptions[0];
  var type = state.preSetGroupEditMode ? 'group' : 'single';

  return {
    id: id,
    name: name,
    icon: icon,
    type: type
  };
};

var correctPrefixOfLayersSelected = function correctPrefixOfLayersSelected(state) {
  // state.layersSelected is expected to have the maximum amount of prefix
  // i.e. we may strip off prefixes, but we won't add them
  if (state.preSetSaveSettings.prefixGroups && state.preSetSaveSettings.prefixGroupsSub) {
    return state.layersSelected;
  }
  var prefixesToKeep = state.preSetSaveSettings.prefixGroups && state.preSetSaveSettings.prefixGroupsSub ? [].concat(_toConsumableArray(state.groups), _toConsumableArray(state.prefixGroupsSub)) : state.preSetSaveSettings.prefixGroups ? state.groups : state.preSetSaveSettings.prefixGroupsSub ? state.prefixGroupsSub : null;
  return unPrefixLayers(state.layersSelected, prefixesToKeep);
};

var editOnePreSetStyle = function editOnePreSetStyle(exStyles, valueRaw, layer, property, preSetGlobalPalette) {
  var styles = Object.assign({}, exStyles);
  var value = valueRaw;
  if (property.type === 'number') {
    value = parseFloat(value, 10);
  } else if (property.type === 'shade') {
    value = parseInt(value, 10);
  } else if (property.type === 'array') {
    var arr = value.split(',');
    value = arr.map(function (a) {
      return parseInt(a, 10);
    });
  } else if (property.type === 'boolean') {
    value = value === 'true';
  }

  var nestedStyle = !styles[layer] ? {} : isObjectLiteral(styles[layer].style) ? Object.assign({}, styles[layer].style) : {};

  if (property.type === 'color') {
    nestedStyle.shade = 0;
    styles[layer] = {
      style: nestedStyle,
      color: value,
      colorOld: undefined
    };
  } else if (property.type === 'shade' && value === 0) {
    nestedStyle.shade = 0;
    styles[layer] = {
      style: nestedStyle,
      color: styles[layer].colorOld,
      colorOld: undefined
    };
  } else if (property.type === 'shade') {
    nestedStyle.shade = value;
    styles[layer] = {
      style: nestedStyle,
      colorOld: styles[layer].color,
      color: preSetGlobalPalette[value - 1]
    };
  } else {
    nestedStyle[property.key] = value;
    var newStyle = Object.assign({}, styles[layer], nestedStyle);
    styles[layer] = newStyle;
  }
  return styles;
};

var formatPreSetToSave = function formatPreSetToSave(state, stylesDefault) {
  var _parseNameIdIconType = parseNameIdIconType(state),
      id = _parseNameIdIconType.id,
      name = _parseNameIdIconType.name,
      icon = _parseNameIdIconType.icon,
      type = _parseNameIdIconType.type;

  var layersSelected = correctPrefixOfLayersSelected(state);

  var styles = prefixStyles(state.styles, stylesDefault, state.layersAllUnPrefixed);

  return {
    id: id,
    name: name,
    icon: icon,
    type: type,
    graph: state.graphName,
    styles: styles,
    layersSelected: layersSelected,
    preSetSaveSettings: state.preSetSaveSettings
  };
};

module.exports = {
  applyPreSetGlobalColorToStyles: applyPreSetGlobalColorToStyles,
  prefixStyles: prefixStyles,
  parseNameIdIconType: parseNameIdIconType,
  correctPrefixOfLayersSelected: correctPrefixOfLayersSelected,
  editOnePreSetStyle: editOnePreSetStyle,
  formatPreSetToSave: formatPreSetToSave
};