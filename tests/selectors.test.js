'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  listAllLayersUnPrefixed,
  createLayerSelectorObject } = require('../index');

describe('selectors', ()=> { 

  // it('listAllLayersUnPrefixed prefix count = 0, no prefixes', () => {
  //   const oneUnit = {
  //     layer1: 3,
  //     layer2: 4,
  //   };
  //   const layersRawPrefixCount = 0;
  //   const expectedResult = [
  //     'layer1',
  //     'layer2',
  //   ];
  //   const result = listAllLayersUnPrefixed(oneUnit, layersRawPrefixCount);
  //   expect(result).to.deep.equal(expectedResult);
  // });
  // it('listAllLayersUnPrefixed prefix count = 1, no prefixes', () => {
  //   const oneUnit = {
  //     layer1: 3,
  //     layer2: 4,
  //   };
  //   const layersRawPrefixCount = 0;
  //   const expectedResult = [
  //     'layer1',
  //     'layer2',
  //   ];
  //   const result = listAllLayersUnPrefixed(oneUnit, layersRawPrefixCount);
  //   expect(result).to.deep.equal(expectedResult);
  // });
  // it('listAllLayersUnPrefixed prefix count = 0, with prefixes', () => {
  //   const oneUnit = {
  //     A__layer1: 3,
  //     B__layer2: 4,
  //   };
  //   const layersRawPrefixCount = 0;
  //   const expectedResult = [
  //     'A__layer1',
  //     'B__layer2',
  //   ];
  //   const result = listAllLayersUnPrefixed(oneUnit, layersRawPrefixCount);
  //   expect(result).to.deep.equal(expectedResult);
  // });
  // it('listAllLayersUnPrefixed prefix count = 1, with prefixes', () => {
  //   const oneUnit = {
  //     A__layer1: 3,
  //     B__layer2: 4,
  //   };
  //   const layersRawPrefixCount = 1;
  //   const expectedResult = [
  //     'layer1',
  //     'layer2',
  //   ];
  //   const result = listAllLayersUnPrefixed(oneUnit, layersRawPrefixCount);
  //   expect(result).to.deep.equal(expectedResult);
  // });
  // it('listAllLayersUnPrefixed prefix count = 1, with prefixes', () => {
  //   const oneUnit = {
  //     '52__B__layer2': 4,
  //     '53__B__layer2': 5,
  //     '52__A__layer1': 3,
  //   };
  //   const layersRawPrefixCount = 1;
  //   const expectedResult = [
  //     'layer1',
  //     'layer2',
  //   ];
  //   const result = listAllLayersUnPrefixed(oneUnit, layersRawPrefixCount);
  //   expect(result).to.deep.equal(expectedResult);
  // });

  it('createLayerSelectorObject again', () => {
    const input = {
      data: [
        {
          '52__B__layer2': 4,
          '53__B__layer2': 5,
          '52__A__layer1': 3,
        },
      ],
      units: {
        layer1: 'gals',
        layer2: 'lbs',
      },
      abbrevs: {
        layer1: 'GALS',
        layer2: 'POUNDS',
      },
      labels: {
        layer1: 'gallons of stuff',
        layer2: 'lbs is weight',
      },
    };
    const expectedResult = {
      layersThatHaveUnits: [
        '52__A__layer1',
        '52__B__layer2',
        '53__B__layer2',
      ],
      layersAllPrefixed: [
        '52__A__layer1',
        '52__B__layer2',
        '53__B__layer2',
      ],
      legendObject: {
        '52__A__layer1': ['52 A GALS','52 A gallons of stuff','gals'],
        '52__B__layer2': ['52 B POUNDS','52 B lbs is weight','lbs'],
        '53__B__layer2': ['53 B POUNDS','53 B lbs is weight','lbs'],
      }
    };
    const result = createLayerSelectorObject(input);
    expect(result).to.deep.equal(expectedResult);
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
