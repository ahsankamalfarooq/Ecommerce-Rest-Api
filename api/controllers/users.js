const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt')
const User = require('../routes/models/user');
const jwt = require('jsonwebtoken')



//////////////////////////////////////////////////////////


exports.user_signup = (req,res,next) => {
    User.find({email : req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message : "Email is already taken"
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error : err
                    });
                } else {
                    const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash
                    })
                    user.save()
                    .then(result => {
                        console.log(result)
                        res.status(201).json({
                            message : "User Created",
                            
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error : err
                        })
                    })
                }
            })   
        }
    })

}



//////////////////////////////////////////////////////////


exports.user_login = (req,res,next) => {
    User.find({email : req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message : "Auth Failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message : "Auth Failed"
                });
            } 
            if (result) {
               const token = jwt.sign({
                    email : user[0].email,
                    userId : user[0]._id
                },
                'secret',
                {
                    expiresIn: "1h"
                }
                )
                return res.status(200).json({
                    message : "Auth Successful",
                    token : token
                })
            }
            return res.status(401).json({
                message : "Auth Failed"
            });
        })
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}


/////////////////////////////////////////////////////////



exports.delete_user = (req, res, next) => {

    User.remove({_id : req.params.userId})
    .exec()
    .then(result => {
        
        res.status(200).json({
            message : "User_Deleted", 

                // request : {
                //     type : 'POST',
                //     url : 'http://localhost:3000/signup/',
                //     // body : { "Pass"}
                // }
             } )
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}