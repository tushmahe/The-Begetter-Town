const mongoose = require("mongoose");

const postSchema = mongoose.Schema({

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

    postPicture: {
        type: String,
    },

});

const Post = new mongoose.model("Post", postSchema);
module.exports = Post;