const tools = require('../helpers/tools');

function parseFormat(font, output) {
  return font.map((item, key) =>
    font[key] = item.contours ?
    {
      ...item,
      contour: assign(item.contours, output),
    } : item,
  );
}

function directParseFormat(contours, output) {
  return assign(contours, output)
}
function directParseFormatAsync(contours, output) {
  return Promise.resolve(directParseFormat(contours, output))
}

function assign(glyph, output) {
  let GX=0; let GY=0; const contours = [];
  glyph.forEach((point) => {
    // convert
    const parsed = process(point, output, GX, GY);
    // store the global x and y based on the local x/y of each path command
    GX = parsed.localx || GX;
    GY = parsed.localy || GY;
    // store the parsed point
    contours.push(parsed.data);
  });
  return contours;
}

function process(point, output, gx, gy) {
  // is the the requested format and the current format were the same, then no change is required
  const outputBool = output==='absolute';
  const isAbs = tools.isAbs(point[0]);
  const tmpIsAbs = (outputBool === isAbs);
  const init = [(tmpIsAbs ? 0 : gx), (tmpIsAbs ? 0 : gy)];
  // Set the output name format based on the requested format
  const name = outputBool ? point[0].toUpperCase() : point[0].toLowerCase();
  // set the global x and y in array so that we can decide which to use by [key % 2]
  const g = [gx, gy];
  switch (point[0]) {
    case 'a':
    case 'A': return a(point[1], g, name, tmpIsAbs, outputBool, init);
    case 'v':
    case 'V': return v(point[1], g, name, tmpIsAbs, outputBool, init);
    case 'h':
    case 'H': return h(point[1], g, name, tmpIsAbs, outputBool, init);
    case 'z':
    case 'Z': return z();
    default: return generalTranform(point[1], g, name, tmpIsAbs, outputBool, init);
  }
}

function generalTranform(point, g, name, tmpIsAbs, outputBool, init) {
  // preset the name in answer object and then remove the name property from the the 'point' object
  const ans = {data: {name}};
  point.forEach((coordinate, key) => {
    // the set (x1, y1), (x2, y2)
    const SET = key % 2;
    // figure the symbol of the coordinate based on the SET
    const symbol = SET ? 'y' : 'x';
    // figure the coordinates set count
    const setNum = (key+2 >= point.length ? '' : (key/2 - (SET ? 0.5 : 0)) + 1);
    if (!setNum.length) ans[`local${symbol}`] = coordinate + (outputBool ? init[SET] : (tmpIsAbs ? g[SET] : 0));
    // combine the sy,bol and set num and then addup the current coordinate with the global x or y
    ans.data[`${symbol}${setNum}`] = coordinate + (outputBool ? init[SET] : -init[SET]);
  });
  return ans;
}

function z() {
  return ({ data: { name: 'Z' } });
}

function a(point, g, name, tmpIsAbs, outputBool, init) {
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

function v(point, g, name, tmpIsAbs, outputBool, init) {
  return ({
    data: {
      name,
      y: point[0] + (outputBool ? init[1] : -init[1]),
    },
    localy: point[0] + (outputBool ? init[1] : (tmpIsAbs ? g[1] : 0)),
  });
}

function h(point, g, name, tmpIsAbs, outputBool, init) {
  return ({
    data: {
      name,
      x: point[0] + (outputBool ? init[0] : -init[0]),
    },
    localx: point[0] + (outputBool ? init[0] : (tmpIsAbs ? g[0] : 0)),
  });
}

module.exports = {
  parseFormat,
  assign,
  process,
  directParseFormat,
  directParseFormatAsync,
  parseFormatRelative: font => parseFormat(font, 'relative'),
  parseFormatAbsolute: font => parseFormat(font, 'absolute'),
  parseFormatRelativeDirectly: contour => assign(contour, 'relative'),
  parseFormatAbsoluteDirectly: contour => assign(contour, 'absolute'),
};