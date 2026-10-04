let https = require('https');
let fs = require('fs');
let path = require('path');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

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

function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  }
  catch (err) {
    return false;
  }
}

function notFound(resp, url) {
  console.log('Couldn\'t find', url);
  resp.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
  resp.end('whoopsie');
}

https.createServer({
  key: fs.readFileSync(path.join(ROOT, 'key.pem')),
  cert: fs.readFileSync(path.join(ROOT, 'cert.pem'))
}, function (req, resp) {

  let url;
  try {
    url = decodeURIComponent(req.url.split('?').shift());
  }
  catch (err) {
    return notFound(resp, req.url);
  }

  if (url == '/') {
    url = '/index';
  }

  let file = path.join(ROOT, path.normalize(url));
  if (!file.startsWith(ROOT + path.sep)) {
    return notFound(resp, url);
  }

  // Production keeps empty foo.html stubs in S3 that 301 to foo, so the
  // links to /band.html etc. work there. Do the same here instead of
  // serving the empty stub.
  if (path.extname(url) == '.html') {
    let bare = url.slice(0, -'.html'.length);
    if (isFile(path.join(ROOT, bare))) {
      console.log(url, '-> 301', bare);
      resp.writeHead(301, {'Location': bare});
      return resp.end();
    }
  }

  if (!isFile(file)) {
    return notFound(resp, url);
  }

  // Extensionless pages (index, band, photos, ...) are HTML
  let type = TYPES[path.extname(file).toLowerCase()] || 'text/html; charset=utf-8';
  let size = fs.statSync(file).size;
  let headers = {'Content-Type': type, 'Accept-Ranges': 'bytes'};

  // Byte ranges, so the big live-set MP3s stream and can be seeked
  // instead of being read into memory whole
  let range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range && (range[1] || range[2])) {
    let start = range[1] ? parseInt(range[1], 10) : Math.max(size - parseInt(range[2], 10), 0);
    let end = range[1] && range[2] ? Math.min(parseInt(range[2], 10), size - 1) : size - 1;
    if (start > end || start >= size) {
      resp.writeHead(416, {'Content-Range': 'bytes */' + size});
      return resp.end();
    }
    headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + size;
    headers['Content-Length'] = end - start + 1;
    console.log(url, '->', type, headers['Content-Range']);
    resp.writeHead(206, headers);
    fs.createReadStream(file, {start: start, end: end}).pipe(resp);
    return;
  }

  headers['Content-Length'] = size;
  console.log(url, '->', type);
  resp.writeHead(200, headers);
  fs.createReadStream(file).pipe(resp);

}).listen(PORT);
console.log('listening on https://localhost:' + PORT);
