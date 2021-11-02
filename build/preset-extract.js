'use strict';

var _require = require('conjunction-junction'),
    isObjectLiteral = _require.isObjectLiteral;

var _require2 = require('pretty-colors'),
    listBright = _require2.listBright,
    createPresetGlobalPalettes = _require2.createPresetGlobalPalettes;

var formatSelectors = function formatSelectors(thisPreset, groupTrue, groupsRaw) {
  var groups = Array.isArray(groupsRaw) ? groupsRaw : [];
  var selectors = [''];
  if (Array.isArray(thisPreset.layersSelected)) {
    if (thisPreset.layersSelected.length > 0) {
      if (thisPreset.type === 'group') {
        if (groupTrue) {
          selectors = [];
          thisPreset.layersSelected.forEach(function (layer) {
            groups.forEach(function (group) {
              selectors.push(group + '__' + layer);
            });
          });
        } else {
          selectors = thisPreset.layersSelected;
        }
      } else {
        selectors = thisPreset.layersSelected;
      }
    }
  }
  var selectorsRemaining = selectors.length <= 1 ? [] : selectors.slice(1, selectors.length);

  return { selectors: selectors, selectorsRemaining: selectorsRemaining };
};

var _validateFormatAllStylesInput = function _validateFormatAllStylesInput(input) {
  if (!isObjectLiteral(input)) {
    return 'input is not an object';
  }
  var thisPreset = input.thisPreset,
      styles = input.styles,
      groups = input.groups,
      groupsSub = input.groupsSub,
      layersAllPrefixed = input.layersAllPrefixed;

  if (!Array.isArray(layersAllPrefixed)) {
    return 'layersAllPrefixed is not an array';
  }
  var noString = void 0;
  layersAllPrefixed.forEach(function (l, i) {
    if (typeof l !== 'string') {
      noString = 'layersAllPrefixed item ' + l + ' at index ' + i + ' is not a string';
    }
  });
  if (noString) return noString;
  if (!Array.isArray(groups)) {
    return 'groups is not an array';
  }
  if (!Array.isArray(groupsSub)) {
    return 'groupsSub is not an array';
  }
  if (!isObjectLiteral(thisPreset)) {
    return 'thisPreset is not an object';
  }
  if (!isObjectLiteral(styles)) {
    return 'styles is not an object';
  }
  return 'ok';
};

var parseGroupsFromLayer = function parseGroupsFromLayer(layer, groups, groupsSub) {
  var group = void 0,
      groupSub = void 0;
  groups.forEach(function (g) {
    if (layer.includes(g + '__')) {
      group = g;
    }
  });
  groupsSub.forEach(function (s) {
    if (layer.includes(s + '__')) {
      groupSub = s;
    }
  });
  var g = group ? '' + group : '';
  var g_ = g ? g + '__' : '';
  var s = groupSub ? '' + groupSub : '';
  var s_ = s ? s + '__' : '';
  return { g: g, g_: g_, s: s, s_: s_ };
};

var selectBestStyleMatch = function selectBestStyleMatch(thisPreset, styles, layer, unPrefix, g_, s_) {
  var presetStyle = isObjectLiteral(thisPreset.styles) ? thisPreset.styles : {};
  var s = isObjectLiteral(presetStyle[layer]) ? Object.assign({}, presetStyle[layer]) : isObjectLiteral(presetStyle[unPrefix]) ? Object.assign({}, presetStyle[unPrefix]) : isObjectLiteral(presetStyle['' + g_ + s_ + layer]) ? Object.assign({}, presetStyle['' + g_ + s_ + layer]) : isObjectLiteral(presetStyle['' + g_ + layer]) ? Object.assign({}, presetStyle['' + g_ + layer]) : isObjectLiteral(presetStyle['' + s_ + layer]) ? Object.assign({}, presetStyle['' + s_ + layer]) : isObjectLiteral(styles[layer]) ? Object.assign({}, styles[layer]) : isObjectLiteral(styles[unPrefix]) ? Object.assign({}, styles[unPrefix]) : { style: {} };
  // make nested style consistent
  s.style = isObjectLiteral(s.style) ? s.style : {};
  return s;
};

