const fs = require('fs');

/**
 * 
 * @param {file/string} filedata This will contain the file data or the string that will be converted
 * @param {boolean} file This shall tell whether the @param filedata is FILE or STRING of data 
 * @param {boolean} web This shall tell whether the request was made from web or nodejs 
 * @returns The first and last step of converting
 */
async function axConvertor(filedata, file, web) {
    if(!filedata) return "The Data parameter is missing"
    if(typeof file == null || typeof file == "undefined") return "You haven't specified the data type (file or content)";

    return file 
        ? tagExtractor(web ? await webFileReader(filedata) : await readFile(filedata, true))
        : tagExtractor(filedata)
}

function webFileReader(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsText(file)
    })
}

async function readFile(filepath, removeAfter) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', async (error, fileContent) => {
        if (error != null) {
            reject(error);
            return;
        }
        if(removeAfter) await removeFile(filepath)
        resolve(fileContent);
        });
    });
}

async function removeFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, (error) => {
        if (error != null) {
            reject(error);
            return;
        }
        resolve(true);
        });
    });
}

function getHeadOfTag(data) {
    return data.slice(1, data.indexOf(" "));
}

function getContentOfTag(data) {
    // check if this data is a comment
    if(data.indexOf('<!--!')==0) return data.slice(0, data.indexOf('-->')+3);
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
            if(parts[0] && parts[1] && parts[0].length>0 && parts[1].length>0) {
                parts[1] = parts[1].trim()
                if(parts[0].trim() == "style") parts[1] = styleExtractor(parts[1])
                result[parts[0].trim()] = parts[1];
            }
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
            if(parts[0] && parts[1] && parts[0].length>0 && parts[1].length>0)
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


module.exports = axConvertor