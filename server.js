
let https = require('https');
let fs = require('fs');

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, function (req, resp) {

  let url = req.url;

  url = url.split('?').shift();

  if (url == '/') {
    url = 'index';
  }

  if (url.indexOf('/') === 0) {
    url = url.substr(1);
  }

  try {
    let content = fs.readFileSync('./' + url);
    console.log(url);
    resp.writeHead(200, {});
    resp.end(content);
  }
  catch (err) {
    console.log('Couldn\'t find', url);
    resp.writeHead(404, {
    });
    resp.end('whoopsie');
  }

}).listen(8080);
console.log('listening on 8080');
