const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
// const Date = require("date");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const conn = mongoose.connect("mongodb://localhost:27017/theBegetterTownDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true
});


const Profile = require("./models/profile.model");

const ProfileStorage = multer.diskStorage({
    dest: function (req, file, cb) {
        cb(null, 'profilePictures/')
      },
    filename: (req, file, cb) => {
        cb(null, Date.now + file.originalname);
    }
});

const profilepic = multer({
    storage: ProfileStorage
});

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
    res.render("contactUs");
});

app.get("/myprofile", function(req, res){
    res.render("dashboard");
});
app.get("/mypost", function(req, res){
    res.render("mypost");
});

app.get("/add_post", function(req, res){
    res.render("add_post");
});


app.post("/signup", profilepic.single("profilepicture"), async (req, res) => {
        var TypeOfUser;
        if(req.body.creator == 1){
            TypeOfUser = "Creator";
        }
        else{
            TypeOfUser = "User";
        }

        const user = new Profile({
            Username: req.body.username,
            Name: req.body.firstname + " " + req.body.lastname,
            Email: req.body.email,
            Password: req.body.password,
            Country: req.body.country,
            PhoneNumber: req.body.phonenumber,
            FieldOfInterest: req.body.fieldofinterest,
            TypeOfUser: TypeOfUser,
            BusinessEmail: req.body.businessemail,
            Address: req.body.city + ", " + req.body.state + ", Zip Code: " + req.body.zip,
            Bio: req.body.bio,
            ProfileImg: {
                data: req.file,
                contentType: "image/png"
            }
        });

        user.save().then(() => res.send("Successfully Uploaded"));
    
    // catch(error){
    //     res.status(400).send("Error occured");
    // }
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });