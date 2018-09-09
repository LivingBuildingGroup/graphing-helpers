'use strict';

const { isPrimitiveNumber, 
  isObjectLiteral }  = require('conjunction-junction');

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
    reduceCanvasHeightBy,
  } = input;
  if(!window) return {canvasWidth: 0, canvasHeight: 0};
  if(!window.screen) return {canvasWidth: 0, canvasHeight: 0};
  if(!window.screen.availWidth || !window.screen.availHeight){
    return {canvasWidth: 0 ,canvasHeight: 0};
  }
  const controlsCss = {
    onLeftIfWidthOver: 520,
    heightAtTop: 40,
    marginH: 60, // this is double, since the graph is centered
    marginTop: state.cssMarginTop + state.cssGraphMarginTop, // former is margin of entire contain, latter is for graph itself
  };
  const wRaw = window.screen.availWidth;
  const hRaw = window.screen.availHeight;
  const wAvailable = wRaw - (wRaw >= controlsCss.onLeftIfWidthOver ? controlsCss.marginH : 0 ) ;
  const hAvailable = hRaw - (wRaw >= controlsCss.onLeftIfWidthOver ? 0 : controlsCss.heightAtTop ) - controlsCss.marginTop ;
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

const calcGraphContainerDimensions = (state, canvasHeight, canvasWidth) => {
  const cssControlHeight =
    window.innerWidth > state.cssLayerSelectorMediaBreak ?
      canvasHeight :
      25 ;
  let selectorsHeight = 
    state.controlInFocus === 'preSets' ?
      state.cssPreSetSelectorsHeight :
      state.controlInFocus === 'layers' ?
        state.cssLayerSelectorsHeight :
        0 ;
  if(canvasWidth < state.cssSelectorsFullWidth && state.controlInFocus === 'layers'){
    const widthPerCol = Math.ceil(state.cssSelectorsFullWidth / state.cssLayerSelectorsFullColumns);
    const cols        = Math.floor(canvasWidth / widthPerCol);
    const ratio       = state.cssLayerSelectorsFullColumns / cols;
    selectorsHeight   = selectorsHeight * ratio;
  }
  const cssSelectorOuterScrollingContainer = {
    height:     selectorsHeight,
    overflowY: 'scroll',
    width:     '90vw',
  };
  const cssGraphStabilizer = { // same dimensions as graph, so hide/show graph doesn't blink
    height: canvasHeight,
    width:  canvasWidth,
  };
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
    zIndex: 999,
    marginTop: state.cssGraphMarginTop,
    minHeight: totalHeight,
  };

  return {
    cssControlHeight,
    cssGraphFlexOuter,
    cssGraphFlexInner,
    cssSelectorOuterScrollingContainer,
    cssGraphStabilizer,
  };
};

const calcDimensions = state => {
  // this runs on mount, on window resize, and when opening and closing selectors
  const reduceCanvasHeightBy = 
  state.controlInFocus === 'preSets' ?
    Math.min(0.3 * window.innerHeight, 400) : 0 ;
  const {canvasHeight, canvasWidth} = calcCanvasDimensions({
    state,
    reduceCanvasHeightBy,
  });

  const graphContainerDimensions = calcGraphContainerDimensions(state, canvasHeight, canvasWidth);
  return Object.assign({},
    graphContainerDimensions,
    {
      cssCanvasHeight: canvasHeight,
      cssCanvasWidth:  canvasWidth,
    });
};

module.exports = {
  calcScreenType,
  calcCanvasDimensions,
  calcDimensions,
};