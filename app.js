const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser, checkAdmin } = require('./middleware/auth');
const nodemailer = require('nodemailer');
const formidable = require('formidable');
const fileUpload = require("express-fileupload");


const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'tushmaheshwari@outlook.com',
        pass: 'Tushmahe@123'
    }
});

const app = express();

const JWT_SECRET = "uilfyvas4563677^$%&yufvy^T&YUVH&^vjuvgutcuk^&UVf&^FuVUfo6^vlufO&^foVUvOUIBG78g7O06f7((^&%R&%$e64#W&^5";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

const conn = mongoose.connect("mongodb://localhost:27017/theBegetterTownDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true
});


const Profile = require("./models/profile.model");
const Post = require("./models/post.model");
const { profileEnd } = require("console");
const Event = require("./models/event.model");


app.get("*", checkUser);
app.post("*", checkUser);

app.get("/", async function (req, res) {
    const all = await Post.find({});

    console.log(all);
    res.render("index", allPosts = all);
});

app.get("/login", function (req, res) {
    res.render("login");
});;


app.get("/aboutUs", function (req, res) {
    res.render("aboutUs");
});;

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.get("/events", function (req, res) {
    res.render("events");
});
app.get("/ideas", function (req, res) {
    res.render("ideas");
});
app.get("/contactUs", function (req, res) {
    res.render("contactUs");
});

app.get("/post_details/:postTitle", async function (req, res) {
    const post = await Post.findOne({Title: req.params.postTitle});

    res.render("post_details", thispost = post);
});

app.get("/explore_by_category/:category", async function (req, res) {
    const cate = await Post.find({Category: req.params.category});
    res.render("categories", {postcategory: req.params.category, posts:cate});
});
app.get("/myprofile", requireAuth, function (req, res) {
    res.render("dashboard", otheruser = null);
});

app.get("/add_post", requireAuth, function (req, res) {
    res.render("add_post");
});


app.post("/signup", async (req, res) => {
    var TypeOfUser;
    if (req.body.creator == 1) {
        TypeOfUser = "Creator";
    }
    else {
        TypeOfUser = "User";
    }

    const password = await bcrypt.hash(req.body.password, 10);

    var filename;

    if (req.files && Object.keys(req.files).length !== 0) {

        // Uploaded path
        uploadedFile = req.files.uploadFile;
        filename = Date.now() + uploadedFile.name;

        // Logging uploading file
        // console.log(uploadedFile);

        // Upload path
        const uploadPath = __dirname
            + "/public/img/profilePic/" + filename;

        // To save the file using mv() function
        uploadedFile.mv(uploadPath);
    }
    else {
        res.send("No file uploaded !!");
    }



    try {

        const user = await Profile.create({
            Username: req.body.username,
            Name: req.body.firstname + " " + req.body.lastname,
            Email: req.body.email,
            Password: password,
            Country: req.body.country,
            PhoneNumber: req.body.phonenumber,
            FieldOfInterest: req.body.fieldofinterest,
            TypeOfUser: TypeOfUser,
            BusinessEmail: req.body.businessemail,
            Address: req.body.city + ", " + req.body.state + ", Zip Code: " + req.body.zip,
            Bio: req.body.bio,
            ProfileImg: filename
        });

        const token = jwt.sign(
            {
                id: user._id,
                username: user.Username
            },
            JWT_SECRET
        );

        return res.cookie({ "token": token }).redirect("/login");
    } catch (error) {
        if (error.code === 11000) {
            // const username = await Profile.findOne({ Username : req.body.username });
            // if(username!=null){
            //     app.get('/', function(req, res) {
            //         res.render('signup', { username: username});
            //     });
            // }
            // const email = await Profile.findOne({Email: req.body.email});
            // if(email){

            // }
            // const phoneno = await Profile.findOne({PhoneNumber: req.body.phonenumber});
            // if(phoneno){

            // }
            res.send("Please make sure your username, e-mail ID and phone number are unique");
            // res.redirect("signup");
        }
    }
});

app.post("/contactUs", async (req, res) => {

    try {

        const msg = await ContactUs.create({
            Name: req.body.firstname + " " + req.body.lastname,
            Email: req.body.email,
            Message: req.body.message
        });

        // user.save().then(() => res.send("Successfully Uploaded"));
    } catch (error) {
        res.status(400).send("Error occured");
    }

    res.redirect("/")
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await Profile.findOne({ Username: username });

    console.log(user);

    if (user) {

        if (bcrypt.compare(password, user.Password)) {

            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.Username
                },
                JWT_SECRET
            );

            res.cookie('jwt', token, { maxAge: 100000000000 });

            console.log("Logged in successfully");

            res.redirect("/");
        }
        else {
            res.send("Incorrect Password");
        }

        // res.send("incorrect password");
    }
    else {
        res.send("incorrect username");
    }
});


app.get("/mypost", requireAuth, async function (req, res) {
    const token = req.cookies.jwt;

    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            console.log(err);
            // res.redirect("/login");
        }
        else {
            let user = await Profile.findById(decodedToken.id);
            const all = await Post.find({ Username: user.Username });

            // console.log(all);

            res.render("mypost", allPosts = all);
        }
    })



});

app.get("/logout", (req, res) => {
    res.cookie('jwt', "", { maxAge: 1 });
    res.redirect('/');
});

app.post("/add_post", (req, res) => {

    console.log(req.body.title);

    const token = req.cookies.jwt;

    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            console.log(err);
            res.redirect("/login");
        }
        else {
            let user = await Profile.findById(decodedToken.id);
            var filename;

            if (req.files && Object.keys(req.files).length !== 0) {

                // Uploaded path
                uploadedFile = req.files.uploadFile;
                filename = Date.now() + uploadedFile.name;

                // Logging uploading file
                // console.log(uploadedFile);

                // Upload path
                const uploadPath = __dirname
                    + "/public/img/postPic/" + filename;

                // To save the file using mv() function
                uploadedFile.mv(uploadPath);
            }
            else {
                res.send("No file uploaded !!");
            }

            console.log(filename);
            const newPost = await Post.create({
                Username: user.Username,
                Title: req.body.title,
                Description: req.body.description,
                Category: user.FieldOfInterest,
                postPicture: filename
            });

        }
    });

    res.redirect("/");
});

app.post("/deletePost", async (req, res) => {
    // console.log(req.body.title);

    const thispost = await Post.findOne({ Title: req.body.title });

    console.log(thispost);

    Post.findOneAndRemove({ Title: req.body.title }, () => {
        res.redirect("/mypost");
    });
});

app.get("/profile/:username", async (req, res) =>{
    // console.log(req.params.username);
    var creator = await Profile.findOne({Username: req.params.username});
    res.render("dashboard", otheruser = creator);
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});