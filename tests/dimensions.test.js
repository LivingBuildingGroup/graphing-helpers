'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  calcScreenType,
  calcCanvasDimensions,
  calcDimensions,
} = require('../index');

describe('dimensions', ()=> { 

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

  it('calcCanvasDimensions 900h 1300w desktop', ()=>{
    const input = {
      win: {
        innerWidth: 1300,
        innerHeight: 900,
      },
      reduceCanvasHeightBy: 0,
    };
    const expectedResult = {
      canvasHeight: 900,
      canvasWidth: 1257, // 99% of (1300-30)
      testKeys: {
        screenType: 'desktop',
        canvasHeightRaw: 900,
        wAvailable: 1300 - 30, // control is on left since over 520 wide
        hAvailable: 900,
      }
    };
    const result = calcCanvasDimensions(input);
    expect(result).to.deep.equal(expectedResult);
  });

});
