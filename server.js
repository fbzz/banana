var bodyParser = require("body-parser");
var express = require("express"),
  app = express(),
  formidable = require("formidable"),
  http = require("http"),
  util = require("util"),
  fs = require("fs");
var port = 8080;
var dropboxV2Api = require("dropbox-v2-api");

const dropbox = dropboxV2Api.authenticate({
  token: "YkuLF1mTUlAAAAAAAAAAE21f3XO2pom3-ACmG2yhHg4GDERPTwlML5OQcao5UM5U"
});

// use session ref to call API, i.e.:

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(express.static(__dirname + "/public"));

app.get("/sayHello", function(req, res) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});

app.post("/upload", function(req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    if (err) {
      console.error(err.message);
      return;
    }

    res.writeHead(200, { "content-type": "text/plain" });
    res.write("received upload:\n\n");
    saveToDropBox(files.upload.path, fields.number);

    res.end(util.inspect({ fields: fields, files: files }));
  });
});

function saveToDropBox(path, identifier) {
  if (identifier === null || identifier === undefined) {
    identifier = Date.now();
  }
  dropbox(
    {
      resource: "files/upload",
      parameters: {
        path: "/dropbox/file-" + identifier + ".jpg"
      },
      readStream: fs.createReadStream(path)
    },
    (err, result) => {
      console.log(result + "OU" + err);
    }
  );
}

app.listen(port);
console.log("Listening on port ", port);
