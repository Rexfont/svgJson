const tools = require('../helpers/tools')
const validator = require('../helpers/validator')
const parse = require('../helpers/parse')
const parseFormat = require('./parseFormat')
const xjs = require('@axoncodes/xjs');

function parseSvgfont(data, unicodePrefix, fontname) {
  console.log('svgicontosvgfont');
  if(!data) throw 'Invalid Data to convert';
  if(tools.isSvg(data)) throw 'The DATA is expected to be JSON'

  return validator.jsonValidation(data)
  .then(async data => {
    const dimentions = getDimensions(data);
    const glyphs = await extractGlyphs(data, dimentions.height);
    return { dimentions, glyphs }
  })
  .then(({ dimentions, glyphs }) => 
    stackthedata({
      glyphs,
      fontname,
      unicodePrefix,
      dimentions
    })
  );
}

function getDimensions(data) {
  let width = height = 0;
  data.forEach(tag=>{
    if (tag.attributes && tag.attributes.viewBox) {
      width = tag.attributes.viewBox[2];
      height = tag.attributes.viewBox[3];
    }
  })
  return { width, height };
}

async function extractGlyphs(data, height) {
  let glyphs = [];
  let styles;
  let classes = [];
  await Promise.all(data.map(async (tag, key) => {
    if(xjs.if(tag, 'tag.attributes.d')) {
      const path = await prepare(tag.attributes.d, height);
      let tmpClass = classes[key-1] ? `.${classes[key-1]}` : null;
      let thestyleStr = '';
      if (styles && tmpClass) {
        styles.forEach(style => {
          if (style && style.length>0 && style[0] == tmpClass) {
            style[1].forEach(substyle => {
              if(substyle && substyle.length>0)
              thestyleStr += `${substyle[0]}="${substyle[1]}" `;
            })
          }
        })
      }
      data[key]['path'] = path.arr
      data[key]['horizAdvX'] = (path.max - path.min)
      data[key]['thestyleStr'] = thestyleStr
      glyphs.push(data[key])
    }else if(xjs.if(tag, 'tag.style')) styles = tag.style;
    
    classes.push(xjs.if(tag, 'tag.attributes.class') ? tag.attributes.class : '');
  }))
  return glyphs;
}

function stackthedata({glyphs, fontname='rexfont', unicodePrefix='RX', dimentions}) {
  let count=0;
  let content = `<?xml version="1.0" standalone="no"?>\n`;
  content += `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >\n`;
  content += `<svg xmlns="http://www.w3.org/2000/svg">\n`;
  content += `<defs>\n`;
  content += `<font id="${fontname}" horiz-adv-x="${dimentions.width}">\n`;
  content += `<font-face 
    font-family="${fontname}"
    units-per-em="${dimentions.height}"
    ascent="${dimentions.height}"
    descent="${0}"
    />`;
  content += `<missing-glyph horiz-adv-x="${0}" />\n`;
  let rxcode = 0;
  glyphs.forEach((glyph, i) => {
    if (glyph.attributes.rxcode != rxcode) {
      count = 0
      rxcode = glyph.attributes.rxcode
    }
    content += 
    `<glyph 
      ${glyph.thestyleStr}
      glyph-name="icon${i}"
      unicode="${unicodePrefix}${glyph.attributes.rxcode}-${count++}"
      horiz-adv-x="${glyph.horizAdvX}"
      d="${glyph.path}"/>\n`;    
  });
  content += `</font>\n`
  content += `</defs>\n`
  content += `</svg>\n`

  return content;
}

function prepare(path, height) {
  return parse.parseContourAsync(path)
  .then(parseFormat.parseFormatAbsoluteDirectly)
  .then(contours => parse.glyphMatrix(contours, 1, 0, 0, -1, 0, height))
  .then(getWidth)
  .then(roundup)
  .then(putBackTheArrsAsObjs)
  .then(attachStrContourDirectly)
}

function attachStrContourDirectly(json) {
  return {
    arr: parse.attachStrContourDirectly(json.arr),
    max: json.max,
    min: json.min,
  }
}

function roundup(json) {
  const rounded = parse.roundup(json.contoursArr)
  return {
    rounded,
    max: json.max,
    min: json.min,
  }
}

function getWidth(contoursArr) {
  let min=0, max=0
  contoursArr.flat().forEach((coord, key) => {
    if (coord[0] == 'x' || coord[0] == 'x1' || coord[0] == 'x2' || coord[0] == 'x3') {
      if (coord[1] > max) max = coord[1]
      if (coord[1] < min) min = coord[1]
    } 
  })
  return {
    contoursArr,
    max,
    min
  }
}

function putBackTheArrsAsObjs(json) {
  const arr = [];
  json.rounded.forEach(contour => {
    const obj = {};
    contour.forEach(coordinate => {
      obj[`${coordinate[0]}`] = coordinate[1]
    })
    arr.push(obj)
  })
  return {
    arr,
    max: json.max,
    min: json.min,
  };
}

module.exports = parseSvgfont;