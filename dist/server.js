'use strict';

var bodyParser = require('body-parser');
var express = require('express'),
    app = express();
var port = 8080;
var Cloudant = require('@cloudant/cloudant');
var cloudant = Cloudant('https://3e12d22f-7031-42d4-b359-9365d5c2a960-bluemix:98b698159592d9403bb4f7367e43b6dfdf193e66eb22a75066e820516ca2c2ad@3e12d22f-7031-42d4-b359-9365d5c2a960-bluemix.cloudant.com');
var watson = require('watson-developer-cloud');

var conversation = new watson.ConversationV1({
  username: '85c90b3d-39b3-4f7e-8cd2-afb7c37d2e8f',
  password: '2kIaug5F8aAt',
  version_date: '2018-02-16'
});

var education = cloudant.db.use('education');
// use session ref to call API, i.e.:

var pdfText = require('pdf-text');

var pathToPdf = 'questions.pdf';
app.use(bodyParser.urlencoded({
  extended: false
}));

pdfText(pathToPdf, function (err, chunks) {
  console.log(chunks);
  var a = chunks.indexOf('1.');
  console.log(a);
});

app.use(bodyParser.json());

app.post('/createuser', function (req, res) {
  education.insert({ userId: 1 }, function (err, body, header) {
    if (err) {
      res.status(500).send({ message: "Can't create User" });
    }
    res.send({ message: 'User created with success' });
    console.log(body);
  });
});

/*
* 
* This create the chat bot and the course on the backend database.
*/

app.post('/newcourse', function (req, res) {
  var course = {
    name: req.body.name,
    description: req.body.description,
    lessons_number: req.body.lessons_number,
    createdBy: req.body.createdBy
  };
  insertIntoDatabase(course).then(function (result_database) {
    if (result_database.message) {
      res.status(500).send(result_database);
    } else {
      createChatBot(result_database.id, req.body.description).then(function (result_chatbot) {
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
app.post('/updatecourse', function (req, res) {});

function updateDocument(callback, document) {
  console.log("Updating document 'mydoc'");
  // make a change to the document, using the copy we kept from reading it back
  db.insert(doc, function (err, data) {
    console.log('Error:', err);
    console.log('Data:', data);
    // keep the revision of the update so we can delete it
    doc._rev = data.rev;
    callback(err, data);
  });
}

function insertIntoDatabase(document) {
  return new Promise(function (resolve, reject) {
    education.insert(document, function (err, body, header) {
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
  return new Promise(function (resolve, reject) {
    conversation.createWorkspace(workspace, function (err, response) {
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