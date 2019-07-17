var bodyParser = require('body-parser');
var express = require('express'),
  app = express();
var port = 8080;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(bodyParser.json());

app.get('/domain/maritalstatus', function(req, res) {
  res.send({});
});

app.use(express.static(__dirname + '/public'));

app.listen(port);
console.log('Listening on port ', port);
