const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path')

const mime = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "htm": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "mp3": "audio/mpeg",
    "m4a": "audio/mp4a-latm",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};
const specialExt = ['png', 'jpg', 'mp3', 'wav', 'gif', 'm4a','exe','apk'];


function start(selectDir, selectPort) {
    http.createServer(function (request, response) {
        let pathname = url.parse(request.url).pathname;
        let dir = selectDir + pathname;
        if (!fs.existsSync(dir)) {
            response.writeHead(404, {
                'Content-Type': 'text/html'
            });
            response.end();
            return;
        }
        let ext = path.extname(pathname);
        ext = ext ? ext.slice(1) : 'unknown';
        let contentType = mime[ext] || "text/plain";
        if (specialExt.indexOf(ext) > -1) {
            let stream = fs.createReadStream(dir);
            let responseData = []; //存储文件流
            if (stream) { //判断状态
                stream.on('data', function (chunk) {
                    responseData.push(chunk);
                });
                stream.on('end', function () {
                    let finalData = Buffer.concat(responseData);
                    response.write(finalData);
                    response.end();
                });
            } else {
                response.writeHead(404, {
                    'Content-Type': 'text/html'
                });
                response.end();
            }

        } else
            fs.readFile(dir, function (err, data) {
                if (err) {
                    console.log(err);
                    // HTTP 状态码: 404 : NOT FOUND
                    // Content Type: text/plain
                    response.writeHead(404, {
                        'Content-Type': contentType
                    });
                } else {
                    // HTTP 状态码: 200 : OK
                    // Content Type: text/plain
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });

                    // 响应文件内容
                    response.write(data.toString());
                }
                //  发送响应数据
                response.end();
            });
    }).listen(selectPort);
}

module.exports = start;