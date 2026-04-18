const mongoose = require("mongoose");
const { timeStamp } = require("console");

const userSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    JobTitle: {
        type: String,

    },
    Gender: {
        type: String,
        required: true,
    }
},
{timestamps: true});
const User =  mongoose.model("user", userSchema);

module.exports = User;