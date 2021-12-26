
/**
 * @author Axoncodes
 * @version 0.0.4
 *
 */

const jsontosvg = require('./lib/jsontosvg')
const svgtojson = require('./lib/svgtojson')
const svgicontosvgfont = require('./lib/svgicontosvgfont')
const convertToPath = require('./lib/convertToPath')
const fs = require('fs');

/**
 * @param {string/file} input : the path to file or string as data
 * @param {boolean} outputFormat: the version of outputed data : svg, json, fontSVG
 * @param {string} filename: the name of file the data should be written on
 * @param {boolean} unify: Whether the SVG specific tags should be all converted to PATH or not
 */
async function convert({input, outputFormat, filename, unify = false} = {}) {
  // check if it is a file or string of data (true:file, false:string)
  const file = fileOrString(input);
  // readt the data of it is file
  const data = await getData(input, file);
  // check if it's a json or svg (true:svg, false:json)
  const format = isitJson(data);
  // Transform the data
  var mainData = format
    ? JSON.stringify(svgtojson(xmlValidation(data)))
    : jsontosvg(JSON.parse(jsonValidation(data)));
  // activate the convertToPath process if it's 'fontsvg'
  if(outputFormat.toLowerCase() == 'fontsvg') unify = true;
  // execute the convertToPath process
  mainData = unify ? convertToPath(mainData) : mainData;
  // Transform the result again to the custom format if requested
  mainData = outputFormat ? convertBack(outputFormat, mainData) : mainData
  // store result
  return createfile(mainData, filename);
}

function fileOrString(data) {
  const regExp = /[^n{a-z,A-Z,0-9},.,/,:,\\,_,-,  , -]/;
  return data.match(regExp) ? false : true
}

function createfile(data, filename) {
  return !filename
    ? data
    : new Promise((resolve) => {
        fs.writeFile(filename, data, function (err) {
          if (err) throw err;
          resolve('Saved!')
        });
      });
} 

function getData(data, file) {
  return file ? readFile(data) : data;
}

function isitJson(data) {
  return data.indexOf('<') == 0
}

function convertBack(outputFormat, data) {
  
  if(outputFormat.toLowerCase() == 'svg')
    return data.indexOf('<')==0
      ? data
      : jsontosvg(JSON.parse(jsonValidation(data)));

  if(outputFormat.toLowerCase() == 'json')
    return data.indexOf('<')==0
      ? JSON.stringify(svgtojson(xmlValidation(data)))
      : data;

  if(outputFormat.toLowerCase() == 'fontsvg')
    return svgicontosvgfont(
      data.indexOf('<')==0
        ? svgtojson(xmlValidation(data))
        : jsonValidation(data)
      );

  throw 'Invalid outputFormat'

}

function xmlValidation(data) {
  if(!data || data.length==0) throw 'No DATA send';
  const repeates = repeatesF(data);
  if(repeates['>'] != repeates['<']) throw "tags opening and closings don't match";
  if(data.indexOf('<')==-1 || data.indexOf('>')==-1) throw 'no valid tag found';
  return data;
}
function jsonValidation(data) {
  if(!data || data.length==0) throw 'No DATA send';
  if(data.indexOf('{')==-1 || data.indexOf('}')==-1) throw 'no valid object found';
  const repeates = repeatesF(data);
  if(repeates['['] != repeates[']']) throw "[] opening and closings don't match";
  if(repeates['{'] != repeates['}']) throw "{} opening and closings don't match";
  return data;
}

// function webFileReader(file) {
//   if(!file || file.length==0) throw 'File Invalid';
//   return new Promise((resolve) => {
//     const reader = new FileReader()
//     reader.onloadend = () => resolve(reader.result)
//     reader.readAsText(file)
//   })
// }

function readFile(filepath, removeAfter=false) {
  if(!filepath || filepath.length==0) throw 'File Invalid';
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', async (error, fileContent) => {
    if (error != null) throw error
    if(removeAfter) await removeFile(filepath)
    resolve(fileContent);
    });
  });
}
function removeFile(filepath) {
  if(!filepath || filepath.length==0) throw 'removeFile error';
  return new Promise((resolve, reject) => {
    fs.unlink(filepath, (error) => {
      if (error != null) throw error;
      resolve(true);
    });
  });
}
function repeatesF(data) {
  var obj={}
  for(x = 0, length = data.length; x < length; x++) {
      var l = data.charAt(x)
      obj[l] = (isNaN(obj[l]) ? 1 : obj[l] + 1);
  }
  return obj
}

module.exports = convert;
