'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('conjunction-junction'),
    isPrimitiveNumber = _require.isPrimitiveNumber,
    isObjectLiteral = _require.isObjectLiteral,
    immutableArrayInsert = _require.immutableArrayInsert,
    convertCcToSpace = _require.convertCcToSpace;

var alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

var indexAbbrev = 0;
var indexLabel = 1;
var indexUnit = 2;

// @@@@@@@@@@@@@@@ DATA @@@@@@@@@@@@@@@

var parseDataArraysByKeys = function parseDataArraysByKeys(arrayOfDataObjects, arrayOfKeys) {
  if (!Array.isArray(arrayOfDataObjects)) return [[]];
  if (!Array.isArray(arrayOfKeys)) return [[]];
  var dataArrays = arrayOfKeys.map(function (key) {
    return arrayOfDataObjects.map(function (k) {
      return k[key];
    });
  });
  return dataArrays;
};

var parseLabelsByKeys = function parseLabelsByKeys(legendObject, arrayOfKeys) {
  var dataLabelArray = arrayOfKeys.map(function (key) {
    var label = typeof legendObject[key] === 'string' ? legendObject[key] : !Array.isArray(legendObject[key]) ? key : typeof legendObject[key][indexLabel] === 'string' ? legendObject[key][indexLabel] : key;
    return label;
  });
  return dataLabelArray;
};

var parseYAxisByKeys = function parseYAxisByKeys(legendObject, arrayOfKeys) {
  var axesUsed = [];
  var yAxisIdArray = [];
  var yAxisArray = arrayOfKeys.map(function (key, i) {
    var yAxisLabel = typeof legendObject[key] === 'string' ? 'units' : !Array.isArray(legendObject[key]) ? 'units' : typeof legendObject[key][indexUnit] === 'string' ? legendObject[key][indexUnit] : 'units';
    var axisIndex = axesUsed.findIndex(function (a) {
      return a === yAxisLabel;
    });
    if (axisIndex < 0) {
      yAxisIdArray[i] = alpha[axesUsed.length];
      axesUsed.push(yAxisLabel);
    } else {
      yAxisIdArray[i] = alpha[axisIndex];
    }
    return yAxisLabel;
  });
  return {
    yAxisArray: yAxisArray,
    yAxisIdArray: yAxisIdArray
  };
};

var parseDataType1To0 = function parseDataType1To0(arrayOfDataObjects, legendObject, arrayOfKeys) {
  if (!Array.isArray(arrayOfDataObjects) || !Array.isArray(arrayOfKeys) || !isObjectLiteral(legendObject)) {
    return {
      dataArraysRaw: [[]],
      dataLabelArray: [],
      yAxisArray: [],
      yAxisIdArray: []
    };
  }

  var dataArraysRaw = parseDataArraysByKeys(arrayOfDataObjects, arrayOfKeys);
  var dataLabelArray = parseLabelsByKeys(legendObject, arrayOfKeys);

  var _parseYAxisByKeys = parseYAxisByKeys(legendObject, arrayOfKeys),
      yAxisArray = _parseYAxisByKeys.yAxisArray,
      yAxisIdArray = _parseYAxisByKeys.yAxisIdArray;

  return {
    dataArraysRaw: dataArraysRaw,
    dataLabelArray: dataLabelArray,
    yAxisArray: yAxisArray,
    yAxisIdArray: yAxisIdArray
  };
};

var parseDataType2To0 = function parseDataType2To0(arraysOfDataObjects, arrayOfDataGroups, legendObject, rawArrayOfKeys) {
  if (!Array.isArray(arraysOfDataObjects) || !Array.isArray(arraysOfDataObjects[0]) || !Array.isArray(rawArrayOfKeys) || !Array.isArray(arrayOfDataGroups) || !isObjectLiteral(legendObject)) {
    return {
      dataArraysRaw: [[]],
      dataLabelArray: [],
      yAxisArray: [],
      yAxisIdArray: []
    };
  }

  var dataArraysRaw = [];
  arraysOfDataObjects.forEach(function (group) {
    var subgroup = parseDataArraysByKeys(group, rawArrayOfKeys);
    dataArraysRaw = [].concat(_toConsumableArray(dataArraysRaw), _toConsumableArray(subgroup));
  });

  var rawLabels = parseLabelsByKeys(legendObject, rawArrayOfKeys);
  var dataLabelArray = [];
  var arrayOfKeys = [];
  arrayOfDataGroups.forEach(function (group) {
    var prefixedLabels = rawLabels.map(function (l) {
      return group + ' ' + l;
    });
    var prefixedKeys = rawArrayOfKeys.map(function (k) {
      return '' + group + k;
    });
    dataLabelArray = [].concat(_toConsumableArray(dataLabelArray), _toConsumableArray(prefixedLabels));
    arrayOfKeys = [].concat(_toConsumableArray(arrayOfKeys), _toConsumableArray(prefixedKeys));
  });

  var _parseYAxisByKeys2 = parseYAxisByKeys(legendObject, rawArrayOfKeys),
      yAxisArray = _parseYAxisByKeys2.yAxisArray,
      yAxisIdArray = _parseYAxisByKeys2.yAxisIdArray;

  return {
    dataArraysRaw: dataArraysRaw,
    dataLabelArray: dataLabelArray,
    yAxisArray: yAxisArray,
    yAxisIdArray: yAxisIdArray,
    arrayOfKeys: arrayOfKeys
  };
};

var parseDataType2To1 = function parseDataType2To1(arraysOfDataObjects, arrayOfDataGroups, legendObject, rawArrayOfKeys) {
  if (!Array.isArray(arraysOfDataObjects) || !Array.isArray(arrayOfDataGroups)) {
    return {
      arrayOfDataObjects: [],
      dataLabelArray: [],
      message: 'invalid data types'
    };
  }

  if (arrayOfDataGroups.length !== arraysOfDataObjects.length) {
    return {
      arrayOfDataObjects: [],
      dataLabelArray: [],
      message: 'we found ' + arrayOfDataGroups.length + ' labels and ' + arraysOfDataObjects.length + ' arrays.'
    };
  }

  var indexOfLongestArray = 0;
  var longestArrayLength = 0;
  var arrErr = false;
  arraysOfDataObjects.forEach(function (arr, i) {
    if (Array.isArray(arr)) {
      if (arr.length > longestArrayLength) {
        longestArrayLength = arr.length;
        indexOfLongestArray = i;
      }
    } else {
      arrErr = true; // edit to send a message
    }
  });

  if (arrErr) {
    return {
      arrayOfDataObjects: [],
      dataLabelArray: [],
      message: 'expected a subarray, but found none'
    };
  }

  var longestArray = arraysOfDataObjects[indexOfLongestArray];

  // validated, all arrays are present, and 1 label per array
  var arrayOfDataObjects = longestArray.map(function (x) {
    return {};
  });

  // return new object with all keys prefixed
  arraysOfDataObjects.forEach(function (group, i) {
    var prefix = arrayOfDataGroups[i];
    group.forEach(function (innerObject, pt) {
      for (var key in innerObject) {
        // the double underscore is intentional
        // we might want to un-prefix later
        arrayOfDataObjects[pt][prefix + '__' + key] = innerObject[key];
      }
    });
  });

  // const dataLabelArray = [];
  return {
    arrayOfDataObjects: arrayOfDataObjects,
    // dataLabelArray,
    indexOfLongestArray: indexOfLongestArray,
    longestArrayLength: longestArrayLength
  };
};

var calcDataLength = function calcDataLength(dataArraysRaw, start, end) {
  var oneDataset = !Array.isArray(dataArraysRaw) ? null : !Array.isArray(dataArraysRaw[0]) ? null : dataArraysRaw[0];
  if (!oneDataset) return {
    first: 0,
    last: 0,
    dataLength: 0
  };
  var same = {
    first: 0,
    last: oneDataset.length - 1,
    dataLength: oneDataset.length
  };
  if (!isPrimitiveNumber(start) || !isPrimitiveNumber(end)) return same;
  var first = start < 0 ? 0 : start;
  var last = end > oneDataset.length - 1 ? oneDataset.length - 1 : end;
  if (first >= last) return same;
  // should be validated that we have at least 2 datapoints, start before end, within array
  return {
    first: first,
    last: last,
    dataLength: last - first + 1
  };
};

