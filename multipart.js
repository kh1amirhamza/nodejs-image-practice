
const { ifError } = require("assert");
var express = require("express");
var app = express();
var multer, storage, path, crypto;
multer = require('multer')
path = require('path');
crypto = require('crypto');

var form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/upload' enctype='multipart/form-data'>" +
"<input type='file' name='upload'/>" +
"<input type='submit' /></form>" +
"</body></html>";

app.get('/', function (req, res){
  res.writeHead(200, {'Content-Type': 'text/html' });
  res.end(form);

});

// Include the node file module
var fs = require('fs');

storage = multer.diskStorage({
    destination: './NEwuploads/',
    filename: function(req, file, cb) {
        return cb(null, "image_" + new Date().getTime() + (path.extname(file.originalname)));
    //   return crypto.pseudoRandomBytes(16, function(err, raw) {
    //     if (err) {
    //       return cb(err);
    //     }
    //     return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
    //   });
    }
  });

//    storage = multer.memoryStorage()

 var upload = multer({ storage: storage })


 


// Post files
app.post(
  "/upload",
  multer({
    storage: storage
  }).single('upload'), function(req, res) {
    console.log(req.file);
    console.log(req.body);
    res.redirect("/NEwuploads/" + req.file.filename);
    console.log(+req.file.filename);



    var MongoClient = require('mongodb').MongoClient;
    var URL = "mongodb+srv://ecommerce:amirhamza@cluster0.p4fnz.mongodb.net/?retryWrites=true&w=majority";
    var config = { useUnifiedTopology: true };


    MongoClient.connect(URL,config, function(error, Client){

      if (error) {
        console.log("Connection Failed.");
      }else{
        console.log("Connection Success."); 

        //Upload image from Here....
        let db = Client.db("Images");
        let collection = db.collection("image");

        collection.insertOne(req.file, function(error, result){

          if (error) {
            console.log("Image Upload to MongoDB has Failed.");
          }else{
            console.log("Image Upload to MongoDB has successful.");
            console.log(req.file);
          }
        })
      }
    })

    return res.status(200).end();
  });



app.get('/NEwuploads/:upload', function (req, res){
  file = req.params.upload;
  console.log(req.params.upload);
  var img = fs.readFileSync(__dirname + "/NEwuploads/" + file);
  res.writeHead(200, {'Content-Type': 'image/png' });
  res.end(img, 'binary');

});


const PORT = process.env.PORT || 3000
app.listen(PORT, function (err) {
    if (err){
        console.log(err)
    }else {
        console.log('Server is running on port: ' + PORT)
    }
});
