# SVGJSON
I can convert any XML file to JSON

Specially used for converting SVG file to json and vice versa

## Methods of use:
 - Node Module
 - API
 - Web Interface

 Params:
```
/**
 * @param {string/file} input : the path to file or string as data
 * @param {boolean} outputFormat: the version of outputed data : svg, json
 * @param {string} filename: the name of file the data should be written on
 * @param {boolean} unify: Whether the SVG specific tags should be all converted to PATH or not
 */
```

### Node Module
```
npm i svgjson
```
To use the module, add the requirement to your file:
```
const svgjson = require('svgjson');
```
Simple Example:
```
svgjson({input: '<svg>'})
```
You can convert all SVG specific tags to PATH by setting -> unify:true

example:
```
svgjson({input: '<svg>', unify: true})
```
- You can store the generated data directly to a file with your choice with the 'filename' parameter
- and select the outputed format with 'outputFormat' parameter (if the generated data is svg already, by selecting svg, it will not change, but by selecting "json" the returned data shall be json)
complete Example:
```
svgjson({input: 'filepath/string', remove: false, outputFormat: 'svg', filename: 'example.txt', unify: true})
```

### API
- Link: https://rexfont.com/svgjson/convert
- Method: POST
- data type: form-data
- parameters:
    - file: upload file to convert
    - code: paste the code directly

### Web Interface
 You can use the interface powerd by API: https://rexfont.com/svgjson/


## Version 0.0.9 updates:
- You can now convert an SVG file ti directly unify the tags and store output to another file
- You can choose to either have the output as svg or json despite the input data


Brough to you by [REXFONT](https://rexfont.com)
