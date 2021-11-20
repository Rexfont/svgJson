
/**
 * @author Axoncodes
 * @version 2.0.0
 *
 */

const jsontosvg = require('./jsontosvg')
const svgtojson = require('./svgtojson')

module.exports = {

  /**
   * 
   * @param {file/string} filedata This will contain the file data or the string that will be converted
   * @param {boolean} web This shall tell whether the request was made from web or nodejs (incase the data is a file that should be trnasformed)
   * @returns The first and last step of converting what ever the data is ;)
   */
  convert: async (filedata, web) => {
     return this.isitJson(await this.getData(filedata, web));
  },
  getData: async (data, web) => {
     return data.indexOf('upload')>=0
       ? this.convertData(data, web)
       : data;
  },
  convertData: async (filedata, web) => {
    return web 
      ? await this.webFileReader(filedata) 
      : await this.readFile(filedata, true);
   },
   isitJson: data =>{
     return data.indexOf('<') == 0
       ? svgtojson.convertsvg(xmlValidation(data))
       : jsontosvg.convertjson(JSON.parse(jsonValidation(data)));
  },
   xmlValidation: data => {
     if(!data || data.length==0) throw 'No DATA send';
     const repeates = repeates(data);
     if(repeates['>'] != repeates['<']) throw "tags opening and closings don't match";
     if(data.indexOf('<')==-1 || data.indexOf('>')==-1) throw 'no valid tag found';
     return data;
   },
   jsonValidation: data => {
     if(!data || data.length==0) throw 'No DATA send';
     const repeates = repeates(data);
     if(data.indexOf('{')==-1 || data.indexOf('}')==-1) throw 'no valid object found';
     if(repeates['['] != repeates[']']) throw "[] opening and closings don't match";
     if(repeates['{'] != repeates['}']) throw "{} opening and closings don't match";
     return data;
   },
   repeates: (data) => {
     var obj={}
     for(x = 0, length = data.length; x < length; x++) {
         var l = data.charAt(x)
         obj[l] = (isNaN(obj[l]) ? 1 : obj[l] + 1);
     }
     return obj
   },
   webFileReader: (file) => {
     if(!file || file.length==0) throw 'File Invalid';
     return new Promise((resolve) => {
       const reader = new FileReader()
       reader.onloadend = () => resolve(reader.result)
       reader.readAsText(file)
     })
   },
   readFile: (filepath, removeAfter) => {
     if(!filepath || filepath.length==0) throw 'File Invalid';
     const fs = require('fs');
     return new Promise((resolve, reject) => {
       fs.readFile(filepath, 'utf8', async (error, fileContent) => {
       if (error != null) throw error
       if(removeAfter) await this.removeFile(filepath)
       resolve(fileContent);
       });
     });
   },
   removeFile: (filepath) => {
     if(!filepath || filepath.length==0) throw 'removeFile error';
     const fs = require('fs');
     return new Promise((resolve, reject) => {
         fs.unlink(filepath, (error) => {
          if (error != null) throw error;
          resolve(true);
         });
     });
   },
 
}