var conformDataLength = function conformDataLength(dataArraysRaw, first, length, pointsToAdd) {
  // assume 
  var oneDataset = !Array.isArray(dataArraysRaw) ? [] : !Array.isArray(dataArraysRaw[0]) ? [] : dataArraysRaw[0];
  if (oneDataset.length === length) return dataArraysRaw;
  var end = first + length;
  var extension = [];
  if (pointsToAdd) {
    for (var i = 0; i < pointsToAdd; i++) {
      extension.push(null);
    }
  }
  var dataArrays = dataArraysRaw.map(function (a) {
    var newArray = a.slice(first, end);
    if (pointsToAdd) {
      newArray.push.apply(newArray, extension);
    }
    return newArray;
  });
  return dataArrays;
};

var addDataset = function addDataset(input) {
  var graphData = input.graphData,
      data = input.data,
      label = input.label,
      style = input.style,
      styles = input.styles;

  var gd = Object.assign({}, graphData);
  var theLabel = typeof label === 'string' ? label : 'dataset ' + gd.datasets.length;
  var styl = style ? style : styles ? styles.style2 : // make this pick from the array
  gd.datasets[0];
  var newDataset = Object.assign({}, styl, {
    data: data,
    label: theLabel
  });
  var datasets = [].concat(_toConsumableArray(gd.datasets), [newDataset]);
  return Object.assign({}, gd, {
    datasets: datasets
  });
};

var addDatapoints = function addDatapoints(input) {
  var graphData = input.graphData,
      data = input.data,
      label = input.label;

  var newLabel = typeof label === 'string' ? label : 'point' + graphData.labels.length;
  var newLabels = [].concat(_toConsumableArray(graphData.labels), [newLabel]);
  var newDatasets = graphData.datasets.map(function (d, i) {
    var newDat = [].concat(_toConsumableArray(d.data), [data[i]]);
    return Object.assign({}, d, {
      data: newDat
    });
  });
  return Object.assign({}, graphData, {
    datasets: newDatasets,
    labels: newLabels
  });
};

var editDatapoint = function editDatapoint(input) {
  var graphData = input.graphData,
      data = input.data,
      setIndex = input.setIndex,
      index = input.index;

  if (!isPrimitiveNumber(setIndex)) return graphData;
  if (!isPrimitiveNumber(index)) return graphData;

  var dataset = graphData.datasets[setIndex];
  var newData = immutableArrayInsert(index, dataset.data, data);
  var newDataset = Object.assign({}, dataset, {
    data: newData
  });
  var newDatasets = immutableArrayInsert(setIndex, graphData.datasets, newDataset);

  return Object.assign({}, graphData, {
    datasets: newDatasets
  });
};

var createGraphData = function createGraphData(input) {
  // create entirely new data
  var keysSelected = input.keysSelected,
      dataArrays = input.dataArrays,
      dataLabelArray = input.dataLabelArray,
      yAxisArray = input.yAxisArray,
      yAxisIdArray = input.yAxisIdArray,
      stylesArray = input.stylesArray,
      xLabelsArray = input.xLabelsArray,
      xLabelStartAt = input.xLabelStartAt;


  var datasets = keysSelected.map(function (k, i) {
    var units = yAxisArray[i];
    var unitsIndex = yAxisArray.findIndex(function (u) {
      return u === units;
    });
    var yAxisID = unitsIndex < 0 ? yAxisIdArray[0] : yAxisIdArray[unitsIndex];
    return Object.assign({}, stylesArray[i], {
      label: dataLabelArray[i],
      yAxisID: yAxisID,
      data: dataArrays[i]
    });
  });

  var startAt = isPrimitiveNumber(xLabelStartAt) ? xLabelStartAt : 0;
  var labels = Array.isArray(xLabelsArray) ? xLabelsArray : !Array.isArray(dataArrays) ? [] : !Array.isArray(dataArrays[0]) ? [] : dataArrays[0].map(function (x, i) {
    return i + startAt;
  });

  return {
    labels: labels,
    datasets: datasets
  };
};

// @@@@@@@@@@@@@@@ SIZE @@@@@@@@@@@@@@@

