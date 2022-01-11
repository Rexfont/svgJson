const tools = require('../helpers/tools')
const validator = require('../helpers/validator')

function parseSvgfont(data, unicodePrefix, id) {
  console.log('svgicontosvgfont');
  if(!data) throw 'Invalid Data to convert';
  if(tools.isSvg(data)) throw 'The DATA is expected to be JSON'

  return validator.jsonValidation(data)
  .then(data => 
    stackthedata({
      glyphs: extractGlyphs(data),
      id,
      unicodePrefix:unicodePrefix,
      dimesions: getDimensions(data)
    })
  );
}

function getDimensions(data) {
  let width = height = 0;
  data.forEach(tag=>{
    if(tag.attributes.viewBox) {
      width = tag.attributes.viewBox[2];
      height = tag.attributes.viewBox[3];
    }
  })
  return { width, height };
}

function extractGlyphs(data) {
  let glyphs = [];
  data.forEach(tag=>{
    if(tag.attributes.d) glyphs.push(tag.attributes.d)
  })
  return glyphs;
}

function stackthedata({glyphs, id='rexfont', unicodePrefix='RX', dimesions}) {
  let count=0;
  let content = `<?xml version="1.0" standalone="no"?>\n`;
  content += `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >\n`;
  content += `<svg xmlns="http://www.w3.org/2000/svg">\n`;
  content += `<defs>\n`;
  content += `<font id="${id}" horiz-adv-x="${dimesions.width}">\n`;
  content += `<font-face 
    font-family="${id}"
    units-per-em="${dimesions.height}"
    ascent="${dimesions.height}"
    descent="${0}"
    />`;
  content += `<missing-glyph horiz-adv-x="${dimesions.width}" />\n`;
  glyphs.forEach(glyph => {
    content += 
    `<glyph 
      glyph-name="icon${count}"
      unicode="${unicodePrefix}0-${count++}"
      horiz-adv-x="${dimesions.width}"
      d="${glyph}"/>\n`;    
  });
  content += `</font>\n`
  content += `</defs>\n`
  content += `</svg>\n`

  return content;
}


module.exports = parseSvgfont;