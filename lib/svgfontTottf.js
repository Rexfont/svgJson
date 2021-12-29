
function generateTTF(font) {
  // contours
  // 1. parse the path
  font = Contour.pathParser(font)
  // 2. convert all to absolote
  .then(Contour.convertToAbsolote)
  // 3. contours => have the record of x and y in each line



}

class Helper {

  static getGlyphs(font) {
    let glyphs = [];
    font.forEach(element => element.tag == 'glyph' ? glyphs.push(element) : null);
    return glyphs;
  }

  static parsePath(d) {
    const contours = [];
    Helper.exploitFullD(d).forEach(fullExploit => contours.push(Helper.exploitSingleD(fullExploit)))
    return contours;
  }

  static exploitFullD(data) {
    return Helper.exploit(data, /[n{a-zA-Z}]/g);
  }
  static exploitSingleD(data) {
    const arr = Helper.exploit(data, /[n{a-zA-Z}, ]/g);
    // deleting the extra parts
    arr.forEach((item, key) => {
      if(item.substring(1, item.length).length>0) arr[key] = item.substring(1, item.length);
      else arr.splice(key, 1);
    })
    return [ data[0],  ...arr]
  }
  
  static exploit(data, regExp) {
    const indexes = [];
    const ans = [];
    let match;
    while ((match = regExp.exec(data)) != null) indexes.push(match.index);
    for (let i = 1; i <= indexes.length; i++) {
      const prev = indexes[i-1||0];
      const current = indexes[i];
      ans.push(data.slice(prev, current));
    }
    return ans;
  }

  static toContour(points) {
    var x=0, y=0;
    var contours = [];
    points.forEach(point => {
      switch(point[0]) {
        case 'm':
        case 'M':
          x = point[1];
          y = point[2] || 0;
          contours.push({data: point, x, y})
          break;
        case 'h':
          x += point[1];
          contours.push({data: point, x, y})
          break;
        case 'v':
          y += point[1];
          contours.push({data: point, x, y})
          break;
        default:

      }
    })
  }
}

class Contour {

  static pathParser(font) {
    font.forEach((item, key) => item.tag == 'glyph' ? font[key].contour = Helper.parsePath(item.attributes.d) : null)
    return Promise.resolve(font);
  }

  static convertToAbsolote(font) {
    font.forEach((item, key) => item.tag == 'glyph' ? font[key].contour = Helper.toContour(item.contour) : null)
  }

}

class Tools {
  static isCap(char) {
    if(char == char.toUpperCase()) return true;
    return false
  }
  static isAbs(point) {
    return Tools.isCap(point[0])
  }
}

generateTTF(
  [{"tag":"?xml","attributes":{"version":"1.0","standalone":"no"},"content":"\n","opening":true},{"tag":"!DOCTYPE","attributes":{},"attrLess":"svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"","content":"\n","opening":true},{"tag":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg"},"content":"\n","opening":true},{"tag":"defs","attributes":{},"content":"\n","opening":true},{"tag":"font","attributes":{"id":"rexfont","horiz-adv-x":"4000"},"content":"\n","opening":true},{"tag":"font-face","attributes":{"font-family":"rexfont","units-per-em":"1884","ascent":"1884","descent":"0"},"content":null,"selfClosing":true},{"tag":"missing-glyph","attributes":{"horiz-adv-x":"4000"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon0","unicode":"RX0-0","horiz-adv-x":"4000","d":"M3892.81,1455.72H3664.45a17.69,17.69,0,0,1-17.7-17.7V448a17.69,17.69,0,0,1,17.7-17.7h228.36A83.72,83.72,0,0,1,3976.53,514v858A83.72,83.72,0,0,1,3892.81,1455.72Z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon1","unicode":"RX0-1","horiz-adv-x":"4000","d":"M3354.92,127.66a75.07,75.07,0,0,1,74.52,74.52V1683.82a75.07,75.07,0,0,1-74.52,74.52H208a75.07,75.07,0,0,1-74.52-74.52V202.18A75.07,75.07,0,0,1,208,127.66H3354.92m0-110H208c-101.49,0-184.52,83-184.52,184.52V1683.82c0,101.48,83,184.52,184.52,184.52H3354.92c101.49,0,184.52-83,184.52-184.52V202.18c0-101.48-83-184.52-184.52-184.52Z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon2","unicode":"RX0-2","horiz-adv-x":"4000","d":"M433.56 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon3","unicode":"RX0-3","horiz-adv-x":"4000","d":"M799.58 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon4","unicode":"RX0-4","horiz-adv-x":"4000","d":"M1170.3500000000001 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon5","unicode":"RX0-5","horiz-adv-x":"4000","d":"M1536.3600000000001 430.78h167.26999999999998a 29.95 29.95 0 0 1 29.95 29.95v964.5500000000001a 29.95 29.95 0 0 1 -29.95 29.95h-167.26999999999998a 29.95 29.95 0 0 1 -29.95 -29.95v-964.5500000000001a 29.95 29.95 0 0 1 29.95 -29.95z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon6","unicode":"RX0-6","horiz-adv-x":"4000","d":"M1703.63,431.28a29.48,29.48,0,0,1,29.45,29.45v964.54a29.49,29.49,0,0,1-29.45,29.46H1536.36a29.49,29.49,0,0,1-29.45-29.46V460.73a29.48,29.48,0,0,1,29.45-29.45h167.27m0-1H1536.36a30.54,30.54,0,0,0-30.45,30.45v964.54a30.55,30.55,0,0,0,30.45,30.46h167.27a30.54,30.54,0,0,0,30.45-30.46V460.73a30.54,30.54,0,0,0-30.45-30.45Z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon7","unicode":"RX0-7","horiz-adv-x":"4000","d":"M1913.47 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon8","unicode":"RX0-8","horiz-adv-x":"4000","d":"M2279.49 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"/font","opening":false},{"tag":"/defs","opening":false},{"tag":"/svg","opening":false}]
)