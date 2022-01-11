function attachStrContour(font) {
  font.forEach((glyphs, key) => {
    if(glyphs.contour) {
      let string = '';
      glyphs.contour.forEach((glyph) => {
        // generate string format of each glyph
        let strformat = `${glyph.name}`;
        for (const [key, value] of Object.entries(glyph)) {
          if (key !== 'name') strformat += ` ${value}`;
        }
        string += `${strformat} `;
      });
      font[key].contour.str = string.trim();
    }
  });
  return font;
}

function getGlyphs(font) {
  const glyphs = [];
  font.forEach((element) => element.tag == 'glyph' ? glyphs.push(element) : null);
  return glyphs;
}

function parseContour(tag) {
  if(!tag || !tag.attributes || !tag.attributes.d) return tag;
  const contours = [];
  exploitFullD(tag.attributes.d).forEach(fullExploit => contours.push(exploitSingleD(fullExploit)));
  tag.contours = contours;
  return tag;
}

function exploitFullD(data) {
  if(!data) return null;
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
  font.forEach((item, key) => item.tag == 'glyph' ? font[key].contour = parseContour(item.attributes.d) : null);
  return Promise.resolve(font);
}

module.exports = {
  pathParser,
  attachStrContour,
  parseContour,
}