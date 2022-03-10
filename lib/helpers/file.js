const fs = require('fs');
const tools = require('./tools');
const parseJson = require('../parser/parseJson')

function getData({input}) {
  return Promise.resolve(
    tools.isFile(input) ? readFile(input) : input
  );
}

function readFiles(files) {
  return Promise.all(files.map(file => 
    file.indexOf('file:///') == 0 ? fs.readFileSync(new URL(file), 'utf8') : fs.readFileSync(file, 'utf8')
  ))
}

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

function createfile(data, {filename}) {
  if(!filename) return data;
  if(typeof data === 'object') data = JSON.stringify(data);
  return new Promise((resolve) => {
    fs.writeFile(filename, data, function (err) {
      if (err) throw err;
      resolve('Saved!')
    });
  });
}

function webFileReader(file) {
  if(!file || file.length==0) throw 'File Invalid';
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsText(file)
  })
}


module.exports = {
  getData,
  readFile,
  removeFile,
  createfile,
  readFiles,
  webFileReader,
}