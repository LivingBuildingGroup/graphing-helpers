'use strict';

const { isPrimitiveNumber,
  isObjectLiteral } = require('conjunction-junction');

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

const calcMinimumWindowDimensions = win => {
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
  return {
    cssWidthOuter: widthLowestCommon,
    cssHeightOuter: heightLowestCommon,
  };
};

const calcProportionalDimensions = input => {
  const { 
    width, 
    height,
    cssWidthOuter,
    cssHeightOuter } = input;

  const widthOuter  = isPrimitiveNumber(cssWidthOuter)  ? cssWidthOuter : 100 ;
  const heightOuter = isPrimitiveNumber(cssHeightOuter) ? cssHeightOuter : 100 ;

  const w = isObjectLiteral(width) ? width : {} ;
  w.bigEnoughScreen   = isPrimitiveNumber(w.bigEnoughScreen)   ? w.bigEnoughScreen   : 1000 ;
  w.percentOfScreen   = isPrimitiveNumber(w.percentOfScreen)   ? w.percentOfScreen   : 1 ;
  w.maxPctOfBigEnough = isPrimitiveNumber(w.maxPctOfBigEnough) ? w.maxPctOfBigEnough : 1 ;
  const h = isObjectLiteral(height) ? height : {} ;
  h.bigEnoughScreen   = isPrimitiveNumber(h.bigEnoughScreen)   ? h.bigEnoughScreen   : 1000 ;
  h.percentOfScreen   = isPrimitiveNumber(h.percentOfScreen)   ? h.percentOfScreen   : 1 ;
  h.maxPctOfBigEnough = isPrimitiveNumber(h.maxPctOfBigEnough) ? h.maxPctOfBigEnough : 1 ;

  const widthRatioDelta = w.maxPctOfBigEnough - w.percentOfScreen;
  const widthBelowMin = w.bigEnoughScreen - widthOuter;

  const heightRatioDelta = h.maxPctOfBigEnough - h.percentOfScreen;
  const heightBelowMin = h.bigEnoughScreen - heightOuter;
    
  const w_  = 
    widthOuter >= w.bigEnoughScreen ? 
      w.percentOfScreen * widthOuter :
      widthOuter + (widthBelowMin * widthRatioDelta) ;
  const h_ = 
    heightOuter >= h.bigEnoughScreen ? 
      h.percentOfScreen * heightOuter :
      heightOuter + (heightBelowMin * heightRatioDelta) ;
  const final = {
    w: w_,
    h: h_,
    testKeys: {
      input,
      w,
      h,
      widthRatioDelta,
      widthBelowMin,
      heightRatioDelta,
      heightBelowMin,
    }
  };
  console.log('@@@@@@@ final',final);
  return final;
};


const calcDimensions = state => {
  const {
    cssWidthOuter,
    cssHeightOuter,
    cssWidthControls,
    cssHeightFooter,
    cssHeightSelectors,
  } = state;

  const cssDivOuter = {
    width: cssWidthOuter,
    height: cssHeightOuter,
  };
  const cssDivGraph = {
    width: cssWidthOuter - cssWidthControls,
    height: cssHeightOuter - cssHeightFooter,
  };
  const cssDivControls = {
    width: cssWidthControls,
    height: cssHeightOuter - cssHeightFooter,
  };
  const cssDivFooter = {
    width: cssWidthOuter,
    height: cssHeightFooter,
  };
  const cssDivSelectors = {
    width: cssWidthOuter,
    height: cssHeightSelectors,
  };
  const cssCanvasWidth  = cssDivGraph.width;
  const cssCanvasHeight = cssDivGraph.height;

  return {
    cssDivOuter,
    cssDivGraph,
    cssDivControls,
    cssDivFooter,
    cssDivSelectors,
    cssCanvasHeight,
    cssCanvasWidth,
  };
};

module.exports = {
  calcMinimumWindowDimensions,
  calcScreenType,
  calcProportionalDimensions,
  calcDimensions,
};