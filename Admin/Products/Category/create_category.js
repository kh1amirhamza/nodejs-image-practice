const { ifError } = require("assert");
var express = require("express");
var multer, storage, path, crypto;
multer = require('multer')
path = require('path');

const router = express.Router()

var MongoClient = require('mongodb').MongoClient;
      var URL = "mongodb+srv://ecommerce:amirhamza@cluster0.p4fnz.mongodb.net/?retryWrites=true&w=majority";
      var config = { useUnifiedTopology: true };

storage = multer.diskStorage({
    destination: './Images/',
    filename: function(req, file, cb) {
        return cb(null, "image_" + new Date().getTime() + (path.extname(file.originalname)));
    }
  });

  var upload = multer({ storage: storage })

router.get("/get", function(req, res){
  res.end("Success");
})

  router.post(
    "/products/category/create",
    multer({
      storage: storage
    }).single('upload'), function(req, res) {
      console.log(req.file);
      console.log(req.body);
 
      console.log("Category Name: "+req.body.category_name);
      console.log("product details is: "+req.body.product_details);
      //res.redirect("/uploads/" + req.file.filename);

      MongoClient.connect(URL,config, function(error, Client){
        if (error) {
          console.log("Connection Failed.");
        }else{
          console.log("Connection Success."); 
  
          //Upload image from Here...
          let db = Client.db("products");
          let collection = db.collection("category");

         //Getting Documents count for genarate Category ID then create category...
          collection.countDocuments({}).then((count) => {
            console.log(count);
          });   

            var imageReference = {
              _id : req.body.category_id,
              category_name : req.body.category_name,
              cat_image_url : "https://nodejs-image-practice.herokuapp.com/Images/"+req.file.filename,
              path : req.file.path,
            }

            //Create Category...
            collection.insertOne(imageReference, function(error, result){
              if (error) {
                console.log("Category Image Upload to MongoDB has Failed.");
              }else{
                console.log("Category Image Upload to MongoDB has successful.");
                console.log(req.file);
              }
            }) 


         

        }

      res.end();
      console.log(req.file);
      })
     });

     

    

     

module.exports = router;