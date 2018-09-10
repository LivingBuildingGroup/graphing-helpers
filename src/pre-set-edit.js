'use strict';

const { isObjectLiteral} = require('conjunction-junction');
const { unPrefixLayers } = require('./layers');

const applyPreSetGlobalColorToStyles = (styles, preSetGlobalPalette) => {
  const newStyles = Object.assign({}, styles);
  let layerToTrigger;
  for(let layer in styles){
    if(newStyles[layer].style){
      if(newStyles[layer].style.shade > 0){
        layerToTrigger = layer;
        const color = newStyles[layer].color;
        const shade = newStyles[layer].style.shade - 1;
        newStyles[layer].color = preSetGlobalPalette[color][shade];
      }
    }
  }
  return { styles: newStyles, layerToTrigger };
};

const prefixStyles = (exStyles, defaults, layersAllUnPrefixed) => {
  // layersAllUnPrefixed MIGHT have prefixes
  // it should ONLY have prefixes we consider minimum, such as platform letters
  // or if saving a "single" specific preSet, it might include full prefixes.
  console.log('layersAllUnPrefixed', layersAllUnPrefixed);
  // layersAllUnPrefixed should be all possible layers, un-prefixed for groups
  // remove styles not included in layersAllUnPrefixed
  const newStyles = {};
  layersAllUnPrefixed.forEach(l=>{
    console.log('l',l);
    const lSplit =
      l.includes('__') ?
        l.split('__') : 
        l ;
    const lUnprefixed =
      Array.isArray(lSplit) ?
        lSplit[lSplit.length-1] :
        l;
    newStyles[l] =
      isObjectLiteral(exStyles[l]) ?
        exStyles[l] :
        isObjectLiteral(defaults[l]) ?
          defaults[l] :
          isObjectLiteral(defaults[lUnprefixed]) ?
            defaults[lUnprefixed] :
            { color: 'tan' };
  });
  console.log('newStyles', newStyles);
  return newStyles;
};

const parseNameIdIconType = state => {
  const id = 
    state.preSetSaveType === 'new' ?
      null :
      state.preSetIdActive ;
  const name =
    state.preSetSaveType === 'new' ?
      state.preSetNameNew :
      state.preSetNameNew ? 
        state.preSetNameNew :
        !state.preSets[id] ?
          'new preset' :
          state.preSets[id].name ;
  // preSetIconOptions should always be populated in state, but to prevent a type error, we do this:
  const preSetIconOptions = Array.isArray(state.preSetIconOptions) ? state.preSetIconOptions : [''] ;
  const icon = 
    // new icon is whatever is in state if new or editing
    // ideally this will always trigger, if state always assigns preSetIconNew as the existing or requires a default
    state.preSetIconNew ? 
      state.preSetIconNew:
      // nothing in state as new
      // use icon for this preset
      state.preSets[id].icon ?
        state.preSets[id].icon :
        preSetIconOptions[0] ;
  const type = 
    state.preSetGroupEditMode ?
      'group' : 
      'single' ;
    
  return {
    id, 
    name, 
    icon, 
    type
  };
};

const correctPrefixOfLayersSelected = state => {
  // state.layersSelected is expected to have the maximum amount of prefix
  // i.e. we may strip off prefixes, but we won't add them
  if (state.preSetSaveSettings.prefixGroups &&
    state.preSetSaveSettings.prefixGroupsSub){
    return state.layersSelected;
  } 
  const prefixesToKeep = 
    state.preSetSaveSettings.prefixGroups &&
    state.preSetSaveSettings.prefixGroupsSub ?
      [...state.groups, ...state.prefixGroupsSub] : 
      state.preSetSaveSettings.prefixGroups ?
        state.groups :
        state.preSetSaveSettings.prefixGroupsSub ?
          state.prefixGroupsSub : 
          null ;
  return unPrefixLayers(state.layersSelected, prefixesToKeep);
};

const editOnePreSetStyle = (exStyles, valueRaw, layer, property, preSetGlobalPalette) => {
  const styles = Object.assign({}, exStyles);
  let value = valueRaw;
  if(property.type === 'number'){
    value = parseFloat(value, 10);
  } else if (property.type === 'shade'){
    value = parseInt(value, 10);
  } else if (property.type === 'array'){
    const arr = value.split(',');
    value = arr.map(a=>parseInt(a,10));
  } else if (property.type === 'boolean'){
    value = value === 'true';
  }

  const nestedStyle = 
    !styles[layer] ? 
      {} :
      isObjectLiteral(styles[layer].style) ?
        Object.assign({}, styles[layer].style ) :
        {} ;

  if(property.type === 'color'){
    nestedStyle.shade = 0;
    styles[layer] = {
      style: nestedStyle,
      color: value,
      colorOld: undefined,
    };
  } else if(property.type === 'shade' && value === 0){
    nestedStyle.shade = 0;
    styles[layer] = {
      style: nestedStyle,
      color: styles[layer].colorOld,
      colorOld: undefined,
    };
  } else if(property.type === 'shade'){
    nestedStyle.shade = value;
    styles[layer] = {
      style: nestedStyle,
      colorOld: styles[layer].color,
      color: preSetGlobalPalette[value-1],
    };
  } else {
    nestedStyle[property.key] = value;
    const newStyle = Object.assign({}, styles[layer], nestedStyle);
    styles[layer] = newStyle;
  }
  return styles;
};

const formatPreSetToSave = (state, stylesDefault) => {
  
  const {
    id, 
    name, 
    icon, 
    type } = parseNameIdIconType(state);
    
  const layersSelected = correctPrefixOfLayersSelected(state);

  const styles = prefixStyles(
    state.styles, 
    stylesDefault, 
    state.layersAllUnPrefixed
  );

  return {
    id,
    name,
    icon,
    type,
    graph: state.graphName,
    styles,
    layersSelected,
    preSetSaveSettings: state.preSetSaveSettings,
  };
};

module.exports = {
  applyPreSetGlobalColorToStyles,
  prefixStyles,
  parseNameIdIconType,
  correctPrefixOfLayersSelected,
  editOnePreSetStyle,
  formatPreSetToSave,
};