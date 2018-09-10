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
        innerWidth: 1300,
        innerHeight: 900,
        screen: {
          availWidth: 99999999,
          availHeight: 7777777,
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
  it('calcCanvasDimensions 0 if no window', ()=>{
    const input = {
      state: {
        cssMarginTop: 0,
        cssGraphMarginTop: 0,
        cssLayerSelectorMediaBreak: 520,
      },
      reduceCanvasHeightBy: 0,
    };
    const expectedResult = {
      canvasHeight: 0,
      canvasWidth: 0,
    };
    const result = calcCanvasDimensions(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcCanvasDimensions 0 if no window.screen', ()=>{
    const input = {
      win: {
        innerWidth: 999999,
        innerHeight: 998889,
      },
      state: {
        cssMarginTop: 0,
        cssGraphMarginTop: 0,
        cssLayerSelectorMediaBreak: 520,
      },
      reduceCanvasHeightBy: 0,
    };
    const expectedResult = {
      canvasHeight: 0,
      canvasWidth: 0,
    };
    const result = calcCanvasDimensions(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcCanvasDimensions 0 if no window.screen.availHeight', ()=>{
    const input = {
      win: {
        innerWidth: 999,
        innerHeight: 999,
        screen: {
          availWidth: 1300,
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
      canvasHeight: 0,
      canvasWidth: 0,
    };
    const result = calcCanvasDimensions(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcCanvasDimensions 0 if no window.screen.availWidth', ()=>{
    const input = {
      win: {
        innerWidth: 999,
        innerHeight: 999,
        screen: {
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
      canvasHeight: 0,
      canvasWidth: 0,
    };
    const result = calcCanvasDimensions(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcCanvasDimensions 900h 1000w desktop', ()=>{
    const input = {
      win: {
        innerWidth: 100000,
        innerHeight: 222222,
        screen: {
          availWidth: 1000,
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
      canvasWidth: 911, // 97% of (1000-60)
      testKeys: {
        screenType: 'tabletL',
        canvasHeightRaw: 900,
        wAvailable: 1000 - 60, // control is on left since over 520 wide
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
    expect(result).to.deep.equal(expectedResult);
  });

  it('calcDimensions all provided wider than 520',()=>{
    const win = {
      innerWidth: 634635,
      innerHeight: 9022423430, 
      screen: {
        availWidth: 1000,
        availHeight: 900, 
      },
    };
    const state = {
      controlInFocus: 'layers',
      cssPreSetSelectorsHeight: 200,
      cssLayerSelectorsHeight: 100,
      cssMarginTop: 0,
      cssGraphMarginTop: 0,
      cssLayerSelectorMediaBreak: 520,
    };
    const expectedResult = {
      testKeys: {
        reduceCanvasHeightBy: 0,
      },
      cssCanvasHeight: 900,
      cssCanvasWidth: 911, // 97% of (1000-60)
      cssControlHeight: 900,
      cssGraphFlexOuter: {
        zIndex:    999,
        marginTop: 0,
        minHeight: 900 + 0 + 100, // canvasHeight + marginTop + selectorsHeight
      },
      cssGraphFlexInner: {
        minHeight: 900 + 0 + 100,
        display:   'block',
        maxWidth:  '100vw',
        maxHeight: '100vh',
      },
      cssSelectorOuterScrollingContainer: {
        height: 100,
      },
      cssGraphStabilizer: {
        height: 900,
        width: 911,
      },
    };
    const result = calcDimensions(state, win);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcDimensions all provided narrower than 520',()=>{
    const win = {
      innerWidth: 4543234,
      innerHeight: 900, 
      screen: {
        availWidth: 500,
        availHeight: 902524352430,
      },
    };
    const state = {
      controlInFocus: 'layers',
      cssPreSetSelectorsHeight: 200,
      cssLayerSelectorsHeight: 100,
      cssMarginTop: 0,
      cssGraphMarginTop: 0,
      cssLayerSelectorMediaBreak: 520,
    };
    const expectedResult = {
      testKeys: {
        reduceCanvasHeightBy: 0,
      },
      cssCanvasHeight: 500,
      cssCanvasWidth: 485, // 97% of (1000-60)
      cssControlHeight: 25,
      cssGraphFlexOuter: {
        zIndex:    999,
        marginTop: 0,
        minHeight: 500 + 0 + 100, // canvasHeight + marginTop + selectorsHeight
      },
      cssGraphFlexInner: {
        minHeight: 500 + 0 + 100,
        display:   'block',
        maxWidth:  '100vw',
        maxHeight: '100vh',
      },
      cssSelectorOuterScrollingContainer: {
        height: 100,
      },
      cssGraphStabilizer: {
        height: 500,
        width: 485,
        marginTop: 50,
      },
    };
    const result = calcDimensions(state, win);
    expect(result).to.deep.equal(expectedResult);
  });
  it('calcDimensions all provided narrower than 520, preSets on',()=>{
    const win = {
      innerWidth: 500,
      innerHeight: 900, 
      screen: {
        availWidth: 500,
        availHeight: 900, 
      },
    };
    const state = {
      controlInFocus: 'preSets',
      cssPreSetSelectorsHeight: 200,
      cssLayerSelectorsHeight: 100,
      cssMarginTop: 0,
      cssGraphMarginTop: 0,
      cssLayerSelectorMediaBreak: 520,
    };
    const expectedResult = {
      testKeys: {
        reduceCanvasHeightBy: 270, // smaller of 30% of availHeight || 400
      },
      cssCanvasHeight: 500 - 270, // for tabletP, square up, so use raw width - reduce height by
      cssCanvasWidth: 485, // 97% of (500-60)
      cssControlHeight: 25,
      cssGraphFlexOuter: {
        zIndex:    999,
        marginTop: 0,
        minHeight: (500-270) + 0 + 200, // canvasHeight + marginTop + selectorsHeight
      },
      cssGraphFlexInner: {
        minHeight: (500-270) + 0 + 200,
        display:   'block',
        maxWidth:  '100vw',
        maxHeight: '100vh',
      },
      cssSelectorOuterScrollingContainer: {
        height: 200,
      },
      cssGraphStabilizer: {
        height: 500-270,
        width: 485,
        marginTop: 50,
      },
    };
    const result = calcDimensions(state, win);
    expect(result).to.deep.equal(expectedResult);
  });

});
