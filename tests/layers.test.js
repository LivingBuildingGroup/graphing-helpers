'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  unPrefixLayers,
  groupLayersByUnit,
  calcFirstLayerOnList,
  toggleLayerGroup, } = require('../index');

describe('layers', ()=> { 

  it('unPrefixLayers is pass-thru if no prefixesToKeep and no prefixes on layers', () => {
    const layers = [
      'layer1',
      'layer2'
    ];
    const prefixesToKeep = [];
    const expectedResult = [
      'layer1',
      'layer2'
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers is pass-thru if prefixes not found', () => {
    const layers = [
      'layer1',
      'layer2'
    ];
    const prefixesToKeep = ['A', 'B'];
    const expectedResult = [
      'layer1',
      'layer2'
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers removes prefix if found and not marked keep', () => {
    const layers = [
      'C__layer1',
      'layer2'
    ];
    const prefixesToKeep = ['A', 'B'];
    const expectedResult = [
      'layer1',
      'layer2'
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers keeps prefix if found and marked keep', () => {
    const layers = [
      'A__layer1',
      'layer2'
    ];
    const prefixesToKeep = ['A', 'B'];
    const expectedResult = [
      'A__layer1',
      'layer2'
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers handles mixed bag of compound prefixes correctly', () => {
    const layers = [
      'A__layer1',
      'layer2',
      '52__A__layer3',
      '53__B__layer4',
      '53__B__layer3',
      '52__rain',
      'A__rain'
    ];
    const prefixesToKeep = ['A', 'B'];
    const expectedResult = [
      'A__layer1',
      'A__layer3',
      'A__rain',
      'B__layer3',
      'B__layer4',
      'layer2',
      'rain',
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers handles mixed bag of compound prefixes correctly saving at 2 levels', () => {
    const layers = [
      'A__layer1',
      'layer2',
      '52__A__layer3',
      '53__B__layer4',
      '53__B__layer3',
      '52__rain',
      'A__rain',
      '53__rain',
    ];
    const prefixesToKeep = ['A', 'B', 53];
    const expectedResult = [
      '53__B__layer3',
      '53__B__layer4',
      '53__rain',
      'A__layer1',
      'A__layer3',
      'A__rain',
      'layer2',
      'rain',
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers handles mixed bag of compound prefixes correctly saving at 2 levels - number as string', () => {
    const layers = [
      'A__layer1',
      'layer2',
      '52__A__layer3',
      '53__B__layer4',
      '53__B__layer3',
      '52__rain',
      'A__rain',
      '53__rain',
    ];
    const prefixesToKeep = ['A', 'B', '53'];
    const expectedResult = [
      '53__B__layer3',
      '53__B__layer4',
      '53__rain',
      'A__layer1',
      'A__layer3',
      'A__rain',
      'layer2',
      'rain',
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });
  it('unPrefixLayers removes all prefixes', () => {
    const layers = [
      'A__layer1',
      'layer2',
      '52__A__layer3',
      '53__B__layer4',
      '53__B__layer3',
      '52__rain',
      'A__rain',
      '53__rain',
    ];
    const prefixesToKeep = null;
    const expectedResult = [
      'layer1',
      'layer2',
      'layer3',
      'layer4',
      'rain',
    ];
    const result = unPrefixLayers(layers, prefixesToKeep);
    expect(result).to.deep.equal(expectedResult);
  });

  it('groupLayersByUnit groups and ignores layers without units', () => {
    const layersThatHaveUnits = [
      'layer1',
      'layer2',
      'layer3',
      'layer4',
    ];
    const legendObject = {
      layer1: ['l1', 'layer1', 'lbs'],
      layer2: 'not an array',
      layer3: ['zero','one','units'],
    };
    const indexUnits = 2;
    const expectedResult = {
      layersGroupedByUnits: {
        lbs: ['layer1'],
      },
      layerUnitsArray: ['lbs'],
    };
    const result = groupLayersByUnit(layersThatHaveUnits, legendObject, indexUnits);
    expect(result).to.deep.equal(expectedResult);
  });
  it('groupLayersByUnit groups many layers and ignores layers without units', () => {
    const layersThatHaveUnits = [
      'layer1',
      'layer2',
      'layer3',
      'layer4',
      'layer7',
      'layer8',
      'layer0', // intentionally out of order
      'weirdUnit',
    ];
    const legendObject = {
      layer1: ['l1', 'layer1', 'lbs'],
      layer2: 'not an array',
      layer3: ['zero','one','units'],
      layer4: ['?','*', 'gals'],
      layer5: ['?','*', 'gals'], // ignored, doesn't exist
      layer6: ['?','*', 'deg'], // ignored as well
      layer7: ['?','*', 'pounds'],
      layer8: ['?','*', 'lbs'],
      layer0: ['?','*', 'lbs'],
      weirdUnit: ['?','*','apples'],
    };
    const indexUnits = 2;
    const expectedResult = {
      layersGroupedByUnits: {
        lbs:    ['layer0', 'layer1', 'layer8'],
        pounds: ['layer7'],
        apples: ['weirdUnit'],
        gals:   ['layer4'],
      },
      layerUnitsArray: ['apples','gals','lbs','pounds'],
    };
    const result = groupLayersByUnit(layersThatHaveUnits, legendObject, indexUnits);
    expect(result).to.deep.equal(expectedResult);
  });

  it.only('calcFirstLayerOnList, list is provided', () => {
    const state = {
      layersGroupedByUnits: {
        lbs:    ['layer0', 'layer1', 'layer8'],
        pounds: ['layer7'],
        apples: ['weirdUnit'],
        gals:   ['layer4'],
      },
      layerUnitsArray: ['apples','gals','lbs','pounds'],
      layersThatHaveUnits:[
        'layer1',
        'layer2',
        'layer3',
        'layer4',
        'layer7',
        'layer8',
        'layer0', // intentionally out of order
        'weirdUnit',
      ],
    };
    const expectedResult = 'layer1';
    const result = calcFirstLayerOnList(state);
    expect(result).to.equal(expectedResult);
  });
  it.only('calcFirstLayerOnList, list is not provided', () => {
    const state = {
      layersGroupedByUnits: {
        lbs:    ['layer0', 'layer1', 'layer8'],
        pounds: ['layer7'],
        apples: ['weirdUnit'],
        gals:   ['layer4'],
      },
      layerUnitsArray: ['apples','gals','lbs','pounds'],
      layersThatHaveUnits: 'not an array',
    };
    const expectedResult = 'weirdUnit';
    const result = calcFirstLayerOnList(state);
    expect(result).to.equal(expectedResult);
  });

  it('toggleLayerGroup', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = toggleLayerGroup(input);
    expect(result).to.deep.equal(expectedResult);
  });

});