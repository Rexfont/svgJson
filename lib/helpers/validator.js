const tools = require('./tools')

function xmlValidation(data) {
  if(!data || data.length==0) throw 'No DATA send';
  const repeates = tools.repeatesF(data);
  if(repeates['>'] != repeates['<']) throw "tags opening and closings don't match";
  if(data.indexOf('<')==-1 || data.indexOf('>')==-1) throw 'no valid tag found';
  return Promise.resolve(data);
}
function jsonValidation(data) {
  if(!data || data.length==0) throw 'No DATA send';
  // skip the validation if it is already an object
  if(typeof data === 'object') return Promise.resolve(data);
  if(data.indexOf('{')==-1 || data.indexOf('}')==-1) throw 'no valid object found';
  const repeates = tools.repeatesF(data);
  if(repeates['['] != repeates[']']) throw "[] opening and closings don't match";
  if(repeates['{'] != repeates['}']) throw "{} opening and closings don't match";
  return Promise.resolve(JSON.parse(data));
}

module.exports = {
  xmlValidation,
  jsonValidation,
}