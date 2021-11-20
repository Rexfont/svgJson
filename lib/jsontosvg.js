
/**
 * @author Axoncodes
 * @version 2.0.0
 *
 */

//  var jsontosvg = (() => {
 
  // var options = {};
module.exports = {
  convertjson: data => {
    console.log('jsontosvg');
    if(!data || data.length==0) throw 'Invalid DATA';
    return reversethejson(data)
  },
  reversethejso: data => {
    let maincontent = '';
    data.forEach(item=>{
      let content = '';
      if(item.tag == '!--!') content = `${item.content}`
      else content = attachCommonTag(item)
      maincontent += content
    })
    return maincontent;
  },
  attachAttribute: data => {
    if(!data || data.length==0) throw "Invalid DATA"
    let content = '';
    Object.keys(data).forEach(item=>{
      content += ` ${item}="${data[item]}"`
    })
    return content;
  },
  attachCommonTa: data => {
    let content = `<${data.tag}`;
    if(data.attributes) content += attachAttributes(data.attributes);
    content += '>';
    if(data.content) content += data.content;
    return content;
  }
}
  // return this;


// }).call({});


 
 
// if (typeof module != "undefined" && module !== null && module.exports) module.exports = jsontosvg;
// else if (typeof define === "function" && define.amd) define(function () { return jsontosvg });

