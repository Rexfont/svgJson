const xjs = require('@axoncodes/xjs');

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
  for(x = 0, length = data.length; x < length; x++) {
      var l = data.charAt(x)
      obj[l] = (isNaN(obj[l]) ? 1 : obj[l] + 1);
  }
  return obj
}

function isFile(data) {
  return !data.match(/[^n{a-z,A-Z,0-9},.,/,:,\\,_,-,  , -]/)
}

module.exports = {
  lookupNaN,
  isFile,
  repeatesF,
  isSvg,
  isCap,
  isAbs,
}