function generateTTF(font, output) {
  // contours
  // 1. parse the path
  font = Tools.pathParser(font)
  // 2. convert all to absolote
  // .then(Contour.convertToRelative)
  // .then(Contour.convertToAbsolote)
  .then((path) => Transform.convert(path, output))
  // 3. contours => have the record of x and y in each line
  .then((font) => Parse.contourToString(font));
}

class Parse {
  static contourToString(font) {
    let string = '';
    font.forEach((glyphs) => {
      glyphs.contour.forEach((glyph) => {
        // generate string format of each glyph
        let strformat = `${glyph.name}`;
        for (const [key, value] of Object.entries(glyph)) {
          if (key !== 'name') strformat += ` ${value}`;
        }
        string += `${strformat} `;
      });
    });
    console.log(string.trim());
  }

  static getGlyphs(font) {
    const glyphs = [];
    font.forEach((element) => element.tag == 'glyph' ? glyphs.push(element) : null);
    return glyphs;
  }

  static parsePath(d) {
    const contours = [];
    Parse.exploitFullD(d).forEach((fullExploit) => contours.push(Parse.exploitSingleD(fullExploit)));
    return contours;
  }

  static exploitFullD(data) {
    return Parse.exploit(data, /[n{a-zA-Z}]/g);
  }

  static exploitSingleD(data) {
    const symbol = data[0];
    data = data.substring(1, data.length);
    // exploiting the string
    const arr = Parse.exploit(data, /[n{a-zA-Z} -]/g);
    return [symbol, ...arr.map((item) => parseFloat(item))];
  }

  static exploit(data, regExp) {
    const indexes = [0];
    const ans = [];
    let match;
    // Remove the ',' symbols
    data = data.replace(/,/g, ' ');
    while ((match = regExp.exec(data)) != null) indexes.push(match.index);
    // Add the end of the data if not included
    for (let i = 0; i <= indexes.length; i++) {
      const prev = indexes[i-1<0 ? 0 : i-1];
      const current = indexes[i];
      const result = data.slice(prev, current);
      if (result.trim().length>0) ans.push(result.trim());
    }
    return ans;
  }
}


class Transform {
  static convert(font, output) {
    return font.map((item, key) =>
      font[key] = item.tag == 'glyph' ?
      {
        ...item,
        contour: this.assign(item.contour, output),
      } : item,
    );
  }

  static assign(glyph, output) {
    let GX=0; let GY=0; const contours = [];
    glyph.forEach((point) => {
      // convert
      const parsed = this.process(point, output, GX, GY);
      // store the global x and y based on the local x/y of each path command
      GX = parsed.localx || GX;
      GY = parsed.localy || GY;
      // store the parsed point
      contours.push(parsed.data);
    });
    return contours;
  }

  static process(point, output, gx, gy) {
    // is the the requested format and the current format were the same, then no change is required
    const outputBool = output==='absolute';
    const isAbs = Tools.isAbs(point[0]);
    const tmpIsAbs = (outputBool === isAbs);
    const init = [(tmpIsAbs ? 0 : gx), (tmpIsAbs ? 0 : gy)];
    // Set the output name format based on the requested format
    const name = outputBool ? point[0].toUpperCase() : point[0].toLowerCase();
    // set the global x and y in array so that we can decide which to use by [key % 2]
    const g = [gx, gy];
    switch (point[0]) {
      case 'a':
      case 'A': return this.a(point, g, name, tmpIsAbs, outputBool, init);
      case 'v':
      case 'V': return this.v(point, g, name, tmpIsAbs, outputBool, init);
      case 'h':
      case 'H': return this.h(point, g, name, tmpIsAbs, outputBool, init);
      default: return this.generalTranform(point, g, name, tmpIsAbs, outputBool, init);
    }
  }

  static generalTranform(point, g, name, tmpIsAbs, outputBool, init) {
    // preset the name in answer object and then remove the name property from the the 'point' object
    const ans = {data: {name}};
    // remove the name property
    point = point.slice(1);
    point.forEach((coordinate, key) => {
      // the set (x1, y1), (x2, y2)
      const SET = key % 2;
      // figure the symbol of the coordinate based on the SET
      const symbol = SET ? 'y' : 'x';
      // figure the coordinates set count
      const setNum = key+2 >= point.length ? '' : key/2 + 1;
      if (!setNum.length) ans[`local${symbol}`] = coordinate + (outputBool ? init[SET] : (tmpIsAbs ? g[SET] : 0));
      // combine the sy,bol and set num and then addup the current coordinate with the global x or y
      ans.data[`${symbol}${setNum}`] = coordinate + (outputBool ? init[SET] : -init[SET]);
    });
    return ans;
  }

  static a(point, g, name, tmpIsAbs, outputBool, init) {
    return ({
      data: {
        name,
        // the x1, y1 don't need no processing
        x1: point[1],
        y1: point[2],
        // the rotate, large_arc_flag, sweep_flagare not coordinates to process
        rotate: point[3],
        large_arc_flag: point[4],
        sweep_flag: point[5],
        // ending point
        x: point[6] + (outputBool ? init[0] : -init[0]),
        y: point[7] + (outputBool ? init[1] : -init[1]),
      },
      localx: point[6] + (outputBool ? init[0] : ( tmpIsAbs ? g[0] : 0)),
      localy: point[7] + (outputBool ? init[1] : ( tmpIsAbs ? g[1] : 0)),
    });
  }

  static v(point, g, name, tmpIsAbs, outputBool, init) {
    return ({
      data: {
        name,
        y: point[1] + (outputBool ? init[1] : -init[1]),
      },
      localy: point[1] + (outputBool ? init[1] : (tmpIsAbs ? g[1] : 0)),
    });
  }

