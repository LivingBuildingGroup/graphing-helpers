'use strict';

var _require = require('conjunction-junction'),
    isPrimitiveNumber = _require.isPrimitiveNumber;

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

var calcCanvasDimensions = function calcCanvasDimensions(input) {
  var state = input.state,
      widthToUse = input.widthToUse,
      heightToUse = input.heightToUse,
      reduceCanvasHeightBy = input.reduceCanvasHeightBy;
  // validate

  var defaultReturn = { canvasWidth: 0, canvasHeight: 0 };
  if (!widthToUse || !heightToUse) return defaultReturn;
  // validated
  var controlsCss = {
    heightAtTop: 40,
    marginH: 60, // this is double, since the graph is centered
    marginTop: state.cssMarginTop + state.cssGraphMarginTop // former is margin of entire contain, latter is for graph itself
  };
  var wAvailable = widthToUse - (widthToUse >= state.cssLayerSelectorMediaBreak ? controlsCss.marginH : 0);
  var hAvailable = heightToUse - (widthToUse >= state.cssLayerSelectorMediaBreak ? 0 : controlsCss.heightAtTop) - controlsCss.marginTop;
  var screenType = calcScreenType(widthToUse, heightToUse).type;
  var idealRatio = 1.618; // golden mean!
  var canvasWidth = Math.floor(0.97 * wAvailable);
  var canvasHeightRaw = screenType === 'phoneP' ? heightToUse : screenType === 'phoneL' ? Math.floor(canvasWidth / idealRatio) : screenType === 'tabletL' ? hAvailable : screenType === 'tabletP' ? widthToUse : hAvailable;
  var canvasHeight = canvasHeightRaw - reduceCanvasHeightBy;
  return {
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    testKeys: {
      screenType: screenType,
      canvasHeightRaw: canvasHeightRaw,
      wAvailable: wAvailable,
      hAvailable: hAvailable
    }
  };
};

var calcGraphContainerDimensions = function calcGraphContainerDimensions(input) {
  var state = input.state,
      widthToUse = input.widthToUse,
      heightToUse = input.heightToUse,
      canvasHeight = input.canvasHeight,
      canvasWidth = input.canvasWidth;


  var isNarrowScreen = widthToUse < state.cssLayerSelectorMediaBreak;
  console.log('isNarrowScreen', isNarrowScreen);

  var selectorsHeight = state.selectorsInFocus === 'preSets' ? state.cssPreSetSelectorsHeight : state.selectorsInFocus === 'layers' ? state.cssLayerSelectorsHeight : 0;

  var cssSelectorOuterScrollingContainer = {};
  if (!isNarrowScreen) {
    cssSelectorOuterScrollingContainer.maxHeight = selectorsHeight;
  }

  var cssGraphStabilizer = { // same dimensions as graph, so hide/show graph doesn't blink
    height: canvasHeight,
    width: canvasWidth
  };
  if (isNarrowScreen) {
    cssGraphStabilizer.marginTop = 50;
  }

  var cssGraphFlex = {
    display: 'block',
    width: widthToUse,
    maxHeight: heightToUse
  };

  return {
    cssSelectorOuterScrollingContainer: cssSelectorOuterScrollingContainer,
    cssGraphFlex: cssGraphFlex,
    cssGraphStabilizer: cssGraphStabilizer
  };
};

var calcDimensions = function calcDimensions(state) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

  // this runs on mount, on window resize, and when opening and closing selectors
  // if preSets are in focus, reduce the height by 400px or 30% of the screen height
  var availHeight = !win.screen ? 0 : !isPrimitiveNumber(win.screen.availHeight) ? 0 : win.screen.availHeight;
  var availWidth = !win.screen ? 0 : !win.screen.availWidth ? 0 : win.screen.availWidth;
  var heightToUse = !isPrimitiveNumber(win.innerHeight) ? availHeight : Math.min(win.innerHeight, availHeight);
  var widthToUse = !isPrimitiveNumber(win.innerWidth) ? availWidth : Math.min(win.innerWidth, availWidth);

  var reduceCanvasHeightBy = state.selectorsInFocus !== 'preSets' ? 50 : Math.min(0.3 * heightToUse, 400);

  var _calcCanvasDimensions = calcCanvasDimensions({
    state: state,
    widthToUse: widthToUse,
    heightToUse: heightToUse,
    reduceCanvasHeightBy: reduceCanvasHeightBy
  }),
      canvasHeight = _calcCanvasDimensions.canvasHeight,
      canvasWidth = _calcCanvasDimensions.canvasWidth;

  var graphContainerDimensions = calcGraphContainerDimensions({
    state: state,
    widthToUse: widthToUse,
    heightToUse: heightToUse,
    canvasHeight: canvasHeight,
    canvasWidth: canvasWidth
  });

  return Object.assign({}, graphContainerDimensions, {
    cssCanvasHeight: canvasHeight,
    cssCanvasWidth: canvasWidth,
    testKeys: {
      reduceCanvasHeightBy: reduceCanvasHeightBy
    }
  });
};

module.exports = {
  calcScreenType: calcScreenType,
  calcCanvasDimensions: calcCanvasDimensions,
  calcGraphContainerDimensions: calcGraphContainerDimensions,
  calcDimensions: calcDimensions
};