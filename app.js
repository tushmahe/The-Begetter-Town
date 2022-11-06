const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("index");
});

app.get("/login", function(req, res){
    res.render("login");
});;

app.get("/index", function(req, res){
    res.render("index");
});;

app.get("/aboutUs", function(req, res){
    res.render("aboutUs");
});;

app.get("/signup", function(req, res){
    res.render("signup");
});

app.get("/events", function(req, res){
    res.render("events");
});
app.get("/contactUs", function(req, res){
    res.render("contactUs.ejs");
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });