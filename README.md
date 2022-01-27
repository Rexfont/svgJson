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
 * @param {string} outputFormat: the version of outputed data : svg, json, fontSVG
 * @param {string} filename: the name of file the data should be written on
 * @param {boolean} unify: Whether the SVG specific tags should be all converted to PATH or not
 */
```

### Node Module
```
npm i svgjson
```
##### To use the module, add the requirement to your file:
```
const svgjson = require('svgjson');
```
Simple Example:
```
svgjson.convert({input: '<svg>'})
```
##### You can convert all SVG specific tags to PATH by setting -> unify:true

example:
```
svgjson.convert({input: '<svg>', unify: true})
```
- You can store the generated data directly to a file with your choice with the 'filename' parameter
- and select the outputed format with 'outputFormat' parameter (if the generated data is svg already, by selecting svg, it will not change, but by selecting "json" the returned data shall be json)
complete Example:
```
svgjson.convert({input: 'filepath/string', outputFormat: 'svg', filename: 'example.txt', unify: true})
```

##### Now you can also directly convert the path all commands to Relative or Absolute
```
const options = {input: 'filepath/string', outputFormat: 'svg', filename: 'example.txt', unify: true}

svgjson.parseAbsolute(options) // to parse path commands to absolute
svgjson.parseRelative(options) // to parse path commands to relative
```

##### For converting the path commands to seperate arrays to have them all exploited:
```
const options = {input: 'filepath/string', outputFormat: 'svg', filename: 'example.txt', unify: true}
svgjson.parsePath(options)
```

##### Get the contours of the svg pathes:
- direcltParseContour
```
svgjson.direcltParseContour(path)
```
- When using the parsePoints function to directly convert your PATH to contour, now, you will also recieve the { xMax, xMin, yMax, yMin } in the return

```
svgjson.parsePath(options)
```
##### parse use directly:
 - parseJson
 - parseSvg
 - parseSvgfont
 - parseAbsoluteDirectly
 - parseRelativeDirectly
```
svgjson.parseAbsoluteDirectly('M527.62,0c-80.7,61.1-227.63,252.22-190.29,322.65s244.78-6.5,325.48-67.6,115.86-167.72,78.53-238.15S1094.52,574.19,1013.81,635.28Z')
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


## Version 1.3.0 updates:

- matrix transformer implemented into the 'parseSvgfont'
- pathGotRelatives(path)
- pathGotAbsolutes(path)
- Bug fix


Brought to you by [REXFONT](https://rexfont.com)
