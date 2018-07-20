'use strict';

const { isPrimitiveNumber, 
  isObjectLiteral,
  immutableArrayInsert, 
  convertCcToSpace }  = require('conjunction-junction');

const alpha = ['A','B','C','D','E','F','G','H'];

const indexAbbrev = 0;
const indexLabel  = 1;
const indexUnit   = 2;

// @@@@@@@@@@@@@@@ DATA @@@@@@@@@@@@@@@

const parseDataArraysByKeys = (arrayOfDataObjects, arrayOfKeys) => {
  if(!Array.isArray(arrayOfDataObjects)) return [[]];
  if(!Array.isArray(arrayOfKeys)) return [[]];
  const dataArrays = arrayOfKeys.map(key=>{
    return arrayOfDataObjects.map(k=>k[key]);
  });
  return dataArrays;
};

const parseLabelsByKeys = (legendObject, arrayOfKeys) => {
  const dataLabelArray = arrayOfKeys.map(key=>{
    const label = 
      typeof legendObject[key] === 'string' ?
        legendObject[key] : 
        !Array.isArray(legendObject[key]) ? 
          key :
          typeof legendObject[key][indexLabel] === 'string' ?
            legendObject[key][indexLabel] :
            key;
    return label;
  });
  return dataLabelArray;
};

const parseYAxisByKeys = (legendObject, arrayOfKeys) => {
  const axesUsed = [];
  const yAxisIdArray = [];
  const yAxisArray = arrayOfKeys.map((key,i)=>{
    const yAxisLabel = 
      typeof legendObject[key] === 'string' ?
        'units' : 
        !Array.isArray(legendObject[key]) ? 
          'units' :
          typeof legendObject[key][indexUnit] === 'string' ?
            legendObject[key][indexUnit] :
            'units' ;
    const axisIndex = axesUsed.findIndex(a=>a===yAxisLabel);
    if(axisIndex<0){
      yAxisIdArray[i] = alpha[axesUsed.length];
      axesUsed.push(yAxisLabel);
    } else {
      yAxisIdArray[i] = alpha[axisIndex];
    }
    return yAxisLabel;
  });
  return {
    yAxisArray,
    yAxisIdArray,
  };
};

const parseDataType1To0 = (arrayOfDataObjects, legendObject, arrayOfKeys) => {
  if(
    !Array.isArray(arrayOfDataObjects) ||
    !Array.isArray(arrayOfKeys) ||
    !isObjectLiteral(legendObject)
  ) {
    return {
      dataArraysRaw: [[]],
      dataLabelArray:  [],
      yAxisArray:  [],
      yAxisIdArray:[],
    };
  }

  const dataArraysRaw = parseDataArraysByKeys(arrayOfDataObjects, arrayOfKeys);
  const dataLabelArray = parseLabelsByKeys(legendObject, arrayOfKeys);
  const {
    yAxisArray,
    yAxisIdArray,
  } = parseYAxisByKeys(legendObject, arrayOfKeys);
  return {
    dataArraysRaw,
    dataLabelArray,
    yAxisArray,
    yAxisIdArray,
  };
};

const parseDataType2To0 = (arraysOfDataObjects, arrayOfDataGroups, legendObject, rawArrayOfKeys) => {
  if(
    !Array.isArray(arraysOfDataObjects) ||
    !Array.isArray(arraysOfDataObjects[0]) ||
    !Array.isArray(rawArrayOfKeys) ||
    !Array.isArray(arrayOfDataGroups) ||
    !isObjectLiteral(legendObject)
  ) {
    return {
      dataArraysRaw: [[]],
      dataLabelArray:  [],
      yAxisArray:  [],
      yAxisIdArray:[],
    };
  }

  let dataArraysRaw = [];
  arraysOfDataObjects.forEach(group=>{
    const subgroup = parseDataArraysByKeys(group, rawArrayOfKeys);
    dataArraysRaw = [...dataArraysRaw, ...subgroup];
  });

  const rawLabels = parseLabelsByKeys(legendObject, rawArrayOfKeys);
  let dataLabelArray = [];
  let arrayOfKeys = [];
  arrayOfDataGroups.forEach(group=>{
    const prefixedLabels = rawLabels.map(l=>`${group} ${l}`);
    const prefixedKeys   = rawArrayOfKeys.map(k=>`${group}${k}`);
    dataLabelArray  = [...dataLabelArray , ...prefixedLabels];
    arrayOfKeys = [...arrayOfKeys, ...prefixedKeys];
  });

  const {
    yAxisArray,
    yAxisIdArray,
  } = parseYAxisByKeys(legendObject, rawArrayOfKeys);
  return {
    dataArraysRaw,
    dataLabelArray,
    yAxisArray,
    yAxisIdArray,
    arrayOfKeys,
  };
};

