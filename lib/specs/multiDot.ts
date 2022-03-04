import {exploit} from '../helpers/tools';

export function multiDot(path) {
  let resolvedDots = '';
  const symbol = path[0];
  path = path.substring(1, path.length).trim();
  exploit(path, /[n{a-zA-Z} -]/g).forEach(coord => {
    if (coord.indexOf('.') == 0) coord = `0${coord}`
    const dotArr = exploit(coord, /[.]/g)
    if (dotArr.length < 3) {
      resolvedDots += `${coord} `
    } else {
      resolvedDots += `${dotArr[0]}${dotArr[1]} `
      resolvedDots += `${dotArr.slice(2)} `.replaceAll(',', ' ')
    }
  })
  return `${symbol} ${resolvedDots}`
}

export async function multiDotSync(path) {
  return multiDot(path)
}
