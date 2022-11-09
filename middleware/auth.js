// const userModel = require('./models/profile.model');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "uilfyvas4563677^$%&yufvy^T&YUVH&^vjuvgutcuk^&UVf&^FuVUfo6^vlufO&^foVUvOUIBG78g7O06f7((^&%R&%$e64#W&^5";
const Profile = require("../models/profile.model.js");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    console.log(token);

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect("/login");
            }
            else {
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.locals.user = null;
                res.redirect("/login");
            }
            else {
                let user = await Profile.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser};