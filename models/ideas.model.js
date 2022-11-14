const mongoose = require("mongoose");

const ideasSchema = mongoose.Schema({

    Username: {
        type: String,
        required: true
    },

    Title: {
        type: String,
        unique: true,
        required: true
    },

    Description: {
        type: String
    },

    Category: {
        type: String,
        required: true
    },

    Date: {
        type: String,
    }

});

const Ideas = new mongoose.model("Ideas", ideasSchema);
module.exports = Ideas;