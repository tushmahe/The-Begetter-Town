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
const flash = require('connect-flash');
const session = require('express-session');
const qr = require('qrcode')


const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'tushmaheshwari@outlook.com',
        pass: 'Tushmahe@123'
    }
});

var flag = 1;
const app = express();

const JWT_SECRET = "uilfyvas4563677^$%&yufvy^T&YUVH&^vjuvgutcuk^&UVf&^FuVUfo6^vlufO&^foVUvOUIBG78g7O06f7((^&%R&%$e64#W&^5";

app.set('view engine', 'ejs');

app.use(session({
    secret: 'codeforgeek',
    saveUninitialized: false,
    resave: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(flash());

app.use(function (req, res, next) {
    res.locals.message = req.flash();
    next();
});

const conn = mongoose.connect("mongodb://localhost:27017/theBegetterTownDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true
});


const Profile = require("./models/profile.model");
const Post = require("./models/post.model");
const { profileEnd } = require("console");
const Event = require("./models/event.model");
const Ideas = require("./models/ideas.model");

var pastEvents = [];
var liveEvents = [];
var upcomingEvents = [];

async function getEvents() {
    pastEvents = [];
    liveEvents = [];
    upcomingEvents = [];
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10) {
        day = "0" + day.toString();
    }
    else {
        day = day.toString();
    }

    if (month < 10) {
        month = "0" + month.toString();
    }
    else {
        month = month.toString();
    }

    // console.log(day);

    year = year.toString();

    const allevents = await Event.find({});

    // var pastEvents = [];
    // var liveEvents = [];
    // var upcomingEvents = [];

    for (var i = 0; i < allevents.length; i++) {
        if (allevents[i].startDate.substr(0, 4) < year) {
            Event.findOneAndRemove({ Title: allevents[i].Title });
        }

        else if (allevents[i].startDate.substr(0, 4) == year) {
            // console.log(allevents[i].startDate.substr(5, 2))
            if (allevents[i].startDate.substr(5, 2) > month) {
                // console.log("this");
                upcomingEvents[upcomingEvents.length] = allevents[i];
            }
            else if (allevents[i].startDate.substr(5, 2) < month) {
                // console.log("this");
                pastEvents[pastEvents.length] = allevents[i];
            }
            else {
                if (allevents[i].startDate.substr(8, 2) <= day) {
                    // console.log(allevents[i].endDate.substr(8, 2));
                    if (allevents[i].endDate.substr(8, 2) >= day) {
                        liveEvents[liveEvents.length] = allevents[i];
                    }
                    else {
                        pastEvents[pastEvents.length] = allevents[i];
                    }
                }
                else {
                    upcomingEvents[upcomingEvents.length] = allevents[i];
                }
            }
        }
        else {
            upcomingEvents[upcomingEvents.length] = allevents[i];
        }
    }

    // const events = [pastEvents, liveEvents, upcomingEvents];
    // var events = [];
    // events[0] = pastEvents;
    // events[1] = liveEvents;
    // events[2] = upcomingEvents;

    // console.log(events);

    // return events;
    // console.log(upcomingEvents);
    return;
}

app.get("*", checkUser);
app.post("*", checkUser);

app.get("/", async function (req, res) {
    getEvents();

    const all = await Post.find({});

    res.render("index.ejs", { allPosts: all, upcoming: upcomingEvents });
});

app.get("/ideas", async function (req, res) {
    all = await Ideas.find({});
    res.render("ideas", allIdeas = all);
});

app.get("/filter_ideas/:filter", async function (req, res) {
    const all = await Ideas.find({ Category: req.params.filter });
    res.render("ideas", allIdeas = all);
})
app.get("/login", function (req, res) {
    // console.log(req.flash('errors'));
    res.render('login', errors = req.flash('errors'));
});


app.get("/aboutUs", function (req, res) {
    res.render("aboutUs");
});;

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.get("/events", async function (req, res) {

    await getEvents();
    // console.log(upcomingEvents);

    res.render("events", { past: pastEvents, live: liveEvents, upcoming: upcomingEvents });
});
app.get("/explore_by_category/:category", async function (req, res) {
    getEvents();
    // console.log(req.params.category);
    const cate = await Post.find({ Category: req.params.category });

    var upcomingByCategory = [];

    for(var i = 0; i < upcomingEvents.length; i++){
        if(upcomingEvents[i].Category == req.params.category){
            upcomingByCategory[upcomingByCategory.length] = upcomingEvents[i];
        }
    }
    // console.log(cate);
    res.render("categories", { posts: cate, postcategory: req.params.category, upcoming: upcomingByCategory});
});


app.get("/contactUs", function (req, res) {
    res.render("contactUs");
});

app.get("/post_details/:postTitle", async function (req, res) {
    const post = await Post.findOne({ Title: req.params.postTitle });

    res.render("post_details", thispost = post);
});


app.get("/myprofile/:username", requireAuth, async function (req, res) {
    console.log(req.params.username)
    const linkuser = await Profile.findOne({ Username: req.params.username });
    res.render("dashboard", otheruser = linkuser);
});


app.get("/contact_info/:username", async function (req, res) {
    console.log(req.params.username)
    const linkuser = await Profile.findOne({ Username: req.params.username });
    res.render("contact_info", otheruser = linkuser);
});


app.get("/add_post", requireAuth, async function (req, res) {

    res.render("add_post");
});

app.post("/filter_ideas", async (req, res) => {
    var filter = req.body.filter;
    console.log(filter);
    var url = "filter_ideas/" + filter;
    if (filter != null) {
        res.redirect(url);
    } else {
        res.redirect("/ideas");
    }
})
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
            CountryCode: req.body.countryCode,
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

        let qrfilename = __dirname + "/public/img/qrPic/" + req.body.username + ".png";
        let text = "http://localhost:3000/qr/" + req.body.username;
        await qr.toFile(qrfilename, text);

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

app.post("/addIdeas", async (req, res) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    const token = req.cookies.jwt;

    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            console.log(err);
            res.redirect("/ideas");
        }
        else {
            let user = await Profile.findById(decodedToken.id);

            const idea = await Ideas.create({
                Username: user.Username,
                Title: req.body.title,
                Description: req.body.description,
                Category: req.body.category,
                Date: today
            });
            res.redirect("/ideas");
        }
    });
})

