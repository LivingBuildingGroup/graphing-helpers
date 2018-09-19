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

const formatAllStyles = input => {
  const {
    thisPreSet, 
    styles,
    groups, 
    groupsSub,
    newGroupColors, 
    preSetGlobalPalettes,
    layersAllPrefixed,
    layersAllUnPrefixed, } = input;
  console.log('layersAllUnPrefixed',layersAllUnPrefixed);
  console.log('layersAllUnPrefixed',layersAllUnPrefixed);

  const theseStyles = {};

  layersAllPrefixed.forEach(layer=>{
    const unPrefixedArr = layer.split('__');
    const unPrefix = unPrefixedArr[unPrefixedArr.length-1];
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
    const g = group    ? group    : '' ;
    const g_ = g       ? `${g}__` : '' ;
    const s = groupSub ? groupSub : '' ;
    const s_ = s       ? `${s}__` : '' ;
    // find the closest style match
    const thisStyle = 
      isObjectLiteral(thisPreSet.styles[layer]) ?
        Object.assign({},thisPreSet.styles[layer]) : 
        isObjectLiteral(thisPreSet.styles[unPrefix]) ?
          Object.assign({},thisPreSet.styles[unPrefix]) : 
          isObjectLiteral(thisPreSet.styles[`${g_}${s_}${layer}`]) ?
            Object.assign({},thisPreSet.styles[`${g_}${s_}${layer}`]) : 
            isObjectLiteral(thisPreSet.styles[`${g_}${layer}`]) ?
              Object.assign({},thisPreSet.styles[`${g_}${layer}`]) : 
              isObjectLiteral(thisPreSet.styles[`${s_}${layer}`]) ?
                Object.assign({},thisPreSet.styles[`${s_}${layer}`]) : 
                isObjectLiteral(styles[layer]) ?
                  Object.assign({},styles[layer]) : 
                  isObjectLiteral(styles[unPrefix]) ?
                    Object.assign({},styles[unPrefix]) : 
                    {style:{}} ;

    const shade = 
      !isObjectLiteral(thisStyle.style) ? 
        0 :
        thisStyle.style.shade > 0 ?
          thisStyle.style.shade : 
          0 ;

    let color = thisStyle.color;
    const groupColor = newGroupColors[group];
    if(groupColor){
      if(preSetGlobalPalettes[groupColor]){
        if(shade >= 0 && preSetGlobalPalettes[groupColor][shade-1]){
          color = preSetGlobalPalettes[groupColor][shade-1];
        }
      }
    }
    thisStyle.color = color ? color : '80, 80, 80';
    theseStyles[layer] = thisStyle;
  });

  return theseStyles;
};

const assignPreSetGroupColors = input => {
  const {
    groups, 
    groupColors, 
    preSetGlobalPalettes, 
    preSetGlobalColorOptions} = input;

  const defaultReturn = {
    colorsUsed    : {},
    newGroupColors: {},
    groupDotColors: {},
  };
  if(!Array.isArray(groups)) return defaultReturn;

  const colorsUsed     = {};
  const newGroupColors = {};
  const groupDotColors = {};

  groups.forEach(group=>{
    // THIS DOES NOT SEEM TO resolve duplicates
    // if we did supply a group color
    if(groupColors[group]){
      // if group color not already used
      if(!colorsUsed[groupColors[group]]){
        newGroupColors[group] = groupColors[group];
        groupDotColors[group] = preSetGlobalPalettes[newGroupColors[group]][0];
      // else if group color is used
      } else {
        preSetGlobalColorOptions.forEach(color=>{
          if(!newGroupColors[group]){
            if(!colorsUsed[color]){
              colorsUsed[color]     = true;
              newGroupColors[group] = color;
              groupDotColors[group] = preSetGlobalPalettes[newGroupColors[group]][0];
            }
          }
        });
      }
    // we did not supply a group color
    } else {
      preSetGlobalColorOptions.forEach(color=>{
        if(!newGroupColors[group]){
          if(!colorsUsed[color]){
            colorsUsed[color]     = true;
            newGroupColors[group] = color;
            groupDotColors[group] = preSetGlobalPalettes[newGroupColors[group]][0];
          }
        }
      });
    }
  });
  return {
    colorsUsed,
    newGroupColors,
    groupDotColors,
  };
};

const formatGroupsStyles = input => {
  const {
    thisPreSet, 
    groupTrue, 
    groups, 
    groupsSub,
    groupColors, 
    preSetGlobalColorOptions, 
    preSetGlobalPalettes, 
    layersAllPrefixed,
    layersAllUnPrefixed,
    styles } = input;

  const defaultObject = {
    stylesAppended:  styles,
    colorsUsed:     {},
    newGroupColors: {},
    groupDotColors: {},
  };

  if(!isObjectLiteral(thisPreSet.styles)){
    // i.e. no material to read from
    return Object.assign({}, defaultObject, {styles: {}});
  } else if((!groupTrue || !Array.isArray(groups)) && thisPreSet.graph === 'test_measurements'){ 
    // FIX ABOVE ^^^^^^^^^ DO NOT HARD CODE GRAPH TYPE !!!!!!
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
    thisPreSet, 
    styles,
    groups, 
    groupsSub,
    newGroupColors, 
    preSetGlobalPalettes,
    layersAllPrefixed,
    layersAllUnPrefixed,
  });

  return {
    stylesAppended,
    newGroupColors,
    groupDotColors,
  };
};

const formatPreSetToLoad = (state, thisPreSet, id) => {
  // this is adding extra prefixes
  // edit this to add ALL possible styles, hydrating from defaults
  // AND NO extra styles from extra prefix combinations
  const { 
    groupTrue, 
    groups,
    groupsSub,
    groupColors, 
    styles,
    preSetGlobalPalettes, 
    preSetGlobalColorOptions,
    layersAllUnPrefixed,
    layersAllPrefixed,
  } = state;
  console.log('styles in formatPreSetToLoad',styles);
  const {
    selectorsRemaining,
    selectors      } = formatSelectors(thisPreSet, groupTrue, groups);
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
    layersAllUnPrefixed,
  });
  console.log('stylesAppended in formatPreSetToLoad',stylesAppended);

  const {
    preSetIconNew,
    preSetNameNew  } = formatIcons(thisPreSet); 

  return {
    groupColors:    newGroupColors,
    groupDotColors,
    preSetIdActive: id,
    layersSelected: selectorsRemaining,
    selector0:      selectors[0],
    styles:         stylesAppended,
    preSetIconNew,        // pre-load for editing
    preSetNameNew,        // pre-load for editing
    preSetIdPrior:  id,   // this is intended to work like "last selected"
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
    preSetIconNew: icon,
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
  formatAllStyles,
  assignPreSetGroupColors,
  formatGroupsStyles,
  formatPreSetToLoad,
  formatIcons,
  formatPreSetColumns,
  createPreSetGlobalPalettes,
  selectDefaultPreSet,
};