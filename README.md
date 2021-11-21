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
 * @param {string/file} data : the path to file or string as data
 * @param {boolean} web: web/node, declare whether you are using this function by node or web
 * @param {boolean} file: declare whether you are using a file or string as data
 * @param {boolean} remove: in case of using file, should the file be deleted or not
 * @param {boolean} output: write to file or just return the generated data
 * @param {string} filename: the name of file the data should be written on
 */
```
Example:
```
svgjson({data: 'filepath/string', web: false, file: true, remove: true, output: true, filename: 'example.txt'})
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
