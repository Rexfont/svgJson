# XMLandJSON
I can convert any XML file to JSON

Specially used for converting SVG file to json

## Methods of use:
 - CDN link
 - API
 - Web Interface

### CDN link
 - link: https://axoncodes.com/xmlandjson/web
 - The function to use: axConvertor(filedata, file, web)
 ```
 /**
   * 
   * @param {file/string} filedata This will contain the file data or the string that will be converted
   * @param {boolean} file This shall tell whether the @param filedata is FILE or STRING of data 
   * @param {boolean} web This shall tell whether the request was made from web or nodejs 
   * @returns The first and last step of converting
   */
 ```
 - Example:
 ```
 <script src="https://axoncodes.com/xmlandjson/web"></script>
 await axConvertor(document.getElementById('file').files[0], true, true);
 ```

### API
- Link: https://axoncodes.com/xmlandjson/convert
- Method: POST
- data type: form-data
- parameters:
    - file: upload file to convert
    - code: paste the code directly

### Web Interface
 You can use the interface powerd by API: https://axoncodes.com/xmlandjson/



Brough to you by [AXONCODES](https://axoncodes.com)