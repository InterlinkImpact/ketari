require('dotenv').config();
const express = require('express');
//const fileupload = require('express-fileupload');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const cors = require('cors');


//delete after testing
const testRoute = require('./controllers/testController');
const router = require('./controllers/mainController');
const user = require('./controllers/userController');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
//app.use(fileupload());
app.use(express.static("public"));
app.use(cors());


const url = process.env.DB_URL;
mongoose.connect(url, {useNewUrlParser: true});


//use for testing the connection
app.use('/test', testRoute);
app.use('/api', router);
app.use('/user', user);



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}

app.listen(port, function() {
    console.log("Server started");
  });