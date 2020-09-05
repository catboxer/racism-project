//jshint esversion:6
// dotenv hides secret keys 
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/racistpediaDB", {useNewUrlParser: true, useUnifiedTopology: true });

// Set up New Collection of Users
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

//encryption key

//add encrypt plugin to schema to pass to model as parameter to add encryption power to model.
//this encrypts entire db unless you specify field to encrypt
userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

///View Pages

app.get("/", function(req,res){
  res.render("home")
});
app.get("/login", function(req,res){
  res.render("login")
});

app.get("/register", function(req,res){
  res.render("register")
})

app.get("/secrets", function(req,res){
  res.render("secrets")
})

// app.get("/submit", function(req,res){
//   res.render("submit")
// })
app.post("/register", function(req,res){
  const newUser = new User ({
    email:req.body.username,
    password:req.body.password
  })
  newUser.save(function(err){
    if(err) {
      console.log(err);
  } else {
    res.render("secrets");
    }
  });
});


app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, function(err, result){
    if(err) {
      console.log(err);
    } else {
      if (result) {
        if (result.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});