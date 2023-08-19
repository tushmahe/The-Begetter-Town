const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({

    Name: {
        type: String,
        required: true
    },

    Comment: {
        type: String,
        required: true
    },

    PostId: {
        type: String
    },

    Date: {
        type: Number,
    }
});

const Comment = new mongoose.model("Comment", commentSchema);
module.exports = Comment;