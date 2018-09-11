'use strict';

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
  var win = input.win,
      state = input.state,
      reduceCanvasHeightBy = input.reduceCanvasHeightBy;

  if (!win) return { canvasWidth: 0, canvasHeight: 0 };
  if (!win.screen) return { canvasWidth: 0, canvasHeight: 0 };
  if (!win.screen.availWidth || !win.screen.availHeight || !win.innerWidth || !win.innerHeight) {
    return { canvasWidth: 0, canvasHeight: 0 };
  }
  var controlsCss = {
    heightAtTop: 40,
    marginH: 60, // this is double, since the graph is centered
    marginTop: state.cssMarginTop + state.cssGraphMarginTop // former is margin of entire contain, latter is for graph itself
  };
  var wRaw = Math.min(win.screen.availWidth, win.innerWidth);
  var hRaw = Math.min(win.screen.availHeight, win.innerHeight);
  var wAvailable = wRaw - (wRaw >= state.cssLayerSelectorMediaBreak ? controlsCss.marginH : 0);
  var hAvailable = hRaw - (wRaw >= state.cssLayerSelectorMediaBreak ? 0 : controlsCss.heightAtTop) - controlsCss.marginTop;
  var screenType = calcScreenType(wRaw, hRaw).type;
  var idealRatio = 1.618; // golden mean!
  var canvasWidth = Math.floor(0.97 * wAvailable);
  var canvasHeightRaw = screenType === 'phoneP' ? hRaw : screenType === 'phoneL' ? Math.floor(canvasWidth / idealRatio) : screenType === 'tabletL' ? hAvailable : screenType === 'tabletP' ? wRaw : hAvailable;
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
      win = input.win,
      canvasHeight = input.canvasHeight,
      canvasWidth = input.canvasWidth;


  var isNarrowScreen = win.screen.availWidth < state.cssLayerSelectorMediaBreak || win.innerWidth < state.cssLayerSelectorMediaBreak;
  console.log('isNarrowScreen', isNarrowScreen);
  var cssControlHeight = isNarrowScreen ? 25 : canvasHeight;

  var selectorsHeight = state.controlInFocus === 'preSets' ? state.cssPreSetSelectorsHeight : state.controlInFocus === 'layers' ? state.cssLayerSelectorsHeight : 0;

  var cssSelectorOuterScrollingContainer = {};
  if (!isNarrowScreen) {
    cssSelectorOuterScrollingContainer.height = selectorsHeight;
  }

  var cssGraphStabilizer = { // same dimensions as graph, so hide/show graph doesn't blink
    height: canvasHeight,
    width: canvasWidth
  };
  if (isNarrowScreen) {
    cssGraphStabilizer.marginTop = 50;
  }
  var totalHeight = canvasHeight + state.cssMarginTop + selectorsHeight;

  var cssGraphFlexInner = {
    minHeight: totalHeight,
    display: 'block',
    maxWidth: '100vw',
    maxHeight: '100vh'
  };
  var cssGraphFlexOuter = { // outermost div for the entire component
    zIndex: 999,
    marginTop: state.cssGraphMarginTop,
    minHeight: totalHeight
  };

  return {
    cssControlHeight: cssControlHeight,
    cssSelectorOuterScrollingContainer: cssSelectorOuterScrollingContainer,
    cssGraphFlexInner: cssGraphFlexInner,
    cssGraphFlexOuter: cssGraphFlexOuter,
    cssGraphStabilizer: cssGraphStabilizer
  };
};

var calcDimensions = function calcDimensions(state) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

  // this runs on mount, on window resize, and when opening and closing selectors
  var reduceCanvasHeightBy = state.controlInFocus !== 'preSets' ? 0 : !win.screen ? 0 : !win.screen.availHeight ? 0 : Math.min(0.3 * win.screen.availHeight, 400);

  var _calcCanvasDimensions = calcCanvasDimensions({
    state: state,
    win: win,
    reduceCanvasHeightBy: reduceCanvasHeightBy
  }),
      canvasHeight = _calcCanvasDimensions.canvasHeight,
      canvasWidth = _calcCanvasDimensions.canvasWidth;

  var graphContainerDimensions = calcGraphContainerDimensions({
    state: state,
    win: win,
    canvasHeight: canvasHeight,
    canvasWidth: canvasWidth });

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