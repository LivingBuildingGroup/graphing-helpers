'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  applyPreSetGlobalColorToStyles,
  prefixStyles,
  parseNameIdIconType,
  correctPrefixOfLayersSelected,
  editOnePreSetStyle,
  formatPreSetToSave,} = require('../index');

describe('pre-set-edit', ()=> { 

  it.skip('prefixStyles', () => {
    // I AM NOT SURE WE NEED THIS!!!!
    const exStyles = {
      rain_lbs: {
        color: 'blue',
        style: {
          borderDash: [10,10],
        },
      },
      rain_gals: {
        color: 'green',
        style: {
          fill: false,
        },
      },
    };
    const defaults = {

    };
    const layersAllUnPrefixed = [

    ];
    const expectedResult = {
      
    };
    const result = prefixStyles(exStyles, defaults, layersAllUnPrefixed);
    expect(result).to.deep.equal(expectedResult);
  });

  it.skip('parseNameIdIconType', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = parseNameIdIconType(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it.skip('correctPrefixOfLayersSelected', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = correctPrefixOfLayersSelected(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('applyPreSetGlobalColorToStyles returns empty if no existing styles', () => {
    const input = {
      preSetGlobalPalette: [
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
      styles: {},
      property: {
        type: 'shade',
        key: null, // key is used for properties other than shade or color, such as "borderDash"
      }
    };
    const expectedResult = {};
    const result = applyPreSetGlobalColorToStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('applyPreSetGlobalColorToStyles one existing style', () => {
    const input = {
      preSetGlobalPalette: [
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
      styles: {
        layer1: {
          color: 'blue',
          style: {
            borderDash: [10,10],
            shade: 1,
          },
        },
      },
    };
    const expectedResult = {
      layer1: {
        color: '  0,   0, 254',
        colorOld: 'blue',
        style: {
          borderDash: [10, 10],
          shade: 1,
        }
      }
    };
    const result = applyPreSetGlobalColorToStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('applyPreSetGlobalColorToStyles many existing styles', () => {
    const manyStyles = {
      layer1: {
        color: '80, 80, 80',
        style: { 
          borderColor: '254, 32, 78'
        },
      },
      layer2: { 
        color: '80, 80, 80', 
        style: {} 
      },
      layer3: {
        color: '77, 77, 77',
        style: {},
      },
      A__layer4: {
        color: '34, 52, 78',
        style: {},
      },
      '57__layer4': {
        color: '34, 52, 78',
        style: {
          shade: -1, // << should NOT trigger edit, and should never exist either
        },
      },
      A__57__layer5: {
        color: '44, 46, 67',
        style: {
          shade: 0, // << should NOT trigger edit, as 0 = 'do not apply'
        },
      },
      C__layer6: {
        color: '253, 253, 253', // <<<<<< color should edit
        style: {
          shade: 8,  // <<<<<< over 0 triggers edit
          borderDashOffset: 0.2,
        }
      },
      C__53__layer6: {
        color: '253, 253, 253', // <<<<<< color should edit
        style: {
          shade: 5, // <<<<<< over 0 triggers edit
          borderDashOffset: 0.2,
        }
      },
      C__54__layer6: {
        color: '253, 253, 253', // <<<<<< color should edit
        style: {
          shade: 2, // <<<<<< over 0 triggers edit
          borderDashOffset: 0.2,
        }
      },
      C__54__layer4: {
        color: '34, 52, 78',
        style: {},
      },
      '53__layer6': {
        color: '80, 80, 80', // <<<<<< color should edit
        style: {
          shade: 1, // <<<<<< over 0 triggers edit
          borderDashOffset: 0.2,
        }
      },
    };
    const input = {
      preSetGlobalPalette: [
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
      styles: manyStyles,
    };
    const expectedResult =  Object.assign({},
      manyStyles,
      {
        C__layer6: Object.assign({},
          manyStyles.C__layer6,
          {
            color: ' 14,  34,  71',
            colorOld: manyStyles.C__layer6.color,
          }
        ),
        C__53__layer6: Object.assign({},
          manyStyles.C__53__layer6,
          {
            color: ' 81, 103, 144',
            colorOld: manyStyles.C__53__layer6.color,
          }
        ),
        C__54__layer6: Object.assign({},
          manyStyles.C__54__layer6,
          {
            color: '189, 209, 245',
            colorOld: manyStyles.C__54__layer6.color,
          }
        ),
        '53__layer6': Object.assign({},
          manyStyles['53__layer6'],
          {
            color: '  0,   0, 254',
            colorOld: manyStyles['53__layer6'].color,
          }
        ),
      }
    );
    const result = applyPreSetGlobalColorToStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  
  it('editOnePreSetStyle', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = editOnePreSetStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it.skip('formatPreSetToSave', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatPreSetToSave(input);
    expect(result).to.deep.equal(expectedResult);
  });

});