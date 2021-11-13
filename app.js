const express = require('express');
const app = express();
const path = require('path');
const multer  = require('multer')
const cors = require('cors')
app.use(cors())
const upload = multer({ dest: '../uploads' })
const axConvertor = require('./src/xmltojson');
const root = '/xmltojson';
const PORT = process.env.PORT || 8000;


app.get(`${root}/`, (req, res) => {
  res.sendFile(path.join(__dirname, './views/index.html'));
});

app.get(`${root}/web`, (req, res) => {
  res.sendFile(path.join(__dirname, './src/xmltojson.js'));
});

app.post(`${root}/convert`, upload.single('file'), async (req, res) => {
  if(req.file) {
    const converted = await axConvertor(path.join(__dirname, `./${req.file.path}`), true, false);
    res.send(converted)
  }
  res.send(await convert(req.body.code, false))
})


app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));