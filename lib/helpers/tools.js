module.exports = {
  isCap: char => {
    if (char == char.toUpperCase()) return true;
    return false;
  },
  isAbs: point => this.isCap(point[0]),
  isSvg: data => data.indexOf('<') == 0,
  repeatesF: data => {
    var obj={}
    for(x = 0, length = data.length; x < length; x++) {
        var l = data.charAt(x)
        obj[l] = (isNaN(obj[l]) ? 1 : obj[l] + 1);
    }
    return obj
  },
  isFile: data => !data.match(/[^n{a-z,A-Z,0-9},.,/,:,\\,_,-,  , -]/),
}