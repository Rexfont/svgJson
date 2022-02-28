const xjs = require('@axoncodes/xjs')
const specs = require('../specs')
const tools = require('./tools')

function parseContourTag(tag) {
  const contours = [];
  if(xjs.if(tag, 'tag.attributes.d')) exploitFullD(tag.attributes.d).forEach(pathCommands => contours.push(exploitSingleD(pathCommands)));
  else return tag
  tag.contours = contours;
  return tag
}

function parseContourSvg(svg) {
  return svg.map(tag => parseContourTag(tag))
}

async function parseContourAsync(path) {
  return parseContourPath(path)
}

function exploitFullD(data) {
  if(!data) return null;
  return tools.exploit(data, /[n{a-zA-Z}]/g).map(exploited => specs(tools.removecommas(exploited))).flat();
}

/**
 * 
 * @param {arr} contours this should contains the countours (the path exploited to arrays of x and y for each command)
 * @returns the MAX and MIN of each X and Y
 */
function getMaxMin(contours) {
  var xMax=0, xMin=0, yMax=0, yMin=0;
  contours.forEach(contour => {
    // if(!tools.isAbs(contour)) contour = parseFormat.process(contour)
    let x, y;
    if(contour[0].toLowerCase() === 'v') x = contour[1][contour[1].length-1]
    else if(contour[0].toLowerCase() === 'h') y = contour[1][contour[1].length-1]
    else {
      x = contour[1][contour[1].length-2]
      y = contour[1][contour[1].length-1]
    }
    
    if(x && x > xMax) xMax = x
    else if(x && x < xMin) xMin = x;

    if(y && y > yMax) yMax = y
    else if(y && y < yMin) yMin = y;
  });
  return { xMax, xMin, yMax, yMin }
}

function attachStrContour(font) {
  font.forEach((glyphs, key) => {
    if(glyphs.contour) {
      let string = '';
      glyphs.contour.forEach((glyph) => {
        // generate string format of each glyph
        let strformat = `${glyph.name}`;

        for (const [key, value] of Object.entries(glyph))
        if (key !== 'name')
        strformat += ` ${value}`;

        string += `${strformat} `;
      });
      font[key].contour.str = string.trim();
    }
  });
  return font;
}

function attachStrContourDirectly(contours) {
  let string = '';
  contours.forEach((contour) => {
    // generate string format of each contour
    let strformat = `${contour.name}`;

    for (const [key, value] of Object.entries(contour))
    if (key !== 'name')
    strformat += ` ${value}`;

    string += `${strformat} `;
  });
  return string;
}

function getGlyphs(font) {
  const glyphs = [];
  font.forEach((element) => element.tag == 'glyph' ? glyphs.push(element) : null);
  return glyphs;
}

function parseContourPath(path) {
  const contours = [];
  exploitFullD(path).forEach(pathCommands => 
      contours.push(exploitSingleD(pathCommands)));
  return contours;
}

function useContourStr(font) {
  return attachStrContourAsync(font)
  .then((svg) => svg.map((tag) => {
    if(xjs.if(tag, 'tag.attributes.d')) tag.attributes.d = tag.contour.str;
    return tag
  }))
}

async function attachStrContourAsync(font) {
  return attachStrContour(font);
}

function exploitSingleD(data) {
  const symbol = data[0];
  data = data.substring(1, data.length);
  // exploiting the string
  // const arr = specs(symbol, tools.removecommas(data))
  const arr = tools.exploit(data, /[n{a-zA-Z} -]/g).map(item => parseFloat(item));
  return [symbol, arr];
}

async function pathParser(font) {
  font.forEach((tag, key) => tag.tag == 'glyph' ? font[key].contours = parseContourPath(tag.attributes.d) : null);
  font.forEach((tag, key) => tag.tag == 'glyph' ? font[key].maxmin = getMaxMin(tag.contours) : null);
  return font;
}

