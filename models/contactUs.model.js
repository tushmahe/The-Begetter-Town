const mongoose = require("mongoose");

const contactusSchema = mongoose.Schema({

    Name: {
        type: String,
        required: true
    },

    Email: {
        type: String,
        required: true,
    },

    Message: {
        type: String,
        required: true
    }

});

const ContactUs = new mongoose.model("ContactUs", contactusSchema);
module.exports = ContactUs;