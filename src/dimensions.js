'use strict';

const { isPrimitiveNumber } = require('conjunction-junction');

const calcScreenType = (w,h) =>{
  const phoneP_minW   =     0;
  const phoneP_maxW   =   500;
  const phoneP_minH   =     0;
  const phoneP_maxH   =   850;
  const phoneL_minW   =   400;
  const phoneL_maxW   =   850;
  const phoneL_minH   =   300;
  const phoneL_maxH   =   850;
  const tabletP_minW  =   450;
  const tabletP_maxW  =  1100;
  const tabletP_minH  =   800;
  const tabletP_maxH  =  1100;
  const tabletL_minW  =   800;
  const tabletL_maxW  =  1100;
  const tabletL_minH  =   650;
  const tabletL_maxH  =  1100;
  const desktopL_minW =  1100;
  const desktopL_minH =   800;
  const heightRanges = [];
  const widthRanges  = [];

  if(h >= phoneP_minH  && h <= phoneP_maxH  && h >= w ) heightRanges.push('phoneP' );
  if(h >= phoneL_minH  && h <= phoneL_maxH  && w >= h ) heightRanges.push('phoneL' );
  if(h >= tabletL_minH && h <= tabletL_maxH && w >= h ) heightRanges.push('tabletL');
  if(h >= tabletP_minH && h <= tabletP_maxH && h >= w ) heightRanges.push('tabletP');
  if(h >= desktopL_minH                     && w >= h ) heightRanges.push('desktop');
  
  if(w >= phoneP_minW  && w <= phoneP_maxW  && h >= w ) widthRanges.push('phoneP' );
  if(w >= phoneL_minW  && w <= phoneL_maxW  && w >= h ) widthRanges.push('phoneL' );
  if(w >= tabletL_minW && w <= tabletL_maxW && w >= h ) widthRanges.push('tabletL');
  if(w >= tabletP_minW && w <= tabletP_maxW && h >= w ) widthRanges.push('tabletP');
  if(w >= desktopL_minW                     && w >= h ) widthRanges.push('desktop');
  
  // types are in descending order of optimization. I.e. desktop is most optimized, so use it if we can.
  const types = ['phoneP','phoneL','tabletP','tabletL','desktop'];
  let type = 'phoneP'; // default
  types.forEach(t=>{
    if(heightRanges.includes(t) && widthRanges.includes(t)){
      type = t;
    }
  });
  return {
    type,
    testKeys: {
      heightRanges,
      widthRanges,
    },
  };
};

const calcCanvasDimensions = input => {
  const {
    state,
    widthLowestCommon,
    heightLowestCommon,
    reduceCanvasHeightBy,
    screenType,
  } = input;
  // validate
  const defaultReturn = {canvasWidth: 0, canvasHeight: 0};
  if(!widthLowestCommon || !heightLowestCommon ) return defaultReturn;
  // validated
  const controlsCss = {
    heightAtTop: 40,
    marginH: 60, // this is double, since the graph is centered
  };
  const wAvailable = widthLowestCommon - (widthLowestCommon >= state.cssLayerSelectorMediaBreak ? controlsCss.marginH : 0 ) ;
  const hAvailable = heightLowestCommon - (widthLowestCommon >= state.cssLayerSelectorMediaBreak ? 0 : controlsCss.heightAtTop ) - controlsCss.marginTop ;
  const idealRatio = 1.618; // golden mean!
  const canvasWidth = 
    screenType === 'phoneP' ? Math.floor(wAvailable * 2) :
      screenType === 'phoneL'  ?  Math.floor(wAvailable * 1.2) :
        Math.floor(0.97 * wAvailable) ;
  const canvasHeightRaw = 
    screenType === 'phoneP' ? Math.floor(heightLowestCommon * 1.5) :
      screenType === 'phoneL'   ? Math.floor(canvasWidth / idealRatio) :
        screenType === 'tabletL'  ?  hAvailable :
          screenType === 'tabletP'   ? widthLowestCommon :
            hAvailable;    
  const canvasHeight = canvasHeightRaw - reduceCanvasHeightBy;
  console.log('widthLowestCommon',widthLowestCommon,'heightLowestCommon',heightLowestCommon,'hAvailable',hAvailable,'canvasHeightRaw',canvasHeightRaw,'canvasHeight',canvasHeight,'screenType',screenType,'reduceCanvasHeightBy',reduceCanvasHeightBy)
  return { 
    canvasWidth, 
    canvasHeight, 
    testKeys: {
      screenType,
      canvasHeightRaw,
      wAvailable,
      hAvailable,
    }
  };
};

