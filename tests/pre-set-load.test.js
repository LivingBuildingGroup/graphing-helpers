'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  formatSelectors,
  formatAllStylesOneGroup,
  assignPreSetGroupColors,
  formatGroupsStyles,
  formatIcons,
  formatPreSetToLoad,
  formatPreSetColumns,
  createPreSetGlobalPalettes,
  selectDefaultPreSet,} = require('../index');

describe.skip('pre-set-load', ()=> { 

  it('formatSelectors', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatSelectors(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatAllStylesOneGroup', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatAllStylesOneGroup(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('assignPreSetGroupColors', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatGroupsStyles', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatGroupsStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatIcons', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatIcons(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatPreSetToLoad', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatPreSetToLoad(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatPreSetColumns', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatPreSetColumns(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createPreSetGlobalPalettes', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = createPreSetGlobalPalettes(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('selectDefaultPreSet', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = selectDefaultPreSet(input);
    expect(result).to.deep.equal(expectedResult);
  });

});