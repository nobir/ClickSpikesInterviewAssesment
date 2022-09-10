const http = require('http');
const url = require('url');
const { exec } = require('node:child_process');

http
    .createServer(function (req, res) {
        const queryObject = url.parse(req.url, true).query;
        console.log(queryObject);
        let values = Object.values(queryObject);
        exec('julia script.jl ' + values.join(','), (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(stdout);
        });
    })
    .listen(8080);