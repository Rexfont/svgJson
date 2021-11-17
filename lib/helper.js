
/**
 * @author Axoncodes
 * @version 1.0.0
 *
 */


 var helper = (() => {

  var options = {};

  this.repeates = data => {
    console.log('repeates');
    var obj={}
    for(x = 0, length = data.length; x < length; x++) {
        var l = data.charAt(x)
        obj[l] = (isNaN(obj[l]) ? 1 : obj[l] + 1);
    }
    return obj
  }

  this.dataValidation = data => {
    console.log('dataValidation');
    if(!data || data.length==0) return {status: 400, message: 'No data send'};
    const repeates = this.repeates(data);
    if(repeates['>'] != repeates['<']) return {status: 400, message: "tags opening and closings don't match"};
    if(data.indexOf('<')==-1 || data.indexOf('>')==-1) return {status: 400, message: 'no valid tag found'};
    return {status: 200, message: data};
  }

  this.webFileReader = (file) => {
    console.log('webFileReader');
    if(!file || file.length==0) return {status: 400, message: 'Invalid'};
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsText(file)
    })
  }

  this.readFile = (filepath, removeAfter) => {
    console.log('readFile');
    if(!filepath || filepath.length==0) return {status: 400, message: 'Invalid'};
    const fs = require('fs');
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, 'utf8', async (error, fileContent) => {
      if (error != null) {
        reject({status: 400, message: error});
        return {status: 400, message: error};
      }
      if(removeAfter) await this.removeFile(filepath)
      resolve(fileContent);
      });
    });
  }

  this.removeFile = (filepath) => {
    console.log('removeFile');
    if(!filepath || filepath.length==0) return {status: 400, message: 'Invalid'};
    const fs = require('fs');
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, (error) => {
        if (error != null) {
            reject({status: 400, message: error});
            return {status: 400, message: error};
        }
        resolve(true);
        });
    });
  }

  return this;

}).call({})

if (typeof module != "undefined" && module !== null && module.exports) module.exports = helper;
else if (typeof define === "function" && define.amd) define(function () { return helper });