const parseDataType2To1 = (arraysOfDataObjects, arrayOfDataGroups, legendObject, rawArrayOfKeys) => {
  if(
    !Array.isArray(arraysOfDataObjects) ||
    !Array.isArray(arrayOfDataGroups)
  ) {
    return {
      arrayOfDataObjects: [],
      dataLabelArray:  [],
      message: 'invalid data types',
    };
  }

  if(arrayOfDataGroups.length !== arraysOfDataObjects.length){
    return {
      arrayOfDataObjects: [],
      dataLabelArray:  [],
      message: `we found ${arrayOfDataGroups.length} labels and ${arraysOfDataObjects.length} arrays.`,
    };
  }

  let indexOfLongestArray = 0;
  let longestArrayLength = 0;
  let arrErr = false;
  arraysOfDataObjects.forEach((arr, i)=>{
    if(Array.isArray(arr)){
      if(arr.length > longestArrayLength){
        longestArrayLength = arr.length;
        indexOfLongestArray = i;
      }
    } else {
      arrErr = true; // edit to send a message
    }
  });

  if(arrErr){
    return {
      arrayOfDataObjects: [],
      dataLabelArray:  [],
      message: 'expected a subarray, but found none',
    };
  }

  const longestArray = arraysOfDataObjects[indexOfLongestArray];

  // validated, all arrays are present, and 1 label per array
  const arrayOfDataObjects = longestArray.map(x=>{
    return {};
  });

    // return new object with all keys prefixed
  arraysOfDataObjects.forEach((group,i)=>{
    const prefix = arrayOfDataGroups[i];
    group.forEach((innerObject,pt)=>{
      for(let key in innerObject){
        // the double underscore is intentional
        // we might want to un-prefix later
        arrayOfDataObjects[pt][`${prefix}__${key}`] = innerObject[key];
      }
    });
  });

  // const dataLabelArray = [];
  return {
    arrayOfDataObjects,
    // dataLabelArray,
    indexOfLongestArray,
    longestArrayLength,
  };
};

const calcDataLength = (dataArraysRaw, start, end) => {
  const oneDataset = !Array.isArray(dataArraysRaw) ? null :
    !Array.isArray(dataArraysRaw[0]) ? null :
      dataArraysRaw[0];
  if(!oneDataset) return {
    first: 0,
    last: 0,
    dataLength: 0,
  };
  const same = {
    first: 0,
    last: oneDataset.length - 1,
    dataLength: oneDataset.length,
  };
  if( !isPrimitiveNumber(start) || !isPrimitiveNumber(end)) return same;
  const first = start < 0 ? 0 : start;
  const last = end > oneDataset.length-1 ? oneDataset.length-1 : end;
  if( first >= last ) return same;
  // should be validated that we have at least 2 datapoints, start before end, within array
  return {
    first,
    last,
    dataLength: last - first + 1,
  };
};

const conformDataLength = (dataArraysRaw, first, length, pointsToAdd) => {
  // assume 
  const oneDataset = !Array.isArray(dataArraysRaw) ? [] :
    !Array.isArray(dataArraysRaw[0]) ? [] :
      dataArraysRaw[0];
  if(oneDataset.length === length) return dataArraysRaw;
  const end = first + length;
  const extension = [];
  if(pointsToAdd){
    for(let i=0; i<pointsToAdd; i++){
      extension.push(null);
    }
  }
  const dataArrays = dataArraysRaw.map(a=>{
    const newArray = a.slice(first, end);
    if(pointsToAdd){
      newArray.push(...extension);
    }
    return newArray;
  });
  return dataArrays;
};

const addDataset = input => {
  const { graphData, data, label, style, styles } = input;
  const gd = Object.assign({}, graphData);
  const theLabel = typeof label === 'string' ? label : `dataset ${gd.datasets.length}`;
  const styl =
    style ? style :
      styles ? styles.style2 :// make this pick from the array
        gd.datasets[0] ;
  const newDataset = Object.assign({},
    styl,
    {
      data,
      label: theLabel,
    }
  );
  const datasets = [...gd.datasets, newDataset];
  return Object.assign({},
    gd,
    {
      datasets
    }
  );
};

