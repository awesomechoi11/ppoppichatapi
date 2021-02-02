const youtubedl = require('youtube-dl')
// var Storage = require('node-storage');
// var store = new Storage('./storage/fetchedlinks');


process.once('message', code => {
    eval(
        process.on("message", function (e) {
            var urlLink = JSON.parse(e).data;

            youtubedl.getInfo(urlLink, function (err, info) {
                if (err) {
                    process.send(JSON.stringify(false))
                } else {

                    process.send(JSON.stringify(info))
                }
            })


        })
    )
});

