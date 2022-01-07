
function generateTTF(font) {
  // contours
  // 1. parse the path
  font = Contour.pathParser(font)
  // 2. convert all to absolote
  .then(Contour.convertToAbsolote)
  // 3. contours => have the record of x and y in each line
  .then((font) => console.log(font[0].contour))

}

class Parse {

  static getGlyphs(font) {
    let glyphs = [];
    font.forEach(element => element.tag == 'glyph' ? glyphs.push(element) : null);
    return glyphs;
  }

  static parsePath(d) {
    const contours = [];
    Parse.exploitFullD(d).forEach(fullExploit => contours.push(Parse.exploitSingleD(fullExploit)))
    return contours;
  }

  static exploitFullD(data) {
    return Parse.exploit(data, /[n{a-zA-Z}]/g);
  }

  static exploitSingleD(data) {
    const symbol = data[0];
    data = data.substring(1, data.length);
    let arr = Parse.exploit(data, /[n{a-zA-Z}, -]/g);
    // remove extra parts from eacg point
    arr = arr.map(item => item[0] === ',' ? item.substring(1, item.length) : item);
    // arr.forEach((item, key) => {
    //   // item = item.trim();
    //   if(item.substring(1, item.length).length>0) arr[key] = item.substring(item.indexOf('-')==0 ? 0 : 1, item.length);
    //   else arr.splice(key, 1);
    // })
    return [
      symbol,
      // parse the string points to float
      ...arr.map(item => parseFloat(item))
      ]
  }
  
  static exploit(data, regExp) {
    const indexes = [0];
    const ans = [];
    let match;
    while ((match = regExp.exec(data)) != null) indexes.push(match.index);
    // Add the end of the data if not included
    // indexes.push(data.length/-1);
    for (let i = 0; i <= indexes.length; i++) {
      const prev = indexes[i-1<0 ? 0 : i-1];
      const current = indexes[i];
      const result = data.slice(prev, current);
      if(result.trim().length>0) ans.push(result.trim());
    }
    return ans;
  }
}

class Contour {

  static pathParser(font) {
    font.forEach((item, key) => item.tag == 'glyph' ? font[key].contour = Parse.parsePath(item.attributes.d) : null)
    return Promise.resolve(font);
  }

  static convertToAbsolote(font) {
    return font.map((item, key) => 
      font[key] = item.tag == 'glyph' 
      ? {
        ...item,
        contour: transform.convert(item.contour),
      } : item
    )
  }

}

class transform {
  
  static convert(glyph) {
    let GX=0, GY=0, contours = [];
    glyph.forEach(point => {
      const { data, gx, gy } = transform.assign(point, GX, GY);
      data.str = `${data.name}${data.x ? ` ${data.x}` : ''}${data.y ? ` ${data.y}` : ''}`;
      contours.push(data);
      GX = gx, GY = gy;
    });
    return contours;
  }

  static assign(point, gx, gy) {
    const isAbs = Tools.isAbs(point[0]);
    switch(point[0]) {
      case 'm':
      case 'M': return transform.m(point);
      case 'h':
      case 'H': return transform.h(point, gx, gy, isAbs);
      case 'v':
      case 'V': return transform.v(point, gx, gy, isAbs);
      case 'l':
      case 'L': return transform.l(point, gx, gy, isAbs);
      case 'a':
      case 'A': return transform.a(point, gx, gy, isAbs);
      case 'c':
      case 'C': return transform.c(point, gx, gy, isAbs);
      case 'z':
      case 'Z': return transform.z(gx, gy);
    }
  }

  static m(point) {
    let xsum = point[1];
    let ysum = point[2];
    return ({
      data: {
        name: 'M',
        x: xsum,
        y: ysum,
      },
      gx: xsum,
      gy: ysum,
    })
  }

  static c(point, gx, gy, isAbs) {
    const initX = (isAbs ? 0 : gx);
    const initY = (isAbs ? 0 : gy);
    return ({
      data: {
        name: 'A',
        x1: initX + point[1],
        y1: initY + point[2],
        x2: initX + point[3],
        y2: initY + point[4],
        x: initX + point[5],
        y: initY + point[6],
      },
      gx: xsum,
      gy: ysum,
    })
  }

  static a(point, gx, gy, isAbs) {
    let xsum = (isAbs ? 0 : gx) + point[1];
    let ysum = (isAbs ? 0 : gy) + point[2];
    return ({
      data: {
        name: 'C',
        x1: point[1],
        y1: point[2],
        rotate: point[3],
        large_arc_flag: point[4],
        sweep_flag: point[5],
        x: xsum,
        y: ysum,
      },
      gx: xsum,
      gy: ysum,
    })
  }