const addDatapoints = input => {
  const { graphData, data, label } = input;
  const newLabel =
    typeof label === 'string' ? label :
      `point${graphData.labels.length}`;
  const newLabels = [...graphData.labels, newLabel];
  const newDatasets = graphData.datasets.map((d,i)=>{
    const newDat = [...d.data, data[i]];
    return Object.assign({},
      d,
      {
        data: newDat
      }
    );
  });
  return Object.assign({},
    graphData,
    {
      datasets: newDatasets,
      labels: newLabels,
    }
  );
};

const editDatapoint = input => {
  const { graphData, data, setIndex, index } = input;
  if(!isPrimitiveNumber(setIndex)) return graphData;
  if(!isPrimitiveNumber(index)) return graphData;

  const dataset = graphData.datasets[setIndex];
  const newData = immutableArrayInsert(index, dataset.data, data);
  const newDataset = Object.assign({},
    dataset,
    {
      data: newData,
    }
  );
  const newDatasets = immutableArrayInsert(setIndex, graphData.datasets, newDataset);

  return Object.assign({},
    graphData,
    {
      datasets: newDatasets,
    }
  );
};

const createGraphData = input => {
  // create entirely new data
  const { 
    // the following 7 keys are parallel format
    // i.e. arrays of same length, arr1[n] goes with arr2[n]
    keysSelected,
    dataArrays, 
    dataLabelArray, 
    yAxisArray,
    yAxisIdArray,
    stylesArray,
    xLabelsArray,
    // this lone key is just conformed to a number
    xLabelStartAt,
  } = input;


  const datasets = keysSelected.map((k,i)=>{
    const units = yAxisArray[i] ;
    const unitsIndex = yAxisArray.findIndex(u=>u === units);
    const yAxisID = unitsIndex < 0 ?
      yAxisIdArray[0] :
      yAxisIdArray[unitsIndex];
    return Object.assign({},
      stylesArray[i],
      {
        label: dataLabelArray[i],
        yAxisID,
        data: dataArrays[i],
      }
    );
  });

  const startAt = isPrimitiveNumber(xLabelStartAt) ?
    xLabelStartAt : 0 ;
  const labels = 
    Array.isArray(xLabelsArray) ?
      xLabelsArray : 
      !Array.isArray(dataArrays) ?
        [] :
        !Array.isArray(dataArrays[0]) ?
          [] :
          dataArrays[0].map((x,i)=>i+startAt);

  return {
    labels,
    datasets,
  };

};

// @@@@@@@@@@@@@@@ SIZE @@@@@@@@@@@@@@@

const calcCanvasDimensions = input => {
  const {
    win,
    marginVertical,
    marginHorizontal,
    reduceCanvasHeightBy,
  } = input;
  // win is window; make sure it is passed in
  if(!win) return {canvasHeight: 0 ,canvasWidth: 0};
  if(!win.innerWidth || !win.innerHeight){
    return {w: 0 ,h: 0};
  }
  const wRaw = win.innerWidth;
  const hRaw = win.innerHeight - reduceCanvasHeightBy;
  const marginV = isPrimitiveNumber(marginVertical) ? marginVertical : 0 ;
  const marginH = isPrimitiveNumber(marginHorizontal) ? marginHorizontal : 0 ;
  const wAvailable = wRaw - marginV;
  const hAvailable = hRaw - marginH;
  const ratio = wAvailable / hAvailable ;
  const category = 
    ratio < 0.7 ? 'Pnarrow' :
      ratio < 1.1 ? 'Pwide'   :
        ratio < 1.6 ? 'Square'  :
          ratio < 2.0 ? 'Ltall'   :
            'Lshort'  ;
  const idealRatio = 1.618; // golden mean!
  const wIdeal = 
    category === 'Pnarrow' ? 0.95 * wAvailable :
      category === 'Pwide'   ? 0.90 * wAvailable :
        category === 'Square'  ? 0.95 * wAvailable :
          category === 'Ltall'   ? 0.95 * wAvailable :
            0.90 * wAvailable ;
  const hIdeal = wIdeal / idealRatio ;    
  const hAdj = hIdeal <= hAvailable ? hIdeal : hAvailable ;
  // through this point, we calculate a rectangle for the graph
  // hExtraForLegend increases vertical height to adjust for legend
  // otherwise, legend eats into graph space
  const legendDeviceHeight =
    hAvailable < 500       ? 180 : // correct for landscape phones
      category === 'Pnarrow' ? 150 :
        category === 'Pwide'   ? 100 :
          category === 'Square'  ?  50 :
            category === 'Ltall'   ?   0 :
              0 ;
  const canvasWidth = 
    (hAdj * idealRatio) <= wAvailable ? 
      hAdj * idealRatio : 
      wAvailable ;               
  const canvasHeight = hAdj + legendDeviceHeight;
  return { 
    canvasWidth, 
    canvasHeight, 
  };
};

