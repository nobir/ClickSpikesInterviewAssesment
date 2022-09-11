const http = require('http');
const url = require('url');
const { exec } = require('node:child_process');

/**
 * Create a serve from http module
 * which only listen to 8080 port
 * the default host is localhost
 * so, the url is http://localhost:8080/
 * 
 * if need to changed the host name
 * we can do <server>.listen(8080, "examplehost");
 */
http
    .createServer(function (req, res) {
        const queryObject = url.parse(req.url, true).query;         // convert the requested url to object
        // console.log(queryObject);
        let values = Object.values(queryObject);                    // ignoring url param keys and only get the value

        console.log(values);
        console.log('julia script.jl ' + values.join(', '));

        /**
         * exec is a function that run the shell command from the nodejs
         * in this case we run julia command
         * 
         * lets say we have a value of array '["call or about", "the who"]'
         * we need to convert to string 'call or about the who'
         * to send the search value argument for the
         * script.jl (julia) file
         * 
         * Note: values array have only 1 element in the given problem
         */
        exec('julia script.jl ' + values.join(' '), (error, stdout, stderr) => {

            /**
             * if there is exec error just
             * show the error to the console
             * and return null
             */
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            // console.log(`stdout: ${stdout}`);

            /**
             * if there is error in child process
             * lets say julia command return an error
             * stderr will return the child process error
             */
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }

            /**
             * writeHead function write the header of the
             * response with 200 status code which is OK.
             * There are two option we have added two option
             * for CORS. It will accept any request form any origins
             */
            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Method': '*',
            });

            /**
             * after all the operation done
             * we need to send the response data
             * using response end method
             */
            res.end(stdout);
        });
    })
    .listen(8080);