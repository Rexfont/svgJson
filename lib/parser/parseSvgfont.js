const tools = require('../helpers/tools')
const validator = require('../helpers/validator')
const parse = require('../helpers/parse')
const parseFormat = require('./parseFormat')
const xjs = require('@axoncodes/xjs');

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
  let styles;
  let classes = [];
  await Promise.all(data.map(async (tag, key) => {
    if(xjs.if(tag, 'tag.attributes.d')) {
      const path = await prepare(tag.attributes.d, height);
      let tmpClass = classes[key-1] ? `.${classes[key-1]}` : null;
      let thestyleStr = '';
      if (styles && tmpClass) {
        styles.forEach(style => {
          if (style[0] == tmpClass) {
            style[1].forEach(substyle => {
              thestyleStr += `${substyle[0]}="${substyle[1]}" `;
            })
          }
        })
      }

      glyphs.push({path, thestyleStr})
    }else if(xjs.if(tag, 'tag.style')) styles = tag.style;
    
    classes.push(xjs.if(tag, 'tag.attributes.class') ? tag.attributes.class : '');
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
      ${glyph.thestyleStr}
      glyph-name="icon${count}"
      unicode="${unicodePrefix}0-${count++}"
      horiz-adv-x="0"
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
  .then(parse.roundup)
  .then(putBackTheArrsAsObjs)
  .then(parse.attachStrContourDirectly)
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