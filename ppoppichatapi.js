const { response } = require('express')
const express = require('express')
var cors = require('cors');
const app = express()
const youtubedl = require('youtube-dl')

//const { FFScene, FFText, FFVideo, FFAlbum, FFImage, FFCreator } = require("ffcreator");
var isArray = require('lodash.isarray');
var forEach = require('lodash.foreach');
var cloneDeep = require('lodash.clonedeep')
var each = require('async-each');

const Parallel = require('paralleljs')


var Storage = require('node-storage');
var store = new Storage(__dirname + '/storage/fetchedlinks');

// const NodeCache = require("node-cache");
// const myCache = new NodeCache({
//   stdTTL: 3600
// });

// myCache.on("set", function (key, value) {
//   // ... do something ...
//   console.log('cache set!!!', key)
// });

app.use(cors({
  origin: 'http://localhost:3000'
}));

const punctuation = /[\ -\/]|[\:-@]|[\[-\`]/gm

function makeitsafe(url) {
  //takes url and turns it into store safe unique id
  const urlobj = (new URL(url))
  var finalurl = urlobj.href.split('%')[0]
  if (isYoutube(finalurl)) {
    finalurl = 'youtube' + urlobj.searchParams.get('v')
  }
  //console.log(typeof urlobj.replace())
  try {
    var newstring = finalurl.replace(punctuation, '')
    return newstring
  } catch (e) {
    console.log(e)
    return ""
  }

}

const isYoutube = (url) => {
  return (new URL(url)).hostname.split('.').includes('youtube') ||
    (new URL(url)).hostname.split('.').includes('youtu')
}

app.get('/fetchVideoInfo', function (req, res) {
  var url = req.query.url;
  if (url) {
    if (!isArray(url)) {
      url = [url];
    }


    var needToGetArr = []
    var output = {}
    //for each check if in cache
    console.log('foreach start')
    url.forEach((value, index) => {
      const urlKey = makeitsafe(value)
      var cash = store.get(urlKey);
      console.log('need to get ', urlKey, cash ? 'fetched' : 'undefined')
      if (cash) {
        //return cached item
        cash.queuepos = index// set queuepos in object returned
        output[urlKey] = cash
      } else {
        //else add to queue
        output[urlKey] = { queuepos: index }; // created new object with queuepos
        needToGetArr.push(value)
      }
    })
    console.log('end')
    //output is object with pathnames as keys and objects of data and queuepos 
    if (needToGetArr.length > 0) {

      //use parallel to get non links
      const p = new Parallel(needToGetArr, {
        evalPath: __dirname + '/youtubeeval.js'
      });

      p.map(urlLink => {
        //check cache
        return urlLink
      }).then(data => {

        console.log('done ', data)
        data.forEach(value => {
          const urlKey = makeitsafe(value.webpage_url)
          console.log('need to store at ', urlKey)
          store.put(urlKey, value)
          //set new object queuepos and replace old object
          if (output[urlKey])
            var valueclone = cloneDeep(value)
          valueclone.queuepos = output[urlKey].queuepos
          console.log(1232311232)
          output[urlKey] = valueclone;

        })
        forEach(output, (value, key) => {
          console.log(value.queuepos)
          console.log(value.webpage_url)
        })
        res.send(output)

      }, e => {
        console.log(e)
      })


    } else {

      forEach(output, (value, key) => {
        console.log(value.queuepos)
        console.log(value.webpage_url)
      })
      res.send(output)

    }

  } else res.send('missing url query');

})


app.get('/renderVideo', function (req, res) {
  console.log(req.data)
})


app.get('*', function (req, res) {
  res.send('Hello World')
})

app.listen(8090)