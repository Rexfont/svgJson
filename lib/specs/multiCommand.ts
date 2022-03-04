import {exploit} from '../helpers/tools';

export default function expandShortenedCommands(path) {
  const symbol = path[0];
  path = path.substring(1, path.length).trim();
  return extract(exploit(path, /[ ]/g), getCommandExpectedLength(symbol))
  .map(command => `${symbol} ${command.join(' ')}`)
}

function getCommandExpectedLength(name) {
  switch(name) {
    case 'm': case 'M': return 2;
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

function extract(contours, offset) {
  const clength = contours.length;
  // skip if the length is already the normal length
  // or
  // The length of contours and the offset has to be the multiplied of each other
  if (clength == offset || clength % offset != 0) return [contours];

  // else:
  const ans = [];
  for (let i = 0; i < clength/offset; i++) ans.push(contours.splice(0, offset))
  return ans
}
