# SVGJSON
I can convert any XML file to JSON

Specially used for converting SVG file to json and vice versa

## Methods of use:
 - Node Module
 - API
 - Web Interface

### Node Module
```
npm i svgjson
```
```
Params: 
/**
 * @param {string/file} input : the path to file or string as data
 * @param {boolean} output: write to file or just return the generated data
 * @param {string} filename: the name of file the data should be written on
 * @param {boolean} unify: Whether the SVG specific tags should be all converted to PATH or not
 */
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
complete Example:
```
svgjson({input: 'filepath/string', remove: false, output: true, filename: 'example.txt', unify: true})
```

### API
- Link: https://rexfont.com/modules/svgjson/convert
- Method: POST
- data type: form-data
- parameters:
    - file: upload file to convert
    - code: paste the code directly

### Web Interface
 You can use the interface powerd by API: https://rexfont.com/modules/svgjson/



Brough to you by [REXFONT](https://rexfont.com)
