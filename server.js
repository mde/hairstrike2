let https = require('https');
let fs = require('fs');
let path = require('path');

const TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject'
};

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
    // Extensionless pages (index, band, photos, ...) are HTML
    let type = TYPES[path.extname(url).toLowerCase()] || 'text/html; charset=utf-8';
    console.log(url, '->', type);
    resp.writeHead(200, {'Content-Type': type});
    resp.end(content);
  }
  catch (err) {
    console.log('Couldn\'t find', url);
    resp.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8'
    });
    resp.end('whoopsie');
  }

}).listen(8080);
console.log('listening on 8080');