  static h(point, g, name, tmpIsAbs, outputBool, init) {
    return ({
      data: {
        name,
        x: point[1] + (outputBool ? init[0] : -init[0]),
      },
      localx: point[1] + (outputBool ? init[0] : (tmpIsAbs ? g[0] : 0)),
    });
  }
}

class Contour {
  static convertToAbsolote(font) {
    return font.map((item, key) =>
      font[key] = item.tag == 'glyph' ?
      {
        ...item,
        contour: parseAbsolute.assign(item.contour),
      } : item,
    );
  }

  static convertToRelative(font) {
    return font.map((item, key) =>
      font[key] = item.tag == 'glyph' ?
      {
        ...item,
        contour: parseRelative.assign(item.contour),
      } : item,
    );
  }
}

class Tools {
  static isCap(char) {
    if (char == char.toUpperCase()) return true;
    return false;
  }
  static isAbs(point) {
    return Tools.isCap(point[0]);
  }
  static pathParser(font) {
    font.forEach((item, key) => item.tag == 'glyph' ? font[key].contour = Parse.parsePath(item.attributes.d) : null);
    return Promise.resolve(font);
  }
}


generateTTF(
    [{'tag': 'glyph', 'attributes': {'d': 'M 150 0 a 100 50 0 1 1 300 250 A 100 50 0 1 1 300 250 a 100 50 0 1 1 300 250 L 75 200 V20 h20 l 225 200 L 75 200 Z'}, 'content': '\n', 'selfClosing': true}], 'absolute',
);
// [{"tag":"glyph","attributes":{"d":"M3892.81,1455.72H3664.45a17.69,17.69,0,0,1-17.7-17.7V448a17.69,17.69,0,0,1,17.7-17.7h228.36A83.72,83.72,0,0,1,3976.53,514v858A83.72,83.72,0,0,1,3892.81,1455.72Z"},"content":"\n","selfClosing":true}]

// generateTTF(
//   [{"tag":"?xml","attributes":{"version":"1.0","standalone":"no"},"content":"\n","opening":true},{"tag":"!DOCTYPE","attributes":{},"attrLess":"svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"","content":"\n","opening":true},{"tag":"svg","attributes":{"xmlns":"http://www.w3.org/2000/svg"},"content":"\n","opening":true},{"tag":"defs","attributes":{},"content":"\n","opening":true},{"tag":"font","attributes":{"id":"rexfont","horiz-adv-x":"4000"},"content":"\n","opening":true},{"tag":"font-face","attributes":{"font-family":"rexfont","units-per-em":"1884","ascent":"1884","descent":"0"},"content":null,"selfClosing":true},{"tag":"missing-glyph","attributes":{"horiz-adv-x":"4000"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon0","unicode":"RX0-0","horiz-adv-x":"4000","d":"M3892.81,1455.72H3664.45a17.69,17.69,0,0,1-17.7-17.7V448a17.69,17.69,0,0,1,17.7-17.7h228.36A83.72,83.72,0,0,1,3976.53,514v858A83.72,83.72,0,0,1,3892.81,1455.72Z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon1","unicode":"RX0-1","horiz-adv-x":"4000","d":"M3354.92,127.66a75.07,75.07,0,0,1,74.52,74.52V1683.82a75.07,75.07,0,0,1-74.52,74.52H208a75.07,75.07,0,0,1-74.52-74.52V202.18A75.07,75.07,0,0,1,208,127.66H3354.92m0-110H208c-101.49,0-184.52,83-184.52,184.52V1683.82c0,101.48,83,184.52,184.52,184.52H3354.92c101.49,0,184.52-83,184.52-184.52V202.18c0-101.48-83-184.52-184.52-184.52Z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon2","unicode":"RX0-2","horiz-adv-x":"4000","d":"M433.56 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon3","unicode":"RX0-3","horiz-adv-x":"4000","d":"M799.58 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon4","unicode":"RX0-4","horiz-adv-x":"4000","d":"M1170.3500000000001 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon5","unicode":"RX0-5","horiz-adv-x":"4000","d":"M1536.3600000000001 430.78h167.26999999999998a 29.95 29.95 0 0 1 29.95 29.95v964.5500000000001a 29.95 29.95 0 0 1 -29.95 29.95h-167.26999999999998a 29.95 29.95 0 0 1 -29.95 -29.95v-964.5500000000001a 29.95 29.95 0 0 1 29.95 -29.95z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon6","unicode":"RX0-6","horiz-adv-x":"4000","d":"M1703.63,431.28a29.48,29.48,0,0,1,29.45,29.45v964.54a29.49,29.49,0,0,1-29.45,29.46H1536.36a29.49,29.49,0,0,1-29.45-29.46V460.73a29.48,29.48,0,0,1,29.45-29.45h167.27m0-1H1536.36a30.54,30.54,0,0,0-30.45,30.45v964.54a30.55,30.55,0,0,0,30.45,30.46h167.27a30.54,30.54,0,0,0,30.45-30.46V460.73a30.54,30.54,0,0,0-30.45-30.45Z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon7","unicode":"RX0-7","horiz-adv-x":"4000","d":"M1913.47 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"glyph","attributes":{"glyph-name":"icon8","unicode":"RX0-8","horiz-adv-x":"4000","d":"M2279.49 430.28h167.26999999999998a 30.45 30.45 0 0 1 30.45 30.45v964.5500000000001a 30.45 30.45 0 0 1 -30.45 30.45h-167.26999999999998a 30.45 30.45 0 0 1 -30.45 -30.45v-964.5500000000001a 30.45 30.45 0 0 1 30.45 -30.45z"},"content":"\n","selfClosing":true},{"tag":"/font","opening":false},{"tag":"/defs","opening":false},{"tag":"/svg","opening":false}]
// )