var selectBestColorMatch = function selectBestColorMatch(thisStyle, newGroupColors, presetGlobalPalettes, shade, group) {
  var color = isObjectLiteral(thisStyle) ? thisStyle.color : '80, 80, 80';
  // type check newGroupColors
  var ngc = isObjectLiteral(newGroupColors) ? newGroupColors : {};
  var psgp = isObjectLiteral(presetGlobalPalettes) ? presetGlobalPalettes : {};
  // worst case, this is undefined, if undefined, we just skip the lookup
  var groupColor = ngc[group];
  if (groupColor) {
    if (psgp[groupColor]) {
      // shade is 1-indexed for the user
      // change shade to 0-index for JS
      if (shade >= 0 && psgp[groupColor][shade - 1]) {
        color = psgp[groupColor][shade - 1];
      }
    }
  }
  color = color ? color : '80, 80, 80';
  return color;
};

var formatAllStyles = function formatAllStyles(input) {
  var layersAllPrefixed = input.layersAllPrefixed,
      groups = input.groups,
      groupsSub = input.groupsSub,
      styles = input.styles,
      thisPreset = input.thisPreset,
      newGroupColors = input.newGroupColors,
      presetGlobalPalettes = input.presetGlobalPalettes;


  var validated = _validateFormatAllStylesInput(input);
  if (validated !== 'ok') return { message: validated };

  var theseStyles = {};

  layersAllPrefixed.forEach(function (layer) {
    // double underscore denotes prefix
    var unPrefixedArr = layer.split('__');
    // un-prefixed layer is LAST part after last double-underscore.  We can have multiple prefixes.
    // e.g. "layer" >> "layer" ; "A__layer" >> "layer" ; "53__A__layer" >> "layer"
    var unPrefix = unPrefixedArr[unPrefixedArr.length - 1];

    var _parseGroupsFromLayer = parseGroupsFromLayer(layer, groups, groupsSub),
        g = _parseGroupsFromLayer.g,
        g_ = _parseGroupsFromLayer.g_,
        s = _parseGroupsFromLayer.s,
        s_ = _parseGroupsFromLayer.s_;

    var thisStyle = selectBestStyleMatch(thisPreset, styles, layer, unPrefix, g_, s_);
    var shade = !isObjectLiteral(thisStyle.style) ? 0 : thisStyle.style.shade > 0 ? thisStyle.style.shade : 0;
    thisStyle.color = selectBestColorMatch(thisStyle, newGroupColors, presetGlobalPalettes, shade, g);
    theseStyles[layer] = thisStyle;
  });

  return theseStyles;
};

var prioritizeGroups = function prioritizeGroups(groups, groupColors) {
  var gc = isObjectLiteral(groupColors) ? groupColors : {};

  // list priorities
  // in the event of conflicts, the first request in the ordered array 'groups' is given first priority
  // if group color not already used
  var gcPriority = {};
  groups.forEach(function (g) {
    if (gc[g] && !gcPriority[gc[g]]) {
      gcPriority[gc[g]] = g;
    }
  });

  // sort groups according to priority
  var groups1 = [];
  var groups2 = [];
  groups.forEach(function (g) {
    if (gcPriority[gc[g]] === g) {
      groups1.push(g);
    } else {
      groups2.push(g);
    }
  });

  return {
    groupsPrioritized: [].concat(groups1, groups2),
    gc: gc,
    gcPriority: gcPriority
  };
};

