const tools = require('../helpers/tools')
const validator = require('../helpers/validator')
const parse = require('../helpers/parse')
const parseFormat = require('./parseFormat')
const xjs = require('../../../js')

function parseSvgfont(data, unicodePrefix, id) {
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
      id,
      unicodePrefix: unicodePrefix,
      dimentions
    })
  );
}

function getDimensions(data) {
  let width = height = 0;
  data.forEach(tag=>{
    if(tag.attributes && tag.attributes.viewBox) {
      width = tag.attributes.viewBox[2];
      height = tag.attributes.viewBox[3];
    }
  })
  return { width, height };
}

async function extractGlyphs(data, height) {
  let glyphs = [];
  await Promise.all(data.map(async tag => {
    if(xjs.if(tag, 'tag.attributes.d')) {
      const path = await prepare(tag.attributes.d, height)
      glyphs.push(path)
    }
  }))
  return glyphs;
}

function stackthedata({glyphs, id='rexfont', unicodePrefix='RX', dimentions}) {
  let count=0;
  let content = `<?xml version="1.0" standalone="no"?>\n`;
  content += `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >\n`;
  content += `<svg xmlns="http://www.w3.org/2000/svg">\n`;
  content += `<defs>\n`;
  content += `<font id="${id}" horiz-adv-x="${dimentions.width}">\n`;
  content += `<font-face 
    font-family="${id}"
    units-per-em="${dimentions.height}"
    ascent="${dimentions.height}"
    descent="${0}"
    />`;
  content += `<missing-glyph horiz-adv-x="${0}" />\n`;
  glyphs.forEach(glyph => {
    content += 
    `<glyph 
      glyph-name="icon${count}"
      unicode="${unicodePrefix}0-${count++}"
      horiz-adv-x="${dimentions.width}"
      d="${glyph}"/>\n`;    
  });
  content += `</font>\n`
  content += `</defs>\n`
  content += `</svg>\n`

  return content;
}

function prepare(path, height) {
  return parse.parseContourAsync(path)
  .then(parseFormat.parseFormatAbsoluteDirectly)
  .then(contours => glyphMatrix(contours, height))
  .then(putBackTheArrsAsObjs)
  .then(parse.attachStrContourDirectly)
}

function glyphMatrix(contours, height) {
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
      } else return coordinate;
      
      prevX = xjs.or([x, prevX]);
      prevY = xjs.or([y, prevY]);
      
      const a = 1; // Math.cos(1);
      const b = 0; // Math.sin(1);
      const c = 0; // b*(-1);
      const d = -1; // a;
      const e = 0; // x - (x*a) + (y*b);
      const f = height; // y - (x*b) - (y*a);

      if (key.indexOf('x') >= 0) return [key, a*x + c*y + e]; // X
      else if (key.indexOf('y') >= 0) return [key, b*x + d*y + f]; // Y
    })
  })
}

function putBackTheArrsAsObjs(contoursArr) {
  const arr = [];
  contoursArr.forEach(contour => {
    const obj = {};
    contour.forEach(coordinate => {
      obj[`${coordinate[0]}`] = coordinate[1]
    })
    arr.push(obj)
  })
  return arr;
}

module.exports = parseSvgfont;