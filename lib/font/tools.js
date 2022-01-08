function isCap(char) {
  if (char == char.toUpperCase()) return true;
  return false;
}

function isAbs(point) {
  return isCap(point[0]);
}

module.exports = {
  isCap,
  isAbs,
}