var assignPresetGroupColors = function assignPresetGroupColors(input) {
  var groups = input.groups,
      groupColors = input.groupColors,
      presetGlobalColorOptions = input.presetGlobalColorOptions,
      presetGlobalPalettes = input.presetGlobalPalettes;


  var defaultReturn = {
    newGroupColors: {},
    groupDotColors: {}
  };
  if (!Array.isArray(groups)) return defaultReturn;

  var psgpFromUser = isObjectLiteral(presetGlobalPalettes) ? presetGlobalPalettes : {};
  var psgp = Object.assign({}, createPresetGlobalPalettes(), psgpFromUser);
  var psgco = Array.isArray(presetGlobalColorOptions) ? presetGlobalColorOptions : listBright();

  var defaultColor = '80, 80, 80';
  var colorsUsed = {};
  var newGroupColors = {};
  var groupDotColors = {};

  var _prioritizeGroups = prioritizeGroups(groups, groupColors),
      gc = _prioritizeGroups.gc,
      gcPriority = _prioritizeGroups.gcPriority,
      groupsPrioritized = _prioritizeGroups.groupsPrioritized;

  var _useSpecifiedColor = function _useSpecifiedColor(_group) {
    // LOCAL MUTATING FUNCTION
    colorsUsed[gc[_group]] = true;
    newGroupColors[_group] = gc[_group];
    groupDotColors[_group] = Array.isArray(psgp[newGroupColors[_group]]) ? psgp[newGroupColors[_group]][0] : defaultColor;
  };

  var _useDefaultColor = function _useDefaultColor(_group, _color) {
    // LOCAL MUTATING FUNCTION
    if (!colorsUsed[_color]) {
      colorsUsed[_color] = true;
      newGroupColors[_group] = _color;
      groupDotColors[_group] = Array.isArray(psgp[newGroupColors[_group]]) ? psgp[newGroupColors[_group]][0] : defaultColor;
    }
  };

  // these run in priority order, so we don't need to check for priority during the loop
  groupsPrioritized.forEach(function (group) {
    // if we did supply a group color
    if (gc[group]) {
      // prioritized fill up colors used first
      if (!colorsUsed[gc[group]]) {
        _useSpecifiedColor(group);
        // else if group color is already used (priority is used first)
      } else {
        psgco.forEach(function (color) {
          if (!newGroupColors[group]) {
            _useDefaultColor(group, color);
          }
        });
      }
      // we did not supply a group color
    } else {
      psgco.forEach(function (color) {
        if (!newGroupColors[group]) {
          _useDefaultColor(group, color);
        }
      });
    }
  });
  return {
    testKeys: {
      gcPriority: gcPriority,
      colorsUsed: colorsUsed
    },
    newGroupColors: newGroupColors,
    groupDotColors: groupDotColors
  };
};

var formatGroupsStyles = function formatGroupsStyles(input) {
  var groupTrue = input.groupTrue,
      groups = input.groups,
      groupColors = input.groupColors,
      groupsSub = input.groupsSub,
      presetGlobalColorOptions = input.presetGlobalColorOptions,
      presetGlobalPalettes = input.presetGlobalPalettes,
      layersAllPrefixed = input.layersAllPrefixed,
      styles = input.styles,
      thisPreset = input.thisPreset;

  var isGrouped = groupTrue && Array.isArray(groups);

  var defaultObject = {
    stylesAppended: styles || {},
    newGroupColors: {},
    groupDotColors: {}
  };
  if (!isObjectLiteral(thisPreset)) {
    // i.e. no material to read from
    return defaultObject;
  } else if (!isObjectLiteral(thisPreset.styles)) {
    // i.e. no material to read from
    return defaultObject;
  } else if (!isGrouped && thisPreset.useOnlyExplicitStylesWhenUngrouped) {
    // presets may declare that when not grouped, ONLY explicit styles shall be used
    // this allows presets to save specific styles for individual graphs
    // but when grouped, styles are overwritten by group styles
    // in either case, layers selected remain the same
    defaultObject.stylesAppended = Object.assign({}, defaultObject.stylesAppended, thisPreset.styles);
    return defaultObject;
  }

  var _assignPresetGroupCol = assignPresetGroupColors({
    groups: groups,
    groupColors: groupColors,
    presetGlobalPalettes: presetGlobalPalettes,
    presetGlobalColorOptions: presetGlobalColorOptions
  }),
      newGroupColors = _assignPresetGroupCol.newGroupColors,
      groupDotColors = _assignPresetGroupCol.groupDotColors;

  var stylesAppended = formatAllStyles({
    groups: groups,
    groupsSub: groupsSub,
    newGroupColors: newGroupColors,
    presetGlobalPalettes: presetGlobalPalettes,
    layersAllPrefixed: layersAllPrefixed,
    styles: styles,
    thisPreset: thisPreset
  });

  return {
    newGroupColors: newGroupColors,
    groupDotColors: groupDotColors,
    stylesAppended: stylesAppended
  };
};

