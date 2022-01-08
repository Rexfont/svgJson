function contourToString(font) {
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

function getGlyphs(font) {
  const glyphs = [];
  font.forEach((element) => element.tag == 'glyph' ? glyphs.push(element) : null);
  return glyphs;
}

function parsePath(d) {
  const contours = [];
  exploitFullD(d).forEach((fullExploit) => contours.push(exploitSingleD(fullExploit)));
  return contours;
}

function exploitFullD(data) {
  return exploit(data, /[n{a-zA-Z}]/g);
}

function exploitSingleD(data) {
  const symbol = data[0];
  data = data.substring(1, data.length);
  // exploiting the string
  const arr = exploit(data, /[n{a-zA-Z} -]/g);
  return [symbol, ...arr.map((item) => parseFloat(item))];
}

function exploit(data, regExp) {
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

function pathParser(font) {
  font.forEach((item, key) => item.tag == 'glyph' ? font[key].contour = parsePath(item.attributes.d) : null);
  return Promise.resolve(font);
}

module.exports = {
  pathParser,
  contourToString,
}