const { json } = require("body-parser");
var express = require("express");
const router = express.Router();

var MongoClient = require('mongodb').MongoClient;
      var URL = "mongodb+srv://ecommerce:amirhamza@cluster0.p4fnz.mongodb.net/?retryWrites=true&w=majority";
      var config = { useUnifiedTopology: true };

      
      router.get("/products/category/get", function(req, res) {
          
        MongoClient.connect(URL, config, function(error, Client) {

          let db = Client.db("products");
          let collection = db.collection("category");
          
          collection.find().toArray(function(error, result) {
              console.log(result);
              res.json(result);
              console.log("Length: "+result.length);
              res.end();
          })

        })
       
       
      })

      module.exports = router;