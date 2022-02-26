const tools = require('../helpers/tools')

function multiDot(path) {
  let resolvedDots = '';
  const symbol = path[0];
  path = path.substring(1, path.length).trim();
  tools.exploit(path, /[n{a-zA-Z} -]/g).forEach(coord => {
    if (coord.indexOf('.') == 0) coord = `0${coord}`
    const dotArr = tools.exploit(coord, /[.]/g)
    if (dotArr.length < 3) {
      resolvedDots += `${coord} `
    } else {
      resolvedDots += `${dotArr[0]}${dotArr[1]} `
      resolvedDots += `${dotArr.slice(2)} `.replaceAll(',', ' ')
    }
  })
  return `${symbol} ${resolvedDots}`
}

async function multiDotSync(path) {
  return multiDot(path)
}

module.exports = {
  multiDot,
  multiDotSync
}