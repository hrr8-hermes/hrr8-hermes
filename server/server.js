var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/../public'));
//app.use(express.static(__dirname + '/../client'));
//app.use(express.static(__dirname + '/../client/testClient'));

app.use('/Assets',express.static(__dirname + '/../assets'));
app.use('/js/external',express.static(__dirname + '/../external'));
app.use('/sounds',express.static(__dirname + '/../sounds'));
app.use('/styles',express.static(__dirname + '/../styles'));
module.exports = app;
