var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
var fs = require('fs')
var stream = fs.createWriteStream('outputfile.divx');


const tkurl = 'https://v16-web.tiktok.com/video/tos/useast2a/tos-useast2a-ve-0068c004/803143816c8147279b0911dc61690ec3/?a=1988&br=3042&bt=1521&cd=0%7C0%7C1&cr=0&cs=0&cv=1&dr=0&ds=3&er=&expire=1610778506&l=2021011600275601018907315207040BE8&lr=tiktok_m&mime_type=video_mp4&policy=2&qs=0&rc=MzNvM2tvNDo3eTMzNDczM0ApZDplNjM2ZGQ6N2RpaDNkZ2cuLW5xNTJjZ2tfLS0zMTZzczYuMjIzNmJiLi0zYTE0YmE6Yw%3D%3D&signature=df9e59293f425efe6c5f21ae801d7833&tk=tt_webid_v2&vl=&vr='
const url = 'http://localhost:8980'

var options = [
    '-headers',
    'Accept-Charset:ISO-8859-1,utf-8;q=0.7,*;q=0.7\r\nAccept-Language: en-us,en;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nAccept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nCookie:tt_webid=6918148083328222726; tt_csrf_token=g335spSfnGElGf2LFxQDvIgW; tt_webid_v2=6918148083328222726\r\n',
    '-referer',
    'Referer:https://www.tiktok.com/',
    '-user_agent',
    'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.70 Safari/537.36',
]

command
    .input(url)
    .inputOptions(options)
    .output('outputfile.mp4')
    .on('end', function () {
        console.log('Finished processing');
    })
    .run();




// options.concat([
//     '-c:v',
//     'libx264', // c:v - H.264
//     '-profile:v',
//     'main', // profile:v - main profile: mainstream image quality. Provide I / P / B frames
//     '-preset',
//     'medium', // preset - compromised encoding speed
//     '-crf',
//     '20', // crf - The range of quantization ratio is 0 ~ 51, where 0 is lossless mode, 23 is the default value, 51 may be the worst
//     '-movflags',
//     'faststart',
//     '-pix_fmt',
//     'yuv420p',
// ]).concat([
//     '-map',
//     '0',
//     '-hide_banner', // hide_banner - parameter, you can display only meta information
//     '-map_metadata',
//     '-1',
//     '-map_chapters',
//     '-1',
// ])