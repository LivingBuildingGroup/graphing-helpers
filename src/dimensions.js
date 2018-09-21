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
    widthToUse,
    heightToUse,
    reduceCanvasHeightBy,
  } = input;
  // validate
  const defaultReturn = {canvasWidth: 0, canvasHeight: 0};
  if(!widthToUse || !heightToUse ) return defaultReturn;
  // validated
  const controlsCss = {
    heightAtTop: 40,
    marginH: 60, // this is double, since the graph is centered
    marginTop: state.cssMarginTop + state.cssGraphMarginTop, // former is margin of entire contain, latter is for graph itself
  };
  const wAvailable = widthToUse - (widthToUse >= state.cssLayerSelectorMediaBreak ? controlsCss.marginH : 0 ) ;
  const hAvailable = heightToUse - (widthToUse >= state.cssLayerSelectorMediaBreak ? 0 : controlsCss.heightAtTop ) - controlsCss.marginTop ;
  const screenType = calcScreenType(widthToUse, heightToUse).type;
  const idealRatio = 1.618; // golden mean!
  const canvasWidth = Math.floor(0.97 * wAvailable) ;
  const canvasHeightRaw = 
    screenType === 'phoneP' ? heightToUse :
      screenType === 'phoneL'   ? Math.floor(canvasWidth / idealRatio) :
        screenType === 'tabletL'  ?  hAvailable :
          screenType === 'tabletP'   ? widthToUse :
            hAvailable;    
  const canvasHeight = canvasHeightRaw - reduceCanvasHeightBy;
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
    widthToUse,
    heightToUse, 
    canvasHeight, 
    canvasWidth } = input;

  const isNarrowScreen = 
  widthToUse < state.cssLayerSelectorMediaBreak ;
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
    height: canvasHeight,
    width:  canvasWidth,
  };
  if(isNarrowScreen){
    cssGraphStabilizer.marginTop = 50;
  }

  const cssGraphFlex = {
    display:   'block',
    width:     widthToUse,
    maxHeight: heightToUse,
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
  const heightToUse =
    !isPrimitiveNumber(win.innerHeight) ?
      availHeight :
      Math.min(win.innerHeight, availHeight);
  const widthToUse =
    !isPrimitiveNumber(win.innerWidth) ?
      availWidth :
      Math.min(win.innerWidth, availWidth);

  const reduceCanvasHeightBy = 
    state.selectorsInFocus !== 'preSets' ?
      50 :
      Math.min(0.3 * heightToUse, 400) ;
  const {canvasHeight, canvasWidth} = calcCanvasDimensions({
    state,
    widthToUse,
    heightToUse,
    reduceCanvasHeightBy,
  });

  const graphContainerDimensions = calcGraphContainerDimensions({
    state, 
    widthToUse,
    heightToUse,
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