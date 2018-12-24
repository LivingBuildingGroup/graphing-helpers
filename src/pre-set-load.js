'use strict';

const { isObjectLiteral,
} = require('conjunction-junction');
const { listBright,
  createMonoChrome } = require('./palettes');

const formatSelectors = (thisPreSet, groupTrue, groupsRaw) => {
  const groups = Array.isArray(groupsRaw) ? groupsRaw : [] ;
  let selectors = [''];
  if(Array.isArray(thisPreSet.layersSelected)){
    if(thisPreSet.layersSelected.length > 0){
      if(thisPreSet.type === 'group'){
        if(groupTrue){
          selectors = [];
          thisPreSet.layersSelected.forEach(layer=>{
            groups.forEach(group=>{
              selectors.push(`${group}__${layer}`);
            });
          });
        } else {
          selectors = thisPreSet.layersSelected;
        }
      } else {
        selectors = thisPreSet.layersSelected;
      }
    }
  }
  const selectorsRemaining = 
    selectors.length <= 1 ? [] :
      selectors.slice(1,selectors.length);

  return { selectors, selectorsRemaining };
};

const _validateFormatAllStylesInput = input => {
  if(!isObjectLiteral(input)){
    return 'input is not an object';
  }
  const {
    thisPreSet, 
    styles,
    groups, 
    groupsSub,
    layersAllPrefixed, } = input;
  if(!Array.isArray(layersAllPrefixed)) {
    return 'layersAllPrefixed is not an array';
  }
  let noString;
  layersAllPrefixed.forEach((l, i)=>{
    if(typeof l !== 'string'){
      noString = `layersAllPrefixed item ${l} at index ${i} is not a string`;
    }
  });
  if(noString) return noString;
  if(!Array.isArray(groups)) {
    return 'groups is not an array';
  }
  if(!Array.isArray(groupsSub)) {
    return 'groupsSub is not an array';
  }
  if(!isObjectLiteral(thisPreSet)){
    return 'thisPreSet is not an object';
  }
  if(!isObjectLiteral(styles)){
    return 'styles is not an object';
  }
  return 'ok';
};

const parseGroupsFromLayer = (layer, groups, groupsSub) => {
  let group, groupSub;
  groups.forEach(g=>{
    if(layer.includes(`${g}__`)){
      group = g;
    }
  });
  groupsSub.forEach(s=>{
    if(layer.includes(`${s}__`)){
      groupSub = s;
    }
  });
  const g = group    ? `${group}`    : '' ;
  const g_ = g       ? `${g}__`      : '' ;
  const s = groupSub ? `${groupSub}` : '' ;
  const s_ = s       ? `${s}__`      : '' ;
  return { g, g_, s, s_ };
};

const selectBestStyleMatch = (thisPreSet, styles, layer, unPrefix, g_, s_) => {
  const preSetStyle = isObjectLiteral(thisPreSet.styles) ? thisPreSet.styles : {} ;
  const s =
    isObjectLiteral(preSetStyle[layer]) ?
      Object.assign({},preSetStyle[layer]) : 
      isObjectLiteral(preSetStyle[unPrefix]) ?
        Object.assign({},preSetStyle[unPrefix]) : 
        isObjectLiteral(preSetStyle[`${g_}${s_}${layer}`]) ?
          Object.assign({},preSetStyle[`${g_}${s_}${layer}`]) : 
          isObjectLiteral(preSetStyle[`${g_}${layer}`]) ?
            Object.assign({},preSetStyle[`${g_}${layer}`]) : 
            isObjectLiteral(preSetStyle[`${s_}${layer}`]) ?
              Object.assign({},preSetStyle[`${s_}${layer}`]) : 
              isObjectLiteral(styles[layer]) ?
                Object.assign({},styles[layer]) : 
                isObjectLiteral(styles[unPrefix]) ?
                  Object.assign({},styles[unPrefix]) : 
                  {style:{}} ;
  // make nested style consistent
  s.style = isObjectLiteral(s.style) ? s.style : {} ;
  return s;
};

