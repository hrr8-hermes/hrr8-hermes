/* preprocess.js
 *
 * Uses npm's preprocess module to parse public/src files
 */

var fs = require('fs');
var pp = require('preprocess');
var base_dir = '/client';

var process_dirs = [  '/',
                      '/js/' ];

var context = {};
context.socketCDN = 'https://cdn.socket.io/socket.io-1.3.5.js';
context.babylonCDN = 'http://cdn.babylonjs.com/2-2/babylon.js';

if (process.argv[2]==='debug') {
  context.DEBUG = 'true';
} else {
  context.DEBUG = 'false';
}

var out_dir = __dirname+'/public';

var readDir = function(dir, cb) {

  fs.readdir(dir, function(err, list) {
    if (err) return cb(err);

    list.forEach(function(file) {

      var path = dir+file;
      var ext = path.split('.').pop();
      if (ext === 'html' || ext === 'js') {
        cb(null,path);
      }
    });
  });

};

process_dirs.forEach(function(path) {
  readDir(__dirname+base_dir+path, function(err, fpath) {
    if (err) return 1;
    if (context.DEBUG==='true') {
      var outfile = out_dir+path+fpath.split('/').pop();
    } else {
      var outfile = out_dir+'/'+fpath.split('/').pop();
    }
    pp.preprocessFileSync(fpath,outfile,context);
  });
});
