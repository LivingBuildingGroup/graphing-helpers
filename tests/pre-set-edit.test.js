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

describe.skip('pre-set-edit', ()=> { 

  it('applyPreSetGlobalColorToStyles', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = applyPreSetGlobalColorToStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('prefixStyles', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = prefixStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('parseNameIdIconType', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = parseNameIdIconType(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('correctPrefixOfLayersSelected', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = correctPrefixOfLayersSelected(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('editOnePreSetStyle', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = editOnePreSetStyle(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatPreSetToSave', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatPreSetToSave(input);
    expect(result).to.deep.equal(expectedResult);
  });

});