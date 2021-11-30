function convert(data, id, fontFamily, unicodePrefix) {
  if(typeof data == 'string') data = JSON.parse(data)
  const horizAdvX = 0;
  let content = `<?xml version="1.0" standalone="no"?>\n`;
  content += `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >\n`;
  content += `<svg xmlns="http://www.w3.org/2000/svg">\n`;
  content += `<defs>\n`;
  content += `<font id="${id}" horiz-adv-x="${horizAdvX}">\n`;
  content += `<font-face 
    font-family="${fontFamily}"/>\n`;
    // font-weight="${fontFamily}"
    // font-style="${fontFamily}"
    // units-per-em="${fontFamily}"
    // cap-height="${fontFamily}"
    // x-height="${fontFamily}"
    // ascent="${fontFamily}"
    // descent="${fontFamily}"
    // alphabetic="${fontFamily}"
    // mathematical="${fontFamily}"
    // ideographic="${fontFamily}"
    // hanging="${fontFamily}"
  content += `<missing-glyph horiz-adv-x="0" />\n`;
  let count=0;
  Object.keys(data).forEach(tag => {
    if(data[tag]['tag'] === 'path') {
      content += 
      `<glyph 
        glyph-name="icon${count}"
        unicode="${unicodePrefix}0-${count}"
        horiz-adv-x="0"
        d="${data[tag].attributes.d}"/>\n`;
      count++;
    }
  });
  content += `</font>\n`
  content += `</defs>\n`
  content += `</svg>\n`
  console.log(content);
}

// convert(
//   '[{"tag":"svg","attributes":{"class":null,"id":"Layer_2","data-name":"Layer 2","xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 4000 1874"},"content":null,"opening":true},{"tag":"defs","attributes":{"class":null,"id":null},"content":null,"opening":true},{"tag":"style","attributes":{"class":null,"id":null},"content":".cls-1{fill:#495057;}.cls-2{opacity:0.6;}","opening":true},{"tag":"/style","opening":false,"attributes":{"class":null,"id":null}},{"tag":"/defs","opening":false,"attributes":{"class":null,"id":null}},{"tag":"path","attributes":{"class":"cls-1","id":null,"d":"M3892.81,1451.72H3664.45a17.69,17.69,0,0,1-17.7-17.7V444a17.69,17.69,0,0,1,17.7-17.7h228.36A83.72,83.72,0,0,1,3976.53,510v858A83.72,83.72,0,0,1,3892.81,1451.72Z"},"content":null,"selfClosing":true},{"tag":"path","attributes":{"class":"cls-1","id":null,"d":"M3354.92,193.66a5.12,5.12,0,0,1,4.52,4.52V1679.82a5.12,5.12,0,0,1-4.52,4.52H208a5.12,5.12,0,0,1-4.52-4.52V198.18a5.12,5.12,0,0,1,4.52-4.52H3354.92m0-180H208c-101.48,0-184.52,83-184.52,184.52V1679.82c0,101.48,83,184.52,184.52,184.52H3354.92c101.49,0,184.52-83,184.52-184.52V198.18c0-101.48-83-184.52-184.52-184.52Z"},"content":null,"selfClosing":true},{"tag":"g","attributes":{"class":"cls-2","id":null},"content":null,"opening":true},{"tag":"path","attributes":{"class":"cls-1","id":null,"d":"M433.56 429.28h2017.9899999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-2017.9899999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":null,"selfClosing":true},{"tag":"/g","opening":false,"attributes":{"class":null,"id":null}},{"tag":"/svg","opening":false,"attributes":{"class":null,"id":null}}]',
//   'sasho',
//   'sasho font',
//   'RX'
// )



// separate them
function separateToLines(data) {
  const indexes = [];
  const ans = [];
  const regExp = /[n{a-zA-Z}]/g;
  while ((match = regExp.exec(data)) != null) indexes.push(match.index);
  for (let i = 1; i <= indexes.length; i++) {
    const prev = indexes[0||i-1];
    const current = indexes[i];
    ans.push(data.slice(prev, current));
  }
  return ans;
}

// convertPathToJson('M382.1 446.7l-168-400c-7.469-17.81-36.78-17.81-44.25 0l-168 400c-5.141 12.22 .6094 26.3 12.83 31.42c12.25 5.156 26.3-.6094 31.42-12.83l33.79-80.45h224.2l33.79 80.45C341.7 474.5 350.6 480 360 480c3.094 0 6.25-.5938 9.281-1.875C381.5 473 387.3 458.9 382.1 446.7zM100.1 336.8L192 117.1l91.92 218.9H100.1z')
// console.log(
  // );
(async () => {
  // const data = 'M382.1 446.7l-168-400c-7.469-17.81-36.78-17.81-44.25 0l-168 400c-5.141 12.22 .6094 26.3 12.83 31.42c12.25 5.156 26.3-.6094 31.42-12.83l33.79-80.45h224.2l33.79 80.45C341.7 474.5 350.6 480 360 480c3.094 0 6.25-.5938 9.281-1.875C381.5 473 387.3 458.9 382.1 446.7zM100.1 336.8L192 117.1l91.92 218.9H100.1z';
  const data = 'M382.1 446.7l-168-400L46 446';
  const linedUp = separateToLines(data);
  const ans1 = followUptheLine({svgdata:convertPathToJson(linedUp), meta:true});
  const ans2 = followUptheLine({svgdata:convertPathToJson(linedUp), allRelative:true});
  console.log(JSON.stringify(ans1));
  console.log(JSON.stringify(ans2));
})()


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



// console.log(
//   JSON.stringify(
//     convertAllToRelative(
//       '[{"name":"M","data":[["382.1","446.7"]]},{"name":"l","data":[["-168","-400"]]},{"name":"L","data":[["46","446"]]}]',
//       true
//     )
//   )
// );
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
    tmpData = [[], ...tmpData];
    // tmpData.forEach((item, key)=>{
    //   tmpData[0]
    // })
  }
  if(meta) 
    return {
      width: (maxX - minX)/5,
      height: (maxY - minY)/5,
    }
  return tmpData;
}


/**
 * ######## Bring the additional data generation to svgjson module ##################
 */