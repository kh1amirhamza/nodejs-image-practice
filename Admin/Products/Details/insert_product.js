const { ifError } = require("assert");

const { json } = require("body-parser");
var express = require("express");
const multer = require("multer");
const router = express.Router();

var storage, path;
path = require('path');

// Include the node file module
var fs = require('fs');


var MongoClient = require('mongodb').MongoClient;
var URL = "mongodb+srv://ecommerce:amirhamza@cluster0.p4fnz.mongodb.net/?retryWrites=true&w=majority";
var config = { useUnifiedTopology: true };

storage = multer.diskStorage({
    destination: './Images/',
    filename: function (req, file, cb) {
        return cb(null, "image_" + new Date().getTime() + (path.extname(file.originalname)));
    }
});

var upload = multer({ storage: storage })

// uploading image to server hadrdisk then reference will insert to MongoDb...
router.post("/products/postGenerateImageRef",
    multer({
        storage: storage
    }).single('upload'),
    function (req, res) {
        console.log(__dirname + "/Images/" + req.file.filename);
        var ref = { filename: req.file.filename }
        res.json(ref);
        //res.redirect("/Images/" + req.file.filename);
        //return res.status(200).end();
    }
);

router.post("/products/insertProduct", function (req, res) {
    //Uploaded reference is: //req.file.finename
    // now inset product's data with image ref to MongoDB...

    let productDetails = req.body;
    console.log("ID OLD: " + productDetails.id);
    //productDetails.id = "PD1001";
    console.log("ID NEW: " + productDetails.id);
    console.log("PRoduct Details : " + JSON.stringify(productDetails));


    //res.redirect("")





    MongoClient.connect(URL, config, function (error, Client) {

        if (error) {
            console.log(error);

        } else {
            let db_product = Client.db("products");

            //uploading products meta_data....
            let collec_meta_data = db_product.collection("meta_data");

            //Getting Documents count(unused)...
            collec_meta_data.countDocuments({}).then((count) => {
                console.log(count);
            });

            let productId = "P" + Date.now();

            // set id for every part of product data...

            let product_meta_data = {
                _id: productId,
                meta_data: productDetails.meta_data
            }
            let product_image_urls = {
                _id: productId,
                image_urls: productDetails.image_urls
            }
            let product_reviews = {
                _id: productId,
                reviews: productDetails.reviews
            }


            //inserting every part from here...
            collec_meta_data.insertOne(product_meta_data, function (error, result) {
                if (error) {
                    console.log("uploading products meta_data to MongoDB has Failed: error: " + error);
                    res.json({ message: "Meta-data upload Failed" })
                    res.end();

                } else {
                    console.log("uploading products meta_data to MongoDB has successful.");
                    console.log(result);

                    //uploading products image_urls....
                    let collec_image_urls = db_product.collection("image_urls");
                    collec_image_urls.insertOne(product_image_urls, function (error, result) {
                        if (error) {
                            console.log("uploading products image_urls to MongoDB has Failed: error: " + error);
                            res.json({ message: "Image Urls upload Failed" })
                            res.end();

                        } else {
                            console.log("uploading products image_urls to MongoDB has successful.");
                            console.log(result);

                            //uploading products reviews....
                            let collec_reviews = db_product.collection("reviews");
                            collec_reviews.insertOne(product_reviews, function (error, result) {
                                if (error) {
                                    console.log("uploading products reviews to MongoDB has Failed: error: " + error);
                                    res.json({ message: "Failed" })
                                    res.end();
                                } else {
                                    console.log("uploading products reviews to MongoDB has successful.");
                                    console.log(result);
                                    res.json({ message: "Product successfuly inserted." });
                                    res.end();

                                }
                            })
                        }
                    })
                }
            })
        }
    })
});


module.exports = router;