require("dotenv").config();
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

const isAuthenticated = async function(req, res, next){
    try{

        const { token } = req.cookies;
        if(!token){
            return next("Please login first");
        }

        const verify = await jwt.verify(token, process.env.TOKEN_KEY);

        req.user = await User.findById(verify.id);

        next();

    }
    catch(err){
        return next(err);
    }
}

module.exports = isAuthenticated;