// @@@@@@@@@@@@@@@@ AXES @@@@@@@@@@@@@@

const calcTicks = (dataLength, idealSpacing) => {
  // dataLength should be the data we want to show, i.e. after cropping, if any
  // dataLength should be 1 over ideal, so the final label is an even increment
  const maxTicksLimitDown = Math.floor(dataLength/idealSpacing);
  const lengthRoundDown = 
    ((maxTicksLimitDown * idealSpacing) + 1) > dataLength ?
      (maxTicksLimitDown * idealSpacing) + 1 - idealSpacing :
      (maxTicksLimitDown * idealSpacing) + 1 ;

  const pointsToRemove = dataLength - lengthRoundDown;

  const maxTicksLimitUp = pointsToRemove === 0 ?
    maxTicksLimitDown :
    maxTicksLimitDown + 1;

  const lengthRoundUp = 
    // do not round up, if increments of 1
    idealSpacing === 1 ? 
      maxTicksLimitUp : 
      ((maxTicksLimitUp * idealSpacing) + 1) > dataLength + idealSpacing ?
        (maxTicksLimitUp * idealSpacing) + 1 - idealSpacing :
        (maxTicksLimitUp * idealSpacing) + 1 ;

  const pointsToAdd = lengthRoundUp - dataLength;

  return {
    maxTicksLimitDown,
    lengthRoundDown,
    pointsToRemove,
    maxTicksLimitUp,
    lengthRoundUp,
    pointsToAdd,
  };
};

const defaultXAxis = {
  display: true,
  // type: 'linear',
  gridLines: {
    display: true,
  },
  scaleLabel: { // labels the entire scale
    display: true,
  },
  pointLabels :{
    fontSize: 12,
  },
  ticks: {
    display: true,
    autoSkip: true,
    // stepSize: 6, // this is not working
    // min: 0,   // changing these will change the dataset displayed
    // max: 186, // ""
    // maxTicksLimit: 100,
    // suggestedMin: 6,   // not using these
    // suggestedMax: 100, // ""
  }
};

const createXAxis = options => {
  const { label, background, min, max, maxTicksLimit } = options;
  const zeroLineColor = 
    background === 'white' ?
      'black':
      'white';
  const gridLinesColor =
    background === 'white' ?
      'rgba(68,68,68,0.5)':
      'rgba(119,119,119,0.5)';
  const scaleAndTickColor =
    background === 'white' ?
      'rgb(0, 0, 77)':
      'white';
  const gridLines = Object.assign({},
    defaultXAxis.gridLines,
    {
      zeroLineColor,
      color: gridLinesColor,
      axisColor: gridLinesColor,
    }
  );
  const ticks = Object.assign({},
    defaultXAxis.ticks,
    {
      fontColor: scaleAndTickColor,
      min: min || 0,
      max: max || 500,
      maxTicksLimit: maxTicksLimit || 100,
    }
  );
  const scaleLabel = Object.assign({},
    defaultXAxis.scaleLabel,
    {
      labelString: label,
      fontColor: scaleAndTickColor,
    }
  );
  return Object.assign({},
    defaultXAxis,
    {
      gridLines,
      ticks,
      scaleLabel,
    }
  );
};

const defaultYAxis = {
  type: 'linear',
  display: true,
  gridLines: {
    display: true,
  },
  pointLabels :{
    fontSize: 12,
  },
  ticks: {
    display: true,
  },
  scaleLabel: { // labels the entire scale
    display: true,
  },
};