var calcCanvasDimensions = function calcCanvasDimensions(input) {
  var win = input.win,
      marginVertical = input.marginVertical,
      marginHorizontal = input.marginHorizontal,
      roomForStyleSelectors = input.roomForStyleSelectors;
  // win is window; make sure it is passed in

  if (!win) return { canvasHeight: 0, canvasWidth: 0 };
  if (!win.innerWidth || !win.innerHeight) {
    return { w: 0, h: 0 };
  }
  var wRaw = win.innerWidth;
  var hRaw = win.innerHeight - roomForStyleSelectors;
  var marginV = isPrimitiveNumber(marginVertical) ? marginVertical : 0;
  var marginH = isPrimitiveNumber(marginHorizontal) ? marginHorizontal : 0;
  var wAvailable = wRaw - marginV;
  var hAvailable = hRaw - marginH;
  var ratio = wAvailable / hAvailable;
  var category = ratio < 0.7 ? 'Pnarrow' : ratio < 1.1 ? 'Pwide' : ratio < 1.6 ? 'Square' : ratio < 2.0 ? 'Ltall' : 'Lshort';
  var idealRatio = 1.618; // golden mean!
  var wIdeal = category === 'Pnarrow' ? 0.95 * wAvailable : category === 'Pwide' ? 0.90 * wAvailable : category === 'Square' ? 0.95 * wAvailable : category === 'Ltall' ? 0.95 * wAvailable : 0.90 * wAvailable;
  var hIdeal = wIdeal / idealRatio;
  var hAdj = hIdeal <= hAvailable ? hIdeal : hAvailable;
  // through this point, we calculate a rectangle for the graph
  // hExtraForLegend increases vertical height to adjust for legend
  // otherwise, legend eats into graph space
  var legendDeviceHeight = hAvailable < 500 ? 180 : // correct for landscape phones
  category === 'Pnarrow' ? 150 : category === 'Pwide' ? 100 : category === 'Square' ? 50 : category === 'Ltall' ? 0 : 0;
  var canvasWidth = hAdj * idealRatio <= wAvailable ? hAdj * idealRatio : wAvailable;
  var canvasHeight = hAdj + legendDeviceHeight;
  return {
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight
  };
};

// @@@@@@@@@@@@@@@@ AXES @@@@@@@@@@@@@@

var calcTicks = function calcTicks(dataLength, idealSpacing) {
  // dataLength should be the data we want to show, i.e. after cropping, if any
  // dataLength should be 1 over ideal, so the final label is an even increment
  var maxTicksLimitDown = Math.floor(dataLength / idealSpacing);
  var lengthRoundDown = maxTicksLimitDown * idealSpacing + 1 > dataLength ? maxTicksLimitDown * idealSpacing + 1 - idealSpacing : maxTicksLimitDown * idealSpacing + 1;

  var pointsToRemove = dataLength - lengthRoundDown;

  var maxTicksLimitUp = pointsToRemove === 0 ? maxTicksLimitDown : maxTicksLimitDown + 1;

  var lengthRoundUp =
  // do not round up, if increments of 1
  idealSpacing === 1 ? maxTicksLimitUp : maxTicksLimitUp * idealSpacing + 1 > dataLength + idealSpacing ? maxTicksLimitUp * idealSpacing + 1 - idealSpacing : maxTicksLimitUp * idealSpacing + 1;

  var pointsToAdd = lengthRoundUp - dataLength;

  return {
    maxTicksLimitDown: maxTicksLimitDown,
    lengthRoundDown: lengthRoundDown,
    pointsToRemove: pointsToRemove,
    maxTicksLimitUp: maxTicksLimitUp,
    lengthRoundUp: lengthRoundUp,
    pointsToAdd: pointsToAdd
  };
};

var defaultXAxis = {
  display: true,
  // type: 'linear',
  gridLines: {
    display: true
  },
  scaleLabel: { // labels the entire scale
    display: true
  },
  pointLabels: {
    fontSize: 12
  },
  ticks: {
    display: true,
    autoSkip: true
    // stepSize: 6, // this is not working
    // min: 0,   // changing these will change the dataset displayed
    // max: 186, // ""
    // maxTicksLimit: 100,
    // suggestedMin: 6,   // not using these
    // suggestedMax: 100, // ""
  }
};

