'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  calcMinimumWindowDimensions,
  calcScreenType,
  calcProportionalDimensions,
  calcDimensions,
} = require('../index');

describe('dimensions', ()=> { 

  it('calcMinimumWindowDimensions', () => {

  });

  it('calcScreenType phoneP w320 h700',()=>{
    const w = 320;
    const h = 700;
    const expectedResult = {
      type: 'phoneP',
      testKeys: {
        heightRanges: ['phoneP'],
        widthRanges:  ['phoneP'],
      }
    };
    const result = calcScreenType(w,h);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcScreenType phoneL w700 h320',()=>{
    const w = 700;
    const h = 320;
    const expectedResult = {
      type: 'phoneL',
      testKeys: {
        heightRanges: ['phoneL'],
        widthRanges:  ['phoneL'],
      }
    };
    const result = calcScreenType(w,h);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcScreenType tabletL w1024 h768',()=>{
    const w = 1024;
    const h = 768;
    const expectedResult = {
      type: 'tabletL',
      testKeys: {
        heightRanges: ['phoneL','tabletL'],
        widthRanges:  ['tabletL'],
      }
    };
    const result = calcScreenType(w,h);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcScreenType tabletP w768 h1024',()=>{
    const w = 768;
    const h = 1024;
    const expectedResult = {
      type: 'tabletP',
      testKeys: {
        heightRanges: ['tabletP'],
        widthRanges:  ['tabletP'],
      }
    };
    const result = calcScreenType(w,h);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcScreenType desktop w1100 h800 (min)',()=>{
    const w = 1100;
    const h = 800;
    const expectedResult = {
      type: 'desktop',
      testKeys: {
        heightRanges: ['phoneL','tabletL','desktop'],
        widthRanges:  ['tabletL','desktop'],
      }
    };
    const result = calcScreenType(w,h);
    expect(result).to.deep.equal(expectedResult);
  });

  it('calcProportionalDimensions', () => {

  });

  it('calcDimensions',()=>{
    const state = {
      cssWidthOuter: 800,
      cssHeightOuter: 400,
      cssWidthControls: 100,
      cssHeightFooter: 300,
      cssHeightSelectors: 100,
    };
    const expectedResult = {
      cssDivOuter: {
        width: 800, // cssWidthOuter,
        height: 400, // cssHeightOuter,
      },
      cssDivGraph: {
        width: 700, // cssWidthOuter - cssWidthControls,
        height: 100, // cssHeightOuter - cssHeightFooter,
      },
      cssDivControls: {
        width: 100, // cssWidthControls,
        height: 100, // cssHeightOuter - cssHeightFooter,
      },
      cssDivFooter: {
        width: 800, // cssWidthOuter,
        height: 300, // cssHeightFooter,
      },
      cssDivSelectors: {
        width: 800, // cssWidthOuter,
        height: 100, // cssHeightSelectors,
      },
      cssCanvasWidth: 700, //cssDivGraph.width
      cssCanvasHeight: 100, //cssDivGraph.height
    };
    const result = calcDimensions(state);
    expect(result).to.deep.equal(expectedResult);
  });



});
