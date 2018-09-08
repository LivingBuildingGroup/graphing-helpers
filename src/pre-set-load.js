'use strict';

const { isObjectLiteral,
} = require('conjunction-junction');
const { listBright,
  createMonoChrome } = require('./palettes');

const formatSelectors = (thisPreSet, groupTrue, groups) => {
  let selectors = [''];
  if(Array.isArray(thisPreSet.layersSelected)){
    if(thisPreSet.layersSelected.length > 0){
      if(thisPreSet.type === 'group'){
        if(groupTrue && Array.isArray(groups)){
          selectors = [];
          thisPreSet.layersSelected.forEach(layer=>{
            groups.forEach(group=>{
              selectors.push(`${group}__${layer}`);
            });
          });
        } else {
          // console.error('You selected a group preset, but layers are not properly formatted as groups');
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

const formatAllStylesOneGroup = input => {
  const {
    thisPreSet, 
    group, 
    groupSub,
    newGroupColors, 
    preSetGlobalPalettes} = input;

  const g = group    ? group    : '' ;
  const g_ = g       ? `${g}__` : '' ;
  const s = groupSub ? groupSub : '' ;
  const s_ = s       ? `${s}__` : '' ;
  
  const groupColor = newGroupColors[group];
  const theseStyles = {};
  for(let layer in thisPreSet.styles){
    const thisStyle = 
      isObjectLiteral(thisPreSet.styles[layer]) ?
        Object.assign({},thisPreSet.styles[layer]) : 
        isObjectLiteral(thisPreSet.styles[`${g_}${s_}${layer}`]) ?
          Object.assign({},thisPreSet.styles[`${g_}${s_}${layer}`]) : 
          isObjectLiteral(thisPreSet.styles[`${g_}${layer}`]) ?
            Object.assign({},thisPreSet.styles[`${g_}${layer}`]) : 
            isObjectLiteral(thisPreSet.styles[`${s_}${layer}`]) ?
              Object.assign({},thisPreSet.styles[`${s_}${layer}`]) : 
              {} ;
    const shade = 
      !isObjectLiteral(thisStyle.style) ? 
        0 :
        thisStyle.style.shade > 0 ?
          thisStyle.style.shade : 
          0 ;
    const color =
      shade === 0 ? 
        thisStyle.color :
        !preSetGlobalPalettes[groupColor] ? 
          '80,80,80' :
          !preSetGlobalPalettes[groupColor][shade-1] ? 
            '80,80,80' :
            preSetGlobalPalettes[groupColor][shade-1] ;
    thisStyle.color = color;

    theseStyles[`${g_}${s_}${layer}`] = thisStyle;
    theseStyles[`${g_}${layer}`     ] = thisStyle;
    theseStyles[`${s_}${layer}`     ] = thisStyle;
  }
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
    styles} = input;

  const defaultObject = {
    stylesAppended:  styles,
    colorsUsed:     {},
    newGroupColors: {},
    groupDotColors: {},
  };
  console.log('groupTrue',groupTrue, 'will not group styles if false');
  console.log('groupsSub',groupsSub);
  console.log('groups',groups);
  console.log('@@@@@ thisPreSet',thisPreSet);
  // if(preSetSaveSettings.prefixGroups)
  if(!isObjectLiteral(thisPreSet.styles)){
    // i.e. no material to read from
    return defaultObject;
  }
  // if(thisPreSet.type !== 'group'){
  //   return defaultObject;
  // } else 
  if((!groupTrue || !Array.isArray(groups)) && thisPreSet.graph === 'test_measurements'){ 
    console.error('You selected a group preset, but we do not have enough information to properly format styles as groups');
    return defaultObject;
  }
  // start back here
  // the variables on lines 97-100 are not being properly read for platforms
  // untether grouping of styles and layers
  console.log('GROUP STYLES RUNNING!');
  let stylesAppended =
    isObjectLiteral(thisPreSet.styles) ? 
      thisPreSet.styles :
      styles ;

  console.log('groups in format preset styles', groups);
  
  const {newGroupColors, 
    groupDotColors} = assignPreSetGroupColors({
    groups, 
    groupColors, 
    preSetGlobalPalettes,
    preSetGlobalColorOptions,
  });

  const groupsArray    = Array.isArray(groups)    ? groups : [''] ;
  const groupsSubArray = Array.isArray(groupsSub) ? groupsSub : [''] ;

  groupsArray.forEach(group=>{
    groupsSubArray.forEach(groupSub=>{
      const stylesToAdd = formatAllStylesOneGroup({
        thisPreSet, 
        group, 
        groupSub,
        newGroupColors, 
        preSetGlobalPalettes
      });
      stylesAppended = Object.assign({}, stylesAppended, stylesToAdd);
    });
  });

  // this ensures that any explicitly declared styles are not over-written
  stylesAppended = Object.assign({}, thisPreSet.styles, stylesAppended);

  return {
    stylesAppended,
    newGroupColors,
    groupDotColors,
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

const formatPreSetToLoad = (state, thisPreSet, id) => {
  const { 
    groupTrue, 
    groups,
    groupsSub,
    groupColors, 
    styles,
    preSetGlobalPalettes, 
    preSetGlobalColorOptions,
    // titleText, 
    // cssBackground,
  } = state;
  console.log('styles in formatPreSetToLoad',styles);
  const {selectorsRemaining,
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

const formatPreSetColumns = styleColorsNamed => {
  // this is only the names of the colors to use for selectors
  const styleColorsNamedArray = [];
  for(let key in styleColorsNamed){
    styleColorsNamedArray.push(key);
  }
  styleColorsNamedArray.sort();
  const preSetColumns = [
    { 
      key: 'color',
      label: 'color',
      type: 'color',
      optionLabels: styleColorsNamedArray,
      optionValues: styleColorsNamedArray,
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
    styleColorsNamedArray,
  };
};

const createPreSetGlobalPalettes = () => {
  const colors = listBright();
  const preSetGlobalPalettes = {};
  colors.forEach(color=>{
    preSetGlobalPalettes[color] = createMonoChrome(color);
  });
  return {preSetGlobalPalettes};
};

const selectDefaultPreSet = state => {
  let preSetIdActive = state.preSetIds[0];
  for(let id in state.preSets){
    if(state.preSets[id].graph === state.graphName && state.preSets[id].def){
      preSetIdActive = id;
    }
  }
  // worst case, no default and id list didn't load yet
  if(!preSetIdActive){
    for(let id in state.preSets){
      if(!preSetIdActive){
        preSetIdActive = id;
      }
    }
  }
  return {preSetIdActive};
};

module.exports = {
  formatSelectors,
  formatAllStylesOneGroup,
  assignPreSetGroupColors,
  formatGroupsStyles,
  formatIcons,
  formatPreSetToLoad,
  formatPreSetColumns,
  createPreSetGlobalPalettes,
  selectDefaultPreSet,
};