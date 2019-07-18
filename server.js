'use strict';

var bodyParser = require('body-parser');
var express = require('express'),
  app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.json());


app.use(express.static(__dirname + '/public'));


app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


app.listen(port);
console.log('Listening on port ', port);