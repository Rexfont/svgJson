
/**
 * @author Alireza Ataei
 * @version 1.0.0
 *
 */

 const jsontoxml = require('./jsontoxml');
 const xmltojson = require('./xmltojson');

 var jsonandxml = (() => {
 
    var options = {};

    this.convert = async (filedata, web) => {
      /**
       * 
       * @param {file/string} filedata This will contain the file data or the string that will be converted
       * @param {boolean} web This shall tell whether the request was made from web or nodejs (incase the data is a file that should be trnasformed)
       * @returns The first and last step of converting what ever the data is ;)
       */
      return this.isitJson(await this.getData(filedata, web));
    }

    this.getData = async (filedata, web) => {
      console.log('getData');
      const dataType = await this.isitFile(filedata, web);
      if(dataType.status==400) return dataType
      return dataType
    }

    this.isitFile = async (data, web) => {
      if(typeof data == 'object') {
        const converteddata = await this.convertData(data, web);
        if(converteddata.status==400) return converteddata;
        const validatedData = this.dataValidation(converteddata.message);
        if(validatedData.status==400) return validatedData;
        return {status: 200, message: validatedData.message};
      }
      if(typeof data == 'string') return {status: 200, message: this.dataValidation(data)};
      return {status: 400, message: null};
    }

    this.convertData = async (filedata, web) => {
      return web ? await this.webFileReader(filedata) : await this.readFile(filedata, true)
    }
 
    this.dataValidation = data => {
      console.log('dataValidation');
      if(!data || data.length==0) return {status: 400, message: 'No data send'};
      const repeates = this.repeates(data);
      if(repeates['>'] != repeates['<']) return {status: 400, message: "tags opening and closings don't match"};
      if(data.indexOf('<')==-1 || data.indexOf('>')==-1) return {status: 400, message: 'no valid tag found'};
      return {status: 200, message: data};
    }

    this.isitJson = data => {
      if(data.status == 200) return data.message.indexOf('<') == 0 ? xmltojson.convert(data.message) : jsontoxml.convert(data.message);
      return data;
    }

    this.repeates = data => {
      console.log('repeates');
      var obj={}
      for(x = 0, length = data.length; x < length; x++) {
          var l = data.charAt(x)
          obj[l] = (isNaN(obj[l]) ? 1 : obj[l] + 1);
      }
      return obj
    }
  

  
    this.webFileReader = (file) => {
      console.log('webFileReader');
      if(!file || file.length==0) return {status: 400, message: 'Invalid'};
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve({status: 200, message: reader.result})
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
        resolve({status: 200, message: fileContent});
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
     
 }).call({});
 
 
 if (typeof module != "undefined" && module !== null && module.exports) module.exports = jsonandxml;
 else if (typeof define === "function" && define.amd) define(function () { return jsonandxml });
 