const createYAxis = options => {
  const { label, id, position, background } = options;
  const zeroLineColor = 
    background === 'white' ?
      'black':
      'white';
  const gridLinesColor =
    background === 'white' ?
      'rgba(68,68,68,0.5)':
      'rgba(119,119,119,0.5)';
  const scaleAndTickColor =
    background === 'white' ?
      'rgb(0, 0, 77)':
      'white';
  const gridLines = Object.assign({},
    defaultYAxis.gridLines,
    {
      zeroLineColor,
      color: gridLinesColor,
      axisColor: gridLinesColor,
    }
  );
  const ticks = Object.assign({},
    defaultYAxis.ticks,
    {
      fontColor: scaleAndTickColor,

    }
  );
  const scaleLabel = Object.assign({},
    defaultYAxis.scaleLabel,
    {
      labelString: convertCcToSpace(label),
      fontColor: scaleAndTickColor,
    }
  );
  return Object.assign({},
    defaultYAxis,
    {
      id: id || 'A',
      position: position || 'left',
      gridLines,
      ticks,
      scaleLabel,
    }
  );
};

const createYAxesOptions = options => {
  const { labels, background } = options;
  let labelsUsed = [];
  const subOptions = [];
  labels.forEach(l=>{
    const usedIndex = labelsUsed.findIndex(u=>u===l);
    let id, position;
    if(usedIndex < 0){
      labelsUsed.push(l);
      id = alpha[labelsUsed.length-1];
      position = labelsUsed.length % 2 === 0 ? 'right' : 'left' ;
      subOptions.push({
        label: l,
        id,
        position,
        background,
      });
    }
  });
  return subOptions;
};

const createYAxes = arrayOfOptions => {
  const yAxes = arrayOfOptions.map(o=>{
    return createYAxis(o);
  });
  return yAxes;
};

// @@@@@@@@@@@@@@@ LEGEND @@@@@@@@@@@@@@@


const defaultLegend = {
  display: true,
  position: 'bottom',
  fullWidth: true,
  reverse: false,
  labels: {}  
};

const createLegend = options => {
  const { position, background } = options;
  const legendFontColor = 
    background === 'white' ?
      'black':
      'white';
  const labels = Object.assign({},
    defaultLegend.labels,
    {
      fontColor: legendFontColor,
    }
  );
  return Object.assign({},
    defaultLegend,
    {
      position: position || 'bottom',
      labels,
    }
  );
};

// @@@@@@@@@@@@@@@ OPTIONS @@@@@@@@@@@@@@@

const defaultOptions = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  maintainAspectRatio: true,
};

const createGraphOptions = options => {
  const {
    labelsY, 
    labelX, 
    background, 
    minX, 
    maxX, 
    maxTicksLimitX,
    legendPosition,
  } = options;

  const yAxesOptions = {
    labels: labelsY,
    background,
  };
  const arrayOfYOptions = createYAxesOptions(yAxesOptions);
  const xAxisOptions = {
    label: labelX,
    background,
    min: minX,
    max: maxX,
    maxTicksLimit: maxTicksLimitX,
  };
  const legendOptions = {
    background,
    position: legendPosition,
  };
  return Object.assign({},
    defaultOptions,
    {
      legend: createLegend(legendOptions),
      scales: {
        xAxes: [ createXAxis(xAxisOptions) ],
        yAxes: createYAxes(arrayOfYOptions)
      },
    }
  );
}; 

// @@@@@@@@@@@@@ REFRESH @@@@@@@@@@@

const checkForGraphRefresh = (graphOptions, graphOptionsPrior, background, backgroundPrior, ticksXChanged) => {
  let message = 'ok';
  let needRefresh = background !== backgroundPrior ;
  if(needRefresh) return {needRefresh, message: 'background changed'};

  if(ticksXChanged) {
    needRefresh = true;
    return {needRefresh, message: 'X-axis tick count changed'};
  }

  const yAxes =
    !graphOptions ? [] :
      !graphOptions.scales ? [] :
        !Array.isArray(graphOptions.scales.yAxes) ? [] :
          graphOptions.scales.yAxes ;
  const yAxesPrior =
    !graphOptionsPrior ? [] :
      !graphOptionsPrior.scales ? [] :
        !Array.isArray(graphOptionsPrior.scales.yAxes) ? [] :
          graphOptionsPrior.scales.yAxes ;

  if(yAxes.length !== yAxesPrior.length) {
    needRefresh = true;
    return {needRefresh, message: `prior Y axes length: ${yAxesPrior.length}, new length: ${yAxes.length}`};
  }

  yAxes.forEach((a,i)=>{
    if(!needRefresh){ // only check if we don't need a refresh so far
      const oldLabel =
        !yAxesPrior[i].scaleLabel ? '<no scale label>' :
          !yAxesPrior[i].scaleLabel.labelString ? '<no label string>' :
            yAxesPrior[i].scaleLabel.labelString;
      const newLabel = 
        !a.scaleLabel ? '<no scale label>' :
          !a.scaleLabel.labelString ? '<no label string>' :
            a.scaleLabel.labelString;
      if(a.id !== yAxesPrior[i].id) {
        needRefresh = true;
        message = `id mismatch at index ${i} (old: ${yAxesPrior[i].id}, new: ${a.id})`;
      } else if(oldLabel !== newLabel){
        needRefresh = true;
        message = `label mismatch at index ${i} (old: ${oldLabel}, new: ${newLabel})`;
      }
    }
  });
  return {needRefresh, message };
};