var createXAxis = function createXAxis(options) {
  var label = options.label,
      background = options.background,
      min = options.min,
      max = options.max,
      maxTicksLimit = options.maxTicksLimit;

  var zeroLineColor = background === 'white' ? 'black' : 'white';
  var gridLinesColor = background === 'white' ? 'rgba(68,68,68,0.5)' : 'rgba(119,119,119,0.5)';
  var scaleAndTickColor = background === 'white' ? 'rgb(0, 0, 77)' : 'white';
  var gridLines = Object.assign({}, defaultXAxis.gridLines, {
    zeroLineColor: zeroLineColor,
    color: gridLinesColor,
    axisColor: gridLinesColor
  });
  var ticks = Object.assign({}, defaultXAxis.ticks, {
    fontColor: scaleAndTickColor,
    min: min || 0,
    max: max || 500,
    maxTicksLimit: maxTicksLimit || 100
  });
  var scaleLabel = Object.assign({}, defaultXAxis.scaleLabel, {
    labelString: label,
    fontColor: scaleAndTickColor
  });
  return Object.assign({}, defaultXAxis, {
    gridLines: gridLines,
    ticks: ticks,
    scaleLabel: scaleLabel
  });
};

var defaultYAxis = {
  type: 'linear',
  display: true,
  gridLines: {
    display: true
  },
  pointLabels: {
    fontSize: 12
  },
  ticks: {
    display: true
  },
  scaleLabel: { // labels the entire scale
    display: true
  }
};

var createYAxis = function createYAxis(options) {
  var label = options.label,
      id = options.id,
      position = options.position,
      background = options.background;

  var zeroLineColor = background === 'white' ? 'black' : 'white';
  var gridLinesColor = background === 'white' ? '#444' : '#777';
  var scaleAndTickColor = background === 'white' ? 'rgb(0, 0, 77)' : 'white';
  var gridLines = Object.assign({}, defaultYAxis.gridLines, {
    zeroLineColor: zeroLineColor,
    color: gridLinesColor,
    axisColor: gridLinesColor
  });
  var ticks = Object.assign({}, defaultYAxis.ticks, {
    fontColor: scaleAndTickColor

  });
  var scaleLabel = Object.assign({}, defaultYAxis.scaleLabel, {
    labelString: convertCcToSpace(label),
    fontColor: scaleAndTickColor
  });
  return Object.assign({}, defaultYAxis, {
    id: id || 'A',
    position: position || 'left',
    gridLines: gridLines,
    ticks: ticks,
    scaleLabel: scaleLabel
  });
};

var createYAxesOptions = function createYAxesOptions(options) {
  var labels = options.labels,
      background = options.background;

  var labelsUsed = [];
  var subOptions = [];
  labels.forEach(function (l) {
    var usedIndex = labelsUsed.findIndex(function (u) {
      return u === l;
    });
    var id = void 0,
        position = void 0;
    if (usedIndex < 0) {
      labelsUsed.push(l);
      id = alpha[labelsUsed.length - 1];
      position = labelsUsed.length % 2 === 0 ? 'right' : 'left';
      subOptions.push({
        label: l,
        id: id,
        position: position,
        background: background
      });
    }
  });
  return subOptions;
};

var createYAxes = function createYAxes(arrayOfOptions) {
  var yAxes = arrayOfOptions.map(function (o) {
    return createYAxis(o);
  });
  return yAxes;
};

// @@@@@@@@@@@@@@@ LEGEND @@@@@@@@@@@@@@@


var defaultLegend = {
  display: true,
  position: 'bottom',
  fullWidth: true,
  reverse: false,
  labels: {}
};

var createLegend = function createLegend(options) {
  var position = options.position,
      background = options.background;

  var legendFontColor = background === 'white' ? 'black' : 'white';
  var labels = Object.assign({}, defaultLegend.labels, {
    fontColor: legendFontColor
  });
  return Object.assign({}, defaultLegend, {
    position: position || 'bottom',
    labels: labels
  });
};

// @@@@@@@@@@@@@@@ OPTIONS @@@@@@@@@@@@@@@

var defaultOptions = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  maintainAspectRatio: true
};

