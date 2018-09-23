'use strict';

var _require = require('conjunction-junction'),
    isPrimitiveNumber = _require.isPrimitiveNumber,
    isObjectLiteral = _require.isObjectLiteral;

var calcScreenType = function calcScreenType(w, h) {
  var phoneP_minW = 0;
  var phoneP_maxW = 500;
  var phoneP_minH = 0;
  var phoneP_maxH = 850;
  var phoneL_minW = 400;
  var phoneL_maxW = 850;
  var phoneL_minH = 300;
  var phoneL_maxH = 850;
  var tabletP_minW = 450;
  var tabletP_maxW = 1100;
  var tabletP_minH = 800;
  var tabletP_maxH = 1100;
  var tabletL_minW = 800;
  var tabletL_maxW = 1100;
  var tabletL_minH = 650;
  var tabletL_maxH = 1100;
  var desktopL_minW = 1100;
  var desktopL_minH = 800;
  var heightRanges = [];
  var widthRanges = [];

  if (h >= phoneP_minH && h <= phoneP_maxH && h >= w) heightRanges.push('phoneP');
  if (h >= phoneL_minH && h <= phoneL_maxH && w >= h) heightRanges.push('phoneL');
  if (h >= tabletL_minH && h <= tabletL_maxH && w >= h) heightRanges.push('tabletL');
  if (h >= tabletP_minH && h <= tabletP_maxH && h >= w) heightRanges.push('tabletP');
  if (h >= desktopL_minH && w >= h) heightRanges.push('desktop');

  if (w >= phoneP_minW && w <= phoneP_maxW && h >= w) widthRanges.push('phoneP');
  if (w >= phoneL_minW && w <= phoneL_maxW && w >= h) widthRanges.push('phoneL');
  if (w >= tabletL_minW && w <= tabletL_maxW && w >= h) widthRanges.push('tabletL');
  if (w >= tabletP_minW && w <= tabletP_maxW && h >= w) widthRanges.push('tabletP');
  if (w >= desktopL_minW && w >= h) widthRanges.push('desktop');

  // types are in descending order of optimization. I.e. desktop is most optimized, so use it if we can.
  var types = ['phoneP', 'phoneL', 'tabletP', 'tabletL', 'desktop'];
  var type = 'phoneP'; // default
  types.forEach(function (t) {
    if (heightRanges.includes(t) && widthRanges.includes(t)) {
      type = t;
    }
  });
  return {
    type: type,
    testKeys: {
      heightRanges: heightRanges,
      widthRanges: widthRanges
    }
  };
};

var calcMinimumWindowDimensions = function calcMinimumWindowDimensions(win) {
  var availHeight = !win.screen ? 0 : !isPrimitiveNumber(win.screen.availHeight) ? 0 : win.screen.availHeight;
  var availWidth = !win.screen ? 0 : !win.screen.availWidth ? 0 : win.screen.availWidth;
  var heightLowestCommon = !isPrimitiveNumber(win.innerHeight) ? availHeight : Math.min(win.innerHeight, availHeight);
  var widthLowestCommon = !isPrimitiveNumber(win.innerWidth) ? availWidth : Math.min(win.innerWidth, availWidth);
  return {
    cssWidthOuter: widthLowestCommon,
    cssHeightOuter: heightLowestCommon
  };
};

var calcProportionalDimensions = function calcProportionalDimensions(input) {
  var width = input.width,
      height = input.height,
      cssWidthOuter = input.cssWidthOuter,
      cssHeightOuter = input.cssHeightOuter;


  var widthOuter = isPrimitiveNumber(cssWidthOuter) ? cssWidthOuter : 100;
  var heightOuter = isPrimitiveNumber(cssHeightOuter) ? cssHeightOuter : 100;

  var w = isObjectLiteral(width) ? width : {};
  w.bigEnoughScreen = isPrimitiveNumber(w.bigEnoughScreen) ? w.bigEnoughScreen : 1000;
  w.percentOfScreen = isPrimitiveNumber(w.percentOfScreen) ? w.percentOfScreen : 1;
  w.maxPctOfBigEnough = isPrimitiveNumber(w.maxPctOfBigEnough) ? w.maxPctOfBigEnough : 1;
  var h = isObjectLiteral(height) ? height : {};
  h.bigEnoughScreen = isPrimitiveNumber(h.bigEnoughScreen) ? h.bigEnoughScreen : 1000;
  h.percentOfScreen = isPrimitiveNumber(h.percentOfScreen) ? h.percentOfScreen : 1;
  h.maxPctOfBigEnough = isPrimitiveNumber(h.maxPctOfBigEnough) ? h.maxPctOfBigEnough : 1;

  var widthRatioDelta = w.maxPctOfBigEnough - w.percentOfScreen;
  var widthBelowMin = w.bigEnoughScreen - widthOuter;

  var heightRatioDelta = h.maxPctOfBigEnough - h.percentOfScreen;
  var heightBelowMin = h.bigEnoughScreen - heightOuter;

  var w_ = widthOuter >= w.bigEnoughScreen ? w.percentOfScreen * widthOuter : widthOuter + widthBelowMin * widthRatioDelta;
  var h_ = heightOuter >= h.bigEnoughScreen ? h.percentOfScreen * heightOuter : heightOuter + heightBelowMin * heightRatioDelta;
  var final = {
    w: w_,
    h: h_,
    testKeys: {
      input: input,
      w: w,
      h: h,
      widthRatioDelta: widthRatioDelta,
      widthBelowMin: widthBelowMin,
      heightRatioDelta: heightRatioDelta,
      heightBelowMin: heightBelowMin
    }
  };
  return final;
};

var calcDimensions = function calcDimensions(state) {
  var cssWidthOuter = state.cssWidthOuter,
      cssHeightOuter = state.cssHeightOuter,
      cssWidthControls = state.cssWidthControls,
      cssHeightFooter = state.cssHeightFooter,
      cssHeightSelectors = state.cssHeightSelectors;


  var cssDivOuter = {
    width: cssWidthOuter,
    height: cssHeightOuter
  };
  var cssDivGraph = {
    width: cssWidthOuter - cssWidthControls,
    height: cssHeightOuter - cssHeightFooter
  };
  var cssDivControls = {
    width: cssWidthControls,
    height: cssHeightOuter - cssHeightFooter
  };
  var cssDivFooter = {
    width: cssWidthOuter,
    height: cssHeightFooter
  };
  var cssDivSelectors = {
    width: cssWidthOuter,
    height: cssHeightSelectors
  };
  var cssCanvasHeight = cssDivGraph.height;
  var cssCanvasWidth = cssDivGraph.width;

  return {
    cssDivOuter: cssDivOuter,
    cssDivGraph: cssDivGraph,
    cssDivControls: cssDivControls,
    cssDivFooter: cssDivFooter,
    cssDivSelectors: cssDivSelectors,
    cssCanvasHeight: cssCanvasHeight,
    cssCanvasWidth: cssCanvasWidth
  };
};

module.exports = {
  calcMinimumWindowDimensions: calcMinimumWindowDimensions,
  calcScreenType: calcScreenType,
  calcProportionalDimensions: calcProportionalDimensions,
  calcDimensions: calcDimensions
};