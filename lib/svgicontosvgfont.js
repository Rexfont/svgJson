
function convertPathToJson(data) {
  const ans = [];
  data.forEach((item, key)=>{
    const indexes = [];
    ans[key] = {};
    ans[key]['name'] = item[0];
    ans[key]['data'] = [];
    const tmpitem = item.slice(1);
    const regExp = /[^n{0-9}.]/g;
    while ((match = regExp.exec(tmpitem)) != null) indexes.push(match.index);
    if(indexes[0]!=0)indexes.push(0);
    indexes.sort();
    for (let i = 1; i <= indexes.length; i++) {
      const x = tmpitem.slice(indexes[0||i-1], indexes[i++]).trim();
      const y = i <= indexes.length?tmpitem.slice(indexes[0||i-1], indexes[i]).trim():null;
      ans[key]['data'].push([x, y])
    }
  })
  return ans;
}


function followUptheLine({svgdata, allRelative=false, meta=false}) {
  var tmpData = svgdata;
  if(typeof tmpData == 'string') tmpData = JSON.parse(tmpData);
  let minY = maxY = maxX = minX = 0;
  let localX = 0;
  let localY = 0;
  let M;
  if(tmpData[0].name == "M") {
    localX = parseFloat(tmpData[0].data[0][0]);
    localY = parseFloat(tmpData[0].data[0][1]);
    M = tmpData.slice(0, 1);
    tmpData = tmpData.slice(1);
    if(localX>=maxX) maxX = localX; else minX = localX;
    if(localY>=maxY) maxY = localY; else minY = localY;
  }
  tmpData.forEach((item, itemKey)=>{
    const regExp = /[^Mn{a-z}]/;
    if(item.name.match(regExp)) {
      item.name = item.name.toLowerCase();
      item.data.forEach((cordinates, cordinatesKey) => {
        const tempX = -(localX - parseFloat(cordinates[0]));
        const tempY = -(localY - parseFloat(cordinates[1]));
        if(allRelative) {
          tmpData[itemKey].data[cordinatesKey][0] = tempX
          tmpData[itemKey].data[cordinatesKey][1] = tempY
        }
        localX += tempX
        localY += tempY
      })
    }else{
      item.data.forEach(cordinates => {
        localX += parseFloat(cordinates[0])
        localY += parseFloat(cordinates[1])
      })
    }
    if(localX+1>=maxX) maxX = localX; else minX = localX;
    if(localY+1>=maxY) maxY = localY; else minY = localY;
  })
  if(M) {
    tmpData = [M, ...tmpData];
  }
  let returned = {};
  if(meta) {
    const width = maxX - minX;
    const height = maxY - minY;
    returned['meta'] = {
      raw: {width,height},
      px: {
        width: width/5,
        height: height/5,
      }
    }
  }
  returned['data'] = tmpData;
  console.log(maxY);
  return returned;
}


/**
 * ######## Bring the additional data generation to svgjson module ##################
 */








function convert(data, unicodePrefix, id) {
  console.log('svgicontosvgfont');
  if(typeof data == 'string') data = JSON.parse(data);
  const dimesions = getDimensions(data);
  const glyphs = extractGlyphs(data);
  const generatedData = stackthedata({glyphs, id, fontFamily:id, unicodePrefix:unicodePrefix, dimesions});
  return generatedData
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

function stackthedata({glyphs, id='rexfont', fontFamily='rexfont', unicodePrefix='RX', dimesions}) {
  let count=0;
  let content = `<?xml version="1.0" standalone="no"?>\n`;
  content += `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >\n`;
  content += `<svg xmlns="http://www.w3.org/2000/svg">\n`;
  content += `<defs>\n`;
  content += `<font id="${id}" horiz-adv-x="${dimesions.width}">\n`;
  content += `<font-face 
    font-family="${fontFamily}"
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


module.exports = convert;