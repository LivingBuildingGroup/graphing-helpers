'use strict';

const { isPrimitiveNumber } = require('conjunction-junction');

/* This creates pre-set color palettes.
 * general14 is the original palette; now DEPRECATED; it is an array of somewhat pastel colors; the contrast is not great
 * bright is 7 mostly primary and secondary colors
 * 
 * MONOCHROMATIC ORDERED ARRAYS
 * bark, fern, corn, peach, wine, eggplant, and sky are the rainbow
 * each of these has 8 values, starting from a tone in the middle, and adding tint (white) to lower values and shade (black) to higher values
 * the default factory function returns an ordered array (light to dark)
 * as an option, the corresponding "bright" hue can be added at a given position (push, unshift, or overwriting an existing value)
 * 
 * POLYCHROMATIC ORDERED ARRAYS
 * the palette functions return ordered arrays of contrasting colors
 * palette11 is the shortest, and this array is extended through palette23
 * the first few colors in palette11 should stand on their own
 * and I don't see a need to go beyond 23 colors for graphing
 * 
 * POLYCHROMATIC RANDOM ACCESS
 * named23 returns an object with semantic keys for the colors in palette23.
 */
const general14 = () => ([
  '236,  83, 158', //  0 orange-red
  ' 30, 132, 197', //  1 middle blue
  '254, 127,  32', //  2 deep-orange
  '203, 198,  48', //  3 frog-green
  '244, 206, 117', //  4 yellow-tan
  '201,  54,  74', //  5 raspberry-red
  '223, 182, 131', //  6 tan
  ' 56, 174, 190', //  7 teal
  '254, 208,   8', //  8 sunflower-yellow
  '211, 73,   50', //  9 red-orange
  '148, 154, 167', // 10 traditional-gray
  '228, 203, 166', // 11 beige
  ' 50,  18,  27', // 12 prune  *pressure*
  ' 30,  28,  65', // 13 dark-blue
  '  0, 153,  51', // 14 not happy with this yet
]);

const bright7 = option => {
  // default returns object to use to mutate 7 palettes
  if(option === 'array'){
    return [
      '254, 128,  0',
      '  0, 254,  0',
      '254, 254,  0',
      '254,  0,   0',
      '169,  0,  81',
      '254,  0, 254',
      '  0,  0, 254',
    ];
  } else {
    return {
      bark8:     '254, 128,  0',
      fern8:     '  0, 254,  0',
      corn8:     '254, 254,  0',
      peach8:    '254,  0,   0',
      wine8:     '169,  0,  81',
      eggplant8: '254,  0, 254',
      sky8:      '  0,  0, 254',
    };
  }
};

const addBright = (arr, key, pos) => {
  // this MUTATES arr ! (seems the most efficient solution in this limited scope and size)
  const bright7 = bright7();
  if(pos < 0){
    arr.unshift(bright7[key]);
  } else if (pos < arr.length) {
    arr[pos] = bright7[key];
  } else {
    bright7.push(bright7[key]);
  }
};

const bark8 = pos => {
  const arr = [
    '246, 189, 111',
    '227, 163,  79',
    '205, 145,  67',
    '166, 114,  47',
    '137,  90,  30',
    '115,  74,  19',
    '102,  62,  12',
    ' 92,  55,   6',
  ];
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'bark8', pos);
  }
  return arr;
};

const fern8 = pos => {
  const arr = [
    '128, 248, 109',
    ' 99,  24,  79',
    ' 79, 190,  64',
    ' 56, 150,  45',
    ' 38, 119,  31',
    ' 24,  93,  19',
    ' 13,  75,  11',
    ' 92,  55,   6',
  ];
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'fern8', pos);
  }
  return arr;
};

const corn8 = pos => {
  const arr = [
    '227, 243,  92',
    '220, 233,  49',
    '203, 204,  31',
    '186, 173,  26',
    '174, 150,  22',
    '163, 130,  19',
    '155, 116,  17',
    '150, 106,  15',
  ]; 
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'corn8', pos);
  }
  return arr;
};

const peach8 = pos => {
  const arr = [
    '245, 167, 143',
    '234, 138, 110',
    '224, 116,  88',
    '213,  91,  63',
    '203,  71,  43',
    '196,  54,  25',
    '189,  40,  11',
    '165,  31,   5',
  ]; 
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'peach8', pos);
  }
  return arr;
};

const wine8 = pos => {
  const arr = [
    '243, 158, 162',
    '227, 124, 131',
    '202.  99, 108',
    '174,  70,  83',
    '150,  46,  62',
    '132,  28,  45',
    '118,  15,  34',
    '93,    6,  22',
  ]; 
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'wine8', pos);
  }
  return arr;
};

const eggplant8 = pos => {
  const arr = [
    '227, 146, 247',
    '206, 114, 225',
    '183,  92, 197',
    '158,  66, 167',
    '135,  44, 139',
    '117,  26, 117',
    '107,  16, 104',
    ' 88,   6,  83',
  ]; 
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'eggplant8', pos);
  }
  return arr;
};

