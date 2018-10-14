'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('conjunction-junction'),
    isObjectLiteral = _require.isObjectLiteral;

var _require2 = require('./layers'),
    unPrefixLayers = _require2.unPrefixLayers;

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

var editOnePreSetStyle = function editOnePreSetStyle(input) {
  // invoked by <GraphWrapper/>
  if (!isObjectLiteral(input)) return {};
  var styles = input.styles,
      value = input.value,
      layer = input.layer,
      property = input.property,
      preSetGlobalPalette = input.preSetGlobalPalette;

  if (!isObjectLiteral(styles)) return {};
  if (!isObjectLiteral(property)) return styles;
  if (typeof layer !== 'string') return styles;

  var type = property.type,
      key = property.key;

  var psgp = Array.isArray(preSetGlobalPalette) ? preSetGlobalPalette : [];

  var stylesNew = Object.assign({}, styles);
  var v = value;
  // see pre-set-load.test for column list
  // type number = opacityBackground, opacityBorder, borderWidth, pointBorderWidth, opacityPoint
  // property for shade is custom-set in <GraphWrapper/> with type entered as "shade" to recognize that shade has different features than other numeric types (see several lines below)
  if (type === 'number' || type === 'shade') {
    v = parseFloat(v, 10);
    // type array = borderDash
  } else if (type === 'array') {
    var arr = typeof v === 'string' ? v.split(',') : v;
    v = arr.map(function (a) {
      return parseInt(a, 10);
    });
    // type boolean = fill
  } else if (type === 'boolean') {
    v = v === 'true';
  }

  var defaultColor = '80, 80, 80';

  var nestedStyle = !stylesNew[layer] ? {} : isObjectLiteral(stylesNew[layer].style) ? Object.assign({}, stylesNew[layer].style) : {};

  if (type === 'color') {
    nestedStyle.shade = 0;
    stylesNew[layer] = {
      style: nestedStyle,
      color: v,
      colorOld: stylesNew[layer].color ? stylesNew[layer].color : defaultColor
    };
  } else if (type === 'shade' && v === 0) {
    nestedStyle.shade = 0;
    stylesNew[layer] = {
      style: nestedStyle,
      color: stylesNew[layer].colorOld,
      colorOld: stylesNew[layer].color ? stylesNew[layer].color : defaultColor
    };
  } else if (type === 'shade') {
    nestedStyle.shade = v;
    stylesNew[layer] = {
      style: nestedStyle,
      color: psgp[v - 1] ? psgp[v - 1] : defaultColor, // preSetGlobalPalette is 1-indexed for the user, so subtract 1, since it is actually 0-indexed
      colorOld: stylesNew[layer].color ? stylesNew[layer].color : defaultColor
    };
  } else {
    nestedStyle[key] = v;
    stylesNew[layer] = Object.assign({}, stylesNew[layer], { style: nestedStyle });
  }
  return stylesNew;
};

var applyPreSetGlobalColorToStyles = function applyPreSetGlobalColorToStyles(input) {
  // invoked by <GraphWrapper/>
  var styles = input.styles,
      preSetGlobalPalette = input.preSetGlobalPalette;

  var s = Object.assign({}, styles);
  for (var layer in s) {
    if (!isObjectLiteral(s[layer].style)) {
      s[layer].style = {};
    }
    if (s[layer].style.shade > 0) {
      var shade = s[layer].style.shade - 1;
      var colorOld = s[layer].color;
      var color = preSetGlobalPalette[shade];
      s[layer].color = color;
      s[layer].colorOld = colorOld;
    }
  }
  return s;
};

var formatPreSetToSave = function formatPreSetToSave(state, stylesDefault) {
  // invoked by <GraphWrapper/>
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