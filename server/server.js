var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/../public'));
app.use('/Assets',express.static(__dirname + '/../assets'));
app.use('/js/external',express.static(__dirname + '/../external'));

module.exports = app;