const selectBestColorMatch = (thisStyle, newGroupColors, preSetGlobalPalettes, shade, group) => {
  let color = isObjectLiteral(thisStyle) ? thisStyle.color : '80, 80, 80';
  // type check newGroupColors
  const ngc = isObjectLiteral(newGroupColors) ? newGroupColors : {} ;
  const psgp = isObjectLiteral(preSetGlobalPalettes) ? preSetGlobalPalettes : {} ;
  // worst case, this is undefined, if undefined, we just skip the lookup
  const groupColor = ngc[group];
  if(groupColor){
    if(psgp[groupColor]){
      // shade is 1-indexed for the user
      // change shade to 0-index for JS
      if(shade >= 0 && psgp[groupColor][shade-1]){
        color = psgp[groupColor][shade-1];
      }
    }
  }
  color = color ? color : '80, 80, 80';
  return color;
};

const formatAllStyles = input => {
  const {
    layersAllPrefixed,
    groups, 
    groupsSub,
    styles,
    thisPreSet, 
    newGroupColors, 
    preSetGlobalPalettes } = input;

  const validated = _validateFormatAllStylesInput(input);
  if(validated !== 'ok') return { message: validated };

  const theseStyles = {};

  layersAllPrefixed.forEach(layer=>{
    // double underscore denotes prefix
    const unPrefixedArr = layer.split('__');
    // un-prefixed layer is LAST part after last double-underscore.  We can have multiple prefixes.
    // e.g. "layer" >> "layer" ; "A__layer" >> "layer" ; "53__A__layer" >> "layer"
    const unPrefix = unPrefixedArr[unPrefixedArr.length-1];
    
    const { g, g_, s, s_} = parseGroupsFromLayer(layer, groups, groupsSub);
    const thisStyle = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const shade = 
      !isObjectLiteral(thisStyle.style) ? 
        0 :
        thisStyle.style.shade > 0 ?
          thisStyle.style.shade : 
          0 ;
    thisStyle.color = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, g);
    theseStyles[layer] = thisStyle;
  });

  return theseStyles;
};

const prioritizeGroups = (groups, groupColors) => {
  const gc = isObjectLiteral(groupColors) ? groupColors : {} ;
  
  // list priorities
  // in the event of conflicts, the first request in the ordered array 'groups' is given first priority
  // if group color not already used
  const gcPriority = {};
  groups.forEach(g=>{
    if(gc[g] && !gcPriority[gc[g]]){
      gcPriority[gc[g]] = g; 
    }
  });

  // sort groups according to priority
  const groups1 = [];
  const groups2 = [];
  groups.forEach(g=>{
    if(gcPriority[gc[g]] === g){
      groups1.push(g);
    } else {
      groups2.push(g);
    }
  });
  
  return {
    groupsPrioritized: [...groups1, ...groups2],
    gc,
    gcPriority,
  };
};

