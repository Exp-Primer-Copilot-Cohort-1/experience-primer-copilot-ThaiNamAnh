// Create web server
// 1. Load modules
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var comments = require('./comments.json');
var path = require('path');

// 2. Create server
http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    var extname = path.extname(filename);
    console.log(extname);
    if (filename == './comments') {
        if (req.method == 'POST') {
            var body = '';
            req.on('data', function (data) {
                body += data;
                if (body.length > 1e6)
                    req.connection.destroy();
            });
            req.on('end', function () {
                var post = qs.parse(body);
                comments.push(post);
                fs.writeFile('comments.json', JSON.stringify(comments), 'utf8', function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('Comment saved to file');
                res.end();
            });
        }
        else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(comments));
            res.end();
        }
    }
    else {
        fs.readFile(filename, function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("404 Not Found");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
    }
}).listen(8080);
console.log('Server running at http://