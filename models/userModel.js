const mongoose = require('mongoose');

const userSchema = {
    email: String,
    password: String,
    name: String,
    username: String,
}

module.exports = mongoose.model("User", userSchema);