const assignPreSetGroupColors = input => {
  const {
    groups, 
    groupColors, 
    preSetGlobalColorOptions,
    preSetGlobalPalettes, } = input;

  const defaultReturn = {
    newGroupColors: {},
    groupDotColors: {},
  };
  if(!Array.isArray(groups)) return defaultReturn;
  
  const psgpFromUser = isObjectLiteral(preSetGlobalPalettes) ? preSetGlobalPalettes : {} ;
  const psgp = Object.assign({}, createPreSetGlobalPalettes(), psgpFromUser );
  const psgco = Array.isArray(preSetGlobalColorOptions) ? preSetGlobalColorOptions : listBright() ;

  const defaultColor = '80, 80, 80';
  const colorsUsed     = {};
  const newGroupColors = {};
  const groupDotColors = {};

  const {gc, 
    gcPriority, 
    groupsPrioritized } = prioritizeGroups(groups, groupColors);

  const _useSpecifiedColor = _group => {
    // LOCAL MUTATING FUNCTION
    colorsUsed[gc[_group]] = true;
    newGroupColors[_group] = gc[_group];
    groupDotColors[_group] = 
      Array.isArray(psgp[newGroupColors[_group]]) ? 
        psgp[newGroupColors[_group]][0] : 
        defaultColor;
  };

  const _useDefaultColor = (_group, _color) => {
    // LOCAL MUTATING FUNCTION
    if(!colorsUsed[_color]){
      colorsUsed[_color]     = true;
      newGroupColors[_group] = _color;
      groupDotColors[_group] = 
        Array.isArray(psgp[newGroupColors[_group]]) ? 
          psgp[newGroupColors[_group]][0] : 
          defaultColor;
    }
  };

  // these run in priority order, so we don't need to check for priority during the loop
  groupsPrioritized.forEach(group=>{
    // if we did supply a group color
    if(gc[group]){
      // prioritized fill up colors used first
      if(!colorsUsed[gc[group]]){
        _useSpecifiedColor(group);
      // else if group color is already used (priority is used first)
      } else {
        psgco.forEach(color=>{
          if(!newGroupColors[group]){
            _useDefaultColor(group, color);
          }
        });
      }
    // we did not supply a group color
    } else {
      psgco.forEach(color=>{
        if(!newGroupColors[group]){
          _useDefaultColor(group, color);
        }
      });
    }
  });
  return {
    testKeys: {
      gcPriority,
      colorsUsed,
    },
    newGroupColors,
    groupDotColors,
  };
};

const formatGroupsStyles = input => {
  const {
    groupTrue, 
    groups, 
    groupColors, 
    groupsSub,
    preSetGlobalColorOptions, 
    preSetGlobalPalettes, 
    layersAllPrefixed,
    styles,
    thisPreSet,  } = input;

  const isGrouped = groupTrue && Array.isArray(groups);

  const defaultObject = {
    stylesAppended:  styles,
    newGroupColors: {},
    groupDotColors: {},
  };
  if(!isObjectLiteral(thisPreSet)){
    // i.e. no material to read from
    return Object.assign({}, defaultObject, {stylesAppended: {}});
  } else if(!isObjectLiteral(thisPreSet.styles)){
    // i.e. no material to read from
    return Object.assign({}, defaultObject, {stylesAppended: {}});
  } else if (!isGrouped && thisPreSet.useOnlyExplicitStylesWhenUngrouped) {
    // preSets may declare that when not grouped, ONLY explicit styles shall be used
    // this allows preSets to save specific styles for individual graphs
    // but when grouped, styles are overwritten by group styles
    // in either case, layers selected remain the same
    defaultObject.stylesAppended = Object.assign({},
      defaultObject.stylesAppended,
      thisPreSet.styles
    );
    return defaultObject;
  }
  const {newGroupColors, 
    groupDotColors} = assignPreSetGroupColors({
    groups, 
    groupColors, 
    preSetGlobalPalettes,
    preSetGlobalColorOptions,
  });

  const stylesAppended = formatAllStyles({
    groups, 
    groupsSub,
    newGroupColors, 
    preSetGlobalPalettes,
    layersAllPrefixed,
    styles,
    thisPreSet, 
  });

  return {
    newGroupColors,
    groupDotColors,
    stylesAppended,
  };
};

const formatPreSetToLoad = (state, thisPreSet, id) => {
  const { 
    groupTrue, 
    groups,
    groupColors, 
    groupsSub,
    preSetGlobalPalettes, 
    preSetGlobalColorOptions,
    layersAllPrefixed,
    styles,
  } = state;
  const {
    selectorsRemaining,
    selectors      } = formatSelectors(
    thisPreSet, 
    groupTrue, 
    groups
  );
  const {
    stylesAppended,
    newGroupColors,
    groupDotColors } = formatGroupsStyles({
    thisPreSet, 
    groupTrue, 
    groups, 
    groupsSub: Array.isArray(groupsSub) ? groupsSub : [''] ,
    groupColors, 
    preSetGlobalColorOptions, 
    preSetGlobalPalettes, 
    styles,
    layersAllPrefixed,
  });

  const {
     preSetIconNameNew,
    preSetNameNew  } = formatIcons(thisPreSet); 

  return {
    groupColors:    newGroupColors,
    groupDotColors,
    preSetIdActive: id,
    selector0:      selectors[0],
    layersSelected: selectorsRemaining,
    styles:         stylesAppended,
    preSetIconNameNew,    // pre-load for editing
    preSetNameNew,        // pre-load for editing
  };
};