const calcGraphContainerDimensions = input => {
  const { 
    state,     
    widthLowestCommon,
    heightLowestCommon, 
    canvasHeight, 
    canvasWidth } = input;

  const isNarrowScreen = 
  widthLowestCommon < state.cssLayerSelectorMediaBreak ;
  console.log('isNarrowScreen',isNarrowScreen);

  let selectorsHeight = 
    state.selectorsInFocus === 'preSets' ?
      state.cssPreSetSelectorsHeight :
      state.selectorsInFocus === 'layers' ?
        state.cssLayerSelectorsHeight :
        0 ;
        
  const cssSelectorOuterScrollingContainer = {};
  if(!isNarrowScreen){
    cssSelectorOuterScrollingContainer.maxHeight = selectorsHeight;
  }

  const cssGraphStabilizer = { // same dimensions as graph, so hide/show graph doesn't blink
    width:     Math.max(widthLowestCommon,canvasWidth),
    maxHeight: Math.max(heightLowestCommon,canvasHeight),
  };
  if(isNarrowScreen){
    cssGraphStabilizer.marginTop = 50;
  }

  const cssGraphFlex = {
    display:   'block',
    width:     Math.max(widthLowestCommon,canvasWidth),
    maxHeight: Math.max(heightLowestCommon,canvasHeight),
  };

  return {
    cssSelectorOuterScrollingContainer,
    cssGraphFlex,
    cssGraphStabilizer,
  };
};

const calcDimensions = (state, win=window) => {
  // this runs on mount, on window resize, and when opening and closing selectors
  // if preSets are in focus, reduce the height by 400px or 30% of the screen height
  const availHeight = 
    !win.screen ?
      0 :
      !isPrimitiveNumber(win.screen.availHeight) ?
        0:
        win.screen.availHeight;
  const availWidth = 
    !win.screen ?
      0 :
      !win.screen.availWidth ?
        0:
        win.screen.availWidth;
  const heightLowestCommon =
    !isPrimitiveNumber(win.innerHeight) ?
      availHeight :
      Math.min(win.innerHeight, availHeight);
  const widthLowestCommon =
    !isPrimitiveNumber(win.innerWidth) ?
      availWidth :
      Math.min(win.innerWidth, availWidth);

  // do better type checking and content checking for state.cssScreenType
  const screenType = state.cssScreenType ? state.cssScreenType : calcScreenType(widthLowestCommon, heightLowestCommon).type;
  console.log('screenType',screenType,'state.cssScreenType',state.cssScreenType)

  const reduceCanvasHeightBy = 
    screenType === 'phoneP' ? 0 :
      screenType === 'phoneL'   ? 0 :
        state.selectorsInFocus !== 'preSets' ?
          50 :
          Math.min(0.3 * heightLowestCommon, 400) ;

  const {canvasHeight, canvasWidth} = calcCanvasDimensions({
    state,
    widthLowestCommon,
    heightLowestCommon,
    reduceCanvasHeightBy,
    screenType,
  });

  const graphContainerDimensions = calcGraphContainerDimensions({
    state, 
    widthLowestCommon,
    heightLowestCommon,
    canvasHeight, 
    canvasWidth
  });

  return Object.assign({},
    graphContainerDimensions,
    {
      cssCanvasHeight: canvasHeight,
      cssCanvasWidth:  canvasWidth,
      testKeys: {
        reduceCanvasHeightBy,
      }
    });
};

module.exports = {
  calcScreenType,
  calcCanvasDimensions,
  calcGraphContainerDimensions,
  calcDimensions,
};