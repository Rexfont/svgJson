var express = require('express');
const path = require('path');
var router = express.Router();

const convert = require('../src/xmltojson');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '322Express' });
});



module.exports = router;
