'use strict';

const { isObjectLiteral} = require('conjunction-junction');
const { unPrefixLayers } = require('./layers');

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
          isObjectLiteral(exStyles[lUnprefixed]) ?
            exStyles[lUnprefixed] :
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

const editOnePreSetStyle = input => {
  // invoked by <GraphWrapper/>
  if(!isObjectLiteral(input)) return {};
  const { styles, 
    value, 
    layer, 
    property, 
    preSetGlobalPalette } = input;
  if(!isObjectLiteral(styles))   return {};
  if(!isObjectLiteral(property)) return styles;
  if(typeof layer !== 'string')  return styles;

  const { type, key } = property;
  const psgp = Array.isArray(preSetGlobalPalette) ? preSetGlobalPalette : [] ;

  const stylesNew = Object.assign({}, styles);
  let v = value;
  // see pre-set-load.test for column list
  // type number = opacityBackground, opacityBorder, borderWidth, pointBorderWidth, opacityPoint
  // property for shade is custom-set in <GraphWrapper/> with type entered as "shade" to recognize that shade has different features than other numeric types (see several lines below)
  if(type === 'number' || type === 'shade'){
    v = parseFloat(v, 10);
  // type array = borderDash
  } else if (type === 'array'){
    const arr = typeof v === 'string' ? v.split(',') : v ;
    v = arr.map(a=>parseInt(a,10));
  // type boolean = fill
  } else if (type === 'boolean'){
    v = v === 'true';
  }

  const defaultColor = '80, 80, 80';

  const nestedStyle = 
    !stylesNew[layer] ? 
      {} :
      isObjectLiteral(stylesNew[layer].style) ?
        Object.assign({}, stylesNew[layer].style ) :
        {} ;

  if(type === 'color'){
    nestedStyle.shade = 0;
    stylesNew[layer] = {
      style: nestedStyle,
      color: v,
      colorOld: stylesNew[layer].color ? stylesNew[layer].color : defaultColor,
    };
  } else if(type === 'shade' && v === 0){
    nestedStyle.shade = 0;
    stylesNew[layer] = {
      style: nestedStyle,
      color: stylesNew[layer].colorOld,
      colorOld: stylesNew[layer].color ? stylesNew[layer].color : defaultColor,
    };
  } else if(type === 'shade'){
    nestedStyle.shade = v;
    stylesNew[layer] = {
      style: nestedStyle,
      color: psgp[v-1] ? psgp[v-1] : defaultColor, // preSetGlobalPalette is 1-indexed for the user, so subtract 1, since it is actually 0-indexed
      colorOld: stylesNew[layer].color ? stylesNew[layer].color : defaultColor,
    };
  } else {
    nestedStyle[key] = v;
    stylesNew[layer] = Object.assign({}, stylesNew[layer], {style: nestedStyle});
  }
  return stylesNew;
};

const applyPreSetGlobalColorToStyles = input => {
  // invoked by <GraphWrapper/>
  const { styles, 
    preSetGlobalPalette } = input;
  const s = Object.assign({}, styles);
  for(let layer in s){
    if(!isObjectLiteral(s[layer].style)){
      s[layer].style = {};
    }
    if(s[layer].style.shade > 0){
      const shade = s[layer].style.shade - 1;
      const colorOld = s[layer].color;
      const color = preSetGlobalPalette[shade];
      s[layer].color = color;
      s[layer].colorOld = colorOld;
    }
  }
  return s;
};

const formatPreSetToSave = (state, stylesDefault) => {
  // invoked by <GraphWrapper/>
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