var createGraphOptions = function createGraphOptions(options) {
  var labelsY = options.labelsY,
      labelX = options.labelX,
      background = options.background,
      minX = options.minX,
      maxX = options.maxX,
      maxTicksLimitX = options.maxTicksLimitX,
      legendPosition = options.legendPosition;


  var yAxesOptions = {
    labels: labelsY,
    background: background
  };
  var arrayOfYOptions = createYAxesOptions(yAxesOptions);
  var xAxisOptions = {
    label: labelX,
    background: background,
    min: minX,
    max: maxX,
    maxTicksLimit: maxTicksLimitX
  };
  var legendOptions = {
    background: background,
    position: legendPosition
  };
  return Object.assign({}, defaultOptions, {
    legend: createLegend(legendOptions),
    scales: {
      xAxes: [createXAxis(xAxisOptions)],
      yAxes: createYAxes(arrayOfYOptions)
    }
  });
};

// @@@@@@@@@@@@@ REFRESH @@@@@@@@@@@

var checkForGraphRefresh = function checkForGraphRefresh(graphOptions, graphOptionsPrior, background, backgroundPrior, ticksXChanged) {
  var message = 'ok';
  var needRefresh = background !== backgroundPrior;
  if (needRefresh) return { needRefresh: needRefresh, message: 'background changed' };

  if (ticksXChanged) {
    needRefresh = true;
    return { needRefresh: needRefresh, message: 'X-axis tick count changed' };
  }

  var yAxes = !graphOptions ? [] : !graphOptions.scales ? [] : !Array.isArray(graphOptions.scales.yAxes) ? [] : graphOptions.scales.yAxes;
  var yAxesPrior = !graphOptionsPrior ? [] : !graphOptionsPrior.scales ? [] : !Array.isArray(graphOptionsPrior.scales.yAxes) ? [] : graphOptionsPrior.scales.yAxes;

  if (yAxes.length !== yAxesPrior.length) {
    needRefresh = true;
    return { needRefresh: needRefresh, message: 'prior Y axes length: ' + yAxesPrior.length + ', new length: ' + yAxes.length };
  }

  yAxes.forEach(function (a, i) {
    if (!needRefresh) {
      // only check if we don't need a refresh so far
      var oldLabel = !yAxesPrior[i].scaleLabel ? '<no scale label>' : !yAxesPrior[i].scaleLabel.labelString ? '<no label string>' : yAxesPrior[i].scaleLabel.labelString;
      var newLabel = !a.scaleLabel ? '<no scale label>' : !a.scaleLabel.labelString ? '<no label string>' : a.scaleLabel.labelString;
      if (a.id !== yAxesPrior[i].id) {
        needRefresh = true;
        message = 'id mismatch at index ' + i + ' (old: ' + yAxesPrior[i].id + ', new: ' + a.id + ')';
      } else if (oldLabel !== newLabel) {
        needRefresh = true;
        message = 'label mismatch at index ' + i + ' (old: ' + oldLabel + ', new: ' + newLabel + ')';
      }
    }
  });
  return { needRefresh: needRefresh, message: message };
};

// @@@@@@@@@@@@@ FULL GRAPH @@@@@@@@@@@

