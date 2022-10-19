const mongoose = require('mongoose');

const userSchema = {
    email: String,
    password: String,
    name: String,
    username: String,
    token: String
}

module.exports = mongoose.model("User", userSchema);