import { 
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
  // selectors
  createSelectors,
   } from '../helpers/graph';
import { labels } from '../_tests_/labels';

describe('helpers graph', ()=> { 

  it('parseDataArraysByKeys', () => {
    const arrayOfDataObjects = [
      {
        key1: 1,
        key2: 3,
        key3: 5,
        key5: 3.5,
        keyX: 7,
      },
      {
        key1: 15,
        key2: 36,
        key3: 52,
        key5: 3.8,
        keyX: 71,
      },
    ];
    const arrayOfKeys = [
      'key1', 'key3'
    ];
    const expectedResult = [
      [1, 15],
      [5, 52],
    ];
    const result = parseDataArraysByKeys(arrayOfDataObjects, arrayOfKeys);
    expect(result).toEqual(expectedResult);
  });

  it('parseLabelsByKeys no Y-axis keys', () => {
    const arrayOfKeys = [
      'key1', 'key3'
    ];
    const legendObject = { // with no Y-axis units
      key1: 'the first key',
      key2: 'the second key',
      key3: 'banana',
      key4: 'not used',
      key5: 'decimals'
    };
    const expectedResult = [
      'the first key', 'banana',
    ];
    const result = parseLabelsByKeys(legendObject, arrayOfKeys);
    expect(result).toEqual(expectedResult);
  });
  it('parseLabelsByKeys with Y-axis keys', () => {
    const arrayOfKeys = [
      'key1', 'key3'
    ];
    const legendObject = { // with no Y-axis units
      key1: ['the first key' ,'meter'],
      key2: ['the second key','yard' ],
      key3: ['banana'        ,'stick'],
      key4: ['not used'      ,'meter'],
      key5: ['decimals'      ,'meter'],
    };
    const expectedResult = [
      'the first key', 'banana',
    ];
    const result = parseLabelsByKeys(legendObject, arrayOfKeys);
    expect(result).toEqual(expectedResult);
  });

  it('parseYAxisByKeys with no keys', () => {
    const arrayOfKeys = [
      'key1', 'key3'
    ];
    const legendObject = { // with no Y-axis units
      key1: 'the first key',
      key2: 'the second key',
      key3: 'banana',
      key4: 'not used',
      key5: 'decimals'
    };
    const expectedResult = {
      yAxisArray: [
      'units', 'units',
      ],
      yAxisIdArray: [
        'A', 'A'
      ],
    };
    const result = parseYAxisByKeys(legendObject, arrayOfKeys);
    expect(result).toEqual(expectedResult);
  });
  it('parseYAxisByKeys w/ keys', () => {
    const arrayOfKeys = [
      'key1', 'key3', 'key5',
    ];
    const legendObject = { // with no Y-axis units
      key1: ['the first key' ,'meter'],
      key2: ['the second key','yard' ],
      key3: ['banana'        ,'stick'],
      key4: ['not used'      ,'meter'],
      key5: ['decimals'      ,'meter'],
    };
    const expectedResult = {
      yAxisArray: [
        'meter', 'stick', 'meter',
      ],
      yAxisIdArray: [
        'A', 'B', 'A'
      ],
    };
    const result = parseYAxisByKeys(legendObject, arrayOfKeys);
    expect(result).toEqual(expectedResult);
  });

  it('parseDataType1To0', () => {
    const arrayOfDataObjects = [
      {
        key1: 1,
        key2: 3,
        key3: 5,
        key5: 3.5,
        keyX: 7,
      },
      {
        key1: 15,
        key2: 36,
        key3: 52,
        key5: 3.8,
        keyX: 71,
      },
    ];
    const arrayOfKeys = [
      'key1', 'key3'
    ];
    const legendObject = {
      //     label           , Y axis
      key1: ['the first key' , 'lbs'],
      key2: ['the second key', 'ft'],
      key3: ['banana'        , 'cubits'],
      key4: ['not used'      , 'nanometers'],
      key5: ['decimals'      , 'meters'],
    };
    const expectedResult = {
      dataArraysRaw: [
        [1, 15], // test1 key1
        [5, 52], // test1 key3
      ],
      labelArray: [
        'the first key', 'banana',
      ],
      yAxisArray: [
        'lbs', 'cubits',
      ],
      yAxisIdArray: [
        'A', 'B',
      ],
    };
    const result = parseDataType1To0(
      arrayOfDataObjects, 
      legendObject, 
      arrayOfKeys);
    expect(result).toEqual(expectedResult);
  });

  it('parseDataType2To0', () => {
    const arraysOfDataObjects = [
      [ // test 1
        {
          key1: 1,
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15,
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
      ],
      [ // test 7
        {
          key1: 11,
          key2: 31,
          key3: 51,
          key5: 3.51,
          keyX: 71,
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = [
      'test1', 'test7'
    ];
    const rawArrayOfKeys = [
      'key1', 'key3'
    ];
    const legendObject = {
      //     label           , Y axis
      key1: ['the first key' , 'lbs'],
      key2: ['the second key', 'ft'],
      key3: ['banana'        , 'cubits'],
      key4: ['not used'      , 'nanometers'],
      key5: ['decimals'      , 'meters'],
    };
    const expectedResult = {
      dataArraysRaw: [
        [1,   15], // test1 key1
        [5,   52], // test1 key3
        [11, 151], // test7 key1
        [51, 521], // test7 key3
      ],
      labelArray: [
        'test1 the first key', 'test1 banana',
        'test7 the first key', 'test7 banana',
      ],
      yAxisArray: [
        'lbs', 'cubits',
      ],
      yAxisIdArray: [
        'A', 'B',
      ],
      arrayOfKeys: [
        'test1key1', 'test1key3',
        'test7key1', 'test7key3',
      ],
    };
    const result = parseDataType2To0(
      arraysOfDataObjects, 
      arrayOfDataGroups,
      legendObject, 
      rawArrayOfKeys);
    expect(result).toEqual(expectedResult);
  });

  it('parseDataType2To1', () => {
    const arraysOfDataObjects = [
      [ // group 0 = test 1
        // this is longest array
        {
          key1: 1,  // pt 0
          key2: 3,
          key3: 5,
          key5: 3.5,
          keyX: 7,
        },
        {
          key1: 15, // pt 1
          key2: 36,
          key3: 52,
          key5: 3.8,
          keyX: 71,
        },
      ],
      [ // group 1 = test 7
        {
          key1: 11,
          key2: 31,
          key3: 51,
          key5: 3.51,
          keyX: 71,
        },
        {
          key1: 151,
          key2: 361,
          key3: 521,
          key5: 3.81,
          keyX: 711,
        },
      ]
    ];
    const arrayOfDataGroups = [
      'test1', 'test7'
    ];
    const expectedResult = {
      arrayOfDataObjects: [
        {
          test1__key1: 1,
          test1__key2: 3,
          test1__key3: 5,
          test1__key5: 3.5,
          test1__keyX: 7,
  
          test7__key1: 11,
          test7__key2: 31,
          test7__key3: 51,
          test7__key5: 3.51,
          test7__keyX: 71,
        },
        {
          test1__key1: 15,
          test1__key2: 36,
          test1__key3: 52,
          test1__key5: 3.8,
          test1__keyX: 71,
  
          test7__key1: 151,
          test7__key2: 361,
          test7__key3: 521,
          test7__key5: 3.81,
          test7__keyX: 711,
        },
      ],
      // labelArray: [
      //   'test1 the first key', 'test1 banana',
      //   'test7 the first key', 'test7 banana',
      // ],
      indexOfLongestArray: 0,
      longestArrayLength: 2,
    };
    const result = parseDataType2To1(
      arraysOfDataObjects, 
      arrayOfDataGroups);
    expect(result).toEqual(expectedResult);
  });

  it('calcDataLength', ()=>{
    const dataArraysRaw = [
      [1, 15, 'a', 4, 5, 'b', 7, 8],
      [5, 52, 'c', 3, 2, 'd', 9, 0],
    ];
    const start = 2;
    const end = 5;
    const expectedResult = {
      first: 2,
      last: 5,
      dataLength: 4,
    }
    const result = calcDataLength(dataArraysRaw, start, end);
    expect(result).toEqual(expectedResult);
  });

  it('conformDataLength trim either end', ()=>{
    const dataArraysRaw = [
      [1, 15, 'a', 4, 5, 'b', 7, 8],
      [5, 52, 'c', 3, 2, 'd', 9, 0],
    ];
    const start = 2;
    const length = 4;
    const expectedResult = [
      ['a', 4, 5, 'b'],
      ['c', 3, 2, 'd'],
    ];
    const pointsToAdd = undefined;
    const result = conformDataLength(
      dataArraysRaw, 
      start, 
      length,
      pointsToAdd
    );
    expect(result).toEqual(expectedResult);
  });

  it('conformDataLength trim and extend', ()=>{
    const dataArraysRaw = [
      [1, 15, 'a', 4, 5, 'b', 7, 8],
      [5, 52, 'c', 3, 2, 'd', 9, 0],
    ];
    const start = 2;
    const length = 11;
    const expectedResult = [
      ['a', 4, 5, 'b', 7, 8, null, null, null],
      ['c', 3, 2, 'd', 9, 0, null, null, null],
    ];
    const pointsToAdd = 3;
    const result = conformDataLength(
      dataArraysRaw, 
      start, 
      length,
      pointsToAdd
    );
    expect(result).toEqual(expectedResult);
  });
  it('addDataset', ()=> {
    const style = {
      styling: 'stuff',
    }
    const graphData = {
      labels: [ 'point1', 'point2', 'point3' ],
      datasets: [
        {...style,
          data: [
            0.01,
            0.12,
            0.08,
          ],
          label: 'dataset 0',
        },
        {...style,
          data: [
            0.03,
            0.15,
            0.14,
          ],
          label: 'dataset 1',
        },
      ],
    };
    const newData = graphData.datasets[0].data.map(d=>2);
    const expectedResult = {
      labels: [ 'point1', 'point2', 'point3' ],
      datasets: [
        {...style,
          data: [
            0.01,
            0.12,
            0.08,
          ],
          label: 'dataset 0',
        },
        {...style,
          data: [
            0.03,
            0.15,
            0.14,
          ],
          label: 'dataset 1',
        },
        {
          styling: 'stuff',
          data: [
            2,
            2,
            2,
          ],
          label: 'dataset 2',
        },
      ],
    };
    const result = addDataset({
      graphData,
      data: newData,
      style,
    });
    expect(result).toEqual(expectedResult);
  });

  it('addDatapoints', ()=> {
    const style = {
      styling: 'stuff',
    }
    const graphData = {
      labels: [ 'point0', 'point1', 'point2' ],
      datasets: [
        {...style,
          data: [
            0.01,
            0.12,
            0.08,
          ],
          label: 'dataset 0',
        },
        {...style,
          data: [
            0.03,
            0.15,
            0.14,
          ],
          label: 'dataset 1',
        },
      ],
    };
    const newData = [1,2];
    const expectedResult = {
      labels: [ 'point0', 'point1', 'point2', 'point3' ],
      datasets: [
        {...style,
          data: [
            0.01,
            0.12,
            0.08,
            1,
          ],
          label: 'dataset 0',
        },
        {...style,
          data: [
            0.03,
            0.15,
            0.14,
            2,
          ],
          label: 'dataset 1',
        },
      ],
    };
    const result = addDatapoints({
      graphData,
      data: newData,
    });
    expect(result).toEqual(expectedResult);
  });

  it('editDatapoint', ()=> {
    const graphData = {
      labels: [ 'point0', 'point1', 'point2' ],
      datasets: [
        {
          data: [
            0.01,
            0.12,
            0.08,
          ],
          label: 'dataset 0',
        },
        {
          data: [
            0.03,
            0.15,
            0.14,
          ],
          label: 'dataset 1',
        },
      ],
    };
    const expectedResult = {
      labels: [ 'point0', 'point1', 'point2' ],
      datasets: [
        {
          data: [
            0.01,
            0.12,
            0.08,
          ],
          label: 'dataset 0',
        },
        {
          data: [
            0.03,
            0.15,
            99,
          ],
          label: 'dataset 1',
        },
      ],
    };
    const result = editDatapoint({
      graphData,
      data: 99,
      setIndex: 1,
      index: 2
    });
    expect(result).toEqual(expectedResult);
  });

  it('editDatapoint', ()=> {
    const graphData = {
      labels: [ 'point0', 'point1', 'point2' ],
      datasets: [
        {
          data: [
            0.01,
            0.12,
            0.08,
          ],
          label: 'dataset 0',
        },
        {
          data: [
            0.03,
            0.15,
            0.14,
          ],
          label: 'dataset 1',
        },
      ],
    };
    const expectedResult = {
      labels: [ 'point0', 'point1', 'point2' ],
      datasets: [
        {
          data: [
            0.01,
            0.12,
            0.08,
          ],
          label: 'dataset 0',
        },
        {
          data: [
            0.03,
            0.15,
            99,
          ],
          label: 'dataset 1',
        },
      ],
    };
    const result = editDatapoint({
      graphData,
      data: 99,
      setIndex: 1,
      index: 2
    });
    expect(result).toEqual(expectedResult);
  });

  it('createGraphData 1', ()=>{
    const input = {
      keysSelected: ['rain_in', 'rain_gals', 'mins'],
      dataArrays: [ // 3 datasets
        [1, 15],    // each dataset has 2 items in increment
        [5, 52],
        [3, 77],
      ],
      labelArray: [
        'the first key', 'banana', 'time',
      ],
      yAxisArray: [
        'lbs', 'cubits', 'lbs',
      ],
      yAxisIdArray: [
        'A', 'B', 'A',
      ],
      stylesArray: [
        { style1: 'value1' },
        { style2: 'value2' },
        { style3: 'value3' },
      ],
    };
    const expectedResult = {
      labels: [0,1], // 1 per increment
      datasets: [
        {
          style1: 'value1',
          label: 'the first key',
          yAxisID: 'A',
          data: [1, 15],
        },
        {
          style2: 'value2',
          label: 'banana',
          yAxisID: 'B',
          data: [5, 52],
        },
        {
          style3: 'value3',
          label: 'time',
          yAxisID: 'A',
          data: [3, 77],
        },
      ],
    }; 
    const result = createGraphData(input);
    expect(result).toEqual(expectedResult);
  });

  it('createGraphData 1 specific labels', ()=>{
    const input = {
      keysSelected: ['rain_in', 'rain_gals', 'mins'],
      xLabelKey: 'rain_in',
      dataArrays: [ // 3 datasets
        [1, 15],    // each dataset has 2 items in increment
        [5, 52],
        [3, 77],
      ],
      labelArray: [
        'the first key', 'banana', 'time',
      ],
      yAxisArray: [
        'lbs', 'cubits', 'lbs',
      ],
      yAxisIdArray: [
        'A', 'B', 'A',
      ],
      stylesArray: [
        { style1: 'value1' },
        { style2: 'value2' },
        { style3: 'value3' },
      ],
    };
    const expectedResult = {
      labels: [1,15], // 1 per increment
      datasets: [
        {
          style1: 'value1',
          label: 'the first key',
          yAxisID: 'A',
          data: [1, 15],
        },
        {
          style2: 'value2',
          label: 'banana',
          yAxisID: 'B',
          data: [5, 52],
        },
        {
          style3: 'value3',
          label: 'time',
          yAxisID: 'A',
          data: [3, 77],
        },
      ],
    }; 
    const result = createGraphData(input);
    expect(result).toEqual(expectedResult);
  });

  it('calcTicks 33/6', ()=> {
    const dataLength =   33;
    const idealSpacing =  6;
    const expectedResult = {
      maxTicksLimitDown:  5,
      lengthRoundDown:   31, // actual math + 1
      pointsToRemove:     2, 
      maxTicksLimitUp:    6,
      lengthRoundUp:     37, // actual math + 1
      pointsToAdd:        4,
    };
    const result = calcTicks(dataLength, idealSpacing);
    expect(result).toEqual(expectedResult);
  });
  it('calcTicks 77/4', ()=> {
    const dataLength =   77;
    const idealSpacing =  4;
    const expectedResult = {
      maxTicksLimitDown: 19,
      lengthRoundDown:   77, // actual math + 1
      pointsToRemove:     0,
      maxTicksLimitUp:   19,
      lengthRoundUp:     77, // actual math + 1
      pointsToAdd:        0,
    };
    const result = calcTicks(dataLength, idealSpacing);
    expect(result).toEqual(expectedResult);
  });
  it('calcTicks 80/5', ()=> {
    const dataLength =   80;
    const idealSpacing =  5;
    const expectedResult = {
      maxTicksLimitDown: 16,
      lengthRoundDown:   76,
      pointsToRemove:     4, // 0 is actual, but loops through to 5 for a whole step down, then back up by 1 (-5 + 1 = -4, so 4 "remove")
      maxTicksLimitUp:   17,
      lengthRoundUp:     81,
      pointsToAdd:        1,// actual math + 1,
    };
    const result = calcTicks(dataLength, idealSpacing);
    expect(result).toEqual(expectedResult);
  });

  it('createXAxis over white', ()=>{
    const options = {
      label: 'x-axis',
      background: 'white',
      min: 5,
      max: 40,
      maxTicksLimit: 20,
    };
    const expectedResult = {
      display: true,
      gridLines: {
        display: true,
        zeroLineColor: 'black', // calculated
        color: '#444', // calculated
        axisColor: '#444', // calculated
      },
      pointLabels :{
        fontSize: 12,
      },
      ticks: {
        display: true,
        autoSkip: true,
        min: 5, // calculated, def 0
        max: 40, // calculated
        maxTicksLimit: 20, // calculated, def 100
        fontColor: 'rgb(0, 0, 77)', // calculated
      },
      scaleLabel: { // labels the entire scale
        display: true,
        labelString: 'x-axis', // calculated
        fontColor: 'rgb(0, 0, 77)', // calculated
      },
    }; 
    const result = createXAxis(options);
    expect(result).toEqual(expectedResult);
  });
  it('createXAxis over gray with defaults', ()=>{
    const options = {
      label: 'x-axis over gray',
      // background: 'white',
      // min: 5,
      // max: 40,
      // maxTicksLimit: 20,
    };
    const expectedResult = {
      display: true,
      gridLines: {
        display: true,
        zeroLineColor: 'white', // calculated
        color: '#777', // calculated
        axisColor: '#777', // calculated
      },
      pointLabels :{
        fontSize: 12,
      },
      ticks: {
        display: true,
        autoSkip: true,
        min: 0, // calculated, def 0
        max: 500, // calculated
        maxTicksLimit: 100, // calculated, def 100
        fontColor: 'white', // calculated
      },
      scaleLabel: { // labels the entire scale
        display: true,
        labelString: 'x-axis over gray', // calculated
        fontColor: 'white', // calculated
      },
    }; 
    const result = createXAxis(options);
    expect(result).toEqual(expectedResult);
  });

  it('createYAxesOptions', ()=>{
    const options = {
      labels: ['one', 'two'],
      background: 'white',
    }
    const expectedResult = [
      {
        label: 'one',
        id: 'A',
        position: 'left',
        background: 'white',
      },
      {
        label: 'two',
        id: 'B',
        position: 'right',
        background: 'white',
      }
    ]
    const result = createYAxesOptions(options);
    expect(result).toEqual(expectedResult);
  });

  it('createYAxes over white', ()=>{
    const arrayOfOptions = [
      {
        label: 'one',
        id: 'A',
        position: 'left',
        background: 'white',
      },
      {
        label: 'two',
        id: 'B',
        position: 'right',
        background: 'white',
      }
    ];
    const expectedResult = [
      {
        id: 'A', // calculated
        position: 'left', // calculated
        type: 'linear',
        display: true,
        gridLines: {
          display: true,
          zeroLineColor: 'black', // calculated
          color: '#444', // calculated
          axisColor: '#444', // calculated
        },
        pointLabels :{
          fontSize: 12,
        },
        ticks: {
          display: true,
          fontColor: 'rgb(0, 0, 77)', // calculated
        },
        scaleLabel: { // labels the entire scale
          display: true,
          labelString: 'one', // calculated
          fontColor: 'rgb(0, 0, 77)', // calculated
        },
      }, 
      {
        id: 'B', // calculated
        position: 'right', // calculated
        type: 'linear',
        display: true,
        gridLines: {
          display: true,
          zeroLineColor: 'black', // calculated
          color: '#444', // calculated
          axisColor: '#444', // calculated
        },
        pointLabels :{
          fontSize: 12,
        },
        ticks: {
          display: true,
          fontColor: 'rgb(0, 0, 77)', // calculated
        },
        scaleLabel: { // labels the entire scale
          display: true,
          labelString: 'two', // calculated
          fontColor: 'rgb(0, 0, 77)', // calculated
        },
      }
    ]
    const result = createYAxes(arrayOfOptions);
    expect(result).toEqual(expectedResult);
  });
  it('createYAxes over gray', ()=>{
    const arrayOfOptions = [
      {
        label: 'one',
        id: 'A',
        position: 'left',
        // background: 'white',
      },
      {
        label: 'two',
        id: 'B',
        position: 'right',
        // background: 'white',
      }
    ];
    const expectedResult = [
      {
        id: 'A', // calculated
        position: 'left', // calculated
        type: 'linear',
        display: true,
        gridLines: {
          display: true,
          zeroLineColor: 'white', // calculated
          color: '#777', // calculated
          axisColor: '#777', // calculated
        },
        pointLabels :{
          fontSize: 12,
        },
        ticks: {
          display: true,
          fontColor: 'white', // calculated
        },
        scaleLabel: { // labels the entire scale
          display: true,
          labelString: 'one', // calculated
          fontColor: 'white', // calculated
        },
      }, 
      {
        id: 'B', // calculated
        position: 'right', // calculated
        type: 'linear',
        display: true,
        gridLines: {
          display: true,
          zeroLineColor: 'white', // calculated
          color: '#777', // calculated
          axisColor: '#777', // calculated
        },
        pointLabels :{
          fontSize: 12,
        },
        ticks: {
          display: true,
          fontColor: 'white', // calculated
        },
        scaleLabel: { // labels the entire scale
          display: true,
          labelString: 'two', // calculated
          fontColor: 'white', // calculated
        },
      }
    ]
    const result = createYAxes(arrayOfOptions);
    expect(result).toEqual(expectedResult);
  });

  it('createLegend over white', ()=>{
    const options = {
      position: 'top',
      background: 'white',
    };
    const expectedResult = {
      display: true,
      position: 'top', // default to bottom
      fullWidth: true,
      reverse: false,
      labels: {
        fontColor: 'black',
      },
    }; 
    const result = createLegend(options);
    expect(result).toEqual(expectedResult);
  });

  it('createGraphOptions over white', ()=>{
    const options = {
      background: 'white',     // overall background
      legendPosition: 'top',   // where to put legend
      labelsY: ['one', 'two'], // one label for each Y axis
      labelX: 'x-axis',        // one label for X axis (can have multiple, but currently I only have 1)
      minX: 5,                 // start data here, data starts at 0, so 5 would truncate 4 from front
      maxX: 40,                // end data here, e.g. if data goes through 100, we only show 5-40 in this case
      maxTicksLimitX: 20,      // not working 100% of time, if we have 40 ticks, this should show 1 tick every 2 points; this works until the screen gets wider, then the ticks seem to double
    };
    const expectedResult = {
      responsive: true,
      tooltips: {
        mode: 'label'
      },
      maintainAspectRatio: true,
      legend: {
        display: true,
        position: 'top', // default to bottom
        fullWidth: true,
        reverse: false,
        labels: {
          fontColor: 'black',
        },
      },
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              display: true,
              zeroLineColor: 'black', // calculated
              color: '#444', // calculated
              axisColor: '#444', // calculated
            },
            pointLabels :{
              fontSize: 12,
            },
            ticks: {
              display: true,
              autoSkip: true,
              min: 5, // calculated, def 0
              max: 40, // calculated
              maxTicksLimit: 20, // calculated, def 100
              fontColor: 'rgb(0, 0, 77)', // calculated
            },
            scaleLabel: { // labels the entire scale
              display: true,
              labelString: 'x-axis', // calculated
              fontColor: 'rgb(0, 0, 77)', // calculated
            },
          }
        ],
        yAxes: [
          {
            id: 'A', // calculated
            position: 'left', // calculated
            type: 'linear',
            display: true,
            gridLines: {
              display: true,
              zeroLineColor: 'black', // calculated
              color: '#444', // calculated
              axisColor: '#444', // calculated
            },
            pointLabels :{
              fontSize: 12,
            },
            ticks: {
              display: true,
              fontColor: 'rgb(0, 0, 77)', // calculated
            },
            scaleLabel: { // labels the entire scale
              display: true,
              labelString: 'one', // calculated
              fontColor: 'rgb(0, 0, 77)', // calculated
            },
          }, 
          {
            id: 'B', // calculated
            position: 'right', // calculated
            type: 'linear',
            display: true,
            gridLines: {
              display: true,
              zeroLineColor: 'black', // calculated
              color: '#444', // calculated
              axisColor: '#444', // calculated
            },
            pointLabels :{
              fontSize: 12,
            },
            ticks: {
              display: true,
              fontColor: 'rgb(0, 0, 77)', // calculated
            },
            scaleLabel: { // labels the entire scale
              display: true,
              labelString: 'two', // calculated
              fontColor: 'rgb(0, 0, 77)', // calculated
            },
          }
        ]
      }
      
    }; 
    const result = createGraphOptions(options);
    expect(result).toEqual(expectedResult);
  });

  it('checkForGraphRefresh nothing passed in is false', () => {
    const expectedResult = {
      needRefresh: false,
      message: 'ok',
    };
    const result = checkForGraphRefresh();
    expect(result).toEqual(expectedResult);
  });
  it('checkForGraphRefresh array is longer', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const graphOptionsPrior = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          }
        ]
      }
    };
    const background      =  'white';
    const backgroundPrior =  'white';
    const expectedResult = {
      needRefresh: true,
      message: 'prior Y axes length: 2, new length: 3'
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptionsPrior, 
      background, backgroundPrior
    );
    expect(result).toEqual(expectedResult);
  });
  it('checkForGraphRefresh array is shorter', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          }
        ]
      }
    };
    const graphOptionsPrior = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const background      =  'white';
    const backgroundPrior =  'white';
    const expectedResult = {
      needRefresh: true,
      message: 'prior Y axes length: 3, new length: 2'
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptionsPrior, 
      background, backgroundPrior
    );
    expect(result).toEqual(expectedResult);
  });
  it('checkForGraphRefresh array order diff', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const graphOptionsPrior = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
        ]
      }
    };
    const background      =  'white';
    const backgroundPrior =  'white';
    const expectedResult = {
      needRefresh: true,
      message: 'id mismatch at index 1 (old: C, new: B)',
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptionsPrior, 
      background, backgroundPrior
    );
    expect(result).toEqual(expectedResult);
  });
  it('checkForGraphRefresh background diff 1', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const background      =  'white';
    const backgroundPrior =  undefined;
    const expectedResult = {
      needRefresh: true,
      message: 'background changed',
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptions, 
      background, backgroundPrior
    );
    expect(result).toEqual(expectedResult);
  });
  it('checkForGraphRefresh background diff 2', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const background      =  undefined;
    const backgroundPrior =  'white';
    const expectedResult = {
      needRefresh: true,
      message: 'background changed',
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptions, 
      background, backgroundPrior
    );
    expect(result).toEqual(expectedResult);
  });

  it('checkForGraphRefresh background diff 2', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const background      =  'gray';
    const backgroundPrior =  'white';
    const expectedResult = {
      needRefresh: true,
      message: 'background changed',
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptions, 
      background, backgroundPrior
    );
    expect(result).toEqual(expectedResult);
  });
  it('checkForGraphRefresh all same', () => {
    const graphOptions = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const graphOptionsPrior = {
      scales: {
        yAxes: [
          {
            id: 'A',
            scaleLabel: {
              labelString: 'lbs',
            }
          },
          {
            id: 'B',
            scaleLabel: {
              labelString: 'ft',
            }
          },
          {
            id: 'C',
            scaleLabel: {
              labelString: 'in',
            }
          }
        ]
      }
    };
    const background      =  'gray';
    const backgroundPrior =  'gray';
    const expectedResult = {
      needRefresh: false,
      message: 'ok',
    };
    const result = checkForGraphRefresh(
      graphOptions, graphOptionsPrior, 
      background, backgroundPrior
    );
    expect(result).toEqual(expectedResult);
  });
  it('checkForGraphRefresh background same no arrays', () => {
    const background      =  'gray';
    const backgroundPrior =  'gray';
    const expectedResult = {
      needRefresh: false,
      message: 'ok',
    };
    const result = checkForGraphRefresh(
      undefined, undefined, 
      background, backgroundPrior
    );
    expect(result).toEqual(expectedResult);
  });

  it('createSelectors convert 1', ()=>{
    const measurementsConvert = 1;
    const measurements = [
      {
        unit1: 3,
        unit2: 5,
      }
    ];
    const units = {
      unit1: 'gals',
      unit2: 'lbs',
    };
    const labels = {
      unit1: 'gallons of stuff',
      unit2: 'lbs is weight',
    };
    const input = {
      measurementsConvert,
      measurements,
      units,
      labels,
    };
    const expectedResult = {
      selectors: [
        'unit1',
        'unit2',
      ],
      keysAll: [
        'unit1',
        'unit2',
      ],
      legendObject: {
        unit1: ['gallons of stuff', 'gals'],
        unit2: ['lbs is weight'   , 'lbs' ],
      },
    };
    const result = createSelectors(input);
    expect(result).toEqual(expectedResult);
  });

  it('createSelectors convert 2 without arrays', ()=>{
    const measurementsConvert = 2;
    const measurements = [
      {
        test1__unit1: 3,
        test1__unit2: 5,
        test2__unit1: 33,
        test2__unit2: 55,
      }
    ];
    const units = {
      unit1: 'gals',
      unit2: 'lbs',
    };
    const labels = {
      unit1: 'gallons of stuff',
      unit2: 'lbs is weight',
    };
    const input = {
      measurementsConvert,
      measurements,
      units,
      labels,
    };
    const expectedResult = {
      selectors: [
        'test1__unit1',
        'test1__unit2',
        'test2__unit1',
        'test2__unit2',
      ],
      legendObject: {
        test1__unit1: ['test1 gallons of stuff', 'gals'],
        test1__unit2: ['test1 lbs is weight'   , 'lbs' ],
        test2__unit1: ['test2 gallons of stuff', 'gals'],
        test2__unit2: ['test2 lbs is weight'   , 'lbs' ],
      },
      keysAll: [
        'test1__unit1',
        'test1__unit2',
        'test2__unit1',
        'test2__unit2',
      ],
    };
    const result = createSelectors(input);
    expect(result).toEqual(expectedResult);
  });

  it('createSelectors convert 2 with array', ()=>{
    const measurementsConvert = 2;
    const measurements = [
      {
        test1__unit1: 3,
        test1__unit2: 5,
        test2__unit1: 33,
        test2__unit2: 55,
      }
    ];
    const units = {
      unit1: 'gals',
      unit2: 'lbs',
    };
    const labels = {
      unit1: 'gallons of stuff',
      unit2: 'lbs is weight',
    };
    const arrayOfKeys = ['unit1','unit2'];
    const arrayOfDataGroups = ['test1','test2'];
    const input = {
      measurementsConvert,
      measurements,
      units,
      labels,
      arrayOfKeys,
      arrayOfDataGroups,
    };
    const expectedResult = {
      selectors: [
        'test1__unit1',
        'test2__unit1',
        'test1__unit2',
        'test2__unit2',
      ],
      legendObject: {
        test1__unit1: ['test1 gallons of stuff', 'gals'],
        test1__unit2: ['test1 lbs is weight'   , 'lbs' ],
        test2__unit1: ['test2 gallons of stuff', 'gals'],
        test2__unit2: ['test2 lbs is weight'   , 'lbs' ],
      },
      keysAll: [
        'test1__unit1',
        'test2__unit1',
        'test1__unit2',
        'test2__unit2',
      ],
    };
    const result = createSelectors(input);
    expect(result).toEqual(expectedResult);
  });

});
