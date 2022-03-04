var parseSvg = require('./lib/parser/parseSvg');
var parseJson = require('./lib/parser/parseJson');
var parseSvgfont = require('./lib/parser/parseSvgfont');
var parsePath = require('./lib/parser/parsePath');
var parseFormat = require('./lib/parser/parseFormat');
var parse = require('./lib/helpers/parse');
var fileHelper = require('./lib/helpers/file');
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
        .then(function (data) { return parsePath(data, opts); })
        // Transform the result again to the custom format if requested
        .then(function (data) { return assign(data, opts); })
        // store result
        .then(function (data) { return fileHelper.createfile(data, opts); });
}
function prepare(opts) {
    if (!opts.input)
        throw 'No Input declared';
    // default
    if (!opts.unifySvg)
        opts.unifySvg = false;
    // default
    if (!opts.outputFormat)
        opts.outputFormat = 'json';
    // activate the parsePath process if it's 'fontsvg'
    if (opts.outputFormat.toLowerCase() == 'fontsvg')
        opts.unifySvg = true;
    return opts;
}
function parseFormatHandler(opts, format) {
    return fileHelper.getData(opts)
        .then(parseJson.parse)
        .then(parse.parseContourSvg)
        .then(function (svgJsonWithContour) { return parseFormat.parseFormat(svgJsonWithContour, format); })
        .then(parse.useContourStr)
        .then(function (transformedSvg) { return assign(transformedSvg, opts); })
        .then(function (data) { return fileHelper.createfile(data, opts); });
}
function parseFormatHandlerDirectly(path, format) {
    return parseJson.async(path)
        .then(parse.parseContourPath)
        .then(function (contour) { return parseFormat.directParseFormat(contour, format); })
        .then(parse.attachStrContourDirectly);
}
function assign(svg, _a) {
    var outputFormat = _a.outputFormat, fontname = _a.fontname, unicodePrefix = _a.unicodePrefix;
    // skip if there is no outputFormat set
    if (!outputFormat)
        return svg;
    switch (outputFormat.toLowerCase()) {
        case 'svg': return parseSvg(svg);
        case 'json': return parseJson.parse(svg);
        case 'fontsvg': return parseSvgfont(svg, unicodePrefix, fontname);
        default: return svg;
    }
}
function parsePointsParserPrepare(path) {
    return parseJson.async(path)
        .then(parse.parseContourPath);
}
function getPathType(path, regExp) {
    var indexes = [];
    var match;
    while ((match = regExp.exec(path)) != null)
        indexes.push(match.index);
    return indexes;
}
module.exports = {
    convert: function (opts) { return convert(prepare(opts)); },
    parsePoints: parsePointsParserPrepare,
    parseAbsolute: function (opts) { return parseFormatHandler(prepare(opts), 'absolute'); },
    parseRelative: function (opts) { return parseFormatHandler(prepare(opts), 'relative'); },
    parsePath: function (opts) { return parsePath(opts.code, { unifySvg: true }); },
    parseJson: parseJson.parse,
    parseSvg: parseSvg,
    parseSvgfont: parseSvgfont,
    parseAbsoluteDirectly: function (path) { return parseFormatHandlerDirectly(path, 'absolute'); },
    parseRelativeDirectly: function (path) { return parseFormatHandlerDirectly(path, 'relative'); },
    direcltParseContour: parse.parseContourPath,
    pathGotRelatives: function (path) { return getPathType(path, /[n{a-z}]/g); },
    pathGotAbsolutes: function (path) { return getPathType(path, /[n{A-Z}]/g); },
    getClassesEncode: parse.getClassesEncode,
    encodeClasses: parse.encodeClasses,
    extractGlyphSets: parse.extractGlyphSets,
    extractPathes: parse.extractPathes,
    extractStyles: parse.extractStyles,
    extractGlyphs: parse.extractGlyphs
};
