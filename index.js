const express = require('express');
const body_parser = require('body-parser');
const multer = require('multer');

const app = express();

var storage, path, crypto;
path = require('path');
crypto = require('crypto');
// Include the node file module
var fs = require('fs');

//Middleware...
//app.use(urlencoded({extended : true}));
app.use(express.json())

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

const { urlencoded } = require('body-parser');
const createCategoryRouter = require('./Admin/Products/Category/create_category');
const getCategoryRouter = require('./Admin/Products/Category/get_category');
const insertProduct = require('./Admin/Products/Details/insert_product');
const letestProductID = require('./InitialData/letest_product_id');
const getProduct = require('./Admin/Products/Details/get_product')




//const maltipart = require('./multipart');

//app.use("/post",maltipart);
app.use("/admin", createCategoryRouter);
app.use("/admin",getCategoryRouter);
app.use("/admin",insertProduct);
app.use("/init",letestProductID);
app.use("/admin", getProduct);




app.get('/getImages/:imageName', function (req, res){
    file = req.params.imageName;
    console.log(req.params.imageName);
    var img = fs.readFileSync(__dirname + "/Images/" + file);
    //var img = fs.readFileSync("F:\Nods js workshop\node-ecommerce_mongodb\Admin\Products\Details\Images\image_1606754835400.jpg");
    res.writeHead(200, {'Content-Type': 'image/png' });
    res.end(img, 'binary');
  
  });


  app.get("/Images/:imageName", (req, res) => {
    file = req.params.imageName;
  res.sendFile(path.join(__dirname, "./Images/"+file));
});

const PORT = process.env.PORT || 5000
app.listen(PORT, function (err) {
    if (err){
        console.log(err)
    }else {
        console.log('Server is running on port: ' + PORT)
    }
});



