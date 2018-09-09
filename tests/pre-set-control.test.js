'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  formatControlsWithoutPreSets,
  formatPreSetsForControls,
  formatControls, } = require('../index');

describe('pre-set-control', ()=> { 

  it('formatControlsWithoutPreSets all included', () => {
    const state = {
      closeAllow:      true,
      printAllow:      true,
      backgroundAllow: true,
      selectorsAllow:  true,
      iconsMain: {
        close: 'close it',
        print: 'print it',
        paper: 'paper it',
        edit: 'edit it',
      },
      handleCloseGraph: () => {return 1;},
    };
    const that = {
      printGraph: () => {return 2;},
      handleBackgroundChange: () => {return 3;},
      toggleLayerStyleDisplay: () => {return 4;},
    };
    const printText = 'Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).';
    const expectedResult = {
      controlNamesTop:  ['close'               ,'print'        ,'background'],
      controlIconsTop:  ['close it'            ,'print it'     ,'paper it'],
      controlFuncsTop:  [state.handleCloseGraph,that.printGraph,that.handleBackgroundChange],
      controlLabelsTop: ['Close the graph'     ,printText      ,'Toggle white graph background'],
      controlNamesBot:  ['selector'],
      controlIconsBot:  ['edit it'],
      controlFuncsBot:  [that.toggleLayerStyleDisplay],
      controlLabelsBot: ['Toggle graph editors'],
    };
    const result = formatControlsWithoutPreSets(state, that);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatControlsWithoutPreSets none included', () => {
    const state = {
      closeAllow:      false,
      printAllow:      false,
      backgroundAllow: false,
      selectorsAllow:  false,
      iconsMain: {
        close: 'close it',
        print: 'print it',
        paper: 'paper it',
        edit: 'edit it',
      },
      handleCloseGraph: () => {return 1;},
    };
    const that = {
      printGraph: () => {return 2;},
      handleBackgroundChange: () => {return 3;},
      toggleLayerStyleDisplay: () => {return 4;},
    };
    const expectedResult = {
      controlNamesTop:  [],
      controlIconsTop:  [],
      controlFuncsTop:  [],
      controlLabelsTop: [],
      controlNamesBot:  [],
      controlIconsBot:  [],
      controlFuncsBot:  [],
      controlLabelsBot: [],
    };
    const result = formatControlsWithoutPreSets(state, that);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatPreSetsForControls', () => {
    const preSets = {
      '1': {
        name: 'name1',
        icon: 'icon1'
      },
      '2': {
        name: 'name2',
        icon: 'icon2'
      }
    };
    const that = {
      handlePreSetChoice: ()=>{},
    };
    const expectedResult = {
      preSetIds  : ['1','2'],
      preSetNames: ['name1','name2'],
      preSetIcons: ['icon1','icon2'],
      preSetFuncs: [()=>that.handlePreSetChoice('1'),()=>that.handlePreSetChoice('2')],
    };
    const result = formatPreSetsForControls(preSets, that);
    expect(result.preSetIds).to.deep.equal(expectedResult.preSetIds);
    expect(result.preSetNames).to.deep.equal(expectedResult.preSetNames);
    expect(result.preSetIcons).to.deep.equal(expectedResult.preSetIcons);
    expect(result.preSetFuncs.length).to.equal(2);
    expect(typeof result.preSetFuncs[0]).to.equal('function');
    expect(typeof result.preSetFuncs[1]).to.equal('function');
  });

  it('formatControls all included', () => {
    const state = {
      closeAllow:      true,
      printAllow:      true,
      backgroundAllow: true,
      selectorsAllow:  true,
      iconsMain: {
        close: 'close it',
        print: 'print it',
        paper: 'paper it',
        edit: 'edit it',
      },
      handleCloseGraph: () => {return 1;},
      preSets: {
        '1': {
          name: 'name1',
          icon: 'icon1'
        },
        '2': {
          name: 'name2',
          icon: 'icon2'
        }
      },
    };
    const that = {
      printGraph: () => {return 2;},
      handleBackgroundChange: () => {return 3;},
      toggleLayerStyleDisplay: () => {return 4;},
      handlePreSetChoice: ()=>{},
    };
    const printText = 'Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).';
    const expectedResult = {
      preSetIds:        ['1','2'],
      controlNames:  ['close'               ,'print'        ,'background'                   ,'name1'                         ,'name2'                         ,'selector'],
      controlIcons:  ['close it'            ,'print it'     ,'paper it'                     ,'icon1'                         ,'icon2'                         ,'edit it'],
      controlFuncs:  [state.handleCloseGraph,that.printGraph,that.handleBackgroundChange    ,()=>that.handlePreSetChoice('1'),()=>that.handlePreSetChoice('2'),that.toggleLayerStyleDisplay],
      controlLabels: ['Close the graph'     ,printText      ,'Toggle white graph background','name1'                         ,'name2'                         ,'Toggle graph editors'],
    };
    const result = formatControls(state, that);
    expect(result.preSetIds).to.deep.equal(expectedResult.preSetIds);
    expect(result.controlNames).to.deep.equal(expectedResult.controlNames);
    expect(result.controlIcons).to.deep.equal(expectedResult.controlIcons);
    expect(result.controlFuncs.length).to.equal(6);
    expect(typeof result.controlFuncs[0]).to.equal('function');
    expect(typeof result.controlFuncs[1]).to.equal('function');
    expect(typeof result.controlFuncs[2]).to.equal('function');
    expect(typeof result.controlFuncs[3]).to.equal('function');
    expect(typeof result.controlFuncs[4]).to.equal('function');
    expect(typeof result.controlFuncs[5]).to.equal('function');
  });
  it('formatControls no controls included', () => {
    const state = {
      closeAllow:      false,
      printAllow:      false,
      backgroundAllow: false,
      selectorsAllow:  false,
      iconsMain: {
        close: 'close it',
        print: 'print it',
        paper: 'paper it',
        edit: 'edit it',
      },
      handleCloseGraph: () => {return 1;},
      preSets: {
        '1': {
          name: 'name1',
          icon: 'icon1'
        },
        '2': {
          name: 'name2',
          icon: 'icon2'
        }
      },
    };
    const that = {
      printGraph: () => {return 2;},
      handleBackgroundChange: () => {return 3;},
      toggleLayerStyleDisplay: () => {return 4;},
      handlePreSetChoice: ()=>{},
    };
    const expectedResult = {
      preSetIds:     ['1','2'],
      controlNames:  ['name1'                         ,'name2'                         ],
      controlIcons:  ['icon1'                         ,'icon2'                         ],
      controlFuncs:  [()=>that.handlePreSetChoice('1'),()=>that.handlePreSetChoice('2')],
      controlLabels: ['name1'                         ,'name2'                         ],
    };
    const result = formatControls(state, that);
    expect(result.preSetIds).to.deep.equal(expectedResult.preSetIds);
    expect(result.controlNames).to.deep.equal(expectedResult.controlNames);
    expect(result.controlIcons).to.deep.equal(expectedResult.controlIcons);
    expect(result.controlFuncs.length).to.equal(2);
    expect(typeof result.controlFuncs[0]).to.equal('function');
    expect(typeof result.controlFuncs[1]).to.equal('function');
  });
  it('formatControls no preSets included', () => {
    const state = {
      closeAllow:      true,
      printAllow:      true,
      backgroundAllow: true,
      selectorsAllow:  true,
      iconsMain: {
        close: 'close it',
        print: 'print it',
        paper: 'paper it',
        edit: 'edit it',
      },
      handleCloseGraph: () => {return 1;},
      preSets: {},
    };
    const that = {
      printGraph: () => {return 2;},
      handleBackgroundChange: () => {return 3;},
      toggleLayerStyleDisplay: () => {return 4;},
      handlePreSetChoice: ()=>{},
    };
    const printText = 'Print the graph on letter size landscape (allow a few seconds for the graph to render before print preview starts).';
    const expectedResult = {
      preSetIds:     [],
      controlNames:  ['close'               ,'print'        ,'background'                   ,'selector'],
      controlIcons:  ['close it'            ,'print it'     ,'paper it'                     ,'edit it'],
      controlFuncs:  [state.handleCloseGraph,that.printGraph,that.handleBackgroundChange    ,that.toggleLayerStyleDisplay],
      controlLabels: ['Close the graph'     ,printText      ,'Toggle white graph background','Toggle graph editors'],
    };
    const result = formatControls(state, that);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatControls no controls, no preSets included', () => {
    const state = {
      closeAllow:      false,
      printAllow:      false,
      backgroundAllow: false,
      selectorsAllow:  false,
      iconsMain: {
        close: 'close it',
        print: 'print it',
        paper: 'paper it',
        edit: 'edit it',
      },
      handleCloseGraph: () => {return 1;},
    };
    const that = {
      printGraph: () => {return 2;},
      handleBackgroundChange: () => {return 3;},
      toggleLayerStyleDisplay: () => {return 4;},
      handlePreSetChoice: ()=>{},
    };
    const expectedResult = {
      preSetIds:     [],
      controlNames:  [],
      controlIcons:  [],
      controlFuncs:  [],
      controlLabels: [],
    };
    const result = formatControls(state, that);
    expect(result).to.deep.equal(expectedResult);
  });

});