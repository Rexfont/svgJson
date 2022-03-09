const xjs = require('@axoncodes/xjs')

function lookupNaN(jsonData) {
  jsonData.forEach(tag => {
    if (xjs.if(tag, 'tag.attributes.d')) return tag.attributes.d.indexOf('NaN')
  });
}

function isCap(char) {
  if (char == char.toUpperCase()) return true;
  return false;
}

function isAbs(point){
  return isCap(point[0])
}

function isSvg(data) {
  return data.indexOf('<') == 0
}

function repeatesF(data) {
  var obj={}
  for(let x = 0, length = data.length; x < length; x++) {
      var l = data.charAt(x)
      obj[l] = (isNaN(obj[l]) ? 1 : obj[l] + 1);
  }
  return obj
}

function isFile(data) {
  return !data.match(/[^n{a-z,A-Z,0-9},.,/,:,\\,_,-,  , -]/)
}

function removecommas(str) {
  return str.replace(/,/g, ' ');
}

function exploit(value, regExp) {
  const indexes = [0];
  const ans = [];
  let match;
  while ((match = regExp.exec(value)) != null) indexes.push(match.index);
  // Add the end of the data if not included
  for (let i = 0; i <= indexes.length; i++) {
    const prev = indexes[i-1<0 ? 0 : i-1];
    const current = indexes[i];
    const result = value.slice(prev, current);
    if (result.trim().length>0) ans.push(result.trim());
  }
  return ans
}

function lookupTag(svgjson, targetTagName) {
  let result = []
  svgjson.forEach((tag, key) => {
    if (tag.tag == targetTagName) {
      result.push({
        index: key,
        tag
      })
    }
  })
  return result

}

module.exports = {
  lookupNaN,
  lookupTag,
  isCap,
  isAbs,
  isSvg,
  repeatesF,
  isFile,
  removecommas,
  exploit,
}