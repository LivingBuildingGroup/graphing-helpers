'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  formatSelectors,
  formatAllStylesOneGroup,
  assignPreSetGroupColors,
  formatGroupsStyles,
  formatPreSetToLoad,
  formatIcons,
  formatPreSetColumns,
  createPreSetGlobalPalettes,
  selectDefaultPreSet,} = require('../index');

describe('pre-set-load', ()=> { 

  it('formatSelectors single no group', () => {
    const thisPreSet = {
      layersSelected: [
        'layer1',
        'layer2',
      ],
      type: 'single',
    };
    const groupTrue = false;
    const groupsRaw = [];
    const expectedResult = {
      selectors: [
        'layer1',
        'layer2',
      ],
      selectorsRemaining: [
        'layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors single no group one layer only', () => {
    const thisPreSet = {
      layersSelected: [
        'layer1',
      ],
      type: 'single',
    };
    const groupTrue = false;
    const groupsRaw = [];
    const expectedResult = {
      selectors: [
        'layer1',
      ],
      selectorsRemaining: [],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors single with group stays single', () => {
    const thisPreSet = {
      layersSelected: [
        'layer1',
        'layer2',
      ],
      type: 'single',
    };
    const groupTrue = true;
    const groupsRaw = [
      'A'
    ];
    const expectedResult = {
      selectors: [
        'layer1',
        'layer2',
      ],
      selectorsRemaining: [
        'layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors group with group gets prefixed', () => {
    const thisPreSet = {
      layersSelected: [
        'layer1',
        'layer2',
      ],
      type: 'group',
    };
    const groupTrue = true;
    const groupsRaw = [
      'A'
    ];
    const expectedResult = {
      selectors: [
        'A__layer1',
        'A__layer2',
      ],
      selectorsRemaining: [
        'A__layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors group with subGroup gets prefixed if groupTrue', () => {
    const thisPreSet = {
      layersSelected: [
        'A__layer1',
        'A__layer2',
      ],
      type: 'group',
    };
    const groupTrue = true;
    const groupsRaw = [
      52,
      '53',
    ];
    const expectedResult = {
      selectors: [
        '52__A__layer1',
        '53__A__layer1',
        '52__A__layer2',
        '53__A__layer2',
      ],
      selectorsRemaining: [
        '53__A__layer1',
        '52__A__layer2',
        '53__A__layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors group with subGroup does NOT prefixed if NOT groupTrue', () => {
    const thisPreSet = {
      layersSelected: [
        'A__layer1',
        'A__layer2',
      ],
      type: 'group',
    };
    const groupTrue = false;
    const groupsRaw = [
      52,
      '53',
    ];
    const expectedResult = {
      selectors: [
        'A__layer1',
        'A__layer2',
      ],
      selectorsRemaining: [
        'A__layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors empty layersSelected is not Array', () => {
    const thisPreSet = {
      layersSelected: 'not an array',
      type: 'single',
    };
    const groupTrue = false;
    const groupsRaw = [];
    const expectedResult = {
      selectors: [''],
      selectorsRemaining: [],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors empty layersSelected is empty', () => {
    const thisPreSet = {
      layersSelected: [],
      type: 'single',
    };
    const groupTrue = false;
    const groupsRaw = [];
    const expectedResult = {
      selectors: [''],
      selectorsRemaining: [],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });

  it.skip('formatAllStylesOneGroup', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatAllStylesOneGroup(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it.skip('assignPreSetGroupColors', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it.skip('formatGroupsStyles', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatGroupsStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it.skip('formatPreSetToLoad', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatPreSetToLoad(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatIcons all undefined', () => {
    const thisPreSet = {
      icon: undefined,
      name: undefined,
    };
    const expectedResult = {
      preSetIconNew: null,
      preSetNameNew: null,
    };
    const result = formatIcons(thisPreSet);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatIcons both defined', () => {
    const thisPreSet = {
      icon: 'key',
      name: 'lock',
    };
    const expectedResult = {
      preSetIconNew: 'key',
      preSetNameNew: 'lock',
    };
    const result = formatIcons(thisPreSet);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatPreSetColumns', () => {
    const styleColorsNamed = {
      red: 'red',
      yellow: 'yellow',
    };
    const expectedResult = {
      styleColorsNamedArray: ['red', 'yellow'],
      preSetColumns: [
        { 
          key: 'color',
          label: 'color',
          type: 'color',
          optionLabels: ['red', 'yellow'],
          optionValues: ['red', 'yellow'],
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
      ],
    };
    const result = formatPreSetColumns(styleColorsNamed);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createPreSetGlobalPalettes', () => {
    const expectedResult = {
      blue: [
        '  0,   0, 254',
        '189, 209, 245',
        '155, 180, 223',
        '123, 147, 190',
        ' 81, 103, 144',
        ' 53,  74, 112',
        ' 33,  53,  93',
        ' 14,  34,  71',
        '  3,  19,  51',
      ],
      green: [
        '  0, 254,   0',
        '128, 248, 109',
        ' 99,  24,  79',
        ' 79, 190,  64',
        ' 56, 150,  45',
        ' 38, 119,  31',
        ' 24,  93,  19',
        ' 13,  75,  11',
        ' 92,  55,   6',
      ],
      orange: [
        '254, 128,   0',
        '246, 189, 111',
        '227, 163,  79',
        '205, 145,  67',
        '166, 114,  47',
        '137,  90,  30',
        '115,  74,  19',
        '102,  62,  12',
        ' 92,  55,   6',
      ],
      purple: [
        '169,   0,  81',
        '243, 158, 162',
        '227, 124, 131',
        '202.  99, 108',
        '174,  70,  83',
        '150,  46,  62',
        '132,  28,  45',
        '118,  15,  34',
        ' 93,   6,  22',
      ],
      red: [
        '254,   0,   0',
        '245, 167, 143',
        '234, 138, 110',
        '224, 116,  88',
        '213,  91,  63',
        '203,  71,  43',
        '196,  54,  25',
        '189,  40,  11',
        '165,  31,   5',
      ],
      violet: [
        '254,   0, 254',
        '227, 146, 247',
        '206, 114, 225',
        '183,  92, 197',
        '158,  66, 167',
        '135,  44, 139',
        '117,  26, 117',
        '107,  16, 104',
        ' 88,   6,  83',
      ],
      yellow: [
        '254, 254,   0',
        '227, 243,  92',
        '220, 233,  49',
        '203, 204,  31',
        '186, 173,  26',
        '174, 150,  22',
        '163, 130,  19',
        '155, 116,  17',
        '150, 106,  15',
      ],
    };
    const result = createPreSetGlobalPalettes();
    expect(result).to.deep.equal(expectedResult);
  });

  it('selectDefaultPreSet no default this graphName', () => {
    const state = {
      preSets: {
        a: {
          graph: 'tests',
          def: true,
        },
        b: {
          graph: 'platforms',
        }
      }, 
      graphName: 'platforms',
    };
    const expectedResult = 'b';
    const result = selectDefaultPreSet(state);
    expect(result).to.equal(expectedResult);
  });
  it('selectDefaultPreSet no default this graphName', () => {
    const state = {
      preSets: {
        a: {
          graph: 'tests',
          def: true,
        },
        b: {
          graph: 'platforms',
          def: true,
        }
      }, 
      graphName: 'platforms',
    };
    const expectedResult = 'b';
    const result = selectDefaultPreSet(state);
    expect(result).to.equal(expectedResult);
  });
  it('selectDefaultPreSet no default this graphName', () => {
    const state = {
      preSets: {
        a: {
          graph: 'tests',
          def: true,
        },
        b: {
          graph: 'platforms',
        }
      }, 
      graphName: 'weather',
    };
    const expectedResult = undefined;
    const result = selectDefaultPreSet(state);
    expect(result).to.equal(expectedResult);
  });

});