const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({

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
    }

});

const Event = new mongoose.model("Event", eventSchema);
module.exports = Event;