
/**
 * @author Axoncodes
 * @version 2.0.0
 *
 */

const jsontosvg = require('./lib/jsontosvg')
const svgtojson = require('./lib/svgtojson')
const fs = require('fs');


// /**
//  * 
//  * @param {file/string} filedata This will contain the file data or the string that will be converted
//  * @param {boolean} web This shall tell whether the request was made from web or nodejs (incase the data is a file that should be trnasformed)
//  * @returns The first and last step of converting what ever the data is ;)
//  */

/**
 * @data
 * @web web/node
 * @file file/string
 * @remove removeafter
 * @output return/save
 * @filename the name of file the data should be stored
 */
async function convert({data, web, file, remove, output, filename} = {}) {
  const mainData = isitJson(await getData(data, file, web, remove));
  const createdData = await createfile(mainData, output, filename)
  console.log(createdData);
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

function getData(data, file, web, remove) {
  return file ? convertData(data, web, remove) : data;
}

async function convertData(filedata, web, remove) {
  return web 
    ? await webFileReader(filedata) 
    : await readFile(filedata, remove);
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

function webFileReader(file) {
  if(!file || file.length==0) throw 'File Invalid';
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsText(file)
  })
}
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