  static l(point, gx, gy, isAbs) {
    let xsum = (isAbs ? 0 : gx) + point[1];
    let ysum = (isAbs ? 0 : gy) + point[2];
    return ({
      data: {
        name: 'L',
        x: xsum,
        y: ysum,
      },
      gx: xsum,
      gy: ysum,
    })
  }

  static z(gx, gy) {
    return ({
      data: {
        name: 'Z',
      },
      gx,
      gy,
    })
  }

  static v(point, gx, gy, isAbs) {
    let ysum = (isAbs ? 0 : gy) + point[1];
    return ({
      data: {
        name: 'V',
        y: ysum,
      },
      gx,
      gy: ysum,
    })
  }

  static h(point, gx, gy, isAbs) {
    let xsum = (isAbs ? 0 : gx) + point[1];
    return ({
      data: {
        name: 'H',
        x: xsum,
      },
      gx: xsum,
      gy,
    });
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
  [{"tag":"glyph","attributes":{"d":"M 125,75 l 10 10 a 100,50 180 0,0 100,50 z"},"content":"\n","selfClosing":true}]
)

// generateTTF(
//   [{"tag":"?xml","attributes":{"version":"1.0","standalone":"no"},"content":"\n","opening":true},{"tag":"!DOCTYPE","attributes":{},"attrLess":"svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"","content":"\n","opening":true},{"tag":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg"},"content":"\n","opening":true},{"tag":"defs","attributes":{},"content":"\n","opening":true},{"tag":"font","attributes":{"id":"rexfont","horiz-adv-x":"4000"},"content":"\n","opening":true},{"tag":"font-face","attributes":{"font-family":"rexfont","units-per-em":"1884","ascent":"1884","descent":"0"},"content":null,"selfClosing":true},{"tag":"missing-glyph","attributes":{"horiz-adv-x":"4000"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon0","unicode":"RX0-0","horiz-adv-x":"4000","d":"M3892.81,1455.72H3664.45a17.69,17.69,0,0,1-17.7-17.7V448a17.69,17.69,0,0,1,17.7-17.7h228.36A83.72,83.72,0,0,1,3976.53,514v858A83.72,83.72,0,0,1,3892.81,1455.72Z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon1","unicode":"RX0-1","horiz-adv-x":"4000","d":"M3354.92,127.66a75.07,75.07,0,0,1,74.52,74.52V1683.82a75.07,75.07,0,0,1-74.52,74.52H208a75.07,75.07,0,0,1-74.52-74.52V202.18A75.07,75.07,0,0,1,208,127.66H3354.92m0-110H208c-101.49,0-184.52,83-184.52,184.52V1683.82c0,101.48,83,184.52,184.52,184.52H3354.92c101.49,0,184.52-83,184.52-184.52V202.18c0-101.48-83-184.52-184.52-184.52Z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon2","unicode":"RX0-2","horiz-adv-x":"4000","d":"M433.56 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon3","unicode":"RX0-3","horiz-adv-x":"4000","d":"M799.58 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon4","unicode":"RX0-4","horiz-adv-x":"4000","d":"M1170.3500000000001 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon5","unicode":"RX0-5","horiz-adv-x":"4000","d":"M1536.3600000000001 430.78h167.26999999999998a 29.95 29.95 0 0 1 29.95 29.95v964.5500000000001a 29.95 29.95 0 0 1 -29.95 29.95h-167.26999999999998a 29.95 29.95 0 0 1 -29.95 -29.95v-964.5500000000001a 29.95 29.95 0 0 1 29.95 -29.95z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon6","unicode":"RX0-6","horiz-adv-x":"4000","d":"M1703.63,431.28a29.48,29.48,0,0,1,29.45,29.45v964.54a29.49,29.49,0,0,1-29.45,29.46H1536.36a29.49,29.49,0,0,1-29.45-29.46V460.73a29.48,29.48,0,0,1,29.45-29.45h167.27m0-1H1536.36a30.54,30.54,0,0,0-30.45,30.45v964.54a30.55,30.55,0,0,0,30.45,30.46h167.27a30.54,30.54,0,0,0,30.45-30.46V460.73a30.54,30.54,0,0,0-30.45-30.45Z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon7","unicode":"RX0-7","horiz-adv-x":"4000","d":"M1913.47 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon8","unicode":"RX0-8","horiz-adv-x":"4000","d":"M2279.49 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"/font","opening":false},{"tag":"/defs","opening":false},{"tag":"/svg","opening":false}]
// )