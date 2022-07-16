const validator = require('../helpers/validator')
const tools = require('../helpers/tools')

function parseSvg(data) {
  console.log('jsontosvg');
  if (!data || data.length == 0) throw 'Invalid DATA';
  // check if it is already svg
  if (tools.isSvg(data)) return data;

  return validator.jsonValidation(data)
  .then(reversethejson)
}

function reversethejson(data) {
  let maincontent = '';
  data.forEach(item => {
    let content = '';
    if (item.tag == '!--!') content = `${item.content}`;
    else content = attachCommonTag(item);
    maincontent += content;
  });
  return maincontent;
}
function attachAttributes(data) {
  if (!data || data.length == 0)
    throw "Invalid DATA";
  let content = '';
  Object.keys(data).forEach(item => {
    if(data[item]) content += ` ${item}="${data[item]}"`;
  });
  return content;
}

function attachstyles(styles) {
  let content = ''
  Object.entries(styles).forEach(iclass => {
    content += `${iclass[0]} {`
    let styleContext = iclass[1]
    // check if the second part of this array element is
    if (!Array.isArray(iclass[1])) styleContext = Object.entries(iclass[1])
    styleContext.forEach(style => {
      content += `${style[0]}: ${style[1]};`
    })
    content += `}\n`
  })
  return content
}

function attachCommonTag(data) {
  let content = `<${data.tag}`;
  if (data.attributes) content += attachAttributes(data.attributes);
  content += data.selfClosing?'/>':'>';
  if (data.style) content += attachstyles(data.style);
  if (data.content) content += data.content;
  return content;
}

module.exports = parseSvg;
