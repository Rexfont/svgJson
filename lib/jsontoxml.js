
/**
 * @author Alireza Ataei
 * @version 1.0.0
 *
 */


var jsontoxml = (() => {

  var options = {};

  this.convert = data => {
    console.log('jsontoxml');
    if(!data || data.length==0) throw 'Invalid DATA';
    return this.reversethejson(data)
  }

  this.reversethejson = data => {
    let maincontent = '';
    data.forEach(item=>{
      let content = '';
      if(item.tag == '!--!') content = `${item.content}`
      else content = this.attachCommonTag(item)
      maincontent += content
    })
    return maincontent;
  }

  this.attachAttributes = data => {
    if(!data || data.length==0) throw "Invalid DATA"
    let content = '';
    Object.keys(data).forEach(item=>{
      content += ` ${item}="${data[item]}"`
    })
    return content;
  }

  this.attachCommonTag = data => {
    let content = `<${data.tag}`;
    if(data.attributes) content += this.attachAttributes(data.attributes);
    content += '>';
    if(data.content) content += data.content;
    return content;
  }

  
  return this;
    
}).call({});


if (typeof module != "undefined" && module !== null && module.exports) module.exports = jsontoxml;
else if (typeof define === "function" && define.amd) define(function () { return jsontoxml });
