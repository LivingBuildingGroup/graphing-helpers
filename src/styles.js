'use strict';

const { selectPalette } = require('./palettes');

const createStyle = input => {
  const defaultGeneral = {
    opacityBackground:      .2,
    opacityBackgroundHover: .4,
    opacityBorder:          1,
    opacityBorderHover:     1,
    opacityPoint:           1,
    opacityPointHover:      1,
    opacityPointBackgroundHover: 1,
    fill:                   true,
  
    lineTension:            0.5, // over 0.5 seems bulbous, 0 is angular
    bezierCurve:            true,
    bezierCurveTension:     0.5,

    borderCapStyle:         'butt',
    borderDash:             [],
    borderDashOffset:       0.0,
    borderJoinStyle:        'miter',
    borderWidth:            1,  
    pointBorderWidth:       1,
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
    pointBackgroundColor:      input.pointBackgroundColor || '#fff',
  };
  return Object.assign({},
    general,
    colors
  );
};

module.exports = {
  createStyle,
};