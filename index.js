
/**
 * @author Axoncodes
 * @version 0.0.4
 *
 */

const jsontosvg = require('./lib/jsontosvg')
const svgtojson = require('./lib/svgtojson')
const convertToPath = require('./lib/convertToPath')
const fs = require('fs');

/**
 * @param {string/file} data : the path to file or string as data
 * @param {boolean} file: declare whether you are using a file or string as data
 * @param {boolean} remove: in case of using file, should the file be deleted or not
 * @param {boolean} output: write to file or just return the generated data
 * @param {string} filename: the name of file the data should be written on
 * @param {boolean} unify: Whether the SVG specific tags should be all converted to PATH or not
 */
async function convert({data, file, remove, output, filename, unify} = {}) {
  let mainData = isitJson(await getData(data, file, remove));
  mainData = unify ? convertToPath(mainData) : mainData;
  const createdData = await createfile(mainData, output, filename);
  return createdData
}

function createfile(data, output, filename) {
  return !output
    ? data
    : new Promise((resolve) => {
        fs.writeFile(filename, data, function (err) {
          if (err) throw err;
          resolve('Saved!')
        });
      });
} 

function getData(data, file, remove) {
  return file ? readFile(data, remove) : data;
}

function isitJson(data) {
  return data.indexOf('<') == 0
    ? JSON.stringify(svgtojson(xmlValidation(data)))
    : jsontosvg(JSON.parse(jsonValidation(data)));
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
  const repeates = repeatesF(data);
  if(data.indexOf('{')==-1 || data.indexOf('}')==-1) throw 'no valid object found';
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

function readFile(filepath, removeAfter) {
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