var unpackPreset = function unpackPreset(state, thisPreset, id) {
  var groupTrue = state.groupTrue,
      groups = state.groups,
      groupColors = state.groupColors,
      groupsSub = state.groupsSub,
      presetGlobalPalettes = state.presetGlobalPalettes,
      presetGlobalColorOptions = state.presetGlobalColorOptions,
      layersAllPrefixed = state.layersAllPrefixed,
      styles = state.styles;

  var _formatSelectors = formatSelectors(thisPreset, groupTrue, groups),
      selectorsRemaining = _formatSelectors.selectorsRemaining,
      selectors = _formatSelectors.selectors;

  var _formatGroupsStyles = formatGroupsStyles({
    thisPreset: thisPreset,
    groupTrue: groupTrue,
    groups: groups,
    groupsSub: Array.isArray(groupsSub) ? groupsSub : [''],
    groupColors: groupColors,
    presetGlobalColorOptions: presetGlobalColorOptions,
    presetGlobalPalettes: presetGlobalPalettes,
    styles: styles,
    layersAllPrefixed: layersAllPrefixed
  }),
      stylesAppended = _formatGroupsStyles.stylesAppended,
      newGroupColors = _formatGroupsStyles.newGroupColors,
      groupDotColors = _formatGroupsStyles.groupDotColors;

  // this prefixes as determined by state, i.e. parent
  // this does not allow individual presets to decide what to prefix (see above)


  var prefixesToKeepGroups = !Array.isArray(state.groups) ? [] : !state.presetSaveSettings ? [] : !state.presetSaveSettings.prefixGroups ? [] : state.groups;

  var prefixesToKeepGroupsSub = !Array.isArray(state.groupsSub) ? [] : !state.presetSaveSettings ? [] : !state.presetSaveSettings.prefixGroupsSub ? [] : state.groupsSub;

  return {
    groupColors: newGroupColors,
    groupDotColors: groupDotColors,
    presetIdActive: id,
    selector0: selectors[0],
    layersSelected: selectorsRemaining,
    styles: stylesAppended,
    prefixesToKeepGroups: prefixesToKeepGroups,
    prefixesToKeepGroupsSub: prefixesToKeepGroupsSub
  };
};

var selectDefaultPreset = function selectDefaultPreset(presets, graphName) {
  var presetIdActive = void 0;
  for (var id in presets) {
    if (presets[id].graph === graphName && presets[id].def) {
      presetIdActive = id;
    }
  }
  if (presetIdActive) return presetIdActive;
  // worst case, no default and id list didn't load yet

  for (var _id in presets) {
    if (presets[_id].graph === graphName) {
      presetIdActive = _id;
    }
  }

  return presetIdActive;
};

module.exports = {
  formatSelectors: formatSelectors,
  _validateFormatAllStylesInput: _validateFormatAllStylesInput,
  parseGroupsFromLayer: parseGroupsFromLayer,
  selectBestStyleMatch: selectBestStyleMatch,
  selectBestColorMatch: selectBestColorMatch,
  formatAllStyles: formatAllStyles,
  assignPresetGroupColors: assignPresetGroupColors,
  formatGroupsStyles: formatGroupsStyles,
  unpackPreset: unpackPreset,
  selectDefaultPreset: selectDefaultPreset
};