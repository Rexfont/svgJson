
/**
 * @author Axoncodes
 * @version 1.0.0
 *
 */

 const jsontoxml = require('./jsontoxml');
 const xmltojson = require('./xmltojson');

 var jsonandxml = (() => {
 
    var options = {};

    /**
     * 
     * @param {file/string} filedata This will contain the file data or the string that will be converted
     * @param {boolean} web This shall tell whether the request was made from web or nodejs (incase the data is a file that should be trnasformed)
     * @returns The first and last step of converting what ever the data is ;)
     */
    this.convert = async (filedata, web) => this.isitJson(await this.getData(filedata, web));


    this.getData = async (data, web) => 
      data.indexOf('upload')>=0
        ? this.convertData(data, web)
        : data;

    this.convertData = async (filedata, web) => 
      web 
        ? await this.webFileReader(filedata) 
        : await this.readFile(filedata, true);
    
    this.isitJson = data =>
      data.indexOf('<') == 0
        ? xmltojson.convert(this.xmlValidation(data))
        : jsontoxml.convert(JSON.parse(this.jsonValidation(data)));

    this.xmlValidation = data => {
      if(!data || data.length==0) throw 'No DATA send';
      const repeates = this.repeates(data);
      if(repeates['>'] != repeates['<']) throw "tags opening and closings don't match";
      if(data.indexOf('<')==-1 || data.indexOf('>')==-1) throw 'no valid tag found';
      return data;
    }

    this.jsonValidation = data => {
      if(!data || data.length==0) throw 'No DATA send';
      const repeates = this.repeates(data);
      if(data.indexOf('{')==-1 || data.indexOf('}')==-1) throw 'no valid object found';
      if(repeates['['] != repeates[']']) throw "[] opening and closings don't match";
      if(repeates['{'] != repeates['}']) throw "{} opening and closings don't match";
      return data;
    }


    

    this.repeates = (data) => {
      var obj={}
      for(x = 0, length = data.length; x < length; x++) {
          var l = data.charAt(x)
          obj[l] = (isNaN(obj[l]) ? 1 : obj[l] + 1);
      }
      return obj
    }
  

  
    this.webFileReader = (file) => {
      if(!file || file.length==0) throw 'File Invalid';
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsText(file)
      })
    }
  
    this.readFile = (filepath, removeAfter) => {
      if(!filepath || filepath.length==0) throw 'File Invalid';
      const fs = require('fs');
      return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', async (error, fileContent) => {
        if (error != null) {
          throw error
        }
        if(removeAfter) await this.removeFile(filepath)
        resolve(fileContent);
        });
      });
    }
  
    this.removeFile = (filepath) => {
      if(!filepath || filepath.length==0) throw 'removeFile error';
      const fs = require('fs');
      return new Promise((resolve, reject) => {
          fs.unlink(filepath, (error) => {
          if (error != null) {
            throw error
          }
          resolve(true);
          });
      });
    }
  
    return this;
     
 }).call({});
 
 
 if (typeof module != "undefined" && module !== null && module.exports) module.exports = jsonandxml;
 else if (typeof define === "function" && define.amd) define(function () { return jsonandxml });
 