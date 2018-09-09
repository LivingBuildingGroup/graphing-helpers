'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  calcScreenType,
  calcCanvasDimensions,
  calcGraphContainerDimensions,
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
        screen: {
          availWidth: 1300,
          availHeight: 900,
        },
      },
      state: {
        cssMarginTop: 0,
        cssGraphMarginTop: 0,
        cssLayerSelectorMediaBreak: 520,
      },
      reduceCanvasHeightBy: 0,
    };
    const expectedResult = {
      canvasHeight: 900,
      canvasWidth: 1202, // 97% of (1300-60)
      testKeys: {
        screenType: 'desktop',
        canvasHeightRaw: 900,
        wAvailable: 1300 - 60, // control is on left since over 520 wide
        hAvailable: 900,
      }
    };
    const result = calcCanvasDimensions(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('calcGraphContainerDimensions', ()=>{
    const input = {
      state: {
        controlInFocus: 'layers',
        cssLayerSelectorMediaBreak: 520,
        cssPreSetSelectorsHeight: 200,
        cssLayerSelectorsHeight: 100,
        cssGraphMarginTop: 10,
        cssMarginTop: 30,
      },
      win: {
        screen: {
          availWidth: 1000,
        }
      }, 
      canvasHeight: 800, 
      canvasWidth: 900,
    };
    const expectedResult = {
      cssControlHeight: 800,
      cssGraphFlexOuter: {
        zIndex:    999,
        marginTop: 10,
        minHeight: 800 + 30 + 100,
      },
      cssGraphFlexInner: {
        minHeight: 800 + 30 + 100,
        display:   'block',
        maxWidth:  '100vw',
        maxHeight: '100vh',
      },
      cssSelectorOuterScrollingContainer: {
        height: 100,
      },
      cssGraphStabilizer: {
        height: 800,
        width: 900,
      },
    };
    const result = calcGraphContainerDimensions(input);
    expect(result).to.deep.equal(expectedResult)
  });

});
