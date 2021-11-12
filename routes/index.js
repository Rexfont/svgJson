var express = require('express');
const path = require('path');
var router = express.Router();
const server = "http://localhost:3000"

const convert = require('../src/xmltojson');
const svgConvertors = require('../src/svgConvertors');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '322Express' });
});


(async () => {
  const filename = path.join(__dirname, `../public/image/batteryfinal-11.svg`);
  let jsonData = await convert(filename);
  jsonData = jsonData.map(tagData => {
    const attrs = tagData.attributes;
    tagData.attributes = {};
    if (tagData.tag == "rect") {
      tagData.attributes.d = svgConvertors.rect(attrs);
      tagData.tag = "path";
    } else if (tagData.tag == "polyline") {
      tagData.attributes.d = svgConvertors.polyline(attrs);
      tagData.tag = "path";
    } else if (tagData.tag == "line") {
      tagData.attributes.d = svgConvertors.line(attrs);
      tagData.tag = "path";
    } else if (tagData.tag == "circle") {
      tagData.attributes.d = svgConvertors.circle(attrs);
      tagData.tag = "path";
    } else if (tagData.tag == "polygon") {
      tagData.attributes.d = svgConvertors.polygon(attrs);
      tagData.tag = "path";
    } else tagData.attributes = attrs;
    tagData.tag = "path";
    return tagData;
  });
})()

module.exports = router;
