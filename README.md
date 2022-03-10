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

## Version 1.4.0 updates:
 - In the parseJson, the styles are being exploited into class names and values as well as each css property used
 - In the parseSvgfont, the class attributes are being replaced with the styles of the class
    - It also identifies the the actual tag that takes style (glyphs) and uses the styles for those, even if the class is used on a g tag outside of the glyph

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
##### matrix transformer
matrix transformer implemented into the 'parseSvgfont'

##### figure out whether the path is relative or absolute
- pathGotRelatives(path)
- pathGotAbsolutes(path)

##### Able to Process multiple icons

### Upgrades on 2.0.0
- Merge multiple svgs to a single svg data, input will be an array of svg tag (the content of svg files) format of the svgs to merge
    - simple example:
    ```
        svgjson.mergeSvgs(svgsData)
    ```
    - practical example:
    ```
        <!-- convert the svg file to svgsData -->
        svgjson.readFiles([svgfile_address1, svgfile_address2, svgfile_address3, ...])
        .then(svgsData => svgjson.mergeSvgs(svgsData)
    ```
- Advanced style handler separate requests to add new styles to svgjson.
    - It takes care of the every aspect of the style(color, font size).
    - example:
    ```
        <!-- the svgjson is supposed to be json format created through convert method -->
        svgjson = svgjson.colorHandler(svgjson, '#000')
        svgjson = svgjson.sizeHandler(svgjson, '120')
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


Brought to you by [REXFONT](https://rexfont.com)
