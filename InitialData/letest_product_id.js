const express = require('express');

const router = express.Router();


var MongoClient = require('mongodb').MongoClient;
      var URL = "mongodb+srv://ecommerce:amirhamza@cluster0.p4fnz.mongodb.net/?retryWrites=true&w=majority";
      var config = { useUnifiedTopology: true };

      router.post("/setLetestProductID", function(req, res){

        MongoClient.connect(URL, config, function(error, Client){

            let db = Client.db("InitialData");
            let collection = db.collection("letestID");

            var letestProductId = {
                letestID: "PD_1",
                hostName: "Product"
             }

             collection.insertOne(letestProductId, function(error, result){
                 if(error){
                     console.log("Letest Product Id set failed");
                 }else{
                    console.log("Letest Product Id set Successful: "+result);
                 }
             })
        })
res.end("Success");
          
      })


      router.get("/updateLetestProductID", function(req, res){
        MongoClient.connect(URL, config, function(error, Client){

            let db = Client.db("InitialData");
            let collection = db.collection("letestID");

            // Finding letest Product ID..
            var find_query = { hostName: "Product" };
             collection.find(find_query).toArray(function(error, result){
                 if(error)  throw error;

                 console.log(result);
                 res.json(JSON.stringify(result));
                 
                 // Updating Letest Product ID
                 var update_query = { hostName: "Product" };
                 var new_values = { $set: {letestID: result.letestID+1, hostName: "Product"} };
                 collection.updateOne(update_query,new_values, function(error, result){
                     if(error){
                         console.log("Letest Product Id update failed");
                     }else{
                        console.log("Letest Product Id update Successful: "+result);
                     }
                 })

                 res.end();
             })
        })



        
      })



      router.get("/findLetestProductID", function(req, res){

      MongoClient.connect(URL, config, function(error, Client){

            let db = Client.db("InitialData");
            let collection = db.collection("letestID");

        
            var find_query = { hostName: "Product" };

            collection.find(find_query).toArray(function(error, result){
                if(error)  throw error;
                console.log(result);
                res.json(result);
                res.end();
                
            })
        })
     });

module.exports = router;