const formatIcons = thisPreSet => {
  const icon =
    !thisPreSet.icon ? null :
      thisPreSet.icon ;
  const name =
    !thisPreSet.name ? null :
      thisPreSet.name ;
  return {
    preSetIconNameNew: icon,
    preSetNameNew: name,
  };
};

const formatPreSetColumns = cssStyleColorsNamed => {
  // this is only the names of the colors to use for selectors
  const cssStyleColorsNamedArray = [];
  for(let key in cssStyleColorsNamed){
    cssStyleColorsNamedArray.push(key);
  }
  cssStyleColorsNamedArray.sort();
  const preSetColumns = [
    { 
      key: 'color',
      label: 'color',
      type: 'color',
      optionLabels: cssStyleColorsNamedArray,
      optionValues: cssStyleColorsNamedArray,
      defaultValue: 'red',
    },
    { 
      key: 'fill',
      label: 'fill',
      type: 'boolean',
      optionLabels: ['true', 'false'],
      optionValues: ['true' ,'false' ],
      defaultValue:  'true',
    },
    { 
      key: 'opacityBackground',
      label: 'fill opacity',
      type: 'number',
      step: 0.1,
      min: 0,
      max: 1,
      defaultValue: 0.1,
    },
    { 
      key: 'opacityBorder',
      label: 'line opacity',
      type: 'number',
      step: 0.1,
      min: 0,
      max: 1,
      defaultValue: 1,
    },
    {
      key: 'borderWidth',
      label: 'line weight',
      type: 'number',
      step: 0.1,
      min: 1,
      max: 10,
      defaultValue: 1,
    },
    {
      key: 'borderDash',
      label: 'line type',
      type: 'array',
      optionLabels: ['solid', 'medium dashes','long dashes and gaps','medium dashes, short gaps','short dashes, long gaps','long dashes, short gaps'],
      optionValues: [ ''  , '10,10'        ,'20,20'                 ,'10,5'                     ,'5,20'                   ,'20, 5'                  ],
      defaultValue:   '',
    },
    {
      key: 'pointBorderWidth',
      label: 'point size',
      type: 'number',
      step: 0.1,
      min: 1,
      max: 10,
      defaultValue: 1,
    },
    {
      key: 'opacityPoint',
      label: 'point opacity',
      type: 'number',
      step: 0.1,
      min: 0,
      max: 1,
      defaultValue: 1,
    },
  ];
  return{
    preSetColumns,
    cssStyleColorsNamedArray,
  };
};

const createPreSetGlobalPalettes = () => {
  const colors = listBright();
  const preSetGlobalPalettes = {};
  colors.forEach(color=>{
    preSetGlobalPalettes[color] = createMonoChrome(color);
  });
  return preSetGlobalPalettes;
};

const selectDefaultPreSet = state => {
  const {preSets, graphName} = state;
  let preSetIdActive;
  for(let id in preSets){
    if(preSets[id].graph === graphName && preSets[id].def){
      preSetIdActive = id;
    }
  }
  // worst case, no default and id list didn't load yet
  if(preSetIdActive) return preSetIdActive;

  for(let id in preSets){
    if(preSets[id].graph === graphName){
      preSetIdActive = id;
    }
  }

  return preSetIdActive;
};

module.exports = {
  formatSelectors,
  _validateFormatAllStylesInput,
  parseGroupsFromLayer,
  selectBestStyleMatch,
  selectBestColorMatch,
  formatAllStyles,
  assignPreSetGroupColors,
  formatGroupsStyles,
  formatPreSetToLoad,
  formatIcons,
  formatPreSetColumns,
  createPreSetGlobalPalettes,
  selectDefaultPreSet,
};