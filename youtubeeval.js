const youtubedl = require('youtube-dl')
// var Storage = require('node-storage');
// var store = new Storage('./storage/fetchedlinks');


process.once('message', code => {
    eval(
        process.on("message", function (e) {
            var urlLink = JSON.parse(e).data;
            //for each url/ return data
            // const urlKey = (new URL(urlLink)).pathname
            // var value = store.get(urlKey);// check cache first
            // console.log('storage: ', urlLink, value)

            // if (value == undefined) { //if none youtube dl it
            // } else {
            //     process.send(JSON.stringify(value))
            // }
            //assuming it exists
            youtubedl.getInfo(urlLink, function (err, info) {
                //console.log('got info')
                if (err) {
                    process.send(JSON.stringify(false))
                } else {
                    //set cache
                    //store.put(urlKey, info)
                    //console.log('')
                    process.send(JSON.stringify(info))
                }
            })
        })
    )
});

// value = myCache.get(urlLink);// check cache first
// if (value == undefined) { //if none youtube dl it
//     console.log(1)
//     await new Promise((resolve, reject) => {
//         youtubedl.getInfo(urlLink, function (err, info) {
//             console.log('got info')
//             if (err) {
//                 resolve(false)
//             } else {
//                 //set cache
//                 myCache.set(urlLink, info)
//                 resolve(info)
//             }
//         })
//     }).then(value => {
//         console.log(value)
//     })
//     console.log(3)
//     return 123;
// } else {
//     return value
// }


      // const youtubedl = require('youtube-dl')
      // const NodeCache = require("node-cache");
      // const myCache = new NodeCache();
      // //for each url/ return data
      // value = myCache.get(urlLink);// check cache first
      // if (value == undefined) { //if none youtube dl it
      //   console.log(1)
      //   await new Promise((resolve, reject) => {
      //     youtubedl.getInfo(urlLink, function (err, info) {
      //       console.log('got info')
      //       if (err) {
      //         resolve(false)
      //       } else {
      //         //set cache
      //         myCache.set(urlLink, info)
      //         resolve(info)
      //       }
      //     })
      //   }).then(value => {
      //     console.log(value)
      //   })
      //   console.log(3)
      //   return 123;
      // } else {
      //   return value
      // }
      // return 321