function glyphMatrix(contours, a, b, c, d, e, f) {
  let prevX=0, prevY=0;
  return contours.map(contour => {
    return Object.entries(contour).map(coordinate => {
      const [key, value] = coordinate;
      let x = 0, y = 0;

      if (key.indexOf('x') >= 0) {
        x = value;
        y = xjs.or([contour[key.replace(/x/g, 'y')], prevY])
      } else if (key.indexOf('y') >= 0) {
        x = xjs.or([contour[key.replace(/y/g, 'x')], prevX]);
        y = value;
      }
      else if (key.indexOf('sweep_flag') >= 0) return [key, value ? 0 : 1]
      else return coordinate;

      prevX = xjs.or([x, prevX]);
      prevY = xjs.or([y, prevY]);

      if (key.indexOf('x') >= 0) return [key, a*x + c*y + e]; // X
      else if (key.indexOf('y') >= 0) return [key, b*x + d*y + f]; // Y
    })
  })
}

function roundup(contoursArr) {
  contoursArr.forEach((contour, i) => {
    contour.forEach((coordinate, j) => {
      const num = contoursArr[i][j][1];
      if (typeof num === 'number' && num !== parseInt(num)) {
        contoursArr[i][j][1] = (num).toFixed(2);
      }
    })
  })
  return contoursArr;
}

function getClassesEncode(classes) {
  const list = {}
  let count = 0
  if (classes.length == 0) return []
  Object.entries(classes[0]).forEach(cclass => {
    if (Object.entries(list).indexOf(cclass[0]) == -1) list[cclass[0]] = count++
    cclass[1].forEach(style => {
      style.forEach(styleattr => {
        if (Object.entries(list).indexOf(styleattr) == -1) list[styleattr] = count++
      })
    })
  })
  return list
}


function encodeClasses(svgsJsons) {
  return svgsJsons.map(svgJson => {
    const encodedClasses = {}
    const styles = extractStyles(svgJson)
    const encodedClassesList = getClassesEncode(styles.flat())
    return svgJson.map(tag => {
      if (tag.style)
        tag.style = Object.entries(tag.style).map(styleItem => {
          const encodement = `${styleItem[0]}${styleItem.flat().flat().map(item => encodedClassesList[item]).join('')}`
          encodedClasses[styleItem[0]] = encodement
          return [encodement, styleItem[1]]
        })
      if (tag.attributes && tag.attributes.class) tag.attributes.class = encodedClasses[`.${tag.attributes.class}`]
      return tag
    })
  })
}

function extractPathes(svgJsons) {
  const pathes = []
  svgJsons.forEach(svgJson => {
    if (svgJson.tag == 'path' || svgJson.tag == 'g' || svgJson.tag == '/g') pathes.push(svgJson)
  })
  return pathes
  // return xjs.mapIf(svgJsons, ['tag.attributes.d', 'tag.attributes.class'], true)
}

function extractGlyphSets(json) {
  const glyphSets = {};
  json.forEach(tag => {
    if (tag.tag.indexOf('glyph') == 0 && parseInt(tag.attributes.unicodeOrder) == 0)
      glyphSets[tag.attributes.unicodeBase] = [];
    if (tag.tag.indexOf('glyph') == 0)
      glyphSets[tag.attributes.unicodeBase].push(tag);
  });
  return glyphSets;
}

function extractStyles(svgJsons) {
  return xjs.mapIf(svgJsons, 'tag.style', true)
}

function extractGlyphs(json) {
  const glyphs = [];
  json.forEach(tag => {
    if (tag.tag == 'glyph') glyphs.push(tag);
  });
  return glyphs;
}

module.exports = {
  extractGlyphs,
  extractStyles,
  extractGlyphSets,
  extractPathes,
  encodeClasses,
  getClassesEncode,
  pathParser,
  attachStrContour,
  parseContourPath,
  parseContourTag,
  parseContourSvg,
  parseContourAsync,
  getGlyphs,
  attachStrContourDirectly,
  getMaxMin,
  useContourStr,
  glyphMatrix,
  roundup,
}