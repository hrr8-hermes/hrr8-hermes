var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/*', function(req, res) {
  if(req.path === "/") {
    req.path = "/index.html";
  }
  res.sendfile('public' + req.path);
});

module.exports = app;
