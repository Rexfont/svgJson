
/**
 * @author Axoncodes
 */

const parseSvg = require('./lib/parser/parseSvg')
const parseJson = require('./lib/parser/parseJson')
const parseSvgfont = require('./lib/parser/parseSvgfont')
const parsePath = require('./lib/parser/parsePath')
const parseFormat = require('./lib/parser/parseFormat')
const parse = require('./lib/helpers/parse')
const fileHelper = require('./lib/helpers/file')

/**
 * @param {string/file} input : the path to file or string as data
 * @param {boolean} outputFormat: the version of outputed data : svg, json, fontSVG
 * @param {string} filename: the name of file the data should be written on
 * @param {boolean} unifySvg: Whether the SVG specific tags should be all converted to PATH or not
 */
function convert(initOptions) {
  const options = prepare(initOptions);
  // check if the data is a file path, then read the file, otherwise, return the string of data(input)
  return fileHelper.getData(options)
  // execute the parsePath process
  .then(data => parsePath(data, options))
  // Transform the result again to the custom format if requested
  .then(data => assign(data, options))
  // store result
  .then(data => fileHelper.createfile(data, options))
}

function prepare(options) {
  // default
  if(!options.unifySvg) options.unifySvg = false;
  // default
  if(!options.outputFormat) options.outputFormat = 'json';
  // activate the parsePath process if it's 'fontsvg'
  if(options.outputFormat.toLowerCase() == 'fontsvg') options.unifySvg = true;

  return options;
}

function parseFormatHandler(initOptions, requestedFormat) {
  const options = prepare(initOptions);
  return fileHelper.getData(options)
  .then(parseJson)
  .then(data => data.map(tag => parse.parseContour(tag)))
  .then(path => parseFormat.parseFormat(path, requestedFormat))
  .then(data => assign(data, options))
  .then(data => fileHelper.createfile(data, options))
}

function assign(data, {outputFormat}) {
  // skip if there is no outputFormat set
  if(!outputFormat) return data;

  switch(outputFormat.toLowerCase()) {
    case 'svg': return parseSvg(data)
    case 'json': return parseJson(data)
    case 'fontsvg': return parseSvgfont(data)
    default: return data;
  }
}

module.exports = {
  convert,
  parsePoints: parse.pathParser,
  parseAbsolute: initOptions => parseFormatHandler(initOptions, 'absolute'),
  parseRelative: initOptions => parseFormatHandler(initOptions, 'relative'),
  parsePath: initOptions => parsePath(initOptions.code, {unifySvg: true}),
  parseJson,
  parseSvg,
  parseSvgfont,
  parseAbsoluteDirectly: path => parseFormat.parseFormat(path, 'absolute'),
  parseRelativeDirectly: path => parseFormat.parseFormat(path, 'relative'),
};
