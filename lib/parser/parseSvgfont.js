const tools = require('../helpers/tools')
const validator = require('../helpers/validator')
const parse = require('../helpers/parse')
const parseFormat = require('./parseFormat')

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
    if(tag.attributes && tag.attributes.d) {
      const path = await glyphMatrix(tag.attributes.d, height)
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

function glyphMatrix(path, maxHeight) {
  return parse.parseContourAsync(path)
  .then(contours => contours.map(contour => contour.flat()))
  .then(contours => parseFormat.directParseFormatAsync(contours, 'absolute'))
  // .then(contours => contours.map(contour => {
  //   if (contour.y) contour.y = maxHeight - contour.y;
  //   if (contour.y1) contour.y1 = maxHeight - contour.y1;
  //   if (contour.y2) contour.y2 = maxHeight - contour.y2;
  //   return contour
  // }))
  .then(parse.attachStrContourDirectly)
}


module.exports = parseSvgfont;