const convertFormat = require('./convertFormat');
const parse = require('./parse');

function transform(font, output = 'absolute') {
  // 1. parse the path
  font = parse.pathParser(font)
  // 2. convert all to absolote
  .then((path) => convertFormat(path, output))
  // 3. Create singular string lines as path
  .then((font) => parse.attachStrContour(font))
  .then((result) => console.log(result))
  .catch((error) => console.log(error))
}

module.exports = transform;