var express = require('express');
var app = express();
var port = 1337;

app.use(express.static(__dirname + '/client'));

console.log('Global Game Jam Demo Listening on Port ' + port);
app.listen(port);
