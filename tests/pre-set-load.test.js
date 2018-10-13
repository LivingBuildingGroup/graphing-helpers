'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  formatSelectors,
  // formatAllStylesOneGroup,
  _validateFormatAllStylesInput, // tested as subfunction
  parseGroupsFromLayer,
  selectBestStyleMatch,
  selectBestColorMatch,
  formatAllStyles,
  assignPreSetGroupColors,
  formatGroupsStyles,
  formatPreSetToLoad,
  formatIcons,
  formatPreSetColumns,
  createPreSetGlobalPalettes,
  selectDefaultPreSet,} = require('../index');

describe('pre-set-load', ()=> { 

  it('formatSelectors single no group', () => {
    const thisPreSet = {
      layersSelected: [
        'layer1',
        'layer2',
      ],
      type: 'single',
    };
    const groupTrue = false;
    const groupsRaw = [];
    const expectedResult = {
      selectors: [
        'layer1',
        'layer2',
      ],
      selectorsRemaining: [
        'layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors single no group one layer only', () => {
    const thisPreSet = {
      layersSelected: [
        'layer1',
      ],
      type: 'single',
    };
    const groupTrue = false;
    const groupsRaw = [];
    const expectedResult = {
      selectors: [
        'layer1',
      ],
      selectorsRemaining: [],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors single with group stays single', () => {
    const thisPreSet = {
      layersSelected: [
        'layer1',
        'layer2',
      ],
      type: 'single',
    };
    const groupTrue = true;
    const groupsRaw = [
      'A'
    ];
    const expectedResult = {
      selectors: [
        'layer1',
        'layer2',
      ],
      selectorsRemaining: [
        'layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors group with group gets prefixed', () => {
    const thisPreSet = {
      layersSelected: [
        'layer1',
        'layer2',
      ],
      type: 'group',
    };
    const groupTrue = true;
    const groupsRaw = [
      'A'
    ];
    const expectedResult = {
      selectors: [
        'A__layer1',
        'A__layer2',
      ],
      selectorsRemaining: [
        'A__layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors group with subGroup gets prefixed if groupTrue', () => {
    const thisPreSet = {
      layersSelected: [
        'A__layer1',
        'A__layer2',
      ],
      type: 'group',
    };
    const groupTrue = true;
    const groupsRaw = [
      52,
      '53',
    ];
    const expectedResult = {
      selectors: [
        '52__A__layer1',
        '53__A__layer1',
        '52__A__layer2',
        '53__A__layer2',
      ],
      selectorsRemaining: [
        '53__A__layer1',
        '52__A__layer2',
        '53__A__layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors group with subGroup does NOT prefixed if NOT groupTrue', () => {
    const thisPreSet = {
      layersSelected: [
        'A__layer1',
        'A__layer2',
      ],
      type: 'group',
    };
    const groupTrue = false;
    const groupsRaw = [
      52,
      '53',
    ];
    const expectedResult = {
      selectors: [
        'A__layer1',
        'A__layer2',
      ],
      selectorsRemaining: [
        'A__layer2',
      ],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors empty layersSelected is not Array', () => {
    const thisPreSet = {
      layersSelected: 'not an array',
      type: 'single',
    };
    const groupTrue = false;
    const groupsRaw = [];
    const expectedResult = {
      selectors: [''],
      selectorsRemaining: [],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatSelectors empty layersSelected is empty', () => {
    const thisPreSet = {
      layersSelected: [],
      type: 'single',
    };
    const groupTrue = false;
    const groupsRaw = [];
    const expectedResult = {
      selectors: [''],
      selectorsRemaining: [],
    };
    const result = formatSelectors(thisPreSet, groupTrue, groupsRaw);
    expect(result).to.deep.equal(expectedResult);
  });

  it('parseGroupsFromLayer no input = all empty strings', () => {
    const layer     = 'layer';
    const groups    = []; // validated as an array before function is invoked
    const groupsSub = []; // validated as an array before function is invoked
    const result = parseGroupsFromLayer(layer, groups, groupsSub);
    const expectedResult = {
      g:  '',
      g_: '',
      s:  '',
      s_: '',
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseGroupsFromLayer no prefix = all empty strings', () => {
    const layer     = 'layer';
    const groups    = ['A']; // validated as an array before function is invoked
    const groupsSub = [53, 54]; // validated as an array before function is invoked
    const result = parseGroupsFromLayer(layer, groups, groupsSub);
    const expectedResult = {
      g:  '',
      g_: '',
      s:  '',
      s_: '',
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseGroupsFromLayer mismatch prefix = all empty strings', () => {
    const layer     = 'B__layer';
    const groups    = ['A']; // validated as an array before function is invoked
    const groupsSub = [53, 54]; // validated as an array before function is invoked
    const result = parseGroupsFromLayer(layer, groups, groupsSub);
    const expectedResult = {
      g:  '',
      g_: '',
      s:  '',
      s_: '',
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseGroupsFromLayer matching group prefix', () => {
    const layer     = 'A__layer';
    const groups    = ['A']; // validated as an array before function is invoked
    const groupsSub = [53, 54]; // validated as an array before function is invoked
    const result = parseGroupsFromLayer(layer, groups, groupsSub);
    const expectedResult = {
      g:  'A',
      g_: 'A__',
      s:  '',
      s_: '',
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseGroupsFromLayer matching subgroup prefix', () => {
    const layer     = '54__layer';
    const groups    = ['A']; // validated as an array before function is invoked
    const groupsSub = [53, 54]; // validated as an array before function is invoked
    const result = parseGroupsFromLayer(layer, groups, groupsSub);
    const expectedResult = {
      g:  '',
      g_: '',
      s:  '54',
      s_: '54__',
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseGroupsFromLayer group and subgroup matching prefixes', () => {
    const layer     = 'A__54__layer';
    const groups    = ['A','B']; // validated as an array before function is invoked
    const groupsSub = [53, 54]; // validated as an array before function is invoked
    const result = parseGroupsFromLayer(layer, groups, groupsSub);
    const expectedResult = {
      g:  'A',
      g_: 'A__',
      s:  '54',
      s_: '54__',
    };
    expect(result).to.deep.equal(expectedResult);
  });

  it('selectBestStyleMatch = thisPreSet.layer color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {
      styles: {
        layer: {
          color: 'blue',
          style: {
            borderDash: [20,20],
          }
        }
      }
    };
    const styles    = {
      A__layer: {
        color: 'green',
        style: {
          borderDash: [30,30],
        }
      },
      layer: {
        color: 'purple',
        style: {
          borderDash: [5,5],
        }
      }
    }; 
    const layer = 'A__layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'blue',
      style: {
        borderDash: [20,20],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = thisPreSet.unPrefix color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {
      styles: {
        A__layer: {
          color: 'red',
          style: {
            borderDash: [10,10],
          }
        },
        layer: {
          color: 'blue',
          style: {
            borderDash: [20,20],
          }
        }
      }
    };
    const styles    = {
      A__layer: {
        color: 'green',
        style: {
          borderDash: [30,30],
        }
      },
      layer: {
        color: 'purple',
        style: {
          borderDash: [5,5],
        }
      }
    }; 
    const layer = 'A__layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {
        borderDash: [10,10],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = thisPreSet.g__s__layer color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {
      styles: {
        A__54__layer: {
          color: 'red',
          style: {
            borderDash: [10,10],
          }
        },
      }
    };
    const styles = {
      A__layer: {
        color: 'green',
        style: {
          borderDash: [30,30],
        }
      },
      layer: {
        color: 'purple',
        style: {
          borderDash: [5,5],
        }
      }
    }; 
    const layer = 'layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {
        borderDash: [10,10],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = thisPreSet.g__layer color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {
      styles: {
        A__layer: {
          color: 'red',
          style: {
            borderDash: [10,10],
          }
        },
      }
    };
    const styles = {
      A__layer: {
        color: 'green',
        style: {
          borderDash: [30,30],
        }
      },
      layer: {
        color: 'purple',
        style: {
          borderDash: [5,5],
        }
      }
    }; 
    const layer = 'layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {
        borderDash: [10,10],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = thisPreSet.s__layer color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {
      styles: {
        '54__layer': {
          color: 'red',
          style: {
            borderDash: [10,10],
          }
        },
      }
    };
    const styles = {
      A__layer: {
        color: 'green',
        style: {
          borderDash: [30,30],
        }
      },
      layer: {
        color: 'purple',
        style: {
          borderDash: [5,5],
        }
      }
    }; 
    const layer = 'layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {
        borderDash: [10,10],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = styles.layer color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {};
    const styles    = {
      A__layer: {
        color: 'red',
        style: {
          borderDash: [10,10],
        }
      },
      layer: {
        color: 'blue',
        style: {
          borderDash: [20,20],
        }
      }
    }; 
    const layer = 'A__layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {
        borderDash: [10,10],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = styles.unPrefix color', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {};
    const styles    = {
      layer: {
        color: 'red',
      }
    }; 
    const layer = 'A__layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {},
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = styles.unPrefix color & style', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {};
    const styles    = {
      layer: {
        color: 'red',
        style: {
          borderDash: [10,10],
        }
      }
    }; 
    const layer = 'A__layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      color: 'red',
      style: {
        borderDash: [10,10],
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('selectBestStyleMatch = empty object on no styles sent', () => {
    // all parameters are validated before function is invoked
    const thisPreSet = {};
    const styles    = {}; 
    const layer = 'A__layer';
    const unPrefix = 'layer'; 
    const g_ = 'A__';
    const s_ = '54__';
    const result = selectBestStyleMatch(thisPreSet, styles, layer, unPrefix, g_, s_);
    const expectedResult = {
      style: {},
    };
    expect(result).to.deep.equal(expectedResult);
  });

  it('selectBestColorMatch 80 80 80 as default no valid input', () => {
    // all parameters are validated before function is invoked
    const thisStyle = 'not an object';
    const newGroupColors = 'not an object'; 
    const shade = 1; 
    const preSetGlobalPalettes = 'not an object';
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '80, 80, 80';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch 80 80 80 as default no group colors', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {};
    const newGroupColors = 'not an object'; 
    const shade = 1; 
    const preSetGlobalPalettes = 'not an object';
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '80, 80, 80';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch = thisStyle.color even if no other valid input', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {
      color: '55, 55, 55',
    };
    const newGroupColors = 'not an object'; 
    const shade = 1; 
    const preSetGlobalPalettes = 'not an object';
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '55, 55, 55';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch = thisStyle.color even if group colors valid', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {
      color: '55, 55, 55',
    };
    const newGroupColors = {
      A:  'red',
      B:  'green',
    }; 
    const shade = 1; 
    const preSetGlobalPalettes = 'not an object';
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '55, 55, 55';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch = group color if valid', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {
      color: '55, 55, 55',
    };
    const newGroupColors = {
      A:  'red',
      B:  'green',
    }; 
    const shade = 1; 
    const preSetGlobalPalettes = {
      red: [
        '54, 67, 82',
        '35, 64, 99',
      ],
      green: [
        '32, 51, 11',
        '34, 78, 91',
      ],
    };
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '54, 67, 82';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch = this style color if shade not valid', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {
      color: '55, 55, 55',
    };
    const newGroupColors = {
      A:  'red',
      B:  'green',
    }; 
    const shade = 5; 
    const preSetGlobalPalettes = {
      red: [
        '54, 67, 82',
        '35, 64, 99',
      ],
      green: [
        '32, 51, 11',
        '34, 78, 91',
      ],
    };
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '55, 55, 55';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch = this style color if group color falsey', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {
      color: '55, 55, 55',
    };
    const newGroupColors = {
      A:  'red',
      B:  'green',
    }; 
    const shade = 1; 
    const preSetGlobalPalettes = {
      red: [
        false,
        '35, 64, 99',
      ],
      green: [
        '32, 51, 11',
        '34, 78, 91',
      ],
    };
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '55, 55, 55';
    expect(result).to.equal(expectedResult);
  });
  it('selectBestColorMatch = default if group color falsey and this style not specified', () => {
    // all parameters are validated before function is invoked
    const thisStyle = {};
    const newGroupColors = {
      A:  'red',
      B:  'green',
    }; 
    const shade = 1; 
    const preSetGlobalPalettes = {
      red: [
        false,
        '35, 64, 99',
      ],
      green: [
        '32, 51, 11',
        '34, 78, 91',
      ],
    };
    const group = 'A';
    const result = selectBestColorMatch(thisStyle, newGroupColors, preSetGlobalPalettes, shade, group);
    const expectedResult = '80, 80, 80';
    expect(result).to.equal(expectedResult);
  });

  it('formatAllStyles input is not an object', () => {
    const expectedResult = {
      message: 'input is not an object'
    };
    const input = 'not an object';
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles layersAllPrefixed is not an array', () => {
    const expectedResult = {
      message: 'layersAllPrefixed is not an array'
    };
    const input = {};
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles layersAllPrefixed empty', () => {
    const expectedResult = {
      message: 'groups is not an array'
    };
    const input = {
      layersAllPrefixed: [],
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles layersAllPrefixed has non-string key', () => {
    const expectedResult = {
      // loops all and sends message on LAST non-matching item, vs first
      message: 'layersAllPrefixed item 3 at index 3 is not a string'
    };
    const input = {
      layersAllPrefixed: ['string', 'string2', {}, 3, 'string'],
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles layersAllPrefixed has non-string key', () => {
    const expectedResult = {
      message: 'groups is not an array'
    };
    const input = {
      layersAllPrefixed: ['string', 'string2', 'string'],
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles groupsSub is not an array', () => {
    const expectedResult = {
      message: 'groupsSub is not an array'
    };
    const input = {
      layersAllPrefixed: ['string', 'string2', 'string'],
      groups: [],
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles thisPreSet is not an object', () => {
    const expectedResult = {
      message: 'thisPreSet is not an object'
    };
    const input = {
      layersAllPrefixed: ['string', 'string2', 'string'],
      groups: [],
      groupsSub: [],
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles styles is not an object', () => {
    const expectedResult = {
      message: 'styles is not an object'
    };
    const input = {
      layersAllPrefixed: ['string', 'string2', 'string'],
      groups: [],
      groupsSub: [],
      thisPreSet: {},
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatAllStyles handles variety of input types', () => {
    const input = {
      layersAllPrefixed: [
        'layer1', 
        'layer2', 
        'layer3', 
        'A__layer4', 
        '57__layer4',
        'A__57__layer5',
        'C__layer6',
        'C__53__layer6',
        'C__54__layer6',
        'C__54__layer4',
        '53__layer6',
      ],
      groups: ['A', 'B', 'C'],
      groupsSub: [52, 57],
      styles: {
        layer4: {
          color: '34, 52, 78'
        },
        layer5: {
          color: '44, 46, 67'
        },
      },
      thisPreSet: {
        styles: {
          A__52__layer1: {
            style: {
              borderColor: '254, 32, 78'
            },
          },
          '52_layer2': {
            style: {
              borderDash: [15, 3],
            }
          },
          layer3: {
            color: '77, 77, 77',
          },
          layer6: {
            style: {
              shade: 1,
              borderDashOffset: 0.2,
            }
          }
        }
      },
      newGroupColors: {
        C: 'red',
      },
      preSetGlobalPalettes: {
        red: [
          '253, 253, 253',
          '254, 0, 0',
          '33, 33, 33',
          '44, 44, 44',
        ]
      }
    };
    const expectedResult = {
      // one key for each layer selected
      layer1: { // read from A__52__layer1
        color: '80, 80, 80', // default bc no color anywhere
        style: { 
        //   borderColor: '254, 32, 78' // DELETED bc NO CASCADE!
        },
      },
      layer2: { // read from 52__layer2
        color: '80, 80, 80', // default bc no color anywhere
        style: { 
        //   borderDash: [15, 3],// DELETED bc NO CASCADE!
        } 
      },
      layer3: {
        color: '77, 77, 77',
        style: {},
      },
      A__layer4: {
        color: '34, 52, 78',
        style: {},
      },
      '57__layer4': {
        color: '34, 52, 78',
        style: {},
      },
      A__57__layer5: {
        color: '44, 46, 67',
        style: {},
      },
      C__layer6: {
        color: '253, 253, 253',
        style: {
          shade: 1,
          borderDashOffset: 0.2,
        }
      },
      C__53__layer6: {
        color: '253, 253, 253',
        style: {
          shade: 1, // from this preSet
          borderDashOffset: 0.2, // from this preSet
        }
      },
      C__54__layer6: {
        color: '253, 253, 253',
        style: {
          shade: 1, // from this preSet
          borderDashOffset: 0.2, // from this preSet
        }
      },
      C__54__layer4: {
        color: '34, 52, 78', // from general styles, group C does not affect it, because no shade
        style: {},
      },
      '53__layer6': {
        color: '80, 80, 80', // default, none specified
        style: {
          shade: 1, // from this preSet
          borderDashOffset: 0.2, // from this preSet
        }
      },
    };
    const result = formatAllStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('assignPreSetGroupColors defaults as type only if no input', () => {
    const input = {};
    const expectedResult = {
      colorsUsed    : {},
      newGroupColors: {},
      groupDotColors: {},
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors defaults as type only if groups is empty array', () => {
    const input = {
      groups: [],
    };
    const expectedResult = {
      colorsUsed    : {},
      newGroupColors: {},
      groupDotColors: {},
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors defaults as type only if only groups is populated', () => {
    const input = {
      groups: ['A'],
    };
    const expectedResult = {
      colorsUsed    : {
        green: true, // index 0 of default presetGlobalPalettes
      },
      newGroupColors: {
        A: 'green',
      },
      groupDotColors: {
        A: '  0, 254,   0',
      },
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors defaults to gray if group color not defined', () => {
    const input = {
      groups: ['A'],
      groupColors: {
        A: 'not a named color',
      }
    };
    const expectedResult = {
      colorsUsed: {
        'not a named color': true,
      },
      newGroupColors: {
        A: 'not a named color',
      },
      groupDotColors: {
        A: '80, 80, 80',
      },
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors defaults to preset palette when palette not defined', () => {
    const input = {
      groups: ['A', 'B'],
      groupColors: {
        A: 'red',
        B: 'blue',
      }
    };
    const expectedResult = {
      colorsUsed: {
        red: true,
        blue: true,
      },
      newGroupColors: {
        A: 'red',
        B: 'blue',
      },
      groupDotColors: {
        A: '254,   0,   0',
        B: '  0,   0, 254',
      },
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors uses preSetGlobalPalettes', () => {
    const input = {
      groups: ['A', 'B'],
      groupColors: {
        A: 'red',
        B: 'blue',
      },
      preSetGlobalPalettes: {
        red: [
          '254, 0, 0',
        ],
        blue: [
          '0, 254, 0'
        ],
      }
    };
    const expectedResult = {
      colorsUsed: {
        red: true,
        blue: true,
      },
      newGroupColors: {
        A: 'red',
        B: 'blue',
      },
      groupDotColors: {
        A: '254, 0, 0',
        B: '0, 254, 0',
      },
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('assignPreSetGroupColors uses preSetGlobalPalettes + defaults', () => {
    const input = {
      groups: ['A', 'B', 'C'],
      groupColors: {
        A: 'red',
        B: 'blue',
      },
      preSetGlobalPalettes: {
        red: [
          '254, 0, 0',
        ],
        blue: [
          '0, 254, 0'
        ],
        // green is intentionally omitted
      },
      preSetGlobalColorOptions: [
        'green',
        'yellow',
        'orange',
        'red',
        'purple',
        'violet',
        'blue',
      ],
    };
    const expectedResult = {
      colorsUsed: {
        red: true,
        blue: true,
        green: true,
      },
      newGroupColors: {
        A: 'red',
        B: 'blue',
        C: 'green',
      },
      groupDotColors: {
        A: '254, 0, 0',
        B: '0, 254, 0',
        C: '  0, 254,   0' // defaults correctly, because though not explicitly declared, it does not conflict with the default
      },
    };
    const result = assignPreSetGroupColors(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it.skip('formatGroupsStyles', () => {
    const input = {};
    const expectedResult = {
      
    };
    const result = formatGroupsStyles(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it.skip('formatPreSetToLoad', () => {
    const expectedResult = {
      
    };
    const input = {};
    const result = formatPreSetToLoad(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatIcons all undefined', () => {
    const thisPreSet = {
      icon: undefined,
      name: undefined,
    };
    const expectedResult = {
      preSetIconNew: null,
      preSetNameNew: null,
    };
    const result = formatIcons(thisPreSet);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatIcons both defined', () => {
    const thisPreSet = {
      icon: 'key',
      name: 'lock',
    };
    const expectedResult = {
      preSetIconNew: 'key',
      preSetNameNew: 'lock',
    };
    const result = formatIcons(thisPreSet);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatPreSetColumns', () => {
    const cssStyleColorsNamed = {
      red: 'red',
      yellow: 'yellow',
    };
    const expectedResult = {
      cssStyleColorsNamedArray: ['red', 'yellow'],
      preSetColumns: [
        { 
          key: 'color',
          label: 'color',
          type: 'color',
          optionLabels: ['red', 'yellow'],
          optionValues: ['red', 'yellow'],
          defaultValue: 'red',
        },
        { 
          key: 'fill',
          label: 'fill',
          type: 'boolean',
          optionLabels: ['true', 'false'],
          optionValues: ['true' ,'false' ],
          defaultValue:  'true',
        },
        { 
          key: 'opacityBackground',
          label: 'fill opacity',
          type: 'number',
          step: 0.1,
          min: 0,
          max: 1,
          defaultValue: 0.1,
        },
        { 
          key: 'opacityBorder',
          label: 'line opacity',
          type: 'number',
          step: 0.1,
          min: 0,
          max: 1,
          defaultValue: 1,
        },
        {
          key: 'borderWidth',
          label: 'line weight',
          type: 'number',
          step: 0.1,
          min: 1,
          max: 10,
          defaultValue: 1,
        },
        {
          key: 'borderDash',
          label: 'line type',
          type: 'array',
          optionLabels: ['solid', 'medium dashes','long dashes and gaps','medium dashes, short gaps','short dashes, long gaps','long dashes, short gaps'],
          optionValues: [ ''  , '10,10'        ,'20,20'                 ,'10,5'                     ,'5,20'                   ,'20, 5'                  ],
          defaultValue:   '',
        },
        {
          key: 'pointBorderWidth',
          label: 'point size',
          type: 'number',
          step: 0.1,
          min: 1,
          max: 10,
          defaultValue: 1,
        },
        {
          key: 'opacityPoint',
          label: 'point opacity',
          type: 'number',
          step: 0.1,
          min: 0,
          max: 1,
          defaultValue: 1,
        },
      ],
    };
    const result = formatPreSetColumns(cssStyleColorsNamed);
    expect(result).to.deep.equal(expectedResult);
  });

  it('createPreSetGlobalPalettes', () => {
    const expectedResult = {
      blue: [
        '  0,   0, 254',
        '189, 209, 245',
        '155, 180, 223',
        '123, 147, 190',
        ' 81, 103, 144',
        ' 53,  74, 112',
        ' 33,  53,  93',
        ' 14,  34,  71',
        '  3,  19,  51',
      ],
      green: [
        '  0, 254,   0',
        '128, 248, 109',
        ' 99,  24,  79',
        ' 79, 190,  64',
        ' 56, 150,  45',
        ' 38, 119,  31',
        ' 24,  93,  19',
        ' 13,  75,  11',
        ' 92,  55,   6',
      ],
      orange: [
        '254, 128,   0',
        '246, 189, 111',
        '227, 163,  79',
        '205, 145,  67',
        '166, 114,  47',
        '137,  90,  30',
        '115,  74,  19',
        '102,  62,  12',
        ' 92,  55,   6',
      ],
      purple: [
        '169,   0,  81',
        '243, 158, 162',
        '227, 124, 131',
        '202.  99, 108',
        '174,  70,  83',
        '150,  46,  62',
        '132,  28,  45',
        '118,  15,  34',
        ' 93,   6,  22',
      ],
      red: [
        '254,   0,   0',
        '245, 167, 143',
        '234, 138, 110',
        '224, 116,  88',
        '213,  91,  63',
        '203,  71,  43',
        '196,  54,  25',
        '189,  40,  11',
        '165,  31,   5',
      ],
      violet: [
        '254,   0, 254',
        '227, 146, 247',
        '206, 114, 225',
        '183,  92, 197',
        '158,  66, 167',
        '135,  44, 139',
        '117,  26, 117',
        '107,  16, 104',
        ' 88,   6,  83',
      ],
      yellow: [
        '254, 254,   0',
        '227, 243,  92',
        '220, 233,  49',
        '203, 204,  31',
        '186, 173,  26',
        '174, 150,  22',
        '163, 130,  19',
        '155, 116,  17',
        '150, 106,  15',
      ],
    };
    const result = createPreSetGlobalPalettes();
    expect(result).to.deep.equal(expectedResult);
  });

  it('selectDefaultPreSet no default this graphName', () => {
    const state = {
      preSets: {
        a: {
          graph: 'tests',
          def: true,
        },
        b: {
          graph: 'platforms',
        }
      }, 
      graphName: 'platforms',
    };
    const expectedResult = 'b';
    const result = selectDefaultPreSet(state);
    expect(result).to.equal(expectedResult);
  });
  it('selectDefaultPreSet no default this graphName', () => {
    const state = {
      preSets: {
        a: {
          graph: 'tests',
          def: true,
        },
        b: {
          graph: 'platforms',
          def: true,
        }
      }, 
      graphName: 'platforms',
    };
    const expectedResult = 'b';
    const result = selectDefaultPreSet(state);
    expect(result).to.equal(expectedResult);
  });
  it('selectDefaultPreSet no default this graphName', () => {
    const state = {
      preSets: {
        a: {
          graph: 'tests',
          def: true,
        },
        b: {
          graph: 'platforms',
        }
      }, 
      graphName: 'weather',
    };
    const expectedResult = undefined;
    const result = selectDefaultPreSet(state);
    expect(result).to.equal(expectedResult);
  });

});