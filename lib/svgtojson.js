function convertsvg(data) {
  console.log('svgtojson');
  if (!data || data.length == 0) throw 'Invalid data';
  return tagExtractor(data);
}
function tagExtractor(data) {
  let tmpdata = data;
  const result = [];
  let count = 0;
  // Go through the process until the svg lines are finished
  while (tmpdata.length > 0) {
    // Avoide over looping
    if (count++ > 100) throw 'loop EXIT';
    // seperate the tag line to process on
    const tag = tmpdata.slice(tmpdata.indexOf("<"), tmpdata.indexOf(">") + 1);
    
    // self closing tags
    if(tag.indexOf("/")+1 == tag.indexOf(">")) result.push({
        tag: extractor.head(tag),
        attributes: extractor.attr(tag),
        attrless: extractor.attrlessExtractor(tag),
        content: extractor.content(tmpdata),
        selfClosing: true,
      });

    // closing tags
    else if (tag.indexOf("</") == 0) result.push({
        tag: extractor.head(tag),
        opening: false,
      });

    // opening tags
    else result.push({
      tag: extractor.head(tag),
      attributes: extractor.attr(tag),
      content: extractor.content(tmpdata),
      opening: true,
    });

    // remove the processed tag from the tag lines
    tmpdata = tmpdata.slice(tmpdata.indexOf(">") + 1);
  }
  return result;
}

class extractor {
  static head(data) {
    if (!data || data.length == 0) return null;
    return data.slice(1, data.indexOf(" "));
  }

  static content(data) {
    if (!data || data.length == 0) return null;
    // check if this data is a comment
    if (data.indexOf('<!--!') == 0) return data.slice(0, data.indexOf('-->') + 3);
    let stop = false;
    let tmp = data;
    while (!stop) {
      if (tmp[0] == '<') stop = true;
      tmp = tmp.slice(1);
    }
    //  const tmp = data.slice(1);
    return tmp.indexOf(">") + 1 < tmp.indexOf("<")
      ? tmp.slice(tmp.indexOf(">") + 1, tmp.indexOf("<"))
      : null;
  }

  static getAttr(data) {
    if (!data || data.length == 0) return null;
    let attrBody = data.slice(data.indexOf(" ") + 1, data.length);
    return data.indexOf(" ") >= 0
      ? attrBody.slice(0, attrBody.length - (attrBody[attrBody.length - 2] === '/' ? 2 : 1))
      : null;
  }

  static attr(inputData) {
    let data = extractor.getAttr(inputData);
    if (!data || data.length == 0) return null;
    const result = {};
    data = data.substring(1, data.length - 1);
    const attributes = data.split('" ');
    attributes.forEach(item => {
      if (item && item.indexOf('null') < 0 && item.length > 0) {
        if (item.lastIndexOf('"') == item.length - 1) item = item.substring(0, item.length - 1);
        const parts = item.split('="');
        if (parts[0] && parts[1] && parts[0].length > 0 && parts[1].length > 0) {
          parts[1] = parts[1].trim();
          if (parts[0].trim() == "style") parts[1] = style(parts[1]);
          result[parts[0].trim()] = parts[1];
        }
      }
    });
    return result;
  }

  static style(style) {
    if (!style || style.length == 0) return null;
    const result = {};
    const parts = style.split(';');
    parts.forEach(item => {
      if (item && item.indexOf('null') < 0 && item.length > 0) {
        const parts = item.split(':');
        if (parts[0] && parts[1] && parts[0].length > 0 && parts[1].length > 0)
          result[parts[0].trim()] = parts[1].trim();
      }
    });
    return result;
  }

  static attrlessExtractor(data) {
    return data;
  }
}








module.exports = convertsvg;