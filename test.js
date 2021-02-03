const path = require('path');
const colors = require('colors');
const forEach = require('lodash/forEach');
//const { FFCreatorCenter, FFScene, FFVideo, FFCreator } = require('ffcreator');
const { FFCreatorCenter, FFScene, FFVideo, FFCreator } = require('ffcreatorlite');

const { rawVideoData2, tiktokData, rawVideoData, tiktokData2 } = require('./rawdata')
//FFCreator.setFFmpegPath('./ffstuff/ffmpeg.exe');

const os = require('os')

const tiktokUrl = 'http://www.api.ppoppichat.xyz/fetchVideoInfo?url=https://www.tiktok.com/@tootall.20/video/6912543432758119685?lang=en'

function calcScale(w) {
    return 1920 / w;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function fit(dW, dH, w, h) {
    //return x and y
    var ratio = 0;
    const standardRatio = 16 / 9
    var x = 0;
    var y = 0;
    var width;
    var height;
    var scale;
    if (w && h) {
        ratio = w / h;
        width = w;
        height = h;
        if (ratio > standardRatio) {
            //fit by width
            scale = dW / w
            y = (dH - h * scale) / 2
        } else {
            //fit by height
            scale = dH / h
            x = (dW - w * scale) / 2
        }
    } else {
        if (w) {
            //if only w fit to width
            scale = dW / w
            h = w / standardRatio
            y = (dH - h * scale) / 2

            width = w;
            height = h;

        } else if (h) {
            // if only h fit to height
            scale = dH / h
            w = h * standardRatio
            x = (dW - w * scale) / 2
            console.log()
            height = h;
            width = w

        } else {
            //if neither
            throw 'no width or height for dis video'
        }
    }
    return [x, y, width, height, scale]
}

function headersToArray(headers) {
    var OptionArray = ['-headers', ''];

    if (headers['User-Agent']) {
        OptionArray = OptionArray.concat([
            '-user_agent',
            headers['User-Agent'],
        ])
    }
    if (headers['Referer']) {
        OptionArray = OptionArray.concat([
            '-referer',
            headers['Referer'],
        ])
    }

    forEach(headers, function (value, key) {
        OptionArray[1] += (key + ':' + value + os.EOL)
    });
    return OptionArray
}

const createFFTask = (videoArr) => {

    if (!videoArr) {
        return null;
    }

    const outputDir = path.join(__dirname, './output/');
    const cacheDir = path.join(__dirname, './cache/');

    // create creator instance
    const fps = 24;
    const dW = 1920;
    const dH = 1080;
    const effectDur = 0.1;


    const creator = new FFCreator({
        cacheDir,
        outputDir,
        w: dW,
        h: dH,
        debug: false,
        fps: fps
    });
    var currTime = 0;
    videoArr.forEach(vid => {

        const url = vid.data.url
        //const url = 'http://www.localhost:8980'

        const duration = vid.data['_duration_raw'];
        //const duration = 2.5

        const [x, y, width, height, scale] = fit(dW, dH, Number(vid.data.width), Number(vid.data.height))

        const video = new FFVideo({
            path: url,
            x: x,
            y: y,
            w: width,
            h: height,
            fps: fps,
            scale: scale,
            customOptions: headersToArray(vid.data.http_headers)
        })
        video.setDuration(duration)

        video.addEffect({
            type: 'fadeIn',
            time: effectDur,
            delay: 0
        })
        video.addEffect({
            type: 'moveInLeftBig',
            time: effectDur,
            delay: 0
        })
        video.addEffect({
            type: 'fadeOut',
            time: effectDur,
            delay: duration - effectDur
        })
        video.addEffect({
            type: 'moveOutRightBig',
            time: effectDur,
            delay: duration - effectDur
        })


        const scene = new FFScene({
            bgcolor: getRandomColor(),
        });

        scene.setDuration(duration);

        scene.addChild(video)

        currTime += duration;
        creator.addChild(scene);
    })


    creator.start();
    creator.openLog();

    creator.on('start', () => {
        console.log(`FFCreator start`);
    });

    creator.on('error', e => {
        console.log(`FFCreator error: ${e.error}`);
    });

    creator.on('progress', e => {
        console.log(colors.yellow(`FFCreator progress: ${(e.percent * 100) >> 0}%`));
    });

    creator.on('complete', e => {
        console.log(
            colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
        );

        console.log(colors.green(`\n --- all done!! --- \n`));
    });

    return creator;
};



module.exports = { createFFTask }

