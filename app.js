const express = require('express');
const app = express();
const path = require('path');
const multer  = require('multer')
const cors = require('cors')
app.use(cors())
const upload = multer({ dest: '../../uploads/' })
const xmlToJson = require('./lib/xmltojson');
const root = '/xmltojson';
const PORT = process.env.PORT || 8001;

app.use((req, res, next) => {
  console.log(`${req.method} : ${req._parsedUrl.path}`);
  next();
})

app.get(`${root}/`, (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.get(`${root}/web`, (req, res) => {
  res.sendFile(path.join(__dirname, './lib/xmltojson.min.js'));
});

app.post(`${root}/convert`, upload.single('file'), async (req, res) => {
  if(req.file) {
    const response = await xmlToJson.axConvertor(path.join(__dirname, `./${req.file.path}`), true, false);
    res.send(response)
  } else {
    const response = await xmlToJson.axConvertor(req.body.code, false, false);
    res.send(response)
  }
})


app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));