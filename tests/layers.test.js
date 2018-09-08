'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  unPrefixLayers,
  formatLayerCheckboxGroups,
  calcFirstLayerOnList,
  toggleLayerGroup, } = require('../index');

describe.skip('layers', ()=> { 

  it('unPrefixLayers', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = unPrefixLayers(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatLayerCheckboxGroups', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatLayerCheckboxGroups(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('calcFirstLayerOnList', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = calcFirstLayerOnList(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('toggleLayerGroup', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = toggleLayerGroup(input);
    expect(result).to.deep.equal(expectedResult);
  });

});