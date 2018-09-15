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

  it('applyPreSetGlobalColorToStyles', () => {
    const preSetGlobalPalette = [
      '  0,   0, 254',
      '189, 209, 245',
      '155, 180, 223',
      '123, 147, 190',
      ' 81, 103, 144',
      ' 53,  74, 112',
      ' 33,  53,  93',
      ' 14,  34,  71',
      '  3,  19,  51',
    ];
    const styles = {
      layer1: {
        color: 'blue',
        style: {
          borderDash: [10,10],
          shade: 1,
        },
      },
    };
    const expectedResult = {
      styles: {
        layer1: {
          color: '  0,   0, 254',
          style: {
            borderDash: [10, 10],
            shade: 1,
          }
        }
      },
      layerToTrigger: 'layer1',
    };
    const result = applyPreSetGlobalColorToStyles(styles, preSetGlobalPalette);
    expect(result).to.deep.equal(expectedResult);
  });

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

  it.skip('editOnePreSetStyle', () => {
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