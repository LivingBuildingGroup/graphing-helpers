'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  formatControlsWithoutPreSets,
  formatPreSetsForControls,
  formatControls, } = require('../index');

describe.skip('pre-set-control', ()=> { 

  it('formatControlsWithoutPreSets', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatControlsWithoutPreSets(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatPreSetsForControls', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatPreSetsForControls(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatControls', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatControls(input);
    expect(result).to.deep.equal(expectedResult);
  });

});