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

  it.only('applyPreSetGlobalColorToStyles', () => {
    const preSetGlobalPalette = {
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
    };
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
    const expectedResult = {
      
    };
    const input = {};
    const result = prefixStyles(input);
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