const sky8 = pos => {
  const arr = [
    '189, 209, 245',
    '155, 180, 223',
    '123, 147, 190',
    ' 81, 103, 144',
    ' 53,  74, 112',
    ' 33,  53,  93',
    ' 14,  34,  71',
    '  3,  19,  51',
  ]; 
  if(isPrimitiveNumber(pos)){
    addBright(arr, 'sky8', pos);
  }
  return arr;
};

const palette23 = () => {
  const bark8     = bark8();
  const fern8     = fern8();
  const corn8     = corn8();
  const peach8    = peach8();
  const wine8     = wine8();
  const eggplant8 = eggplant8();
  const sky8      = sky8();

  return [
    bark8[1],
    fern8[2],
    corn8[3],
    peach8[4],
    wine8[7],
    sky8[7],
    fern8[6],
    sky8[1],
    peach8[0],
    eggplant8[6],
    eggplant8[0],
    bark8[3],
    sky8[4],
    peach8[2],
    corn8[0],
    bark8[7],
    eggplant8[3],
    fern8[0],
    wine8[4],
    corn8[7],
    fern8[4],
    wine8[1],
    peach8[6],
  ];
};

const palette19 = () => {
  const bark8     = bark8();
  const fern8     = fern8();
  const corn8     = corn8();
  const peach8    = peach8();
  const wine8     = wine8();
  const eggplant8 = eggplant8();
  const sky8      = sky8();

  return [
    bark8[1],
    fern8[2],
    corn8[3],
    peach8[4],
    wine8[7],
    sky8[7],
    fern8[6],
    sky8[1],
    peach8[0],
    eggplant8[6],
    eggplant8[0],
    bark8[3],
    sky8[4],
    peach8[2],
    corn8[0],
    bark8[7],
    eggplant8[3],
    fern8[0],
    wine8[4],
  ];
};

const palette16 = () => {
  const bark8     = bark8();
  const fern8     = fern8();
  const corn8     = corn8();
  const peach8    = peach8();
  const wine8     = wine8();
  const eggplant8 = eggplant8();
  const sky8      = sky8();

  return [
    bark8[1],
    fern8[2],
    corn8[3],
    peach8[4],
    wine8[7],
    sky8[7],
    fern8[6],
    sky8[1],
    peach8[0],
    eggplant8[6],
    eggplant8[0],
    bark8[3],
    sky8[4],
    peach8[2],
    corn8[0],
    bark8[7],
  ];
};

const palette13 = () => {
  const bark8     = bark8();
  const fern8     = fern8();
  const corn8     = corn8();
  const peach8    = peach8();
  const wine8     = wine8();
  const eggplant8 = eggplant8();
  const sky8      = sky8();

  return [
    bark8[1],
    fern8[2],
    corn8[3],
    peach8[4],
    wine8[7],
    sky8[7],
    fern8[6],
    sky8[1],
    peach8[0],
    eggplant8[6],
    eggplant8[0],
    bark8[3],
    sky8[4],
  ];
};

const palette11 = () => {
  const bark8     = bark8();
  const fern8     = fern8();
  const corn8     = corn8();
  const peach8    = peach8();
  const wine8     = wine8();
  const eggplant8 = eggplant8();
  const sky8      = sky8();

  return [
    bark8[1],
    fern8[2],
    corn8[3],
    peach8[4],
    wine8[7],
    sky8[7],
    fern8[6],
    sky8[1],
    peach8[0],
    eggplant8[6],
    eggplant8[0],
  ];
};

const selectPalette = num => {
  if(!isPrimitiveNumber(num)){
    return palette23();
  } else if (num <= 11) {
    return palette11();
  } else if (num <= 13) {
    return palette13();
  } else if (num <= 16) {
    return palette16();
  } else if (num <= 19) {
    return palette19();
  } else {
    return palette23();
  }
};

const named23 = () => {
  const bark8     = bark8();
  const fern8     = fern8();
  const corn8     = corn8();
  const peach8    = peach8();
  const wine8     = wine8();
  const eggplant8 = eggplant8();
  const sky8      = sky8();

  return {
    mocha:      bark8[1],
    cinnamon:   bark8[3],
    chocolate:  bark8[7],
    sprite:     fern8[0],
    lime:       fern8[2],
    chartreuse: fern8[4],
    forest:     fern8[6],
    parchment:  corn8[0],
    mustard:    corn8[3],
    tan:        corn8[7],
    skin:       peach8[0],
    coral:      peach8[2],
    papaya:     peach8[4],
    nandina:    peach8[6],
    pink:       wine8[1],
    rose:       wine8[4],
    merlot:     wine8[7],
    lavendar:   eggplant8[0],
    lilac:      eggplant8[3],
    aubergine:  eggplant8[6],
    sea:        sky8[1],
    dusk:       sky8[4],
    navy:       sky8[7],
  };
};

module.exports = {
  general14,
  bright7,
  addBright,
  bark8,
  fern8,
  corn8,
  peach8,
  wine8,
  eggplant8,
  sky8,
  palette23,
  palette19,
  palette16,
  palette13,
  palette11,
  selectPalette,
  named23,
};