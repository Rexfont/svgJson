function convertjson(data) {
  console.log('jsontosvg');
  if (!data || data.length == 0)
    throw 'Invalid DATA';
  return reversethejson(data);
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
    content += ` ${item}="${data[item]}"`;
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

module.exports = convertjson;