var createGraph = function createGraph(input) {
  var measurements = input.measurements,
      legendObject = input.legendObject,
      keysSelected = input.keysSelected,
      idealXTickSpacing = input.idealXTickSpacing,
      idealXTickSpacingPrior = input.idealXTickSpacingPrior,
      labelX = input.labelX,
      background = input.background,
      startX = input.startX,
      endX = input.endX,
      legendPosition = input.legendPosition,
      stylesArray = input.stylesArray,
      graphOptionsPrior = input.graphOptionsPrior,
      backgroundPrior = input.backgroundPrior,
      xLabelKey = input.xLabelKey,
      xLabelStartAt = input.xLabelStartAt;

  var _parseDataType1To = parseDataType1To0(measurements, legendObject, keysSelected),
      dataArraysRaw = _parseDataType1To.dataArraysRaw,
      dataLabelArray = _parseDataType1To.dataLabelArray,
      yAxisArray = _parseDataType1To.yAxisArray,
      yAxisIdArray = _parseDataType1To.yAxisIdArray;

  var _calcDataLength = calcDataLength(dataArraysRaw, startX, endX),
      first = _calcDataLength.first,
      dataLength = _calcDataLength.dataLength;

  var _calcTicks = calcTicks(dataLength, idealXTickSpacing),
      maxTicksLimitDown = _calcTicks.maxTicksLimitDown,
      lengthRoundDown = _calcTicks.lengthRoundDown,
      pointsToRemove = _calcTicks.pointsToRemove,
      maxTicksLimitUp = _calcTicks.maxTicksLimitUp,
      lengthRoundUp = _calcTicks.lengthRoundUp,
      pointsToAdd = _calcTicks.pointsToAdd;

  var dataArrays = conformDataLength(dataArraysRaw, first, lengthRoundUp, pointsToAdd);

  var optionsInput = {
    labelsY: yAxisArray,
    labelX: labelX,
    background: background,
    minX: first,
    maxX: lengthRoundUp + 1,
    maxTicksLimitX: maxTicksLimitUp,
    legendPosition: legendPosition
  };

  var graphOptions = createGraphOptions(optionsInput);

  var ticksXChanged = idealXTickSpacing !== idealXTickSpacingPrior ? true : false;

  var _checkForGraphRefresh = checkForGraphRefresh(graphOptions, graphOptionsPrior, background, backgroundPrior, ticksXChanged),
      needRefresh = _checkForGraphRefresh.needRefresh,
      message = _checkForGraphRefresh.message;

  var xLabelsArray = xLabelKey ? parseDataArraysByKeys(measurements, [xLabelKey])[0] : null;
  console.log('xLabelKey', xLabelKey);
  console.log('xLabelsArray', xLabelsArray);

  var graphData = createGraphData({
    keysSelected: keysSelected,
    dataArrays: dataArrays,
    dataLabelArray: dataLabelArray,
    yAxisArray: yAxisArray,
    yAxisIdArray: yAxisIdArray,
    stylesArray: stylesArray,
    xLabelStartAt: xLabelStartAt,
    xLabelsArray: xLabelsArray
  });

  return {
    // pass first 2 'graph' keys as props to graph
    // i.e. to <Line/> or </Pie>, etc.
    graphData: graphData, // this includes { datasets, labels }, which go directly to graph
    graphOptions: graphOptions,
    // remaining keys NOT passed as props to graph
    ready: true, // rendering control
    needRefresh: needRefresh, // rendering control
    background: background, // regurgitated for ease of returning to statey
    // following 5 arrays are parallel
    keysSelected: keysSelected, // regurgitated for ease of returning to state
    yAxisArray: yAxisArray, // history key
    idealXTickSpacingPrior: idealXTickSpacing, // history key
    testingKeys: {
      refreshMessage: message,
      yAxisIdArray: yAxisIdArray,
      dataArraysRaw: dataArraysRaw,
      dataArrays: dataArrays,
      dataLabelArray: dataLabelArray,
      first: first,
      dataLength: dataLength,
      maxTicksLimitDown: maxTicksLimitDown,
      maxTicksLimitUp: maxTicksLimitUp,
      lengthRoundDown: lengthRoundDown,
      lengthRoundUp: lengthRoundUp,
      pointsToRemove: pointsToRemove,
      pointsToAdd: pointsToAdd,
      ticksXChanged: ticksXChanged
    }
  };
};

module.exports = {
  // data
  parseDataArraysByKeys: parseDataArraysByKeys,
  parseLabelsByKeys: parseLabelsByKeys,
  parseYAxisByKeys: parseYAxisByKeys,
  parseDataType1To0: parseDataType1To0,
  parseDataType2To1: parseDataType2To1,
  parseDataType2To0: parseDataType2To0,
  calcDataLength: calcDataLength,
  conformDataLength: conformDataLength,
  addDataset: addDataset,
  addDatapoints: addDatapoints,
  editDatapoint: editDatapoint,
  createGraphData: createGraphData,
  // size
  calcCanvasDimensions: calcCanvasDimensions,
  // axes
  calcTicks: calcTicks,
  createXAxis: createXAxis,
  createYAxis: createYAxis, // tested via createYAxes
  createYAxesOptions: createYAxesOptions,
  createYAxes: createYAxes,
  // legend
  createLegend: createLegend,
  // options
  createGraphOptions: createGraphOptions,
  checkForGraphRefresh: checkForGraphRefresh,
  createGraph: createGraph
};