
/**
 * @author Alireza Ataei
 * @version 1.0.0
 *
 */


var jsontoxml = (() => {

  var options = {};

  this.convert = data => {
    console.log('jsontoxml');
    if(!data || data.length==0) throw 'Invalid filedata';
    this.tagExtractor(data)
  }
  
  return this;
    
}).call({});


if (typeof module != "undefined" && module !== null && module.exports) module.exports = jsontoxml;
else if (typeof define === "function" && define.amd) define(function () { return jsontoxml });