app.post("/contactUs", async (req, res) => {

    try {
        var name = req.body.firstname + " " + req.body.lastname;
        var email = req.body.email;
        var msg = req.body.message;
        const options = {
            from: 'tushmaheshwari@outlook.com',
            to: 'tushmaheshwari28@gmail.com',
            subject: 'Message from The Begetter Town',
            text: `Name : ${name}
                   Email: ${email}
                   Message: ${msg}`
        };

        transporter.sendMail(options, function (err, info) {
            if (err) {
                console.log(err);
            }
            console.log("Sent : " + info.response);
        })
    } catch (error) {
        res.status(400).send("Error occured");
    }
    res.redirect("/");
})

app.post("/login", async (req, res) => {
    // console.log(req.flash('success'));
    const username = req.body.username;
    const password = req.body.password;
    const user = await Profile.findOne({ Username: username });

    // console.log(user);

    if (user) {

        const validPassword = await bcrypt.compare(password, user.Password);

        if (validPassword) {
            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.Username
                },
                JWT_SECRET
            );
            // console.log("logged in");
            res.cookie('jwt', token, { maxAge: 100000000000 });
            res.redirect("/");
        }
        else {
            res.send("incorrect password");
        }

    }
    else {
        req.flash('errors', `Please enter the correct username`);
        res.locals.message = req.flash();

        res.redirect("/login");
    }
});


app.get("/mypost/:username", requireAuth, async function (req, res) {
    const token = req.cookies.jwt;
    console.log(req.params.username)
    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            console.log(err);
            // res.redirect("/login");
        }
        else {
            let user = await Profile.findById(decodedToken.id);
            const all = await Post.find({ Username: req.params.username });

            // console.log(all);

            res.render("mypost", allPosts = all);
        }
    })



});

app.get("/logout", (req, res) => {
    res.cookie('jwt', "", { maxAge: 1 });
    res.redirect('/');
});

app.post("/add_post/:username", (req, res) => {

    // console.log(req.body.title);

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

    const thispost = await Post.findOne({ Title: req.body.title });

    console.log(thispost);

    Post.findOneAndRemove({ Title: req.body.title }, () => {
        res.redirect("/mypost");
    });
});

app.get("/profile/:username", async (req, res) => {
    console.log(req.params.username);
    var creator = await Profile.findOne({ Username: req.params.username });
    res.render("dashboard", otheruser = creator);
});

app.get("/add_event", async (req, res) => {
    res.render("add_event");
});

app.post("/add_event", async (req, res) => {
    var filename;

    if (req.files && Object.keys(req.files).length !== 0) {

        // Uploaded path
        uploadedFile = req.files.uploadFile;
        filename = Date.now() + uploadedFile.name;

        // Logging uploading file
        // console.log(uploadedFile);

        // Upload path
        const uploadPath = __dirname
            + "/public/img/eventPic/" + filename;

        // To save the file using mv() function
        uploadedFile.mv(uploadPath);
    }
    else {
        res.send("No file uploaded !!");
    }

    const newEvent = await Event.create({
        Title: req.body.title,
        Description: req.body.description,
        Category: req.body.category,
        eventPic: filename,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });


    res.redirect("/");
});

app.get("/qr/:username", async (req, res) => {
    const src = "/img/qrPic/" + req.params.username;
    res.render("myqr", {user: req.params.username});
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});