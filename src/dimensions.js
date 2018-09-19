'use strict';

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
    win,
    state,
    reduceCanvasHeightBy,
  } = input;
  // validate
  const defaultReturn = {canvasWidth: 0, canvasHeight: 0};
  if(!win) return defaultReturn;
  if(!win.screen) return defaultReturn;
  if(!win.screen.availWidth || !win.screen.availHeight || !win.innerWidth || !win.innerHeight) return defaultReturn;
  // validated
  const controlsCss = {
    heightAtTop: 40,
    marginH: 60, // this is double, since the graph is centered
    marginTop: state.cssMarginTop + state.cssGraphMarginTop, // former is margin of entire contain, latter is for graph itself
  };
  const wRaw = Math.min(win.screen.availWidth , win.innerWidth);
  const hRaw = Math.min(win.screen.availHeight, win.innerHeight);
  const wAvailable = wRaw - (wRaw >= state.cssLayerSelectorMediaBreak ? controlsCss.marginH : 0 ) ;
  const hAvailable = hRaw - (wRaw >= state.cssLayerSelectorMediaBreak ? 0 : controlsCss.heightAtTop ) - controlsCss.marginTop ;
  const screenType = calcScreenType(wRaw, hRaw).type;
  const idealRatio = 1.618; // golden mean!
  const canvasWidth = Math.floor(0.97 * wAvailable) ;
  const canvasHeightRaw = 
    screenType === 'phoneP' ? hRaw :
      screenType === 'phoneL'   ? Math.floor(canvasWidth / idealRatio) :
        screenType === 'tabletL'  ?  hAvailable :
          screenType === 'tabletP'   ? wRaw :
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
  const { state, win, canvasHeight, canvasWidth } = input;

  const isNarrowScreen = 
    win.screen.availWidth < state.cssLayerSelectorMediaBreak ||
    win.innerWidth        < state.cssLayerSelectorMediaBreak;
  console.log('isNarrowScreen',isNarrowScreen)
  const cssControlHeight = isNarrowScreen ? 25 : canvasHeight ;

  let selectorsHeight = 
    state.selectorsInFocus === 'preSets' ?
      state.cssPreSetSelectorsHeight :
      state.selectorsInFocus === 'layers' ?
        state.cssLayerSelectorsHeight :
        0 ;
        
  const cssSelectorOuterScrollingContainer = {};
  if(!isNarrowScreen){
    cssSelectorOuterScrollingContainer.height = selectorsHeight;
  }

  const cssGraphStabilizer = { // same dimensions as graph, so hide/show graph doesn't blink
    height: canvasHeight,
    width:  canvasWidth,
  };
  if(isNarrowScreen){
    cssGraphStabilizer.marginTop = 50;
  }
  const totalHeight =
    canvasHeight + 
    state.cssMarginTop + 
    selectorsHeight ;

  const cssGraphFlexInner = {
    minHeight: totalHeight,
    display:   'block',
    maxWidth:  '100vw',
    maxHeight: '100vh',
  };
  const cssGraphFlexOuter = { // outermost div for the entire component
    zIndex:    999,
    marginTop: state.cssGraphMarginTop,
    minHeight: totalHeight,
  };

  return {
    cssControlHeight,
    cssSelectorOuterScrollingContainer,
    cssGraphFlexInner,
    cssGraphFlexOuter,
    cssGraphStabilizer,
  };
};

const calcDimensions = (state, win=window) => {
  // this runs on mount, on window resize, and when opening and closing selectors
  // if preSets are in focus, reduce the height by 400px or 30% of the screen height
  const reduceCanvasHeightBy = 
    state.selectorsInFocus !== 'preSets' ?
      0 :
      !win.screen ?
        0 :
        !win.screen.availHeight ?
          0 :
          Math.min(0.3 * win.screen.availHeight, 400) ;
  const {canvasHeight, canvasWidth} = calcCanvasDimensions({
    state,
    win,
    reduceCanvasHeightBy,
  });

  const graphContainerDimensions = calcGraphContainerDimensions({
    state, 
    win, 
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