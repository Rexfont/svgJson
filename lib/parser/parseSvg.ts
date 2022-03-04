const validator = require('../helpers/validator')
const tools = require('../helpers/tools')

export default function parseSvg(data) {
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
function attachCommonTag(data) {
  let content = `<${data.tag}`;
  if (data.attributes)
    content += attachAttributes(data.attributes);
  content += data.selfClosing?'/>':'>';
  if (data.content)
    content += data.content;
  return content;
}
