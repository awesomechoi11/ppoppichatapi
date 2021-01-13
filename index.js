const { response } = require('express')
const express = require('express')
var cors = require('cors');
const app = express()
const youtubedl = require('youtube-dl')

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/fetchVideoInfo', function (req, res) {
  const url = req.query.url;
  if (url) {
    youtubedl.getInfo(url, function (err, info) {
      if (err) {
        res.send(err)
      } else {
        res.send(info)
      }
    })
  } else res.send('missing url query');
})

app.get('*', function (req, res) {
  res.send('Hello World')
})

app.listen(8090)