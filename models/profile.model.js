const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({

    Username: {
        type: String,
        required: true,
        unique: true
    },

    Name: {
        type: String,
        required: true
    },

    Email: {
        type: String,
        required: true,
        unique: true
    },

    Password: {
        type: String,
        required: true
    },

    Country: {
        type: String
    },

    PhoneNumber: {
        type: String,
        unique: true
    },

    FieldOfInterest: {
        type: String
    },

    TypeOfUser: {
        type: String,
        required: true
    },

    BusinessEmail: {
        type: String
    },

    Address: {
        type: String
    },

    Bio:{
        type: String
    },

    ProfileImg: {
        type: String
    }

});

const Profile = new mongoose.model("Profile", profileSchema);
module.exports = Profile;