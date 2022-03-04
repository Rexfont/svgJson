import parseSvg from './lib/parser/parseSvg'
import {parseJson, parseJsonAsync} from './lib/parser/parseJson'
import parseSvgfont from './lib/parser/parseSvgfont'
import parsePath from './lib/parser/parsePath'
import {parseFormat, directParseFormat, } from './lib/parser/parseFormat'
import {parse, parseContourSvg, useContourStr} from './lib/helpers/parse'
import fileHelper from './lib/helpers/file'

/**
 * @param {string/file} input : the path to file or string as data
 * @param {boolean} outputFormat: the version of outputed data : svg, json, fontSVG
 * @param {string} filename: the name of file the data should be written on
 * @param {boolean} unifySvg: Whether the SVG specific tags should be all converted to PATH or not
 * @param {boolean} pathFormat: To declare whether you would like to set the pathes all to absolute or relative or no change
 */
function convert(opts) {
  // check if the data is a file path, then read the file, otherwise, return the string of data(input)
  return fileHelper.getData(opts)
  // execute the parsePath process
  .then(data => parsePath(data, opts))
  // Transform the result again to the custom format if requested
  .then(data => assign(data, opts))
  // store result
  .then(data => fileHelper.createfile(data, opts))
}

function prepare(opts) {
  if(!opts.input) throw 'No Input declared'
  // default
  if(!opts.unifySvg) opts.unifySvg = false;
  // default
  if(!opts.outputFormat) opts.outputFormat = 'json';
  // activate the parsePath process if it's 'fontsvg'
  if(opts.outputFormat.toLowerCase() == 'fontsvg') opts.unifySvg = true;

  return opts;
}

function parseFormatHandler(opts, format) {
  return fileHelper.getData(opts)
  .then(parseJson)
  .then(parseContourSvg)
  .then(svgJsonWithContour => parseFormat(svgJsonWithContour, format))
  .then(useContourStr)
  .then(transformedSvg => assign(transformedSvg, opts))
  .then(data => fileHelper.createfile(data, opts))
}

function parseFormatHandlerDirectly(path, format) {
  return parseJsonAsync(path)
  .then(parse.parseContourPath)
  .then(contour => directParseFormat(contour, format))
  .then(parse.attachStrContourDirectly)
}

function assign(svg, {outputFormat, fontname, unicodePrefix}) {
  // skip if there is no outputFormat set
  if(!outputFormat) return svg;

  switch(outputFormat.toLowerCase()) {
    case 'svg': return parseSvg(svg)
    case 'json': return parseJson(svg)
    case 'fontsvg': return parseSvgfont(svg, unicodePrefix, fontname)
    default: return svg;
  }
}

function parsePointsParserPrepare(path) {
  return parseJsonAsync(path)
  .then(parse.parseContourPath)
}

function getPathType(path, regExp) {
  const indexes = [];
  let match;
  while ((match = regExp.exec(path)) != null) indexes.push(match.index);
  return indexes;
}

export = {
  convert: opts => convert(prepare(opts)),
  parsePoints: parsePointsParserPrepare,
  parseAbsolute: opts => parseFormatHandler(prepare(opts),'absolute'),
  parseRelative: opts => parseFormatHandler(prepare(opts),'relative'),
  parsePath: opts => parsePath(opts.code, {unifySvg: true}),
  parseJson: parseJson,
  parseSvg,
  parseSvgfont,
  parseAbsoluteDirectly: path => parseFormatHandlerDirectly(path, 'absolute'),
  parseRelativeDirectly: path => parseFormatHandlerDirectly(path, 'relative'),
  direcltParseContour: parse.parseContourPath,
  pathGotRelatives: path => getPathType(path, /[n{a-z}]/g),
  pathGotAbsolutes: path => getPathType(path, /[n{A-Z}]/g),
  getClassesEncode: parse.getClassesEncode,
  encodeClasses: parse.encodeClasses,
  extractGlyphSets: parse.extractGlyphSets,
  extractPathes: parse.extractPathes,
  extractStyles: parse.extractStyles,
  extractGlyphs: parse.extractGlyphs,
};
