
/**
 * @author Axoncodes
 * @version 2.0.0
 *
 */

//  var svgtojson = (() => {
 
//   var options = {};

  // SVG TO JSON
module.exports = {
  convertsvg: data => {
    console.log('svgtojson');
    if(!data || data.length==0) throw 'Invalid data';
    return tagExtractor(data);
  },
  tagExtractor: data => {
    let tmpdata = data;
    const result = [];
    let count = 0; 
    while(tmpdata.length>0) {
      count++
      if(count > 100) throw 'loop EXIT';
      const tag = tmpdata.slice(tmpdata.indexOf("<"), tmpdata.indexOf(">")+1);
      if(tag.indexOf("</")!=0) result.push({
        tag: getHeadOfTag(tag),
        attributes: attrExtrator(` ${getAttrsOfTag(tag)} `), 
        content: getContentOfTag(tmpdata),
        opening: true,
      });
      if(tag.indexOf("</")==0) result.push({
        tag: getHeadOfTag(tag),
        opening: false,
      });
      tmpdata = tmpdata.slice(tmpdata.indexOf(">")+1);
    }
    return result;
  },
  getHeadOfTag: data => {
    if(!data || data.length==0) return null;
    return data.slice(1, data.indexOf(" "));
  },
  getContentOfTag: data => {
    if(!data || data.length==0) return null;
    // check if this data is a comment
    if(data.indexOf('<!--!')==0) return data.slice(0, data.indexOf('-->')+3);
    let stop = false;
    let tmp = data
    while(!stop) {
      if(tmp[0]=='<') stop = true;
      tmp = tmp.slice(1);
    }
    //  const tmp = data.slice(1);
    return tmp.indexOf(">")+1 < tmp.indexOf("<")
      ? tmp.slice(tmp.indexOf(">")+1, tmp.indexOf("<"))
      : null;
  },
  getAttrsOfTag: data => {
    if(!data || data.length==0) return null;
    let attrBody = data.slice(data.indexOf(" ")+1, data.length);
    return data.indexOf(" ")>=0
      ? attrBody.slice(0, attrBody.length-(attrBody[attrBody.length-2]==='/'?2:1))
      : null;
  },
  attrExtrator: data => {
    if(!data || data.length==0) return null;
    const result = {};
    data = data.substring(1, data.length - 1)
    const attributes = data.split('" ');
    attributes.forEach(item=>{
      if(item && item.indexOf('null')<0 && item.length>0) { 
        if(item.lastIndexOf('"') == item.length-1) item = item.substring(0, item.length - 1);
        const parts = item.split('="');
        if(parts[0] && parts[1] && parts[0].length>0 && parts[1].length>0) {
          parts[1] = parts[1].trim()
          if(parts[0].trim() == "style") parts[1] = styleExtractor(parts[1])
          result[parts[0].trim()] = parts[1];
        }
      }
    })
    return result;
  },
  styleExtractor: style => {
    if(!style || style.length==0) return null;
    const result = {};
    const parts = style.split(';');
    parts.forEach(item=>{
      if(item && item.indexOf('null')<0 && item.length>0) { 
        const parts = item.split(':');
        if(parts[0] && parts[1] && parts[0].length>0 && parts[1].length>0)
          result[parts[0].trim()] = parts[1].trim();
      }
    })
    return result;
  },
}
//   return this;


// }).call({});


 
 
// if (typeof module != "undefined" && module !== null && module.exports) module.exports = svgtojson;
// else if (typeof define === "function" && define.amd) define(function () { return svgtojson });

