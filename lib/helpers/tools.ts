import xjs from '@axoncodes/xjs';

export function lookupNaN(jsonData) {
  jsonData.forEach(tag => {
    if (xjs.if(tag, 'tag.attributes.d')) return tag.attributes.d.indexOf('NaN')
  });
}

export function isCap(char) {
  if (char == char.toUpperCase()) return true;
  return false;
}

export function isAbs(point){
  return isCap(point[0])
}

export function isSvg(data) {
  return data.indexOf('<') == 0
}

export function repeatesF(data) {
  var obj={}
  for(let x = 0, length = data.length; x < length; x++) {
      var l = data.charAt(x)
      obj[l] = (isNaN(obj[l]) ? 1 : obj[l] + 1);
  }
  return obj
}

export function isFile(data) {
  return !data.match(/[^n{a-z,A-Z,0-9},.,/,:,\\,_,-,  , -]/)
}

export function removecommas(str) {
  return str.replace(/,/g, ' ');
}

export function exploit(value, regExp) {
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
