'use strict';

const colors = [
  '236, 83,158', //  0 orange-red
  ' 30,132,197', //  1 middle blue
  '254,127, 32', //  2 deep-orange
  '203,198, 48', //  3 frog-green
  '244,206,117', //  4 yellow-tan
  '201, 54, 74', //  5 raspberry-red
  '223,182,131', //  6 tan
  ' 56,174,190', //  7 teal
  '254,208,  8', //  8 sunflower-yellow
  '211, 73, 50', //  9 red-orange
  '148,154,167', // 10 traditional-gray
  '228,203,166', // 11 beige
  ' 50, 18, 27', // 12 prune  *pressure*
  ' 30, 28, 65', // 13 dark-blue
  '  0,153, 51', // 14 not happy with this yet
];

const opacityBackground = .2;
const opacityBackgroundHover = .4;
const opacityBorder = 1;
const opacityBorderHover = 1;
const opacityPoint = 1;
const opacityPointHover = 1;
const opacityPointBackgroundHover = 1;

const style0 = {
  fill: true,
  
  lineTension: 0.5, // over 0.5 seems bulbous, 0 is angular
  bezierCurve: true,
  bezierCurveTension: 0.5,

  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  borderWidth: 1,
      
  backgroundColor:           `rgba(${colors[0]},${opacityBackground})`,
  hoverBackgroundColor:      `rgba(${colors[0]},${opacityBackgroundHover})`,
  borderColor:               `rgba(${colors[0]},${opacityBorder})`,
  hoverBorderColor:          `rgba(${colors[0]},${opacityBorderHover})`,
  pointBorderColor:          `rgba(${colors[0]},${opacityPoint})`,
  pointHoverBorderColor:     `rgba(${colors[0]},${opacityPointHover})`,
  pointHoverBackgroundColor: `rgba(${colors[0]},${opacityPointBackgroundHover})`,
  pointBackgroundColor:      '#fff',
  
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
};

const style1 = Object.assign({},
  style0,  
  {
    backgroundColor:           `rgba(${colors[1]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[1]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[1]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[1]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[1]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[1]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[1]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style2 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[2]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[2]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[2]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[2]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[2]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[2]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[2]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style3 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[3]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[3]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[3]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[3]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[3]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[3]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[3]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style4 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[4]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[4]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[4]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[4]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[4]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[4]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[4]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style5 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[5]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[5]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[5]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[5]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[5]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[5]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[5]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style6 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[6]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[6]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[6]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[6]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[6]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[6]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[6]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style7 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[7]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[7]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[7]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[7]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[7]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[7]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[7]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style8 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[8]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[8]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[8]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[8]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[8]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[8]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[8]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style9 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[9]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[9]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[9]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[9]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[9]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[9]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[9]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style10 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[10]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[10]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[10]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[10]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[10]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[10]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[10]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style11 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[11]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[11]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[11]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[11]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[11]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[11]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[11]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style12 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[12]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[12]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[12]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[12]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[12]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[12]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[12]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style13 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[13]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[13]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[13]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[13]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[13]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[13]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[13]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const style14 = Object.assign({},
  style0,
  {
    // fill: false,
    backgroundColor:           `rgba(${colors[14]},${opacityBackground})`,
    hoverBackgroundColor:      `rgba(${colors[14]},${opacityBackgroundHover})`,
    borderColor:               `rgba(${colors[14]},${opacityBorder})`,
    hoverBorderColor:          `rgba(${colors[14]},${opacityBorderHover})`,
    pointBorderColor:          `rgba(${colors[14]},${opacityPoint})`,
    pointHoverBorderColor:     `rgba(${colors[14]},${opacityPointHover})`,
    pointHoverBackgroundColor: `rgba(${colors[14]},${opacityPointBackgroundHover})`,
    pointBackgroundColor:      '#fff',
  }
);

const stylesArray = [style1, style2, style3, style4, style5, style6, style7, style8, style9, style10, style11, style12, style13, style14];
