var bodyParser = require('body-parser');
var express = require('express'),
  app = express();
var port = 8080;
var Cloudant = require('@cloudant/cloudant');
var cloudant = Cloudant(
'https://09409268-3578-40b1-87f8-0d854a4d17b8-bluemix:896f65c85ee46d141e262b7fb20fbe94fdc8aee046d4d5f75c04ca6db85da6dc@09409268-3578-40b1-87f8-0d854a4d17b8-bluemix.cloudant.com'  
);
var watson = require('watson-developer-cloud');
var formidable = require('formidable');
var conversation = new watson.ConversationV1({
  username: '5fe0767b-af08-4def-8f36-4605eacf7248',
  password: 'rr1K2zW1q8kq',
  version_date: '2018-02-16'
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var education = cloudant.db.use('education');
// use session ref to call API, i.e.:

var pdfText = require('pdf-text');

var pathToPdf = 'que.pdf';
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);


//var pdfML = require('./pdfML');
//var pdfAnalyzer = new pdfML();

/*
pdfText(pathToPdf, function(err, chunks) {
  console.log(chunks);
  for (let i=0; i<chunks.length; i++){
    console.log(chunks[i]);
    pdfAnalyzer.analyzeText(chunks[i]);
  }
}); */


app.use(bodyParser.json());

app.post('/train/pdf', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var oldpath = files.path;
    var newpath = files.name;
    fs.rename(oldpath, newpath, function(err) {
      if (err) throw err;
      res.write('File uploaded and moved!');
      res.end();
    });
  });
});

app.post('/createuser', function(req, res) {
  education.insert({ userId: 1 }, function(err, body, header) {
    if (err) {
      res.status(500).send({ message: "Can't create User" });
    }
    res.send({ message: 'User created with success' });
    console.log(body);
  });
});

/*
* This create the chat bot and the course on the backend database.
*/

app.post('/newcourse', function(req, res) {
  var course = {
    name: req.body.name,
    description: req.body.description,
    lessons_number: req.body.lessons_number,
    createdBy: req.body.createdBy
  };
  insertIntoDatabase(course).then(function(result_database) {
    if (result_database.message) {
      res.status(500).send(result_database);
    } else {
      createChatBot(result_database.id, req.body.description).then(function(
        result_chatbot
      ) {
        if (result_chatbot.error) {
          res.status(500).send(result_chatbot);
        } else {
          res.status(200).send(result_database);
        }
      });
    }
  });
});

//WE NEED TO UPDATE THIS EVERYTIME WE CHANGE A STEP;
app.post('/updatecourse', function(req, res) {
  console.log(req.body);
  req.body._id = req.body.id;
  req.body._rev = Math.random();
  console.log("Updating document 'mydoc'");
  // make a change to the document, using the copy we kept from reading it back
  education.insert(req.body, function(err, data) {
    console.log('Error:', err);
    console.log('Data:', data);
    // keep the revision of the update so we can delete it
    res.sendStatus(200);
  
  });
  
});

function insertIntoDatabase(document) {
  return new Promise(function(resolve, reject) {
    education.insert(document, function(err, body, header) {
      if (err) {
        reject(err);
        console.log("Can't insert into DB Error:", err.message);
      }
      resolve(body);
    });
  });
}

function createChatBot(databaseId, description) {
  var workspace = {
    name: 'course_' + databaseId,
    description: description
  };
  return new Promise(function(resolve, reject) {
    conversation.createWorkspace(workspace, function(err, response) {
      if (err) {
        var error = { error: "Can't create the workspace" };
        reject(error);
      } else {
        resolve(JSON.stringify(response, null, 2));
      }
    });
  });
}

app.use(express.static(__dirname + '/public'));

app.listen(port);
console.log('Listening on port ', port);
