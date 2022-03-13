const parseSvg = require('./lib/parser/parseSvg')
const parseJson = require('./lib/parser/parseJson')
const parseSvgfont = require('./lib/parser/parseSvgfont')
const parsePath = require('./lib/parser/parsePath')
const parseFormat = require('./lib/parser/parseFormat')
const parse = require('./lib/helpers/parse')
const propertyHandler = require('./lib/helpers/propertyHandler')
const fileHelper = require('./lib/helpers/file')

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
  .then(parseJson.parse)
  .then(parse.parseContourSvg)
  .then(svgJsonWithContour => parseFormat.parseFormat(svgJsonWithContour, format))
  .then(parse.useContourStr)
  .then(transformedSvg => assign(transformedSvg, opts))
  .then(data => fileHelper.createfile(data, opts))
}

function parseFormatHandlerDirectly(path, format) {
  return parseJson.async(path)
  .then(parse.parseContourPath)
  .then(contour => parseFormat.directParseFormat(contour, format))
  .then(parse.attachStrContourDirectly)
}

function assign(svg, {outputFormat, fontname, unicodePrefix}) {
  // skip if there is no outputFormat set
  if(!outputFormat) return svg;

  switch(outputFormat.toLowerCase()) {
    case 'svg': return parseSvg(svg)
    case 'json': return parseJson.parse(svg)
    case 'fontsvg': return parseSvgfont(svg, unicodePrefix, fontname)
    default: return svg;
  }
}

function parsePointsParserPrepare(path) {
  return parseJson.async(path)
  .then(parse.parseContourPath)
}

function getPathType(path, regExp) {
  const indexes = [];
  let match;
  while ((match = regExp.exec(path)) != null) indexes.push(match.index);
  return indexes;
}

async function mergeSvgs(svgsDataIn, namesMode=false) {
  let content = ''
  // get informations
  const svgsData = await Promise.all(svgsDataIn.map(svgdata => parseJson.async(svgdata)))
  .then(svgsData => parse.encodeClasses(svgsData))
  const svgsPathes = svgsData.map(parse.extractPathes)
  const svgsStyles = svgsData.map(parse.extractStyles)

  // generate the singular svg file
  content += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${svgsData[0][0].attributes.viewBox.toString().replaceAll(',', ' ')}>\n`
  content += `<defs>`
  if (svgsStyles.flat().flat().length > 0) {
    content += `<style>`
    svgsStyles.flat().flat().forEach(style => {
      content += `${style[0]} {`
      style[1].forEach(properties => {
        if (properties && properties.length)
          content += `${properties.toString().replaceAll(',', ':')};`
      }); content += `}\n`
    }); content += `</style>`
  }; content += `</defs>`
  svgsPathes.forEach((pathes, count) => {
    pathes.forEach(path => {
      let cclass = path.attributes && path.attributes.class ? path.attributes.class  : ''
      content += path.tag == 'path' ? `<path ${namesMode ? `name="${namesMode[count]}"` : ''} class="${cclass.replaceAll(/[.]/g, '')}" rxcode="${count}" d="${path.attributes.d}"/>\n` : (path.tag == 'g' ? `<${path.tag} class="${cclass}">` : '</g>')
    })
  })
  content += `</svg>`

  return content
}

module.exports = {
  convert: opts => convert(prepare(opts)),
  parsePoints: parsePointsParserPrepare,
  parseAbsolute: opts => parseFormatHandler(prepare(opts),'absolute'),
  parseRelative: opts => parseFormatHandler(prepare(opts),'relative'),
  parsePath: opts => parsePath(opts.code, {unifySvg: true}),
  parseJson: parseJson.parse,
  parseJsonSync: parseJson.async,
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
  mergeSvgs,
  colorHandler: propertyHandler.colorHandler,
  sizeHandler: propertyHandler.sizeHandler,
  readFiles: fileHelper.readFiles,
  processor: parseFormat.process,
};
