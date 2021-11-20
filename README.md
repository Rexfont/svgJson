# SVGJSON
I can convert any XML file to JSON

Specially used for converting SVG file to json and vice versa

## Methods of use:
 - CDN link
 - API
 - Web Interface

### CDN link
 - link: https://rexfont.com/svgjson/cdn
 - The function to use: axConvertor(filedata, web)
 ```
 /**
   * 
   * @param {file/string} filedata This will contain the file data or the string that will be converted
   * @param {boolean} web This shall tell whether the request was made from web or nodejs 
   * @returns The first and last step of converting
   */
 ```
 - Example:
 ```
 <script src="https://rexfont.com/svgjson/web"></script>
 await axConvertor(document.getElementById('file').files[0], true, true);
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



Brough to you by [REXFONT](https://rexfont.com)
