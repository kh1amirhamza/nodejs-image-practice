const express = require('express');
const router = express.Router();
var url = require('url');

var MongoClient = require('mongodb').MongoClient;
var URL = "mongodb+srv://ecommerce:amirhamza@cluster0.p4fnz.mongodb.net/?retryWrites=true&w=majority";
var config = { useUnifiedTopology: true };

router.get("/products/getallProducts", function (req, res) {
    MongoClient.connect(URL, config, function (error, Client) {
        if (error) {
            console.log(error);
        } else {
            let db_product = Client.db("products");
            let collec_product = db_product.collection("meta_data");
            var query = {};
            collec_product.find(query).toArray(function (error, result) {
                res.json(result);
                res.end();
            })
        }
    })
})

router.get("/products/getsingleProductDetails/:productId", function (req, res) {
    MongoClient.connect(URL, config, function (error, Client) {
        if (error) {
            console.log(error);
            res.end();
        } else {

            let db_product = Client.db("products");
            let collec_metadata = db_product.collection("meta_data");

            var product_url = "http://something.com/admin" + req.url;
            var first_index = "http://something.com/admin/products/getsingleProductDetails/".length;
            var last_index = product_url.length;

            var productId = product_url.substring(first_index, last_index);
            console.log(productId);


            var query = { _id: productId };
            collec_metadata.findOne(query, function (error, result_meta_data) {

                if (error) {
                    console.log("Product meta-data can not Get.");
                    res.end();
                } else {

                    let meta_data = result_meta_data.meta_data;


                    let collec_image_urls = db_product.collection("image_urls");
                    collec_image_urls.findOne(query, function (error, result_image_urls) {
                        if (error) {
                            console.log("Product image urls can not Get.");
                            res.end();
                        } else {

                            let image_urls = result_image_urls.image_urls;


                            let collec_reviews = db_product.collection("reviews");
                            collec_reviews.findOne(query, function (error, result_reviews) {
                                if (error) {
                                    console.log("Product reviews can not Get.");
                                    res.end();
                                } else {

                                    let reviews = result_reviews.reviews;

                                    let productDetails = {
                                        _id: productId,
                                        meta_data: meta_data,
                                        image_urls: image_urls,
                                        reviews: reviews
                                    }
                                    console.log("Product get successfuly.");
                                    res.json(productDetails);
                                    res.end();

                                }

                            })
                        }

                    })
                }
                //res.json(result);
                //res.end();
            });

        }
    })
})

module.exports = router;