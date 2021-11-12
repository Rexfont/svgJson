const fs = require('fs');


async function convert(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (error, fileContent) => {
        if (error != null) {
            reject(error);
            return;
        }
        resolve(tagExtractor(fileContent));
        });
    });
}


function getHeadOfTag(data) {
    return data.slice(1, data.indexOf(" "));
}

function getContentOfTag(data) {
    const tmp = data.slice(1);
    return tmp.indexOf(">")+1 < tmp.indexOf("<")
        ? tmp.slice(tmp.indexOf(">")+1, tmp.indexOf("<"))
        : null;
}

function getAttrsOfTag(data) {
    let attrBody = data.slice(data.indexOf(" ")+1, data.length);
    return data.indexOf(" ")>=0
        ? attrBody.slice(0, attrBody.length-(attrBody[attrBody.length-2]==='/'?2:1))
        : null;
}


function attrExtrator(data) {
    const result = {};
    data = data.substring(1, data.length - 1)
    const attributes = data.split('" ');
    attributes.forEach(item=>{
        if(item && item.indexOf('null')<0 && item.length>0) { 
            if(item.lastIndexOf('"') == item.length-1) item = item.substring(0, item.length - 1);
            const parts = item.split('="');
            parts[1] = parts[1].trim()
            if(parts[0].trim() == "style") parts[1] = styleExtractor(parts[1])
            result[parts[0].trim()] = parts[1];
        }
    })
    return result;
}

function styleExtractor(style) {
    const result = {};
    const parts = style.split(';');
    parts.forEach(item=>{
        if(item && item.indexOf('null')<0 && item.length>0) { 
            const parts = item.split(':');
            result[parts[0].trim()] = parts[1].trim();
        }
    })
    return result;
}


function tagExtractor(data) {
    const result = [];
    while(data.length>0) {
        const tag = data.slice(data.indexOf("<"), data.indexOf(">")+1);
        if(tag.indexOf("</")!=0) {            
            result.push({
                tag: getHeadOfTag(tag),
                attributes: attrExtrator(` ${getAttrsOfTag(tag)} `), 
                content: getContentOfTag(data)
            });
        } data = data.slice(data.indexOf(">")+1);
    }
    return result;
}


module.exports = convert