// @@@@@@@@@@@@@ FULL GRAPH @@@@@@@@@@@

const createGraph = input => {

  const {
    measurements,
    legendObject,
    keysSelected,
    idealXTickSpacing,
    idealXTickSpacingPrior,
    labelX,
    background,
    startX,
    endX, 
    legendPosition,
    stylesArray,
    graphOptionsPrior,
    backgroundPrior,
    xLabelKey,
    xLabelStartAt,
  } = input;

  const {
    dataArraysRaw,
    dataLabelArray,
    yAxisArray,
    yAxisIdArray,
  } = parseDataType1To0(
    measurements,
    legendObject,
    keysSelected
  );
  
  const {
    first,
    // last,
    dataLength,
  } = calcDataLength(dataArraysRaw,startX, endX);

  const {
    maxTicksLimitDown, // testing only
    lengthRoundDown,   // testing only
    pointsToRemove,    // testing only
    maxTicksLimitUp,
    lengthRoundUp,
    pointsToAdd,
  } = calcTicks(dataLength, idealXTickSpacing);

  const dataArrays = conformDataLength(
    dataArraysRaw, 
    first, 
    lengthRoundUp, 
    pointsToAdd
  );
  
  const optionsInput = {
    labelsY: yAxisArray,
    labelX, 
    background,
    minX: first,
    maxX: lengthRoundUp + 1, 
    maxTicksLimitX: maxTicksLimitUp,
    legendPosition,
  };
  
  const graphOptions = createGraphOptions(optionsInput);
  
  const ticksXChanged = idealXTickSpacing !== idealXTickSpacingPrior ? true : false ;

  const {needRefresh, message} = checkForGraphRefresh(
    graphOptions, graphOptionsPrior,
    background, backgroundPrior,
    ticksXChanged
  );

  const xLabelsArray = xLabelKey ?
    parseDataArraysByKeys(measurements, [xLabelKey])[0] :
    null ;
  console.log('xLabelKey',xLabelKey);
  console.log('xLabelsArray',xLabelsArray);

  const graphData = createGraphData({
    keysSelected,
    dataArrays,
    dataLabelArray,
    yAxisArray,
    yAxisIdArray,
    stylesArray,
    xLabelStartAt,
    xLabelsArray,
  });

  return{
    // pass first 2 'graph' keys as props to graph
    // i.e. to <Line/> or </Pie>, etc.
    graphData,      // this includes { datasets, labels }, which go directly to graph
    graphOptions,
    // remaining keys NOT passed as props to graph
    ready: true,    // rendering control
    needRefresh,    // rendering control
    background,     // regurgitated for ease of returning to statey
    // following 5 arrays are parallel
    keysSelected,   // regurgitated for ease of returning to state
    yAxisArray,     // history key
    idealXTickSpacingPrior: idealXTickSpacing, // history key
    testingKeys: {
      refreshMessage: message,
      yAxisIdArray,  
      dataArraysRaw,
      dataArrays,
      dataLabelArray,
      first,
      dataLength, 
      maxTicksLimitDown,
      maxTicksLimitUp,
      lengthRoundDown,
      lengthRoundUp,
      pointsToRemove,
      pointsToAdd,
      ticksXChanged,
    }
  };
};

module.exports = { 
  // data
  parseDataArraysByKeys,
  parseLabelsByKeys,
  parseYAxisByKeys,
  parseDataType1To0,
  parseDataType2To1,
  parseDataType2To0,
  calcDataLength,
  conformDataLength,
  addDataset, 
  addDatapoints,
  editDatapoint,
  createGraphData,
  // size
  calcCanvasDimensions,
  // axes
  calcTicks,
  createXAxis,
  createYAxis, // tested via createYAxes
  createYAxesOptions,
  createYAxes,
  // legend
  createLegend,
  // options
  createGraphOptions,
  checkForGraphRefresh,
  createGraph,
};