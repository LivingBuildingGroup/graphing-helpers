'use strict';

const { 
  selectPalette,
  createNamed }           = require('./palettes');
const { isObjectLiteral } = require('conjunction-junction');

const createStyle = input => {
  const defaultGeneral = {
    fill:                   true,
    opacityBackground:      0.1, 
    // 0.05: faint on white, barely visible over gray, 
    // 0.1: faint over white and gray (good for all colors over white)
    // 0.2: prominent but translucent over white and gray (good for dark colors over gray)
    // 1 is solid, 0.2:, 
    opacityBackgroundHover: 0.4,
    opacityBorder:          1,
    opacityBorderHover:     1,
    opacityPoint:           1,
    opacityPointHover:      1,
    opacityPointBackgroundHover: 1,
  
    lineTension:            0.5, // over 0.5 seems bulbous, 0 is angular
    bezierCurve:            true,
    bezierCurveTension:     0.5,

    borderCapStyle:         'butt',
    borderDash:             [], // [10,10] => ok, [20,20] => long dash, long gap, [5,20] => short dash, long gap
    borderDashOffset:       0.0,
    borderJoinStyle:        'miter',
    borderWidth:            1,  // This is the LINE. 1: general all-purpose, 3: very thick line
    pointBorderWidth:       1,  // 1: general all-purpose, 3: big dots
    pointHoverRadius:       5,
    pointHoverBorderWidth:  2,
    pointRadius:            1,
    pointHitRadius:         10,
  };
  const general = {};
  for (let key in defaultGeneral){
    if(typeof input[key] === typeof defaultGeneral[key]){
      general[key] = input[key];
    } else {
      general[key] = defaultGeneral[key];
    }
  }

  let color = input.color;
  if(!color) {
    color = selectPalette(23)[0];
  }
  const colors =  {
    backgroundColor:           `rgba(${color},${general.opacityBackground})`,
    hoverBackgroundColor:      `rgba(${color},${general.opacityBackgroundHover})`,
    borderColor:               `rgba(${color},${general.opacityBorder})`,
    hoverBorderColor:          `rgba(${color},${general.opacityBorderHover})`,
    pointBorderColor:          `rgba(${color},${general.opacityPoint})`,
    pointHoverBorderColor:     `rgba(${color},${general.opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${color},${general.opacityPointBackgroundHover})`,
    pointBackgroundColor:      input.pointBackgroundColor ? 
      `rgba(${input.pointBackgroundColor},1)` : '#fff',
  };
  return Object.assign({},
    general,
    colors
  );
};

const createStylesArray = (keysSelected, styleKey, namedColors, fallbackArray) => {
  if(!Array.isArray(keysSelected)) return [];
  const sk = styleKey;
  const nc = isObjectLiteral(namedColors) ? namedColors : createNamed('bright') ;
  const fa = fallbackArray ? fallbackArray : selectPalette(30);
  const stylesArray = 
    !isObjectLiteral(sk) ? 
      keysSelected.map((k,i)=>createStyle({color:fa[i]})) :
      keysSelected.map((k,i)=>{
        const style = !sk[k] ?
          { color: fa[i] } :
          sk[k].color && sk[k].style ?
            Object.assign({},
              sk[k].style,
              {color: nc[sk[k].color],} 
            ):
            sk[k].color ?
              { color: nc[sk[k].color] } :
              sk[k].style ?
                sk[k].style :
                { color: fa[i-1] } ;
        return createStyle(style);
      });
  return stylesArray;
};

module.exports = {
  createStyle,
  createStylesArray,
};