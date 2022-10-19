require("dotenv").config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const rounds = 10;
const User = require('../models/userModel');
const isAuthenticated = require('../middleware/auth');
const { json } = require("body-parser");
const userUrl = express.Router();


//utk login
userUrl.route("/signin")
.get(function(req, res){

    const r = req.body;
    var uPassword = r.password;
    var uDetail = r.email;

    // console.log(r);
    // console.log(uPassword);
    // console.log(uDetail);

    User.findOne(
        {email: uDetail},
        function(err, data){
            if(!err){
                try{
                    bcrypt.compare(uPassword, data.password).then(function(result){
                        if(result == true){
                            //res.send(data.email);
                            //console.log(data.password);
                            const token = jwt.sign(
                                {user_id: data._id, uDetail},
                                process.env.TOKEN_KEY,
                                {
                                    expiresIn: "24h",
                                }
                            );
    
                            var mergeData = {data, token};
    
                            // res.send(mergeData);
                            res.cookie({"token": token}).json({data: mergeData});
                            
                        }
                        else{
                            res.send("Wrong password");
                        }
                    });
                }
                catch(err){
                    console.log(err);
                }
            }
            
            else{
                res.send(err);
            }
        }
    );

})
.post(function(req, res){
    const r = req.body;
    var uPassword = r.password;
    var uDetail = r.email;

    // console.log(r);
    // console.log(uPassword);
    // console.log(uDetail);

    User.findOne(
        {email: uDetail},
        function(err, data){
            if(!err){
                try{
                    // console.log(data);
                    bcrypt.compare(uPassword, data.password).then(function(result){
                        if(result == true){
                            //res.send(data.email);
                            // console.log(data.password);
                            const token = jwt.sign(
                                {user_id: data._id, uDetail},
                                process.env.TOKEN_KEY,
                                {
                                    expiresIn: "24h",
                                }
                            );
    
                            var mergeData = {data, token};
    
                            //res.send(mergeData);
                            res.cookie({"token": token}).json({data: mergeData});
                            
                        }
                        else{
                            res.send("Wrong password");
                        }
                    });
                }
                catch(err){
                    console.log(err);
                }
            }
            
            else{
                res.send(err);
            }
        }
    );
})


//utk sign in
userUrl.route("/signup")
.post(async function(req, res){

    const r = req.body;
    var uPassword = r.password;
    var uEmail = r.email;

    try{
        //check if already exist
        const userExist = await User.findOne({ email: uEmail });

        if(userExist){
            return res.json({ msg: 'Already exist' });
        }

        bcrypt.genSalt(rounds, function(err, salt){
            if(err){
                res.send(err);
            }
            else{
                bcrypt.hash(uPassword, salt, function(err, hash){
                    if(err){
                        res.send(err);
                    }
                    else{
                        const newUser = User({
                            email: uEmail,
                            password: hash,
                            name: r.name,
                            username: r.username,
                        });
    
                        newUser.save(function(err, data){
                            if(!err){
                                //res.send("New User Added " + data._id);
    
                                //token
                                const token = jwt.sign(
                                    {user_id: data._id, uEmail},
                                    process.env.TOKEN_KEY,
                                    {
                                        expiresIn: "24h",
                                    }
                                );
                                
                                var mergeData = {data, token};
    
                                //res.send(mergeData);

                                res.cookie({"token": token}).json({data: mergeData});
    
                            }
                            else{
                                res.send(err);
                            }
                        });
    
                        //res.send(json(saveUser));
                    }
                });
            }
        });

    }
    catch(err){
        res.json({error : err });
    }

});


//creating user route to fetch user data
userUrl.route("/user")
.get(isAuthenticated, async function(req, res){
    try{
        const user = await User.find();

        if(!user){
            res.json({msj: "No user"});
        }

        res.json({user: user});
        
    }
    catch(err){
        res.json({error: err});
    }
});


//utk generate TOKEN
userUrl.route("/generate_token/:id/:email")
.get(function(req, res){
    const r = req.params;
    var id = r.id;
    var email = r.email;

    const token = jwt.sign(
        {user_id: id, email},
        process.env.TOKEN_KEY,
        {
            expiresIn: "24h",
        }
    );

    var sendToken = {token};

    res.send(sendToken);
});


//utk profile
userUrl.route("/profile")
.get(function(req, res){

})

.put(function(req, res){

})

.patch(function(req, res){

});



module.exports = userUrl;