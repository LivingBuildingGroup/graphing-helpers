'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  listAllLayers,
  finalizeSelectorObject,
  createLayerSelectorObject } = require('../index');

describe('selectors', ()=> { 

  it('listAllLayers', () => {

  });

  it('finalizeSelectorObject', () => {

  });

  it('createLayerSelectorObject convert 1', ()=>{
    const dataConvertFrom = 1;
    const data = [
      {
        unit1: 3,
        unit2: 5,
      }
    ];
    const units = {
      unit1: 'gals',
      unit2: 'lbs',
    };
    const labels = {
      unit1: 'gallons of stuff',
      unit2: 'lbs is weight',
    };
    const abbrevs = {
      unit1: 'GALS',
      unit2: 'POUNDS',
    };
    const input = {
      dataConvertFrom,
      data,
      units,
      labels,
      abbrevs,
    };
    const expectedResult = {
      layersThatHaveUnits: [
        'unit1',
        'unit2',
      ],
      layersAllPrefixed: [
        'unit1',
        'unit2',
      ],
      legendObject: {
        unit1: ['GALS'   ,'gallons of stuff', 'gals'],
        unit2: ['POUNDS' ,'lbs is weight'   , 'lbs' ],
      },
    };
    const result = createLayerSelectorObject(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createLayerSelectorObject convert 2 without arrays', ()=>{
    const input = {
      data: [
        {
          test1__unit1: 3,
          test1__unit2: 5,
          test2__unit1: 33,
          test2__unit2: 55,
        }
      ], 
      layersRawPrefixCount: 1, // there is up to 1 prefix in the layers of data
      layersAllUnPrefixed: [
        'unit1',
        'unit2',
      ],
      groups: [
        'test1',
        'test2',
      ],
      groupsSub: [
        '',
      ],
      units: {
        unit1: 'gals',
        unit2: 'lbs',
      },
      abbrevs: {
        unit1: 'GALS',
        unit2: 'POUNDS',
      },
      labels: {
        unit1: 'gallons of stuff',
        unit2: 'lbs is weight',
      },

    };
    const expectedResult = {
      layersThatHaveUnits: [
        'test1__unit1',
        'test2__unit1',
        'test1__unit2',
        'test2__unit2',
      ],
      legendObject: {
        test1__unit1: ['test1 GALS'  ,'test1 gallons of stuff', 'gals'],
        test2__unit1: ['test2 GALS'  ,'test2 gallons of stuff', 'gals'],
        test1__unit2: ['test1 POUNDS','test1 lbs is weight'   , 'lbs' ],
        test2__unit2: ['test2 POUNDS','test2 lbs is weight'   , 'lbs' ],
      },
      layersAllPrefixed: [
        'test1__unit1',
        'test2__unit1',
        'test1__unit2',
        'test2__unit2',
      ],
    };
    const result = createLayerSelectorObject(input);
    expect(result).to.deep.equal(expectedResult);
  });

});
