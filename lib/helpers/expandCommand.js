function expandShortenedCommands(contours) {
  const ans = [];
  contours.forEach(command => {
    ans.push(...extract(command, getCommandExpectedLength(command[0])))
  })
  return ans;
}

function getCommandExpectedLength(name) {
  switch(name) {
    case 'c': case 'C': return 6;
    case 'l': case 'L': return 2;
    case 'h': case 'H': return 1;
    case 'v': case 'V': return 1;
    case 's': case 'S': return 4;
    case 'q': case 'Q': return 4;
    case 't': case 'T': return 2;
    case 'a': case 'A': return 7;
  }
}

function extract(contour, offset) {
  const clength = contour[1].length;
  // skip if the length is already the normal length
  if (clength == offset) return [contour];
  // The length of contour and the offset has to be the multiplied of each other
  if (clength % offset != 0) return [contour];

  // else:
  const ans = [];
  for (let i = 0; i < clength/offset; i++) ans.push([contour[0], contour[1].slice(i*offset, (i+1)*offset)])
  return ans
}

module.exports = expandShortenedCommands;