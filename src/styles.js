'use strict';

const createStyle = input => {
  const general = {
    opacityBackground:      input.opacityBackground || .2,
    opacityBackgroundHover: input.opacityBackgroundHover || .4,
    opacityBorder:          input.opacityBorder || 1,
    opacityBorderHover:     input.opacityBorderHover || 1,
    opacityPoint:           input.opacityPoint || 1,
    opacityPointHover:      input.opacityPointHover || 1,
    opacityPointBackgroundHover: input.opacityPointBackgroundHover || 1,
    fill:                   input.fill || true,
  
    lineTension:        0.5, // over 0.5 seems bulbous, 0 is angular
    bezierCurve:        true,
    bezierCurveTension: 0.5,

    borderCapStyle:        'butt',
    borderDash:            [],
    borderDashOffset:      0.0,
    borderJoinStyle:       'miter',
    borderWidth:           1,  
    pointBorderWidth:      1,
    pointHoverRadius:      5,
    pointHoverBorderWidth: 2,
    pointRadius:           1,
    pointHitRadius:       10,
  };

  const color = input.colors || colors[0];
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