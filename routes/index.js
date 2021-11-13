var express = require('express');
const path = require('path');
var router = express.Router();
const multer  = require('multer')
const cors = require('cors')
const upload = multer({ dest: 'uploads/' })
const convert = require('../src/xmltojson');
router.use(cors())

/* GET home page. */
router.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/test', (req, res) => {
  return res.send("Welcome to xmlTojson convertor")
});

router.post('/xmltojson', upload.single('file'), async (req, res) => {
  if(req.file) {
    const converted = await convert(path.join(__dirname, `../${req.file.path}`), true);
    return res.send(converted)
  }
  return res.send(await convert(req.body.code, false))
})


module.exports = router;
